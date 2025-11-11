import { Either as E } from "effect";

export async function SendMail(email: string, destination: string) {
    // TODO send email via SES
    console.log("API: mailing to", destination)
    console.log(email)
    return E.right({})
}