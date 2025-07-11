import { JSDOM } from 'jsdom';

function visit(element: Element, context: {numbering: number[]}): Record<string, string> {
    let mapping: Record<string, string> = {}
    if (element.tagName == "H1") {
        context.numbering[0] += 1
        context.numbering[1] = 0
        context.numbering[2] = 0
        const serializedNumber = context.numbering.map(el => el.toString()).join(".")
        element.id = serializedNumber
        mapping['#' + serializedNumber] = element.textContent || ""
    } else if (element.tagName == "H2") {
        context.numbering[1] += 1
        context.numbering[2] = 0
        const serializedNumber = context.numbering.map(el => el.toString()).join(".")
        element.id = serializedNumber
        mapping['#' + serializedNumber] = element.textContent || ""
    } else if (element.tagName == "H3") {
        context.numbering[2] += 1
        const serializedNumber = context.numbering.map(el => el.toString()).join(".")
        element.id = serializedNumber
        mapping['#' + serializedNumber] = element.textContent || ""
    } else if (element.hasChildNodes()) {
        let children = element.children;
        for (let i = 0; i < children.length; i ++) {
            mapping = {...mapping, ...visit(children[i], context)}
        }
    }
    return mapping
}

export function labelTree(content: string): [string, Record<string, string>] {
    const instance = new JSDOM(content);
    const tree = instance.window.document;
    const mapping = visit(tree.querySelectorAll("body")[0], {numbering: [0, 0, 0]})
    tree.querySelectorAll("a").forEach(element => {
        if (element.href[0] != "#") {
            element.target = "_blank"
        }
    })

    return [tree.querySelectorAll("body")[0].innerHTML, mapping]
}