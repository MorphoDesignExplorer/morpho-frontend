import { createClient } from "redis";
import type { Project } from "./types";

export async function setup_redis_client() {
    const client = createClient({ url: "redis://redis:6379" });
    client.on('error', err => console.error('[REDIS]', err.message))
    await client.connect();
    return client;
}

export async function cache_project_list(projects: Project[]) {
    const client = await setup_redis_client();
    await client.set("project_list", JSON.stringify(projects));
}

export async function uncache_project_list() {
    const client = await setup_redis_client();
    await client.del("project_list");
}
