<script>
    /** @type {{filter: boolean, grid: boolean, graph: boolean, sidepane: boolean}}*/
    export let display_options;

    /** @type {{id: number | string, scoped_id: number, parameters: Object<string, string|number>, output_parameters: Object<string, string|number>, files: Object<string, string>[]}}*/
    export let model;

    /** @type {string[]} */
    export let allowed_tags;

    /** @type {Object<string, string>}*/
    export let unit_map;

    /** @type {string}*/
    let image_tag;

    let end_anchor;
    let start_anchor;
    let at_end = false;

    /**
     * @param {{id: number | string, parameters: Object<string, string|number>, output_parameters: Object<string, string|number>, files: Object<string, string>[]}} model 

     * @param {string} tag 
    */
    function get_image_src_or_empty(model, tag) {
        const file = model.files.filter(obj => obj.tag == tag)[0];
        if (file !== undefined) 
            return file.file
        else
            return ""
    }

    /** @type {string} */
    let grid_position;
    $: {
        if (display_options.graph) {
            grid_position = "grid-column: 2 / 3; grid-row: 1 / 2;"
        } else {
            grid_position = "grid-column: 2 / 3; grid-row: 1 / 3;"
        }
    }

</script>

<div
    class="relative min-w-[40vw] border-b-2 border-gray-200 flex flex-col gap-2 p-2 overflow-scroll overflow-x-hidden translate-x-0"
    style={grid_position}
>
    <button
        on:click={() => {
            display_options.sidepane = !display_options.sidepane;
        }}
        bind:this={start_anchor}
        class="flex items-center justify-center w-fit p-1 bg-blue-600 text-orange-200 hover:text-blue-600 hover:bg-orange-200 transition ease-in-out font-bold rounded-md shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
    </button>
    <div class="flex flex-row items-center my-2">
        <span class="text-xl font-semibold">Solution #{model.scoped_id}</span>
    </div>
    
    <div class="flex flex-row justify-evenly">
        <div class="flex flex-col overflow-scroll gap-4 no-scrollbar">
            {#each allowed_tags as tag}
            {#if get_image_src_or_empty(model, tag) != ""}
            <div class="flex flex-col items-end border-black border w-fit h-fit relative">
                <p class="mr-auto p-2 font-bold">{tag}</p>
                <a
                    class="bg-blue-600 text-orange-200 hover:text-blue-600 hover:bg-orange-200 transition ease-in-out font-bold p-1 text-sm w-fit absolute top-0 right-0 rounded-sm rounded-e-none shadow-md"
                    href={get_image_src_or_empty(model, tag)}
                    target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                    </a
                >
                <img
                    class="m-1 w-80"
                    src={get_image_src_or_empty(model, tag)}
                    alt={model.id}
                />
            </div>
            {/if}
            {/each}
        </div>
        <div class="flex flex-col overflow-scroll gap-4 no-scrollbar">
            <table class="border border-black text-xs h-fit">
                <tr class="border-b border-black">
                    <td class="p-2"><p class="font-bold">Input Parameters:</p></td>
                </tr>
                {#each Object.entries(model.parameters) as [param_name, value]}
                <tr class="border-b border-black">
                    <td class="border-r border-black p-2 font-semibold">{param_name} [{unit_map[param_name] || "unitless"}]</td>
                    <td class="p-2">{value}</td>
                </tr>
                {/each}
            </table>
            <table class="border border-black text-xs h-fit">
                <tr class="border-b border-black">
                    <td class="p-2"><p class="font-bold">Output Parameters:</p></td>
                </tr>
                {#each Object.entries(model.output_parameters) as [param_name, value]}
                <tr class="border-b border-black">
                    <td class="border-r border-black p-2 font-semibold">{param_name} [{unit_map[param_name] || "unitless"}]</td>
                    <td class="p-2">{value}</td>
                </tr>
                {/each}
            </table>
            <table class="border border-black text-xs h-fit">
                <tr class="border-b border-black">
                    <td class="p-2"><p class="font-bold">Asset Links:</p></td>
                </tr>
                {#each model.files as asset}
                <tr class="border-b border-black">
                    <td class="border-r border-black p-2 font-semibold">{asset.tag}</td>
                    <td class="p-2"><a href={asset.file} target="_blank" class="font-bold text-blue-500">Download</a></td>
                </tr>
                {/each}
            </table>
            <span bind:this={end_anchor} id="end"/>
        </div>
    </div>
</div>

<style>
    .no-scrollbar {
        scrollbar-width: none;
    }
</style>
