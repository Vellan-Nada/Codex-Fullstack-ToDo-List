# TaskForge Frontend

React + Vite client for the TaskForge to-do platform. It ships Supabase-ready authentication flows, task management UI with per-plan limits, and a Stripe upgrade entry point that will talk to your Railway backend.

## Stack

- React 18 + Vite 5
- React Router for routing
- Supabase JS client for auth (email/password + OAuth)
- Local storage fallback for tasks until the Railway API is available
- Stripe JS helper for checkout redirection

## Getting started

```bash
cd frontend
npm install
npm run dev
```

> **Note**: Node.js was unavailable inside the Codex CLI environment (WSL1). Run the commands above locally once Node 18+ is available.

## Environment variables

Copy `.env.example` to `.env` and fill in:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=https://your-railway-backend.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

- Supabase fields enable email/password + OAuth actions on the `/auth` page.
- `VITE_API_BASE_URL` powers all task CRUD + billing calls. When omitted, the UI falls back to a per-user localStorage store so you can interact with the dashboard without the backend.
- Stripe key allows `UpgradePage` to load Stripe.js and redirect users to Checkout. The backend must expose `/billing/checkout` which creates a Checkout Session and returns either `{ checkoutUrl }` or `{ sessionId }`.

## Key folders

- `src/context/AuthContext.jsx` - wraps the app with Supabase session state, exposes helpers for email + OAuth login, and hydrates the active plan.
- `src/hooks/useTasks.js` - encapsulates task CRUD, plan enforcement (4 vs 20 tasks), and graceful fallback to local storage when the backend isn't ready yet.
- `src/lib/apiClient.js` - centralizes API calls to your Railway backend plus the local fallback store used in development.
- `src/pages` - landing, auth, dashboard, and upgrade experiences tailored to the product brief.
- `src/components` - reusable UI building blocks (composer, task list, navbar, plan progress, etc.).

## Next steps

1. Finish the Railway backend: wire Supabase service key, expose `/tasks`, `/auth/profile`, `/billing/plan`, and `/billing/checkout` endpoints, and persist plan upgrades after Stripe webhooks fire.
2. Connect production Supabase + Stripe credentials locally, then test email/OAuth + upgrade flows end-to-end.
3. Deploy the frontend to Vercel with the same environment variables (prefixed with `VITE_`).
