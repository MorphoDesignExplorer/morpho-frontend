import { c as create_ssr_component, b as add_attribute, e as each, v as validate_component, d as escape } from "./ssr.js";
import { Parser, HtmlRenderer } from "commonmark";
import { P as ProseMirror } from "./ProseMirror.js";
const DocumentForm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { form } = $$props;
  let { documentList } = $$props;
  new Parser();
  new HtmlRenderer();
  if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
  if ($$props.documentList === void 0 && $$bindings.documentList && documentList !== void 0) $$bindings.documentList(documentList);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="flex items-center gap-2 border-l-4 border-gray-500 bg-gray-100 p-2 text-sm"><span class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs" data-svelte-h="svelte-ddcq1u"><span class="text-sm">Document Title</span> <span class="text-gray-500 font-normal">Title of the Document</span></span> <input type="text" class="w-full bg-gray-50 p-1"${add_attribute("value", form.form.title, 0)}></div> <div class="flex items-center gap-2 border-l-4 border-gray-500 bg-gray-100 p-2 text-sm"><span class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs" data-svelte-h="svelte-i4wcpz"><span class="text-sm">Document Parent</span> <span class="text-gray-500 font-normal">Parent that the document is nested under.</span></span> <select class="w-full bg-gray-50 p-1"><option value="" data-svelte-h="svelte-146mj9d">No Parent</option>${each(documentList, (listdoc) => {
      return `<option${add_attribute("value", listdoc.slug, 0)}>${escape(listdoc.slug)}</option>`;
    })}</select></div> <div class="flex flex-col items-center gap-2 border-l-4 border-gray-500 bg-gray-100 p-2 text-sm mr-[-40%] mb-20"><span class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs" data-svelte-h="svelte-79qjss"><span class="text-sm">Description</span> <span class="text-gray-500 font-normal">Edit the content on the about page.</span></span> <div class="flex w-full">${validate_component(ProseMirror, "ProseMirror").$$render(
      $$result,
      { text: form.form.text },
      {
        text: ($$value) => {
          form.form.text = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div></div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  DocumentForm as D
};
