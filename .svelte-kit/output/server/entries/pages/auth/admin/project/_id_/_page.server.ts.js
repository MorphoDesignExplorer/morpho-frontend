import { v as verifyToken } from "../../../../../../chunks/auth.js";
import { redirect } from "@sveltejs/kit";
import { B as BuildServerURL } from "../../../../../../chunks/common.js";
const load = async ({ cookies, params }) => {
  const projects = await (await fetch(`${BuildServerURL()}/project/${params.id}/`)).json();
  const data = {
    project: projects[0]
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
      project_name: form.form.project_name,
      variable_metadata_units: form.form.vmetadata.reduce(
        (acc, item) => {
          acc[item.field_name] = item.field_unit;
          return acc;
        },
        {}
      ),
      output_metadata_units: form.form.ometadata.reduce(
        (acc, item) => {
          acc[item.field_name] = item.field_unit;
          return acc;
        },
        {}
      ),
      asset_descriptions: form.form.ametadata.reduce(
        (acc, item) => {
          acc[item.tag] = item.description;
          return acc;
        },
        {}
      ),
      project_description: form.form.description,
      captions: form.form.captions,
      human_name: form.form.human_name
    };
    const result = await fetch(`${BuildServerURL()}/project/`, {
      method: "PUT",
      body: JSON.stringify(updateRequest),
      headers: {
        Authorization: `Bearer ${cookies.get("jwt") || ""}`
      }
    });
    const resultJson = await result.json();
    if (result.ok) {
      return { status: "success", ...resultJson };
    } else {
      return { status: "failure", ...resultJson };
    }
  },
  delete: async ({ cookies, params }) => {
    let [_, ok] = await verifyToken(cookies.get("jwt") || "");
    if (!ok) {
      return redirect(301, "/");
    }
    const response = await fetch(
      `${BuildServerURL()}/project/${params.id}/`,
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
