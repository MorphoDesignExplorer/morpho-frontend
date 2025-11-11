import type { PageServerLoad } from "./$types";
import { GetAllUsers, GetRoles } from "$lib/database_get";
import type { UserDetails } from "$lib/types"
import { redirect, type Actions } from "@sveltejs/kit"
import { CanManageRole, RoleCmp, UserCanCollaborate } from "$lib/user";

type CollaborationMatrixForm = {
    email: string,
    roles: {email: string, role: string, project: string}[]
}[]

export const load: PageServerLoad = async ({ locals, parent }) => {
    // TODO get MID matrix
    // TODO calculate unique users from matrix
    // TODO get All roles possible from the roles table

    const parentData = await parent();

    if (!UserCanCollaborate(parentData.user)) {
        return redirect(303, "/auth/admin")
    }

    const allUsers = await GetAllUsers();
    const roles = await GetRoles();

    // filter out roles that are manageable by the current user
    const filteredUsers: UserDetails[] = allUsers.map(user => ({
        email: user.email,
        permissions: user.permissions.filter(
            ([projectName, role]) => CanManageRole(parentData.user, projectName, role))
    }))

    const assignableRoles = parentData.projects.map(project => ({
        project: project.project_name,
        roles: roles.filter(role => CanManageRole(parentData.user, project.project_name, role))
    }))

    const matrix: CollaborationMatrixForm = filteredUsers.map(user => ({
        email: user.email,
        // TODO restrict this per project
        roles: user.permissions.map(([projectName, role])=> ({
            email: user.email,
            role: role.role_name,
            project: projectName
        }))
    }))

    return {
        assignableRoles,
        matrix
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

export type FormLint = {
    roleLints: {
        email: string,
        errors: {idx: number, message: string}[]
    }[]
}

type FormResponse = {
    status: "success" | "failure"
    message?: string
    lintingData?: FormLint
}

function LintRoleOptions(formMatrix: CollaborationMatrixForm): {email: string, errors: {idx: number, message: string}[]} {
    // TODO check if role.role is a valid role and if role.project is a valid project instead
    const rolesToErrors = (roles: CollaborationMatrixForm) => roles.map(
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
