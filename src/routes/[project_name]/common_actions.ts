import type { Actions } from "@sveltejs/kit";

export const common_actions = {
    logout: async ({cookies}) => {
        cookies.delete("jwt", {path: "/"});
    }
} satisfies Actions;