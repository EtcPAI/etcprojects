# Local Setup — Client Hosting

How to organize client websites on your computer so Claude Code can work with
them cleanly, one client at a time.

> **Replace `~/Code/` everywhere below with your actual code folder.**
> If you don't have one yet, `~/Code/` is the conventional choice — create it.
> Whatever you pick, keep `etcprojects/` and `etcp-clients/` as siblings.

---

## The mental model

```
GitHub (the cloud):                 Your computer (local mirror):

etcp-clients/                       ~/Code/etcp-clients/
├── krips-site         ◄────────►   ├── krips-site/
├── advocis-site       ◄────────►   ├── advocis-site/
└── intake-form        ◄────────►   └── intake-form/
```

- **`etcp-clients`** is a GitHub *organization* you own — a container for all
  client work. Clients never log in, never see this. It exists for you (and
  Claude Code, and Vercel).
- **Each client = one repo inside the org.** Their files, their domain, their
  Vercel project. Isolated from every other client.
- **Locally**, you mirror that org as a folder called `etcp-clients/`,
  sibling to your existing `etcprojects/`. Same name = no confusion.

---

## One-time setup

### 1. Make the parent folder

Open Terminal. Run:

```bash
mkdir -p ~/Code/etcp-clients
cd ~/Code/etcp-clients
```

That's it for the folder itself. The repos go inside it as you onboard each
client (next section).

### 2. Verify your GitHub CLI works (one-time)

You'll use the `gh` CLI to clone repos. Check it's installed and logged in:

```bash
gh --version       # should print a version
gh auth status     # should say you're logged in as your GitHub user
```

If `gh` isn't installed: `brew install gh` (Mac) or see https://cli.github.com.
If you're not logged in: `gh auth login` and follow the prompts.

### 3. Add a shell shortcut (optional but nice)

Add this to `~/.zshrc` (Mac default) or `~/.bashrc`:

```bash
alias clients='cd ~/Code/etcp-clients'
```

Reload your shell (`source ~/.zshrc`). Now `clients` jumps you there from
anywhere.

---

## Per-client setup (each time you onboard a new client)

Say the new client is `acme`. After you've created the repo on GitHub (the
browser steps live in `onboarding-checklist.md`), clone it locally:

```bash
cd ~/Code/etcp-clients
gh repo clone etcp-clients/acme-site
cd acme-site
```

You now have a working copy of that client's site files on disk.

### Starting Claude Code on one client

```bash
cd ~/Code/etcp-clients/acme-site
claude
```

Claude Code only sees files inside the folder you start it in. Starting here
means:
- ✅ Claude can read/edit Acme's site files.
- ✅ Claude **cannot** see Krips's, Advocis's, or your personal projects.
- ✅ Any changes Claude makes are isolated to Acme.

This is the safe default. Use it 95% of the time.

### Starting Claude Code across all clients

```bash
cd ~/Code/etcp-clients
claude
```

Now Claude can see every client. Useful when:
- Onboarding a new client (Claude can copy the template, adjust files, etc.).
- Rolling out a shared change across all sites at once.
- Asking "how is X done in Krips? do the same for Acme."

Use this only when you actually need cross-client visibility.

### Never do this

```bash
cd ~/Code           # ← too broad
claude              # ← Claude can now see ALL your projects
```

Starting Claude at `~/Code/` mixes personal projects with client work. Avoid.

---

## Day-to-day workflow

For each client request you decide to handle:

```bash
cd ~/Code/etcp-clients/acme-site   # 1. Go to the right client folder
git pull                            # 2. Get latest from GitHub
claude                              # 3. Start Claude
# ... work with Claude to make changes ...
# Claude will commit + push when done; Vercel auto-deploys.
```

---

## Folder hygiene rules

- **One folder per client, named exactly like the GitHub repo.** No nicknames.
  `krips-site/` on disk because `krips-site` is the repo name.
- **Don't nest clients inside each other.** All siblings.
- **Don't put unrelated stuff in `etcp-clients/`** — only cloned repos from the
  `etcp-clients` GitHub org.
- **Don't manually create folders that aren't backed by a GitHub repo.** If
  you find yourself wanting to, create the GitHub repo first, then clone.
- **The `_kit/` folder is the exception** — it holds your templates and
  runbooks (this very document), and lives at the top of the listing because
  of the leading underscore.

---

## When something feels wrong

| Symptom | Probably means | Fix |
| --- | --- | --- |
| Claude is editing the wrong client's files. | You started Claude in the parent folder by mistake. | `exit`, `cd` into the right client, restart. |
| `git push` says "permission denied." | Your `gh` auth expired, or this repo isn't in the `etcp-clients` org. | Run `gh auth status`, then `gh auth refresh`. |
| A client folder exists locally but the GitHub repo is gone. | The repo was renamed or transferred. | Don't delete the folder yet — check with yourself first. |
| You forget which clients you have. | You haven't been keeping the index up to date. | `ls ~/Code/etcp-clients/` — that IS the source of truth. |
