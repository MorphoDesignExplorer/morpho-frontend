import { c as create_ssr_component } from "../../chunks/ssr.js";
const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="h-screen w-screen flex flex-col gap-1 items-center bg-gray-400 text-gray-600" data-svelte-h="svelte-6hivnn"><p class="text-4xl font-bold pt-[30vh] pb-3">Error.</p> <p class="text-lg font-bold">Hmmm.... Seems like this page is broken.</p> <p class="text-lg font-bold">Maybe try looking somewhere else... like <a href="/" class="underline decoration-blue-500 decoration-2">here?</a></p> <p class="text-lg font-bold">Or if this is an issue, report it to the <a href="https://github.com/MorphoDesignExplorer/morpho-frontend/issues" class="underline decoration-blue-500 decoration-2">developer</a>.</p></div>`;
});
export {
  Error as default
};
