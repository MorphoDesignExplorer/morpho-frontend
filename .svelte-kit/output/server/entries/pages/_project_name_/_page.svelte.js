import { c as create_ssr_component, f as compute_rest_props, g as spread, b as add_attribute, h as escape_attribute_value, i as escape_object, d as escape, a as subscribe, e as each, v as validate_component, j as set_store_value, k as getContext } from "../../../chunks/ssr.js";
import { g as get_display_options, b as get_filter_predicates } from "../../../chunks/context.js";
import { p as page } from "../../../chunks/stores.js";
import "echarts";
import { w as writable } from "../../../chunks/index.js";
const LazyImagePlus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cssClass;
  let $$restProps = compute_rest_props($$props, ["placeholder", "src", "alt", "options"]);
  let { placeholder } = $$props;
  let { src } = $$props;
  let { alt } = $$props;
  let { options = {
    root: null,
    rootMargin: "0px 0px 0px 0px",
    threshold: 0
  } } = $$props;
  let imgElement;
  let path;
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
  if ($$props.src === void 0 && $$bindings.src && src !== void 0) $$bindings.src(src);
  if ($$props.alt === void 0 && $$bindings.alt && alt !== void 0) $$bindings.alt(alt);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0) $$bindings.options(options);
  path = placeholder;
  cssClass = $$props.class || "";
  return `<span class="w-[9vw] h-[9vw] flex items-center"><img${spread(
    [
      { src: escape_attribute_value(path) },
      { alt: escape_attribute_value(alt) },
      escape_object($$restProps),
      {
        class: "svelte-lazy-image " + escape(cssClass, true)
      }
    ],
    {
      classes: ""
    }
  )}${add_attribute("this", imgElement, 0)}></span>`;
});
const css$3 = {
  code: ".no-scrollbar.svelte-t8397u{scrollbar-width:none}.scroll-smooth.svelte-t8397u{scroll-behavior:smooth}",
  map: '{"version":3,"file":"Sidepane.svelte","sources":["Sidepane.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { browser } from \\"$app/environment\\";\\nimport { onMount } from \\"svelte\\";\\nimport { fade } from \\"svelte/transition\\";\\nimport LazyImagePlus from \\"./LazyImagePlus.svelte\\";\\nimport { get_display_options } from \\"$lib/context\\";\\nlet display_options = get_display_options();\\nexport let model;\\nexport let allowed_tags;\\nexport let unit_map;\\nfunction get_image_src_or_empty(model2, tag) {\\n  const file = model2.files.filter((obj) => obj.tag == tag)[0];\\n  if (file !== void 0)\\n    return file.file;\\n  else\\n    return \\"\\";\\n}\\nlet sidepane_container;\\nlet close_button;\\nlet utility_visible = false;\\nif (browser) {\\n  onMount(() => {\\n    let observer = new IntersectionObserver((entry) => {\\n      if (entry[0].isIntersecting === false) {\\n        utility_visible = true;\\n      } else {\\n        utility_visible = false;\\n      }\\n    }, { root: sidepane_container, threshold: 1 });\\n    observer.observe(close_button);\\n  });\\n}\\nlet grid_position;\\n$: {\\n  if ($display_options.graph) {\\n    grid_position = \\"grid-column: 2 / 3; grid-row: 1 / 2;\\";\\n  } else {\\n    grid_position = \\"grid-column: 2 / 3; grid-row: 1 / 3;\\";\\n  }\\n}\\n<\/script>\\n\\n<div\\n    class=\\"relative min-w-[40vw] border-b-2 border-gray-200 flex flex-col gap-2 p-2 overflow-scroll overflow-x-hidden translate-x-0 scroll-smooth\\"\\n    style={grid_position}\\n    bind:this={sidepane_container}\\n>\\n    <span id=\\"sidepane-top-anchor\\"></span>\\n    <button\\n        on:click={() => {\\n            $display_options.sidepane = !$display_options.sidepane;\\n        }}\\n        bind:this={close_button}\\n        class=\\"flex items-center justify-center w-fit p-1 bg-white text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500 transition ease-in-out font-bold shadow-md\\">\\n            <svg xmlns=\\"http://www.w3.org/2000/svg\\" fill=\\"none\\" viewBox=\\"0 0 24 24\\" stroke-width=\\"1.5\\" stroke=\\"currentColor\\" class=\\"size-6\\">\\n                <path stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" d=\\"M6 18 18 6M6 6l12 12\\" />\\n            </svg>\\n    </button>\\n    <div id=\\"solution-number\\" class=\\"flex flex-row items-center my-2\\">\\n        <span class=\\"text-xl font-semibold\\">Solution #{model.scoped_id}</span>\\n    </div>\\n    \\n    <div class=\\"flex flex-row justify-evenly\\">\\n        <!-- Table Data Section -->\\n        <div class=\\"flex flex-col overflow-scroll gap-4 no-scrollbar\\">\\n            <table id=\\"input-params\\" class=\\"border border-gray-200 text-xs h-fit\\">\\n                <tr class=\\"border-b border-gray-200\\">\\n                    <td class=\\"p-2\\"><p class=\\"font-bold\\">Input Parameters:</p></td>\\n                </tr>\\n                {#each Object.entries(model.parameters) as [param_name, value]}\\n                <tr class=\\"border-b border-gray-200\\">\\n                    <td class=\\"border-r border-gray-200 p-2 font-semibold text-wrap\\">{param_name}</td>\\n                    <td class=\\"p-2\\">{value} <code class=\\"font-bold\\">{unit_map[param_name] || \\"\\"}</td>\\n                </tr>\\n                {/each}\\n            </table>\\n            <table id=\\"output-params\\" class=\\"border border-gray-200 text-xs h-fit\\">\\n                <tr class=\\"border-b border-gray-200\\">\\n                    <td class=\\"p-2\\"><p class=\\"font-bold\\">Output Parameters:</p></td>\\n                </tr>\\n                {#each Object.entries(model.output_parameters) as [param_name, value]}\\n                <tr class=\\"border-b border-gray-200\\">\\n                    <td class=\\"border-r border-gray-200 p-2 font-semibold text-wrap\\">{param_name}</td>\\n                    <td class=\\"p-2\\">{value} <code class=\\"font-bold\\">{unit_map[param_name] || \\"\\"}</code></td>\\n                </tr>\\n                {/each}\\n            </table>\\n        </div>\\n        <!-- End Table Data Section -->\\n        <!-- Asset Section -->\\n        <div class=\\"flex flex-col overflow-scroll gap-4 no-scrollbar m-4\\">\\n            {#each allowed_tags as tag}\\n            {#if get_image_src_or_empty(model, tag) != \\"\\"}\\n            <div class=\\"flex flex-col items-end px-2 py-4 border-gray-300 shadow-md border w-fit h-fit relative\\">\\n                <p class=\\"mr-auto p-2 font-bold\\">{tag}</p>\\n                <a\\n                    role=\\"button\\"\\n                    tabindex=\\"0\\"\\n                    class=\\"bg-white text-blue-500 hover:bg-blue-500 hover:text-white transition ease-in-out font-bold p-1 text-sm w-fit absolute top-0 right-0 rounded-es-md\\"\\n                    href={get_image_src_or_empty(model, tag)}\\n                    target=\\"_blank\\">\\n                        <svg xmlns=\\"http://www.w3.org/2000/svg\\" fill=\\"none\\" viewBox=\\"0 0 24 24\\" stroke-width=\\"1.5\\" stroke=\\"currentColor\\" class=\\"size-5 font-bold\\">\\n                            <path stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" d=\\"M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25\\" />\\n                        </svg>\\n                    </a\\n                >\\n                <LazyImagePlus\\n                    placeholder=\\"https://placehold.co/300/f8fafc/f8fafc\\"\\n                    class=\\"m-1 w-60\\"\\n                    src={get_image_src_or_empty(model, tag)}\\n                    alt={model.id}\\n                />\\n            </div>\\n            {/if}\\n            {/each}\\n        </div>\\n        <!-- End Asset Section -->\\n    </div>\\n\\n    {#if utility_visible}\\n    <div class=\\"sticky w-fit ml-auto flex flex-row gap-1 py-1 shadow-md bg-black opacity-80 bottom-0 text-white\\" in:fade={{duration: 220}} out:fade>\\n        <span class=\\"cursor-pointer border-r border-white px-2 h-full\\" role=\\"button\\" on:click={() => {$display_options.sidepane = !$display_options.sidepane}}>Close Detail Pane</span>\\n        <a href=\\"#input-params\\" class=\\"cursor-pointer border-r border-white px-2 h-full \\">i/p parameters</a>\\n        <a href=\\"#output-params\\" class=\\"cursor-pointer border-r border-white px-2 h-full\\">o/p parameters</a>\\n        <!-- <a href=\\"#assets\\" class=\\"cursor-pointer px-2 h-full\\">Assets</a> -->\\n        <span></span>\\n    </div>\\n    {/if}\\n</div>\\n\\n<style type=\\"postcss\\">\\n    .no-scrollbar {\\n        scrollbar-width: none;\\n    }\\n\\n    .scroll-smooth {\\n        scroll-behavior: smooth;\\n    }\\n</style>\\n"],"names":[],"mappings":"AAkII,2BAAc,CACV,eAAe,CAAE,IACrB,CAEA,4BAAe,CACX,eAAe,CAAE,MACrB"}'
};
function get_image_src_or_empty$1(model2, tag) {
  const file = model2.files.filter((obj) => obj.tag == tag)[0];
  if (file !== void 0) return file.file;
  else return "";
}
const Sidepane = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $display_options, $$unsubscribe_display_options;
  let display_options = get_display_options();
  $$unsubscribe_display_options = subscribe(display_options, (value) => $display_options = value);
  let { model } = $$props;
  let { allowed_tags } = $$props;
  let { unit_map } = $$props;
  let sidepane_container;
  let close_button;
  let grid_position2;
  if ($$props.model === void 0 && $$bindings.model && model !== void 0) $$bindings.model(model);
  if ($$props.allowed_tags === void 0 && $$bindings.allowed_tags && allowed_tags !== void 0) $$bindings.allowed_tags(allowed_tags);
  if ($$props.unit_map === void 0 && $$bindings.unit_map && unit_map !== void 0) $$bindings.unit_map(unit_map);
  $$result.css.add(css$3);
  {
    {
      if ($display_options.graph) {
        grid_position2 = "grid-column: 2 / 3; grid-row: 1 / 2;";
      } else {
        grid_position2 = "grid-column: 2 / 3; grid-row: 1 / 3;";
      }
    }
  }
  $$unsubscribe_display_options();
  return `<div class="relative min-w-[40vw] border-b-2 border-gray-200 flex flex-col gap-2 p-2 overflow-scroll overflow-x-hidden translate-x-0 scroll-smooth svelte-t8397u"${add_attribute("style", grid_position2, 0)}${add_attribute("this", sidepane_container, 0)}><span id="sidepane-top-anchor"></span> <button class="flex items-center justify-center w-fit p-1 bg-white text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500 transition ease-in-out font-bold shadow-md"${add_attribute("this", close_button, 0)} data-svelte-h="svelte-1l8mf0u"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path></svg></button> <div id="solution-number" class="flex flex-row items-center my-2"><span class="text-xl font-semibold">Solution #${escape(model.scoped_id)}</span></div> <div class="flex flex-row justify-evenly"> <div class="flex flex-col overflow-scroll gap-4 no-scrollbar svelte-t8397u"><table id="input-params" class="border border-gray-200 text-xs h-fit"><tr class="border-b border-gray-200" data-svelte-h="svelte-1nsue3b"><td class="p-2"><p class="font-bold">Input Parameters:</p></td></tr> ${each(Object.entries(model.parameters), ([param_name, value]) => {
    return `<tr class="border-b border-gray-200"><td class="border-r border-gray-200 p-2 font-semibold text-wrap">${escape(param_name)}</td> <td class="p-2">${escape(value)} <code class="font-bold">${escape(unit_map[param_name] || "")}</code></td> </tr>`;
  })}</table> <table id="output-params" class="border border-gray-200 text-xs h-fit"><tr class="border-b border-gray-200" data-svelte-h="svelte-1acpjy8"><td class="p-2"><p class="font-bold">Output Parameters:</p></td></tr> ${each(Object.entries(model.output_parameters), ([param_name, value]) => {
    return `<tr class="border-b border-gray-200"><td class="border-r border-gray-200 p-2 font-semibold text-wrap">${escape(param_name)}</td> <td class="p-2">${escape(value)} <code class="font-bold">${escape(unit_map[param_name] || "")}</code></td> </tr>`;
  })}</table></div>   <div class="flex flex-col overflow-scroll gap-4 no-scrollbar m-4 svelte-t8397u">${each(allowed_tags, (tag) => {
    return `${get_image_src_or_empty$1(model, tag) != "" ? `<div class="flex flex-col items-end px-2 py-4 border-gray-300 shadow-md border w-fit h-fit relative"><p class="mr-auto p-2 font-bold">${escape(tag)}</p> <a role="button" tabindex="0" class="bg-white text-blue-500 hover:bg-blue-500 hover:text-white transition ease-in-out font-bold p-1 text-sm w-fit absolute top-0 right-0 rounded-es-md"${add_attribute("href", get_image_src_or_empty$1(model, tag), 0)} target="_blank"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 font-bold"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg></a> ${validate_component(LazyImagePlus, "LazyImagePlus").$$render(
      $$result,
      {
        placeholder: "https://placehold.co/300/f8fafc/f8fafc",
        class: "m-1 w-60",
        src: get_image_src_or_empty$1(model, tag),
        alt: model.id
      },
      {},
      {}
    )} </div>` : ``}`;
  })}</div> </div> ${``} </div>`;
});
const Filters = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $filter_predicates, $$unsubscribe_filter_predicates;
  let { parameters } = $$props;
  let filter_predicates = get_filter_predicates();
  $$unsubscribe_filter_predicates = subscribe(filter_predicates, (value) => $filter_predicates = value);
  let filters = $filter_predicates.filter_predicate;
  const optype2 = {
    ge: ">=",
    le: "<=",
    gt: ">",
    lt: "<",
    eq: "=",
    ne: "!="
  };
  const empty_filter = { lvalue: "", op: optype2.eq, rvalue: "" };
  if ($$props.parameters === void 0 && $$bindings.parameters && parameters !== void 0) $$bindings.parameters(parameters);
  set_store_value(filter_predicates, $filter_predicates.filter_predicate = filters, $filter_predicates);
  {
    {
      if (filters.length == 0) {
        filters.push(Object.assign({}, empty_filter));
      }
      if (filters[filters.length - 1].lvalue != "") {
        filters.push(Object.assign({}, empty_filter));
      }
    }
  }
  $$unsubscribe_filter_predicates();
  return `<div class="flex flex-col w-full p-2 gap-2">${each(Object.entries(filters), ([index, field]) => {
    return `<div class="flex flex-row items-center text-sm w-fit shadow-sm"> <select${add_attribute("name", `lvalue-${index}`, 0)} class="h-full border border-gray-200 bg-white p-2"><option value="" class="" disabled selected data-svelte-h="svelte-1l9less">parameter name...</option>${each(parameters, (parameter) => {
      return `<option class="text-black"${add_attribute("value", parameter, 0)}>${escape(parameter)}</option>`;
    })}</select>  <select${add_attribute("name", `op-${index}`, 0)} class="h-full border-y border-gray-200 bg-gray-50 p-2 font-bold">${each(Object.values(optype2), (op) => {
      return `<option${add_attribute("value", op, 0)}>${escape(op)}</option>`;
    })}</select> ${index != filters.length - 1 ? ` <input${add_attribute("name", `rvalue-${index}`, 0)} class="h-full border-l border-y border-gray-200 p-2" placeholder="parameter value..."${add_attribute("value", field.rvalue, 0)}>  <button class="h-full bg-gray-50 border border-gray-200 font-bold p-2" data-svelte-h="svelte-elxg65"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4"><path stroke-width="5px" fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path></svg> </button>` : ` <input${add_attribute("name", `rvalue-${index}`, 0)} class="h-full border border-gray-200 p-2" placeholder="parameter value..."${add_attribute("value", field.rvalue, 0)}>`} </div>`;
  })} </div>`;
});
const optype = {
  ge: ">=",
  le: "<=",
  gt: ">",
  lt: "<",
  eq: "=",
  ne: "!="
};
function predicate_equal(predicates) {
  predicates.pop();
  return function filter_model_with_predicates(model) {
    return predicates.map((predicate) => {
      if (predicate.rvalue == "") {
        return true;
      }
      const rvalue = parseFloat(predicate.rvalue.toString());
      let value_to_check;
      if (predicate.lvalue in model.parameters) {
        value_to_check = model.parameters[predicate.lvalue];
      } else if (predicate.lvalue in model.output_parameters) {
        value_to_check = model.output_parameters[predicate.lvalue];
      } else {
        value_to_check = 0;
      }
      if (typeof value_to_check === "number") {
        switch (predicate.op) {
          case optype.ge:
            return value_to_check >= rvalue;
          case optype.le:
            return value_to_check <= rvalue;
          case optype.gt:
            return value_to_check > rvalue;
          case optype.lt:
            return value_to_check < rvalue;
          case optype.eq:
            return value_to_check == rvalue;
          case optype.ne:
            return value_to_check != rvalue;
        }
      } else {
        return value_to_check === rvalue.toString();
      }
    }).reduce((prev, curr) => prev && curr, true);
  };
}
function get_image_src_or_empty(model, tag) {
  const file = model.files.filter((obj) => obj.tag == tag)[0];
  if (file !== void 0) return file.file;
  else return "";
}
const PUBLIC_S3_URI = "https://morpho-images.s3.us-east-1.amazonaws.com/";
const css$2 = {
  code: '#swatches.svelte-r5g4h6{display:grid;overflow-x:clip;grid-template-rows:1fr 11fr;grid-template-areas:"swatch-option"\n            "swatch-item-grid"}#swatch-option.svelte-r5g4h6{grid-area:swatch-option}#swatch-item-grid.svelte-r5g4h6{grid-area:swatch-item-grid;scrollbar-width:thin;scrollbar-color:#3b82f6 white;display:grid;height:100%;width:100%;overflow:scroll;padding:1rem}',
  map: '{"version":3,"file":"Swatches.svelte","sources":["Swatches.svelte"],"sourcesContent":["<script lang=\\"ts\\">import Filters from \\"./Filters.svelte\\";\\nimport { get_image_src_or_empty, predicate_equal } from \\"$lib/utils\\";\\nimport { getContext, onMount } from \\"svelte\\";\\nimport LazyImagePlus from \\"./LazyImagePlus.svelte\\";\\nimport { get_filter_predicates } from \\"../../lib/context\\";\\nimport { PUBLIC_S3_URI } from \\"$env/static/public\\";\\nexport let allowed_tags;\\nexport let models;\\nexport let project_metadata;\\nexport let set_project;\\nexport let unit_map;\\nexport let caption_tags;\\nexport let filtered_models;\\nlet filter_predicates = get_filter_predicates();\\nlet image_tag = allowed_tags[0];\\n$: if (allowed_tags.indexOf(image_tag) == -1) {\\n  image_tag = allowed_tags[0];\\n}\\nlet parameter_names;\\n$: parameter_names = project_metadata.variable_metadata.map((field) => field.field_name).concat(\\n  project_metadata.output_metadata.map((field) => field.field_name)\\n).concat([\\"scoped_id\\"]);\\nlet sort_parameter_name = \\"scoped_id\\";\\n$: if (parameter_names.indexOf(sort_parameter_name) == -1) {\\n  sort_parameter_name = \\"scoped_id\\";\\n}\\nlet display_options = getContext(\\"display_options\\");\\n$: if (!$display_options.grid) {\\n  $filter_predicates.filter_predicate = [];\\n}\\n$: filtered_models = models.filter(\\n  predicate_equal(Array.from($filter_predicates.filter_predicate))\\n).filter((model) => {\\n  if ($filter_predicates.chart_predicate.length === 0) {\\n    return true;\\n  } else {\\n    return $filter_predicates.chart_predicate.indexOf(model.id) > -1;\\n  }\\n}).sort((a, b) => {\\n  const relative = (a2, b2) => {\\n    return a2 == b2 ? 0 : a2 > b2 ? 1 : -1;\\n  };\\n  if (sort_parameter_name == \\"scoped_id\\") {\\n    return relative(a[sort_parameter_name], b[sort_parameter_name]);\\n  } else if (Object.hasOwn(a.parameters, sort_parameter_name)) {\\n    return relative(\\n      a.parameters[sort_parameter_name],\\n      b.parameters[sort_parameter_name]\\n    );\\n  } else if (Object.hasOwn(a.output_parameters, sort_parameter_name)) {\\n    return relative(\\n      a.output_parameters[sort_parameter_name],\\n      b.output_parameters[sort_parameter_name]\\n    );\\n  } else {\\n    return 0;\\n  }\\n});\\nlet grid_position;\\n$: {\\n  if (!$display_options.graph && !$display_options.sidepane) {\\n    grid_position = \\"grid-column: 1 / 3; grid-row: 1 / 3;\\";\\n  } else if (!$display_options.graph && $display_options.sidepane) {\\n    grid_position = \\"grid-column: 1 / 2; grid-row: 1 / 3;\\";\\n  } else if ($display_options.graph && !$display_options.sidepane) {\\n    grid_position = \\"grid-column: 2 / 3; grid-row: 1 / 3;\\";\\n  } else if ($display_options.graph && $display_options.sidepane) {\\n    grid_position = \\"grid-column: 2 / 3; grid-row: 2 / 3;\\";\\n  }\\n}\\nlet grid_element;\\nlet render_item_count = 50;\\nlet grid_row_item_count;\\nfunction getLayoutStatistics() {\\n  let gridHeight = grid_element.clientHeight;\\n  let columnCount = Math.floor(grid_element.clientWidth / 220);\\n  let rowCount = 1;\\n  let rowHeight = gridHeight;\\n  if (grid_element.children.length > 0) {\\n    rowCount = Math.ceil(\\n      gridHeight / grid_element.children[0].clientHeight\\n    );\\n    rowHeight = grid_element.children[0].clientHeight;\\n  }\\n  return {\\n    rowHeight,\\n    rows: rowCount,\\n    columns: columnCount\\n  };\\n}\\nfunction get_percentage() {\\n  const layoutStats = getLayoutStatistics();\\n  let topPadding = parseInt(\\n    window.getComputedStyle(grid_element).paddingTop,\\n    10\\n  );\\n  let rowOffset = (grid_element.scrollTop - topPadding) / layoutStats.rowHeight;\\n  const percentage = 100 * grid_element.scrollTop / (grid_element.scrollHeight - grid_element.clientHeight);\\n  if (percentage > 80) {\\n    render_item_count = Math.min(\\n      render_item_count + 50,\\n      filtered_models.length\\n    );\\n  }\\n}\\nfunction swatch_caption(model, caption_tags2) {\\n  const captions = [];\\n  for (let param_idx = 0; param_idx < caption_tags2.length; param_idx++) {\\n    const param = caption_tags2[param_idx];\\n    let caption = {\\n      display_name: param.display_name,\\n      unit: unit_map[param.tag_name] || \\"\\",\\n      value: 0\\n    };\\n    if (param.tag_name in model.parameters) {\\n      caption.value = model.parameters[param.tag_name];\\n    } else if (param.tag_name in model.output_parameters) {\\n      caption.value = model.output_parameters[param.tag_name];\\n    } else if (param.tag_name == \\"scoped_id\\") {\\n      caption.value = model.scoped_id;\\n    }\\n    captions.push(caption);\\n  }\\n  return captions;\\n}\\nlet item_grid_column_style;\\nonMount(() => {\\n  function resizeCallback() {\\n    const layoutStats = getLayoutStatistics();\\n    grid_row_item_count = Math.floor(grid_element.clientWidth / 220);\\n    item_grid_column_style = `grid-template-columns: repeat(${layoutStats.columns}, minmax(0, 1fr))`;\\n  }\\n  const resizeObserver = new ResizeObserver(resizeCallback);\\n  resizeObserver.observe(grid_element);\\n});\\n<\/script>\\n\\n<div\\n    id=\\"swatches\\"\\n    class=\\"w-full h-full overflow-hidden border-r border-r-gray-200\\"\\n    style={grid_position}\\n>\\n    <!-- Options Container -->\\n    <div\\n        id=\\"swatch-option\\"\\n        class=\\"flex flex-col justify-end border-b-4 border-b-blue-500 shadow-sm\\"\\n    >\\n        <div class=\\"flex h-10 pl-2 gap-3 border-b-4 border-blue-500 mt-2\\">\\n            <div class=\\"flex select-none\\">\\n                <!-- Thumbnail Select -->\\n                <label\\n                    for=\\"image-select\\"\\n                    class=\\"h-full p-1 flex items-center border-x border-t border-blue-500 bg-blue-500 text-white font-bold\\"\\n                    >Thumbnail</label\\n                >\\n                <select\\n                    id=\\"image-select\\"\\n                    class=\\"h-full p-1 hover:bg-gray-200 border-t border-r border-blue-500 text-blue-500 font-bold transition-colors ease-linear cursor-pointer\\"\\n                    bind:value={image_tag}\\n                >\\n                    {#each allowed_tags as tag}\\n                        <option value={tag}>{tag}</option>\\n                    {/each}\\n                </select>\\n            </div>\\n            <div class=\\"flex select-none\\">\\n                <!-- Select Sort Parameter -->\\n                <label\\n                    for=\\"image-select\\"\\n                    class=\\"h-full p-1 flex items-center border-x border-t border-blue-500 bg-blue-500 text-white font-bold\\"\\n                    >Sort By</label\\n                >\\n                <select\\n                    id=\\"image-select\\"\\n                    class=\\"h-full p-1 hover:bg-gray-200 border-t border-r border-blue-500 text-blue-500 font-bold transition-colors ease-linear cursor-pointer\\"\\n                    bind:value={sort_parameter_name}\\n                >\\n                    {#each parameter_names as param_name}\\n                        {#if param_name == \\"scoped_id\\"}\\n                            <option value={param_name}>Scoped ID</option>\\n                        {:else}\\n                            <option value={param_name}>{param_name}</option>\\n                        {/if}\\n                    {/each}\\n                </select>\\n            </div>\\n            <button\\n                on:click={() => {\\n                    $display_options.filter = !$display_options.filter;\\n                }}\\n                class=\\"bg-blue-500 border border-blue-500 p-1 px-3 select-none flex flex-row items-center gap-3 text-white hover:bg-white hover:text-blue-500 transition-colors ease-linear font-bold\\"\\n            >\\n                <!-- Filter Collection -->\\n                Filters\\n                <svg\\n                    xmlns=\\"http://www.w3.org/2000/svg\\"\\n                    viewBox=\\"0 0 24 24\\"\\n                    fill=\\"currentColor\\"\\n                    class=\\"size-6\\"\\n                >\\n                    <path\\n                        d=\\"M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z\\"\\n                    />\\n                </svg>\\n            </button>\\n            <button\\n                on:click={() => {\\n                    $display_options.graph = !$display_options.graph;\\n                }}\\n                class=\\"bg-blue-500 border border-blue-500 p-1 px-3 select-none flex flex-row items-center gap-2 text-white hover:text-blue-500 hover:bg-white transition-colors ease-linear font-bold\\"\\n            >\\n                <!-- Graph Toggle -->\\n                Graph\\n                <svg\\n                    xmlns=\\"http://www.w3.org/2000/svg\\"\\n                    viewBox=\\"0 0 24 24\\"\\n                    fill=\\"currentColor\\"\\n                    class=\\"size-6\\"\\n                >\\n                    <path\\n                        fill-rule=\\"evenodd\\"\\n                        d=\\"M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm4.5 7.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 .75-.75Zm3.75-1.5a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0V12Zm2.25-3a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0V9.75A.75.75 0 0 1 13.5 9Zm3.75-1.5a.75.75 0 0 0-1.5 0v9a.75.75 0 0 0 1.5 0v-9Z\\"\\n                        clip-rule=\\"evenodd\\"\\n                    />\\n                </svg>\\n            </button>\\n            <span\\n                class=\\"bg-blue-500 border border-blue-500 p-1 px-3 select-none flex flex-row items-center gap-2 text-white font-bold\\"\\n            >\\n                No. of Solutions:<b>{filtered_models.length}</b>\\n            </span>\\n        </div>\\n        {#if $display_options.filter}\\n            <!-- accordion-style filter menu -->\\n            <Filters\\n                parameters={project_metadata.variable_metadata\\n                    .map((meta) => meta.field_name)\\n                    .concat(\\n                        project_metadata.output_metadata.map(\\n                            (meta) => meta.field_name,\\n                        ),\\n                    )}\\n            />\\n        {/if}\\n    </div>\\n\\n    <!-- Items grid -->\\n    {#if $display_options.grid}\\n        <div\\n            id=\\"swatch-item-grid\\"\\n            bind:this={grid_element}\\n            on:scroll={get_percentage}\\n            style={item_grid_column_style}\\n        >\\n            <!-- TODO virtualize list -->\\n            {#each filtered_models.slice(0, render_item_count) as model}\\n                {#if get_image_src_or_empty(model, image_tag).length > 0}\\n                    <div\\n                        role=\\"button\\"\\n                        tabindex=\\"0\\"\\n                        on:click={() => set_project(model.id)}\\n                        on:keydown={() => set_project(model.id)}\\n                        class=\\"flex flex-col items-center p-2 border border-gray-200 cursor-pointer hover:bg-slate-200 transition ease-out\\"\\n                        title=\\"Click to show details\\"\\n                    >\\n                        <LazyImagePlus\\n                            src={PUBLIC_S3_URI + get_image_src_or_empty(model, image_tag)}\\n                            placeholder=\\"https://placehold.co/300/f8fafc/f8fafc\\"\\n                            alt={model.files[0].tag}\\n                            class=\\"w-[9vw] rounded-sm\\"\\n                        />\\n\\n                        <!-- project-specific display tag for each swatch -->\\n                        <div class=\\"w-full flex flex-col pt-2 mt-auto\\">\\n                            {#each swatch_caption(model, caption_tags) as caption}\\n                                <span\\n                                    class=\\"flex justify-between items-center gap-2\\"\\n                                >\\n                                    <span\\n                                        class=\\"text-xs text-slate-500 font-semibold\\"\\n                                    >\\n                                        {caption.display_name}\\n                                        {#if caption.unit.length > 0}\\n                                            <span\\n                                                class=\\"text-xs text-black font-bold\\"\\n                                                >[{caption.unit}]</span\\n                                            >\\n                                        {/if}\\n                                    </span>\\n                                    <span class=\\"ml-auto text-sm text-black\\"\\n                                        >{Intl.NumberFormat(\\"en-us\\", {\\n                                            notation: \\"compact\\",\\n                                        }).format(caption.value)}</span\\n                                    >\\n                                </span>\\n                            {/each}\\n                        </div>\\n                    </div>\\n                {/if}\\n            {/each}\\n        </div>\\n    {:else}\\n        <div class=\\"p-4\\">\\n            <h2 class=\\"font-bold text-2xl m-4\\">Loading...</h2>\\n        </div>\\n    {/if}\\n</div>\\n\\n<style lang=\\"postcss\\">\\n    #swatches {\\n        display: grid;\\n        overflow-x: clip;\\n        grid-template-rows: 1fr 11fr;\\n        grid-template-areas:\\n            \\"swatch-option\\"\\n            \\"swatch-item-grid\\";\\n    }\\n\\n    #swatch-option {\\n        grid-area: swatch-option;\\n    }\\n\\n    #swatch-item-grid {\\n        grid-area: swatch-item-grid;\\n        scrollbar-width: thin;\\n        scrollbar-color: #3b82f6 white;\\n        display: grid;\\n        height: 100%;\\n        width: 100%;\\n        overflow: scroll;\\n        padding: 1rem;\\n    }\\n</style>\\n"],"names":[],"mappings":"AAqTI,uBAAU,CACN,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,IAAI,CAChB,kBAAkB,CAAE,GAAG,CAAC,IAAI,CAC5B,mBAAmB,CACf,eAAe;AAC3B,YAAY,kBACR,CAEA,4BAAe,CACX,SAAS,CAAE,aACf,CAEA,+BAAkB,CACd,SAAS,CAAE,gBAAgB,CAC3B,eAAe,CAAE,IAAI,CACrB,eAAe,CAAE,OAAO,CAAC,KAAK,CAC9B,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,QAAQ,CAAE,MAAM,CAChB,OAAO,CAAE,IACb"}'
};
const Swatches = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $display_options, $$unsubscribe_display_options;
  let $filter_predicates, $$unsubscribe_filter_predicates;
  let { allowed_tags } = $$props;
  let { models } = $$props;
  let { project_metadata } = $$props;
  let { set_project } = $$props;
  let { unit_map } = $$props;
  let { caption_tags } = $$props;
  let { filtered_models } = $$props;
  let filter_predicates = get_filter_predicates();
  $$unsubscribe_filter_predicates = subscribe(filter_predicates, (value) => $filter_predicates = value);
  let image_tag = allowed_tags[0];
  let parameter_names;
  let sort_parameter_name = "scoped_id";
  let display_options = getContext("display_options");
  $$unsubscribe_display_options = subscribe(display_options, (value) => $display_options = value);
  let grid_position2;
  let grid_element;
  let render_item_count = 50;
  function swatch_caption(model, caption_tags2) {
    const captions = [];
    for (let param_idx = 0; param_idx < caption_tags2.length; param_idx++) {
      const param = caption_tags2[param_idx];
      let caption = {
        display_name: param.display_name,
        unit: unit_map[param.tag_name] || "",
        value: 0
      };
      if (param.tag_name in model.parameters) {
        caption.value = model.parameters[param.tag_name];
      } else if (param.tag_name in model.output_parameters) {
        caption.value = model.output_parameters[param.tag_name];
      } else if (param.tag_name == "scoped_id") {
        caption.value = model.scoped_id;
      }
      captions.push(caption);
    }
    return captions;
  }
  let item_grid_column_style;
  if ($$props.allowed_tags === void 0 && $$bindings.allowed_tags && allowed_tags !== void 0) $$bindings.allowed_tags(allowed_tags);
  if ($$props.models === void 0 && $$bindings.models && models !== void 0) $$bindings.models(models);
  if ($$props.project_metadata === void 0 && $$bindings.project_metadata && project_metadata !== void 0) $$bindings.project_metadata(project_metadata);
  if ($$props.set_project === void 0 && $$bindings.set_project && set_project !== void 0) $$bindings.set_project(set_project);
  if ($$props.unit_map === void 0 && $$bindings.unit_map && unit_map !== void 0) $$bindings.unit_map(unit_map);
  if ($$props.caption_tags === void 0 && $$bindings.caption_tags && caption_tags !== void 0) $$bindings.caption_tags(caption_tags);
  if ($$props.filtered_models === void 0 && $$bindings.filtered_models && filtered_models !== void 0) $$bindings.filtered_models(filtered_models);
  $$result.css.add(css$2);
  {
    if (allowed_tags.indexOf(image_tag) == -1) {
      image_tag = allowed_tags[0];
    }
  }
  parameter_names = project_metadata.variable_metadata.map((field) => field.field_name).concat(project_metadata.output_metadata.map((field) => field.field_name)).concat(["scoped_id"]);
  {
    if (parameter_names.indexOf(sort_parameter_name) == -1) {
      sort_parameter_name = "scoped_id";
    }
  }
  {
    if (!$display_options.grid) {
      set_store_value(filter_predicates, $filter_predicates.filter_predicate = [], $filter_predicates);
    }
  }
  filtered_models = models.filter(predicate_equal(Array.from($filter_predicates.filter_predicate))).filter((model) => {
    if ($filter_predicates.chart_predicate.length === 0) {
      return true;
    } else {
      return $filter_predicates.chart_predicate.indexOf(model.id) > -1;
    }
  }).sort((a, b) => {
    const relative = (a2, b2) => {
      return a2 == b2 ? 0 : a2 > b2 ? 1 : -1;
    };
    if (sort_parameter_name == "scoped_id") {
      return relative(a[sort_parameter_name], b[sort_parameter_name]);
    } else if (Object.hasOwn(a.parameters, sort_parameter_name)) {
      return relative(a.parameters[sort_parameter_name], b.parameters[sort_parameter_name]);
    } else if (Object.hasOwn(a.output_parameters, sort_parameter_name)) {
      return relative(a.output_parameters[sort_parameter_name], b.output_parameters[sort_parameter_name]);
    } else {
      return 0;
    }
  });
  {
    {
      if (!$display_options.graph && !$display_options.sidepane) {
        grid_position2 = "grid-column: 1 / 3; grid-row: 1 / 3;";
      } else if (!$display_options.graph && $display_options.sidepane) {
        grid_position2 = "grid-column: 1 / 2; grid-row: 1 / 3;";
      } else if ($display_options.graph && !$display_options.sidepane) {
        grid_position2 = "grid-column: 2 / 3; grid-row: 1 / 3;";
      } else if ($display_options.graph && $display_options.sidepane) {
        grid_position2 = "grid-column: 2 / 3; grid-row: 2 / 3;";
      }
    }
  }
  $$unsubscribe_display_options();
  $$unsubscribe_filter_predicates();
  return `<div id="swatches" class="w-full h-full overflow-hidden border-r border-r-gray-200 svelte-r5g4h6"${add_attribute("style", grid_position2, 0)}> <div id="swatch-option" class="flex flex-col justify-end border-b-4 border-b-blue-500 shadow-sm svelte-r5g4h6"><div class="flex h-10 pl-2 gap-3 border-b-4 border-blue-500 mt-2"><div class="flex select-none"> <label for="image-select" class="h-full p-1 flex items-center border-x border-t border-blue-500 bg-blue-500 text-white font-bold" data-svelte-h="svelte-sskkah">Thumbnail</label> <select id="image-select" class="h-full p-1 hover:bg-gray-200 border-t border-r border-blue-500 text-blue-500 font-bold transition-colors ease-linear cursor-pointer">${each(allowed_tags, (tag) => {
    return `<option${add_attribute("value", tag, 0)}>${escape(tag)}</option>`;
  })}</select></div> <div class="flex select-none"> <label for="image-select" class="h-full p-1 flex items-center border-x border-t border-blue-500 bg-blue-500 text-white font-bold" data-svelte-h="svelte-f4g9ag">Sort By</label> <select id="image-select" class="h-full p-1 hover:bg-gray-200 border-t border-r border-blue-500 text-blue-500 font-bold transition-colors ease-linear cursor-pointer">${each(parameter_names, (param_name) => {
    return `${param_name == "scoped_id" ? `<option${add_attribute("value", param_name, 0)}>Scoped ID</option>` : `<option${add_attribute("value", param_name, 0)}>${escape(param_name)}</option>`}`;
  })}</select></div> <button class="bg-blue-500 border border-blue-500 p-1 px-3 select-none flex flex-row items-center gap-3 text-white hover:bg-white hover:text-blue-500 transition-colors ease-linear font-bold" data-svelte-h="svelte-1m63myy">
                Filters
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6"><path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"></path></svg></button> <button class="bg-blue-500 border border-blue-500 p-1 px-3 select-none flex flex-row items-center gap-2 text-white hover:text-blue-500 hover:bg-white transition-colors ease-linear font-bold" data-svelte-h="svelte-1t4kyd5">
                Graph
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6"><path fill-rule="evenodd" d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm4.5 7.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 .75-.75Zm3.75-1.5a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0V12Zm2.25-3a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0V9.75A.75.75 0 0 1 13.5 9Zm3.75-1.5a.75.75 0 0 0-1.5 0v9a.75.75 0 0 0 1.5 0v-9Z" clip-rule="evenodd"></path></svg></button> <span class="bg-blue-500 border border-blue-500 p-1 px-3 select-none flex flex-row items-center gap-2 text-white font-bold">No. of Solutions:<b>${escape(filtered_models.length)}</b></span></div> ${$display_options.filter ? ` ${validate_component(Filters, "Filters").$$render(
    $$result,
    {
      parameters: project_metadata.variable_metadata.map((meta) => meta.field_name).concat(project_metadata.output_metadata.map((meta) => meta.field_name))
    },
    {},
    {}
  )}` : ``}</div>  ${$display_options.grid ? `<div id="swatch-item-grid"${add_attribute("style", item_grid_column_style, 0)} class="svelte-r5g4h6"${add_attribute("this", grid_element, 0)}> ${each(filtered_models.slice(0, render_item_count), (model) => {
    return `${get_image_src_or_empty(model, image_tag).length > 0 ? `<div role="button" tabindex="0" class="flex flex-col items-center p-2 border border-gray-200 cursor-pointer hover:bg-slate-200 transition ease-out" title="Click to show details">${validate_component(LazyImagePlus, "LazyImagePlus").$$render(
      $$result,
      {
        src: PUBLIC_S3_URI + get_image_src_or_empty(model, image_tag),
        placeholder: "https://placehold.co/300/f8fafc/f8fafc",
        alt: model.files[0].tag,
        class: "w-[9vw] rounded-sm"
      },
      {},
      {}
    )}  <div class="w-full flex flex-col pt-2 mt-auto">${each(swatch_caption(model, caption_tags), (caption) => {
      return `<span class="flex justify-between items-center gap-2"><span class="text-xs text-slate-500 font-semibold">${escape(caption.display_name)} ${caption.unit.length > 0 ? `<span class="text-xs text-black font-bold">[${escape(caption.unit)}]</span>` : ``}</span> <span class="ml-auto text-sm text-black">${escape(Intl.NumberFormat("en-us", { notation: "compact" }).format(caption.value))}</span> </span>`;
    })}</div> </div>` : ``}`;
  })}</div>` : `<div class="p-4" data-svelte-h="svelte-i20t8x"><h2 class="font-bold text-2xl m-4">Loading...</h2></div>`} </div>`;
});
const css$1 = {
  code: ".graph-container.svelte-1fpyntk{scrollbar-width:thin;scrollbar-color:#3B82F6 white}",
  map: '{"version":3,"file":"Graph.svelte","sources":["Graph.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { page } from \\"$app/stores\\";\\nimport * as echarts from \\"echarts\\";\\nimport { onMount } from \\"svelte\\";\\nimport { writable } from \\"svelte/store\\";\\nimport { slide } from \\"svelte/transition\\";\\nimport { get_display_options, get_filter_predicates } from \\"$lib/context\\";\\nexport let models;\\nexport let set_project;\\nexport let parameters;\\nexport let unit_map;\\nexport let model_in_focus;\\nparameters = parameters.sort();\\nconst default_parameters = $page.data.metadata.captions.map((item) => item.tag_name);\\nlet filter_predicates = get_filter_predicates();\\nlet display_options = get_display_options();\\nlet chart;\\nlet chart_object;\\nlet container;\\nlet current_display = writable(\\"scatter\\");\\nlet configuration_active = false;\\nlet chart_state = writable({\\n  parameter_toggle: parameters.map((item) => {\\n    return default_parameters.includes(item);\\n  }),\\n  parallel_search: \\"\\"\\n});\\nchart_state.subscribe(parallel);\\nfunction render() {\\n  if ($current_display === \\"parallel\\") {\\n    parallel();\\n  } else if ($current_display === \\"scatter\\") {\\n    scatter();\\n  }\\n}\\n$: $current_display && render();\\n$: XY_chart_state && render();\\n$: models && render();\\n$: if (model_in_focus) {\\n  setTimeout(() => {\\n    chart_object.dispatchAction({\\n      type: \\"downplay\\",\\n      seriesIndex: 0,\\n      dataIndex: [...Array(models.length).keys()]\\n    });\\n    chart_object.dispatchAction({\\n      type: \\"highlight\\",\\n      seriesIndex: 0,\\n      dataIndex: models.indexOf(model_in_focus)\\n    });\\n  }, 20);\\n}\\n$: if (chart_object) {\\n  chart_object.on(\\"click\\", (params) => {\\n    set_project(\\n      models.at(params.dataIndex)?.id\\n    );\\n  });\\n  chart_object.on(\\"axisareaselected\\", (event) => {\\n    const series = chart_object.getModel().getSeries()[0];\\n    const indices = series.getRawIndicesByActiveState(\\"active\\");\\n    $filter_predicates.chart_predicate = models.filter((_, index) => indices.indexOf(index) > -1).map((model) => model.id);\\n  });\\n  chart_object.on(\\"brushselected\\", (event) => {\\n    const indices = event.batch[0].selected[0].dataIndex;\\n    $filter_predicates.chart_predicate = models.filter((_, index) => indices.indexOf(index) > -1).map((model) => model.id);\\n  });\\n  chart_object.getZr().on(\\"click\\", (event) => {\\n    if (!event.target) {\\n      chart_object.dispatchAction({\\n        type: \\"downplay\\",\\n        seriesIndex: 0,\\n        dataIndex: [...Array(models.length).keys()]\\n      });\\n      if ($current_display === \\"scatter\\") {\\n      }\\n    }\\n  });\\n}\\nlet XY_chart_state = {\\n  parameter_x: default_parameters[0],\\n  parameter_y: default_parameters[1]\\n};\\nfunction get_data(param_x, param_y) {\\n  return models.map((model) => {\\n    let parameter_copy = Object.assign({}, model.parameters);\\n    parameter_copy = Object.assign(parameter_copy, model.output_parameters);\\n    return [parameter_copy[param_x], parameter_copy[param_y]];\\n  });\\n}\\nonMount(async () => {\\n  chart_object = echarts.init(chart, null, {\\n    width: container.clientWidth * 0.8,\\n    height: container.clientWidth * 0.8\\n  });\\n  chart_object.resize({\\n    width: chart.clientWidth,\\n    height: chart.clientWidth * 0.8\\n  });\\n  render();\\n  current_display.subscribe(() => {\\n    $filter_predicates.chart_predicate = [];\\n  });\\n});\\nfunction get_label(tag_name) {\\n  return tag_name.split(\\"_\\").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(\\" \\") + `\\n[${unit_map[tag_name] || \\"unitless\\"}]`;\\n}\\nfunction parallel() {\\n  if (chart_object === void 0)\\n    return;\\n  chart_object.clear();\\n  const parameters_allowed = parameters.filter((_, index) => {\\n    return $chart_state.parameter_toggle[index];\\n  });\\n  const get_item_for_parallel_point = (model) => {\\n    const agg_object = Object.assign(Object.assign({}, model.parameters), model.output_parameters);\\n    return parameters_allowed.map(\\n      (param) => agg_object[param]\\n    );\\n  };\\n  chart_object.setOption({\\n    parallelAxis: parameters_allowed.map((item, index) => {\\n      return {\\n        dim: index,\\n        name: get_label(item)\\n      };\\n    }),\\n    series: {\\n      type: \\"parallel\\",\\n      lineStyle: {\\n        width: 2\\n      },\\n      data: models.map(\\n        (model) => {\\n          return get_item_for_parallel_point(model);\\n        }\\n      )\\n    },\\n    dataZoom: {\\n      type: \\"inside\\"\\n    },\\n    emphasis: {\\n      lineStyle: {\\n        color: \\"#c05a6f\\",\\n        width: 3,\\n        opacity: 100,\\n        shadowBlur: 4,\\n        shadowOffsetX: 0,\\n        shadowColor: \\"#e66a83\\"\\n      }\\n    }\\n  });\\n}\\nfunction scatter() {\\n  if (chart_object === void 0)\\n    return;\\n  chart_object.clear();\\n  chart_object.setOption({\\n    xAxis: {\\n      name: get_label(XY_chart_state.parameter_x),\\n      nameLocation: \\"end\\",\\n      nameTextStyle: {\\n        align: \\"right\\",\\n        verticalAlign: \\"top\\",\\n        padding: [30, 0, 0, 0]\\n      },\\n      nameGap: 0\\n    },\\n    yAxis: {\\n      name: get_label(XY_chart_state.parameter_y),\\n      nameTextStyle: {\\n        align: \\"left\\"\\n      }\\n    },\\n    series: [\\n      {\\n        symbolSize: 20,\\n        data: get_data(XY_chart_state.parameter_x, XY_chart_state.parameter_y),\\n        type: \\"scatter\\"\\n      }\\n    ],\\n    toolbox: {\\n      feature: {\\n        dataZoom: {\\n          yAxisIndex: false\\n        },\\n        brush: {\\n          type: [\\"rect\\", \\"clear\\"]\\n        }\\n      }\\n    },\\n    dataZoom: {\\n      type: \\"inside\\"\\n    },\\n    brush: {\\n      xAxisIndex: \\"all\\",\\n      brushLink: \\"all\\",\\n      outOfBrush: {\\n        colorAlpha: 0.1\\n      }\\n    },\\n    emphasis: {\\n      itemStyle: {\\n        color: \\"#c05a6f\\",\\n        width: 3,\\n        opacity: 100,\\n        shadowBlur: 4,\\n        shadowOffsetX: 0,\\n        shadowColor: \\"#e66a83\\"\\n      }\\n    }\\n  });\\n}\\nlet grid_position = \\"grid-column: 1 / 2; grid-row: 1 / 3;\\";\\n<\/script>\\n\\n<div class=\\"graph-container w-full h-full pb-4 flex flex-col items-center border-r-2 border-blue-500 text-base overflow-scroll\\" style={grid_position} bind:this={container}>\\n    <div class=\\"mt-4 pl-2 w-full flex items-end gap-2 border-b-4 border-blue-500\\">\\n        <button class=\\"p-0.5 flex items-center justify-center border-x border-t border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition ease-in-out\\"\\n        on:click={() => {\\n            $display_options.graph = false;\\n        }}\\n        >\\n            <svg xmlns=\\"http://www.w3.org/2000/svg\\" fill=\\"none\\" viewBox=\\"0 0 24 24\\" stroke-width=\\"1.5\\" stroke=\\"currentColor\\" class=\\"size-6\\">\\n                <path stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" d=\\"M6 18 18 6M6 6l12 12\\" />\\n            </svg>\\n        </button>\\n        <button\\n            on:click={() => {$current_display = \\"scatter\\"}}\\n            class=\\"p-0.5 px-3 flex items-center justify-center border-x border-t border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition ease-in-out font-bold\\"\\n            class:bg-blue-500={$current_display == \\"scatter\\"}\\n            class:text-white={$current_display == \\"scatter\\"}\\n        >\\n            Scatter Plot\\n        </button>\\n        <button\\n            on:click={() => {$current_display = \\"parallel\\"}}\\n            class=\\"p-0.5 px-3 flex items-center justify-center border-x border-t border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition ease-in-out font-bold\\"\\n            class:bg-blue-500={$current_display == \\"parallel\\"}\\n            class:text-white={$current_display == \\"parallel\\"}\\n        >\\n            Parallel Coordinates\\n        </button>\\n    </div>\\n    <canvas class=\\"relative\\" bind:this={chart}/>\\n\\n    <div class=\\"px-4 flex flex-col gap-2 w-full\\">\\n        <div class=\\"w-full flex border-b-4 border-blue-500\\">\\n            <label \\n                for=\\"configure_checkbox\\"\\n                class=\\"mr-auto gap-1 px-3 py-1 flex text-blue-500 font-bold border-t border-x border-blue-500 hover:bg-blue-500 hover:text-white transition ease-in-out select-none cursor-pointer\\"\\n                class:text-white={configuration_active}\\n                class:bg-blue-500={configuration_active}\\n            >\\n                <svg xmlns=\\"http://www.w3.org/2000/svg\\" fill=\\"none\\" viewBox=\\"0 0 24 24\\" stroke-width=\\"1.5\\" stroke=\\"currentColor\\" class=\\"size-6\\">\\n                    <path stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" d=\\"M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z\\" />\\n                    <path stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" d=\\"M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z\\" />\\n                </svg>\\n                Configure Plot\\n                <input type=\\"checkbox\\" id=\\"configure_checkbox\\" class=\\"hidden\\" bind:checked={configuration_active}>\\n            </label>\\n        </div>\\n        {#if configuration_active}\\n        <div class=\\"p-4\\" transition:slide={{duration: 100}}>\\n            {#if $current_display === \\"parallel\\"}\\n            <div class=\\"mb-2 w-full flex gap-2 items-center\\">\\n                <p class=\\"font-bold\\">Search Variables:</p>\\n                <input type=\\"text\\" class=\\"border border-gray-200 p-1\\" placeholder=\\"Search parameters\\" bind:value={$chart_state.parallel_search}>\\n            </div>\\n            <div class=\\"flex flex-wrap justify-start\\">\\n                {#each $chart_state.parameter_toggle as parameter_boolean, index}\\n                <label for=\\"parameter_{index}\\" class=\\"px-3 py-1 m-1 text-blue-500 border border-blue-500 text-sm select-none cursor-pointer\\" class:bg-blue-500={$chart_state.parameter_toggle[index]} class:text-white={$chart_state.parameter_toggle[index]}>\\n                    {@html parameters[index].toLowerCase().replace($chart_state.parallel_search, string => `<span class=\\"bg-orange-200\\">${string}</span>`)}\\n                    <input type=\\"checkbox\\" class=\\"hidden\\" id=\\"parameter_{index}\\" bind:checked={$chart_state.parameter_toggle[index]}>\\n                </label>\\n                {/each}\\n            </div>\\n            {:else if $current_display === \\"scatter\\"}\\n            <div class=\\"flex flex-col gap-2\\">\\n                <div class=\\"flex w-full gap-4\\">\\n                    <label for=\\"x_param_select\\" class=\\"min-w-fit\\">X-Axis</label>\\n                    <select bind:value={XY_chart_state.parameter_x} class=\\"mr-auto w-full border border-gray-200 shadow-sm text-sm text-slate-600 font-semibold p-1\\">\\n                    {#each parameters as parameter}\\n                        <option value={parameter}>{parameter}</option>\\n                    {/each}\\n                </select>\\n                </div>\\n                <div class=\\"flex w-full gap-4\\">\\n                    <label for=\\"y_param_select\\" class=\\"min-w-fit\\">Y-Axis</label>\\n                    <select bind:value={XY_chart_state.parameter_y} class=\\"mr-auto w-full border border-gray-200 shadow-sm text-sm text-slate-600 font-semibold p-1\\">\\n                    {#each parameters as parameter}\\n                        <option value={parameter}>{parameter}</option>\\n                    {/each}\\n                    </select>\\n                </div>\\n            </div>\\n            {/if}\\n        </div>\\n        {/if}\\n    </div>\\n</div>\\n\\n<style>\\n    .graph-container {\\n        scrollbar-width: thin;\\n        scrollbar-color: #3B82F6 white;\\n    }\\n\\n</style>\\n"],"names":[],"mappings":"AA+SI,+BAAiB,CACb,eAAe,CAAE,IAAI,CACrB,eAAe,CAAE,OAAO,CAAC,KAC7B"}'
};
let grid_position = "grid-column: 1 / 2; grid-row: 1 / 3;";
const Graph = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_chart_state;
  let $$unsubscribe_filter_predicates;
  let $current_display, $$unsubscribe_current_display;
  let $page, $$unsubscribe_page;
  let $$unsubscribe_display_options;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { models } = $$props;
  let { set_project } = $$props;
  let { parameters } = $$props;
  let { unit_map } = $$props;
  let { model_in_focus } = $$props;
  parameters = parameters.sort();
  const default_parameters = $page.data.metadata.captions.map((item) => item.tag_name);
  let filter_predicates = get_filter_predicates();
  $$unsubscribe_filter_predicates = subscribe(filter_predicates, (value) => value);
  let display_options = get_display_options();
  $$unsubscribe_display_options = subscribe(display_options, (value) => value);
  let chart;
  let chart_object;
  let container;
  let current_display = writable("scatter");
  $$unsubscribe_current_display = subscribe(current_display, (value) => $current_display = value);
  let configuration_active = false;
  let chart_state = writable({
    parameter_toggle: parameters.map((item) => {
      return default_parameters.includes(item);
    }),
    parallel_search: ""
  });
  $$unsubscribe_chart_state = subscribe(chart_state, (value) => value);
  chart_state.subscribe(parallel);
  ({
    parameter_x: default_parameters[0],
    parameter_y: default_parameters[1]
  });
  function parallel() {
    return;
  }
  if ($$props.models === void 0 && $$bindings.models && models !== void 0) $$bindings.models(models);
  if ($$props.set_project === void 0 && $$bindings.set_project && set_project !== void 0) $$bindings.set_project(set_project);
  if ($$props.parameters === void 0 && $$bindings.parameters && parameters !== void 0) $$bindings.parameters(parameters);
  if ($$props.unit_map === void 0 && $$bindings.unit_map && unit_map !== void 0) $$bindings.unit_map(unit_map);
  if ($$props.model_in_focus === void 0 && $$bindings.model_in_focus && model_in_focus !== void 0) $$bindings.model_in_focus(model_in_focus);
  $$result.css.add(css$1);
  {
    if (model_in_focus) {
      setTimeout(
        () => {
          chart_object.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: [...Array(models.length).keys()]
          });
          chart_object.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: models.indexOf(model_in_focus)
          });
        },
        20
      );
    }
  }
  $$unsubscribe_chart_state();
  $$unsubscribe_filter_predicates();
  $$unsubscribe_current_display();
  $$unsubscribe_page();
  $$unsubscribe_display_options();
  return `<div class="graph-container w-full h-full pb-4 flex flex-col items-center border-r-2 border-blue-500 text-base overflow-scroll svelte-1fpyntk"${add_attribute("style", grid_position, 0)}${add_attribute("this", container, 0)}><div class="mt-4 pl-2 w-full flex items-end gap-2 border-b-4 border-blue-500"><button class="p-0.5 flex items-center justify-center border-x border-t border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition ease-in-out" data-svelte-h="svelte-k0h10l"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path></svg></button> <button class="${[
    "p-0.5 px-3 flex items-center justify-center border-x border-t border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition ease-in-out font-bold",
    ($current_display == "scatter" ? "bg-blue-500" : "") + " " + ($current_display == "scatter" ? "text-white" : "")
  ].join(" ").trim()}" data-svelte-h="svelte-hrvaz6">Scatter Plot</button> <button class="${[
    "p-0.5 px-3 flex items-center justify-center border-x border-t border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition ease-in-out font-bold",
    ($current_display == "parallel" ? "bg-blue-500" : "") + " " + ($current_display == "parallel" ? "text-white" : "")
  ].join(" ").trim()}" data-svelte-h="svelte-1ljm9yq">Parallel Coordinates</button></div> <canvas class="relative"${add_attribute("this", chart, 0)}></canvas> <div class="px-4 flex flex-col gap-2 w-full"><div class="w-full flex border-b-4 border-blue-500"><label for="configure_checkbox" class="${[
    "mr-auto gap-1 px-3 py-1 flex text-blue-500 font-bold border-t border-x border-blue-500 hover:bg-blue-500 hover:text-white transition ease-in-out select-none cursor-pointer",
    " "
  ].join(" ").trim()}"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path></svg>
                Configure Plot
                <input type="checkbox" id="configure_checkbox" class="hidden"${add_attribute("checked", configuration_active, 1)}></label></div> ${``}</div> </div>`;
});
const css = {
  code: "#content.svelte-f496l3{grid-area:content;display:grid;grid-template-rows:1fr 1fr;grid-template-columns:1fr 0.8fr}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import Sidepane from \\"./Sidepane.svelte\\";\\nimport Swatches from \\"./Swatches.svelte\\";\\nimport { writable } from \\"svelte/store\\";\\nimport Graph from \\"./Graph.svelte\\";\\nimport { get_display_options, get_filter_predicates, set_display_options } from \\"$lib/context\\";\\nexport let data;\\nlet filter_predicates = get_filter_predicates();\\nlet display_options = get_display_options();\\n$: $display_options = {\\n  sidepane: false,\\n  grid: true,\\n  filter: false,\\n  graph: false\\n};\\ndisplay_options.subscribe((options) => {\\n  if (!options.graph)\\n    $filter_predicates.chart_predicate = [];\\n});\\nlet caption_tags;\\nconst default_caption_tags = [{ tag_name: \\"scoped_id\\", display_name: \\"Solution ID\\" }];\\n$: caption_tags = data.project.metadata.captions;\\n$: if (data.project.metadata.captions.length === 0) {\\n  caption_tags = default_caption_tags;\\n}\\nlet filtered_models;\\nlet unit_map = {};\\n$: {\\n  data.project.variable_metadata.forEach((meta) => {\\n    unit_map[meta[\\"field_name\\"]] = meta[\\"field_unit\\"];\\n  });\\n  data.project.output_metadata.forEach((meta) => {\\n    unit_map[meta[\\"field_name\\"]] = meta[\\"field_unit\\"];\\n  });\\n}\\nlet model_in_focus;\\nfunction set_project(model_id) {\\n  let model = data.models.filter((model_object) => model_object.id === model_id)[0];\\n  model_in_focus = model;\\n  $display_options.sidepane = true;\\n}\\n<\/script>\\n\\n<!-- Main Data Display -->\\n<div id=\\"content\\" class=\\"w-[100vw] overflow-scroll overflow-x-hidden text-sm\\">\\n    <!-- Graph Area -->\\n    {#if $display_options.graph}\\n    <Graph models={data.models} parameters={\\n        data.project.variable_metadata\\n        .map((meta) => meta.field_name)\\n        .concat(\\n            data.project.output_metadata.map(\\n                (meta) => meta.field_name,\\n            ),\\n        )}\\n        set_project={set_project}\\n        unit_map={unit_map}\\n        model_in_focus={model_in_focus}\\n    />\\n    {/if}\\n\\n    <!-- Item Select area -->\\n    <Swatches\\n        allowed_tags={data.project.assets.map(asset => asset.tag)}\\n        models={data.models}\\n        project_metadata={data.project}\\n        set_project={set_project}\\n        caption_tags={caption_tags}\\n        unit_map={unit_map}\\n        bind:filtered_models={filtered_models}\\n    />\\n\\n    {#if $display_options.sidepane}\\n    <!-- Sidepane Block -->\\n    <Sidepane\\n        bind:model={model_in_focus}\\n        allowed_tags={data.project.assets.map(asset => asset.tag)}\\n        unit_map={unit_map}\\n    />\\n    {/if}\\n</div>\\n<!-- End of Main Data Display -->\\n\\n<style>\\n    #content {\\n        grid-area: content;\\n        display: grid;\\n        grid-template-rows: 1fr 1fr;\\n        grid-template-columns: 1fr 0.8fr;\\n    }\\n</style>\\n\\n"],"names":[],"mappings":"AAmFI,sBAAS,CACL,SAAS,CAAE,OAAO,CAClB,OAAO,CAAE,IAAI,CACb,kBAAkB,CAAE,GAAG,CAAC,GAAG,CAC3B,qBAAqB,CAAE,GAAG,CAAC,KAC/B"}'
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $display_options, $$unsubscribe_display_options;
  let $filter_predicates, $$unsubscribe_filter_predicates;
  let { data } = $$props;
  let filter_predicates = get_filter_predicates();
  $$unsubscribe_filter_predicates = subscribe(filter_predicates, (value) => $filter_predicates = value);
  let display_options = get_display_options();
  $$unsubscribe_display_options = subscribe(display_options, (value) => $display_options = value);
  display_options.subscribe((options) => {
    if (!options.graph) set_store_value(filter_predicates, $filter_predicates.chart_predicate = [], $filter_predicates);
  });
  let caption_tags;
  const default_caption_tags = [
    {
      tag_name: "scoped_id",
      display_name: "Solution ID"
    }
  ];
  let filtered_models;
  let unit_map = {};
  let model_in_focus;
  function set_project(model_id) {
    let model = data.models.filter((model_object) => model_object.id === model_id)[0];
    model_in_focus = model;
    set_store_value(display_options, $display_options.sidepane = true, $display_options);
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    set_store_value(
      display_options,
      $display_options = {
        sidepane: false,
        grid: true,
        filter: false,
        graph: false
      },
      $display_options
    );
    caption_tags = data.project.metadata.captions;
    {
      if (data.project.metadata.captions.length === 0) {
        caption_tags = default_caption_tags;
      }
    }
    {
      {
        data.project.variable_metadata.forEach((meta) => {
          unit_map[meta["field_name"]] = meta["field_unit"];
        });
        data.project.output_metadata.forEach((meta) => {
          unit_map[meta["field_name"]] = meta["field_unit"];
        });
      }
    }
    $$rendered = ` <div id="content" class="w-[100vw] overflow-scroll overflow-x-hidden text-sm svelte-f496l3"> ${$display_options.graph ? `${validate_component(Graph, "Graph").$$render(
      $$result,
      {
        models: data.models,
        parameters: data.project.variable_metadata.map((meta) => meta.field_name).concat(data.project.output_metadata.map((meta) => meta.field_name)),
        set_project,
        unit_map,
        model_in_focus
      },
      {},
      {}
    )}` : ``}  ${validate_component(Swatches, "Swatches").$$render(
      $$result,
      {
        allowed_tags: data.project.assets.map((asset) => asset.tag),
        models: data.models,
        project_metadata: data.project,
        set_project,
        caption_tags,
        unit_map,
        filtered_models
      },
      {
        filtered_models: ($$value) => {
          filtered_models = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${$display_options.sidepane ? ` ${validate_component(Sidepane, "Sidepane").$$render(
      $$result,
      {
        allowed_tags: data.project.assets.map((asset) => asset.tag),
        unit_map,
        model: model_in_focus
      },
      {
        model: ($$value) => {
          model_in_focus = $$value;
          $$settled = false;
        }
      },
      {}
    )}` : ``}</div> `;
  } while (!$$settled);
  $$unsubscribe_display_options();
  $$unsubscribe_filter_predicates();
  return $$rendered;
});
export {
  Page as default
};
