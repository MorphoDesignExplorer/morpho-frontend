<script lang="ts">
  let popoverMessage: string = $state("");
  let popover: HTMLDivElement | undefined = $state();
  let popoverPosition: string = $state("");

  export function raise(message: string) {
    return (event: Event & { currentTarget: EventTarget & HTMLElement }) => {
      let boundingRect = event.currentTarget.getBoundingClientRect()
      if (message && popover) {
        popoverMessage = message;
        popoverPosition = `top: ${boundingRect.top - 1.5*boundingRect.height}px; left: ${boundingRect.left}px;`;
        popover.showPopover();
      }
    }
  }

  export function dispose() {
    popover?.hidePopover();
  }
</script>

<div
  class="absolute w-40 p-2 bg-white rounded-lg fit-content border border-gray-200 inset-[unset] shadow"
  bind:this={popover}
  style={popoverPosition}
  popover
>
  {popoverMessage}
</div>
