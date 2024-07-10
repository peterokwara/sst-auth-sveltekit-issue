import type { Actions } from '../$types';
import { initiateLogin } from '$lib/server/auth-service';
import { redirect } from '@sveltejs/kit';

export const actions = {
	signIn: async ({ url }) => {
		const webUrl = `https://${url.host}`;

		console.log(webUrl, 'webUrl');
		const redirectUrl = await initiateLogin('google', webUrl);

		redirect(303, redirectUrl);
	}
} satisfies Actions;
