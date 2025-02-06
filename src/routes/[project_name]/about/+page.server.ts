import type { PageServerLoad } from "./$types";
import {Parser, HtmlRenderer} from "commonmark";
import insane from "insane";
import { common_actions } from "../common_actions";
import { type Actions } from "@sveltejs/kit";

// TODO change localhost to backend
const SERVER_URL = "http://backend:8000" + process.env.API_PREFIX;
export const load: PageServerLoad = async ({params, parent}) => {
    const parent_data = await parent();

    const parser = new Parser();
    const renderer = new HtmlRenderer();
    return {
        html: insane( renderer.render(parser.parse(parent_data.metadata.description.text)) )
    };
}

export const actions = {
    ...common_actions
} as Actions;