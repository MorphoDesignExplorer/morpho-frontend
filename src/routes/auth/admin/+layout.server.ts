import type { LayoutServerLoad } from "./$types";
import { type Project, type Document } from '$lib/types';
import { redirect } from "@sveltejs/kit";
import { GetDocuments, GetProjects } from "$lib/database_get";
import { Option as O } from "effect"

export const load: LayoutServerLoad = async ({ locals, setHeaders }) => {
    setHeaders({
        "cache-control": "no-cache"
    })

    if (O.isNone(locals.user)) {
        return redirect(301, "/auth/login");
    }

    let projectData: Project[] = await GetProjects(O.none(), false);
    let documentData: Document[] = await GetDocuments();

    return {
        projects: projectData,
        documents: documentData,
    }
}
