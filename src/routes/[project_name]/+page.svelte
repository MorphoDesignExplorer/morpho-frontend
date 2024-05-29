<script>
    import { goto, invalidateAll } from '$app/navigation';
    import { LazyImage } from 'svelte-lazy-image';
    import FilterList from './Filters.svelte'
    import Sidepane from './Sidepane.svelte';
    import { predicate_equal } from '$lib/utils';
    import Swatches from './Swatches.svelte';
    import XyGraph from './XYGraph.svelte';

    /** @type {import('./$types').PageData} */
    export let data;

    /** @type {{filter: boolean, grid: boolean, graph: boolean, sidepane: boolean}}*/
    let display_options;
    const default_display_options = {sidepane: false, grid: true, filter: false, graph: false};

    /** @type {{id: number | string, parameters: Object<string, string|number>, output_parameters: Object<string, string|number>, files: Object<string, string>[]}[]} */
    let filtered_models;

    $: display_options = {
        sidepane: false,
        grid: true,
        filter: false,
        graph: false,
    }
    let sidepane_model;

    /** @type {(sub_url: string) => Promise<void>} */
    async function navigate_to_page(sub_url) {
        display_options.grid = false;
        await goto(`/${sub_url}`, {invalidateAll: true});
        await invalidateAll();
        Object.assign(display_options, default_display_options);
        display_options.grid = true;
    }

    /** @type {(model_id: number) => void}*/
    function set_project(model_id) {
        let model = data.models.filter(model_object => model_object.id === model_id)[0];
        sidepane_model = model;
        display_options.sidepane = true;
    }
</script>

<!-- Navbar -->
<div id="navbar" class="border-b-2 border-b-amber-950 p-4 flex items-center text-2xl font-mono font-extrabold gap-3">
    <h2 class="select-none">🦋 Morpho Design Explorer</h2>
    <span>/</span>
    <select class="bg-transparent" value={data.project_name} on:change={ async event=> {
        await navigate_to_page(event.target.value);
    }}>
    {#each data.project_names as project_name}
        <option value={project_name}>{project_name}</option>
    {/each}
    </select>
</div>

<!-- Main Data Display -->
<div id="content" class="w-[100vw] overflow-scroll">
    <!-- Graph Area -->
    {#if display_options.graph}
    <XyGraph models={filtered_models} parameters={
        data.project.variable_metadata
        .map((meta) => meta.field_name)
        .concat(
            data.project.output_metadata.map(
                (meta) => meta.field_name,
            ),
        )}
        set_project={set_project}
        bind:display_options={display_options}
    />
    {/if}

    <!-- Item Select area -->
    <Swatches
        allowed_tags={data.project.assets.map(asset => asset.tag)}
        bind:display_options={display_options}
        models={data.models}
        project_metadata={data.project}
        set_project={set_project}
        bind:filtered_models={filtered_models}
    />

    {#if display_options.sidepane}
    <!-- Sidepane Block -->
    <Sidepane
        bind:display_options={display_options}
        bind:model={sidepane_model}
        allowed_tags={data.project.assets.map(asset => asset.tag)}
    />
    {/if}
</div>

<style>
    #navbar {
        grid-area: navbar;
    }

    #content {
        grid-area: content;
        display: grid;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 1fr;
    }
</style>

