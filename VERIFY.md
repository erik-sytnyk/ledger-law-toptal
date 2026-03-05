# LedgerLaw.ai — Verification Checklist

How to verify everything works locally and in production.

---

## Before You Start

### Local `.env`

Ensure `.env` contains (with real values):

```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
```

- **Without Clerk key:** app runs in demo mode (no auth, no sign-in).
- **Without Supabase key:** app works with mock data; DB features won't load when implemented.

---

## 1. Local Verification

### Run the app

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

### Checklist — Local

| Step | What to check | Pass? |
|------|---------------|-------|
| 1 | App loads, no console errors | ☐ |
| 2 | **With Clerk key:** Redirect to `/sign-in` when not signed in | ☐ |
| 3 | Sign up with email → lands on main app | ☐ |
| 4 | UserButton visible in sidebar, sign out works | ☐ |
| 5 | Sign in again → session persists | ☐ |
| 6 | Direct links work: `/cases`, `/intake`, `/colossus`, etc. | ☐ |
| 7 | Refresh on any route → no 404 | ☐ |
| 8 | **Without Clerk key:** App loads in demo mode, no auth | ☐ |

### Build locally (optional)

```bash
npm run build
npm run preview
```

Open `http://localhost:4173` — same checks as above.

---

## 2. Vercel Deployment Verification

### Add environment variables in Vercel

1. Vercel Dashboard → your project → **Settings** → **Environment Variables**
2. Add (for Production and Preview):

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_xxx` |
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_test_xxx` |

3. **Redeploy** after adding vars (Deployments → ⋮ → Redeploy).

### Clerk — Production domain

For production (e.g. `ledgerlaw.ai` or `*.vercel.app`):

1. Clerk Dashboard → **Configure** → **Paths** (or **Account Portal**)
2. Ensure development host / fallback includes your Vercel URL
3. For custom domain: **Configure** → **Domains** → add domain

### Checklist — Deploy

| Step | What to check | Pass? |
|------|---------------|-------|
| 1 | Build succeeds on Vercel | ☐ |
| 2 | Preview URL loads (e.g. `https://xxx.vercel.app`) | ☐ |
| 3 | SPA routing: `/cases` direct link works, refresh works | ☐ |
| 4 | **With Clerk key:** Sign-in/sign-up flow works on deploy URL | ☐ |
| 5 | UserButton, sign out, sign in work on deploy | ☐ |
| 6 | No CORS or redirect errors in console | ☐ |

---

## 3. Supabase (when DB is used)

Currently the app uses mock data. When you add Supabase queries:

- **Local:** Same project as in `.env`
- **Production:** Use same Supabase project; RLS and policies apply to both

To verify Supabase connection:

1. Supabase Dashboard → **Table Editor** → check `carriers` has seed data
2. When API calls are added, check Network tab for successful requests

---

## 4. API (Day 3)

**Local with API:** `npx vercel dev` (runs frontend + `/api` on port 3000)

**Vercel env:** Add `ANTHROPIC_API_KEY` (from [console.anthropic.com](https://console.anthropic.com))

**Test:** New Demand → Step 1–3 → Generate Demand → real AI output in Step 4

---

## 5. Quick Commands

```bash
# Local dev (frontend only)
npm run dev

# Local dev with API (frontend + /api)
npx vercel dev

# Local production build
npm run build && npm run preview

# Deploy (if using Vercel CLI)
vercel
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Blank page / white screen | Check console; often missing env vars or build error |
| Redirect loop on sign-in | Clerk paths; ensure `signInUrl`/`signUpUrl` match your routes |
| 404 on refresh (Vercel) | `vercel.json` rewrites should send `/(.*)` → `/index.html` |
| "Invalid publishable key" | Restart dev server after changing `.env` |
| Build fails | Run `npm run build` locally; fix any errors before pushing |
