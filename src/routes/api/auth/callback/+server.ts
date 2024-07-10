import { handleCallback } from '$lib/server/auth-service';
import { type RequestHandler } from '@sveltejs/kit';
import { error, redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	if (!code) {
		throw error(400, 'Authorization code not provided');
	}

	try {
		const webUrl = `https://${url.host}`;
		console.log(webUrl, 'webUrl');
		const accessToken = await handleCallback(code, webUrl);

		// Store the access token in a secure, HTTP-only cookie
		cookies.set('__session', accessToken, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 // 1 day
		});
	} catch (err) {
		throw error(500, 'Authentication failed');
	}

	// Redirect to a protected route or dashboard
	redirect(302, '/app/home');
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	cookies.delete('__session', { path: '/' });
	redirect(302, '/');
};
