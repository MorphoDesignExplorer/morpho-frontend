import { error } from '@sveltejs/kit';
import { createClient  } from 'redis';

let redis_client = null;

let SERVER_URL = "http://backend:8000" + process.env.API_PREFIX;

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    if (redis_client === null) {
        redis_client = createClient({
            url: "redis://redis:6379"
        });
        await redis_client.connect();
        redis_client.on('error', err => console.error('[REDIS]', err.message));
    }

    let aggregated_data = {
        project_name: params.project_name,
        project_data: {},
        models: [],
        all_project_names: []
    };

    let cached_project_data = await redis_client.get(params.project_name);
    if (cached_project_data != null) {
        console.log(`returning cached ${params.project_name}`);
        aggregated_data = JSON.parse(cached_project_data);
    } else {
        try {
            let projects = await (await fetch(`${SERVER_URL}/project/?format=json`)).json();
            let project_names = projects.map((project_object) => project_object.project_name);
            let project = await (await fetch(`${SERVER_URL}/project/${params.project_name}/?format=json`)).json();
            let models = await (await fetch(`${SERVER_URL}/project/${params.project_name}/model/?format=json`)).json();

            aggregated_data = {
                project_name: params.project_name,
                project_data: project,
                models: models,
                all_project_names: project_names
            };

            await redis_client.set(params.project_name, JSON.stringify(aggregated_data));
            console.log(`cached ${params.project_name}`);
        } catch (e) {
            console.log(e);
            error(404, "Project not found.");
        }
    }
    
    aggregated_data.project_data.assets = aggregated_data.project_data.assets
                                            .filter(asset => asset.mime_type.indexOf("image") > -1)
                                            .filter(asset => asset.mime_type.indexOf("jpeg") > -1);

    return {
        project: aggregated_data.project_data,
        models: aggregated_data.models,
        project_name: aggregated_data.project_name,
        project_names: aggregated_data.all_project_names,
        prefix: process.env.SUBPATH_PREFIX || ""
    };
};
