export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16')
];

export const server_loads = [3,2];

export const dictionary = {
		"/": [~4],
		"/auth/admin": [~7,[3]],
		"/auth/admin/document/new": [~9,[3]],
		"/auth/admin/document/[slug]": [~8,[3]],
		"/auth/admin/project/new": [~11,[3]],
		"/auth/admin/project/[id]": [~10,[3]],
		"/auth/forgot_password": [~12],
		"/auth/login": [~13],
		"/auth/logout": [~14],
		"/auth/reset_password": [~15],
		"/material/[slug]": [~16],
		"/[project_name]": [~5,[2]],
		"/[project_name]/about": [~6,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.svelte';