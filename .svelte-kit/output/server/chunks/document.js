import { Parser, HtmlRenderer } from "commonmark";
function RenderDocument(input) {
  const parser = new Parser();
  const renderer = new HtmlRenderer();
  return renderer.render(parser.parse(input));
}
export {
  RenderDocument as R
};
