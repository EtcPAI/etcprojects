# Client Hosting Kit

Everything needed to host client websites under a separate GitHub org + Vercel team,
keeping client work isolated from your personal projects.

## What's in here

| Folder | Purpose | Where it lives in production |
| --- | --- | --- |
| `client-template/` | Starter files copied into each new client repo: `vercel.json`, issue templates, CI, placeholder `index.html`, README skeleton. | Seed for `kelly-clients/<client-name>` repos. |
| `intake-form/` | A small static form + one serverless function (`api/submit.js`) that turns submissions into GitHub issues in the correct client repo. | Deployed once at e.g. `updates.yourdomain.com`. |
| `docs/client/` | Markdown to share with clients: how to request updates, a fill-in-the-blanks site guide. | Per-client repo `docs/` folder, or sent as PDF. |
| `docs/internal/` | Your runbooks: org/Vercel team setup checklist, per-client onboarding runbook, architecture notes. | Private — keep here or in an internal ops repo. |

## How to use the kit

1. Read `docs/internal/onboarding-checklist.md` and do the one-time browser
   setup (GitHub org, Vercel team, intake-form deploy).
2. Each time you take on a new client, follow `docs/internal/new-client-runbook.md`.
3. Send clients the contents of `docs/client/` (customised) and the intake-form URL.

## Why this layout

- **Separate org / team** keeps client billing, access, and domains from mixing with
  your existing projects (`etcprojects`).
- **Self-hosted intake form** (vs. Tally / Typeform) costs nothing, you control the
  data, and submissions go straight to the right repo's Issues.
- **GitHub issue templates** mean technical clients can still file directly through
  GitHub if they prefer.
