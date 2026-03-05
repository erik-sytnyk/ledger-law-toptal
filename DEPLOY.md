# LedgerLaw.ai — Vercel Deployment

## Quick Deploy

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import `erik-sytnyk/ledger-law-toptal` from GitHub
3. Vercel auto-detects Vite. Click **Deploy**
4. Preview URL: `https://ledger-law-toptal-*.vercel.app`

## Build Settings (auto-detected)

| Setting | Value |
|---------|-------|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

## Custom Domain (ledgerlaw.ai)

1. Project → **Settings** → **Domains**
2. Add `ledgerlaw.ai`
3. Add CNAME record: `ledgerlaw.ai` → `cname.vercel-dns.com`
4. Vercel provisions SSL automatically

## SPA Routing

`vercel.json` rewrites routes to `index.html` (SPA) except `/api/*` which goes to serverless functions.

---

## Day 2: Supabase & Clerk Setup

### Supabase

1. Create project at [supabase.com](https://supabase.com)
2. SQL Editor → run `supabase/migrations/001_initial_schema.sql`
3. Settings → API → copy URL and Publishable key
4. Add to `.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

### Clerk

See **[CLERK_SETUP.md](./CLERK_SETUP.md)** for step-by-step setup.

**Summary:** Create app at [clerk.com](https://clerk.com) → copy Publishable key → add to `.env` as `VITE_CLERK_PUBLISHABLE_KEY` → add redirect URLs.

**Note:** Without `VITE_CLERK_PUBLISHABLE_KEY`, the app runs without auth (demo mode).

---

## Day 3: Backend & AI

### Anthropic API

1. Get API key at [console.anthropic.com](https://console.anthropic.com)
2. Add to **Vercel** → Project → Settings → Environment Variables:
   - `ANTHROPIC_API_KEY` (server-side only; never expose to browser)

### Local API Testing

`npm run dev` serves both frontend and API (via Vite plugin that handles `/api/*` routes).

Ensure `ANTHROPIC_API_KEY` is set in `.env`, then:

```bash
npm run dev
```

Open `http://localhost:5173` — everything works locally.

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|--------------|
| `/api/generate-demand` | POST | Generate demand letter via Claude Sonnet 4 |

Rate limit: 100 requests per 15 minutes per IP.

---

## Verification

See **[VERIFY.md](./VERIFY.md)** for local and deploy checklists.
