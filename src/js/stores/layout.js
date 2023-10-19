import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

import { useSaveStore } from './save';

export const useLayoutStore = defineStore('layout', () => {
	const save = useSaveStore();

	const editingLayout = ref(false);
	const trackerLayout = ref([]);

	const compactItemBackgroundColor = ref('#082f49');

	//Default layouts
	const starsLayout = { x: 0, y: 0, w: 25, h: 12, i: 'stars' };
	const partnersLayout = { x: 25, y: 0, w: 29, h: 12, i: 'partners' };
	const equipmentsLayout = { x: 0, y: 12, w: 8, h: 12, i: 'equipments' };
	const itemsCompactLayout = { x: 0, y: 0, w: 30, h: 50, i: 'items_compact' };
	const itemsPerChapterLayout = { x: 0, y: 13, w: 41, h: 61, i: 'items_per_chapter' };

	const prologueLayout = { x: 8, y: 12, w: 6, h: 12, i: 'prologue' };
	const chapter1Layout = { x: 14, y: 12, w: 8, h: 12, i: 'chapter1' };
	const chapter2Layout = { x: 22, y: 12, w: 23, h: 12, i: 'chapter2' };
	const chapter3Layout = { x: 0, y: 24, w: 16, h: 12, i: 'chapter3' };
	const chapter4Layout = { x: 16, y: 24, w: 28, h: 12, i: 'chapter4' };
	const chapter5Layout = { x: 44, y: 24, w: 8, h: 12, i: 'chapter5' };
	const chapter6Layout = { x: 0, y: 36, w: 40, h: 12, i: 'chapter6' };
	const chapter7Layout = { x: 0, y: 48, w: 23, h: 12, i: 'chapter7' };
	const chapter8Layout = { x: 23, y: 48, w: 9, h: 12, i: 'chapter8' };
	const otherLayout = { x: 32, y: 48, w: 15, h: 12, i: 'other' };

	const miscLayout = { x: 40, y: 36, w: 11, h: 12, i: 'misc' };
	const lettersLayout = { x: 0, y: 60, w: 43, h: 18, i: 'letters' };
	const koopaKootLayout = { x: 0, y: 78, w: 43, h: 18, i: 'koopa_koot_favors' };
	const tradingEventToadLayout = { x: 0, y: 96, w: 11, h: 12, i: 'trading_event_toad' };
	const mapLayout = { x: 54, y: 0, w: 46, h: 100, i: 'map' };

	const restoreDefaultLayout = () => {
		if (save.data.configs.tracker.compact_items_per_chapters || save.data.configs.tracker.compact_items) {
			save.data.configs.tracker.compact_items = false;
			save.data.configs.tracker.compact_items_per_chapters = false;
		}

		trackerLayout.value = [];

		trackerLayout.value.push(Object.assign({}, starsLayout));
		trackerLayout.value.push(Object.assign({}, partnersLayout));
		trackerLayout.value.push(Object.assign({}, equipmentsLayout));
		// trackerLayout.value.push(Object.assign({}, itemsCompactLayout));
		// trackerLayout.value.push(Object.assign({}, itemsPerChapterLayout));

		trackerLayout.value.push(Object.assign({}, prologueLayout));
		trackerLayout.value.push(Object.assign({}, chapter1Layout));
		trackerLayout.value.push(Object.assign({}, chapter2Layout));
		trackerLayout.value.push(Object.assign({}, chapter3Layout));
		trackerLayout.value.push(Object.assign({}, chapter4Layout));
		trackerLayout.value.push(Object.assign({}, chapter5Layout));
		trackerLayout.value.push(Object.assign({}, chapter6Layout));
		trackerLayout.value.push(Object.assign({}, chapter7Layout));
		trackerLayout.value.push(Object.assign({}, chapter8Layout));
		trackerLayout.value.push(Object.assign({}, otherLayout));

		trackerLayout.value.push(Object.assign({}, miscLayout));
		trackerLayout.value.push(Object.assign({}, lettersLayout));
		trackerLayout.value.push(Object.assign({}, koopaKootLayout));
		trackerLayout.value.push(Object.assign({}, mapLayout));
		trackerLayout.value.push(Object.assign({}, tradingEventToadLayout));
	};

	const loadLayout = () => {
		const layout = localStorage.getItem('trackerLayout');

		if (layout) {
			trackerLayout.value = JSON.parse(layout);
		} else {
			restoreDefaultLayout();
		}
	};

	watch(
		() => save.data.configs.tracker.compact_items,
		(newValue, oldValue) => {
			if (newValue) {
				trackerLayout.value = [];

				//Add compact items layout
				trackerLayout.value.push(Object.assign({}, itemsCompactLayout));
				trackerLayout.value.push(Object.assign({}, mapLayout));

				save.data.configs.tracker.compact_items_per_chapters = false;
			} else {
				//Add normal items layouts
				if (!save.data.configs.tracker.compact_items_per_chapters) {
					trackerLayout.value = [];
					restoreDefaultLayout();
				}
			}
		}
	);

	watch(
		() => save.data.configs.tracker.compact_items_per_chapters,
		(newValue, oldValue) => {
			if (newValue) {
				trackerLayout.value = [];

				//Add compact items per chapters layout
				trackerLayout.value.push(Object.assign({}, starsLayout));
				trackerLayout.value.push(Object.assign({}, partnersLayout));
				trackerLayout.value.push(Object.assign({}, equipmentsLayout));
				trackerLayout.value.push(Object.assign({}, itemsPerChapterLayout));

				trackerLayout.value.push(Object.assign({}, miscLayout));
				trackerLayout.value.push(Object.assign({}, lettersLayout));
				trackerLayout.value.push(Object.assign({}, koopaKootLayout));
				trackerLayout.value.push(Object.assign({}, mapLayout));
				trackerLayout.value.push(Object.assign({}, tradingEventToadLayout));

				save.data.configs.tracker.compact_items = false;
			} else {
				//Add normal items layouts
				if (!save.data.configs.tracker.compact_items) {
					trackerLayout.value = [];
					restoreDefaultLayout();
				}
			}
		}
	);

	watch(
		trackerLayout,
		(newValue, oldValue) => {
			localStorage.setItem('trackerLayout', JSON.stringify(newValue));
		},
		{ deep: true }
	);

	return {
		editingLayout,
		tracker: trackerLayout,
		restoreDefaultLayout: restoreDefaultLayout,
		loadLayout: loadLayout
	};
});
