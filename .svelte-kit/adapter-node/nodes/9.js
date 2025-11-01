import * as server from '../entries/pages/_project_name_/about/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_project_name_/about/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/[project_name]/about/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.BcaejCXd.js","_app/immutable/chunks/CFjQe0dZ.js","_app/immutable/chunks/IHki7fMi.js"];
export const stylesheets = ["_app/immutable/assets/9.jeX4uYEI.css"];
export const fonts = [];
