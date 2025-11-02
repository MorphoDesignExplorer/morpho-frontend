import { DbExec } from "./database";
import { Either as E } from "effect";
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
        return E.match(
            await DbExec("DELETE FROM document WHERE id = ? OR slug = ?"),
            {
                onLeft(error) {
                    reportSQLError(error)
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

