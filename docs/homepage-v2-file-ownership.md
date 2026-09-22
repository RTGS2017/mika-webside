# Homepage V2 — File Ownership Contract

> Phase-1 output for parallel agents. **Content is locked in `src/content/home/`.**  
> Do not edit Visual / Animation / SEO / Integration targets from another lane.  
> Do not `git commit` or push from content work unless Integration asks.

## 0. Repository reality (read before coding)

| Fact | Path / value |
| --- | --- |
| Stack | **Static HTML** — no Vue/React/Vite/npm/`package.json` |
| Homepage | `D:\NagaAssistance\b2bweb\site\index.html` |
| Global CSS | `D:\NagaAssistance\b2bweb\site\styles.css` |
| Behavior / motion today | `D:\NagaAssistance\b2bweb\site\main.js` |
| Assets | `D:\NagaAssistance\b2bweb\site\assets\` |
| Live domain | `https://mikaovo.ai/` (`CNAME`) |
| Pages deploy | GitHub Pages from repo root (or `/docs`); **source root = published root** (no `dist/` build) |
| Base URL | Relative (`./styles.css`, `./assets/...`). Custom domain — **not** `/REPO/` prefix |
| i18n today | **None** — English hardcoded in `index.html`. V2 copy lives in `src/content/home/{en,zh}.ts` as the contract; Integration chooses how to bind (inline, small loader, or later toolchain). **Do not invent a second i18n system.** |
| Contact (live UI) | **Already implemented — reuse, do not rewrite.** Runtime SSOT: `contact-config.js` (`window.MIKA_CONTACT`). Behavior: `contact.js`. Styles: contact blocks in `styles.css`. Mount hooks already in `index.html` / `404.html` (`data-contact-open`, `#contact-popover-*`, `[data-contact-cards]`, `[data-contact-footer]`, dock/sheet). WhatsApp `+86 138 1401 5518` / `https://wa.me/8613814015518`, Email `akizukiovo@gmail.com`, WeChat `Xue2017105` (**copy only**). Content mirror: `CONTACT_FACTS` + `cta.contact` in `src/content/home/*` — keep numbers identical; UI must keep reading `contact-config.js`. |
| Uncommitted SEO domain swap | `README.md`, `index.html` head/JSON-LD, `robots.txt`, `sitemap.xml` already point to `mikaovo.ai` — **do not revert**. |

### Existing sections in `index.html` (V1 — to be replaced by Integration)

Hero → Product (`#product`) → Four dimensions → Deep Audit (`#audit`) → Pipeline (`#pipeline`) → SEO (`#seo`) → GEO (`#geo`) → Evidence (`#evidence`) → Languages (`#languages`) → Workflow (`#workflow`) → CTA (`#cta`) → Footer.

V2 stable section ids (from content):  
`hero`, `problem`, `framework`, `audit`, `healthGrowth`, `blueprint`, `seoGrowth`, `geo`, `questions`, `entity`, `multilingual`, `methodology`, `faq`, `cta`.

---

## 1. Content lane (COMPLETE — do not rewrite)

| File | Role |
| --- | --- |
| `docs/homepage-v2-file-ownership.md` | This contract |
| `src/content/home/types.ts` | `HomeContent` + `CONTACT_FACTS` |
| `src/content/home/en.ts` | English copy (`homeEn`) |
| `src/content/home/zh.ts` | Chinese copy (`homeZh`) |
| `src/content/home/faq.en.ts` | English FAQ (`faqEn`) |
| `src/content/home/faq.zh.ts` | Chinese FAQ (`faqZh`) |

**Forbidden for all other lanes:** editing these files except typo fixes approved by product; inventing parallel copy in HTML/CSS/JS.

---

## 2. Visual lane — exclusive write paths

**May create / edit:**

| Path | Notes |
| --- | --- |
| `src/sections/**` | New section markup helpers (HTML partials or small render functions) — one file family per section id preferred |
| `src/sections/**/*.css` | **Local** section styles only |
| `assets/**` | New illustrative SVGs/images if needed (no robot/brain art) |

**Must consume:** `src/content/home/*` for all visible strings and numbers.

**Must not edit:**

- `src/content/home/**`
- `index.html` (head or body assembly — Integration owns final wire-up)
- `main.js` (Animation owns motion; Integration may add imports only)
- `robots.txt`, `sitemap.xml`
- SEO metadata / JSON-LD blocks
- Animation engine files under `src/animations/**`

**Visual constraints (implement later — not in Phase 1):**

- Palette budget: white ~45% / light gray ~25% / deep navy ~15% / blue ~7% / purple ~6% / green ~2%
- Section backgrounds: Hero `#F8FAFC`, Problem `#FFFFFF`, Framework `#F3F6FA`, Audit `#101828`, SEO Growth `#F5F8FF`, GEO `#FAF7FF`, Questions `#FFFFFF`, Multilingual `#F4F7F6`, FAQ `#F8FAFC`, CTA `#111827`
- Large layouts: `section` + grid; data on flat panels; important components `border-radius: 12px`; small controls/buttons `8px`
- Forbidden: 40px radii, all-pill UI, 3D, glassmorphism, neon, robot/brain illustrations, heavy gradients
- Semantic colors: SEO=Blue, GEO=Purple, Healthy=Green, Structure=Gray, Primary=Deep Navy
- Prefer extending CSS variables; if touching global tokens, coordinate with Integration — prefer `src/sections/_tokens.css` over rewriting all of `styles.css`

**Legacy conflict:** V1 styles live in `styles.css`. Prefer **additive** section CSS. Only Integration may delete obsolete V1 rules after sections are swapped.

---

## 3. Animation lane — exclusive write paths

**May create / edit:**

| Path | Notes |
| --- | --- |
| `src/animations/**` | All V2 motion modules |
| Optional: `src/animations/index.js` | Public init API called once from Integration |

**Eight required experiences** (data from content metrics — animate `value`, not numbers buried only in sentences):

1. Hero dashboard build  
2. Audit crawl  
3. Coverage expansion  
4. Question matching  
5. Blueprint generation  
6. Entity graph  
7. Language sync  
8. Continuous loop  

**Technical rules:**

- Base on `IntersectionObserver`, scroll progress, CSS transitions, `requestAnimationFrame`, and component/DOM state  
- **No** large `setTimeout` fake-progress chains (V1 `main.js` scan log uses `setTimeout` — replace, do not copy that pattern)  
- Must respect `prefers-reduced-motion: reduce`  
- Do not invent copy; read numbers/labels from content objects  

**Must not edit:** content files, section CSS (except animation class hooks agreed with Visual), SEO files, or wholesale rewrite of Visual markup.

**Legacy:** `main.js` currently owns sticky nav, reveal, matrix interval, scan log, language tabs. Animation may extract motion into `src/animations/**`; Integration rewires `main.js` to call the new API. Animation must not race Integration by both rewriting `main.js` mid-parallel — **Animation writes only under `src/animations/` until Integration merges.**

---

## 4. SEO / GEO lane — exclusive write paths

**SEO may edit:**

| Path | Scope |
| --- | --- |
| `index.html` `<head>` only (prefer) | `title`, `description`, canonical, hreflang, robots meta, OG/Twitter, theme-color |
| JSON-LD in `index.html` | Must match **visible** page content after Integration |
| `robots.txt` | Crawl rules; sitemap URL; verify **OAI-SearchBot is not blocked** |
| `sitemap.xml` | Public URLs only under `https://mikaovo.ai/` |
| Optional: `src/seo/**` | Draft snippets / checklist — Integration copies into head if needed |

**SEO rules:**

- Published root = this folder (`index.html` beside `robots.txt`). **Do not** treat `src/` as the site root for sitemap/canonical paths  
- FAQPage schema **only after** FAQ is publicly rendered; questions/answers must match `faq.en.ts` / `faq.zh.ts` (or the live locale)  
- Keep parity with uncommitted `mikaovo.ai` domain — do not revert to `rtgs2017.github.io/mika-webside`  
- No claims of guaranteed ChatGPT inclusion / AI recommendation / AI citation  

**GEO (same lane or sibling checklist under `src/seo/geo-checklist.md`):**

- Structured extractability notes / entity checklist aligned with content  
- Confirm `robots.txt` allows relevant AI search crawlers (e.g. OAI-SearchBot) unless product decides otherwise  
- Allowing crawl ≠ guaranteeing display  
- **Must not** change Visual section components for GEO storytelling  

**Must not edit:** `src/content/home/**` copy (consume it), `src/sections/**`, `src/animations/**`, body assembly beyond head metadata (unless Integration grants a narrow PR).

---

## 5. Integration lane (later — sole assembler)

**May edit:**

| Path | Role |
| --- | --- |
| `index.html` body | Mount sections; keep head edits coordinated with SEO |
| `main.js` | Import animations, nav, locale switch if added |
| `styles.css` | Delete obsolete V1 rules; import or link section CSS; global layout shell only |
| Optional thin bridge | e.g. `src/app.js` that loads `homeEn`/`homeZh` if a module approach is chosen |

**Must not:** invent new marketing copy; change contact facts; duplicate FAQ text outside content modules.

**Locale binding (recommended):**

1. Short term: render one locale from content modules into static HTML  
2. If EN/ZH toggle: single switch reading `homeEn` / `homeZh` — **extend this content contract**, do not add a second dictionary  

---

## 6. Parallelism matrix (non-overlapping)

| Lane | Writes | Reads |
| --- | --- | --- |
| Content (done) | `src/content/home/**`, this doc | existing site |
| Visual | `src/sections/**`, optional `assets/**` | content |
| Animation | `src/animations/**` | content + Visual class hooks |
| SEO/GEO | `robots.txt`, `sitemap.xml`, `index.html` head / JSON-LD, optional `src/seo/**` | content + live FAQ visibility |
| Integration | `index.html` body, `main.js`, careful `styles.css` cleanup | all of the above |

### Absolute conflict files — never edit in parallel

| File | Owner when contested |
| --- | --- |
| `index.html` | SEO = `<head>`; Integration = `<body>`; **serialize** if both need the file |
| `styles.css` | Integration (cleanup) / Visual prefers `src/sections/*.css` |
| `main.js` | Integration (wire) / Animation stays in `src/animations/**` |
| `src/content/home/**` | Content only |
| `robots.txt` / `sitemap.xml` | SEO only |
| `contact-config.js` / `contact.js` | Contact owner only — all lanes reuse |
| Contact-related hunks in `styles.css` / `index.html` body | Do not restyle/re-mount from Visual/Animation/SEO without Integration |

---

## 7. Already satisfied — do not rebuild from scratch

- Brand assets: `assets/logo.svg`, `assets/favicon.svg`  
- Custom domain + relative asset paths  
- Baseline SEO shell (canonical, OG, Twitter, WebSite/Organization JSON-LD) — **update** for V2 messaging, do not invent a parallel site  
- Sticky nav + mobile menu pattern in `main.js` (behavior can be kept; motion for dashboards is new)  
- `prefers-reduced-motion` awareness already started in `main.js`  
- Fonts: Instrument Sans + IBM Plex Mono (Visual may keep unless brand decides otherwise)  
- Contact UI + `contact-config.js` — **reuse**; do not build a second contact system  
- Content `CONTACT_FACTS` mirrors the same numbers for CTA/FAQ next-action copy only  

---

## 8. Contact ownership (do not collide)

| File | Owner | Rule |
| --- | --- | --- |
| `contact-config.js` | Contact / product facts | Only place to change phone, email, WeChat id |
| `contact.js` | Contact UI behavior | Do not reimplement popover/sheet/copy |
| Contact CSS in `styles.css` | Prefer leave; Visual may move to `src/sections/contact.css` only with Integration | Do not restyle from Animation/SEO |
| Contact mount markup in `index.html` | Integration when reshaping body | Keep `data-contact-*` contracts |

Visual/CTA sections should call existing openers (`data-contact-open="hero"|header|dock`) instead of inventing new chat widgets.

---

## 9. Acceptance questions the finished homepage must answer

1. What are you?  
2. What problem do you solve?  
3. Why SEO and GEO together?  
4. How do Health and Growth differ?  
5. What does a scan check?  
6. What do I get after a scan?  
7. How does this help long-term growth?  
8. Is my website a fit?  

Content in `en.ts` / `zh.ts` is written so Visual can answer all eight without new copy invention.
