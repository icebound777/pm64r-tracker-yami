import { defineStore } from 'pinia';
import { reactive, ref, watch } from 'vue';

import { useTrackerStore } from './tracker';

export const useSaveStore = defineStore('save', () => {
	const tracker = useTrackerStore();

	const welcomeMessageShown = ref(false);

	const currentSave = reactive({
		configs: {
			randomizer: {},
			logic: {},
			tracker: {}
		}
	});

	const defaultSave = reactive({
		randomizer_seed: null,
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
			starrod: false,
			goombario: 0,
			kooper: 0,
			bombette: 0,
			parakarry: 0,
			bow: 0,
			watt: 0,
			sushie: 0,
			lakilester: 0,
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
			}
		},
		checks: {}
	});

	const defaultConfigs = {
		configs: {
			randomizer: {
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
			},
			logic: {
				fast_bowser_castle: false,
				super_blocks_randomized: false,
				shopsanity: false,
				rowf_shop: false,
				merlow: false,
				merlow_reward_cost_1: 1,
				merlow_reward_cost_2: 1,
				merlow_reward_cost_3: 1,
				merlow_reward_cost_4: 1,
				merlow_reward_cost_5: 1,
				merlow_reward_cost_6: 1,
				rip_cheato: 0,
				panels: false,
				overworld_coins: false,
				coin_blocks: false,
				multicoin_blocks_randomized: false,
				foliage_coins: false,
				letters_randomized: false,
				koopa_koot: false,
				koopa_koot_coins: false,
				dojo_randomized: false,
				trading_event_randomized: false
			},
			tracker: {
				map: true,
				always_show_super_blocks: false,
				compact_items: false,
				compact_item_background_hex_color: '#000000',
				compact_items_per_chapters: false,
				single_click_mode: false
			}
		}
	};

	const resetConfigs = () => {
		const defaultConfigsClone = JSON.parse(JSON.stringify(defaultConfigs));
		Object.assign(currentSave, defaultConfigsClone);
	};

	const resetSave = () => {
		const defaultSaveClone = JSON.parse(JSON.stringify(defaultSave));
		Object.assign(currentSave, defaultSaveClone);
	};

	const loadSeed = () => {
		const pmr_endpoint = 'https://paper-mario-randomizer-server.ue.r.appspot.com/randomizer_settings/';
		axios.get(pmr_endpoint + currentSave.randomizer_seed).then((response) => {
			console.log(response);
		});
	};

	const loadSave = () => {
		const save = localStorage.getItem('save');

		if (save) {
			Object.assign(currentSave, JSON.parse(save));
		} else {
			resetSave();
			resetConfigs();
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

	watch(
		() => currentSave.configs.logic.merlow,
		(newValue, oldValue) => {
			if (newValue) {
				tracker.configs.logic.merlow_reward_cost_1.enabled = true;
				tracker.configs.logic.merlow_reward_cost_2.enabled = true;
				tracker.configs.logic.merlow_reward_cost_3.enabled = true;
				tracker.configs.logic.merlow_reward_cost_4.enabled = true;
				tracker.configs.logic.merlow_reward_cost_5.enabled = true;
				tracker.configs.logic.merlow_reward_cost_6.enabled = true;
			} else {
				tracker.configs.logic.merlow_reward_cost_1.enabled = false;
				tracker.configs.logic.merlow_reward_cost_2.enabled = false;
				tracker.configs.logic.merlow_reward_cost_3.enabled = false;
				tracker.configs.logic.merlow_reward_cost_4.enabled = false;
				tracker.configs.logic.merlow_reward_cost_5.enabled = false;
				tracker.configs.logic.merlow_reward_cost_6.enabled = false;
			}
		}
	);

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
		resetSave: resetSave,
		resetConfigs: resetConfigs,
		loadSave: loadSave
	};
});
