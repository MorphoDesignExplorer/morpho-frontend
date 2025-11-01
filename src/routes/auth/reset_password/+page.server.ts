import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { GetResetTokenMetadata, ResetPassword, verifyResetToken, verifyToken } from "$lib/auth";
import { GetDatabase } from "$lib/database";

export const load: PageServerLoad = async ({cookies, url}) => {
    let [_, ok] = await verifyToken(cookies.get("jwt") || "")
    // redirect the user out of this page if they are verified (i.e. logged in).
    if (ok) {
        return redirect(302, "/auth/admin")
    }

    let token = url.searchParams.get("token") || ""
    let valid_token = await verifyResetToken(token);
    if (valid_token) {
        return {validity: true, token: token}
    } else {
        return {validity: false}
    }
}

export const actions = {
    submit: async ({request, cookies}): Promise<{message: string, code: "OK" | "INVALID" | "NOK"}> => {
        const form = await request.formData();
        const pwd = form.get("pwd")?.toString();
        const confirm = form.get("confirm")?.toString();
        const token = form.get("token")?.toString();

        if (pwd && confirm && token && pwd == confirm) {
            if (await ResetPassword(token, pwd)) {
                cookies.set("pending_message", "Password Reset was Successful!", {maxAge: 60, path: "/"})
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
