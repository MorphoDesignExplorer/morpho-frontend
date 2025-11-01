import crypto from "node:crypto";
import AWS from "aws-sdk";
import { ENC_SECRET, ENVIRONMENT, PASS_SECRET } from "$env/static/private"
import { GetDatabase } from "./database";
import { MorphoErrorCode, type MorphoError } from "./types";
import { reportSQLError } from "./error";

/*
 *  Checks cookies to verify that the client holds a token.
 *  If the cookies hold a token equivalent to an admin, it is considered authenticated.
 *  Else, it is not.
 *
 *  Return true if authenticated, false otherwise.
export async function isAuthenticated(cookies: Cookies): Promise<boolean> {
}
*/

export async function getPassSecret(): Promise<string> {
    if (ENVIRONMENT == "dev") {
        return PASS_SECRET
    } else {
        const client = new AWS.SSM({region: 'us-east-1'});
        const response = await client.getParameter({Name: 'PASS_SECRET', WithDecryption: false}).promise();
        return response.Parameter?.Value || "";
    }
}

export async function getEncryptionSecret(): Promise<string> {
    if (ENVIRONMENT == "dev") {
        return ENC_SECRET
    } else {
        const client = new AWS.SSM({region: 'us-east-1'});
        const response = await client.getParameter({Name: 'ENC_SECRET', WithDecryption: false}).promise();
        return response.Parameter?.Value || "";
    }
}

const AUTH_SCHEMA = `
CREATE TABLE IF NOT EXISTS auth_token (
    token TEXT NOT NULL PRIMARY KEY,
    email TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch()),
    expires_at INTEGER NOT NULL,
    last_used_at INTEGER,
    is_revoked BOOLEAN DEFAULT 0,
    FOREIGN KEY (email) REFERENCES user(email) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_auth_tokens_expires_at ON auth_token(expires_at);

CREATE TRIGGER IF NOT EXISTS cleanup_expired_tokens
AFTER INSERT ON auth_token
BEGIN
    DELETE FROM auth_token
    WHERE expires_at < unixepoch("now")
       OR is_revoked = 1;
END;

CREATE TRIGGER IF NOT EXISTS update_token_last_used
AFTER UPDATE OF last_used_at ON auth_token
BEGIN
    DELETE FROM auth_token
    WHERE expires_at < unixepoch("now")
       OR is_revoked = 1;
END;
`

export async function generateToken(email: string): Promise<string> {
    const db = await GetDatabase();
    await db.run(AUTH_SCHEMA);
    while (true) {
        // retry until token creation succeeds, in case token is a duplicate.
        // other failure modes like the user not existing will infinitely block this though...
        try {
            const token = crypto.randomBytes(1024).toString("base64");
            await db.run(
                `insert into auth_token (token, email, expires_at, last_used_at) values (?, ?, unixepoch() + ?, unixepoch());`, 
                token,
                email,
                7 * 24 * 60 * 60, // 7 days
            );
            return token;
        } catch (err) {
            // do nothing...
            reportSQLError(err as Error)
        }
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
    const db = await GetDatabase();

    try {
        await db.run(AUTH_SCHEMA);
        const email = await db.get("SELECT email, expires_at - unixepoch() FROM auth_token WHERE token = ? AND unixepoch() < expires_at", encodedToken);
        if (email) {
            await db.run("UPDATE auth_token SET last_used_at = unixepoch() WHERE token = ?", encodedToken);
            return [{}, true]
        } else {
            return [{}, false]
        }
    } catch (err) {
        reportSQLError(err as Error)
        return [{}, false]
    }
}

const RESET_TOKEN_SCHEMA = `
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    token TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch())
);

-- Trigger to cleanup expired reset tokens after any insert
CREATE TRIGGER IF NOT EXISTS cleanup_expired_reset_tokens
AFTER INSERT ON password_reset_tokens
BEGIN
    DELETE FROM password_reset_tokens
    WHERE (unixepoch() - created_at) > 300;
END;
`



export async function generateResetToken(email: string): Promise<string | MorphoError> {
    try {
        const db = await GetDatabase();
        await db.run(RESET_TOKEN_SCHEMA);
        const email_exists = await db.get("select email from user where email = ?", email);
        if (email_exists) {
            const potential_token = await db.get(`SELECT token FROM password_reset_tokens WHERE email = ? AND (unixepoch() - created_at) < 300;`, email)
            if (potential_token) {
                return potential_token.token
            } else {
                const token = crypto.randomBytes(128).toString("base64url");
                await db.run("INSERT INTO password_reset_tokens (token, email) VALUES (?, ?)", token, email);
                return token
            }
        } else {
            return {code: MorphoErrorCode.EMAIL_DOES_NOT_EXIST, message: "Email does not exist."}
        }
    } catch (err) {
        reportSQLError(err as Error)
        return {code: MorphoErrorCode.DB_ERROR, message: "Could not access database."}
    }
}

export async function verifyResetToken(token: string): Promise<boolean> {
    const db = await GetDatabase();
    try {
        await db.run(RESET_TOKEN_SCHEMA);
        const potential_token = await db.get(`SELECT token, unixepoch() - created_at FROM password_reset_tokens WHERE token = ? AND (unixepoch() - created_at) < 300;`, token);
        return potential_token !== undefined;
    } catch (err) {
        reportSQLError(err as Error)
        return false;
    }
}

export async function GetResetTokenMetadata(token: string): Promise<{valid: boolean, email: string}> {
    const db = await GetDatabase();

    try {
        const details: {created_at: string, email: string, current_time: string} | undefined = await db.get(`SELECT email, created_at, unixepoch() as current_time FROM password_reset_tokens WHERE token = ?`, token);
        if (details) {
            return {
                valid: parseInt(details.current_time) - parseInt(details.created_at) <= 300,
                email: details.email
            }
        } else {
            return {valid: false, email: ""}
        }
    } catch (err) {
        reportSQLError(err as Error)
        return {valid: false, email: ""}
    }
}

export async function ResetPassword(token: string, password: string): Promise<boolean> {
    const db = await GetDatabase();

    try {
        const details = await GetResetTokenMetadata(token);
        if (details.valid) {
            const hashedPassword = crypto.createHash("sha512").update(password + await getPassSecret()).digest("base64");
            await db.run("UPDATE user SET password_hash = ? WHERE email = ?", hashedPassword, details.email);
            await db.run("DELETE FROM password_reset_tokens WHERE token = ?", token);
            return true
        } else {
            return false
        }
    } catch(err) {
        reportSQLError(err as Error)
        return false
    }
}

