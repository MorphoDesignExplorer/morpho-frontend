import { writable } from "svelte/store";

export const user_server_store = writable<{
    uname: string,
    secret: string,
    is_logged_in: boolean,
    is_verified: boolean
}>({uname: "", secret: "", is_logged_in: false, is_verified: false})
