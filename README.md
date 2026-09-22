# Mika Visibility — homepage

Static homepage for the SEO + GEO visibility product.

Live site: https://mikaovo.ai/

Sitemap: https://mikaovo.ai/sitemap.xml

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

Published from `main` at repository root. Custom domain: `mikaovo.ai`.

No Node, Vite, or npm is required for this homepage.

## Files

| File | Role |
| --- | --- |
| `index.html` | Homepage |
| `styles.css` | Visual system |
| `main.js` | Sticky nav, reveal, scan log, language tabs |
| `contact-config.js` | WhatsApp, email, and WeChat contact data |
| `contact.js` | Contact panels, copy, and keyboard behavior |
| `assets/logo.svg` | 2×2 visibility mark |
| `assets/favicon.svg` | Tab icon |
| `CNAME` | GitHub Pages custom domain |
| `sitemap.xml` | Google sitemap |
| `robots.txt` | Crawler rules |
