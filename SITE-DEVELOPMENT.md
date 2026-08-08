# Clayton Bitler Service Company — Agent Handoff

Use this file when continuing work on this static site. Prefer matching existing patterns over inventing new ones.

---

## Project snapshot

| Item | Value |
|------|--------|
| Business | Clayton Bitler Service Company |
| Location | Dallas / North Dallas metro (TX) |
| Phone | `972-670-2690` (`tel:9726702690`) |
| Domain | `claybitlerservicecompany.com` |
| DNS host | Squarespace |
| Email for site mail | None (no Google Workspace on this domain) |
| GitHub | `andrewclay47` / `clayton-bitler-service-company` |
| Pages URL | `https://andrewclay47.github.io/clayton-bitler-service-company/` |
| Custom domain | Apex + www via GitHub Pages A records + CNAME |
| Git on machine | Often **not** installed — user uploads via GitHub web UI |
| Stack | Clean HTML5, Tailwind CSS via CDN, minimal vanilla JS |
| No build step | Edit HTML directly; no React/Node/bundler |

**Related docs**

- `GITHUB-PAGES-HOSTING-PLAYBOOK.md` — DNS / Pages / HTTPS walkthrough
- Do **not** delete MX/SPF/DKIM if email is ever added later

---

## Repo / file structure

```
/
├── index.html                 # Homepage
├── about.html                 # About Us
├── contact.html               # NOT BUILT YET (links exist)
├── assets/images/             # Logos + project photos
├── services/
│   ├── lawn-mowing.html
│   ├── landscaping.html
│   ├── fence-arbor.html
│   ├── concrete.html
│   ├── roof-replacements.html
│   └── pools.html
├── irrigation/
│   ├── index.html             # Irrigation overview (nav home)
│   ├── system-installation.html   # Sprinkler Installation
│   ├── sprinkler-design.html      # Sprinkler Design (CAD)
│   ├── repairs.html               # Sprinkler Repair
│   ├── backflow-testing.html      # Backflow Testing
│   ├── custom-scheduling.html     # Custom Sprinkler Scheduling
│   ├── water-conservation.html    # Water Conservation
├── GITHUB-PAGES-HOSTING-PLAYBOOK.md
└── SITE-DEVELOPMENT.md        # this file
```

**Irrigation:** Separate top-level nav dropdown (mirrors Services). Keep the TCEQ legal line in the footer (licenses LI 8729 / BP 10016).

**Not built yet:** `contact.html` (many CTAs link to it).

---

## Tech setup (copy into every new page)

### Head dependencies

1. Google Fonts: **Inter** (`400–800`)
2. Tailwind CDN: `https://cdn.tailwindcss.com`
3. Inline `tailwind.config` theme (required — colors are custom)

### Required Tailwind theme (paste as-is)

```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f2f7f4',
          100: '#e0ede5',
          200: '#c2dacb',
          300: '#97bfaa',
          400: '#6a9f82',
          500: '#4a8266',
          600: '#386851',
          700: '#2d5342',
          800: '#264336',
          900: '#20382d',
          950: '#111f19',
        },
        slate: { 850: '#1a2332' },  // optional; footer also uses inline #1a2332
        accent: {
          DEFAULT: '#c9a227',
          light: '#e8c547',
          dark: '#a6851f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

### Body baseline

```html
<body class="font-sans text-slate-700 antialiased bg-white">
```

### Shared page JS (footer year + nav)

Every page includes the same IIFE for:

- `#copyright-year`
- Mobile menu toggle (`#mobile-menu-btn`, `#mobile-menu`)
- Mobile services accordion
- Desktop services dropdown (click, outside click, Escape)
- Close mobile menu on resize ≥ 1024px

**Best practice:** Copy header + footer + script from an existing page (`about.html` or `services/lawn-mowing.html`), then swap main content. Fix relative paths:

| Page location | Logo / assets | Service links | Root links |
|---------------|---------------|---------------|------------|
| Root (`index.html`, `about.html`) | `assets/images/...` | `services/...` | `index.html`, `about.html`, `contact.html` |
| `services/*.html` | `../assets/images/...` | `lawn-mowing.html` (sibling) | `../index.html`, `../about.html`, `../contact.html` |

---

## Design system (formatting reference)

### Color usage

| Role | Classes / values |
|------|------------------|
| Primary brand | `forest-700` buttons, headings `forest-900` |
| Soft brand surfaces | `forest-50`, `forest-100` |
| Accent / CTA gold | `accent`, hover `accent-light`, text on gold often `text-forest-950` |
| Body text | `text-slate-600` / `text-slate-700` |
| Muted | `text-slate-500`, `text-slate-400` |
| Dark bands | `bg-forest-900` / `bg-forest-950` |
| Footer bg | `#1a2332` (inline style) |
| Page bg | `bg-white` or section `bg-slate-50` |

### Typography

- Font: **Inter** only (no Inter/Roboto mix)
- Eyebrow labels: `text-sm font-semibold text-forest-600` (or `text-accent` on dark) + `uppercase tracking-widest`
- Section H2: `text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight`
- Hero H1: `text-4xl sm:text-5xl` (homepage can go to `lg:text-6xl`) `font-extrabold text-white tracking-tight`
- Supporting copy: `text-lg text-slate-600 leading-relaxed`

### Layout width & spacing

- Content shell: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Section padding: often `py-16 lg:py-20` or `py-20 lg:py-28`
- Cards / panels: `rounded-2xl`, light `border border-slate-100`, `shadow-sm` (hover `shadow-xl` on interactive cards)
- Buttons: `rounded-xl` or `rounded-lg`; primary forest or accent gold

### Component patterns

**Sticky header**

- `sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm`
- Height: `h-16 lg:h-20`
- Logo image: `h-10 sm:h-12 w-auto` → `assets/images/logo.png`
- Active nav link: `text-forest-700 bg-forest-50 rounded-lg`
- Inactive: `text-slate-600 hover:text-forest-700 hover:bg-forest-50`
- Phone CTA: `bg-forest-700 hover:bg-forest-600 text-white` — show full number `sm+`, “Call Now” on mobile
- Services dropdown: `w-72`, starts `opacity-0 invisible`, open removes those classes

**Hero (photo pages)**

- `min-h-[60vh]` (or ~55–85vh on homepage)
- Full-bleed image + `bg-gradient-to-r from-forest-950/90 via-forest-900/75 to-forest-800/45` (adjust opacity as needed)
- Eyebrow → H1 → subcopy → primary gold CTA + secondary outline/phone CTA

**Hero (no photo)** — e.g. About Us

- `bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800` (no image)

**Primary CTA**

```html
class="... bg-accent hover:bg-accent-light text-forest-950 font-bold ... rounded-xl ..."
```

**Secondary CTA (on dark)**

```html
class="... bg-white/10 hover:bg-white/20 border border-white/30 text-white ..."
```

**Service / content cards**

- White card on `bg-slate-50` section
- Optional emphasized card: `border-2 border-forest-600` + dark `bg-forest-700` header
- Checkmark lists: small forest SVG + `text-slate-600`

**Footer (required on every page)**

1. 4-column grid: brand + phone, Quick Links, Services, Service Area
2. Legal (exact):  
   `LI 8729 BP 10016. Irrigation in Texas is regulated by the Texas Commission On Environmental Quality (TCEQ) (MC-178), P.O. Box 13087, Austin, Texas 78711-3087.`
3. Copyright + “Dallas, Texas”
4. **Powered by** white pill with Red Clay logo + email:

```html
<div class="inline-flex flex-wrap items-center gap-x-3 gap-y-1 bg-white text-slate-600 rounded-md px-2.5 py-1.5">
  <span class="inline-flex items-center gap-2">
    <span>Powered by</span>
    <img src="assets/images/ant-logo.png" alt="Red Clay Marketing" class="h-7 w-auto">
  </span>
  <span class="text-slate-300" aria-hidden="true">|</span>
  <a href="mailto:andrew@redclay.marketing" class="hover:text-forest-700 transition-colors">
    Contact: andrew@redclay.marketing
  </a>
</div>
```

(Use `../assets/images/ant-logo.png` from `services/`.)

White pill is intentional: logo has **black** “MARKETING” text that would disappear on the dark footer.

---

## Services list (current nav)

1. Lawn Mowing → `services/lawn-mowing.html`
2. Landscaping → `services/landscaping.html`
3. Fence & Arbor Installation → `services/fence-arbor.html`
4. Concrete Construction → `services/concrete.html`
5. Roof Replacements → `services/roof-replacements.html`
6. Pools → `services/pools.html`

When adding a service: update **desktop dropdown, mobile accordion, and footer** on **all** pages (root + every service page + irrigation pages).

## Irrigation list (current nav)

Separate top-level **Irrigation** dropdown (same interaction pattern as Services). **Brand these pages as Sprinkler Genius Irrigation and Drainage Company** (Clay’s irrigation company), while keeping the shared Clayton Bitler site header/nav.

1. Irrigation Overview → `irrigation/index.html` (Sprinkler Genius home)
2. Sprinkler Installation → `irrigation/system-installation.html`
3. Sprinkler Design → `irrigation/sprinkler-design.html`
4. Sprinkler Repair → `irrigation/repairs.html`
5. Backflow Testing → `irrigation/backflow-testing.html`
6. Custom Scheduling → `irrigation/custom-scheduling.html`
7. Water Conservation → `irrigation/water-conservation.html`

When adding an irrigation service: update **desktop Irrigation dropdown, mobile Irrigation accordion, and irrigation overview cards** on **all** pages. Rename/replace placeholder pages as needed. Keep Sprinkler Genius naming in titles, heroes, and body copy.

---

## Assets (`assets/images/`)

| File | Use |
|------|-----|
| `logo.png` | Site brand (header/footer) — red/white Clayton Bitler logo |
| `sprinkler-schedule-sample.png` | Custom Scheduling page — sample watering schedule screenshot |
| `ant-logo.png` | Red Clay Marketing “Powered by” (transparent bg; includes black MARKETING) |
| `fence-project.png`, `fence-pool.png`, `arbor-pool.png` | Fence / arbor |
| `roof-replacement.png` | Roofing |
| `pool-finished.png`, `pool-repair.png` | Pools |
| `concrete-projects.png` | Side-by-side driveway + stamped walkway (prefer **one** composite on concrete page) |
| `concrete-driveway.png`, `concrete-walkway.png` | Split halves (optional; page prefers composite) |
| `clay-hgtv.png` | About — Clay with HGTV host John Gidding |

Portrait selfies: prefer `object-contain` on dark hero **or** careful `object-cover` + position. Landscape project shots: `object-cover` is fine.

---

## Content / product notes

- **Phone** is the main conversion action everywhere.
- **Contact page** not built; CTAs already point to `contact.html`.
- **No Web3Forms** on this site (by request). If forms are added later, use JS `fetch` + redirect to `thank-you.html` (relative Web3Forms redirect fails).
- About page: no photo in top hero (gradient only); HGTV photo in lower section.
- Revamp old-site copy into clear modern prose; keep facts (licenses, years, markets).
- Service area cities: Dallas, Plano, Richardson, McKinney, Garland, Allen, Frisco, Highland Park, North Dallas, Park Cities.

---

## Deploy reminder (no Git)

User typically: GitHub → **Add file → Upload files** → drag folders (`assets/`, `services/`) + HTML → Commit. Pages serves `main` / root. After DNS, custom domain + Enforce HTTPS.

---

## Checklist for a new page

1. Copy an existing page shell (header/footer/theme/JS).
2. Fix all relative paths for root vs `services/`.
3. Mark active nav item with `text-forest-700 bg-forest-50`.
4. Match hero / section / card / CTA classes above.
5. Include legal footer + Powered by pill + mailto.
6. Add links in **all** nav dropdowns + footers if it’s a new service.
7. Tell user which files to re-upload to GitHub.

---

## What not to do

- Don’t introduce Inter alternatives, purple AI themes, or card-heavy heroes.
- Don’t remove TCEQ/LI/BP footer legal text without asking.
- Don’t remove the Irrigation nav unless requested.
- Don’t assume Git CLI — prefer upload instructions unless user confirms Git is installed.
- Don’t put black logo text directly on the dark footer without the white pill.
