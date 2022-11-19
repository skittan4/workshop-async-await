module.exports = {
	extends: 'vi/node',
	env: {
		browser: true,
	},
	parserOptions: {
		sourceType : 'module',
	},
	root: true,
	rules: {
		'no-shadow': ['error', { allow: ['err', 'cb', 'callback'] }],
		'consistent-return': 'off',
		'require-await': 'off'
	}
};
