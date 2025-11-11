import type { PageServerLoad } from "./$types";
import { GetAllUsers, GetProjects, GetRoles } from "$lib/database_get";
import type { CollaborationMatrixForm, Project, Role, UserDetails } from "$lib/types"
import { redirect, type Actions } from "@sveltejs/kit"
import { CanManageRole, ToMatrixForm, UserCanCollaborate, UserEditableProjects, UserIsAdmin } from "$lib/user";
import { Either as E, Option as O } from "effect";
import { CreateUser, UpdateRoles } from "$lib/database_update";
import type { InvitePostRequest } from "./invite/+server";
import { reportError } from "$lib/error";


export const load: PageServerLoad = async ({ parent }) => {
    const parentData = await parent();

    if (!UserCanCollaborate(parentData.user)) {
        return redirect(303, "/auth/admin")
    }

    const allUsers = await GetAllUsers();
    const roles = await GetRoles();

    // filters out <project,role> pairs that the current user can manage
    const filteredUsers: UserDetails[] = allUsers.map(user => ({
        email: user.email,
        permissions: user.permissions.filter(
            ([projectName, role]) => CanManageRole(parentData.user, projectName, role))
    })).filter(candidateUser => (candidateUser.email != parentData.user.email))

    const assignableRoles = parentData.projects.map(project => ({
        project: project.project_name,
        roles: roles.filter(role => CanManageRole(parentData.user, project.project_name, role))
    }))

    const matrix = ToMatrixForm(filteredUsers)

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

function LintRoleOptions(formMatrix: CollaborationMatrixForm, allowedRoles: {project: string, roles: Role[]}[]): {email: string, errors: {idx: number, message: string}[]}[] {
    // TODO check if role.role is a valid role and if role.project is a valid project instead
    const rolesToErrors = (roles: CollaborationMatrixForm[0]["roles"]) => roles.map(
        (role, idx) => {
            const project = allowedRoles.find(({project}) => project === role.project)
            if (project === undefined) {
                return {
                    idx,
                    message: "Selected project is invalid."
                }
            }
            if (project.roles.find(assignableRole => role.role === assignableRole.role_name) === undefined) {
                return {
                    idx,
                    message: "Selected role is invalid."
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
    update: async ({ request, locals }): Promise<FormResponse> => {
        const request_data = await request.json() as MatrixForm
        const userOption = locals.user;

        if (O.isNone(userOption)) {
            return redirect(303, "/")
        }

        const user = O.getOrThrow<UserDetails>(userOption)

        // validation

        let filteredProjects = UserEditableProjects(user, await GetProjects(O.none(), false));
        let roles = await GetRoles()
        const assignableRoles = filteredProjects.map(project => ({
            project: project.project_name,
            roles: roles.filter(role => CanManageRole(user, project.project_name, role))
        }));

        // check if the form is in an invalid state
        const lint = LintRoleOptions(request_data, assignableRoles);
        const anyErrors = lint.map(user => user.errors.length > 0).find(truth => truth) || false
        if (anyErrors) {
            return {
                status: "failure",
                message: "No role option can be empty.",
                lintingData: {
                    roleLints: lint
                }
            }
        }

        // table update
        return E.match(await UpdateRoles(request_data), {
            onLeft(error) {
                reportError({request_data, user})(error)
                return { status: "failure", message: error.message}
            },
            onRight() {
                return {status: "success", message: "Roles modified successfully."}
            }
        })
    },
    invite: async ({ request }): Promise<FormResponse> => {
        const req = await request.json() as InvitePostRequest
        return E.match(await CreateUser(req.email), {
            onLeft(error) {
                reportError({req})(error)
                return {status: "failure", message: error.message}
            },
            onRight() {
                return {status: "success", message: "Invite was sent to the email successfully."}
            }
        })
    }
} satisfies Actions
