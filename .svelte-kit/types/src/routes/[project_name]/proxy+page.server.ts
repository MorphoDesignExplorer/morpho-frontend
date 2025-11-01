// @ts-nocheck
import { error, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { common_actions } from "./common_actions";
import { BuildServerURL } from "$lib/common";
import { GetModels } from "$lib/database";
import type { Model } from "$lib/types";

let SERVER_URL = BuildServerURL();

export const actions = {
    ...common_actions,
} satisfies Actions;

export const load = async ({ params, parent }: Parameters<PageServerLoad>[0]) => {
    const parent_data = await parent();

    let result = {
        project_name: params.project_name,
        project_data: parent_data.projects.filter(
            (item) => item.project_name === params.project_name,
        )[0],
        models: [] as Model[],
        all_project_names: parent_data.projects.map(
            (item) => item.project_name,
        ),
    };

    try {
        result.models = await GetModels(params.project_name);
    } catch (e) {
        console.log(e);
        error(404, "Project not found.");
    }

    return {
        project: result.project_data,
        models: result.models,
        project_name: result.project_name,
        authentication_status: parent_data.authentication_status,
        prefix: parent_data.prefix,
    };
};
