# Client Master List

The single source of truth for who's onboarded, what their setup looks like, and
how to reach them. Update this **every time** you onboard, off-board, or change
something about a client.

Keep this file private (it lives in the kit, not in a client-facing repo).

---

## Active clients

| Slug | Business name | Their domain | Repo | Contact email | Onboarded | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `mountain-strong` | Mountain Strong Financial | [mountainstrong.ca](https://mountainstrong.ca) | [mountain-strong-site](https://github.com/etcp-clients/mountain-strong-site) | joe@mountainstrongfinancial.ca | 2026-05-31 | Site deployed 2026-05-31. Joe ven der Buhs. Personal insurance licence in SK, BC, AB, MB, ON. Corporation registered in BC, extra-provincially in SK. |
| `chamberlain-eg` | Chamberlain EG | _(not yet)_ | [chamberlain-eg-site](https://github.com/etcp-clients/chamberlain-eg-site) | _(fill in)_ | 2026-05-31 | |
| `chamberlain-eg-advisors` | Chamberlain EG Advisors | _(not yet)_ | [chamberlain-eg-advisors-site](https://github.com/etcp-clients/chamberlain-eg-advisors-site) | _(fill in)_ | 2026-05-31 | Sister/sub-brand of Chamberlain EG |
| `yutaka` | Yutaka | _(not yet)_ | [yutaka-site](https://github.com/etcp-clients/yutaka-site) | _(fill in)_ | 2026-05-31 | |
| `benefit-planners` | Benefit Planners | _(not yet)_ | [benefit-planners-site](https://github.com/etcp-clients/benefit-planners-site) | _(fill in)_ | 2026-05-31 | |
| `undercovered` | Undercovered | _(not yet)_ | [undercovered-site](https://github.com/etcp-clients/undercovered-site) | _(fill in)_ | 2026-05-31 | |
| `robert-mccullagh` | Robert McCullagh | _(not yet)_ | [robert-mccullagh-site](https://github.com/etcp-clients/robert-mccullagh-site) | _(fill in)_ | 2026-05-31 | |

---

## Client URLs (for reference)

The intake form URL pattern: `https://clientweb.etcprojects.com/?c=<slug>`

- Mountain Strong → https://clientweb.etcprojects.com/?c=mountain-strong
- Chamberlain EG → https://clientweb.etcprojects.com/?c=chamberlain-eg
- Chamberlain EG Advisors → https://clientweb.etcprojects.com/?c=chamberlain-eg-advisors
- Yutaka → https://clientweb.etcprojects.com/?c=yutaka
- Benefit Planners → https://clientweb.etcprojects.com/?c=benefit-planners
- Undercovered → https://clientweb.etcprojects.com/?c=undercovered
- Robert McCullagh → https://clientweb.etcprojects.com/?c=robert-mccullagh

---

## Off-boarded clients

_(empty — append a row here whenever a client leaves)_

| Slug | Business name | Off-boarded | Where things ended up |
| --- | --- | --- | --- |

---

## How to update this file

**When you onboard a new client:**
1. Add a row to *Active clients* with their slug, business name, repo link, contact email, today's date.
2. Add a bullet to *Client URLs* with their personalized form URL.
3. Save, commit, push.

**When a client leaves:**
1. Move their row from *Active* to *Off-boarded*.
2. Note where their repo and domain ended up (transferred to them, archived, deleted).
3. Remove their bullet from *Client URLs*.
4. Save, commit, push.

**Where to find this file on your machine:**
`C:\Users\kagus\Code\etcprojects\client-hosting-kit\docs\internal\clients.md`

Open it in any text editor (VS Code, Notepad, etc.) and edit directly.
