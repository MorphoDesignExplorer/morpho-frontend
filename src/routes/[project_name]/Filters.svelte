<script lang="ts">
    import { run } from 'svelte/legacy';

    import { get_filter_predicates, type ManualFilter, type ManualFilterOptype } from "$lib/context"
    import { slide } from "svelte/transition";
    import CrossIcon from "$lib/icons/Cross.svelte"

    interface Props {
        parameters: string[];
    }

    let { parameters }: Props = $props();

    let filter_predicates = get_filter_predicates();

    let filters: ManualFilter[] = $state($filter_predicates.filter_predicate);
    run(() => {
        $filter_predicates.filter_predicate = filters;
    });


    const optype: Record<string, ManualFilterOptype> = {
        ge: ">=",
        le: "<=",
        gt: ">",
        lt: "<",
        eq: "=",
        ne: "!="
    }

    const empty_filter = {lvalue: "", op: optype.eq, rvalue: ""};

    run(() => {
        if (filters.length == 0) {
            filters.push(Object.assign({}, empty_filter))
        } if (filters[filters.length-1].lvalue != "") {
            filters.push(Object.assign({}, empty_filter))
        }
    });
</script>

<div class="flex flex-col w-full p-2 gap-2">
    {#each Object.entries(filters) as [index, field]}
    <div class="flex flex-row items-center text-sm w-fit shadow-sm" in:slide out:slide>
        <!--Parameter Name Select -->
        <select name={`lvalue-${index}`} bind:value={field.lvalue} class="h-full border border-gray-200 bg-white p-2 rounded-l-lg">
            <option value="" class="" disabled selected>parameter name...</option>
            {#each parameters as parameter}
            <option class="text-black" value={parameter}>{parameter}</option>
            {/each}
        </select>
        <!-- Operator Select -->
        <select name={`op-${index}`} bind:value={field.op} class="h-full border-y border-gray-200 bg-gray-50 p-2 font-bold">
            {#each Object.values(optype) as op}
            <option value={op}>{op}</option>
            {/each}
        </select>
        {#if index != filters.length - 1}

        <!-- R-Value Input -->
        <input name={`rvalue-${index}`} bind:value={field.rvalue} class="h-full border-l border-y border-gray-200 p-2 rounded-r-lg" placeholder="parameter value...">
        <!-- Delete Filter Button -->
        <button class="ml-2 h-full bg-gray-50 border border-gray-200 font-bold p-1 rounded-lg" onclick={() => {
            filters = filters.filter((item, idx) => (idx == index) ? false: true);
        }}>
            <CrossIcon/>
        </button>

        {:else}
        <!-- R-Value Input -->
        <input name={`rvalue-${index}`} bind:value={field.rvalue} class="h-full border border-gray-200 p-2 rounded-r-lg" placeholder="parameter value...">
        {/if}
    </div>
    {/each}
</div>

<style>
</style>
