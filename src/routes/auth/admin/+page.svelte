<script lang="ts">
    import { writable, type Writable } from 'svelte/store';
    import ProjectForm from './ProjectForm.svelte';
    import DocumentForm from './DocumentForm.svelte';
    import { type Document, type Project, type AdminForm } from '$lib/types';
    import { applyAction, deserialize } from '$app/forms';
    import { type ActionResult } from '@sveltejs/kit'
    import { invalidateAll } from '$app/navigation';

    export let data: {projects: Project[], documents: Document[]};
    let form: Writable<AdminForm> = writable({type: "none"})

    let nav = (index: number, isProject: boolean) => {
        return () => {
            if (isProject) {
                let project = data.projects[index]
                $form = {
                    type: "project",
                    form: {
                        project_name: project.project_name,
                        human_name: project.metadata.human_name,
                        captions: project.metadata.captions,
                        vmetadata: project.variable_metadata,
                        ometadata: project.output_metadata,
                        ametadata: project.assets,
                        description: project.metadata.description.text
                    }
                }
            } else {
                let document = data.documents[index]
                $form = {type: "document", form: {text: document.text, id: document.id}}
            }
        }
    }

    let handleSubmit = async (event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
        if ($form.type == "project" || $form.type == "document") {
            event.preventDefault();
            const response = await fetch(event.currentTarget.action, {
                method: "POST",
                body: JSON.stringify($form),
            })
            const result: ActionResult = deserialize(await response.text())
            if (result.type == "success") {
                if (result.data?.status == "success") {
                    window.alert("Saved successfully!")
                    await invalidateAll();
                }
            }
            applyAction(result);
        }
    }

</script>

<link rel="stylesheet" href="/app.css"/>

<div class="relative flex min-h-screen bg-amber-50">
  <div class="flex flex-col bg-blue-50 w-1/5 min-h-full pt-10 mr-10 gap-5 border-r-2 border-r-blue-500 pl-4">
    <span class="flex flex-col items-start px-3">
        <h1 class="text-3xl font-extrabold">Welcome</h1>
        <br/>
        <p class="text-blue-600"><a href="/">Home</a></p>
        <form action="?/logout" method="POST">
            <button type="submit" class="text-blue-600">Logout</button>
        </form>
    </span>
    <div class="flex flex-col gap-2">
        <h1 class="text-xl font-extrabold px-3">Projects</h1>

        <ol class="list-dashed-arrows ml-8">
        {#each data.projects as project, index}
            <li class="text-blue-600"><button on:click={nav(index, true)}>{project.metadata.human_name}</button></li>
        {/each}
        </ol>
    </div>

    <div class="flex flex-col gap-2">
        <h1 class="text-xl font-extrabold px-3">Special Documents</h1>
    
        <ol class="list-dashed-arrows ml-8">
        {#each data.documents as document, index}
            <li class="text-blue-600"><button on:click={nav(index, false)}>{document.slug}</button></li>
        {/each}
        </ol>
    </div>

    </div>

    <form class="flex min-h-full w-1/2 flex-col gap-3 pt-10" on:submit={handleSubmit} action="?/update" method="POST">
        {#if $form.type == "project"}

        <h1 class="text-3xl font-extrabold">
            <span class="text-blue-900">Admin</span> > Edit <span class="span underline decoration-dotted">{$form.form.project_name}</span>
        </h1>
        <hr class="border-2 border-blue-500" />

            <button class="self-start bg-green-700 font-bold text-white text-sm px-3 py-1" type="submit">Submit</button>
            <ProjectForm form={$form} project={data.projects.filter(item => item.project_name == $form.form.project_name)[0]}/>
        {:else if $form.type == "document"}

        <h1 class="text-3xl font-extrabold">
            <span class="text-blue-900">Admin</span> > Edit <span class="span underline decoration-dotted">{data.documents.filter(item => item.id == $form.form.id)[0].slug}</span>
        </h1>
        <hr class="border-2 border-blue-500" />

            <button class="self-start bg-green-700 font-bold text-white text-sm px-3 py-1" type="submit">Submit</button>
            <DocumentForm form={$form}/>
        {:else}
            <p>No Project or Document selected.</p>
        {/if}
    </form>
</div>

<style>
    .list-dashed-arrows {
        list-style: "⇢ ";
    }
</style>

