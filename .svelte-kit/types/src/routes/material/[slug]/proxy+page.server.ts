// @ts-nocheck
import type { PageServerLoad } from "./$types"
import { type Document } from "$lib/types";
import { GetDocumentTree } from "$lib/database";
import { labelTree } from './navigator'
import { RenderDocument } from "$lib/document";

export const load = async ({params}: Parameters<PageServerLoad>[0]) => {
    const documentTree = await GetDocumentTree();
    const documentSet: Map<string, Document> = Object.keys(documentTree).flatMap(key => documentTree[key]).concat().reduce((prev: Map<string, Document>, current: Document) => {
        prev.set(current.slug, current)
        return prev
    }, new Map())

    // Creating a subsection navigator
    let tree: string;
    let mapping: [string, string][] = [];
    const currentDocument = documentSet.get(params.slug) as Document

    let titles: Record<string, string>;
    [tree, titles] = labelTree(RenderDocument(currentDocument?.text))
    mapping = Object.keys(titles).map(key => [key, titles[key]])

    let result: { documents: { [k: string]: Document[] }, documentSet: Map<string, Document>, slug: string, mapping: [string, string][], tree: string} = {
        documents: documentTree,
        documentSet: documentSet,
        slug: params.slug,
        mapping: mapping,
        tree: tree
    };

    return result;
}
