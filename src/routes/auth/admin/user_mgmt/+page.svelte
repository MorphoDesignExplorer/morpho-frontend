<script lang="ts">
  import { enhance } from "$app/forms";
  import Modal from "$lib/components/Modal.svelte";
  import Minus from "$lib/components/Minus.svelte";
  import Plus from "$lib/components/Plus.svelte";
  import Fuse from "fuse.js";

  export let data;

  let modal: Modal;
  let formElement: HTMLFormElement;

  const maxRoleLength = data.roles.reduce((max, current) => Math.max(current.length, max), 0);
  const roleSize = `width: ${Math.floor(maxRoleLength * 1.25)}rem;`;

  let project_names = data.projects.map(project => project.project_name);
  const maxProjectLength  = data.projects.map(project => project.project_name).reduce((max, current) => Math.max(current.length, max), 0);
  const projectSize = `width: ${Math.floor(maxProjectLength * 1.25)}rem`;

  function addRole(email: string): () => void {
    return () => {
      console.log(data.matrix)
      const userIndex = data.matrix.findIndex(item => item.email == email);
      // TODO need a better default here... maybe an empty field that disables submit?
      if (userIndex != -1) {
        data.matrix[userIndex] = {
          ...data.matrix[userIndex],
          roles: [...data.matrix[userIndex].roles, { email, role: data.roles[0], project: project_names[0] }]
        }
      }
    }
  }

  function removeRole(email: string, roleIdx: number) {
    return () => {
      console.log(data.matrix)
      const userIndex = data.matrix.findIndex(item => item.email == email);
      if (userIndex != -1) {
        data.matrix[userIndex] = {
          ...data.matrix[userIndex],
          roles: data.matrix[userIndex].roles.filter((_: any, idx: number) => idx != roleIdx)
        }
      }
    }
  }

  let search_value = "";
  let fuseOptions = {
    isCaseSensitive: false,
    threshold: 0.3,
    keys: [
      "roles.email",
      "roles.role",
      "roles.project"
    ]
  }

  const fuse = new Fuse(data.matrix, fuseOptions);
  let filtered_matrix = [];
  $: if (search_value === "") {
    filtered_matrix = data.matrix;
  } else {
    filtered_matrix = fuse.search(search_value).map(val => val.item);
  }
</script>

<Modal bind:this={modal} />

<form
  use:enhance
  bind:this={formElement}
  class="flex min-h-full w-[90%] flex-col gap-3 pt-10"
  action="?/update"
  method="POST"
>
  <div class="form-group text-xl">
    <span class="font-bold">Current Role:</span> {data.role}
  </div>
  <div class="form-group flex-col">
    <p class="font-bold text-xl self-start">Invite Collaborator via Mail</p>
    <div class="flex w-full justify-between gap-1 items-center">
      <input class="w-full" type="text" placeholder="Email"/>
      <select class="w-full">
        {#each data.roles as role}
        <option value={role}>{role}</option>
        {/each}
      </select>
      <select class="w-full">
        {#each data.projects as project}
        <option value="{project.project_name}">{project.project_name} ({project.options.display_name})</option>
        {/each}
      </select>
      <button type="button" class="w-40 h-full rounded-lg good-button">Invite</button>
    </div>
  </div>

  
  <div class="form-group flex-col gap-4 pb-4">
    <p class="font-bold text-xl self-start">Modify Role Matrix</p>
    <input
      type="text"
      class="border border-gray rounded-md w-full p-2 bg-gray-100 shadow-sm placeholder:text-gray-400"
      placeholder="Search over email, role, project, etc..."
      bind:value={search_value}
    />
    {#each filtered_matrix as user, user_idx}
    <table class="table-auto mx-auto">
      {#each user.roles as role, roleIdx}
        <tr>
          <td class="w-40">{#if roleIdx == 0}{user.user}{/if}</td>
          <td style={roleSize}>
            <select class="w-full">
              {#each data.roles as role_name}
              <option value={role_name} selected={role_name === role.role}>{role_name}</option>
              {/each}
            </select>
          </td>
          <td style={projectSize}>
            <select class="w-full">
              {#each project_names as project_name}
              <option value={project_name} selected={project_name === role.project}>{project_name}</option>
              {/each}
            </select>
          </td>
          <td>
            <button on:click={removeRole(user.email, roleIdx)} type="button" class="bad-button flex items-center gap-2 w-28">
              <Minus/> Remove
            </button>
          </td>
        </tr>
      {/each}
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td class="text-left">
          <button on:click={addRole(user.email)} type="button" class="good-button flex items-center gap-2 w-28">
            <Plus/> Add Role
          </button>
        </td>
      </tr>
    </table>
    {#if user_idx < data.matrix.length - 1}
    <hr class="border-b border-b-gray-200 w-3/4"/>
    {/if}
    {/each}
  </div>
</form>

<style lang="postcss">
  td {
    text-align: center;
    padding: 0.25rem;
  }

  :global(td input) {
    @apply w-3/4
  }

  :global(td select) {
    @apply w-3/4
  }
</style>
