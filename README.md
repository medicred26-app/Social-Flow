# SocialFlow

Multi-platform social scheduler with a **separated frontend and backend**.

| Layer | Stack | Port |
|-------|-------|------|
| **Frontend** | Next.js 16 (UI + Supabase Auth session) | 4000 |
| **Backend** | NestJS (API, OAuth, publish, scheduler) | 3001 |
| **Database** | Supabase Postgres + Storage | — |

## Architecture

```
Browser → Next.js (4000) ──Bearer JWT──► NestJS API (3001) ──► Supabase
                │                              │
                └── Supabase Auth              └── Platform APIs (Meta, LinkedIn, X, YouTube)
```

- **Frontend**: pages, auth UX, media upload to Supabase Storage
- **Backend**: posts, accounts, OAuth, encrypted tokens, publishing, cron scheduler
- **No mock login**, **no fake publish IDs**

## Setup

1. Copy env templates:
   - `frontend/.env.local` ← frontend section in `env.example`
   - `backend/.env` ← backend section in `env.example`
2. Fill Supabase URL, anon key, and **service role key** in `backend/.env`.
3. In Supabase Auth: enable Email; optional Google with redirect `http://localhost:4000/auth/callback`.
4. Add platform developer app credentials in `backend/.env`.
5. Register OAuth callbacks on each developer portal:

```
http://localhost:3001/api/oauth/facebook/callback
http://localhost:3001/api/oauth/instagram/callback
http://localhost:3001/api/oauth/linkedin/callback
http://localhost:3001/api/oauth/x/callback
http://localhost:3001/api/oauth/youtube/callback
```

6. Install and run both apps:

```bash
npm install
npm --prefix frontend install
npm --prefix backend install
npm run dev
```

Open http://localhost:4000

## API endpoints (NestJS)

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/accounts` | Bearer JWT |
| DELETE | `/api/accounts/:id` | Bearer JWT |
| GET | `/api/posts` | Bearer JWT |
| POST | `/api/posts` | Bearer JWT |
| DELETE | `/api/posts/:id` | Bearer JWT |
| POST | `/api/oauth/:platform/start` | Bearer JWT |
| GET | `/api/oauth/:platform/callback` | OAuth cookies |
| POST | `/api/jobs/publish-due` | Bearer CRON_SECRET |
| GET | `/api/settings/status` | Bearer JWT |

## Publish rules

- Facebook, LinkedIn, and X: caption-only OK
- Instagram and YouTube: require a device upload (stored in Supabase Storage)
- Missing tokens fail; the app never invents a platform post ID
