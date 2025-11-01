// @ts-nocheck
import { verifyToken } from "$lib/auth";
import { BuildServerURL } from "$lib/common";
import type { AdminForm, Document } from "$lib/types";
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { GetDocuments } from "$lib/database";

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
    const documents: Document[] = await GetDocuments();

    const data: { document: Document; documents: Document[] } = {
        document: documents.filter((doc) => doc.slug == params.slug)[0],
        documents: documents,
    };

    return data;
};

export const actions = {
    update: async ({ cookies, request }) => {
        let [_, ok] = await verifyToken(cookies.get("jwt") || "");
        if (!ok) {
            return redirect(301, "/");
        }

        const form: Extract<AdminForm, { type: "document" }> = JSON.parse(
            await request.text(),
        );
        const updateRequest = {
            title: form.form.title,
            text: form.form.text,
            parent: form.form.parent,
        };

        let response = await fetch(
            `${BuildServerURL()}/document/${form.form.id}/`,
            {
                method: "PUT",
                body: JSON.stringify(updateRequest),
                headers: {
                    Authorization: `Bearer ${cookies.get("jwt") || ""}`,
                },
            },
        );

        const responseJson = (await response.json()) as {
            code: string | null;
            message: string;
        };

        if (response.ok) {
            return { status: "success", ...responseJson };
        } else {
            return { status: "failure", ...responseJson };
        }
    },
    delete: async ({ cookies, request }) => {
        let [_, ok] = await verifyToken(cookies.get("jwt") || "");
        if (!ok) {
            return redirect(301, "/");
        }

        const deleteRequest = (await request.json()) as { idOrSlug: string };

        let response = await fetch(
            `${BuildServerURL()}/document/${deleteRequest.idOrSlug}/`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${cookies.get("jwt") || ""}`,
                },
            },
        );

        const responseJson = (await response.json()) as {
            code: string | null;
            message: string;
        };

        if (response.ok) {
            return { status: "success", ...responseJson };
        } else {
            return { status: "failure", ...responseJson };
        }
    },
} satisfies Actions;
