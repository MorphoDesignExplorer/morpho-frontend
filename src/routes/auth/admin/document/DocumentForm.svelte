<script lang="ts">
    import {type AdminForm, type Document} from '$lib/types';
    import { Parser, HtmlRenderer } from "commonmark"
    import ProseMirror from '../ProseMirror.svelte';

    export let form: Extract<AdminForm, {type: "document"}>;
    export let documentList: Document[];

    const parser = new Parser();
    const renderer = new HtmlRenderer();

</script>

<div class="form-group">
  <span class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs">
    <span class="text-sm">Document Title</span>
    <span class="text-gray-500 font-normal">Title of the Document</span>
  </span>
  <input type="text" class="w-full bg-gray-50 p-1" bind:value={form.form.title} />
</div>

<div class="form-group">
  <span class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs">
    <span class="text-sm">Document Parent</span>
    <span class="text-gray-500 font-normal">Parent that the document is nested under.</span>
  </span>
  <select class="w-full bg-gray-50 p-1" bind:value={form.form.parent}>
    <option value="">No Parent</option>
    {#each documentList as listdoc}
    <option value={listdoc.slug}>{listdoc.slug}</option>
    {/each}
  </select>
</div>

<div class="form-group">
  <span class="w-1/4 self-start p-1 font-bold text-black flex flex-col text-xs">
    <span class="text-sm">Description</span>
    <span class="text-gray-500 font-normal">Edit the content on the about page.</span>
  </span>
  <div class="flex w-full">
    <ProseMirror bind:text={form.form.text}/>
  </div>
</div>

