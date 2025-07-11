import type { LayoutServerLoad } from "./$types";
import { BuildServerURL } from '$lib/common';
import { type Project, type Document } from '$lib/types';
import { verifyToken } from '$lib/auth';
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({cookies, setHeaders}) => {
    setHeaders({
        "cache-control": "no-cache"
    })

    let [_, ok] = await verifyToken(cookies.get("jwt") || "");
    if (!ok) {
        return redirect(301, "/auth/login/")
    }

    let projectData: Project[] = await (await fetch(`${BuildServerURL()}/project/`)).json()
    let documentData: Document[] = await (await fetch(`${BuildServerURL()}/document/`)).json()

    return {
        projects: projectData,
        documents: documentData,
    }
}
