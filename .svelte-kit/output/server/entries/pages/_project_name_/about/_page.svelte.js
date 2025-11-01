import { c as create_ssr_component } from "../../../../chunks/ssr.js";
const css = {
  code: ".parent.svelte-1uosd9s{display:flex;flex-direction:column;align-items:center}.description.svelte-1uosd9s{margin:2.5rem;display:flex;flex-direction:column;gap:1rem}.description.svelte-1uosd9s h1{font-size:1.5rem !important;line-height:2rem !important;font-weight:700 !important;--tw-text-opacity:1 !important;color:rgb(37 99 235 / var(--tw-text-opacity)) !important}.description.svelte-1uosd9s h3{font-weight:700 !important;--tw-text-opacity:1 !important;color:rgb(30 64 175 / var(--tw-text-opacity)) !important}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">export let data;\\n<\/script>\\n\\n<link href='/document.css' rel=\\"stylesheet\\"/>\\n\\n<div class=\\"grid parent\\">\\n    <div class=\\"description\\">\\n        {@html data.html}\\n    </div>\\n</div>\\n\\n<style lang=\\"postcss\\">\\n    .parent {\\n        display: flex;\\n        flex-direction: column;\\n        align-items: center;\\n    }\\n\\n    .description {\\n        margin: 2.5rem;\\n        display: flex;\\n        flex-direction: column;\\n        gap: 1rem;\\n}\\n\\n    .description :global(h1) {\\n        font-size: 1.5rem !important;\\n        line-height: 2rem !important;\\n        font-weight: 700 !important;\\n        --tw-text-opacity: 1 !important;\\n        color: rgb(37 99 235 / var(--tw-text-opacity)) !important;\\n}\\n\\n    .description :global(h3) {\\n        font-weight: 700 !important;\\n        --tw-text-opacity: 1 !important;\\n        color: rgb(30 64 175 / var(--tw-text-opacity)) !important;\\n}\\n</style>\\n"],"names":[],"mappings":"AAYI,sBAAQ,CACJ,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,WAAW,CAAE,MACjB,CAEA,2BAAa,CACT,MAAM,CAAE,MAAM,CACd,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,GAAG,CAAE,IACb,CAEI,2BAAY,CAAS,EAAI,CACrB,SAAS,CAAE,MAAM,CAAC,UAAU,CAC5B,WAAW,CAAE,IAAI,CAAC,UAAU,CAC5B,WAAW,CAAE,GAAG,CAAC,UAAU,CAC3B,iBAAiB,CAAE,EAAE,UAAU,CAC/B,KAAK,CAAE,IAAI,EAAE,CAAC,EAAE,CAAC,GAAG,CAAC,CAAC,CAAC,IAAI,iBAAiB,CAAC,CAAC,CAAC,UACvD,CAEI,2BAAY,CAAS,EAAI,CACrB,WAAW,CAAE,GAAG,CAAC,UAAU,CAC3B,iBAAiB,CAAE,EAAE,UAAU,CAC/B,KAAK,CAAE,IAAI,EAAE,CAAC,EAAE,CAAC,GAAG,CAAC,CAAC,CAAC,IAAI,iBAAiB,CAAC,CAAC,CAAC,UACvD"}`
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$result.css.add(css);
  return `<link href="/document.css" rel="stylesheet"> <div class="grid parent svelte-1uosd9s"><div class="description svelte-1uosd9s"><!-- HTML_TAG_START -->${data.html}<!-- HTML_TAG_END --></div> </div>`;
});
export {
  Page as default
};
