<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import type { ActionData } from "./$types";

    export let form: ActionData;

    onMount(() => {
        if (form?.project_name) {
            alert(`Added ${form.project_name}!`);
            goto(`/auth/admin/project/${form.project_name}`);
        }
    });
</script>

<form
    class="flex min-h-full w-1/2 flex-col gap-3 pt-10 items-start"
    action="?/create"
    method="POST"
    enctype="multipart/form-data"
>
    {#if form && form.code}
        <span class="border-l-red-800 border-l-[6px] bg-red-300 w-1/2 p-2">
            {form.message}
        </span>
    {:else if form}
        <span class="border-l-green-800 border-l-[6px] bg-green-300 w-1/2 p-2">
            {form.message}
        </span>
    {/if}
    <h1 class="text-3xl font-extrabold">
        <span class="text-blue-900">Admin</span> > Create Project
    </h1>

    <div
        class="flex items-center gap-2 border-l-4 border-gray-500 bg-gray-100 p-2 text-sm mr-[-40%] mb-20"
    >
        <span
            class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs"
        >
            <span class="text-sm">Zipo Archive</span>
            <span class="text-gray-500 font-normal"
                >Upload a compressed zip folder of the project here.</span
            >
        </span>
        <div class="flex w-full">
            <input type="file" name="upload" id="zipfile" />
        </div>
    </div>
    <input
        type="submit"
        value="Submit"
        class="self-start bg-green-700 font-bold text-white text-sm px-3 py-1"
    />
</form>
