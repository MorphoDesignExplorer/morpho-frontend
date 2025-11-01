
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/auth" | "/auth/admin" | "/auth/admin/document" | "/auth/admin/document/new" | "/auth/admin/document/[slug]" | "/auth/admin/images" | "/auth/admin/project" | "/auth/admin/project/new" | "/auth/admin/project/new/presign" | "/auth/admin/project/[id]" | "/auth/forgot_password" | "/auth/login" | "/auth/logout" | "/auth/reset_password" | "/material" | "/material/[slug]" | "/[project_name]" | "/[project_name]/about";
		RouteParams(): {
			"/auth/admin/document/[slug]": { slug: string };
			"/auth/admin/project/[id]": { id: string };
			"/material/[slug]": { slug: string };
			"/[project_name]": { project_name: string };
			"/[project_name]/about": { project_name: string }
		};
		LayoutParams(): {
			"/": { slug?: string; id?: string; project_name?: string };
			"/auth": { slug?: string; id?: string };
			"/auth/admin": { slug?: string; id?: string };
			"/auth/admin/document": { slug?: string };
			"/auth/admin/document/new": Record<string, never>;
			"/auth/admin/document/[slug]": { slug: string };
			"/auth/admin/images": Record<string, never>;
			"/auth/admin/project": { id?: string };
			"/auth/admin/project/new": Record<string, never>;
			"/auth/admin/project/new/presign": Record<string, never>;
			"/auth/admin/project/[id]": { id: string };
			"/auth/forgot_password": Record<string, never>;
			"/auth/login": Record<string, never>;
			"/auth/logout": Record<string, never>;
			"/auth/reset_password": Record<string, never>;
			"/material": { slug?: string };
			"/material/[slug]": { slug: string };
			"/[project_name]": { project_name: string };
			"/[project_name]/about": { project_name: string }
		};
		Pathname(): "/" | "/auth" | "/auth/" | "/auth/admin" | "/auth/admin/" | "/auth/admin/document" | "/auth/admin/document/" | "/auth/admin/document/new" | "/auth/admin/document/new/" | `/auth/admin/document/${string}` & {} | `/auth/admin/document/${string}/` & {} | "/auth/admin/images" | "/auth/admin/images/" | "/auth/admin/project" | "/auth/admin/project/" | "/auth/admin/project/new" | "/auth/admin/project/new/" | "/auth/admin/project/new/presign" | "/auth/admin/project/new/presign/" | `/auth/admin/project/${string}` & {} | `/auth/admin/project/${string}/` & {} | "/auth/forgot_password" | "/auth/forgot_password/" | "/auth/login" | "/auth/login/" | "/auth/logout" | "/auth/logout/" | "/auth/reset_password" | "/auth/reset_password/" | "/material" | "/material/" | `/material/${string}` & {} | `/material/${string}/` & {} | `/${string}` & {} | `/${string}/` & {} | `/${string}/about` & {} | `/${string}/about/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/android-chrome-192x192.png" | "/android-chrome-512x512.png" | "/app.css" | "/apple-touch-icon.png" | "/document.css" | "/favicon-16x16.png" | "/favicon-32x32.png" | "/favicon.ico" | "/morpho.png" | "/site.webmanifest" | string & {};
	}
}