<script lang="ts">
  import { run } from "svelte/legacy";
  import type { PageData } from "./$types";
  import Plus from "$lib/icons/Plus.svelte";
  import Minus from "$lib/icons/Minus.svelte";
  import Hint from "$lib/components/Hint.svelte"
  import Fuse from "fuse.js";

  let {
    data = $bindable(),
    search_value,
    lintingData
  }: {
    data: PageData,
    search_value: string,
    lintingData: any // TODO add type signature for linting data
  } = $props();

  // determines how long the role select element must be 
  const maxRoleLength = data.roles.reduce(
    (max, current) => Math.max(current.length, max),
    0,
  );
  const roleSize = `width: ${Math.floor(maxRoleLength * 1.25)}rem;`;

  let project_names = data.projects.map((project) => project.project_name);
  const maxProjectLength = data.projects
    .map((project) => project.project_name)
    .reduce((max, current) => Math.max(current.length, max), 0);

  // determines how long the project select element must be 
  const projectSize = `width: ${Math.floor(maxProjectLength * 1.25)}rem`;

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

  // TODO use FormLint typing
  function getRoleLint(email: string, roleIdx: number): string | undefined {
    return lintingData
      ?.roleLints
      ?.find( row => row.email == email)
      ?.errors
      ?.find(errorItem => errorItem.idx == roleIdx)
  }

  let hinter: Hint = $state();

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

{#each filtered_matrix as user, user_idx}
  <table class="table-auto mx-auto w-3/4">
    <tbody>
      {#each user.roles as role, roleIdx}
        <tr class:text-red-600={getRoleLint(user.email, roleIdx) != undefined}>
          <td class="w-40"
            >{#if roleIdx == 0}{user.email}{/if}</td
          >
          <!-- Role Selection -->
          <td
            style={roleSize}
            class="px-2"
            onmouseover={hinter.raise(getRoleLint(user.email, roleIdx)?.message)}
            onmouseleave={hinter.dispose}
          >
            <select class="w-full" bind:value={user.roles[roleIdx].role}>
              {#each data.roles as role_name}
                <option value={role_name} selected={role_name === role.role}
                  >{role_name}</option
                >
              {/each}
              <option value="---">---</option>
            </select>
          </td>
          <!-- Project Selection -->
          <td
            style={projectSize}
            class="px-2"
            onmouseover={hinter.raise(getRoleLint(user.email, roleIdx)?.message)}
            onmouseleave={hinter.dispose}
          >
            <select class="w-full" bind:value={user.roles[roleIdx].project}>
              {#each project_names as project_name}
                <option
                  value={project_name}
                  selected={project_name === role.project}
                  >{project_name}</option
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
    </tbody>
  </table>
{/each}
