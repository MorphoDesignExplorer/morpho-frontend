<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData, PageData } from "./$types";

    export let form: ActionData;

    let message = "";

    $: {
        if (form) {
            if (form.message) {
                message = form.message
            } else {
                message = ""
            }
        }
    }
</script>

<div class="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm w-1/2 max-w-md">
    <div class="p-4 sm:p-7">
        <div class="text-center">
        <h1 class="block text-2xl font-bold text-gray-800">Forgot Password</h1>
        </div>

        <div class="mt-5">

        <!-- Form -->
        <form method="POST" use:enhance>
            <div class="grid gap-y-4">
            {#if message.length > 0}
                <p class="p-2 capitalize text-xl text-center">{message}</p>
                {:else}
                <!-- Form Group -->
                <div>
                    <div class="flex justify-between items-center">
                        <label for="email" class="block text-sm mb-2">Email</label>
                    </div>
                    <div class="relative">
                        <input type="text" id="email" name="email" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500">
                    </div>
                </div>
                <!-- End Form Group -->

                <button type="submit" class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700">Submit</button>
            {/if}
            </div>
        </form>
        <!-- End Form -->
        </div>
    </div>
</div>
