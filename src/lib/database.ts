import sqlite3 from "sqlite3"
import { open, Database } from "sqlite"
import type { Option, Project, Document, Model } from "./types"

import { DB_FILE_PATH } from "$env/static/private";
import { reportSQLError } from "./error";

export async function GetDatabase(): Promise<Database> {
    return open({ filename: DB_FILE_PATH, driver: sqlite3.Database });
}

export async function GetProjects(projectName: Option<string>): Promise<Project[]> {
    const db = await GetDatabase();
    let rows: Record<string, string>[];

    try {
        if (projectName._tag == "None") {
            rows = await db.all("select creation_date, project.project_name, variable_metadata, output_metadata, assets, deleted, metadata.captions, metadata.slug, metadata.markdown, metadata.human_name FROM project, metadata where project.project_name = metadata.project_name;")
        } else {
            rows = await db.all("select creation_date, project.project_name, variable_metadata, output_metadata, assets, deleted, metadata.captions, metadata.slug, metadata.markdown, metadata.human_name FROM project, metadata WHERE project.project_name = metadata.project_name AND project.project_name = ?;", projectName.value);
        }

        return rows.map(item => {
            return {
                project_name: item.project_name,
                creation_date: item.creation_date,
                variable_metadata: JSON.parse(item.variable_metadata),
                output_metadata: JSON.parse(item.output_metadata),
                assets: JSON.parse(item.assets),
                metadata: {
                    captions: JSON.parse(item.captions),
                    description: {
                        slug: item.slug,
                        text: item.markdown
                    },
                    human_name: item.human_name
                }
            } as Project
        });
    } catch (err) {
        reportSQLError(err as Error);
        return [];
    }
}

export async function GetDocuments(): Promise<Document[]> {
    const db = await GetDatabase();
    try {
        const documents: Document[] = await db.all("SELECT id, slug, text, title, parent, timestamp FROM document");
        return documents;
    } catch (err) {
        reportSQLError(err as Error);
        return [];
    }
}

export async function GetDocumentTree(): Promise<{[k: string]: Document[]}> {
    const db = await GetDatabase();

    try {
        const documents: Document[] = await db.all("SELECT id, slug, text, title, parent, timestamp FROM document");
        const docTree: Map<string, Document[]> = new Map();
        documents.forEach(doc => {
            const docList = docTree.get(doc.parent)
            if (docList != undefined) {
                docTree.set(doc.parent, [...docList, doc]);
            } else {
                docTree.set(doc.parent, [doc])
            }
        })
        return Object.fromEntries(docTree)
    } catch (err) {
        reportSQLError(err as Error)
        return {}
    }
}

export async function GetModels(projectName: string): Promise<Model[]> {
    try {
        let cached_models = await CacheGet(`models_${projectName}`);
        if (cached_models._tag == "Some") {
            let retval = JSON.parse(cached_models.value) as Model[];
            return retval
        }

        const db = await GetDatabase();
        let model_rows: Record<string, string>[] = await db.all("SELECT id, scoped_id, parameters, output_parameters FROM solution WHERE project_name = ?", projectName);
        let asset_rows: {
            tag: string,
            file: string,
            solution_id: string
        }[] = await db.all("SELECT asset.tag, asset.file, asset.solution_id FROM asset WHERE asset.solution_id in (SELECT id FROM solution WHERE project_name = ?)", projectName);
        
        let models: Model[] = model_rows.map(row => ({
            id: row.id,
            scoped_id: parseInt(row.scoped_id),
            parameters: JSON.parse(row.parameters) as Record<string, string | number>,
            output_parameters: JSON.parse(row.output_parameters) as Record<string, string | number>,
            files: asset_rows.filter(asset_row => asset_row.solution_id == row.id).map(asset => ({
                file: asset.file,
                tag: asset.tag
            }))
        }));

        await CachePut(`models_${projectName}`, JSON.stringify(models));

        return models;
    } catch (err) {
        reportSQLError(err as Error)
        return []
    }
}

let CACHE_SCHEMA = `
    CREATE TABLE IF NOT EXISTS cache (key TEXT, value TEXT, created INTEGER);
    CREATE TRIGGER IF NOT EXISTS cache.cleanup AFTER INSERT ON cache BEGIN 
        DELETE FROM cache cache WHERE created < (unixepoch('now') - 86400); 
    END;
`;

export async function CachePut(key: string, value: string): Promise<void> {
    const db = await GetDatabase();
    try {
        await db.run(CACHE_SCHEMA);
        await db.run("INSERT INTO cache VALUES (?, ?, unixepoch('now'));", key, value);
    } catch (err) {
        reportSQLError(err as Error)
    }
}

/// Get a cached version of a value that's younger than a day.
export async function CacheGet(key: string): Promise<Option<string>> {
    const db = await GetDatabase();

    try {
        await db.run(CACHE_SCHEMA);
        const row: undefined | {value: string} = await db.get("SELECT value FROM cache WHERE key = ? AND created > (unixepoch('now') - 86400);", key);
        if (row === undefined) {
            return {_tag: "None"}
        } else {
            return {_tag: "Some", value: row.value}
        }
    } catch (err) {
        reportSQLError(err as Error)
        return {_tag: "None"}
    }
}
