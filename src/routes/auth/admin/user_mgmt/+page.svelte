<script lang="ts">
  import MatrixForm from "./MatrixForm.svelte";
  import { MakeInvite } from "./invite/api";
    import { SubmitJson } from "$lib/common";

  let { data } = $props();

  let invite_mail = $state("");
  let search_value = $state("");
</script>

<form
  class="flex min-h-full w-[90%] flex-col gap-3 pt-10"
  action="?/update"
  method="POST"
  onsubmit={SubmitJson(() => data.matrix)}
>
  <!--
  <div class="form-group text-xl">
    <span class="font-bold">Current Role:</span>
    {data.role}
  </div>
  -->
  <div class="form-group flex-col">
    <p class="font-bold text-xl self-start">Invite collaborator via mail</p>
    <div class="flex w-full justify-between gap-1 items-center">
      <input
        bind:value={invite_mail}
        class="w-full"
        type="text"
        placeholder="Email"
      />
      <button
        onclick={() => MakeInvite({ email: invite_mail }, () => {})}
        type="button"
        class="w-40 h-full rounded-lg good-button select-none">Invite</button
      >
    </div>
  </div>

  <div class="form-group flex-col gap-4 pb-4">
    <span class="self-start flex gap-4 items-center">
      <span class="font-bold text-xl self-start">Modify Role Matrix</span>
      <button class="good-button">Save</button>
    </span>
    <input
      type="text"
      class="border border-gray rounded-md w-full p-2 bg-gray-50 shadow-sm placeholder:text-gray-400"
      placeholder="Search over email, role, project, etc..."
      bind:value={search_value}
    />
    <MatrixForm {search_value} bind:data={data} />
  </div>
</form>

<style lang="postcss">
  td {
    text-align: center;
    padding: 0.25rem;
  }

  :global(td input) {
    @apply w-3/4;
  }

  :global(td select) {
    @apply w-3/4;
  }
</style>
