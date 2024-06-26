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

    /** @type {{id: number | string, parameters: Object<string, string|number>, output_parameters: Object<string, string|number>, files: Object<string, string>[]}[]} */
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
            grid_position = "grid-colum: 1 / 2; grid-row: 1 / 3;"
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
</script>

<div id="swatches" class="w-full h-full overflow-hidden font-mono border-r-2 border-r-amber-950" style={grid_position}>
    <!-- Options -->
    <div
        id="swatch-option"
        class="flex flex-col font-mono mb-3 align-middle border-b-2 border-b-amber-950"
    >
        <div class="flex flex-row h-full">
            <div
                class="flex flex-row items-center border-r-2 border-x-amber-950 p-2"
            >
                <p class="font-bold">Default Image to Display:</p>
                <select class="bg-transparent" bind:value={image_tag}>
                    {#each allowed_tags as tag}
                        <option value={tag}>{tag}</option
                        >
                    {/each}
                </select>
            </div>
            <button
                on:click={() => {display_options.filter = !display_options.filter;}}
                class="border-r-2 border-x-amber-950 p-2"
            >
                Filters ↓
            </button>
            <button
                on:click={() => {display_options.graph = !display_options.graph;}}
                class="border-r-2 border-x-amber-950 p-2"
            >
                XY-Graph
            </button>
            <span class="border-r-2 border-x-amber-950 p-2 flex flex-row items-center">
                No. of Solutions: <b>{filtered_models.length}
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
            class="flex flex-row flex-wrap h-full w-full gap-2 p-4 overflow-scroll"
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
                        class="h-fit flex flex-col border-amber-950 border-2 p-1 cursor-pointer"
                        title="Click to show details"
                    >
                        <LazyImage
                            src={get_image_src_or_empty(
                                model,
                                image_tag
                            )}
                            placeholder="https://placehold.co/300/fed7aa/fed7aa"
                            alt={model.files[0].tag}
                            class="w-[10vw]"
                        />
                        <p>id: {model.scoped_id}</p>
                    </div>
                {/if}
            {/each}
        </div>
    {:else}
        <h2 class="font-bold text-2xl">Loading...</h2>
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
    }
</style>