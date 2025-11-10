import type { PageServerLoad } from "./$types";
import { GetRoles } from "$lib/database_get";
import type { Role } from "$lib/types"
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
                    { email: "B@x.com", role: "Project Editor", project: "GCGA_39" },
                ]
            },
            {
                email: "C@z.nz",
                roles: [
                    { email: "C@z.nz", role: "Project Editor", project: "GCGA_19" },
                ]
            }
        ]
    }
}

export type MatrixForm = {
    email: string,
    roles: {
        email: string,
        role: string,
        project: string
    }[]
}[]

type FormLint = {
    roleLints: {email: string, errors: {idx: number, message: string}[]}
}

type FormResponse = {
    status: "success" | "failure"
    message?: string
    lintingData?: FormLint
}

function LintRoleOptions(formMatrix: PermissionMatrix): {email: string, errors: {idx: number, message: string}[]} {
    // TODO check if role.role is a valid role and if role.project is a valid project instead
    const rolesToErrors = (roles: typeof PermissionMatrix.roles) => roles.map(
        (role, idx) => {
            if (role.role === "---" || role.project === "---") {
                return {
                    idx,
                    message: "Invalid role."
                }
            }
        }
    ).filter(error => error != undefined)

    return formMatrix.map(
        user => ({
            email: user.email,
            errors: rolesToErrors(user.roles)
        })
    )
    .filter(user => user.errors.length > 0)
}

export const actions = {
    update: async ({ request }): Promise<FormResponse> => {
        const request_data = await request.json() as MatrixForm
        // check if the form is in an invalid state
        if (LintRoleOptions(request_data).length > 0) {
            return {
                status: "failure",
                message: "No role option can be empty.",
                lintingData: {
                    roleLints: LintRoleOptions(request_data)
                }
            }
        }

                
        return { status: "failure", message: "Not implemented." }
    },
    invite: async ({ request }): Promise<FormResponse> => {
        // TODO send mail to a collaborator with their email and randomly generated password
    }
} satisfies Actions
