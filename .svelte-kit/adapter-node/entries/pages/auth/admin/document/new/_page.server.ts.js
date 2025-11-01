import { v as verifyToken } from "../../../../../../chunks/auth.js";
import { B as BuildServerURL } from "../../../../../../chunks/common.js";
import { redirect } from "@sveltejs/kit";
const load = async ({ cookies }) => {
  const documents = await (await fetch(`${BuildServerURL()}/document/`)).json();
  const data = {
    documents
  };
  return data;
};
const actions = {
  create: async ({ cookies, request }) => {
    let [_, ok] = await verifyToken(cookies.get("jwt") || "");
    if (!ok) {
      return redirect(301, "/");
    }
    const form = JSON.parse(await request.text());
    const createRequest = {
      slug: form.form.title,
      title: form.form.title,
      text: form.form.text,
      parent: form.form.parent
    };
    let result = await fetch(`${BuildServerURL()}/document/`, {
      method: "POST",
      body: JSON.stringify(createRequest),
      headers: {
        "Authorization": `Bearer ${cookies.get("jwt") || ""}`
      }
    });
    if (result.ok) {
      return redirect(301, `/auth/admin/document/${createRequest.slug}`);
    } else {
      return { status: "failure" };
    }
  }
};
export {
  actions,
  load
};
