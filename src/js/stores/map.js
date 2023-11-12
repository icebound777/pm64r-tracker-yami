import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { useSaveStore } from './save';
import { useLogicStore } from './logic';

export const useMapStore = defineStore('map', () => {
	const save = useSaveStore();
	const logic = useLogicStore();

	const currentMapCategory = ref('prologue');
	const currentMap = ref(null);

	//Map rendering
	const getHighestXForMap = (mapCategoryKey) => {
		let highestX = 0;

		for (const [key, value] of Object.entries(logic.checks[mapCategoryKey].maps)) {
			if (value.x > highestX) {
				highestX = value.x;
			}
		}

		return highestX;
	};

	const getHighestYForMap = (mapCategoryKey) => {
		let highestY = 0;

		for (const [key, value] of Object.entries(logic.checks[mapCategoryKey].maps)) {
			if (value.y > highestY) {
				highestY = value.y;
			}
		}

		return highestY;
	};

	const getMapByCoordinates = (mapCategoryKey, x, y) => {
		let map = null;

		for (const [key, value] of Object.entries(logic.checks[mapCategoryKey].maps)) {
			if (value.x === x && value.y === y) {
				map = value;
				map.key = key;
			}
		}

		return map;
	};

	const getMapColorClasses = (mapCategoryKey, mapKey = null) => {
		//Map colors: Nothing: bg-slate-600 | Available: bg-green-800 hover:bg-green-700 | Unavailable: bg-red-900 hover:bg-red-800 | Selected: bg-sky-600

		if (mapKey == null) {
			if (currentMapCategory.value == mapCategoryKey) {
				return 'bg-sky-600 cursor-default';
			}

			if (!logic.getTotalChecksOnMap(mapCategoryKey) || logic.getTotalCheckedChecksOnMap(mapCategoryKey) >= logic.getTotalChecksOnMap(mapCategoryKey)) {
				return 'bg-slate-600 hover:bg-slate-500 cursor-pointer';
			}

			let available = false;

			for (const [mapToCheckKey, mapToCheckConfigs] of Object.entries(logic.checks[mapCategoryKey].maps)) {
				for (const [checkKey, check] of Object.entries(mapToCheckConfigs.checks)) {
					// console.log(
					// 	mapToCheckKey,
					// 	mapToCheckConfigs,
					// 	checkKey,
					// 	check
					// );
					if (
						check.exists() &&
						check.available() &&
						(save.data.checks[mapCategoryKey] == undefined ||
							save.data.checks[mapCategoryKey][mapToCheckKey] == undefined ||
							save.data.checks[mapCategoryKey][mapToCheckKey].find((v) => v == checkKey) == undefined)
					) {
						available = true;
						break;
					}
				}
			}

			// console.log(mapCategoryKey + ' FINAL AVAILABLE', available);

			if (available) {
				return 'bg-green-800 hover:bg-green-700 cursor-pointer';
			} else {
				return 'bg-red-900 hover:bg-red-800 cursor-pointer';
			}
		} else {
			if (logic.checks[mapCategoryKey].maps[mapKey].transparent !== undefined && logic.checks[mapCategoryKey].maps[mapKey].transparent) {
				return 'bg-transparent cursor-default';
			}

			if (currentMapCategory.value == mapCategoryKey && currentMap.value == mapKey) {
				return 'bg-sky-600 cursor-default';
			}

			if (!logic.getTotalChecksOnMap(mapCategoryKey, mapKey) || logic.getTotalCheckedChecksOnMap(mapCategoryKey, mapKey) >= logic.getTotalChecksOnMap(mapCategoryKey, mapKey)) {
				return 'bg-slate-600 hover:bg-slate-500 cursor-pointer';
			}

			let available = false;

			for (const [checkKey, check] of Object.entries(logic.checks[mapCategoryKey].maps[mapKey].checks)) {
				if (
					check.exists() &&
					check.available() &&
					(save.data.checks[mapCategoryKey] == undefined ||
						save.data.checks[mapCategoryKey][mapKey] == undefined ||
						save.data.checks[mapCategoryKey][mapKey].find((v) => v == checkKey) == undefined)
				) {
					available = true;
					break;
				}
			}

			if (available) {
				return 'bg-green-800 hover:bg-green-700 cursor-pointer';
			} else {
				return 'bg-red-900 hover:bg-red-800 cursor-pointer';
			}
		}
	};

	const getCheckColorClasses = (mapCategoryKey, mapKey, checkKey, check) => {
		//Map colors: Nothing: bg-slate-600 | Available: bg-green-800 hover:bg-green-700 | Unavailable: bg-red-900 hover:bg-red-800
		if (check.dungeon && !logic.flags.dungeon_checks_depleted(check.dungeon)) {
			return 'bg-slate-600';
		} else {
			if (save.data.checks[mapCategoryKey] !== undefined && save.data.checks[mapCategoryKey][mapKey] !== undefined && save.data.checks[mapCategoryKey][mapKey].includes(checkKey)) {
				return 'bg-slate-600';
			}
		}

		if (check.available()) {
			return 'bg-green-800 hover:bg-green-700 cursor-pointer';
		}

		return 'bg-red-900 hover:bg-red-800 cursor-pointer';
	};

	//Map interactions
	const selectMapCategory = (mapCategory) => {
		currentMapCategory.value = mapCategory;
		currentMap.value = null;
	};

	const selectMap = (map) => {
		currentMap.value = map;
	};

	const checkAllMapChecksFromCategory = (mapCategoryKey, mapKey, availableOnly = true) => {
		if (save.data.checks[mapCategoryKey] == undefined) {
			save.data.checks[mapCategoryKey] = {};
		}
		if (save.data.checks[mapCategoryKey][mapKey] == undefined) {
			save.data.checks[mapCategoryKey][mapKey] = [];
		}

		for (const [checkKey, check] of Object.entries(logic.checks[mapCategoryKey].maps[mapKey].checks)) {
			if (check.exists() && !check.dungeon && !save.data.checks[mapCategoryKey][mapKey].includes(parseInt(checkKey))) {
				if (availableOnly) {
					if (check.available()) {
						save.data.checks[mapCategoryKey][mapKey].push(parseInt(checkKey));
					}
				} else {
					save.data.checks[mapCategoryKey][mapKey].push(parseInt(checkKey));
				}
			}
		}
	};

	const selectCheck = (mapCategoryKey, mapKey, checkKey) => {
		if (logic.checks[mapCategoryKey].maps[mapKey].checks[checkKey].dungeon) {
			//TODO: Open the right map category corresponding to the dungeon
		} else {
			if (save.data.checks[mapCategoryKey] == undefined) {
				save.data.checks[mapCategoryKey] = {};
			}
			if (save.data.checks[mapCategoryKey][mapKey] == undefined) {
				save.data.checks[mapCategoryKey][mapKey] = [];
			}

			if (!save.data.checks[mapCategoryKey][mapKey].includes(parseInt(checkKey))) {
				save.data.checks[mapCategoryKey][mapKey].push(parseInt(checkKey));
			}
		}
	};

	const unselectCheck = (mapCategoryKey, mapKey, checkKey) => {
		if (save.data.checks[mapCategoryKey] !== undefined && save.data.checks[mapCategoryKey][mapKey] !== undefined) {
			if (save.data.checks[mapCategoryKey][mapKey].includes(checkKey)) {
				save.data.checks[mapCategoryKey][mapKey].splice(save.data.checks[mapCategoryKey][mapKey].indexOf(checkKey), 1);
			}
		}
	};

	// Panels available: stars, partners, equipments, items_compact, items_per_chapter, prologue, chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7, chapter8, other, misc, letters, koopa_koot_favors, trading_event_toad, map
	const panelVisible = (panelKey) => {
		let visible = true;

		switch (panelKey) {
			case 'letters':
				if (!save.data.configs.logic.letters_randomized) {
					visible = false;
				}
				break;

			case 'koopa_koot_favors':
				if (!save.data.configs.logic.koopa_koot) {
					visible = false;
				}
				break;

			case 'map':
				if (!save.data.configs.tracker.map) {
					visible = false;
				}
				break;

			case 'trading_event_toad':
				if (!save.data.configs.logic.trading_event_randomized) {
					visible = false;
				}
				break;
		}

		return visible;
	};

	return {
		currentMapCategory: currentMapCategory,
		currentMap: currentMap,

		//Map rendering
		getHighestXForMap: computed(() => getHighestXForMap),
		getHighestYForMap: computed(() => getHighestYForMap),
		getMapByCoordinates: computed(() => getMapByCoordinates),
		getMapColorClasses: computed(() => getMapColorClasses),
		getCheckColorClasses: computed(() => getCheckColorClasses),

		//Map interactions
		selectMapCategory: selectMapCategory,
		checkAllMapChecksFromCategory: checkAllMapChecksFromCategory,
		selectMap: selectMap,
		selectCheck: selectCheck,
		unselectCheck: unselectCheck,

		//Panels available
		panelVisible: computed(() => panelVisible)
	};
});
