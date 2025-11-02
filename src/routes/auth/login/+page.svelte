<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  export let form: ActionData;

  let error_message = "";

  $: {
    if (form) {
      if (form.message) {
        error_message = form.message;
      } else {
        error_message = "";
      }
    }
  }
</script>

<div
  class="bg-gray-100 w-full h-screen flex flex-col items-center justify-center"
>
  <div
    class="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm w-1/2 max-w-md"
  >
    <div class="p-4 sm:p-7">
      <div class="text-center">
        <h1 class="block text-2xl font-bold text-gray-800">Sign in</h1>
      </div>

      <div class="mt-5">
        <!-- Form -->
        <form method="POST" action="?/login" use:enhance>
          <div class="grid gap-y-4">
            {#if error_message.length > 0}
              <p
                class="p-2 bg-red-100 border border-red-500 text-red-700 rounded-md capitalize font-medium"
              >
                {error_message}
              </p>
            {/if}

            <!-- Form Group -->
            <div>
              <label for="uname" class="block text-sm mb-2">Email</label>
              <div class="relative">
                <input
                  type="text"
                  id="uname"
                  name="uname"
                  class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <!-- End Form Group -->

            <!-- Form Group -->
            <div>
              <div class="flex justify-between items-center">
                <label for="pwd" class="block text-sm mb-2">Password</label>
              </div>
              <div class="relative">
                <input
                  type="password"
                  id="pwd"
                  name="pwd"
                  class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <!-- End Form Group -->
            <a
              href="/auth/forgot_password"
              class="text-blue-500 hover:text-blue-600">Forgot Password?</a
            >

            <button
              type="submit"
              class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
              >Sign in</button
            >
          </div>
        </form>
        <!-- End Form -->
      </div>
    </div>
  </div>
</div>
