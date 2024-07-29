import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useTrackerStore = defineStore('tracker', () => {
	const startingLocations = {
		random: 4294967295,
		goomba_village: 257,
		toad_town: 65796,
		dry_dry_outpost: 590080,
		yoshi_village: 1114882
	};

	const items = reactive({
		stars: {
			eldstar: {
				name: 'Eldstar',
				enabled: true,
				max: 1
			},
			mamar: {
				name: 'Mamar',
				enabled: true,
				max: 1
			},
			skolar: {
				name: 'Skolar',
				enabled: true,
				max: 1
			},
			muskular: {
				name: 'Muskular',
				enabled: true,
				max: 1
			},
			misstar: {
				name: 'Misstar',
				enabled: true,
				max: 1
			},
			klevar: {
				name: 'Klevar',
				enabled: true,
				max: 1
			},
			kalmar: {
				name: 'Kalmar',
				enabled: true,
				max: 1
			},
			starrod: {
				name: 'Star Rod',
				enabled: true,
				max: 1
			},
			power_stars: {
				name: 'Power Stars',
				enabled: false,
				max: 120,
				ap: [
					8112000476, 8112000477, 8112000478, 8112000479, 8112000480, 8112000481, 8112000482, 8112000483, 8112000484, 8112000485, 8112000486, 8112000487, 8112000488, 8112000489, 8112000490,
					8112000491, 8112000492, 8112000493, 8112000494, 8112000495, 8112000496, 8112000497, 8112000498, 8112000499, 8112000500, 8112000501, 8112000502, 8112000503, 8112000504, 8112000505,
					8112000506, 8112000507, 8112000508, 8112000509, 8112000510, 8112000511, 8112000512, 8112000513, 8112000514, 8112000515, 8112000516, 8112000517, 8112000518, 8112000519, 8112000520,
					8112000521, 8112000522, 8112000523, 8112000524, 8112000525, 8112000526, 8112000527, 8112000528, 8112000529, 8112000530, 8112000531, 8112000532, 8112000533, 8112000534, 8112000535,
					8112000536, 8112000537, 8112000538, 8112000539, 8112000540, 8112000541, 8112000542, 8112000543, 8112000544, 8112000545, 8112000546, 8112000547, 8112000548, 8112000549, 8112000550,
					8112000551, 8112000552, 8112000553, 8112000554, 8112000555, 8112000556, 8112000557, 8112000558, 8112000559, 8112000560, 8112000561, 8112000562, 8112000563, 8112000564, 8112000565,
					8112000566, 8112000567, 8112000568, 8112000569, 8112000570, 8112000571, 8112000572, 8112000573, 8112000574, 8112000575, 8112000576, 8112000577, 8112000578, 8112000579, 8112000580,
					8112000581, 8112000582, 8112000583, 8112000584, 8112000585, 8112000586, 8112000587, 8112000588, 8112000589, 8112000590, 8112000591, 8112000592, 8112000593, 8112000594, 8112000595,
					8112000596, 8112000597, 8112000598, 8112000599, 8112000600, 8112000601, 8112000602, 8112000603
				]
			}
		},
		partners: {
			goombario: {
				name: 'Goombario',
				enabled: true,
				max: 3,
				ap: [8112000752],
				ap_rank: [8112000734, 8112000743]
			},
			kooper: {
				name: 'Kooper',
				enabled: true,
				max: 3,
				ap: [8112000753],
				ap_rank: [8112000735, 8112000744]
			},
			bombette: {
				name: 'Bombette',
				enabled: true,
				max: 3,
				ap: [8112000754],
				ap_rank: [8112000736, 8112000745]
			},
			parakarry: {
				name: 'Parakarry',
				enabled: true,
				max: 3,
				ap: [8112000755],
				ap_rank: [8112000737, 8112000746]
			},
			bow: {
				name: 'Bow',
				enabled: true,
				max: 3,
				ap: [8112000760],
				ap_rank: [8112000742, 8112000751]
			},
			watt: {
				name: 'Watt',
				enabled: true,
				max: 3,
				ap: [8112000757],
				ap_rank: [8112000739, 8112000748]
			},
			sushie: {
				name: 'Sushie',
				enabled: true,
				max: 3,
				ap: [8112000758],
				ap_rank: [8112000740, 8112000749]
			},
			lakilester: {
				name: 'Lakilester',
				enabled: true,
				max: 3,
				ap: [8112000759],
				ap_rank: [8112000741, 8112000750]
			},
			ultra_stone: {
				name: 'Ultra Stone',
				enabled: true,
				max: 3,
				ap: [8112000015]
			}
		},
		equipments: {
			boots: {
				name: ['Jumpless', 'Boots', 'Super Boots', 'Ultra Boots'],
				enabled: true,
				max: 3,
				ap: [8112000707, 8112000708, 8112000709]
			},
			hammer: {
				name: ['Hammerless', 'Hammer', 'Super Hammer', 'Ultra Hammer'],
				enabled: true,
				max: 3,
				ap: [8112000710, 8112000711, 8112000712]
			}
		},
		items: {
			prologue: {
				dolly: {
					name: 'Dolly',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000086]
				}
			},
			chapter1: {
				fortress_key: {
					name: 'Fortress Key',
					enabled: true,
					max: 4,
					required: true,
					ap: [8112000365, 8112000366, 8112000367, 8112000368, 8112000016]
				},
				kooper_shell: {
					name: 'Kooper Shell',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000025]
				}
			},
			chapter2: {
				parakarry_letters: {
					name: "Parakarry's Letters",
					enabled: true,
					max: 3,
					required: false,
					ap: [
						8112000054, 8112000055, 8112000056, 8112000057, 8112000058, 8112000059, 8112000060, 8112000061, 8112000062, 8112000064, 8112000065, 8112000069, 8112000070, 8112000071,
						8112000072, 8112000073, 8112000074, 8112000075, 8112000076, 8112000078, 8112000079, 8112000080, 8112000081, 8112000082, 8112000084
					]
				},
				pulse_stone: {
					name: 'Pulse Stone',
					enabled: true,
					max: 1,
					required: true,
					ap: [8112000018]
				},
				pyramid_stone: {
					name: 'Pyramid Stone',
					enabled: true,
					max: 1,
					required: true,
					ap: [8112000022]
				},
				diamond_stone: {
					name: 'Diamond Stone',
					enabled: true,
					max: 1,
					required: true,
					ap: [8112000023]
				},
				lunar_stone: {
					name: 'Lunar Stone',
					enabled: true,
					max: 1,
					required: true,
					ap: [8112000021]
				},
				ruins_key: {
					name: 'Ruins Key',
					enabled: true,
					max: 4,
					required: true,
					ap: [8112000369, 8112000370, 8112000371, 8112000372, 8112000017]
				},
				artifact: {
					name: 'Artifact',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000083]
				}
			},
			chapter3: {
				forest_pass: {
					name: 'Forest Pass',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000027]
				},
				record: {
					name: 'Record',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000034]
				},
				weight: {
					name: 'Weight',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000028]
				},
				boo_portrait: {
					name: "Boo's Portrait",
					enabled: true,
					max: 1,
					required: true,
					ap: [8112000029]
				},
				tubba_castle_key: {
					name: 'Tubba Castle Key',
					enabled: true,
					max: 3,
					required: true,
					ap: [8112000373, 8112000374, 8112000375, 8112000019]
				}
			},
			chapter4: {
				toy_train: {
					name: 'Toy Train',
					enabled: true,
					max: 1,
					required: true,
					ap: [8112000033]
				},
				calculator: {
					name: 'Calculator',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000048]
				},
				frying_pan: {
					name: 'Frying Pan',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000035]
				},
				mailbag: {
					name: 'Mailbag',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000105]
				},
				dictionary: {
					name: 'Dictionary',
					enabled: true,
					max: 1,
					required: true,
					ap: [8112000036]
				},
				cake: {
					name: 'Cake (Cook a Cake Mix)',
					enabled: true,
					max: 1,
					required: true,
					ap: [8112000193, 8112000170, 8112000698]
				},
				cookbook: {
					name: 'Cookbook',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000041]
				},
				mystery_note: {
					name: 'Mystery Note',
					enabled: true,
					max: 1,
					required: true,
					ap: [8112000037]
				},
				anti_guy: {
					name: 'Anti Guy (Cake Mix + Lemon for Lemon Candy available)',
					enabled: true,
					max: 1,
					required: true,
					ap: [8112000208]
				}
			},
			chapter5: {
				jade_raven: {
					name: 'Jade Raven',
					enabled: true,
					max: 1,
					required: true,
					ap: [8112000042]
				},
				volcano_vase: {
					name: 'Volcano Vase',
					enabled: true,
					max: 1,
					required: true,
					ap: [8112000091]
				}
			},
			chapter6: {
				magical_seeds: {
					name: 'Magical Seeds',
					enabled: true,
					max: 4,
					required: true,
					ap: [8112000043]
				},
				// pink_magical_seed: {
				// 	name: 'Red Magical Seed',
				// 	enabled: true,
				// 	max: 1,
				// 	required: true,
				// 	ap: [8112000043]
				// },
				// purple_magical_seed: {
				// 	name: 'Purple Magical Seed',
				// 	enabled: true,
				// 	max: 1,
				// 	required: true,
				// 	ap: [8112000044]
				// },
				// green_magical_seed: {
				// 	name: 'Blue Magical Seed',
				// 	enabled: true,
				// 	max: 1,
				// 	required: true,
				// 	ap: [8112000046]
				// },
				// yellow_magical_seed: {
				// 	name: 'Yellow Magical Seed',
				// 	enabled: true,
				// 	max: 1,
				// 	required: true,
				// 	ap: [8112000045]
				// },
				red_berry: {
					name: 'Red Berry',
					enabled: true,
					max: 1,
					required: false,
					initial: 'R',
					ap: [8112000701, 8112000702]
				},
				yellow_berry: {
					name: 'Yellow Berry',
					enabled: true,
					max: 1,
					required: false,
					initial: 'Y',
					ap: [8112000703, 8112000704]
				},
				blue_berry: {
					name: 'Blue Berry',
					enabled: true,
					max: 2,
					required: false,
					initial: 'B',
					ap: [8112000699, 8112000699, 8112000700, 8112000700]
				},
				bubble_berry: {
					name: 'Bubble Berry',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000705, 8112000706]
				},
				crystal_berry: {
					name: 'Crystal Berry',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000030]
				},
				water_stone: {
					name: 'Water Stone',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000087]
				},
				magical_bean: {
					name: 'Magical Bean',
					enabled: true,
					max: 1,
					required: true,
					ap: [8112000088]
				},
				fertile_soil: {
					name: 'Fertile Soil',
					enabled: true,
					max: 1,
					required: true,
					ap: [8112000089]
				},
				miracle_water: {
					name: 'Miracle Water',
					enabled: true,
					max: 1,
					required: true,
					ap: [8112000090]
				}
			},
			chapter7: {
				warehouse_key: {
					name: 'Warehouse Key',
					enabled: true,
					max: 1,
					required: true,
					initial: 'W',
					ap: [8112000121]
				},
				scarf: {
					name: 'Scarf',
					enabled: true,
					max: 1,
					required: true,
					ap: [8112000050]
				},
				bucket: {
					name: 'Bucket',
					enabled: true,
					max: 1,
					required: true,
					ap: [8112000049]
				},
				star_stone: {
					name: 'Star Stone',
					enabled: true,
					max: 1,
					required: true,
					ap: [8112000108]
				},
				red_key: {
					name: 'Red Key',
					enabled: true,
					max: 1,
					required: true,
					initial: 'R',
					ap: [8112000051]
				},
				blue_key: {
					name: 'Blue Key',
					enabled: true,
					max: 1,
					required: false,
					initial: 'B',
					ap: [8112000052]
				},
				palace_key: {
					name: 'Palace Key',
					enabled: true,
					max: 1,
					required: true,
					ap: [8112000020]
				}
			},
			chapter8: {
				prison_key: {
					name: 'Prison Key',
					enabled: true,
					max: 2,
					required: true,
					ap: [8112000381, 8112000382]
				},
				castle_key: {
					name: "Bowser's Castle Key",
					enabled: true,
					max: 5,
					required: true,
					ap: [8112000376, 8112000377, 8112000378, 8112000379, 8112000380]
				}
			},
			other: {
				lyrics: {
					name: 'Lyrics',
					enabled: true,
					max: 1,
					required: false,
					initial: 'L',
					ap: [8112000103]
				},
				melody: {
					name: 'Melody',
					enabled: true,
					max: 1,
					required: false,
					initial: 'M',
					ap: [8112000104]
				},
				odd_key: {
					name: 'Odd Key',
					enabled: true,
					max: 1,
					required: false,
					initial: 'O',
					ap: [8112000107]
				},
				storeroom_key: {
					name: 'Storeroom Key',
					enabled: true,
					max: 1,
					required: false,
					initial: 'S',
					ap: [8112000032]
				}
			}
		},
		letters: {
			prologue: {
				goompa: {
					name: 'Goompa',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000055]
				},
				goompapa: {
					name: 'Goompapa',
					enabled: true,
					max: 2,
					required: false,
					ap: [8112000064, 8112000082]
				}
			},
			toad_town: {
				merlon: {
					name: 'Merlon',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000054]
				},
				merlow: {
					name: 'Merlow',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000059]
				},
				muss_t: {
					name: 'Muss T.',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000070]
				},
				fice_t: {
					name: 'Fice T.',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000060]
				},
				russ_t: {
					name: 'Russ T.',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000057]
				},
				minh_t: {
					name: 'Minh T.',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000062]
				},
				miss_t: {
					name: 'Miss T.',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000075]
				},
				fishmael: {
					name: 'Fishmael',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000072]
				},
				dane_t: {
					name: 'Dane T.',
					enabled: true,
					max: 2,
					required: false,
					ap: [8112000078, 8112000080]
				}
			},
			chapter1: {
				kolorado: {
					name: 'Kolorado',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000084]
				},
				mort_t: {
					name: 'Mort T.',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000056]
				},
				koover: {
					name: 'Koover',
					enabled: true,
					max: 2,
					required: false,
					ap: [8112000071, 8112000073]
				}
			},
			chapter2: {
				nomadimouse: {
					name: 'Nomadimouse',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000061]
				},
				little_mouser: {
					name: 'Little Mouser (Dry Dry Shop)',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000076]
				},
				mr_e: {
					name: 'Mr. E',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000074]
				}
			},
			chapter3: {
				igor: {
					name: 'Igor',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000065]
				},
				franky: {
					name: 'Franky',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000069]
				}
			},
			chapter6: {
				red_yoshi_kid: {
					name: 'Red Yoshi Kid',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000079]
				}
			},
			chapter7: {
				mayor_penguin: {
					name: 'Mayor Penguin',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000058]
				},
				frost_t: {
					name: 'Frost T.',
					enabled: true,
					max: 1,
					required: false,
					ap: [8112000081]
				}
			}
		},
		misc: {
			chuck_quizmo: {
				name: 'Chuck Quizmo',
				enabled: true,
				max: 16,
				required: true
			},
			star_pieces: {
				name: 'Star Pieces',
				enabled: true,
				max: 96,
				required: true,
				ap: [8112000348, 8112000471, 8112000471, 8112000471]
			},
			rip_cheato: {
				name: 'Rip Cheato',
				enabled: true,
				max: 11,
				required: false
			}
		},
		koopa_koot_favors: {
			koopa_legends: {
				name: 'Koopa Legends',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000110]
			},
			sleepy_sheep: {
				name: 'Sleepy Sheep (Red/Yellow/Blue Berry + Strange Leaf)',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000143]
			},
			tape: {
				name: 'Tape',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000092]
			},
			koopa_tea: {
				name: 'Koopa Tea (Koopa Leaf)',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000195]
			},
			luigi_autograph: {
				name: "Luigi's Autograph",
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000111]
			},
			empty_wallet: {
				name: 'Empty Wallet',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000112]
			},
			tasty_tonic: {
				name: 'Tasty Tonic (Red/Yellow/Blue Berry + Honey Syrup)',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000137]
			},
			crystal_ball: {
				name: 'Crystal Ball',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000039]
			},
			merluvlee_autograph: {
				name: "Merluvlee's Autograph",
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000113]
			},
			life_shroom: {
				name: 'Life Shroom (Super Shroom or better + Koopa Leaf/Goomnut/Strange Leaf)',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000149]
			},
			nutty_cake: {
				name: 'Nutty Cake (Goomnut)',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000214]
			},
			old_photo: {
				name: 'Old Photo',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000115]
			},
			koopasta: {
				name: 'Koopasta (Dried Pasta + Koopa Leaf)',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000181]
			},
			glasses: {
				name: 'Glasses',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000116]
			},
			lime: {
				name: 'Lime',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000157]
			},
			kooky_cookie: {
				name: 'Kooky Cookie (Cake Mix + Koopa Leaf/Stinky Herb/Maple Syrup)',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000211]
			},
			package: {
				name: 'Package',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000118]
			},
			coconut: {
				name: 'Coconut',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000172]
			},
			red_jar: {
				name: 'Red Jar',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000119]
			}
		},
		trading_event_toad: {
			koopa_leaf: {
				name: 'Koopa Leaf',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000166]
			},
			coconut: {
				name: 'Coconut',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000172]
			},
			nutty_cake: {
				name: 'Nutty Cake (Goomnut)',
				enabled: true,
				max: 1,
				required: false,
				ap: [8112000214]
			}
		}
	});

	//Types = switch, select, number
	const configs = reactive({
		randomizer: {
			starting_location: {
				enabled: true,
				type: 'select',
				options: [
					{
						value: startingLocations.random,
						text: 'Select a location for logic'
					},
					{
						value: startingLocations.goomba_village,
						text: 'Goomba Village'
					},
					{
						value: startingLocations.toad_town,
						text: 'Toad Town'
					},
					{
						value: startingLocations.dry_dry_outpost,
						text: 'Dry Dry Outpost'
					},
					{
						value: startingLocations.yoshi_village,
						text: 'Yoshi Village'
					}
				]
			},
			// required_star_spirits: {
			// 	enabled: true,
			// 	type: 'number',
			// 	min: 0,
			// 	max: 7
			// },
			prologue_open: {
				enabled: true,
				type: 'switch'
			},
			mt_rugged_open: {
				enabled: true,
				type: 'switch'
			},
			forever_forest_open: {
				enabled: true,
				type: 'switch'
			},
			toybox_open: {
				enabled: true,
				type: 'switch'
			},
			whale_open: {
				enabled: true,
				type: 'switch'
			},
			blue_house_open: {
				enabled: true,
				type: 'switch'
			},
			chapter_7_bridge_open: {
				enabled: true,
				type: 'switch'
			},
			gear_shuffle: {
				enabled: true,
				type: 'select',
				options: [
					{
						value: 'vanilla',
						text: 'Vanilla'
					},
					{
						value: 'vgs',
						text: 'Gear Location Shuffle'
					},
					{
						value: 'full_shuffle',
						text: 'Full Shuffle'
					}
				]
			},
			shuffle_dungeon_entrances: {
				enabled: true,
				type: 'switch'
			},
			magical_seed_required: {
				enabled: true,
				type: 'number',
				min: 1,
				max: 4
			},
			star_hunt_enabled: {
				enabled: true,
				type: 'switch'
			},
			star_hunt_star_count: {
				enabled: false,
				type: 'number',
				min: 1,
				max: 120
			}
			// star_hunt_ends_game: {
			// 	enabled: false,
			// 	type: 'switch'
			// }
		},
		logic: {
			fast_bowser_castle: {
				enabled: true,
				type: 'switch'
			},
			shopsanity: {
				enabled: true,
				type: 'switch'
			},
			rowf_shop: {
				enabled: false,
				type: 'switch'
			},
			merlow: {
				enabled: false,
				type: 'switch'
			},
			merlow_rewards_pricing: {
				enabled: false,
				type: 'select',
				options: [
					{
						value: 'normal',
						text: 'Normal'
					},
					{
						value: 'cheap',
						text: 'Cheap'
					}
				]
			},
			// merlow_reward_cost_1: {
			// 	enabled: false,
			// 	type: 'number',
			// 	min: 1,
			// 	max: 120
			// },
			// merlow_reward_cost_2: {
			// 	enabled: false,
			// 	type: 'number',
			// 	min: 1,
			// 	max: 120
			// },
			// merlow_reward_cost_3: {
			// 	enabled: false,
			// 	type: 'number',
			// 	min: 1,
			// 	max: 120
			// },
			// merlow_reward_cost_4: {
			// 	enabled: false,
			// 	type: 'number',
			// 	min: 1,
			// 	max: 120
			// },
			// merlow_reward_cost_5: {
			// 	enabled: false,
			// 	type: 'number',
			// 	min: 1,
			// 	max: 120
			// },
			// merlow_reward_cost_6: {
			// 	enabled: false,
			// 	type: 'number',
			// 	min: 1,
			// 	max: 120
			// },
			rip_cheato: {
				enabled: true,
				type: 'number',
				min: 0,
				max: 11
			},
			panels: {
				enabled: true,
				type: 'switch'
			},
			overworld_coins: {
				enabled: true,
				type: 'switch'
			},
			coin_blocks: {
				enabled: true,
				type: 'switch'
			},
			super_and_multicoin_blocks_randomized: {
				enabled: true,
				type: 'switch'
			},
			foliage_coins: {
				enabled: true,
				type: 'switch'
			},
			partners_always_usable: {
				enabled: true,
				type: 'switch'
			},
			letters_randomized: {
				enabled: true,
				type: 'switch'
			},
			koopa_koot: {
				enabled: true,
				type: 'switch'
			},
			koopa_koot_coins: {
				enabled: true,
				type: 'switch'
			},
			dojo_randomized: {
				enabled: true,
				type: 'switch'
			},
			trading_event_randomized: {
				enabled: true,
				type: 'switch'
			},
			limit_chapter_logic: {
				enabled: true,
				type: 'switch'
			},
			cook_without_frying_pan: {
				enabled: true,
				type: 'switch'
			}
		},
		tracker: {
			deactivate_layout_system: {
				tooltip: 'Deactivate the layout system completely.',
				enabled: true,
				type: 'switch'
			},
			no_layout_width: {
				tooltip: 'Changes the width of the tracker. Only works if the layout system is deactivated.',
				enabled: true,
				type: 'number'
			},
			map: {
				tooltip: 'Shows the map tracker.',
				enabled: true,
				type: 'switch'
			},
			map_text_size: {
				tooltip: 'Changes the size of the text on the map tracker only.',
				enabled: true,
				type: 'select',
				options: [
					{
						value: 'base',
						text: 'Default'
					},
					{
						value: 'sm',
						text: 'Smaller'
					},
					{
						value: 'xs',
						text: 'Way too small lol'
					}
				]
			},
			item_icon_size: {
				tooltip: 'Changes the size of the items icons.',
				enabled: true,
				type: 'select',
				options: [
					{
						value: 'sm',
						text: 'Smaller'
					},
					{
						value: 'md',
						text: 'Medium'
					},
					{
						value: 'lg',
						text: 'Large'
					},
					{
						value: 'xl',
						text: 'Extra large'
					},
					{
						value: '2xl',
						text: 'Mega large'
					}
				]
			},
			item_gap: {
				tooltip: 'Changes the gap between the items.',
				enabled: true,
				type: 'select',
				options: [
					{
						value: 0.5,
						text: 'Smallest'
					},
					{
						value: 1,
						text: 'Smaller'
					},
					{
						value: 1.5,
						text: 'Small'
					},
					{
						value: 2,
						text: 'Medium'
					},
					{
						value: 2.5,
						text: 'Large'
					},
					{
						value: 3,
						text: 'Larger'
					},
					{
						value: 3.5,
						text: 'Largest'
					}
				]
			},
			always_show_super_blocks: {
				tooltip: 'Always show super blocks, even if they are not in logic. It will count them as checks.',
				enabled: true,
				type: 'switch'
			},
			star_menu_enabled: {
				tooltip: 'Allows to choose the stars difficulty and dungeon shuffle progression in a popover menu instead of cycling through them.',
				enabled: true,
				type: 'switch'
			},
			compact_items: {
				tooltip: 'Shows all the items in the same widget. Cannot be enabled in the same time of the "Compact item per chapters" widget.',
				enabled: true,
				type: 'switch'
			},
			compact_item_background_hex_color: {
				tooltip: 'Changes the background color of the compact items widget.',
				enabled: true,
				type: 'text'
			},
			compact_item_show_letters: {
				tooltip: 'Show the letters in the compact items widget.',
				enabled: true,
				type: 'switch'
			},
			compact_item_show_favors: {
				tooltip: 'Show the Koopa Koot favors items in the compact items widget.',
				enabled: true,
				type: 'switch'
			},
			compact_item_show_trading_events: {
				tooltip: 'Show the Trading Event Toad items in the compact items widget.',
				enabled: true,
				type: 'switch'
			},
			compact_items_per_chapters: {
				tooltip: 'Shows the items in the same widget, but per chapters. Cannot be enabled in the same time of the "Compact items" widget.',
				enabled: true,
				type: 'switch'
			},
			competitive_mode: {
				tooltip: `Changes the tracker to be used only with the mouse.<br/>
				Left click cycles in the items with a max value (keys, letters, etc.);<br/>
				Right click adds a check mark to the items, ranks to the partners and difficulty progression to the stars;<br/>
				While maintaining the left click, right click on the stars to add the dungeon shuffle progression.`,
				enabled: true,
				type: 'switch'
			},
			missing_items_in_grayscale: {
				tooltip: 'Shows the unobtained items in grayscale instead of in opacity 50%.',
				enabled: true,
				type: 'switch'
			},
			deactivate_items_tooltips: {
				tooltip: 'Deactivates the tooltips of the items.',
				enabled: true,
				type: 'switch'
			},
			notes: {
				tooltip: 'Shows a widget to take notes.',
				enabled: true,
				type: 'switch'
			}
		}
	});

	return { startingLocations, items, configs };
});
