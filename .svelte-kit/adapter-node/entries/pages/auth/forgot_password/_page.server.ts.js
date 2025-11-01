import { redirect } from "@sveltejs/kit";
import { B as BuildServerURL } from "../../../../chunks/common.js";
import { v as verifyToken } from "../../../../chunks/auth.js";
let SERVER_URL = BuildServerURL();
const load = async ({ cookies }) => {
  const [_, ok] = await verifyToken(cookies.get("jwt") || "");
  if (ok) {
    return redirect(302, "/");
  }
};
const actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const email = form.get("email")?.toString();
    try {
      const response = await fetch(`${SERVER_URL}/auth/reset_password_init?` + new URLSearchParams({ ident: email }).toString(), {
        method: "GET"
      });
      const response_data = await response.json();
      if (response_data.detail) {
        return {
          "message": "A password reset link was sent to your email. Cheers!"
        };
      }
    } catch (e) {
      console.log(e);
      return {
        "message": "We are facing an internal issue. Please try again later."
      };
    }
  }
};
export {
  actions,
  load
};
