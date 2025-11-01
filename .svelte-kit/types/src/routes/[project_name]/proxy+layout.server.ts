// @ts-nocheck
import type { PageServerLoad } from "../$types";
import { type Authenticated } from "$lib/auth";
import type { Metadata, Project } from "$lib/types";
import { BuildServerURL } from "$lib/common";
import { GetProjects } from "$lib/database";

// TODO switch localhost to backend
const SERVER_URL = BuildServerURL();

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
    let result: {
        projects: Project[];
        metadata: Metadata;
        authentication_status: Authenticated;
        prefix: string;
    } = {
        projects: [],
        metadata: {
            captions: [],
            human_name: "",
            description: { slug: "", text: "" },
        },
        authentication_status: { status: "ANONYMOUS" },
        prefix: process.env.SUBPATH_PREFIX || "",
    };

    result.projects = await GetProjects({_tag: "None"});

    result.metadata = result.projects.filter(
        (item) => item.project_name == params.project_name,
    )[0].metadata;

    return result;
};
