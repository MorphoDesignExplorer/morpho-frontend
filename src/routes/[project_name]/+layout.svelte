<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import { page } from "$app/stores";
    import {
        set_display_options,
        set_filter_predicates,
        type FilterPredicates,
    } from "$lib/context.js";
    import { type DisplayOptions } from "$lib/types";
    import { writable } from "svelte/store";
    export let data;

    async function navigate_to_page(sub_url: string) {
        $display_options = {
            grid: true,
            filter: false,
            graph: false,
            sidepane: false,
        };
        await goto(`/${sub_url}`, { invalidateAll: true });
        await invalidateAll();
    }

    let filter_predicates = writable<FilterPredicates>({
        chart_predicate: [],
        filter_predicate: [{ lvalue: "", op: "=", rvalue: "" }],
    });

    let display_options = writable<DisplayOptions>({
        grid: true,
        filter: false,
        graph: false,
        sidepane: false,
    });

    set_display_options(display_options);
    set_filter_predicates(filter_predicates);
</script>

<div class="main-grid font-sans">
    <!-- Navbar -->
    <div
        id="navbar"
        class="p-4 flex items-center text-lg text-black font-extrabold gap-3 border-b-[1px] border-b-slate-200"
    >
        <a href="/" class="flex flex-row items-center gap-3">
            <img
                src="https://morpho-images.s3.us-east-1.amazonaws.com/assets/morpho.png"
                class="w-20 backdrop-blur-lg"
                alt="icon"
            />
            <h2 class="select-none">Morpho Design Explorer</h2>
        </a>
        <span class="bg-slate-200 w-[1px] h-1/2"></span>
        <select
            class="bg-transparent"
            value={$page.params.project_name}
            on:change={async (event) => {
                await navigate_to_page(event.currentTarget?.value);
            }}
        >
            {#each data.projects.sort((a, b) => {
                const a_date = Date.parse(a.creation_date);
                const b_date = Date.parse(b.creation_date);
                if (a_date < b_date) {
                    return -1;
                } else if (a_date == b_date) {
                    return 0;
                } else {
                    return 1;
                }
            }) || [] as project}
                <option class="text-black" value={project.project_name}
                    >{project.metadata.human_name}</option
                >
            {/each}
        </select>

        <!-- Project Sections Navigation -->
        <div class="flex">
            <a
                href="/{$page.params.project_name}/"
                class="flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-lg rounded-r-none text-blue-500 px-3 py-1 hover:bg-blue-500 hover:text-white transition-colors ease-in-out font-normal"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6"
                >
                    <path
                        d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875Z"
                    />
                    <path
                        d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 0 0 1.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 0 0 1.897 1.384C6.809 12.164 9.315 12.75 12 12.75Z"
                    />
                    <path
                        d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 15.914 9.315 16.5 12 16.5Z"
                    />
                    <path
                        d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 19.664 9.315 20.25 12 20.25Z"
                    />
                </svg>
                Data
            </a>
            <a
                href="/{$page.params.project_name}/about"
                class="flex items-center gap-2 bg-white border border-gray-200 shadow-sm text-blue-500 px-3 py-1 hover:bg-blue-500 hover:text-white transition-colors ease-in-out font-normal rounded-r-lg"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2.5"
                    stroke="currentColor"
                    class="size-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                    />
                </svg>
                About
            </a>
        </div>
        <!-- End Project Sections Navigation -->
    </div>
    <!-- Navbar End -->
    <slot />
</div>

<style>
    .main-grid {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 9fr;
        grid-template-areas:
            "navbar"
            "content";
        height: 100vh;
        width: 100vw;
    }

    #navbar {
        grid-area: navbar;
    }
</style>
