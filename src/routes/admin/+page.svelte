<script lang="ts">
    import { enhance } from '$app/forms';
    import { type ProjectField } from '$lib/types.js';
    import { writable } from 'svelte/store';
    export let data;

    let form_state = writable<{
        project_name: string,
        variable_metadata: ProjectField[],
        output_metadata: ProjectField[]
    }>({
        project_name: "",
        variable_metadata: [],
        output_metadata: []
    })

    let new_variable_field: ProjectField = {
        field_name: "",
        field_range: [-Infinity, Infinity],
        field_step: 0,
        field_type: "",
        field_unit: "",
        field_precision: null
    }

</script>

<div id="configuration" class="p-4 w-full h-full flex flex-col">
    <p class="text-2xl font-bold">Create Project</p>
    <form action="?/create-project" method="post" class="flex flex-col w-full h-full" use:enhance>
    </form>
</div>

<style>
    #configuration {
        grid-area: configuration;
    }
</style>