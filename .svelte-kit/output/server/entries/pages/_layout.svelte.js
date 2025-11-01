import { c as create_ssr_component } from "../../chunks/ssr.js";
const css = {
  code: "body{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))\n}",
  map: '{"version":3,"file":"+layout.svelte","sources":["+layout.svelte"],"sourcesContent":["<script>\\n  import \\"../app.css\\";\\n<\/script>\\n\\n<slot/>\\n\\n<style lang=\\"postcss\\">\\n  :global(body) {\\n    --tw-bg-opacity: 1;\\n    background-color: rgb(255 255 255 / var(--tw-bg-opacity))\\n}\\n</style>\\n"],"names":[],"mappings":"AAOU,IAAM,CACZ,eAAe,CAAE,CAAC,CAClB,gBAAgB,CAAE,IAAI,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,IAAI,eAAe,CAAC,CAAC;AAC7D"}'
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
