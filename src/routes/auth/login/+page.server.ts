import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { isAuthenticated } from "$lib/auth";

type InitResponse = {
    token: string,
    secret: string
} | {
    detail: string
}

type VerifyResponse = {
    token: string
} | {
    detail: string
}

type FormResponse = {
    status: "verify",
    message?: string
} | {
    status: "init",
    message: string
}

let SERVER_URL = "http://backend:8000" + process.env.API_PREFIX;

export const load: PageServerLoad = async ({cookies}) => {
    const auth_state = await isAuthenticated(cookies);
    // redirect the user out of this page if they are verified (i.e. logged in).
    if (auth_state.status == "VERIFIED") {
        return redirect(302, "/")
    }
}

export const actions = {
    init: async ({request, cookies}): Promise<FormResponse> => {
        const form = await request.formData();
        const uname = form.get("uname")?.toString();
        const pwd = form.get("pwd")?.toString();

        const response = await fetch(`${SERVER_URL}/auth/init`, {
            method: "POST",
            body: JSON.stringify({username: uname, password: pwd}),
            headers: {
                "Content-Type": "application/json"
            }
        } satisfies RequestInit);
        const response_data: InitResponse = await response.json();

        if ("token" in response_data) {
            cookies.set("jwt", response_data.token, {path: "/", secure: false, httpOnly: false});
            return {
                status: "verify"
            }
        } else {
            return {
                status: "init",
                message: response_data.detail
            }
        }
    },
    verify: async ({request, cookies, url}): Promise<FormResponse> => {
        const form = await request.formData();
        const otp = form.get("otp")?.toString();

        console.log(cookies.getAll())

        const response = await fetch(`${SERVER_URL}/auth/verify`, {
            method: "POST",
            body: JSON.stringify({otp: otp}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("jwt")}`
            }
        } satisfies RequestInit);
        const response_data: VerifyResponse = await response.json();

        if ("token" in response_data) {
            cookies.set("jwt", response_data.token, {path: "/", secure: false, httpOnly: false});
            const redirect_uri: string = url.searchParams.get("redirect") || "/";
            return redirect(302, redirect_uri);
        } else {
            return {
                status: "verify",
                message: response_data.detail
            }
        }
    }
} satisfies Actions
