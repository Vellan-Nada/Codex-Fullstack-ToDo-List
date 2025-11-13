# TaskForge API (Railway Backend)

Express-based API that powers TaskForge authentication helpers, task CRUD, and Stripe billing flows. Designed to run on Railway with Supabase + Stripe integrations out of the box.

## Features

- Supabase JWT verification for every request (same project as the frontend)
- `/api/auth/profile` – returns the user plan, email, usage counts
- `/api/tasks` – full CRUD with per-plan task limits enforced server-side
- `/api/billing/plan` – updates profile plan (used after Stripe webhooks)
- `/api/billing/checkout` – creates a Stripe Checkout Session for upgrades
- Configurable free/premium task limits and table names via environment variables

## Project structure

```
backend/
├── src/
│   ├── app.js              # Express app wiring (helmet, cors, logging)
│   ├── server.js           # Entry point used by Railway / npm start
│   ├── config.js           # Loads env vars & exposes typed config
│   ├── routes/             # auth, tasks, billing routers mounted under /api
│   ├── middleware/         # Supabase bearer-token protection
│   ├── services/           # Supabase + Stripe helpers, profile/task logic
│   └── utils/plan.js       # Plan limit helpers shared across routes
├── package.json
├── .env.example
└── README.md
```

## Environment variables

Copy `.env.example` to `.env` (Railway > Variables as well):

- `PORT` – defaults to `4000`
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` – from your Supabase project
- `SUPABASE_JWT_SECRET` – optional, but useful if you later validate JWTs locally
- `SUPABASE_TASKS_TABLE` / `SUPABASE_PROFILES_TABLE` – override if you renamed tables
- `STRIPE_SECRET_KEY` – backend secret key (starts with `sk_`)
- `STRIPE_PRICE_ID` – recurring price ID for the premium plan
- `FRONTEND_URL` – allowed CORS origin + default success/cancel URLs
- `FREE_PLAN_LIMIT` / `PREMIUM_PLAN_LIMIT` – enforce task counts server-side

## Running locally

> Node couldn't run inside the current CLI session (WSL1). Run these commands in your own shell once Node 18+ is available.

```bash
cd backend
npm install
npm run dev
```

The API listens on `http://localhost:4000` by default. Point the frontend's `VITE_API_BASE_URL` to that URL for local development.

## Deploying to Railway

1. Push this repo to GitHub.
2. Create a new Railway service from the repository and set the environment variables listed above.
3. Railway runs `npm install` automatically and executes `npm start` by default. Ensure the service's HTTP port matches `PORT` (4000).
4. After deployment, Railway exposes a public URL (e.g., `https://taskforge-api.up.railway.app`). Use that value for `VITE_API_BASE_URL` on the frontend + Vercel.
5. Configure Stripe webhooks (e.g., `/webhooks/stripe`) when you're ready to automate plan upgrades. Until then, call `/api/billing/plan` manually after verifying payments.

## Database expectations

Create two tables in Supabase (SQL snippets):

```sql
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free',
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  notes text,
  status text not null default 'todo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Grant `service_role` full access; the API uses that key. RLS policies should permit only the owning user for future direct Supabase usage.

## Stripe integration notes

- Set `STRIPE_PRICE_ID` to the recurring price you configured in the Stripe dashboard.
- `/api/billing/checkout` returns both `checkoutUrl` and `sessionId`. The frontend will prefer `checkoutUrl` (universal redirect) but can fall back to `stripe.redirectToCheckout`.
- After Stripe confirms payment (webhook), call `upsertProfile(userId, { plan: 'premium' })`. There’s a placeholder `/api/billing/plan` route to help until webhooks are wired up.
