# {{CLIENT_NAME}} — Website (internal repo)

> **This README is for internal use.** Clients don't see this file.
> Clients only ever see their live site and the update request form.

Production site for **{{CLIENT_NAME}}**, hosted on Vercel.

- **Live:** https://{{DOMAIN}}
- **Update form (what the client uses):** https://updates.{{YOUR_DOMAIN}}.com
- **Vercel project:** {{VERCEL_PROJECT_URL}}

## How updates flow in

1. Client submits the form at `updates.{{YOUR_DOMAIN}}.com`.
2. The form creates an Issue in this repo automatically.
3. You triage, make the change locally with Claude Code, commit, and push.
4. Vercel auto-deploys on push to `main`.

The client never visits this repo. They get a confirmation after submitting
and an email from you when the change is live.

## Local development

```bash
# Static site — open index.html directly, or:
npx serve .
```

Deploys are managed by Vercel. Domains and any environment variables are
configured in the Vercel project, not in this repo.

## Issue templates

Issue templates in `.github/ISSUE_TEMPLATE/` exist so the intake form's
serverless function has a consistent issue body to fill in (and so you can
manually file issues with the same shape when you spot something on the
client's behalf). They are not surfaced to the client.
