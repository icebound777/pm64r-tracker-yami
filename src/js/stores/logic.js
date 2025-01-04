//TODO: Add tricks tracker

import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';

import { useSaveStore } from './save';
import { useTrackerStore } from './tracker';

export const useLogicStore = defineStore('logic', () => {
	const save = useSaveStore();
	const tracker = useTrackerStore();

	const upArrow = '&#x25B2;';
	const downArrow = '&#x25BC;';
	const leftArrow = '&#x25C0;';
	const rightArrow = '&#x25B6;';

	const flags = reactive({
		//Active
		yellow_blocks: () => {
			return save.data.items.hammer >= 1 || flags.partner('bombette');
		},
		stone_blocks: () => {
			return save.data.items.hammer >= 2;
		},
		ultra_blocks: () => {
			return save.data.items.hammer >= 3;
		},
		jump_coin_blocks: () => {
			return save.data.items.boots >= 1 || flags.partner('kooper');
		},
		jump_ledges: () => {
			return save.data.items.boots >= 1 || flags.partner('parakarry');
		},
		ultra_jump_blocks: () => {
			return save.data.items.boots >= 3;
		},
		panels: () => {
			return save.data.items.boots >= 2 || save.data.items.hammer >= 3;
		},
		trees: () => {
			return save.data.items.hammer >= 1 || flags.partner('bombette');
		},
		ground_blocks: () => {
			return save.data.items.hammer >= 1 || save.data.items.boots >= 2 || flags.partner('kooper') || flags.partner('bombette');
		},
		sewer_shortcut_pipes: () => {
			return save.data.items.boots >= 1;
		},

		//Passives
		partner(name) {
			if (save.data.configs.logic.partners_always_usable) {
				return true;
			} else {
				return save.data.items[name];
			}
		},
		star_spirits_count: () => {
			let star_spirits = 0;

			if (save.data.items.eldstar) {
				star_spirits++;
			}

			if (save.data.items.mamar) {
				star_spirits++;
			}

			if (save.data.items.skolar) {
				star_spirits++;
			}

			if (save.data.items.muskular) {
				star_spirits++;
			}

			if (save.data.items.misstar) {
				star_spirits++;
			}

			if (save.data.items.klevar) {
				star_spirits++;
			}

			if (save.data.items.kalmar) {
				star_spirits++;
			}

			return star_spirits;
		},
		deliver_letters: () => {
			return flags.partner('parakarry');
		},
		can_koot: () => {
			return save.data.items.hammer >= 1;
		},
		letters_count: () => {
			if (save.data.configs.logic.letters_randomized) {
				let letters = 0;

				if (save.data.items.letters.goompa) {
					letters++;
				}

				letters += save.data.items.letters.goompapa;

				if (save.data.items.letters.merlon) {
					letters++;
				}

				if (save.data.items.letters.merlow) {
					letters++;
				}

				if (save.data.items.letters.muss_t) {
					letters++;
				}

				if (save.data.items.letters.fice_t) {
					letters++;
				}

				if (save.data.items.letters.russ_t) {
					letters++;
				}

				if (save.data.items.letters.minh_t) {
					letters++;
				}

				if (save.data.items.letters.miss_t) {
					letters++;
				}

				if (save.data.items.letters.fishmael) {
					letters++;
				}

				letters += save.data.items.letters.dane_t;

				if (save.data.items.letters.kolorado) {
					letters++;
				}

				if (save.data.items.letters.mort_t) {
					letters++;
				}

				letters += save.data.items.letters.koover;

				if (save.data.items.letters.nomadimouse) {
					letters++;
				}

				if (save.data.items.letters.little_mouser) {
					letters++;
				}

				if (save.data.items.letters.mr_e) {
					letters++;
				}

				if (save.data.items.letters.igor) {
					letters++;
				}

				if (save.data.items.letters.franky) {
					letters++;
				}

				if (save.data.items.letters.red_yoshi_kid) {
					letters++;
				}

				if (save.data.items.letters.mayor_penguin) {
					letters++;
				}

				if (save.data.items.letters.frost_t) {
					letters++;
				}

				return letters;
			} else {
				return save.data.items.parakarry_letters;
			}
		},
		magical_seeds_count: () => {
			// let magical_seeds = 0;

			// if (save.data.items.pink_magical_seed) {
			// 	magical_seeds++;
			// }

			// if (save.data.items.purple_magical_seed) {
			// 	magical_seeds++;
			// }

			// if (save.data.items.green_magical_seed) {
			// 	magical_seeds++;
			// }

			// if (save.data.items.yellow_magical_seed) {
			// 	magical_seeds++;
			// }

			// return magical_seeds;

			return save.data.items.magical_seeds;
		},

		//Dungeons Requirements
		dungeon_entrance_requirements: (dungeon) => {
			let requirements = {
				0: false,
				1: flags.koopa_village() && save.data.items.kooper,
				2: flags.dry_dry_desert() && save.data.items.pulse_stone,
				3: flags.gusty_gulch() && flags.partner('parakarry'),
				4: flags.dungeon_entrance_requirements_toybox(),
				5: flags.lava_lava_island_jungle_behind_raven_statue() && save.data.items.boots >= 1,
				6: flags.toad_town() && flags.magical_seeds_count() >= save.data.configs.randomizer.magical_seed_required,
				7: flags.shiver_mountain_tunnel() && save.data.items.star_stone
			};

			return requirements[dungeon];
		},
		dungeon_requirements: (dungeon) => {
			if (save.data.configs.randomizer.shuffle_dungeon_entrances) {
				let stars = {
					1: 'eldstar',
					2: 'mamar',
					3: 'skolar',
					4: 'muskular',
					5: 'misstar',
					6: 'klevar',
					7: 'kalmar'
				};

				return flags.dungeon_entrance_requirements(save.data.items[`${stars[dungeon]}_dungeon_shuffle`]);
			} else {
				return flags.dungeon_entrance_requirements(dungeon);
			}
		},
		dungeon_entrance_requirements_toybox: () => {
			if (save.data.configs.randomizer.toybox_open) {
				return flags.toad_town() && flags.jump_ledges();
			} else {
				return flags.toad_town() && flags.jump_ledges() && flags.partner('bow');
			}
		},
		dungeon_checks_available: (dungeon) => {
			let stars = {
				1: 'eldstar',
				2: 'mamar',
				3: 'skolar',
				4: 'muskular',
				5: 'misstar',
				6: 'klevar',
				7: 'kalmar'
			};

			let mapCategories = {
				1: 'koopa_bros_fortress',
				2: 'dry_dry_ruins',
				3: 'tubba_blubba_castle',
				4: 'toybox',
				5: 'mt_lavalava',
				6: 'flower_fields',
				7: 'crystal_palace'
			};

			let found_dungeon = 0;

			for (let i = 1; i <= 7; i++) {
				if (save.data.items[`${stars[i]}_dungeon_shuffle`] == dungeon) {
					found_dungeon = i;
				}
			}

			if (found_dungeon == 0) {
				return flags.dungeon_entrance_requirements(dungeon);
			} else {
				return getTotalAvailableChecksOnMap(mapCategories[found_dungeon]) - getTotalAvailableCheckedChecksOnMap(mapCategories[found_dungeon]);
			}
		},
		dungeon_checks_depleted: (dungeon) => {
			let stars = {
				1: 'eldstar',
				2: 'mamar',
				3: 'skolar',
				4: 'muskular',
				5: 'misstar',
				6: 'klevar',
				7: 'kalmar'
			};

			let mapCategories = {
				1: 'koopa_bros_fortress',
				2: 'dry_dry_ruins',
				3: 'tubba_blubba_castle',
				4: 'toybox',
				5: 'mt_lavalava',
				6: 'flower_fields',
				7: 'crystal_palace'
			};

			let found_dungeon = 0;

			for (let i = 1; i <= 7; i++) {
				if (save.data.items[`${stars[i]}_dungeon_shuffle`] == dungeon) {
					found_dungeon = i;
				}
			}

			if (found_dungeon == 0) {
				return false;
			} else {
				return getTotalChecksOnMap(mapCategories[found_dungeon]) - getTotalCheckedChecksOnMap(mapCategories[found_dungeon]) > 0 ? false : true;
			}
		},

		//LCL
		lcl: (chapter, isDungeon = false) => {
			if (save.data.configs.logic.limit_chapter_logic) {
				let stars = {
					1: 'eldstar',
					2: 'mamar',
					3: 'skolar',
					4: 'muskular',
					5: 'misstar',
					6: 'klevar',
					7: 'kalmar'
				};

				if (save.data.configs.randomizer.shuffle_dungeon_entrances && isDungeon) {
					for (let i = 1; i <= 7; i++) {
						if (!save.data.items[`${stars[i]}_chapter_disabled`] && save.data.items[`${stars[chapter]}_dungeon_shuffle`] == i) {
							return true;
						}
					}

					return false;
				} else {
					return !save.data.items[`${stars[chapter]}_chapter_disabled`];
				}
			} else {
				return true;
			}
		},

		//Locations
		goomba_village: () => {
			if (save.data.configs.randomizer.starting_location == tracker.startingLocations.random) {
				return false;
			}

			switch (save.data.configs.randomizer.starting_location) {
				case tracker.startingLocations.goomba_village:
					return true;

				default:
					if (flags.toad_town() && (save.data.configs.randomizer.prologue_open || (flags.stone_blocks() && flags.sewer_shortcut_pipes()))) {
						return true;
					}
			}

			return false;
		},
		toad_town: () => {
			if (save.data.configs.randomizer.starting_location == tracker.startingLocations.random) {
				return false;
			}

			switch (save.data.configs.randomizer.starting_location) {
				case tracker.startingLocations.goomba_village:
					if (save.data.configs.randomizer.prologue_open || flags.yellow_blocks()) {
						return true;
					}

					return false;

				case tracker.startingLocations.dry_dry_outpost:
					if (flags.jump_ledges()) {
						return true;
					}
					return false;

				default:
					return true;
			}
		},
		sewers: () => {
			return flags.toad_town() && flags.jump_ledges();
		},
		rip_cheato: () => {
			if (save.data.configs.randomizer.blue_house_open && flags.jump_ledges()) {
				return true;
			} else {
				if (save.data.items.odd_key && flags.jump_ledges()) {
					return true;
				} else {
					if (save.data.items.boots >= 2 && flags.partner('bombette') && flags.partner('sushie')) {
						return true;
					}
				}
			}

			return false;
		},
		koopa_village: () => {
			return flags.toad_town() && (flags.trees() || (flags.sewers() && flags.stone_blocks() && flags.sewer_shortcut_pipes()));
		},
		koopa_bros_fortress: () => {
			return flags.dungeon_requirements(1);
		},
		mt_rugged: (requiresBoots = true) => {
			if (save.data.configs.randomizer.starting_location == tracker.startingLocations.random) {
				return false;
			}

			switch (save.data.configs.randomizer.starting_location) {
				case tracker.startingLocations.dry_dry_outpost:
					return flags.jump_ledges();

				default:
					if (!flags.toad_town()) {
						return false;
					}

					if (requiresBoots && save.data.items.boots < 1) {
						return false;
					}

					return save.data.configs.randomizer.mt_rugged_open || flags.partner('bombette') || (flags.sewers() && flags.stone_blocks() && flags.sewer_shortcut_pipes());
			}
		},
		dry_dry_desert: () => {
			if (save.data.configs.randomizer.starting_location == tracker.startingLocations.random) {
				return false;
			}

			switch (save.data.configs.randomizer.starting_location) {
				case tracker.startingLocations.dry_dry_outpost:
					return true;

				default:
					if ((flags.mt_rugged() && flags.partner('parakarry')) || (flags.sewers() && flags.stone_blocks() && flags.sewer_shortcut_pipes())) {
						return true;
					}
			}

			return false;
		},
		dry_dry_ruins: (requireBoots = true, jumpLedgesRequired = true) => {
			if (flags.dungeon_requirements(2)) {
				if (requireBoots) {
					return save.data.items.boots >= 1;
				} else {
					if (jumpLedgesRequired) {
						return flags.jump_ledges();
					} else {
						return true;
					}
				}
			}

			return false;
		},
		forever_forest: () => {
			if (save.data.configs.randomizer.forever_forest_open) {
				return flags.toad_town();
			}
			if (flags.toad_town() && save.data.items.forest_pass) {
				return true;
			}
			return false;
		},
		boo_mansion: (requireBoots = true) => {
			if (requireBoots) {
				return (
					(save.data.items.boots >= 1 && flags.forever_forest()) ||
					(flags.sewers() && save.data.items.boots >= 2) ||
					(flags.rip_cheato() && flags.partner('bombette') && flags.partner('sushie'))
				);
			}

			return (
				flags.forever_forest() ||
				(((flags.sewers() && save.data.items.boots >= 2) || (flags.rip_cheato() && flags.partner('bombette') && flags.partner('sushie'))) && flags.sewer_shortcut_pipes())
			);
		},
		gusty_gulch: () => {
			return flags.boo_mansion() && save.data.items.boo_portrait;
		},
		tubba_blubba_castle: () => {
			return flags.dungeon_requirements(3);
		},
		toybox: (requireTrain = true, requireBoots = true) => {
			if (flags.dungeon_requirements(4)) {
				if (requireTrain) {
					if (save.data.configs.randomizer.toybox_open) {
						if (!save.data.items.toy_train) {
							return false;
						}
					} else {
						if (!save.data.items.toy_train || !(flags.partner('bow') && flags.toad_town())) {
							return false;
						}
					}
				}
				if (requireBoots) {
					if (save.data.items.boots >= 1) {
						return true;
					}
				} else {
					return true;
				}
			}

			return false;
		},
		toybox_jack_in_a_box: (requireTrain = true) => {
			return flags.toybox(requireTrain) && (save.data.items.boots >= 2 || save.data.items.hammer >= 1);
		},
		lava_lava_island: () => {
			if (save.data.configs.randomizer.starting_location == tracker.startingLocations.random) {
				return false;
			}

			switch (save.data.configs.randomizer.starting_location) {
				case tracker.startingLocations.yoshi_village:
					return true;

				default:
					if (save.data.configs.randomizer.whale_open) {
						return flags.toad_town();
					} else {
						return (
							(flags.toad_town() && flags.partner('watt') && (save.data.items.hammer >= 1 || save.data.items.boots >= 2 || flags.partner('bombette'))) ||
							(((flags.sewers() && save.data.items.boots >= 2 && save.data.items.sushie) || (flags.rip_cheato() && flags.partner('bombette') && flags.jump_ledges())) &&
								flags.sewer_shortcut_pipes())
						);
					}
			}
		},
		lava_lava_island_jungle_behind_raven_statue: () => {
			return flags.lava_lava_island() && flags.partner('sushie') && save.data.items.hammer >= 1 && save.data.items.jade_raven;
		},
		mt_lavalava: () => {
			return flags.dungeon_requirements(5);
		},
		flower_fields: () => {
			return flags.dungeon_requirements(6);
		},
		shiver_city: () => {
			if (flags.toad_town()) {
				if (
					((save.data.items.boots >= 2 && flags.partner('sushie')) || (flags.rip_cheato() && flags.partner('bombette'))) &&
					((save.data.configs.randomizer.chapter_7_bridge_open && flags.jump_ledges()) || flags.ultra_jump_blocks())
				) {
					return true;
				}
			}

			return false;
		},
		leave_shiver_city: () => {
			return flags.shiver_city() && save.data.items.warehouse_key;
		},
		shiver_mountain: () => {
			return flags.leave_shiver_city() && save.data.items.bucket && save.data.items.scarf && save.data.items.boots >= 2;
		},
		shiver_mountain_tunnel: () => {
			return flags.shiver_mountain() && flags.partner('kooper') && save.data.items.hammer >= 1;
		},
		crystal_palace: () => {
			return flags.dungeon_requirements(7);
		},
		star_haven: () => {
			if (save.data.configs.randomizer.star_hunt_enabled) {
				return save.data.items.power_stars >= save.data.configs.randomizer.star_hunt_star_count;
			} else {
				return flags.toad_town() && flags.star_spirits_count() >= 7 && flags.jump_ledges();
			}
		},
		west_bowser_castle: () => {
			return flags.star_haven();
		},
		east_bowser_castle: () => {
			return (
				flags.west_bowser_castle() &&
				save.data.items.castle_key >= 3 &&
				save.data.items.boots >= 1 &&
				flags.partner('lakilester') &&
				flags.partner('bow') &&
				flags.partner('parakarry') &&
				flags.partner('watt') &&
				flags.partner('sushie') &&
				flags.partner('bombette')
			);
		},
		peach_castle: () => {
			if (save.data.configs.randomizer.fast_bowser_castle) {
				return flags.star_haven();
			} else {
				return flags.east_bowser_castle() && save.data.items.castle_key >= 5;
			}
		}
	});

	const eldstar_dungeon_shuffle_icon = computed(() => {
		let stars = {
			1: 'eldstar',
			2: 'mamar',
			3: 'skolar',
			4: 'muskular',
			5: 'misstar',
			6: 'klevar',
			7: 'kalmar'
		};

		let found_dungeon = 0;

		for (let i = 1; i <= 7; i++) {
			if (save.data.items[`${stars[i]}_dungeon_shuffle`] == 1) {
				found_dungeon = i;
			}
		}

		if (stars[found_dungeon] !== undefined) {
			return `/images/stars/${stars[found_dungeon]}.webp`;
		}

		return null;
	});

	const eldstar_dungeon_shuffle_name = computed(() => {
		let stars = {
			1: 'eldstar',
			2: 'mamar',
			3: 'skolar',
			4: 'muskular',
			5: 'misstar',
			6: 'klevar',
			7: 'kalmar'
		};

		let dungeons = {
			1: 'Koopa Bros. Fortress',
			2: 'Dry Dry Ruins',
			3: 'Tubba Blubba Castle',
			4: "Shy Guy's Toybox",
			5: 'Mt. Lavalava',
			6: 'Flower Fields',
			7: 'Crystal Palace'
		};

		let found_dungeon = 0;

		for (let i = 1; i <= 7; i++) {
			if (save.data.items[`${stars[i]}_dungeon_shuffle`] == 1) {
				found_dungeon = i;
			}
		}

		if (dungeons[found_dungeon] !== undefined) {
			return dungeons[found_dungeon];
		}

		return 'Unknown Dungeon';
	});

	const mamar_dungeon_shuffle_icon = computed(() => {
		let stars = {
			1: 'eldstar',
			2: 'mamar',
			3: 'skolar',
			4: 'muskular',
			5: 'misstar',
			6: 'klevar',
			7: 'kalmar'
		};

		let found_dungeon = 0;

		for (let i = 1; i <= 7; i++) {
			if (save.data.items[`${stars[i]}_dungeon_shuffle`] == 2) {
				found_dungeon = i;
			}
		}

		if (stars[found_dungeon] !== undefined) {
			return `/images/stars/${stars[found_dungeon]}.webp`;
		}

		return null;
	});

	const mamar_dungeon_shuffle_name = computed(() => {
		let stars = {
			1: 'eldstar',
			2: 'mamar',
			3: 'skolar',
			4: 'muskular',
			5: 'misstar',
			6: 'klevar',
			7: 'kalmar'
		};

		let dungeons = {
			1: 'Koopa Bros. Fortress',
			2: 'Dry Dry Ruins',
			3: 'Tubba Blubba Castle',
			4: "Shy Guy's Toybox",
			5: 'Mt. Lavalava',
			6: 'Flower Fields',
			7: 'Crystal Palace'
		};

		let found_dungeon = 0;

		for (let i = 1; i <= 7; i++) {
			if (save.data.items[`${stars[i]}_dungeon_shuffle`] == 2) {
				found_dungeon = i;
			}
		}

		if (dungeons[found_dungeon] !== undefined) {
			return dungeons[found_dungeon];
		}

		return 'Unknown Dungeon';
	});

	const skolar_dungeon_shuffle_icon = computed(() => {
		let stars = {
			1: 'eldstar',
			2: 'mamar',
			3: 'skolar',
			4: 'muskular',
			5: 'misstar',
			6: 'klevar',
			7: 'kalmar'
		};

		let found_dungeon = 0;

		for (let i = 1; i <= 7; i++) {
			if (save.data.items[`${stars[i]}_dungeon_shuffle`] == 3) {
				found_dungeon = i;
			}
		}

		if (stars[found_dungeon] !== undefined) {
			return `/images/stars/${stars[found_dungeon]}.webp`;
		}

		return null;
	});

	const skolar_dungeon_shuffle_name = computed(() => {
		let stars = {
			1: 'eldstar',
			2: 'mamar',
			3: 'skolar',
			4: 'muskular',
			5: 'misstar',
			6: 'klevar',
			7: 'kalmar'
		};

		let dungeons = {
			1: 'Koopa Bros. Fortress',
			2: 'Dry Dry Ruins',
			3: 'Tubba Blubba Castle',
			4: "Shy Guy's Toybox",
			5: 'Mt. Lavalava',
			6: 'Flower Fields',
			7: 'Crystal Palace'
		};

		let found_dungeon = 0;

		for (let i = 1; i <= 7; i++) {
			if (save.data.items[`${stars[i]}_dungeon_shuffle`] == 3) {
				found_dungeon = i;
			}
		}

		if (dungeons[found_dungeon] !== undefined) {
			return dungeons[found_dungeon];
		}

		return 'Unknown Dungeon';
	});

	const muskular_dungeon_shuffle_icon = computed(() => {
		let stars = {
			1: 'eldstar',
			2: 'mamar',
			3: 'skolar',
			4: 'muskular',
			5: 'misstar',
			6: 'klevar',
			7: 'kalmar'
		};

		let found_dungeon = 0;

		for (let i = 1; i <= 7; i++) {
			if (save.data.items[`${stars[i]}_dungeon_shuffle`] == 4) {
				found_dungeon = i;
			}
		}

		if (stars[found_dungeon] !== undefined) {
			return `/images/stars/${stars[found_dungeon]}.webp`;
		}

		return null;
	});

	const muskular_dungeon_shuffle_name = computed(() => {
		let stars = {
			1: 'eldstar',
			2: 'mamar',
			3: 'skolar',
			4: 'muskular',
			5: 'misstar',
			6: 'klevar',
			7: 'kalmar'
		};

		let dungeons = {
			1: 'Koopa Bros. Fortress',
			2: 'Dry Dry Ruins',
			3: 'Tubba Blubba Castle',
			4: "Shy Guy's Toybox",
			5: 'Mt. Lavalava',
			6: 'Flower Fields',
			7: 'Crystal Palace'
		};

		let found_dungeon = 0;

		for (let i = 1; i <= 7; i++) {
			if (save.data.items[`${stars[i]}_dungeon_shuffle`] == 4) {
				found_dungeon = i;
			}
		}

		if (dungeons[found_dungeon] !== undefined) {
			return dungeons[found_dungeon];
		}

		return 'Unknown Dungeon';
	});

	const misstar_dungeon_shuffle_icon = computed(() => {
		let stars = {
			1: 'eldstar',
			2: 'mamar',
			3: 'skolar',
			4: 'muskular',
			5: 'misstar',
			6: 'klevar',
			7: 'kalmar'
		};

		let found_dungeon = 0;

		for (let i = 1; i <= 7; i++) {
			if (save.data.items[`${stars[i]}_dungeon_shuffle`] == 5) {
				found_dungeon = i;
			}
		}

		if (stars[found_dungeon] !== undefined) {
			return `/images/stars/${stars[found_dungeon]}.webp`;
		}

		return null;
	});

	const misstar_dungeon_shuffle_name = computed(() => {
		let stars = {
			1: 'eldstar',
			2: 'mamar',
			3: 'skolar',
			4: 'muskular',
			5: 'misstar',
			6: 'klevar',
			7: 'kalmar'
		};

		let dungeons = {
			1: 'Koopa Bros. Fortress',
			2: 'Dry Dry Ruins',
			3: 'Tubba Blubba Castle',
			4: "Shy Guy's Toybox",
			5: 'Mt. Lavalava',
			6: 'Flower Fields',
			7: 'Crystal Palace'
		};

		let found_dungeon = 0;

		for (let i = 1; i <= 7; i++) {
			if (save.data.items[`${stars[i]}_dungeon_shuffle`] == 5) {
				found_dungeon = i;
			}
		}

		if (dungeons[found_dungeon] !== undefined) {
			return dungeons[found_dungeon];
		}

		return 'Unknown Dungeon';
	});

	const klevar_dungeon_shuffle_icon = computed(() => {
		let stars = {
			1: 'eldstar',
			2: 'mamar',
			3: 'skolar',
			4: 'muskular',
			5: 'misstar',
			6: 'klevar',
			7: 'kalmar'
		};

		let found_dungeon = 0;

		for (let i = 1; i <= 7; i++) {
			if (save.data.items[`${stars[i]}_dungeon_shuffle`] == 6) {
				found_dungeon = i;
			}
		}

		if (stars[found_dungeon] !== undefined) {
			return `/images/stars/${stars[found_dungeon]}.webp`;
		}

		return null;
	});

	const klevar_dungeon_shuffle_name = computed(() => {
		let stars = {
			1: 'eldstar',
			2: 'mamar',
			3: 'skolar',
			4: 'muskular',
			5: 'misstar',
			6: 'klevar',
			7: 'kalmar'
		};

		let dungeons = {
			1: 'Koopa Bros. Fortress',
			2: 'Dry Dry Ruins',
			3: 'Tubba Blubba Castle',
			4: "Shy Guy's Toybox",
			5: 'Mt. Lavalava',
			6: 'Flower Fields',
			7: 'Crystal Palace'
		};

		let found_dungeon = 0;

		for (let i = 1; i <= 7; i++) {
			if (save.data.items[`${stars[i]}_dungeon_shuffle`] == 6) {
				found_dungeon = i;
			}
		}

		if (dungeons[found_dungeon] !== undefined) {
			return dungeons[found_dungeon];
		}

		return 'Unknown Dungeon';
	});

	const kalmar_dungeon_shuffle_icon = computed(() => {
		let stars = {
			1: 'eldstar',
			2: 'mamar',
			3: 'skolar',
			4: 'muskular',
			5: 'misstar',
			6: 'klevar',
			7: 'kalmar'
		};

		let found_dungeon = 0;

		for (let i = 1; i <= 7; i++) {
			if (save.data.items[`${stars[i]}_dungeon_shuffle`] == 1) {
				found_dungeon = i;
			}
		}

		if (stars[found_dungeon] !== undefined) {
			return `/images/stars/${stars[found_dungeon]}.webp`;
		}

		return null;
	});

	const kalmar_dungeon_shuffle_name = computed(() => {
		let stars = {
			1: 'eldstar',
			2: 'mamar',
			3: 'skolar',
			4: 'muskular',
			5: 'misstar',
			6: 'klevar',
			7: 'kalmar'
		};

		let dungeons = {
			1: 'Koopa Bros. Fortress',
			2: 'Dry Dry Ruins',
			3: 'Tubba Blubba Castle',
			4: "Shy Guy's Toybox",
			5: 'Mt. Lavalava',
			6: 'Flower Fields',
			7: 'Crystal Palace'
		};

		let found_dungeon = 0;

		for (let i = 1; i <= 7; i++) {
			if (save.data.items[`${stars[i]}_dungeon_shuffle`] == 1) {
				found_dungeon = i;
			}
		}

		if (dungeons[found_dungeon] !== undefined) {
			return dungeons[found_dungeon];
		}

		return 'Unknown Dungeon';
	});

	const checks = reactive({
		prologue: {
			name: 'Prologue',
			exists: () => {
				return true;
			},
			maps: {
				playground: {
					name: 'Playground',
					x: 1,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Furthest left bush (Hammer bush)',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks();
							},
							ap: [8112000021]
						},
						{
							name: 'Far right tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks();
							},
							ap: [8112000020]
						},
						{
							name: 'Top-left tree',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks();
							},
							ap: [8112000029]
						},
						{
							name: 'Bottom-left tree',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks();
							},
							ap: [8112000028]
						},
						{
							name: 'Bush 1',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks();
							},
							ap: [8112000022]
						},
						{
							name: 'Bush 2',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks();
							},
							ap: [8112000023]
						},
						{
							name: 'Bush 3',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks();
							},
							ap: [8112000024]
						},
						{
							name: 'Bush 4',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks();
							},
							ap: [8112000025]
						},
						{
							name: 'Bush 5',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks();
							},
							ap: [8112000026]
						},
						{
							name: 'Bush 6',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks();
							},
							ap: [8112000027]
						},
						{
							name: 'Block on the ground',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks() && flags.ground_blocks();
							},
							ap: [8112000030]
						}
					]
				},
				outside_playground: {
					name: 'Outside Playground',
					x: 2,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Right of stone block',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.goomba_village() && flags.panels();
							},
							ap: [8112000019]
						},
						{
							name: 'Item 1 above spring',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges();
							},
							ap: [8112000013]
						},
						{
							name: 'Item 2 above spring',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges();
							},
							ap: [8112000014]
						},
						{
							name: 'Item 3 above spring',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges();
							},
							ap: [8112000015]
						},
						{
							name: 'Item 4 above spring',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges();
							},
							ap: [8112000016]
						},
						{
							name: 'Far left ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges();
							},
							ap: [8112000012]
						},
						{
							name: 'Tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village() && flags.trees();
							},
							ap: [8112000018]
						},
						{
							name: 'Item on ledge above spring',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges();
							},
							ap: [8112000017]
						},
						{
							name: '? block above stone block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.jump_coin_blocks() && flags.stone_blocks();
							},
							ap: [8112000011]
						}
					]
				},
				outside_village: {
					name: 'Outside Village',
					x: 3,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item on ledge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges();
							},
							ap: [8112000031]
						},
						{
							name: 'Tree on ledge',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.trees();
							},
							ap: [8112000032]
						}
					]
				},
				mario_landing: {
					name: 'Mario Landing',
					x: 3,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Middle of the room',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.goomba_village() && flags.panels();
							},
							ap: [8112000000]
						}
					]
				},
				goomba_village: {
					name: 'Goomba Village',
					x: 4,
					y: 1,
					w: 1,
					h: 2,
					checks: [
						{
							name: 'Goombario',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village();
							},
							ap: [8112000009]
						},
						{
							name: 'Give Dolly to Goombaria',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village() && save.data.items.dolly;
							},
							ap: [8112000003]
						},
						{
							name: 'Goompa',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village();
							},
							ap: [8112000002]
						},
						{
							name: "Goompa's veranda",
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village();
							},
							ap: [8112000007]
						},
						{
							name: 'Tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village() && flags.trees();
							},
							ap: [8112000008]
						},
						{
							name: 'Goompa',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.goomba_village() && flags.deliver_letters() && save.data.items.letters.goompa;
							},
							ap: [8112000004]
						},
						{
							name: 'Goompapa',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.goomba_village() && flags.deliver_letters() && save.data.items.letters.goompapa >= 1;
							},
							ap: [8112000006]
						},
						{
							name: 'Goompapa 2',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.goomba_village() && flags.deliver_letters() && save.data.items.letters.goompapa >= 2;
							},
							ap: [8112000005]
						},
						{
							name: 'Bottom right bush',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village();
							},
							ap: [8112000010]
						},
						{
							name: 'Goompa (After Koopa Koot asks for his tape)',
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return (
									flags.goomba_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 1 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep
								);
							},
							ap: [8112000001]
						}
					]
				},
				goomba_road1: {
					name: 'Goomba Road 1',
					x: 5,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Left ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.goomba_village() && flags.yellow_blocks() && flags.jump_coin_blocks();
							},
							ap: [8112000035]
						},
						{
							name: 'Right ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.goomba_village() && flags.yellow_blocks() && flags.jump_coin_blocks();
							},
							ap: [8112000036]
						}
					]
				},
				goomba_road2: {
					name: 'Goomba Road 2',
					x: 6,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Red ? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village() && flags.yellow_blocks() && flags.jump_coin_blocks();
							},
							ap: [8112000033]
						},
						{
							name: 'Sign',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village() && flags.yellow_blocks();
							},
							ap: [8112000034]
						}
					]
				},
				red_blue_goomba: {
					name: 'Red & Blue Goomba',
					x: 7,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				outside_castle: {
					name: 'Outside Castle',
					x: 8,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				goomba_king_castle: {
					name: "Goomba King's Castle",
					x: 9,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: "Tree left of the Goomba King's Fortress",
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village() && flags.yellow_blocks() && flags.trees();
							},
							ap: [8112000040]
						},
						{
							name: 'Top near Toad Town entrance',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.toad_town() && flags.panels();
							},
							ap: [8112000042]
						},
						{
							name: 'Break brick block to spawn ? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_coin_blocks() && flags.ground_blocks();
							},
							ap: [8112000039]
						},
						{
							name: "Tree right of the Goomba King's Fortress (top left in the fence)",
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.toad_town() && flags.trees() && flags.jump_ledges();
							},
							ap: [8112000041]
						}
					]
				}
			}
		},
		toad_town: {
			name: 'Toad Town',
			exists: () => {
				return true;
			},
			maps: {
				outside_toad_town: {
					name: 'Outside Toad Town',
					x: 1,
					y: 3,
					w: 2,
					h: 1,
					checks: [
						{
							name: 'Chest on top of the town gate',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.trees() && flags.jump_ledges();
							},
							ap: [8112000037]
						},
						{
							name: '? block at the bottom of the steps',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_coin_blocks();
							},
							ap: [8112000038]
						}
					]
				},
				mario_house: {
					name: "Mario's House",
					x: 1,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: "Luigi (After Koopa Koot asks for Luigi's autograph)",
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return (
									flags.toad_town() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 1 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea
								);
							},
							ap: [8112000043]
						}
					]
				},
				castle_ruins: {
					name: 'Castle Ruins',
					x: 4,
					y: 1,
					w: 1,
					h: 2,
					checks: [
						{
							name: 'Muss T.',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.deliver_letters() && save.data.items.letters.muss_t;
							},
							ap: [8112000708]
						}
					]
				},
				shooting_star_summit_road: {
					name: 'Shooting Star Summit Road',
					x: 5,
					y: 1,
					w: 2,
					h: 2,
					checks: [
						{
							name: 'Right side of the bridge (Before the stairs)',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.toad_town() && flags.panels();
							},
							ap: [8112000153]
						}
					]
				},
				shooting_star_summit: {
					name: 'Shooting Star Summit',
					x: 7,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Behind the mountain on the left of the entrance',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges();
							},
							ap: [8112000154]
						},
						{
							name: 'On the first step',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && flags.panels();
							},
							ap: [8112000155]
						}
					]
				},
				merluvlee_house: {
					name: "Merluvlee's House",
					x: 7,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'In front of the pot in front of the house',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.toad_town() && flags.panels();
							},
							ap: [8112000185]
						},
						{
							name: 'Merlow',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && flags.deliver_letters() && save.data.items.letters.merlow;
							},
							ap: [8112000163]
						},
						{
							name: 'Give Merluvlee the Crystal Ball',
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return (
									flags.toad_town() &&
									flags.star_spirits_count() >= 2 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic &&
									save.data.items.koopa_koot_favors.crystal_ball
								);
							},
							ap: [8112000162]
						},
						{
							name: 'Merlow star pieces reward 1',
							icon: '/images/checks/shopsanity_merlow.webp',
							exists: () => {
								return save.data.configs.logic.merlow;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= save.data.configs.logic.merlow_reward_cost_1;
							},
							ap: [8112000179]
						},
						{
							name: 'Merlow star pieces reward 2',
							icon: '/images/checks/shopsanity_merlow.webp',
							exists: () => {
								return save.data.configs.logic.merlow;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= save.data.configs.logic.merlow_reward_cost_2;
							},
							ap: [8112000180]
						},
						{
							name: 'Merlow star pieces reward 3',
							icon: '/images/checks/shopsanity_merlow.webp',
							exists: () => {
								return save.data.configs.logic.merlow;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= save.data.configs.logic.merlow_reward_cost_3;
							},
							ap: [8112000181]
						},
						{
							name: 'Merlow star pieces reward 4',
							icon: '/images/checks/shopsanity_merlow.webp',
							exists: () => {
								return save.data.configs.logic.merlow;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= save.data.configs.logic.merlow_reward_cost_4;
							},
							ap: [8112000182]
						},
						{
							name: 'Merlow star pieces reward 5',
							icon: '/images/checks/shopsanity_merlow.webp',
							exists: () => {
								return save.data.configs.logic.merlow;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= save.data.configs.logic.merlow_reward_cost_5;
							},
							ap: [8112000183]
						},
						{
							name: 'Merlow star pieces reward 6',
							icon: '/images/checks/shopsanity_merlow.webp',
							exists: () => {
								return save.data.configs.logic.merlow;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= save.data.configs.logic.merlow_reward_cost_6;
							},
							ap: [8112000184]
						},
						{
							name: 'Merlow star pieces shop 1',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= 1;
							},
							ap: [8112000164]
						},
						{
							name: 'Merlow star pieces shop 2',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= 1;
							},
							ap: [8112000165]
						},
						{
							name: 'Merlow star pieces shop 3',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= 2;
							},
							ap: [8112000166]
						},
						{
							name: 'Merlow star pieces shop 4',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= 2;
							},
							ap: [8112000167]
						},
						{
							name: 'Merlow star pieces shop 5',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= 4;
							},
							ap: [8112000168]
						},
						{
							name: 'Merlow star pieces shop 6',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= 4;
							},
							ap: [8112000169]
						},
						{
							name: 'Merlow star pieces shop 7',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= 6;
							},
							ap: [8112000170]
						},
						{
							name: 'Merlow star pieces shop 8',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= 6;
							},
							ap: [8112000171]
						},
						{
							name: 'Merlow star pieces shop 9',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= 8;
							},
							ap: [8112000172]
						},
						{
							name: 'Merlow star pieces shop 10',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= 8;
							},
							ap: [8112000173]
						},
						{
							name: 'Merlow star pieces shop 11',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= 10;
							},
							ap: [8112000174]
						},
						{
							name: 'Merlow star pieces shop 12',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= 10;
							},
							ap: [8112000175]
						},
						{
							name: 'Merlow star pieces shop 13',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= 15;
							},
							ap: [8112000176]
						},
						{
							name: 'Merlow star pieces shop 14',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= 15;
							},
							ap: [8112000177]
						},
						{
							name: 'Merlow star pieces shop 15',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && save.data.items.star_pieces >= 20;
							},
							ap: [8112000178]
						}
					]
				},
				main_gate: {
					name: 'Main Gate',
					x: 3,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Shop item 1',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							},
							ap: [8112000054]
						},
						{
							name: 'Shop item 2',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							},
							ap: [8112000055]
						},
						{
							name: 'Shop item 3',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							},
							ap: [8112000056]
						},
						{
							name: 'Shop item 4',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							},
							ap: [8112000057]
						},
						{
							name: 'Shop item 5',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							},
							ap: [8112000058]
						},
						{
							name: 'Shop item 6',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							},
							ap: [8112000059]
						},
						{
							name: 'Give dictionary to Russ T.',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && save.data.items.dictionary;
							},
							ap: [8112000045]
						},
						{
							name: 'Item bottom left of the map',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.partner('sushie');
							},
							ap: [8112000044]
						},
						{
							name: 'By the three toad sisters',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.toad_town() && flags.panels();
							},
							ap: [8112000060]
						},
						{
							name: 'Miss T.',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.deliver_letters() && save.data.items.letters.miss_t;
							},
							ap: [8112000047]
						},
						{
							name: 'Russ T.',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.deliver_letters() && save.data.items.letters.russ_t;
							},
							ap: [8112000046]
						},
						{
							name: 'Give Koopa Leaf to Trading Event Toad',
							icon: '/images/checks/trading_event_randomized.webp',
							exists: () => {
								return save.data.configs.logic.trading_event_randomized;
							},
							available: () => {
								return flags.koopa_village() && flags.toad_town() && flags.star_spirits_count() >= 1 && save.data.items.trading_event_toad.koopa_leaf && save.data.items.hammer >= 1;
							},
							ap: [8112000048]
						},
						{
							name: 'Defeat Chan',
							icon: '/images/checks/dojo_randomized.webp',
							exists: () => {
								return save.data.configs.logic.dojo_randomized;
							},
							available: () => {
								return flags.toad_town() && (save.data.items.boots >= 1 || save.data.items.goombario || save.data.items.watt || save.data.items.sushie);
							},
							ap: [8112000049]
						},
						{
							name: 'Defeat Lee',
							icon: '/images/checks/dojo_randomized.webp',
							exists: () => {
								return save.data.configs.logic.dojo_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 2;
							},
							ap: [8112000050]
						},
						{
							name: 'Defeat Master',
							icon: '/images/checks/dojo_randomized.webp',
							exists: () => {
								return save.data.configs.logic.dojo_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 3;
							},
							ap: [8112000051]
						},
						{
							name: 'Defeat Master 2',
							icon: '/images/checks/dojo_randomized.webp',
							exists: () => {
								return save.data.configs.logic.dojo_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 4;
							},
							ap: [8112000052]
						},
						{
							name: 'Defeat Master 3',
							icon: '/images/checks/dojo_randomized.webp',
							exists: () => {
								return save.data.configs.logic.dojo_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 5;
							},
							ap: [8112000053]
						},
						{
							name: 'Super Block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.toad_town() && flags.jump_coin_blocks() && flags.jump_ledges() && flags.partner('sushie');
							},
							ap: [8112000134]
						}
					]
				},
				central_plaza: {
					name: 'Central Plaza',
					x: 4,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: "Tree by Merlon's House",
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.trees();
							},
							ap: [8112000066]
						},
						{
							name: 'Merlon',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.deliver_letters() && save.data.items.letters.merlon;
							},
							ap: [8112000064]
						},
						{
							name: 'Give Calculator to Rowf',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && save.data.items.calculator;
							},
							ap: [8112000062]
						},
						{
							name: 'Give Mailbag to the Postmaster in the Post Office',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && save.data.items.mailbag;
							},
							ap: [8112000063]
						},
						{
							name: "Ground pound inside Merlon's house three times",
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && save.data.items.boots >= 2;
							},
							ap: [8112000061]
						},
						{
							name: 'Minh T.',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.deliver_letters() && save.data.items.letters.minh_t;
							},
							ap: [8112000065]
						},
						{
							name: 'Rowf shop 1',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town();
							},
							ap: [8112000067]
						},
						{
							name: 'Rowf shop 2',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town();
							},
							ap: [8112000068]
						},
						{
							name: 'Rowf shop 3',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town();
							},
							ap: [8112000069]
						},
						{
							name: 'Rowf shop 4',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town();
							},
							ap: [8112000070]
						},
						{
							name: 'Rowf shop 5',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 1;
							},
							ap: [8112000071]
						},
						{
							name: 'Rowf shop 6',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 1;
							},
							ap: [8112000072]
						},
						{
							name: 'Rowf shop 7',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 1;
							},
							ap: [8112000073]
						},
						{
							name: 'Rowf shop 8',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 2;
							},
							ap: [8112000074]
						},
						{
							name: 'Rowf shop 9',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 2;
							},
							ap: [8112000075]
						},
						{
							name: 'Rowf shop 10',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 2;
							},
							ap: [8112000076]
						},
						{
							name: 'Rowf shop 11',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 3;
							},
							ap: [8112000077]
						},
						{
							name: 'Rowf shop 12',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 3;
							},
							ap: [8112000078]
						},
						{
							name: 'Rowf shop 13',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 3;
							},
							ap: [8112000079]
						},
						{
							name: 'Rowf shop 14',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 4;
							},
							ap: [8112000080]
						},
						{
							name: 'Rowf shop 15',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 4;
							},
							ap: [8112000081]
						},
						{
							name: 'Rowf shop 16',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 4;
							},
							ap: [8112000082]
						},
						{
							name: klevar_dungeon_shuffle_name,
							icon: klevar_dungeon_shuffle_icon,
							dungeon: 6,
							exists: () => {
								return save.data.configs.randomizer.shuffle_dungeon_entrances;
							},
							available: () => {
								return flags.dungeon_checks_available(6);
							}
						}
					]
				},
				harbor: {
					name: 'Harbor',
					x: 2,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Talk to Simon in Club 64',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town();
							},
							ap: [8112000102]
						},
						{
							name: 'Give Melody to Simon in Club 64',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && save.data.items.melody;
							},
							ap: [8112000103]
						},
						{
							name: 'Outside Club 64',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.toad_town() && flags.panels();
							},
							ap: [8112000107]
						},
						{
							name: 'Fishmael',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.deliver_letters() && save.data.items.letters.fishmael;
							},
							ap: [8112000104]
						},
						{
							name: 'Give Coconut to Trading Event Toad',
							icon: '/images/checks/trading_event_randomized',
							exists: () => {
								return save.data.configs.logic.trading_event_randomized;
							},
							available: () => {
								return flags.koopa_village() && flags.toad_town() && flags.star_spirits_count() >= 5 && save.data.items.trading_event_toad.coconut && save.data.items.hammer >= 1;
							},
							ap: [8112000105]
						},
						{
							name: 'Block on the crates south-west of the area',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.toad_town() && save.data.items.boots >= 1;
							},
							ap: [8112000106]
						}
					]
				},
				residential_area: {
					name: 'Residential Area',
					x: 3,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						//6 shop items
						{
							name: 'Shop item 1',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							},
							ap: [8112000096]
						},
						{
							name: 'Shop item 2',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							},
							ap: [8112000097]
						},
						{
							name: 'Shop item 3',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							},
							ap: [8112000098]
						},
						{
							name: 'Shop item 4',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							},
							ap: [8112000099]
						},
						{
							name: 'Shop item 5',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							},
							ap: [8112000100]
						},
						{
							name: 'Shop item 6',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							},
							ap: [8112000101]
						},
						{
							name: "Item 1 in Harry's storeroom",
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && save.data.items.storeroom_key;
							},
							ap: [8112000092]
						},
						{
							name: "Item 2 in Harry's storeroom",
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && save.data.items.storeroom_key;
							},
							ap: [8112000093]
						},
						{
							name: "Item 3 in Harry's storeroom",
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && save.data.items.storeroom_key;
							},
							ap: [8112000094]
						},
						{
							name: "Item 4 in Harry's storeroom",
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && save.data.items.storeroom_key;
							},
							ap: [8112000095]
						},
						{
							name: muskular_dungeon_shuffle_name,
							icon: muskular_dungeon_shuffle_icon,
							dungeon: 4,
							exists: () => {
								return save.data.configs.randomizer.shuffle_dungeon_entrances;
							},
							available: () => {
								return flags.dungeon_checks_available(4);
							}
						}
					]
				},
				below_plaza: {
					name: 'Below Plaza',
					x: 4,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Bub-ulb',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges();
							},
							ap: [8112000084]
						},
						{
							name: 'Give Frying Pan to Tayce T.',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && save.data.items.frying_pan;
							},
							ap: [8112000085]
						},
						{
							name: 'Inside Blue House',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.rip_cheato();
							},
							ap: [8112000083]
						},
						{
							name: 'Near Fice T.',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.toad_town() && flags.panels();
							},
							ap: [8112000088]
						},
						{
							name: 'Fice T.',
							tooltip: 'Check added if you deactivate "Forever Forest Open"',
							icon: '/images/checks/forest_pass.webp',
							exists: () => {
								return !save.data.configs.randomizer.forever_forest_open;
							},
							available: () => {
								return flags.toad_town();
							},
							ap: [8112000087]
						},
						{
							name: 'Fice T.',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.deliver_letters() && save.data.items.letters.fice_t;
							},
							ap: [8112000086]
						}
					]
				},
				train_station: {
					name: 'Train Station',
					x: 4,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Bottom right side of the room',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.toad_town() && flags.panels();
							},
							ap: [8112000091]
						},
						{
							name: 'Dane T.',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.deliver_letters() && save.data.items.letters.dane_t >= 1 && save.data.items.boots >= 1;
							},
							ap: [8112000090]
						},
						{
							name: 'Dane T. 2',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.deliver_letters() && save.data.items.letters.dane_t >= 2 && save.data.items.boots >= 1;
							},
							ap: [8112000089]
						}
					]
				}
			}
		},
		sewers: {
			name: 'Sewers',
			exists: () => {
				return true;
			},
			maps: {
				entrance: {
					name: 'Entrance',
					x: 8,
					y: 1,
					w: 1,
					h: 1,
					checks: []
				},
				shortcuts_p12: {
					name: 'Shortcuts Prologue, Chapter 1 & 2',
					x: 3,
					y: 1,
					w: 5,
					h: 1,
					checks: []
				},
				left_pipe: {
					name: 'Pipe',
					x: 2,
					y: 1,
					w: 1,
					h: 3,
					checks: [
						{
							name: 'Left ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.sewers() && flags.jump_coin_blocks() && flags.stone_blocks();
							},
							ap: [8112000109]
						},
						{
							name: 'Middle ? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.sewers() && flags.jump_coin_blocks() && flags.stone_blocks();
							},
							ap: [8112000110]
						},
						{
							name: 'Right ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.sewers() && flags.jump_coin_blocks() && flags.stone_blocks();
							},
							ap: [8112000111]
						}
					]
				},
				seesaw: {
					name: 'Seesaw',
					x: 2,
					y: 4,
					w: 1,
					h: 1,
					checks: []
				},
				power_smash: {
					name: 'Power Smash',
					x: 1,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Chest',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.sewers() && flags.stone_blocks() && (save.data.items.boots >= 1 || (flags.partner('kooper') && flags.partner('parakarry')));
							},
							ap: [8112000112]
						}
					]
				},
				elevator: {
					name: 'Elevator',
					x: 3,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item on the top right ledge of the room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.sewers() && save.data.items.boots >= 1 && flags.stone_blocks() && flags.partner('parakarry');
							},
							ap: [8112000113]
						}
					]
				},
				upgrade_block_behind_ultra_blocks: {
					name: 'Super Block',
					x: 2,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Super Block behind ultra blocks',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.sewers() && flags.ultra_blocks();
							},
							ap: [8112000119]
						}
					]
				},
				upgrade_block_after_elevator: {
					name: 'Super Block',
					x: 4,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Super Block after you take the left elevator in the cieling in the elevator room',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.sewers() && save.data.items.boots >= 1 && flags.stone_blocks();
							},
							ap: [8112000114]
						}
					]
				},
				brick_blocks: {
					name: 'Brick Blocks',
					x: 9,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Hidden block next to the last brick block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.sewers() && flags.jump_coin_blocks() && flags.yellow_blocks();
							},
							ap: [8112000132]
						},
						{
							name: 'Third brick from the left',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.sewers() && flags.jump_coin_blocks() && flags.yellow_blocks();
							},
							ap: [8112000133]
						}
					]
				},
				blooper: {
					name: 'Blooper',
					x: 10,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Chest after Blooper',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.sewers() && flags.yellow_blocks();
							},
							ap: [8112000108]
						}
					]
				},
				sushie_room: {
					name: 'Sushie Room',
					x: 8,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				shortcut_3: {
					name: 'Shortcut Chapter 3',
					x: 6,
					y: 2,
					w: 2,
					h: 1,
					checks: []
				},
				invisible_blocks_bridge: {
					name: 'Invisible Blocks Bridge',
					x: 5,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Invisible Block left',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return (
									flags.sewers() &&
									flags.jump_coin_blocks() &&
									(save.data.items.boots >= 2 || ((save.data.items.odd_key || save.data.configs.randomizer.blue_house_open) && flags.partner('bombette') && flags.partner('sushie')))
								);
							},
							ap: [8112000115]
						},
						{
							name: 'Invisible Block middle',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return (
									flags.sewers() &&
									flags.jump_coin_blocks() &&
									(save.data.items.boots >= 2 || ((save.data.items.odd_key || save.data.configs.randomizer.blue_house_open) && flags.partner('bombette') && flags.partner('sushie')))
								);
							},
							ap: [8112000116]
						},
						{
							name: 'Invisible Block right',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return (
									flags.sewers() &&
									flags.jump_coin_blocks() &&
									(save.data.items.boots >= 2 || ((save.data.items.odd_key || save.data.configs.randomizer.blue_house_open) && flags.partner('bombette') && flags.partner('sushie')))
								);
							},
							ap: [8112000117]
						},
						{
							name: 'Super Block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return (
									flags.sewers() &&
									flags.jump_coin_blocks() &&
									(save.data.items.boots >= 2 || ((save.data.items.odd_key || save.data.configs.randomizer.blue_house_open) && flags.partner('bombette') && flags.partner('sushie')))
								);
							},
							ap: [8112000118]
						}
					]
				},
				spike_room: {
					name: 'Spike room',
					x: 9,
					y: 2,
					w: 1,
					h: 2,
					checks: [
						{
							name: 'Ultra Boots ? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.sewers() && flags.ultra_jump_blocks() && ((save.data.items.boots >= 2 && flags.partner('sushie')) || (flags.rip_cheato() && flags.partner('bombette')));
							},
							ap: [8112000135]
						}
					]
				},
				spiny_room: {
					name: 'Spiny room',
					x: 9,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Invisible block left of pipe',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return (
									flags.sewers() &&
									save.data.items.boots >= 1 &&
									((save.data.items.boots >= 2 && flags.partner('sushie')) || (flags.rip_cheato() && flags.partner('bombette'))) &&
									flags.partner('lakilester')
								);
							},
							ap: [8112000142]
						},
						{
							name: 'Invisible block between the first and second spiny',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return (
									flags.sewers() &&
									save.data.items.boots >= 1 &&
									((save.data.items.boots >= 2 && flags.partner('sushie')) || (flags.rip_cheato() && flags.partner('bombette'))) &&
									flags.partner('lakilester')
								);
							},
							ap: [8112000141]
						},
						{
							name: 'Invisible block next to the stone block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return (
									flags.sewers() &&
									save.data.items.boots >= 1 &&
									((save.data.items.boots >= 2 && flags.partner('sushie')) || (flags.rip_cheato() && flags.partner('bombette'))) &&
									flags.partner('lakilester')
								);
							},
							ap: [8112000143]
						},
						{
							name: '? block next to the stone block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return (
									flags.sewers() &&
									save.data.items.boots >= 1 &&
									((save.data.items.boots >= 2 && flags.partner('sushie')) || (flags.rip_cheato() && flags.partner('bombette'))) &&
									flags.partner('lakilester')
								);
							},
							ap: [8112000144]
						}
					]
				},
				ultra_boots_blocks: {
					name: 'Ultra Boots Blocks',
					x: 8,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Right ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return (
									flags.sewers() &&
									flags.ultra_jump_blocks() &&
									flags.stone_blocks() &&
									((save.data.items.boots >= 2 && flags.partner('sushie')) || (flags.rip_cheato() && flags.partner('bombette'))) &&
									flags.partner('lakilester')
								);
							},
							ap: [8112000147]
						},
						{
							name: 'Middle invisible block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return (
									flags.sewers() &&
									flags.ultra_jump_blocks() &&
									flags.stone_blocks() &&
									((save.data.items.boots >= 2 && flags.partner('sushie')) || (flags.rip_cheato() && flags.partner('bombette'))) &&
									flags.partner('lakilester')
								);
							},
							ap: [8112000145]
						},
						{
							name: 'Left ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return (
									flags.sewers() &&
									flags.ultra_jump_blocks() &&
									flags.stone_blocks() &&
									((save.data.items.boots >= 2 && flags.partner('sushie')) || (flags.rip_cheato() && flags.partner('bombette'))) &&
									flags.partner('lakilester')
								);
							},
							ap: [8112000146]
						}
					]
				},
				ultra_boots_room: {
					name: 'Ultra Boots Room',
					x: 7,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Ultra Boots chest',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return (
									flags.sewers() &&
									save.data.items.boots >= 1 &&
									flags.ultra_blocks() &&
									((save.data.items.boots >= 2 && flags.partner('sushie')) || (flags.rip_cheato() && flags.partner('bombette'))) &&
									flags.partner('lakilester')
								);
							},
							ap: [8112000148]
						}
					]
				},
				chapter7_door: {
					name: 'Shiver City Door',
					x: 10,
					y: 2,
					w: 1,
					h: 2,
					checks: [
						{
							name: '? block 1',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.sewers() && ((save.data.items.boots >= 2 && flags.partner('sushie')) || (flags.rip_cheato() && flags.partner('bombette'))) && save.data.items.boots >= 2;
							},
							ap: [8112000136]
						},
						{
							name: 'Invisible block 1',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.sewers() && flags.shiver_city();
							},
							ap: [8112000137]
						},
						{
							name: 'Invisible block 2',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.sewers() && flags.shiver_city();
							},
							ap: [8112000138]
						},
						{
							name: 'Invisible block 3',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.sewers() && flags.shiver_city();
							},
							ap: [8112000139]
						},
						{
							name: 'Invisible block 4',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.sewers() && flags.shiver_city();
							},
							ap: [8112000140]
						}
					]
				},
				chapter7_pipe: {
					name: 'Shiver City Pipe',
					x: 11,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				rip_cheato: {
					name: 'Rip Cheato',
					x: 11,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Rip Cheato 1 (2 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 1;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							},
							ap: [8112000120]
						},
						{
							name: 'Rip Cheato 2 (2 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 2;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							},
							ap: [8112000121]
						},
						{
							name: 'Rip Cheato 3 (4 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 3;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							},
							ap: [8112000122]
						},
						{
							name: 'Rip Cheato 4 (4 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 4;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							},
							ap: [8112000123]
						},
						{
							name: 'Rip Cheato 5 (8 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 5;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							},
							ap: [8112000124]
						},
						{
							name: 'Rip Cheato 6 (8 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 6;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							},
							ap: [8112000125]
						},
						{
							name: 'Rip Cheato 7 (16 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 7;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							},
							ap: [8112000126]
						},
						{
							name: 'Rip Cheato 8 (16 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 8;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							},
							ap: [8112000127]
						},
						{
							name: 'Rip Cheato 9 (32 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 9;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							},
							ap: [8112000128]
						},
						{
							name: 'Rip Cheato 10 (32 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 10;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							},
							ap: [8112000129]
						},
						{
							name: 'Rip Cheato 11 (64 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 11;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							},
							ap: [8112000130]
						}
					]
				}
			}
		},
		pleasant_path: {
			name: 'Pleasant Path',
			exists: () => {
				return flags.lcl(1);
			},
			maps: {
				outside_toad_town: {
					name: 'Outside Toad Town',
					x: 1,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Left ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toad_town() && flags.jump_coin_blocks();
							},
							ap: [8112000233]
						},
						{
							name: 'Middle ? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_coin_blocks();
							},
							ap: [8112000234]
						},
						{
							name: 'Right ? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_coin_blocks();
							},
							ap: [8112000235]
						}
					]
				},
				switch_bridge_1: {
					name: 'Switch Bridge 1',
					x: 2,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: '? block left of the bridge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_coin_blocks();
							},
							ap: [8112000236]
						},
						{
							name: 'Item on the little island after the bridge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village() && flags.partner('kooper');
							},
							ap: [8112000237]
						},
						{
							name: 'Item behind the small fence',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village();
							},
							ap: [8112000238]
						},
						{
							name: 'Last block near the east exit',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.koopa_village() && flags.jump_coin_blocks();
							},
							ap: [8112000239]
						}
					]
				},
				outside_koopa_village: {
					name: 'Outside Koopa Village',
					x: 3,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Middle of the three striped pillars on top of the mountain',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.koopa_village() && flags.panels();
							},
							ap: [8112000242]
						},
						{
							name: 'Item behind the right most striped pillar on top of the mountain',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village();
							},
							ap: [8112000241]
						},
						{
							name: 'Break brick boxes in order next to Koopa Village entrance (left, right, middle)',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village() && flags.jump_coin_blocks() && flags.ground_blocks();
							},
							ap: [8112000240]
						}
					]
				},
				switch_bridge_2: {
					name: 'Switch Bridge 2',
					x: 4,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item on the brick block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village() && (flags.partner('kooper') || save.data.items.boots >= 3);
							},
							ap: [8112000248]
						},
						{
							name: 'Hidden block after the bridge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village() && flags.partner('kooper');
							},
							ap: [8112000249]
						},
						{
							name: 'Under the 5 coins next to the west entrance',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.koopa_village() && flags.panels();
							},
							ap: [8112000250]
						},
						{
							name: 'Coin 1 next to the west entrance',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.koopa_village();
							},
							ap: [8112000243]
						},
						{
							name: 'Coin 2 next to the west entrance',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.koopa_village();
							},
							ap: [8112000244]
						},
						{
							name: 'Coin 3 next to the west entrance',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.koopa_village();
							},
							ap: [8112000245]
						},
						{
							name: 'Coin 4 next to the west entrance',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.koopa_village();
							},
							ap: [8112000246]
						},
						{
							name: 'Coin 5 next to the west entrance',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.koopa_village();
							},
							ap: [8112000247]
						}
					]
				},
				path_to_koopa_fortress: {
					name: 'Path to Koopa Bros. Fortress',
					x: 5,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item in the first tree from the left',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village() && save.data.items.kooper && flags.trees();
							},
							ap: [8112000251]
						},
						{
							name: 'Chest on the ledge in the next screen',
							tooltip: 'Access from the bombable wall in the room on the left',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village() && flags.partner('kooper') && flags.partner('bombette');
							},
							ap: [8112000253]
						},
						{
							name: eldstar_dungeon_shuffle_name,
							icon: eldstar_dungeon_shuffle_icon,
							dungeon: 1,
							exists: () => {
								return save.data.configs.randomizer.shuffle_dungeon_entrances;
							},
							available: () => {
								return flags.dungeon_checks_available(1);
							}
						}
					]
				}
			}
		},
		koopa_village: {
			name: 'Koopa Village',
			exists: () => {
				return flags.lcl(1);
			},
			maps: {
				west: {
					name: 'West',
					x: 1,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Far left bush',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.koopa_village();
							},
							ap: [8112000186]
						},
						{
							name: 'Bottom bush on the left side',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village();
							},
							ap: [8112000187]
						},
						{
							name: 'Second bush on the right next to the east exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.koopa_village();
							},
							ap: [8112000189]
						},
						{
							name: 'Third bush on the right next to the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village();
							},
							ap: [8112000188]
						},
						{
							name: 'Shop item 1',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.koopa_village();
							},
							ap: [8112000195]
						},
						{
							name: 'Shop item 2',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.koopa_village();
							},
							ap: [8112000196]
						},
						{
							name: 'Shop item 3',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.koopa_village();
							},
							ap: [8112000197]
						},
						{
							name: 'Shop item 4',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.koopa_village();
							},
							ap: [8112000198]
						},
						{
							name: 'Shop item 5',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.koopa_village();
							},
							ap: [8112000199]
						},
						{
							name: 'Shop item 6',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.koopa_village();
							},
							ap: [8112000200]
						},
						{
							name: 'Left of tree',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.koopa_village() && flags.panels();
							},
							ap: [8112000201]
						},
						{
							name: 'Mort T. (Koopa Inn)',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.koopa_village() && flags.deliver_letters() && save.data.items.letters.mort_t;
							},
							ap: [8112000192]
						},
						{
							name: 'Koover 1 (Koopa at the west entrance)',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.koopa_village() && flags.deliver_letters() && save.data.items.letters.koover >= 1 && save.data.items.hammer >= 1;
							},
							ap: [8112000194]
						},
						{
							name: 'Koover 2 (Koopa at the west entrance)',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.koopa_village() && flags.deliver_letters() && save.data.items.letters.koover >= 2 && save.data.items.hammer >= 1;
							},
							ap: [8112000193]
						},
						{
							name: 'Bush closest of the east exit (After Koopa Koot asks for his wallet)',
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 2 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph
								);
							},
							ap: [8112000191]
						},
						{
							name: 'Second bush near the west exit (After Koopa Koot asks for his glasses)',
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 5 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic &&
									save.data.items.koopa_koot_favors.crystal_ball &&
									save.data.items.koopa_koot_favors.merluvlee_autograph &&
									save.data.items.koopa_koot_favors.life_shroom &&
									save.data.items.koopa_koot_favors.nutty_cake &&
									save.data.items.koopa_koot_favors.old_photo &&
									save.data.items.koopa_koot_favors.koopasta &&
									flags.partner('bombette')
								);
							},
							ap: [8112000190]
						}
					]
				},
				east: {
					name: 'East',
					x: 2,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'First bush near the west exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village();
							},
							ap: [8112000208]
						},
						{
							name: 'Give Kooper his shell',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village() && save.data.items.kooper_shell;
							},
							ap: [8112000209]
						},
						{
							name: 'Give the artifact to Kolorado',
							tooltip:
								'Kolorado location changes throughout the game. He is in Dry Dry Desert until you get Mamar. After he goes to Jade Jungle. He can be blocked by Kent C. if he is still in the way.',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village() && save.data.items.artifact;
							},
							ap: [8112000206]
						},
						{
							name: 'Kolorado',
							tooltip:
								'Kolorado location changes throughout the game. He is in Dry Dry Desert until you get Mamar. After he goes to Jade Jungle. He can be blocked by Kent C. if he is still in the way.',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.koopa_village() && flags.deliver_letters() && save.data.items.letters.kolorado;
							},
							ap: [8112000207]
						},
						{
							name: 'Item on top of the brick block on the right (After beating the fuzzies)',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village() && save.data.items.hammer >= 1 && flags.jump_coin_blocks();
							},
							ap: [8112000202]
						},
						{
							name: 'Far right bush',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.koopa_village();
							},
							ap: [8112000230]
						},
						{
							name: "Talk to Kolorado's wife (After Koopa Koot asks for the Koopa Legends)",
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return flags.koopa_village() && flags.can_koot();
							},
							ap: [8112000203]
						},
						{
							name: 'Koopa Koot - Return Koopa Legends',
							icon: '/images/checks/koopa_koot_coins.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot_coins;
							},
							available: () => {
								return flags.koopa_village() && flags.can_koot() && save.data.items.koopa_koot_favors.koopa_legends;
							},
							ap: [8112000210]
						},
						{
							name: 'Koopa Koot - Give Sleepy Sheep - First reward',
							icon: '/images/checks/koopa_koot_coins.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot_coins;
							},
							available: () => {
								return flags.koopa_village() && flags.can_koot() && save.data.items.koopa_koot_favors.koopa_legends && save.data.items.koopa_koot_favors.sleepy_sheep;
							},
							ap: [8112000204]
						},
						{
							name: 'Koopa Koot - Give Sleepy Sheep - Second reward',
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return flags.koopa_village() && flags.can_koot() && save.data.items.koopa_koot_favors.koopa_legends && save.data.items.koopa_koot_favors.sleepy_sheep;
							},
							ap: [8112000211]
						},
						{
							name: 'Koopa Koot - Give Tape',
							icon: '/images/checks/koopa_koot_coins.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot_coins;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 1 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape
								);
							},
							ap: [8112000212]
						},
						{
							name: 'Koopa Koot - Give Koopa Tea',
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 1 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea
								);
							},
							ap: [8112000213]
						},
						{
							name: "Koopa Koot - Give Luigi's Autograph",
							icon: '/images/checks/koopa_koot_coins.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot_coins;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 1 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph
								);
							},
							ap: [8112000214]
						},
						{
							name: 'Koopa Koot - Give Empty Wallet',
							icon: '/images/checks/koopa_koot_coins.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot_coins;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 2 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet
								);
							},
							ap: [8112000215]
						},
						{
							name: 'Koopa Koot - Give Tasty Tonic',
							icon: '/images/checks/koopa_koot_coins.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot_coins;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 2 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic
								);
							},
							ap: [8112000216]
						},
						{
							name: "Koopa Koot - Give Merluvlee's autograph",
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 2 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic &&
									save.data.items.koopa_koot_favors.crystal_ball &&
									save.data.items.koopa_koot_favors.merluvlee_autograph
								);
							},
							ap: [8112000217]
						},
						{
							name: 'Koopa Koot - Go read the news in Toad Town',
							icon: '/images/checks/koopa_koot_coins.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot_coins;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 3 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic &&
									save.data.items.koopa_koot_favors.crystal_ball &&
									save.data.items.koopa_koot_favors.merluvlee_autograph
								);
							},
							ap: [8112000218]
						},
						{
							name: 'Koopa Koot - Give Life Shroom - First reward',
							icon: '/images/checks/koopa_koot_coins.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot_coins;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 3 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic &&
									save.data.items.koopa_koot_favors.crystal_ball &&
									save.data.items.koopa_koot_favors.merluvlee_autograph &&
									save.data.items.koopa_koot_favors.life_shroom
								);
							},
							ap: [8112000205]
						},
						{
							name: 'Koopa Koot - Give Life Shroom - Second reward',
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 3 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic &&
									save.data.items.koopa_koot_favors.crystal_ball &&
									save.data.items.koopa_koot_favors.merluvlee_autograph &&
									save.data.items.koopa_koot_favors.life_shroom
								);
							},
							ap: [8112000219]
						},
						{
							name: 'Koopa Koot - Give Nutty Cake',
							icon: '/images/checks/koopa_koot_coins.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot_coins;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 3 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic &&
									save.data.items.koopa_koot_favors.crystal_ball &&
									save.data.items.koopa_koot_favors.merluvlee_autograph &&
									save.data.items.koopa_koot_favors.life_shroom &&
									save.data.items.koopa_koot_favors.nutty_cake
								);
							},
							ap: [8112000220]
						},
						{
							name: 'Koopa Koot - Calm the Bob-ombs',
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 4 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic &&
									save.data.items.koopa_koot_favors.crystal_ball &&
									save.data.items.koopa_koot_favors.merluvlee_autograph &&
									save.data.items.koopa_koot_favors.life_shroom &&
									save.data.items.koopa_koot_favors.nutty_cake &&
									save.data.items.eldstar &&
									flags.partner('bombette')
								);
							},
							ap: [8112000221]
						},
						{
							name: 'Koopa Koot - Give Old Photo',
							icon: '/images/checks/koopa_koot_coins.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot_coins;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 4 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic &&
									save.data.items.koopa_koot_favors.crystal_ball &&
									save.data.items.koopa_koot_favors.merluvlee_autograph &&
									save.data.items.koopa_koot_favors.life_shroom &&
									save.data.items.koopa_koot_favors.nutty_cake &&
									save.data.items.eldstar &&
									flags.partner('bombette') &&
									save.data.items.koopa_koot_favors.old_photo
								);
							},
							ap: [8112000222]
						},
						{
							name: 'Koopa Koot - Give Koopasta',
							icon: '/images/checks/koopa_koot_coins.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot_coins;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 4 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic &&
									save.data.items.koopa_koot_favors.crystal_ball &&
									save.data.items.koopa_koot_favors.merluvlee_autograph &&
									save.data.items.koopa_koot_favors.life_shroom &&
									save.data.items.koopa_koot_favors.nutty_cake &&
									save.data.items.eldstar &&
									flags.partner('bombette') &&
									save.data.items.koopa_koot_favors.old_photo &&
									save.data.items.koopa_koot_favors.koopasta
								);
							},
							ap: [8112000223]
						},
						{
							name: 'Koopa Koot - Give Glasses',
							icon: '/images/checks/koopa_koot_coins.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot_coins;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 5 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic &&
									save.data.items.koopa_koot_favors.crystal_ball &&
									save.data.items.koopa_koot_favors.merluvlee_autograph &&
									save.data.items.koopa_koot_favors.life_shroom &&
									save.data.items.koopa_koot_favors.nutty_cake &&
									save.data.items.eldstar &&
									flags.partner('bombette') &&
									save.data.items.koopa_koot_favors.old_photo &&
									save.data.items.koopa_koot_favors.koopasta &&
									save.data.items.koopa_koot_favors.glasses
								);
							},
							ap: [8112000224]
						},
						{
							name: 'Koopa Koot - Give a Lime',
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 5 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic &&
									save.data.items.koopa_koot_favors.crystal_ball &&
									save.data.items.koopa_koot_favors.merluvlee_autograph &&
									save.data.items.koopa_koot_favors.life_shroom &&
									save.data.items.koopa_koot_favors.nutty_cake &&
									save.data.items.eldstar &&
									flags.partner('bombette') &&
									save.data.items.koopa_koot_favors.old_photo &&
									save.data.items.koopa_koot_favors.koopasta &&
									save.data.items.koopa_koot_favors.glasses &&
									save.data.items.koopa_koot_favors.lime
								);
							},
							ap: [8112000225]
						},
						{
							name: 'Koopa Koot - Give Kooky Cookie',
							icon: '/images/checks/koopa_koot_coins.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot_coins;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 5 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic &&
									save.data.items.koopa_koot_favors.crystal_ball &&
									save.data.items.koopa_koot_favors.merluvlee_autograph &&
									save.data.items.koopa_koot_favors.life_shroom &&
									save.data.items.koopa_koot_favors.nutty_cake &&
									save.data.items.eldstar &&
									flags.partner('bombette') &&
									save.data.items.koopa_koot_favors.old_photo &&
									save.data.items.koopa_koot_favors.koopasta &&
									save.data.items.koopa_koot_favors.glasses &&
									save.data.items.koopa_koot_favors.lime &&
									save.data.items.koopa_koot_favors.kooky_cookie
								);
							},
							ap: [8112000226]
						},
						{
							name: 'Koopa Koot - Give Package',
							icon: '/images/checks/koopa_koot_coins.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot_coins;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 6 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic &&
									save.data.items.koopa_koot_favors.crystal_ball &&
									save.data.items.koopa_koot_favors.merluvlee_autograph &&
									save.data.items.koopa_koot_favors.life_shroom &&
									save.data.items.koopa_koot_favors.nutty_cake &&
									save.data.items.eldstar &&
									flags.partner('bombette') &&
									save.data.items.koopa_koot_favors.old_photo &&
									save.data.items.koopa_koot_favors.koopasta &&
									save.data.items.koopa_koot_favors.glasses &&
									save.data.items.koopa_koot_favors.lime &&
									save.data.items.koopa_koot_favors.kooky_cookie &&
									save.data.items.koopa_koot_favors.package
								);
							},
							ap: [8112000227]
						},
						{
							name: 'Koopa Koot - Give Coconut',
							icon: '/images/checks/koopa_koot_coins.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot_coins;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 6 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic &&
									save.data.items.koopa_koot_favors.crystal_ball &&
									save.data.items.koopa_koot_favors.merluvlee_autograph &&
									save.data.items.koopa_koot_favors.life_shroom &&
									save.data.items.koopa_koot_favors.nutty_cake &&
									save.data.items.eldstar &&
									flags.partner('bombette') &&
									save.data.items.koopa_koot_favors.old_photo &&
									save.data.items.koopa_koot_favors.koopasta &&
									save.data.items.koopa_koot_favors.glasses &&
									save.data.items.koopa_koot_favors.lime &&
									save.data.items.koopa_koot_favors.kooky_cookie &&
									save.data.items.koopa_koot_favors.package &&
									save.data.items.koopa_koot_favors.coconut
								);
							},
							ap: [8112000228]
						},
						{
							name: 'Koopa Koot - Give Red jar',
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return (
									flags.koopa_village() &&
									flags.can_koot() &&
									flags.star_spirits_count() >= 6 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic &&
									save.data.items.koopa_koot_favors.crystal_ball &&
									save.data.items.koopa_koot_favors.merluvlee_autograph &&
									save.data.items.koopa_koot_favors.life_shroom &&
									save.data.items.koopa_koot_favors.nutty_cake &&
									save.data.items.eldstar &&
									flags.partner('bombette') &&
									save.data.items.koopa_koot_favors.old_photo &&
									save.data.items.koopa_koot_favors.koopasta &&
									save.data.items.koopa_koot_favors.glasses &&
									save.data.items.koopa_koot_favors.lime &&
									save.data.items.koopa_koot_favors.kooky_cookie &&
									save.data.items.koopa_koot_favors.package &&
									save.data.items.koopa_koot_favors.coconut &&
									save.data.items.koopa_koot_favors.red_jar
								);
							},
							ap: [8112000229]
						}
					]
				},
				behind_kooper_house: {
					name: "Behind Kooper's House",
					x: 2,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'On the tall stump',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village() && flags.jump_ledges() && (flags.partner('kooper') || flags.partner('parakarry'));
							},
							ap: [8112000231]
						}
					]
				},
				fuzzy_room: {
					name: 'Fuzzy Room',
					x: 2,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item Fuzzies are holding (Fuzzy minigame)',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village() && save.data.items.hammer >= 1;
							},
							ap: [8112000232]
						}
					]
				}
			}
		},
		koopa_bros_fortress: {
			name: 'Koopa Bros. Fortress',
			exists: () => {
				return flags.lcl(1, true);
			},
			maps: {
				outside_fortress: {
					name: 'Outside Fortress',
					x: 1,
					y: 4,
					w: 1,
					h: 1,
					checks: []
				},
				fortress_entrance: {
					name: 'Fortress Entrance',
					x: 2,
					y: 1,
					w: 1,
					h: 4,
					checks: [
						{
							name: 'Defeat the Koopa by the locked door',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_bros_fortress();
							},
							ap: [8112000255]
						},
						{
							name: 'Top of the room, guarded by a Bob-omb',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_bros_fortress() && flags.jump_ledges() && save.data.items.fortress_key >= 4 && (flags.partner('kooper') || flags.partner('parakarry'));
							},
							ap: [8112000254]
						}
					]
				},
				chained_stairs: {
					name: 'Chained stairs',
					x: 3,
					y: 3,
					w: 1,
					h: 2,
					checks: []
				},
				jail_cells: {
					name: '3 jail cells',
					x: 4,
					y: 3,
					w: 1,
					h: 2,
					checks: [
						{
							name: 'Left jail cell',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_bros_fortress() && save.data.items.fortress_key >= 3 && flags.partner('bombette') && (flags.partner('kooper') || flags.partner('parakarry'));
							},
							ap: [8112000256]
						},
						{
							name: 'Middle jail cell',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_bros_fortress() && save.data.items.fortress_key >= 1;
							},
							ap: [8112000258]
						},
						{
							name: 'Right jail cell',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_bros_fortress() && save.data.items.fortress_key >= 1 && flags.partner('bombette');
							},
							ap: [8112000257]
						}
					]
				},
				staircase_room: {
					name: 'Staircase room',
					x: 5,
					y: 3,
					w: 1,
					h: 3,
					checks: []
				},
				trap_room: {
					name: 'Trap room',
					x: 6,
					y: 3,
					w: 3,
					h: 2,
					checks: []
				},
				backyard: {
					name: 'Backyard',
					x: 9,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Chest',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_bros_fortress() && save.data.items.fortress_key >= 2 && flags.partner('bombette');
							},
							ap: [8112000252]
						}
					]
				},
				save_block: {
					name: 'Save Block',
					x: 8,
					y: 5,
					w: 1,
					h: 1,
					checks: []
				},
				firebars: {
					name: 'Firebars',
					x: 3,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item at the end of the room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_bros_fortress() && save.data.items.fortress_key >= 1;
							},
							ap: [8112000260]
						}
					]
				},
				the_pit: {
					name: 'The Pit',
					x: 4,
					y: 5,
					w: 1,
					h: 1,
					checks: []
				},
				jail: {
					name: 'Jail',
					x: 6,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Bombette',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_bros_fortress() && ((flags.partner('bombette') && save.data.items.fortress_key >= 1) || save.data.items.fortress_key >= 2);
							},
							ap: [8112000259]
						}
					]
				},
				cannons: {
					name: 'Cannons',
					x: 3,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: '? block behind the bombable rock',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return (
									flags.koopa_bros_fortress() &&
									flags.jump_ledges() &&
									flags.partner('bombette') &&
									save.data.items.fortress_key >= 4 &&
									(flags.partner('kooper') || flags.partner('parakarry'))
								);
							},
							ap: [8112000261]
						}
					]
				},
				koopa_bros: {
					name: 'Koopa Bros.',
					x: 4,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Eldstar',
							icon: '/images/checks/stars/eldstar.webp',
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_bros_fortress() && flags.jump_ledges() && save.data.items.fortress_key >= 4 && (flags.partner('kooper') || flags.partner('parakarry'));
							}
						}
					]
				}
			}
		},
		mt_rugged: {
			name: 'Mt. Rugged',
			exists: () => {
				return flags.lcl(2);
			},
			maps: {
				train_station: {
					name: 'Train Station',
					x: 1,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item in the top most bush before the train tracks',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged(false);
							},
							ap: [8112000290]
						},
						{
							name: 'Give three letters to Parakarry',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.letters_count() >= 3;
							},
							ap: [8112000291]
						},
						{
							name: 'Bush 1 near the train station',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.mt_rugged(false);
							},
							ap: [8112000287]
						},
						{
							name: 'Bush 2 near the train station',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.mt_rugged(false);
							},
							ap: [8112000288]
						},
						{
							name: 'Bush 3 near the train station',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.mt_rugged(false);
							},
							ap: [8112000289]
						},
						{
							name: 'Super Block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && save.data.items.hammer >= 2;
							},
							ap: [8112000292]
						}
					]
				},
				whacka: {
					name: 'Whacka',
					x: 2,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Hit Whacka',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && (save.data.items.hammer >= 1 || flags.partner('bombette'));
							},
							ap: [8112000266]
						},
						{
							name: '? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_coin_blocks();
							},
							ap: [8112000265]
						},
						{
							name: 'Item 1 on slide',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges();
							},
							ap: [8112000262]
						},
						{
							name: 'Item 2 on slide',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges();
							},
							ap: [8112000263]
						},
						{
							name: 'Item 3 on slide',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges();
							},
							ap: [8112000264]
						}
					]
				},
				letter3: {
					name: 'Letter 3',
					x: 2,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: '? block by cleft near east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_coin_blocks();
							},
							ap: [8112000274]
						},
						{
							name: 'Chest in the cave (enter the cave and go left)',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges();
							},
							ap: [8112000272]
						},
						{
							name: 'Item 1 on the ground in the gap at the far left of the room',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges();
							},
							ap: [8112000284]
						},
						{
							name: 'Item 2 on the ground in the gap at the far left of the room',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges();
							},
							ap: [8112000285]
						},
						{
							name: 'Item at the far left of the room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.partner('parakarry');
							},
							ap: [8112000277]
						},
						{
							name: 'Item 1 of the circle of items at the far left of the room',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.partner('parakarry');
							},
							ap: [8112000278]
						},
						{
							name: 'Item 2 of the circle of items at the far left of the room',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.partner('parakarry');
							},
							ap: [8112000279]
						},
						{
							name: 'Item 3 of the circle of items at the far left of the room',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.partner('parakarry');
							},
							ap: [8112000280]
						},
						{
							name: 'Item 4 of the circle of items at the far left of the room',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.partner('parakarry');
							},
							ap: [8112000281]
						},
						{
							name: 'Item 5 of the circle of items at the far left of the room',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.partner('parakarry');
							},
							ap: [8112000282]
						},
						{
							name: 'Item 6 of the circle of items at the far left of the room',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.partner('parakarry');
							},
							ap: [8112000283]
						},
						{
							name: '? block on top of the ledge on the left',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.ground_blocks();
							},
							ap: [8112000273]
						},
						{
							name: '? block on top of the ledge on the right',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.ground_blocks();
							},
							ap: [8112000275]
						},
						{
							name: 'Item on the ledge at the far right of the screen',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges();
							},
							ap: [8112000276]
						}
					]
				},
				letter1: {
					name: 'Letter 1',
					x: 3,
					y: 1,
					w: 1,
					h: 2,
					checks: [
						{
							name: 'Near the end of the slide, close to the wall on the right',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.mt_rugged() && flags.panels();
							},
							ap: [8112000269]
						},
						{
							name: 'Right item on the ledge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && (flags.partner('kooper') || flags.partner('parakarry'));
							},
							ap: [8112000268]
						},
						{
							name: 'Left item on the ledge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && flags.partner('parakarry');
							},
							ap: [8112000267]
						}
					]
				},
				bub_ulb: {
					name: 'Bub-ulb',
					x: 4,
					y: 1,
					w: 1,
					h: 2,
					checks: [
						{
							name: 'Item on the support beam near the top west exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges();
							},
							ap: [8112000270]
						},
						{
							name: 'Bub-ulb',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && flags.partner('parakarry');
							},
							ap: [8112000271]
						}
					]
				},
				buzzar: {
					name: 'Buzzar',
					x: 5,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item on the ground left of the bridge, down the gap',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged();
							},
							ap: [8112000286]
						}
					]
				}
			}
		},
		dry_dry_desert: {
			name: 'Dry Dry Desert',
			exists: () => {
				return flags.lcl(2);
			},
			maps: {
				left_entrance: {
					name: 'West Entrance',
					x: 1,
					y: 4,
					w: 1,
					h: 1,
					checks: []
				},
				// keys: Y_X (cause I suck and I entered them in the wrong order and I don't feel like fixing it, would be too long for nothing lol)
				1_1: {
					name: 'Two ? blocks',
					x: 2,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Left ? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							},
							ap: [8112000308]
						},
						{
							name: 'Right ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							},
							ap: [8112000309]
						}
					]
				},
				1_2: {
					name: '',
					x: 3,
					y: 1,
					w: 1,
					h: 1,
					checks: []
				},
				1_3: {
					name: 'Dry Dry Ruins',
					x: 4,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Give Nutty Cake',
							icon: '/images/checks/trading_event_randomized',
							exists: () => {
								return save.data.configs.logic.trading_event_randomized;
							},
							available: () => {
								return (
									flags.koopa_village() && flags.dry_dry_desert() && flags.star_spirits_count() >= 3 && save.data.items.trading_event_toad.nutty_cake && save.data.items.hammer >= 1
								);
							},
							ap: [8112000310]
						},
						{
							name: mamar_dungeon_shuffle_name,
							icon: mamar_dungeon_shuffle_icon,
							dungeon: 2,
							exists: () => {
								return save.data.configs.randomizer.shuffle_dungeon_entrances;
							},
							available: () => {
								return flags.dungeon_checks_available(2);
							}
						}
					]
				},
				1_4: {
					name: '',
					x: 5,
					y: 1,
					w: 1,
					h: 1,
					checks: []
				},
				1_5: {
					name: '',
					x: 6,
					y: 1,
					w: 1,
					h: 1,
					checks: []
				},
				1_6: {
					name: 'Pokey Room',
					x: 7,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Behind the cactus at the top of the room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert();
							},
							ap: [8112000311]
						}
					]
				},
				1_7: {
					name: 'Brick block circle',
					x: 8,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Tree',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							},
							ap: [8112000312]
						},
						{
							name: 'Block near the tree',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							},
							ap: [8112000313]
						}
					]
				},
				2_1: {
					name: 'Invisible block on a rock',
					x: 2,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Invisible block on the rock near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_ledges() && flags.jump_coin_blocks();
							},
							ap: [8112000314]
						}
					]
				},
				2_2: {
					name: '',
					x: 3,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				2_3: {
					name: '',
					x: 4,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				2_4: {
					name: '',
					x: 5,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				2_5: {
					name: '3 Blocks, 1 Tweester',
					x: 6,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Left ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							},
							ap: [8112000315]
						},
						{
							name: 'Right ? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							},
							ap: [8112000316]
						},
						{
							name: 'Block in the center of the room',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							},
							ap: [8112000317]
						}
					]
				},
				2_6: {
					name: '',
					x: 7,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				2_7: {
					name: '',
					x: 8,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				3_1: {
					name: 'Empty block? D:',
					x: 2,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Hit the block 1 time',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks() && flags.jump_coin_blocks();
							},
							ap: [8112000318]
						},
						{
							name: 'Hit the block 5 time',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks() && flags.jump_coin_blocks();
							},
							ap: [8112000319]
						},
						{
							name: 'Hit the block 10 time',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks() && flags.jump_coin_blocks();
							},
							ap: [8112000320]
						}
					]
				},
				3_2: {
					name: '',
					x: 3,
					y: 3,
					w: 1,
					h: 1,
					checks: []
				},
				3_3: {
					name: 'Five-Eye Reef',
					x: 4,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Top left ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							},
							ap: [8112000321]
						},
						{
							name: 'Top right ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							},
							ap: [8112000322]
						},
						{
							name: 'Middle ? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							},
							ap: [8112000325]
						},
						{
							name: 'Bottom left ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							},
							ap: [8112000323]
						},
						{
							name: 'Bottom right ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							},
							ap: [8112000324]
						}
					]
				},
				3_4: {
					name: '',
					x: 5,
					y: 3,
					w: 1,
					h: 1,
					checks: []
				},
				3_5: {
					name: 'Tree-force',
					x: 6,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Invisible block in the middle of the Tree-force',
							icons: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							},
							ap: [8112000326]
						}
					]
				},
				3_6: {
					name: 'Seven brick blocks',
					x: 7,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Second block from the right',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							},
							ap: [8112000327]
						},
						{
							name: 'Third block from the right',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							},
							ap: [8112000328]
						}
					]
				},
				3_7: {
					name: 'Tree',
					x: 8,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Tree',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							},
							ap: [8112000329]
						}
					]
				},
				4_1: {
					name: "Kolorado's camp",
					x: 2,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees() && save.data.items.mamar;
							},
							ap: [8112000330]
						}
					]
				},
				4_2: {
					name: '',
					x: 3,
					y: 4,
					w: 1,
					h: 1,
					checks: []
				},
				4_3: {
					name: '',
					x: 4,
					y: 4,
					w: 1,
					h: 1,
					checks: []
				},
				4_4: {
					name: 'Petrified cactus',
					x: 5,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Close to the petrified cactus',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.panels();
							},
							ap: [8112000331]
						}
					]
				},
				4_5: {
					name: 'Nomadimouse',
					x: 6,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Nomadimouse',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.deliver_letters() && save.data.items.letters.nomadimouse;
							},
							ap: [8112000332]
						},
						{
							name: 'Tree',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							},
							ap: [8112000333]
						}
					]
				},
				4_6: {
					name: 'Trees',
					x: 7,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Tree near the left entrance',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							},
							ap: [8112000334]
						}
					]
				},
				4_7: {
					name: 'Tree corridor',
					x: 8,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Far left tree',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							},
							ap: [8112000336]
						},
						{
							name: 'Second tree from the left',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							},
							ap: [8112000337]
						},
						{
							name: 'Fourth tree from the right',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							},
							ap: [8112000338]
						},
						{
							name: 'Far right tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							},
							ap: [8112000335]
						}
					]
				},
				5_1: {
					name: 'South of the camp',
					x: 2,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Center block',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							},
							ap: [8112000339]
						}
					]
				},
				5_2: {
					name: '',
					x: 3,
					y: 5,
					w: 1,
					h: 1,
					checks: []
				},
				5_3: {
					name: '',
					x: 4,
					y: 5,
					w: 1,
					h: 1,
					checks: []
				},
				5_4: {
					name: '3 cacti',
					x: 5,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: '? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							},
							ap: [8112000340]
						}
					]
				},
				5_5: {
					name: '',
					x: 6,
					y: 5,
					w: 1,
					h: 1,
					checks: []
				},
				5_6: {
					name: 'Landform',
					x: 7,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item on the ledge',
							tooltip: 'Take the Tweester in the room down left from the current room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert();
							},
							ap: [8112000342]
						},
						{
							name: 'Item on the brick block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && ((flags.jump_ledges() && flags.partner('kooper')) || flags.ultra_jump_blocks());
							},
							ap: [8112000341]
						}
					]
				},
				5_7: {
					name: 'North of the oasis',
					x: 8,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: '? block in the middle of the room',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							},
							ap: [8112000343]
						},
						{
							name: 'Invisible block above the ? block in the middle of the room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_ledges() && flags.jump_coin_blocks();
							},
							ap: [8112000344]
						},
						{
							name: 'Bottom tree',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							},
							ap: [8112000345]
						}
					]
				},
				6_1: {
					name: '',
					x: 2,
					y: 6,
					w: 1,
					h: 1,
					checks: []
				},
				6_2: {
					name: '',
					x: 3,
					y: 6,
					w: 1,
					h: 1,
					checks: []
				},
				6_3: {
					name: 'Centered block',
					x: 4,
					y: 6,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Block in the center',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							},
							ap: [8112000346]
						}
					]
				},
				6_4: {
					name: '',
					x: 5,
					y: 6,
					w: 1,
					h: 1,
					checks: []
				},
				6_5: {
					name: '',
					x: 6,
					y: 6,
					w: 1,
					h: 1,
					checks: []
				},
				6_6: {
					name: 'West of the oasis',
					x: 7,
					y: 6,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Tree',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							},
							ap: [8112000348]
						},
						{
							name: 'Item behind the bush near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert();
							},
							ap: [8112000347]
						},
						{
							name: 'Block near the tree',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							},
							ap: [8112000349]
						}
					]
				},
				6_7: {
					name: 'Oasis',
					x: 8,
					y: 6,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Big tree on the left',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							},
							ap: [8112000350]
						},
						{
							name: 'Big tree on the right',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							},
							ap: [8112000351]
						},
						{
							name: 'Super Block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							},
							ap: [8112000354]
						},
						{
							name: 'Tree at the bottom left of the room',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							},
							ap: [8112000352]
						},
						{
							name: 'Tree down of the heart block',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							},
							ap: [8112000353]
						}
					]
				},
				7_1: {
					name: '',
					x: 2,
					y: 7,
					w: 1,
					h: 1,
					checks: []
				},
				7_2: {
					name: 'Rock',
					x: 3,
					y: 7,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Invisible block on top of the rock',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_ledges() && flags.jump_coin_blocks();
							},
							ap: [8112000355]
						}
					]
				},
				7_3: {
					name: '',
					x: 4,
					y: 7,
					w: 1,
					h: 1,
					checks: []
				},
				7_4: {
					name: '',
					x: 5,
					y: 7,
					w: 1,
					h: 1,
					checks: []
				},
				7_5: {
					name: '? block',
					x: 6,
					y: 7,
					w: 1,
					h: 1,
					checks: [
						{
							name: '? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							},
							ap: [8112000356]
						}
					]
				},
				7_6: {
					name: '',
					x: 7,
					y: 7,
					w: 1,
					h: 1,
					checks: []
				},
				7_7: {
					name: 'Brick block circle',
					x: 8,
					y: 7,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Tree top right of the north exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							},
							ap: [8112000357]
						},
						{
							name: 'Brick block top left',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							},
							ap: [8112000358]
						},
						{
							name: 'Brick block top right',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							},
							ap: [8112000359]
						},
						{
							name: 'Brick block right',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							},
							ap: [8112000360]
						},
						{
							name: 'Brick block left',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							},
							ap: [8112000361]
						},
						{
							name: 'Brick block bottom left',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							},
							ap: [8112000362]
						},
						{
							name: 'Brick block bottom right',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							},
							ap: [8112000363]
						}
					]
				},
				dry_dry_outpost_west: {
					name: 'Dry Dry Outpost West',
					x: 9,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Turn in lyrics in the far east house',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && save.data.items.lyrics;
							},
							ap: [8112000293]
						},
						{
							name: 'Red tree',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							},
							ap: [8112000296]
						},
						{
							name: 'Shop item 1',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.dry_dry_desert();
							},
							ap: [8112000297]
						},
						{
							name: 'Shop item 3',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.dry_dry_desert();
							},
							ap: [8112000299]
						},
						{
							name: 'Shop item 6',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.dry_dry_desert();
							},
							ap: [8112000302]
						},
						{
							name: 'Little Mouser',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.deliver_letters() && save.data.items.letters.little_mouser;
							},
							ap: [8112000295]
						},
						{
							name: 'Buy Dusty Hammer, Dried Pasta, Dusty Hammer, Dried Shroom',
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return flags.dry_dry_desert();
							},
							ap: [8112000294]
						}
					]
				},
				dry_dry_outpost_east: {
					name: 'Dry Dry Outpost East',
					x: 10,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Talk to Moustafa after buying Dried Shroom and Dusty Hammer',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && save.data.items.boots >= 1;
							},
							ap: [8112000305]
						},
						{
							name: 'Item on the rooftops',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && save.data.items.boots >= 1;
							},
							ap: [8112000303]
						},
						{
							name: 'Rooftop',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.panels();
							},
							ap: [8112000307]
						},
						{
							name: 'Mr E',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.deliver_letters() && save.data.items.letters.mr_e;
							},
							ap: [8112000306]
						},
						{
							name: 'Talk to Merlee after Merluvlee requests her Crystal Ball',
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return (
									flags.dry_dry_desert() &&
									save.data.items.boots >= 1 &&
									flags.star_spirits_count() >= 2 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic
								);
							},
							ap: [8112000304]
						}
					]
				}
			}
		},
		dry_dry_ruins: {
			name: 'Dry Dry Ruins',
			exists: () => {
				return flags.lcl(2, true);
			},
			maps: {
				entrance: {
					name: 'Entrance',
					x: 2,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				pokey_hall: {
					name: 'Pokey Hall',
					x: 3,
					y: 1,
					w: 1,
					h: 2,
					checks: [
						{
							name: 'Inside middle coffin',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_ruins(false, false);
							},
							ap: [8112000364]
						}
					]
				},
				first_sand_switch: {
					name: 'First Sand Switch',
					x: 4,
					y: 1,
					w: 1,
					h: 1,
					checks: []
				},
				first_sand_pit: {
					name: 'First Sand Pit',
					x: 4,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item on elevated platform',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_ruins(false);
							},
							ap: [8112000365]
						}
					]
				},
				first_hub: {
					name: 'First Hub',
					x: 5,
					y: 1,
					w: 1,
					h: 3,
					checks: []
				},
				second_sand_switch: {
					name: 'Second Sand Switch',
					x: 6,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Bottom right corner after lowering the sand',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_ruins() && save.data.items.ruins_key >= 1 && flags.partner('parakarry') && flags.partner('bombette');
							},
							ap: [8112000367]
						}
					]
				},
				second_sand_pit: {
					name: 'Second Sand Pit',
					x: 6,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item on the elevated platform',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_ruins() && save.data.items.ruins_key >= 1 && flags.partner('parakarry') && flags.partner('bombette');
							},
							ap: [8112000368]
						}
					]
				},
				pyramid_stone: {
					name: 'Pyramid Stone',
					x: 6,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item on the elevated platform',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_ruins() && flags.stone_blocks() && save.data.items.ruins_key >= 1;
							},
							ap: [8112000366]
						}
					]
				},
				three_pokeys_room: {
					name: 'Three Pokeys Room',
					x: 4,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Defeat all three pokey after hitting the ? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_ruins() && save.data.items.ruins_key >= 2;
							},
							ap: [8112000369]
						},
						{
							name: 'On the ledge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_ruins() && flags.stone_blocks() && save.data.items.ruins_key >= 2;
							},
							ap: [8112000370]
						}
					]
				},
				second_hub: {
					name: 'Second Hub',
					x: 3,
					y: 3,
					w: 1,
					h: 2,
					checks: []
				},
				super_hammer: {
					name: 'Super Hammer',
					x: 2,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Secret item behind the Dark Souls invisible wall on the ledge above the big chest',
							tooltip: 'Fall on the second beam and run into the wall on the left',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_ruins() && save.data.items.ruins_key >= 3 && flags.partner('parakarry');
							},
							ap: [8112000371]
						},
						{
							name: 'Super Hammer Chest',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_ruins() && save.data.items.ruins_key >= 3 && flags.partner('parakarry');
							},
							ap: [8112000372]
						}
					]
				},
				spring: {
					name: 'Spring',
					x: 2,
					y: 4,
					w: 1,
					h: 4,
					checks: [
						{
							name: 'Super Block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.dry_dry_ruins() && save.data.items.ruins_key >= 3;
							},
							ap: [8112000373]
						}
					]
				},
				diamond_stone: {
					name: 'Diamond Stone',
					x: 1,
					y: 7,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item on the pedestal',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_ruins() && save.data.items.ruins_key >= 3 && flags.partner('bombette') && save.data.items.hammer >= 2;
							},
							ap: [8112000376]
						}
					]
				},
				beetles: {
					name: 'Beetles',
					x: 3,
					y: 7,
					w: 3,
					h: 1,
					checks: []
				},
				wall_stairs: {
					name: 'Wall Stairs',
					x: 6,
					y: 5,
					w: 1,
					h: 3,
					checks: [
						{
							name: 'Item on the ledge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_ruins() && flags.stone_blocks() && save.data.items.ruins_key >= 3;
							},
							ap: [8112000374]
						}
					]
				},
				stone_puzzle: {
					name: 'Stone Puzzle',
					x: 4,
					y: 4,
					w: 2,
					h: 2,
					checks: []
				},
				stone_puzzle_solution: {
					name: 'Stone Puzzle Solution',
					x: 6,
					y: 4,
					w: 1,
					h: 1,
					checks: []
				},
				lunar_stone: {
					name: 'Lunar Stone',
					x: 7,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item on the pedestal',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_ruins() && flags.stone_blocks() && save.data.items.ruins_key >= 4;
							},
							ap: [8112000375]
						}
					]
				},
				heart_block: {
					name: 'Heart Block',
					x: 4,
					y: 6,
					w: 1,
					h: 1,
					checks: []
				},
				tutankoopa: {
					name: 'Tutankoopa',
					x: 5,
					y: 6,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Mamar',
							icon: '/images/checks/stars/mamar.webp',
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_ruins() && save.data.items.ruins_key >= 3 && save.data.items.pyramid_stone && save.data.items.diamond_stone && save.data.items.lunar_stone;
							}
						}
					]
				}
			}
		},
		forever_forest: {
			name: 'Forever Forest',
			exists: () => {
				return flags.lcl(3);
			},
			maps: {
				toad_town: {
					name: 'Toad Town',
					x: 9,
					y: 5,
					w: 1,
					h: 1,
					transparent: true,
					checks: []
				},
				toad_town_1_arrow: {
					name: upArrow,
					x: 9,
					y: 4,
					w: 1,
					h: 1,
					transparent: true,
					checks: []
				},
				entrance: {
					name: 'Entrance',
					x: 9,
					y: 3,
					w: 1,
					h: 1,
					checks: []
				},
				entrance_second_room_arrow: {
					name: upArrow,
					x: 9,
					y: 2,
					w: 1,
					h: 1,
					transparent: true,
					checks: []
				},
				second_room: {
					name: 'Second Room',
					x: 9,
					y: 1,
					w: 1,
					h: 1,
					checks: []
				},
				second_room_oaklie_arrow: {
					name: leftArrow,
					x: 8,
					y: 1,
					w: 1,
					h: 1,
					transparent: true,
					checks: []
				},
				oaklie: {
					name: 'Oaklie',
					x: 7,
					y: 1,
					w: 1,
					h: 1,
					checks: []
				},
				oaklie_bub_ulb_arrow: {
					name: downArrow,
					x: 7,
					y: 2,
					w: 1,
					h: 1,
					transparent: true,
					checks: []
				},
				bub_ulb: {
					name: 'Bub-ulb',
					x: 7,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Bub-ulb',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.forever_forest();
							},
							ap: [8112000377]
						}
					]
				},
				bub_ulb_fifth_arrow: {
					name: leftArrow,
					x: 6,
					y: 3,
					w: 1,
					h: 1,
					transparent: true,
					checks: []
				},
				fifth_room: {
					name: 'Fifth Room',
					x: 5,
					y: 3,
					w: 1,
					h: 1,
					checks: []
				},
				fifth_hp_plus_arrow: {
					name: upArrow,
					x: 5,
					y: 2,
					w: 1,
					h: 1,
					transparent: true,
					checks: []
				},
				hp_plus: {
					name: 'HP Plus',
					x: 5,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: '? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.forever_forest() && flags.jump_coin_blocks();
							},
							ap: [8112000378]
						}
					]
				},
				fifth_sixth_arrow: {
					name: downArrow,
					x: 5,
					y: 4,
					w: 1,
					h: 1,
					transparent: true,
					checks: []
				},
				sixth_room: {
					name: 'Sixth Room',
					x: 5,
					y: 5,
					w: 1,
					h: 1,
					checks: []
				},
				sixth_seventh_arrow: {
					name: leftArrow,
					x: 4,
					y: 5,
					w: 1,
					h: 1,
					transparent: true,
					checks: []
				},
				seventh_room: {
					name: 'Seventh Room',
					x: 3,
					y: 5,
					w: 1,
					h: 1,
					checks: []
				},
				seventh_fp_plus_arrow: {
					name: leftArrow,
					x: 2,
					y: 5,
					w: 1,
					h: 1,
					transparent: true,
					checks: []
				},
				fp_plus: {
					name: 'FP Plus',
					x: 1,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: '? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.forever_forest() && flags.jump_coin_blocks();
							},
							ap: [8112000379]
						}
					]
				},
				seventh_boo_mansion_arrow: {
					name: upArrow,
					x: 3,
					y: 4,
					w: 1,
					h: 1,
					transparent: true,
					checks: []
				},
				boo_mansion: {
					name: "Boo's Mansion",
					x: 3,
					y: 3,
					w: 1,
					h: 1,
					transparent: true,
					checks: []
				}
			}
		},
		boo_mansion: {
			name: "Boo's Mansion",
			exists: () => {
				return flags.lcl(3);
			},
			maps: {
				bow_bedroom: {
					name: "Bow's Bedroom",
					x: 2,
					y: 1,
					w: 2,
					h: 1,
					checks: [
						{
							name: 'Bow',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boo_portrait;
							},
							ap: [8112000405]
						}
					]
				},
				phonograph: {
					name: 'Phonograph',
					x: 2,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Chest guarded by a boo',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.record;
							},
							ap: [8112000402]
						}
					]
				},
				boo_circle_minigame: {
					name: 'Boo circle minigame',
					x: 3,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Open the middle cabinet on the left and do the minigame',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.boo_mansion();
							},
							ap: [8112000403]
						},
						{
							name: 'Middle of the room',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.boo_mansion() && flags.panels();
							},
							ap: [8112000404]
						}
					]
				},
				second_floor: {
					name: '2F',
					x: 2,
					y: 3,
					w: 2,
					h: 1,
					checks: []
				},
				first_floor: {
					name: '1F',
					x: 2,
					y: 4,
					w: 2,
					h: 1,
					checks: [
						{
							name: 'Franky',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.boo_mansion() && flags.deliver_letters() && save.data.items.letters.franky && save.data.items.boo_portrait;
							},
							ap: [8112000384]
						},
						{
							name: 'By the couch',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.boo_mansion() && flags.panels();
							},
							ap: [8112000385]
						},
						{
							name: 'Talk to Franky (After Koopa Koot asks for the Old Photo)',
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return (
									flags.boo_mansion() &&
									flags.star_spirits_count() >= 4 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic &&
									save.data.items.koopa_koot_favors.merluvlee_autograph &&
									save.data.items.koopa_koot_favors.life_shroom &&
									save.data.items.koopa_koot_favors.nutty_cake &&
									save.data.items.eldstar &&
									flags.partner('bombette')
								);
							},
							ap: [8112000383]
						}
					]
				},
				outside: {
					name: 'Outside',
					x: 2,
					y: 5,
					w: 2,
					h: 1,
					checks: [
						{
							name: '? block outside of the gate',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.boo_mansion(false) && flags.jump_coin_blocks();
							},
							ap: [8112000380]
						},
						{
							name: 'Bush near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.boo_mansion(false);
							},
							ap: [8112000381]
						}
					]
				},
				stairs: {
					name: 'Stairs',
					x: 1,
					y: 4,
					w: 1,
					h: 4,
					checks: [
						{
							name: 'In front of the grandfather clock downstairs',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.boo_mansion() && (save.data.items.weight || (save.data.items.boots >= 2 && flags.partner('bombette'))) && flags.panels();
							},
							ap: [8112000386]
						}
					]
				},
				pixel_mario: {
					name: 'Pixel Mario',
					x: 4,
					y: 4,
					w: 1,
					h: 3,
					checks: [
						{
							name: 'Bottom crate of the right stack of crates',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boots >= 2;
							},
							ap: [8112000398]
						},
						{
							name: 'Left crate',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boots >= 2;
							},
							ap: [8112000399]
						}
					]
				},
				library: {
					name: 'Library',
					x: 2,
					y: 7,
					w: 3,
					h: 1,
					checks: [
						{
							name: 'Item on the right bookshelf',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boots >= 2 && flags.partner('parakarry');
							},
							ap: [8112000400]
						},
						{
							name: 'Bottom crate of the stack of crates',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boots >= 2;
							},
							ap: [8112000401]
						}
					]
				},
				above_shop: {
					name: 'Above Shop',
					x: 1,
					y: 8,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Right crate on the west side of the room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boots >= 2 && (flags.partner('bombette') || save.data.items.weight);
							},
							ap: [8112000387]
						}
					]
				},
				super_boots: {
					name: 'Super Boots',
					x: 2,
					y: 8,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Super Boots chest',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.boo_mansion() && ((save.data.items.boots >= 2 && flags.partner('bombette')) || save.data.items.weight);
							},
							ap: [8112000396]
						},
						{
							name: 'Bottom left crate',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boots >= 2 && (flags.partner('bombette') || save.data.items.weight);
							},
							ap: [8112000395]
						},
						{
							name: 'On the left of the room near the door',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boots >= 2 && (flags.partner('bombette') || save.data.items.weight);
							},
							ap: [8112000397]
						}
					]
				},
				shop: {
					name: 'Shop',
					x: 1,
					y: 9,
					w: 2,
					h: 1,
					checks: [
						{
							name: 'Shop item 1',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boo_portrait && ((flags.partner('bombette') && save.data.items.boots >= 2) || save.data.items.weight);
							},
							ap: [8112000389]
						},
						{
							name: 'Shop item 2',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boo_portrait && ((flags.partner('bombette') && save.data.items.boots >= 2) || save.data.items.weight);
							},
							ap: [8112000390]
						},
						{
							name: 'Shop item 3',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boo_portrait && ((flags.partner('bombette') && save.data.items.boots >= 2) || save.data.items.weight);
							},
							ap: [8112000391]
						},
						{
							name: 'Shop item 4',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boo_portrait && ((flags.partner('bombette') && save.data.items.boots >= 2) || save.data.items.weight);
							},
							ap: [8112000392]
						},
						{
							name: 'Shop item 5',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boo_portrait && ((flags.partner('bombette') && save.data.items.boots >= 2) || save.data.items.weight);
							},
							ap: [8112000393]
						},
						{
							name: 'Shop item 6',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boo_portrait && ((flags.partner('bombette') && save.data.items.boots >= 2) || save.data.items.weight);
							},
							ap: [8112000394]
						},
						{
							name: 'Igor',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return (
									flags.boo_mansion() &&
									((flags.partner('bombette') && save.data.items.boots >= 2) || save.data.items.weight) &&
									flags.deliver_letters() &&
									save.data.items.letters.igor
								);
							},
							ap: [8112000388]
						}
					]
				}
			}
		},
		gusty_gulch: {
			name: 'Gusty Gulch',
			exists: () => {
				return flags.lcl(3);
			},
			maps: {
				gate: {
					name: 'Gate',
					x: 1,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'East of the gate',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.gusty_gulch() && flags.panels();
							},
							ap: [8112000382]
						}
					]
				},
				windmill: {
					name: 'Windmill',
					x: 2,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Tubba Blubba',
							icon: '/images/checks/stars/skolar.webp',
							exists: () => {
								return true;
							},
							available: () => {
								return flags.gusty_gulch() && flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 3 && save.data.items.boots >= 2;
							}
						}
					]
				},
				village_west: {
					name: 'Village west',
					x: 3,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Block in the far right house',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.gusty_gulch();
							},
							ap: [8112000412]
						},
						{
							name: 'Talk to the Boo nead the Save Block (After Koopa Koot asks for the Package)',
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return (
									flags.boo_mansion() &&
									flags.star_spirits_count() >= 6 &&
									save.data.items.koopa_koot_favors.koopa_legends &&
									save.data.items.koopa_koot_favors.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic &&
									save.data.items.koopa_koot_favors.merluvlee_autograph &&
									save.data.items.koopa_koot_favors.life_shroom &&
									save.data.items.koopa_koot_favors.nutty_cake &&
									save.data.items.eldstar &&
									flags.partner('bombette') &&
									save.data.items.koopa_koot_favors.old_photo &&
									save.data.items.koopa_koot_favors.koopasta &&
									save.data.items.koopa_koot_favors.glasses &&
									save.data.items.koopa_koot_favors.lime &&
									save.data.items.koopa_koot_favors.kooky_cookie
								);
							},
							ap: [8112000411]
						}
					]
				},
				village_east: {
					name: 'Village east',
					x: 4,
					y: 1,
					w: 1,
					h: 1,
					checks: []
				},
				gulch_west: {
					name: 'Gulch west',
					x: 5,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'First ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.gusty_gulch();
							},
							ap: [8112000408]
						},
						{
							name: 'Item on the ledge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.gusty_gulch() && flags.partner('kooper');
							},
							ap: [8112000406]
						},
						{
							name: 'Left ? block near the Goomba',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.gusty_gulch();
							},
							ap: [8112000409]
						},
						{
							name: 'Right ? block near the Goomba',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.gusty_gulch();
							},
							ap: [8112000410]
						},
						{
							name: 'Item in front of the log',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.gusty_gulch();
							},
							ap: [8112000407]
						}
					]
				},
				gulch_east: {
					name: 'Gulch east',
					x: 6,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: '? block near the Goomba',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.gusty_gulch() && flags.partner('parakarry');
							},
							ap: [8112000413]
						},
						{
							name: 'Item behind the rock and the dead tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.gusty_gulch() && flags.partner('parakarry');
							},
							ap: [8112000415]
						},
						{
							name: '? block near the east exit',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.gusty_gulch() && flags.partner('parakarry');
							},
							ap: [8112000414]
						},
						{
							name: 'Near the east exit',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.gusty_gulch() && flags.partner('parakarry');
							},
							ap: [8112000416]
						}
					]
				},
				outside_tubba_blubba_castle: {
					name: "Outside Tubba Blubba's Castle",
					x: 7,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: skolar_dungeon_shuffle_name,
							icon: skolar_dungeon_shuffle_icon,
							dungeon: 3,
							exists: () => {
								return save.data.configs.randomizer.shuffle_dungeon_entrances;
							},
							available: () => {
								return flags.dungeon_checks_available(3);
							}
						}
					]
				}
			}
		},
		tubba_blubba_castle: {
			name: "Tubba Blubba's Castle",
			exists: () => {
				return flags.lcl(3, true);
			},
			maps: {
				main_hall: {
					name: 'Main Hall',
					x: 5,
					y: 2,
					w: 1,
					h: 5,
					checks: []
				},
				hallway_1f: {
					name: 'Hallway 1F',
					x: 3,
					y: 6,
					w: 2,
					h: 1,
					checks: []
				},
				study: {
					name: 'Study',
					x: 3,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'On the table',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.tubba_blubba_castle();
							},
							ap: [8112000420]
						}
					]
				},
				spring_and_tables: {
					name: 'Spring and tables',
					x: 4,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Left table',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 1 && flags.partner('bombette') && flags.partner('parakarry') && save.data.items.boots >= 2;
							},
							ap: [8112000421]
						}
					]
				},
				table: {
					name: 'Table',
					x: 2,
					y: 6,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'On the table',
							tooltip: 'Fall from above',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 1;
							},
							ap: [8112000417]
						}
					]
				},
				abandoned_basement_stairwell: {
					name: 'Abandoned basement stairwell',
					x: 2,
					y: 5,
					w: 1,
					h: 1,
					checks: []
				},
				main_basement_stairwell: {
					name: 'Main basement stairwell',
					x: 1,
					y: 6,
					w: 1,
					h: 2,
					checks: [
						{
							name: 'Super Block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.tubba_blubba_castle();
							},
							ap: [8112000418]
						}
					]
				},
				basement: {
					name: 'Basement',
					x: 2,
					y: 7,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Chest',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.tubba_blubba_castle() && save.data.items.boots >= 2;
							},
							ap: [8112000419]
						}
					]
				},
				stairwell_1f: {
					name: '1F stairwell',
					x: 6,
					y: 4,
					w: 1,
					h: 3,
					checks: []
				},
				hallway_2f: {
					name: 'Hallway 2F',
					x: 3,
					y: 4,
					w: 2,
					h: 1,
					checks: []
				},
				spikes: {
					name: 'Spikes',
					x: 3,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Chest',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 1 && flags.partner('bow');
							},
							ap: [8112000422]
						}
					]
				},
				floor_panel: {
					name: 'Floor panel',
					x: 4,
					y: 3,
					w: 1,
					h: 1,
					checks: []
				},
				above_table: {
					name: 'Above the table',
					x: 2,
					y: 4,
					w: 1,
					h: 1,
					checks: []
				},
				behind_clock: {
					name: 'Behind the clock',
					x: 2,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Behind the wall on the shelf on the west side of the room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 1 && flags.partner('parakarry');
							},
							ap: [8112000423]
						},
						{
							name: 'Coin on the bed 1',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 1 && flags.partner('parakarry');
							},
							ap: [8112000424]
						},
						{
							name: 'Coin on the bed 2',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 1 && flags.partner('parakarry');
							},
							ap: [8112000425]
						},
						{
							name: 'Coin on the bed 3',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 1 && flags.partner('parakarry');
							},
							ap: [8112000426]
						},
						{
							name: 'Coin on the bed 4',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 1 && flags.partner('parakarry');
							},
							ap: [8112000427]
						},
						{
							name: 'Coin on the bed 5',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 1 && flags.partner('parakarry');
							},
							ap: [8112000428]
						},
						{
							name: 'Coin on the bed 6',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 1 && flags.partner('parakarry');
							},
							ap: [8112000429]
						}
					]
				},
				stairwell_2f: {
					name: '2F stairwell',
					x: 1,
					y: 2,
					w: 1,
					h: 3,
					checks: [
						{
							name: '? block down the stairs',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 2;
							},
							ap: [8112000430]
						}
					]
				},
				chase_hallway: {
					name: 'Chase hallway',
					x: 2,
					y: 2,
					w: 2,
					h: 1,
					checks: []
				},
				sleeping_clubba: {
					name: 'Sleeping Clubbas',
					x: 3,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item at the end of the hallway',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 2;
							},
							ap: [8112000431]
						}
					]
				},
				save_block: {
					name: 'Save block',
					x: 4,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				tubba_blubba_bedroom: {
					name: "Tubba Blubba's Bedroom",
					x: 6,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				}
			}
		},
		toybox: {
			name: "Shy Guy's Toybox",
			exists: () => {
				return flags.lcl(4, true);
			},
			maps: {
				blue_station: {
					name: 'Blue Station',
					x: 3,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Invisible block east of the room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox(false, false) && flags.jump_coin_blocks();
							},
							ap: [8112000444]
						},
						{
							name: 'In front of the station',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.toybox(false) && flags.panels();
							},
							ap: [8112000443]
						}
					]
				},
				block_city: {
					name: 'Block City',
					x: 4,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item 1 on the left spring',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							},
							ap: [8112000450]
						},
						{
							name: 'Item 2 on the left spring',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							},
							ap: [8112000451]
						},
						{
							name: 'Item 3 on the left spring',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							},
							ap: [8112000452]
						},
						{
							name: 'Item 1 on the spring of top of the first wall',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							},
							ap: [8112000453]
						},
						{
							name: 'Item 2 on the spring of top of the first wall',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							},
							ap: [8112000454]
						},
						{
							name: 'Item 3 on the spring of top of the first wall',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							},
							ap: [8112000455]
						},
						{
							name: 'Item 4 on the spring of top of the first wall',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							},
							ap: [8112000456]
						},
						{
							name: 'Item 5 on the spring of top of the first wall',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							},
							ap: [8112000457]
						},
						{
							name: 'Item behind the fallen blocks',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							},
							ap: [8112000459]
						},
						{
							name: 'Item of the roof of the west most building',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false) && flags.partner('parakarry');
							},
							ap: [8112000458]
						},
						{
							name: '? block on the west side of the last wall',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							},
							ap: [8112000447]
						},
						{
							name: '? block on the east side of the last wall',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							},
							ap: [8112000448]
						},
						{
							name: '? block on the ledge at the end of the room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							},
							ap: [8112000449]
						},
						{
							name: 'Item that Kammy spawns',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							},
							ap: [8112000445]
						},
						{
							name: 'Chest',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							},
							ap: [8112000446]
						}
					]
				},
				anti_guy: {
					name: 'Anti Guy',
					x: 2,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Invisible block near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox(false, false) && flags.jump_coin_blocks();
							},
							ap: [8112000504]
						},
						{
							name: "Anti Guy's chest",
							tooltip: 'In logic if you can make a Lemon Candy (Lemon + Cake Mix)',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox(false, false) && save.data.items.anti_guy;
							},
							ap: [8112000502]
						},
						{
							name: '? block near the west exit',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox(false, false) && flags.jump_coin_blocks();
							},
							ap: [8112000503]
						}
					]
				},
				playroom: {
					name: 'Playroom',
					x: 1,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Eastern invisible block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox(false, false) && flags.jump_coin_blocks();
							},
							ap: [8112000439]
						},
						{
							name: 'Western invisible block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox(false, false) && flags.jump_coin_blocks();
							},
							ap: [8112000438]
						},
						{
							name: 'Yellow Shy Guy',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox(false, false);
							},
							ap: [8112000434]
						},
						{
							name: 'Red Shy Guy 1',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox(false, false);
							},
							ap: [8112000433]
						},
						{
							name: 'Red Shy Guy 2',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox(false, false);
							},
							ap: [8112000432]
						},
						{
							name: 'Blue Shy Guy',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox(false, false);
							},
							ap: [8112000436]
						},
						{
							name: 'South yellow shy guy',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox(false, false);
							},
							ap: [8112000435]
						},
						{
							name: 'Green Shy Guy',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox(false, false);
							},
							ap: [8112000437]
						}
					]
				},
				pink_station: {
					name: 'Pink Station',
					x: 3,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Chest on the east of the station',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train;
							},
							ap: [8112000465]
						},
						{
							name: 'Invisible block by the pink lever',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							},
							ap: [8112000466]
						},
						{
							name: 'In front of the station',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && flags.panels();
							},
							ap: [8112000467]
						}
					]
				},
				playhouse: {
					name: 'Playhouse',
					x: 4,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Chest on the wall near the west exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox_jack_in_a_box() && save.data.items.toy_train;
							},
							ap: [8112000470]
						},
						{
							name: '? block in the alley past the house',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox_jack_in_a_box() && save.data.items.toy_train;
							},
							ap: [8112000472]
						},
						{
							name: 'Chest past the alley and past the house',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox_jack_in_a_box() && save.data.items.toy_train;
							},
							ap: [8112000471]
						},
						{
							name: 'Item that Kammy spawns',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox_jack_in_a_box() && save.data.items.toy_train;
							},
							ap: [8112000468]
						},
						{
							name: 'Chest at the end of the room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox_jack_in_a_box() && save.data.items.toy_train;
							},
							ap: [8112000469]
						}
					]
				},
				tracks_hallway: {
					name: 'Tracks Hallway',
					x: 2,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: '? block on top of the podium south of the tracks',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train;
							},
							ap: [8112000505]
						},
						{
							name: 'West ? block north of the tracks',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							},
							ap: [8112000506]
						},
						{
							name: 'East ? block north of the tracks',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							},
							ap: [8112000507]
						},
						{
							name: 'Block between the two ? blocks north of the tracks',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							},
							ap: [8112000508]
						}
					]
				},
				gourmet_guy: {
					name: 'Gourmet Guy',
					x: 1,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Give the cake to Gourmet Guy',
							tooltip: 'You can find a cake or cook a Cake Mix',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							},
							ap: [8112000460]
						},
						{
							name: '? block north of the tracks, left of the Gourmet Guy Gate',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							},
							ap: [8112000461]
						},
						{
							name: 'Left ? block north of the tracks, right of the Gourmet Guy Gate',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							},
							ap: [8112000462]
						},
						{
							name: 'Middle invisible block north of the tracks, right of the Gourmet Guy Gate',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							},
							ap: [8112000464]
						},
						{
							name: 'Right ? block north of the tracks, right of the Gourmet Guy Gate',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							},
							ap: [8112000463]
						}
					]
				},
				green_station: {
					name: 'Green Station',
					x: 3,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'In front of the station',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.panels();
							},
							ap: [8112000473]
						},
						{
							name: 'Invisible block east of the station',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							},
							ap: [8112000474]
						}
					]
				},
				treadmills: {
					name: 'Treadmills',
					x: 4,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item 1 on the first threadmill',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							},
							ap: [8112000477]
						},
						{
							name: 'Item 2 on the first threadmill',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							},
							ap: [8112000478]
						},
						{
							name: 'Item 3 on the first threadmill',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							},
							ap: [8112000479]
						},
						{
							name: 'Item 1 on the second threadmill',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							},
							ap: [8112000480]
						},
						{
							name: 'Item 2 on the second threadmill',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							},
							ap: [8112000481]
						},
						{
							name: 'Item 3 on the second threadmill',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							},
							ap: [8112000482]
						},
						{
							name: 'Yellow Shy Guy on the last threadmill',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow');
							},
							ap: [8112000490]
						},
						{
							name: 'Block on the pink moving platform',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow') && flags.partner('parakarry');
							},
							ap: [8112000491]
						},
						{
							name: 'Coin 1 inside the fort',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow');
							},
							ap: [8112000484]
						},
						{
							name: 'Coin 2 inside the fort',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow');
							},
							ap: [8112000485]
						},
						{
							name: 'Coin 3 inside the fort',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow');
							},
							ap: [8112000486]
						},
						{
							name: 'Coin 4 inside the fort',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow');
							},
							ap: [8112000487]
						},
						{
							name: 'Coin 5 inside the fort',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow');
							},
							ap: [8112000488]
						},
						{
							name: 'Coin 6 inside the fort',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow');
							},
							ap: [8112000489]
						},
						{
							name: 'Item in the fort',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow');
							},
							ap: [8112000483]
						},
						{
							name: 'Item that Kammy spawns',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow') && flags.partner('parakarry');
							},
							ap: [8112000475]
						},
						{
							name: 'Chest at the end of the room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow') && flags.partner('parakarry');
							},
							ap: [8112000476]
						}
					]
				},
				red_station: {
					name: 'Red Station',
					x: 3,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'In front of the station',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.panels() && save.data.items.hammer >= 1;
							},
							ap: [8112000493]
						},
						{
							name: 'Invisible block west of the station',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && save.data.items.hammer >= 1;
							},
							ap: [8112000492]
						}
					]
				},
				moving_platforms: {
					name: 'Moving Platforms',
					x: 2,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Invisible block next of the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && save.data.items.hammer >= 1;
							},
							ap: [8112000494]
						},
						{
							name: 'On top of the wheel',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && save.data.items.hammer >= 1;
							},
							ap: [8112000500]
						},
						{
							name: 'Left ? block in the middle of the room',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && save.data.items.hammer >= 1;
							},
							ap: [8112000496]
						},
						{
							name: 'Middle invisible block in the middle of the room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && save.data.items.hammer >= 1;
							},
							ap: [8112000497]
						},
						{
							name: 'Right ? block in the middle of the room',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && save.data.items.hammer >= 1;
							},
							ap: [8112000498]
						},
						{
							name: 'Hidden block near the west exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && save.data.items.hammer >= 1;
							},
							ap: [8112000495]
						},
						{
							name: 'Super Block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('parakarry') && save.data.items.hammer >= 1;
							},
							ap: [8112000499]
						}
					]
				},
				lantern_ghost: {
					name: 'Lantern Ghost',
					x: 1,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Watt',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && save.data.items.hammer >= 1;
							},
							ap: [8112000501]
						}
					]
				},
				shy_guys_baricade: {
					name: 'Shy Guys Baricade',
					x: 4,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item on top of the brick block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return (
									flags.toybox() &&
									save.data.items.toy_train &&
									save.data.items.cake &&
									flags.partner('bombette') &&
									(save.data.items.boots >= 3 || (flags.toybox_jack_in_a_box() && flags.partner('kooper'))) &&
									save.data.items.hammer >= 1
								);
							},
							ap: [8112000442]
						},
						{
							name: 'Invisible ? block near the item on top of the brick block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bombette') && save.data.items.hammer >= 1;
							},
							ap: [8112000441]
						},
						{
							name: '? block near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bombette') && save.data.items.hammer >= 1;
							},
							ap: [8112000440]
						}
					]
				},
				dark_room: {
					name: 'Dark Room',
					x: 5,
					y: 4,
					w: 1,
					h: 1,
					checks: []
				},
				general_guy: {
					name: 'General Guy',
					x: 6,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Muskular',
							icon: '/images/checks/stars/muskular.webp',
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bombette') && flags.partner('watt') && save.data.items.hammer >= 1;
							}
						}
					]
				}
			}
		},
		lava_lava_island: {
			name: 'Lava Lava Island',
			exists: () => {
				return flags.lcl(5);
			},
			maps: {
				whale: {
					name: 'Whale',
					x: 1,
					y: 6,
					w: 1,
					h: 2,
					checks: [
						{
							name: 'Item 1 on the spinning flower',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							},
							ap: [8112000509]
						},
						{
							name: 'Item 2 on the spinning flower',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							},
							ap: [8112000510]
						},
						{
							name: 'Coconut tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							},
							ap: [8112000512]
						},
						{
							name: 'Item behind the bush north of the screen',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island();
							},
							ap: [8112000511]
						}
					]
				},
				beach: {
					name: 'Beach',
					x: 2,
					y: 7,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Coconut tree 1',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							},
							ap: [8112000518]
						},
						{
							name: 'Coconut tree 2',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							},
							ap: [8112000519]
						},
						{
							name: 'Coconut tree 3',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							},
							ap: [8112000520]
						},
						{
							name: 'Coconut tree 4',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							},
							ap: [8112000521]
						},
						{
							name: 'Coconut tree 5',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							},
							ap: [8112000522]
						},
						{
							name: 'Coconut tree near the east exit (item 1)',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							},
							ap: [8112000523]
						},
						{
							name: 'Coconut tree near the east exit (item 2)',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							},
							ap: [8112000524]
						},
						{
							name: 'West invisible block by the bell plant',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_coin_blocks();
							},
							ap: [8112000514]
						},
						{
							name: 'East invisible block by the bell plant',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_coin_blocks();
							},
							ap: [8112000515]
						},
						{
							name: 'Item 1 on the spinning flower',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							},
							ap: [8112000516]
						},
						{
							name: 'Item 2 on the spinning flower',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							},
							ap: [8112000517]
						},
						{
							name: 'Item on the rock in the middle of the screen',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							},
							ap: [8112000513]
						}
					]
				},
				west_village: {
					name: 'West Village',
					x: 3,
					y: 7,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'In front of the raven statue',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.lava_lava_island() && flags.panels();
							},
							ap: [8112000528]
						},
						{
							name: 'Talk to the Yoshi Chief',
							tooltip: 'After saving all the kids',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('watt') && flags.partner('sushie') && save.data.items.boots >= 1 && save.data.items.hammer >= 1;
							},
							ap: [8112000525]
						},
						{
							name: 'West coconut tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							},
							ap: [8112000526]
						},
						{
							name: 'East coconut tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							},
							ap: [8112000527]
						}
					]
				},
				east_village: {
					name: 'East Village',
					x: 4,
					y: 7,
					w: 2,
					h: 1,
					checks: [
						{
							name: 'Shop item 1',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							},
							ap: [8112000533]
						},
						{
							name: 'Shop item 2',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							},
							ap: [8112000534]
						},
						{
							name: 'Shop item 3',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							},
							ap: [8112000535]
						},
						{
							name: 'Shop item 4',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							},
							ap: [8112000536]
						},
						{
							name: 'Shop item 5',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							},
							ap: [8112000537]
						},
						{
							name: 'Shop item 6',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							},
							ap: [8112000538]
						},
						{
							name: 'Red Yoshi Kid',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.lava_lava_island() && flags.deliver_letters() && save.data.items.letters.red_yoshi_kid;
							},
							ap: [8112000531]
						},
						{
							name: 'Give a Tayce T. item to the Yellow Adult Yoshi',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return (
									flags.lava_lava_island() &&
									flags.toad_town() &&
									flags.partner('watt') &&
									flags.partner('sushie') &&
									flags.jump_ledges() &&
									save.data.items.hammer >= 1 &&
									save.data.items.misstar &&
									(save.data.configs.logic.cook_without_frying_pan || save.data.items.frying_pan)
								);
							},
							ap: [8112000530]
						},
						{
							name: 'Give the volcano vase to Kolorado',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return (
									flags.lava_lava_island() &&
									flags.partner('watt') &&
									flags.partner('sushie') &&
									save.data.items.boots >= 1 &&
									save.data.items.hammer >= 1 &&
									save.data.items.volcano_vase &&
									save.data.items.misstar
								);
							},
							ap: [8112000529]
						},
						{
							name: 'Coconut tree near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							},
							ap: [8112000532]
						}
					]
				},
				outside_volcano: {
					name: 'Outside Volcano',
					x: 6,
					y: 7,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item behind the large tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island();
							},
							ap: [8112000575]
						},
						{
							name: misstar_dungeon_shuffle_name,
							icon: misstar_dungeon_shuffle_icon,
							dungeon: 4,
							exists: () => {
								return save.data.configs.randomizer.shuffle_dungeon_entrances;
							},
							available: () => {
								return flags.dungeon_checks_available(5);
							}
						}
					]
				},
				sw_jungle: {
					name: 'SW Jungle',
					x: 2,
					y: 6,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Invisible block near the north exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_coin_blocks() && flags.partner('sushie');
							},
							ap: [8112000553]
						},
						{
							name: 'Coin 1 underwater',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie');
							},
							ap: [8112000550]
						},
						{
							name: 'Coin 2 underwater',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie');
							},
							ap: [8112000551]
						},
						{
							name: 'Coin 3 underwater',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie');
							},
							ap: [8112000552]
						},
						{
							name: 'Super Block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie') && flags.jump_coin_blocks();
							},
							ap: [8112000558]
						},
						{
							name: 'Tree near the north exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie') && flags.trees();
							},
							ap: [8112000556]
						},
						{
							name: 'Tree near the east exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie') && flags.trees();
							},
							ap: [8112000557]
						},
						{
							name: 'Bush near the north exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie');
							},
							ap: [8112000554]
						},
						{
							name: 'Bush near the south exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							},
							ap: [8112000555]
						}
					]
				},
				se_jungle: {
					name: 'SE Jungle',
					x: 3,
					y: 6,
					w: 2,
					h: 1,
					checks: [
						{
							name: '? block on the island',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie') && flags.jump_coin_blocks();
							},
							ap: [8112000543]
						},
						{
							name: 'Tree near the east exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							},
							ap: [8112000546]
						},
						{
							name: 'Bush near the south exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island();
							},
							ap: [8112000544]
						},
						{
							name: 'South-west bush',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && save.data.items.hammer >= 1 && flags.partner('sushie');
							},
							ap: [8112000545]
						}
					]
				},
				sushie: {
					name: 'Sushie',
					x: 5,
					y: 6,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Sushie',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							},
							ap: [8112000542]
						},
						{
							name: 'Item on the top right island',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie');
							},
							ap: [8112000540]
						},
						{
							name: 'Tree on the top right island',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie') && flags.trees();
							},
							ap: [8112000541]
						},
						{
							name: 'Chest after saving Misstar',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && save.data.items.misstar;
							},
							ap: [8112000539]
						}
					]
				},
				light_blue_yoshi: {
					name: 'Light-Blue Yoshi',
					x: 1,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item underwater',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie');
							},
							ap: [8112000563]
						}
					]
				},
				nw_jungle: {
					name: 'NW Jungle',
					x: 2,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item in the tree near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie') && flags.trees();
							},
							ap: [8112000562]
						},
						{
							name: 'Tree on the ledge',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie') && flags.jump_ledges() && flags.trees();
							},
							ap: [8112000561]
						},
						{
							name: 'Bush near the south exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie');
							},
							ap: [8112000560]
						},
						{
							name: 'Bush near the east exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie');
							},
							ap: [8112000559]
						}
					]
				},
				ne_jungle: {
					name: 'NE Jungle',
					x: 3,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item underwater on the east side of the room',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie') && save.data.items.hammer >= 1;
							},
							ap: [8112000547]
						},
						{
							name: 'Tree near the raven statue',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie') && save.data.items.hammer >= 1;
							},
							ap: [8112000548]
						}
					]
				},
				yellow_yoshi: {
					name: 'Yellow Yoshi',
					x: 4,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Tree',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie') && save.data.items.hammer >= 1;
							},
							ap: [8112000549]
						}
					]
				},
				deep_jungle: {
					name: 'Deep Jungle',
					x: 3,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Invisible block near the bell plant',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island_jungle_behind_raven_statue() && flags.jump_ledges() && flags.jump_coin_blocks();
							},
							ap: [8112000565]
						},
						{
							name: 'Tree vine near the bell plant',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island_jungle_behind_raven_statue() && save.data.items.boots >= 1;
							},
							ap: [8112000564]
						},
						{
							name: 'Tree near bell plant',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island_jungle_behind_raven_statue() && flags.jump_ledges() && flags.trees();
							},
							ap: [8112000566]
						}
					]
				},
				block_puzzle: {
					name: 'Block Puzzle',
					x: 3,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Far left tree',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island_jungle_behind_raven_statue() && flags.trees();
							},
							ap: [8112000568]
						},
						{
							name: 'Invisible block near the first push block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island_jungle_behind_raven_statue() && flags.jump_coin_blocks() && flags.jump_ledges();
							},
							ap: [8112000567]
						}
					]
				},
				tree_vines: {
					name: 'Tree Vines',
					x: 3,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Second tree vine',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island_jungle_behind_raven_statue() && save.data.items.boots >= 1;
							},
							ap: [8112000569]
						},
						{
							name: 'Tree vine far east',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island_jungle_behind_raven_statue() && save.data.items.boots >= 1;
							},
							ap: [8112000570]
						}
					]
				},
				ambush: {
					name: 'Ambush',
					x: 3,
					y: 1,
					w: 3,
					h: 1,
					checks: [
						{
							name: 'Near the middle of the room',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.lava_lava_island_jungle_behind_raven_statue() && flags.panels();
							},
							ap: [8112000572]
						},
						{
							name: 'Tree near the east exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island_jungle_behind_raven_statue() && save.data.items.boots >= 1 && flags.trees();
							},
							ap: [8112000571]
						}
					]
				},
				raph_tree: {
					name: "Raphael's Tree",
					x: 6,
					y: 1,
					w: 1,
					h: 6,
					checks: [
						{
							name: 'Item on the outside of the big tree on a branch climbing up',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island_jungle_behind_raven_statue() && save.data.items.boots >= 1;
							},
							ap: [8112000573]
						},
						{
							name: 'Talk to Raphael the Raven',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island_jungle_behind_raven_statue() && save.data.items.boots >= 1;
							},
							ap: [8112000574]
						}
					]
				}
			}
		},
		mt_lavalava: {
			name: 'Mt. Lavalava',
			exists: () => {
				return flags.lcl(5, true);
			},
			maps: {
				entrance: {
					name: 'Entrance',
					x: 2,
					y: 1,
					w: 1,
					h: 1,
					checks: []
				},
				sinking_platforms: {
					name: 'Sinking Platforms',
					x: 3,
					y: 1,
					w: 1,
					h: 1,
					checks: []
				},
				hub: {
					name: 'Hub',
					x: 4,
					y: 1,
					w: 1,
					h: 3,
					checks: [
						{
							name: 'Item on top of the brick block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_lavalava() && save.data.items.boots >= 1 && (flags.partner('kooper') || flags.ultra_jump_blocks());
							},
							ap: [8112000577]
						},
						{
							name: '? block 1',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.mt_lavalava() && flags.jump_coin_blocks();
							},
							ap: [8112000578]
						},
						{
							name: '? block 2',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.mt_lavalava() && flags.jump_coin_blocks();
							},
							ap: [8112000579]
						},
						{
							name: '? block 3',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.mt_lavalava() && flags.jump_coin_blocks();
							},
							ap: [8112000580]
						},
						{
							name: '? block 4',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.mt_lavalava() && flags.jump_coin_blocks();
							},
							ap: [8112000581]
						},
						{
							name: 'Item on platform halfway down then second zipline',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_lavalava() && save.data.items.boots >= 1;
							},
							ap: [8112000576]
						}
					]
				},
				firebars: {
					name: 'Firebars',
					x: 5,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Super Block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.mt_lavalava() && save.data.items.boots >= 1;
							},
							ap: [8112000582]
						}
					]
				},
				slope_hallway: {
					name: 'Slope Hallway',
					x: 3,
					y: 3,
					w: 1,
					h: 1,
					checks: []
				},
				lava_puzzle: {
					name: 'Lava Puzzle',
					x: 2,
					y: 3,
					w: 1,
					h: 2,
					checks: [
						{
							name: 'Invisible block near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_lavalava() && flags.jump_coin_blocks() && flags.jump_ledges();
							},
							ap: [8112000583]
						}
					]
				},
				ultra_hammer: {
					name: 'Ultra Hammer',
					x: 1,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Chest',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_lavalava() && (flags.partner('parakarry') || flags.partner('lakilester'));
							},
							ap: [8112000584]
						}
					]
				},
				dizzy_stomp: {
					name: 'Dizzy Stomp',
					x: 3,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Chest',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_lavalava() && flags.ultra_blocks() && (flags.partner('parakarry') || flags.partner('lakilester'));
							},
							ap: [8112000585]
						}
					]
				},
				zipline: {
					name: 'Zipline',
					x: 5,
					y: 2,
					w: 1,
					h: 2,
					checks: [
						{
							name: 'Super Block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.mt_lavalava() && save.data.items.boots >= 1 && flags.ultra_blocks();
							},
							ap: [8112000586]
						},
						{
							name: 'East side of the lower level',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.mt_lavalava() && flags.panels();
							},
							ap: [8112000587]
						}
					]
				},
				spike_ball_chase: {
					name: 'Spike Ball Chase',
					x: 6,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				moving_platforms: {
					name: 'Moving Platforms',
					x: 7,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				spike_ball_wall_break: {
					name: 'Spike Ball Wall Break',
					x: 8,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				volcano_save_block: {
					name: 'Volcano Save Block',
					x: 9,
					y: 2,
					w: 1,
					h: 2,
					checks: [
						{
							name: 'West of the Heart Block',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.mt_lavalava() && flags.panels() && flags.ultra_blocks();
							},
							ap: [8112000588]
						}
					]
				},
				deadend: {
					name: 'Deadend',
					x: 10,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'West ? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_lavalava() && save.data.items.boots >= 1 && flags.ultra_blocks();
							},
							ap: [8112000589]
						},
						{
							name: 'East ? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_lavalava() && save.data.items.boots >= 1 && flags.ultra_blocks();
							},
							ap: [8112000590]
						}
					]
				},
				lava_piranha: {
					name: 'Lava Piranha',
					x: 10,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Misstar',
							icon: '/images/checks/stars/misstar.webp',
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_lavalava() && save.data.items.boots >= 1 && flags.ultra_blocks();
							}
						}
					]
				}
			}
		},
		flower_fields: {
			name: 'Flower Fields',
			exists: () => {
				return flags.lcl(6, true);
			},
			maps: {
				big_tree: {
					name: 'Big tree',
					x: 4,
					y: 2,
					w: 1,
					h: 3,
					checks: []
				},
				bubble_plant: {
					name: 'Bubble Plant',
					x: 3,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item on the ledge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && flags.jump_ledges() && (save.data.items.bubble_berry || flags.partner('lakilester'));
							},
							ap: [8112000611]
						},
						{
							name: 'Item in the vines near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields();
							},
							ap: [8112000612]
						}
					]
				},
				lakilester: {
					name: 'Lakilester',
					x: 2,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Lakilester',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && flags.jump_ledges() && flags.partner('bombette') && (save.data.items.bubble_berry || flags.partner('lakilester'));
							},
							ap: [8112000610]
						},
						{
							name: 'Item in the grass',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && (save.data.items.bubble_berry || flags.partner('lakilester'));
							},
							ap: [8112000609]
						},
						{
							name: 'Item on the ledge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && flags.jump_ledges() && (save.data.items.bubble_berry || flags.partner('lakilester')) && flags.partner('bombette');
							},
							ap: [8112000608]
						}
					]
				},
				sun_tower: {
					name: 'Sun Tower',
					x: 1,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				blue_flower: {
					name: 'Blue Flower',
					x: 3,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Hidden block between the brick block and the spring',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.flower_fields() && flags.jump_coin_blocks() && save.data.items.blue_berry;
							},
							ap: [8112000620]
						},
						{
							name: 'Hidden block over the brick block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && flags.jump_ledges() && flags.jump_coin_blocks() && save.data.items.blue_berry;
							},
							ap: [8112000621]
						}
					]
				},
				maze: {
					name: 'Maze',
					x: 2,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'East of the exit pipe',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.blue_berry && save.data.items.boots >= 1;
							},
							ap: [8112000606]
						}
					]
				},
				rosie: {
					name: 'Rosie',
					x: 1,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Give rosie the Crystal Berry',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.blue_berry && save.data.items.boots >= 1 && save.data.items.crystal_berry;
							},
							ap: [8112000607]
						}
					]
				},
				red_flower: {
					name: 'Red Flower',
					x: 3,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'In front of the tree',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.flower_fields() && flags.panels() && save.data.items.red_berry;
							},
							ap: [8112000630]
						},
						{
							name: 'Item in the tree 1',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.red_berry && flags.trees();
							},
							ap: [8112000628]
						},
						{
							name: 'Item in the tree 2',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.red_berry && flags.trees();
							},
							ap: [8112000629]
						},
						{
							name: 'Item in the middle vine',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.red_berry;
							},
							ap: [8112000627]
						}
					]
				},
				posie: {
					name: 'Posie',
					x: 2,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item from Posie 1',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.red_berry;
							},
							ap: [8112000596]
						},
						{
							name: 'Item from Posie 2',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.red_berry;
							},
							ap: [8112000595]
						}
					]
				},
				elevators: {
					name: 'Elevators',
					x: 5,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item in the second vine',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && flags.jump_ledges();
							},
							ap: [8112000614]
						},
						{
							name: 'Ground pound the top of the ledge near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.boots >= 2 && flags.partner('lakilester');
							},
							ap: [8112000613]
						},
						{
							name: 'Super Block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.boots >= 2 && flags.partner('lakilester');
							},
							ap: [8112000615]
						}
					]
				},
				fallen_logs: {
					name: 'Fallen Logs',
					x: 6,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item in grass at bottom of screen',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.boots >= 2 && flags.partner('lakilester');
							},
							ap: [8112000617]
						},
						{
							name: 'Invisible block near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.boots >= 2 && flags.partner('lakilester');
							},
							ap: [8112000616]
						}
					]
				},
				cloud_machine: {
					name: 'Cloud Machine',
					x: 7,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				three_trees: {
					name: 'Three Trees',
					x: 5,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Second set of vines',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields();
							},
							ap: [8112000603]
						},
						{
							name: 'Hit the trees in the right order',
							tooltip: 'Middle, right, left',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && flags.trees();
							},
							ap: [8112000602]
						}
					]
				},
				petunia: {
					name: 'Petunia',
					x: 6,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item in the tree 1',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && flags.trees();
							},
							ap: [8112000592]
						},
						{
							name: 'Item in the tree 2',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && flags.trees();
							},
							ap: [8112000593]
						},
						{
							name: 'South-west of the room',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.flower_fields() && flags.panels();
							},
							ap: [8112000594]
						},
						{
							name: 'Talk to Petunia and defeat all the moles',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields();
							},
							ap: [8112000591]
						}
					]
				},
				well: {
					name: 'Well',
					x: 7,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Give a Blue berry to the well',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.blue_berry;
							},
							ap: [8112000619]
						}
					]
				},
				yellow_flower: {
					name: 'Yellow Flower',
					x: 5,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Vines next the yellow flower',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields();
							},
							ap: [8112000597]
						},
						{
							name: 'Item in the tree 1',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.yellow_berry && (flags.partner('lakilester') || flags.partner('parakarry')) && flags.trees();
							},
							ap: [8112000599]
						},
						{
							name: 'Item in the tree 2',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.yellow_berry && (flags.partner('lakilester') || flags.partner('parakarry')) && flags.trees();
							},
							ap: [8112000600]
						},
						{
							name: 'Item in the grass next of the tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.yellow_berry && (flags.partner('lakilester') || flags.partner('parakarry'));
							},
							ap: [8112000598]
						},
						{
							name: 'Super Block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.yellow_berry && (flags.partner('lakilester') || flags.partner('parakarry')) && flags.jump_ledges();
							},
							ap: [8112000601]
						}
					]
				},
				bubble_berry_tree: {
					name: 'Bubble Berry Tree',
					x: 6,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: '? block near the west exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.yellow_berry && (flags.partner('lakilester') || flags.partner('parakarry')) && flags.jump_coin_blocks();
							},
							ap: [8112000622]
						},
						{
							name: 'Item in the tree 1',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return (
									flags.flower_fields() &&
									save.data.items.yellow_berry &&
									(flags.partner('lakilester') || flags.partner('parakarry')) &&
									flags.trees() &&
									save.data.items.water_stone &&
									flags.partner('sushie')
								);
							},
							ap: [8112000624]
						},
						{
							name: 'Item in the tree 2',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return (
									flags.flower_fields() &&
									save.data.items.yellow_berry &&
									(flags.partner('lakilester') || flags.partner('parakarry')) &&
									flags.trees() &&
									save.data.items.water_stone &&
									flags.partner('sushie')
								);
							},
							ap: [8112000625]
						},
						{
							name: 'Invisible block near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return (
									flags.flower_fields() &&
									save.data.items.yellow_berry &&
									(flags.partner('lakilester') || flags.partner('parakarry')) &&
									flags.jump_coin_blocks() &&
									flags.jump_ledges()
								);
							},
							ap: [8112000623]
						},
						{
							name: 'Near the east exit',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.yellow_berry && (flags.partner('lakilester') || flags.partner('parakarry')) && flags.panels() && flags.jump_ledges();
							},
							ap: [8112000626]
						}
					]
				},
				lily: {
					name: 'Lily',
					x: 7,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Give the Water Stone to Lily',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return (
									flags.flower_fields() &&
									save.data.items.yellow_berry &&
									(flags.partner('lakilester') || flags.partner('parakarry')) &&
									flags.jump_ledges() &&
									save.data.items.water_stone
								);
							},
							ap: [8112000604]
						},
						{
							name: 'Item in the tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.yellow_berry && (flags.partner('lakilester') || flags.partner('parakarry')) && flags.jump_ledges() && flags.trees();
							},
							ap: [8112000605]
						}
					]
				},
				in_the_clouds: {
					name: 'In the Clouds',
					x: 4,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Ride the cloud elevator',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return (
									flags.flower_fields() &&
									save.data.items.magical_bean &&
									save.data.items.fertile_soil &&
									save.data.items.miracle_water &&
									save.data.items.lakilester && // ??
									save.data.items.boots >= 2 && // ??
									save.data.items.hammer >= 1 // ??
								);
							},
							ap: [8112000618]
						}
					]
				},
				huff_n_puff: {
					name: "Huff N' Puff",
					x: 5,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Klevar',
							icon: '/images/checks/stars/klevar.webp',
							exists: () => {
								return true;
							},
							available: () => {
								return (
									flags.flower_fields() &&
									save.data.items.magical_bean &&
									save.data.items.fertile_soil &&
									save.data.items.miracle_water &&
									save.data.items.lakilester && // ??
									save.data.items.boots >= 2 && // ??
									save.data.items.hammer >= 1 // ??
								);
							}
						}
					]
				}
			}
		},
		shiver_region: {
			name: 'Shiver Region',
			exists: () => {
				return flags.lcl(7);
			},
			maps: {
				sewers_entrance: {
					name: 'Sewers Entrance',
					x: 2,
					y: 6,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Super Block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.shiver_city();
							},
							ap: [8112000131]
						}
					]
				},
				west_shiver_city: {
					name: 'West Shiver City',
					x: 1,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: "Next the mayor's house",
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.shiver_city() && flags.panels();
							},
							ap: [8112000634]
						},
						{
							name: 'Mayor penguin',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.shiver_city() && flags.deliver_letters() && save.data.items.letters.mayor_penguin && save.data.items.warehouse_key;
							},
							ap: [8112000632]
						},
						{
							name: 'Talk to the mayor after having met Merle',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.leave_shiver_city();
							},
							ap: [8112000631]
						},
						{
							name: 'Chest in the middle house',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.shiver_city() && save.data.items.boots >= 1;
							},
							ap: [8112000633]
						}
					]
				},
				center_shiver_city: {
					name: 'Center Shiver City',
					x: 2,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Shop item 1',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.shiver_city();
							},
							ap: [8112000641]
						},
						{
							name: 'Shop item 2',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.shiver_city();
							},
							ap: [8112000642]
						},
						{
							name: 'Shop item 3',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.shiver_city();
							},
							ap: [8112000643]
						},
						{
							name: 'Shop item 4',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.shiver_city();
							},
							ap: [8112000644]
						},
						{
							name: 'Shop item 5',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.shiver_city();
							},
							ap: [8112000645]
						},
						{
							name: 'Shop item 6',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.shiver_city();
							},
							ap: [8112000646]
						},
						{
							name: 'Item in the inn',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.shiver_city();
							},
							ap: [8112000635]
						},
						{
							name: 'Reward in the inn 1',
							tooltip: 'After giving the Scarf and Bucket to the snowmen',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.leave_shiver_city() && save.data.items.scarf && save.data.items.bucket;
							},
							ap: [8112000636]
						},
						{
							name: 'Reward in the inn 2',
							tooltip: 'After giving the Scarf and Bucket to the snowmen',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.leave_shiver_city() && save.data.items.scarf && save.data.items.bucket;
							},
							ap: [8112000637]
						},
						{
							name: 'Reward in the inn 3',
							tooltip: 'After giving the Scarf and Bucket to the snowmen',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.leave_shiver_city() && save.data.items.scarf && save.data.items.bucket;
							},
							ap: [8112000638]
						},
						{
							name: 'Reward in the inn 4',
							tooltip: 'After giving the Scarf and Bucket to the snowmen',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.leave_shiver_city() && save.data.items.scarf && save.data.items.bucket;
							},
							ap: [8112000639]
						},
						{
							name: 'Reward in the inn 5',
							tooltip: 'After giving the Scarf and Bucket to the snowmen',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.leave_shiver_city() && save.data.items.scarf && save.data.items.bucket;
							},
							ap: [8112000640]
						}
					]
				},
				east_shiver_city: {
					name: 'East Shiver City',
					x: 3,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item in the lake',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.shiver_city() && save.data.items.boots >= 2 && flags.partner('sushie');
							},
							ap: [8112000662]
						}
					]
				},
				outside_shiver_city: {
					name: 'Outside Shiver City',
					x: 4,
					y: 5,
					w: 1,
					h: 1,
					checks: []
				},
				shiver_snowfield: {
					name: 'Shiver Snowfield',
					x: 5,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'South of the room',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.leave_shiver_city() && flags.panels();
							},
							ap: [8112000649]
						},
						{
							name: 'Hit the left pine tree 4 times',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.leave_shiver_city() && save.data.items.hammer >= 1;
							},
							ap: [8112000647]
						},
						{
							name: 'Item behind the pine tree near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.leave_shiver_city();
							},
							ap: [8112000648]
						}
					]
				},
				outside_starborn_valley: {
					name: 'Outside Starborn Valley',
					x: 6,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item behind the ice',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.leave_shiver_city();
							},
							ap: [8112000650]
						},
						{
							name: 'Invisible block near Monstar fight',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.leave_shiver_city() && flags.jump_coin_blocks();
							},
							ap: [8112000651]
						}
					]
				},
				starborn_valley: {
					name: 'Starborn Valley',
					x: 7,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Frost T.',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.leave_shiver_city() && flags.jump_ledges() && flags.deliver_letters() && save.data.items.letters.frost_t;
							},
							ap: [8112000653]
						},
						{
							name: 'Talk to Merle',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.leave_shiver_city() && flags.jump_ledges();
							},
							ap: [8112000652]
						}
					]
				},
				shiver_mountain_passage: {
					name: 'Shiver Mountain Passage',
					x: 5,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Ultra boots block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.shiver_mountain() && flags.ultra_jump_blocks();
							},
							ap: [8112000654]
						}
					]
				},
				shiver_mountain_hills: {
					name: 'Shiver Mountain Hills',
					x: 5,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item below the gap',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.shiver_mountain();
							},
							ap: [8112000655]
						},
						{
							name: 'Super Block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.shiver_mountain_tunnel();
							},
							ap: [8112000656]
						}
					]
				},
				shiver_mountain_tunnel: {
					name: 'Shiver Mountain Tunnel',
					x: 5,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'West pillar',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.shiver_mountain_tunnel();
							},
							ap: [8112000657]
						},
						{
							name: 'Center pillar',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.shiver_mountain_tunnel();
							},
							ap: [8112000658]
						},
						{
							name: 'East pillar',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.shiver_mountain_tunnel();
							},
							ap: [8112000659]
						}
					]
				},
				ice_staircase: {
					name: 'Ice Staircase',
					x: 5,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: '? block up the first set for stairs',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.shiver_mountain_tunnel() && save.data.items.star_stone;
							},
							ap: [8112000661]
						},
						{
							name: 'Item on the ledge when falling down after the second sets of stairs',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.shiver_mountain_tunnel() && save.data.items.star_stone;
							},
							ap: [8112000660]
						},
						{
							name: kalmar_dungeon_shuffle_name,
							icon: kalmar_dungeon_shuffle_icon,
							dungeon: 7,
							exists: () => {
								return save.data.configs.randomizer.shuffle_dungeon_entrances;
							},
							available: () => {
								return flags.dungeon_checks_available(7);
							}
						}
					]
				},
				merlar_sanctuary: {
					name: 'Merlar Sanctuary',
					x: 6,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Sacred item sealed away for centuries',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.shiver_mountain_tunnel() && flags.partner('bombette');
							},
							ap: [8112000663]
						}
					]
				}
			}
		},
		crystal_palace: {
			name: 'Crystal Palace',
			exists: () => {
				return flags.lcl(7, true);
			},
			maps: {
				cave: {
					name: 'Cave',
					x: 1,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item in the cave',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.crystal_palace() && (save.data.items.red_key || (save.data.items.blue_key && flags.partner('bombette') && save.data.items.boots >= 2));
							},
							ap: [8112000671]
						}
					]
				},
				entrance: {
					name: 'Entrance',
					x: 2,
					y: 4,
					w: 1,
					h: 2,
					checks: []
				},
				mirror: {
					name: 'Mirror',
					x: 3,
					y: 4,
					w: 1,
					h: 2,
					checks: []
				},
				x_mark: {
					name: 'X Mark',
					x: 3,
					y: 6,
					w: 1,
					h: 3,
					checks: []
				},
				lower_swoopers: {
					name: 'Lower Swoopers',
					x: 4,
					y: 7,
					w: 1,
					h: 1,
					checks: []
				},
				blue_key: {
					name: 'Blue Key',
					x: 5,
					y: 7,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Chest',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.crystal_palace();
							},
							ap: [8112000665]
						}
					]
				},
				bombette_puzzle: {
					name: 'Bombette Puzzle',
					x: 4,
					y: 8,
					w: 1,
					h: 1,
					checks: []
				},
				red_key: {
					name: 'Red Key',
					x: 5,
					y: 8,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Chest',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return (
									flags.crystal_palace() &&
									(save.data.items.red_key || save.data.items.blue_key) &&
									flags.partner('bombette') &&
									save.data.items.hammer >= 1 &&
									save.data.items.boots >= 2
								);
							},
							ap: [8112000667]
						}
					]
				},
				ground_panel: {
					name: 'Ground Panel',
					x: 3,
					y: 1,
					w: 1,
					h: 3,
					checks: [
						{
							name: '? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.crystal_palace() && (save.data.items.red_key || (save.data.items.blue_key && flags.partner('bombette') && save.data.items.boots >= 2));
							},
							ap: [8112000664]
						}
					]
				},
				first_duplighost: {
					name: 'First Duplighost',
					x: 4,
					y: 1,
					w: 1,
					h: 1,
					checks: []
				},
				shooting_star: {
					name: 'Shooting Star',
					x: 5,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item on the ledge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.crystal_palace() && (save.data.items.red_key || (save.data.items.blue_key && flags.partner('bombette') && save.data.items.boots >= 2));
							},
							ap: [8112000666]
						}
					]
				},
				upper_swoopers: {
					name: 'Upper Swoopers',
					x: 4,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				p_down_d_up: {
					name: 'P-Down / D-Up',
					x: 5,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Chest',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.crystal_palace() && (save.data.items.red_key || (save.data.items.blue_key && flags.partner('bombette'))) && save.data.items.boots >= 2;
							},
							ap: [8112000668]
						}
					]
				},
				elevator_and_clubba: {
					name: 'Red Door Corridor',
					x: 4,
					y: 4,
					w: 1,
					h: 1,
					checks: []
				},
				bomb_switch: {
					name: 'Red Door Bombette Puzzle',
					x: 5,
					y: 4,
					w: 1,
					h: 1,
					checks: []
				},
				triple_dip: {
					name: 'Triple Dip',
					x: 6,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Chest',
							tooltip: 'Blow up the right wall in the switch room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.crystal_palace() && save.data.items.red_key && flags.partner('bombette');
							},
							ap: [8112000678]
						}
					]
				},
				mirror_corridor: {
					name: 'Blue Door Corridor',
					x: 4,
					y: 5,
					w: 1,
					h: 1,
					checks: []
				},
				mirror_hole: {
					name: 'Blue door Cul-de-sac',
					x: 5,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Block front of the mirror',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.crystal_palace() && save.data.items.blue_key && save.data.items.boots >= 2 && flags.partner('bombette');
							},
							ap: [8112000669]
						},
						{
							name: 'Block back of the mirror',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.crystal_palace() && save.data.items.blue_key && save.data.items.boots >= 2 && flags.partner('bombette');
							},
							ap: [8112000670]
						}
					]
				},
				kooper_puzzle: {
					name: 'Kooper Puzzle',
					x: 7,
					y: 4,
					w: 1,
					h: 1,
					checks: []
				},
				hub: {
					name: 'Hub',
					x: 8,
					y: 4,
					w: 1,
					h: 2,
					checks: []
				},
				large_statues: {
					name: 'Large Statues',
					x: 8,
					y: 6,
					w: 1,
					h: 2,
					checks: [
						{
							name: 'Under the ? block',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.crystal_palace() && save.data.items.red_key && flags.partner('bombette') && flags.partner('kooper') && save.data.items.hammer >= 1 && flags.panels();
							},
							ap: [8112000673]
						},
						{
							name: '? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return (
									flags.crystal_palace() &&
									save.data.items.red_key &&
									flags.partner('bombette') &&
									flags.partner('kooper') &&
									save.data.items.hammer >= 1 &&
									flags.ultra_jump_blocks()
								);
							},
							ap: [8112000672]
						}
					]
				},
				second_duplighost: {
					name: 'Second Duplighost',
					x: 9,
					y: 7,
					w: 1,
					h: 1,
					checks: []
				},
				palace_key: {
					name: 'Palace Key',
					x: 10,
					y: 7,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Chest',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.crystal_palace() && save.data.items.red_key && flags.partner('bombette') && flags.partner('kooper') && save.data.items.hammer >= 1;
							},
							ap: [8112000676]
						}
					]
				},
				small_statues: {
					name: 'Small Statues',
					x: 8,
					y: 2,
					w: 1,
					h: 2,
					checks: [
						{
							name: 'Under the ? block',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.crystal_palace() && save.data.items.red_key && flags.partner('bombette') && flags.partner('kooper') && save.data.items.hammer >= 1 && flags.panels();
							},
							ap: [8112000675]
						},
						{
							name: '? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return (
									flags.crystal_palace() &&
									save.data.items.red_key &&
									flags.partner('bombette') &&
									flags.partner('kooper') &&
									save.data.items.hammer >= 1 &&
									flags.ultra_jump_blocks()
								);
							},
							ap: [8112000674]
						}
					]
				},
				clubba: {
					name: 'Clubba',
					x: 9,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				p_up_d_down: {
					name: 'P-Up / D-Down',
					x: 10,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Chest',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.crystal_palace() && save.data.items.red_key && flags.partner('bombette') && flags.partner('kooper') && save.data.items.hammer >= 1;
							},
							ap: [8112000677]
						}
					]
				},
				kooper_switch_and_palace_key_locks: {
					name: 'Kooper Switch and Palace Key Locks',
					x: 9,
					y: 4,
					w: 1,
					h: 2,
					checks: []
				},
				albino_dinos_and_crystal_king: {
					name: 'Albino Dinos and Crystal King',
					x: 10,
					y: 4,
					w: 1,
					h: 2,
					checks: [
						{
							name: 'Kalmar',
							icon: '/images/checks/stars/kalmar.webp',
							exists: () => {
								return true;
							},
							available: () => {
								return (
									flags.crystal_palace() &&
									save.data.items.red_key &&
									flags.partner('bombette') &&
									flags.partner('kooper') &&
									save.data.items.hammer >= 1 &&
									save.data.items.palace_key
								);
							}
						}
					]
				}
			}
		},
		star_haven: {
			name: 'Star Haven',
			exists: () => {
				if (save.data.configs.randomizer.star_hunt_enabled && save.data.configs.randomizer.star_hunt_ends_game) {
					return false;
				}

				return true;
			},
			maps: {
				shooting_star_summit: {
					name: 'Shooting Star Summit',
					x: 1,
					y: 4,
					w: 1,
					h: 1,
					checks: []
				},
				star_spiral: {
					name: 'Star Spiral',
					x: 2,
					y: 1,
					w: 1,
					h: 4,
					checks: []
				},
				star_haven_west: {
					name: 'Star Haven West',
					x: 3,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Shop item 1',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.star_haven();
							},
							ap: [8112000156]
						},
						{
							name: 'Shop item 2',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.star_haven();
							},
							ap: [8112000157]
						},
						{
							name: 'Shop item 3',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.star_haven();
							},
							ap: [8112000158]
						},
						{
							name: 'Shop item 4',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.star_haven();
							},
							ap: [8112000159]
						},
						{
							name: 'Shop item 5',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.star_haven();
							},
							ap: [8112000160]
						},
						{
							name: 'Shop item 6',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.star_haven();
							},
							ap: [8112000161]
						}
					]
				},
				star_haven_east: {
					name: 'Star Haven East',
					x: 4,
					y: 1,
					w: 1,
					h: 1,
					checks: []
				}
			}
		},
		west_bowser_castle: {
			name: "West Bowser's Castle",
			exists: () => {
				if (save.data.configs.randomizer.star_hunt_enabled && save.data.configs.randomizer.star_hunt_ends_game) {
					return false;
				}

				return true;
			},
			maps: {
				diaper_garage: {
					name: 'Garage',
					x: 1,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				front_door: {
					name: 'Front Door',
					x: 1,
					y: 3,
					w: 2,
					h: 1,
					checks: [
						{
							name: '? block on the ledge',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.west_bowser_castle() && save.data.items.castle_key >= 1 && flags.partner('lakilester') && flags.jump_coin_blocks();
							},
							ap: [8112000692]
						}
					]
				},
				lava_bridge: {
					name: 'Lava Bridge',
					x: 2,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				first_bowser_door: {
					name: 'First Bowser Door',
					x: 3,
					y: 2,
					w: 4,
					h: 1,
					checks: []
				},
				lower_jail: {
					name: 'Lower Jail',
					x: 3,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Bottom left crate',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.west_bowser_castle() && save.data.items.castle_key >= 1 && save.data.items.boots >= 2;
							},
							ap: [8112000686]
						},
						{
							name: 'Bottom right crate',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.west_bowser_castle() && save.data.items.castle_key >= 1 && save.data.items.boots >= 2;
							},
							ap: [8112000687]
						}
					]
				},
				outside_jail_cell: {
					name: 'Outside Jail Cell',
					x: 2,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Defeat the Koopatrol',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.west_bowser_castle();
							},
							ap: [8112000682]
						},
						{
							name: '? block',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.west_bowser_castle() && save.data.items.castle_key >= 1 && flags.partner('lakilester') && flags.jump_coin_blocks();
							},
							ap: [8112000681]
						}
					]
				},
				lava_channel1: {
					name: 'Lava Channel 1',
					x: 3,
					y: 4,
					w: 1,
					h: 1,
					checks: []
				},
				lava_channel2: {
					name: 'Lava Channel 2',
					x: 4,
					y: 4,
					w: 1,
					h: 1,
					checks: []
				},
				lava_key: {
					name: 'Lava Key',
					x: 4,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Chest',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return (
									flags.west_bowser_castle() &&
									save.data.items.castle_key >= 1 &&
									save.data.items.boots >= 1 &&
									flags.partner('lakilester') &&
									flags.partner('bow') &&
									flags.partner('parakarry')
								);
							},
							ap: [8112000685]
						}
					]
				},
				lava_channel3: {
					name: 'Lava Channel 3',
					x: 5,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'On the first island',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return (
									flags.west_bowser_castle() &&
									save.data.items.castle_key >= 1 &&
									save.data.items.boots >= 1 &&
									flags.partner('lakilester') &&
									flags.partner('bow') &&
									flags.partner('parakarry')
								);
							},
							ap: [8112000683]
						},
						{
							name: 'On the second island',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return (
									flags.west_bowser_castle() &&
									save.data.items.castle_key >= 1 &&
									save.data.items.boots >= 1 &&
									flags.partner('lakilester') &&
									flags.partner('bow') &&
									flags.partner('parakarry')
								);
							},
							ap: [8112000684]
						}
					]
				},
				lavafall: {
					name: 'Lavafall',
					x: 5,
					y: 3,
					w: 1,
					h: 1,
					checks: []
				},
				dark_cave1: {
					name: 'Dark Cave 1',
					x: 6,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: '? block',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return (
									flags.west_bowser_castle() &&
									save.data.items.castle_key >= 2 &&
									save.data.items.boots >= 1 &&
									flags.partner('lakilester') &&
									flags.partner('bow') &&
									flags.partner('parakarry') &&
									flags.partner('watt')
								);
							},
							ap: [8112000679]
						}
					]
				},
				dark_cave2: {
					name: 'Dark Cave 2',
					x: 6,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: '? block',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return (
									flags.west_bowser_castle() &&
									save.data.items.castle_key >= 2 &&
									save.data.items.boots >= 1 &&
									flags.partner('lakilester') &&
									flags.partner('bow') &&
									flags.partner('parakarry') &&
									flags.partner('watt')
								);
							},
							ap: [8112000680]
						}
					]
				},
				first_hub: {
					name: 'Hub',
					x: 7,
					y: 1,
					w: 1,
					h: 2,
					checks: []
				},
				goomba_shop: {
					name: 'Goomba Shop',
					x: 6,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Shop item 1',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity && !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return (
									flags.west_bowser_castle() &&
									save.data.items.castle_key >= 2 &&
									save.data.items.boots >= 1 &&
									flags.partner('lakilester') &&
									flags.partner('bow') &&
									flags.partner('parakarry') &&
									flags.partner('watt')
								);
							},
							ap: [8112000695]
						},
						{
							name: 'Shop item 2',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity && !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return (
									flags.west_bowser_castle() &&
									save.data.items.castle_key >= 2 &&
									save.data.items.boots >= 1 &&
									flags.partner('lakilester') &&
									flags.partner('bow') &&
									flags.partner('parakarry') &&
									flags.partner('watt')
								);
							},
							ap: [8112000696]
						},
						{
							name: 'Shop item 3',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity && !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return (
									flags.west_bowser_castle() &&
									save.data.items.castle_key >= 2 &&
									save.data.items.boots >= 1 &&
									flags.partner('lakilester') &&
									flags.partner('bow') &&
									flags.partner('parakarry') &&
									flags.partner('watt')
								);
							},
							ap: [8112000697]
						},
						{
							name: 'Shop item 4',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity && !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return (
									flags.west_bowser_castle() &&
									save.data.items.castle_key >= 2 &&
									save.data.items.boots >= 1 &&
									flags.partner('lakilester') &&
									flags.partner('bow') &&
									flags.partner('parakarry') &&
									flags.partner('watt')
								);
							},
							ap: [8112000698]
						},
						{
							name: 'Shop item 5',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity && !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return (
									flags.west_bowser_castle() &&
									save.data.items.castle_key >= 2 &&
									save.data.items.boots >= 1 &&
									flags.partner('lakilester') &&
									flags.partner('bow') &&
									flags.partner('parakarry') &&
									flags.partner('watt')
								);
							},
							ap: [8112000699]
						},
						{
							name: 'Shop item 6',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity && !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return (
									flags.west_bowser_castle() &&
									save.data.items.castle_key >= 2 &&
									save.data.items.boots >= 1 &&
									flags.partner('lakilester') &&
									flags.partner('bow') &&
									flags.partner('parakarry') &&
									flags.partner('watt')
								);
							},
							ap: [8112000700]
						}
					]
				},
				east_jail_cell: {
					name: 'East Jail Cell',
					x: 8,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Defeat the Koopatrol',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return (
									flags.west_bowser_castle() &&
									save.data.items.castle_key >= 2 &&
									save.data.items.boots >= 1 &&
									flags.partner('lakilester') &&
									flags.partner('bow') &&
									flags.partner('parakarry') &&
									flags.partner('watt')
								);
							},
							ap: [8112000693]
						}
					]
				},
				corridor1: {
					name: 'Corridor',
					x: 8,
					y: 1,
					w: 1,
					h: 1,
					checks: []
				},
				water_puzzle_west: {
					name: 'Water Puzzle west',
					x: 9,
					y: 1,
					w: 1,
					h: 2,
					checks: [
						{
							name: 'On the ledge on top of the room to the west',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.east_bowser_castle();
							},
							ap: [8112000706]
						}
					]
				},
				water_puzzle_east: {
					name: 'Water Puzzle east',
					x: 10,
					y: 1,
					w: 1,
					h: 2,
					checks: [
						{
							name: 'Invisible block on top of the room',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.east_bowser_castle();
							},
							ap: [8112000707]
						}
					]
				},
				cannons1: {
					name: 'Cannons 1',
					x: 11,
					y: 1,
					w: 1,
					h: 2,
					checks: []
				}
			}
		},
		east_bowser_castle: {
			name: "East Bowser's Castle",
			exists: () => {
				if (save.data.configs.randomizer.star_hunt_enabled && save.data.configs.randomizer.star_hunt_ends_game) {
					return false;
				}

				return true;
			},
			maps: {
				hidden_door: {
					name: 'Hidden Door',
					x: 1,
					y: 5,
					w: 2,
					h: 1,
					checks: [
						{
							name: 'Invisible block',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.east_bowser_castle();
							},
							ap: [8112000704]
						},
						{
							name: '? block',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.east_bowser_castle();
							},
							ap: [8112000703]
						}
					]
				},
				hidden_rooms: {
					name: 'Hidden rooms',
					x: 2,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'On the ground',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.east_bowser_castle();
							},
							ap: [8112000705]
						}
					]
				},
				bowser_door_quiz: {
					name: 'Bowser Door Quiz',
					x: 3,
					y: 5,
					w: 1,
					h: 1,
					checks: []
				},
				outside_bridge: {
					name: 'Outside Bridge',
					x: 4,
					y: 3,
					w: 1,
					h: 3,
					checks: [
						{
							name: '? block west of the door',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.east_bowser_castle();
							},
							ap: [8112000688]
						},
						{
							name: '? block east of the door',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.east_bowser_castle();
							},
							ap: [8112000689]
						},
						{
							name: '? block near the bottom of the stairs',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.east_bowser_castle();
							},
							ap: [8112000690]
						},
						{
							name: 'Item on the ledge of the stairs',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.east_bowser_castle();
							},
							ap: [8112000691]
						}
					]
				},
				hub: {
					name: 'Hub',
					x: 3,
					y: 2,
					w: 1,
					h: 2,
					checks: []
				},
				upper_jail: {
					name: 'Upper Jail',
					x: 2,
					y: 3,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Defeat the Koopatrol',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.east_bowser_castle();
							},
							ap: [8112000694]
						}
					]
				},
				fast_switch: {
					name: 'Fast Switch',
					x: 2,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				ultra_shroom: {
					name: 'Ultra Shroom',
					x: 1,
					y: 2,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item on the ground',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.east_bowser_castle();
							},
							ap: [8112000702]
						}
					]
				},
				stair_corridor_puzzle: {
					name: 'Stair Corridor Puzzle',
					x: 4,
					y: 1,
					w: 1,
					h: 2,
					checks: []
				},
				fast_switch2: {
					name: 'Fast Switch 2',
					x: 5,
					y: 1,
					w: 1,
					h: 1,
					checks: []
				},
				castle_key: {
					name: 'Castle Key',
					x: 6,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Item on the ground',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.east_bowser_castle();
							},
							ap: [8112000701]
						}
					]
				},
				infinite_corridor: {
					name: 'Infinite Corridor',
					x: 5,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				koopa_bridge: {
					name: 'Koopa Bridge',
					x: 6,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				peach_duplighost: {
					name: 'Peach Duplighost',
					x: 7,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				koopa_bros_bowser_door: {
					name: 'Koopa Bros Bowser Door',
					x: 8,
					y: 2,
					w: 1,
					h: 1,
					checks: []
				},
				stairs: {
					name: 'Stairs',
					x: 9,
					y: 1,
					w: 1,
					h: 2,
					checks: []
				}
			}
		},
		peach_castle: {
			name: "Peach's Castle",
			exists: () => {
				if (save.data.configs.randomizer.star_hunt_enabled && save.data.configs.randomizer.star_hunt_ends_game) {
					return false;
				}

				return true;
			},
			maps: {
				outside: {
					name: 'Outside',
					x: 2,
					y: 8,
					w: 3,
					h: 1,
					checks: [
						{
							name: 'Invisible block',
							icon: true,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.peach_castle();
							},
							ap: [8112000709]
						}
					]
				},
				first_floor: {
					name: 'First Floor',
					x: 2,
					y: 6,
					w: 3,
					h: 2,
					checks: []
				},
				quiz_room: {
					name: 'Quiz Room',
					x: 1,
					y: 6,
					w: 1,
					h: 1,
					checks: []
				},
				kitchen: {
					name: 'Kitchen',
					x: 5,
					y: 6,
					w: 1,
					h: 1,
					checks: []
				},
				guest_room: {
					name: 'Guest Room',
					x: 5,
					y: 7,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Chest',
							icon: true,
							exists: () => {
								return null;
							},
							available: () => {
								return flags.peach_castle();
							},
							ap: [8112000152]
						}
					]
				},
				second_floor: {
					name: 'Second Floor',
					x: 2,
					y: 4,
					w: 3,
					h: 2,
					checks: []
				},
				corridor: {
					name: 'Corridor',
					x: 3,
					y: 2,
					w: 1,
					h: 2,
					checks: []
				},
				library: {
					name: 'Library',
					x: 1,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Between the bookshelfs down the ledge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.peach_castle();
							},
							ap: [8112000150]
						},
						{
							name: 'On the ledge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.peach_castle() & (save.data.items.boots >= 1);
							},
							ap: [8112000149]
						}
					]
				},
				bowser_diary: {
					name: 'Bowser Diary',
					x: 1,
					y: 4,
					w: 1,
					h: 1,
					checks: []
				},
				peach_room: {
					name: "Peach's Room",
					x: 2,
					y: 3,
					w: 1,
					h: 1,
					checks: []
				},
				dining_room: {
					name: 'Dining Room',
					x: 5,
					y: 5,
					w: 1,
					h: 1,
					checks: []
				},
				store_room: {
					name: 'Store Room',
					x: 5,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'On the ground',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.peach_castle();
							},
							ap: [8112000151]
						}
					]
				},
				bowser: {
					name: 'Bowser',
					x: 3,
					y: 1,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Defeat Bowser',
							icon: '/images/checks/stars/starrod.webp',
							exists: () => {
								return true;
							},
							available: () => {
								return flags.peach_castle();
							}
						}
					]
				}
			}
		}
	});

	const getTotalCheckedChecksOnMap = (mapCategoryKey = null, mapKey = null) => {
		let totalChecks = 0;

		if (mapCategoryKey === null) {
			for (const [mapCategoryToCheckKey, mapCategory] of Object.entries(checks)) {
				if (checks[mapCategoryToCheckKey].exists()) {
					for (const [mapToCheckKey, mapToCheck] of Object.entries(mapCategory.maps)) {
						// console.log(mapCategoryToCheckKey, mapToCheckKey, mapToCheck.checks);

						if (save.data.checks[mapCategoryToCheckKey] !== undefined && save.data.checks[mapCategoryToCheckKey][mapToCheckKey] !== undefined) {
							totalChecks += save.data.checks[mapCategoryToCheckKey][mapToCheckKey].length;
						}
					}
				}
			}
		} else {
			if (checks[mapCategoryKey].exists()) {
				if (mapKey === null) {
					for (const [mapToCheckKey, mapToCheck] of Object.entries(checks[mapCategoryKey].maps)) {
						if (save.data.checks[mapCategoryKey] !== undefined && save.data.checks[mapCategoryKey][mapToCheckKey] !== undefined) {
							totalChecks += save.data.checks[mapCategoryKey][mapToCheckKey].length;
						}
					}
				} else {
					if (save.data.checks[mapCategoryKey] !== undefined && save.data.checks[mapCategoryKey][mapKey] !== undefined) {
						totalChecks += save.data.checks[mapCategoryKey][mapKey].length;
					}
				}
			}
		}

		return totalChecks;
	};

	const getTotalAvailableCheckedChecksOnMap = (mapCategoryKey = null, mapKey = null) => {
		let totalChecks = 0;

		if (mapCategoryKey === null) {
			for (const [mapCategoryToCheckKey, mapCategory] of Object.entries(checks)) {
				if (checks[mapCategoryToCheckKey].exists()) {
					for (const [mapToCheckKey, mapToCheck] of Object.entries(mapCategory.maps)) {
						if (save.data.checks[mapCategoryToCheckKey] !== undefined && save.data.checks[mapCategoryToCheckKey][mapToCheckKey] !== undefined) {
							mapToCheck.checks.forEach((check, checkIndex) => {
								if (check.exists() && !check.dungeon && check.available() && save.data.checks[mapCategoryToCheckKey][mapToCheckKey].includes(checkIndex)) {
									totalChecks++;
								}
							});
						}
					}
				}
			}
		} else {
			if (checks[mapCategoryKey].exists()) {
				if (mapKey === null) {
					for (const [mapToCheckKey, mapToCheck] of Object.entries(checks[mapCategoryKey].maps)) {
						if (save.data.checks[mapCategoryKey] !== undefined && save.data.checks[mapCategoryKey][mapToCheckKey] !== undefined) {
							mapToCheck.checks.forEach((check, checkIndex) => {
								if (check.exists() && !check.dungeon && check.available() && save.data.checks[mapCategoryKey][mapToCheckKey].includes(checkIndex)) {
									totalChecks++;
								}
							});
						}
					}
				} else {
					if (save.data.checks[mapCategoryKey] !== undefined && save.data.checks[mapCategoryKey][mapKey] !== undefined) {
						for (const [checkKey, check] of Object.entries(checks[mapCategoryKey].maps[mapKey])) {
							checks[mapCategoryKey].maps[mapKey].checks.forEach((check, checkIndex) => {
								if (check.exists() && !check.dungeon && check.available() && save.data.checks[mapCategoryKey][mapKey].includes(checkIndex)) {
									totalChecks++;
								}
							});
						}
					}
				}
			}
		}

		return totalChecks;
	};

	const getTotalChecksOnMap = (mapCategoryKey = null, mapKey = null, ignoreDungeon = false) => {
		let totalChecks = 0;

		if (mapCategoryKey === null) {
			for (const [mapCategoryToCheckKey, mapCategory] of Object.entries(checks)) {
				if (checks[mapCategoryToCheckKey].exists()) {
					for (const [mapToCheckKey, mapToCheck] of Object.entries(mapCategory.maps)) {
						// console.log(mapCategoryToCheckKey, mapToCheckKey, mapToCheck.checks);
						for (const [checkKey, check] of Object.entries(mapToCheck.checks)) {
							if (ignoreDungeon) {
								if (check.exists()) {
									totalChecks++;
								}
							} else {
								if (check.exists() && !check.dungeon) {
									totalChecks++;
								}
							}
						}
					}
				}
			}
		} else {
			if (checks[mapCategoryKey].exists()) {
				if (mapKey === null) {
					for (const [mapToCheckKey, mapToCheck] of Object.entries(checks[mapCategoryKey].maps)) {
						for (const [checkKey, check] of Object.entries(mapToCheck.checks)) {
							if (ignoreDungeon) {
								if (check.exists()) {
									totalChecks++;
								}
							} else {
								if (check.exists() && !check.dungeon) {
									totalChecks++;
								}
							}
						}
					}
				} else {
					for (const [checkKey, check] of Object.entries(checks[mapCategoryKey].maps[mapKey].checks)) {
						if (ignoreDungeon) {
							if (check.exists()) {
								totalChecks++;
							}
						} else {
							if (check.exists() && !check.dungeon) {
								totalChecks++;
							}
						}
					}
				}
			}
		}

		return totalChecks;
	};

	const getTotalAvailableChecksOnMap = (mapCategoryKey = null, mapKey = null) => {
		let totalChecks = 0;

		if (mapCategoryKey === null) {
			for (const [mapCategoryToCheckKey, mapCategory] of Object.entries(checks)) {
				if (checks[mapCategoryToCheckKey].exists()) {
					for (const [mapToCheckKey, mapToCheck] of Object.entries(mapCategory.maps)) {
						for (const [checkKey, check] of Object.entries(mapToCheck.checks)) {
							if (check.exists() && !check.dungeon && check.available()) {
								totalChecks++;
							}
						}
					}
				}
			}
		} else {
			if (checks[mapCategoryKey].exists()) {
				if (mapKey === null) {
					for (const [mapToCheckKey, mapToCheck] of Object.entries(checks[mapCategoryKey].maps)) {
						for (const [checkKey, check] of Object.entries(mapToCheck.checks)) {
							if (check.exists() && !check.dungeon && check.available()) {
								totalChecks++;
							}
						}
					}
				} else {
					for (const [checkKey, check] of Object.entries(checks[mapCategoryKey].maps[mapKey].checks)) {
						if (check.exists() && !check.dungeon && check.available()) {
							totalChecks++;
						}
					}
				}
			}
		}

		return totalChecks;
	};

	return {
		checks: checks,
		flags: flags,
		getTotalCheckedChecksOnMap: computed(() => getTotalCheckedChecksOnMap),
		getTotalAvailableCheckedChecksOnMap: computed(() => getTotalAvailableCheckedChecksOnMap),
		getTotalChecksOnMap: computed(() => getTotalChecksOnMap),
		getTotalAvailableChecksOnMap: computed(() => getTotalAvailableChecksOnMap)
	};
});
