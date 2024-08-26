import type { Actions } from "@sveltejs/kit";
import { common_actions } from "./common_actions";

export const actions = {
    ...common_actions
} satisfies Actions;
