<template>
	<teleport to="body">
		<transition leave-active-class="duration-200">
			<div v-show="show" class="flex items-center fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50" scroll-region>
				<transition
					enter-active-class="ease-out duration-300"
					enter-from-class="opacity-0"
					enter-to-class="opacity-100"
					leave-active-class="ease-in duration-200"
					leave-from-class="opacity-100"
					leave-to-class="opacity-0">
					<div v-show="show" class="fixed inset-0 transform transition-all" @click="closeModal">
						<div class="absolute inset-0 bg-gray-500 opacity-75" />
					</div>
				</transition>

				<transition
					enter-active-class="ease-out duration-300"
					enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					enter-to-class="opacity-100 translate-y-0 sm:scale-100"
					leave-active-class="ease-in"
					leave-from-class="opacity-100 translate-y-0 sm:scale-100"
					leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
					<div
						v-show="show"
						class="sm:w-full p-5 mb-6 sm:mx-auto bg-sky-950 rounded-lg shadow-xl transform transition-all max-h-[80%] overflow-y-scroll"
						:class="{
							'max-w-[600px] lg:max-w-[950px] xl:max-w-[1300px]': large,
							'max-w-lg': !large
						}">
						<slot />
					</div>
				</transition>
			</div>
		</transition>
	</teleport>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
	show: {
		type: Boolean,
		default: false
	},
	maxWidth: {
		type: String,
		default: '2xl'
	},
	closeable: {
		type: Boolean,
		default: true
	},
	large: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits(['update:show', 'onClose', 'onShow', 'onHide']);

watch(
	() => props.show,
	() => {
		if (props.show) {
			emit('onShow');
			document.body.style.overflow = 'hidden';
		} else {
			emit('onHide');
			document.body.style.overflow = null;
		}
	}
);

const closeModal = () => {
	if (props.closeable) {
		emit('update:show', true);
		emit('onClose', false);
	}
};

const closeOnEscape = (e) => {
	if (e.key === 'Escape' && props.show) {
		close();
	}
};

onMounted(() => {
	document.addEventListener('keydown', closeOnEscape);
});

onUnmounted(() => {
	document.removeEventListener('keydown', closeOnEscape);
	document.body.style.overflow = null;
});
</script>
