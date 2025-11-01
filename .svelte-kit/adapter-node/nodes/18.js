import * as server from '../entries/pages/auth/logout/_page.server.ts.js';

export const index = 18;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/logout/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/auth/logout/+page.server.ts";
export const imports = ["_app/immutable/nodes/18.D5zbRALy.js","_app/immutable/chunks/CFjQe0dZ.js","_app/immutable/chunks/IHki7fMi.js"];
export const stylesheets = [];
export const fonts = [];
