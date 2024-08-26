<script lang="ts">
    import { enhance } from "$app/forms";
    import { base } from "$app/paths";
    import { page } from "$app/stores";
    export let data;
</script>

<div class="main-grid font-sans">
    <!-- Navbar -->
    <div id="navbar" class="p-4 flex items-center text-lg font-extrabold gap-3 bg-blue-500 text-white">
        <a href="{base}/" class="flex flex-row items-center gap-3">
            <img src="https://morpho-images.nyc3.cdn.digitaloceanspaces.com/morpho-images/media/assets/morpho.png" class="w-28 backdrop-blur-lg" alt="icon">
            <h2 class="select-none">Morpho Design Explorer</h2>
        </a>

        <div class="ml-auto mr-4 flex items-center gap-4 text-white text-lg font-normal">
        {#if data.authentication_status.status == "VERIFIED"}
            <p class="capitalize">Hello, {data.authentication_status.username}!</p>
            <form method="post" action="?/logout" use:enhance>
                <button type="submit" class="bg-white border border-gray-200 shadow-sm rounded-lg text-blue-500 px-3 py-1 hover:bg-blue-500 hover:text-white transition-colors ease-in-out items-center">Logout</button>
            </form>
        {:else}
            <a href="{base}/auth/login/?redirect={$page.url.pathname}" class="bg-white border border-gray-200 shadow-sm rounded-lg text-blue-500 px-3 py-1 hover:bg-blue-500 hover:text-white transition-colors ease-in-out items-center">Login</a>
        {/if}
        </div>
    </div>
    <!-- Navbar End -->
    <div id="content" class="grid">
        <div id="ribbon-menu" class="border-r border-gray-200 flex flex-col w-full h-full">
        </div>
        <slot/>
    </div>
</div>

<style>
    .main-grid {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 9fr;
        grid-template-areas: 
            "navbar"
            "content"
        ;
        height: 100vh;
        width: 100vw;
    }

    #navbar {
        grid-area: navbar;
    }

    #content {
        grid-area: content;
        display: grid;
        grid-template-columns: 2fr 8fr;
        grid-template-areas: "ribbon-menu configuration";
    }

    #ribbon-menu {
        grid-area: ribbon-menu;
    }
</style>