# Agent Playbook: Host a Static Site on GitHub Pages + Custom Domain

Use this playbook to walk a user through publishing a **plain HTML/CSS/JS** site on **GitHub Pages** with a **custom domain**, including contact form redirect and email DNS safety.

Assume the site is already built locally. Do not invent hosting needs (WordPress, Node server, etc.) unless the project requires them.

---

## Goals

1. Site live on GitHub Pages
2. Custom domain connected and DNS check passing
3. HTTPS enabled
4. Contact form works and redirects to a thank-you page
5. Existing email (e.g. Google Workspace) keeps working

---

## Phase 0 — Gather facts (ask before changing DNS)

Ask the user:

1. **Domain name** (e.g. `example.com`)
2. **Where DNS is managed** (Squarespace, Namecheap, GoDaddy, Cloudflare, Google Domains legacy → often Squarespace)
3. **Email provider** (Google Workspace, Microsoft 365, none)
4. **GitHub username** and preferred **repo name**
5. Whether they already have a GitHub account / Git installed
6. Contact form method (Web3Forms access key, Formspree, none yet)

Do **not** delete MX / SPF / DKIM / DMARC records. Those are for email.

---

## Phase 1 — Confirm site files are deployable

Required root structure (adjust names if needed):

```
/
├── index.html
├── thank-you.html          # if using a form success page
├── styles.css
├── script.js
└── assets/...              # keep exact paths used in HTML
```

Checklist:

- [ ] Logo/image paths match real folders (e.g. `assets/images/...`)
- [ ] Form works via Web3Forms (or similar) with JS redirect to `thank-you.html` **or** a full `https://` redirect URL
- [ ] No secrets that should stay private (Web3Forms access keys are intended to be public)

**Web3Forms redirect note:** Relative `redirect` values fail. Prefer JS `fetch` + `window.location.href = 'thank-you.html'`, or a full absolute URL.

---

## Phase 2 — Publish to GitHub Pages

### Path A — No Git CLI (upload UI)

1. Create a **Public** GitHub repo (no auto README if uploading existing files).
2. Upload all site files. Preserve folder structure (`assets/images/...`).
3. Repo → **Settings → Pages**
4. Source: **Deploy from a branch**
5. Branch: **main**, folder: **/ (root)**
6. Save and wait for the temporary URL:
   `https://USERNAME.github.io/REPO-NAME/`

### Path B — Git CLI

```bash
cd /path/to/site
git init -b main
git add .
git commit -m "Initial site upload"
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git push -u origin main
```

Then enable Pages as in Path A steps 3–6.

Confirm the temporary GitHub Pages URL loads before touching DNS.

---

## Phase 3 — Add custom domain in GitHub

1. Repo → **Settings → Pages → Custom domain**
2. Enter apex domain preferred: `example.com` (not only `www` unless user wants www-only)
3. Save
4. Expect DNS check to fail until Phase 4 is done — that is normal

Optional: ensure a `CNAME` file exists in the publishing root with:

```
example.com
```

GitHub often creates this when you save the custom domain.

---

## Phase 4 — Configure DNS (critical)

Edit DNS at the **registrar / DNS host**, not in Google Workspace email settings.

### Keep (never delete for Workspace email)

- MX records for Google (or other mail)
- SPF / DKIM / DMARC TXT or CNAME records
- Optional: `_domainconnect` CNAME (safe to keep or delete; not required for GitHub)

### Delete / replace (website pointing)

- Old **A** records on `@` pointing to Squarespace (or other host), e.g. `198.185.x.x` / `198.49.x.x`
- Old **www** CNAME pointing to Squarespace (e.g. `ext-cust.squarespace.com`)

### Add for GitHub Pages

**Four A records** for apex (`@` / blank host), TTL **1 hr** while testing (or 4 hrs after stable):

| Type | Host | Value |
|------|------|-------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

**One CNAME** for www:

| Type | Host | Value |
|------|------|-------|
| CNAME | `www` | `USERNAME.github.io` |

Rules:

- CNAME target is **`USERNAME.github.io`** — not `USERNAME.github.io/repo-name`
- Apex uses **A records**, not a CNAME on `@`
- Only one set of `@` A records may remain (GitHub’s four)

### Squarespace-specific notes

- DNS: Domains → domain → **DNS Settings** / Custom records
- `_domainconnect` CNAME: **do not need to delete** for GitHub
- Must remove Squarespace default website A/www records or GitHub DNS check will fail

---

## Phase 5 — Verify DNS and HTTPS

1. Wait 15–60 minutes (up to 24h possible)
2. Optional check: [dnschecker.org](https://dnschecker.org)
   - Apex A → GitHub IPs above
   - `www` CNAME → `USERNAME.github.io`
3. GitHub Pages → **Check again**
4. When green, enable **Enforce HTTPS**
5. Test both:
   - `https://example.com`
   - `https://www.example.com`

---

## Phase 6 — Post-launch smoke test

- [ ] Homepage loads (CSS, logo, layout)
- [ ] Contact form submits successfully
- [ ] Redirect lands on thank-you page
- [ ] Notification email arrives
- [ ] Business email still sends/receives

---

## Troubleshooting cheat sheet

| Symptom | Likely cause | Fix |
|--------|--------------|-----|
| DNS check fails | Old Squarespace A records still on `@` | Delete conflicting A records; keep only GitHub’s four |
| DNS check fails | Relative or wrong CNAME | Use `USERNAME.github.io` |
| Form shows JSON / no thank-you | Relative Web3Forms `redirect` | Use JS fetch redirect or absolute `https://` URL |
| Form fails locally | Opened as `file://` | Use local server or test on live HTTPS |
| Site 404 on custom domain | Pages not enabled / wrong branch | Confirm Pages source = `main` / root |
| Email breaks | MX/SPF deleted | Restore Google Workspace MX/SPF/DKIM |
| HTTPS won’t enable | DNS not fully propagated | Wait, re-check, remove/re-add custom domain |

---

## Agent behavior rules

1. Ask for domain + DNS host + GitHub username before giving exact records.
2. Always warn: **keep email MX/SPF/DKIM**.
3. Prefer apex `example.com` in GitHub custom domain + www CNAME for both variants.
4. Walk one phase at a time; confirm screenshots/values before advancing.
5. After DNS edits, tell the user to wait and re-check rather than thrashing records.
6. Do not force Netlify/Vercel unless the user abandons GitHub Pages.

---

## One-message prompt you can paste to another agent

```text
Walk me through hosting my static HTML site on GitHub Pages with my custom domain.
Follow the playbook in GITHUB-PAGES-HOSTING-PLAYBOOK.md (or the same steps if the file isn't present).

Ask me first for: domain, DNS host (e.g. Squarespace), email provider, GitHub username, repo name, and whether Git is installed.
Then guide me phase by phase: upload/enable Pages → custom domain in GitHub → DNS A/CNAME records (keep Workspace email records) → DNS check → Enforce HTTPS → smoke test form + thank-you redirect.
Do not delete MX/SPF/DKIM. For Web3Forms, use JS redirect to thank-you.html if relative redirect fails.
```
