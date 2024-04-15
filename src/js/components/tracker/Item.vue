<template>
	<div
		class="relative flex items-center justify-center cursor-pointer"
		:class="size"
		v-tooltip="save.data.configs.tracker.deactivate_items_tooltips ? null : { content: itemName, delay: { show: tooltipDelay } }">
		<img
			class="h-full w-auto"
			:class="{
				'opacity-50': !itemCount && !save.data.configs.tracker.missing_items_in_grayscale,
				grayscale: !itemCount && save.data.configs.tracker.missing_items_in_grayscale
			}"
			:src="levelItem ? `/images/${imageFolder}/${itemKey}_${itemCount}.webp` : `/images/${imageFolder}/${itemKey}.webp`" />
		<template v-if="imageFolder == 'partners' && save.data.items[itemKey + '_rank'] !== undefined" v-for="i in save.data.items[itemKey + '_rank']" :key="i">
			<img class="absolute bottom-0 h-[15px]" :class="[`right-level${i}`]" src="/images/partners/partner_level.webp" />
		</template>
		<img v-if="imageFolder == 'stars' && stars_dungeon_shuffle_images" class="absolute top-0 left-0 h-[20px]" :src="`/images/stars/${stars_dungeon_shuffle_images}.webp`" />
		<p v-if="imageFolder == 'stars' && save.data.items[`${itemKey}_difficulty`]" class="absolute w-fit whitespace-nowrap bottom-[-10px] right-0">{{ save.data.items[`${itemKey}_difficulty`] }}</p>
		<font-awesome-icon v-if="imageFolder == 'stars' && save.data.items[`${itemKey}_chapter_disabled`]" class="absolute text-red-600 z-10 top-0 right-0" :icon="['fas', 'ban']" />
		<p
			v-if="imageFolder != 'partners' && itemCountMax > 1 && !levelItem"
			class="absolute w-fit whitespace-nowrap bottom-[-10px] text-base"
			:class="{
				'right-0': itemKey != 'power_stars',
				'right-powerstar': itemKey == 'power_stars'
			}">
			{{ itemCount }}/{{ itemCountMax }}
		</p>
		<template v-if="save.data.items.hand_ins !== undefined && save.data.items.hand_ins[itemKey] !== undefined && imageFolder != 'misc' && imageFolder != 'equipments' && imageFolder != 'partners'">
			<div class="absolute top-0 right-0">
				<div class="flex flex-wrap w-full justify-end">
					<font-awesome-icon v-for="i in save.data.items.hand_ins[itemKey]" :key="i" class="text-green-600" :icon="['fas', 'check']" />
				</div>
			</div>
		</template>
		<template
			v-if="
				save.data.configs.tracker.competitive_mode &&
				save.data.items.hand_ins !== undefined &&
				save.data.items.hand_ins[imageFolder] !== undefined &&
				save.data.items.hand_ins[imageFolder][itemKey] !== undefined
			">
			<div class="absolute top-0 right-0">
				<div class="flex flex-wrap w-full justify-end">
					<font-awesome-icon v-for="i in save.data.items.hand_ins[imageFolder][itemKey]" :key="i" class="text-green-600" :icon="['fas', 'check']" />
				</div>
			</div>
		</template>
		<p v-if="initial" class="absolute w-fit whitespace-nowrap top-[-10px] left-0">{{ initial }}</p>
		<img
			v-if="showMerlow"
			class="absolute left-[-6px] h-[20px]"
			:class="{
				'top-0': !initial,
				'top-[15px]': initial
			}"
			:src="`/images/checks/merlow.webp`" />
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { useSaveStore } from '../../stores/save';

const save = useSaveStore();

const props = defineProps({
	tooltipDelay: {
		type: Number,
		default: 1000
	},
	itemName: String,
	levelItem: {
		type: Boolean,
		default: false
	},
	itemKey: String,
	imageFolder: String,
	itemCount: Number | Boolean,
	itemCountMax: Number,
	initial: {
		type: String,
		default: ''
	}
});

const size = computed(() => {
	if (save.data.configs.tracker.item_icon_size) {
		return {
			sm: 'min-w-[2rem] w-8 h-8',
			md: 'min-w-[2.5rem] w-10 h-10',
			lg: 'min-w-[3rem] w-12 h-12',
			xl: 'min-w-[3.5rem] w-14 h-14',
			'2xl': 'min-w-[4rem] w-16 h-16'
		}[save.data.configs.tracker.item_icon_size];
	} else {
		return 'min-w-[2.5rem] w-10 h-10';
	}
});

const stars_dungeon_shuffle_images = computed(() => {
	if (props.imageFolder == 'stars') {
		return {
			0: null,
			1: 'eldstar',
			2: 'mamar',
			3: 'skolar',
			4: 'muskular',
			5: 'misstar',
			6: 'klevar',
			7: 'kalmar'
		}[save.data.items[`${props.itemKey}_dungeon_shuffle`]];
	} else {
		return null;
	}
});

const showMerlow = computed(() => {
	if (save.data.merlow_items !== undefined) {
		if (props.imageFolder == 'koopa_koot_favors' || props.imageFolder == 'letters') {
			if (save.data.merlow_items[props.imageFolder] !== undefined) {
				return save.data.merlow_items[props.imageFolder][props.itemKey];
			}
		} else {
			return save.data.merlow_items[props.itemKey];
		}
	}

	return false;
});
</script>
