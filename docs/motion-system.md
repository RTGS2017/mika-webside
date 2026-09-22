# Mika Motion System

Classic-script motion layer for the static Mika site (`https://mikaovo.ai/`). No npm build, no Three.js / WebGL.

## Public API

```js
window.MikaMotion
```

Loaded from `src/motion/core.js`. Shared styles: `src/motion/motion.css`.

Homepage product signatures live in `src/animations/home.js` as `window.MikaHomeAnimations` and consume MikaMotion.

## Four layers

| Layer | Role | Typical tools |
| --- | --- | --- |
| **Ambient** | Quiet presence on stage (grid, field). Pause when off-screen. No spam loops. | CSS, IntersectionObserver, optional rAF |
| **Scroll** | Enter-once storytelling; optional 0–1 progress; while-visible pause | IntersectionObserver, scroll progress |
| **Product** | Counts, bars, pipeline beats that explain the product | rAF counts, staggered class toggles |
| **Interaction** | User-driven highlight only (FAQ). Answers stay in DOM for crawl | `toggle` events, classes |

## Rules

- Prefer CSS / SVG / IntersectionObserver / `requestAnimationFrame`.
- Leave viewport → pause continuous work.
- Mobile → fewer nodes / paths (`mm-mobile`, `data-mobile-skip`).
- `prefers-reduced-motion: reduce` → jump to **final readable state** (never hide copy).
- No long `setTimeout` fake crawl progress.
- Forbidden aesthetics: glass, neon, particle universes, robots/brains/stars.

## Colors (product)

- SEO = blue · GEO = purple · Health/complete = green · infrastructure = deep navy · structure = gray
- Dark stages (`#101828`): Hero Visibility Field, Deep Audit, CTA
- Light stages follow section tokens in `src/sections/home.css`

## Init order (homepage)

1. `contact-config.js` / `contact.js`
2. `src/motion/core.js`
3. `src/animations/home.js`
4. `main.js` (nav only; does not own section motion)
