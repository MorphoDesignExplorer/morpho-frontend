import type { Project } from "$lib/types";
import type { PageServerLoad } from "./$types"

// TODO switch localhost to backend
let SERVER_URL = "http://backend:8000" + process.env.API_PREFIX;

export const load: PageServerLoad = async () => {
    let result: {projects: Project[]} = {
        projects: [],
    };

    result.projects = await (
        (await fetch(`${SERVER_URL}/project/`)).json()
    )

    return {
        ...result,
        prefix: process.env.SUBPATH_PREFIX || "",
    }
}