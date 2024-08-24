<script lang="ts">
    export let data;
</script>

<div class="grid parent">
    <div class="description">
        {@html data.html}
    </div>
</div>

<style lang="postcss">
    .parent {
        display: grid;
        grid-area: content;
        grid-template-columns: 1fr 2fr 1fr;
        grid-template-areas: "left description right";
    }

    .description {
        grid-area: description;
        @apply m-10 flex flex-col gap-4;
    }

    .description :global(h1) {
        @apply text-2xl text-blue-600 font-bold !important
    }

    .description :global(h3) {
        @apply text-blue-800 font-bold !important
    }
</style>
