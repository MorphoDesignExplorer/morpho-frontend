import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter({precompress: true}),
    },
    preprocess: vitePreprocess(),
};

config.kit.paths = { base: "", assets: "" }

export default config;
