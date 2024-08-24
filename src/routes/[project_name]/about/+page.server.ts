import type { PageServerLoad } from "./$types";
import type { Metadata } from "$lib/types";
import {Parser, HtmlRenderer} from "commonmark";
import insane from "insane";

const SERVER_URL = "http://backend:8000" + process.env.API_PREFIX;
export const load: PageServerLoad = async ({params, parent}) => {
    const parent_data = await parent();

    const parser = new Parser();
    const renderer = new HtmlRenderer();
    return {
        html: insane( renderer.render(parser.parse(parent_data.metadata.description.text)) )
    };
}