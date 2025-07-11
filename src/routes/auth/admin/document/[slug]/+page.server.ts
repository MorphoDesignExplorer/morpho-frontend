import { verifyToken } from "$lib/auth";
import { BuildServerURL } from "$lib/common";
import type { AdminForm, Document } from "$lib/types";
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({params}) => {
    const documents: Document[] = await (await fetch(`${BuildServerURL()}/document/`)).json()

    const data: {document: Document, documents: Document[]} = {
        document: documents.filter(doc => doc.slug == params.slug)[0],
        documents: documents,
    }

    return data
}

export const actions = {
    update: async({cookies, request}) => {
        let [_, ok] = await verifyToken(cookies.get("jwt") || "");
        if (!ok) {
            return redirect(301, "/")
        }

        const form: Extract<AdminForm, {type: "document"}> = JSON.parse(await request.text());
        const updateRequest = {
            title: form.form.title,
            text: form.form.text,
            parent: form.form.parent,
        }

        let result = await fetch(`${BuildServerURL()}/document/${form.form.id}/`, {
            method: "PUT",
            body: JSON.stringify(updateRequest),
            headers: {
                "Authorization": `Bearer ${cookies.get("jwt") || ''}`
            }
        })

        if (result.ok) {
            return {status: "success"}
        } else {
            return {status: "failure"}
        }
    },
    delete: async({cookies, request}) => {
        let [_, ok] = await verifyToken(cookies.get("jwt") || "");
        if (!ok) {
            return redirect(301, "/")
        }

        const deleteRequest = await request.json() as {idOrSlug: string}

        let result = await fetch(`${BuildServerURL()}/document/${deleteRequest.idOrSlug}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${cookies.get("jwt") || ''}`
            },
        })

        if (result.ok) {
            return {status: "success"}
        } else {
            return {status: "failure"}
        }
    }
} satisfies Actions;