# One-Time Setup Checklist

> Ordered list of manual steps to stand up the architecture described in `ARCHITECTURE.md`. Each step requires credentials you (Kelly) hold.
> Mark each box as you complete it. Some steps depend on earlier ones — follow the order.

---

## Phase 1 — GitHub orgs and repos

- [ ] **Create `EtcPAI-Clients` GitHub org.**
  - Go to github.com → your profile → New organization
  - Name: `EtcPAI-Clients` (or `EtcPAIClients` if dashes aren't supported; pick one and stick with it)
  - Plan: Free tier is fine to start
  - Settings → make it private by default for new repos

- [ ] **Create new `EtcPAI/ppl` repo.**
  - Go to github.com/EtcPAI → New repository
  - Name: `ppl`
  - Description: "Practice Performance Lab — training programs and micro-modules"
  - Private
  - Do NOT initialize with README (we'll populate from the staging folder)

- [ ] **Populate `ppl` repo from the staging folder.**
  - From the `etcprojects` repo on the `claude/advisor-training-program-JH4bE` branch, copy the contents of `ppl/` into the new `ppl` repo.
  - Quick command-line version:
    ```bash
    # In a fresh working directory
    git clone <new-ppl-repo-url> ppl-new
    cd ppl-new
    cp -r ../etcprojects/ppl/* .
    git add .
    git commit -m "Initial commit: AI Foundation modules M1-M5"
    git push origin main
    ```

- [ ] **Create `EtcPAI-Clients/client-mountainstrong` repo.**
  - Migrate from `etcprojects/clients/mountainstrong/` preserving git history.
  - See `migrations/migrate-mountainstrong.sh` for the script (TODO — create when ready to migrate).
  - After migration, delete `clients/mountainstrong/` from etcprojects and update Vercel to point at the new repo.

---

## Phase 2 — Supabase

- [ ] **Confirm `etcpai-production` Supabase project exists.**
  - If not, create it. Region: closest to your users (likely `ca-central-1` or `us-east-1`).
  - Save the project URL + anon key in 1Password (or wherever you keep secrets).

- [ ] **Enable Auth → magic link.**
  - Authentication → Providers → Email → enable, Magic Link only (disable password)
  - Set redirect URLs to include all your product domains:
    - `https://app.etcprojectsai.com/**`
    - `https://learn.practiceperformancelab.com/**`
    - `http://localhost:3000/**` (for dev)

- [ ] **Create the core tables in `etcpai-production`.**
  - Tables to create (your dev can refine the schema):
    - `users` (synced from auth.users via trigger)
    - `practices` (id, name, lead_user_id, created_at)
    - `licenses` (id, practice_id, product, seats, purchased_at, expires_at)
    - `license_members` (license_id, user_id, role)
    - `module_progress` (user_id, program_id, module_id, state JSONB, completed_at)
    - `practice_profile` (practice_id, regulators, jurisdictions, products, designations, ...)
  - Enable RLS on all tables. Policies: users see their own rows; team members see their practice's shared rows.

- [ ] **Create Supabase Storage buckets.**
  - Bucket: `training-audio` — public for v1 (flip to private when license gating is enforced)
  - Bucket: `training-video` — public for v1
  - Bucket: `training-assets` — public for v1
  - Follow the path convention in `ARCHITECTURE.md`.

- [ ] **Create `client-mountainstrong` Supabase project.**
  - New Supabase project, separate from `etcpai-production`.
  - Plan: Free tier covers a marketing site.

---

## Phase 3 — Vercel

- [ ] **Confirm/create `EtcPAI` Vercel team.**
- [ ] **Confirm/create `EtcPAI-Clients` Vercel team.**

- [ ] **Create new Vercel project: `ppl`.**
  - Link to `EtcPAI/ppl` GitHub repo
  - Add custom domain: `learn.practiceperformancelab.com`
  - Environment variables:
    - `NEXT_PUBLIC_SUPABASE_URL=<etcpai-production-url>`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY=<etcpai-production-anon-key>`

- [ ] **Update `etc-tools` Vercel project (if not already).**
  - Confirm it points at `app.etcprojectsai.com`
  - Confirm Supabase env vars point at `etcpai-production`

- [ ] **Create new Vercel project under EtcPAI-Clients: `client-mountainstrong`.**
  - Link to the migrated GitHub repo
  - Custom domain: Mountain Strong's domain
  - Environment variables: point at the new `client-mountainstrong` Supabase project

---

## Phase 4 — DNS

- [ ] **Point `learn.practiceperformancelab.com`** at the Vercel `ppl` project.
  - Add CNAME record at your DNS host: `learn` → `cname.vercel-dns.com` (Vercel will tell you exact)

- [ ] **Confirm `practiceperformancelab.com` (apex)** is pointed somewhere reasonable.
  - If you have a marketing site for it, point it there.
  - If not yet, point at a Vercel placeholder or the main `etcprojects.com` content.

---

## Phase 5 — Cross-product link

- [ ] **In `etc-tools` Command Center, add a "Training" card** that links to `https://learn.practiceperformancelab.com`.
  - Since both apps share `etcpai-production` Supabase, the user is already authenticated on arrival.
  - No SSO handshake needed; the Supabase session cookie is set against the parent domain.

---

## Phase 6 — Content

- [ ] **Generate ElevenLabs MP3s** for each unit (22 units total across the 5 modules).
  - See `ARCHITECTURE.md` for the file naming convention.
  - Upload to `training-audio/ai-foundation/{module}/{unit}.mp3` in Supabase Storage.

- [ ] **Wire the audio player** in each module HTML.
  - Replace each `<div class="audio-placeholder">` block with an `<audio src="<public-supabase-url>" controls>` element.
  - Or, when ready, build a custom branded player that takes the URL and renders the placeholder card layout with play/pause and progress.

- [ ] **Record any video content** (TBD which modules need video — currently audio-only).

---

## Phase 7 — Cleanup

- [ ] **Delete `clients/` folder from `etcprojects`** after Mountain Strong is fully migrated and verified live.
- [ ] **Delete `ppl/` staging folder from `etcprojects`** after the new `ppl` repo is populated and verified.
- [ ] **Delete the seven unpushed commits on `claude/advisor-training-program-JH4bE`** by either pushing them (once write access is granted), opening a PR and merging, or copying the files into the new repo structure and discarding the branch.

---

## Phase 8 — Hand off to dev

- [ ] **Send the dev:**
  - `ARCHITECTURE.md`
  - `DEV-ONBOARDING.md`
  - This checklist with everything checked off so they know the infra is real
  - Credentials they need (GitHub org invite, Supabase project access, Vercel team invite)
- [ ] **Walk through the AI Foundation modules together once.** Open M1, do the full flow, generate the .md, then look at M5 to see the most complex pattern.
- [ ] **First dev task:** scaffold Next.js + Supabase auth + module shell in `ppl` repo. Port M1 to the framework as the proof-of-concept. Then port the rest following the same pattern.

---

## Decisions still open

These do not block setup, but pin them down before the framework migration is done:

1. ~~**Module 5 artifact rename**~~ — *resolved.* "Practice AI Kit" → "AI Practice Blueprint." Applied across M5, M1, M4 references. Filename: `{practice-slug}-ai-practice-blueprint.md`.
2. **Audio player UI** — native browser controls + light CSS styling, or custom branded player (~100 lines of JS)? Default: custom branded.
3. **Module reorderability** — can a team take M3 before M2? Default: linear, no skipping.
4. **Completion certificates** — issue them per module, per program, or not at all? Default: per program (the AI Foundation Certificate after M1-M5 are complete).
