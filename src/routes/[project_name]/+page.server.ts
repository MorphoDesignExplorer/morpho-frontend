import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { common_actions } from './common_actions';
import {BuildServerURL} from '$lib/common';

// TODO switch localhost to backend
let SERVER_URL = BuildServerURL();

export const actions = {
    ...common_actions,
} satisfies Actions;

export const load: PageServerLoad = async ({params, cookies, parent}) => {
    const parent_data = await parent();

    let result = {
        project_name: params.project_name,
        project_data: parent_data.projects.filter(item => item.project_name === params.project_name)[0],
        models: [],
        all_project_names: parent_data.projects.map(item => item.project_name)
    }

    try {
        result.models = await (await fetch(`${SERVER_URL}/project/${params.project_name}/model/`)).json();
    } catch (e) {
        console.log(e);
        error(404, "Project not found.");
    }

    const allowed_mimes = ["image/jpeg", "image/png"]

    result.project_data.assets = result.project_data.assets.filter(asset => allowed_mimes.indexOf(asset.mime_type) > -1)

    return {
        project: result.project_data,
        models: result.models,
        project_name: result.project_name,
        authentication_status: parent_data.authentication_status,
        prefix: parent_data.prefix
    };
};
