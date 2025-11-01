import * as server from '../entries/pages/auth/admin/_layout.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/auth/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/3.COpfN2fT.js","_app/immutable/chunks/CFjQe0dZ.js","_app/immutable/chunks/D6YF6ztN.js","_app/immutable/chunks/IHki7fMi.js"];
export const stylesheets = ["_app/immutable/assets/3.BqaN6BZH.css"];
export const fonts = [];
