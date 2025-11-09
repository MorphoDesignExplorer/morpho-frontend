import type { Document, AdminForm } from "$lib/types";
import { Either as E, pipe } from "effect";
import { DbExec } from "$lib/database";
import AdmZip from "adm-zip";
import { reportError } from "$lib/error";
import { WrapFault, andThen, andThenA, andThen2A } from "./common";

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

function MakeTree(entires: AdmZip.IZipEntry[]) {
  entires[0].extra
}

/**
Takes a project ZIP file spit out my the Morpho Grasshopper Plugin and ingest it.
This zip file is usually hosted on AWS and accessed through S3-FS.
*/
export async function UploadProject(pathToZip: string) {
  const pipeResult = pipe(
    WrapFault(() => new AdmZip(pathToZip)),
    andThen((zipHandle: AdmZip) => {
      return E.right(zipHandle.getEntryCount())
    }),
  )
  E.mapLeft(reportError({}))(pipeResult)
}

