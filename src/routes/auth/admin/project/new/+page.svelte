<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import type { ActionData } from "./$types";
    import { applyAction, deserialize } from "$app/forms";
    import type { ActionResult } from "@sveltejs/kit";
    import { XHRFetch } from "./xhrfetch";

    export let form: ActionData;

    let submitDisabled = false;
    let progress = 0;
    let zipfield: HTMLInputElement;

    async function handleSubmit(
        event: SubmitEvent & { target: EventTarget & HTMLFormElement },
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

        try {
            const zipfile = zipfield.files?.item(0);
            if (zipfile == null) {
                throw new Error("No file was chosen.");
            }
            const uploadedFilename = await XHRFetch(zipfile, (event) => {
                if (event.lengthComputable) {
                    const percentage = Math.round(
                        (event.loaded * 100) / event.total,
                    );
                    progress = percentage;
                }
            });
            const finalResponse = await fetch(event.target.action, {
                method: "POST",
                body: JSON.stringify({
                    s3uri: uploadedFilename,
                }),
            });
            // enable form again after upload is done
            if (finalResponse.ok) {
                const responseText = await finalResponse.text();
                const result: ActionResult = deserialize(responseText);

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
            }
        } catch (err) {
            if (err instanceof Error) {
                form = {
                    code: "400",
                    message: err.message,
                };
            } else {
                console.error(err);
                form = {
                    code: "400",
                    message: "unknown error",
                };
            }
        }
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
        class="form-group"
    >
        {#if progress > 0}
            <span>{progress}% uploaded.</span>
        {/if}
        <span
            class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs"
        >
            <span class="text-sm">Zip Archive</span>
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
                bind:this={zipfield}
            />
        </div>
    </div>
    <input
        type="submit"
        value="Submit"
        class="good-button"
        disabled={submitDisabled}
    />
</form>
