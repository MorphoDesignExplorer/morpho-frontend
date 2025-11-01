import { redirect } from "@sveltejs/kit";
import { i as isAuthenticated } from "../../../../chunks/auth.js";
const SERVER_URL = "http://backend:8000" + process.env.API_PREFIX;
const load = async ({ cookies, params }) => {
  const auth_status = await isAuthenticated(cookies);
  if (auth_status.status !== "VERIFIED") {
    redirect(302, `/${params.project_name}`);
  }
};
const actions = {
  configure: async ({ request, cookies, params }) => {
    const form_data = await request.json();
    let is_ok = true;
    const caption_response = await fetch(
      `${SERVER_URL}/project/${params.project_name}/metadata/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cookies.get("jwt")}`
        },
        body: JSON.stringify({
          field: "captions",
          new_content: form_data.captions
        })
      }
    );
    is_ok = is_ok && caption_response.status === 200;
    const human_name_response = await fetch(
      `${SERVER_URL}/project/${params.project_name}/metadata/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cookies.get("jwt")}`
        },
        body: JSON.stringify({
          field: "human_name",
          new_content: form_data.human_name
        })
      }
    );
    is_ok = is_ok && human_name_response.status === 200;
    const description_response = await fetch(
      `${SERVER_URL}/project/${params.project_name}/metadata/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cookies.get("jwt")}`
        },
        body: JSON.stringify({
          field: "description",
          new_content: form_data.editor
        })
      }
    );
    is_ok = is_ok && description_response.status === 200;
    if (is_ok) {
      return { status: "ok" };
    } else {
      return { status: "nok", detail: "Update failed" };
    }
  },
  logout: ({ cookies, params }) => {
    cookies.delete("jwt", { path: "/" });
  }
};
export {
  actions,
  load
};
