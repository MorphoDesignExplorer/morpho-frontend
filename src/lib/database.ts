import sqlite3 from "sqlite3"
import { open, type ISqlite } from "sqlite"
import { Option as O, Either as E } from "effect";
import { DB_FILE_PATH } from "$env/static/private";

export const db = await open({ filename: DB_FILE_PATH, driver: sqlite3.Database });

export async function DbExec(query: string, ...params: any[]): Promise<E.Either<ISqlite.RunResult, Error>> {
    try {
        const response = await db.run(query, params);
        return E.right(response);
    } catch (err) {
        if (!(err instanceof Error)) {
            return E.left(new Error(err as any));
        } else {
            return E.left(err);
        }
    }
}

export async function DbQueryOne<T>(query: string, ...params: any[]): Promise<E.Either<O.Option<T>, Error>> {
    try {
        const response = await db.get(query, params);
        if (response) {
            return E.right(O.some(response));
        } else {
            return E.right(O.none());
        }
    } catch (err) {
        if (!(err instanceof Error)) {
            return E.left(new Error(err as any));
        } else {
            return E.left(err);
        }
    }
}


export async function DbQueryAll<T>(query: string, ...params: any[]): Promise<E.Either<T, Error>> {
    try {
        return E.right(await db.all(query, params));
    } catch (err) {
        if (!(err instanceof Error)) {
            return E.left(new Error(err as any));
        } else {
            return E.left(err);
        }
    }
}

