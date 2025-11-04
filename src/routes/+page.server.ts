import type { Project } from "$lib/types";
import type { PageServerLoad } from "./$types"
import { GetProjects, GetDocumentTree } from "$lib/database_get"
import type { Document } from "$lib/types";
import { Option as O } from "effect";

export const load: PageServerLoad = async () => {
    let result: { projects: Project[], documents: { [k: string]: Document[] } } = {
        projects: [],
        documents: await GetDocumentTree()
    };

    result.projects = await GetProjects(O.none());

    return {
        ...result,
        prefix: process.env.SUBPATH_PREFIX || "",
    }
}
