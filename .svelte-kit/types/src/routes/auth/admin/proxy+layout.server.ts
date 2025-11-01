// @ts-nocheck
import type { LayoutServerLoad } from "./$types";
import { type Project, type Document } from '$lib/types';
import { verifyToken } from '$lib/auth';
import { redirect } from "@sveltejs/kit";
import { GetDocuments, GetProjects } from "$lib/database";

export const load = async ({cookies, setHeaders}: Parameters<LayoutServerLoad>[0]) => {
    setHeaders({
        "cache-control": "no-cache"
    })

    let [_, ok] = await verifyToken(cookies.get("jwt") || "");
    if (!ok) {
        return redirect(301, "/auth/login/")
    }

    let projectData: Project[] = await GetProjects({_tag: "None"});
    let documentData: Document[] = await GetDocuments();

    return {
        projects: projectData,
        documents: documentData,
    }
}
