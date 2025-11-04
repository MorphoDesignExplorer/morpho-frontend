import { error, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { common_actions } from "./common_actions";
import { GetModels } from "$lib/database_get";
import type { Model } from "$lib/types";

export const actions = {
    ...common_actions,
} satisfies Actions;

export const load: PageServerLoad = async ({ params, parent }) => {
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
        prefix: parent_data.prefix,
    };
};
