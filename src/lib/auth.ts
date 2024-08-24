import type { Cookies } from "@sveltejs/kit";
import * as jose from "jose";

export type Authenticated = {
    status: "VERIFIED",
    username: string
} | {
    status: "UNVERIFIED",
    username: string
} | {
    status: "ANONYMOUS"
}

export async function verifyJWT(jwt: string | undefined): Promise<boolean> {
    if (jwt) {
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        try {
            const result = await jose.jwtVerify(jwt, secret);
            return true;
        } catch (e) {
            ;
        }
    }
    return false;
}

export async function isAuthenticated(cookies: Cookies): Promise<Authenticated> {
    const jwt = cookies.get("jwt")
    if (jwt) {
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);

        try {
            if (!(await jose.jwtVerify(jwt, secret))) {
                return {status: "ANONYMOUS"}
            }

            const payload: {version: string, username: string, verified: boolean, iat: number, exp: number} = jose.decodeJwt(jwt);
            if (payload.verified) {
                return {status: "VERIFIED", username: payload.username}
            } else {
                return {status: "UNVERIFIED", username: payload.username}
            }
        } catch (e) {
            console.log(e)
        }
    }
    return {status: "ANONYMOUS"}
}

export async function clearUserSession(cookies: Cookies) {
    const jwt = cookies.get("jwt");
    if (jwt) {
        cookies.delete("jwt", {path: "/"});
    }
}
