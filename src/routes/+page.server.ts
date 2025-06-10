import type { Project } from "$lib/types";
import type { PageServerLoad } from "./$types"
import { BuildServerURL } from "$lib/common";

// TODO switch localhost to backend
let SERVER_URL = BuildServerURL();

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
