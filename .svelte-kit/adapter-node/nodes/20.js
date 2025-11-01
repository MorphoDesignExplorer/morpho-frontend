import * as server from '../entries/pages/material/_slug_/_page.server.ts.js';

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/material/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/material/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/20.BaHLFYl6.js","_app/immutable/chunks/CFjQe0dZ.js","_app/immutable/chunks/D6YF6ztN.js","_app/immutable/chunks/IHki7fMi.js","_app/immutable/chunks/C3zd62aW.js","_app/immutable/chunks/ClpmLFKC.js","_app/immutable/chunks/CYDE4SrB.js"];
export const stylesheets = ["_app/immutable/assets/20.CMM0AZ5u.css"];
export const fonts = [];
