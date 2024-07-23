<div class="main-grid font-sans">
    <slot/>
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
</style>