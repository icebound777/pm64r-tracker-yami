import { defineStore } from 'pinia';
import { computed, reactive, watch } from 'vue';
import YAML from 'yaml';
import { Client, ITEMS_HANDLING_FLAGS, SERVER_PACKET_TYPE, CLIENT_PACKET_TYPE, COMMON_TAGS } from 'archipelago.js';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import { useSaveStore } from './save';
import { useTrackerStore } from './tracker';
import { useLogicStore } from './logic';

export const useArchipelagoStore = defineStore('archipelago', () => {
	const save = useSaveStore();
	const tracker = useTrackerStore();
	const logic = useLogicStore();

	let debug = true;

	const state = reactive({
		connected: false,
		seed: '',
		checkedLocations: [],
		hintPoints: 0,
		hintCost: 0,
		hintReward: 0,
		slot: null,
		slotInfos: [],
		slotData: [],
		team: null,
		players: [],
		itemReceived: [],
		hints: []
	});

	const connectionInfos = reactive({
		protocol: 'wss',
		hostname: 'archipelago.gg', // Replace with the actual AP server hostname.
		port: 38281, // Replace with the actual AP server port.
		game: 'Paper Mario', // Replace with the game name for this player.
		name: '', // Replace with the player slot name.
		items_handling: ITEMS_HANDLING_FLAGS.REMOTE_ALL,
		tags: [COMMON_TAGS.TRACKER],
		version: {
			major: 0,
			minor: 4,
			build: 5
		},
		password: '',
		yaml: null
	});

	const setYaml = (htmlEvent) => {
		const file = htmlEvent.target.files;
		if (file && file.length > 0) {
			const reader = new FileReader();
			reader.readAsText(file[0], 'UTF-8');
			reader.onload = (readerEvent) => {
				connectionInfos.yaml = YAML.parse(readerEvent.target.result);
				// console.log(connectionInfos.yaml);
			};
			reader.onerror = (readerEvent) => {
				console.error('Error reading file');
			};
		}
	};

	const client = new Client();

	const connect = () => {
		//Load configs
		loadConfigs();
		toast.success('Attempting to connect...', { duration: 5000 });

		// Set up event listeners
		client.addListener(SERVER_PACKET_TYPE.CONNECTED, (packet) => {
			toast.success('Connected successfully!', { duration: 5000 });

			state.connected = true;
			state.checkedLocations = packet.checked_locations;
			state.hintPoints = packet.hint_points;
			state.slot = packet.slot;
			state.slotInfos = packet.slot_infos;
			state.slotData = packet.slot_data;
			state.team = packet.team;
			state.players = packet.players;
			save.data.configs.randomizer.star_hunt_enabled = packet.slot_data.power_star_hunt ? true : false;
			save.data.configs.randomizer.star_hunt_star_count = packet.slot_data.power_star_hunt;

			// Reset all items without checks because if players checked some locations manually, they would be reseted
			save.resetSave(true, true, false);

			sync();
		});

		client.addListener(SERVER_PACKET_TYPE.ROOM_INFO, (packet) => {
			state.seed = packet.seed_name;
			save.randomizer_seed = packet.seed_name;
			state.hintCost = packet.hint_cost;
			state.hintReward = packet.location_check_points;
		});

		client.addListener(SERVER_PACKET_TYPE.ROOM_UPDATE, (packet) => {
			state.hintPoints = packet.hint_points;

			if (packet.checked_locations) {
				packet.checked_locations.forEach((locationAP) => {
					state.checkedLocations.push(locationAP);
				});
			}
		});

		client.addListener(SERVER_PACKET_TYPE.RECEIVED_ITEMS, (packet) => {
			console.log('Received items:', packet);

			if (debug) {
				packet.items.forEach((item) => {
					if (item.item != 8112000348 && Object.values(items_to_ids).indexOf(item.item) <= -1) {
						console.log('Item not found:', item);
					}
				});

				console.log('--------------------');
			}
			state.itemReceived = packet.items;
		});

		client.addListener(SERVER_PACKET_TYPE.RETRIEVED, (packet) => {
			// console.log('Retrieved:', packet);
			state.hints = packet.keys[`_read_hints_${state.team}_${state.slot}`] ? packet.keys[`_read_hints_${state.team}_${state.slot}`] : [];
		});

		// Uncomment to get all server messages
		client.addListener(SERVER_PACKET_TYPE.PRINT_JSON, (packet) => {
			// console.log(packet);
			if (packet.type == 'Hint') {
				client.send({ cmd: CLIENT_PACKET_TYPE.GET, keys: [`_read_hints_${state.team}_${state.slot}`] });
			}
		});

		client.addListener('close', (event) => {
			console.log(event);
		});

		// Uncomment to get all locations and items by id on Connect
		client.addListener(SERVER_PACKET_TYPE.DATA_PACKAGE, (packet) => {
			console.log(packet);
		});

		if (connectionInfos.hostname == 'localhost' || connectionInfos.hostname == '127.0.0.1') {
			connectionInfos.protocol = 'ws';
		}

		client
			.connect(connectionInfos)
			.then(() => {})
			.catch((error) => {
				console.error('Failed to connect:', error);

				let reason = 'Unknown error. See AP server for more details.';
				// See https://www.rfc-editor.org/rfc/rfc6455#section-7.4.1
				switch (error[0].code) {
					case 1000:
						reason = 'Normal closure, meaning that the purpose for which the connection was established has been fulfilled.';
						break;

					case 1001:
						reason = 'An endpoint is "going away", such as a server going down or a browser having navigated away from a page.';
						break;

					case 1002:
						reason = 'An endpoint is terminating the connection due to a protocol error';
						break;

					case 1003:
						reason =
							'An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).';
						break;

					case 1004:
						reason = 'Reserved. The specific meaning might be defined in the future.';
						break;

					case 1005:
						reason = 'No status code was actually present.';
						break;

					case 1006:
						reason = 'AP server could not be reached or the connection was closed abnormally, e.g., without sending or receiving a Close control frame.';
						break;

					case 1007:
						reason =
							'An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [https://www.rfc-editor.org/rfc/rfc3629] data within a text message).';
						break;

					case 1008:
						reason =
							'An endpoint is terminating the connection because it has received a message that "violates its policy". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.';
						break;

					case 1009:
						reason = 'An endpoint is terminating the connection because it has received a message that is too big for it to process.';
						break;

					case 1010:
						// Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
						reason =
							"An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " +
							error.event.reason;
						break;

					case 1011:
						reason = 'A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.';
						break;

					case 1015:
						reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
						break;
				}

				toast.error('Failed to connect to AP server. | ' + reason, { duration: 15000 });
			});

		window.addEventListener('beforeunload', () => {
			client.disconnect();
			state.connected = false;
			console.info('Disconnected from AP server.');
		});
	};

	const disconnect = () => {
		client.disconnect();
		state.connected = false;
		console.info('Disconnected from AP server');
		toast.success('Disconnected from AP server.', { duration: 5000 });
	};

	const sync = () => {
		client.send({ cmd: CLIENT_PACKET_TYPE.SYNC });
		client.send({ cmd: CLIENT_PACKET_TYPE.GET, keys: [`_read_hints_${state.team}_${state.slot}`] });
		toast.success('Synced.', { duration: 5000 });
	};

	// Sorry for this garbo function, I've tried to make it better but did not have the time... At least it works lol
	const searchAPIdAndCheck = (type, obj, query, _previousKey1, _previousKey2, _previousKey3, _previousKey4, _previousKey5) => {
		let previousKey1 = _previousKey1;
		let previousKey2 = _previousKey2;
		let previousKey3 = _previousKey3;
		let previousKey4 = _previousKey4;
		let previousKey5 = _previousKey5;

		for (var key in obj) {
			var value = obj[key];

			if (key == 'ap') {
				if (value.includes(query)) {
					let occurences = 0;
					for (let i = 0; i < value.length; i++) {
						if (value[i] == query) {
							occurences++;
						}
					}
					// console.log('Found:', query, 'in', previousKey1, previousKey2, previousKey3, previousKey4, previousKey5, 'x', occurences);

					switch (type) {
						case 'item':
							for (let i = 0; i < occurences; i++) {
								if (save.data.items[previousKey1] !== undefined) {
									switch (typeof save.data.items[previousKey1]) {
										case 'boolean':
											save.data.items[previousKey1] = true;
											break;
										case 'number':
											save.data.items[previousKey1]++;
											break;
										default:
											save.data.items[previousKey1] = true;
											break;
									}
								}
								if (save.data.items['letters'][previousKey1] !== undefined) {
									switch (typeof save.data.items['letters'][previousKey1]) {
										case 'boolean':
											save.data.items['letters'][previousKey1] = true;
											break;
										case 'number':
											save.data.items['letters'][previousKey1]++;
											break;
										default:
											save.data.items['letters'][previousKey1] = true;
											break;
									}
								}
								if (save.data.items['koopa_koot_favors'][previousKey1] !== undefined) {
									switch (typeof save.data.items['koopa_koot_favors'][previousKey1]) {
										case 'boolean':
											save.data.items['koopa_koot_favors'][previousKey1] = true;
											break;
										case 'number':
											save.data.items['koopa_koot_favors'][previousKey1]++;
											break;
										default:
											save.data.items['koopa_koot_favors'][previousKey1] = true;
											break;
									}
								}
								if (save.data.items['trading_event_toad'][previousKey1] !== undefined) {
									switch (typeof save.data.items['trading_event_toad'][previousKey1]) {
										case 'boolean':
											save.data.items['trading_event_toad'][previousKey1] = true;
											break;
										case 'number':
											save.data.items['trading_event_toad'][previousKey1]++;
											break;
										default:
											save.data.items['trading_event_toad'][previousKey1] = true;
											break;
									}
								}
							}
							break;

						case 'location':
							if (save.data.checks[previousKey5] === undefined) save.data.checks[previousKey5] = {};
							if (save.data.checks[previousKey5][previousKey3] === undefined) save.data.checks[previousKey5][previousKey3] = [];
							if (!save.data.checks[previousKey5][previousKey3].includes(parseInt(previousKey1))) {
								save.data.checks[previousKey5][previousKey3].push(parseInt(previousKey1));
							}
							break;
					}
				}
			}

			if (key == 'ap_rank') {
				switch (type) {
					case 'item':
						if (value.includes(query)) {
							if (save.data.items[previousKey1] !== undefined) {
								switch (typeof save.data.items[previousKey1]) {
									case 'number':
										save.data.items[previousKey1 + '_rank']++;
										break;
								}
							}
						}
						break;
				}
			}
			switch (typeof value) {
				case 'object':
					searchAPIdAndCheck(type, value, query, key, previousKey1, previousKey2, previousKey3, previousKey4);
					break;
			}
		}
	};

	const refreshItemsReceived = (itemReceived) => {
		save.resetSave(true, true, false);

		itemReceived.forEach((itemAP) => {
			searchAPIdAndCheck('item', tracker.items, itemAP.item);
		});
	};

	watch(
		() => state.itemReceived,
		(newValue, oldValue) => {
			refreshItemsReceived(newValue);
		},
		{ deep: true }
	);

	const refreshLocationsChecked = (checkedLocations) => {
		checkedLocations.forEach((locationAPId) => {
			searchAPIdAndCheck('location', logic.checks, locationAPId);
		});
	};

	watch(
		() => state.checkedLocations,
		(newValue, oldValue) => {
			refreshLocationsChecked(newValue);
		},
		{ deep: true }
	);

	const checkedLocationsCount = computed(() => {
		return state.checkedLocations.length;
	});

	const loadConfigs = () => {
		if (connectionInfos.yaml && connectionInfos.yaml['Paper Mario']) {
			let yaml = connectionInfos.yaml['Paper Mario'];
			//Randomizer settings
			switch (yaml.starting_map) {
				case 'Toad_Town':
					save.data.configs.randomizer.starting_location = tracker.startingLocations.toad_town;
					break;

				// TODO: Add the rest when it wil be implemented
			}

			save.data.configs.randomizer.prologue_open = yaml.open_prologue;
			save.data.configs.randomizer.mt_rugged_open = yaml.open_mt_rugged;
			save.data.configs.randomizer.forever_forest_open = yaml.open_forest;
			save.data.configs.randomizer.toybox_open = yaml.open_toybox;
			save.data.configs.randomizer.whale_open = yaml.open_whale;
			save.data.configs.randomizer.blue_house_open = yaml.open_blue_house;
			save.data.configs.randomizer.chapter_7_bridge_open = yaml.ch7_bridge_visible;

			switch (yaml.gear_shuffle_mode) {
				case 'vanilla':
					save.data.configs.randomizer.gear_shuffle = 'vanilla';
					break;

				case 'gear_location_shuffle':
					save.data.configs.randomizer.gear_shuffle = 'vgs';
					break;

				case 'full_shuffle':
					save.data.configs.randomizer.gear_shuffle = 'full_shuffle';
					break;
			}

			save.data.configs.randomizer.shuffle_dungeon_entrances = yaml.shuffle_dungeon_entrances;
			save.data.configs.randomizer.magical_seed_required = yaml.magical_seeds;
			save.data.configs.randomizer.star_hunt_enabled = yaml.power_star_hunt;
			save.data.configs.randomizer.star_hunt_star_count = yaml.total_power_stars;

			//Logic settings
			if (yaml.bowser_castle_mode != 'vanilla') {
				save.data.configs.logic.fast_bowser_castle = true;
			} else {
				save.data.configs.logic.fast_bowser_castle = false;
			}
			save.data.configs.logic.shop_sanity = yaml.include_shops;
			save.data.configs.logic.rowf_shop = yaml.rowf_items;
			save.data.configs.logic.merlow = yaml.merlow_items;
			switch (yaml.merlow_rewards_pricing) {
				case 'vanilla':
					save.data.configs.logic.merlow_rewards_pricing = 'normal';
					break;

				case 'cheap':
					save.data.configs.logic.merlow_rewards_pricing = 'cheap';
					break;
			}
			save.data.configs.logic.rip_cheato = yaml.cheato_items;
			save.data.configs.logic.panels = yaml.shuffle_hidden_panels;
			save.data.configs.logic.overworld_coins = yaml.overworld_coins;
			save.data.configs.logic.coin_blocks = yaml.coin_blocks;
			save.data.configs.logic.super_and_multicoin_blocks_randomized = yaml.super_multi_blocks;
			save.data.configs.logic.foliage_coins = yaml.foliage_coins;
			save.data.configs.logic.partners_always_usable = yaml.partners_always_usable;
			if (yaml.letter_rewards == 'final_letter_chain_reward' || yaml.letter_rewards == 'full_shuffle') {
				save.data.configs.logic.letters_randomized = true;
			}
			if (yaml.koot_favors == 'full_shuffle') {
				save.data.configs.logic.koopa_koot = true;
			}
			save.data.configs.logic.koopa_koot_coins = yaml.koot_coins;
			save.data.configs.logic.dojo_randomized = yaml.dojo;
			save.data.configs.logic.trading_event_randomized = yaml.trading_events;
			save.data.configs.logic.limit_chapter_logic = yaml.limit_chapter_logic;
			save.data.configs.logic.cook_without_frying_pan = yaml.cook_without_frying_pan;
		}
	};

	const searchForAPInObjectAndReturnValue = (objType, query) => {
		let obj = {};
		switch (objType) {
			case 'item':
				obj = tracker.items;
				break;

			case 'location':
				obj = logic.checks;
				break;
		}

		let finalString = [];
		let lastString = [];
		let stringHierarachy = recHierarchy(obj, Object.keys(obj))[0];

		finalString.map((elem) => {
			if (elem.constructor === Array) {
				elem.forEach((subelem) => {
					lastString.push(subelem);
				});
			}
		});

		// console.log('Last String:', lastString);

		let stringIncludingAP = [];
		let realStringIncludingAP = [];
		let realKeys = [];
		switch (objType) {
			case 'item':
				lastString.forEach((elem) => {
					if (elem.match(/\.ap/g)) {
						stringIncludingAP.push(elem);
					}
				});

				// console.log('String including AP:', stringIncludingAP);

				stringIncludingAP.forEach((APElem) => {
					let splitAP = APElem.split(',');
					realStringIncludingAP.push(splitAP[splitAP.length - 1]);
				});

				realStringIncludingAP.forEach((APElem) => {
					let splitAP = APElem.split('.');

					// console.log(splitAP[0], splitAP[1], splitAP[2]);

					if (
						splitAP[0] == 'stars' ||
						splitAP[0] == 'partners' ||
						splitAP[0] == 'equipments' ||
						splitAP[0] == 'misc' ||
						splitAP[0] == 'koopa_koot_favors' ||
						splitAP[0] == 'trading_event_toad'
					) {
						if (
							tracker.items[splitAP[0]][splitAP[1]][splitAP[2]] &&
							Array.isArray(tracker.items[splitAP[0]][splitAP[1]][splitAP[2]]) &&
							tracker.items[splitAP[0]][splitAP[1]][splitAP[2]].includes(query)
						) {
							realKeys.push(splitAP[0]);
							realKeys.push(splitAP[1]);
							realKeys.push(splitAP[2]);
						}
					} else {
						if (
							tracker.items.items[splitAP[0]] &&
							tracker.items.items[splitAP[0]][splitAP[1]] &&
							tracker.items.items[splitAP[0]][splitAP[1]][splitAP[2]] &&
							Array.isArray(tracker.items.items[splitAP[0]][splitAP[1]][splitAP[2]]) &&
							tracker.items.items[splitAP[0]][splitAP[1]][splitAP[2]].includes(query)
						) {
							realKeys.push('items');
							realKeys.push(splitAP[0]);
							realKeys.push(splitAP[1]);
							realKeys.push(splitAP[2]);
						}

						if (
							tracker.items.letters[splitAP[0]] &&
							tracker.items.letters[splitAP[0]][splitAP[1]] &&
							tracker.items.letters[splitAP[0]][splitAP[1]][splitAP[2]] &&
							Array.isArray(tracker.items.letters[splitAP[0]][splitAP[1]][splitAP[2]]) &&
							tracker.items.letters[splitAP[0]][splitAP[1]][splitAP[2]].includes(query)
						) {
							realKeys.push('letters');
							realKeys.push(splitAP[0]);
							realKeys.push(splitAP[1]);
							realKeys.push(splitAP[2]);
						}
					}
				});
				break;
			case 'location':
				lastString.forEach((elem) => {
					if (elem.match(/\.checks/g)) {
						stringIncludingAP.push(elem);
					}
				});

				stringIncludingAP.forEach((APElem) => {
					let splitAP = APElem.split(',');
					realStringIncludingAP.push(splitAP[splitAP.length - 1]);
				});

				// console.log('String including Checks:', realStringIncludingAP);

				realStringIncludingAP.forEach((APElem) => {
					let splitAP = APElem.split('.');
					for (const [chapter, checksInChapter] of Object.entries(logic.checks)) {
						if (checksInChapter[splitAP[0]][splitAP[1]] && checksInChapter[splitAP[0]][splitAP[1]][splitAP[2]] && checksInChapter[splitAP[0]][splitAP[1]][splitAP[2]].length) {
							for (const [checkKey, check] of Object.entries(checksInChapter[splitAP[0]][splitAP[1]][splitAP[2]])) {
								if (check.ap && check.ap.includes(query)) {
									realKeys = `${checksInChapter.name} - ${checksInChapter[splitAP[0]][splitAP[1]].name} - ${checksInChapter[splitAP[0]][splitAP[1]][splitAP[2]][checkKey].name}`;
								}
							}
						}
					}
				});
				break;
		}

		return realKeys;

		function recHierarchy(obj, initial) {
			if (Object.keys(obj).length != 0) {
				return Object.keys(obj).map((elem) => {
					let basString = elem;
					switch (typeof obj[elem]) {
						case 'string': {
							return [`${elem.toString()}`];
						}
						default: {
							return [`${elem.toString()}`];
						}
						case 'object': {
							if (obj[elem].constructor === Array) {
								return [`${elem.toString()}`];
							}
							let returnedValue = recHierarchy(obj[elem]);
							let value = returnedValue.map((elem) => {
								if (elem.constructor === Array) {
									return elem.map((subelem) => {
										return `${basString}.${subelem.toString()}`;
									});
								}
								return `${basString}.${elem.toString()}`;
							});
							initial && initial.indexOf(elem) !== -1 ? (finalString = finalString.concat(value)) : null;
							return value;
						}
					}
				});
			} else {
				return [''];
			}
		}
	};

	const searchAPId = (obj, query) => {
		return searchForAPInObjectAndReturnValue(obj, query);
	};

	const apPartnerIsRankUp = (apId) => {
		let returnVal = false;

		for (const [partnerKey, partner] of Object.entries(tracker.items.partners)) {
			if (partner.ap_rank && partner.ap_rank.includes(apId)) {
				returnVal = true;
			}
		}

		return returnVal;
	};

	const apAskHint = () => {};

	let items_to_ids = {
		Nothing: 8112000000,
		'First Degree Card': 8112000010,
		'Second Degree Card': 8112000011,
		'Third Degree Card': 8112000012,
		'Fourth Degree Card': 8112000013,
		Diploma: 8112000014,
		'Ultra Stone': 8112000015,
		'Koopa Fortress Key': 8112000016,
		'Ruins Key': 8112000017,
		'Pulse Stone': 8112000018,
		'Tubba Castle Key': 8112000019,
		'Crystal Palace Key': 8112000020,
		'Lunar Stone': 8112000021,
		'Pyramid Stone': 8112000022,
		'Diamond Stone': 8112000023,
		'Kooper Shell': 8112000025,
		'Bowser Castle Key': 8112000026,
		'Forest Pass': 8112000027,
		'Boo Weight': 8112000028,
		'Boo Portrait': 8112000029,
		'Crystal Berry': 8112000030,
		'Storeroom Key': 8112000032,
		'Toy Train': 8112000033,
		'Boo Record': 8112000034,
		'Frying Pan': 8112000035,
		Dictionary: 8112000036,
		'Mystery Note': 8112000037,
		'Crystal Ball': 8112000039,
		Cookbook: 8112000041,
		'Jade Raven': 8112000042,
		'Magical Seed': 8112000043,
		MagicalSeed2: 8112000044,
		MagicalSeed3: 8112000045,
		MagicalSeed4: 8112000046,
		Calculator: 8112000048,
		'Snowman Bucket': 8112000049,
		'Snowman Scarf': 8112000050,
		'Red Key': 8112000051,
		'Blue Key': 8112000052,
		'Letter to Merlon': 8112000054,
		'Letter to Goompa': 8112000055,
		'Letter to Mort T': 8112000056,
		'Letter to Russ T': 8112000057,
		'Letter to Mayor Penguin': 8112000058,
		'Letter to Merlow': 8112000059,
		'Letter to Fice T': 8112000060,
		'Letter to Nomadimouse': 8112000061,
		'Letter to Minh T': 8112000062,
		'Letter to Goompapa 1': 8112000064,
		'Letter to Igor': 8112000065,
		'Letter to Franky': 8112000069,
		'Letter to Muss T': 8112000070,
		'Letter to Koover 1': 8112000071,
		'Letter to Fishmael': 8112000072,
		'Letter to Koover 2': 8112000073,
		'Letter to Mr E': 8112000074,
		'Letter to Miss T': 8112000075,
		'Letter to Little Mouser': 8112000076,
		'Letter to Dane T 1': 8112000078,
		'Letter to Red Yoshi Kid': 8112000079,
		'Letter to Dane T 2': 8112000080,
		'Letter to Frost T': 8112000081,
		'Letter to Goompapa 2': 8112000082,
		Artifact: 8112000083,
		'Letter to Kolorado': 8112000084,
		Dolly: 8112000086,
		'Water Stone': 8112000087,
		'Magical Bean': 8112000088,
		'Fertile Soil': 8112000089,
		'Miracle Water': 8112000090,
		'Volcano Vase': 8112000091,
		'Koot Tape': 8112000092,
		Lyrics: 8112000103,
		Melody: 8112000104,
		Mailbag: 8112000105,
		'Odd Key': 8112000107,
		'Star Stone': 8112000108,
		'Koot Koopa Legends': 8112000110,
		'Luigi Autograph': 8112000111,
		'Koot Empty Wallet': 8112000112,
		'Merluvlee Autograph': 8112000113,
		'Koot Old Photo': 8112000115,
		'Koot Glasses': 8112000116,
		'Koot Package': 8112000118,
		'Koot Red Jar': 8112000119,
		'Warehouse Key': 8112000121,
		'Silver Credit': 8112000123,
		'Gold Credit': 8112000124,
		'Fire Flower': 8112000128,
		'Snowman Doll': 8112000129,
		'Thunder Rage': 8112000130,
		'Shooting Star': 8112000131,
		'Thunder Bolt': 8112000132,
		Pebble: 8112000133,
		'Dusty Hammer': 8112000134,
		'Insecticide Herb': 8112000135,
		'Stone Cap': 8112000136,
		'Tasty Tonic': 8112000137,
		Mushroom: 8112000138,
		'Volt Shroom': 8112000139,
		'Super Shroom': 8112000140,
		'Dried Shroom': 8112000141,
		'Ultra Shroom': 8112000142,
		'Sleepy Sheep': 8112000143,
		'POW Block': 8112000144,
		'Hustle Drink': 8112000145,
		'Stop Watch': 8112000146,
		'Whackas Bump': 8112000147,
		Apple: 8112000148,
		'Life Shroom': 8112000149,
		Mystery: 8112000150,
		'Repel Gel': 8112000151,
		'Fright Jar': 8112000152,
		'Dizzy Dial': 8112000154,
		'Super Soda': 8112000155,
		Lemon: 8112000156,
		Lime: 8112000157,
		'Jammin Jelly': 8112000162,
		'Maple Syrup': 8112000163,
		'Honey Syrup': 8112000164,
		Goomnut: 8112000165,
		'Koopa Leaf': 8112000166,
		'Dried Pasta': 8112000167,
		'Dried Fruit': 8112000168,
		'Strange Leaf': 8112000169,
		'Cake Mix': 8112000170,
		Egg: 8112000171,
		Coconut: 8112000172,
		Melon: 8112000173,
		'Stinky Herb': 8112000174,
		'Iced Potato': 8112000175,
		'Spicy Soup': 8112000176,
		'Apple Pie': 8112000177,
		'Honey Ultra': 8112000178,
		'Maple Ultra': 8112000179,
		'Jelly Ultra': 8112000180,
		Koopasta: 8112000181,
		'Fried Shroom': 8112000182,
		'Shroom Cake': 8112000183,
		'Shroom Steak': 8112000184,
		'Hot Shroom': 8112000185,
		'Sweet Shroom': 8112000186,
		'Yummy Meal': 8112000187,
		'Healthy Juice': 8112000188,
		'Bland Meal': 8112000189,
		'Deluxe Feast': 8112000190,
		'Special Shake': 8112000191,
		'Big Cookie': 8112000192,
		Cake: 8112000193,
		Mistake: 8112000194,
		'Koopa Tea': 8112000195,
		'Honey Super': 8112000196,
		'Maple Super': 8112000197,
		'Jelly Super': 8112000198,
		Spaghetti: 8112000199,
		'Egg Missile': 8112000200,
		'Fried Egg': 8112000201,
		'Honey Shroom': 8112000202,
		'Honey Candy': 8112000203,
		'Electro Pop': 8112000204,
		'Fire Pop': 8112000205,
		'Lime Candy': 8112000206,
		'Coco Pop': 8112000207,
		'Lemon Candy': 8112000208,
		'Jelly Pop': 8112000209,
		'Strange Cake': 8112000210,
		'Kooky Cookie': 8112000211,
		'Frozen Fries': 8112000212,
		'Potato Salad': 8112000213,
		'Nutty Cake': 8112000214,
		'Maple Shroom': 8112000215,
		'Boiled Egg': 8112000216,
		'Yoshi Cookie': 8112000217,
		'Jelly Shroom1': 8112000218,
		'Spin Smash': 8112000224,
		Multibounce: 8112000225,
		'Power Plus': 8112000226,
		'Dodge Master': 8112000227,
		'Power Bounce': 8112000228,
		'Spike Shield': 8112000229,
		'First Attack': 8112000230,
		'HP Plus': 8112000231,
		'Quake Hammer': 8112000232,
		'Double Dip': 8112000233,
		'Sleep Stomp': 8112000235,
		'Fire Shield': 8112000236,
		'Quick Change': 8112000237,
		'D-Down Pound': 8112000238,
		'Dizzy Stomp': 8112000239,
		'Mini Smash Charge': 8112000240,
		'Pretty Lucky': 8112000241,
		'Feeling Fine': 8112000242,
		'Attack FX A': 8112000243,
		'All or Nothing': 8112000244,
		'HP Drain': 8112000245,
		'Mini Jump Charge': 8112000246,
		'Slow Go': 8112000247,
		'FP Plus': 8112000248,
		'Mega Rush': 8112000249,
		'Ice Power': 8112000250,
		'Defend Plus': 8112000251,
		'Pay Off': 8112000252,
		'Money Money': 8112000253,
		'Chill Out': 8112000254,
		'Happy Heart': 8112000255,
		'Zap Tap': 8112000256,
		Berserker: 8112000257,
		'Right On': 8112000258,
		'Runaway Pay': 8112000259,
		Refund: 8112000260,
		'Flower Saver': 8112000261,
		'Triple Dip': 8112000262,
		'Hammer Throw': 8112000263,
		'Mega Quake': 8112000264,
		'Smash Charge': 8112000265,
		'Jump Charge': 8112000266,
		'Super Smash Charge': 8112000267,
		'Super Jump Charge': 8112000268,
		'Power Rush': 8112000269,
		'Auto Jump': 8112000270,
		'Auto Smash': 8112000271,
		'Crazy Heart': 8112000272,
		'Last Stand': 8112000273,
		'Close Call': 8112000274,
		'P-Up D-Down': 8112000275,
		'Lucky Day': 8112000276,
		'Mega HP Drain': 8112000277,
		'P-Down D-Up': 8112000278,
		'Power Quake': 8112000279,
		'Auto Multibounce': 8112000280,
		'Flower Fanatic': 8112000281,
		'Heart Finder': 8112000282,
		'Flower Finder': 8112000283,
		'Spin Attack': 8112000284,
		'Dizzy Attack': 8112000285,
		'I Spy': 8112000286,
		'Speedy Spin': 8112000287,
		'Bump Attack': 8112000288,
		'Power Jump': 8112000289,
		'Super Jump': 8112000290,
		'Mega Jump': 8112000291,
		'Power Smash': 8112000292,
		'Super Smash': 8112000293,
		'Mega Smash': 8112000294,
		'Deep Focus': 8112000297,
		'Super Focus': 8112000298,
		'Shrink Smash': 8112000299,
		'D-Down Jump': 8112000302,
		'Shrink Stomp': 8112000303,
		'Damage Dodge': 8112000304,
		'Earthquake Jump': 8112000305,
		DeepFocus2: 8112000306,
		DeepFocus3: 8112000307,
		HPPlusB: 8112000308,
		FPPlusB: 8112000309,
		HappyHeartB: 8112000310,
		HappyHeartX: 8112000311,
		FlowerSaverB: 8112000312,
		FlowerSaverX: 8112000313,
		DamageDodgeB: 8112000314,
		DamageDodgeX: 8112000315,
		PowerPlusB: 8112000316,
		PowerPlusX: 8112000317,
		DefendPlusX: 8112000318,
		DefendPlusY: 8112000319,
		'Happy Flower': 8112000320,
		HappyFlowerB: 8112000321,
		HappyFlowerX: 8112000322,
		'Group Focus': 8112000323,
		Peekaboo: 8112000324,
		'Attack FX D': 8112000325,
		'Attack FX B': 8112000326,
		'Attack FX E': 8112000327,
		'Attack FX C': 8112000328,
		'Attack FX F': 8112000329,
		HPPlusC: 8112000330,
		HPPlusX: 8112000331,
		HPPlusY: 8112000332,
		FPPlusC: 8112000333,
		FPPlusX: 8112000334,
		FPPlusY: 8112000335,
		'Healthy Healthy': 8112000336,
		Coin: 8112000343,
		'Star Piece': 8112000348,
		KoopaFortressKeyA: 8112000365,
		KoopaFortressKeyB: 8112000366,
		KoopaFortressKeyC: 8112000367,
		KoopaFortressKeyD: 8112000368,
		RuinsKeyA: 8112000369,
		RuinsKeyB: 8112000370,
		RuinsKeyC: 8112000371,
		RuinsKeyD: 8112000372,
		TubbaCastleKeyA: 8112000373,
		TubbaCastleKeyB: 8112000374,
		TubbaCastleKeyC: 8112000375,
		BowserCastleKeyA: 8112000376,
		BowserCastleKeyB: 8112000377,
		BowserCastleKeyC: 8112000378,
		BowserCastleKeyD: 8112000379,
		BowserCastleKeyE: 8112000380,
		'Prison Key': 8112000381,
		PrisonKeyB: 8112000382,
		StarPiece00: 8112000389,
		StarPiece01: 8112000390,
		StarPiece02: 8112000391,
		StarPiece03: 8112000392,
		StarPiece04: 8112000393,
		StarPiece05: 8112000394,
		StarPiece06: 8112000395,
		StarPiece07: 8112000396,
		StarPiece08: 8112000397,
		StarPiece09: 8112000398,
		StarPiece0A: 8112000399,
		StarPiece0B: 8112000400,
		StarPiece0C: 8112000401,
		StarPiece0D: 8112000402,
		StarPiece0E: 8112000403,
		StarPiece0F: 8112000404,
		StarPiece10: 8112000405,
		StarPiece11: 8112000406,
		StarPiece12: 8112000407,
		StarPiece13: 8112000408,
		StarPiece14: 8112000409,
		StarPiece15: 8112000410,
		StarPiece16: 8112000411,
		StarPiece17: 8112000412,
		StarPiece18: 8112000413,
		StarPiece19: 8112000414,
		StarPiece1A: 8112000415,
		StarPiece1B: 8112000416,
		StarPiece1C: 8112000417,
		StarPiece1D: 8112000418,
		StarPiece1E: 8112000419,
		StarPiece1F: 8112000420,
		StarPiece20: 8112000421,
		StarPiece21: 8112000422,
		StarPiece22: 8112000423,
		StarPiece23: 8112000424,
		StarPiece24: 8112000425,
		StarPiece25: 8112000426,
		StarPiece26: 8112000427,
		StarPiece27: 8112000428,
		StarPiece28: 8112000429,
		StarPiece29: 8112000430,
		StarPiece2A: 8112000431,
		StarPiece2B: 8112000432,
		StarPiece2C: 8112000433,
		StarPiece2D: 8112000434,
		StarPiece2E: 8112000435,
		StarPiece2F: 8112000436,
		StarPiece30: 8112000437,
		StarPiece31: 8112000438,
		StarPiece32: 8112000439,
		StarPiece33: 8112000440,
		StarPiece34: 8112000441,
		StarPiece35: 8112000442,
		StarPiece36: 8112000443,
		StarPiece37: 8112000444,
		StarPiece38: 8112000445,
		StarPiece39: 8112000446,
		StarPiece3A: 8112000447,
		StarPiece3B: 8112000448,
		StarPiece3C: 8112000449,
		StarPiece3D: 8112000450,
		StarPiece3E: 8112000451,
		StarPiece3F: 8112000452,
		StarPiece40: 8112000453,
		StarPiece41: 8112000454,
		StarPiece42: 8112000455,
		StarPiece43: 8112000456,
		StarPiece44: 8112000457,
		StarPiece45: 8112000458,
		StarPiece46: 8112000459,
		StarPiece47: 8112000460,
		StarPiece48: 8112000461,
		StarPiece49: 8112000462,
		StarPiece4A: 8112000463,
		StarPiece4B: 8112000464,
		StarPiece4C: 8112000465,
		StarPiece4D: 8112000466,
		StarPiece4E: 8112000467,
		StarPiece4F: 8112000468,
		StarPiece50: 8112000469,
		StarPiece51: 8112000470,
		'3x Star Pieces': 8112000471,
		ThreeStarPieces1: 8112000472,
		ThreeStarPieces2: 8112000473,
		ThreeStarPieces3: 8112000474,
		ThreeStarPieces4: 8112000475,
		'Power Star': 8112000476,
		PowerStar01: 8112000477,
		PowerStar02: 8112000478,
		PowerStar03: 8112000479,
		PowerStar04: 8112000480,
		PowerStar05: 8112000481,
		PowerStar06: 8112000482,
		PowerStar07: 8112000483,
		PowerStar08: 8112000484,
		PowerStar09: 8112000485,
		PowerStar0A: 8112000486,
		PowerStar0B: 8112000487,
		PowerStar0C: 8112000488,
		PowerStar0D: 8112000489,
		PowerStar0E: 8112000490,
		PowerStar0F: 8112000491,
		PowerStar10: 8112000492,
		PowerStar11: 8112000493,
		PowerStar12: 8112000494,
		PowerStar13: 8112000495,
		PowerStar14: 8112000496,
		PowerStar15: 8112000497,
		PowerStar16: 8112000498,
		PowerStar17: 8112000499,
		PowerStar18: 8112000500,
		PowerStar19: 8112000501,
		PowerStar1A: 8112000502,
		PowerStar1B: 8112000503,
		PowerStar1C: 8112000504,
		PowerStar1D: 8112000505,
		PowerStar1E: 8112000506,
		PowerStar1F: 8112000507,
		PowerStar20: 8112000508,
		PowerStar21: 8112000509,
		PowerStar22: 8112000510,
		PowerStar23: 8112000511,
		PowerStar24: 8112000512,
		PowerStar25: 8112000513,
		PowerStar26: 8112000514,
		PowerStar27: 8112000515,
		PowerStar28: 8112000516,
		PowerStar29: 8112000517,
		PowerStar2A: 8112000518,
		PowerStar2B: 8112000519,
		PowerStar2C: 8112000520,
		PowerStar2D: 8112000521,
		PowerStar2E: 8112000522,
		PowerStar2F: 8112000523,
		PowerStar30: 8112000524,
		PowerStar31: 8112000525,
		PowerStar32: 8112000526,
		PowerStar33: 8112000527,
		PowerStar34: 8112000528,
		PowerStar35: 8112000529,
		PowerStar36: 8112000530,
		PowerStar37: 8112000531,
		PowerStar38: 8112000532,
		PowerStar39: 8112000533,
		PowerStar3A: 8112000534,
		PowerStar3B: 8112000535,
		PowerStar3C: 8112000536,
		PowerStar3D: 8112000537,
		PowerStar3E: 8112000538,
		PowerStar3F: 8112000539,
		PowerStar40: 8112000540,
		PowerStar41: 8112000541,
		PowerStar42: 8112000542,
		PowerStar43: 8112000543,
		PowerStar44: 8112000544,
		PowerStar45: 8112000545,
		PowerStar46: 8112000546,
		PowerStar47: 8112000547,
		PowerStar48: 8112000548,
		PowerStar49: 8112000549,
		PowerStar4A: 8112000550,
		PowerStar4B: 8112000551,
		PowerStar4C: 8112000552,
		PowerStar4D: 8112000553,
		PowerStar4E: 8112000554,
		PowerStar4F: 8112000555,
		PowerStar50: 8112000556,
		PowerStar51: 8112000557,
		PowerStar52: 8112000558,
		PowerStar53: 8112000559,
		PowerStar54: 8112000560,
		PowerStar55: 8112000561,
		PowerStar56: 8112000562,
		PowerStar57: 8112000563,
		PowerStar58: 8112000564,
		PowerStar59: 8112000565,
		PowerStar5A: 8112000566,
		PowerStar5B: 8112000567,
		PowerStar5C: 8112000568,
		PowerStar5D: 8112000569,
		PowerStar5E: 8112000570,
		PowerStar5F: 8112000571,
		PowerStar60: 8112000572,
		PowerStar61: 8112000573,
		PowerStar62: 8112000574,
		PowerStar63: 8112000575,
		PowerStar64: 8112000576,
		PowerStar65: 8112000577,
		PowerStar66: 8112000578,
		PowerStar67: 8112000579,
		PowerStar68: 8112000580,
		PowerStar69: 8112000581,
		PowerStar6A: 8112000582,
		PowerStar6B: 8112000583,
		PowerStar6C: 8112000584,
		PowerStar6D: 8112000585,
		PowerStar6E: 8112000586,
		PowerStar6F: 8112000587,
		PowerStar70: 8112000588,
		PowerStar71: 8112000589,
		PowerStar72: 8112000590,
		PowerStar73: 8112000591,
		PowerStar74: 8112000592,
		PowerStar75: 8112000593,
		PowerStar76: 8112000594,
		PowerStar77: 8112000595,
		PowerStar78: 8112000596,
		PowerStar79: 8112000597,
		PowerStar7A: 8112000598,
		PowerStar7B: 8112000599,
		PowerStar7C: 8112000600,
		PowerStar7D: 8112000601,
		PowerStar7E: 8112000602,
		PowerStar7F: 8112000603,
		MultiWorldGeneric: 8112000604,
		MultiWorldKey00: 8112000605,
		MultiWorldKey01: 8112000606,
		MultiWorldKey02: 8112000607,
		MultiWorldKey03: 8112000608,
		MultiWorldKey04: 8112000609,
		MultiWorldKey05: 8112000610,
		MultiWorldKey06: 8112000611,
		MultiWorldKey07: 8112000612,
		MultiWorldKey08: 8112000613,
		MultiWorldKey09: 8112000614,
		MultiWorldKey0A: 8112000615,
		MultiWorldKey0B: 8112000616,
		MultiWorldKey0C: 8112000617,
		MultiWorldKey0D: 8112000618,
		MultiWorldKey0E: 8112000619,
		MultiWorldKey0F: 8112000620,
		MultiWorldKey10: 8112000621,
		MultiWorldKey11: 8112000622,
		MultiWorldKey12: 8112000623,
		MultiWorldKey13: 8112000624,
		MultiWorldKey14: 8112000625,
		MultiWorldKey15: 8112000626,
		MultiWorldKey16: 8112000627,
		MultiWorldKey17: 8112000628,
		MultiWorldKey18: 8112000629,
		MultiWorldKey19: 8112000630,
		MultiWorldKey1A: 8112000631,
		MultiWorldKey1B: 8112000632,
		MultiWorldKey1C: 8112000633,
		MultiWorldKey1D: 8112000634,
		MultiWorldKey1E: 8112000635,
		MultiWorldKey1F: 8112000636,
		MultiWorldKey20: 8112000637,
		MultiWorldKey21: 8112000638,
		MultiWorldKey22: 8112000639,
		MultiWorldKey23: 8112000640,
		MultiWorldKey24: 8112000641,
		MultiWorldKey25: 8112000642,
		MultiWorldKey26: 8112000643,
		MultiWorldKey27: 8112000644,
		MultiWorldKey28: 8112000645,
		MultiWorldKey29: 8112000646,
		MultiWorldKey2A: 8112000647,
		MultiWorldKey2B: 8112000648,
		MultiWorldKey2C: 8112000649,
		MultiWorldKey2D: 8112000650,
		MultiWorldKey2E: 8112000651,
		MultiWorldKey2F: 8112000652,
		MultiWorldKey30: 8112000653,
		MultiWorldKey31: 8112000654,
		MultiWorldKey32: 8112000655,
		MultiWorldKey33: 8112000656,
		MultiWorldKey34: 8112000657,
		MultiWorldKey35: 8112000658,
		MultiWorldKey36: 8112000659,
		MultiWorldKey37: 8112000660,
		MultiWorldKey38: 8112000661,
		MultiWorldKey39: 8112000662,
		MultiWorldKey3A: 8112000663,
		MultiWorldKey3B: 8112000664,
		MultiWorldKey3C: 8112000665,
		MultiWorldKey3D: 8112000666,
		MultiWorldKey3E: 8112000667,
		MultiWorldKey3F: 8112000668,
		MultiWorldKey40: 8112000669,
		MultiWorldKey41: 8112000670,
		MultiWorldKey42: 8112000671,
		MultiWorldKey43: 8112000672,
		MultiWorldKey44: 8112000673,
		MultiWorldKey45: 8112000674,
		MultiWorldKey46: 8112000675,
		MultiWorldKey47: 8112000676,
		MultiWorldKey48: 8112000677,
		MultiWorldKey49: 8112000678,
		MultiWorldKey4A: 8112000679,
		MultiWorldKey4B: 8112000680,
		MultiWorldKey4C: 8112000681,
		MultiWorldKey4D: 8112000682,
		MultiWorldKey4E: 8112000683,
		MultiWorldKey4F: 8112000684,
		MultiWorldKey50: 8112000685,
		MultiWorldKey51: 8112000686,
		MultiWorldKey52: 8112000687,
		MultiWorldKey53: 8112000688,
		MultiWorldKey54: 8112000689,
		MultiWorldKey55: 8112000690,
		MultiWorldKey56: 8112000691,
		MultiWorldKey57: 8112000692,
		MultiWorldKey58: 8112000693,
		MultiWorldKey59: 8112000694,
		MultiWorldKey5A: 8112000695,
		MultiWorldKey5B: 8112000696,
		MultiWorldKey5C: 8112000697,
		CakeProxy: 8112000698,
		'Blue Berry': 8112000699,
		BlueBerryProxy2: 8112000700,
		'Red Berry': 8112000701,
		RedBerryProxy2: 8112000702,
		'Yellow Berry': 8112000703,
		YellowBerryProxy2: 8112000704,
		'Bubble Berry': 8112000705,
		BubbleBerryProxy2: 8112000706,
		'Progressive Boots': 8112000707,
		BootsProxy2: 8112000708,
		BootsProxy3: 8112000709,
		'Progressive Hammer': 8112000710,
		HammerProxy2: 8112000711,
		HammerProxy3: 8112000712,
		'Progressive Smash Charge': 8112000713,
		SmashChargeProxy2: 8112000714,
		SmashChargeProxy3: 8112000715,
		'Progressive Jump Charge': 8112000716,
		JumpChargeProxy2: 8112000717,
		JumpChargeProxy3: 8112000718,
		'Progressive Power Jump': 8112000719,
		PowerJumpProxy2: 8112000720,
		PowerJumpProxy3: 8112000721,
		'Progressive Power Smash': 8112000722,
		PowerSmashProxy2: 8112000723,
		PowerSmashProxy3: 8112000724,
		'Progressive Quake Hammer': 8112000725,
		QuakeHammerProxy2: 8112000726,
		QuakeHammerProxy3: 8112000727,
		'Pouch Upgrade': 8112000728,
		PouchB: 8112000729,
		PouchC: 8112000730,
		PouchD: 8112000731,
		PouchE: 8112000732,
		'Goombario Upgrade': 8112000733,
		'Kooper Upgrade': 8112000734,
		'Bombette Upgrade': 8112000735,
		'Parakarry Upgrade': 8112000736,
		'Watt Upgrade': 8112000738,
		'Sushie Upgrade': 8112000739,
		'Lakilester Upgrade': 8112000740,
		'Bow Upgrade': 8112000741,
		GoombarioUp2: 8112000742,
		KooperUp2: 8112000743,
		BombetteUp2: 8112000744,
		ParakarryUp2: 8112000745,
		WattUp2: 8112000747,
		SushieUp2: 8112000748,
		LakilesterUp2: 8112000749,
		BowUp2: 8112000750,
		Goombario: 8112000751,
		Kooper: 8112000752,
		Bombette: 8112000753,
		Parakarry: 8112000754,
		Watt: 8112000756,
		Sushie: 8112000757,
		Lakilester: 8112000758,
		Bow: 8112000759
	};

	return {
		connect,
		disconnect,
		sync,
		setYaml,
		connectionInfos,
		state,
		searchAPId,
		apPartnerIsRankUp,
		checkedLocationsCount,
		apAskHint
	};
});
