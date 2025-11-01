import type { PageServerLoad } from "./$types";
import { type Project, type Document } from '$lib/types';
import { GetDocuments, GetProjects } from "$lib/database";

export const load: PageServerLoad = async () => {
    let projectData: Project[] = await GetProjects({_tag: "None"});
    let documentData: Document[] = await GetDocuments();

    return {
        projects: projectData,
        documents: documentData,
    }
}
