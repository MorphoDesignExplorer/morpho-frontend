import { error, redirect, type Actions } from "@sveltejs/kit";
import type { AdminForm, Project } from "$lib/types";
import type { PageServerLoad } from "./$types";
import { GetProjects } from "$lib/database_get";
import { UpdateProjectOptions } from "$lib/database_update";
import { Option as O } from "effect";

export const load: PageServerLoad = async ({ params }) => {
    const projects: Project[] = await GetProjects(O.some(params.id), false);

    const data: { project: Project } = {
        project: projects[0]
    };

    return data;
};

export const actions = {
    update: async ({ locals, cookies, request, params }) => {
        if (O.isNone(locals.user)) {
            return redirect(301, "/");
        }

        const form: Extract<AdminForm, { type: "project" }> = JSON.parse(
            await request.text(),
        );

        if (params.id) {
            return await UpdateProjectOptions(form, params.id);
        } else {
            error(400, "Invalid route.")
        }
    },
    delete: async ({ locals, cookies, params }) => {
        if (O.isNone(locals.user)) {
            return redirect(301, "/");
        }

        /// TODO implement project deletion

        const resultJson = { code: "NOT_IMPLEMENTED", message: "Not Implemented." };

        return { status: "failure", ...resultJson }
    },
} satisfies Actions;
