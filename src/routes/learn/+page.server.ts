import type { Project } from "$lib/types";
import type { PageServerLoad } from "./$types"
import { BuildServerURL } from "$lib/common";
import { GetDocument } from "$lib/document";

let SERVER_URL = BuildServerURL();

export const load: PageServerLoad = async () => {
    let result: {projects: Project[], document: string} = {
        projects: [],
        document: await GetDocument("Learn"),
    };

    result.projects = await (
        (await fetch(`${SERVER_URL}/project/`)).json()
    )

    return {
        ...result,
        prefix: process.env.SUBPATH_PREFIX || "",
    }
}
