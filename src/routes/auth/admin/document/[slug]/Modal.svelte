<script lang="ts">
    let message: string;
    let onsuccess: () => void;
    let onfailure: () => void;
    let enabled = false;

    export function raise(msg: string, success: () => void, failure: () => void) {
        enabled = true
        message = msg;
        onsuccess = () => {
            success();
            enabled = false;
        }

        onfailure = () => {
            failure();
            enabled = false;
        }
    }
</script>

{#if enabled}
<div class="fixed top-1/4 left-[40%] w-50 h-50 bg-gray-300 border border-gray-600 rounded flex flex-col items-center p-4" style="z-index:100">
    <p>{message}</p>
    <div class="flex gap-2">
        <button class="bg-gray-400 font-bold text-black px-2 py-1" on:click={onsuccess}>Yes</button>
        <button class="bg-gray-400 font-bold text-black px-2 py-1" on:click={onfailure}>No</button>
    </div>
</div>
{/if}