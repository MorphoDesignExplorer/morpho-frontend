<script lang="ts">
  let message: string;
  let onsuccess: () => void;
  let onfailure: () => void;
  let enabled = false;

  let modalElement: HTMLDivElement;

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
          on:click={onsuccess}>Yes</button
        >
        <button
          class="text-white bg-blue-500 font-bold rounded-lg shadow-lg text-xl w-1/2 px-2 py-1"
          tabindex="0"
          on:click={onfailure}>No</button
        >
      </div>
    </div>
  </div>
{/if}
