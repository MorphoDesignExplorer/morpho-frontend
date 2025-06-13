<script lang="ts">
    import {type AdminForm} from '$lib/types';
    import { Parser, HtmlRenderer } from "commonmark"

    export let form: Extract<AdminForm, {type: "document"}>;

    const parser = new Parser();
    const renderer = new HtmlRenderer();

</script>

<div class="flex flex-col items-center gap-2 border-l-4 border-gray-500 bg-gray-100 p-2 text-sm mr-[-40%] mb-20">
  <span class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs">
    <span class="text-sm">Description</span>
    <span class="text-gray-500 font-normal">Edit the content on the about page.</span>
  </span>
  <div class="flex w-full">
    <textarea class="w-1/2 bg-white min-h-content p-2 m-1" rows="50" bind:value={form.form.text}></textarea>
    <div class="description">
        {@html renderer.render(parser.parse(form.form.text))}
    </div>
  </div>
</div>

