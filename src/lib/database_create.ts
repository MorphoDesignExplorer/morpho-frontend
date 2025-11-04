import type { Document, AdminForm } from "$lib/types";
import { Either as E } from "effect";
import { DbExec } from "$lib/database";

type CreateDocumentResponse = {
  status: "success" | "failure"
}

function formattedDate(): string {
  const date = new Date(Date.now())
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

export async function CreateDocument(form: Extract<AdminForm, {type: "document"}>): Promise<CreateDocumentResponse> {
  const req: Document = {
    ...form.form,
    timestamp: formattedDate(),
    slug: form.form.title.toLowerCase().split(' ').join("_")
  }

  return E.match(
    await DbExec(`INSERT
      INTO document (id, slug, text, title, parent, timestamp)
      VALUES (?, ?, ?, ?, ?, ?);`,
      req.id, req.slug, req.text, req.title, req.parent, req.timestamp
    ),
    {
      onLeft(error) {
        reportError(error);
        return { "status": "failure" }
      },
      onRight() {
        return { "status": "success" }
      }
    }
    
  )

}

