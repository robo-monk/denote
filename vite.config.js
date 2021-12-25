import { defineConfig } from 'vite';
import sveltePreprocess from 'svelte-preprocess';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svelte({
			preprocess: sveltePreprocess(),
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: (css) => {
				css.write('public/bundle.css');
			},
		}),
	],
	base: '/ironic-password-manager/',
	build: {
		outDir: 'docs',
	},
});
