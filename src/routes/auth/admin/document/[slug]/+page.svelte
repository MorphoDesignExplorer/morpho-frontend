<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import DocumentForm from "../DocumentForm.svelte";
    import type { AdminForm, Document } from "$lib/types";
    import { type ActionResult } from "@sveltejs/kit";
    import { applyAction, deserialize } from "$app/forms";
    import { goto, invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";
    import Modal from "$lib/components/Modal.svelte";
    import type { ActionData } from "./$types";

    interface Props {
        data: { document: Document; documents: Document[] };
        form: ActionData;
    }

    let { data, form }: Props = $props();

    const formData: Writable<Extract<AdminForm, { type: "document" }>> =
        writable({
            type: "document",
            form: {
                title: data.document.title,
                text: data.document.text,
                id: data.document.id,
                parent: data.document.parent,
            },
        });

    let formElement: HTMLFormElement = $state();
    const submitFunc = async () => {
        const response = await fetch(formElement.action, {
            method: "POST",
            body: JSON.stringify($formData),
        });
        const result: ActionResult = deserialize(await response.text());
        if (result.type == "success") {
            if (result.data?.status == "success") {
                await invalidateAll();
            }
        }
        applyAction(result);
    };

    onMount(() => {
        window.addEventListener("keydown", async (e) => {
            if (e.ctrlKey && e.key == "s") {
                e.preventDefault();
                await submitFunc();
            }
        });
    });

    let handleSubmit = async (
        event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
    ) => {
        event.preventDefault();
        await submitFunc();
    };

    let modal: Modal = $state();
    let handleDelete = async () => {
        modal.raise(
            `Are you sure you want to delete '${data.document.slug}'?`,
            async () => {
                const response = await fetch("?/delete", {
                    method: "POST",
                    body: JSON.stringify({ idOrSlug: data.document.slug }),
                });
                const result: ActionResult = deserialize(await response.text());
                if (result.type == "success") {
                    if (result.data?.status == "success") {
                        window.alert("Deleted " + data.document.slug + ".");
                        goto("/auth/admin/", {
                            invalidateAll: true,
                        });
                    }
                }
                applyAction(result);
            },
            () => {},
        );
    };
</script>

<Modal bind:this={modal} />

<form
    class="flex min-h-full w-[90%] flex-col gap-3 pt-10"
    onsubmit={handleSubmit}
    action="?/update"
    method="POST"
    bind:this={formElement}
>
    <h1 class="text-3xl font-extrabold">
        <span class="text-blue-900">Admin</span> > Edit
        <span class="span underline decoration-dotted"
            >{data.documents.filter((item) => item.id == $formData.form.id)[0]
                .slug}</span
        >
    </h1>
    <hr class="border-2 border-blue-500" />

    <div class="flex gap-2">
        <button
            class="good-button"
            type="submit">Save</button
        >
        <button
            class="bad-button"
            type="button"
            onclick={handleDelete}>Delete</button
        >
    </div>
    {#if form && form.code}
        <span class="border-l-red-800 border-l-[6px] bg-red-200 w-1/2 p-2">
            {form.message}
        </span>
    {:else if form}
        <span class="border-l-green-800 border-l-[6px] bg-green-200 w-1/2 p-2">
            {form.message}
        </span>
    {/if}
    <DocumentForm form={$formData} documentList={data.documents} />
</form>
