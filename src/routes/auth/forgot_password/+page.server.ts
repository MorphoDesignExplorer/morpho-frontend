import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { generateResetToken, verifyToken } from "$lib/auth";
import { reportSQLError } from "$lib/error";
import * as O from "fp-ts/Option"
import { SES } from "@aws-sdk/client-ses";
import { ENVIRONMENT } from "$env/static/private";

export const load: PageServerLoad = async ({ cookies }) => {
    let [_, ok] = await verifyToken(cookies.get("jwt") || "")
    // redirect the user out of this page if they are verified (i.e. logged in).
    if (ok) {
        return redirect(302, "/auth/admin")
    }
}

async function sendTokenToMail(token: string, email: string) {
    // TODO mail reset token to target

    const emailTemplate =
        `Hi ${email}!

This is the link to reset your password for morpho-design-explorer.com: ${ENVIRONMENT == "prod" ? "https://morpho-design-explorer.com" : "http://localhost:3000"}/auth/reset_password/?token=${token}`; // TODO change this link

    if (ENVIRONMENT === "prod") {
        const client = new SES({
            region: "us-east-1",
        });

        try {
            await client.sendEmail({
                Source: "morphodesignexplorer@gmail.com",
                Destination: { ToAddresses: [email] },
                Message: {
                    Subject: { Data: "Password Reset Request: Morpho Design Explorer" },
                    Body: { Text: { Data: emailTemplate } }
                }
            })
        } catch (error) {
            reportSQLError(error as Error)
        }
    } else if (ENVIRONMENT === "dev") {
        console.log(emailTemplate);
    }
}

export const actions = {
    submit: async ({ request }): Promise<{ message: string }> => {
        const form = await request.formData();
        const email = form.get("email")?.toString();

        if (email) {
            const token = await generateResetToken(email);
            if (O.isSome(token)) {
                await sendTokenToMail(token.value, email);
            }
        }

        return {
            message: `An email was sent to ${email}.`
        }
    },
} satisfies Actions
