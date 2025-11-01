import { redirect } from "@sveltejs/kit";
import { B as BuildServerURL } from "../../../../chunks/common.js";
import { v as verifyToken } from "../../../../chunks/auth.js";
let SERVER_URL = BuildServerURL();
const load = async ({ cookies }) => {
  let [_, ok] = await verifyToken(cookies.get("jwt") || "");
  if (ok) {
    return redirect(302, "/auth/admin");
  }
};
const actions = {
  login: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = form.get("uname")?.toString();
    const password = form.get("pwd")?.toString();
    if (email && password) {
      const response = await fetch(`${SERVER_URL}/auth/login/`, {
        method: "POST",
        body: new URLSearchParams({
          email,
          password
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      const response_data = await response.text();
      try {
        if (JSON.parse(response_data)) {
          return {
            message: JSON.parse(response_data)["message"]
          };
        }
      } catch (e) {
        if (response_data.length > 0) {
          cookies.set("jwt", response_data, { path: "/", secure: true, httpOnly: true, maxAge: 60 * 60 * 24 * 30 });
        }
      }
      return redirect(303, "/auth/admin/");
    } else {
      return {
        message: "Email or Password was not filled in."
      };
    }
  }
};
export {
  actions,
  load
};
