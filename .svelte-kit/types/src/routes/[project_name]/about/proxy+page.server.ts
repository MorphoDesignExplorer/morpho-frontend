// @ts-nocheck
import type { PageServerLoad } from "./$types";
import {Parser, HtmlRenderer} from "commonmark";
import { common_actions } from "../common_actions";
import { type Actions } from "@sveltejs/kit";

export const load = async ({parent}: Parameters<PageServerLoad>[0]) => {
    const parent_data = await parent();

    const parser = new Parser();
    const renderer = new HtmlRenderer();
    return {
        html: renderer.render(parser.parse(parent_data.metadata.description.text))
    };
}

export const actions = {
    ...common_actions
} as Actions;
