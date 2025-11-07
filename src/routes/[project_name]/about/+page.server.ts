import type { PageServerLoad } from "./$types";
import {Parser, HtmlRenderer} from "commonmark";
import { type Actions } from "@sveltejs/kit";

export const load: PageServerLoad = async ({parent}) => {
    const parent_data = await parent();

    const parser = new Parser();
    const renderer = new HtmlRenderer();
    return {
        html: renderer.render(parser.parse(parent_data.metadata.description.text))
    };
}

