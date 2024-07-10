import { Resource } from 'sst';

// URL to your SST Auth routes
const AUTH_URL = Resource?.AuthRouter?.url;

/**
 * Initiates the login process by returning the authorization URL
 * @param provider - The provider to use for authentication
 * @returns The URL where the user should redirect to
 */
export async function initiateLogin(provider: string, webUrl: string): Promise<string> {
	// Construct the redirect URI for the callback
	const redirectUri = `${webUrl}/api/auth/callback`;
	// Build the authorization URL with the specified provider
	const url = new URL(`${AUTH_URL}/${provider}/authorize`);
	// Set the necessary parameters for the authorization request
	url.searchParams.set('response_type', 'code');
	url.searchParams.set('redirect_uri', redirectUri);
	url.searchParams.set('client_id', Resource.GoogleClientId.value);
	url.searchParams.set('state', crypto.randomUUID());

	return url.toString();
}

/**
 * Handles the callback from the authorization server and exchanges the code for a token
 * @param code - The authorization code from the callback
 * @returns The access token
 */
export async function handleCallback(code: string, webUrl: string) {
	// Construct the request to exchange the authorization code for a token
	const response = await fetch(`${AUTH_URL}/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			redirect_uri: `${webUrl}/api/auth/callback`,
			client_id: Resource.GoogleClientId.value
		})
	});

	// Check if the response was successful
	if (!response.ok) {
		const error = await response.text();
		console.error(`Failed to exchange code for token: ${error}`);
		throw new Error('Failed to exchange code for token');
	}

	// Parse the response JSON to get the access token
	const data = await response.json();
	return data.access_token;
}
