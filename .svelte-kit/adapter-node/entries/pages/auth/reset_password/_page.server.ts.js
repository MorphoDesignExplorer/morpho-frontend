import { redirect } from "@sveltejs/kit";
import { B as BuildServerURL } from "../../../../chunks/common.js";
let SERVER_URL = BuildServerURL();
const load = async ({ url }) => {
  return redirect(303, "/");
};
const actions = {
  reset: async ({ request, url }) => {
    const form = await request.formData();
    const pwd1 = form.get("pwd1")?.toString();
    const pwd2 = form.get("pwd2")?.toString();
    if (pwd1 != pwd2) {
      return {
        message: "passwords do not match."
      };
    } else {
      const response = await fetch(`${SERVER_URL}/auth/reset_password`, {
        method: "POST",
        body: JSON.stringify({
          session: url.searchParams.get("session"),
          replacement_password: pwd1
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const response_data = await response.json();
      if ("code" in response_data) {
        if (response_data.code == "reset_password_too_similar") {
          return {
            message: response_data.detail
          };
        } else {
          return {
            code: "expired",
            message: response_data.detail
          };
        }
      } else {
        return redirect(303, "/");
      }
    }
  }
};
export {
  actions,
  load
};
