<script lang="ts">
  import { run } from "svelte/legacy";
  import type { PageData } from "./$types";
  import Plus from "$lib/components/Plus.svelte";
  import Minus from "$lib/components/Minus.svelte";
  import Fuse from "fuse.js";

  let {
    data = $bindable(),
    search_value,
  }: {
    data: PageData;
    search_value: string;
  } = $props();

  const maxRoleLength = data.roles.reduce(
    (max, current) => Math.max(current.length, max),
    0,
  );
  const roleSize = `width: ${Math.floor(maxRoleLength * 1.25)}rem;`;

  let project_names = data.projects.map((project) => project.project_name);
  const maxProjectLength = data.projects
    .map((project) => project.project_name)
    .reduce((max, current) => Math.max(current.length, max), 0);
  const projectSize = `width: ${Math.floor(maxProjectLength * 1.25)}rem`;

  function addRole(email: string): () => void {
    return () => {
      const userIndex = data.matrix.findIndex((item) => item.email == email);
      // TODO need a better default here... maybe an empty field that disables submit?
      if (userIndex != -1) {
        data.matrix[userIndex] = {
          ...data.matrix[userIndex],
          roles: [
            ...data.matrix[userIndex].roles,
            { email, role: "", project: "" },
          ],
        };
      }
    };
  }

  function removeRole(email: string, roleIdx: number) {
    return () => {
      const userIndex = data.matrix.findIndex((item) => item.email == email);
      if (userIndex != -1) {
        data.matrix[userIndex] = {
          ...data.matrix[userIndex],
          roles: data.matrix[userIndex].roles.filter(
            (_: any, idx: number) => idx != roleIdx,
          ),
        };
      }
    };
  }

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

{#each filtered_matrix as user, user_idx}
  <table class="table-auto mx-auto w-3/4">
    <tbody>
      {#each user.roles as role, roleIdx}
        <tr>
          <td class="w-40"
            >{#if roleIdx == 0}{user.email}{/if}</td
          >
          <td style={roleSize}>
            <select class="w-full">
              {#each data.roles as role_name}
                <option value={role_name} selected={role_name === role.role}
                  >{role_name}</option
                >
              {/each}
            </select>
          </td>
          <td style={projectSize}>
            <select class="w-full">
              {#each project_names as project_name}
                <option
                  value={project_name}
                  selected={project_name === role.project}
                  >{project_name}</option
                >
              {/each}
            </select>
          </td>
          <td>
            <button
              on:click={removeRole(user.email, roleIdx)}
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
        <td class="text-left">
          <button
            on:click={addRole(user.email)}
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
