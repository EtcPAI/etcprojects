# Local Setup — Client Hosting (Windows)

How to organize client websites on your Windows machine so Claude Code can work
with them cleanly, one client at a time.

> **Your path: `C:\Users\kagus\Code\etcp-clients\`**
> Outside OneDrive. Outside Documents. This matters — see "Why not OneDrive"
> at the bottom of this doc.

---

## The mental model

```
GitHub (the cloud):                 Your computer (local mirror):

etcp-clients/                       C:\Users\kagus\Code\etcp-clients\
├── krips-site         ◄────────►   ├── krips-site\
├── advocis-site       ◄────────►   ├── advocis-site\
└── intake-form        ◄────────►   └── intake-form\
```

- **`etcp-clients`** is a GitHub *organization* you own — a container for all
  client work. Clients never log in, never see this. It exists for you, Claude
  Code, and Vercel.
- **Each client = one repo inside the org.** Their files, their domain, their
  Vercel project. Isolated from every other client.
- **Locally**, you mirror that org as a folder called `etcp-clients\`, inside
  `C:\Users\kagus\Code\`. Same name on GitHub and on disk = no confusion.

---

## One-time setup

### 1. The parent folder

Already done if you followed the move steps. Confirm in PowerShell:

```powershell
cd C:\Users\kagus\Code\etcp-clients
dir
```

If `cd` works without error, the folder exists. `dir` shows what's inside
(probably empty for now — that's fine).

### 2. Verify GitHub CLI is installed and logged in

In the same PowerShell window:

```powershell
gh --version       # should print a version number
gh auth status     # should say you're logged in
```

If `gh` is not installed: download from https://cli.github.com and install.
If not logged in: `gh auth login` and follow the prompts.

### 3. (Optional) PowerShell shortcut

Open your PowerShell profile so you can add an alias:

```powershell
notepad $PROFILE
```

If Notepad asks to create the file, say yes. Add this line:

```powershell
function clients { cd C:\Users\kagus\Code\etcp-clients }
```

Save, close Notepad, restart PowerShell. Now typing `clients` anywhere
jumps you straight to the folder.

---

## Per-client setup (each time you onboard a new client)

Say the new client is `acme`. After the repo is created on GitHub (see
`onboarding-checklist.md`), clone it locally:

```powershell
cd C:\Users\kagus\Code\etcp-clients
gh repo clone etcp-clients/acme-site
cd acme-site
```

You now have a working copy of Acme's site on disk.

### Starting Claude Code on one client

```powershell
cd C:\Users\kagus\Code\etcp-clients\acme-site
claude
```

Claude Code only sees files inside the folder you start it in. Starting here
means:
- ✅ Claude can read and edit Acme's site files.
- ✅ Claude **cannot** see Krips's, Advocis's, or your personal projects.
- ✅ Any changes are isolated to Acme.

This is the safe default. Use it almost always.

### Starting Claude Code across all clients

```powershell
cd C:\Users\kagus\Code\etcp-clients
claude
```

Now Claude sees every client. Useful only when:
- Onboarding a new client (Claude copies the template and adjusts files).
- Rolling out the same change across all sites.
- Asking "how is X done in Krips? do the same for Acme."

Use this only when you actually need to see more than one client at once.

### Never do this

```powershell
cd C:\Users\kagus\Code   # ← too broad, includes etcprojects + everything else
claude                    # ← Claude can now see ALL your projects, personal and client
```

---

## Day-to-day workflow

For each client request:

```powershell
cd C:\Users\kagus\Code\etcp-clients\acme-site   # 1. Go to the right client
git pull                                          # 2. Get latest from GitHub
claude                                            # 3. Start Claude
# ... work with Claude to make changes ...
# Claude commits and pushes; Vercel auto-deploys.
```

---

## Folder hygiene rules

- **One folder per client, named exactly like the GitHub repo.** `krips-site\`
  on disk because `krips-site` is the repo name on GitHub. No nicknames.
- **All siblings.** Don't nest one client inside another.
- **Don't put unrelated stuff in `etcp-clients\`** — only repos cloned from
  the `etcp-clients` GitHub org belong here.
- **Don't manually create folders that aren't backed by a GitHub repo.** Make
  the repo on GitHub first, then clone.

---

## Troubleshooting

| Symptom | Probably means | Fix |
| --- | --- | --- |
| Claude is editing the wrong client's files. | You started Claude in the parent folder. | Exit Claude, `cd` into the correct client subfolder, restart. |
| `git push` says "permission denied." | `gh` auth expired, or this repo isn't in your `etcp-clients` org. | `gh auth status`, then `gh auth refresh` if needed. |
| Folder exists locally but the GitHub repo is gone. | Repo was renamed or transferred. | Don't delete the local folder yet — investigate first. |
| Files randomly missing or "in the cloud only." | Something is still syncing to OneDrive. | Re-check that the folder is at `C:\Users\kagus\Code\` and not under `OneDrive\Documents\`. |

---

## Why not OneDrive

OneDrive is for documents, photos, and personal files. It is **not** safe for
code, for three concrete reasons:

1. **Sync races corrupt git.** OneDrive can grab a file in the middle of git
   writing to it, leaving the repo in a half-state. Recovery is annoying.
2. **`node_modules` will eat your OneDrive quota.** A single Next.js project
   can drop 30,000+ tiny files into `node_modules`. OneDrive will try to sync
   every single one.
3. **"Files On-Demand" makes files invisible to tools.** OneDrive replaces
   files with placeholder pointers. Your editor may see them, but command-line
   tools (git, npm, the Vercel CLI, Claude Code) may not.

Keep all code at `C:\Users\kagus\Code\` — Windows does not sync that folder
by default, and that's the point.
