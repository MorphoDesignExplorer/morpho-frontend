<script>
    /** @type {parameters: string[]}*/
    export let parameters;

    /** @type {{lvalue: string, op: optype, rvalue: number | string}[]}*/
    export let filters;

    /** @enum {string} */
    const optype = {
        ge: ">=",
        le: "<=",
        gt: ">",
        lt: "<",
        eq: "=",
        ne: "!="
    }

    const empty_filter = {lvalue: "", op: optype.eq, rvalue: ""};

    $: {
        if (filters.length == 0) {
            filters.push(Object.assign({}, empty_filter))
        } if (filters[filters.length-1].lvalue != "") {
            filters.push(Object.assign({}, empty_filter))
        }
    }
</script>

<div class="flex flex-col w-full border-t-[1px] border-gray-200 p-2 gap-2">
    {#each Object.entries(filters) as [index, field]}
    <div class="flex flex-row items-center gap-2">
        <select name={`lvalue-${index}`} bind:value={field.lvalue} class="border border-gray-200 bg-white p-2 rounded-md">
            <option value="" disabled selected>parameter name...</option>
            {#each parameters as parameter}
            <option value={parameter}>{parameter}</option>
            {/each}
        </select>
        <select name={`op-${index}`} bind:value={field.op} class="border border-gray-200 bg-white p-2 rounded-md">
            {#each Object.values(optype) as op}
            <option value={op}>{op}</option>
            {/each}
        </select>
        <input name={`rvalue-${index}`} bind:value={field.rvalue} class="border border-gray-200 p-2 rounded-md" placeholder="parameter value...">
        {#if index != filters.length - 1}
        <button class="font-bold p-2" on:click={() => {
            filters = filters.filter((item, idx) => (idx == index) ? false: true);
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
            </svg>
        </button>
        {/if}
    </div>
    {/each}
</div>

<style>
</style>