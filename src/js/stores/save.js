import { defineStore } from 'pinia';
import { reactive, ref, watch } from 'vue';

import { useTrackerStore } from './tracker';

export const useSaveStore = defineStore('save', () => {
	const tracker = useTrackerStore();

	const welcomeMessageShown = ref(false);
	const resetTrackerLayout = ref(false);

	const currentSave = reactive({
		configs: {
			randomizer: {},
			logic: {},
			tracker: {
				compact_items: false,
				compact_items_per_chapters: false
			},
			invisible_items: {}
		}
	});

	const defaultSave = reactive({
		randomizer_seed: null,
		randomizer_seed_hash_items: null,
		items: {
			eldstar: false,
			mamar: false,
			skolar: false,
			muskular: false,
			misstar: false,
			klevar: false,
			kalmar: false,
			eldstar_difficulty: 0,
			mamar_difficulty: 0,
			skolar_difficulty: 0,
			muskular_difficulty: 0,
			misstar_difficulty: 0,
			klevar_difficulty: 0,
			kalmar_difficulty: 0,
			eldstar_dungeon_shuffle: 0,
			mamar_dungeon_shuffle: 0,
			skolar_dungeon_shuffle: 0,
			muskular_dungeon_shuffle: 0,
			misstar_dungeon_shuffle: 0,
			klevar_dungeon_shuffle: 0,
			kalmar_dungeon_shuffle: 0,
			starrod: false,
			goombario: false,
			kooper: false,
			bombette: false,
			parakarry: false,
			bow: false,
			watt: false,
			sushie: false,
			lakilester: false,
			goombario_rank: 0,
			kooper_rank: 0,
			bombette_rank: 0,
			parakarry_rank: 0,
			bow_rank: 0,
			watt_rank: 0,
			sushie_rank: 0,
			lakilester_rank: 0,
			ultra_stone: false,
			boots: 1,
			hammer: 1,
			dolly: false,
			fortress_key: 0,
			kooper_shell: false,
			pulse_stone: false,
			pyramid_stone: false,
			diamond_stone: false,
			parakarry_letters: 0,
			lunar_stone: false,
			ruins_key: 0,
			artifact: false,
			forest_pass: false,
			record: false,
			weight: false,
			boo_portrait: false,
			tubba_castle_key: 0,
			toy_train: false,
			calculator: false,
			frying_pan: false,
			mailbag: false,
			dictionary: false,
			cake: false,
			cookbook: false,
			mystery_note: false,
			anti_guy: false,
			jade_raven: false,
			volcano_vase: false,
			pink_magical_seed: false,
			purple_magical_seed: false,
			green_magical_seed: false,
			yellow_magical_seed: false,
			red_berry: false,
			yellow_berry: false,
			blue_berry: 0,
			bubble_berry: false,
			crystal_berry: false,
			water_stone: false,
			magical_bean: false,
			fertile_soil: false,
			miracle_water: false,
			warehouse_key: false,
			scarf: false,
			bucket: false,
			star_stone: false,
			red_key: false,
			blue_key: false,
			palace_key: false,
			prison_key: 0,
			castle_key: 0,
			lyrics: false,
			melody: false,
			odd_key: false,
			storeroom_key: false,
			letters: {
				goompa: false,
				goompapa: 0,
				merlon: false,
				merlow: false,
				muss_t: false,
				fice_t: false,
				russ_t: false,
				minh_t: false,
				miss_t: false,
				fishmael: false,
				dane_t: 0,
				kolorado: false,
				mort_t: false,
				koover: 0,
				nomadimouse: false,
				little_mouser: false,
				mr_e: false,
				igor: false,
				franky: false,
				red_yoshi_kid: false,
				mayor_penguin: false,
				frost_t: false
			},
			chuck_quizmo: 0,
			star_pieces: 0,
			rip_cheato: 0,
			power_stars: 0,
			koopa_koot_favors: {
				koopa_legends: false,
				sleepy_sheep: false,
				tape: false,
				koopa_tea: false,
				luigi_autograph: false,
				empty_wallet: false,
				tasty_tonic: false,
				crystal_ball: false,
				merluvlee_autograph: false,
				life_shroom: false,
				nutty_cake: false,
				old_photo: false,
				koopasta: false,
				glasses: false,
				lime: false,
				kooky_cookie: false,
				package: false,
				coconut: false,
				red_jar: false
			},
			trading_event_toad: {
				koopa_leaf: false,
				coconut: false,
				nutty_cake: false
			},
			hand_ins: {}
		},
		merlow_items: {},
		checks: {}
	});

	const defaultRandomizerConfigs = {
		prologue_open: false,
		mt_rugged_open: false,
		forever_forest_open: false,
		toybox_open: false,
		whale_open: false,
		chapter_7_bridge_open: false,
		blue_house_open: false,
		magical_seed_required: 4,
		starting_location: 65796,
		star_hunt_enabled: false,
		star_hunt_star_count: 120
	};

	const defaultLogicConfigs = {
		fast_bowser_castle: false,
		super_blocks_randomized: false,
		shopsanity: false,
		rowf_shop: false,
		merlow: false,
		merlow_reward_cost_1: 5,
		merlow_reward_cost_2: 10,
		merlow_reward_cost_3: 15,
		merlow_reward_cost_4: 20,
		merlow_reward_cost_5: 25,
		merlow_reward_cost_6: 30,
		rip_cheato: 0,
		panels: false,
		overworld_coins: false,
		coin_blocks: false,
		super_and_multicoin_blocks_randomized: false,
		foliage_coins: false,
		partners_always_usable: false,
		letters_randomized: false,
		koopa_koot: false,
		koopa_koot_coins: false,
		dojo_randomized: false,
		trading_event_randomized: false
	};

	const defaultTrackerConfigs = {
		map: true,
		map_text_size: 'base',
		always_show_super_blocks: false,
		star_menu_enabled: false,
		compact_items: false,
		compact_item_background_hex_color: '#000000',
		compact_item_show_letters: false,
		compact_item_show_favors: false,
		compact_item_show_trading_events: false,
		compact_items_per_chapters: false,
		compact_items_per_chapters: false,
		competitive_mode: false,
		missing_items_in_grayscale: false,
		deactivate_items_tooltips: false
	};

	const resetTrackerConfigs = () => {
		const defaultTrackerConfigsToApply = JSON.parse(JSON.stringify(defaultTrackerConfigs));
		Object.assign(currentSave.configs.tracker, defaultTrackerConfigsToApply);
	};

	const resetConfigs = () => {
		const defaultRandomizerConfigsToApply = JSON.parse(JSON.stringify(defaultRandomizerConfigs));
		Object.assign(currentSave.configs.randomizer, defaultRandomizerConfigsToApply);
		const defaultLogicConfigsToApply = JSON.parse(JSON.stringify(defaultLogicConfigs));
		Object.assign(currentSave.configs.logic, defaultLogicConfigsToApply);

		if (currentSave.configs.tracker !== undefined && Object.keys(currentSave.configs.tracker).length <= 0) {
			resetTrackerConfigs();
		}
	};

	const resetSave = () => {
		const defaultSaveClone = JSON.parse(JSON.stringify(defaultSave));
		Object.assign(currentSave, defaultSaveClone);
	};

	const exportSave = () => {
		let json = JSON.stringify(currentSave);

		let fileName = 'pm64_randomizer_save';

		if (currentSave.randomizer_seed) {
			fileName += '_' + currentSave.randomizer_seed;
		}

		var dataString = 'data:text/json;charset=utf-8,' + encodeURIComponent(json);
		var downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute('href', dataString);
		downloadAnchorNode.setAttribute('download', fileName + '.json');
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	};

	const importSave = (htmlEvent) => {
		const file = htmlEvent.target.files;
		if (file && file.length > 0) {
			if (confirm('Are you sure you want to import your progress? This will restore everything (configs and progression) from the file.')) {
				const reader = new FileReader();
				reader.readAsText(file[0], 'UTF-8');
				reader.onload = (readerEvent) => {
					Object.assign(currentSave, JSON.parse(readerEvent.target.result));
				};
				reader.onerror = (readerEvent) => {
					console.error('Error reading file');
				};
			}
		}
	};

	const loadSeed = () => {
		if (
			confirm(
				'Are you sure you want to load a new seed? This will delete everything (configs and progression) from the file. If you want to keep this run progression, you can always export your save first.'
			)
		) {
			let randomizer_seed = currentSave.randomizer_seed;
			const pmr_endpoint = 'https://paper-mario-randomizer-server.ue.r.appspot.com/randomizer_settings/';
			axios.get(pmr_endpoint + currentSave.randomizer_seed).then((response) => {
				let randomizerData = response.data;

				resetConfigs();
				resetSave();

				currentSave.randomizer_seed = randomizer_seed;
				currentSave.randomizer_seed_hash_items = randomizerData.SeedHashItems.join(' | ');

				currentSave.configs.randomizer.prologue_open = randomizerData.PrologueOpen;
				currentSave.configs.randomizer.mt_rugged_open = randomizerData.MtRuggedOpen;
				currentSave.configs.randomizer.forever_forest_open = randomizerData.ForeverForestOpen;
				currentSave.configs.randomizer.toybox_open = randomizerData.ToyboxOpen;
				currentSave.configs.randomizer.whale_open = randomizerData.WhaleOpen;
				currentSave.configs.randomizer.chapter_7_bridge_open = randomizerData.Ch7BridgeVisible;
				currentSave.configs.randomizer.magical_seed_required = randomizerData.MagicalSeedsRequired;
				currentSave.configs.randomizer.starting_location = randomizerData.StartingMap;
				currentSave.configs.randomizer.star_hunt_enabled = randomizerData.StarHunt;
				currentSave.configs.randomizer.star_hunt_star_count = randomizerData.StarHuntRequired;

				currentSave.configs.logic.fast_bowser_castle = randomizerData.BowsersCastleMode != 0 ? true : false;
				currentSave.configs.logic.shopsanity = randomizerData.IncludeShops;
				currentSave.configs.logic.rowf_shop = randomizerData.ProgressionOnRowf;
				currentSave.configs.logic.merlow = randomizerData.ProgressionOnMerlow;
				currentSave.configs.logic.rip_cheato = randomizerData.RipCheatoItemsInLogic;
				currentSave.configs.logic.panels = randomizerData.IncludePanels;
				currentSave.configs.logic.overworld_coins = randomizerData.IncludeCoinsOverworld;
				currentSave.configs.logic.coin_blocks = randomizerData.IncludeCoinsBlocks;
				currentSave.configs.logic.super_and_multicoin_blocks_randomized = randomizerData.ShuffleBlocks;
				currentSave.configs.logic.foliage_coins = randomizerData.IncludeCoinsFoliage;
				currentSave.configs.logic.partners_always_usable = randomizerData.PartnersAlwaysUsable;
				currentSave.configs.logic.letters_randomized = randomizerData.IncludeLettersMode == 2 || randomizerData.IncludeLettersMode == 3 ? true : false;
				currentSave.configs.logic.koopa_koot = randomizerData.IncludeFavorsMode == 2 ? true : false;
				currentSave.configs.logic.koopa_koot_coins = randomizerData.IncludeCoinsFavors;
				currentSave.configs.logic.dojo_randomized = randomizerData.IncludeDojo;
				currentSave.configs.logic.trading_event_randomized = randomizerData.IncludeRadioTradeEvent;
			});
		}
	};

	const loadSave = () => {
		const save = localStorage.getItem('save');

		if (save) {
			Object.assign(currentSave, JSON.parse(save));
		} else {
			resetSave();
			resetConfigs();
			resetTrackerConfigs();
		}
	};

	const initInvisibleItems = () => {
		if (currentSave.configs.invisible_items === undefined) {
			currentSave.configs.invisible_items = {};
		}

		for (const [key, value] of Object.entries(tracker.items)) {
			if (currentSave.configs.invisible_items[key] === undefined) {
				currentSave.configs.invisible_items[key] = {};
			}

			if (key == 'items' || key == 'letters') {
				for (const [key2, value2] of Object.entries(value)) {
					if (currentSave.configs.invisible_items[key][key2] === undefined) {
						currentSave.configs.invisible_items[key][key2] = {};
					}
				}
			}
		}
	};

	watch(
		currentSave,
		(newValue, oldValue) => {
			localStorage.setItem('save', JSON.stringify(newValue));

			//Prompt changes has been made
			// window.addEventListener('beforeunload', function (e) {
			// 	// Cancel the event
			// 	e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
			// 	// Chrome requires returnValue to be set
			// 	e.returnValue = '';
			// });
		},
		{ deep: true }
	);

	watch(
		() => currentSave.configs.randomizer.forever_forest_open,
		(newValue, oldValue) => {
			tracker.items.items.chapter3.forest_pass.enabled = !newValue;
		}
	);

	watch(
		() => currentSave.configs.randomizer.magical_seed_required,
		(newValue, oldValue) => {
			tracker.items.items.chapter6.yellow_magical_seed.enabled = newValue >= 1;
			tracker.items.items.chapter6.green_magical_seed.enabled = newValue >= 2;
			tracker.items.items.chapter6.purple_magical_seed.enabled = newValue >= 3;
			tracker.items.items.chapter6.pink_magical_seed.enabled = newValue >= 4;

			currentSave.items.pink_magical_seed = false;
			currentSave.items.purple_magical_seed = false;
			currentSave.items.green_magical_seed = false;
			currentSave.items.yellow_magical_seed = false;
		}
	);

	watch(
		() => currentSave.configs.randomizer.blue_house_open,
		(newValue, oldValue) => {
			tracker.items.items.other.odd_key.enabled = !newValue;

			currentSave.items.odd_key = false;
		}
	);

	watch(
		() => currentSave.configs.randomizer.star_hunt_enabled,
		(newValue, oldValue) => {
			tracker.configs.randomizer.star_hunt_star_count.enabled = newValue;

			tracker.items.stars.power_stars.enabled = newValue;
			tracker.items.stars.starrod.enabled = !newValue;

			currentSave.items.starrod = false;
			currentSave.items.power_stars = 0;
		}
	);

	//Logic options
	watch(
		() => currentSave.configs.logic.fast_bowser_castle,
		(newValue, oldValue) => {
			tracker.items.items.chapter8.castle_key.enabled = !newValue;

			currentSave.items.castle_key = 0;
		}
	);

	watch(
		() => currentSave.configs.logic.shopsanity,
		(newValue, oldValue) => {
			if (newValue) {
				tracker.configs.logic.rowf_shop.enabled = true;
				tracker.configs.logic.merlow.enabled = true;
			} else {
				currentSave.configs.logic.rowf_shop = false;
				currentSave.configs.logic.merlow = false;

				tracker.configs.logic.rowf_shop.enabled = false;
				tracker.configs.logic.merlow.enabled = false;
			}
		}
	);

	//Merlow cost randomized
	// watch(
	// 	() => currentSave.configs.logic.merlow,
	// 	(newValue, oldValue) => {
	// 		if (newValue) {
	// 			tracker.configs.logic.merlow_reward_cost_1.enabled = true;
	// 			tracker.configs.logic.merlow_reward_cost_2.enabled = true;
	// 			tracker.configs.logic.merlow_reward_cost_3.enabled = true;
	// 			tracker.configs.logic.merlow_reward_cost_4.enabled = true;
	// 			tracker.configs.logic.merlow_reward_cost_5.enabled = true;
	// 			tracker.configs.logic.merlow_reward_cost_6.enabled = true;
	// 		} else {
	// 			tracker.configs.logic.merlow_reward_cost_1.enabled = false;
	// 			tracker.configs.logic.merlow_reward_cost_2.enabled = false;
	// 			tracker.configs.logic.merlow_reward_cost_3.enabled = false;
	// 			tracker.configs.logic.merlow_reward_cost_4.enabled = false;
	// 			tracker.configs.logic.merlow_reward_cost_5.enabled = false;
	// 			tracker.configs.logic.merlow_reward_cost_6.enabled = false;
	// 		}
	// 	}
	// );

	watch(
		() => currentSave.configs.logic.letters_randomized,
		(newValue, oldValue) => {
			tracker.items.items.chapter2.parakarry_letters.enabled = !newValue;

			currentSave.items.parakarry_letters = 0;
		}
	);

	watch(welcomeMessageShown, (newValue, oldValue) => {
		localStorage.setItem('welcomeMessageShown', true);
	});

	return {
		data: currentSave,
		defaultSave: defaultSave,
		resetTrackerLayout: resetTrackerLayout,
		loadSeed: loadSeed,
		exportSave: exportSave,
		importSave: importSave,
		resetSave: resetSave,
		resetConfigs: resetConfigs,
		resetTrackerConfigs: resetTrackerConfigs,
		loadSave: loadSave,
		initInvisibleItems: initInvisibleItems
	};
});
