# Client Hosting Kit

Everything you need to host client websites under a dedicated GitHub org
(`etcp-clients`) and Vercel team (`etcp-clients`), kept fully separate from
your personal projects.

**Clients never touch GitHub.** They submit changes via a hosted form; you
get a GitHub issue automatically.

---

## What's in this kit

```
client-hosting-kit/
├── README.md                         ← you are here
├── client-template/                  ← copy into each new client repo
│   ├── README.md                     (internal-facing, with placeholders)
│   ├── index.html                    (placeholder site)
│   ├── vercel.json
│   ├── .gitignore
│   └── .github/
│       ├── ISSUE_TEMPLATE/           (used by the intake form)
│       └── workflows/ci.yml
├── intake-form/                      ← deploys once, serves all clients
│   ├── public/index.html             (the client-facing form)
│   ├── api/submit.js                 (creates a GitHub issue per submission)
│   ├── vercel.json
│   ├── package.json
│   └── README.md
└── docs/
    ├── client/                       ← share these with clients
    │   ├── how-to-request-updates.md
    │   └── your-site-guide.md        (fill in per client)
    └── internal/                     ← your runbooks (keep private)
        ├── local-setup.md            (one-time Windows folder setup)
        ├── onboarding-checklist.md   (one-time GitHub org + Vercel team)
        └── new-client-runbook.md     (~10 min per new client)
```

---

## Order to follow

1. **`docs/internal/local-setup.md`** — set up `C:\Users\kagus\Code\etcp-clients\`
   on your Windows machine.
2. **`docs/internal/onboarding-checklist.md`** — one-time browser setup
   (create the GitHub org, fine-grained token, Vercel team, deploy the
   intake form).
3. **`docs/internal/new-client-runbook.md`** — repeat per client (~10 min each).
4. **`docs/client/*`** — customize per client and send.

---

## Why this shape

- **One GitHub org + one repo per client** → isolation, easy handoff, free.
- **One Vercel team** → separate billing and access from your personal projects.
- **Hosted intake form, not GitHub Issues** → clients never see GitHub.
- **GitHub Issues as the backend** → free, durable, version-controlled paper
  trail; emails you automatically when a request comes in.
- **Honeypot anti-spam, no captcha** → one-click submission for the client.
