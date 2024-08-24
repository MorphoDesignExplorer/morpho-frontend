import { createClient, type RedisClientType } from "redis";
import type { PageServerLoad } from "../$types";
import { isAuthenticated, type Authenticated } from "$lib/auth";
import type { Metadata, Project } from "$lib/types";

const SERVER_URL = "http://backend:8000" + process.env.API_PREFIX;

async function setup_redis_client() {
    const client = createClient({ url: "redis://redis:6379" });
    client.on('error', err => console.error('[REDIS]', err.message))
    await client.connect();
    return client;
}

export const load: PageServerLoad = async ({cookies, params}) => {
    const redis_client =  await setup_redis_client();

    let result: {projects: Project[], metadata: Metadata, authetication_status: Authenticated, prefix: string} = {
        projects: [],
        metadata: await (await fetch(`${SERVER_URL}/project/${params.project_name}/metadata/`)).json(),
        authetication_status: await isAuthenticated(cookies),
        prefix: process.env.SUBPATH_PREFIX || ""
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

    return result;
}