import { c as create_ssr_component, d as escape } from "../../../../chunks/ssr.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { form } = $$props;
  let message = "";
  if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
  {
    {
      if (form) {
        if (form.message) {
          message = form.message;
        } else {
          message = "";
        }
      }
    }
  }
  return `<div class="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm w-1/2 max-w-md"><div class="p-4 sm:p-7"><div class="text-center" data-svelte-h="svelte-1bnjhz6"><h1 class="block text-2xl font-bold text-gray-800">Forgot Password</h1></div> <div class="mt-5"> <form method="POST"><div class="grid gap-y-4">${message.length > 0 ? `<p class="p-2 capitalize text-xl text-center">${escape(message)}</p>` : ` <div data-svelte-h="svelte-uh9aua"><div class="flex justify-between items-center"><label for="email" class="block text-sm mb-2">Email</label></div> <div class="relative"><input type="text" id="email" name="email" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"></div></div>  <button type="submit" class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700" data-svelte-h="svelte-a84xel">Submit</button>`}</div></form> </div></div></div>`;
});
export {
  Page as default
};
