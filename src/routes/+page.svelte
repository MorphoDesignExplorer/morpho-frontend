<script>
    /** @type {import('./$types').PageData} */
    export let data;

    import Icon from "$lib/assets/morpho.png";

</script>

<div id="main" class="h-screen w-screen p-12 font-mono">
    <div id="a" class="flex flex-col gap-2 pr-4">
        <h3 class="text-3xl font-bold flex flex-row items-center gap-2"><img src={Icon} class="w-28" alt="icon"> Morpho Design Explorer</h3>
        <p>Morpho is a multi-objective design exploration tool aimed at aiding designers in making informed decisions during the early design stages. It employs the Non-Destructive Dynamic Population Genetic Algorithm (NDDP-GA), initially used in the ParaGen framework developed by Peter von Buelow <super class="align-super text-xs">[<a href="#ref-one" class="text-blue-500">1</a>]</super> and further explored by Anahita Khodadadi through her dissertation<super class="align-super text-xs">[<a href="#ref-one" class="text-blue-500">2</a>]</super>, <super class="align-super text-xs">[<a href="#ref-one" class="text-blue-500">3</a>]</super>, to search for suitable generative design solutions. Morpho is designed to assist designers in considering both performance-based quantitative design objectives and qualitative design goals, enabling a comprehensive exploration of the design space and facilitating well-rounded decision-making.</p>
        <p>The name "Morpho" is inspired by the Morpho butterfly species, which is renowned for its iridescent blue wings. These wings are not only visually striking but also structurally complex, featuring microscopic scales that reflect light in a unique and dynamic way. This remarkable characteristic of the Morpho butterfly mirrors the essence of the Morpho design tool. Just as the butterfly's wings display an intricate blend of beauty and functionality, the Morpho tool aims to generate design solutions that are both aesthetically pleasing and technically sound.</p>
        <p>Morpho continues to evolve into an open-access, comprehensive design-aid tool. It offers assistance in the configuration processing of spatial forms, supports the exploration of generative design solutions, and facilitates continuous interaction between the search engine and designers. Additionally, it aims to include as diverse a range of design objectives as possible. This holistic approach ensures that designers can explore a wide array of possibilities, much like the Morpho butterfly, which adapts and thrives in varied environments. By embodying the complexity and beauty of the Morpho butterfly, the Morpho design tool aspires to inspire and empower designers to create innovative and effective design solutions.</p>
        <br/>
        <p id="ref-one">[1] P. von Buelow, “ParaGen: Performative Exploration of generative systems,” Journal of the International Association for Shell and Spatial Structures, vol. 53, no. 4, pp. 271–284, 2012.</p>
        <p id="ref-two">[2] A. Khodadadi and P. von Buelow, “Design exploration by using a genetic algorithm and the Theory of Inventive Problem Solving (TRIZ),” Autom Constr, vol. 141, p. 104354, Sep. 2022, doi: 10.1016/J.AUTCON.2022.104354.</p>
        <p id="ref-three">[3] A. Khodadadi, “Programmatic Design Methods in Architecture (GA+TRIZ Solution Search Method),” Ph.D. Dissertation, University of Michigan, Ann Arbor, Ann Arbor, 2019. doi: 10.13140/RG.2.2.21543.91047/1.</p>
    </div>

    <div id="b" class="flex flex-col text-2xl gap-4">
        <!-- Link Spoiler -->
        <details>
            <summary class="text-3xl font-bold cursor-pointer">Projects</summary>
            <div class="flex flex-col gap-2 pt-2 pl-8">
                <a href="{data.prefix}/GCGA_20" class="underline decoration-blue-500">GCGA_20</a>
                <a href="{data.prefix}/GCGA_27" class="underline decoration-blue-500">GCGA_27</a>
                <a href="{data.prefix}/GCGA_37" class="underline decoration-blue-500">GCGA_37</a>
                <a href="{data.prefix}/GCGA_39" class="underline decoration-blue-500">GCGA_39</a>
            </div>
        </details>
        <h3 class="text-3xl font-bold"><a href="{data.prefix}/research" class="underline decoration-blue-500">Research</a></h3>
        <h3 class="text-3xl font-bold"><a href="{data.prefix}/learn" class="underline decoration-blue-500">Learn</a></h3>
    </div>

</div>

<style>
    #main {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        grid-template-areas:
            "b a"
            "b a";
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