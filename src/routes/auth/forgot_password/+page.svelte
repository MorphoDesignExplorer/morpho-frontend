<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData, PageData } from "./$types";

    export let data: PageData;
    export let form: ActionData;

    let email = "";
</script>

<div class="bg-gray-100 w-full h-screen flex flex-col items-center justify-center">
    <div class="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm w-1/2 max-w-md">
        <div class="p-4 sm:p-7">
            <div class="text-center">
                <h1 class="block text-2xl font-bold text-gray-800">Sign in</h1>
            </div>

            <div class="mt-5">

            <!-- Form -->
            <form method="POST" action="?/submit" use:enhance>
                <div class="grid gap-y-4">

                <!-- Form Group -->
                <div>
                    <div class="flex justify-between items-center">
                        <label for="email" class="block text-sm mb-2">Email</label>
                    </div>
                    <div class="relative">
                        <input type="email" id="email" name="email" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500" bind:value={email}>
                    </div>
                </div>
                <!-- End Form Group -->

                {#if form?.message}
                <p class="text-sm text-green-700">{form.message}</p>
                {/if}

                <button 
                disabled={email.length === 0}
                type="submit" class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300">Reset Password</button>
                </div>
            </form>
            <!-- End Form -->
            </div>
        </div>
    </div>
</div>