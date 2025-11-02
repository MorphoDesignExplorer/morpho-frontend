/// Library for reporting errors.

import { RUM } from "@aws-sdk/client-rum";
import { ENVIRONMENT } from "$env/static/private"

export function reportMessage(message: string) {
    // TODO send these logs to an observability platform
    console.log(message)
}

export function reportSQLError(error: Error) {
    // TODO send these error traces to an observability platform

    if (ENVIRONMENT === "prod") {
        const client = new RUM({ region: "us-east-1" });
    }

    console.error("[ERROR]", new Error(error))
}
