// @ts-nocheck
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = ({cookies}: Parameters<PageServerLoad>[0]) => {
    cookies.delete("jwt", {path: "/", secure: true, httpOnly: true})
    return redirect(308, "/")
}