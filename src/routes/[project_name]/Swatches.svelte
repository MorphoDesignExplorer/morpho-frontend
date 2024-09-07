<script lang="ts">
    import Filters from "./Filters.svelte";
    import { get_image_src_or_empty, predicate_equal } from "$lib/utils";
    import type { Caption, DisplayOptions, Model, Project } from "$lib/types";
    import { getContext, onMount } from "svelte";
    import type { Writable } from "svelte/store";
    import LazyImagePlus from "./LazyImagePlus.svelte";
    import { get_filter_predicates } from "../../lib/context";
    import { interpolateGreens } from "d3";

    export let allowed_tags: string[];

    let image_tag: string;

    let display_options: Writable<DisplayOptions> = getContext("display_options");

    export let models: Model[];

    export let project_metadata: Project;

    export let set_project;

    export let unit_map: Record<string, string>;

    export let caption_tags: Caption[];

    // let filter_predicates: {lvalue: string, op: string | number, rvalue: string}[] = [];
    let filter_predicates = get_filter_predicates();

    /** @type {{id: number | string, scoped_id: number, parameters: Object<string, string|number>, output_parameters: Object<string, string|number>, files: Object<string, string>[]}[]} */
    export let filtered_models: Model[];

    // default argument for caption tag list
    // filter_predicates = [];
    $: if (!$display_options.grid) {
        // grid is closed for reloading, wipe filters
        $filter_predicates.filter_predicate = [];
    }
    $: filtered_models = models.filter(
        predicate_equal(Array.from($filter_predicates.filter_predicate))
    ).filter(model => {
        if ($filter_predicates.chart_predicate.length === 0) {
            return true;
        } else {
            return $filter_predicates.chart_predicate.indexOf(model.id) > -1
        }
    })

    let grid_position: string;
    $: {
        if (!$display_options.graph && !$display_options.sidepane) {
            grid_position = "grid-column: 1 / 3; grid-row: 1 / 3;"
        } else if (!$display_options.graph && $display_options.sidepane) {
            grid_position = "grid-column: 1 / 2; grid-row: 1 / 3;"
        } else if ($display_options.graph && !$display_options.sidepane) {
            grid_position = "grid-column: 2 / 3; grid-row: 1 / 3;"
        } else if ($display_options.graph && $display_options.sidepane) {
            grid_position = "grid-column: 2 / 3; grid-row: 2 / 3;"
        }
    }

    let grid_element: HTMLDivElement;
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
    function swatch_caption(model: Model, caption_tags: Caption[]): {display_name: string, unit: string, value: string | number}[] {
        const captions: {display_name: string, unit: string, value: string | number}[] = [
            {display_name: "Solution ID", unit: "", value: model["scoped_id"]}
        ];
        for (let param_idx = 0; param_idx < caption_tags.length; param_idx ++) {
            const param = caption_tags[param_idx];
            let caption: {display_name: string, unit: string, value: string | number} = {display_name: param.display_name, unit: unit_map[param.tag_name], value: ""}
            if (param.tag_name in model.parameters) {
                caption.value = model.parameters[param.tag_name];
            } else {
                caption.value = model.output_parameters[param.tag_name];
            }
            captions.push(caption)
        }
        return captions;
    }

    let grid_element_width: number;
    let item_grid_column_style = `grid-template-columns: repeat(6, minmax(0, 1fr))`;

    onMount(() => {
        item_grid_column_style = `grid-template-columns: repeat(${Math.floor(grid_element.clientWidth / 220)}, minmax(0, 1fr))`;
    })

    display_options.subscribe(() => {
        if (grid_element) {
            setTimeout(() => {
                item_grid_column_style = `grid-template-columns: repeat(${Math.floor(grid_element.clientWidth / 220)}, minmax(0, 1fr))`;
            }, 1)
        }
    })
</script>

<div id="swatches" class="w-full h-full overflow-hidden border-r border-r-gray-200" style={grid_position}>
    <!-- Options -->
    <div
        id="swatch-option"
        class="flex flex-col justify-end border-b-4 border-b-blue-500 shadow-sm"
    >
        <div class="flex h-10 pl-2 gap-3 border-b-4 border-blue-500 mt-2">
            <div
                class="flex select-none"
            >
                <label for="image-select" class="h-full p-1 flex items-center border-x border-t border-blue-500 bg-blue-500 text-white font-bold">Thumbnail</label>
                <select id="image-select" class="h-full p-1 hover:bg-gray-200 border-t border-r border-blue-500 text-blue-500 font-bold transition-colors ease-linear cursor-pointer" bind:value={image_tag}>
                    {#each allowed_tags as tag}
                        <option value={tag}>{tag}</option
                        >
                    {/each}
                </select>
            </div>
            <button
                on:click={() => {$display_options.filter = !$display_options.filter;}}
                class="bg-blue-500 border border-blue-500 p-1 px-3 select-none flex flex-row items-center gap-3 text-white hover:bg-white hover:text-blue-500 transition-colors ease-linear font-bold"
            >
                Filters
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                    <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                </svg>
            </button>
            <button
                on:click={() => {$display_options.graph = !$display_options.graph;}}
                class="bg-blue-500 border border-blue-500 p-1 px-3 select-none flex flex-row items-center gap-2 text-white hover:text-blue-500 hover:bg-white transition-colors ease-linear font-bold"
            >
                Graph
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                    <path fill-rule="evenodd" d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm4.5 7.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 .75-.75Zm3.75-1.5a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0V12Zm2.25-3a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0V9.75A.75.75 0 0 1 13.5 9Zm3.75-1.5a.75.75 0 0 0-1.5 0v9a.75.75 0 0 0 1.5 0v-9Z" clip-rule="evenodd" />
                </svg>
            </button>
            <span class="bg-blue-500 border border-blue-500 p-1 px-3 select-none flex flex-row items-center gap-2 text-white font-bold">
                No. of Solutions:<b>{filtered_models.length}</b>
            </span>
        </div>
        {#if $display_options.filter}
            <Filters
                parameters={project_metadata.variable_metadata
                    .map((meta) => meta.field_name)
                    .concat(
                        project_metadata.output_metadata.map(
                            (meta) => meta.field_name,
                        ),
                    )}
            />
        {/if}
    </div>

    <!-- Items grid -->
    {#if $display_options.grid}
        <div
            id="swatch-item-grid"
            bind:this={grid_element}
            bind:clientWidth={grid_element_width}
            on:scroll={get_percentage}
            style={item_grid_column_style}
        >
            {#each filtered_models.slice(0, render_item_count) as model}
                {#if get_image_src_or_empty(model, image_tag).length > 0}
                    <div
                        role="button"
                        tabindex="0"
                        on:click={() => set_project(model.id)}
                        on:keydown={() => set_project(model.id)}
                        class="flex flex-col items-center p-2 border border-gray-200 cursor-pointer hover:bg-slate-200 transition ease-out"
                        title="Click to show details"
                    >
                        <LazyImagePlus
                            src={get_image_src_or_empty(
                                model,
                                image_tag
                            )}
                            placeholder="https://placehold.co/300/f8fafc/f8fafc"
                            alt={model.files[0].tag}
                            class="w-[9vw] rounded-sm"
                        />

                        <!-- project-specific display tag for each swatch -->
                        <div class="w-full flex flex-col pt-2 mt-auto">
                        {#each swatch_caption(model, caption_tags) as caption}
                            <span class="flex justify-between items-center gap-2">
                                <span class="text-xs text-slate-500 font-semibold">
                                    {caption.display_name}
                                    {#if caption.unit.length > 0}
                                    <span class="text-xs text-black font-bold">[{caption.unit}]</span>
                                    {/if}
                                </span>
                                <span class="ml-auto text-sm text-black">{Intl.NumberFormat("en-us", {notation: "compact"}).format(caption.value)}</span>
                            </span>
                        {/each}
                        </div>
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

<style lang="postcss">
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

        @apply h-full w-full p-4 overflow-scroll grid;

        grid-template-columns: repeat(4, minmax(0, 1fr));

        /* @apply flex flex-row flex-wrap h-full w-full p-4 overflow-scroll justify-center */
    }
</style>