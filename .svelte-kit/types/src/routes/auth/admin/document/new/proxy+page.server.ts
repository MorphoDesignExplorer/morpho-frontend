// @ts-nocheck
import { verifyToken } from "$lib/auth";
import { BuildServerURL } from "$lib/common";
import type { AdminForm, Document } from "$lib/types";
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = async ({cookies}: Parameters<PageServerLoad>[0]) => {
    const documents: Document[] = await (await fetch(`${BuildServerURL()}/document/`)).json()

    const data: {documents: Document[]} = {
        documents: documents,
    }

    return data
}

export const actions = {
    create: async({cookies, request}) => {
        let [_, ok] = await verifyToken(cookies.get("jwt") || "");
        if (!ok) {
            return redirect(301, "/")
        }

        const form: Extract<AdminForm, {type: "document"}> = JSON.parse(await request.text());
        const createRequest = {
            slug: form.form.title,
            title: form.form.title,
            text: form.form.text,
            parent: form.form.parent,
        }

        let result = await fetch(`${BuildServerURL()}/document/`, {
            method: "POST",
            body: JSON.stringify(createRequest),
            headers: {
                "Authorization": `Bearer ${cookies.get("jwt") || ''}`
            }
        })

        if (result.ok) {
            return redirect(301, `/auth/admin/document/${createRequest.slug}`)
        } else {
            return {status: "failure"}
        }
    }
} satisfies Actions;