<script lang="ts">
    import { type AdminForm, type Project } from "$lib/types";
    import { Parser, HtmlRenderer } from "commonmark";
    import ProseMirror from "../../ProseMirror.svelte";

    export let project: Project;
    export let form: Extract<AdminForm, { type: "project" }>;

    function addCaption() {
        form.form.captions = [
            ...form.form.captions,
            { tag_name: "", display_name: "" },
        ];
    }

    function removeCaption(index: number) {
        return () => {
            form.form.captions = form.form.captions.filter((item, idx) => {
                if (idx != index) return item;
            });
        };
    }

    const parser = new Parser();
    const renderer = new HtmlRenderer();

    $: console.log(renderer.render(parser.parse(form.form.description)));
</script>

<div
    class="flex items-center gap-2 border-l-4 border-gray-500 bg-gray-100 p-2 text-sm"
>
    <span
        class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs"
    >
        <span class="text-sm">Project Name</span>
        <span class="text-gray-500 font-normal"
            >Display name of the project.</span
        >
    </span>
    <input
        type="text"
        class="w-full bg-gray-50 p-1"
        bind:value={form.form.human_name}
    />
</div>
<div
    class="flex items-center gap-2 border-l-4 border-gray-500 bg-gray-100 p-2 text-sm"
>
    <span
        class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs"
    >
        <span class="text-sm">Captions</span>
        <span class="text-gray-500 font-normal"
            >Set the captions to be displayed under a solution.</span
        >
    </span>
    <div class="flex w-full flex-col gap-1">
        {#each form.form.captions as caption, index}
            <span class="flex gap-1">
                <select
                    class="w-full bg-gray-50 p-1"
                    bind:value={caption.tag_name}
                    placeholder="Attribute"
                >
                    <option value="scoped_id">scoped_id</option>
                    {#each project.variable_metadata as field}
                        <option value={field.field_name}
                            >{field.field_name}</option
                        >
                    {/each}
                    {#each project.output_metadata as field}
                        <option value={field.field_name}
                            >{field.field_name}</option
                        >
                    {/each}
                </select>
                <input
                    type="text"
                    class="w-full bg-gray-50 p-1"
                    bind:value={caption.display_name}
                    placeholder="Display Name"
                />
                <button
                    type="button"
                    class="bg-gray-200 w-fit px-3"
                    on:click={removeCaption(index)}>-</button
                >
            </span>
        {/each}
        <button
            type="button"
            class="bg-gray-200 w-fit px-3"
            on:click={addCaption}>+</button
        >
    </div>
</div>
<div
    class="flex items-center gap-2 border-l-4 border-gray-500 bg-gray-100 p-2 text-sm"
>
    <span
        class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs"
    >
        <span class="text-sm">Variable Metadata</span>
        <span class="text-gray-500 font-normal"
            >Set the measurement unit of each input parameter <br />(or leave it
            blank if it's unitless)</span
        >
    </span>
    <div class="flex w-full flex-col gap-1">
        {#each form.form.vmetadata as meta}
            <span class="flex items-center gap-1">
                <span class="w-full">{meta.field_name}</span>
                <input
                    type="text"
                    class="w-full bg-gray-50 p-1"
                    bind:value={meta.field_unit}
                    placeholder="Unit"
                />
            </span>
        {/each}
    </div>
</div>
<div
    class="flex items-center gap-2 border-l-4 border-gray-500 bg-gray-100 p-2 text-sm"
>
    <span
        class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs"
    >
        <span class="text-sm">Output Metadata</span>
        <span class="text-gray-500 font-normal"
            >Set the measurement unit of each output parameter <br />(or leave
            it blank if it's unitless).</span
        >
    </span>
    <div class="flex w-full flex-col gap-1">
        {#each form.form.ometadata as meta}
            <span class="flex items-center gap-1">
                <span class="w-full">{meta.field_name}</span>
                <input
                    type="text"
                    class="w-full bg-gray-50 p-1"
                    bind:value={meta.field_unit}
                    placeholder="Unit"
                />
            </span>
        {/each}
    </div>
</div>
<div
    class="flex items-center gap-2 border-l-4 border-gray-500 bg-gray-100 p-2 text-sm"
>
    <span
        class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs"
    >
        <span class="text-sm">Asset Metadata</span>
        <span class="text-gray-500 font-normal"
            >Set the description of each asset.</span
        >
    </span>
    <div class="flex w-full flex-col gap-1">
        {#each form.form.ametadata as asset}
            <span class="flex items-center gap-1">
                <span class="w-full">{asset.tag}</span>
                <input
                    type="text"
                    class="w-full bg-gray-50 p-1"
                    placeholder="Description"
                    bind:value={asset.description}
                />
            </span>
        {/each}
    </div>
</div>
<div
    class="flex flex-col items-center gap-2 border-l-4 border-gray-500 bg-gray-100 p-2 text-sm mr-[-40%] mb-20"
>
    <span
        class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs"
    >
        <span class="text-sm">Description</span>
        <span class="text-gray-500 font-normal"
            >Edit the content on the about page.</span
        >
    </span>
    <div class="flex w-full">
        <ProseMirror bind:text={form.form.description} />
    </div>
</div>

<style lang="postcss">
    .description {
        @apply bg-white w-1/2 h-full p-2 m-1 flex flex-col gap-4;
    }

    .description :global(h1) {
        @apply text-2xl text-blue-600 font-bold !important;
    }

    .description :global(h3) {
        @apply text-blue-800 font-bold !important;
    }

    .grid-4 {
        @apply grid grid-cols-4;
    }
</style>
