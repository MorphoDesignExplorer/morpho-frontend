<script lang="ts">
    import Sidepane from './Sidepane.svelte';
    import Swatches from './Swatches.svelte';
    import type { PageData } from './$types';
    import type { Caption, DisplayOptions, Model } from '$lib/types';
    import {type Writable, writable} from 'svelte/store';
    import Graph from './Graph.svelte';
    import { get_display_options, get_filter_predicates, set_display_options } from '$lib/context';

    export let data: PageData;

    let filter_predicates = get_filter_predicates();

    /*
    const default_display_options: DisplayOptions = {sidepane: false, grid: true, filter: false, graph: false};
    let display_options: Writable<DisplayOptions> = writable(default_display_options);;
    set_display_options(display_options);
    */

    let display_options = get_display_options();

    $: $display_options = {
        sidepane: false,
        grid: true,
        filter: false,
        graph: false,
    } as DisplayOptions

    display_options.subscribe((options) => {
        if (!options.graph)
        $filter_predicates.chart_predicate = []
    })

    let caption_tags: Caption[];
    const default_caption_tags: Caption[] = [{tag_name: "scoped_id", display_name: "Solution ID"}]
    $: caption_tags = data.project.metadata.captions
    $: if (data.project.metadata.captions.length === 0) {
        caption_tags = default_caption_tags;
    }

    let filtered_models: Model[];

    let unit_map: Record<string, string> = {}
    $: {
        data.project.variable_metadata.forEach(meta => {
            unit_map[meta["field_name"]] = meta["field_unit"]
        });
        data.project.output_metadata.forEach(meta => {
            unit_map[meta["field_name"]] = meta["field_unit"]
        });
    }

    let model_in_focus: Model;

    function set_project(model_id: number) {
        let model = data.models.filter(model_object => model_object.id === model_id)[0];
        model_in_focus = model;
        $display_options.sidepane = true;
    }
</script>

<!-- Main Data Display -->
<div id="content" class="w-[100vw] overflow-scroll overflow-x-hidden text-sm">
    <!-- Graph Area -->
    {#if $display_options.graph}
    <Graph models={data.models} parameters={
        data.project.variable_metadata
        .map((meta) => meta.field_name)
        .concat(
            data.project.output_metadata.map(
                (meta) => meta.field_name,
            ),
        )}
        set_project={set_project}
        unit_map={unit_map}
        model_in_focus={model_in_focus}
    />
    {/if}

    <!-- Item Select area -->
    <Swatches
        allowed_tags={data.project.assets.map(asset => asset.tag)}
        models={data.models}
        project_metadata={data.project}
        set_project={set_project}
        caption_tags={caption_tags}
        unit_map={unit_map}
        bind:filtered_models={filtered_models}
    />

    {#if $display_options.sidepane}
    <!-- Sidepane Block -->
    <Sidepane
        bind:model={model_in_focus}
        allowed_tags={data.project.assets.filter(asset => data.project.options.nonpublic_assets.indexOf(asset.tag) == -1).map(asset => asset.tag)}
        unit_map={unit_map}
    />
    {/if}
</div>
<!-- End of Main Data Display -->

<style>
    #content {
        grid-area: content;
        display: grid;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 0.8fr;
    }
</style>

