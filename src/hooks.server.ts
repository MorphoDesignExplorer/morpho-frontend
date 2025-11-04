import type { ServerInit } from "@sveltejs/kit";
import { DbExec } from "$lib/database";
import { Either as E } from "effect";
import * as jobs from "$lib/background-jobs";
import { reportSQLError } from "$lib/error";

/// TODO: Dummy queries. Replace these with ones that actually work.
export const init: ServerInit = async () => {
    const PROJECT_SCHEMA = `SELECT ;`; // TODO fill this out
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

    // makes the server crash. Meant to crash the server when the schema definition queries fail.
    const DDLValidate = (query: string) => ({
        onLeft(error: Error) {
            if (error) {
                reportSQLError(new Error(error));
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
    console.log("Database setup complete.")

    // TODO Start Background jobs
}
