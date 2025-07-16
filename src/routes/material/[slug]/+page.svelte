<script lang="ts">
    import type { Document } from "$lib/types";
    import type { PageServerData } from "./$types";
    import NavLink from "./navlink.svelte";

    export let data: PageServerData;

    const topLevel: Document[] = data.documents[""];
    const currentDocument = data.documentSet.get(data.slug);

    function idToNumbering(id: string): number[] {
        return id.split(".").map((item) => parseInt(item));
    }

    let nestingHierarchy: Document[] = [];
</script>

<div
    id="navbar"
    class="p-4 flex justify-start items-center text-lg text-black font-extrabold gap-3 border-b-[1px] border-b-slate-200"
>
    <a href="/" class="flex flex-row items-center gap-3">
        <img
            src="https://morpho-images.s3.us-east-1.amazonaws.com/assets/morpho.png"
            class="w-20 backdrop-blur-lg"
            alt="icon"
        />
        <h2 class="select-none text-3xl">Morpho Design Explorer</h2>
    </a>
</div>

<div class="grid grid-cols-4 min-h-screen w-full bg-gray-50">
    <div class="flex flex-col justify-start items-center pt-20 col-span-1">
        <!-- Top level document -->
        <div class="h-fit w-3/4 border border-gray-200">
            {#if topLevel}
                {#each topLevel as tld}
                    <NavLink
                        documents={data.documents}
                        document={tld}
                        level={0}
                        openContaining={(document) => {
                            nestingHierarchy = document;
                        }}
                    />
                {/each}
            {/if}
        </div>

        <div class="w-3/4 flex flex-col gap-2 mt-8">
            <h3 class="text-xl font-bold">Index</h3>
            {#each data.mapping as [id, title]}
                <p
                    class="text-blue-600 text-sm"
                    class:pl-4={idToNumbering(id)[1] > 0 &&
                        idToNumbering(id)[2] == 0}
                    class:pl-8={idToNumbering(id)[1] > 0 &&
                        idToNumbering(id)[2] > 0}
                >
                    {id.slice(1)}:
                    <a
                        href={id}
                        class="text-blue-600 underline decoration-dashed underline-offset-4 hover:decoration-solid"
                        >{title}</a
                    >
                </p>
            {/each}
        </div>
    </div>
    <div class="col-span-2 bg-white p-8 px-16 gap-2 flex flex-col">
        {#if nestingHierarchy.length > 1}
            <span class="flex gap-1 text-lg">
                {#each nestingHierarchy as doc, index}
                    {#if index < nestingHierarchy.length - 1}
                        <a
                            class="text-blue-500 font-bold"
                            href={`/material/${doc.slug}`}
                            target="_self">{doc.slug}</a
                        >
                        <span class="font-bold">&gt;</span>
                    {:else}
                        <span class="font-bold">{doc.slug}</span>
                    {/if}
                {/each}
            </span>
        {/if}
        <h1 class="text-5xl font-bold">{currentDocument?.title}</h1>
        <h1 class="italic">
            Written on {new Date(currentDocument?.timestamp).toDateString()}
        </h1>
        <div class="content">
            {@html data.tree}
        </div>
    </div>
</div>

<style>
    @import "./material.sass";
</style>
