<script lang="ts">
    import MainPage from "./MainPage.svelte";
    let { data } = $props();
</script>
<MainPage data={data}/>
