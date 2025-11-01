import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { performance } from "perf_hooks";
const DB_FILE_PATH = "/Users/Work/repos/morpho-frontend/morpho.sqlite";
async function GetDatabase() {
  return open({ filename: DB_FILE_PATH, driver: sqlite3.Database });
}
async function GetProjects(projectName) {
  const db = await GetDatabase();
  let rows;
  if (projectName._tag == "None") {
    rows = await db.all("select creation_date, project.project_name, variable_metadata, output_metadata, assets, deleted, metadata.captions, metadata.slug, metadata.markdown, metadata.human_name FROM project, metadata where project.project_name = metadata.project_name;");
  } else {
    rows = await db.all("select creation_date, project.project_name, variable_metadata, output_metadata, assets, deleted, metadata.captions, metadata.slug, metadata.markdown, metadata.human_name FROM project, metadata WHERE project.project_name = metadata.project_name AND project.project_name = ?;", projectName.value);
  }
  return rows.map((item) => {
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
    };
  });
}
async function GetDocumentTree() {
  const db = await GetDatabase();
  const documents = await db.all("SELECT id, slug, text, title, parent, timestamp FROM document");
  const docTree = /* @__PURE__ */ new Map();
  documents.forEach((doc) => {
    const docList = docTree.get(doc.parent);
    if (docList != void 0) {
      docTree.set(doc.parent, [...docList, doc]);
    } else {
      docTree.set(doc.parent, [doc]);
    }
  });
  return Object.fromEntries(docTree);
}
async function GetModels(projectName) {
  const stamp = performance.now();
  let cached_models = await CacheGet(`models_${projectName}`);
  if (cached_models._tag == "Some") {
    let retval = JSON.parse(cached_models.value);
    console.log(performance.now() - stamp, `to get ${projectName} from cache`);
    return retval;
  }
  const db = await GetDatabase();
  let model_rows = await db.all("SELECT id, scoped_id, parameters, output_parameters FROM solution WHERE project_name = ?", projectName);
  let asset_rows = await db.all("SELECT asset.tag, asset.file, asset.solution_id FROM asset WHERE asset.solution_id in (SELECT id FROM solution WHERE project_name = ?)", projectName);
  let models = model_rows.map((row) => ({
    id: row.id,
    scoped_id: parseInt(row.scoped_id),
    parameters: JSON.parse(row.parameters),
    output_parameters: JSON.parse(row.output_parameters),
    files: asset_rows.filter((asset_row) => asset_row.solution_id == row.id).map((asset) => ({
      file: asset.file,
      tag: asset.tag
    }))
  }));
  await CachePut(`models_${projectName}`, JSON.stringify(models));
  console.log(performance.now() - stamp, "to cache");
  return models;
}
let CACHE_SCHEMA = `
    CREATE TABLE IF NOT EXISTS cache (key TEXT, value TEXT, created INTEGER);
    CREATE TRIGGER IF NOT EXISTS cache.cleanup AFTER INSERT ON cache BEGIN 
        DELETE FROM cache cache WHERE created < (unixepoch('now') - 86400); 
    END;
`;
async function CachePut(key, value) {
  const db = await GetDatabase();
  await db.run(CACHE_SCHEMA);
  await db.run("INSERT INTO cache VALUES (?, ?, unixepoch('now'));", key, value);
}
async function CacheGet(key) {
  const db = await GetDatabase();
  await db.run(CACHE_SCHEMA);
  const row = await db.get("SELECT value FROM cache WHERE key = ? AND created > (unixepoch('now') - 86400);", key);
  if (row === void 0) {
    return { _tag: "None" };
  } else {
    return { _tag: "Some", value: row.value };
  }
}
export {
  GetProjects as G,
  GetDocumentTree as a,
  GetModels as b
};
