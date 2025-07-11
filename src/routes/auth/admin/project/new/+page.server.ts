import { verifyToken } from "$lib/auth"
import { redirect, type Actions } from "@sveltejs/kit";

export const actions = {
    create: async({cookies, request}) => {
        let [_, ok] = await verifyToken(cookies.get("jwt") || "");
        if (!ok) {
            return redirect(301, "/")
        }

        const form = await request.formData()
        console.log(form.get("zipfile"))
    }
} satisfies Actions;