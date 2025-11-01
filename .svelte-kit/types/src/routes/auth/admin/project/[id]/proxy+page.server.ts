// @ts-nocheck
import { verifyToken } from "$lib/auth";
import { redirect, type Actions } from "@sveltejs/kit";
import { BuildServerURL } from "$lib/common";
import type { AdminForm, Project } from "$lib/types";
import type { PageServerLoad } from "./$types";
import { GetProjects } from "$lib/database";

export const load = async ({ cookies, params }: Parameters<PageServerLoad>[0]) => {
    const projects: Project[] = await GetProjects({_tag: "None"});

    const data: { project: Project } = {
        project: projects[0],
    };

    return data;
};

export const actions = {
    update: async ({ cookies, request }) => {
        let [_, ok] = await verifyToken(cookies.get("jwt") || "");
        if (!ok) {
            return redirect(301, "/");
        }

        const form: Extract<AdminForm, { type: "project" }> = JSON.parse(
            await request.text(),
        );
        const updateRequest = {
            project_name: form.form.project_name,
            variable_metadata_units: form.form.vmetadata.reduce(
                (acc, item) => {
                    acc[item.field_name] = item.field_unit;
                    return acc;
                },
                {} as Record<string, string>,
            ),
            output_metadata_units: form.form.ometadata.reduce(
                (acc, item) => {
                    acc[item.field_name] = item.field_unit;
                    return acc;
                },
                {} as Record<string, string>,
            ),
            asset_descriptions: form.form.ametadata.reduce(
                (acc, item) => {
                    acc[item.tag] = item.description;
                    return acc;
                },
                {} as Record<string, string>,
            ),
            project_description: form.form.description,
            captions: form.form.captions,
            human_name: form.form.human_name,
        };

        // TODO replace bearer token with one from the cookie
        const result = await fetch(`${BuildServerURL()}/project/`, {
            method: "PUT",
            body: JSON.stringify(updateRequest),
            headers: {
                Authorization: `Bearer ${cookies.get("jwt") || ""}`,
            },
        });

        const resultJson = (await result.json()) as {
            code: string | null;
            message: string;
        };

        if (result.ok) {
            return { status: "success", ...resultJson };
        } else {
            return { status: "failure", ...resultJson };
        }
    },
    delete: async ({ cookies, params }) => {
        let [_, ok] = await verifyToken(cookies.get("jwt") || "");
        if (!ok) {
            return redirect(301, "/");
        }

        const response = await fetch(
            `${BuildServerURL()}/project/${params.id}/`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${cookies.get("jwt") || ""}`,
                },
            },
        );
        const responseJson = await response.json();

        if (response.ok) {
            return { status: "success", ...responseJson };
        } else {
            return { status: "failure", ...responseJson };
        }
    },
} satisfies Actions;
