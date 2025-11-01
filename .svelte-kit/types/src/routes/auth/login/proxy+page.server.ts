// @ts-nocheck
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import {BuildServerURL} from "$lib/common";
import { generateToken, getEncryptionSecret, getPassSecret, verifyToken } from "$lib/auth";
import crypto from "node:crypto";
import { GetDatabase } from "$lib/database";

type FormResponse = {
    message: string
}

export const load = async ({cookies}: Parameters<PageServerLoad>[0]) => {
    let [_, ok] = await verifyToken(cookies.get("jwt") || "")
    // redirect the user out of this page if they are verified (i.e. logged in).
    if (ok) {
        return redirect(302, "/auth/admin")
    }
}

export const actions = {
    login: async ({request, cookies}): Promise<FormResponse> => {
        const form = await request.formData();
        const email = form.get("uname")?.toString();
        const password = form.get("pwd")?.toString();
        const db = await GetDatabase();

        if (email && password) {
            const hashedPassword = crypto.createHash("sha512").update(password + await getPassSecret()).digest("base64");
            let hashInDB: {password_hash: string} | undefined = undefined;

            try {
                hashInDB = await db.get("select password_hash from user where email = ?", email);
            } catch (err) {
                reportSQLError(err);
            }

            if (hashInDB) {
                if (hashInDB.password_hash === hashedPassword) {
                    const token = await generateToken(email);
                    // stay logged in for a month
                    cookies.set("jwt", token, {path: "/", secure: true, httpOnly: true, maxAge: 60 * 60 * 24 * 30});
                } else {
                    return {
                        message: "Invalid credentials."
                    }
                }
            } else {
                return {
                    message: "Invalid credentials."
                }
            }

            return redirect(303, "/auth/admin/")

        } else {
            return {
                message: "Email or Password was not filled in."
            }
        }
    },
} satisfies Actions
