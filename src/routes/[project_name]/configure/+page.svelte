<script lang="ts">
    import type { Caption } from "$lib/types";
    import { get, writable } from "svelte/store";
    import { page } from "$app/stores";
    import { applyAction, deserialize, enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import type { ActionResult } from "@sveltejs/kit";
    import { Carta, MarkdownEditor } from 'carta-md';
    import insane from "insane";
    import 'carta-md/default.css';
    import "./carta.scss";
    import HelpText from "../../HelpText.svelte";

    export let data;

    const current_project = get(page).params.project_name
    const parameters = [
        ...data.projects.filter(item => item.project_name === current_project)[0].variable_metadata.map(item => item.field_name),
        ...data.projects.filter(item => item.project_name === current_project)[0].output_metadata.map(item => item.field_name),
    ]

    let caption_form = {
        tag_name: "",
        display_name: ""
    }

    let unsaved_form = false;
    const form_state = writable<{
        human_name: string
        captions: Caption[]
        editor: string
    }>({
        human_name: data.metadata.human_name,
        captions: data.metadata.captions,
        editor: data.metadata.description.text
    });

    async function handle_submit(event: { currentTarget: EventTarget & HTMLFormElement }) {
        const response = await fetch(event.currentTarget.action, {
			method: 'POST',
            body: JSON.stringify($form_state)
		});
	
		const result: ActionResult = deserialize(await response.text());
	
		if (result.type === 'success') {
            unsaved_form = false;

			// rerun all `load` functions, following the successful update
			await invalidateAll();
		}
	
		applyAction(result);
    }

    let dragndrop_state = {
        tag: ""
    }
    function dragndrop_swap(current_tag: string) {
        if (dragndrop_state.tag !== current_tag) {
            const from_index = $form_state.captions.findIndex(element => element.tag_name === dragndrop_state.tag);
            const to_index = $form_state.captions.findIndex(element => element.tag_name === current_tag);
            if (from_index !== -1) {
                const temp = $form_state.captions[from_index];
                $form_state.captions[from_index] = $form_state.captions[to_index];
                $form_state.captions[to_index] = temp;
            }
        }
    }

    // Editor Setup
    const carta = new Carta({
       sanitizer: insane,
    })
    // End Editor Setup

    let timeout_object: ReturnType<typeof setTimeout> | null = null;
    let form_element: HTMLFormElement;
    form_state.subscribe(value => {
        if (timeout_object) {
            clearTimeout(timeout_object);
        }
        timeout_object = setTimeout(() => {
            if (form_element) {
                form_element.requestSubmit();
                console.log("submitted!")
            }
        }, 1 * 1000)
    })

</script>

<form id="edit-grid" action="?/configure" method="post" on:submit|preventDefault={handle_submit} bind:this={form_element}>
    <!--
    <div id="save-section" class="flex justify-end items-center p-4">
        <button type="submit" class="h-fit py-1 px-3 rounded-lg flex items-center border border-blue-500 bg-white text-blue-500 hover:bg-blue-500 hover:text-white text-base transition ease-in-out">Save</button>
    </div>
    -->
    <div id="editor" class="p-4 m-4 h-fit flex flex-col gap-4 bg-blue-500 border border-blue-500">
        <p class="font-bold flex items-center gap-2 text-xl text-white">Edit Description <HelpText help_text={"Edit the 'about' page of the project."}/></p>
        <div class="bg-white">
            <MarkdownEditor {carta} bind:value={$form_state.editor}/>
        </div>
    </div>
    <div id="misc" class="flex flex-col p-4 gap-4">
        <!-- Human Readable Name Editor-->
        <div class="p-2 flex justify-between items-center bg-blue-500 text-white border border-blue-500 shadow-md">
            <p class="font-bold capitalize text-xl">Project Name</p>
            <input type="text" name="human_name" class="p-2 border border-gray-200 w-1/2 text-black" bind:value={$form_state.human_name}>
        </div>
        <!-- End Human Readable Name Editor -->
         <!-- Caption List -->
        <div class="p-4 flex flex-col gap-4 justify-between items-start bg-blue-500 border border-blue-500">
            <p class="flex gap-2 items-center font-bold text-xl text-white">Grid Objective Parameters <HelpText help_text={"Set the objective parameters displayed under every model in the grid."}/></p>
            <div class="flex mr-auto">
                <select class="p-2 border border-gray-400" bind:value={caption_form.tag_name}>
                    <option value="" disabled selected class="text-gray-400">Parameter Name</option>
                    {#each parameters.filter(item => ($form_state.captions.filter(caption => caption.tag_name == item).length == 0)) as parameter}
                    <option value="{parameter}">{parameter}</option>
                    {/each}
                </select>
                <input type="text" class="p-2 border-y border-gray-400" placeholder="Human Readable Name" bind:value={caption_form.display_name}>
                <button
                    type="button"
                    class="p-2 rounded-r-lg border border-blue-500 bg-blue-500 text-white hover:bg-white hover:text-blue-500 transition ease-in-out"
                    on:click={() => {
                        if (caption_form.tag_name.length > 0 && caption_form.display_name.length > 0) {
                            $form_state.captions = [...$form_state.captions, Object.assign({}, caption_form)]
                            caption_form.display_name = "";
                            caption_form.tag_name = "";
                        }
                    }}>
                    Add
                </button>
            </div>

            {#if $form_state.captions.length > 0}
            <div class="w-full flex flex-col border-x border-t bg-white border-black text-xs">
                {#each $form_state.captions as caption, caption_idx}
                <div class="flex gap-2 justify-between items-center border-b border-black p-2 select-none" on:mouseover={() => dragndrop_swap(caption.tag_name)} on:mouseup={() => {dragndrop_state.tag = ""}} class:opacity-50={dragndrop_state.tag === caption.tag_name}>
                    <span class="cursor-move" on:mousedown={() => {dragndrop_state.tag = caption.tag_name}} >⠿</span>
                    <span class="font-bold">{caption.tag_name}</span>
                    <input type="text" bind:value={$form_state.captions[caption_idx].display_name} class="ml-auto border border-gray-200 p-1">
                    <span class="underline underline-offset-2 decoration-2 decoration-red-800 cursor-pointer" on:click={() => {$form_state.captions = $form_state.captions.filter((_, idx) => idx != caption_idx)}}>Delete</span>
                </div>
                {/each}
            </div>
            {:else}
            <b class="font-bold text-lg">No captions added yet.</b>
            {/if}
        </div>
        <!-- End Caption List -->
    </div>
</form>

<style lang="postcss">
    #edit-grid {
        display: grid;
        grid-area: content;
        grid-template-columns: 1fr 1fr;
        grid-template-areas: "editor misc"
    }

    #save-section {
        grid-area: misc;
        grid-row-start: save-section;
    }

    #misc {
        grid-area: misc;
    }

    #editor {
        grid-area: editor;
    }

    .carta-editor {
        @apply bg-white
    }
</style>