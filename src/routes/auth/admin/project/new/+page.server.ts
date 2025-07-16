import { verifyToken } from "$lib/auth";
import { BuildServerURL } from "$lib/common";
import { redirect, type Actions } from "@sveltejs/kit";

export const actions = {
    create: async ({ cookies, request }) => {
        let [_, ok] = await verifyToken(cookies.get("jwt") || "");
        if (!ok) {
            return redirect(301, "/");
        }

        const form = await request.formData();
        const response = await fetch(`${BuildServerURL()}/project/`, {
            method: "POST",
            body: form,
            headers: {
                Authorization: `Bearer ${cookies.get("jwt") || ""}`,
            },
        });

        if (response.ok) {
            const responseJson = (await response.json()) as {
                message: string;
                project_name: string;
            };

            return responseJson;
        } else {
            return (await response.json()) as { code: string; message: string };
        }
    },
} satisfies Actions;
