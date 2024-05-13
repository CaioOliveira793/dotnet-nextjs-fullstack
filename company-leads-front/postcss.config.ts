/**
 * Custom path resolver
 *
 * @see https://github.com/postcss/postcss-import?tab=readme-ov-file#resolve
 * ---
 * @param _id
 * @param basedir
 * @param importOptions
 * @param astNode
 * ---
 * @returns {string} a absolute path or a base path
 */
function resolveCssImport(_id: string, basedir: string): string {
	if (basedir.startsWith('@/')) {
		const path = 'src/' + basedir.slice(2);
		return path;
	}

	return basedir;
}

/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: [
		['postcss-import', { resolve: resolveCssImport }],
		['autoprefixer', { remove: true, add: true, cascade: false, supports: true, flexbox: false }],
		['cssnano', { preset: 'default' }],
	],
};

export default config;
