import { type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types";
import { BuildServerURL } from '$lib/common';
import { type Project, type Document, type AdminForm } from '$lib/types';
import { verifyToken } from '$lib/auth';
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({cookies}) => {
    let [_, ok] = await verifyToken(cookies.get("jwt") || "");
    if (!ok) {
        return redirect(301, "/")
    }

    let projectData: Project[] = await (await fetch(`${BuildServerURL()}/project/`)).json()
    let documentData: Document[] = await (await fetch(`${BuildServerURL()}/document/`)).json()

    return {
        projects: projectData,
        documents: documentData,
    }
}

export const actions = {
    logout: async({cookies}) => {
        cookies.delete("jwt", {path: "/"})
        return redirect(301, "/")
    },
    update: async({cookies, request}) => {
        let [_, ok] = verifyToken(cookies.get("jwt") || "");
        if (!ok) {
            return redirect(301, "/")
        }

        const form: AdminForm = JSON.parse(await request.text());
        if (form.type == "project") {
            const updateRequest = {
                "project_name": form.form.project_name,
                "variable_metadata_units": form.form.vmetadata.reduce((acc, item) => {acc[item.field_name] = item.field_unit; return acc;}, {} as Record<string, string>),
                "output_metadata_units": form.form.ometadata.reduce((acc, item) => {acc[item.field_name] = item.field_unit; return acc;}, {} as Record<string, string>),
                "asset_descriptions": form.form.ametadata.reduce((acc, item) => {acc[item.tag] = item.description; return acc;}, {} as Record<string, string>),
                "project_description": form.form.description,
                "captions": form.form.captions,
                "human_name": form.form.human_name,
            }

            // TODO replace bearer token with one from the cookie 
            const result = await fetch(`${BuildServerURL()}/project/`, {
                method: "PUT",
                body: JSON.stringify(updateRequest),
                headers: {
                    "Authorization": `Bearer ${cookies.get("jwt") || ''}`
                }
            });

            if (result.ok) {
                return {status: "success"}
            } else {
                return {status: "failure"}
            }
        } else if (form.type == "document") {
            const updateRequest = {
                text: form.form.text
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
        }
    }
} satisfies Actions

