import { c as create_ssr_component, b as add_attribute } from "./ssr.js";
const ProseMirror = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { text } = $$props;
  let content;
  let editor;
  if ($$props.text === void 0 && $$bindings.text && text !== void 0) $$bindings.text(text);
  return `<div class="hidden"${add_attribute("this", content, 0)}></div> <div class="w-full bg-white min-h-content p-2 m-1"${add_attribute("this", editor, 0)}></div>`;
});
export {
  ProseMirror as P
};
