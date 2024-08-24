<script lang="ts">
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import type { PageData } from "../login/$types";
    import QRCode from "qrcode";

    export let otp_status: boolean;

    export let data: PageData;
    let target_canvas: HTMLCanvasElement;

    onMount(async () => {
        await QRCode.toCanvas(target_canvas, (data.otp_uri as string), {scale: 3, width: target_canvas.width })
    })

</script>

<form class="w-full h-screen flex flex-col items-center justify-center" use:enhance method="post">
    <div class="flex flex-col bg-neutral-100 border shadow-sm rounded-xl p-4 items-center gap-2">
        <canvas class="rounded-xl w-full" bind:this={target_canvas}></canvas>
        <div class="flex rounded-lg shadow-sm">
            <span class="px-4 inline-flex items-center min-w-fit rounded-s-md border border-e-0 border-gray-200 bg-gray-50 text-sm text-gray-500">One-Time Password</span>
            <input type="text" maxlength="6" name="otp" class="tracking-wide py-3 px-4 pe-11 block w-full border border-gray-200 shadow-sm rounded-e-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" placeholder="000000">
        </div>
        {#if otp_status}
            <div class="max-w-xs bg-green-100 border border-green-200 text-sm text-green-800 rounded-lg" role="alert">
                <div class="flex p-4">
                OTP was correct!
            
                <div class="ms-auto">
                    <button type="button" class="inline-flex flex-shrink-0 justify-center items-center size-5 rounded-lg text-teal-800 opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100 dark:text-teal-200">
                    <span class="sr-only">Close</span>
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                    </svg>
                    </button>
                </div>
                </div>
            </div>
        {:else}
            <div class="max-w-xs bg-red-100 border border-red-200 text-sm text-red-800 rounded-lg" role="alert">
                <div class="flex p-4">
                OTP was wrong.
            
                <div class="ms-auto">
                    <button type="button" class="inline-flex flex-shrink-0 justify-center items-center size-5 rounded-lg text-teal-800 opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100 dark:text-teal-200">
                    <span class="sr-only">Close</span>
                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                    </svg>
                    </button>
                </div>
                </div>
            </div>
        {/if}
    </div>
</form>
