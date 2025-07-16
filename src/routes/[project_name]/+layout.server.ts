import type { PageServerLoad } from "../$types";
import { type Authenticated } from "$lib/auth";
import type { Metadata, Project } from "$lib/types";
import { BuildServerURL } from "$lib/common";

// TODO switch localhost to backend
const SERVER_URL = BuildServerURL();

export const load: PageServerLoad = async ({ cookies, params }) => {
    let result: {
        projects: Project[];
        metadata: Metadata;
        authentication_status: Authenticated;
        prefix: string;
    } = {
        projects: [],
        metadata: {},
        authentication_status: { status: "ANONYMOUS" },
        prefix: process.env.SUBPATH_PREFIX || "",
    };

    result.projects = await (await fetch(`${SERVER_URL}/project/`)).json();

    result.metadata = result.projects.filter(
        (item) => item.project_name == params.project_name,
    )[0].metadata;

    return result;
};
