# Homepage motion upgrade

Upgrade notes for Mika homepage EN (`index.html`) + ZH (`zh/index.html`).

## What changed

### System

- Added `src/motion/core.js` + `src/motion/motion.css` → `window.MikaMotion` (Ambient / Scroll / Product / Interaction).
- Rewrote `src/animations/home.js` + `src/animations/home.css` to drive per-section signatures on MikaMotion.
- Section colors + dark Hero stage in `src/sections/home.css`.
- Nav: Knowledge → `/knowledge/` (EN) · `/zh/knowledge/` (ZH) as real `<a>` tags.
- Script/CSS links wired in both homepages only (body + head links). No Pages config, no package.json.

### Section signatures

| Section | Motion |
| --- | --- |
| Hero | **Visibility Field** dark stage `#101828`, faint grid, SEO blue stream + GEO purple stream → Website → Visibility; quiet start → draw once → scroll converge; four independent chips remain |
| Problem | Healthy / Growing converge; reveal **Health ≠ Growth** |
| Framework | Axes first, then cells; SEO blue / GEO purple; Health circle cue / Growth line cue (`data-growth`) |
| Deep Audit | Pipeline URL → Links → Topics → Entities → Questions → Evidence → Gaps → Blueprint; rAF counts to sample finals + disclaimer |
| Health vs Growth | Bars + counts (Health circle feel / Growth expansion fills) |
| Blueprint | Issue cards → root cause → ranked action; stops (no looping business numbers) |
| SEO Growth | Coverage bars, then opportunity nodes grow beside them |
| GEO | Question → Topic → Intent → Entity → Evidence → Direct Answer chain |
| Questions | Wall drifts horizontally while visible (static grid on mobile); match bridges Intent / Page / Answer |
| Entity | Nodes link in order; metrics count in |
| Multilingual | Product entity → language cards → Consistency |
| Methodology | SCAN → DIAGNOSE → BLUEPRINT → OPTIMIZE → RE-AUDIT **one lap** |
| FAQ | Answers remain in DOM; interaction only highlights open item |
| CTA | Your website → Search → Questions → Gaps → Blueprint, then existing contact mounts |

### Preserved product constraints

- Four independent scores only (no Overall Score).
- Contact mount points unchanged (`contact.js` untouched).
- Single `h1` in Hero.
- Sample dashboard disclaimer retained.
- Question wall copy unchanged (no AI/LLM/RAG/embedding/vector/agent terms added).

## Mobile & reduced motion

- **Mobile:** hide secondary SVG paths; question wall becomes grid (no continuous translate); shorter staggers; fewer decorative nodes.
- **`prefers-reduced-motion`:** all signatures jump to final state; counts set to `data-count` targets; bars full width; wall not scrolling.

## Files touched (allowed lane)

- `src/motion/**`
- `src/animations/**`
- `src/sections/home.css` (+ keep fragments in sync as needed)
- `index.html` / `zh/index.html` (body + style/script links)
- `docs/motion-system.md` / `docs/homepage-motion-upgrade.md`
- `main.js` comment only (nav behavior unchanged)
