import './bootstrap';
import './utils';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import '../scss/styles.scss';
import 'floating-vue/dist/style.css';
import App from './components/App.vue';

import { GridLayout, GridItem } from 'grid-layout-plus';
import FloatingVue from 'floating-vue';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { faBars, faBan, faBrain, faBraille, faCheck, faDownload, faDice, faFileCirclePlus, faFloppyDisk, faSpinner, faTable, faTrash, faWrench } from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';

library.add(faBars, faBan, faBrain, faBraille, faCheck, faCircleQuestion, faDownload, faDice, faFileCirclePlus, faFloppyDisk, faSpinner, faTable, faTrash, faWrench);

const pinia = createPinia();
const app = createApp(App)
	.use(pinia)
	.use(FloatingVue, {
		// Disable popper components
		disabled: false,
		// Default position offset along main axis (px)
		distance: 5,
		// Default position offset along cross axis (px)
		skidding: 0,
		// Default container where the tooltip will be appended
		container: 'body',
		// Element used to compute position and size boundaries
		boundary: undefined,
		// Skip delay & CSS transitions when another popper is shown, so that the popper appear to instanly move to the new position.
		instantMove: false,
		// Auto destroy tooltip DOM nodes (ms)
		disposeTimeout: 5000,
		// Triggers on the popper itself
		popperTriggers: [],
		// Positioning strategy
		strategy: 'absolute',
		// Prevent overflow
		preventOverflow: true,
		// Flip to the opposite placement if needed
		flip: true,
		// Shift on the cross axis to prevent the popper from overflowing
		shift: true,
		// Overflow padding (px)
		overflowPadding: 0,
		// Arrow padding (px)
		arrowPadding: 0,
		// Compute arrow overflow (useful to hide it)
		arrowOverflow: true,
		// Themes
		themes: {
			tooltip: {
				// Default tooltip placement relative to target element
				placement: 'bottom',
				// Default events that trigger the tooltip
				triggers: ['hover', 'focus', 'touch'],
				// Close tooltip on click on tooltip target
				hideTriggers: (events) => [...events, 'click'],
				// Delay (ms)
				delay: {
					show: 1000,
					hide: 0
				},
				// Update popper on content resize
				handleResize: false,
				// Enable HTML content in directive
				html: true,
				// Displayed when tooltip content is loading
				loadingContent: '...'
			},
			dropdown: {
				// Default dropdown placement relative to target element
				placement: 'bottom',
				// Default events that trigger the dropdown
				triggers: ['click'],
				// Delay (ms)
				delay: 0,
				// Update popper on content resize
				handleResize: true,
				// Hide on click outside
				autoHide: true
			},
			menu: {
				$extend: 'dropdown',
				triggers: ['hover', 'focus'],
				popperTriggers: ['hover', 'focus'],
				delay: {
					show: 0,
					hide: 0
				}
			}
		}
	})
	.component('font-awesome-icon', FontAwesomeIcon)
	.component('GridLayout', GridLayout)
	.component('GridItem', GridItem)
	.mount('#app');
