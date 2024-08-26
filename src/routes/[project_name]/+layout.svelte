<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto, invalidateAll } from "$app/navigation";
    import { base } from "$app/paths";
    import { page } from "$app/stores";
    import { set_display_options, set_filter_predicates, type FilterPredicates } from "$lib/context.js";
    import { type DisplayOptions } from "$lib/types";
    import { writable } from "svelte/store";
    export let data;

    async function navigate_to_page(sub_url: string) {
        $display_options = {
            grid: true,
            filter: false,
            graph: false,
            sidepane: false
        }
        await goto(`${base}/${sub_url}`, {invalidateAll: true});
        await invalidateAll();
    }

    let filter_predicates = writable<FilterPredicates>({
        chart_predicate: [],
        filter_predicate: [{lvalue: "", op: "=", rvalue: ""}]
    })

    let display_options = writable<DisplayOptions>({
        grid: true,
        filter: false,
        graph: false,
        sidepane: false
    })

    set_display_options(display_options);
    set_filter_predicates(filter_predicates);
</script>

<div class="main-grid font-sans">
    <!-- Navbar -->
    <div id="navbar" class="p-4 flex items-center text-lg font-extrabold gap-3 bg-blue-500 text-white">
        <a href="{base}/" class="flex flex-row items-center gap-3">
            <img src="https://morpho-images.nyc3.cdn.digitaloceanspaces.com/morpho-images/media/assets/morpho.png" class="w-28 backdrop-blur-lg" alt="icon">
            <h2 class="select-none">Morpho Design Explorer</h2>
        </a>
        <span>/</span>
        <select class="bg-transparent" value={$page.params.project_name} on:change={ async event => {
            await navigate_to_page(event.target?.value);
        }}>
        {#each data.projects as project}
            <option class="text-black" value={project.project_name}>{project.metadata.human_name}</option>
        {/each}
        </select>

        <!-- Project Sections Navigation -->
        <div class="flex">
            <a href="{base}/{$page.params.project_name}/" class="flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-lg rounded-r-none text-blue-500 px-3 py-1 hover:bg-blue-500 hover:text-white transition-colors ease-in-out font-normal">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                    <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875Z" />
                    <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 0 0 1.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 0 0 1.897 1.384C6.809 12.164 9.315 12.75 12 12.75Z" />
                    <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 15.914 9.315 16.5 12 16.5Z" />
                    <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 19.664 9.315 20.25 12 20.25Z" />
                </svg>
                Data
            </a>
            <a href="{base}/{$page.params.project_name}/about" class="flex items-center gap-2 bg-white border border-gray-200 shadow-sm text-blue-500 px-3 py-1 hover:bg-blue-500 hover:text-white transition-colors ease-in-out font-normal" class:rounded-r-lg={data.authentication_status.status !== "VERIFIED"}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                About
            </a>
            {#if data.authentication_status.status === "VERIFIED"}
            <a href="{base}/{$page.params.project_name}/configure" class="flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-lg rounded-l-none text-blue-500 px-3 py-1 hover:bg-blue-500 hover:text-white transition-colors ease-in-out font-normal">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                    <path d="M17.004 10.407c.138.435-.216.842-.672.842h-3.465a.75.75 0 0 1-.65-.375l-1.732-3c-.229-.396-.053-.907.393-1.004a5.252 5.252 0 0 1 6.126 3.537ZM8.12 8.464c.307-.338.838-.235 1.066.16l1.732 3a.75.75 0 0 1 0 .75l-1.732 3c-.229.397-.76.5-1.067.161A5.23 5.23 0 0 1 6.75 12a5.23 5.23 0 0 1 1.37-3.536ZM10.878 17.13c-.447-.098-.623-.608-.394-1.004l1.733-3.002a.75.75 0 0 1 .65-.375h3.465c.457 0 .81.407.672.842a5.252 5.252 0 0 1-6.126 3.539Z" />
                    <path fill-rule="evenodd" d="M21 12.75a.75.75 0 1 0 0-1.5h-.783a8.22 8.22 0 0 0-.237-1.357l.734-.267a.75.75 0 1 0-.513-1.41l-.735.268a8.24 8.24 0 0 0-.689-1.192l.6-.503a.75.75 0 1 0-.964-1.149l-.6.504a8.3 8.3 0 0 0-1.054-.885l.391-.678a.75.75 0 1 0-1.299-.75l-.39.676a8.188 8.188 0 0 0-1.295-.47l.136-.77a.75.75 0 0 0-1.477-.26l-.136.77a8.36 8.36 0 0 0-1.377 0l-.136-.77a.75.75 0 1 0-1.477.26l.136.77c-.448.121-.88.28-1.294.47l-.39-.676a.75.75 0 0 0-1.3.75l.392.678a8.29 8.29 0 0 0-1.054.885l-.6-.504a.75.75 0 1 0-.965 1.149l.6.503a8.243 8.243 0 0 0-.689 1.192L3.8 8.216a.75.75 0 1 0-.513 1.41l.735.267a8.222 8.222 0 0 0-.238 1.356h-.783a.75.75 0 0 0 0 1.5h.783c.042.464.122.917.238 1.356l-.735.268a.75.75 0 0 0 .513 1.41l.735-.268c.197.417.428.816.69 1.191l-.6.504a.75.75 0 0 0 .963 1.15l.601-.505c.326.323.679.62 1.054.885l-.392.68a.75.75 0 0 0 1.3.75l.39-.679c.414.192.847.35 1.294.471l-.136.77a.75.75 0 0 0 1.477.261l.137-.772a8.332 8.332 0 0 0 1.376 0l.136.772a.75.75 0 1 0 1.477-.26l-.136-.771a8.19 8.19 0 0 0 1.294-.47l.391.677a.75.75 0 0 0 1.3-.75l-.393-.679a8.29 8.29 0 0 0 1.054-.885l.601.504a.75.75 0 0 0 .964-1.15l-.6-.503c.261-.375.492-.774.69-1.191l.735.267a.75.75 0 1 0 .512-1.41l-.734-.267c.115-.439.195-.892.237-1.356h.784Zm-2.657-3.06a6.744 6.744 0 0 0-1.19-2.053 6.784 6.784 0 0 0-1.82-1.51A6.705 6.705 0 0 0 12 5.25a6.8 6.8 0 0 0-1.225.11 6.7 6.7 0 0 0-2.15.793 6.784 6.784 0 0 0-2.952 3.489.76.76 0 0 1-.036.098A6.74 6.74 0 0 0 5.251 12a6.74 6.74 0 0 0 3.366 5.842l.009.005a6.704 6.704 0 0 0 2.18.798l.022.003a6.792 6.792 0 0 0 2.368-.004 6.704 6.704 0 0 0 2.205-.811 6.785 6.785 0 0 0 1.762-1.484l.009-.01.009-.01a6.743 6.743 0 0 0 1.18-2.066c.253-.707.39-1.469.39-2.263a6.74 6.74 0 0 0-.408-2.309Z" clip-rule="evenodd" />
                </svg>
                Configure
            </a>
            {/if}
        </div>
        <!-- End Project Sections Navigation -->

        <div class="ml-auto mr-4 flex items-center gap-4 text-white text-lg font-normal">
        {#if data.authentication_status.status == "VERIFIED"}
            <p class="capitalize">Hello, {data.authentication_status.username}!</p>
            <form method="post" action="?/logout" use:enhance>
                <button type="submit" class="bg-white border border-gray-200 shadow-sm rounded-lg text-blue-500 px-3 py-1 hover:bg-blue-500 hover:text-white transition-colors ease-in-out items-center">Logout</button>
            </form>
        {:else}
            <a href="{base}/auth/login/?redirect={$page.url.pathname}" class="bg-white border border-gray-200 shadow-sm rounded-lg text-blue-500 px-3 py-1 hover:bg-blue-500 hover:text-white transition-colors ease-in-out items-center">Login</a>
        {/if}
    </div>
</div>
<!-- Navbar End -->
    <slot/>
</div>

<style>
    .main-grid {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 9fr;
        grid-template-areas: 
            "navbar"
            "content"
        ;
        height: 100vh;
        width: 100vw;
    }

    #navbar {
        grid-area: navbar;
    }
</style>