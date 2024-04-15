import { defineStore } from 'pinia';
import { reactive, ref, watch } from 'vue';

import { useTrackerStore } from './tracker';

export const useSaveStore = defineStore('save', () => {
	const tracker = useTrackerStore();

	const welcomeMessageShown = ref(false);
	const resetTrackerLayout = ref(false);

	const currentSave = reactive({
		items: {
			eldstar_dungeon_shuffle: 0,
			mamar_dungeon_shuffle: 0,
			skolar_dungeon_shuffle: 0,
			muskular_dungeon_shuffle: 0,
			misstar_dungeon_shuffle: 0,
			klevar_dungeon_shuffle: 0,
			kalmar_dungeon_shuffle: 0
		},
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
		notes: '',
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
			eldstar_chapter_disabled: false,
			mamar_chapter_disabled: false,
			skolar_chapter_disabled: false,
			muskular_chapter_disabled: false,
			misstar_chapter_disabled: false,
			klevar_chapter_disabled: false,
			kalmar_chapter_disabled: false,
			starrod: false,
			goombario: 0,
			kooper: 0,
			bombette: 0,
			parakarry: 0,
			bow: 0,
			watt: 0,
			sushie: 0,
			lakilester: 0,
			goombario_rank: 0,
			kooper_rank: 0,
			bombette_rank: 0,
			parakarry_rank: 0,
			bow_rank: 0,
			watt_rank: 0,
			sushie_rank: 0,
			lakilester_rank: 0,
			ultra_stone: false,
			boots: 0,
			hammer: 0,
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
		required_star_spirits: 7,
		prologue_open: false,
		mt_rugged_open: false,
		forever_forest_open: false,
		toybox_open: false,
		whale_open: false,
		chapter_7_bridge_open: false,
		blue_house_open: false,
		gear_shuffle: 'vanilla',
		shuffle_dungeon_entrances: false,
		magical_seed_required: 4,
		starting_location: 65796,
		star_hunt_enabled: false,
		star_hunt_star_count: 120,
		star_hunt_ends_game: false
	};

	const defaultLogicConfigs = {
		fast_bowser_castle: false,
		super_blocks_randomized: false,
		shopsanity: false,
		rowf_shop: false,
		merlow: false,
		merlow_rewards_pricing: 'normal',
		merlow_reward_cost_1: 10,
		merlow_reward_cost_2: 20,
		merlow_reward_cost_3: 30,
		merlow_reward_cost_4: 40,
		merlow_reward_cost_5: 50,
		merlow_reward_cost_6: 60,
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
		trading_event_randomized: false,
		limit_chapter_logic: false,
		cook_without_frying_pan: false
	};

	const defaultTrackerConfigs = {
		deactivate_layout_system: false,
		no_layout_width: 400,
		map: true,
		map_text_size: 'sm',
		always_show_super_blocks: false,
		star_menu_enabled: false,
		item_icon_size: 'md',
		item_gap: 0.5,
		compact_items: false,
		compact_item_background_hex_color: '#000000',
		compact_item_show_letters: false,
		compact_item_show_favors: false,
		compact_item_show_trading_events: false,
		compact_items_per_chapters: false,
		compact_items_per_chapters: false,
		competitive_mode: false,
		missing_items_in_grayscale: false,
		deactivate_items_tooltips: false,
		notes: false
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

	const resetSave = (ap = false, noChecks = false, noItems = false) => {
		const defaultSaveClone = JSON.parse(JSON.stringify(defaultSave));

		if (ap) {
			delete defaultSaveClone.merlow_items;
			delete defaultSaveClone.hand_ins;
			delete defaultSaveClone.notes;
			delete defaultSaveClone.randomizer_seed;

			delete defaultSaveClone.eldstar;
			delete defaultSaveClone.mamar;
			delete defaultSaveClone.skolar;
			delete defaultSaveClone.muskular;
			delete defaultSaveClone.misstar;
			delete defaultSaveClone.klevar;
			delete defaultSaveClone.kalmar;
			delete defaultSaveClone.eldstar_difficulty;
			delete defaultSaveClone.mamar_difficulty;
			delete defaultSaveClone.skolar_difficulty;
			delete defaultSaveClone.muskular_difficulty;
			delete defaultSaveClone.misstar_difficulty;
			delete defaultSaveClone.klevar_difficulty;
			delete defaultSaveClone.kalmar_difficulty;
			delete defaultSaveClone.eldstar_dungeon_shuffle;
			delete defaultSaveClone.mamar_dungeon_shuffle;
			delete defaultSaveClone.skolar_dungeon_shuffle;
			delete defaultSaveClone.muskular_dungeon_shuffle;
			delete defaultSaveClone.misstar_dungeon_shuffle;
			delete defaultSaveClone.klevar_dungeon_shuffle;
			delete defaultSaveClone.kalmar_dungeon_shuffle;
			delete defaultSaveClone.eldstar_chapter_disabled;
			delete defaultSaveClone.mamar_chapter_disabled;
			delete defaultSaveClone.skolar_chapter_disabled;
			delete defaultSaveClone.muskular_chapter_disabled;
			delete defaultSaveClone.misstar_chapter_disabled;
			delete defaultSaveClone.klevar_chapter_disabled;
			delete defaultSaveClone.kalmar_chapter_disabled;
			delete defaultSaveClone.starrod;
		}

		if (noChecks) {
			delete defaultSaveClone.checks;
		}

		if (noItems) {
			delete defaultSaveClone.items;
		}

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
				console.log(randomizerData);

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
				currentSave.configs.randomizer.blue_house_open = randomizerData.BlueHouseOpen;

				if (randomizerData.GearShuffleMode == 0) {
					currentSave.configs.randomizer.gear_shuffle = 'vanilla';
				}

				if (randomizerData.GearShuffleMode == 1) {
					currentSave.configs.randomizer.gear_shuffle = 'vgs';
				}

				if (randomizerData.GearShuffleMode == 2) {
					currentSave.configs.randomizer.gear_shuffle = 'full_shuffle';
				}

				currentSave.configs.randomizer.shuffle_dungeon_entrances = randomizerData.ShuffleDungeonEntrances;
				currentSave.configs.randomizer.magical_seed_required = randomizerData.MagicalSeedsRequired;

				if (currentSave.configs.randomizer.magical_seed_required > 4) {
					currentSave.configs.randomizer.magical_seed_required = 4;
				}

				currentSave.configs.randomizer.starting_location = randomizerData.StartingMap;
				currentSave.configs.randomizer.star_hunt_enabled = randomizerData.StarHunt;
				currentSave.configs.randomizer.star_hunt_star_count = randomizerData.StarHuntRequired;
				// currentSave.configs.randomizer.star_hunt_ends_game = randomizerData.StarHuntEndsGame;

				currentSave.configs.logic.required_star_spirits = randomizerData.StarWaySpiritsNeededCnt;
				currentSave.configs.logic.fast_bowser_castle = randomizerData.BowsersCastleMode != 0 ? true : false;
				currentSave.configs.logic.shopsanity = randomizerData.IncludeShops;
				currentSave.configs.logic.rowf_shop = randomizerData.ProgressionOnRowf;
				currentSave.configs.logic.merlow = randomizerData.ProgressionOnMerlow;

				if (randomizerData.MerlowRewardPricing == 0) {
					currentSave.configs.logic.merlow_rewards_pricing = 'cheap';
				}

				if (randomizerData.MerlowRewardPricing == 1) {
					currentSave.configs.logic.merlow_rewards_pricing = 'normal';
				}

				currentSave.configs.logic.rip_cheato = randomizerData.RipCheatoItemsInLogic;
				currentSave.configs.logic.panels = randomizerData.IncludePanels;
				currentSave.configs.logic.overworld_coins = randomizerData.IncludeCoinsOverworld;
				currentSave.configs.logic.coin_blocks = randomizerData.IncludeCoinsBlocks;
				currentSave.configs.logic.super_and_multicoin_blocks_randomized = randomizerData.ShuffleBlocks;
				currentSave.configs.logic.foliage_coins = randomizerData.IncludeCoinsFoliage;
				currentSave.configs.logic.partners_always_usable = randomizerData.PartnersAlwaysUsable;
				currentSave.configs.logic.letters_randomized = randomizerData.IncludeLettersMode == 2 || randomizerData.IncludeLettersMode == 3 ? true : false;
				currentSave.configs.logic.koopa_koot = randomizerData.IncludeFavorsMode == 2 || randomizerData.IncludeCoinsFavors ? true : false;
				currentSave.configs.logic.koopa_koot_coins = randomizerData.IncludeCoinsFavors;
				currentSave.configs.logic.dojo_randomized = randomizerData.IncludeDojo;
				currentSave.configs.logic.trading_event_randomized = randomizerData.IncludeRadioTradeEvent;
				currentSave.configs.logic.limit_chapter_logic = randomizerData.LimitChapterLogic;
				currentSave.configs.logic.cook_without_frying_pan = randomizerData.CookWithoutFryingPan;

				currentSave.items.boots = randomizerData.StartingBoots + 1;
				currentSave.items.hammer = randomizerData.StartingHammer + 1;

				let arrayofStartingItemsToCheck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
				for (let i = 0; i < arrayofStartingItemsToCheck.length; i++) {
					let itemToCheck = arrayofStartingItemsToCheck[i];
					let itemToCheckName = 'StartingItem' + itemToCheck;
					let itemToCheckValue = randomizerData[itemToCheckName];

					switch (itemToCheckValue) {
						case 0x000f:
							currentSave.items.ultra_stone = true;
							break;

						case 0x0012:
							currentSave.items.pulse_stone = true;
							break;

						case 0x0014:
							currentSave.items.palace_key = true;
							break;

						case 0x0015:
							currentSave.items.lunar_stone = true;
							break;

						case 0x0016:
							currentSave.items.pyramid_stone = true;
							break;

						case 0x0017:
							currentSave.items.diamond_stone = true;
							break;

						case 0x0019:
							currentSave.items.kooper_shell = true;
							break;

						case 0x001b:
							currentSave.items.forest_pass = true;
							break;

						case 0x001c:
							currentSave.items.weight = true;
							break;

						case 0x001d:
							currentSave.items.boo_portrait = true;
							break;

						case 0x001e:
							currentSave.items.crystal_berry = true;
							break;

						case 0x0020:
							currentSave.items.storeroom_key = true;
							break;

						case 0x0021:
							currentSave.items.toy_train = true;
							break;

						case 0x0022:
							currentSave.items.record = true;
							break;

						case 0x0023:
							currentSave.items.frying_pan = true;
							break;

						case 0x0024:
							currentSave.items.dictionary = true;
							break;

						case 0x0025:
							currentSave.items.mystery_note = true;
							break;

						case 0x0027:
							currentSave.items.koopa_koot_favors.crystal_ball = true;
							break;

						case 0x0029:
							currentSave.items.cookbook = true;
							break;

						case 0x002a:
							currentSave.items.jade_raven = true;
							break;

						case 0x002b:
							currentSave.items.pink_magical_seed = true;
							break;

						case 0x002c:
							currentSave.items.purple_magical_seed = true;
							break;

						case 0x002d:
							currentSave.items.green_magical_seed = true;
							break;

						case 0x002e:
							currentSave.items.yellow_magical_seed = true;
							break;

						case 0x0030:
							currentSave.items.calculator = true;
							break;

						case 0x0031:
							currentSave.items.bucket = true;
							break;

						case 0x0032:
							currentSave.items.scarf = true;
							break;

						case 0x0033:
							currentSave.items.red_key = true;
							break;

						case 0x0034:
							currentSave.items.blue_key = true;
							break;

						//LETTERS GOES HERE
						case 0x0036:
							currentSave.items.letters.merlon = true;
							break;

						case 0x0037:
							currentSave.items.letters.goompa = true;
							break;

						case 0x0038:
							currentSave.items.letters.mort_t = true;
							break;

						case 0x0039:
							currentSave.items.letters.russ_t = true;
							break;

						case 0x003a:
							currentSave.items.letters.mayor_penguin = true;
							break;

						case 0x003b:
							currentSave.items.letters.merlow = true;
							break;

						case 0x003c:
							currentSave.items.letters.fice_t = true;
							break;

						case 0x003d:
							currentSave.items.letters.nomadimouse = true;
							break;

						case 0x003e:
							currentSave.items.letters.minh_t = true;
							break;

						case 0x0040:
						case 0x0052:
							currentSave.items.letters.goompapa++;
							break;

						case 0x0041:
							currentSave.items.letters.igor = true;
							break;

						case 0x0045:
							currentSave.items.letters.franky = true;
							break;

						case 0x0046:
							currentSave.items.letters.muss_t = true;
							break;

						case 0x0047:
						case 0x0049:
							currentSave.items.letters.koover++;
							break;

						case 0x0048:
							currentSave.items.letters.fishmael = true;
							break;

						case 0x004a:
							currentSave.items.letters.mr_e = true;
							break;

						case 0x004b:
							currentSave.items.letters.miss_t = true;
							break;

						case 0x004c:
							currentSave.items.letters.little_mouser = true;
							break;

						case 0x004f:
							currentSave.items.letters.red_yoshi_kid = true;
							break;

						case 0x004e:
						case 0x0050:
							currentSave.items.letters.dane_t++;
							break;

						case 0x0051:
							currentSave.items.letters.frost_t = true;
							break;

						case 0x0054:
							currentSave.items.letters.kolorado = true;
							break;

						case 0x0053:
							currentSave.items.artifact = true;
							break;

						case 0x0056:
							currentSave.items.dolly = true;
							break;

						case 0x0057:
							currentSave.items.water_stone = true;
							break;

						case 0x0058:
							currentSave.items.magical_bean = true;
							break;

						case 0x0059:
							currentSave.items.fertile_soil = true;
							break;

						case 0x005a:
							currentSave.items.miracle_water = true;
							break;

						case 0x005b:
							currentSave.volcano_vase = true;
							break;

						case 0x005c:
							currentSave.items.koopa_koot_favors.tape = true;
							break;

						case 0x0067:
							currentSave.items.lyrics = true;
							break;

						case 0x0068:
							currentSave.items.melody = true;
							break;

						case 0x0069:
							currentSave.items.mailbag = true;
							break;

						case 0x006b:
							currentSave.items.odd_key = true;
							break;

						case 0x006c:
							currentSave.items.star_stone = true;
							break;

						case 0x006e:
							currentSave.items.koopa_koot_favors.koopa_legends = true;
							break;

						case 0x006f:
							currentSave.items.koopa_koot_favors.luigi_autograph = true;
							break;

						case 0x0070:
							currentSave.items.koopa_koot_favors.empty_wallet = true;
							break;

						case 0x0071:
							currentSave.items.koopa_koot_favors.merluvlee_autograph = true;
							break;

						case 0x0073:
							currentSave.items.koopa_koot_favors.old_photo = true;
							break;

						case 0x0074:
							currentSave.items.koopa_koot_favors.glasses = true;
							break;

						case 0x0076:
							currentSave.items.koopa_koot_favors.package = true;
							break;

						case 0x0077:
							currentSave.items.koopa_koot_favors.red_jar = true;
							break;

						case 0x0079:
							currentSave.items.warehouse_key = true;
							break;

						case 0x016d:
						case 0x016e:
						case 0x016f:
						case 0x0170:
							currentSave.items.fortress_key++;
							break;

						case 0x0171:
						case 0x0172:
						case 0x0173:
						case 0x0174:
							currentSave.items.ruins_key++;
							break;

						case 0x0175:
						case 0x0176:
						case 0x0177:
							currentSave.items.tubba_castle_key++;
							break;

						case 0x0178:
						case 0x0179:
						case 0x017a:
						case 0x017b:
						case 0x017c:
							currentSave.items.castle_key++;
							break;

						case 0x017d:
						case 0x017e:
							currentSave.items.prison_key++;
							break;

						case 0x00ac:
							currentSave.items.koopa_koot_favors.coconut = true;
							currentSave.items.trading_event_toad.coconut = true;
							break;

						case 0x008f:
							currentSave.items.koopa_koot_favors.sleepy_sheep = true;
							break;

						case 0x00c3:
							currentSave.items.koopa_koot_favors.koopa_teas = true;
							break;

						case 0x0089:
							currentSave.items.koopa_koot_favors.tasty_tonic = true;
							break;

						case 0x0095:
							currentSave.items.koopa_koot_favors.life_shroom = true;
							break;

						case 0x00d6:
							currentSave.items.koopa_koot_favors.nutty_cake = true;
							currentSave.items.trading_event_toad.nutty_cake = true;
							break;

						case 0x00b5:
							currentSave.items.koopa_koot_favors.koopasta = true;
							break;

						case 0x009d:
							currentSave.items.koopa_koot_favors.lime = true;
							break;

						case 0x00d3:
							currentSave.items.koopa_koot_favors.kooky_cookie = true;
							break;

						case 0x00a6:
							currentSave.items.koopa_koot_favors.koopa_leaf = true;
							break;

						case 0x00c1:
							currentSave.items.cake = true;
							break;

						case 0x00aa:
							if (currentSave.configs.logic.cook_without_frying_pan) {
								currentSave.items.cake = true;
							}
							break;

						case 0x00cb:
							currentSave.items.anti_guy = true;
							break;
					}
				}
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
		}
	);

	watch(
		() => currentSave.configs.randomizer.blue_house_open,
		(newValue, oldValue) => {
			tracker.items.items.other.odd_key.enabled = !newValue;
		}
	);

	watch(
		() => currentSave.configs.randomizer.star_hunt_enabled,
		(newValue, oldValue) => {
			tracker.configs.randomizer.star_hunt_star_count.enabled = newValue;
			// tracker.configs.randomizer.star_hunt_ends_game.enabled = newValue;

			tracker.items.stars.power_stars.enabled = newValue;
			tracker.items.stars.starrod.enabled = !newValue;
		}
	);

	watch(
		() => currentSave.configs.randomizer.star_hunt_star_count,
		(newValue, oldValue) => {
			tracker.items.stars.power_stars.max = newValue;
		}
	);

	//Logic options
	watch(
		() => currentSave.configs.logic.fast_bowser_castle,
		(newValue, oldValue) => {
			tracker.items.items.chapter8.castle_key.enabled = !newValue;
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
	watch(
		() => currentSave.configs.logic.merlow,
		(newValue, oldValue) => {
			tracker.configs.logic.merlow_rewards_pricing.enabled = newValue;

			// if (newValue) {
			// 	tracker.configs.logic.merlow_reward_cost_1.enabled = true;
			// 	tracker.configs.logic.merlow_reward_cost_2.enabled = true;
			// 	tracker.configs.logic.merlow_reward_cost_3.enabled = true;
			// 	tracker.configs.logic.merlow_reward_cost_4.enabled = true;
			// 	tracker.configs.logic.merlow_reward_cost_5.enabled = true;
			// 	tracker.configs.logic.merlow_reward_cost_6.enabled = true;
			// } else {
			// 	tracker.configs.logic.merlow_reward_cost_1.enabled = false;
			// 	tracker.configs.logic.merlow_reward_cost_2.enabled = false;
			// 	tracker.configs.logic.merlow_reward_cost_3.enabled = false;
			// 	tracker.configs.logic.merlow_reward_cost_4.enabled = false;
			// 	tracker.configs.logic.merlow_reward_cost_5.enabled = false;
			// 	tracker.configs.logic.merlow_reward_cost_6.enabled = false;
			// }
		}
	);

	watch(
		() => currentSave.configs.logic.merlow_rewards_pricing,
		(newValue, oldValue) => {
			switch (newValue) {
				case 'normal':
					currentSave.configs.logic.merlow_reward_cost_1 = 10;
					currentSave.configs.logic.merlow_reward_cost_2 = 20;
					currentSave.configs.logic.merlow_reward_cost_3 = 30;
					currentSave.configs.logic.merlow_reward_cost_4 = 40;
					currentSave.configs.logic.merlow_reward_cost_5 = 50;
					currentSave.configs.logic.merlow_reward_cost_6 = 60;
					break;

				case 'cheap':
					currentSave.configs.logic.merlow_reward_cost_1 = 5;
					currentSave.configs.logic.merlow_reward_cost_2 = 10;
					currentSave.configs.logic.merlow_reward_cost_3 = 15;
					currentSave.configs.logic.merlow_reward_cost_4 = 20;
					currentSave.configs.logic.merlow_reward_cost_5 = 25;
					currentSave.configs.logic.merlow_reward_cost_6 = 30;
					break;
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
