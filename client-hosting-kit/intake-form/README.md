# Intake Form

A small static page + one serverless function that turns client submissions
into GitHub issues in the correct client repo.

## How it works

1. Client visits `https://updates.yourdomain.com`.
2. Picks their site from the dropdown, fills in the request.
3. `public/index.html` POSTs to `/api/submit`.
4. `api/submit.js` looks up the repo from `CLIENT_REPOS`, calls the GitHub
   REST API with your `GITHUB_TOKEN`, and creates an issue.
5. Client sees a thank-you screen with a link to the issue (so they can
   follow along if they have a GitHub account — they don't need one).

## Deploy

This is a standalone Vercel project. Deploy it once to your clients' Vercel
team — separate from any client site.

### Environment variables (set in Vercel, not in this repo)

| Variable | Example | Notes |
| --- | --- | --- |
| `GITHUB_TOKEN` | `github_pat_...` | Fine-grained PAT. Scope: **only** the client repos. Permissions: `Issues: Read and write`. |
| `CLIENT_REPOS` | `{"krips":"kelly-clients/krips-site","acme":"kelly-clients/acme-site"}` | JSON map: dropdown value → `owner/repo`. Add a new entry per client. |
| `ALLOWED_ORIGIN` | `https://updates.yourdomain.com` | CORS allow-list for the form. |

### One-time setup

```bash
cd intake-form
npm install            # only needed for local dev (vercel CLI)
vercel link            # link to a NEW Vercel project under your clients' team
vercel env add GITHUB_TOKEN production
vercel env add CLIENT_REPOS production
vercel env add ALLOWED_ORIGIN production
vercel --prod
```

### Adding a new client to the form

1. Add an entry to `CLIENT_REPOS` in Vercel env vars:
   `{"krips":"kelly-clients/krips-site","newclient":"kelly-clients/newclient-site"}`
2. Add a `<option>` to the `<select name="client">` in `public/index.html`.
3. Push — Vercel redeploys automatically.

## Spam protection

The form includes a honeypot field (`website_url`) that real users won't fill
in. Bots that auto-fill all fields will be rejected silently. If spam becomes
a problem, add Cloudflare Turnstile (free, no PII).
