import { isAuthenticated } from "$lib/auth";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { BuildServerURL } from "$lib/common";

let SERVER_URL = BuildServerURL();

export const load: PageServerLoad = async ({ cookies, url }) => {
    const auth_status = await isAuthenticated(cookies);
    if (auth_status.status !== "VERIFIED") {
        redirect(301, `/auth/login/?redirect=${url.pathname}`);
    }

    return {
        authentication_status: auth_status
    }
}
