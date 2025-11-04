import { verifyToken } from "$lib/auth";
import { BuildServerURL } from "$lib/common";
import { GetDocuments } from "$lib/database_get";
import { CreateDocument } from "$lib/database_create";
import type { AdminForm, Document } from "$lib/types";
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({cookies}) => {
    const documents: Document[] = await GetDocuments();

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
        
        let result = await CreateDocument(form);

        if (result.status == "success") {
            return redirect(301, `/auth/admin/document/${form.form.title.toLowerCase().split(' ').join('_')}`)
        } else {
            return {status: "failure"}
        }
    }
} satisfies Actions;
