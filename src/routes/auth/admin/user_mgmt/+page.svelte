<script lang="ts">
  import { enhance } from "$app/forms";
  import Modal from "$lib/components/Modal.svelte";

  export let data;
  console.log(data)

  let modal: Modal;
  let formElement: HTMLFormElement;

  let search = "";
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
      <select class="w-full" >
        {#each data.roles as role}
        <option value={role}>{role}</option>
        {/each}
      </select>
      <select class="w-full">
        {#each data.projects as project}
        <option value="{project.project_name}">{project.project_name} ({project.options.human_name})</option>
        {/each}
      </select>
      <button class="w-40 h-full rounded-lg good-button">Invite</button>
    </div>
  </div>

  
  <div class="form-group flex-col">
    <p class="font-bold text-xl self-start">Add Role</p>
    <div class="flex w-full justify-between gap-1 items-center">
      <select class="w-full">
        {#each data.users as email}
        <option value={email}>{email}</option>
        {/each}
      </select>
      <select class="w-full" >
        {#each data.roles as role}
        <option value={role}>{role}</option>
        {/each}
      </select>
      <select class="w-full">
        {#each data.projects as project}
        <option value="{project.project_name}">{project.project_name} ({project.options.display_name})</option>
        {/each}
      </select>
      <button class="w-40 h-full rounded-lg good-button">Add</button>
    </div>
  </div>

  <div class="form-group flex flex-col items-start">
    <p class="font-bold text-xl self-start">Manage Role Matrix</p>
    <input type="text" placeholder="Filter by Email" class="w-full text-lg my-4" bind:value={search}/>
    {#if data.matrix.length > 0}
      <table class="table-auto w-full">
        <tr>
          <th>Email</th>
          <th>Role</th>
          <th>Project</th>
          <th>Action</th>
        </tr>
        {#each data.matrix.filter(row => row.email.indexOf(search) > -1) as user}
        <tr>
          <td>{user.email}</td>
          <td><select><option>{user.role}</option></select></td>
          <td>{user.project}</td>
          <td><button class="bad-button rounded-lg">Remove Role</button></td>
        </tr>
        {/each}
      </table>
    {:else}
      <p>No users currently under you.</p>
    {/if}
  </div>
</form>

<style lang="postcss">
  td {
    text-align: center;
  }

  :global(td input) {
    @apply w-3/4
  }

  :global(td select) {
    @apply w-3/4
  }
</style>
