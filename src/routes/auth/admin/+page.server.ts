import type { PageServerLoad } from "./$types";
import { type Project, type Document } from '$lib/types';
import { GetDocuments, GetProjects } from "$lib/database_get";
import { Option as O } from "effect";

export const load: PageServerLoad = async () => {
    let projectData: Project[] = await GetProjects(O.none(), false);
    let documentData: Document[] = await GetDocuments();

    return {
        projects: projectData,
        documents: documentData,
    }
}
