import { error, type Actions } from '@sveltejs/kit';
import { createClient } from 'redis';
import type { PageServerLoad } from './$types';

let SERVER_URL = "http://backend:8000" + process.env.API_PREFIX;

async function setup_redis_client() {
    const client = createClient({ url: "redis://redis:6379" });
    client.on('error', err => console.error('[REDIS]', err.message))
    await client.connect();
    return client;
}

export const actions = {
    logout: async ({cookies}) => {
        cookies.delete("jwt", {path: "/"});
    }
} satisfies Actions;

export const load: PageServerLoad = async ({params, cookies, parent}) => {
    const parent_data = await parent();
    const redis_client = await setup_redis_client();

    let result = {
        project_name: params.project_name,
        project_data: parent_data.projects.filter(item => item.project_name === params.project_name)[0],
        models: [],
        all_project_names: parent_data.projects.map(item => item.project_name)
    }

    let cached_project_data = await redis_client.get(params.project_name);
    if (cached_project_data != null) {
        console.log(`returning cached ${params.project_name}`);
        let cached_result: typeof result = JSON.parse(cached_project_data);
        result.models = cached_result.models;
    } else {
        try {
            result.models = await (await fetch(`${SERVER_URL}/project/${params.project_name}/model/?format=json`)).json();
            await redis_client.set(params.project_name, JSON.stringify(result));
            console.log(`cached ${params.project_name}`);
        } catch (e) {
            console.log(e);
            error(404, "Project not found.");
        }
    }

    result.project_data.assets = result.project_data.assets
                                    .filter(asset => asset.mime_type.indexOf("image") > -1)
                                    .filter(asset => asset.mime_type.indexOf("jpeg") > -1)

    return {
        project: result.project_data,
        models: result.models,
        project_name: result.project_name,
        authetication_status: parent_data.authetication_status,
        prefix: parent_data.prefix
    };
};
