<script lang="ts">
    import { browser } from "$app/environment";
    import { enhance } from "$app/forms";
    import type { ActionData, PageData } from "./$types";

    export let form: ActionData;
    export let data: PageData;

    let state: {
        pwd: string,
        confirm: string
    } = {
        pwd: "",
        confirm: ""
    }
</script>

<div class="bg-gray-100 w-full h-screen flex flex-col items-center justify-center">
    <div class="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm w-1/2 max-w-md">
        {#if !data.validity}
            {#if form?.code }
                <p class="text-xl font-bold m-8">{form.message}</p>
            {:else}
                <p class="text-xl font-bold m-8">Invalid Reset Token.</p>
            {/if}
        {:else}
        <div class="p-4 sm:p-7">
            <div class="text-center">
            <h1 class="block text-2xl font-bold text-gray-800">Reset Password</h1>
            </div>

            <div class="mt-5">

            <!-- Form -->
            <form method="POST" action="?/submit" use:enhance>
                <div class="grid gap-y-4">

                {#if form?.message}
                    <p>{form?.message}</p>
                {/if}

                <!-- Form Group -->
                <div>
                    <div class="flex justify-between items-center">
                        <label for="pwd" class="block text-sm mb-2">Password</label>
                    </div>
                    <div class="relative">
                        <input type="password" id="pwd" name="pwd" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500" bind:value={state.pwd}>
                    </div>
                </div>
                <!-- End Form Group -->

                <!-- Form Group -->
                <div>
                    <div class="flex justify-between items-center">
                        <label for="pwd" class="block text-sm mb-2">Confirm Password</label>
                    </div>
                    <div class="relative">
                        <input type="password" id="confirm" name="confirm" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500" bind:value={state.confirm}>
                    </div>
                </div>
                <!-- End Form Group -->

                <input type="hidden" name="token" value={data.token}>

                {#if (state.confirm !== state.pwd)}
                <p class="text-red-400 font-bold transition">Passwords must match.</p>
                {:else}
                <span class="h-5"></span>
                {/if}

                <button 
                disabled={(state.confirm !== state.pwd) || state.pwd.length === 0}
                type="submit" class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300">Reset Password</button>
                </div>
            </form>
            <!-- End Form -->
            </div>
        </div>
        {/if}
        
    </div>
</div>