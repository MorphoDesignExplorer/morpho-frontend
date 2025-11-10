import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export let actions = {
    default: async ({cookies}) => {
        cookies.delete("jwt", {path: "/", secure: true, httpOnly: true})
        return redirect(303, "/")
    }
} satisfies Actions
