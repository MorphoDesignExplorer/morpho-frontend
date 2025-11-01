import { c as create_ssr_component, a as subscribe, v as validate_component, b as add_attribute, d as escape } from "../../../../../../chunks/ssr.js";
import { w as writable } from "../../../../../../chunks/index.js";
import { D as DocumentForm } from "../../../../../../chunks/DocumentForm.js";
import "@sveltejs/kit";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../chunks/state.svelte.js";
import { M as Modal } from "../../../../../../chunks/Modal.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $formData, $$unsubscribe_formData;
  let { data } = $$props;
  let { form } = $$props;
  const formData = writable({
    type: "document",
    form: {
      title: data.document.title,
      text: data.document.text,
      id: data.document.id,
      parent: data.document.parent
    }
  });
  $$unsubscribe_formData = subscribe(formData, (value) => $formData = value);
  let formElement;
  let modal;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Modal, "Modal").$$render(
      $$result,
      { this: modal },
      {
        this: ($$value) => {
          modal = $$value;
          $$settled = false;
        }
      },
      {}
    )} <form class="flex min-h-full w-1/2 flex-col gap-3 pt-10" action="?/update" method="POST"${add_attribute("this", formElement, 0)}><h1 class="text-3xl font-extrabold"><span class="text-blue-900" data-svelte-h="svelte-qs95ec">Admin</span> &gt; Edit
        <span class="span underline decoration-dotted">${escape(data.documents.filter((item) => item.id == $formData.form.id)[0].slug)}</span></h1> <hr class="border-2 border-blue-500"> <div class="flex gap-2"><button class="self-start bg-green-700 font-bold text-white text-sm px-3 py-1" type="submit" data-svelte-h="svelte-f5epia">Save</button> <button class="self-start bg-red-700 font-bold text-white text-sm px-3 py-1" type="button" data-svelte-h="svelte-9xjeub">Delete</button></div> ${form && form.code ? `<span class="border-l-red-800 border-l-[6px] bg-red-200 w-1/2 p-2">${escape(form.message)}</span>` : `${form ? `<span class="border-l-green-800 border-l-[6px] bg-green-200 w-1/2 p-2">${escape(form.message)}</span>` : ``}`} ${validate_component(DocumentForm, "DocumentForm").$$render(
      $$result,
      {
        form: $formData,
        documentList: data.documents
      },
      {},
      {}
    )}</form>`;
  } while (!$$settled);
  $$unsubscribe_formData();
  return $$rendered;
});
export {
  Page as default
};
