<script lang="ts">
    import { run } from 'svelte/legacy';

    import { get_filter_predicates, type ManualFilter, type ManualFilterOptype } from "$lib/context"
    import { slide } from "svelte/transition";

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
        <select name={`lvalue-${index}`} bind:value={field.lvalue} class="h-full border border-gray-200 bg-white p-2">
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
        <input name={`rvalue-${index}`} bind:value={field.rvalue} class="h-full border-l border-y border-gray-200 p-2" placeholder="parameter value...">
        <!-- Delete Filter Button -->
        <button class="h-full bg-gray-50 border border-gray-200 font-bold p-2" onclick={() => {
            filters = filters.filter((item, idx) => (idx == index) ? false: true);
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                <path stroke-width="5px" fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
            </svg>
        </button>

        {:else}
        <!-- R-Value Input -->
        <input name={`rvalue-${index}`} bind:value={field.rvalue} class="h-full border border-gray-200 p-2" placeholder="parameter value...">
        {/if}
    </div>
    {/each}
</div>

<style>
</style>