<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import ProjectForm from "./ProjectForm.svelte";
    import type { AdminForm, Project } from "$lib/types";
    import { applyAction, deserialize } from "$app/forms";
    import type { ActionResult } from "@sveltejs/kit";
    import { goto, invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";
    import type { ActionData } from "./$types";
    import Modal from "../../document/[slug]/Modal.svelte";

    export let data: { project: Project };
    export let form: ActionData;

    const { project } = data;

    let formData: Writable<Extract<AdminForm, { type: "project" }>> = writable({
        type: "project",
        form: {
            project_name: project.project_name,
            human_name: project.metadata.human_name,
            captions: project.metadata.captions,
            description: project.metadata.description.text,
            vmetadata: project.variable_metadata,
            ometadata: project.output_metadata,
            ametadata: project.assets,
        },
    });

    let formElement: HTMLFormElement;
    const submitFunc = async () => {
        const response = await fetch(formElement.action, {
            method: "POST",
            body: JSON.stringify($formData),
        });
        const result: ActionResult = deserialize(await response.text());
        if (result.type == "success") {
            if (result.data?.status == "success") {
                await invalidateAll();
            }
        }
        applyAction(result);
    };

    onMount(() => {
        window.addEventListener("keydown", async (e) => {
            if (e.ctrlKey && e.key == "s") {
                e.preventDefault();
                await submitFunc();
            }
        });
    });

    let handleSubmit = async (
        event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
    ) => {
        if ($formData.type == "project" || $formData.type == "document") {
            event.preventDefault();
            await submitFunc();
        }
    };

    let modal: Modal;
    let handleDelete = async () => {
        modal.raise(
            `Are you sure you want to delete '${data.project.project_name}'?`,
            async () => {
                const response = await fetch("?/delete", {
                    method: "POST",
                    body: new FormData(),
                });
                const result: ActionResult = deserialize(await response.text());
                if (result.type == "success") {
                    if (result.data?.status == "success") {
                        window.alert(
                            "Deleted " + data.project.project_name + ".",
                        );
                        goto("/auth/admin/", {
                            invalidateAll: true,
                        });
                    }
                }
                applyAction(result);
            },
            () => {},
        );
    };
</script>

<Modal bind:this={modal} />

<form
    class="flex min-h-full w-1/2 flex-col gap-3 pt-10"
    on:submit={handleSubmit}
    action="?/update"
    method="POST"
    bind:this={formElement}
>
    <h1 class="text-3xl font-extrabold">
        <span class="text-blue-900">Admin</span> > Edit
        <span class="span underline decoration-dotted"
            >{$formData.form.project_name}</span
        >
    </h1>
    <hr class="border-2 border-blue-500" />
    <div class="flex gap-2">
        <button
            class="self-start bg-green-700 font-bold text-white text-sm px-3 py-1"
            type="submit">Save</button
        >
        <button
            class="self-start bg-red-700 font-bold text-white text-sm px-3 py-1"
            type="button"
            on:click={handleDelete}>Delete</button
        >
    </div>

    {#if form && form.code}
        <span class="border-l-red-800 border-l-[6px] bg-red-200 w-1/2 p-2">
            {form.message}
        </span>
    {:else if form}
        <span class="border-l-green-800 border-l-[6px] bg-green-200 w-1/2 p-2">
            {form.message}
        </span>
    {/if}

    <ProjectForm form={$formData} {project} />
</form>
