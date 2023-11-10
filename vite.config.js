import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		VitePWA({
			registerType: 'autoUpdate',
			injectRegister: 'script',
			manifest: {
				short_name: 'PM64R Tracker',
				name: 'Paper Mario 64 Randomizer Tracker',
				icons: [
					{
						src: '/favicon/favicon-16x16.png',
						sizes: '16x16',
						type: 'image/png'
					},
					{
						src: '/favicon/favicon-32x32.png',
						sizes: '32x32',
						type: 'image/png'
					},
					{
						src: '/favicon/android-chrome-96x96.png',
						sizes: '96x96',
						type: 'image/png'
					},
					{
						src: '/favicon/android-chrome-96x96.png',
						sizes: '96x96',
						type: 'image/png'
					},
					{
						src: '/favicon/mstile-150x150.png',
						type: 'image/png',
						sizes: '212x212'
					}
				],
				start_url: '/?source=pwa',
				background_color: '#0c4a6e',
				display: 'standalone',
				// scope: '/',
				theme_color: '#082f49',
				description: "This MrYami's Paper Mario 64 Randomizer Tracker. This is only a tracker, to play the randomizer, visit: https://pm64randomizer.com",
				screenshots: [
					{
						src: '/pwa_screenshots/narrow.jpg',
						type: 'image/jpg',
						sizes: '531x748',
						form_factor: 'narrow'
					},
					{
						src: '/pwa_screenshots/wide.jpg',
						type: 'image/jpg',
						sizes: '1908x947',
						form_factor: 'wide'
					}
				]
			},
			devOptions: {
				enabled: true
			}
		})
	]
});
