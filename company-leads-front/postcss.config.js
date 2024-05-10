/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: [
		['tailwindcss', {}],
		['autoprefixer', { remove: true, add: true, cascade: false, supports: true, flexbox: false }],
		['cssnano', { preset: 'default' }],
		// postcss-variable-compress
	],
};

export default config;
