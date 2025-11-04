import { DbExec } from "./database";
import { Either as E } from "effect";
import { reportError } from "./error";
import type { ISqlite } from "sqlite";
import type { Caption, AdminForm, ProjectOptions } from "./types";

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
            await DbExec("DELETE FROM document WHERE id = ? OR slug = ?"),
            {
                onLeft(error) {
                    reportError({idOrSlug})(error)
                    return {
                        status: "failure",
                        message: error.message
                    }
                },
                onRight({ }) {
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

export async function UpdateDocument(id: string, text: string, title: string, parent: string): Promise<UpdateDocumentResponse> {
    return E.match(
        await DbExec("UPDATE document SET text = ?, title = ?, parent = ? WHERE id = ?", text, title, parent, id),
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

