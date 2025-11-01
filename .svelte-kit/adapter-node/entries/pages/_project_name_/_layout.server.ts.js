import "aws-sdk";
import { B as BuildServerURL } from "../../../chunks/common.js";
import { G as GetProjects } from "../../../chunks/database.js";
BuildServerURL();
const load = async ({ params }) => {
  let result = {
    projects: [],
    metadata: {
      captions: [],
      human_name: "",
      description: { slug: "", text: "" }
    },
    authentication_status: { status: "ANONYMOUS" },
    prefix: process.env.SUBPATH_PREFIX || ""
  };
  result.projects = await GetProjects({ _tag: "None" });
  result.metadata = result.projects.filter(
    (item) => item.project_name == params.project_name
  )[0].metadata;
  return result;
};
export {
  load
};
