import { B as BuildServerURL } from "../../../../chunks/common.js";
import { v as verifyToken } from "../../../../chunks/auth.js";
import { redirect } from "@sveltejs/kit";
const load = async ({ cookies, setHeaders }) => {
  setHeaders({
    "cache-control": "no-cache"
  });
  let [_, ok] = await verifyToken(cookies.get("jwt") || "");
  if (!ok) {
    return redirect(301, "/auth/login/");
  }
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
