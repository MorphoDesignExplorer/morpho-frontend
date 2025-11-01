import { B as BuildServerURL } from "../../chunks/common.js";
import { a as GetDocumentTree, G as GetProjects } from "../../chunks/database.js";
BuildServerURL();
const load = async () => {
  let result = {
    projects: [],
    documents: await GetDocumentTree()
  };
  result.projects = await GetProjects({ _tag: "None" });
  return {
    ...result,
    prefix: process.env.SUBPATH_PREFIX || ""
  };
};
export {
  load
};
