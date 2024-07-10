Tried replicating issue
- Main page uses `sveltekit` formactions: `src/routes/+page.server.ts`
- There is the `auth-service`: `src/lib/server/auth-service.ts`
- There is also a callback route: `src/routes/api/auth/callback/+server.ts`
- The `sst` setup: `sst.config.ts`