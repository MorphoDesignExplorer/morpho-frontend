import * as server from '../entries/pages/auth/forgot_password/_page.server.ts.js';

export const index = 16;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/forgot_password/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/auth/forgot_password/+page.server.ts";
export const imports = ["_app/immutable/nodes/16.Ctf8tqbc.js","_app/immutable/chunks/CFjQe0dZ.js","_app/immutable/chunks/IHki7fMi.js","_app/immutable/chunks/DCInEoFh.js","_app/immutable/chunks/ClpmLFKC.js","_app/immutable/chunks/CYDE4SrB.js"];
export const stylesheets = [];
export const fonts = [];
