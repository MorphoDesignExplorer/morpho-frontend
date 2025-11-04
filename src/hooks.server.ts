import type { ServerInit } from "@sveltejs/kit";
import { DbExec } from "$lib/database";
import { Either as E } from "effect";
import * as jobs from "$lib/background-jobs";
import { reportError } from "$lib/error";

/// TODO: Dummy queries. Replace these with ones that actually work.
export const init: ServerInit = async () => {
    const PROJECT_SCHEMA = `SELECT 0;`; // TODO fill this out
    const MODEL_SCHEMA = `SELECT 0;`; // TODO fill this out
    const METADATA_SCHEMA = `SELECT 0;`; // TODO fill this out
    const SERVER_OPTIONS_SCHEMA = `CREATE TABLE IF NOT EXISTS project_options (options TEXT default '{}', project_name TEXT PRIMARY KEY, foreign key(project_name) references project(project_name))`;
    const AUTOFILL_OPTIONS = `INSERT OR IGNORE INTO project_options (project_name) SELECT project_name FROM project;`
    const USER_SCHEMA = `SELECT 0`; // TODO fill this out
    const ROLE_SCHEMA = `
    CREATE TABLE IF NOT EXISTS roles (
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK ( type in ('MID', 'CRUD') ),
        permissions TEXT NOT NULL,
        PRIMARY KEY (name, type)
    )`
    const PERMISSION_MATRIX_SCHEMA =
        `CREATE TABLE IF NOT EXISTS user_roles (
        email TEXT NOT NULL,
        role_name TEXT NOT NULL,
        role_type TEXT NOT NULL,
        FOREIGN KEY (role_name, role_type) REFERENCES roles(name, type),
        FOREIGN KEY (email) REFERENCES user(email),
        CONSTRAINT user_role_uniq UNIQUE (email, role_name, role_type)
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
    let CACHE_SCHEMA = `
        CREATE TABLE IF NOT EXISTS cache (key TEXT, value TEXT, expires_at INTEGER);
        CREATE TRIGGER IF NOT EXISTS cache.cleanup AFTER INSERT ON cache BEGIN 
            DELETE FROM cache cache WHERE expires < unixepoch('now');
        END;
    `;    
    // makes the server crash. Meant to crash the server when the schema definition queries fail.
    const DDLValidate = (query: string) => ({
        onLeft(error: Error) {
            if (error) {
                reportError({query})(new Error(error));
                throw new Error(error)
            }
        },
        onRight(_: any) {
            console.log(`Setup query ${query} successfully.`)
        }
    });
    
    E.match(await DbExec(PROJECT_SCHEMA), DDLValidate(PROJECT_SCHEMA));
    E.match(await DbExec(MODEL_SCHEMA), DDLValidate(MODEL_SCHEMA));
    E.match(await DbExec(METADATA_SCHEMA), DDLValidate(METADATA_SCHEMA));
    E.match(await DbExec(SERVER_OPTIONS_SCHEMA), DDLValidate(SERVER_OPTIONS_SCHEMA));
    E.match(await DbExec(AUTOFILL_OPTIONS), DDLValidate(AUTOFILL_OPTIONS));
    E.match(await DbExec(USER_SCHEMA), DDLValidate(USER_SCHEMA));
    E.match(await DbExec(ROLE_SCHEMA), DDLValidate(ROLE_SCHEMA));
    E.match(await DbExec(PERMISSION_MATRIX_SCHEMA), DDLValidate(PERMISSION_MATRIX_SCHEMA));
    E.match(await DbExec(AUTH_TOKEN_SCHEMA), DDLValidate(AUTH_TOKEN_SCHEMA));
    E.match(await DbExec(RESET_TOKEN_SCHEMA), DDLValidate(RESET_TOKEN_SCHEMA));
    E.match(await DbExec(CACHE_SCHEMA), DDLValidate(CACHE_SCHEMA));
    console.log("Database setup complete.")

    // TODO Start Background jobs
}
