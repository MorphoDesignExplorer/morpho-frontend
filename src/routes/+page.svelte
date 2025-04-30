<script lang="ts">
    import { base } from "$app/paths";
    import type { PageData } from "./$types";

    export let data: PageData;

    let dropdownElement: HTMLDivElement;
    let anchorPixel: HTMLSpanElement;
    let hover = false;

    function initDropdown(node: HTMLDivElement) {
        dropdownElement = node;
    }

    function initAnchorPixel(node: HTMLSpanElement) {
        anchorPixel = node;
        anchorPixel.tabIndex = 1;
    }

    function enableDropdown(event: Event) {
        hover = true;
        setTimeout(() => anchorPixel.focus(), 10);
        if (event.target instanceof HTMLAnchorElement) {
            dropdownElement.style.left = `${event.target.getBoundingClientRect().left - 20}px`;
            dropdownElement.style.top = `${event.target.getBoundingClientRect().bottom + 10}px`;
        }
    }

    function disableDropdown(event: FocusEvent) {
        if (event.target instanceof HTMLElement) {
            if (!dropdownElement.contains(event.relatedTarget)) {
                hover = false;
            }
        }
    }
</script>
<div id="navbar" class="p-4 flex justify-evenly items-center text-lg text-black font-extrabold gap-3 border-b-[1px] border-b-slate-200">
    <a href="{base}/" class="flex flex-row items-center gap-3">
        <img src="https://morpho-images.s3.us-east-1.amazonaws.com/assets/morpho.png" class="w-20 backdrop-blur-lg" alt="icon">
        <h2 class="select-none text-3xl">Morpho Design Explorer</h2>
    </a>
    <div class="flex gap-4">
        <h3 class="text-3xl font-bold"><a href="{base}/GCGA_19" class="underline decoration-blue-500" on:mouseover={enableDropdown}>Projects</a></h3>
        <h3 class="text-3xl font-bold"><a href="{base}/research" class="underline decoration-blue-500">Research</a></h3>
        <h3 class="text-3xl font-bold"><a href="{base}/learn" class="underline decoration-blue-500">Learn</a></h3>
    </div>
</div>

<div class="bg-[url(https://morpho-images.s3.us-east-1.amazonaws.com/assets/splash.png)] h-60 bg-[50%_20%] sizer">
</div>

<div class="h-full flex justify-center m-8">
    <div class="w-3/4 text-lg">
            <p class="py-1">Morpho is a multi-objective design exploration tool aimed at aiding designers in making informed decisions during the early design stages. It employs the Non-Destructive Dynamic Population Genetic Algorithm (NDDP-GA), initially used in the ParaGen framework developed by Peter von Buelow <super class="align-super text-xs">[<a href="#ref-one" class="text-blue-500">1</a>]</super> and further explored by Anahita Khodadadi through her dissertation<super class="align-super text-xs">[<a href="#ref-one" class="text-blue-500">2</a>]</super>, <super class="align-super text-xs">[<a href="#ref-one" class="text-blue-500">3</a>]</super>, to search for suitable generative design solutions. Morpho is designed to assist designers in considering both performance-based quantitative design objectives and qualitative design goals, enabling a comprehensive exploration of the design space and facilitating well-rounded decision-making.</p>
            <p class="py-1">The name "Morpho" is inspired by the Morpho butterfly species, which is renowned for its iridescent blue wings. These wings are not only visually striking but also structurally complex, featuring microscopic scales that reflect light in a unique and dynamic way. This remarkable characteristic of the Morpho butterfly mirrors the essence of the Morpho design tool. Just as the butterfly's wings display an intricate blend of beauty and functionality, the Morpho tool aims to generate design solutions that are both aesthetically pleasing and technically sound.</p>
            <p class="py-1">Morpho continues to evolve into an open-access, comprehensive design-aid tool. It offers assistance in the configuration processing of spatial forms, supports the exploration of generative design solutions, and facilitates continuous interaction between the search engine and designers. Additionally, it aims to include as diverse a range of design objectives as possible. This holistic approach ensures that designers can explore a wide array of possibilities, much like the Morpho butterfly, which adapts and thrives in varied environments. By embodying the complexity and beauty of the Morpho butterfly, the Morpho design tool aspires to inspire and empower designers to create innovative and effective design solutions.</p>
            <br/>
            <p class="text-sm"><a href="https://www.researchgate.net/publication/257518688_ParaGen_Performative_Exploration_of_Generative_Systems" class="font-bold text-blue-700 underline decoration-blue-700" target="_blank" id="ref-one">[1]</a> P. von Buelow, “ParaGen: Performative Exploration of generative systems,” Journal of the International Association for Shell and Spatial Structures, vol. 53, no. 4, pp. 271–284, 2012.</p>
            <p class="text-sm"><a href="https://www.sciencedirect.com/science/article/abs/pii/S0926580522002278" class="font-bold text-blue-700 underline decoration-blue-700" target="_blank" id="ref-two">[2]</a> A. Khodadadi and P. von Buelow, “Design exploration by using a genetic algorithm and the Theory of Inventive Problem Solving (TRIZ),” Autom Constr, vol. 141, p. 104354, Sep. 2022, doi: 10.1016/J.AUTCON.2022.104354.</p>
            <p class="text-sm"><a href="https://www.researchgate.net/publication/337447165_Programmatic_Design_Methods_in_Architecture_GATRIZ_Solution_Search_Method" class="font-bold text-blue-700 underline decoration-blue-700" target="_blank" id="ref-three">[3]</a> A. Khodadadi, “Programmatic Design Methods in Architecture (GA+TRIZ Solution Search Method),” Ph.D. Dissertation, University of Michigan, Ann Arbor, Ann Arbor, 2019. doi: 10.13140/RG.2.2.21543.91047/1.</p>
    </div>
</div>

<div class="absolute bg-white rounded-md border-[1px] border-slate-200 flex flex-col gap-2 p-2" class:hidden={!hover} on:blur={disableDropdown} use:initDropdown>
    <span use:initAnchorPixel on:blur={disableDropdown}></span>
    {#each data.projects.sort((left, right) => {
            const left_date = Date.parse(left.creation_date)
            const right_date = Date.parse(right.creation_date)
            if (left_date < right_date) {
                return -1
            } else if (left_date == right_date) {
                return 0
            } else {
                return 1
            }
    }) as project}
        <h3 class="text-xl font-bold"><a href="{base}/{project.project_name}" class="underline decoration-blue-500">{project.metadata.human_name}</a></h3>
    {/each}
</div>

<style>
    .sizer {
        background-size: 100%;
    }
</style>