/// Library for reporting errors.


export function reportMessage(message: string) {
    // TODO send these logs to an observability platform
    console.log(message)
}

export function reportSQLError(error: Error) {
    // TODO send these error traces to an observability platform
    console.error("[ERROR]", new Error(error))
}
