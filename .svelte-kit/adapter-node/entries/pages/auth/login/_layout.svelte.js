import { c as create_ssr_component } from "../../../../chunks/ssr.js";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="bg-gray-100 w-full h-screen flex flex-col items-center justify-center">${slots.default ? slots.default({}) : ``}</div>`;
});
export {
  Layout as default
};
