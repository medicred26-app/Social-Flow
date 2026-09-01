# Coworker handoff

This branch replaces the mock app with a real Supabase stack. The code is ready. You need to add credentials and prove one live post.

Do **not** commit `frontend/.env.local`.

## 1. Local env

1. Copy `env.example` to `frontend/.env.local`.
2. From [Supabase API settings](https://supabase.com/dashboard/project/kettuzklxorjkydoqcqr/settings/api) set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (service_role — needed for the scheduler)
3. Generate secrets:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use one value for `TOKEN_ENCRYPTION_KEY` (64 hex chars) and another for `CRON_SECRET`.

4. Set `NEXT_PUBLIC_APP_URL=http://localhost:4000` and `ENABLE_INLINE_SCHEDULER=true`.

## 2. Supabase Auth

In project [kettuzklxorjkydoqcqr](https://supabase.com/dashboard/project/kettuzklxorjkydoqcqr):

1. Enable the Email provider.
2. For local testing, turn **off** Confirm email, or confirm the inbox mail.
3. Optional Google login: enable Google and set redirect `http://localhost:4000/auth/callback`.
4. Schema and the `post-media` bucket are already applied on this project. If you use a new project, run `supabase/migrations/`.

## 3. Connect one live platform first

Pick **Facebook Page** or **LinkedIn**. Do not start Instagram / X / YouTube until one real post is live.

| Platform | Env vars | Callback to register |
| --- | --- | --- |
| Facebook Page | `META_APP_ID`, `META_APP_SECRET` | `http://localhost:4000/api/oauth/facebook/callback` |
| Instagram | same Meta app | `http://localhost:4000/api/oauth/instagram/callback` |
| LinkedIn | `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` | `http://localhost:4000/api/oauth/linkedin/callback` |
| X | `X_CLIENT_ID`, `X_CLIENT_SECRET` | `http://localhost:4000/api/oauth/x/callback` |
| YouTube | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | `http://localhost:4000/api/oauth/youtube/callback` |

## 4. Verify

```bash
npm --prefix frontend install
npm --prefix frontend run dev
```

1. Open http://localhost:4000 and create an account.
2. **Accounts** → connect the configured platform (real OAuth window).
3. **Compose** → upload a photo from the device if needed → **Publish immediately**.
4. Confirm the post exists on the real social account. A fake platform post ID is a bug.
5. Schedule a post 2 minutes out. The scheduler needs the service role key.

## Rules

- Tokens stay encrypted. Never log them or show them in the browser.
- Instagram and YouTube require an uploaded file.
- Facebook, LinkedIn, and X can publish caption-only.
- Older tables on this Supabase project (`users`, `jobs`, `applications`, `contact_messages`) still have RLS off. That is leftover from other work.
