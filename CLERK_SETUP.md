# Clerk Setup — Step by Step

The app already has Clerk integrated. Follow these steps to enable auth.

---

## Step 1: Create Clerk Account & Application

1. Go to **[clerk.com](https://clerk.com)** and sign up (or log in)
2. Click **Create application**
3. Choose **Email** (and optionally **Google** or other providers)
4. Click **Create application**
5. Wait for the app to be created — you’ll land in the Clerk Dashboard

---

## Step 2: Get Your Keys

1. In the left sidebar, go to **API Keys**
2. You’ll see:
   - **Publishable key** — starts with `pk_test_` (development) or `pk_live_` (production)
   - **Secret key** — keep this private, never in frontend code
3. Copy the **Publishable key** (`pk_test_...`)

---

## Step 3: Add Key to `.env`

1. Open `.env` in the project root
2. Uncomment or add:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. Replace `pk_test_xxx` with your actual key
4. Save the file

---

## Step 4: Component Paths (Optional — Already in Code)

The app configures paths **in code** (recommended by Clerk):

- Sign-in: `/sign-in`
- Sign-up: `/sign-up`
- After sign-in/up: `/`
- After sign-out: `/`

**In the Dashboard:** You can leave "Component paths" and "Account Portal → Redirects" as-is — the code overrides them.

**Note:** There is no separate "Allowed redirect URLs" in the current Clerk Dashboard. For development, `localhost` is allowed by default. For production, add your domain in **Configure → Domains**.

---

## Step 5: Restart Dev Server

1. Stop the dev server (Ctrl+C)
2. Run `npm run dev`
3. Open `http://localhost:5173`

---

## Step 6: Test

1. You should be redirected to `/sign-in` if not signed in
2. Click **Sign up** to create a test account
3. After sign-up, you should land on the main app with **UserButton** in the sidebar
4. Sign out and sign in again to confirm

---

## Optional: Customize Sign-in/Sign-up

- **Clerk Dashboard** → **User & Authentication** → **Email, Phone, Username** — choose which identifiers to use
- **Customization** → **Theme** — match your app colors
- **Social connections** — add Google, GitHub, etc. under **User & Authentication** → **Social connections**

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Invalid publishable key" | Check `.env` has correct `VITE_CLERK_PUBLISHABLE_KEY`, restart dev server |
| Redirect loop | Add `http://localhost:5173` to allowed redirect URLs |
| App shows without auth | Key missing or wrong — app falls back to demo mode |
| CORS errors | Ensure your domain is in Clerk’s allowed origins |
