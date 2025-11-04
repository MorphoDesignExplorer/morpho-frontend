import { Option as O, Either as E } from "effect";
import { DbQueryAll, DbQueryOne, DbExec } from "./database";
import type { Project, Document, Model } from "./types";
import { mergeDefaultOptions } from "./types";
import { reportSQLError } from "./error";
import { Parser, HtmlRenderer } from "commonmark";

export async function GetProjects(projectName: O.Option<string>, filtered_for_public: boolean = true): Promise<Project[]> {
    type RowType = { creation_date: string, project_name: string, variable_metadata: string, output_metadata: string, assets: string, deleted: string, captions: string, slug: string, markdown: string, human_name: string, options: string };

    const rows = await O.match(
        projectName,
        {
            async onNone() {
                return await DbQueryAll<RowType[]>("select creation_date, project.project_name, variable_metadata, output_metadata, assets, deleted, metadata.captions, metadata.slug, metadata.markdown, metadata.human_name, project_options.options FROM project, metadata, project_options where project.project_name = metadata.project_name AND project.project_name = project_options.project_name;")
            },
            async onSome(name) {
                return await DbQueryAll<RowType[]>("select creation_date, project.project_name, variable_metadata, output_metadata, assets, deleted, metadata.captions, metadata.slug, metadata.markdown, metadata.human_name, project_options.options FROM project, metadata, project_options WHERE project.project_name = metadata.project_name  AND project.project_name = project_options.project_name AND project.project_name = ?;", name)
            }
        }
    )

    const result = E.map((rows: RowType[]) => {
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
                },
                options: mergeDefaultOptions(JSON.parse(item.options))
            } as Project
        });
    })(rows)

    const filtered_result = E.map((projects: Project[]) => {
        return filtered_for_public ? projects.filter(project => project.options.is_public) : projects;
    })(result)

    return E.match(
        filtered_result,
        {
            onLeft: (err: Error) => {
                reportSQLError(err)
                return []
            },
            onRight: (projects: Project[]) => projects
        }
    )
}

export async function GetDocuments(): Promise<Document[]> {
    const documents = await DbQueryAll<Document[]>("select id, slug, text, title, parent, timestamp FROM document");

    return E.match(
        documents,
        {
            onLeft: (err) => {
                reportSQLError(err);
                return [];
            },
            onRight: documents => documents
        }
    )
}

export async function GetDocument(idOrSlug: string): Promise<string> {
    const documents = (await GetDocuments()).filter(doc => doc.id == idOrSlug || doc.slug == idOrSlug)

    if (documents.length > 0) {
        const body: Document = documents[0]
        const parser = new Parser();
        const renderer = new HtmlRenderer();

        return renderer.render(parser.parse(body.text))
    } else {
        return ""
    }
}

export async function GetDocumentTree(): Promise<{ [k: string]: Document[] }> {
    const documents = await GetDocuments();

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
}

export async function GetModels(projectName: string): Promise<Model[]> {

    let cached_models = await CacheGet(`models_${projectName}`);
    if (O.isSome(cached_models)) {
        let retval = JSON.parse(cached_models.value) as Model[];
        return retval
    }

    const maybe_model_rows = await DbQueryAll<Record<string, string>[]>("SELECT id, scoped_id, parameters, output_parameters FROM solution WHERE project_name = ?", projectName)
    const model_rows = E.getOrElse<Error, Record<string, string>[]>(e => {
        reportSQLError(e);
        return [];
    })(maybe_model_rows);

    const maybe_asset_rows = await DbQueryAll<{ tag: string, file: string, solution_id: string }[]>("SELECT asset.tag, asset.file, asset.solution_id FROM asset WHERE asset.solution_id in (SELECT id FROM solution WHERE project_name = ?)", projectName)
    const asset_rows = E.getOrElse<Error, { tag: string, file: string, solution_id: string }[]>(e => {
        reportSQLError(e);
        return [];
    })(maybe_asset_rows);

    const models: Model[] = model_rows.map(row => ({
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
}

let CACHE_SCHEMA = `
    CREATE TABLE IF NOT EXISTS cache (key TEXT, value TEXT, expires_at INTEGER);
    CREATE TRIGGER IF NOT EXISTS cache.cleanup AFTER INSERT ON cache BEGIN 
        DELETE FROM cache cache WHERE expires < unixepoch('now');
    END;
`;

export async function CachePut(key: string, value: string): Promise<void> {
    E.mapLeft(reportSQLError)(await DbExec(CACHE_SCHEMA));
    E.mapLeft(reportSQLError)(await DbExec("INSERT INTO cache VALUES (?, ?, unixepoch('now'));", key, value));
}

/**
* Get a cached version of a key-value pair (string, string) that hasn't expired yet.
* Returns an Option with the value associated with the key.
*
* Refer to this resource to help handle errors: TODO fill in link to deal with database op errors
*/
export async function CacheGet(key: string): Promise<O.Option<string>> {
    const row = await DbQueryOne<{ value: string }>("SELECT value FROM cache WHERE key = ? AND created > (unixepoch('now') - 86400);", key);

    return E.match(
        row, {
        onLeft(err) {
            reportSQLError(err);
            return O.none()
        },
        onRight(row) {
            return O.map<{ value: string }, string>(
                tuple => tuple.value
            )(row)
        },
    }
    )
}
