import type { Project } from "$lib/types";
import type { PageServerLoad } from "./$types"
import { GetProjects, GetDocumentTree } from "$lib/database"
import type { Document } from "$lib/types";

export const load: PageServerLoad = async () => {
    let result: { projects: Project[], documents: { [k: string]: Document[] } } = {
        projects: [],
        documents: await GetDocumentTree()
    };

    result.projects = await GetProjects({ _tag: "None" });

    return {
        ...result,
        prefix: process.env.SUBPATH_PREFIX || "",
    }
}
