import { DbExec, DbPrepare, DbQueryOne } from "./database";
import { Either as E, Option as O, pipe } from "effect";
import { reportError } from "./error";
import type { AdminForm, CollaborationMatrixForm, ProjectOptions } from "./types";
import { GetAllUsers } from "./database_get";
import { ToMatrixForm } from "./user";
import { andThen, andThenAsync, WrapAsyncFault, WrapFault } from "./common";
import { randomBytes, createHash } from "crypto";
import { getPassSecret } from "./auth";
import { SendMail } from "./email";

// id text primary key, slug text NOT NULL, text text NOT NULL, title text NOT NULL default '', parent text, timestamp date

type DeleteDocumentResponse = {
    status: "success" | "failure",
    message: string
}

export async function DeleteDocument(idOrSlug: string): Promise<DeleteDocumentResponse> {
    if (idOrSlug === "Front Matter") {
        return {
            status: "failure",
            message: "Cannot delete front matter."
        }
    } else {
        return E.match(
            await DbExec("DELETE FROM document WHERE id = ? OR slug = ?", idOrSlug, idOrSlug),
            {
                onLeft(error) {
                    reportError({idOrSlug})(error)
                    return {
                        status: "failure",
                        message: error.message
                    }
                },
                onRight(stats) {
                    if (stats.changes === 0) {
                        return {
                            status: "failure",
                            message: "Could not delete the document"
                        }
                    }
                    return {
                        status: "success",
                        message: "Document deleted successfully."
                    }
                }
            }
        )
    }
}

type UpdateDocumentResponse = {
    status: "success" | "failure"
    message: string
}

export async function UpdateDocument(id: string, slug: string, text: string, title: string, parent: string): Promise<UpdateDocumentResponse> {
    return E.match(
        await DbExec("UPDATE document SET text = ?, title = ?, parent = ? WHERE id = ? OR slug = ?", text, title, parent, id, slug),
        {
            onLeft(error) {
                return {
                    status: "failure",
                    message: error.message
                }
            },
            onRight(result) {
                if (result.changes == 0) {
                    return {
                        status: "failure",
                        message: `Could not find the document ${id}`
                    }
                } else {
                    return {
                        status: "success",
                        message: "Updated document successfully."
                    }
                }
            },
        }
    )
}

type UpdateProjectOptionsRequest = Extract<AdminForm, { type: "project" }>
type UpdateProjectOptionsResponse = {
    status: "success" | "failure",
    code?: string,
    message: string
}

export async function UpdateProjectOptions(request: UpdateProjectOptionsRequest, project_name: string): Promise<UpdateProjectOptionsResponse> {
    // TODO transcript the admin form to options here
    let transformed_request: ProjectOptions = { ...request.form, display_name: request.form.human_name };
    return E.match(
        await DbExec("UPDATE project_options SET options = ? WHERE project_name = ?", JSON.stringify(transformed_request), project_name),
        {
            onLeft() {
                return { status: "failure", message: "Not implemented Left", code: "NOT_IMPLEMENTED" }
            },
            onRight(result) {
                if (result.changes === 0) {
                    return { status: "failure", message: "Project does not exist anymore.", code: "NONEXISTENT_PROJECT" }
                } else {
                    return { status: "success", message: "Project options have been saved successfully!" }
                }
            }
        }
    )
}


export async function UpdateRoles(incomingMatrix: CollaborationMatrixForm) {
    const existingMatrix = ToMatrixForm(await GetAllUsers());

    let creates: Set<CollaborationMatrixForm[0]["roles"][0]> = new Set();
    let deletes: Set<CollaborationMatrixForm[0]["roles"][0]> = new Set();

    // first zip existing and incoming matrix
    incomingMatrix.forEach(incomingUser => {
        const existingUser = existingMatrix.find(user => user.email == incomingUser.email)
        if (existingUser) {
            const oldRoles = new Set(existingUser.roles)
            const newRoles = new Set(incomingUser.roles)
            newRoles.difference(oldRoles).values().forEach(role => {
                creates.add(role)
            });
            oldRoles.difference(newRoles).values().forEach(role => {
                deletes.add(role)
            });
        }
    })

    // check for creates and deletes within each user, and execute them
    const result = await pipe(
        DbExec("BEGIN TRANSACTION"),
        andThenAsync(() => DbPrepare("DELETE FROM user_roles WHERE email = ? AND project_name = ? AND role_name = ?")),
        andThenAsync(async preparedStatement => {
            let removes = deletes.values().toArray();
            for (let i = 0; i < removes.length; i ++) {
                let row = removes[i]
                const maybeFailure = await WrapAsyncFault(async () => await preparedStatement.run(row.email, row.project, row.role))
                if (E.isLeft(maybeFailure)) {
                    return maybeFailure
                }
            }
            return E.right({})
        }),
        andThenAsync(() => DbPrepare("INSERT INTO user_roles (email, project_name, role_name) VALUES (?, ?, ?)")),
        andThenAsync(async preparedStatement => {
            let inserts = creates.values().toArray();
            for (let i = 0; i < inserts.length; i ++) {
                let row = inserts[i]
                const maybeFailure = await WrapAsyncFault(async () => await preparedStatement.run(row.email, row.project, row.role))
                if (E.isLeft(maybeFailure)) {
                    return maybeFailure
                }
            }
            return E.right({})
        }),
    )

    return await E.match(result, {
        async onLeft(error) {
            reportError({incomingMatrix, existingMatrix})(error)
            return andThen(() => E.left("Email already exists in the system."))(await DbExec("ROLLBACK"));
        },
        async onRight() {
            return await DbExec("COMMIT;");
        }
    })
}

export async function CreateUser(email: string) {
    const result = await pipe(
        DbExec("BEGIN TRANSACTION;"),
        andThenAsync(() => DbQueryOne<{email: string}>("SELECT email FROM user WHERE email = ?", email)),
        andThenAsync(async maybeEmail => O.match(maybeEmail, {
            async onNone() {
                const randomPassword = randomBytes(32).map(x => (x % 25) + 97).toString()
                const hashedPassword = createHash("sha512").update(randomPassword + await getPassSecret()).digest("base64");
                // TODO if the email already exists in the system, redirect the user to the forgot password link instead.
                return E.map(
                    () => ({email, randomPassword})
                )(
                    await DbExec("INSERT INTO user (email, password_hash) VALUES (?, ?)", email, hashedPassword)
                )
            },
            async onSome() {
                return E.left(new Error("Email already exists in the system."))
            }
        })),
        andThenAsync(({email, randomPassword}) =>  SendMail(`
Hi ${email}!

You've been invited to collaborate on the Morpho Design Explorer project.
Here are your credentials:
Username: ${email}
Password: ${randomPassword}

If the credentials above don't work, use the forgot-password feature to reset it to whatever you like.

Cheers!
- Admin@morpho-design-explorer.com
        `.trimEnd(), email)),
    )
    
    return await E.match(result, {
        async onLeft(error) {
            reportError({email})(error);
            const result = await DbExec("rollback");
            return andThen<any, any, Error, Error>(() => E.left(new Error("Failed to rollback user invite transaction.")))(result)
        },
        async onRight() {
            return await DbExec("COMMIT")
        }
    })
}
