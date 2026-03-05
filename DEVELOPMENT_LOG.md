# LedgerLaw.ai — Development Log

Current stage: **Day 3 — Backend & AI**

---

## Day 1: Setup & Deploy

| # | Task | Status |
|---|------|--------|
| 1 | Init Vite + React | ✅ Done |
| 2 | Integrate JSX prototype | ✅ Done |
| 3 | Fix bugs (icons, colors) | ✅ Done |
| 4 | React Router | ✅ Done |
| 5 | Deploy to Vercel | ✅ Done |

## Day 2: Database & Auth

| # | Task | Status |
|---|------|--------|
| 1 | Supabase PostgreSQL schema | ✅ Done |
| 2 | Clerk Auth | ✅ Done |
| 3 | RBAC (profiles.role) | ✅ Schema ready |

## Day 3: Backend & AI

| # | Task | Status |
|---|------|--------|
| 1 | Express/API serverless (Vercel) | ✅ Done |
| 2 | Anthropic Claude integration | ✅ Done |
| 3 | Rate limiting (100 req/15min) | ✅ Done |
| 4 | New Demand → real API | ✅ Done |

---

## Changelog

### 2026-03-04 — Day 1 (partial)

**Added:**
- `package.json` — Vite 7 + React 19, name: ledger-law-ai
- `vite.config.js` — Vite config with React plugin
- `index.html` — Entry point, title: LedgerLaw.ai
- `src/main.jsx` — React root
- `src/App.jsx` — Re-export of LedgerLaw-ai-v2.jsx
- `src/index.css` — Minimal reset
- `src/assets/`, `public/` — From Vite template

**Fixed in LedgerLaw-ai-v2.jsx:**
- T.grn, T.pur, T.blu, T.grnDim, T.bluDim — Color aliases
- I.star, I.scl, I.warn — Missing icons
- Import simplified to `useState` only

**Result:** `npm run build` succeeds, 18 pages working

### 2026-03-04 — React Router

**Added:**
- `react-router-dom` — URL-based navigation
- Routes: `/`, `/cases`, `/intake`, `/new`, `/colossus`, `/objections`, `/casevalue`, `/chrono`, `/damages`, `/verdicts`, `/icd`, `/chat`, `/ediscovery`, `/contracts`, `/drafts`, `/users`, `/settings`
- `AppLayout` — uses `useNavigate`, `useLocation` for sidebar sync
- Catch-all `*` route → Dashboard

### 2026-03-04 — Vercel config

**Added:**
- `vercel.json` — SPA rewrites for React Router
- `DEPLOY.md` — Vercel deployment instructions

### 2026-03-04 — Day 2: Supabase & Clerk

**Added:**
- `supabase/migrations/001_initial_schema.sql` — profiles, carriers, cases, demands, documents, verdicts, RLS, seed carriers
- `@clerk/react` — auth with SignIn, SignUp, Show, RedirectToSignIn, UserButton
- `@supabase/supabase-js` — DB client
- `src/lib/supabase.js` — Supabase client (uses env vars)
- `src/App.jsx` — ClerkProvider, auth routes (/sign-in, /sign-up), ProtectedRoute, UserButton in sidebar
- `.env.example` — VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_CLERK_PUBLISHABLE_KEY

**Behavior:** Without `VITE_CLERK_PUBLISHABLE_KEY`, app runs in demo mode (no auth). With key, sign-in required.

### 2026-03-05 — Day 3: Backend & AI

**Added:**
- `api/generate-demand.js` — Vercel serverless function, Anthropic Claude Sonnet 4, rate limiting (100/15min)
- `src/lib/api.js` — Frontend API client
- New Demand page → real AI generation (case data from Step 1 → Claude → demand text in Step 4)
- `vercel.json` — Exclude `/api/*` from SPA rewrite
- `@anthropic-ai/sdk` — Anthropic API client

**Env:** `ANTHROPIC_API_KEY` in Vercel (server-side only). `VITE_API_URL` optional for local dev.

**Fix:** index.html title simplified to "LedgerLaw" — Vite import-analysis misparses "." in HTML (incl. comments) as JS. TODO: restore "LedgerLaw.ai" when Vite fixes or workaround found.
