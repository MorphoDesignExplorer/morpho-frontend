import type { Cookies } from "@sveltejs/kit";
import * as jose from "jose";
import crypto from "node:crypto";
import AWS from "aws-sdk";

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
            await jose.jwtVerify(jwt, secret);
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

/*
 *  Checks cookies to verify that the client holds a token.
 *  If the cookies hold a token equivalent to an admin, it is considered authenticated.
 *  Else, it is not.
 *
 *  Return true if authenticated, false otherwise.
export async function isAuthenticated(cookies: Cookies): Promise<boolean> {
}
*/

async function getParameter(name: string): Promise<string> {
    const ssm = new AWS.SSM({region: "us-east-1"});
    const result = await ssm.getParameter({Name: name, WithDecryption: false}).promise()
    if (result.Parameter) {
        return result.Parameter.Value as string;
    } else {
        return ""
    }
}

/*
 * Takes a encrypted token, decrypts it and authenticates it.
 *
 * Return the decrypted token and true if the decryption succeeds.
 *
 * Return nothing and false if the decryption fails.
 */
export async function verifyToken(encodedToken: string): Promise<[Object, boolean]> {
    try {
        let secret = "";
        if (process.env.ENVIRONMENT == 'prod') {
            secret = await getParameter("ENC_SECRET");
        } else if (process.env.ENVIRONMENT == "dev") {
            secret = process.env.SECRET_KEY || "";
        }
        console.log(secret)

        const key = Buffer.from(secret)
        const decodedToken = Buffer.from(encodedToken, 'base64');
        const byteLength = decodedToken.subarray(0,4).readInt32BE();
        const iv = decodedToken.subarray(4).subarray(0,12);
        const payloadWithTag = decodedToken.subarray(4).subarray(0, byteLength).subarray(12);
        const authTag = payloadWithTag.subarray(payloadWithTag.length - 16) // Auth tag. Go appends this after the encrypted payload. Source: https://cs.opensource.google/go/go/+/refs/tags/go1.24.4:src/crypto/cipher/gcm.go;l=20
        const payload = payloadWithTag.subarray(0, payloadWithTag.length - 16)

        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(payload)
        decipher.final()
        console.log([JSON.parse(decrypted.toString()), true])
        return [JSON.parse(decrypted.toString()), true]
    } catch(e) {
        console.log(e)
        return [{}, false]
    }
}

