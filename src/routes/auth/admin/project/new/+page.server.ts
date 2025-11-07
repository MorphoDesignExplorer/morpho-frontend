import { BuildServerURL } from "$lib/common";
import { redirect, type Actions } from "@sveltejs/kit";
import { Option as O } from "effect";

export const actions = {
    create: async ({ locals, cookies, request }) => {
        if (O.isNone(locals.user)) {
            return redirect(301, "/")
        }

        try {
            const requestJson = await request.json();
            if (Object.hasOwn(requestJson, "s3uri")) {
                // TODO communicate with go backend at this point
                const response = await fetch(`${BuildServerURL()}/project/`, {
                    method: "POST",
                    body: JSON.stringify(requestJson),
                    headers: {
                        Authorization: "Bearer " + cookies.get("jwt") || "",
                    },
                });

                if (response.ok) {
                    const responseJson = (await response.json()) as {
                        message: string;
                        project_name: string;
                    };
                    return responseJson;
                } else {
                    return { ...(await response.json()), code: 400 } as {
                        code: string;
                        message: string;
                    };
                }
            } else {
                throw new Error("No s3uri included in request.");
            }
        } catch (err) {
            return {
                code: 400,
                message: (err as Error).message,
            };
        }
    },
} satisfies Actions;
