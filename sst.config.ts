/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: 'sst-auth-sveltekit-issue',
			removal: input?.stage === 'production' ? 'retain' : 'remove',
			home: 'aws'
		};
	},
	async run() {
		const secrets = {
			GoogleClientID: new sst.Secret('GoogleClientId'),
			GoogleClientSecret: new sst.Secret('GoogleClientSecret')
		};

		const auth = new sst.aws.Auth('Auth', {
			authenticator: {
				link: [secrets.GoogleClientID, secrets.GoogleClientSecret],
				handler: './functions/auth.handler',
				url: true
			}
		});

		const authRouter = new sst.aws.Router('AuthRouter', {
			routes: {
				'/*': auth.url.apply((url) => url)
			}
		});

		new sst.aws.SvelteKit('MyWeb', {
			link: [authRouter, secrets.GoogleClientID]
		});
	}
});
