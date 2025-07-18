<script lang="ts">
    import { type Document, type Project, type AdminForm } from "$lib/types";

    export let data: { projects: Project[]; documents: Document[] };
</script>

<link rel="stylesheet" href="/app.css" />
<link href="/document.css" rel="stylesheet" />

<div class="relative flex min-h-screen bg-amber-50">
    <div
        class="flex flex-col bg-blue-50 w-1/4 min-h-full pt-10 mr-10 gap-5 border-r-2 border-r-blue-500 pl-4"
    >
        <span class="flex flex-col items-start px-3">
            <h1 class="text-3xl font-extrabold">Welcome</h1>
            <br />
            <p class="text-blue-600"><a href="/">Home</a></p>
            <p class="text-blue-600"><a href="/auth/admin/">Admin Root</a></p>
            <br />
            <br />
            <br />
            <p class="text-blue-600"><a href="/auth/logout/">Logout</a></p>
        </span>
        <div class="flex flex-col gap-2">
            <span class="flex justify-between items-center pr-8">
                <h1 class="text-xl font-extrabold px-3">Projects</h1>
                <a
                    href="/auth/admin/project/new"
                    class="bg-green-700 text-white font-bold py-1 px-2 text-sm"
                    >Add +</a
                >
            </span>

            <ol class="list-dashed-arrows ml-8">
                {#each data.projects as project}
                    <li class="text-blue-600">
                        <a
                            target="_self"
                            href="/auth/admin/project/{project.project_name}/"
                            >{project.metadata.human_name} ({project.project_name})</a
                        >
                    </li>
                {/each}
            </ol>
        </div>

        <div class="flex flex-col gap-2">
            <span class="flex justify-between items-center pr-8">
                <h1 class="text-xl font-extrabold px-3">Documents</h1>
                <a
                    href="/auth/admin/document/new"
                    class="bg-green-700 text-white font-bold py-1 px-2 text-sm"
                    >Add +</a
                >
            </span>

            <ol class="list-dashed-arrows ml-8">
                {#each data.documents as document}
                    <li class="text-blue-600">
                        <a
                            href="/auth/admin/document/{document.slug}/"
                            target="_self">{document.slug}</a
                        >
                    </li>
                {/each}
            </ol>
        </div>
    </div>

    <slot />
</div>

<style>
    .list-dashed-arrows {
        list-style: "⇢ ";
    }
</style>
