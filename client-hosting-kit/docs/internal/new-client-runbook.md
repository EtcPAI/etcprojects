# New Client Runbook

Every time you take on a new client, do these steps. ~10 minutes total.

> **Example used below:** new client is "Acme Co." → slug `acme`, repo `acme-site`.
> Replace `acme` / `acme-site` with the actual short name everywhere.

---

## 1. Create the GitHub repo (1 min)

1. Go to https://github.com/organizations/etcp-clients/repositories/new
2. Repository name: **`acme-site`** (lowercase, hyphens, no spaces).
3. Visibility: **Private**.
4. Do not initialize anything.
5. Create.

---

## 2. Seed the repo from the template (2 min)

On your computer:

```powershell
cd C:\Users\kagus\Code\etcp-clients
gh repo clone etcp-clients/acme-site
cd acme-site

# Copy the template files in:
xcopy /E /I "C:\Users\kagus\Code\etcp-clients\_kit\client-template\*" .
xcopy /E /I "C:\Users\kagus\Code\etcp-clients\_kit\client-template\.github" .github
copy "C:\Users\kagus\Code\etcp-clients\_kit\client-template\.gitignore" .

# Replace placeholders in README and index.html
# (Open in editor, swap {{CLIENT_NAME}}, {{DOMAIN}}, {{YOUR_DOMAIN}}, {{VERCEL_PROJECT_URL}})

git add .
git commit -m "Initial site from template"
git push
```

The repo now has: `index.html`, `vercel.json`, issue templates, CI workflow.

---

## 3. Create the Vercel project (2 min)

1. https://vercel.com/new → pick **etcp-clients** team.
2. Import `etcp-clients/acme-site`.
3. Framework preset: **Other**.
4. Deploy.
5. After deploy: **Settings → Domains** → add `acme.com` (or whatever).
   Update DNS at the registrar as Vercel instructs.

---

## 4. Wire the intake form to this client (1 min)

1. Go to your Vercel **intake-form** project → **Settings → Environment Variables**.
2. Edit `CLIENT_REPOS`. Add `acme` to the JSON:

   ```json
   {"krips":"etcp-clients/krips-site","advocis":"etcp-clients/advocis-site","acme":"etcp-clients/acme-site"}
   ```

3. Redeploy the intake form (Deployments tab → menu on latest → Redeploy).

---

## 5. Add the client to the form's dropdown (1 min)

In your local `C:\Users\kagus\Code\etcp-clients\intake-form\public\index.html`,
find the `<select id="client">` block and add:

```html
<option value="acme">Acme Co.</option>
```

Commit + push. Vercel redeploys automatically.

---

## 6. Send the client their welcome packet (3 min)

Send them:
- The URL of their live site (once it's up): `https://acme.com`
- The intake form URL: `https://updates.yourdomain.com`
- The two client-facing docs from `_kit/docs/client/`:
  - `how-to-request-updates.md` (general)
  - `your-site-guide.md` (filled in for them — pages, sections, what's editable)

They never log into anything. They bookmark the form URL. That's it.

---

## You're done

The client can now submit update requests, which auto-file as issues in
`etcp-clients/acme-site`, which GitHub emails you about, which you triage
in your normal workflow.
