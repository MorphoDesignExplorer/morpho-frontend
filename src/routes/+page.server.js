/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return {
        prefix: process.env.SUBPATH_PREFIX || "",
    }
}