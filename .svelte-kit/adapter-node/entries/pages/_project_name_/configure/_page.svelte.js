import { c as create_ssr_component, l as createEventDispatcher, b as add_attribute, g as spread, d as escape, h as escape_attribute_value, i as escape_object, e as each, v as validate_component, m as missing_component, n as get_store_value, a as subscribe } from "../../../../chunks/ssr.js";
import { w as writable } from "../../../../chunks/index.js";
import { p as page } from "../../../../chunks/stores.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import "diff";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
function debounce(cb, wait = 1e3) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => cb(...args), wait);
  };
}
function areEqualSets(a, b) {
  if (a.size !== b.size)
    return false;
  const aClone = new Set(a);
  const bClone = new Set(b);
  for (const elem of aClone) {
    bClone.add(elem);
    if (bClone.size !== b.size)
      return false;
  }
  for (const elem of bClone) {
    aClone.add(elem);
    if (aClone.size !== a.size)
      return false;
  }
  return true;
}
function mergeDefaultInterface(partial, def) {
  if (!partial)
    return def;
  const final = { ...def };
  Object.entries(partial).forEach(([key, value]) => {
    final[key] = value;
  });
  return final;
}
class CustomEvent extends Event {
  detail;
  constructor(message, data) {
    super(message, data);
    this.detail = data.detail;
  }
}
const css$4 = {
  code: ".carta-renderer.svelte-r6n2gn{position:relative;word-wrap:break-word;word-break:break-word}",
  map: '{"version":3,"file":"Renderer.svelte","sources":["Renderer.svelte"],"sourcesContent":["<!--\\n\\t@component\\n\\tThis component wraps the Carta renderer and provides a debounced rendering\\n\\tfor the editor.\\n-->\\n\\n<script>import { createEventDispatcher, onMount } from \\"svelte\\";\\nimport { debounce } from \\"../utils\\";\\nexport let carta;\\nexport let value;\\nexport let elem;\\nlet mounted = false;\\nlet renderedHtml = carta.renderSSR(value);\\nconst debouncedRenderer = debounce((value2) => {\\n  carta.render(value2).then((rendered) => {\\n    renderedHtml = \\"\\";\\n    renderedHtml = rendered;\\n  }).then(() => events(\\"render\\", void 0));\\n}, carta.rendererDebounce ?? 300);\\nconst onValueChange = (value2) => {\\n  debouncedRenderer(value2);\\n};\\n$:\\n  if (mounted)\\n    onValueChange(value);\\nonMount(() => carta.$setRenderer(elem));\\nonMount(() => mounted = true);\\nconst events = createEventDispatcher();\\n<\/script>\\n\\n<div bind:this={elem} on:scroll class=\\"carta-renderer markdown-body\\">\\n\\t<!-- eslint-disable-next-line svelte/no-at-html-tags -->\\n\\t{@html renderedHtml}\\n\\t{#if mounted}\\n\\t\\t<slot />\\n\\t{/if}\\n</div>\\n\\n<style>\\n\\t.carta-renderer {\\n\\t\\tposition: relative;\\n\\t\\tword-wrap: break-word;\\n\\t\\tword-break: break-word;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAuCC,6BAAgB,CACf,QAAQ,CAAE,QAAQ,CAClB,SAAS,CAAE,UAAU,CACrB,UAAU,CAAE,UACb"}'
};
const Renderer$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { carta } = $$props;
  let { value } = $$props;
  let { elem } = $$props;
  let renderedHtml = carta.renderSSR(value);
  debounce(
    (value2) => {
      carta.render(value2).then((rendered) => {
        renderedHtml = "";
        renderedHtml = rendered;
      }).then(() => events("render", void 0));
    },
    carta.rendererDebounce ?? 300
  );
  const events = createEventDispatcher();
  if ($$props.carta === void 0 && $$bindings.carta && carta !== void 0) $$bindings.carta(carta);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.elem === void 0 && $$bindings.elem && elem !== void 0) $$bindings.elem(elem);
  $$result.css.add(css$4);
  return `  <div class="carta-renderer markdown-body svelte-r6n2gn"${add_attribute("this", elem, 0)}> <!-- HTML_TAG_START -->${renderedHtml}<!-- HTML_TAG_END --> ${``} </div>`;
});
const css$3 = {
  code: ".carta-input.svelte-1fa8oqk{position:relative}.carta-input-wrapper.svelte-1fa8oqk{position:relative;font-family:monospace;min-height:100%}textarea.svelte-1fa8oqk{position:relative;width:100%;max-width:100%;overflow-y:hidden;resize:none;padding:0;margin:0;border:0;color:transparent;background:transparent;outline:none;-moz-tab-size:4;-o-tab-size:4;tab-size:4}.carta-highlight.svelte-1fa8oqk{position:absolute;left:0;right:0;top:0;bottom:0;margin:0;-webkit-user-select:none;-moz-user-select:none;user-select:none;height:-moz-fit-content;height:fit-content;padding:inherit;margin:inherit;word-wrap:break-word;white-space:pre-wrap;word-break:break-word}.carta-highlight .shiki{margin:0;-moz-tab-size:4;-o-tab-size:4;tab-size:4;background-color:transparent !important}.carta-highlight *{font-family:inherit;font-size:inherit;word-wrap:break-word;white-space:pre-wrap;word-break:break-word}#editor-unfocus-suggestion.svelte-1fa8oqk{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);border:0}",
  map: '{"version":3,"file":"Input.svelte","sources":["Input.svelte"],"sourcesContent":["<!--\\n\\t@component\\n\\tA wrapped textarea component integrated with Carta. It handles the highlighting\\n\\tand propagates events to the Carta instance.\\t\\n-->\\n\\n<script>import { onMount } from \\"svelte\\";\\nimport { debounce } from \\"../utils\\";\\nimport { BROWSER } from \\"esm-env\\";\\nimport { speculativeHighlightUpdate } from \\"../speculative\\";\\nexport let carta;\\nexport let value = \\"\\";\\nexport let placeholder = \\"\\";\\nexport let elem;\\nexport let props = {};\\nlet textarea;\\nlet highlightElem;\\nlet wrapperElem;\\nlet highlighted = value;\\nlet mounted = false;\\nlet prevValue = value;\\nexport const resize = () => {\\n  if (!mounted || !textarea)\\n    return;\\n  textarea.style.height = \\"0\\";\\n  textarea.style.minHeight = \\"0\\";\\n  textarea.style.height = textarea.scrollHeight + \\"px\\";\\n  textarea.style.minHeight = wrapperElem.clientHeight + \\"px\\";\\n  textarea.scrollTop = 0;\\n  const isFocused = document.activeElement === textarea;\\n  if (!isFocused)\\n    return;\\n  if (!carta.input)\\n    return;\\n  const coords = carta.input.getCursorXY();\\n  if (!coords)\\n    return;\\n  if (coords.top < 0 || coords.top + carta.input.getRowHeight() >= elem.scrollTop + elem.clientHeight)\\n    elem.scrollTo({ top: coords?.top, behavior: \\"instant\\" });\\n};\\nconst focus = () => {\\n  const selectedText = window.getSelection()?.toString();\\n  if (selectedText)\\n    return;\\n  textarea?.focus();\\n};\\nconst highlight = async (text) => {\\n  const highlighter = await carta.highlighter();\\n  if (!highlighter)\\n    return;\\n  let html;\\n  const hl = await import(\\"../highlight\\");\\n  const { isSingleTheme } = hl;\\n  if (isSingleTheme(highlighter.theme)) {\\n    html = highlighter.codeToHtml(text, {\\n      lang: highlighter.lang,\\n      theme: highlighter.theme\\n    });\\n  } else {\\n    html = highlighter.codeToHtml(text, {\\n      lang: highlighter.lang,\\n      themes: highlighter.theme\\n    });\\n  }\\n  if (carta.sanitizer) {\\n    highlighted = carta.sanitizer(html);\\n  } else {\\n    highlighted = html;\\n  }\\n  requestAnimationFrame(resize);\\n};\\nconst debouncedHighlight = debounce(highlight, 250);\\nconst highlightNestedLanguages = debounce(async (text) => {\\n  const highlighter = await carta.highlighter();\\n  const hl = await import(\\"../highlight\\");\\n  const { loadNestedLanguages } = hl;\\n  if (!highlighter)\\n    return;\\n  const { updated } = await loadNestedLanguages(highlighter, text);\\n  if (updated)\\n    debouncedHighlight(text);\\n}, 300);\\nconst onValueChange = (value2) => {\\n  if (highlightElem) {\\n    speculativeHighlightUpdate(highlightElem, prevValue, value2);\\n    requestAnimationFrame(resize);\\n  }\\n  debouncedHighlight(value2);\\n  highlightNestedLanguages(value2);\\n};\\n$:\\n  if (BROWSER)\\n    onValueChange(value);\\nonMount(() => {\\n  mounted = true;\\n  requestAnimationFrame(resize);\\n});\\nonMount(() => {\\n  carta.$setInput(textarea, elem, () => {\\n    value = textarea.value;\\n  });\\n});\\n<\/script>\\n\\n<div role=\\"tooltip\\" id=\\"editor-unfocus-suggestion\\">\\n\\tPress ESC then TAB to move the focus off the field\\n</div>\\n<div\\n\\ton:click={focus}\\n\\ton:keydown={focus}\\n\\ton:scroll\\n\\trole=\\"textbox\\"\\n\\ttabindex=\\"-1\\"\\n\\tclass=\\"carta-input\\"\\n\\tbind:this={elem}\\n>\\n\\t<div class=\\"carta-input-wrapper\\" bind:this={wrapperElem}>\\n\\t\\t<div\\n\\t\\t\\tclass=\\"carta-highlight carta-font-code\\"\\n\\t\\t\\ttabindex=\\"-1\\"\\n\\t\\t\\taria-hidden=\\"true\\"\\n\\t\\t\\tbind:this={highlightElem}\\n\\t\\t>\\n\\t\\t\\t<!-- eslint-disable-line svelte/no-at-html-tags -->{@html highlighted}\\n\\t\\t</div>\\n\\n\\t\\t<textarea\\n\\t\\t\\tspellcheck=\\"false\\"\\n\\t\\t\\tclass=\\"carta-font-code\\"\\n\\t\\t\\taria-multiline=\\"true\\"\\n\\t\\t\\taria-describedby=\\"editor-unfocus-suggestion\\"\\n\\t\\t\\ttabindex=\\"0\\"\\n\\t\\t\\t{placeholder}\\n\\t\\t\\t{...props}\\n\\t\\t\\tbind:value\\n\\t\\t\\tbind:this={textarea}\\n\\t\\t\\ton:scroll={() => (textarea.scrollTop = 0)}\\n\\t\\t\\ton:keydown={() => (prevValue = value)}\\n\\t\\t/>\\n\\t</div>\\n\\n\\t{#if mounted}\\n\\t\\t<slot />\\n\\t{/if}\\n</div>\\n\\n<style>\\n\\t.carta-input {\\n\\t\\tposition: relative;\\n\\t}\\n\\n\\t.carta-input-wrapper {\\n\\t\\tposition: relative;\\n\\t\\tfont-family: monospace;\\n\\t\\tmin-height: 100%;\\n\\t}\\n\\n\\ttextarea {\\n\\t\\tposition: relative;\\n\\t\\twidth: 100%;\\n\\t\\tmax-width: 100%;\\n\\n\\t\\toverflow-y: hidden;\\n\\t\\tresize: none;\\n\\n\\t\\tpadding: 0;\\n\\t\\tmargin: 0;\\n\\t\\tborder: 0;\\n\\n\\t\\tcolor: transparent;\\n\\t\\tbackground: transparent;\\n\\n\\t\\toutline: none;\\n\\t\\t-moz-tab-size: 4;\\n\\t\\t  -o-tab-size: 4;\\n\\t\\t     tab-size: 4;\\n\\t}\\n\\n\\t.carta-highlight {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\tright: 0;\\n\\t\\ttop: 0;\\n\\t\\tbottom: 0;\\n\\t\\tmargin: 0;\\n\\t\\t-webkit-user-select: none;\\n\\t\\t   -moz-user-select: none;\\n\\t\\t        user-select: none;\\n\\t\\theight: -moz-fit-content;\\n\\t\\theight: fit-content;\\n\\n\\t\\tpadding: inherit;\\n\\t\\tmargin: inherit;\\n\\n\\t\\tword-wrap: break-word;\\n\\t\\twhite-space: pre-wrap;\\n\\t\\tword-break: break-word;\\n\\t}\\n\\n\\t:global(.carta-highlight .shiki) {\\n\\t\\tmargin: 0;\\n\\t\\t-moz-tab-size: 4;\\n\\t\\t  -o-tab-size: 4;\\n\\t\\t     tab-size: 4;\\n\\t\\tbackground-color: transparent !important;\\n\\t}\\n\\n\\t:global(.carta-highlight *) {\\n\\t\\tfont-family: inherit;\\n\\t\\tfont-size: inherit;\\n\\n\\t\\tword-wrap: break-word;\\n\\t\\twhite-space: pre-wrap;\\n\\t\\tword-break: break-word;\\n\\t}\\n\\n\\t#editor-unfocus-suggestion {\\n\\t\\tposition: absolute;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t\\tpadding: 0;\\n\\t\\tmargin: -1px;\\n\\t\\toverflow: hidden;\\n\\t\\tclip: rect(0, 0, 0, 0);\\n\\t\\tborder: 0;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAmJC,2BAAa,CACZ,QAAQ,CAAE,QACX,CAEA,mCAAqB,CACpB,QAAQ,CAAE,QAAQ,CAClB,WAAW,CAAE,SAAS,CACtB,UAAU,CAAE,IACb,CAEA,uBAAS,CACR,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,IAAI,CAEf,UAAU,CAAE,MAAM,CAClB,MAAM,CAAE,IAAI,CAEZ,OAAO,CAAE,CAAC,CACV,MAAM,CAAE,CAAC,CACT,MAAM,CAAE,CAAC,CAET,KAAK,CAAE,WAAW,CAClB,UAAU,CAAE,WAAW,CAEvB,OAAO,CAAE,IAAI,CACb,aAAa,CAAE,CAAC,CACd,WAAW,CAAE,CAAC,CACX,QAAQ,CAAE,CAChB,CAEA,+BAAiB,CAChB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CAAC,CACR,GAAG,CAAE,CAAC,CACN,MAAM,CAAE,CAAC,CACT,MAAM,CAAE,CAAC,CACT,mBAAmB,CAAE,IAAI,CACtB,gBAAgB,CAAE,IAAI,CACjB,WAAW,CAAE,IAAI,CACzB,MAAM,CAAE,gBAAgB,CACxB,MAAM,CAAE,WAAW,CAEnB,OAAO,CAAE,OAAO,CAChB,MAAM,CAAE,OAAO,CAEf,SAAS,CAAE,UAAU,CACrB,WAAW,CAAE,QAAQ,CACrB,UAAU,CAAE,UACb,CAEQ,uBAAyB,CAChC,MAAM,CAAE,CAAC,CACT,aAAa,CAAE,CAAC,CACd,WAAW,CAAE,CAAC,CACX,QAAQ,CAAE,CAAC,CAChB,gBAAgB,CAAE,WAAW,CAAC,UAC/B,CAEQ,kBAAoB,CAC3B,WAAW,CAAE,OAAO,CACpB,SAAS,CAAE,OAAO,CAElB,SAAS,CAAE,UAAU,CACrB,WAAW,CAAE,QAAQ,CACrB,UAAU,CAAE,UACb,CAEA,yCAA2B,CAC1B,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,CACX,OAAO,CAAE,CAAC,CACV,MAAM,CAAE,IAAI,CACZ,QAAQ,CAAE,MAAM,CAChB,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACtB,MAAM,CAAE,CACT"}'
};
const Input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { carta } = $$props;
  let { value = "" } = $$props;
  let { placeholder = "" } = $$props;
  let { elem } = $$props;
  let { props = {} } = $$props;
  let textarea;
  let highlightElem;
  let wrapperElem;
  let highlighted = value;
  const resize = () => {
    return;
  };
  if ($$props.carta === void 0 && $$bindings.carta && carta !== void 0) $$bindings.carta(carta);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
  if ($$props.elem === void 0 && $$bindings.elem && elem !== void 0) $$bindings.elem(elem);
  if ($$props.props === void 0 && $$bindings.props && props !== void 0) $$bindings.props(props);
  if ($$props.resize === void 0 && $$bindings.resize && resize !== void 0) $$bindings.resize(resize);
  $$result.css.add(css$3);
  return `  <div role="tooltip" id="editor-unfocus-suggestion" class="svelte-1fa8oqk" data-svelte-h="svelte-167gk2c">Press ESC then TAB to move the focus off the field</div> <div role="textbox" tabindex="-1" class="carta-input svelte-1fa8oqk"${add_attribute("this", elem, 0)}><div class="carta-input-wrapper svelte-1fa8oqk"${add_attribute("this", wrapperElem, 0)}><div class="carta-highlight carta-font-code svelte-1fa8oqk" tabindex="-1" aria-hidden="true"${add_attribute("this", highlightElem, 0)}><!-- HTML_TAG_START -->${highlighted}<!-- HTML_TAG_END --></div> <textarea${spread(
    [
      { spellcheck: "false" },
      { class: "carta-font-code" },
      { "aria-multiline": "true" },
      {
        "aria-describedby": "editor-unfocus-suggestion"
      },
      { tabindex: "0" },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      escape_object(props)
    ],
    { classes: "svelte-1fa8oqk" }
  )}${add_attribute("this", textarea, 0)}>${escape(value || "")}</textarea></div> ${``} </div>`;
});
const defaultLabels = {
  writeTab: "Write",
  previewTab: "Preview",
  iconsLabels: {}
};
const MenuIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M4 8a2 2 0 1 1-3.999.001A2 2 0 0 1 4 8m6 0a2 2 0 1 1-3.999.001A2 2 0 0 1 10 8m6 0a2 2 0 1 1-3.999.001A2 2 0 0 1 16 8"></path></svg>`;
});
const css$2 = {
  code: ".carta-toolbar.svelte-1c77udu{height:2rem;display:flex;flex-shrink:0;overflow-x:auto;overflow-y:hidden}.carta-toolbar-left.svelte-1c77udu{display:flex;align-items:center;flex-wrap:nowrap;height:100%}.carta-filler.svelte-1c77udu{flex:1}.carta-toolbar-right.svelte-1c77udu{height:100%;display:flex;align-items:center;justify-content:flex-end}.carta-icon.svelte-1c77udu{display:flex;align-items:center;justify-content:center;width:1.5rem;height:1.5rem;border-radius:3px;cursor:pointer;margin-left:4px}.carta-icon-full.svelte-1c77udu{display:flex;align-items:center;border-radius:3px;cursor:pointer}.carta-icons-menu.svelte-1c77udu{position:absolute;top:100%;right:0;display:flex;flex-direction:column;margin-right:0.5rem;z-index:1}",
  map: `{"version":3,"file":"Toolbar.svelte","sources":["Toolbar.svelte"],"sourcesContent":["<!--\\n\\t@component\\n\\tDisplays the buttons to switch tabs and the icons to interact with the editor.\\n-->\\n\\n<script>import { handleArrowKeysNavigation } from \\"../accessibility\\";\\nimport MenuIcon from \\"./icons/MenuIcon.svelte\\";\\nimport { onMount } from \\"svelte\\";\\nimport { debounce } from \\"../utils\\";\\nexport let carta;\\nexport let mode;\\nexport let tab;\\nexport let labels;\\nlet toolbar;\\nlet menu;\\nlet iconsContainer;\\nlet visibleIcons = [...carta.icons];\\nlet availableWidth = 0;\\nlet iconWidth = 0;\\nlet toolbarHeight = 0;\\nlet iconsHidden = false;\\nlet showMenu = false;\\nconst IconPadding = 8;\\nconst waitForDOMUpdate = () => new Promise(requestAnimationFrame);\\nconst onResize = debounce(async () => {\\n  if (!toolbar || !iconsContainer)\\n    return;\\n  const overflowing = () => toolbar.scrollWidth - toolbar.clientWidth > 0;\\n  while (overflowing()) {\\n    visibleIcons.pop();\\n    visibleIcons = visibleIcons;\\n    await waitForDOMUpdate();\\n  }\\n  const fitting = () => availableWidth > 2 * iconWidth + IconPadding;\\n  while (visibleIcons.length < carta.icons.length && fitting()) {\\n    visibleIcons.push(carta.icons[visibleIcons.length]);\\n    visibleIcons = visibleIcons;\\n    await waitForDOMUpdate();\\n  }\\n}, 100);\\nfunction onClick(event) {\\n  const target = event.target;\\n  if (menu && !menu.contains(target)) {\\n    showMenu = false;\\n  }\\n}\\nonMount(onResize);\\n$:\\n  iconsHidden = visibleIcons.length !== carta.icons.length;\\n<\/script>\\n\\n<svelte:window on:resize={onResize} on:click={onClick} />\\n\\n<div class=\\"carta-toolbar\\" role=\\"toolbar\\" bind:clientHeight={toolbarHeight} bind:this={toolbar}>\\n\\t<div class=\\"carta-toolbar-left\\">\\n\\t\\t{#if mode == 'tabs'}\\n\\t\\t\\t<button\\n\\t\\t\\t\\ttype=\\"button\\"\\n\\t\\t\\t\\ttabindex={0}\\n\\t\\t\\t\\tclass={tab === 'write' ? 'carta-active' : ''}\\n\\t\\t\\t\\ton:click={() => (tab = 'write')}\\n\\t\\t\\t\\ton:keydown={handleArrowKeysNavigation}\\n\\t\\t\\t>\\n\\t\\t\\t\\t{labels.writeTab}\\n\\t\\t\\t</button>\\n\\t\\t\\t<button\\n\\t\\t\\t\\ttype=\\"button\\"\\n\\t\\t\\t\\ttabindex={-1}\\n\\t\\t\\t\\tclass={tab === 'preview' ? 'carta-active' : ''}\\n\\t\\t\\t\\ton:click={() => (tab = 'preview')}\\n\\t\\t\\t\\ton:keydown={handleArrowKeysNavigation}\\n\\t\\t\\t>\\n\\t\\t\\t\\t{labels.previewTab}\\n\\t\\t\\t</button>\\n\\t\\t{/if}\\n\\t</div>\\n\\n\\t<div class=\\"carta-filler\\" bind:clientWidth={availableWidth} />\\n\\n\\t<div class=\\"carta-toolbar-right\\" bind:this={iconsContainer}>\\n\\t\\t{#if !(mode === 'tabs' && tab === 'preview')}\\n\\t\\t\\t{#each visibleIcons as icon, index}\\n\\t\\t\\t\\t{@const label = labels.iconsLabels[icon.id] ?? icon.label}\\n\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\tclass=\\"carta-icon\\"\\n\\t\\t\\t\\t\\ttabindex={index == 0 ? 0 : -1}\\n\\t\\t\\t\\t\\ttitle={label}\\n\\t\\t\\t\\t\\taria-label={label}\\n\\t\\t\\t\\t\\tbind:clientWidth={iconWidth}\\n\\t\\t\\t\\t\\ton:click|preventDefault|stopPropagation={() => {\\n\\t\\t\\t\\t\\t\\tcarta.input && icon.action(carta.input);\\n\\t\\t\\t\\t\\t\\tcarta.input?.update();\\n\\t\\t\\t\\t\\t\\tcarta.input?.textarea.focus();\\n\\t\\t\\t\\t\\t}}\\n\\t\\t\\t\\t\\ton:keydown={handleArrowKeysNavigation}\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<svelte:component this={icon.component} />\\n\\t\\t\\t\\t</button>\\n\\t\\t\\t{/each}\\n\\t\\t\\t{#if iconsHidden}\\n\\t\\t\\t\\t{@const label = labels.iconsLabels['menu'] ?? 'Menu'}\\n\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\tclass=\\"carta-icon\\"\\n\\t\\t\\t\\t\\ttabindex={-1}\\n\\t\\t\\t\\t\\ttitle={label}\\n\\t\\t\\t\\t\\taria-label={label}\\n\\t\\t\\t\\t\\ton:keydown={handleArrowKeysNavigation}\\n\\t\\t\\t\\t\\ton:click|preventDefault|stopPropagation={() => (showMenu = !showMenu)}\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<MenuIcon />\\n\\t\\t\\t\\t</button>\\n\\t\\t\\t{/if}\\n\\t\\t{/if}\\n\\t</div>\\n</div>\\n\\n{#if showMenu && iconsHidden}\\n\\t<div class=\\"carta-icons-menu\\" style=\\"top: {toolbarHeight}px;\\" bind:this={menu}>\\n\\t\\t{#each carta.icons.filter((icon) => !visibleIcons.includes(icon)) as icon}\\n\\t\\t\\t{@const label = labels.iconsLabels[icon.id] ?? icon.label}\\n\\n\\t\\t\\t<button\\n\\t\\t\\t\\tclass=\\"carta-icon-full\\"\\n\\t\\t\\t\\taria-label={label}\\n\\t\\t\\t\\ton:click|preventDefault|stopPropagation={() => {\\n\\t\\t\\t\\t\\tcarta.input && icon.action(carta.input);\\n\\t\\t\\t\\t\\tcarta.input?.update();\\n\\t\\t\\t\\t\\tcarta.input?.textarea.focus();\\n\\t\\t\\t\\t\\tshowMenu = false;\\n\\t\\t\\t\\t}}\\n\\t\\t\\t\\ton:keydown={handleArrowKeysNavigation}\\n\\t\\t\\t>\\n\\t\\t\\t\\t<svelte:component this={icon.component} />\\n\\t\\t\\t\\t<span>{label}</span>\\n\\t\\t\\t</button>\\n\\t\\t{/each}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t.carta-toolbar {\\n\\t\\theight: 2rem;\\n\\t\\tdisplay: flex;\\n\\t\\tflex-shrink: 0;\\n\\t\\toverflow-x: auto;\\n\\t\\toverflow-y: hidden;\\n\\t}\\n\\n\\t.carta-toolbar-left {\\n\\t\\tdisplay: flex;\\n\\t\\talign-items: center;\\n\\t\\tflex-wrap: nowrap;\\n\\t\\theight: 100%;\\n\\t}\\n\\n\\t.carta-filler {\\n\\t\\tflex: 1;\\n\\t}\\n\\n\\t.carta-toolbar-right {\\n\\t\\theight: 100%;\\n\\t\\tdisplay: flex;\\n\\t\\talign-items: center;\\n\\t\\tjustify-content: flex-end;\\n\\t}\\n\\n\\t.carta-icon {\\n\\t\\tdisplay: flex;\\n\\t\\talign-items: center;\\n\\t\\tjustify-content: center;\\n\\t\\twidth: 1.5rem;\\n\\t\\theight: 1.5rem;\\n\\t\\tborder-radius: 3px;\\n\\t\\tcursor: pointer;\\n\\t\\tmargin-left: 4px;\\n\\t}\\n\\n\\t.carta-icon-full {\\n\\t\\tdisplay: flex;\\n\\t\\talign-items: center;\\n\\t\\tborder-radius: 3px;\\n\\t\\tcursor: pointer;\\n\\t}\\n\\n\\t.carta-icons-menu {\\n\\t\\tposition: absolute;\\n\\t\\ttop: 100%;\\n\\t\\tright: 0;\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: column;\\n\\t\\tmargin-right: 0.5rem;\\n\\t\\tz-index: 1;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AA4IC,6BAAe,CACd,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,CAAC,CACd,UAAU,CAAE,IAAI,CAChB,UAAU,CAAE,MACb,CAEA,kCAAoB,CACnB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,MAAM,CACjB,MAAM,CAAE,IACT,CAEA,4BAAc,CACb,IAAI,CAAE,CACP,CAEA,mCAAqB,CACpB,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,QAClB,CAEA,0BAAY,CACX,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,KAAK,CAAE,MAAM,CACb,MAAM,CAAE,MAAM,CACd,aAAa,CAAE,GAAG,CAClB,MAAM,CAAE,OAAO,CACf,WAAW,CAAE,GACd,CAEA,+BAAiB,CAChB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,aAAa,CAAE,GAAG,CAClB,MAAM,CAAE,OACT,CAEA,gCAAkB,CACjB,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,IAAI,CACT,KAAK,CAAE,CAAC,CACR,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,YAAY,CAAE,MAAM,CACpB,OAAO,CAAE,CACV"}`
};
const Toolbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { carta } = $$props;
  let { mode } = $$props;
  let { tab } = $$props;
  let { labels } = $$props;
  let toolbar;
  let iconsContainer;
  let visibleIcons = [...carta.icons];
  let iconsHidden = false;
  if ($$props.carta === void 0 && $$bindings.carta && carta !== void 0) $$bindings.carta(carta);
  if ($$props.mode === void 0 && $$bindings.mode && mode !== void 0) $$bindings.mode(mode);
  if ($$props.tab === void 0 && $$bindings.tab && tab !== void 0) $$bindings.tab(tab);
  if ($$props.labels === void 0 && $$bindings.labels && labels !== void 0) $$bindings.labels(labels);
  $$result.css.add(css$2);
  iconsHidden = visibleIcons.length !== carta.icons.length;
  return `   <div class="carta-toolbar svelte-1c77udu" role="toolbar"${add_attribute("this", toolbar, 0)}><div class="carta-toolbar-left svelte-1c77udu">${mode == "tabs" ? `<button type="button"${add_attribute("tabindex", 0, 0)}${add_attribute("class", tab === "write" ? "carta-active" : "", 0)}>${escape(labels.writeTab)}</button> <button type="button"${add_attribute("tabindex", -1, 0)}${add_attribute("class", tab === "preview" ? "carta-active" : "", 0)}>${escape(labels.previewTab)}</button>` : ``}</div> <div class="carta-filler svelte-1c77udu"></div> <div class="carta-toolbar-right svelte-1c77udu"${add_attribute("this", iconsContainer, 0)}>${!(mode === "tabs" && tab === "preview") ? `${each(visibleIcons, (icon, index) => {
    let label = labels.iconsLabels[icon.id] ?? icon.label;
    return ` <button class="carta-icon svelte-1c77udu"${add_attribute("tabindex", index == 0 ? 0 : -1, 0)}${add_attribute("title", label, 0)}${add_attribute("aria-label", label, 0)}>${validate_component(icon.component || missing_component, "svelte:component").$$render($$result, {}, {}, {})} </button>`;
  })} ${iconsHidden ? (() => {
    let label = labels.iconsLabels["menu"] ?? "Menu";
    return ` <button class="carta-icon svelte-1c77udu"${add_attribute("tabindex", -1, 0)}${add_attribute("title", label, 0)}${add_attribute("aria-label", label, 0)}>${validate_component(MenuIcon, "MenuIcon").$$render($$result, {}, {}, {})}</button>`;
  })() : ``}` : ``}</div></div> ${``}`;
});
const css$1 = {
  code: ".carta-editor.svelte-11jlii3{position:relative;display:flex;flex-direction:column}.carta-container.mode-split > *{width:50%}.carta-container.mode-tabs > *{width:100%}.carta-container.svelte-11jlii3{display:flex;position:relative}",
  map: `{"version":3,"file":"MarkdownEditor.svelte","sources":["MarkdownEditor.svelte"],"sourcesContent":["<!--\\n\\t@component\\n\\tThis is the main editor component that combines the input and renderer\\n\\tcomponents. It also handles the scroll synchronization between the input and renderer\\n\\tcomponents (if set to sync), and the window mode management (tabs or split).\\n-->\\n\\n<script>import { onMount } from \\"svelte\\";\\nimport Renderer from \\"./internal/components/Renderer.svelte\\";\\nimport Input from \\"./internal/components/Input.svelte\\";\\nimport { debounce } from \\"./internal/utils\\";\\nimport { defaultLabels } from \\"./internal/labels\\";\\nimport Toolbar from \\"./internal/components/Toolbar.svelte\\";\\nexport let carta;\\nexport let theme = \\"default\\";\\nexport let value = \\"\\";\\nexport let mode = \\"auto\\";\\nexport let scroll = \\"sync\\";\\nexport let disableToolbar = false;\\nexport let placeholder = \\"\\";\\nexport let textarea = {};\\nexport let selectedTab = \\"write\\";\\nlet userLabels = {};\\nexport { userLabels as labels };\\nconst labels = {\\n  ...defaultLabels,\\n  ...userLabels\\n};\\nlet width;\\nlet windowMode;\\nlet mounted = false;\\nlet resizeInput;\\nlet editorElem;\\nlet inputElem;\\nlet rendererElem;\\nlet currentlyScrolling;\\nlet currentScrollPercentage = 0;\\n$: {\\n  windowMode = mode === \\"auto\\" ? width > 768 ? \\"split\\" : \\"tabs\\" : mode;\\n}\\n$: {\\n  windowMode;\\n  resizeInput && resizeInput();\\n}\\n$: {\\n  inputElem, rendererElem;\\n  loadScrollPosition(selectedTab);\\n}\\nfunction calculateScrollPercentage(elem) {\\n  const scrolledAvbSpace = elem.scrollHeight - elem.clientHeight;\\n  const scrolledAmount = elem.scrollTop * (1 + elem.clientHeight / scrolledAvbSpace);\\n  return scrolledAmount / elem.scrollHeight;\\n}\\nconst clearCurrentlyScrolling = debounce(() => {\\n  currentlyScrolling = null;\\n}, 1e3);\\nfunction handleScroll(e) {\\n  const [scrolled, target] = e.target == inputElem ? [inputElem, rendererElem] : [rendererElem, inputElem];\\n  if (windowMode != \\"split\\")\\n    return;\\n  if (scroll != \\"sync\\")\\n    return;\\n  synchronizeScroll(scrolled, target);\\n}\\nfunction synchronizeScroll(scrolled, target) {\\n  const percentage = calculateScrollPercentage(scrolled);\\n  currentScrollPercentage = percentage;\\n  if (currentlyScrolling && currentlyScrolling != scrolled)\\n    return;\\n  currentlyScrolling = scrolled;\\n  const targetAvbSpace = target.scrollHeight - target.clientHeight;\\n  target.scrollTo({ top: percentage * targetAvbSpace, behavior: \\"smooth\\" });\\n  clearCurrentlyScrolling();\\n}\\nfunction loadScrollPosition(tab) {\\n  if (windowMode !== \\"tabs\\")\\n    return;\\n  const elem = tab === \\"write\\" ? inputElem : rendererElem;\\n  if (!elem)\\n    return;\\n  const avbSpace = elem.scrollHeight - elem.clientHeight;\\n  elem.scroll({ top: avbSpace * currentScrollPercentage, behavior: \\"instant\\" });\\n}\\nonMount(() => carta.$setElement(editorElem));\\nonMount(() => mounted = true);\\n<\/script>\\n\\n<div bind:this={editorElem} bind:clientWidth={width} class=\\"carta-editor carta-theme__{theme}\\">\\n\\t{#if !disableToolbar}\\n\\t\\t<Toolbar {carta} {labels} mode={windowMode} bind:tab={selectedTab} />\\n\\t{/if}\\n\\n\\t<div class=\\"carta-wrapper\\">\\n\\t\\t<div class=\\"carta-container mode-{windowMode}\\">\\n\\t\\t\\t{#if windowMode == 'split' || selectedTab == 'write'}\\n\\t\\t\\t\\t<Input\\n\\t\\t\\t\\t\\t{carta}\\n\\t\\t\\t\\t\\t{placeholder}\\n\\t\\t\\t\\t\\tprops={textarea}\\n\\t\\t\\t\\t\\tbind:value\\n\\t\\t\\t\\t\\tbind:resize={resizeInput}\\n\\t\\t\\t\\t\\tbind:elem={inputElem}\\n\\t\\t\\t\\t\\ton:scroll={handleScroll}\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<!-- Input extensions components -->\\n\\t\\t\\t\\t\\t{#if mounted}\\n\\t\\t\\t\\t\\t\\t{#each carta.components.filter(({ parent }) => [parent]\\n\\t\\t\\t\\t\\t\\t\\t\\t.flat()\\n\\t\\t\\t\\t\\t\\t\\t\\t.includes('input')) as { component, props }}\\n\\t\\t\\t\\t\\t\\t\\t<svelte:component this={component} {carta} {...props} />\\n\\t\\t\\t\\t\\t\\t{/each}\\n\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t</Input>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if windowMode == 'split' || selectedTab == 'preview'}\\n\\t\\t\\t\\t<Renderer\\n\\t\\t\\t\\t\\t{carta}\\n\\t\\t\\t\\t\\t{value}\\n\\t\\t\\t\\t\\tbind:elem={rendererElem}\\n\\t\\t\\t\\t\\ton:scroll={handleScroll}\\n\\t\\t\\t\\t\\ton:render={() => {\\n\\t\\t\\t\\t\\t\\tif (windowMode != 'split') return;\\n\\t\\t\\t\\t\\t\\tif (scroll != 'sync') return;\\n\\t\\t\\t\\t\\t\\tsynchronizeScroll(inputElem, rendererElem);\\n\\t\\t\\t\\t\\t}}\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<!-- Renderer extensions components -->\\n\\t\\t\\t\\t\\t{#if mounted}\\n\\t\\t\\t\\t\\t\\t{#each carta.components.filter(({ parent }) => [parent]\\n\\t\\t\\t\\t\\t\\t\\t\\t.flat()\\n\\t\\t\\t\\t\\t\\t\\t\\t.includes('renderer')) as { component, props }}\\n\\t\\t\\t\\t\\t\\t\\t<svelte:component this={component} {carta} {...props} />\\n\\t\\t\\t\\t\\t\\t{/each}\\n\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t</Renderer>\\n\\t\\t\\t{/if}\\n\\t\\t</div>\\n\\t</div>\\n\\n\\t<!-- Editor extensions components -->\\n\\t<!-- prevent loading components on ssr renderings -->\\n\\t{#if mounted}\\n\\t\\t{#each carta.components.filter(({ parent }) => [parent]\\n\\t\\t\\t\\t.flat()\\n\\t\\t\\t\\t.includes('editor')) as { component, props }}\\n\\t\\t\\t<svelte:component this={component} {carta} {...props} />\\n\\t\\t{/each}\\n\\t{/if}\\n</div>\\n\\n<style>\\n\\t.carta-editor {\\n\\t\\tposition: relative;\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: column;\\n\\t}\\n\\n\\t:global(.carta-container.mode-split > *) {\\n\\t\\twidth: 50%;\\n\\t}\\n\\n\\t:global(.carta-container.mode-tabs > *) {\\n\\t\\twidth: 100%;\\n\\t}\\n\\n\\t.carta-container {\\n\\t\\tdisplay: flex;\\n\\t\\tposition: relative;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAuJC,4BAAc,CACb,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MACjB,CAEQ,+BAAiC,CACxC,KAAK,CAAE,GACR,CAEQ,8BAAgC,CACvC,KAAK,CAAE,IACR,CAEA,+BAAiB,CAChB,OAAO,CAAE,IAAI,CACb,QAAQ,CAAE,QACX"}`
};
const MarkdownEditor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { carta } = $$props;
  let { theme = "default" } = $$props;
  let { value = "" } = $$props;
  let { mode = "auto" } = $$props;
  let { scroll = "sync" } = $$props;
  let { disableToolbar = false } = $$props;
  let { placeholder = "" } = $$props;
  let { textarea = {} } = $$props;
  let { selectedTab = "write" } = $$props;
  let { labels: userLabels = {} } = $$props;
  const labels = { ...defaultLabels, ...userLabels };
  let windowMode;
  let resizeInput;
  let editorElem;
  let inputElem;
  let rendererElem;
  let currentScrollPercentage = 0;
  function loadScrollPosition(tab) {
    if (windowMode !== "tabs") return;
    const elem = tab === "write" ? inputElem : rendererElem;
    if (!elem) return;
    const avbSpace = elem.scrollHeight - elem.clientHeight;
    elem.scroll({
      top: avbSpace * currentScrollPercentage,
      behavior: "instant"
    });
  }
  if ($$props.carta === void 0 && $$bindings.carta && carta !== void 0) $$bindings.carta(carta);
  if ($$props.theme === void 0 && $$bindings.theme && theme !== void 0) $$bindings.theme(theme);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.mode === void 0 && $$bindings.mode && mode !== void 0) $$bindings.mode(mode);
  if ($$props.scroll === void 0 && $$bindings.scroll && scroll !== void 0) $$bindings.scroll(scroll);
  if ($$props.disableToolbar === void 0 && $$bindings.disableToolbar && disableToolbar !== void 0) $$bindings.disableToolbar(disableToolbar);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
  if ($$props.textarea === void 0 && $$bindings.textarea && textarea !== void 0) $$bindings.textarea(textarea);
  if ($$props.selectedTab === void 0 && $$bindings.selectedTab && selectedTab !== void 0) $$bindings.selectedTab(selectedTab);
  if ($$props.labels === void 0 && $$bindings.labels && userLabels !== void 0) $$bindings.labels(userLabels);
  $$result.css.add(css$1);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      {
        windowMode = mode === "auto" ? "tabs" : mode;
      }
    }
    {
      {
        resizeInput && resizeInput();
      }
    }
    {
      {
        loadScrollPosition(selectedTab);
      }
    }
    $$rendered = `  <div class="${"carta-editor carta-theme__" + escape(theme, true) + " svelte-11jlii3"}"${add_attribute("this", editorElem, 0)}>${!disableToolbar ? `${validate_component(Toolbar, "Toolbar").$$render(
      $$result,
      {
        carta,
        labels,
        mode: windowMode,
        tab: selectedTab
      },
      {
        tab: ($$value) => {
          selectedTab = $$value;
          $$settled = false;
        }
      },
      {}
    )}` : ``} <div class="carta-wrapper"><div class="${"carta-container mode-" + escape(windowMode, true) + " svelte-11jlii3"}">${windowMode == "split" || selectedTab == "write" ? `${validate_component(Input, "Input").$$render(
      $$result,
      {
        carta,
        placeholder,
        props: textarea,
        value,
        resize: resizeInput,
        elem: inputElem
      },
      {
        value: ($$value) => {
          value = $$value;
          $$settled = false;
        },
        resize: ($$value) => {
          resizeInput = $$value;
          $$settled = false;
        },
        elem: ($$value) => {
          inputElem = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return ` ${``}`;
        }
      }
    )}` : ``} ${windowMode == "split" || selectedTab == "preview" ? `${validate_component(Renderer$1, "Renderer").$$render(
      $$result,
      { carta, value, elem: rendererElem },
      {
        elem: ($$value) => {
          rendererElem = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return ` ${``}`;
        }
      }
    )}` : ``}</div></div>   ${``} </div>`;
  } while (!$$settled);
  return $$rendered;
});
const defaultHistoryOptions = {
  minInterval: 300,
  maxSize: 1e6
};
class TextAreaHistory {
  states = [];
  currentIndex = -1;
  // Only <= 0 numbers
  options;
  constructor(options) {
    this.options = mergeDefaultInterface(options, defaultHistoryOptions);
  }
  /**
   * Rollback to the previous state.
   * @returns The previous state, if any.
   */
  undo() {
    if (-this.currentIndex > this.states.length)
      return;
    const prev = this.states.at(this.currentIndex - 1);
    if (!prev)
      return void 0;
    this.currentIndex--;
    return prev;
  }
  /**
   * Move forward one state.
   * @returns The successive value, if any.
   */
  redo() {
    if (this.currentIndex >= -1)
      return;
    const next = this.states.at(this.currentIndex + 1);
    if (!next)
      return void 0;
    this.currentIndex++;
    return next;
  }
  /**
   * Get current stored history in bytes.
   */
  getSize = () => this.states.reduce((acc, curr) => acc + curr.value.length * 2, 0);
  /**
   * Save a value into history.
   * @param value The value to save.
   * @param cursor Cursor position.
   */
  saveState(value, cursor) {
    const latest = this.states.at(-1);
    if (latest?.value === value)
      return;
    if (this.currentIndex < -1) {
      this.states = this.states.slice(0, this.currentIndex + 1);
    }
    this.currentIndex = -1;
    if (latest && Date.now() - latest.timestamp.getTime() <= (this.options.minInterval ?? 300)) {
      this.states.pop();
    }
    let size = this.getSize();
    this.states.push({
      timestamp: /* @__PURE__ */ new Date(),
      cursor,
      value
    });
    size += value.length * 2;
    while (size > (this.options.maxSize ?? 1e6)) {
      const removed = this.states.shift();
      if (!removed)
        break;
      size -= removed.value.length * 2;
    }
  }
}
class InputEnhancer {
  textarea;
  container;
  settings;
  pressedKeys;
  escapePressed = false;
  // Used to detect keys that actually changed the textarea value
  onKeyDownValue;
  history;
  events = new EventTarget();
  constructor(textarea, container, settings) {
    this.textarea = textarea;
    this.container = container;
    this.settings = settings;
    this.pressedKeys = /* @__PURE__ */ new Set();
    textarea.addEventListener("keydown", this.handleKeyDown.bind(this));
    textarea.addEventListener("keyup", this.handleKeyUp.bind(this));
    textarea.addEventListener("focus", () => {
      this.pressedKeys.clear();
      this.escapePressed = false;
    });
    textarea.addEventListener("blur", () => {
      this.pressedKeys.clear();
    });
    textarea.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.history = new TextAreaHistory(settings.historyOpts);
    this.history.saveState(this.textarea.value, this.textarea.selectionStart);
    for (const listener of settings.listeners)
      textarea.addEventListener(...listener);
  }
  isWordCharacter(char) {
    return new RegExp(/^[a-zA-Z0-9_\-']*$/).test(char);
  }
  handleMouseDown(e) {
    const cursor = this.getSelection().start;
    const currentChar = this.textarea.value.at(cursor);
    if (e.detail == 2 && currentChar != "\n" && currentChar != " ") {
      e.preventDefault();
      const isWordChar = this.isWordCharacter(this.textarea.value[cursor]);
      let startPosition = cursor, endPosition = cursor;
      while (startPosition >= 0 && this.isWordCharacter(this.textarea.value[startPosition]) == isWordChar && this.textarea.value[startPosition] != " ")
        startPosition--;
      while (endPosition < this.textarea.value.length && this.isWordCharacter(this.textarea.value[endPosition]) == isWordChar && this.textarea.value[endPosition] != " ")
        endPosition++;
      this.textarea.setSelectionRange(startPosition + 1, endPosition);
    }
  }
  handleKeyDown(e) {
    const key = e.key.toLowerCase();
    this.pressedKeys.add(key);
    const shortcuts = this.settings.shortcuts.filter((shortcut) => areEqualSets(this.pressedKeys, shortcut.combination));
    if (shortcuts.length > 0) {
      e.preventDefault();
      if (shortcuts.length > 1) {
        console.warn(`[carta] Multiple keyboard shortcuts have the same the combination: ${this.pressedKeys}`);
      }
      for (const shortcut of shortcuts) {
        shortcut.action(this);
        if (!shortcut.preventSave)
          this.history.saveState(this.textarea.value, this.textarea.selectionStart);
        this.update();
      }
      this.onKeyDownValue = void 0;
      return;
    }
    if (key === "enter") {
      this.handleNewLine(e);
    } else if (key == "tab" && !this.escapePressed) {
      e.preventDefault();
      let matchedDelimiter = null;
      const tabOutsDelimiters = this.settings.tabOuts.map((tabOut) => tabOut.delimiter).flat();
      for (const delimiter of tabOutsDelimiters) {
        if (this.textarea.value.slice(this.textarea.selectionEnd, this.textarea.selectionEnd + delimiter.length) === delimiter) {
          matchedDelimiter = delimiter;
          break;
        }
      }
      if (matchedDelimiter) {
        const cursor = this.textarea.selectionEnd + matchedDelimiter.length;
        this.textarea.setSelectionRange(cursor, cursor);
      } else {
        if (e.shiftKey) {
          const line = this.getLine();
          const lineStart = line.start;
          const lineContent = line.value;
          const position = this.textarea.selectionStart;
          if (lineContent.startsWith("	")) {
            this.removeAt(lineStart, 1);
            this.textarea.selectionStart = position - 1;
            this.textarea.selectionEnd = position - 1;
          }
        } else {
          const position = this.textarea.selectionStart;
          this.insertAt(this.textarea.selectionStart, "	");
          this.textarea.selectionStart = position + 1;
          this.textarea.selectionEnd = position + 1;
        }
        this.update();
      }
    } else if (key === "escape") {
      this.escapePressed = true;
    }
    this.onKeyDownValue = this.textarea.value;
  }
  handleKeyUp(e) {
    const key = e.key.toLowerCase();
    this.pressedKeys.delete(key);
    if (this.onKeyDownValue !== void 0 && this.textarea.value != this.onKeyDownValue) {
      this.history.saveState(this.textarea.value, this.textarea.selectionStart);
    }
  }
  handleNewLine(e) {
    const cursor = this.textarea.selectionStart;
    let lineStartingIndex;
    for (lineStartingIndex = cursor; lineStartingIndex > 0 && this.textarea.value.at(lineStartingIndex - 1) !== "\n"; lineStartingIndex--)
      ;
    const line = this.textarea.value.slice(lineStartingIndex, cursor);
    for (const prefix of this.settings.prefixes) {
      const match = prefix.match(line);
      if (match) {
        e.preventDefault();
        const strMatch = Array.isArray(match) ? match[0] : match;
        const content = line.slice(strMatch.length).trim();
        if (content === "") {
          const line2 = this.getLine(lineStartingIndex);
          this.removeAt(lineStartingIndex, line2.value.length);
          this.textarea.setSelectionRange(line2.start, line2.start);
          this.update();
          return;
        }
        const newPrefix = prefix.maker(match, line);
        this.insertAt(cursor, "\n" + newPrefix);
        this.update();
        const newCursorPosition = cursor + newPrefix.length + 1;
        this.textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        break;
      }
    }
  }
  /**
   * Get the selected text data.
   * @returns The selection text data.
   */
  getSelection() {
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    return {
      start,
      end,
      direction: this.textarea.selectionDirection,
      slice: this.textarea.value.slice(start, end)
    };
  }
  /**
   * Get the current line, along with indices information.
   * @returns Current line info.
   */
  getLine(index = this.textarea.selectionStart) {
    let lineStartingIndex, lineEndingIndex;
    for (lineStartingIndex = index; lineStartingIndex > 0 && this.textarea.value.at(lineStartingIndex - 1) !== "\n"; lineStartingIndex--)
      ;
    for (lineEndingIndex = index; lineEndingIndex < this.textarea.value.length - 1 && this.textarea.value.at(lineEndingIndex) !== "\n"; lineEndingIndex++)
      ;
    return {
      start: lineStartingIndex,
      end: lineEndingIndex,
      value: this.textarea.value.slice(lineStartingIndex, lineEndingIndex)
    };
  }
  /**
   * Insert a string at a specific index.
   * @param position The position at which to insert the string.
   * @param string The string to insert.
   */
  insertAt(position, string) {
    const value = this.textarea.value;
    this.textarea.value = value.slice(0, position) + string + value.slice(position);
  }
  /**
   * Remove `count` characters at the provided position.
   * @param position The position to remove characters at.
   * @param count The number of characters to remove.
   */
  removeAt(position, count = 1) {
    const value = this.textarea.value;
    this.textarea.value = value.slice(0, position) + value.slice(position + count);
  }
  /**
   * Surround the current selection with a delimiter.
   * @param delimiter The string delimiter.
   */
  toggleSelectionSurrounding(delimiter) {
    const selection = this.getSelection();
    const delimiterLeft = Array.isArray(delimiter) ? delimiter[0] : delimiter;
    const delimiterRight = Array.isArray(delimiter) ? delimiter[1] : delimiter;
    const prevSection = this.textarea.value.slice(selection.start - delimiterLeft.length, selection.start);
    const nextSection = this.textarea.value.slice(selection.end, selection.end + delimiterRight.length);
    if (prevSection === delimiterLeft && nextSection === delimiterRight) {
      this.removeAt(selection.end, delimiterRight.length);
      this.removeAt(selection.start - delimiterLeft.length, delimiterLeft.length);
      this.textarea.setSelectionRange(selection.start - delimiterRight.length, selection.end - delimiterRight.length);
    } else {
      this.insertAt(selection.end, delimiterRight);
      this.insertAt(selection.start, delimiterLeft);
      this.textarea.setSelectionRange(selection.start + delimiterLeft.length, selection.end + delimiterLeft.length);
    }
  }
  /**
   * Toggle a prefix for the current line.
   * @param prefix The string prefix.
   * @param whitespace Whether to handle whitespace separations.
   */
  toggleLinePrefix(prefix, whitespace = "attach") {
    const selection = this.getSelection();
    let index = selection.start;
    while (index > 0 && this.textarea.value.at(index - 1) !== "\n")
      index--;
    let furtherLinesExist = true;
    const startLocation = selection.start;
    let endLocation = selection.end;
    while (furtherLinesExist) {
      const currentPrefix = this.textarea.value.slice(index, index + prefix.length);
      if (currentPrefix === prefix) {
        if (whitespace === "attach" && this.textarea.value.at(index + prefix.length) === " ") {
          this.removeAt(index, prefix.length + 1);
          endLocation -= prefix.length + 1;
        } else {
          this.removeAt(index, prefix.length);
          endLocation -= prefix.length;
        }
      } else {
        if (whitespace === "attach") {
          this.insertAt(index, prefix + " ");
          endLocation += prefix.length + 1;
        } else {
          this.insertAt(index, prefix);
          endLocation += prefix.length;
        }
      }
      while (index < this.textarea.value.length && this.textarea.value.at(index) !== "\n")
        index++;
      if (this.textarea.value.at(index) == "\n")
        index++;
      furtherLinesExist = index < endLocation;
    }
    this.textarea.setSelectionRange(startLocation, endLocation);
  }
  /**
   * Update the textarea.
   */
  update = () => this.events.dispatchEvent(new Event("update"));
  /**
   * Returns x, y coordinates for absolute positioning of a span within a given text input
   * at a given selection point. [Source](https://jh3y.medium.com/how-to-where-s-the-caret-getting-the-xy-position-of-the-caret-a24ba372990a)
   * @param selectionPoint The selection point for the input. Defaults at current cursor position.
   */
  getCursorXY(selectionPoint = this.textarea.selectionStart) {
    const { offsetLeft: inputX, offsetTop: inputY } = this.textarea;
    const div = document.createElement("div");
    const copyStyle = getComputedStyle(this.textarea);
    for (const prop of copyStyle) {
      div.style[prop] = copyStyle[prop];
    }
    const swap = ".";
    const inputValue = this.textarea.tagName === "INPUT" ? this.textarea.value.replace(/ /g, swap) : this.textarea.value;
    const textContent = inputValue.substr(0, selectionPoint);
    div.textContent = textContent;
    if (this.textarea.tagName === "TEXTAREA")
      div.style.height = "auto";
    if (this.textarea.tagName === "INPUT")
      div.style.width = "auto";
    const span = document.createElement("span");
    span.className += "carta-font-code";
    span.textContent = inputValue.substr(selectionPoint) || ".";
    div.appendChild(span);
    document.body.appendChild(div);
    const { offsetLeft: spanX, offsetTop: spanY } = span;
    document.body.removeChild(div);
    return {
      x: inputX + spanX,
      y: inputY + spanY,
      left: inputX + spanX,
      top: inputY + spanY,
      right: this.textarea.clientWidth - inputX,
      bottom: this.textarea.clientHeight - inputY
    };
  }
  /**
   * Moves an element next to the caret. Shall be called every time the element
   * changes width, height or the caret position changes. Consider using `bindToCaret` instead.
   *
   * @example
   * ```svelte
   * <script>
   *   // ...
   *
   *   export let carta;
   *
   *   let caretPosition;
   *   let elem;
   *
   *   onMount(() => {
   *     carta.input.addEventListener('input', handleInput);
   *   });
   *
   *   onDestroy(() => {
   *     carta.input.removeEventListener('input', handleInput);
   *   });
   *
   *   function handleInput() {
   *   	 caretPosition = carta.input.getCursorXY();
   *   }
   *
   *   $: {
   *     caretPosition, elem.clientWidth, elem.clientHeight;
   *     carta.input.moveElemToCaret(elem);
   *   }
   * <\/script>
   *
   * <div bind:this={elem}>
   *   <!-- My stuff -->
   * </div>
   * ```
   *
   * @param elem The element to move.
   */
  moveElemToCaret(elem) {
    const elemWidth = elem.clientWidth;
    const elemHeight = elem.clientHeight;
    const caretPosition = this.getCursorXY();
    const fontSize = this.getRowHeight();
    let left = caretPosition.left;
    let right;
    if (elemWidth < this.container.clientWidth && left + elemWidth - this.container.scrollLeft >= this.container.clientWidth) {
      right = this.container.clientWidth - left;
      left = void 0;
    }
    let top = caretPosition.top;
    let bottom;
    if (elemHeight < this.container.clientHeight && top + elemHeight - this.container.scrollTop >= this.container.clientHeight) {
      bottom = this.container.clientHeight - top;
      top = void 0;
    }
    elem.style.left = left !== void 0 ? left + "px" : "unset";
    elem.style.right = right !== void 0 ? right + "px" : "unset";
    elem.style.top = top !== void 0 ? top + fontSize + "px" : "unset";
    elem.style.bottom = bottom !== void 0 ? bottom + "px" : "unset";
  }
  /**
   * **Internal**: Svelte action to bind an element to the caret position.
   * Use `bindToCaret` from the `carta` instance instead.
   * @param elem The element to position.
   * @param portal The portal to append the element to. Defaults to `document.body`.
   */
  $bindToCaret(elem, data) {
    data.portal.appendChild(elem);
    const themeClass = Array.from(data.editorElement?.classList ?? []).find((c) => c.startsWith("carta-theme__"));
    elem.classList.add(themeClass ?? "carta-theme__default");
    elem.style.position = "fixed";
    const callback = () => {
      const relativePosition = this.getCursorXY();
      const absolutePosition = {
        x: relativePosition.x + this.textarea.getBoundingClientRect().left,
        y: relativePosition.y + this.textarea.getBoundingClientRect().top
      };
      const fontSize = this.getRowHeight();
      const width = elem.clientWidth;
      const height = elem.clientHeight;
      let left = absolutePosition.x;
      let right;
      if (left + width >= window.innerWidth) {
        right = window.innerWidth - left;
        left = void 0;
      }
      let top = absolutePosition.y;
      let bottom;
      if (top + height >= window.innerHeight) {
        bottom = window.innerHeight - top;
        top = void 0;
      }
      elem.style.left = left !== void 0 ? left + "px" : "unset";
      elem.style.right = right !== void 0 ? right + "px" : "unset";
      elem.style.top = top !== void 0 ? top + fontSize + "px" : "unset";
      elem.style.bottom = bottom !== void 0 ? bottom + "px" : "unset";
    };
    this.textarea.addEventListener("input", callback);
    window.addEventListener("resize", callback);
    window.addEventListener("scroll", callback);
    callback();
    return {
      destroy: () => {
        try {
          data.portal.removeChild(elem);
        } catch (e) {
        }
        this.textarea.removeEventListener("input", callback);
        window.removeEventListener("resize", callback);
        window.removeEventListener("scroll", callback);
      }
    };
  }
  /**
   * Get rough value for a row of the textarea.
   */
  getRowHeight() {
    const rawLineHeight = getComputedStyle(this.container).lineHeight;
    const lineHeight = parseFloat(rawLineHeight);
    const fontSize = parseFloat(getComputedStyle(this.container).fontSize);
    if (isNaN(lineHeight)) {
      return Math.ceil(fontSize * 1.2);
    }
    if (rawLineHeight.endsWith("em")) {
      return Math.ceil(lineHeight * fontSize);
    }
    if (rawLineHeight.endsWith("%")) {
      return Math.ceil(lineHeight / 100 * fontSize);
    }
    if (rawLineHeight.endsWith("px")) {
      return Math.ceil(lineHeight);
    }
    return Math.ceil(fontSize * lineHeight);
  }
}
const defaultKeyboardShortcuts = [
  // Bold text
  {
    id: "bold",
    combination: /* @__PURE__ */ new Set(["control", "b"]),
    action: (input) => input.toggleSelectionSurrounding("**")
  },
  // Italic text
  {
    id: "italic",
    combination: /* @__PURE__ */ new Set(["control", "i"]),
    action: (input) => input.toggleSelectionSurrounding("*")
  },
  // Quote
  {
    id: "quote",
    combination: /* @__PURE__ */ new Set(["control", "shift", ","]),
    action: (input) => input.toggleLinePrefix(">")
  },
  // Link
  {
    id: "link",
    combination: /* @__PURE__ */ new Set(["control", "k"]),
    action: (input) => {
      input.toggleSelectionSurrounding(["[", "]"]);
      const position = input.getSelection().end + 1;
      input.insertAt(position, "(url)");
      input.textarea.setSelectionRange(position + 1, position + 4);
    }
  },
  // Strikethrough
  {
    id: "strikethrough",
    combination: /* @__PURE__ */ new Set(["control", "shift", "x"]),
    action: (input) => input.toggleSelectionSurrounding("~~")
  },
  // Code
  {
    id: "code",
    combination: /* @__PURE__ */ new Set(["control", "e"]),
    action: (input) => input.toggleSelectionSurrounding("`")
  },
  // Undo
  {
    id: "undo",
    combination: /* @__PURE__ */ new Set(["control", "z"]),
    preventSave: true,
    action: (input) => {
      const previousState = input.history.undo();
      if (!previousState)
        return;
      input.textarea.value = previousState.value;
      input.textarea.selectionStart = previousState.cursor;
      input.textarea.selectionEnd = previousState.cursor;
    }
  },
  // Redo
  {
    id: "redo",
    combination: /* @__PURE__ */ new Set(["control", "y"]),
    preventSave: true,
    action: (input) => {
      const successiveValue = input.history.redo();
      if (!successiveValue)
        return;
      input.textarea.value = successiveValue.value;
      input.textarea.selectionStart = successiveValue.cursor;
      input.textarea.selectionEnd = successiveValue.cursor;
    }
  }
];
const HeadingIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M4.5 2.75a.75.75 0 0 0-1.5 0v10.5a.75.75 0 0 0 1.5 0v-4.5h7v4.5a.75.75 0 0 0 1.5 0V2.75a.75.75 0 0 0-1.5 0v4.5h-7v-4.5Z" clip-rule="evenodd"></path></svg>`;
});
const ItalicIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M6.5 2a.75.75 0 0 0 0 1.5h1.93l-2.412 9H4A.75.75 0 0 0 4 14h5.5a.75.75 0 0 0 0-1.5H7.57l2.412-9H12A.75.75 0 0 0 12 2H6.5Z" clip-rule="evenodd"></path></svg>`;
});
const BoldIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M4 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h5.5a3.5 3.5 0 0 0 1.852-6.47A3.5 3.5 0 0 0 8.5 2H4Zm4.5 5a1.5 1.5 0 1 0 0-3H5v3h3.5ZM5 9v3h4.5a1.5 1.5 0 0 0 0-3H5Z" clip-rule="evenodd"></path></svg>`;
});
const QuoteIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M1.5 3.75a.75.75 0 0 0-1.5 0v8.5a.75.75 0 0 0 1.5 0v-8.5ZM4.75 3a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Zm0 4.25a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H4.75Zm-.75 5a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd"></path></svg>`;
});
const LinkIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M9.929 3.132a2.078 2.078 0 1 1 2.94 2.94l-.65.648a.75.75 0 0 0 1.061 1.06l.649-.648a3.579 3.579 0 0 0-5.06-5.06L6.218 4.72a3.578 3.578 0 0 0 0 5.06a.75.75 0 0 0 1.061-1.06a2.078 2.078 0 0 1 0-2.94L9.93 3.132Zm-.15 3.086a.75.75 0 0 0-1.057 1.064c.816.81.818 2.13.004 2.942l-2.654 2.647a2.08 2.08 0 0 1-2.94-2.944l.647-.647a.75.75 0 0 0-1.06-1.06l-.648.647a3.58 3.58 0 0 0 5.06 5.066l2.654-2.647a3.575 3.575 0 0 0-.007-5.068Z" clip-rule="evenodd"></path></svg>`;
});
const ListBulletedIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M1 4.75a1 1 0 1 0 0-2a1 1 0 0 0 0 2ZM4.75 3a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H4.75Zm0 4.25a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H4.75Zm-.75 5a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75a.75.75 0 0 1-.75-.75ZM2 8a1 1 0 1 1-2 0a1 1 0 0 1 2 0Zm-1 5.25a1 1 0 1 0 0-2a1 1 0 0 0 0 2Z" clip-rule="evenodd"></path></svg>`;
});
const ListNumberedIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M0 2h2v4H1V3H0V2Zm1.637 9.008H0v-1h1.637a1.382 1.382 0 0 1 .803 2.506L1.76 13H3v1H0v-.972L1.859 11.7a.382.382 0 0 0-.222-.693ZM4.75 3a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H4.75Zm0 4.25a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H4.75Zm-.75 5a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd"></path></svg>`;
});
const ListTaskIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M4.78 3.28a.75.75 0 0 0-1.06-1.06L1.75 4.19l-.47-.47A.75.75 0 0 0 .22 4.78l1 1a.75.75 0 0 0 1.06 0l2.5-2.5ZM6 3.75A.75.75 0 0 1 6.75 3h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 6 3.75ZM6 8a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 6 8Zm.75 3.5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Zm-1.97-1.28a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0l-1-1a.75.75 0 1 1 1.06-1.06l.47.47l1.97-1.97a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd"></path></svg>`;
});
const CodeIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M9.424 2.023a.75.75 0 0 1 .556.904L7.48 13.42a.75.75 0 0 1-1.46-.348L8.52 2.58a.75.75 0 0 1 .904-.556ZM11.16 4.22a.75.75 0 0 1 1.06 0l3.25 3.25L16 8l-.53.53l-3.25 3.25a.75.75 0 1 1-1.06-1.06L13.88 8l-2.72-2.72a.75.75 0 0 1 0-1.06ZM4.84 5.28a.75.75 0 1 0-1.06-1.06L.53 7.47L0 8l.53.53l3.25 3.25a.75.75 0 0 0 1.06-1.06L2.12 8l2.72-2.72Z" clip-rule="evenodd"></path></svg>`;
});
const StrikethroughIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M7.886 1a3.136 3.136 0 0 0-2.41 5.144L6.4 7.25H2.75a.75.75 0 0 0 0 1.5h4.899l1.722 2.066A1.636 1.636 0 0 1 8.114 13.5H8a1.75 1.75 0 0 1-1.75-1.75a.75.75 0 0 0-1.5 0A3.25 3.25 0 0 0 8 15h.114a3.136 3.136 0 0 0 2.41-5.144L9.6 8.75h3.649a.75.75 0 0 0 0-1.5H8.351L6.63 5.184A1.636 1.636 0 0 1 7.886 2.5H8c.966 0 1.75.784 1.75 1.75a.75.75 0 0 0 1.5 0A3.25 3.25 0 0 0 8 1h-.114Z" clip-rule="evenodd"></path></svg>`;
});
const defaultIcons = [
  {
    id: "heading",
    action: (input) => input.toggleLinePrefix("###"),
    component: HeadingIcon,
    label: "Heading"
  },
  {
    id: "bold",
    action: (input) => input.toggleSelectionSurrounding("**"),
    component: BoldIcon,
    label: "Bold"
  },
  {
    id: "italic",
    action: (input) => input.toggleSelectionSurrounding("*"),
    component: ItalicIcon,
    label: "Italic"
  },
  {
    id: "strikethrough",
    action: (input) => input.toggleSelectionSurrounding("~~"),
    component: StrikethroughIcon,
    label: "Strikethrough"
  },
  {
    id: "quote",
    action: (input) => input.toggleLinePrefix(">"),
    component: QuoteIcon,
    label: "Quote"
  },
  {
    id: "code",
    action: (input) => input.toggleSelectionSurrounding("`"),
    component: CodeIcon,
    label: "Code"
  },
  {
    id: "link",
    action: (input) => {
      input.toggleSelectionSurrounding(["[", "]"]);
      const position = input.getSelection().end + 1;
      input.insertAt(position, "(url)");
      input.textarea.setSelectionRange(position + 1, position + 4);
    },
    component: LinkIcon,
    label: "Link"
  },
  {
    id: "bulletedList",
    action: (input) => input.toggleLinePrefix("- ", "detach"),
    component: ListBulletedIcon,
    label: "Bulleted list"
  },
  {
    id: "numberedList",
    action: (input) => input.toggleLinePrefix("1. ", "detach"),
    component: ListNumberedIcon,
    label: "Numbered list"
  },
  {
    id: "taskList",
    action: (input) => input.toggleLinePrefix("- [ ] ", "detach"),
    component: ListTaskIcon,
    label: "Task list"
  }
];
const matchRegexs = {
  taskList: /^(\s*)(-\s+\[)[ xX]?(\]\s+)/,
  bulletedList: /^(\s*)([-*]\s+)/,
  numberedList: /^(\s*)(\d+)(\.\s+)/,
  blockquote: /^(\s*)([> ]*[>]\s+)/
};
const defaultPrefixes = [
  {
    id: "taskList",
    match: (line) => matchRegexs.taskList.exec(line),
    maker: (prev) => `${prev[1]}${prev[2]} ${prev[3]}`
  },
  {
    id: "bulletedList",
    match: (line) => matchRegexs.bulletedList.exec(line),
    maker: (prev) => `${prev[1]}${prev[2]}`
  },
  {
    id: "numberedList",
    match: (line) => matchRegexs.numberedList.exec(line),
    maker: (prev) => `${prev[1]}${Number(prev[2]) + 1}${prev[3]}`
  },
  {
    id: "blockquote",
    match: (line) => matchRegexs.blockquote.exec(line),
    maker: (prev) => `${prev[1]}${prev[2]}`
  }
];
class Renderer {
  container;
  constructor(container) {
    this.container = container;
  }
}
const defaultTabOuts = [
  {
    id: "bold",
    delimiter: "**"
  },
  {
    id: "italic",
    delimiter: ["*", "_"]
  },
  {
    id: "link",
    delimiter: ")"
  },
  {
    id: "strikethrough",
    delimiter: "~~"
  },
  {
    id: "inline-code",
    delimiter: "`"
  },
  {
    id: "block-code",
    delimiter: "\n```"
  }
];
const cartaEvents = ["carta-render", "carta-render-ssr"];
class Carta {
  sanitizer;
  historyOptions;
  theme;
  shikiOptions;
  rehypeOptions;
  rendererDebounce;
  keyboardShortcuts;
  icons;
  prefixes;
  tabOuts;
  grammarRules;
  highlightingRules;
  textareaListeners;
  cartaListeners;
  components;
  dispatcher = new EventTarget();
  gfmOptions;
  syncProcessor;
  asyncProcessor;
  mElement;
  mInput;
  mRenderer;
  mHighlighter;
  mSyncTransformers = [];
  mAsyncTransformers = [];
  get element() {
    return this.mElement;
  }
  get input() {
    return this.mInput;
  }
  get renderer() {
    return this.mRenderer;
  }
  async highlighter() {
    if (this.mHighlighter)
      return this.mHighlighter;
    if (
      // Replaced at build time to tree-shake shiki on the server, if specified
      typeof __ENABLE_CARTA_SSR_HIGHLIGHTER__ !== "undefined" && __ENABLE_CARTA_SSR_HIGHLIGHTER__ === false
    )
      return;
    this.mHighlighter = (async () => {
      const hl = await import("../../../../chunks/highlight.js");
      const { loadHighlighter, loadDefaultTheme } = hl;
      return loadHighlighter({
        theme: this.theme ?? await loadDefaultTheme(),
        grammarRules: this.grammarRules,
        highlightingRules: this.highlightingRules,
        shiki: this.shikiOptions
      });
    })();
    return this.mHighlighter;
  }
  elementsToBind = [];
  constructor(options) {
    this.sanitizer = options?.sanitizer || void 0;
    this.historyOptions = options?.historyOptions;
    this.theme = options?.theme;
    this.shikiOptions = options?.shikiOptions;
    this.rendererDebounce = options?.rendererDebounce ?? 300;
    this.keyboardShortcuts = [];
    this.icons = [];
    this.prefixes = [];
    this.tabOuts = [];
    this.textareaListeners = [];
    this.cartaListeners = [];
    this.components = [];
    this.grammarRules = [];
    this.highlightingRules = [];
    this.rehypeOptions = options?.rehypeOptions ?? {};
    const listeners = [];
    for (const ext of options?.extensions ?? []) {
      this.keyboardShortcuts.push(...ext.shortcuts ?? []);
      this.icons.push(...ext.icons ?? []);
      this.prefixes.push(...ext.prefixes ?? []);
      this.tabOuts.push(...ext.tabOuts ?? []);
      this.components.push(...ext.components ?? []);
      this.grammarRules.push(...ext.grammarRules ?? []);
      this.highlightingRules.push(...ext.highlightingRules ?? []);
      listeners.push(...ext.listeners ?? []);
    }
    this.textareaListeners = listeners.filter((it) => !cartaEvents.includes(it[0]));
    this.cartaListeners = listeners.filter((it) => cartaEvents.includes(it[0]));
    this.cartaListeners.forEach((it) => {
      this.dispatcher.addEventListener(...it);
    });
    this.keyboardShortcuts.push(...defaultKeyboardShortcuts.filter((shortcut) => options?.disableShortcuts === true ? false : !options?.disableShortcuts?.includes(shortcut.id)));
    this.icons.unshift(...defaultIcons.filter((icon) => options?.disableIcons === true ? false : !options?.disableIcons?.includes(icon.id)));
    this.prefixes.push(...defaultPrefixes.filter((prefix) => options?.disablePrefixes === true ? false : !options?.disablePrefixes?.includes(prefix.id)));
    this.tabOuts.push(...defaultTabOuts.filter((tabOut) => options?.disableTabOuts === true ? false : !options?.disableTabOuts?.includes(tabOut.id)));
    this.mSyncTransformers = [];
    this.mAsyncTransformers = [];
    for (const ext of options?.extensions ?? []) {
      for (const transformer of ext.transformers ?? []) {
        if (transformer.execution === "sync") {
          this.mSyncTransformers.push(transformer);
        } else {
          this.mAsyncTransformers.push(transformer);
        }
      }
    }
    this.gfmOptions = options?.gfmOptions;
    this.syncProcessor = this.setupSynchronousProcessor({
      gfmOptions: this.gfmOptions,
      rehypeOptions: this.rehypeOptions
    });
    this.asyncProcessor = this.setupAsynchronousProcessor({
      gfmOptions: this.gfmOptions,
      rehypeOptions: this.rehypeOptions
    });
    for (const ext of options?.extensions ?? []) {
      if (ext.onLoad) {
        ext.onLoad({
          carta: this
        });
      }
    }
  }
  setupSynchronousProcessor({ gfmOptions, rehypeOptions }) {
    const syncProcessor = unified();
    const remarkPlugins = this.mSyncTransformers.filter((it) => it.type === "remark");
    const rehypePlugins = this.mSyncTransformers.filter((it) => it.type === "rehype");
    syncProcessor.use(remarkParse);
    syncProcessor.use(remarkGfm, gfmOptions);
    for (const plugin of remarkPlugins) {
      plugin.transform({ processor: syncProcessor, carta: this });
    }
    syncProcessor.use(remarkRehype, rehypeOptions);
    for (const plugin of rehypePlugins) {
      plugin.transform({ processor: syncProcessor, carta: this });
    }
    syncProcessor.use(rehypeStringify);
    return syncProcessor;
  }
  async setupAsynchronousProcessor({ gfmOptions, rehypeOptions }) {
    const asyncProcessor = unified();
    const remarkPlugins = [...this.mSyncTransformers, ...this.mAsyncTransformers].filter((it) => it.type === "remark");
    const rehypePlugins = [...this.mSyncTransformers, ...this.mAsyncTransformers].filter((it) => it.type === "rehype");
    asyncProcessor.use(remarkParse);
    asyncProcessor.use(remarkGfm, gfmOptions);
    for (const plugin of remarkPlugins) {
      await plugin.transform({ processor: asyncProcessor, carta: this });
    }
    asyncProcessor.use(remarkRehype, rehypeOptions);
    for (const plugin of rehypePlugins) {
      await plugin.transform({ processor: asyncProcessor, carta: this });
    }
    asyncProcessor.use(rehypeStringify);
    return asyncProcessor;
  }
  /**
   * Render markdown to html asynchronously.
   * @param markdown Markdown input.
   * @returns Rendered html.
   */
  async render(markdown) {
    if (
      // Replaced at build time to tree-shake shiki on the server, if specified
      typeof __ENABLE_CARTA_SSR_HIGHLIGHTER__ === "undefined" || __ENABLE_CARTA_SSR_HIGHLIGHTER__ === true
    ) {
      const hl = await import("../../../../chunks/highlight.js");
      const { loadNestedLanguages } = hl;
      const highlighter = await this.highlighter();
      await loadNestedLanguages(highlighter, markdown);
    }
    const processor = await this.asyncProcessor;
    const result = await processor.process(markdown);
    if (!result)
      return "";
    const dirty = String(result);
    this.dispatcher.dispatchEvent(new CustomEvent("carta-render", { detail: { carta: this } }));
    return (this.sanitizer && this.sanitizer(dirty)) ?? dirty;
  }
  /**
   * Render markdown, excluding syntax highlighting (SSR).
   * @param markdown Markdown input.
   * @returns Rendered html.
   */
  renderSSR(markdown) {
    const dirty = String(this.syncProcessor.processSync(markdown));
    if (typeof dirty != "string")
      return "";
    this.dispatcher.dispatchEvent(new CustomEvent("carta-render-ssr", { detail: { carta: this } }));
    if (this.sanitizer)
      return this.sanitizer(dirty);
    return dirty;
  }
  /**
   * **Internal**: set the editor element.
   * @param element The editor element.
   */
  $setElement(element) {
    this.mElement = element;
  }
  /**
   * **Internal**: set the input element.
   * @param textarea The input textarea element.
   * @param callback Update callback.
   */
  $setInput(textarea, container, callback) {
    const previousInput = this.input;
    this.mInput = new InputEnhancer(textarea, container, {
      shortcuts: this.keyboardShortcuts,
      prefixes: this.prefixes,
      tabOuts: this.tabOuts,
      listeners: this.textareaListeners,
      historyOpts: this.historyOptions
    });
    if (previousInput) {
      previousInput.events.removeEventListener("update", callback);
      this.mInput.history = previousInput.history;
    }
    this.mInput.events.addEventListener("update", callback);
    this.elementsToBind.forEach((it) => {
      it.callback = this.input?.$bindToCaret(it.elem, {
        portal: it.portal,
        editorElement: this.element
      }).destroy;
    });
  }
  /**
   * **Internal**: set the renderer element.
   * @param container Div container of the rendered element.
   */
  $setRenderer(container) {
    this.mRenderer = new Renderer(container);
  }
  /**
   * Bind an element to the caret position.
   * @param element The element to bind.
   * @param portal The portal element.
   * @returns The unbind function.
   *
   * @example
   * ```svelte
   * <script>
   *   export let carta;
   * <\/script>
   *
   * <div use:carta.bindToCaret>
   *   <!-- Stuff here -->
   * </div>
   *
   * ```
   */
  bindToCaret(element, portal = document.querySelector("body")) {
    let callback;
    if (this.input)
      callback = this.input.$bindToCaret(element, { portal, editorElement: this.element }).destroy;
    this.elementsToBind.push({ elem: element, portal, callback });
    return {
      destroy: () => {
        callback && callback();
        this.elementsToBind = this.elementsToBind.filter((it) => it.elem != element);
      }
    };
  }
}
const HelpText = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { help_text } = $$props;
  let info_trigger;
  if ($$props.help_text === void 0 && $$bindings.help_text && help_text !== void 0) $$bindings.help_text(help_text);
  return `<span class="w-fit flex gap-2 select-none"${add_attribute("this", info_trigger, 0)} data-svelte-h="svelte-15t2rjq"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"></path></svg></span> ${``}`;
});
const css = {
  code: '#edit-grid.svelte-c678iu{display:grid;grid-area:content;grid-template-columns:1fr 1fr;grid-template-areas:"editor misc"\n    }#misc.svelte-c678iu{grid-area:misc}#editor.svelte-c678iu{grid-area:editor}',
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { get, writable } from \\"svelte/store\\";\\nimport { page } from \\"$app/stores\\";\\nimport { applyAction, deserialize, enhance } from \\"$app/forms\\";\\nimport { invalidateAll } from \\"$app/navigation\\";\\nimport { Carta, MarkdownEditor } from \\"carta-md\\";\\nimport \\"carta-md/default.css\\";\\nimport \\"./carta.scss\\";\\nimport HelpText from \\"../../HelpText.svelte\\";\\nexport let data;\\nconst current_project = get(page).params.project_name;\\nconst parameters = [\\n  ...data.projects.filter((item) => item.project_name === current_project)[0].variable_metadata.map((item) => item.field_name),\\n  ...data.projects.filter((item) => item.project_name === current_project)[0].output_metadata.map((item) => item.field_name)\\n];\\nlet caption_form = {\\n  tag_name: \\"\\",\\n  display_name: \\"\\"\\n};\\nlet unsaved_form = false;\\nconst form_state = writable({\\n  human_name: data.metadata.human_name,\\n  captions: data.metadata.captions,\\n  editor: data.metadata.description.text\\n});\\nasync function handle_submit(event) {\\n  const response = await fetch(event.currentTarget.action, {\\n    method: \\"POST\\",\\n    body: JSON.stringify($form_state)\\n  });\\n  const result = deserialize(await response.text());\\n  if (result.type === \\"success\\") {\\n    unsaved_form = false;\\n    await invalidateAll();\\n  }\\n  applyAction(result);\\n}\\nlet dragndrop_state = {\\n  tag: \\"\\"\\n};\\nfunction dragndrop_swap(current_tag) {\\n  if (dragndrop_state.tag !== current_tag) {\\n    const from_index = $form_state.captions.findIndex((element) => element.tag_name === dragndrop_state.tag);\\n    const to_index = $form_state.captions.findIndex((element) => element.tag_name === current_tag);\\n    if (from_index !== -1) {\\n      const temp = $form_state.captions[from_index];\\n      $form_state.captions[from_index] = $form_state.captions[to_index];\\n      $form_state.captions[to_index] = temp;\\n    }\\n  }\\n}\\nconst carta = new Carta();\\nlet timeout_object = null;\\nlet form_element;\\nform_state.subscribe((value) => {\\n  if (timeout_object) {\\n    clearTimeout(timeout_object);\\n  }\\n  timeout_object = setTimeout(() => {\\n    if (form_element) {\\n      form_element.requestSubmit();\\n    }\\n  }, 1 * 1e3);\\n});\\n<\/script>\\n\\n<form id=\\"edit-grid\\" action=\\"?/configure\\" method=\\"post\\" on:submit|preventDefault={handle_submit} bind:this={form_element}>\\n    <!--\\n    <div id=\\"save-section\\" class=\\"flex justify-end items-center p-4\\">\\n        <button type=\\"submit\\" class=\\"h-fit py-1 px-3 rounded-lg flex items-center border border-blue-500 bg-white text-blue-500 hover:bg-blue-500 hover:text-white text-base transition ease-in-out\\">Save</button>\\n    </div>\\n    -->\\n    <div id=\\"editor\\" class=\\"p-4 m-4 h-fit flex flex-col gap-4 bg-blue-500 border border-blue-500\\">\\n        <p class=\\"font-bold flex items-center gap-2 text-xl text-white\\">Edit Description <HelpText help_text={\\"Edit the 'about' page of the project.\\"}/></p>\\n        <div class=\\"bg-white\\">\\n            <MarkdownEditor {carta} bind:value={$form_state.editor}/>\\n        </div>\\n    </div>\\n    <div id=\\"misc\\" class=\\"flex flex-col p-4 gap-4\\">\\n        <!-- Human Readable Name Editor-->\\n        <div class=\\"p-2 flex justify-between items-center bg-blue-500 text-white border border-blue-500 shadow-md\\">\\n            <p class=\\"font-bold capitalize text-xl\\">Project Name</p>\\n            <input type=\\"text\\" name=\\"human_name\\" class=\\"p-2 border border-gray-200 w-1/2 text-black\\" bind:value={$form_state.human_name}>\\n        </div>\\n        <!-- End Human Readable Name Editor -->\\n         <!-- Caption List -->\\n        <div class=\\"p-4 flex flex-col gap-4 justify-between items-start bg-blue-500 border border-blue-500\\">\\n            <p class=\\"flex gap-2 items-center font-bold text-xl text-white\\">Grid Objective Parameters <HelpText help_text={\\"Set the objective parameters displayed under every model in the grid.\\"}/></p>\\n            <div class=\\"flex mr-auto\\">\\n                <select class=\\"p-2 border border-gray-400\\" bind:value={caption_form.tag_name}>\\n                    <option value=\\"\\" disabled selected class=\\"text-gray-400\\">Parameter Name</option>\\n                    {#each parameters.filter(item => ($form_state.captions.filter(caption => caption.tag_name == item).length == 0)) as parameter}\\n                    <option value=\\"{parameter}\\">{parameter}</option>\\n                    {/each}\\n                </select>\\n                <input type=\\"text\\" class=\\"p-2 border-y border-gray-400\\" placeholder=\\"Human Readable Name\\" bind:value={caption_form.display_name}>\\n                <button\\n                    type=\\"button\\"\\n                    class=\\"p-2 rounded-r-lg border border-blue-500 bg-blue-500 text-white hover:bg-white hover:text-blue-500 transition ease-in-out\\"\\n                    on:click={() => {\\n                        if (caption_form.tag_name.length > 0 && caption_form.display_name.length > 0) {\\n                            $form_state.captions = [...$form_state.captions, Object.assign({}, caption_form)]\\n                            caption_form.display_name = \\"\\";\\n                            caption_form.tag_name = \\"\\";\\n                        }\\n                    }}>\\n                    Add\\n                </button>\\n            </div>\\n\\n            {#if $form_state.captions.length > 0}\\n            <div class=\\"w-full flex flex-col border-x border-t bg-white border-black text-xs\\">\\n                {#each $form_state.captions as caption, caption_idx}\\n                <div class=\\"flex gap-2 justify-between items-center border-b border-black p-2 select-none\\" on:mouseover={() => dragndrop_swap(caption.tag_name)} on:mouseup={() => {dragndrop_state.tag = \\"\\"}} class:opacity-50={dragndrop_state.tag === caption.tag_name}>\\n                    <span class=\\"cursor-move\\" on:mousedown={() => {dragndrop_state.tag = caption.tag_name}} >⠿</span>\\n                    <span class=\\"font-bold\\">{caption.tag_name}</span>\\n                    <input type=\\"text\\" bind:value={$form_state.captions[caption_idx].display_name} class=\\"ml-auto border border-gray-200 p-1\\">\\n                    <span class=\\"underline underline-offset-2 decoration-2 decoration-red-800 cursor-pointer\\" on:click={() => {$form_state.captions = $form_state.captions.filter((_, idx) => idx != caption_idx)}}>Delete</span>\\n                </div>\\n                {/each}\\n            </div>\\n            {:else}\\n            <b class=\\"font-bold text-lg\\">No captions added yet.</b>\\n            {/if}\\n        </div>\\n        <!-- End Caption List -->\\n    </div>\\n</form>\\n\\n<style lang=\\"postcss\\">\\n    #edit-grid {\\n        display: grid;\\n        grid-area: content;\\n        grid-template-columns: 1fr 1fr;\\n        grid-template-areas: \\"editor misc\\"\\n    }\\n\\n    #save-section {\\n        grid-area: misc;\\n        grid-row-start: save-section;\\n    }\\n\\n    #misc {\\n        grid-area: misc;\\n    }\\n\\n    #editor {\\n        grid-area: editor;\\n    }\\n\\n    .carta-editor {\\n        --tw-bg-opacity: 1;\\n        background-color: rgb(255 255 255 / var(--tw-bg-opacity))\\n}\\n</style>\\n"],"names":[],"mappings":"AAiII,wBAAW,CACP,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,OAAO,CAClB,qBAAqB,CAAE,GAAG,CAAC,GAAG,CAC9B,mBAAmB,CAAE,aAAa;AAC1C,IAAI,CAOA,mBAAM,CACF,SAAS,CAAE,IACf,CAEA,qBAAQ,CACJ,SAAS,CAAE,MACf"}`
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $form_state, $$unsubscribe_form_state;
  let { data } = $$props;
  const current_project = get_store_value(page).params.project_name;
  const parameters = [
    ...data.projects.filter((item) => item.project_name === current_project)[0].variable_metadata.map((item) => item.field_name),
    ...data.projects.filter((item) => item.project_name === current_project)[0].output_metadata.map((item) => item.field_name)
  ];
  let caption_form = { display_name: "" };
  const form_state = writable({
    human_name: data.metadata.human_name,
    captions: data.metadata.captions,
    editor: data.metadata.description.text
  });
  $$unsubscribe_form_state = subscribe(form_state, (value) => $form_state = value);
  let dragndrop_state = { tag: "" };
  const carta = new Carta();
  let timeout_object = null;
  let form_element;
  form_state.subscribe((value) => {
    if (timeout_object) {
      clearTimeout(timeout_object);
    }
    timeout_object = setTimeout(
      () => {
      },
      1 * 1e3
    );
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<form id="edit-grid" action="?/configure" method="post" class="svelte-c678iu"${add_attribute("this", form_element, 0)}> <div id="editor" class="p-4 m-4 h-fit flex flex-col gap-4 bg-blue-500 border border-blue-500 svelte-c678iu"><p class="font-bold flex items-center gap-2 text-xl text-white">Edit Description ${validate_component(HelpText, "HelpText").$$render(
      $$result,
      {
        help_text: "Edit the 'about' page of the project."
      },
      {},
      {}
    )}</p> <div class="bg-white">${validate_component(MarkdownEditor, "MarkdownEditor").$$render(
      $$result,
      { carta, value: $form_state.editor },
      {
        value: ($$value) => {
          $form_state.editor = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div></div> <div id="misc" class="flex flex-col p-4 gap-4 svelte-c678iu"> <div class="p-2 flex justify-between items-center bg-blue-500 text-white border border-blue-500 shadow-md"><p class="font-bold capitalize text-xl" data-svelte-h="svelte-1rjr408">Project Name</p> <input type="text" name="human_name" class="p-2 border border-gray-200 w-1/2 text-black"${add_attribute("value", $form_state.human_name, 0)}></div>   <div class="p-4 flex flex-col gap-4 justify-between items-start bg-blue-500 border border-blue-500"><p class="flex gap-2 items-center font-bold text-xl text-white">Grid Objective Parameters ${validate_component(HelpText, "HelpText").$$render(
      $$result,
      {
        help_text: "Set the objective parameters displayed under every model in the grid."
      },
      {},
      {}
    )}</p> <div class="flex mr-auto"><select class="p-2 border border-gray-400"><option value="" disabled selected class="text-gray-400" data-svelte-h="svelte-1ilnpjc">Parameter Name</option>${each(parameters.filter((item) => $form_state.captions.filter((caption) => caption.tag_name == item).length == 0), (parameter) => {
      return `<option${add_attribute("value", parameter, 0)}>${escape(parameter)}</option>`;
    })}</select> <input type="text" class="p-2 border-y border-gray-400" placeholder="Human Readable Name"${add_attribute("value", caption_form.display_name, 0)}> <button type="button" class="p-2 rounded-r-lg border border-blue-500 bg-blue-500 text-white hover:bg-white hover:text-blue-500 transition ease-in-out" data-svelte-h="svelte-1xot3cu">Add</button></div> ${$form_state.captions.length > 0 ? `<div class="w-full flex flex-col border-x border-t bg-white border-black text-xs">${each($form_state.captions, (caption, caption_idx) => {
      return `<div class="${[
        "flex gap-2 justify-between items-center border-b border-black p-2 select-none",
        dragndrop_state.tag === caption.tag_name ? "opacity-50" : ""
      ].join(" ").trim()}"><span class="cursor-move" data-svelte-h="svelte-2jiybb">⠿</span> <span class="font-bold">${escape(caption.tag_name)}</span> <input type="text" class="ml-auto border border-gray-200 p-1"${add_attribute("value", $form_state.captions[caption_idx].display_name, 0)}> <span class="underline underline-offset-2 decoration-2 decoration-red-800 cursor-pointer" data-svelte-h="svelte-4lybqu">Delete</span> </div>`;
    })}</div>` : `<b class="font-bold text-lg" data-svelte-h="svelte-1cone25">No captions added yet.</b>`}</div> </div> </form>`;
  } while (!$$settled);
  $$unsubscribe_form_state();
  return $$rendered;
});
export {
  Page as default
};
