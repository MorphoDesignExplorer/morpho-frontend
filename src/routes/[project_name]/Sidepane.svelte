<script>
    /** @type {boolean} */
    export let sidepane_active;

    /** @type {{id: number | string, parameters: Object<string, string|number>, output_parameters: Object<string, string|number>, files: Object<string, string>[]}}*/
    export let model;

    /** @type {string[]} */
    export let allowed_tags;

    /** @type {string}*/
    let image_tag;

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

</script>

<div
    class="min-w-[40vw] border-b-2 border-l-2 border-amber-950 flex flex-col gap-2 p-2 align-bottom overflow-scroll"
>
    <button
        on:click={() => {
            sidepane_active = !sidepane_active;
        }}
        class="font-mono font-bold w-fit border-amber-950 border-2 px-2">x</button
    >
    <div class="flex flex-row items-center my-2">
        <span class="text-xl font-semibold">Solution #{model.id}</span>
        <span class="font-bold ml-auto">Image to Display: </span>
        <select class="bg-transparent" bind:value={image_tag}>
            {#each allowed_tags as tag}
                <option value={tag}>{tag}</option
                >
            {/each}
        </select>
    </div>
    <div class="flex flex-col border-amber-950 border-2 p-1 w-fit">
        <img
            class="m-2 w-80"
            src={get_image_src_or_empty(model, image_tag)}
            alt={model.id}
        />
    </div>
    <a
        class="bg-amber-950 text-orange-200 hover:text-amber-950 hover:bg-orange-200 transition ease-in-out font-bold p-2 w-fit"
        href={get_image_src_or_empty(model, image_tag)}
        target="_blank">View Image on Another Tab</a
    >
    <div class="overflow-scroll">
        <p class="font-bold">Input Parameters:</p>
        {#each Object.entries(model.parameters) as [param_name, value]}
            <p class="text-sm"><b>{param_name}:</b> {value}</p>
        {/each}
        <br />
        <p class="font-bold">Output Parameters:</p>
        {#each Object.entries(model.output_parameters) as [output_param_name, value]}
            <p class="text-sm"><b>{output_param_name}:</b> {value}</p>
        {/each}
    </div>
</div>
