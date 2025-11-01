import { Parser, HtmlRenderer } from "commonmark";
import { c as common_actions } from "../../../../chunks/common_actions.js";
import "@sveltejs/kit";
const load = async ({ parent }) => {
  const parent_data = await parent();
  const parser = new Parser();
  const renderer = new HtmlRenderer();
  return {
    html: renderer.render(parser.parse(parent_data.metadata.description.text))
  };
};
const actions = {
  ...common_actions
};
export {
  actions,
  load
};
