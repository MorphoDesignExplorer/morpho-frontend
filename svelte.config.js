import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter(),
    },
    preprocess: vitePreprocess(),
};

if (process.env.BASEPATH_PREFIX) {
    config.kit.paths = { base: "SVELTE_BASE", assets: "SVELTE_ASSETS" }
} else {
    config.kit.paths = { base: "", assets: "" }
}

export default config;
