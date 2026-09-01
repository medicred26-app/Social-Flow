# SocialFlow

Multi-platform social scheduler. Next.js UI + Supabase Auth/Postgres. No mock login, no fake publish IDs, no stored media files.

## What is real

- Email (and optional Google) sign-in via Supabase Auth
- Connected accounts via OAuth (Facebook Page, Instagram Business, LinkedIn, X, YouTube)
- Encrypted token storage (AES-256-GCM)
- Compose, schedule, and publish captions
- A 30s scheduler that publishes due posts
- Photos and videos are uploaded from the device into Supabase Storage (`post-media`)

## Setup

1. Copy `env.example` to `frontend/.env.local` and fill in values.
2. The linked Supabase project is `kettuzklxorjkydoqcqr`. Add `SUPABASE_SERVICE_ROLE_KEY` from the Supabase dashboard (Project Settings → API).
3. In Supabase Auth:
   - Enable Email provider
   - Optional: enable Google and add the same redirect `http://localhost:4000/auth/callback`
4. Add developer app credentials for each platform you want to connect.
5. Register these OAuth redirects on each developer portal:

```
http://localhost:4000/api/oauth/facebook/callback
http://localhost:4000/api/oauth/instagram/callback
http://localhost:4000/api/oauth/linkedin/callback
http://localhost:4000/api/oauth/x/callback
http://localhost:4000/api/oauth/youtube/callback
```

6. Install and run:

```bash
npm --prefix frontend install
npm --prefix frontend run dev
```

Open http://localhost:4000

## Publish rules

- Facebook, LinkedIn, and X can publish caption-only
- Instagram and YouTube fail unless you upload a file from your device
- Missing tokens fail. The app never invents a platform post ID
