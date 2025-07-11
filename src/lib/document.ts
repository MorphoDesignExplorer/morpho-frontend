import { type Document } from "./types";
import { BuildServerURL } from "./common";
import { Parser, HtmlRenderer } from "commonmark";


export async function GetDocument(idOrSlug: string): Promise<string> {
    const response = await fetch(`${BuildServerURL()}/document/${idOrSlug}/`);

    if (!response.ok) {
        return ""
    } else {
        const body: Document = await response.json();
        const parser = new Parser();
        const renderer = new HtmlRenderer();

        return renderer.render(parser.parse(body.text))
    }
}

export async function GetDocumentTree(): Promise<{[k: string]: Document[]}> {
    const response = await fetch(`${BuildServerURL()}/document/`);

    if (!response.ok) {
        throw Error(`Could not fetch any documents: ${response.status} ${response.body}`)
    } else {
        const documents: Document[] = await response.json()
        // order documents into a tree at this point
        const docTree: Map<string, Document[]> = new Map();
        documents.forEach(doc => {
            const docList = docTree.get(doc.parent)
            if (docList != undefined) {
                docTree.set(doc.parent, [...docList, doc]);
            } else {
                docTree.set(doc.parent, [doc])
            }
        })
        return Object.fromEntries(docTree)
    }
}


export function RenderDocument(input: string): string {
    const parser = new Parser();
    const renderer = new HtmlRenderer();
    return renderer.render(parser.parse(input))
}