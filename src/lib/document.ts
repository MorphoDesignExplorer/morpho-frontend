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

