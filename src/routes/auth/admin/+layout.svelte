<script lang="ts">
    import "$lib/css/form.css";
    import { type Document, type Project } from "$lib/types";
    import { fade } from "svelte/transition";
    import { page } from "$app/stores";
    
    import Chevron from "./Chevron.svelte";
    import PaperClip from "$lib/icons/PaperClip.svelte";
    import ProjectIcon from "$lib/icons/Project.svelte";
    import PersonIcon from "$lib/icons/Person.svelte";
    import LogoutIcon from "$lib/icons/Logout.svelte";

    interface Props {
        data: { projects: Project[]; documents: Document[] };
        children?: import('svelte').Snippet;
    }

    let { data, children }: Props = $props();

    let projects_open =  $state(($page.route.id?.indexOf("project") || -1) > -1);
    let documents_open = $state(($page.route.id?.indexOf("document") || -1) > -1);

    function flip_projects() {
        projects_open = !projects_open;
    }

    
    function flip_documents() {
        documents_open = !documents_open;
    }
    
</script>

<link rel="stylesheet" href="/app.css" />
<link href="/document.css" rel="stylesheet" />

<div class="relative flex min-h-screen bg-sky-50">
    <div
        class="flex flex-col bg-blue-100 w-1/4 min-h-full pt-10 mr-10 gap-2 border-r-2 border-r-blue-500 px-4 rounded-r-lg shadow-lg"
    >
        <span class="flex flex-col items-start">
            <h1 class="text-3xl font-extrabold">Welcome!</h1>
            <br />
            <p class="text-blue-600"><a href="/">Home</a></p>
        </span>
        <a
            href="/auth/logout/"
            class="flex items-center gap-2 bg-blue-200 rounded-lg p-1 shadow-sm"
        >
            <LogoutIcon className="min-w-8 max-w-8 rounded-lg bg-blue-400 text-blue-800 p-1"/>

            <h1 class="text-xl font-extrabold">Logout</h1>
        </a>
        {#if true} <!--// TODO this needs to be filtered via the MID matrix-->
        <a
            href="/auth/admin/user_mgmt"
            class="flex items-center gap-2 bg-blue-200 rounded-lg p-1 shadow-sm"
        >
            <PersonIcon className="min-w-8 max-w-8 rounded-lg bg-blue-400 text-blue-800 p-1"/>
            <h1 class="text-xl font-extrabold">Collaborators</h1>
        </a>
        {/if}

        <button class="flex flex-col gap-2" onclick={flip_projects}>
            <span class="flex gap-2 items-center bg-blue-200 rounded-lg p-1 shadow-sm">
                <ProjectIcon className="min-w-8 max-w-8 rounded-lg bg-blue-400 text-blue-800 p-1"/>
                <h1 class="text-xl font-extrabold">Projects</h1>
                <span class="ml-auto px-3 transition-transform" class:rotate-180={projects_open}>
                    <Chevron/>
               </span>
                <a
                    href="/auth/admin/project/new"
                    class="good-button"
                    >Add</a
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
                        >{project.options.display_name} ({project.project_name})</a
                    >
                </li>
            {/each}
        </ol>
        {/if}

        
        <button class="flex gap-2 items-center bg-blue-200 rounded-lg p-1 shadow-sm" onclick={flip_documents}>
            <PaperClip className="min-w-8 max-w-8 rounded-lg bg-blue-400 text-blue-800 p-1"/>
            <h1 class="text-xl font-extrabold">Documents</h1>
            <span class="ml-auto px-3 transition-transform" class:rotate-180={documents_open}>
                <Chevron/>
            </span>
            <a
                href="/auth/admin/document/new"
                class="good-button"
                >Add</a
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

    {@render children?.()}
</div>

<style>
    .list-dashed-arrows {
        list-style: "⇢ ";
    }
</style>
