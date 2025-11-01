import * as server from '../entries/pages/_project_name_/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_project_name_/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/[project_name]/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.DykBw1jg.js","_app/immutable/chunks/CFjQe0dZ.js","_app/immutable/chunks/D6YF6ztN.js","_app/immutable/chunks/IHki7fMi.js","_app/immutable/chunks/ClpmLFKC.js","_app/immutable/chunks/CYDE4SrB.js","_app/immutable/chunks/C3zd62aW.js","_app/immutable/chunks/BZgZaSr-.js"];
export const stylesheets = ["_app/immutable/assets/2.CW8F3DTu.css"];
export const fonts = [];
