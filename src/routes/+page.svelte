
<div id="main" class="h-screen w-screen p-12 font-mono">
    <div id="a" class="text-3xl font-bold">
        <h3>🦋 Morpho Design Explorer</h3>
    </div>
    <div id="b" class="flex flex-col">
        <h3 class="text-3xl font-bold">Recents</h3>
        <a href="/GCGA_20" class="font-semibold text-blue-500">GCGA_20</a>
        <a href="/GCGA_27" class="font-semibold text-blue-500">GCGA_27</a>
        <a href="/GCGA_37" class="font-semibold text-blue-500">GCGA_37</a>
        <a href="/GCGA_39" class="font-semibold text-blue-500">GCGA_39</a>
    </div>
</div>

<style>
    #main {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        grid-template-areas:
            "a b"
            "a b";
    }

    #a {
        grid-area: a;
    }

    #b {
        grid-area: b;
    }

    #c {
        grid-area: c;
    }
</style>