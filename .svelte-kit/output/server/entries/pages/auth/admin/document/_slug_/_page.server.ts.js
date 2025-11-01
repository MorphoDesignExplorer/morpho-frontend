import { v as verifyToken } from "../../../../../../chunks/auth.js";
import { B as BuildServerURL } from "../../../../../../chunks/common.js";
import { redirect } from "@sveltejs/kit";
const load = async ({ params }) => {
  const documents = await (await fetch(`${BuildServerURL()}/document/`)).json();
  const data = {
    document: documents.filter((doc) => doc.slug == params.slug)[0],
    documents
  };
  return data;
};
const actions = {
  update: async ({ cookies, request }) => {
    let [_, ok] = await verifyToken(cookies.get("jwt") || "");
    if (!ok) {
      return redirect(301, "/");
    }
    const form = JSON.parse(
      await request.text()
    );
    const updateRequest = {
      title: form.form.title,
      text: form.form.text,
      parent: form.form.parent
    };
    let response = await fetch(
      `${BuildServerURL()}/document/${form.form.id}/`,
      {
        method: "PUT",
        body: JSON.stringify(updateRequest),
        headers: {
          Authorization: `Bearer ${cookies.get("jwt") || ""}`
        }
      }
    );
    const responseJson = await response.json();
    if (response.ok) {
      return { status: "success", ...responseJson };
    } else {
      return { status: "failure", ...responseJson };
    }
  },
  delete: async ({ cookies, request }) => {
    let [_, ok] = await verifyToken(cookies.get("jwt") || "");
    if (!ok) {
      return redirect(301, "/");
    }
    const deleteRequest = await request.json();
    let response = await fetch(
      `${BuildServerURL()}/document/${deleteRequest.idOrSlug}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cookies.get("jwt") || ""}`
        }
      }
    );
    const responseJson = await response.json();
    if (response.ok) {
      return { status: "success", ...responseJson };
    } else {
      return { status: "failure", ...responseJson };
    }
  }
};
export {
  actions,
  load
};
