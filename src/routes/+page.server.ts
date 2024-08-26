import { setup_redis_client } from "$lib/cache";
import type { Project } from "$lib/types";
import type { PageServerLoad } from "./$types"

let SERVER_URL = "http://backend:8000" + process.env.API_PREFIX;

export const load: PageServerLoad = async () => {
    const redis_client =  await setup_redis_client();

    let result: {projects: Project[]} = {
        projects: [],
    };

    let cached_project_data = await redis_client.get("project_list");
    if (cached_project_data) {
        result.projects = JSON.parse(cached_project_data);
    } else {
        result.projects = await (
            (await fetch(`${SERVER_URL}/project/?format=json`)).json()
        )
        redis_client.set("project_list", JSON.stringify(result.projects));
    }

    return {
        ...result,
        prefix: process.env.SUBPATH_PREFIX || "",
    }
}