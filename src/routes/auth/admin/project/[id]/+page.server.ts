import { error, redirect, type Actions } from "@sveltejs/kit";
import type { AdminForm, Project, Role, UserDetails } from "$lib/types";
import type { PageServerLoad } from "./$types";
import { UpdateProjectOptions } from "$lib/database_update";
import { Option as O } from "effect";
import { UserIsAdmin } from "$lib/user";

export const load: PageServerLoad = async ({ params, locals, parent }) => {

    const parentData = await parent();
    const projects = parentData.projects;

    const specificProject = parentData.projects.find(p => p.project_name == params.id);

    if (!specificProject) {
        return redirect(303, "/auth/admin")
    }

    const role = parentData.user.permissions.find(
        ([projectName, _]) => projectName == specificProject.project_name
    )?.[1]

    if (!role && !UserIsAdmin(parentData.user)) {
        return redirect(303, "/auth/admin")
    }
 
    const data: { project: Project, user: UserDetails, role: Role | undefined } = {
        project: specificProject,
        user: parentData.user,
        role
    };

    return data;
};

export const actions = {
    update: async ({ locals, request, params }) => {
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
    delete: async ({ locals, params }) => {
        if (O.isNone(locals.user)) {
            return redirect(301, "/");
        }

        /// TODO implement project deletion

        const resultJson = { code: "NOT_IMPLEMENTED", message: "Not Implemented." };

        return { status: "failure", ...resultJson }
    },
} satisfies Actions;
