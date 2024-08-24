import type { Caption } from "$lib/types";
import type { Actions } from "@sveltejs/kit";

const SERVER_URL = "http://backend:8000" + process.env.API_PREFIX;

export const actions = {
    default: async ({request, cookies, params}) => {
        const form_data: {
            captions: Caption[],
            human_name: string,
            editor: Record<any, any>
        } = await request.json();

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
            return {status: "ok"}
        } else {
            return {status: "nok", detail: "Update failed"}
        }
    }
} satisfies Actions;
