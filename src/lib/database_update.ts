import { DbExec } from "./database";
import * as E from "fp-ts/Either";
import { reportSQLError } from "./error";
import type { ISqlite } from "sqlite";
import type { Caption } from "./types";

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
        E.match<Error, {}, DeleteDocumentResponse>(
            error => {
                reportSQLError(error);
                return {
                    status: "failure",
                    message: error.message
                }
            },
            ({ }) => ({
                status: "success",
                message: "Document deleted successfully."
            })
        )
    }

    DbExec("DELETE FROM document WHERE id = ? OR slug = ?");

    return { status: "success", message: "Document deleted successfully." }
}

type UpdateDocumentResponse = {
    status: "success" | "failure"
    message: string
}

export async function UpdateDocument(id: string, text: string, title: string, parent: string): Promise<UpdateDocumentResponse> {
    return E.match<Error, ISqlite.RunResult, UpdateDocumentResponse>(
        error => {
            return {
                status: "failure",
                message: error.message
            }
        },
        result => {
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
        }
    )(
        await DbExec("UPDATE document SET text = ?, title = ?, parent = ? WHERE id = ?", text, title, parent, id)
    )
}

type UpdateProjectMetadataRequest = {
    variable_metadata_units: Record<string, string>,
    output_metadata_units: Record<string, string>,
    asset_descriptions: Record<string, string>,
    captions: Caption[],
    project_description: string,
    project_name: string,
    human_name: string
}

type UpdateProjectMetadataResponse = {
    status: "success" | "failure",
    message: string
}

export async function UpdateMetadata(request: UpdateProjectMetadataRequest): Promise<UpdateProjectMetadataResponse> {
    return { status: "success", message: "" }
}

