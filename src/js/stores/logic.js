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
			return save.data.items.hammer >= 1 || flags.partner('kooper') || flags.partner('bombette');
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
			let magical_seeds = 0;

			if (save.data.items.pink_magical_seed) {
				magical_seeds++;
			}

			if (save.data.items.purple_magical_seed) {
				magical_seeds++;
			}

			if (save.data.items.green_magical_seed) {
				magical_seeds++;
			}

			if (save.data.items.yellow_magical_seed) {
				magical_seeds++;
			}

			return magical_seeds;
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

				return requirements[save.data.items[`${stars[dungeon]}_dungeon_shuffle`]];
			} else {
				return requirements[dungeon];
			}
		},
		dungeon_entrance_requirements_toybox: () => {
			if (save.data.configs.randomizer.toybox_open) {
				return flags.toad_town() && flags.jump_ledges();
			} else {
				return flags.toad_town() && flags.jump_ledges() && flags.partner('bow');
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
					if (flags.toad_town() && (save.data.configs.randomizer.prologue_open || flags.stone_blocks())) {
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
			return flags.toad_town() && (flags.trees() || (flags.sewers() && flags.stone_blocks()));
		},
		koopa_bros_fortress: () => {
			return flags.dungeon_entrance_requirements(1);
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

					if (save.data.configs.randomizer.mt_rugged_open) {
						return true;
					}

					if (save.data.items.boots >= 1 && (flags.partner('bombette') || flags.stone_blocks())) {
						return true;
					}
			}

			return false;
		},
		dry_dry_desert: () => {
			if (save.data.configs.randomizer.starting_location == tracker.startingLocations.random) {
				return false;
			}

			switch (save.data.configs.randomizer.starting_location) {
				case tracker.startingLocations.dry_dry_outpost:
					return true;

				default:
					if ((flags.mt_rugged() && flags.partner('parakarry')) || (flags.sewers() && flags.stone_blocks())) {
						return true;
					}
			}

			return false;
		},
		dry_dry_ruins: (requireBoots = true, jumpLedgesRequired = true) => {
			if (flags.dungeon_entrance_requirements(2)) {
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

			return flags.forever_forest() || (flags.sewers() && save.data.items.boots >= 2) || (flags.rip_cheato() && flags.partner('bombette') && flags.partner('sushie'));
		},
		gusty_gulch: () => {
			return flags.boo_mansion() && save.data.items.boo_portrait;
		},
		tubba_blubba_castle: () => {
			return flags.dungeon_entrance_requirements(3);
		},
		toybox: (requireTrain = true, requireBoots = true) => {
			if (flags.dungeon_entrance_requirements(4)) {
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
							(flags.toad_town() && flags.partner('watt')) ||
							(flags.sewers() && save.data.items.boots >= 2 && save.data.items.sushie) ||
							(flags.rip_cheato() && flags.partner('bombette') && flags.jump_ledges())
						);
					}
			}
		},
		lava_lava_island_jungle_behind_raven_statue: () => {
			return flags.lava_lava_island() && flags.partner('sushie') && save.data.items.hammer >= 1 && save.data.items.jade_raven;
		},
		mt_lavalava: () => {
			return flags.dungeon_entrance_requirements(5);
		},
		flower_fields: () => {
			return flags.dungeon_entrance_requirements(6);
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
			return flags.dungeon_entrance_requirements(7);
		},
		star_haven: () => {
			return flags.toad_town() && flags.star_spirits_count() >= 7 && flags.jump_ledges();
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
							}
						},
						{
							name: 'Far right tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks();
							}
						},
						{
							name: 'Top-left tree',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks();
							}
						},
						{
							name: 'Bottom-left tree',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks();
							}
						},
						{
							name: 'Bush 1',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks();
							}
						},
						{
							name: 'Bush 2',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks();
							}
						},
						{
							name: 'Bush 3',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks();
							}
						},
						{
							name: 'Bush 4',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks();
							}
						},
						{
							name: 'Bush 5',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks();
							}
						},
						{
							name: 'Bush 6',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks();
							}
						},
						{
							name: 'Block on the ground',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.yellow_blocks() && flags.ground_blocks();
							}
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
							}
						},
						{
							name: 'Item 1 above spring',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges();
							}
						},
						{
							name: 'Item 2 above spring',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges();
							}
						},
						{
							name: 'Item 3 above spring',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges();
							}
						},
						{
							name: 'Item 4 above spring',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges();
							}
						},
						{
							name: 'Far left ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges();
							}
						},
						{
							name: 'Tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village() && flags.trees();
							}
						},
						{
							name: 'Item on ledge above spring',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges();
							}
						},
						{
							name: '? block above stone block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village() && flags.jump_ledges() && flags.ground_blocks();
							}
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
							}
						},
						{
							name: 'Tree on ledge',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village() && flags.trees();
							}
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
							}
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
							}
						},
						{
							name: 'Give Dolly to Goombaria',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village() && save.data.items.dolly;
							}
						},
						{
							name: 'Goompa',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village();
							}
						},
						{
							name: "Goompa's veranda",
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village();
							}
						},
						{
							name: 'Tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village() && flags.trees();
							}
						},
						{
							name: 'Goompa',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.goomba_village() && flags.deliver_letters() && save.data.items.letters.goompa;
							}
						},
						{
							name: 'Goompapa',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.goomba_village() && flags.deliver_letters() && save.data.items.letters.goompapa >= 1;
							}
						},
						{
							name: 'Goompapa 2',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.goomba_village() && flags.deliver_letters() && save.data.items.letters.goompapa >= 2;
							}
						},
						{
							name: 'Bottom right bush',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.goomba_village();
							}
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
							}
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
							}
						},
						{
							name: 'Right ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.goomba_village() && flags.yellow_blocks() && flags.jump_coin_blocks();
							}
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
							name: '? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village() && flags.yellow_blocks() && flags.jump_coin_blocks();
							}
						},
						{
							name: 'Sign',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.goomba_village() && flags.yellow_blocks();
							}
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
							}
						},
						{
							name: 'Top near Toad Town entrance',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.toad_town() && flags.panels();
							}
						},
						{
							name: 'Break brick block to spawn ? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_coin_blocks() && flags.ground_blocks();
							}
						},
						{
							name: "Tree right of the Goomba King's Fortress (top left in the fence)",
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.toad_town() && flags.trees();
							}
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
							}
						},
						{
							name: '? block at the bottom of the steps',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_coin_blocks();
							}
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
									save.data.items.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea
								);
							}
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
							}
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
							}
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
							}
						},
						{
							name: 'On the first step',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.toad_town() && flags.jump_ledges() && flags.panels();
							}
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
							}
						},
						{
							name: 'Merlow',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.deliver_letters() && save.data.items.letters.merlow;
							}
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
									save.data.items.sleepy_sheep &&
									save.data.items.koopa_koot_favors.tape &&
									save.data.items.koopa_koot_favors.koopa_tea &&
									save.data.items.koopa_koot_favors.luigi_autograph &&
									save.data.items.koopa_koot_favors.empty_wallet &&
									save.data.items.koopa_koot_favors.tasty_tonic &&
									save.data.items.koopa_koot_favors.crystal_ball
								);
							}
						},
						{
							name: 'Merlow star pieces reward 1',
							icon: '/images/checks/shopsanity_merlow.webp',
							exists: () => {
								return save.data.configs.logic.merlow;
							},
							available: () => {
								return flags.toad_town() && save.data.items.star_pieces >= save.data.configs.logic.merlow_reward_cost_1;
							}
						},
						{
							name: 'Merlow star pieces reward 2',
							icon: '/images/checks/shopsanity_merlow.webp',
							exists: () => {
								return save.data.configs.logic.merlow;
							},
							available: () => {
								return flags.toad_town() && save.data.items.star_pieces >= save.data.configs.logic.merlow_reward_cost_2;
							}
						},
						{
							name: 'Merlow star pieces reward 3',
							icon: '/images/checks/shopsanity_merlow.webp',
							exists: () => {
								return save.data.configs.logic.merlow;
							},
							available: () => {
								return flags.toad_town() && save.data.items.star_pieces >= save.data.configs.logic.merlow_reward_cost_3;
							}
						},
						{
							name: 'Merlow star pieces reward 4',
							icon: '/images/checks/shopsanity_merlow.webp',
							exists: () => {
								return save.data.configs.logic.merlow;
							},
							available: () => {
								return flags.toad_town() && save.data.items.star_pieces >= save.data.configs.logic.merlow_reward_cost_4;
							}
						},
						{
							name: 'Merlow star pieces reward 5',
							icon: '/images/checks/shopsanity_merlow.webp',
							exists: () => {
								return save.data.configs.logic.merlow;
							},
							available: () => {
								return flags.toad_town() && save.data.items.star_pieces >= save.data.configs.logic.merlow_reward_cost_5;
							}
						},
						{
							name: 'Merlow star pieces reward 6',
							icon: '/images/checks/shopsanity_merlow.webp',
							exists: () => {
								return save.data.configs.logic.merlow;
							},
							available: () => {
								return flags.toad_town() && save.data.items.star_pieces >= save.data.configs.logic.merlow_reward_cost_6;
							}
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
							}
						},
						{
							name: 'Shop item 2',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							}
						},
						{
							name: 'Shop item 3',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							}
						},
						{
							name: 'Shop item 4',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							}
						},
						{
							name: 'Shop item 5',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							}
						},
						{
							name: 'Shop item 6',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							}
						},
						{
							name: 'Give dictionary to Russ T.',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && save.data.items.dictionary;
							}
						},
						{
							name: 'Item bottom left of the map',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.partner('sushie');
							}
						},
						{
							name: 'By the three toad sisters',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.toad_town() && flags.panels();
							}
						},
						{
							name: 'Miss T.',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.deliver_letters() && save.data.items.letters.miss_t;
							}
						},
						{
							name: 'Russ T.',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.deliver_letters() && save.data.items.letters.russ_t;
							}
						},
						{
							name: 'Give Koopa Leaf to Trading Event Toad',
							icon: '/images/checks/trading_event_randomized.webp',
							exists: () => {
								return save.data.configs.logic.trading_event_randomized;
							},
							available: () => {
								return flags.koopa_village() && flags.toad_town() && flags.star_spirits_count() >= 1 && save.data.items.trading_event_toad.koopa_leaf;
							}
						},
						{
							name: 'Defeat Chan',
							icon: '/images/checks/dojo_randomized.webp',
							exists: () => {
								return save.data.configs.logic.dojo_randomized;
							},
							available: () => {
								return flags.toad_town();
							}
						},
						{
							name: 'Defeat Lee',
							icon: '/images/checks/dojo_randomized.webp',
							exists: () => {
								return save.data.configs.logic.dojo_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 2;
							}
						},
						{
							name: 'Defeat Master',
							icon: '/images/checks/dojo_randomized.webp',
							exists: () => {
								return save.data.configs.logic.dojo_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 3;
							}
						},
						{
							name: 'Defeat Master 2',
							icon: '/images/checks/dojo_randomized.webp',
							exists: () => {
								return save.data.configs.logic.dojo_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 4;
							}
						},
						{
							name: 'Defeat Master 3',
							icon: '/images/checks/dojo_randomized.webp',
							exists: () => {
								return save.data.configs.logic.dojo_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 5;
							}
						},
						{
							name: 'Super block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.toad_town() && flags.jump_coin_blocks() && flags.jump_ledges() && flags.partner('sushie');
							}
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
							}
						},
						{
							name: 'Merlon',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.deliver_letters() && save.data.items.letters.merlon;
							}
						},
						{
							name: 'Give Calculator to Rowf',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && save.data.items.calculator;
							}
						},
						{
							name: 'Give Mailbag to the Postmaster in the Post Office',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && save.data.items.mailbag;
							}
						},
						{
							name: "Ground pound inside Merlon's house three times",
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && save.data.items.boots >= 2;
							}
						},
						{
							name: 'Minh T.',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.deliver_letters() && save.data.items.letters.minh_t;
							}
						},
						{
							name: 'Rowf shop 1',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town();
							}
						},
						{
							name: 'Rowf shop 2',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town();
							}
						},
						{
							name: 'Rowf shop 3',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town();
							}
						},
						{
							name: 'Rowf shop 4',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town();
							}
						},
						{
							name: 'Rowf shop 5',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 1;
							}
						},
						{
							name: 'Rowf shop 6',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 1;
							}
						},
						{
							name: 'Rowf shop 7',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 1;
							}
						},
						{
							name: 'Rowf shop 8',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 2;
							}
						},
						{
							name: 'Rowf shop 9',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 2;
							}
						},
						{
							name: 'Rowf shop 10',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 2;
							}
						},
						{
							name: 'Rowf shop 11',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 3;
							}
						},
						{
							name: 'Rowf shop 12',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 3;
							}
						},
						{
							name: 'Rowf shop 13',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 3;
							}
						},
						{
							name: 'Rowf shop 14',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 4;
							}
						},
						{
							name: 'Rowf shop 15',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 4;
							}
						},
						{
							name: 'Rowf shop 16',
							icon: '/images/checks/shopsanity_rowf.webp',
							exists: () => {
								return save.data.configs.logic.rowf_shop;
							},
							available: () => {
								return flags.toad_town() && flags.star_spirits_count() >= 4;
							}
						},
						{
							name: klevar_dungeon_shuffle_name,
							icon: klevar_dungeon_shuffle_icon,
							exists: () => {
								return save.data.configs.randomizer.shuffle_dungeon_entrances;
							},
							available: () => {
								return flags.toad_town() && flags.magical_seeds_count() >= save.data.configs.randomizer.magical_seed_required;
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
							}
						},
						{
							name: 'Give Melody to Simon in Club 64',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && save.data.items.melody;
							}
						},
						{
							name: 'Outside Club 64',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.toad_town() && flags.panels();
							}
						},
						{
							name: 'Fishmael',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.deliver_letters() && save.data.items.letters.fishmael;
							}
						},
						{
							name: 'Give Coconut to Trading Event Toad',
							icon: '/images/checks/trading_event_randomized',
							exists: () => {
								return save.data.configs.logic.trading_event_randomized;
							},
							available: () => {
								return flags.koopa_village() && flags.toad_town() && flags.star_spirits_count() >= 5 && save.data.items.trading_event_toad.coconut;
							}
						},
						{
							name: 'Block on the crates south-west of the area',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.toad_town() && save.data.items.boots >= 1;
							}
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
							}
						},
						{
							name: 'Shop item 2',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							}
						},
						{
							name: 'Shop item 3',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							}
						},
						{
							name: 'Shop item 4',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							}
						},
						{
							name: 'Shop item 5',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							}
						},
						{
							name: 'Shop item 6',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.toad_town();
							}
						},
						{
							name: "4 Items in Harry's storeroom",
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && save.data.items.storeroom_key;
							}
						},
						{
							name: muskular_dungeon_shuffle_name,
							icon: muskular_dungeon_shuffle_icon,
							exists: () => {
								return save.data.configs.randomizer.shuffle_dungeon_entrances;
							},
							available: () => {
								return flags.dungeon_entrance_requirements_toybox();
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
								return flags.toad_town();
							}
						},
						{
							name: 'Give Frying Pan to Tayce T.',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && save.data.items.frying_pan;
							}
						},
						{
							name: 'Inside Blue House',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.rip_cheato();
							}
						},
						{
							name: 'Near Fice T.',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.toad_town() && flags.panels();
							}
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
							}
						},
						{
							name: 'Fice T.',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.deliver_letters() && save.data.items.letters.fice_t;
							}
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
							}
						},
						{
							name: 'Dane T.',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.deliver_letters() && save.data.items.letters.dane_t >= 1;
							}
						},
						{
							name: 'Dane T. 2',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.toad_town() && flags.deliver_letters() && save.data.items.letters.dane_t >= 2;
							}
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
							}
						},
						{
							name: 'Middle ? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.sewers() && flags.jump_coin_blocks() && flags.stone_blocks();
							}
						},
						{
							name: 'Right ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.sewers() && flags.jump_coin_blocks() && flags.stone_blocks();
							}
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
							}
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
								return flags.sewers() && flags.stone_blocks();
							}
						}
					]
				},
				upgrade_block_behind_ultra_blocks: {
					name: 'Super block',
					x: 2,
					y: 5,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Super block behind ultra blocks',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.sewers() && flags.ultra_blocks();
							}
						}
					]
				},
				upgrade_block_after_elevator: {
					name: 'Super block',
					x: 4,
					y: 4,
					w: 1,
					h: 1,
					checks: [
						{
							name: 'Super block after you take the left elevator in the cieling in the elevator room',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.sewers() && save.data.items.boots >= 1 && flags.stone_blocks();
							}
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
							}
						},
						{
							name: 'Third brick from the left',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.sewers() && flags.jump_coin_blocks() && flags.yellow_blocks();
							}
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
							}
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
							}
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
							}
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
							}
						},
						{
							name: 'Super block',
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
									((save.data.items.boots >= 2 && flags.partner('sushie')) || (flags.rip_cheato() && flags.partner('bombette')))
								);
							}
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
									((save.data.items.boots >= 2 && flags.partner('sushie')) || (flags.rip_cheato() && flags.partner('bombette')))
								);
							}
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
									((save.data.items.boots >= 2 && flags.partner('sushie')) || (flags.rip_cheato() && flags.partner('bombette')))
								);
							}
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
									((save.data.items.boots >= 2 && flags.partner('sushie')) || (flags.rip_cheato() && flags.partner('bombette')))
								);
							}
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
								return flags.sewers() && flags.shiver_city() && (flags.ultra_jump_blocks() || (save.data.configs.randomizer.chapter_7_bridge_open && save.data.items.boots >= 2));
							}
						},
						{
							name: 'Invisible block 1',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.sewers() && flags.shiver_city() && (flags.ultra_jump_blocks() || (save.data.configs.randomizer.chapter_7_bridge_open && save.data.items.boots >= 2));
							}
						},
						{
							name: 'Invisible block 2',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.sewers() && flags.shiver_city() && (flags.ultra_jump_blocks() || (save.data.configs.randomizer.chapter_7_bridge_open && save.data.items.boots >= 2));
							}
						},
						{
							name: 'Invisible block 3',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.sewers() && flags.shiver_city() && (flags.ultra_jump_blocks() || (save.data.configs.randomizer.chapter_7_bridge_open && save.data.items.boots >= 2));
							}
						},
						{
							name: 'Invisible block 4',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.sewers() && flags.shiver_city() && (flags.ultra_jump_blocks() || (save.data.configs.randomizer.chapter_7_bridge_open && save.data.items.boots >= 2));
							}
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
							}
						},
						{
							name: 'Rip Cheato 2 (2 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 2;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							}
						},
						{
							name: 'Rip Cheato 3 (4 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 3;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							}
						},
						{
							name: 'Rip Cheato 4 (4 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 4;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							}
						},
						{
							name: 'Rip Cheato 5 (8 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 5;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							}
						},
						{
							name: 'Rip Cheato 6 (8 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 6;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							}
						},
						{
							name: 'Rip Cheato 7 (16 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 7;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							}
						},
						{
							name: 'Rip Cheato 8 (16 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 8;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							}
						},
						{
							name: 'Rip Cheato 9 (32 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 9;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							}
						},
						{
							name: 'Rip Cheato 10 (32 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 10;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							}
						},
						{
							name: 'Rip Cheato 11 (64 coins)',
							icon: '/images/checks/rip_cheato.webp',
							exists: () => {
								return save.data.configs.logic.rip_cheato >= 11;
							},
							available: () => {
								return flags.sewers() && flags.rip_cheato();
							}
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
							}
						},
						{
							name: 'Middle ? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_coin_blocks();
							}
						},
						{
							name: 'Right ? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toad_town() && flags.jump_coin_blocks();
							}
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
							}
						},
						{
							name: 'Item on the little island after the bridge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village() && flags.partner('kooper');
							}
						},
						{
							name: 'Item behind the small fence',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village();
							}
						},
						{
							name: 'Last block near the east exit',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.koopa_village() && flags.jump_coin_blocks();
							}
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
							}
						},
						{
							name: 'Item behind the right most striped pillar on top of the mountain',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village();
							}
						},
						{
							name: 'Break brick boxes in order next to Koopa Village entrance (left, right, middle)',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village() && flags.jump_coin_blocks() && flags.ground_blocks();
							}
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
							}
						},
						{
							name: 'Hidden block after the bridge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village() && flags.partner('kooper');
							}
						},
						{
							name: 'Under the 5 coins next to the west entrance',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.koopa_village() && flags.panels();
							}
						},
						{
							name: 'Coin 1 next to the west entrance',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.koopa_village();
							}
						},
						{
							name: 'Coin 2 next to the west entrance',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.koopa_village();
							}
						},
						{
							name: 'Coin 3 next to the west entrance',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.koopa_village();
							}
						},
						{
							name: 'Coin 4 next to the west entrance',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.koopa_village();
							}
						},
						{
							name: 'Coin 5 next to the west entrance',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.koopa_village();
							}
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
							}
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
							}
						},
						{
							name: eldstar_dungeon_shuffle_name,
							icon: eldstar_dungeon_shuffle_icon,
							exists: () => {
								return save.data.configs.randomizer.shuffle_dungeon_entrances;
							},
							available: () => {
								return flags.koopa_village() && save.data.items.kooper;
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
							}
						},
						{
							name: 'Bottom bush on the left side',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village();
							}
						},
						{
							name: 'Second bush on the right next to the east exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.koopa_village();
							}
						},
						{
							name: 'Third bush on the right next to the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village();
							}
						},
						{
							name: 'Shop item 1',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.koopa_village();
							}
						},
						{
							name: 'Shop item 2',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.koopa_village();
							}
						},
						{
							name: 'Shop item 3',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.koopa_village();
							}
						},
						{
							name: 'Shop item 4',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.koopa_village();
							}
						},
						{
							name: 'Shop item 5',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.koopa_village();
							}
						},
						{
							name: 'Shop item 6',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.koopa_village();
							}
						},
						{
							name: 'Left of tree',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.koopa_village() && flags.panels();
							}
						},
						{
							name: 'Mort T. (Koopa Inn)',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.koopa_village() && flags.deliver_letters() && save.data.items.letters.mort_t;
							}
						},
						{
							name: 'Koover 1 (Koopa at the west entrance)',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.koopa_village() && flags.deliver_letters() && save.data.items.letters.koover >= 1;
							}
						},
						{
							name: 'Koover 2 (Koopa at the west entrance)',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.koopa_village() && flags.deliver_letters() && save.data.items.letters.koover >= 2;
							}
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
							}
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
							}
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
							}
						},
						{
							name: 'Give Kooper his shell',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village() && save.data.items.kooper_shell;
							}
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
							}
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
							}
						},
						{
							name: 'Item on top of the brick block on the right (After beating the fuzzies)',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_village() && save.data.items.hammer >= 1;
							}
						},
						{
							name: 'Far right bush',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.koopa_village();
							}
						},
						{
							name: "Talk to Kolorado's wife (After Koopa Koot asks for the Koopa Legends)",
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return flags.koopa_village() && flags.can_koot();
							}
						},
						{
							name: 'Koopa Koot - Return Koopa Legends',
							icon: '/images/checks/koopa_koot_coins.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot_coins;
							},
							available: () => {
								return flags.koopa_village() && flags.can_koot() && save.data.items.koopa_koot_favors.koopa_legends;
							}
						},
						{
							name: 'Koopa Koot - Give Sleepy Sheep - First reward',
							icon: '/images/checks/koopa_koot_coins.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot_coins;
							},
							available: () => {
								return flags.koopa_village() && flags.can_koot() && save.data.items.koopa_koot_favors.koopa_legends && save.data.items.koopa_koot_favors.sleepy_sheep;
							}
						},
						{
							name: 'Koopa Koot - Give Sleepy Sheep - Second reward',
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return flags.koopa_village() && flags.can_koot() && save.data.items.koopa_koot_favors.koopa_legends && save.data.items.koopa_koot_favors.sleepy_sheep;
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
						},
						{
							name: 'Top of the room, guarded by a Bob-omb',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_bros_fortress() && flags.jump_ledges() && save.data.items.fortress_key >= 4 && (flags.partner('kooper') || flags.partner('parakarry'));
							}
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
							}
						},
						{
							name: 'Middle jail cell',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_bros_fortress() && save.data.items.fortress_key >= 1;
							}
						},
						{
							name: 'Right jail cell',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.koopa_bros_fortress() && save.data.items.fortress_key >= 1 && flags.partner('bombette');
							}
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
							}
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
							}
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
								return flags.koopa_bros_fortress() && (flags.partner('bombette') || save.data.items.fortress_key >= 2);
							}
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
							}
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
							}
						},
						{
							name: 'Give three letters to Parakarry',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.letters_count() >= 3;
							}
						},
						{
							name: 'Bush 1 near the train station',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.mt_rugged(false);
							}
						},
						{
							name: 'Bush 2 near the train station',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.mt_rugged(false);
							}
						},
						{
							name: 'Bush 3 near the train station',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.mt_rugged(false);
							}
						},
						{
							name: 'Super block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && save.data.items.hammer >= 2;
							}
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
								return flags.mt_rugged() && save.data.items.hammer >= 1;
							}
						},
						{
							name: '? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_coin_blocks();
							}
						},
						{
							name: 'Item 1 on slide',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges();
							}
						},
						{
							name: 'Item 2 on slide',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges();
							}
						},
						{
							name: 'Item 3 on slide',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges();
							}
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
							}
						},
						{
							name: 'Chest in the cave (enter the cave and go left)',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges();
							}
						},
						{
							name: 'Item 1 on the ground in the gap at the far left of the room',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges();
							}
						},
						{
							name: 'Item 2 on the ground in the gap at the far left of the room',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges();
							}
						},
						{
							name: 'Item at the far left of the room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.partner('parakarry');
							}
						},
						{
							name: 'Item 1 of the circle of items at the far left of the room',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.partner('parakarry');
							}
						},
						{
							name: 'Item 2 of the circle of items at the far left of the room',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.partner('parakarry');
							}
						},
						{
							name: 'Item 3 of the circle of items at the far left of the room',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.partner('parakarry');
							}
						},
						{
							name: 'Item 4 of the circle of items at the far left of the room',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.partner('parakarry');
							}
						},
						{
							name: 'Item 5 of the circle of items at the far left of the room',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.partner('parakarry');
							}
						},
						{
							name: 'Item 6 of the circle of items at the far left of the room',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.partner('parakarry');
							}
						},
						{
							name: '? block on top of the ledge on the left',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.ground_blocks();
							}
						},
						{
							name: '? block on top of the ledge on the right',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges() && flags.ground_blocks();
							}
						},
						{
							name: 'Item on the ledge at the far right of the screen',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && flags.jump_ledges();
							}
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
							}
						},
						{
							name: 'Right item on the ledge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && (flags.partner('kooper') || flags.partner('parakarry'));
							}
						},
						{
							name: 'Left item on the ledge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && flags.partner('parakarry');
							}
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
							}
						},
						{
							name: 'Bub-ulb',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_rugged() && flags.partner('parakarry');
							}
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
							}
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
							}
						},
						{
							name: 'Right ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							}
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
								return flags.koopa_village() && flags.dry_dry_desert() && flags.star_spirits_count() >= 3 && save.data.items.trading_event_toad;
							}
						},
						{
							name: mamar_dungeon_shuffle_name,
							icon: mamar_dungeon_shuffle_icon,
							exists: () => {
								return save.data.configs.randomizer.shuffle_dungeon_entrances;
							},
							available: () => {
								return flags.dry_dry_desert() && save.data.items.pulse_stone;
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
							}
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
							}
						},
						{
							name: 'Block near the tree',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							}
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
							}
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
					name: '2 Blocks, 1 Tweester',
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
							}
						},
						{
							name: 'Right ? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							}
						},
						{
							name: 'Block in the center of the room',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							}
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
								return flags.dry_dry_desert() && flags.ground_blocks();
							}
						},
						{
							name: 'Hit the block 5 time',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							}
						},
						{
							name: 'Hit the block 10 time',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							}
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
							}
						},
						{
							name: 'Top right ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							}
						},
						{
							name: 'Middle ? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							}
						},
						{
							name: 'Bottom left ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							}
						},
						{
							name: 'Bottom right ? block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.ground_blocks();
							}
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
							}
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
							}
						},
						{
							name: 'Third block from the right',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							}
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
							}
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
							}
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
							}
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
							}
						},
						{
							name: 'Tree',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							}
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
							}
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
							}
						},
						{
							name: 'Second tree from the left',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							}
						},
						{
							name: 'Fourth tree from the right',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							}
						},
						{
							name: 'Far right tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							}
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
							}
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
							}
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
							}
						},
						{
							name: 'Item on the brick block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && ((flags.jump_ledges() && flags.partner('kooper')) || flags.ultra_jump_blocks());
							}
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
							}
						},
						{
							name: 'Invisible block above the ? block in the middle of the room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_ledges() && flags.jump_coin_blocks();
							}
						},
						{
							name: 'Bottom tree',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							}
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
					name: '',
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
							}
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
							}
						},
						{
							name: 'Item behind the bush near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert();
							}
						},
						{
							name: 'Block near the tree',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							}
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
							}
						},
						{
							name: 'Big tree on the right',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							}
						},
						{
							name: 'Super block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							}
						},
						{
							name: 'Tree at the bottom left of the room',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							}
						},
						{
							name: 'Tree down of the heart block',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							}
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
								return flags.dry_dry_desert() && flags.jump_ledges() && flags.ultra_jump_blocks();
							}
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
							}
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
							}
						},
						{
							name: 'Brick block 1',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							}
						},
						{
							name: 'Brick block 2',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							}
						},
						{
							name: 'Brick block 3',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							}
						},
						{
							name: 'Brick block 4',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							}
						},
						{
							name: 'Brick block 5',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							}
						},
						{
							name: 'Brick block 6',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.jump_coin_blocks();
							}
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
								return flags.dry_dry_desert() && save.data.items.letters.lyrics;
							}
						},
						{
							name: 'Red tree',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.trees();
							}
						},
						{
							name: 'Shop item 1',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.dry_dry_desert();
							}
						},
						{
							name: 'Shop item 2',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.dry_dry_desert();
							}
						},
						{
							name: 'Shop item 3',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.dry_dry_desert();
							}
						},
						{
							name: 'Little Mouser',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.deliver_letters() && save.data.items.letters.little_mouser;
							}
						},
						{
							name: 'Buy Dusty Hammer, Dried Pasta, Dusty Hammer, Dried Shroom',
							icon: '/images/checks/koopa_koot_favors.webp',
							exists: () => {
								return save.data.configs.logic.koopa_koot;
							},
							available: () => {
								return flags.dry_dry_desert();
							}
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
							}
						},
						{
							name: 'Item on the rooftops',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_desert() && save.data.items.boots >= 1;
							}
						},
						{
							name: 'Rooftop',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.panels();
							}
						},
						{
							name: 'Mr E',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.dry_dry_desert() && flags.deliver_letters() && save.data.items.letters.mr_e;
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
						},
						{
							name: 'On the ledge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_ruins() && flags.stone_blocks() && save.data.items.ruins_key >= 2;
							}
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
							}
						},
						{
							name: 'Super Hammer Chest',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.dry_dry_ruins() && save.data.items.ruins_key >= 3 && flags.partner('parakarry');
							}
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
							name: 'Super block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.dry_dry_ruins() && save.data.items.ruins_key >= 3;
							}
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
								return flags.dry_dry_ruins() && save.data.items.ruins_key >= 3 && flags.partner('bombette');
							}
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
							}
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
					name: 'Moon Stone',
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
							}
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
							}
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
								return flags.forever_forest();
							}
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
								return flags.forever_forest();
							}
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
							}
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
							}
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
							}
						},
						{
							name: 'Middle of the room',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.boo_mansion() && flags.panels();
							}
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
							}
						},
						{
							name: 'By the couch',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.boo_mansion() && flags.panels();
							}
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
							}
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
							}
						},
						{
							name: 'Bush near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.boo_mansion(false);
							}
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
							}
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
							}
						},
						{
							name: 'Left crate',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boots >= 2;
							}
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
							}
						},
						{
							name: 'Bottom crate of the stack of crates',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boots >= 2;
							}
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
							}
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
							}
						},
						{
							name: 'Bottom left crate',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boots >= 2 && (flags.partner('bombette') || save.data.items.weight);
							}
						},
						{
							name: 'On the left of the room near the door',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boots >= 2 && (flags.partner('bombette') || save.data.items.weight);
							}
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
							}
						},
						{
							name: 'Shop item 2',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boo_portrait && ((flags.partner('bombette') && save.data.items.boots >= 2) || save.data.items.weight);
							}
						},
						{
							name: 'Shop item 3',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boo_portrait && ((flags.partner('bombette') && save.data.items.boots >= 2) || save.data.items.weight);
							}
						},
						{
							name: 'Shop item 4',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boo_portrait && ((flags.partner('bombette') && save.data.items.boots >= 2) || save.data.items.weight);
							}
						},
						{
							name: 'Shop item 5',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boo_portrait && ((flags.partner('bombette') && save.data.items.boots >= 2) || save.data.items.weight);
							}
						},
						{
							name: 'Shop item 6',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.boo_mansion() && save.data.items.boo_portrait && ((flags.partner('bombette') && save.data.items.boots >= 2) || save.data.items.weight);
							}
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
							}
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
							}
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
								return flags.gusty_gulch() && flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 3;
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
							}
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
									flags.star_spirits_count() >= 5 &&
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
							}
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
							}
						},
						{
							name: 'Item on the ledge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.gusty_gulch() && (flags.partner('kooper') || flags.partner('parakarry'));
							}
						},
						{
							name: 'Left ? block near the Goomba',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.gusty_gulch();
							}
						},
						{
							name: 'Right ? block near the Goomba',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.gusty_gulch();
							}
						},
						{
							name: 'Item in front of the log',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.gusty_gulch();
							}
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
							}
						},
						{
							name: 'Item behind the rock and the dead tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.gusty_gulch() && flags.partner('parakarry');
							}
						},
						{
							name: '? block near the east exit',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.gusty_gulch() && flags.partner('parakarry');
							}
						},
						{
							name: 'Near the east exit',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.gusty_gulch() && flags.partner('parakarry');
							}
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
							exists: () => {
								return save.data.configs.randomizer.shuffle_dungeon_entrances;
							},
							available: () => {
								return flags.gusty_gulch() && flags.partner('parakarry');
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
							}
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
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 1;
							}
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
								return flags.tubba_blubba_castle();
							}
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
							name: 'Super block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.tubba_blubba_castle();
							}
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
							}
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
							}
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
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 1;
							}
						},
						{
							name: 'Coin on the bed 1',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 1;
							}
						},
						{
							name: 'Coin on the bed 2',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 1;
							}
						},
						{
							name: 'Coin on the bed 3',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 1;
							}
						},
						{
							name: 'Coin on the bed 4',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 1;
							}
						},
						{
							name: 'Coin on the bed 5',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 1;
							}
						},
						{
							name: 'Coin on the bed 6',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.tubba_blubba_castle() && save.data.items.tubba_castle_key >= 1;
							}
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
							}
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
							}
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
							}
						},
						{
							name: 'In front of the station',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.toybox(false) && flags.panels();
							}
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
							}
						},
						{
							name: 'Item 2 on the left spring',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							}
						},
						{
							name: 'Item 3 on the left spring',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							}
						},
						{
							name: 'Item 1 on the spring of top of the first wall',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							}
						},
						{
							name: 'Item 2 on the spring of top of the first wall',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							}
						},
						{
							name: 'Item 3 on the spring of top of the first wall',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							}
						},
						{
							name: 'Item 4 on the spring of top of the first wall',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							}
						},
						{
							name: 'Item 5 on the spring of top of the first wall',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							}
						},
						{
							name: 'Item behind the fallen blocks',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							}
						},
						{
							name: 'Item of the roof of the west most building',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false) && flags.partner('parakarry');
							}
						},
						{
							name: '? block on the west side of the last wall',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							}
						},
						{
							name: '? block on the east side of the last wall',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							}
						},
						{
							name: '? block on the ledge at the end of the room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							}
						},
						{
							name: 'Item that Kammy spawns',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							}
						},
						{
							name: 'Chest',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox_jack_in_a_box(false);
							}
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
							}
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
							}
						},
						{
							name: '? block near the west exit',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox(false, false) && flags.jump_coin_blocks();
							}
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
							}
						},
						{
							name: 'Western invisible block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox(false, false) && flags.jump_coin_blocks();
							}
						},
						{
							name: 'Yellow Shy Guy 1',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox(false, false);
							}
						},
						{
							name: 'Yellow Shy Guy 2',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox(false, false);
							}
						},
						{
							name: 'Red Shy Guy',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox(false, false);
							}
						},
						{
							name: 'Blue Shy Guy',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox(false, false);
							}
						},
						{
							name: 'Green Shy Guy',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox(false, false);
							}
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
							}
						},
						{
							name: 'Invisible block by the pink lever',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
						},
						{
							name: 'In front of the station',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && flags.panels();
							}
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
							}
						},
						{
							name: '? block in the alley past the house',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox_jack_in_a_box() && save.data.items.toy_train;
							}
						},
						{
							name: 'Chest past the alley and past the house',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox_jack_in_a_box() && save.data.items.toy_train;
							}
						},
						{
							name: 'Item that Kammy spawns',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox_jack_in_a_box() && save.data.items.toy_train;
							}
						},
						{
							name: 'Chest at the end of the room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox_jack_in_a_box() && save.data.items.toy_train;
							}
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
							}
						},
						{
							name: 'West ? block north of the tracks',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
						},
						{
							name: 'East ? block north of the tracks',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
						},
						{
							name: 'Block between the two ? blocks north of the tracks',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
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
							}
						},
						{
							name: '? block north of the tracks, left of the Gourmet Guy Gate',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
						},
						{
							name: 'Left ? block north of the tracks, right of the Gourmet Guy Gate',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
						},
						{
							name: 'Middle invisible block north of the tracks, right of the Gourmet Guy Gate',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
						},
						{
							name: 'Right ? block north of the tracks, right of the Gourmet Guy Gate',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
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
							}
						},
						{
							name: 'Invisible block east of the station',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
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
							}
						},
						{
							name: 'Item 2 on the first threadmill',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
						},
						{
							name: 'Item 3 on the first threadmill',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
						},
						{
							name: 'Item 1 on the second threadmill',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
						},
						{
							name: 'Item 2 on the second threadmill',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
						},
						{
							name: 'Item 3 on the second threadmill',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
						},
						{
							name: 'Yellow Shy Guy on the last threadmill',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow');
							}
						},
						{
							name: 'Block on the pink moving platform',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow') && flags.partner('parakarry');
							}
						},
						{
							name: 'Coin 1 inside the fort',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow');
							}
						},
						{
							name: 'Coin 2 inside the fort',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow');
							}
						},
						{
							name: 'Coin 3 inside the fort',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow');
							}
						},
						{
							name: 'Coin 4 inside the fort',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow');
							}
						},
						{
							name: 'Coin 5 inside the fort',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow');
							}
						},
						{
							name: 'Coin 6 inside the fort',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow');
							}
						},
						{
							name: 'Item in the fort',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow');
							}
						},
						{
							name: 'Item that Kammy spawns',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow') && flags.partner('parakarry');
							}
						},
						{
							name: 'Chest at the end of the room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bow') && flags.partner('parakarry');
							}
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
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.panels();
							}
						},
						{
							name: 'Invisible block west of the station',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
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
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
						},
						{
							name: 'On top of the wheel',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
						},
						{
							name: 'Left ? block in the middle of the room',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
						},
						{
							name: 'Middle invisible block in the middle of the room',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
						},
						{
							name: 'Right ? block in the middle of the room',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
						},
						{
							name: 'Hidden block near the west exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
						},
						{
							name: 'Super block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('parakarry');
							}
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
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake;
							}
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
									(save.data.items.boots >= 3 || (flags.toybox_jack_in_a_box() && flags.partner('kooper')))
								);
							}
						},
						{
							name: 'Invisible ? block near the item on top of the brick block',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bombette');
							}
						},
						{
							name: '? block near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bombette');
							}
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
								return flags.toybox() && save.data.items.toy_train && save.data.items.cake && flags.partner('bombette') && flags.partner('watt');
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
							}
						},
						{
							name: 'Item 2 on the spinning flower',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							}
						},
						{
							name: 'Coconut tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							}
						},
						{
							name: 'Item behind the bush north of the screen',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island();
							}
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
							}
						},
						{
							name: 'Coconut tree 2',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							}
						},
						{
							name: 'Coconut tree 3',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							}
						},
						{
							name: 'Coconut tree 4',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							}
						},
						{
							name: 'Coconut tree 5',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							}
						},
						{
							name: 'Coconut tree near the east exit (item 1)',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							}
						},
						{
							name: 'Coconut tree near the east exit (item 2)',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							}
						},
						{
							name: 'West invisible block by the bell plant',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_coin_blocks();
							}
						},
						{
							name: 'East invisible block by the bell plant',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_coin_blocks();
							}
						},
						{
							name: 'Item 1 on the spinning flower',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							}
						},
						{
							name: 'Item 2 on the spinning flower',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							}
						},
						{
							name: 'Item on the rock in the middle of the screen',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							}
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
							}
						},
						{
							name: 'Talk to the Yoshi Chief',
							tooltip: 'After saving all the kids',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('watt') && flags.partner('sushie') && save.data.items.hammer >= 1;
							}
						},
						{
							name: 'West coconut tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							}
						},
						{
							name: 'East coconut tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							}
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
						// 6 shop items
						{
							name: 'Shop item 1',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							}
						},
						{
							name: 'Shop item 2',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							}
						},
						{
							name: 'Shop item 3',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							}
						},
						{
							name: 'Shop item 4',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							}
						},
						{
							name: 'Shop item 5',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							}
						},
						{
							name: 'Shop item 6',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							}
						},
						{
							name: 'Red Yoshi Kid',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.lava_lava_island() && flags.deliver_letters() && save.data.items.letters.red_yoshi_kid;
							}
						},
						{
							name: 'Give a Tayce T. item to the Yellow Adult Yoshi',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.toad_town() && flags.partner('watt') && flags.partner('sushie') && save.data.items.hammer >= 1;
							}
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
									save.data.items.hammer >= 1 &&
									save.data.items.volcano_vase &&
									save.data.items.misstar
								);
							}
						},
						{
							name: 'Coconut tree near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							}
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
							}
						},
						{
							name: misstar_dungeon_shuffle_name,
							icon: misstar_dungeon_shuffle_icon,
							exists: () => {
								return save.data.configs.randomizer.shuffle_dungeon_entrances;
							},
							available: () => {
								return flags.lava_lava_island_jungle_behind_raven_statue() && save.data.items.boots >= 1;
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
							}
						},
						{
							name: 'Coin 1 underwater',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie');
							}
						},
						{
							name: 'Coin 2 underwater',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie');
							}
						},
						{
							name: 'Coin 3 underwater',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie');
							}
						},
						{
							name: 'Super block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie') && flags.jump_coin_blocks();
							}
						},
						{
							name: 'Tree near the north exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie') && flags.trees();
							}
						},
						{
							name: 'Tree near the east exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie') && flags.trees();
							}
						},
						{
							name: 'Bush near the north exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie');
							}
						},
						{
							name: 'Bush near the south exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.jump_ledges();
							}
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
							}
						},
						{
							name: 'Tree near the east exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.trees();
							}
						},
						{
							name: 'Bush near the south exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island();
							}
						},
						{
							name: 'South-west bush',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && save.data.items.hammer >= 1 && flags.partner('sushie');
							}
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
							}
						},
						{
							name: 'Item on the top right island',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie');
							}
						},
						{
							name: 'Tree on the top right island',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie') && flags.trees();
							}
						},
						{
							name: 'Chest after saving Misstar',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island() && save.data.items.misstar;
							}
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
							}
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
							}
						},
						{
							name: 'Tree on the ledge',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie') && flags.jump_ledges() && flags.trees();
							}
						},
						{
							name: 'Item on the sucking flower',
							icon: '/images/checks/overworld_coins.webp',
							exists: () => {
								return save.data.configs.logic.overworld_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie') && flags.jump_ledges();
							}
						},
						{
							name: 'Bush near the south exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie');
							}
						},
						{
							name: 'Bush near the east exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie');
							}
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
								return flags.lava_lava_island() && flags.partner('sushie');
							}
						},
						{
							name: 'Tree near the raven statue',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island() && flags.partner('sushie') && save.data.items.hammer >= 1;
							}
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
							}
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
							}
						},
						{
							name: 'Tree vine near the bell plant',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island_jungle_behind_raven_statue() && save.data.items.boots >= 1;
							}
						},
						{
							name: 'Tree near bell plant',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island_jungle_behind_raven_statue() && flags.jump_ledges() && flags.trees();
							}
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
							}
						},
						{
							name: 'Invisible block near the first push block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island_jungle_behind_raven_statue() && flags.jump_coin_blocks() && flags.jump_ledges();
							}
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
							}
						},
						{
							name: 'Tree vine far east',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island_jungle_behind_raven_statue() && save.data.items.boots >= 1;
							}
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
							}
						},
						{
							name: 'Tree near the east exit',
							icon: '/images/checks/foliage_coins.webp',
							exists: () => {
								return save.data.configs.logic.foliage_coins;
							},
							available: () => {
								return flags.lava_lava_island_jungle_behind_raven_statue() && save.data.items.boots >= 1 && flags.trees();
							}
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
							}
						},
						{
							name: 'Talk to Raphael the Raven',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.lava_lava_island_jungle_behind_raven_statue() && save.data.items.boots >= 1;
							}
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
							}
						},
						{
							name: '? block 1',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.mt_lavalava() && flags.jump_coin_blocks();
							}
						},
						{
							name: '? block 2',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.mt_lavalava() && flags.jump_coin_blocks();
							}
						},
						{
							name: '? block 3',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.mt_lavalava() && flags.jump_coin_blocks();
							}
						},
						{
							name: '? block 4',
							icon: '/images/checks/coin_blocks.webp',
							exists: () => {
								return save.data.configs.logic.coin_blocks;
							},
							available: () => {
								return flags.mt_lavalava() && flags.jump_coin_blocks();
							}
						},
						{
							name: 'Item on platform halfway down then second zipline',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_lavalava() && save.data.items.boots >= 1;
							}
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
							}
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
							}
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
							}
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
							}
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
							}
						},
						{
							name: 'East side of the lower level',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.mt_lavalava() && flags.panels();
							}
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
							}
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
							}
						},
						{
							name: 'East ? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.mt_lavalava() && save.data.items.boots >= 1 && flags.ultra_blocks();
							}
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
							}
						},
						{
							name: 'Item in the vines near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields();
							}
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
							}
						},
						{
							name: 'Item in the grass',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && (save.data.items.bubble_berry || flags.partner('lakilester'));
							}
						},
						{
							name: 'Item on the ledge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && flags.jump_ledges() && (save.data.items.bubble_berry || flags.partner('lakilester'));
							}
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
							}
						},
						{
							name: 'Hidden block over the brick block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && flags.jump_ledges() && flags.jump_coin_blocks() && save.data.items.blue_berry;
							}
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
							}
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
							}
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
							}
						},
						{
							name: '2 items in the tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.red_berry && flags.trees();
							}
						},
						{
							name: 'Item in the middle vine',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.red_berry;
							}
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
							name: '2 items from Posie',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.red_berry;
							}
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
							}
						},
						{
							name: 'Ground pound the top of the ledge near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.boots >= 2 && flags.partner('lakilester');
							}
						},
						{
							name: 'Super block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.boots >= 2 && flags.partner('lakilester');
							}
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
							}
						},
						{
							name: 'Invisible block near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.boots >= 2 && flags.partner('lakilester');
							}
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
							}
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
							}
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
							name: '2 items in the tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && flags.trees();
							}
						},
						{
							name: 'South-west of the room',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.flower_fields() && flags.panels();
							}
						},
						{
							name: 'Talk to Petunia and defeat all the moles',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields();
							}
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
							}
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
							}
						},
						{
							name: '2 items in the tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.yellow_berry && (flags.partner('lakilester') || flags.partner('parakarry')) && flags.trees();
							}
						},
						{
							name: 'Item in the grass next of the tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.yellow_berry && (flags.partner('lakilester') || flags.partner('parakarry'));
							}
						},
						{
							name: 'Super block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.yellow_berry && (flags.partner('lakilester') || flags.partner('parakarry')) && flags.jump_ledges();
							}
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
							}
						},
						{
							name: '2 items in the tree',
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
							}
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
							}
						},
						{
							name: 'Near the east exit',
							icon: '/images/checks/panels_randomized.webp',
							exists: () => {
								return save.data.configs.logic.panels;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.yellow_berry && (flags.partner('lakilester') || flags.partner('parakarry')) && flags.panels() && flags.jump_ledges();
							}
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
							}
						},
						{
							name: 'Item in the tree',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.flower_fields() && save.data.items.yellow_berry && (flags.partner('lakilester') || flags.partner('parakarry')) && flags.jump_ledges() && flags.trees();
							}
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
							}
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
							}
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
							}
						},
						{
							name: 'Mayor penguin',
							icon: '/images/checks/letters_randomized.webp',
							exists: () => {
								return save.data.configs.logic.letters_randomized;
							},
							available: () => {
								return flags.shiver_city() && flags.deliver_letters() && save.data.items.letters.mayor_penguin;
							}
						},
						{
							name: 'Talk to the mayor after having met Merle',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.leave_shiver_city();
							}
						},
						{
							name: 'Chest in the middle house',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.shiver_city() && save.data.items.boots >= 1;
							}
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
							}
						},
						{
							name: 'Shop item 2',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.shiver_city();
							}
						},
						{
							name: 'Shop item 3',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.shiver_city();
							}
						},
						{
							name: 'Shop item 4',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.shiver_city();
							}
						},
						{
							name: 'Shop item 5',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.shiver_city();
							}
						},
						{
							name: 'Shop item 6',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.shiver_city();
							}
						},
						{
							name: 'Item in the inn',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.shiver_city();
							}
						},
						{
							name: '5 items in the inn after giving the Scarf and Bucket to the snowman',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.leave_shiver_city() && save.data.items.scarf && save.data.items.bucket;
							}
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
							}
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
							}
						},
						{
							name: 'Hit the left pine tree 4 times',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.leave_shiver_city() && flags.trees();
							}
						},
						{
							name: 'Item behind the pine tree near the east exit',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.leave_shiver_city();
							}
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
							}
						},
						{
							name: 'Invisible block near Monstar fight',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.leave_shiver_city() && flags.jump_coin_blocks();
							}
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
							}
						},
						{
							name: 'Talk to Merle',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.leave_shiver_city() && flags.jump_ledges();
							}
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
							}
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
							}
						},
						{
							name: 'Super block',
							icon: '/images/checks/super_blocks.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized || save.data.configs.tracker.always_show_super_blocks;
							},
							available: () => {
								return flags.shiver_mountain_tunnel();
							}
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
							name: 'East pillar',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.shiver_mountain_tunnel();
							}
						},
						{
							name: 'Center pillar',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.shiver_mountain_tunnel();
							}
						},
						{
							name: 'West pillar',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.shiver_mountain_tunnel();
							}
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
							}
						},
						{
							name: 'Item on the ledge when falling down after the second sets of stairs',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.shiver_mountain_tunnel() && save.data.items.star_stone;
							}
						},
						{
							name: kalmar_dungeon_shuffle_name,
							icon: kalmar_dungeon_shuffle_icon,
							exists: () => {
								return save.data.configs.randomizer.shuffle_dungeon_entrances;
							},
							available: () => {
								return flags.shiver_mountain_tunnel() && save.data.items.star_stone;
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
								return flags.shiver_mountain_tunnel() && save.data.items.bombette;
							}
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
								return flags.crystal_palace() && (save.data.items.red_key || (save.data.items.blue_key && save.data.items.boots >= 2));
							}
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
							}
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
								return flags.crystal_palace() && (save.data.items.red_key || save.data.items.blue_key) && save.data.items.boots >= 2 && flags.partner('bombette');
							}
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
								return flags.crystal_palace() && (save.data.items.red_key || (save.data.items.blue_key && flags.partner('bombette'))) && save.data.items.boots >= 2;
							}
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
								return flags.crystal_palace() && (save.data.items.red_key || (save.data.items.blue_key && flags.partner('bombette'))) && save.data.items.boots >= 2;
							}
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
							}
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
								return flags.crystal_palace() && save.data.items.red_key && save.data.items.boots >= 2 && flags.partner('bombette');
							}
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
							name: 'Block south of the mirror',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.crystal_palace() && save.data.items.blue_key && save.data.items.boots >= 2 && flags.partner('bombette');
							}
						},
						{
							name: 'Block north of the mirror',
							icon: '/images/checks/multicoin_blocks_randomized.webp',
							exists: () => {
								return save.data.configs.logic.super_and_multicoin_blocks_randomized;
							},
							available: () => {
								return flags.crystal_palace() && save.data.items.blue_key && save.data.items.boots >= 2 && flags.partner('bombette');
							}
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
								return flags.crystal_palace() && save.data.items.red_key && save.data.items.boots >= 2 && flags.partner('bombette') && flags.panels();
							}
						},
						{
							name: '? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.crystal_palace() && save.data.items.red_key && save.data.items.boots >= 2 && flags.partner('bombette');
							}
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
								return flags.crystal_palace() && save.data.items.red_key && save.data.items.boots >= 2 && flags.partner('bombette');
							}
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
								return flags.crystal_palace() && save.data.items.red_key && save.data.items.boots >= 2 && flags.partner('bombette') && flags.panels();
							}
						},
						{
							name: '? block',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.crystal_palace() && save.data.items.red_key && save.data.items.boots >= 2 && flags.partner('bombette');
							}
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
								return flags.crystal_palace() && save.data.items.red_key && save.data.items.boots >= 2 && flags.partner('bombette');
							}
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
								return flags.crystal_palace() && save.data.items.red_key && save.data.items.boots >= 2 && flags.partner('bombette') && save.data.items.palace_key;
							}
						}
					]
				}
			}
		},
		star_haven: {
			name: 'Star Haven',
			exists: () => {
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
							}
						},
						{
							name: 'Shop item 2',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.star_haven();
							}
						},
						{
							name: 'Shop item 3',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.star_haven();
							}
						},
						{
							name: 'Shop item 4',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.star_haven();
							}
						},
						{
							name: 'Shop item 5',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.star_haven();
							}
						},
						{
							name: 'Shop item 6',
							icon: '/images/checks/shopsanity.webp',
							exists: () => {
								return save.data.configs.logic.shopsanity;
							},
							available: () => {
								return flags.star_haven();
							}
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
				return true;
			},
			maps: {
				diaper_garage: {
					name: 'Diaper Garage',
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
							}
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
							}
						},
						{
							name: 'Bottom right crate',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.west_bowser_castle() && save.data.items.castle_key >= 1 && save.data.items.boots >= 2;
							}
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
							}
						},
						{
							name: '? block',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.west_bowser_castle() && save.data.items.castle_key >= 1 && flags.partner('lakilester') && flags.jump_coin_blocks();
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
						},
						{
							name: '? block',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.east_bowser_castle();
							}
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
							}
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
							}
						},
						{
							name: '? block east of the door',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.east_bowser_castle();
							}
						},
						{
							name: '? block near the bottom of the stairs',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.east_bowser_castle();
							}
						},
						{
							name: 'Item on the ledge of the stairs',
							icon: null,
							exists: () => {
								return !save.data.configs.logic.fast_bowser_castle;
							},
							available: () => {
								return flags.east_bowser_castle();
							}
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
							}
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
							}
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
							}
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
							}
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
							}
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
							}
						},
						{
							name: 'On the ledge',
							icon: null,
							exists: () => {
								return true;
							},
							available: () => {
								return flags.peach_castle() & (save.data.items.boots >= 1);
							}
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
							}
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
								if (check.exists() && check.available() && save.data.checks[mapCategoryToCheckKey][mapToCheckKey].includes(checkIndex)) {
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
								if (check.exists() && check.available() && save.data.checks[mapCategoryKey][mapToCheckKey].includes(checkIndex)) {
									totalChecks++;
								}
							});
						}
					}
				} else {
					if (save.data.checks[mapCategoryKey] !== undefined && save.data.checks[mapCategoryKey][mapKey] !== undefined) {
						for (const [checkKey, check] of Object.entries(checks[mapCategoryKey][mapKey])) {
							console.log(checkKey, check);
							checks[mapCategoryKey]['maps'][mapKey].checks.forEach((check, checkIndex) => {
								if (check.exists() && check.available() && save.data.checks[mapCategoryKey][mapKey].includes(checkIndex)) {
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

	const getTotalChecksOnMap = (mapCategoryKey = null, mapKey = null) => {
		let totalChecks = 0;

		if (mapCategoryKey === null) {
			for (const [mapCategoryToCheckKey, mapCategory] of Object.entries(checks)) {
				if (checks[mapCategoryToCheckKey].exists()) {
					for (const [mapToCheckKey, mapToCheck] of Object.entries(mapCategory.maps)) {
						// console.log(mapCategoryToCheckKey, mapToCheckKey, mapToCheck.checks);
						for (const [checkKey, check] of Object.entries(mapToCheck.checks)) {
							if (check.exists()) {
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
							if (check.exists()) {
								totalChecks++;
							}
						}
					}
				} else {
					for (const [checkKey, check] of Object.entries(checks[mapCategoryKey].maps[mapKey].checks)) {
						if (check.exists()) {
							totalChecks++;
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
							if (check.exists() && check.available()) {
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
							if (check.exists() && check.available()) {
								totalChecks++;
							}
						}
					}
				} else {
					for (const [checkKey, check] of Object.entries(checks[mapCategoryKey].maps[mapKey].checks)) {
						if (check.exists() && check.available()) {
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
		getTotalCheckedChecksOnMap: computed(() => getTotalCheckedChecksOnMap),
		getTotalAvailableCheckedChecksOnMap: computed(() => getTotalAvailableCheckedChecksOnMap),
		getTotalChecksOnMap: computed(() => getTotalChecksOnMap),
		getTotalAvailableChecksOnMap: computed(() => getTotalAvailableChecksOnMap)
	};
});
