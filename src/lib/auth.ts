import crypto from "node:crypto";
import AWS from "aws-sdk";
import { ENC_SECRET, ENVIRONMENT, PASS_SECRET } from "$env/static/private"
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { DbExec, DbQueryOne } from "./database";
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
        const client = new AWS.SSM({ region: 'us-east-1' });
        const response = await client.getParameter({ Name: 'PASS_SECRET', WithDecryption: false }).promise();
        return response.Parameter?.Value || "";
    }
}

export async function getEncryptionSecret(): Promise<string> {
    if (ENVIRONMENT == "dev") {
        return ENC_SECRET
    } else {
        const client = new AWS.SSM({ region: 'us-east-1' });
        const response = await client.getParameter({ Name: 'ENC_SECRET', WithDecryption: false }).promise();
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
    E.mapLeft(reportSQLError)(await DbExec(AUTH_SCHEMA)); // report error with initialization

    while (true) {
        // retry until token creation succeeds, in case token is a duplicate.
        // other failure modes like the user not existing will infinitely block this though...
        try {
            const token = crypto.randomBytes(1024).toString("base64");
            const result = await DbExec(
                `insert into auth_token (token, email, expires_at, last_used_at) values (?, ?, unixepoch() + ?, unixepoch());`,
                token,
                email,
                7 * 24 * 60 * 60
            )
            if (E.isRight(result)) {
                return token;
            } else {
                reportSQLError(result.left);
            }
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
    // TODO right now a stub token is returned for compatibility purposes. Remove this later.
    // TODO any error in the chain should terminate it and return false
    E.mapLeft(reportSQLError)(await DbExec(AUTH_SCHEMA));
    const maybe_email = E.mapLeft(reportSQLError)(await DbQueryOne("SELECT email, expires_at - unixepoch() FROM auth_token WHERE token = ? AND unixepoch() < expires_at", encodedToken));
    if (E.isRight(maybe_email) && O.isSome(maybe_email.right)) {
        E.mapLeft(reportSQLError)(await DbExec("UPDATE auth_token SET last_used_at = unixepoch() WHERE token = ?", encodedToken));
        return [{}, true]
    } else {
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



export async function generateResetToken(email: string): Promise<O.Option<string>> {
    E.mapLeft(reportSQLError)(await DbExec(RESET_TOKEN_SCHEMA));
    const email_exists = E.mapLeft(reportSQLError)(await DbQueryOne("select email from user where email = ?", email));

    if (E.isRight(email_exists) && O.isSome(email_exists.right)) {
        const potential_token = await DbQueryOne<{ token: string }>(`SELECT token FROM password_reset_tokens WHERE email = ? AND (unixepoch() - created_at) < 300;`, email);
        if (E.isRight(potential_token) && O.isSome(potential_token.right)) {
            return O.some(potential_token.right.value.token)
        } else {
            const token = crypto.randomBytes(128).toString("base64url");
            E.mapLeft(reportSQLError)(await DbExec("INSERT INTO password_reset_tokens (token, email) VALUES (?, ?)", token, email));
            return O.some(token)
        }
    } else {
        return O.none
    }

}

export async function verifyResetToken(token: string): Promise<boolean> {
    E.mapLeft(reportSQLError)(await DbExec(RESET_TOKEN_SCHEMA));
    const potential_token = await DbQueryOne<{ token: string }>(`SELECT token, unixepoch() - created_at FROM password_reset_tokens WHERE token = ? AND (unixepoch() - created_at) < 300;`, token);

    // check if the token exists in the DB
    return (E.isRight(potential_token) && O.isSome(potential_token.right));
}

export async function GetResetTokenMetadata(token: string): Promise<{ valid: boolean, email: string }> {
    const maybe_reset_token_details = E.mapLeft(reportSQLError)(
        await DbQueryOne<{ created_at: string, email: string, current_time: string }>(
            `SELECT email, created_at, unixepoch() as current_time FROM password_reset_tokens WHERE token = ?`, token
        )
    );

    if (E.isRight(maybe_reset_token_details) && O.isSome(maybe_reset_token_details.right)) {
        const details = maybe_reset_token_details.right.value;
        return {
            valid: parseInt(details.current_time) - parseInt(details.created_at) <= 300,
            email: details.email
        }
    } else {
        return { valid: false, email: "" }
    }
}

export async function ResetPassword(token: string, password: string): Promise<boolean> {
    const details = await GetResetTokenMetadata(token);
    if (details.valid) {
        const hashedPassword = crypto.createHash("sha512").update(password + await getPassSecret()).digest("base64");
        // TODO IMPORTANT convert this into an sql transaction that terminates if anything in this chain fails
        E.mapLeft(reportSQLError)(await DbExec("UPDATE user SET password_hash = ? WHERE email = ?", hashedPassword, details.email));
        E.mapLeft(reportSQLError)(await DbExec("DELETE FROM password_reset_tokens WHERE token = ?", token));
        return true
    } else {
        return false
    }
}

