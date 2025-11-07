<script lang="ts">
  let message: string = $state("");
  let onsuccess: () => void = $state(() => {});
  let onfailure: () => void = $state(() => {});
  let enabled = $state(false);

  let modalElement: HTMLDivElement | undefined = $state();

  export function raise(msg: string, success: () => void, failure: () => void) {
    enabled = true;
    message = msg;
    onsuccess = () => {
      success();
      enabled = false;
    };

    onfailure = () => {
      failure();
      enabled = false;
    };
  }
</script>

{#if enabled}
  <div class="absolute h-screen w-screen bg-black bg-opacity-20" id="overlay">
    <div
      class="fixed top-1/4 left-[40%] w-50 h-40 bg-slate-50 border-2 border-blue-500 rounded-lg shadow-lg flex flex-col justify-evenly items-center p-4 gap-4 select-none px-8"
    >
      <p class="text-2xl font-bold">{message}</p>
      <div class="flex gap-2 w-full" bind:this={modalElement}>
        <button
          class="text-blue-500 font-bold text-xl border rounded-lg shadow-lg border-blue-500 w-1/2 px-2 py-1"
          tabindex="0"
          onclick={onsuccess}>Yes</button
        >
        <button
          class="text-white bg-blue-500 font-bold rounded-lg shadow-lg text-xl w-1/2 px-2 py-1"
          tabindex="0"
          onclick={onfailure}>No</button
        >
      </div>
    </div>
  </div>
{/if}
