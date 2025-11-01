export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["android-chrome-192x192.png","android-chrome-512x512.png","app.css","apple-touch-icon.png","document.css","favicon-16x16.png","favicon-32x32.png","favicon.ico","morpho.png","site.webmanifest"]),
	mimeTypes: {".png":"image/png",".css":"text/css",".webmanifest":"application/manifest+json"},
	_: {
		client: {start:"_app/immutable/entry/start.Dd-QliCw.js",app:"_app/immutable/entry/app.BAS3NKNp.js",imports:["_app/immutable/entry/start.Dd-QliCw.js","_app/immutable/chunks/ClpmLFKC.js","_app/immutable/chunks/CFjQe0dZ.js","_app/immutable/chunks/CYDE4SrB.js","_app/immutable/entry/app.BAS3NKNp.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/CFjQe0dZ.js","_app/immutable/chunks/IHki7fMi.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js')),
			__memo(() => import('./nodes/17.js')),
			__memo(() => import('./nodes/18.js')),
			__memo(() => import('./nodes/19.js')),
			__memo(() => import('./nodes/20.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/auth/admin",
				pattern: /^\/auth\/admin\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/auth/admin/document/new",
				pattern: /^\/auth\/admin\/document\/new\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/auth/admin/document/[slug]",
				pattern: /^\/auth\/admin\/document\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/auth/admin/images",
				pattern: /^\/auth\/admin\/images\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/auth/admin/images/_server.ts.js'))
			},
			{
				id: "/auth/admin/project/new",
				pattern: /^\/auth\/admin\/project\/new\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/auth/admin/project/new/presign",
				pattern: /^\/auth\/admin\/project\/new\/presign\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/auth/admin/project/new/presign/_server.ts.js'))
			},
			{
				id: "/auth/admin/project/[id]",
				pattern: /^\/auth\/admin\/project\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/auth/forgot_password",
				pattern: /^\/auth\/forgot_password\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/auth/login",
				pattern: /^\/auth\/login\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/auth/logout",
				pattern: /^\/auth\/logout\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/auth/reset_password",
				pattern: /^\/auth\/reset_password\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/material/[slug]",
				pattern: /^\/material\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/[project_name]",
				pattern: /^\/([^/]+?)\/?$/,
				params: [{"name":"project_name","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/[project_name]/about",
				pattern: /^\/([^/]+?)\/about\/?$/,
				params: [{"name":"project_name","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/[project_name]/configure",
				pattern: /^\/([^/]+?)\/configure\/?$/,
				params: [{"name":"project_name","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

export const prerendered = new Set([]);

export const base = "";