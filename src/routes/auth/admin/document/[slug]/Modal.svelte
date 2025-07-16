<script lang="ts">
    let message: string;
    let onsuccess: () => void;
    let onfailure: () => void;
    let enabled = false;

    export function raise(
        msg: string,
        success: () => void,
        failure: () => void,
    ) {
        enabled = true;
        message = msg;
        onsuccess = () => {
            success();
            enabled = false;
        };

        onfailure = () => {
            failure();
            enabled = false;
        };
    }
</script>

{#if enabled}
    <div
        class="fixed top-1/4 left-[40%] w-50 h-40 bg-slate-50 border border-gray-600 rounded flex flex-col justify-evenly items-center p-4 gap-4"
        tabindex="0"
        style="z-index:99"
    >
        <p class="text-2xl font-bold">{message}</p>
        <hr class="border-t-slate-600 border-t w-full" />
        <div class="flex gap-2 w-full">
            <button
                class="bg-green-400 font-bold text-green-950 text-xl w-1/2 px-2 py-1"
                tabindex="0"
                on:click={onsuccess}>Yes</button
            >
            <button
                class="bg-red-400 font-bold text-red-950 text-xl w-1/2 px-2 py-1"
                tabindex="0"
                on:click={onfailure}>No</button
            >
        </div>
    </div>
{/if}
