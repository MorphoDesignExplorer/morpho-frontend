<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";
    import type { ActionData } from "./$types";
    import { applyAction, deserialize, enhance } from "$app/forms";
    import type { ActionResult } from "@sveltejs/kit";

    export let form: ActionData;

    let submitDisabled = false;
    let progress = 0;

    async function handleSubmit(
        event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
    ) {
        event.preventDefault();

        //
        // Setting up a form lock
        //

        if (submitDisabled) {
            return;
        }
        submitDisabled = true;
        form = null;

        //
        // Start uploading the file
        //

        const data = new FormData(event.currentTarget);
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener(
            "progress",
            (event) => {
                if (event.lengthComputable) {
                    const percentage = Math.round(
                        (event.loaded * 100) / event.total,
                    );
                    progress = percentage;
                }
            },
            false,
        );

        xhr.addEventListener(
            "load",
            (event: ProgressEvent<XMLHttpRequestEventTarget>) => {
                progress = 100;
                const result: ActionResult = deserialize(
                    (event.currentTarget as XMLHttpRequest).responseText,
                );

                //
                // Release the form lock
                //

                if (result.type == "success") {
                    if (result.data?.project_name) {
                        setTimeout(async () => {
                            await invalidateAll();
                            await goto(
                                `/auth/admin/project/${result.data?.project_name}`,
                            );
                        }, 1000);
                    }
                }

                applyAction(result);
                submitDisabled = false;
            },
            false,
        );

        xhr.open("POST", event.currentTarget.action, true);
        xhr.send(data);
    }
</script>

<form
    class="flex min-h-full w-1/2 flex-col gap-3 pt-10 items-start"
    action="?/create"
    method="POST"
    enctype="multipart/form-data"
    on:submit={handleSubmit}
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
        {#if progress > 0}
            <span>{progress}% uploaded.</span>
        {/if}
        <span
            class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs"
        >
            <span class="text-sm">Zipo Archive</span>
            <span class="text-gray-500 font-normal"
                >Upload a compressed zip folder of the project here.</span
            >
        </span>
        <div class="flex w-full">
            <input
                type="file"
                name="upload"
                id="zipfile"
                disabled={submitDisabled}
            />
        </div>
    </div>
    <input
        type="submit"
        value="Submit"
        class="self-start bg-green-700 font-bold text-white text-sm px-3 py-1"
        disabled={submitDisabled}
    />
</form>
