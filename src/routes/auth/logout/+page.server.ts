import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({cookies}) => {
    cookies.delete("jwt", {path: "/", secure: true, httpOnly: true})
    return redirect(308, "/")
}