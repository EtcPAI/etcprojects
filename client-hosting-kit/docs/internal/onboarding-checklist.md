# One-Time Setup Checklist

Do these once, in order. Each step is browser-based unless marked otherwise.
After this, every new client takes ~10 minutes (see `new-client-runbook.md`).

---

## 1. Create the GitHub organization

1. Go to https://github.com/account/organizations/new
2. Choose **Free** plan.
3. Organization name: **`etcp-clients`**
4. Contact email: your email.
5. Belongs to: **My personal account**.
6. Finish setup. Skip "invite members" for now.

You now have https://github.com/etcp-clients.

---

## 2. Create a GitHub fine-grained PAT (the intake form uses this)

1. Go to https://github.com/settings/personal-access-tokens/new
2. Token name: **`intake-form-issue-writer`**
3. Expiration: **1 year** (calendar reminder to rotate).
4. Resource owner: **etcp-clients** (the new org).
5. Repository access: **All repositories** under `etcp-clients`.
6. Repository permissions:
   - **Issues: Read and write** ← required
   - Everything else: No access
7. Click **Generate token**. Copy it — you'll paste it into Vercel in step 5.
   Store a backup in your password manager. You can't view it again later.

---

## 3. Create the Vercel team

1. Go to https://vercel.com/teams/create
2. Team name: **`etcp-clients`** (matches the GitHub org).
3. Plan: **Pro** ($20/user/mo) — required for commercial/client work per Vercel's ToS.
4. Connect to GitHub: pick the **etcp-clients** org you just made.
5. Finish.

You now have https://vercel.com/etcp-clients.

---

## 4. Create the intake-form GitHub repo

Two ways:

**Easiest — in the browser:**
1. Go to https://github.com/organizations/etcp-clients/repositories/new
2. Repository name: **`intake-form`**
3. Visibility: **Private**
4. **Do not** initialize with README, .gitignore, or license.
5. Click Create.

**Then push the kit's intake-form folder up to it.** On your computer:

```powershell
cd C:\Users\kagus\Code\etcp-clients
gh repo clone etcp-clients/intake-form
# Copy these files from this kit into the new clone:
#   client-hosting-kit/intake-form/*  →  C:\Users\kagus\Code\etcp-clients\intake-form\
cd intake-form
git add .
git commit -m "Initial intake form"
git push
```

(If you'd rather, I can do this step for you in a future session — just say so.)

---

## 5. Deploy the intake form on Vercel

1. Go to https://vercel.com/new
2. Pick the **etcp-clients** team.
3. Import the `etcp-clients/intake-form` repo.
4. Framework preset: **Other** (it's a static site + one serverless function).
5. Root directory: leave as `./`
6. Output directory: **`public`**
7. **Don't deploy yet — first add environment variables:**

   | Name | Value |
   | --- | --- |
   | `GITHUB_TOKEN` | The PAT you copied in step 2 |
   | `CLIENT_REPOS` | `{}` (empty for now — we'll add clients later) |
   | `ALLOWED_ORIGIN` | The final form URL, e.g. `https://updates.etcpai.com` (you can change this after first deploy) |

8. Click Deploy.

You now have a working form at the auto-generated Vercel URL
(e.g. `intake-form-xxxx.vercel.app`). It will reject every client until you
add entries to `CLIENT_REPOS` — that's expected.

---

## 6. (Optional) Point a real domain at the form

1. In the Vercel project → **Settings → Domains**.
2. Add `updates.yourdomain.com`.
3. Vercel will show DNS records to add at your domain registrar.
4. After DNS propagates, update the Vercel env var `ALLOWED_ORIGIN` to
   `https://updates.yourdomain.com` and redeploy.

---

## You're done with one-time setup

From this point forward, onboarding a new client takes only the steps in
`new-client-runbook.md`.
