<script>
    import { LazyImage } from "svelte-lazy-image";
    import Filters from "./Filters.svelte";
    import { get_image_src_or_empty, predicate_equal } from "$lib/utils";

    /** @type {string[]} */
    export let allowed_tags;

    /** @type {string} */
    let image_tag;

    /** @type {{filter: boolean, grid: boolean, graph: boolean, sidepane: boolean}}*/
    export let display_options;

    /** @type {{id: number | string, scoped_id: number, parameters: Object<string, string|number>, output_parameters: Object<string, string|number>, files: Object<string, string>[]}[]} */
    export let models;

    export let project_metadata;

    export let set_project;

    /** @type {{lvalue: string, op: string, rvalue: string | number}[]}*/
    let filter_predicates = [];

    /** @type {{id: number | string, scoped_id: number, parameters: Object<string, string|number>, output_parameters: Object<string, string|number>, files: Object<string, string>[]}[]} */
    export let filtered_models;

    filter_predicates = [];
    $: if (!display_options.grid) {
        // grid is closed for reloading, wipe filters
        filter_predicates = [];
    }
    $: filtered_models = models.filter(predicate_equal(Array.from(filter_predicates)));

    /** @type {string} */
    let grid_position;
    $: {
        if (!display_options.graph && !display_options.sidepane) {
            grid_position = "grid-column: 1 / 3; grid-row: 1 / 3;"
        } else if (!display_options.graph && display_options.sidepane) {
            grid_position = "grid-column: 1 / 2; grid-row: 1 / 3;"
        } else if (display_options.graph && !display_options.sidepane) {
            grid_position = "grid-column: 2 / 3; grid-row: 1 / 3;"
        } else if (display_options.graph && display_options.sidepane) {
            grid_position = "grid-column: 2 / 3; grid-row: 2 / 3;"
        }
    }

    /** @type {HTMLDivElement}*/
    let grid_element;
    let render_item_count = 50;

    function get_percentage() {
        const percentage = 100 * grid_element.scrollTop / (grid_element.scrollHeight - grid_element.clientHeight);

        if (percentage > 80) {
            render_item_count = Math.min(render_item_count + 50, filtered_models.length);
        }
    }

    /** 
     * Generates a caption for a model within a swatch.
     * @function
     * @param model {{id: number | string, scoped_id: number, parameters: Object<string, string|number>, output_parameters: Object<string, string|number>, files: Object<string, string>[]}} model to generate the caption for
     * @param display_parameter_names {string[]} list of parameter names to be displayed
    */
    function swatch_caption(model, display_parameter_names) {
        let caption = "";
        let start = true;
        console.log(display_parameter_names);
        for (let param_idx in display_parameter_names) {
            const param = display_parameter_names[param_idx]
            if (!start) caption += " | "
            if (param === "id") {
                caption += "id: ";
                caption += model.id;
            } else if (param === "scoped_id") {
                caption += "id: ";
                caption += model.scoped_id;
            } else {
                caption += `${param}: `;
                caption += (param in Object.keys(model.parameters)) ? model.parameters[param] : model.output_parameters[param];
            }
            start = false;
        }
        return caption;
    }
</script>

<div id="swatches" class="w-full h-full overflow-hidden border-r border-r-gray-200" style={grid_position}>
    <!-- Options -->
    <div
        id="swatch-option"
        class="flex flex-col mb-3 align-middle border-b border-b-gray-200 shadow-sm"
    >
        <div class="flex flex-row h-full gap-3 m-2">
            <div
                class="flex flex-row items-center gap-2 bg-blue-100 rounded-md p-2 px-3 select-none hover:bg-blue-200 transition-colors ease-linear"
            >
                <label for="image-select" class="font-bold">Default Image to Display:</label>
                <select id="image-select" class="bg-transparent" bind:value={image_tag}>
                    {#each allowed_tags as tag}
                        <option value={tag}>{tag}</option
                        >
                    {/each}
                </select>
            </div>
            <button
                on:click={() => {display_options.filter = !display_options.filter;}}
                class="bg-blue-100 rounded-md p-2 px-3 select-none flex flex-row items-center gap-3 hover:bg-blue-200 transition-colors ease-linear"
            >
                Filters
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                    <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                </svg>
            </button>
            <button
                on:click={() => {display_options.graph = !display_options.graph;}}
                class="bg-blue-100 rounded-md p-2 px-3 select-none flex flex-row items-center gap-2 hover:bg-blue-200 transition-colors ease-linear"
            >
                XY-Graph
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                    <path fill-rule="evenodd" d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm4.5 7.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 .75-.75Zm3.75-1.5a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0V12Zm2.25-3a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0V9.75A.75.75 0 0 1 13.5 9Zm3.75-1.5a.75.75 0 0 0-1.5 0v9a.75.75 0 0 0 1.5 0v-9Z" clip-rule="evenodd" />
                </svg>
            </button>
            <span class="bg-blue-100 rounded-md p-2 px-3 select-none flex flex-row items-center gap-2">
                No. of Solutions:<b>{filtered_models.length}</b>
            </span>
        </div>
        {#if display_options.filter}
            <Filters
                parameters={project_metadata.variable_metadata
                    .map((meta) => meta.field_name)
                    .concat(
                        project_metadata.output_metadata.map(
                            (meta) => meta.field_name,
                        ),
                    )}
                bind:filters={filter_predicates}
            />
        {/if}
    </div>

    <!-- Items area -->
    {#if display_options.grid}
        <div
            id="swatch-item-grid"
            class="flex flex-row flex-wrap h-full w-full p-4 overflow-scroll justify-center"
            bind:this={grid_element}
            on:scroll={get_percentage}
        >
            {#each filtered_models.slice(0, render_item_count) as model}
                {#if get_image_src_or_empty(model, image_tag).length > 0}
                    <div
                        role="button"
                        tabindex="0"
                        on:click={() => set_project(model.id)}
                        on:keydown={() => set_project(model.id)}
                        class="h-fit grid p-2 border border-gray-200 cursor-pointer hover:bg-slate-200 transition ease-out"
                        title="Click to show details"
                    >
                        <LazyImage
                            src={get_image_src_or_empty(
                                model,
                                image_tag
                            )}
                            placeholder="https://placehold.co/300/f8fafc/f8fafc"
                            alt={model.files[0].tag}
                            class="w-[10vw] rounded-sm"
                        />
                        <!-- project-specific display tag for each swatch -->
                         <p class="text-sm text-slate-800">{swatch_caption(model, ["scoped_id"])}</p>
                        <!-- <p class="text-sm text-slate-800">id: {model.scoped_id}</p> -->
                    </div>
                {/if}
            {/each}
        </div>
    {:else}
        <div class="p-4">
            <h2 class="font-bold text-2xl m-4">Loading...</h2>
        </div>
    {/if}
</div>

<style>
    #swatches {
        display: grid;
        overflow-x: clip;
        grid-template-rows: 1fr 11fr;
        grid-template-areas:
            "swatch-option"
            "swatch-item-grid";
    }

    #swatch-option {
        grid-area: swatch-option;
    }

    #swatch-item-grid {
        grid-area: swatch-item-grid;
        scrollbar-width: thin;
        scrollbar-color: #3B82F6 white;
    }
</style>