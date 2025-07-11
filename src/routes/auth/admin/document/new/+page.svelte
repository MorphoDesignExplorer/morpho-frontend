<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import DocumentForm from "../DocumentForm.svelte";
    import type { AdminForm, Document } from "$lib/types";
    import type { ActionResult } from "@sveltejs/kit";
    import { applyAction, deserialize } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";

    export let data: {documents: Document[]};

    const form: Writable<Extract<AdminForm, {type: "document"}>> = writable({
        type: "document",
        form: {
            title: "",
            text: "",
            id: "",
            parent: "",
        }
    })

    let formElement: HTMLFormElement;
    const submitFunc = async () => {
        const response = await fetch(formElement.action, {
            method: "POST",
            body: JSON.stringify($form),
        })
        const result: ActionResult = deserialize(await response.text())
        console.log(result)
        if (result.type == "success") {
            if (result.data?.status == "success") {
                window.alert("Saved successfully!")
                await invalidateAll();
            }
        }
        applyAction(result);
    }

    onMount(() => {
        window.addEventListener("keydown", async e => {
            if (e.ctrlKey && e.key == 's') {
                e.preventDefault();
                await submitFunc()
            }
        })
    })

    let handleSubmit = async (event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
        event.preventDefault();
        await submitFunc();
    }
</script>

<form class="flex min-h-full w-1/2 flex-col gap-3 pt-10" on:submit={handleSubmit} action="?/create" method="POST" bind:this={formElement}>
    <h1 class="text-3xl font-extrabold">
        <span class="text-blue-900">Admin</span> > Create Document
    </h1>
    <hr class="border-2 border-blue-500" />

    <button class="self-start bg-green-700 font-bold text-white text-sm px-3 py-1" type="submit">Submit</button>
    <DocumentForm form={$form} documentList={data.documents}/>
</form>