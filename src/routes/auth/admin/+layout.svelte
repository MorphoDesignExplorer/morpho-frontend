<script lang="ts">
    import { type Document, type Project } from "$lib/types";
    import { fade } from "svelte/transition";
    import { page } from "$app/stores";
    
    import Chevron from "./Chevron.svelte";

    export let data: { projects: Project[]; documents: Document[] };

    let projects_open =  ($page.route.id?.indexOf("project") || -1) > -1;
    let documents_open = ($page.route.id?.indexOf("document") || -1) > -1;

    function flip_projects() {
        projects_open = !projects_open;
    }

    
    function flip_documents() {
        documents_open = !documents_open;
    }
    
</script>

<link rel="stylesheet" href="/app.css" />
<link href="/document.css" rel="stylesheet" />

<div class="relative flex min-h-screen bg-slate-50">
    <div
        class="flex flex-col bg-blue-50 w-1/4 min-h-full pt-10 mr-10 gap-5 border-r-2 border-r-blue-500 pl-4 rounded-r-lg"
    >
        <span class="flex flex-col items-start">
            <h1 class="text-3xl font-extrabold">Welcome</h1>
            <br />
            <p class="text-blue-600"><a href="/">Home</a></p>
            <p class="text-blue-600"><a href="/auth/admin/">Admin Root</a></p>
            <br />
            <br />
            <br />
            <p class="text-blue-600"><a href="/auth/logout/">Logout</a></p>
        </span>
        <button class="flex flex-col gap-2" on:click={flip_projects}>
            <span class="flex justify-between items-center pr-8">
                <h1 class="text-xl font-extrabold">Projects</h1>
                <span class="ml-auto px-3 transition-transform" class:rotate-180={projects_open}>
                    <Chevron/>
               </span>
                <a
                    href="/auth/admin/project/new"
                    class="bg-green-700 text-white font-bold py-1 px-2 text-sm"
                    >Add +</a
                >
            </span>
        </button>

        {#if projects_open}
        <ol class="ml-8" transition:fade={{"delay": 0, "duration": 100}}>
            {#each data.projects as project}
                <li class="text-blue-600" class:font-bold={$page.params.id === project.project_name}>
                    <a
                        target="_self"
                        href="/auth/admin/project/{project.project_name}/"
                        >{project.metadata.human_name} ({project.project_name})</a
                    >
                </li>
            {/each}
        </ol>
        {/if}

        
        <button class="flex justify-between items-center pr-8" on:click={flip_documents}>
            <h1 class="text-xl font-extrabold">Documents</h1>
            <span class="ml-auto px-3 transition-transform" class:rotate-180={documents_open}>
                <Chevron/>
            </span>
            <a
                href="/auth/admin/document/new"
                class="bg-green-700 text-white font-bold py-1 px-2 text-sm"
                >Add +</a
            >
        </button>

        {#if documents_open}
        <ol class="ml-8" transition:fade={{"delay": 0, "duration": 100}}>
            {#each data.documents as document}
                <li class="text-blue-600">
                    <a
                        href="/auth/admin/document/{document.slug}/"                        
                        class:font-bold={$page.params.slug === document.slug}
                        target="_self">{document.slug}</a
                    >
                </li>
            {/each}
        </ol>
        {/if}
    </div>

    <slot />
</div>

<style>
    .list-dashed-arrows {
        list-style: "⇢ ";
    }
</style>
