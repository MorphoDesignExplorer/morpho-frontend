<script lang="ts">
  import { run } from "svelte/legacy";
  import type { PageData } from "./$types";
  import Plus from "$lib/icons/Plus.svelte";
  import Minus from "$lib/icons/Minus.svelte";
  import Hint from "$lib/components/Hint.svelte"
  import Fuse from "fuse.js";
    import type { FormLint } from "./+page.server";

  let {
    data = $bindable(),
    search_value,
    lintingData
  }: {
    data: PageData,
    search_value: string,
    lintingData: FormLint | undefined
  } = $props();

  function addRole(email: string): () => void {
    return () => {
      data.matrix = data.matrix.map(item => {
        if (item.email === email) {
          const new_item = { ...item, roles: [...item.roles, { email, role: "---", project: "---" }] }
          return new_item;
        } else {
          return item;
        }
      })
    };
  }

  function removeRole(email: string, roleIdx: number) {
    return () => {
      data.matrix = data.matrix.map(item => {
        if (item.email === email) {
          const new_item = { ...item, roles: item.roles.filter((_, idx) => idx != roleIdx) }
          return new_item
        } else {
          return item
        }
      })
    };
  }

  $effect(() => console.log(lintingData))

  function getRoleLint(email: string, roleIdx: number) {
    return lintingData
      ?.roleLints
      ?.find(row => row.email == email)
      ?.errors
      ?.find(errorItem => errorItem.idx == roleIdx)
  }

  let hinter: Hint | undefined = $state();

  let fuseOptions = {
    isCaseSensitive: false,
    threshold: 0.3,
    keys: ["roles.email", "roles.role", "roles.project"],
  };

  const fuse = new Fuse(data.matrix, fuseOptions);
  const filtered_matrix = $derived.by(() => {
    if (search_value === "") {
      return data.matrix;
    } else {
      return fuse.search(search_value).map((val) => val.item);
    }
  });
</script>

<Hint bind:this={hinter} />

<table class="table-auto block my-4">
{#each filtered_matrix as user, user_idx}
  <tbody>
    {#if user.roles.length == 0}
    <td>{user.email}</td>
    <td></td>
    <td></td>
    <td>
      <button
          onclick={addRole(user.email)}
          type="button"
          class="good-button flex items-center gap-2 w-28"
        >
          <Plus /> Add Role
        </button>
      </td>
    {:else}
    {#each user.roles as role, roleIdx}
      <tr class:text-red-600={getRoleLint(user.email, roleIdx) != undefined}>
        <td>{#if roleIdx == 0}{user.email}{/if}</td>
        <!-- Role Selection -->
        <td
          onmouseover={hinter.raise(getRoleLint(user.email, roleIdx)?.message)}
          onmouseleave={hinter.dispose}
        >
          <select class="w-full" bind:value={user.roles[roleIdx].role}>
            {#each 
              data.assignableRoles
              .find(proj => proj.project == role.project)?.roles || []
              as assignableRole
            }
              <option value={assignableRole.role_name} selected={assignableRole.role_name === role.role}
                >{assignableRole.role_name}</option
              >
            {/each}
            <option value="---">---</option>
          </select>
        </td>
        <!-- Project Selection -->
        <td
          onmouseover={hinter.raise(getRoleLint(user.email, roleIdx)?.message)}
          onmouseleave={hinter.dispose}
        >
          <select class="w-full" bind:value={user.roles[roleIdx].project}>
            {#each data.projects as project}
              <option
                value={project.project_name}
                selected={project.project_name === role.project}
                >{project.project_name}</option
              >
            {/each}
            <option value="---">---</option>
          </select>
        </td>
        <!-- Remove Button -->
        <td>
          <button
            onclick={removeRole(user.email, roleIdx)}
            type="button"
            class="bad-button flex items-center gap-2 w-28"
          >
            <Minus /> Remove
          </button>
        </td>
      </tr>
    {/each}
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <!-- Add Button, at the end -->
      <td class="text-left">
        <button
          onclick={addRole(user.email)}
          type="button"
          class="good-button flex items-center gap-2 w-28"
        >
          <Plus /> Add Role
        </button>
      </td>
    </tr>
  {/if}
  </tbody>
{/each}
</table>
