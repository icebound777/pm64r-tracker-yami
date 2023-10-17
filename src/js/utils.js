Object.defineProperty(String.prototype, 'capitalize', {
	value: function () {
		return this.charAt(0).toUpperCase() + this.slice(1);
	},
	enumerable: false
});

Object.defineProperty(String.prototype, 'titlize', {
	value: function () {
		return this.replaceAll('_', ' ');
	},
	enumerable: false
});
