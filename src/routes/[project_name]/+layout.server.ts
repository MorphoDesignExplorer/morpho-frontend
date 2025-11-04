import type { PageServerLoad } from "../$types";
import type { Metadata, Project } from "$lib/types";
import { GetProjects } from "$lib/database";
import { Option as O } from "effect";

export const load: PageServerLoad = async ({ params }) => {
    let result: {
        projects: Project[];
        metadata: Metadata;
        prefix: string;
    } = {
        projects: [],
        metadata: {
            captions: [],
            human_name: "",
            description: { slug: "", text: "" },
        },
        prefix: process.env.SUBPATH_PREFIX || "",
    };

    result.projects = await GetProjects(O.none());

    result.metadata = result.projects.filter(
        (item) => item.project_name == params.project_name,
    )[0].metadata;

    return result;
};
