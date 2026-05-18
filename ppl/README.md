# Practice Performance Lab (PPL)

> **Note:** This folder is currently a *staging area* inside the `etcprojects` repo. Its destination is a separate `EtcPAI/ppl` GitHub repo served at `learn.practiceperformancelab.com`.
> See `../ARCHITECTURE.md` for the full plan and `../migrations/setup-checklist.md` for the steps to spin up the actual repo.

---

## What this is

Practice Performance Lab houses all training programs Etc. Projects ships. Each program is a sequence of short, action-based modules that produce an artifact (a `.md` file) the user keeps and loads into their AI tools as system context.

The first program is **AI Foundation** (5 modules, ~2.5 hours total). More programs will follow.

---

## Folder structure

```
ppl/
  programs/
    ai-foundation/              The AI Foundation program (5 modules)
      m1-foundation.html        Module 1 — My AI Foundation
      m2-identity.html          Module 2 — My Identity and Voice
      m3-compliance.html        Module 3 — My Compliance Context
      m4-prompts.html           Module 4 — Practice Prompt Library (shared)
      m5-aikit.html             Module 5 — Practice AI Kit (shared)
    {next-program}/             Future programs follow same pattern
  shared/                       Future: extracted brand tokens + components
  README.md                     This file
```

---

## How the modules work (today, as prototypes)

- Each file is a self-contained HTML page. Open it in a browser to use it.
- State persists in `localStorage` under keys like `etc_module1_state`. Refresh-safe.
- Cross-module inheritance: M3 reads M1/M2 state, M4/M5 read M1/M2 state. Identity, role, practice, and (for M3) province pre-fill where appropriate.
- Each module ends with a `.md` file the user downloads. The artifacts are the deliverable.

To test the full chain locally:

1. Open `programs/ai-foundation/m1-foundation.html` in a browser. Complete it.
2. Open M2 in the same browser. Confirm Unit 4 inheritance callout shows your name from M1.
3. Open M3. Confirm Unit 3 pre-ticks your M1 province with a teal callout.
4. Open M4. Confirm custom prompts capture your name as contributor.
5. Open M5. Confirm Lead voice reference auto-fills with your name from M2, and you're pre-rostered.
6. Generate each `.md`. Verify the content.

---

## Tech stack (production)

- **Framework:** Next.js + App Router (recommended, not yet implemented)
- **Auth:** Supabase Auth, magic link
- **State:** Supabase tables keyed by `(user_id, module_id)` (replaces `localStorage`)
- **Storage:** Supabase Storage for audio (`training-audio/{program}/{module}/{unit}.mp3`)
- **Deploy:** Vercel
- **License gating:** Supabase RLS — every module route checks for a valid license on the user

See `../DEV-ONBOARDING.md` for the framework migration plan.

---

## Adding a new program

1. Create `programs/{program-id}/` (lowercase, dashes).
2. Decide the module list. Each module gets a stable ID (`m1-{name}`, `m2-{name}`, ...).
3. Copy the structure of an existing module HTML as a starting point. Update:
   - `STORAGE_KEY` (e.g. `etc_compliance_deepdive_m1_state`)
   - Hero, units, drawer content
   - The `.md` template at the bottom
4. Audio files go to `training-audio/{program-id}/{module-id}/{unit-id}.mp3` in Supabase Storage.
5. Add a card on the PPL dashboard (`/index`) linking into the new program.

---

## Component library (in-prototype)

These patterns repeat across all modules. They will become shared components in the framework migration.

- `.hero` + `.hero-side` (welcome screen with audio side card)
- `.card` (unit container)
- `.audio-placeholder` (to be replaced with real player)
- `.worked-example` (orange-labeled narrative block)
- `.pull-quote` (italic block with orange left border)
- `.before-after` + `.ba-grid` + `.ba-card-bad` / `.ba-card-good` (comparison panels)
- `.callout` (sage), `.callout-teal` (Steward's Log), `.role-nod` (warm-amber)
- `.drawer` + `.glossary-entry` + `.watchout-item` ("Go deeper" panel)
- Pickers: `.check-grid`, `.chip-grid`, `.rule-list`

Brand tokens are in the `:root { ... }` block at the top of every module's `<style>` tag. Identical across all five — extract to `shared/etc-design.css` early in the framework migration.
