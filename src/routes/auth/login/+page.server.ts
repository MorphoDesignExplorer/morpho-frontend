import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { isAuthenticated } from "$lib/auth";
import {BuildServerURL} from "$lib/common";
import { verifyToken } from "../../../lib/auth";

type FormResponse = {
    message: string
}

let SERVER_URL = BuildServerURL();

export const load: PageServerLoad = async ({cookies}) => {
    let [_, ok] = await verifyToken(cookies.get("jwt") || "")
    // redirect the user out of this page if they are verified (i.e. logged in).
    if (ok) {
        return redirect(302, "/auth/admin")
    }
}

export const actions = {
    login: async ({request, cookies}): Promise<FormResponse> => {
        const form = await request.formData();
        const email = form.get("uname")?.toString();
        const password = form.get("pwd")?.toString();

        if (email && password) {
            const response = await fetch(`${SERVER_URL}/auth/login/`, {
                method: "POST",
                body: new URLSearchParams({
                    email: email,
                    password: password
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            } satisfies RequestInit);
            const response_data = await response.text();

            try {
                if (JSON.parse(response_data)) {
                    return {
                        message: JSON.parse(response_data)["message"]
                    }
                }
            } catch (e) {
                if (response_data.length > 0) {
                    cookies.set("jwt", response_data, {path: "/", secure: true, httpOnly: true})
                }
            }

            return redirect(303, "/auth/admin/")

        } else {
            return {
                message: "Email or Password was not filled in."
            }
        }
    },
} satisfies Actions
