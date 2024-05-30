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

<div class="flex flex-col w-full border-t-2 border-amber-950 p-2">
    {#each Object.entries(filters) as [index, field]}
    <div class="flex flex-row items-center gap-2">
        <select name={`lvalue-${index}`} bind:value={field.lvalue} class="border-2 border-amber-950 p-2">
            <option value="" disabled selected>parameter name...</option>
            {#each parameters as parameter}
            <option value={parameter}>{parameter}</option>
            {/each}
        </select>
        <select name={`op-${index}`} bind:value={field.op} class="border-2 border-amber-950 p-2">
            {#each Object.values(optype) as op}
            <option value={op}>{op}</option>
            {/each}
        </select>
        <input name={`rvalue-${index}`} bind:value={field.rvalue} class="border-2 border-amber-950 p-2" placeholder="parameter value...">
        {#if index != filters.length - 1}
        <button class="font-bold p-2" on:click={() => {
            filters = filters.filter((item, idx) => (idx == index) ? false: true);
        }}>x</button>
        {/if}
    </div>
    {/each}
</div>

<style>
</style>