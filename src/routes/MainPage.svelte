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
    {@html data.document}
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
