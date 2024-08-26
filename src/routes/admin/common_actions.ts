import { redirect, type Actions } from "@sveltejs/kit";

export const common_actions = {
    logout: ({cookies}) => {
        cookies.delete("jwt", { path: "/"});
        redirect(301, "/");
    }
} satisfies Actions;
