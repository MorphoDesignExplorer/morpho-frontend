import type { LayoutServerLoad } from "./$types";
import type { Project, Document, UserDetails } from '$lib/types';
import { redirect } from "@sveltejs/kit";
import { GetDocuments, GetProjects, GetUserPermissions } from "$lib/database_get";
import { Option as O } from "effect"
import { UserCanEditDocuments, UserEditableProjects } from "$lib/user";

export const load: LayoutServerLoad = async ({ locals, setHeaders }) => {
    // don't cache anything under this route
    setHeaders({
        "cache-control": "no-cache"
    })

    return O.match(
        locals.user as O.Option<UserDetails>,
        {
            async onNone() {
                return redirect(301, "/auth/login");
            },
            async onSome(user) {
                let projectData: Project[] = await GetProjects(O.none(), false);
                let documentData: Document[] = await GetDocuments();

                return {
                    projects: UserEditableProjects(user, projectData),
                    documents: UserCanEditDocuments(user) ? documentData : [],
                    user: user
                }
            }
        }
    )
}
