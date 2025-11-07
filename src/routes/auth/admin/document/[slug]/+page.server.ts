import { BuildServerURL } from "$lib/common";
import type { AdminForm, Document } from "$lib/types";
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { GetDocuments } from "$lib/database_get";
import { DeleteDocument, UpdateDocument } from "$lib/database_update";

export const load: PageServerLoad = async ({ params }) => {
    const documents: Document[] = await GetDocuments();

    const data: { document: Document; documents: Document[] } = {
        document: documents.filter((doc) => doc.slug == params.slug)[0],
        documents: documents,
    };

    return data;
};

export const actions = {
    update: async ({ locals, cookies, request }) => {
        if (O.isNone(locals.user)) {
            return redirect(301, "/")
        }

        const form: Extract<AdminForm, { type: "document" }> = JSON.parse(
            await request.text(),
        );

        let response = await UpdateDocument(form.form.id, form.form.slug, form.form.text, form.form.title, form.form.parent);
        return response;
    },
    delete: async ({ locals, cookies, request }) => {
        if (O.isNone(locals.user)) {
            return redirect(301, "/auth/admin")
        }


        const deleteRequest = (await request.json()) as { idOrSlug: string };
        let response = await DeleteDocument(deleteRequest.idOrSlug);
        return response
    },
} satisfies Actions;
