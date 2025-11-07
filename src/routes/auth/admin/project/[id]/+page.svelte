<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import ProjectForm from "./ProjectForm.svelte";
    import type { AdminForm, Project } from "$lib/types";
    import { applyAction, deserialize } from "$app/forms";
    import type { ActionResult } from "@sveltejs/kit";
    import { goto, invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";
    import type { ActionData } from "./$types";
    import Modal from "$lib/components/Modal.svelte";

    interface Props {
        data: { project: Project };
        form: ActionData;
    }

    let { data, form }: Props = $props();

    const { project } = data;

    let formData: Writable<Extract<AdminForm, { type: "project" }>> = writable({
        type: "project",
        form: {
            project_name: project.project_name,
            is_public: project.options.is_public,
            human_name: project.metadata.human_name,
            captions: project.metadata.captions,
            variable_metadata_options: project.variable_metadata.map((field, idx) => Object.assign({
                // following are default values
                field_name: field.field_name,
                field_unit: field.field_unit,
                display_name: field.field_name
            }, project.options.variable_metadata_options.at(idx) || {} )),
            output_metadata_options: project.output_metadata.map((field, idx) => Object.assign({
                // following are default values
                field_name: field.field_name,
                field_unit: field.field_unit,
                display_name: field.field_name
            }, project.options.output_metadata_options.at(idx) || {})),
            asset_options: project.assets.map((asset, idx) => Object.assign({
                // following are default values
                tag: asset.tag,
                description: asset.description,
                is_public: true
            }, project.options.asset_options.at(idx) || {})),
            description: project.metadata.description.text,
        },
    });

    let formElement: HTMLFormElement = $state();
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

    let modal: Modal = $state();
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
    class="flex min-h-full w-[90%] flex-col gap-3 pt-10"
    onsubmit={handleSubmit}
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
            class="good-button"
            type="submit">Save</button
        >
        <button
            class="bad-button"
            type="button"
            onclick={handleDelete}>Delete</button
        >
    </div>

    {#if form && form.code}
        <span class="border-l-red-800 border-l-[6px] bg-red-200 w-1/2 p-2">
            {form.message}
        </span>
    {:else if form}
        <span class="border-l-green-800 border-l-[6px] bg-green-200 w-1/2 p-2 flash">
            {form.message}
        </span>
    {/if}

    <ProjectForm form={$formData} {project} />
</form>

<style>
    .flash {
        animation: pulse 0.25s linear;
    }

    @keyframes pulse {
        0% {
         filter: brightness(100%);
        }

        50% {
         filter: brightness(110%);
        }

        100% {
         filter: brightness(100%);
        }
    }
</style>
