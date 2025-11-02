import { Parser, HtmlRenderer } from "commonmark";

export function RenderDocument(input: string): string {
    const parser = new Parser();
    const renderer = new HtmlRenderer();
    return renderer.render(parser.parse(input))
}
