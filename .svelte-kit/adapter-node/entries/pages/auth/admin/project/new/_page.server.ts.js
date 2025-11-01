import { v as verifyToken } from "../../../../../../chunks/auth.js";
import { B as BuildServerURL } from "../../../../../../chunks/common.js";
import { redirect } from "@sveltejs/kit";
const actions = {
  create: async ({ cookies, request }) => {
    let [_, ok] = await verifyToken(cookies.get("jwt") || "");
    if (!ok) {
      return redirect(301, "/");
    }
    try {
      const requestJson = await request.json();
      if (Object.hasOwn(requestJson, "s3uri")) {
        const response = await fetch(`${BuildServerURL()}/project/`, {
          method: "POST",
          body: JSON.stringify(requestJson),
          headers: {
            Authorization: "Bearer " + cookies.get("jwt") || ""
          }
        });
        if (response.ok) {
          const responseJson = await response.json();
          return responseJson;
        } else {
          return { ...await response.json(), code: 400 };
        }
      } else {
        throw new Error("No s3uri included in request.");
      }
    } catch (err) {
      return {
        code: 400,
        message: err.message
      };
    }
  }
};
export {
  actions
};
