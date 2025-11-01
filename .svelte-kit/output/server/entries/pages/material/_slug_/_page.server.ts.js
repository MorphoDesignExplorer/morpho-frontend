import { a as GetDocumentTree } from "../../../../chunks/database.js";
import { JSDOM } from "jsdom";
import { R as RenderDocument } from "../../../../chunks/document.js";
function visit(element, context) {
  let mapping = {};
  if (element.tagName == "H1") {
    context.numbering[0] += 1;
    context.numbering[1] = 0;
    context.numbering[2] = 0;
    const serializedNumber = context.numbering.map((el) => el.toString()).join(".");
    element.id = serializedNumber;
    mapping["#" + serializedNumber] = element.textContent || "";
  } else if (element.tagName == "H2") {
    context.numbering[1] += 1;
    context.numbering[2] = 0;
    const serializedNumber = context.numbering.map((el) => el.toString()).join(".");
    element.id = serializedNumber;
    mapping["#" + serializedNumber] = element.textContent || "";
  } else if (element.tagName == "H3") {
    context.numbering[2] += 1;
    const serializedNumber = context.numbering.map((el) => el.toString()).join(".");
    element.id = serializedNumber;
    mapping["#" + serializedNumber] = element.textContent || "";
  } else if (element.hasChildNodes()) {
    let children = element.children;
    for (let i = 0; i < children.length; i++) {
      mapping = { ...mapping, ...visit(children[i], context) };
    }
  }
  return mapping;
}
function labelTree(content) {
  const instance = new JSDOM(content);
  const tree = instance.window.document;
  const mapping = visit(tree.querySelectorAll("body")[0], { numbering: [0, 0, 0] });
  tree.querySelectorAll("a").forEach((element) => {
    if (element.href[0] != "#") {
      element.target = "_blank";
    }
  });
  return [tree.querySelectorAll("body")[0].innerHTML, mapping];
}
const load = async ({ params }) => {
  const documentTree = await GetDocumentTree();
  const documentSet = Object.keys(documentTree).flatMap((key) => documentTree[key]).concat().reduce((prev, current) => {
    prev.set(current.slug, current);
    return prev;
  }, /* @__PURE__ */ new Map());
  let tree;
  let mapping = [];
  const currentDocument = documentSet.get(params.slug);
  let titles;
  [tree, titles] = labelTree(RenderDocument(currentDocument?.text));
  mapping = Object.keys(titles).map((key) => [key, titles[key]]);
  let result = {
    documents: documentTree,
    documentSet,
    slug: params.slug,
    mapping,
    tree
  };
  return result;
};
export {
  load
};
