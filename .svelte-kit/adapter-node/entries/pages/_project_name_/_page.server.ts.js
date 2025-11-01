import { error } from "@sveltejs/kit";
import { c as common_actions } from "../../../chunks/common_actions.js";
import { B as BuildServerURL } from "../../../chunks/common.js";
import { b as GetModels } from "../../../chunks/database.js";
BuildServerURL();
const actions = {
  ...common_actions
};
const load = async ({ params, parent }) => {
  const parent_data = await parent();
  let result = {
    project_name: params.project_name,
    project_data: parent_data.projects.filter(
      (item) => item.project_name === params.project_name
    )[0],
    models: [],
    all_project_names: parent_data.projects.map(
      (item) => item.project_name
    )
  };
  try {
    result.models = await GetModels(params.project_name);
  } catch (e) {
    console.log(e);
    error(404, "Project not found.");
  }
  return {
    project: result.project_data,
    models: result.models,
    project_name: result.project_name,
    authentication_status: parent_data.authentication_status,
    prefix: parent_data.prefix
  };
};
export {
  actions,
  load
};
