import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { generateResetToken, generateToken, getPassSecret, verifyResetToken, verifyToken } from "$lib/auth";
import { GetDatabase } from "$lib/database";
import { reportSQLError } from "$lib/error";

export const load: PageServerLoad = async ({cookies, url}) => {
    let [_, ok] = await verifyToken(cookies.get("jwt") || "")
    // redirect the user out of this page if they are verified (i.e. logged in).
    if (ok) {
        return redirect(302, "/auth/admin")
    }
}

export const actions = {
    submit: async ({request, cookies}): Promise<{message: string}> => {
        const form = await request.formData();
        const email = form.get("email")?.toString();
        const db = await GetDatabase();

        if (email) {
            try {
                let mail_match = undefined; 

                try {
                    mail_match = await db.get("select email from user where email = ?", email);
                } catch (err) {
                    reportSQLError(err as Error)
                }

                if (mail_match) {
                    const token = await generateResetToken(email);
                    if (typeof token === "string") {
                        console.log("mailing", token);
                    }
                }
            } catch (err) {
                reportSQLError(err as Error)
            }
        }

        return {
            message: `An email was sent to ${email}.`
        }
    },
} satisfies Actions
