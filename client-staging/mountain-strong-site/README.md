# Mountain Strong Financial, Site

Static marketing site for **Mountain Strong Financial Inc.** Built for deployment to **Vercel** (with GitHub).

---

## Quick start

```bash
# From the repo root
npm i -g vercel        # if you don't have it
vercel                 # local dev, serves with cleanUrls + redirects
vercel --prod          # deploy
```

Or open any `.html` file directly in a browser. `cleanUrls` only works under Vercel (or a server configured to strip `.html`); locally the files still work via their full filename.

---

## Routes

`vercel.json` sets `cleanUrls: true`, so URLs drop the `.html` extension:

| URL                    | File                       | Purpose |
|------------------------|----------------------------|---------|
| `/`                    | `index.html`               | **Front door**, "How can I help?" path picker + existing-client strip |
| `/about`               | `about.html`               | The practice overview (formerly `msf-home`) |
| `/family-business`     | `family-business.html`     | Service · Family-owned businesses |
| `/managing-risk`       | `managing-risk.html`       | Service · Insurance portfolio oversight |
| `/workshop`            | `workshop.html`            | Workshop landing page ("Your Next Step") |
| `/client-service`      | `client-service.html`      | Marketing/explainer for existing clients (Living My Plan preview, "request the digital experience" CTA) |
| `/trust-centre`        | `trust-centre.html`        | Disclosures, privacy, terms, complaints, disclaimers + dynamic CTAs |
| `/sample-service-plan` | `sample-service-plan.html` | **Secret demo** of a per-client service plan (David & Erin). `noindex`, robots-disallowed, not linked anywhere |
| `/plan-b`              | `plan-b.html`              | Planning workbook, **not linked** in nav (project #2) |

Old slugs (`/msf-home`, `/msf-index`, etc.) redirect to the new ones via 301s. Legacy section URLs (`/privacy`, `/terms`, `/complaint-handling`, `/disclosures`, `/disclaimers`) redirect to the matching anchor on `/trust-centre`.

---

## Structure

```
site/
├─ index.html                # /                        (path picker + existing-client strip)
├─ about.html                # /about
├─ family-business.html      # /family-business
├─ managing-risk.html        # /managing-risk
├─ workshop.html             # /workshop
├─ client-service.html       # /client-service          (existing-client marketing + Living My Plan preview)
├─ trust-centre.html         # /trust-centre            (disclosures, privacy, terms, complaints, disclaimers)
├─ sample-service-plan.html  # /sample-service-plan     (SECRET demo, robots-disallowed)
├─ plan-b.html               # /plan-b                  (standalone workbook)
├─ assets/
│  ├─ logo.png               # Mountain Strong logo (favicon + footer)
│  ├─ monarch-logo.jpg       # Monarch Wealth partner logo
│  ├─ site.css               # Shared additions: mobile nav, sub-nav, active state
│  └─ site.js                # Mobile menu toggle, active link, sub-nav scrollspy
├─ vercel.json               # cleanUrls + 301 redirects + asset cache headers
├─ robots.txt                # excludes /plan-b
├─ sitemap.xml               # 5 public URLs
└─ README.md                 # this file
```

Each page is intentionally self-contained, its critical CSS lives inline in a `<style>` block and the logo in the top nav stays embedded as base64 so the page renders correctly even before `/assets/*` resolves. The shared `site.css` + `site.js` add cross-page behavior (mobile menu, active link state, sub-nav scrollspy) without overriding the per-page typography or layout.

---

## Conventions

### Licensing & geography (used in copy)

- **Personal insurance licence (Joe)**: Saskatchewan, British Columbia, Alberta, Manitoba, Ontario.
- **Corporate licence (Mountain Strong Financial Inc.)**: incorporated in British Columbia, extra-provincially registered in Saskatchewan.
- **Physical offices**: Saskatoon SK + by appointment in Greater Vancouver BC.

Marketing copy should reflect the full personal licensing reach ("Licensed across Western Canada and Ontario" or the explicit five-province list). The corporate disclosure in the legal fineprint still says "incorporated in BC, extra-provincially registered in Saskatchewan", that is the literal corporate registration and stays.

### Global nav (every page)

```html
<nav class="nav">
  <a href="/" class="nav-brand">… logo …</a>
  <div class="nav-links" id="navLinks">
    <a href="/"            data-nav="home">Home</a>
    <a href="/about"       data-nav="about">The practice</a>
    <a href="/about#notes" data-nav="notes">Field notes</a>
  </div>
  <a href="#contact" class="nav-cta">Book a call</a>  <!-- text varies per page -->
  <button class="nav-toggle" id="navToggle">…hamburger…</button>
</nav>
```

- The `data-nav` attribute drives active-link highlighting from `site.js`.
- Page-specific CTAs (e.g. `Reserve a seat` on `/workshop`, `Start a conversation` on services) are preserved per page.
- Under 900 px, `.nav-links` collapses into a dropdown panel triggered by `.nav-toggle`.

### Sub-nav (in-page section anchors)

Service / overview pages render a sticky strip below the global nav containing the page's in-page section anchors. Markup:

```html
<nav class="subnav" aria-label="Page sections">
  <div class="subnav-inner">
    <span class="subnav-label">On this page</span>
    <a href="#anchor-1">Label</a>
    …
  </div>
</nav>
```

`site.js` scrollspy highlights the active section automatically. The index (`/`) and the workbook (`/plan-b`) do not have sub-navs.

### Footer

Every page (except `plan-b.html`) renders the same `<footer class="footer on-dark">` block with:

- Conversation CTA hero
- Saskatchewan + British Columbia contact columns (physical offices)
- Monarch Wealth partnership disclosure
- A single centered **Trust Centre** link (`trust-centre.html`), all legal/compliance content lives there
- Legal fineprint

On `about.html` and `index.html` the footer also carries `id="contact"` so any `href="#contact"` from the nav resolves to the footer's CTA section. On the service pages, `#contact` resolves to an in-page CTA section *above* the footer (preserved from the original designs).

### Contact routing

`#contact` is the canonical CTA anchor everywhere:

- On a page with an explicit `<section id="contact">`, it scrolls there.
- Otherwise it falls back to the footer (which is `id="contact"` on pages without one).
- Workshop uses `#register` instead (its own form anchor).

---

## What was NOT changed (vs. the v1 HTML attachments)

- Per-page typography, hero designs, illustration, copy, and section structure.
- Interactive components (readiness check on `/about`, FAQ accordions, etc.).
- The workbook (`/plan-b`) is byte-identical to the v1 except for added SEO meta + favicon. Persistence, print, and "send to Joe" wiring are **project #2**.

## TODOs handed off to Claude Code

1. **Trust Centre is a DRAFT**, `/trust-centre` ships with draft content for disclosures, privacy, terms, complaint handling, and disclaimers, but **all legal copy needs review by Joe's compliance / legal counsel** before publishing. The "Last reviewed · DRAFT" marker in the hero is intentional, flip it to a real date once the copy is signed off.
2. **Compliance officer email**, the Trust Centre's compliance + privacy cards both route to `joe@mountainstrongfinancial.ca`. If a separate `compliance@` or `privacy@` inbox is desired, swap the mailto targets there.
3. **One-page disclosure PDF**, the Trust Centre quick-actions reference "Request the PDF". Generate and host the one-pager (compensation + conflicts) at e.g. `/assets/disclosure.pdf` and update tile 04 accordingly.
4. **Verify-licensing link**, quick-action tile 03 points at `aic-iac.org` as a starter. Replace with a curated landing page or a list of all five provincial regulator lookups (FCAA SK, ICBC, AIC, ICM, FSRA) if a single canonical destination is preferred.
5. **Workbook wiring (project #2)**, `/plan-b` needs: localStorage save (client-side only, never uploaded), download/print export, "send to Joe" email handoff. Currently it's a static page only.
6. **Executor / Families service pages**, `/about` has bento cards linking to `/` for "Executor preparation" and "Families" because dedicated pages don't exist yet. Either remove the cards or build the pages.
7. **Favicon polish**, `/assets/logo.png` is used as favicon directly. Consider generating a square `.ico` plus 32×32 + 192×192 PNG variants for sharper browser/Android display.
8. **OG image**, currently reuses the logo. A purpose-made 1200×630 OG image would render better on social shares.
9. **Higher-res Monarch logo**, the current `/assets/monarch-logo.jpg` is 252×53 px / 1.5 KB. A 2× version (~500×106) would render more crisply on Retina displays.
10. **Form endpoints**, `Book a call` / `Book a time` link to Calendly externally; complaint and privacy intakes are mailto links. No on-site forms submit anywhere yet.
11. **Analytics**, none added. Add Vercel Analytics or Plausible if desired.

---

## Local development tips

- The clean URL routes (`/family-business` etc.) only work behind `vercel dev` or a real Vercel deploy. Opening `site/about.html` directly works but its nav links will 404 unless your local server strips `.html`.
- Logo paths are absolute (`/assets/logo.png`), they require serving from the site root, not from `file://`. Use `vercel dev` or `npx serve site/`.
- All pages depend on Google Fonts (`Instrument Serif`, `Hanken Grotesk`, `JetBrains Mono`), fine over HTTPS.

---

## Domain + DNS

Site is set up to deploy at `https://mountainstrongfinancial.ca`. Update the canonical/OG URLs and sitemap if the production domain changes.
