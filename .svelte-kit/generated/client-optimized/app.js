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
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20')
];

export const server_loads = [3,2];

export const dictionary = {
		"/": [~7],
		"/auth/admin": [~11,[3]],
		"/auth/admin/document/new": [~13,[3]],
		"/auth/admin/document/[slug]": [~12,[3]],
		"/auth/admin/project/new": [15,[3]],
		"/auth/admin/project/[id]": [~14,[3]],
		"/auth/forgot_password": [~16,[4]],
		"/auth/login": [~17,[5]],
		"/auth/logout": [~18],
		"/auth/reset_password": [~19,[6]],
		"/material/[slug]": [~20],
		"/[project_name]": [~8,[2]],
		"/[project_name]/about": [~9,[2]],
		"/[project_name]/configure": [~10,[2]]
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