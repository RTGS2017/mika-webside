const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, "src/knowledge/articles.js"), "utf8"), ctx);
const articles = ctx.window.KC_ARTICLES;

const cats = [
  { id: "seo", en: "SEO", zh: "SEO",
    enLead: "Crawl paths, canonicals, internal links, and coverage checks. Page count is not treated as growth.",
    zhLead: "抓取路径、规范网址、内链与覆盖检查。页面数量不被视为增长。" },
  { id: "geo", en: "GEO", zh: "GEO",
    enLead: "Make company, product, and answer information clear enough to understand and cite. No ranking or citation promises.",
    zhLead: "让公司、产品与回答信息清晰到可以被理解和引用。不承诺排名或被引用。" },
  { id: "search-visibility", en: "Search Visibility", zh: "搜索可见度",
    enLead: "Separate SEO and GEO health from the topics, questions, and markets a site has not covered yet.",
    zhLead: "把 SEO 与 GEO 的健康度，和尚未覆盖的主题、问题与市场分开看。" },
  { id: "content", en: "Content", zh: "内容",
    enLead: "Map buyer questions and product claims to pages that answer them with entities and evidence.",
    zhLead: "把买家问题和产品主张，映射到带有实体与证据、能直接回答的页面。" },
  { id: "technical", en: "Technical", zh: "技术",
    enLead: "How an audit becomes a diagnosis and a blueprint, and what a technical SEO/GEO crawler can inspect.",
    zhLead: "审计如何变成诊断和蓝图，以及技术 SEO/GEO 爬虫可以检查什么。" },
  { id: "research", en: "Research", zh: "研究",
    enLead: "Notes on how source-backed pages and bilingual sites are structured.",
    zhLead: "关于有来源页面和双语站点如何组织的笔记。" },
  { id: "open-source", en: "Open Source", zh: "开源",
    enLead: "What public crawler projects actually check, and how that maps to a website audit.",
    zhLead: "公开爬虫项目实际检查什么，以及这如何对应一次网站审计。" }
];

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function page(cat, lang) {
  const isZh = lang === "zh";
  const list = articles.filter((a) => a.category === cat.id);
  const name = isZh ? cat.zh : cat.en;
  const lead = isZh ? cat.zhLead : cat.enLead;
  const title = isZh ? `${name} | 知识中心 | Mika` : `${name} | Knowledge Center | Mika`;
  const enUrl = `https://mikaovo.ai/knowledge/${cat.id}/`;
  const zhUrl = `https://mikaovo.ai/zh/knowledge/${cat.id}/`;
  const url = isZh ? zhUrl : enUrl;
  const asset = isZh ? "../../../" : "../../";
  const home = isZh ? "/zh/" : "/";
  const knowledge = isZh ? "/zh/knowledge/" : "/knowledge/";
  const other = isZh ? `/knowledge/${cat.id}/` : `/zh/knowledge/${cat.id}/`;
  const otherLabel = isZh ? "EN" : "中文";
  const langAttr = isZh ? "zh-Hans" : "en";
  const cards = list.map((a) => {
    const copy = isZh ? a.zh : a.en;
    const href = isZh ? `/zh/knowledge/${a.slug}/` : `/knowledge/${a.slug}/`;
    return `          <a class="kc-card" href="${href}">
            <h3 class="kc-card-title">${esc(copy.title)}</h3>
            <p class="kc-card-blurb">${esc(copy.blurb)}</p>
            <span class="kc-card-link">${isZh ? "阅读指南 →" : "Read guide →"}</span>
          </a>`;
  }).join("\n");
  const itemList = list.map((a, i) => {
    const copy = isZh ? a.zh : a.en;
    const href = isZh ? `https://mikaovo.ai/zh/knowledge/${a.slug}/` : `https://mikaovo.ai/knowledge/${a.slug}/`;
    return `    {"@type":"ListItem","position":${i + 1},"name":${JSON.stringify(copy.title)},"url":${JSON.stringify(href)}}`;
  }).join(",\n");

  return `<!DOCTYPE html>
<html lang="${langAttr}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(lead)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="zh-Hans" href="${zhUrl}">
  <link rel="alternate" hreflang="x-default" href="${enUrl}">
  <link rel="sitemap" type="application/xml" title="Sitemap" href="https://mikaovo.ai/sitemap.xml">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(lead)}">
  <meta property="og:url" content="${url}">
  <meta name="theme-color" content="#070B14">
  <link rel="icon" href="${asset}assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${asset}styles.css">
  <link rel="stylesheet" href="${asset}src/knowledge/center.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "url": "${url}",
    "name": ${JSON.stringify(title)},
    "description": ${JSON.stringify(lead)},
    "inLanguage": "${langAttr}",
    "isPartOf": { "@id": "https://mikaovo.ai/knowledge/#page" },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
${itemList}
      ]
    }
  }
  </script>
</head>
<body class="kc-page">
  <a class="kc-skip" href="#main">${isZh ? "跳到正文" : "Skip to content"}</a>
  <header class="kc-header">
    <div class="kc-wrap kc-nav">
      <a class="kc-brand" href="${home}" aria-label="${isZh ? "Mika Visibility 首页" : "Mika Visibility home"}">
        <img src="${asset}assets/logo.svg" alt="Mika Visibility" width="22" height="22">
        <span>Mika <span>Visibility</span></span>
      </a>
      <nav class="kc-nav-links" aria-label="${isZh ? "主导航" : "Primary"}">
        <a href="${home}">${isZh ? "首页" : "Home"}</a>
        <a href="${knowledge}">${isZh ? "知识中心" : "Knowledge"}</a>
        <a href="${url.replace("https://mikaovo.ai", "")}" aria-current="page">${esc(name)}</a>
        <div class="kc-lang" aria-label="${isZh ? "语言" : "Language"}">
          <a href="${isZh ? other : url.replace("https://mikaovo.ai", "")}" ${isZh ? "" : 'aria-current="page"'}>EN</a>
          <a href="${isZh ? url.replace("https://mikaovo.ai", "") : other}" ${isZh ? 'aria-current="page"' : ""}>中文</a>
        </div>
      </nav>
    </div>
  </header>
  <main id="main">
    <section class="kc-hero" aria-labelledby="cat-page-title">
      <div class="kc-wrap">
        <p class="kc-hero-kicker"><a href="${knowledge}">${isZh ? "知识中心" : "Knowledge Center"}</a></p>
        <h1 id="cat-page-title">${esc(name)}</h1>
        <p class="kc-hero-lead">${esc(lead)}</p>
        <p class="kc-hero-note">${isZh ? "教学材料。Mika 不保证搜索排名或 AI 回答引用。" : "Educational material only. Mika does not guarantee search rankings or AI answer citations."}</p>
      </div>
    </section>
    <section class="kc-section" aria-labelledby="cat-list-title">
      <div class="kc-wrap">
        <div class="kc-section-head">
          <h2 class="kc-section-title" id="cat-list-title">${isZh ? `${esc(name)}指南` : `${esc(name)} guides`}</h2>
          <p class="kc-section-lead">${list.length} ${isZh ? "篇" : list.length === 1 ? "guide" : "guides"}</p>
        </div>
        <div class="kc-grid">
${cards}
        </div>
      </div>
    </section>
  </main>
</body>
</html>
`;
}

const sitemapBits = [];
for (const cat of cats) {
  for (const lang of ["en", "zh"]) {
    const rel = lang === "zh" ? path.join("zh", "knowledge", cat.id, "index.html") : path.join("knowledge", cat.id, "index.html");
    const dest = path.join(root, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, page(cat, lang), "utf8");
    console.log("wrote", rel);
  }
  const enUrl = `https://mikaovo.ai/knowledge/${cat.id}/`;
  const zhUrl = `https://mikaovo.ai/zh/knowledge/${cat.id}/`;
  sitemapBits.push(`  <url>
    <loc>${enUrl}</loc>
    <lastmod>2026-09-25</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="${zhUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />
  </url>
  <url>
    <loc>${zhUrl}</loc>
    <lastmod>2026-09-25</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="${zhUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />
  </url>`);
}

const sitemapPath = path.join(root, "sitemap.xml");
let xml = fs.readFileSync(sitemapPath, "utf8");
if (!xml.includes("https://mikaovo.ai/knowledge/seo/")) {
  xml = xml.replace("</urlset>", sitemapBits.join("\n") + "\n</urlset>\n");
  fs.writeFileSync(sitemapPath, xml, "utf8");
  console.log("sitemap updated");
}
