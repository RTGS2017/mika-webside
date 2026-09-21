# Mika Visibility — homepage

Static homepage for the SEO + GEO visibility product.

Live site: https://rtgs2017.github.io/mika-webside/

Sitemap: https://rtgs2017.github.io/mika-webside/sitemap.xml

## Local preview

### Fastest

Double-click `index.html`, or in PowerShell:

```powershell
cd d:\NagaAssistance\b2bweb\site
start index.html
```

### Local server (recommended)

Some browsers restrict fonts or modules on `file://`. From this folder:

```powershell
cd d:\NagaAssistance\b2bweb\site
python -m http.server 4173
```

Open http://localhost:4173/

## GitHub Pages

1. Put this folder at the repository root **or** keep it as `site/` and set Pages to serve `/site` (or copy these files into `/docs`).
2. GitHub → Settings → Pages → Deploy from a branch → `main` / `/ (root)` or `/docs`.
3. If the site will live at `https://USER.github.io/REPO/`, keep relative paths (`./styles.css`, `./assets/logo.svg`) — they already are relative.
4. Replace the footer GitHub link with the real repository URL.

No Node, Vite, or npm is required for this homepage.

## Files

| File | Role |
| --- | --- |
| `index.html` | Homepage |
| `styles.css` | Visual system |
| `main.js` | Sticky nav, reveal, scan log, language tabs |
| `assets/logo.svg` | 2×2 visibility mark |
| `assets/favicon.svg` | Tab icon |
| `gemini-section-prompts.md` | Gemini prompts per section |
