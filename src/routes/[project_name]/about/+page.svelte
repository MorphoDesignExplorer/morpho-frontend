<script lang="ts">
    let { data } = $props();
</script>

<link href='/document.css' rel="stylesheet"/>

<div class="grid parent">
    <div class="description">
        {@html data.html}
    </div>
</div>

<style lang="postcss">
    .parent {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .description {
        @apply m-10 flex flex-col gap-4;
    }

    .description :global(h1) {
        @apply text-2xl text-blue-600 font-bold !important
    }

    .description :global(h3) {
        @apply text-blue-800 font-bold !important
    }
</style>
