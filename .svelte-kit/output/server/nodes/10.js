import * as server from '../entries/pages/_project_name_/configure/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_project_name_/configure/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/[project_name]/configure/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.BBAfKjAQ.js","_app/immutable/chunks/CFjQe0dZ.js","_app/immutable/chunks/D6YF6ztN.js","_app/immutable/chunks/IHki7fMi.js","_app/immutable/chunks/ClpmLFKC.js","_app/immutable/chunks/CYDE4SrB.js","_app/immutable/chunks/C3zd62aW.js","_app/immutable/chunks/DCInEoFh.js","_app/immutable/chunks/DmyDdaTM.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/Cpj98o6Y.js"];
export const stylesheets = ["_app/immutable/assets/10.BJacexW5.css"];
export const fonts = [];
