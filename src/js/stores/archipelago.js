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
		protocol: 'ws',
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
		// client.addListener(SERVER_PACKET_TYPE.DATA_PACKAGE, (packet) => {
		// 	console.log(packet);
		// });

		if (connectionInfos.hostname == 'archipelago.gg') {
			connectionInfos.protocol = 'wss';
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
