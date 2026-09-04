# SocialFlow Frontend

Next.js UI for SocialFlow. The API lives in [Social-Flow-backend](https://github.com/medicred26-app/Social-Flow-backend).

```
Browser → this repo (port 4000) ── Bearer JWT ──► Social-Flow-backend (port 5000)
                │
                └── Supabase Auth + Storage
```

## Run

```bash
cp env.example .env.local
npm install
npm run dev
```

Open http://localhost:4000

## Connect to the backend

1. Clone and start [Social-Flow-backend](https://github.com/medicred26-app/Social-Flow-backend) on port 5000.
2. Use the **same Supabase project** in both repos.
3. Keep these paired:

| Frontend `.env.local` | Backend `.env` |
|-----------------------|----------------|
| `NEXT_PUBLIC_API_URL=http://localhost:5000/api` | `APP_URL=http://localhost:5000` |
| `NEXT_PUBLIC_APP_URL=http://localhost:4000` | `FRONTEND_URL=http://localhost:4000` |
| `NEXT_PUBLIC_SUPABASE_URL` | `SUPABASE_URL` (same value) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `SUPABASE_ANON_KEY` (same value) |

When you deploy, change `NEXT_PUBLIC_API_URL` to the live API URL and set the backend `FRONTEND_URL` to this site's URL.

## Render

`render.yaml` deploys this repo as **socialflow-web**. Deploy the API first from [Social-Flow-backend](https://github.com/medicred26-app/Social-Flow-backend), then set:

- `NEXT_PUBLIC_BACKEND_URL` = the API Render URL (no `/api`)
- `NEXT_PUBLIC_API_URL` = that same URL + `/api`
- the same Supabase public keys as the API
