import { c as create_ssr_component, e as each, d as escape, v as validate_component } from "../../chunks/ssr.js";
import { b as base } from "../../chunks/server.js";
import "@sveltejs/kit/internal/server";
import { R as RenderDocument } from "../../chunks/document.js";
const css = {
  code: ".sizer.svelte-1rbnf4p{background-size:100%}",
  map: '{"version":3,"file":"MainPage.svelte","sources":["MainPage.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { base } from \\"$app/paths\\";\\nimport { RenderDocument } from \\"$lib/document\\";\\nexport let data;\\nlet dropdownElement;\\nlet anchorPixel;\\nlet hover = false;\\nconst sortedProjects = data.projects.sort((left, right) => {\\n  const left_date = Date.parse(left.creation_date);\\n  const right_date = Date.parse(right.creation_date);\\n  if (left_date < right_date) {\\n    return -1;\\n  } else if (left_date == right_date) {\\n    return 0;\\n  } else {\\n    return 1;\\n  }\\n});\\nconst topLevelDocuments = data.documents[\\"\\"].filter((doc) => {\\n  if (doc.slug != \\"Front Matter\\") return doc;\\n});\\nfunction initDropdown(node) {\\n  dropdownElement = node;\\n}\\nfunction initAnchorPixel(node) {\\n  anchorPixel = node;\\n  anchorPixel.tabIndex = 1;\\n}\\nfunction enableDropdown(event) {\\n  hover = true;\\n  setTimeout(() => anchorPixel.focus(), 10);\\n  if (event.target instanceof HTMLAnchorElement) {\\n    dropdownElement.style.left = `${event.target.getBoundingClientRect().left - 20}px`;\\n    dropdownElement.style.top = `${event.target.getBoundingClientRect().bottom + 10}px`;\\n  }\\n}\\nfunction disableDropdown(event) {\\n  if (event.target instanceof HTMLElement) {\\n    if (!dropdownElement.contains(event.relatedTarget)) {\\n      hover = false;\\n    }\\n  }\\n}\\n<\/script>\\n\\n<!--preload splash image-->\\n<link rel=\\"preload\\" href=\\"https://morpho-images.s3.us-east-1.amazonaws.com/assets/splash.png\\" as=\\"image\\" type=\\"image/png\\"/>\\n\\n<div id=\\"navbar\\" class=\\"p-4 flex justify-evenly items-center text-lg text-black font-extrabold gap-3 border-b-[1px] border-b-slate-200\\">\\n    <a href=\\"{base}/\\" class=\\"flex flex-row items-center gap-3\\">\\n        <img src=\\"https://morpho-images.s3.us-east-1.amazonaws.com/assets/morpho.png\\" class=\\"w-20 backdrop-blur-lg\\" alt=\\"icon\\">\\n        <h2 class=\\"select-none text-3xl\\">Morpho Design Explorer</h2>\\n    </a>\\n    <div class=\\"flex gap-4\\">\\n        <h3 class=\\"text-3xl font-bold\\"><a href=\\"{base}/{sortedProjects[0].project_name}\\" class=\\"underline decoration-blue-500\\" on:mouseover={enableDropdown} on:focus={()=>{}}>Projects</a></h3>\\n        {#each topLevelDocuments as tld}\\n        <h3 class=\\"text-3xl font-bold\\"><a href=\\"material/{tld.slug}\\" class=\\"underline decoration-blue-500\\">{tld.title}</a></h3>\\n        {/each}\\n    </div>\\n</div>\\n\\n<div class=\\"bg-[url(https://morpho-images.s3.us-east-1.amazonaws.com/assets/splash.png)] h-60 bg-[50%_20%] sizer\\">\\n</div>\\n\\n<div class=\\"h-full w-full flex justify-center p-8\\">\\n    <div class=\\"w-3/5 flex flex-col gap-3 text-lg\\">\\n        {@html RenderDocument(data.documents[\'\'].filter(doc => doc.slug == \'Front Matter\')[0].text)}\\n    </div>\\n</div>\\n\\n<div class=\\"absolute bg-white rounded-md border-[1px] border-slate-200 flex flex-col gap-2 p-2\\" class:hidden={!hover} on:blur={disableDropdown} use:initDropdown>\\n    <span use:initAnchorPixel on:blur={disableDropdown}></span>\\n    {#each sortedProjects as project}\\n        <h3 class=\\"text-xl font-bold\\"><a href=\\"{base}/{project.project_name}\\" class=\\"underline decoration-blue-500\\">{project.metadata.human_name}</a></h3>\\n    {/each}\\n</div>\\n\\n<style>\\n    .sizer {\\n        background-size: 100%;\\n    }\\n</style>\\n"],"names":[],"mappings":"AA6EI,qBAAO,CACH,eAAe,CAAE,IACrB"}'
};
const MainPage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const sortedProjects = data.projects.sort((left, right) => {
    const left_date = Date.parse(left.creation_date);
    const right_date = Date.parse(right.creation_date);
    if (left_date < right_date) {
      return -1;
    } else if (left_date == right_date) {
      return 0;
    } else {
      return 1;
    }
  });
  const topLevelDocuments = data.documents[""].filter((doc) => {
    if (doc.slug != "Front Matter") return doc;
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$result.css.add(css);
  return ` <link rel="preload" href="https://morpho-images.s3.us-east-1.amazonaws.com/assets/splash.png" as="image" type="image/png"> <div id="navbar" class="p-4 flex justify-evenly items-center text-lg text-black font-extrabold gap-3 border-b-[1px] border-b-slate-200"><a href="${escape(base, true) + "/"}" class="flex flex-row items-center gap-3" data-svelte-h="svelte-snyeqg"><img src="https://morpho-images.s3.us-east-1.amazonaws.com/assets/morpho.png" class="w-20 backdrop-blur-lg" alt="icon"> <h2 class="select-none text-3xl">Morpho Design Explorer</h2></a> <div class="flex gap-4"><h3 class="text-3xl font-bold"><a href="${escape(base, true) + "/" + escape(sortedProjects[0].project_name, true)}" class="underline decoration-blue-500">Projects</a></h3> ${each(topLevelDocuments, (tld) => {
    return `<h3 class="text-3xl font-bold"><a href="${"material/" + escape(tld.slug, true)}" class="underline decoration-blue-500">${escape(tld.title)}</a></h3>`;
  })}</div></div> <div class="bg-[url(https://morpho-images.s3.us-east-1.amazonaws.com/assets/splash.png)] h-60 bg-[50%_20%] sizer svelte-1rbnf4p" data-svelte-h="svelte-rrvfdv"></div> <div class="h-full w-full flex justify-center p-8"><div class="w-3/5 flex flex-col gap-3 text-lg"><!-- HTML_TAG_START -->${RenderDocument(data.documents[""].filter((doc) => doc.slug == "Front Matter")[0].text)}<!-- HTML_TAG_END --></div></div> <div class="${[
    "absolute bg-white rounded-md border-[1px] border-slate-200 flex flex-col gap-2 p-2",
    "hidden"
  ].join(" ").trim()}"><span></span> ${each(sortedProjects, (project) => {
    return `<h3 class="text-xl font-bold"><a href="${escape(base, true) + "/" + escape(project.project_name, true)}" class="underline decoration-blue-500">${escape(project.metadata.human_name)}</a></h3>`;
  })} </div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  return `${validate_component(MainPage, "MainPage").$$render($$result, { data }, {}, {})}`;
});
export {
  Page as default
};
