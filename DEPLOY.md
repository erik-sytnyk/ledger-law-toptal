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

`vercel.json` rewrites all routes to `index.html` so React Router works on direct links and refresh.
