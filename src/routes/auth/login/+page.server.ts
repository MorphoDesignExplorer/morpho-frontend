import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { generateToken, getPassSecret } from "$lib/auth";
import crypto from "node:crypto";
import { DbQueryOne } from "$lib/database";
import { Option as O, Either as E } from "effect";
import { reportError } from "$lib/error";

type FormResponse = {
    message: string
}

export const load: PageServerLoad = async ({ locals }) => {
    if (O.isSome(locals.user)) {
        return redirect(302, "/auth/admin")
    }
}

export const actions = {
    login: async ({ request, cookies }): Promise<FormResponse> => {
        const form = await request.formData();
        const email = form.get("uname")?.toString();
        const password = form.get("pwd")?.toString();

        if (email && password) {
            const hashedPassword = crypto.createHash("sha512").update(password + await getPassSecret()).digest("base64");
            const hashInDB = await DbQueryOne<{ password_hash: string }>("select password_hash from user where email = ?", email);

            E.mapLeft<Error, any>(reportError({email}))(hashInDB); // report any sql errors

            if (E.isRight(hashInDB) && O.isSome(hashInDB.right)) {
                if (hashInDB.right.value.password_hash === hashedPassword) {
                    const token = await generateToken(email)
                    // stay logged in for a month
                    cookies.set("jwt", token, { path: "/", secure: true, httpOnly: true, maxAge: 60 * 60 * 24 * 30 });
                    return redirect(303, "/auth/admin");
                } else {
                    return { message: "Invalid credentials." }
                }
            } else {
                return { message: "Invalid credentials." }
            }
        } else {
            return {
                message: "Email or Password was not filled in."
            }
        }
    },
} satisfies Actions
