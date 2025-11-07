import { env } from "$env/dynamic/private";

export const ENVIRONMENT = env.ENVIRONMENT;
export const ENC_SECRET = env.ENC_SECRET;
export const PASS_SECRET = env.PASS_SECRET;
export const DB_FILE_PATH = env.DB_FILE_PATH;
export const S3_URI = env.S3_URI;

function CheckEnvironment() {
    let template = (variableName: string, reason: string) => `environment variable issue: ${variableName} ${reason}`;
    let undefined_reason = "environment variable was not found at runtime.";

    if (ENVIRONMENT != "dev" && ENVIRONMENT != "prod") {
        throw new Error(template("ENVIRONMENT", "is not set to 'prod' or 'dev'"))
    }

    if (ENC_SECRET == undefined) {
        throw new Error(template("ENC_SECRET", undefined_reason))
    }

    if (PASS_SECRET == undefined) {
        throw new Error(template("PASS_SECRET", undefined_reason))
    }

    if (DB_FILE_PATH == undefined) {
        throw new Error(template("DB_FILE_PATH", undefined_reason))
    }
}

CheckEnvironment()

