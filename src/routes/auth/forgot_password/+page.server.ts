import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { isAuthenticated } from "$lib/auth";
import { BuildServerURL } from "$lib/common";

type ForgotPasswordResponse = {
    detail: string
}

let SERVER_URL = BuildServerURL();


export const load: PageServerLoad = async ({cookies}) => {
    const auth_state = await isAuthenticated(cookies);
    // redirect the user out of this page if they are verified (i.e. logged in).
    if (auth_state.status == "VERIFIED") {
        return redirect(302, "/")
    }
}


export const actions = {
    default: async({request}) => {
        const form = await request.formData();
        const email = form.get("email")?.toString();
        
        try {
            const response = await fetch(`${SERVER_URL}/auth/reset_password_init?` + new URLSearchParams({ident: email}).toString(), {
                method: "GET",
            })
            const response_data: ForgotPasswordResponse = await response.json();
            if (response_data.detail) {
                return {
                    "message": "A password reset link was sent to your email. Cheers!"
                }
            }
        } catch (e) {
            console.log(e)
            return {
                "message": 'We are facing an internal issue. Please try again later.'
            }
        }
    },
} satisfies Actions
