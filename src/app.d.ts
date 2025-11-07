// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { Option as O } from "effect";
import { Role } from "$lib/types";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: Option<{email: string, permissions: Role[]}>
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
