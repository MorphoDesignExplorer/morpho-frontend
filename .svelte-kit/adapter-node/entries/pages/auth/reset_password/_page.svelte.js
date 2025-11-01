import { c as create_ssr_component, d as escape } from "../../../../chunks/ssr.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { form } = $$props;
  let { data } = $$props;
  let error_message = "";
  if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  {
    {
      if (form) {
        if (form.message) {
          error_message = form.message;
        } else {
          error_message = "";
        }
      }
    }
  }
  return `<div class="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm w-1/2 max-w-md"><div class="p-4 sm:p-7"><div class="text-center" data-svelte-h="svelte-14j5j6c"><h1 class="block text-2xl font-bold text-gray-800">Reset Password</h1></div> <div class="mt-5"> <form method="POST" action="${"?/reset&amp;session=" + escape(data.session, true)}"><div class="grid gap-y-4">${error_message.length > 0 ? `<p class="p-2 bg-red-100 border border-red-500 text-red-700 rounded-md capitalize font-medium">${escape(error_message)}</p>` : ``}  ${form?.code != "expired" ? `<div data-svelte-h="svelte-12p1pdj"><label for="pwd1" class="block text-sm mb-2">Password</label> <div class="relative"><input type="password" id="pwd1" name="pwd1" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"></div></div>   <div data-svelte-h="svelte-angj4k"><div class="flex justify-between items-center"><label for="pwd2" class="block text-sm mb-2">Confirm Password</label></div> <div class="relative"><input type="password" id="pwd2" name="pwd2" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"></div></div>  <button type="submit" class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700" data-svelte-h="svelte-a84xel">Submit</button>` : ``}</div></form> </div></div></div>`;
});
export {
  Page as default
};
