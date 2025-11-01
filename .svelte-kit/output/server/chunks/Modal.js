import { c as create_ssr_component, d as escape } from "./ssr.js";
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let message;
  let enabled = false;
  function raise(msg, success, failure) {
    enabled = true;
    message = msg;
  }
  if ($$props.raise === void 0 && $$bindings.raise && raise !== void 0) $$bindings.raise(raise);
  return `${enabled ? `<div class="fixed top-1/4 left-[40%] w-50 h-40 bg-slate-50 border border-gray-600 rounded flex flex-col justify-evenly items-center p-4 gap-4" tabindex="0" style="z-index:99"><p class="text-2xl font-bold">${escape(message)}</p> <hr class="border-t-slate-600 border-t w-full"> <div class="flex gap-2 w-full"><button class="bg-green-400 font-bold text-green-950 text-xl w-1/2 px-2 py-1" tabindex="0" data-svelte-h="svelte-tz1pkp">Yes</button> <button class="bg-red-400 font-bold text-red-950 text-xl w-1/2 px-2 py-1" tabindex="0" data-svelte-h="svelte-159hgey">No</button></div></div>` : ``}`;
});
export {
  Modal as M
};
