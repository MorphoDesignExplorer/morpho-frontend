import type { ServerInit, Handle } from "@sveltejs/kit";
import { DbExec } from "$lib/database";
import { Either as E, Option as O } from "effect";
import * as jobs from "$lib/background-jobs";
import { reportError } from "$lib/error";
import { GetUserPermissions } from "$lib/database_get";
import { verifyToken } from "$lib/auth";
import default_roles from "$lib/default-roles.json"

/// TODO: Dummy queries. Replace these with ones that actually work.
export const init: ServerInit = async () => {
    const PRAGMA_JOURNAL = `PRAGMA journal_mode = WAL`;
    const PRAGMA_FOREIGN_KEY = `PRAGMA foreign_keys = ON`;
    const PROJECT_SCHEMA = `SELECT 0;`; // TODO fill this out
    const MODEL_SCHEMA = `SELECT 0;`; // TODO fill this out
    const METADATA_SCHEMA = `SELECT 0;`; // TODO fill this out
    const SERVER_OPTIONS_SCHEMA = `CREATE TABLE IF NOT EXISTS project_options (options TEXT default '{}', project_name TEXT PRIMARY KEY, foreign key(project_name) references project(project_name))`;
    const AUTOFILL_OPTIONS = `INSERT OR IGNORE INTO project_options (project_name) SELECT project_name FROM project;`
    const USER_SCHEMA = `SELECT 0`; // TODO fill this out
    const ROLE_SCHEMA = `
    CREATE TABLE IF NOT EXISTS roles (
        name TEXT NOT NULL,
        permissions JSONB NOT NULL,
        PRIMARY KEY (name)
    )`
    const PERMISSION_MATRIX_SCHEMA =
        `CREATE TABLE IF NOT EXISTS user_roles (
        email TEXT NOT NULL,
        role_name TEXT NOT NULL,
        project_name TEXT,
        FOREIGN KEY (role_name) REFERENCES roles(name)
        FOREIGN KEY (email) REFERENCES user(email),
        FOREIGN KEY (project_name) REFERENCES project(project_name)
        CONSTRAINT user_role_uniq UNIQUE (email, role_name, project_name)
    );`
    const AUTH_TOKEN_SCHEMA = `
        CREATE TABLE IF NOT EXISTS auth_token (
            token TEXT NOT NULL PRIMARY KEY,
            email TEXT NOT NULL,
            created_at INTEGER DEFAULT (unixepoch()),
            expires_at INTEGER NOT NULL,
            last_used_at INTEGER,
            is_revoked BOOLEAN DEFAULT 0,
            FOREIGN KEY (email) REFERENCES user(email) ON DELETE CASCADE
        );
    `
    const AUTH_TOKEN_INDEX = `CREATE INDEX IF NOT EXISTS idx_auth_tokens_expires_at ON auth_token(expires_at)`;
    const AUTH_TOKEN_CLEANUP_AFTER_INSERT = `
        CREATE TRIGGER IF NOT EXISTS cleanup_expired_tokens
        AFTER INSERT ON auth_token
        BEGIN
            DELETE FROM auth_token
            WHERE expires_at < unixepoch("now")
               OR is_revoked = 1;
        END;
    `
    const AUTH_TOKEN_CLEANUP_AFTER_UPDATE = `
        CREATE TRIGGER IF NOT EXISTS update_token_last_used
        AFTER UPDATE OF last_used_at ON auth_token
        BEGIN
            DELETE FROM auth_token
            WHERE expires_at < unixepoch("now")
               OR is_revoked = 1;
        END;
    `

    const RESET_TOKEN_SCHEMA = `
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            token TEXT PRIMARY KEY,
            email TEXT NOT NULL,
            created_at INTEGER DEFAULT (unixepoch())
        );
    `
    // Trigger to cleanup expired reset tokens after any insert
    const RESET_TOKEN_CLEANUP = `
        CREATE TRIGGER IF NOT EXISTS cleanup_expired_reset_tokens
        AFTER INSERT ON password_reset_tokens
        BEGIN
            DELETE FROM password_reset_tokens
            WHERE (unixepoch() - created_at) > 300;
        END;
    `
    let CACHE_SCHEMA = `
        CREATE TABLE IF NOT EXISTS cache (key TEXT, value TEXT, expires_at INTEGER);
        CREATE TRIGGER IF NOT EXISTS cleanup AFTER INSERT ON cache BEGIN 
            DELETE FROM cache WHERE expires < unixepoch('now');
        END;
    `;
    // makes the server crash. Meant to crash the server when the schema definition queries fail.
    const DDLValidate = (query: string) => ({
        onLeft(error: Error) {
            if (error) {
                reportError({ query })(new Error(error));
                throw new Error(error)
            }
        },
        onRight(_: any) {
            console.log(`Setup query ${query} successfully.`)
        }
    });

    const statements = [
        PRAGMA_JOURNAL,
        PRAGMA_FOREIGN_KEY,
        PROJECT_SCHEMA,
        MODEL_SCHEMA,
        METADATA_SCHEMA,
        SERVER_OPTIONS_SCHEMA,
        AUTOFILL_OPTIONS,
        USER_SCHEMA,
        ROLE_SCHEMA,
        PERMISSION_MATRIX_SCHEMA,
        AUTH_TOKEN_SCHEMA,
        AUTH_TOKEN_INDEX,
        AUTH_TOKEN_CLEANUP_AFTER_INSERT,
        AUTH_TOKEN_CLEANUP_AFTER_UPDATE,
        RESET_TOKEN_SCHEMA,
        RESET_TOKEN_CLEANUP,
        CACHE_SCHEMA
    ]

    for (let i = 0; i < statements.length; i++) {
        E.match(await DbExec(statements[i]), DDLValidate(statements[i]));
    }

    // insert default roles
    let INSERT_ROLE_STATEMENT = `INSERT OR IGNORE INTO roles (name, permissions) VALUES (?, ?)`;
    for (let i = 0; i < default_roles.length; i ++) {
        E.match(await DbExec(INSERT_ROLE_STATEMENT, default_roles[i].role_name, JSON.stringify(default_roles[i])), DDLValidate(INSERT_ROLE_STATEMENT + "\n::\n" + JSON.stringify(default_roles[i])))
    }

    console.log("Database setup complete.")

    // TODO Start Background jobs
}

export const handle: Handle = async ({ event, resolve }) => {
    const [email, ok] = await verifyToken(event.cookies.get("jwt") || "");
    if (ok) {
        const permissions = await GetUserPermissions(email);
        event.locals.user = O.some({ email, permissions });
    } else {
        event.locals.user = O.none()
    }

    return await resolve(event);
}
