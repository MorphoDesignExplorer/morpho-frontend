<script lang="ts">
  import "$lib/css/form.css";
  import { fade } from "svelte/transition";
  import { page } from "$app/stores";

  import Chevron from "./Chevron.svelte";
  import PaperClip from "$lib/icons/PaperClip.svelte";
  import ProjectIcon from "$lib/icons/Project.svelte";
  import PersonIcon from "$lib/icons/Person.svelte";
  import LogoutIcon from "$lib/icons/Logout.svelte";
  import HomeIcon from "$lib/icons/Home.svelte";
  import {
    CheckUserProperties,
    UserCanCollaborate,
    UserCanEditDocuments,
    UserEditableProjects,
    UserIsAdmin,
  } from "$lib/user";

  let { data, children } = $props();

  let projects_open = $state(($page.route.id?.indexOf("project") || -1) > -1);
  let documents_open = $state(($page.route.id?.indexOf("document") || -1) > -1);

  function flip_projects() {
    projects_open = !projects_open;
  }

  function flip_documents() {
    documents_open = !documents_open;
  }

  const userCanCollaborate = UserCanCollaborate(data.user);
</script>

<link rel="stylesheet" href="/app.css" />
<link href="/document.css" rel="stylesheet" />

<div class="relative flex min-h-screen bg-sky-50">
  <div
    class="flex flex-col bg-blue-100 w-1/4 min-h-full pt-10 mr-10 gap-2 border-r-2 border-r-blue-500 px-4 rounded-r-lg shadow-lg"
  >
    <span class="flex flex-col items-start">
      <h1 class="text-3xl font-extrabold">Hello!</h1>
      <p>Logged in as <span class="font-bold">{data.user.email}</span></p>
    </span>
    <a href="/" class="navbar-item">
      <HomeIcon
        className="min-w-8 max-w-8 rounded-lg bg-blue-400 text-blue-800 p-1"
      />

      <h1 class="text-xl font-extrabold">Home</h1>
    </a>
    <form action="/auth/logout/" method="POST">
      <button class="navbar-item w-full">
        <LogoutIcon
          className="min-w-8 max-w-8 rounded-lg bg-blue-400 text-blue-800 p-1"
        />
        <h1 class="text-xl font-extrabold">Logout</h1>
      </button>
    </form>
    {#if userCanCollaborate}
      <a href="/auth/admin/user_mgmt" class="navbar-item">
        <PersonIcon
          className="min-w-8 max-w-8 rounded-lg bg-blue-400 text-blue-800 p-1"
        />
        <h1 class="text-xl font-extrabold">Collaborators</h1>
      </a>
    {/if}

    <button class="flex flex-col gap-2" onclick={flip_projects}>
      <span class="navbar-item">
        <ProjectIcon
          className="min-w-8 max-w-8 rounded-lg bg-blue-400 text-blue-800 p-1"
        />
        <h1 class="text-xl font-extrabold">Projects</h1>
        <span
          class="ml-auto px-3 transition-transform"
          class:rotate-180={projects_open}
        >
          <Chevron />
        </span>
        {#if CheckUserProperties(data.user, "can_create_project")}
          <a href="/auth/admin/project/new" class="good-button">Add</a>
        {/if}
      </span>
    </button>

    {#if projects_open}
      <ol class="ml-8" transition:fade={{ delay: 0, duration: 100 }}>
        {#each data.projects as project}
          <li
            class="text-blue-600 my-2"
            class:font-bold={$page.params.id === project.project_name}
          >
            <a
              target="_self"
              href="/auth/admin/project/{project.project_name}/"
            >
              {project.options.display_name}
              <span
                class="bg-white ml-2 p-1 rounded text-sm shadow-sm border border-gray-300"
                >{project.project_name}</span
              >
            </a>
          </li>
        {/each}
      </ol>
    {/if}

    {#if UserCanEditDocuments(data.user)}
      <button class="navbar-item" onclick={flip_documents}>
        <PaperClip
          className="min-w-8 max-w-8 rounded-lg bg-blue-400 text-blue-800 p-1"
        />
        <h1 class="text-xl font-extrabold">Documents</h1>
        <span
          class="ml-auto px-3 transition-transform"
          class:rotate-180={documents_open}
        >
          <Chevron />
        </span>
        <a href="/auth/admin/document/new" class="good-button">Add</a>
      </button>

      {#if documents_open}
        <ol class="ml-8" transition:fade={{ delay: 0, duration: 100 }}>
          {#each data.documents as document}
            <li class="text-blue-600">
              <a
                href="/auth/admin/document/{document.slug}/"
                class:font-bold={$page.params.slug === document.slug}
                target="_self">{document.slug}</a
              >
            </li>
          {/each}
        </ol>
      {/if}
    {/if}
  </div>

  {@render children?.()}
</div>

<style lang="postcss">
  .navbar-item {
    @apply flex items-center gap-2 bg-blue-200 rounded-lg p-1 active:brightness-105;
  }
</style>
