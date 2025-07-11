<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import ProjectForm from "./ProjectForm.svelte";
    import type { AdminForm, Project } from "$lib/types";
    import { applyAction, deserialize } from "$app/forms";
    import type { ActionResult } from "@sveltejs/kit";
    import { invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";

    export let data: {project: Project};

    const { project } = data;

    let form: Writable<Extract<AdminForm, {type: "project"}>> = writable({
        type: "project",
        form: {
            project_name: project.project_name,
            human_name: project.metadata.human_name,
            captions: project.metadata.captions,
            description: project.metadata.description.text,
            vmetadata: project.variable_metadata,
            ometadata: project.output_metadata,
            ametadata: project.assets
        }
    })

    let formElement: HTMLFormElement;
    const submitFunc = async () => {
        const response = await fetch(formElement.action, {
            method: "POST",
            body: JSON.stringify($form),
        })
        const result: ActionResult = deserialize(await response.text())
        console.log(result)
        if (result.type == "success") {
            if (result.data?.status == "success") {
                window.alert("Saved successfully!")
                await invalidateAll();
            }
        }
        applyAction(result);
    }

    onMount(() => {
        window.addEventListener("keydown", async e => {
            if (e.ctrlKey && e.key == 's') {
                e.preventDefault();
                await submitFunc()
            }
        })
    })
    

    let handleSubmit = async (event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
        if ($form.type == "project" || $form.type == "document") {
            event.preventDefault();
            await submitFunc()
        }
    }

</script>

<form class="flex min-h-full w-1/2 flex-col gap-3 pt-10" on:submit={handleSubmit} action="?/update" method="POST" bind:this={formElement}>
    <h1 class="text-3xl font-extrabold">
        <span class="text-blue-900">Admin</span> > Edit <span class="span underline decoration-dotted">{$form.form.project_name}</span>
    </h1>
    <hr class="border-2 border-blue-500" />
    <button class="self-start bg-green-700 font-bold text-white text-sm px-3 py-1" type="submit">Save</button>

    <ProjectForm form={$form} project={project}/>
</form>