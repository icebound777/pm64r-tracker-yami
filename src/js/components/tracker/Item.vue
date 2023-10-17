<template>
	<div class="relative flex items-center justify-center cursor-pointer" :class="size" v-tooltip="{ content: itemName, delay: { show: tooltipDelay } }">
		<img
			class="h-full w-auto"
			:class="{
				'opacity-50': !itemCount
			}"
			:src="levelItem ? `/images/${imageFolder}/${itemKey}_${itemCount}.webp` : `/images/${imageFolder}/${itemKey}.webp`" />
		<p v-if="itemCountMax > 1 && !levelItem" class="absolute w-fit whitespace-nowrap bottom-[-10px] right-0">{{ itemCount }}/{{ itemCountMax }}</p>
		<p v-if="initial" class="absolute w-fit whitespace-nowrap top-[-10px] left-0">{{ initial }}</p>
	</div>
</template>

<script setup>
import { computed } from 'vue';

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
		xs: 'min-w-[1.5rem] w-auto h-6',
		sm: 'min-w-[2rem] w-auto h-8',
		md: 'min-w-[2.5rem] w-auto h-10',
		lg: 'min-w-[3rem] w-auto h-12',
		xl: 'min-w-[3.5rem] w-auto h-14',
		'2xl': 'min-w-[4rem] w-auto h-16'
	}[props.size];
});
</script>
