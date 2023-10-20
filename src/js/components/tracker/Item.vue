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
		<p v-if="imageFolder == 'stars' && save.data.items[`${itemKey}_difficulty`]" class="absolute w-fit whitespace-nowrap bottom-[-10px] right-0">{{ save.data.items[`${itemKey}_difficulty`] }}</p>
		<p v-if="imageFolder != 'partners' && itemCountMax > 1 && !levelItem" class="absolute w-fit whitespace-nowrap bottom-[-10px] right-0">{{ itemCount }}/{{ itemCountMax }}</p>
		<p v-if="initial" class="absolute w-fit whitespace-nowrap top-[-10px] left-0">{{ initial }}</p>
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
	size: {
		type: String,
		default: 'md'
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
	return {
		xs: 'min-w-[1.5rem] w-6 h-6',
		sm: 'min-w-[2rem] w-8 h-8',
		md: 'min-w-[2.5rem] w-10 h-10',
		lg: 'min-w-[3rem] w-12 h-12',
		xl: 'min-w-[3.5rem] w-14 h-14',
		'2xl': 'min-w-[4rem] w-16 h-16'
	}[props.size];
});
</script>
