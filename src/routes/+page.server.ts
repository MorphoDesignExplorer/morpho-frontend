import type { Project } from "$lib/types";
import type { PageServerLoad } from "./$types"
import { BuildServerURL } from "$lib/common";
import { GetDocumentTree } from "$lib/document";
import type { Document } from "$lib/types";

let SERVER_URL = BuildServerURL();

export const load: PageServerLoad = async () => {
    let result: {projects: Project[], documents: {[k:string]: Document[]}} = {
        projects: [],
        documents: await GetDocumentTree()
    };

    result.projects = await (
        (await fetch(`${SERVER_URL}/project/`)).json()
    )

    return {
        ...result,
        prefix: process.env.SUBPATH_PREFIX || "",
    }
}
