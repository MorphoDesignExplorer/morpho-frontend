<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData, PageData } from "./$types";
    import { page } from "$app/stores";

    export let form: ActionData;
    export let data: PageData;

    let error_message = "";

    $: {
        if (form) {
            if (form.message) {
                error_message = form.message
            } else {
                error_message = ""
            }
        }
    }
</script>

<div class="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm w-1/2 max-w-md">
    <div class="p-4 sm:p-7">
        <div class="text-center">
        <h1 class="block text-2xl font-bold text-gray-800">Reset Password</h1>
        </div>

        <div class="mt-5">

        <!-- Form -->
        <form method="POST" action="?/reset&session={data.session}" use:enhance>
            <div class="grid gap-y-4">

            {#if error_message.length > 0}
            <p class="p-2 bg-red-100 border border-red-500 text-red-700 rounded-md capitalize font-medium">{error_message}</p>
            {/if}

            <!-- Form Group -->
            {#if form?.code != "expired" }
            <div>
                <label for="pwd1" class="block text-sm mb-2">Password</label>
                <div class="relative">
                    <input type="password" id="pwd1" name="pwd1" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500">
                </div>
            </div>
            <!-- End Form Group -->

            <!-- Form Group -->
            <div>
                <div class="flex justify-between items-center">
                    <label for="pwd2" class="block text-sm mb-2">Confirm Password</label>
                </div>
                <div class="relative">
                    <input type="password" id="pwd2" name="pwd2" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500">
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
