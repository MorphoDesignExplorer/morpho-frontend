import { applyAction, deserialize } from "$app/forms";
import { invalidateAll } from "$app/navigation";
import type { ActionResult } from "@sveltejs/kit";

export function BuildServerURL() {
  if (process.env.ENVIRONMENT && process.env.ENVIRONMENT == 'prod') {
    return "http://backend:8000";
  } else {
    return "http://localhost:8000";
  }
}

/**
Helper method to use instead of use:enhance; posts JSOn to the server.
*/
export function SubmitJson(getter: () => Object) {
  return async (
    event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
  ) => {
    event.preventDefault();
    console.log(JSON.stringify(getter()))
    const response = await fetch(event.currentTarget.action, {
      method: "POST",
      body: JSON.stringify(getter())
    })
    const result: ActionResult = deserialize(await response.text());
    if (result.type === "success") {
      await invalidateAll();
    }
    applyAction(result)
  };
}
