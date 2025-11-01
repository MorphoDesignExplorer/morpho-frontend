import { B as BuildServerURL } from "../../../../chunks/common.js";
const load = async ({ cookies }) => {
  let projectData = await (await fetch(`${BuildServerURL()}/project/`)).json();
  let documentData = await (await fetch(`${BuildServerURL()}/document/`)).json();
  return {
    projects: projectData,
    documents: documentData
  };
};
export {
  load
};
