import * as server from '../entries/pages/_project_name_/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_project_name_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/[project_name]/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.CKZ4bXpo.js","_app/immutable/chunks/CFjQe0dZ.js","_app/immutable/chunks/IHki7fMi.js","_app/immutable/chunks/D6YF6ztN.js","_app/immutable/chunks/DmyDdaTM.js","_app/immutable/chunks/BZgZaSr-.js","_app/immutable/chunks/C3zd62aW.js","_app/immutable/chunks/ClpmLFKC.js","_app/immutable/chunks/CYDE4SrB.js"];
export const stylesheets = ["_app/immutable/assets/8.DeOPmktm.css"];
export const fonts = [];
