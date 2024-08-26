import { isAuthenticated } from "$lib/auth";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

let SERVER_URL = "http://backend:8000" + process.env.API_PREFIX;

export const load: PageServerLoad = async ({ cookies, url }) => {
    const auth_status = await isAuthenticated(cookies);
    if (auth_status.status !== "VERIFIED") {
        redirect(301, `/auth/login/?redirect=${url.pathname}`);
    }

    return {
        authentication_status: auth_status
    }
}