# New Client Runbook

Every time you take on a new client, work through this in order. ~5 minutes total
(not counting the actual website deployment in step 7, which is its own job).

> **Example used below:** new client "Acme Co." → slug `acme`, repo `acme-site`.
> Replace `acme` everywhere with the real short name.

---

## Naming convention (locked, don't deviate)

| Use | Format | Example |
| --- | --- | --- |
| **Slug** (URL param + key in CLIENT_REPOS) | lowercase, hyphens, no spaces/underscores | `acme` |
| **GitHub repo name** | `<slug>-site` | `acme-site` |
| **Display name** (shown on the form via title-casing) | auto-derived | "Acme" |

If the business name has multiple words, hyphenate: `Acme Holdings` → `acme-holdings`.

---

## 1. GitHub + your computer (1 min)

In PowerShell, set the slug at the top of this script then paste the whole block:

```powershell
$slug = "acme"   # ← CHANGE THIS

$template = "C:\Users\kagus\Code\etcprojects\client-hosting-kit\client-template"
$baseDir = "C:\Users\kagus\Code\etcp-clients"
$repoName = "$slug-site"
$localPath = "$baseDir\$repoName"

gh repo create "etcp-clients/$repoName" --private --description "Website for $slug"

New-Item -Path $localPath -ItemType Directory -Force | Out-Null
Copy-Item -Path "$template\*" -Destination $localPath -Recurse -Force
Copy-Item -Path "$template\.gitignore" -Destination $localPath -Force
Copy-Item -Path "$template\.github" -Destination $localPath -Recurse -Force

Push-Location $localPath
git init -q
git branch -M main
git add .
git commit -q -m "Initial site from template"
git remote add origin "https://github.com/etcp-clients/$repoName.git"
git push -u origin main
Pop-Location

Write-Host "GitHub + local done for $repoName" -ForegroundColor Green
```

Result: private repo at `https://github.com/etcp-clients/<slug>-site` + local folder
at `C:\Users\kagus\Code\etcp-clients\<slug>-site\`.

---

## 2. Vercel: wire the intake form to the new client (2 min)

1. Go to **https://vercel.com/etc-pai/intake-form/settings/environment-variables**
2. Find `CLIENT_REPOS` → three-dot menu → **Edit**
3. Add a new key/value to the JSON. e.g. adding `acme`:
   - Before: `{"mountain-strong":"etcp-clients/mountain-strong-site", ...}`
   - After:  `{"mountain-strong":"etcp-clients/mountain-strong-site", ..., "acme":"etcp-clients/acme-site"}`
4. **Save**
5. Go to the **Deployments** tab → three-dot menu on the latest → **Redeploy**
   (keep "Use existing Build Cache" checked) → confirm.

Wait ~30 sec for the redeploy to finish.

---

## 3. Slack: subscribe `#clientweb` to the new repo (15 sec)

In the `#clientweb` channel, type:

```
/github subscribe etcp-clients/acme-site issues
```

You'll see a confirmation. The GitHub Slack app already has org-wide access — no
extra install step needed.

---

## 4. Update the master client list

Open `client-hosting-kit/docs/internal/clients.md` and add a row to the table for
this client. Don't skip this — it's the only place you track who's onboarded.

---

## 5. Test the URL end-to-end (CRITICAL — don't skip)

Before sending the URL to the client, verify it actually works:

1. Visit `https://clientweb.etcprojects.com/?c=<slug>` in a private/incognito window
2. Confirm the banner shows the right business name
3. Fill in a real test submission (use your own email; describe the test as a test)
4. Submit
5. Confirm:
   - The success message appears ("Thanks — we got it…")
   - A new issue appears at `https://github.com/etcp-clients/<slug>-site/issues`
   - A Slack notification arrives in `#clientweb`

If anything fails, fix it before step 6. Common cause: forgot to redeploy in step 2.

After confirming, close the test issue on GitHub (so it doesn't sit there forever).

---

## 6. Send the client their URL + docs (5 min)

Send the client an email with:

1. **Their unique URL:** `https://clientweb.etcprojects.com/?c=<slug>`
2. **A short version of the client docs** — paste relevant bits from
   `client-hosting-kit/docs/client/how-to-request-updates.md`, or attach as PDF.

Sample email:

> Subject: Your website request portal is ready
>
> Hi [Name],
>
> Whenever you need a change made to your website, use this link:
> **https://clientweb.etcprojects.com/?c=acme**
>
> Bookmark it. There's nothing to log into — just fill in what you'd like
> changed and submit. We respond within one business day.
>
> A few tips:
> - Use the URL of the page you want changed (paste the link, not just "the about page")
> - For text changes, paste the exact new wording
> - Click "Add another change" if you have more than one request
> - For images, upload to Google Drive / Dropbox first, then paste the share link
>
> Anything broken or urgent? Email hello@etcprojects.com directly.
>
> — Kelly

---

## 7. (Later) Deploy the client's actual website

Skip until you have actual site code in their repo. When the time comes:

### a. Confirm DNS access first
Before deploying, confirm one of these is true:
- The client has given you login access to their domain registrar, OR
- They've agreed to add a CNAME/A record you provide, OR
- They've transferred the domain to a registrar you control.

Don't deploy without a DNS plan or you'll be stuck.

### b. Build out the site in the local folder
Edit `C:\Users\kagus\Code\etcp-clients\<slug>-site\` with the real content,
commit, push.

### c. Create the Vercel project
1. **https://vercel.com/new** → team = **EtcPAI** (top-left)
2. Import `etcp-clients/<slug>-site`
3. Framework Preset: **Other** (or Next.js / etc. if you used one)
4. Output Directory: leave blank
5. Deploy

### d. Cutover plan (if they have an existing live site)
1. Deploy at the auto-generated Vercel URL first (e.g. `acme-site-xxx.vercel.app`)
2. Share preview URL with the client for sign-off
3. Once approved, in Vercel → **Settings → Domains** → add their domain
4. Update DNS at their registrar per Vercel's instructions
5. Old site goes dark at the same moment new site goes live — don't preview, don't delay

---

## Maintenance items to remember

- **GitHub token expires June 1, 2027.** Calendar reminder for mid-May 2027 to
  rotate: generate new fine-grained PAT (same scopes: Issues read/write on
  etcp-clients) → update `GITHUB_TOKEN` env var on Vercel → redeploy → revoke old.
- **Vercel Pro is per-user/month.** Adding teammates costs $20/each.
- **All client repos auto-share the Slack app's org-wide install.** Adding a new
  repo only needs the `/github subscribe` command.
