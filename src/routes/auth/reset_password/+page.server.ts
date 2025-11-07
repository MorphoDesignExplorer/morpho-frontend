import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { ResetPassword, verifyResetToken } from "$lib/auth";
import { Option as O } from "effect";

export const load: PageServerLoad = async ({ locals, url }) => {
    if (O.isSome(locals.user)) {
        return redirect(302, "/auth/admin")
    }
    
    let token = url.searchParams.get("token") || ""
    let valid_token = await verifyResetToken(token);
    if (valid_token) {
        return { validity: true, token: token }
    } else {
        return { validity: false }
    }
}

export const actions = {
    submit: async ({ request }): Promise<{ message: string, code: "OK" | "INVALID" | "NOK" }> => {
        const form = await request.formData();
        const pwd = form.get("pwd")?.toString();
        const confirm = form.get("confirm")?.toString();
        const token = form.get("token")?.toString();

        if (pwd && confirm && token && pwd == confirm) {
            if (await ResetPassword(token, pwd)) {
                return redirect(302, "/auth/login/")
            } else {
                return {
                    message: "Invalid reset session. Redirecting...",
                    code: "INVALID"
                }
            }
        } else {
            return {
                message: "Passwords do not match.",
                code: "NOK"
            }
        }
    },
} satisfies Actions
