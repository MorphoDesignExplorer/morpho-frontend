/// Library for reporting errors.

import { CloudWatchLogsClient, PutLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs"; // ES Modules import

import { ENVIRONMENT } from "$env/static/private"

export function reportMessage(message: string) {
    // TODO send these logs to an observability platform
    console.log(message)
}

/**
Returns a function that reports an error.
On development environments, this sends the error to the console,
while in production the error is sent to cloudwatch.

TODO include information here about how to use this in tandem with DB functions.

The context can be anything pretty much, but the preferable argument is a stringified JSON object.
*/
export function reportError(context: Record<string, string>): (error: Error) => {} {
    return (error: Error) => {
        // TODO send these error traces to an observability platform
    
        const ERR_FORMAT = `
Message:
${error.message}

Cause:
${error.cause}

Context:
${JSON.stringify(context)}

Stack:
${error.stack}
`
        if (ENVIRONMENT === "prod") {
            const client = new CloudWatchLogsClient({});
            // doesn't need an await; this function failing means something even more sinister is going on.
            client.send(new PutLogEventsCommand({
                logGroupName: "Server-Error-Logs",
                logStreamName: "Morpho-Server-Logs",
                logEvents: [
                    {
                        message: ERR_FORMAT,
                        timestamp: Date.now()
                    }
                ]
            }))
        }
        console.error(ERR_FORMAT)
    }
}
