import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import {BuildServerURL} from "$lib/common";

type ResetPasswordResponse = {
    status: string
} | {
    detail: string,
    code: string
}


let SERVER_URL = BuildServerURL();

export const load: PageServerLoad = async ({url}) => {
    /*
    const jwt_session = url.searchParams.get("session");
    if (jwt_session) {
        if (await verifyJWT(jwt_session)) {
            return {session: jwt_session};
        }
    }
    */
    return redirect(303, "/");
}

export const actions = {
    reset: async({request, url}) => {
        const form = await request.formData();
        const pwd1 = form.get("pwd1")?.toString();
        const pwd2 = form.get("pwd2")?.toString();

        if (pwd1 != pwd2) {
            return {
                message: "passwords do not match."
            }
        } else {
            const response = await fetch(`${SERVER_URL}/auth/reset_password`, {
                method: "POST",
                body: JSON.stringify({
                    session: url.searchParams.get("session"),
                    replacement_password: pwd1
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const response_data: ResetPasswordResponse = await response.json();

            if ("code" in response_data) {
                if (response_data.code == "reset_password_too_similar") {
                    return {
                        message: response_data.detail
                    }
                } else {
                    return {
                        code: "expired",
                        message: response_data.detail
                    }
                }
            } else {
                return redirect(303, "/");
            }
        }
    },
} satisfies Actions
