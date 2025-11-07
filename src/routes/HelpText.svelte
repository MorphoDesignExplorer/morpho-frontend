<script lang="ts">
    import { run } from 'svelte/legacy';

    import { fade } from "svelte/transition";

    interface Props {
        help_text: string;
    }

    let { help_text }: Props = $props();
    let popup: HTMLDivElement = $state();
    let info_trigger: HTMLSpanElement = $state();
    let is_active: boolean = $state(false);

    run(() => {
        is_active && (() => {
            if (popup) {
                popup.style.left = `${info_trigger.offsetLeft + info_trigger.offsetWidth + 10}px`
                popup.style.top = `${info_trigger.offsetTop - Math.floor(info_trigger.offsetHeight / 2) + 1}px`
            }
        })()
    });
</script>

<span class="w-fit flex gap-2 select-none" onmouseover={() => {is_active = true}} onmouseout={() => {is_active = false}} bind:this={info_trigger}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
</span>
{#if is_active}
<div bind:this={popup} class="absolute w-fit h-fit p-2 rounded-lg bg-white border border-blue-500 shadow-md text-black text-sm font-normal italic" transition:fade>
    <p>{help_text}</p>
</div>
{/if}
