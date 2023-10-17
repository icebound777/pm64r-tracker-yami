/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			screens: {
				'3xl': '2000px'
			},
			gridTemplateColumns: {
				1: 'repeat(1, minmax(50px, 1fr))',
				2: 'repeat(2, minmax(50px, 1fr))',
				3: 'repeat(3, minmax(50px, 1fr))',
				4: 'repeat(4, minmax(50px, 1fr))',
				5: 'repeat(5, minmax(50px, 1fr))',
				6: 'repeat(6, minmax(50px, 1fr))',
				7: 'repeat(7, minmax(50px, 1fr))',
				8: 'repeat(8, minmax(50px, 1fr))',
				9: 'repeat(9, minmax(50px, 1fr))',
				10: 'repeat(10, minmax(50px, 1fr))',
				11: 'repeat(11, minmax(50px, 1fr))',
				12: 'repeat(12, minmax(50px, 1fr))',
				13: 'repeat(13, minmax(50px, 1fr))',
				14: 'repeat(14, minmax(50px, 1fr))',
				15: 'repeat(15, minmax(50px, 1fr))',
				16: 'repeat(16, minmax(50px, 1fr))'
			},
			gridTemplateRows: {
				1: 'repeat(1, minmax(50px, 1fr))',
				2: 'repeat(2, minmax(50px, 1fr))',
				3: 'repeat(3, minmax(50px, 1fr))',
				4: 'repeat(4, minmax(50px, 1fr))',
				5: 'repeat(5, minmax(50px, 1fr))',
				6: 'repeat(6, minmax(50px, 1fr))',
				7: 'repeat(7, minmax(50px, 1fr))',
				8: 'repeat(8, minmax(50px, 1fr))',
				9: 'repeat(9, minmax(50px, 1fr))',
				10: 'repeat(10, minmax(50px, 1fr))',
				11: 'repeat(11, minmax(50px, 1fr))',
				12: 'repeat(12, minmax(50px, 1fr))',
				13: 'repeat(13, minmax(50px, 1fr))',
				14: 'repeat(14, minmax(50px, 1fr))',
				15: 'repeat(15, minmax(50px, 1fr))',
				16: 'repeat(16, minmax(50px, 1fr))'
			},
			gridRow: {
				'span-7': 'span 7 / span 7',
				'span-8': 'span 8 / span 8',
				'span-9': 'span 9 / span 9',
				'span-10': 'span 10 / span 10',
				'span-11': 'span 11 / span 11',
				'span-12': 'span 12 / span 12',
				'span-13': 'span 13 / span 13',
				'span-14': 'span 14 / span 14',
				'span-15': 'span 15 / span 15',
				'span-16': 'span 16 / span 16'
			},
			gridRowStart: {
				8: '8',
				9: '9',
				10: '10',
				11: '11',
				12: '12',
				13: '13',
				14: '14',
				15: '15',
				16: '16'
			},
			gridRowEnd: {
				8: '8',
				9: '9',
				10: '10',
				11: '11',
				12: '12',
				13: '13',
				14: '14',
				15: '15',
				16: '16'
			},
			gridColumn: {
				'span-13': 'span 13 / span 13',
				'span-14': 'span 14 / span 14',
				'span-15': 'span 15 / span 15',
				'span-16': 'span 16 / span 16'
			},
			gridColumnStart: {
				14: '14',
				15: '15',
				16: '16'
			},
			gridColumnEnd: {
				14: '14',
				15: '15',
				16: '16'
			}
		}
	},
	plugins: []
};
