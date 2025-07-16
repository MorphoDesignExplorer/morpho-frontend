<script lang="ts">
    import type { Document } from "$lib/types";
    import NavLink from "./navlink.svelte";
    import { page } from "$app/stores";
    export let document: Document;
    export let level: number = 0;
    export let documents: { [k: string]: Document[] };

    export let openContaining: (document: Document[]) => void;
    let open = false;

    if (document.slug == $page.params.slug) {
        open = true;
        openContaining([document]);
    }
</script>

<div class="bg-gray-300 p-1" style={`padding-left: ${level * 4}px`}>
    <details
        class="select-none cursor-pointer font-bold block p-2 bg-gray-300"
        {open}
    >
        <summary>
            <a
                target="_self"
                class="underline decoration-dashed underline-offset-4 hover:decoration-solid"
                href="/material/{document.slug}">{document.title}</a
            >
        </summary>

        {#if documents[document.slug]}
            {#each documents[document.slug] as child}
                <NavLink
                    document={child}
                    {documents}
                    level={level + 1}
                    openContaining={(documents) => {
                        // open this navlink
                        open = true;
                        // open the containing navlink
                        openContaining([document, ...documents]);
                    }}
                />
            {/each}
        {/if}
    </details>
</div>
