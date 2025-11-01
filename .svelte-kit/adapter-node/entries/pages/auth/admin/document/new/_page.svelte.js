import { c as create_ssr_component, a as subscribe, b as add_attribute, v as validate_component } from "../../../../../../chunks/ssr.js";
import { w as writable } from "../../../../../../chunks/index.js";
import { D as DocumentForm } from "../../../../../../chunks/DocumentForm.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../chunks/state.svelte.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $form, $$unsubscribe_form;
  let { data } = $$props;
  const form = writable({
    type: "document",
    form: { title: "", text: "", id: "", parent: "" }
  });
  $$unsubscribe_form = subscribe(form, (value) => $form = value);
  let formElement;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$unsubscribe_form();
  return `<form class="flex min-h-full w-1/2 flex-col gap-3 pt-10" action="?/create" method="POST"${add_attribute("this", formElement, 0)}><h1 class="text-3xl font-extrabold" data-svelte-h="svelte-1uhiiy1"><span class="text-blue-900">Admin</span> &gt; Create Document</h1> <hr class="border-2 border-blue-500"> <button class="self-start bg-green-700 font-bold text-white text-sm px-3 py-1" type="submit" data-svelte-h="svelte-r1ioyd">Submit</button> ${validate_component(DocumentForm, "DocumentForm").$$render(
    $$result,
    {
      form: $form,
      documentList: data.documents
    },
    {},
    {}
  )}</form>`;
});
export {
  Page as default
};
