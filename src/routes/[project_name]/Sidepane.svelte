<script lang="ts">
  import { browser } from "$app/environment";
  import type { DisplayOptions, Model } from "$lib/types";
  import { onMount } from "svelte";
  import type { Writable } from "svelte/store";
  import { fade } from "svelte/transition";
  import LazyImagePlus from "./LazyImagePlus.svelte";
  import { get_display_options } from "$lib/context";
  import type { ProjectOptions } from "$lib/types";
  import { PUBLIC_S3_URI } from "$env/static/public";

  let display_options: Writable<DisplayOptions> = get_display_options();

  export let options: ProjectOptions;
  export let model: Model;

  let allowed_tags: string[] = options.asset_options
    .filter((aopt) => aopt.is_public)
    .map((aopt) => aopt.tag);

  let unit_map: Record<string, string> = [
    ...options.output_metadata_options,
    ...options.variable_metadata_options,
  ].reduce((prev: Record<string, string>, field) => {
    prev[field.field_name] = field.field_unit;
    return prev;
  }, {});

  // Utility Section
  function get_image_src_or_empty(model: Model, tag: string) {
    const file = model.files.filter((obj) => obj.tag == tag)[0];
    if (file !== undefined) return file.file;
    else return "";
  }
  // End Utility Section

  // Feature
  // If close button goes out of sight, toggle an alternative "utility" menu towards the end of the sidepane.
  let sidepane_container: HTMLDivElement;
  let close_button: HTMLButtonElement;
  let utility_visible = false;
  if (browser) {
    onMount(() => {
      let observer = new IntersectionObserver(
        (entry) => {
          if (entry[0].isIntersecting === false) {
            utility_visible = true;
          } else {
            utility_visible = false;
          }
        },
        { root: sidepane_container, threshold: 1 },
      );
      observer.observe(close_button);
    });
  }
  // End Feature

  let grid_position: string;
  $: {
    if ($display_options.graph) {
      grid_position = "grid-column: 2 / 3; grid-row: 1 / 2;";
    } else {
      grid_position = "grid-column: 2 / 3; grid-row: 1 / 3;";
    }
  }
</script>

<div
  class="relative min-w-[40vw] border-b-2 border-gray-200 flex flex-col gap-2 p-2 overflow-scroll overflow-x-hidden translate-x-0 scroll-smooth"
  style={grid_position}
  bind:this={sidepane_container}
>
  <span id="sidepane-top-anchor"></span>
  <button
    on:click={() => {
      $display_options.sidepane = !$display_options.sidepane;
    }}
    bind:this={close_button}
    class="flex items-center justify-center w-fit p-1 bg-white text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500 transition ease-in-out font-bold shadow-md"
    aria-label="Close Sidepane"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  </button>
  <div id="solution-number" class="flex flex-row items-center my-2">
    <span class="text-xl font-semibold">Solution #{model.scoped_id}</span>
  </div>

  <div class="flex flex-row justify-evenly">
    <!-- Table Data Section -->
    <div class="flex flex-col overflow-scroll gap-4 no-scrollbar">
      <table id="input-params" class="border border-gray-200 text-xs h-fit">
        <tbody>
          <tr class="border-b border-gray-200">
            <td class="p-2"><p class="font-bold">Input Parameters:</p></td>
          </tr>
          {#each options.variable_metadata_options as vopt}
            <tr class="border-b border-gray-200">
              <td class="border-r border-gray-200 p-2 font-semibold text-wrap"
                >{vopt.display_name}</td
              >
              <td class="p-2"
                >{model.parameters[vopt.field_name]}
                <code class="font-bold">{unit_map[vopt.field_name] || ""}</code
                ></td
              >
            </tr>
          {/each}
        </tbody>
      </table>
      <table id="output-params" class="border border-gray-200 text-xs h-fit">
        <tbody>
          <tr class="border-b border-gray-200">
            <td class="p-2"><p class="font-bold">Output Parameters:</p></td>
          </tr>
          {#each Object.entries(model.output_parameters) as [param_name, value]}
            <tr class="border-b border-gray-200">
              <td class="border-r border-gray-200 p-2 font-semibold text-wrap"
                >{param_name}</td
              >
              <td class="p-2"
                >{value}
                <code class="font-bold">{unit_map[param_name] || ""}</code></td
              >
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <!-- End Table Data Section -->
    <!-- Asset Section -->
    <div class="flex flex-col overflow-scroll gap-4 no-scrollbar m-4">
      {#each allowed_tags as tag}
        {#if get_image_src_or_empty(model, tag) != ""}
          <div
            class="flex flex-col items-end px-2 py-4 border-gray-300 shadow-md border w-fit h-fit relative"
          >
            <p class="mr-auto p-2 font-bold">{tag}</p>
            <a
              role="button"
              aria-label="Open image in another tab"
              tabindex="0"
              class="bg-white text-blue-500 hover:bg-blue-500 hover:text-white transition ease-in-out font-bold p-1 text-sm w-fit absolute top-0 right-0 rounded-es-md"
              href={PUBLIC_S3_URI + get_image_src_or_empty(model, tag)}
              target="_blank"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-5 font-bold"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </a>
            <LazyImagePlus
              placeholder="https://placehold.co/300/f8fafc/f8fafc"
              class="m-1 w-60"
              src={PUBLIC_S3_URI + get_image_src_or_empty(model, tag)}
              alt={model.id}
            />
          </div>
        {/if}
      {/each}
    </div>
    <!-- End Asset Section -->
  </div>

  {#if utility_visible}
    <div
      class="sticky w-fit ml-auto flex flex-row gap-1 py-1 shadow-md bg-black opacity-80 bottom-0 text-white"
      in:fade={{ duration: 220 }}
      out:fade
    >
      <button
        class="cursor-pointer border-r border-white px-2 h-full"
        on:click={() => {
          $display_options.sidepane = !$display_options.sidepane;
        }}>Close Detail Pane</button
      >
      <a
        href="#input-params"
        class="cursor-pointer border-r border-white px-2 h-full"
        >i/p parameters</a
      >
      <a
        href="#output-params"
        class="cursor-pointer border-r border-white px-2 h-full"
        >o/p parameters</a
      >
      <!-- <a href="#assets" class="cursor-pointer px-2 h-full">Assets</a> -->
      <span></span>
    </div>
  {/if}
</div>

<style type="postcss">
  .no-scrollbar {
    scrollbar-width: none;
  }

  .scroll-smooth {
    scroll-behavior: smooth;
  }
</style>
