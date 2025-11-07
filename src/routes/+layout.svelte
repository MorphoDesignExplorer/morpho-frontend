<script lang="ts">
  import "../app.css";
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

{@render children?.()}

<style lang="postcss">
  :global(body) {
    @apply bg-white;
  }
</style>
