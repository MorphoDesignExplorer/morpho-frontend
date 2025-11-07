import type { PageServerLoad } from "./$types";
import { GetRoles } from "$lib/database_get";
import { type Actions } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ locals }) => {
    // TODO get MID matrix
    // TODO calculate unique users from matrix
    // TODO get All roles possible from the roles table

    const roles = await GetRoles()

    return {
        /// TODO add projects that they can control here
        roles: roles.map(role => role.role_name), /// TODO filter this based on user's current role
        matrix: [
            {
                email: "A@y.com",
                roles: [
                    { email: "A@y.com", role: "Project Owner", project: "GCGA_27" },
                    { email: "A@y.com", role: "Project Owner", project: "GCGA_19" },
                ]
            },
            {
                email: "B@x.com",
                roles: [
                    { email: "B@x.com", role: "Viewer", project: "GCGA_39" },
                ]
            },
            {
                email: "C@z.nz",
                roles: [
                    { email: "C@z.nz", role: "Collaborator", project: "GCGA_19" },
                ]
            }
        ]
    }
}

type FormResponse = {
    status: "success" | "failure"
    message?: string
}

export const actions = {
    update: async ({ request }): Promise<FormResponse> => {
        console.log(JSON.stringify(await request.json(), null, 4))
        return { status: "failure", message: "Not implemented." }
    }
} satisfies Actions
