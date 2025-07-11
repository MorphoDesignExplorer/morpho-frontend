import type { PageServerLoad } from "./$types";
import { BuildServerURL } from '$lib/common';
import { type Project, type Document } from '$lib/types';

export const load: PageServerLoad = async ({cookies}) => {
    let projectData: Project[] = await (await fetch(`${BuildServerURL()}/project/`)).json()
    let documentData: Document[] = await (await fetch(`${BuildServerURL()}/document/`)).json()

    return {
        projects: projectData,
        documents: documentData,
    }
}