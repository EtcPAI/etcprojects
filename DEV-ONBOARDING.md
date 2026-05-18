# Dev Onboarding — Etc. Projects

> Read `ARCHITECTURE.md` first. This doc tells you what to do, in what order, on your first week.

---

## Day 1 — Get oriented

1. **Read `ARCHITECTURE.md`.** It is the source of truth for repos, infrastructure, and naming. Bookmark it.
2. **Get access:**
   - GitHub: invited to `EtcPAI` org (read access on all product repos, write on whatever you're assigned)
   - Supabase: invited to `etcpai-production` project
   - Vercel: invited to `EtcPAI` team
   - Domains/DNS: ask for credentials only when needed
3. **Clone the active product repos:**
   ```
   gh repo clone EtcPAI/etc-tools
   gh repo clone EtcPAI/ppl              # will be created from this etcprojects/ppl/ folder
   gh repo clone EtcPAI/etcprojects
   ```
4. **Run them locally.** Each repo has its own README with a `pnpm install && pnpm dev` or equivalent.

---

## Day 2 — Understand the product split

### `etc-tools` (Command Center + transformation tools)

- The Command Center is the dashboard a logged-in user lands on.
- Tools inside it: Practice Profile Builder, AI Intelligence Builder (formerly AI Kit Builder), Compliance Profile, Campaign Builder, Skills Library, Admin, Laylah.
- These are interactive tools that *do things* for the user — generate AI Kits, build practice profiles, manage campaigns.
- One of the Command Center cards links out to PPL (training). Just a link. No tight coupling.

### `ppl` (Practice Performance Lab)

- Standalone learning platform at `learn.practiceperformancelab.com`.
- Programs live under `programs/{program-id}/`. The first program is `ai-foundation` with five modules (M1-M5).
- Each module is currently a self-contained HTML file with inline styles, `localStorage` persistence, and a `.md` file generator. This was the v1 prototype pattern. We are migrating to a framework (likely Next.js) and Supabase-backed state, but the prototype HTML is functional today and demonstrates every required interaction.
- Future programs (compliance deep-dives, team onboarding, micro-trainings on demand) drop into `programs/{new-program-id}/` following the same pattern.

### The product boundary

If it does something interactive for a practice (build a profile, generate a kit, manage a campaign): **etc-tools.**
If it teaches the team a skill or framework: **ppl.**

The two share auth + license via Supabase. Anything beyond that crosses the boundary via simple links.

---

## Day 3 — Module mechanics (read the prototype HTML)

Open any module HTML at `ppl/programs/ai-foundation/`. Each one has the same architecture:

- **State** in `localStorage` under a key like `etc_module1_state`, `etc_module2_state`, etc.
- **State shape** is a flat JSON object designed for clean migration to Supabase (no DOM coupling).
- **Cross-module inheritance:** Module N reads Module 1-N-1 localStorage and prefills relevant fields. M3 pulls identity from M2 (or M1 as fallback) and pre-ticks the M1 province; M5 auto-fills the team voice's Lead reference with the M2 owner's name; etc.
- **Components in use** (reusable patterns we will extract to `shared/etc-design.css` when convenient):
  - Hero with side audio placeholder
  - Unit card with progress bar
  - Audio placeholder (to be replaced with real player — see "Audio" below)
  - Worked example (orange-labeled narrative box)
  - Pull-quote (italic block with orange left border)
  - Before/after (two-card comparison, bad/good)
  - Callout palette: sage (why this matters), teal (Steward's Log nudge), warm-amber (role-specific note)
  - Drawer ("Go deeper") with glossary entries, watchout items, and primary sources
  - Picker variants: check-grid, chip-grid, rule-list with inline editing
- **Markdown generator** at the bottom of each `<script>` block. Builds the user's downloadable artifact. State → string → blob → download.

The cleanest way to learn the patterns is to open M1 and M5 side by side. M1 is the simplest. M5 is the most complex (5 units, escalation triggers with per-trigger reviewer naming, multi-field team voice form, roster builder).

---

## Day 4 — The framework migration

The prototype HTML files are **the spec, not the production code**. Convert each module to the production framework (recommended: Next.js + App Router + Supabase auth + Supabase-backed state). Constraints:

1. **Preserve the user-facing flow exactly.** Same units, same copy, same components, same artifact output.
2. **Replace localStorage with Supabase tables** keyed by `(user_id, module_id)`. State shape from the prototype maps directly.
3. **Cross-module inheritance moves from localStorage reads to Supabase joins.** M3 reads `m1_state` and `m2_state` rows for the same user.
4. **Audio:** swap the placeholder div for an `<audio>` element wired to a Supabase Storage URL. See `ARCHITECTURE.md` for the bucket layout.
5. **Brand tokens:** extract the `:root { --navy: ... }` block into a shared CSS file imported by every module page. Same for shared component classes.
6. **License gate:** wrap every program route in a Supabase RLS check. No license → redirect to `practiceperformancelab.com/buy`.

The .md generator stays client-side. No reason to round-trip through the server for a Blob download.

---

## Where things are right now (May 2026)

- **Branch `claude/advisor-training-program-JH4bE`** in this `etcprojects` repo holds the 5 prototype modules and this architecture set.
- **`ppl/` folder** in that branch is a staging area. The intent is that whoever creates the new `EtcPAI/ppl` repo copies this folder's contents into it as the v0.
- **No PPL repo exists yet.** Create it as step 1 from `migrations/setup-checklist.md`.
- **No GitHub Actions / CI configured for PPL yet.** Vercel auto-deploy on push to main is the simplest starting point.
- **Audio files are placeholders.** ElevenLabs MP3s need to be generated/uploaded to `training-audio/ai-foundation/{module}/{unit}.mp3` in Supabase Storage.

---

## Conventions to keep

- **Stable IDs.** Module IDs (`m1-foundation`, etc.) and program IDs (`ai-foundation`) never change once shipped. Display titles can.
- **Prefer simple links between products** over embedded iframes or SDK integrations.
- **Each client gets their own Supabase project.** Never co-mingle client data with product data.
- **Branch naming:** `feature/{short-description}`, `fix/{short-description}`, `chore/{short-description}`. Avoid auto-generated branch names like the one you'll see on this branch (`claude/...`) — those are session artifacts.

---

## Open questions to surface to the team

1. **Naming (resolved).** Command Center tool: "AI Kit Builder" → "AI Intelligence Builder." M5 artifact: "Practice AI Kit" → "AI Practice Blueprint." Approval terminology: "ratify" → "approve." Module IDs and storage keys stay on the legacy names — only display copy and the downloaded artifact filename change.
2. **Audio hosting.** Plan is Supabase Storage public bucket → private + signed URLs when license gating is enforced. Bucket created? MP3s recorded?
3. **Framework choice for PPL.** Default: Next.js + App Router. Confirm before scaffolding.
4. **CI/CD.** Vercel auto-deploy on push to main, with preview deploys for PRs. Anything else?
5. **Team scope.** Will any modules ever need to be reorderable by the team (e.g., a Lead Advisor decides their team takes M3 before M2)? Affects how strictly we lock progression.
