/**
 * Renders /blog/ and /qa/ HTML from locked topics + batch JSON.
 * Content files: blogs-1.json, blogs-2.json, qas-1.json, qas-2.json
 * Each file is an array of { slug, en, zh } prose objects.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const SITE = "https://mikaovo.ai";
const DATE = "2026-09-27";

const CATS = {
  seo: { en: "SEO", zh: "SEO" },
  geo: { en: "GEO", zh: "GEO" },
  "search-visibility": { en: "Search Visibility", zh: "搜索可见度" },
  content: { en: "Content", zh: "内容" },
  technical: { en: "Technical", zh: "技术" },
  research: { en: "Research", zh: "研究" },
  "open-source": { en: "Open Source", zh: "开源" },
};

const HOME_ANCHOR = {
  seo: "#seo-growth",
  geo: "#geo",
  "search-visibility": "#framework",
  content: "#questions",
  technical: "#audit",
  research: "#methodology",
  "open-source": "#methodology",
};

/** slug, category, two existing knowledge-center slugs */
export const LOCK = {
  blogs: [
    ["four-independent-visibility-tracks", "search-visibility", "seo-health-vs-seo-growth", "geo-health-vs-geo-growth"],
    ["what-seo-health-asks-of-a-live-site", "seo", "what-is-a-website-seo-audit", "how-to-check-website-crawlability"],
    ["what-seo-growth-still-leaves-open", "seo", "how-to-find-content-gaps", "how-to-build-topic-coverage"],
    ["what-geo-health-means-for-answers", "geo", "what-is-geo", "how-to-audit-ai-search-visibility"],
    ["where-geo-growth-still-has-room", "geo", "geo-health-vs-geo-growth", "how-to-improve-citation-readiness"],
    ["from-scan-to-re-audit", "technical", "audit-diagnosis-blueprint", "what-is-a-website-seo-audit"],
    ["audit-then-diagnosis-then-blueprint", "technical", "audit-diagnosis-blueprint", "seo-health-vs-seo-growth"],
    ["question-coverage-answered-partial-uncovered", "content", "question-coverage-for-websites", "how-to-find-content-gaps"],
    ["entity-graph-company-to-evidence", "geo", "entity-evidence-answerability", "how-to-build-consistent-entity-information"],
    ["citation-readiness-without-a-guarantee", "geo", "how-to-improve-citation-readiness", "what-makes-a-page-easier-to-reference"],
    ["direct-answers-on-product-pages", "content", "how-to-answer-buyer-questions-directly", "how-to-build-product-page-content"],
    ["consistent-facts-across-languages", "search-visibility", "multilingual-search-visibility", "how-source-backed-bilingual-sites-are-structured"],
    ["internal-links-and-orphan-discovery", "seo", "how-to-find-orphan-pages", "how-to-find-broken-internal-links"],
    ["canonical-hreflang-and-sitemap-signals", "technical", "how-to-audit-canonical-urls", "how-to-check-hreflang"],
    ["near-duplicates-versus-real-coverage", "content", "how-to-detect-duplicate-content", "why-page-count-does-not-equal-seo-growth"],
    ["commercial-intent-your-pages-can-support", "seo", "how-to-identify-commercial-search-opportunities", "how-to-map-search-intent"],
    ["what-open-source-crawlers-surface", "open-source", "what-open-source-seo-crawlers-check", "what-a-technical-seo-geo-crawler-inspects"],
    ["source-backed-page-pattern", "research", "how-geo-handbooks-structure-source-backed-pages", "how-source-backed-bilingual-sites-are-structured"],
    ["company-information-buyers-can-verify", "geo", "how-to-make-company-information-clearer", "how-to-build-evidence-around-product-claims"],
    ["why-a-healthy-site-can-still-be-hard-to-find", "search-visibility", "seo-health-vs-seo-growth", "why-page-count-does-not-equal-seo-growth"],
  ],
  qas: [
    ["does-mika-guarantee-search-rankings", "search-visibility", "why-page-count-does-not-equal-seo-growth", "seo-health-vs-seo-growth"],
    ["does-mika-guarantee-ai-citations", "geo", "how-to-improve-citation-readiness", "what-is-geo"],
    ["what-is-seo-health", "seo", "seo-health-vs-seo-growth", "what-is-a-website-seo-audit"],
    ["what-is-seo-growth", "seo", "seo-health-vs-seo-growth", "how-to-find-content-gaps"],
    ["what-is-geo-health", "geo", "geo-health-vs-geo-growth", "what-is-geo"],
    ["what-is-geo-growth", "geo", "geo-health-vs-geo-growth", "how-to-improve-citation-readiness"],
    ["is-there-an-overall-blended-score", "search-visibility", "seo-health-vs-seo-growth", "geo-health-vs-geo-growth"],
    ["does-geo-replace-seo", "geo", "what-is-geo", "seo-health-vs-seo-growth"],
    ["what-is-an-orphan-page", "seo", "how-to-find-orphan-pages", "how-to-find-broken-internal-links"],
    ["what-is-a-canonical-url", "technical", "how-to-audit-canonical-urls", "how-to-analyze-xml-sitemaps"],
    ["what-is-hreflang-for", "technical", "how-to-check-hreflang", "multilingual-search-visibility"],
    ["why-avoid-an-en-url-prefix", "search-visibility", "multilingual-search-visibility", "how-source-backed-bilingual-sites-are-structured"],
    ["what-is-an-xml-sitemap-for", "technical", "how-to-analyze-xml-sitemaps", "how-to-check-website-crawlability"],
    ["what-is-a-content-gap", "content", "how-to-find-content-gaps", "question-coverage-for-websites"],
    ["what-is-search-intent", "seo", "how-to-map-search-intent", "how-to-identify-commercial-search-opportunities"],
    ["what-is-topic-coverage", "content", "how-to-build-topic-coverage", "how-to-find-content-gaps"],
    ["what-is-citation-readiness", "geo", "how-to-improve-citation-readiness", "what-makes-a-page-easier-to-reference"],
    ["what-is-a-website-entity", "geo", "entity-evidence-answerability", "how-to-build-consistent-entity-information"],
    ["what-counts-as-evidence-for-a-claim", "geo", "how-to-build-evidence-around-product-claims", "entity-evidence-answerability"],
    ["what-is-answerability", "content", "entity-evidence-answerability", "how-to-answer-buyer-questions-directly"],
    ["what-is-a-thin-mirror-page", "search-visibility", "multilingual-search-visibility", "how-to-expand-seo-into-new-markets"],
    ["what-does-a-website-seo-audit-review", "seo", "what-is-a-website-seo-audit", "audit-diagnosis-blueprint"],
    ["what-does-crawlability-mean", "technical", "how-to-check-website-crawlability", "what-a-technical-seo-geo-crawler-inspects"],
    ["how-do-broken-internal-links-affect-discovery", "seo", "how-to-find-broken-internal-links", "how-to-find-orphan-pages"],
    ["what-is-near-duplicate-content", "content", "how-to-detect-duplicate-content", "why-page-count-does-not-equal-seo-growth"],
    ["what-is-a-commercial-search-opportunity", "seo", "how-to-identify-commercial-search-opportunities", "how-to-map-search-intent"],
    ["what-should-a-product-page-state", "content", "how-to-build-product-page-content", "how-to-structure-product-information"],
    ["what-should-company-information-include", "geo", "how-to-make-company-information-clearer", "how-to-build-consistent-entity-information"],
    ["what-makes-a-page-easier-to-reference", "geo", "what-makes-a-page-easier-to-reference", "how-to-improve-citation-readiness"],
    ["what-is-a-direct-answer-block", "content", "how-to-answer-buyer-questions-directly", "question-coverage-for-websites"],
    ["what-does-an-ai-search-visibility-audit-check", "geo", "how-to-audit-ai-search-visibility", "what-is-geo"],
    ["what-do-open-source-seo-crawlers-check", "open-source", "what-open-source-seo-crawlers-check", "what-a-technical-seo-geo-crawler-inspects"],
    ["what-does-a-combined-seo-geo-crawler-inspect", "technical", "what-a-technical-seo-geo-crawler-inspects", "how-to-audit-ai-search-visibility"],
    ["how-should-a-source-backed-page-be-ordered", "research", "how-geo-handbooks-structure-source-backed-pages", "how-source-backed-bilingual-sites-are-structured"],
    ["how-should-bilingual-pages-share-facts", "research", "how-source-backed-bilingual-sites-are-structured", "multilingual-search-visibility"],
    ["what-is-an-audit-diagnosis-blueprint", "technical", "audit-diagnosis-blueprint", "what-is-a-website-seo-audit"],
    ["does-more-urls-mean-seo-growth", "seo", "why-page-count-does-not-equal-seo-growth", "how-to-build-topic-coverage"],
    ["what-is-an-indexation-mismatch", "technical", "how-to-analyze-xml-sitemaps", "how-to-audit-canonical-urls"],
    ["what-is-a-crawl-path", "technical", "how-to-check-website-crawlability", "how-to-find-orphan-pages"],
    ["which-status-codes-matter-for-crawling", "technical", "how-to-check-website-crawlability", "how-to-find-broken-internal-links"],
    ["what-are-informational-commercial-and-transactional-intents", "seo", "how-to-map-search-intent", "how-to-identify-commercial-search-opportunities"],
    ["what-should-you-fix-before-a-new-market", "search-visibility", "how-to-expand-seo-into-new-markets", "multilingual-search-visibility"],
    ["what-is-question-coverage", "content", "question-coverage-for-websites", "how-to-find-content-gaps"],
    ["what-is-partial-question-coverage", "content", "question-coverage-for-websites", "how-to-answer-buyer-questions-directly"],
    ["what-are-the-four-geo-building-blocks", "geo", "what-is-geo", "entity-evidence-answerability"],
    ["what-does-re-audit-mean", "technical", "audit-diagnosis-blueprint", "what-is-a-website-seo-audit"],
    ["what-does-mika-report-instead-of-a-mystery-kpi", "search-visibility", "seo-health-vs-seo-growth", "audit-diagnosis-blueprint"],
    ["what-is-not-promised-about-ai-overviews", "geo", "what-is-geo", "how-to-audit-ai-search-visibility"],
    ["how-do-internal-links-support-discovery", "seo", "how-to-find-orphan-pages", "how-to-find-broken-internal-links"],
    ["what-fields-should-match-across-languages", "search-visibility", "multilingual-search-visibility", "how-to-build-consistent-entity-information"],
  ],
};

const KT = {
  "what-is-a-website-seo-audit": ["What Is a Website SEO Audit", "什么是网站 SEO 审计"],
  "how-to-check-website-crawlability": ["How to Check Website Crawlability", "如何检查网站可抓取性"],
  "how-to-find-broken-internal-links": ["How to Find Broken Internal Links", "如何查找失效内链"],
  "how-to-audit-canonical-urls": ["How to Audit Canonical URLs", "如何审计规范 URL（Canonical）"],
  "how-to-check-hreflang": ["How to Check Hreflang", "如何检查 Hreflang"],
  "how-to-analyze-xml-sitemaps": ["How to Analyze XML Sitemaps", "如何分析 XML Sitemap"],
  "how-to-find-orphan-pages": ["How to Find Orphan Pages", "如何发现孤立页面"],
  "how-to-detect-duplicate-content": ["How to Detect Duplicate Content", "如何检测重复内容"],
  "how-to-find-content-gaps": ["How to Find Content Gaps", "如何发现内容缺口"],
  "how-to-map-search-intent": ["How to Map Search Intent", "如何映射搜索意图"],
  "how-to-build-topic-coverage": ["How to Build Topic Coverage", "如何建设主题覆盖"],
  "how-to-identify-commercial-search-opportunities": ["How to Identify Commercial Search Opportunities", "如何识别商业搜索机会"],
  "how-to-build-product-page-content": ["How to Build Product Page Content", "如何撰写产品页内容"],
  "how-to-expand-seo-into-new-markets": ["How to Expand SEO into New Markets", "如何把 SEO 扩展到新市场"],
  "why-page-count-does-not-equal-seo-growth": ["Why Page Count Does Not Equal SEO Growth", "为什么页面数量不等于 SEO 增长"],
  "what-is-geo": ["What Is GEO", "什么是 GEO"],
  "how-to-make-company-information-clearer": ["How to Make Company Information Clearer", "如何让公司信息更清晰"],
  "how-to-structure-product-information": ["How to Structure Product Information", "如何结构化产品信息"],
  "how-to-answer-buyer-questions-directly": ["How to Answer Buyer Questions Directly", "如何直接回答买家问题"],
  "how-to-build-evidence-around-product-claims": ["How to Build Evidence Around Product Claims", "如何为产品主张建立证据"],
  "how-to-improve-citation-readiness": ["How to Improve Citation Readiness", "如何提升被引用就绪度"],
  "how-to-build-consistent-entity-information": ["How to Build Consistent Entity Information", "如何建设一致的实体信息"],
  "how-to-audit-ai-search-visibility": ["How to Audit AI Search Visibility", "如何审计 AI 搜索可见度"],
  "what-makes-a-page-easier-to-reference": ["What Makes a Page Easier to Reference", "什么让页面更容易被引用"],
  "seo-health-vs-seo-growth": ["SEO Health vs SEO Growth", "SEO 健康 vs SEO 增长"],
  "geo-health-vs-geo-growth": ["GEO Health vs GEO Growth", "GEO 健康 vs GEO 增长"],
  "audit-diagnosis-blueprint": ["Audit Diagnosis Blueprint", "审计诊断蓝图"],
  "question-coverage-for-websites": ["Question Coverage for Websites", "网站的问题覆盖"],
  "entity-evidence-answerability": ["Entity, Evidence & Answerability", "实体、证据与可答性"],
  "multilingual-search-visibility": ["Multilingual Search Visibility", "多语言搜索可见度"],
  "what-open-source-seo-crawlers-check": ["What Open-Source SEO Crawlers Check", "开源 SEO 爬虫检查什么"],
  "how-geo-handbooks-structure-source-backed-pages": ["How GEO Handbooks Structure Source-Backed Pages", "GEO 手册如何组织有来源的页面"],
  "what-a-technical-seo-geo-crawler-inspects": ["What a Technical SEO/GEO Crawler Inspects", "技术 SEO/GEO 爬虫会检查什么"],
  "how-source-backed-bilingual-sites-are-structured": ["How Source-Backed Bilingual Sites Are Structured", "有来源的双语站点如何组织"],
};

const UI = {
  en: {
    skip: "Skip to content",
    home: "Home",
    knowledge: "Knowledge",
    blog: "Blog",
    qa: "Q&A",
    contact: "Contact",
    onPage: "On this page",
    def: "Definition",
    short: "Short answer",
    check: "What to check",
    not: "What this does not claim",
    example: "A practical example",
    faq: "FAQ",
    related: "Related guides",
    sources: "Sources",
    next: "Next step",
    note: "Educational material only. Mika does not guarantee search rankings or AI answer citations.",
    cta: "Run a structured SEO + GEO audit to see health findings, growth gaps, and a blueprint you can act on.",
    ctaLink: "Start on Mika",
    ctaNote: "Clearer entities, answers, evidence, and context make pages easier to understand and reference. Results in any answer product are not guaranteed.",
    read: "Read →",
    faqQ1: "What is the short answer?",
    faqQ2: "What does this page not claim?",
    date: "September 27, 2026",
    blogH1: "Blog",
    qaH1: "Questions and answers",
    blogLead: "Separate notes on checks already described in the Knowledge Center. Each note is its own page so it can be crawled and indexed on its own.",
    qaLead: "Short answers to questions already covered by Mika’s guides. Each answer is its own page so it can be crawled and indexed on its own.",
    blogTitle: "Blog | Mika Visibility",
    qaTitle: "Q&A | Mika Visibility",
    blogDesc: "Notes on SEO health, GEO, crawl signals, question coverage, and citation readiness. Mika does not guarantee rankings or AI citations.",
    qaDesc: "Direct answers about SEO audits, GEO, entities, evidence, and multilingual pages. Mika does not guarantee rankings or AI citations.",
    relatedLead: "Separate pages that restate checks from these guides. They do not add ranking or citation promises.",
    relatedTitle: "Related blog and Q&A",
    sourceHome: "Mika Visibility homepage",
    crumbBlog: "Blog",
    crumbQa: "Q&A",
  },
  zh: {
    skip: "跳到正文",
    home: "首页",
    knowledge: "知识中心",
    blog: "博客",
    qa: "问答",
    contact: "联系",
    onPage: "本页目录",
    def: "定义",
    short: "短答",
    check: "要检查什么",
    not: "它不声称什么",
    example: "一个结构示例",
    faq: "常见问题",
    related: "相关指南",
    sources: "来源",
    next: "下一步",
    note: "仅供学习参考。Mika 不保证搜索排名，也不保证被 AI 回答引用。",
    cta: "做一次结构化的 SEO + GEO 审计，查看健康发现、增长缺口和可以执行的蓝图。",
    ctaLink: "从 Mika 开始",
    ctaNote: "更清晰的实体、答案、证据和上下文，会让页面更容易被理解与引用。任何回答产品中的结果都不作保证。",
    read: "阅读 →",
    faqQ1: "短答是什么？",
    faqQ2: "这一页不声称什么？",
    date: "2026年9月27日",
    blogH1: "博客",
    qaH1: "问答",
    blogLead: "这些笔记复述知识中心已经写过的检查项。每一篇都是独立页面，便于单独抓取和索引。",
    qaLead: "这些短答对应知识中心已经覆盖的问题。每一则都是独立页面，便于单独抓取和索引。",
    blogTitle: "博客 | Mika Visibility",
    qaTitle: "问答 | Mika Visibility",
    blogDesc: "关于 SEO 健康、GEO、抓取信号、问题覆盖与引用就绪度的笔记。Mika 不保证排名或 AI 引用。",
    qaDesc: "关于 SEO 审计、GEO、实体、证据与多语言页面的直接回答。Mika 不保证排名或 AI 引用。",
    relatedLead: "这些独立页面复述本栏指南里的检查项，不新增排名或引用承诺。",
    relatedTitle: "相关博客与问答",
    sourceHome: "Mika Visibility 首页",
    crumbBlog: "博客",
    crumbQa: "问答",
  },
};

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonLd(obj) {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

function prefixFor(urlPath) {
  const n = urlPath.split("/").filter(Boolean).length;
  return "../".repeat(n);
}

function loadBatches() {
  const files = ["blogs-1.json", "blogs-2.json", "qas-1.json", "qas-2.json"];
  const bySlug = new Map();
  for (const file of files) {
    const full = path.join(__dirname, file);
    if (!fs.existsSync(full)) {
      console.error("Missing content file: " + full);
      process.exit(1);
    }
    const data = JSON.parse(fs.readFileSync(full, "utf8"));
    if (!Array.isArray(data)) throw new Error(file + " is not an array");
    for (const row of data) {
      if (bySlug.has(row.slug)) throw new Error("Duplicate slug in content: " + row.slug);
      bySlug.set(row.slug, row);
    }
  }
  return bySlug;
}

function assertCopy(slug, lang, copy) {
  const need = ["title", "description", "h1", "blurb", "lead", "definition", "shortAnswer", "doesNotClaim", "example"];
  for (const key of need) {
    if (!copy || typeof copy[key] !== "string" || copy[key].trim().length < 20) {
      throw new Error(`${slug} ${lang}.${key} missing or too short`);
    }
  }
  if (!Array.isArray(copy.checks) || copy.checks.length !== 4) {
    throw new Error(`${slug} ${lang}.checks must have 4 items`);
  }
  for (const c of copy.checks) {
    if (typeof c !== "string" || c.trim().length < 8) throw new Error(`${slug} ${lang} check too short`);
  }
  const min = lang === "en" ? 80 : 40;
  for (const key of ["definition", "shortAnswer", "doesNotClaim", "example"]) {
    if (copy[key].trim().length < min) throw new Error(`${slug} ${lang}.${key} below ${min} chars`);
  }
  if (lang === "en" && !/does not guarantee/i.test(copy.doesNotClaim)) {
    throw new Error(`${slug} en.doesNotClaim must include "does not guarantee"`);
  }
  if (lang === "zh" && !copy.doesNotClaim.includes("不保证")) {
    throw new Error(`${slug} zh.doesNotClaim must include 不保证`);
  }
  const banned = ["128 pages", "386", "74%", "216 questions", "稳进", "Top 3", "保证排名", "保证被引用", "guaranteed ranking"];
  const blob = JSON.stringify(copy);
  for (const b of banned) {
    if (blob.includes(b)) throw new Error(`${slug} ${lang} contains banned token: ${b}`);
  }
}

function merge(bySlug, kind) {
  return LOCK[kind].map(([slug, category, k1, k2]) => {
    const row = bySlug.get(slug);
    if (!row) throw new Error("Missing prose for " + slug);
    assertCopy(slug, "en", row.en);
    assertCopy(slug, "zh", row.zh);
    if (!KT[k1] || !KT[k2]) throw new Error("Unknown knowledge slug for " + slug);
    return { slug, category, knowledge: [k1, k2], en: row.en, zh: row.zh, kind: kind === "blogs" ? "blog" : "qa" };
  });
}

function writeFile(rel, html) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, "utf8");
}

function headCommon({ lang, title, description, canonical, enHref, zhHref, prefix, ld, ogType }) {
  const ui = UI[lang];
  const locale = lang === "en" ? "en_US" : "zh_CN";
  const alt = lang === "en" ? "zh_CN" : "en_US";
  return `<!DOCTYPE html>
<html lang="${lang === "en" ? "en" : "zh-Hans"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="en" href="${enHref}">
  <link rel="alternate" hreflang="zh-Hans" href="${zhHref}">
  <link rel="alternate" hreflang="x-default" href="${enHref}">
  <link rel="sitemap" type="application/xml" title="Sitemap" href="${SITE}/sitemap.xml">
  <meta property="og:type" content="${ogType}">
  <meta property="og:locale" content="${locale}">
  <meta property="og:locale:alternate" content="${alt}">
  <meta property="og:site_name" content="Mika">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="theme-color" content="#070B14">
  <link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${prefix}styles.css">
  <link rel="stylesheet" href="${prefix}src/knowledge/center.css">
  <script type="application/ld+json">
${jsonLd(ld)}
  </script>
</head>`;
}

function chromeHeader({ lang, kind, slug, prefix, current }) {
  const ui = UI[lang];
  const base = lang === "en" ? "" : "/zh";
  const enBase = kind === "index" ? `/${current}/` : `/${kind}/${slug}/`;
  const zhBase = kind === "index" ? `/zh/${current}/` : `/zh/${kind}/${slug}/`;
  const homeHref = lang === "en" ? "/" : "/zh/";
  const knowHref = lang === "en" ? "/knowledge/" : "/zh/knowledge/";
  const blogHref = lang === "en" ? "/blog/" : "/zh/blog/";
  const qaHref = lang === "en" ? "/qa/" : "/zh/qa/";
  const cur = (name) => (current === name ? ' aria-current="page"' : "");
  return `<body class="kc-page">
  <a class="kc-skip" href="#main">${ui.skip}</a>
  <header class="kc-header">
    <div class="kc-wrap kc-nav">
      <a class="kc-brand" href="${homeHref}" aria-label="Mika Visibility">
        <img src="${prefix}assets/logo.svg" alt="Mika Visibility" width="22" height="22">
        <span>Mika <span>Visibility</span></span>
      </a>
      <nav class="kc-nav-links" aria-label="${lang === "en" ? "Primary" : "主导航"}">
        <a href="${homeHref}">${ui.home}</a>
        <a href="${knowHref}">${ui.knowledge}</a>
        <a href="${blogHref}"${cur("blog")}>${esc(ui.blog)}</a>
        <a href="${qaHref}"${cur("qa")}>${esc(ui.qa)}</a>
        <div class="kc-lang" aria-label="${lang === "en" ? "Language" : "语言"}">
          <a href="${enBase}"${lang === "en" ? ' aria-current="page"' : ""}>EN</a>
          <a href="${zhBase}"${lang === "zh" ? ' aria-current="page"' : ""}>中文</a>
        </div>
        <div class="kc-nav-contact">
          <button type="button" class="kc-nav-contact-btn" data-contact-open="header" aria-expanded="false" aria-haspopup="dialog" aria-controls="contact-popover-nav">${ui.contact}</button>
          <div id="contact-popover-nav" class="contact-popover contact-popover-nav" hidden></div>
        </div>
      </nav>
    </div>
  </header>`;
}

function chromeFooter({ lang, prefix }) {
  const ui = UI[lang];
  const homeHref = lang === "en" ? "/" : "/zh/";
  const knowHref = lang === "en" ? "/knowledge/" : "/zh/knowledge/";
  const blogHref = lang === "en" ? "/blog/" : "/zh/blog/";
  const qaHref = lang === "en" ? "/qa/" : "/zh/qa/";
  return `  <footer class="kc-footer">
    <div class="kc-wrap">
      <p><a href="${homeHref}">Mika Visibility</a> · <a href="${knowHref}">${esc(ui.knowledge)}</a> · <a href="${blogHref}">${esc(ui.blog)}</a> · <a href="${qaHref}">${esc(ui.qa)}</a></p>
      <div data-contact-footer></div>
    </div>
  </footer>
  <div class="contact-dock">
    <div id="contact-popover-dock" class="contact-popover contact-popover-dock" hidden></div>
    <button type="button" class="contact-dock-btn" data-contact-open="dock" aria-expanded="false" aria-haspopup="dialog" aria-controls="contact-popover-dock">${ui.contact}</button>
  </div>
  <div id="contact-sheet" class="contact-sheet" hidden role="dialog" aria-modal="true" aria-labelledby="contact-sheet-title">
    <div class="contact-sheet-card"></div>
  </div>
  <div id="contact-live" class="kc-sr" aria-live="polite"></div>
  <script src="${prefix}contact-config.js"></script>
  <script src="${prefix}contact.js"></script>
</body>
</html>`;
}

function renderArticle(item, lang, siblings) {
  const ui = UI[lang];
  const copy = item[lang];
  const slug = item.slug;
  const kind = item.kind;
  const urlPath = `${lang === "zh" ? "/zh" : ""}/${kind}/${slug}/`;
  const enHref = `${SITE}/${kind}/${slug}/`;
  const zhHref = `${SITE}/zh/${kind}/${slug}/`;
  const canonical = lang === "en" ? enHref : zhHref;
  const prefix = prefixFor(urlPath);
  const home = lang === "en" ? `${SITE}/` : `${SITE}/zh/`;
  const know = lang === "en" ? `${SITE}/knowledge/` : `${SITE}/zh/knowledge/`;
  const indexName = kind === "blog" ? ui.crumbBlog : ui.crumbQa;
  const indexHref = lang === "en" ? `${SITE}/${kind}/` : `${SITE}/zh/${kind}/`;
  const title = `${copy.title} | Mika ${kind === "blog" ? (lang === "en" ? "Blog" : "博客") : (lang === "en" ? "Q&A" : "问答")}`;
  const cat = CATS[item.category][lang];
  const kLang = lang === "en" ? 0 : 1;
  const knowPrefix = lang === "en" ? "/knowledge/" : "/zh/knowledge/";
  const pagePrefix = lang === "en" ? `/${kind}/` : `/zh/${kind}/`;
  const links = [
    ...item.knowledge.map((s) => ({ href: `${knowPrefix}${s}/`, name: KT[s][kLang] })),
    ...siblings.map((s) => ({ href: `${pagePrefix}${s.slug}/`, name: s[lang].h1 })),
  ];
  const anchor = (lang === "en" ? "" : "/zh/") + HOME_ANCHOR[item.category];
  const anchorLabel = lang === "en" ? "Mika homepage — " + CATS[item.category].en : "Mika 首页 — " + CATS[item.category].zh;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": kind === "qa" ? "FAQPage" : "Article",
        "@id": canonical + (kind === "qa" ? "#faq" : "#article"),
        headline: copy.h1,
        name: copy.h1,
        description: copy.description,
        datePublished: DATE,
        dateModified: DATE,
        inLanguage: lang === "en" ? "en" : "zh-Hans",
        author: { "@type": "Organization", name: "Mika", url: SITE + "/" },
        publisher: { "@type": "Organization", name: "Mika", url: SITE + "/", logo: { "@type": "ImageObject", url: SITE + "/assets/logo.svg" } },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        mainEntity: [
          { "@type": "Question", name: copy.h1, acceptedAnswer: { "@type": "Answer", text: copy.shortAnswer } },
          { "@type": "Question", name: ui.faqQ2, acceptedAnswer: { "@type": "Answer", text: copy.doesNotClaim } },
        ],
        isPartOf: { "@type": "WebSite", name: "Mika", url: SITE + "/" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": canonical + "#breadcrumb",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ui.home, item: home },
          { "@type": "ListItem", position: 2, name: indexName, item: indexHref },
          { "@type": "ListItem", position: 3, name: copy.h1, item: canonical },
        ],
      },
    ],
  };
  const checks = copy.checks.map((c) => `            <li>${esc(c)}</li>`).join("\n");
  const related = links.map((l) => `            <li><a href="${l.href}">${esc(l.name)}</a></li>`).join("\n");
  return `${headCommon({ lang, title, description: copy.description, canonical, enHref, zhHref, prefix, ld, ogType: "article" })}
${chromeHeader({ lang, kind, slug, prefix, current: "" })}
  <main id="main">
    <header class="kc-hero">
      <div class="kc-wrap">
        <p class="kc-meta"><span>${esc(cat)}</span> · <time datetime="${DATE}">${ui.date}</time></p>
        <h1>${esc(copy.h1)}</h1>
        <p class="kc-hero-lead">${esc(copy.lead)}</p>
        <p class="kc-hero-note">${ui.note}</p>
      </div>
    </header>
    <div class="kc-wrap kc-layout">
      <aside class="kc-toc" aria-label="${ui.onPage}">
        <p>${ui.onPage}</p>
        <nav>
          <ol>
            <li><a href="#definition">${ui.def}</a></li>
            <li><a href="#short-answer">${ui.short}</a></li>
            <li><a href="#what-to-check">${ui.check}</a></li>
            <li><a href="#does-not-claim">${ui.not}</a></li>
            <li><a href="#example">${ui.example}</a></li>
            <li><a href="#faq">${ui.faq}</a></li>
          </ol>
        </nav>
      </aside>
      <article class="kc-body">
        <section id="definition">
          <h2>${ui.def}</h2>
          <p>${esc(copy.definition)}</p>
        </section>
        <section id="short-answer">
          <h2>${ui.short}</h2>
          <p>${esc(copy.shortAnswer)}</p>
        </section>
        <section id="what-to-check">
          <h2>${ui.check}</h2>
          <ul>
${checks}
          </ul>
        </section>
        <section id="does-not-claim">
          <h2>${ui.not}</h2>
          <p>${esc(copy.doesNotClaim)}</p>
        </section>
        <section id="example">
          <h2>${ui.example}</h2>
          <p>${esc(copy.example)}</p>
        </section>
        <section class="kc-faq" id="faq" aria-labelledby="faq-title">
          <h2 id="faq-title">${ui.faq}</h2>
          <details>
            <summary>${esc(ui.faqQ1)}</summary>
            <p>${esc(copy.shortAnswer)}</p>
          </details>
          <details>
            <summary>${esc(ui.faqQ2)}</summary>
            <p>${esc(copy.doesNotClaim)}</p>
          </details>
        </section>
        <section class="kc-related" aria-labelledby="related-title">
          <h2 id="related-title">${ui.related}</h2>
          <ul>
${related}
            <li><a href="${anchor}">${esc(anchorLabel)}</a></li>
          </ul>
        </section>
        <aside class="kc-sources" aria-labelledby="sources-title">
          <h2 id="sources-title">${ui.sources}</h2>
          <ol>
            <li><a href="${knowPrefix}${item.knowledge[0]}/">${esc(KT[item.knowledge[0]][kLang])}</a> — ${lang === "en" ? "Knowledge Center guide this note restates." : "本页复述的知识中心指南。"}</li>
            <li><a href="${lang === "en" ? "/" : "/zh/"}${HOME_ANCHOR[item.category]}">${esc(ui.sourceHome)}</a> — ${lang === "en" ? "Product framing for this topic. Sample interface counts on the homepage are illustrative, not a case study." : "本主题对应的产品说明。首页界面中的示例数字只是示意，不是案例数据。"}</li>
          </ol>
        </aside>
        <section class="kc-cta" aria-labelledby="cta-title">
          <h2 id="cta-title">${ui.next}</h2>
          <p>${ui.cta}</p>
          <p><a href="${lang === "en" ? "/#cta" : "/zh/#cta"}">${ui.ctaLink}</a></p>
          <p>${ui.ctaNote}</p>
          <div class="contact-cards" data-contact-cards></div>
        </section>
      </article>
    </div>
  </main>
${chromeFooter({ lang, prefix })}
`;
}

function renderIndex(kind, lang, items) {
  const ui = UI[lang];
  const urlPath = `${lang === "zh" ? "/zh" : ""}/${kind}/`;
  const enHref = `${SITE}/${kind}/`;
  const zhHref = `${SITE}/zh/${kind}/`;
  const canonical = lang === "en" ? enHref : zhHref;
  const prefix = prefixFor(urlPath);
  const title = kind === "blog" ? ui.blogTitle : ui.qaTitle;
  const description = kind === "blog" ? ui.blogDesc : ui.qaDesc;
  const h1 = kind === "blog" ? ui.blogH1 : ui.qaH1;
  const lead = kind === "blog" ? ui.blogLead : ui.qaLead;
  const pagePrefix = lang === "en" ? `/${kind}/` : `/zh/${kind}/`;
  const cards = items.map((item) => {
    const copy = item[lang];
    return `          <a class="kc-card" href="${pagePrefix}${item.slug}/">
            <div class="kc-card-meta"><span class="kc-tag">${esc(CATS[item.category][lang])}</span></div>
            <h3 class="kc-card-title">${esc(copy.h1)}</h3>
            <p class="kc-card-blurb">${esc(copy.blurb)}</p>
            <span class="kc-card-link">${ui.read}</span>
          </a>`;
  }).join("\n");
  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": canonical + "#page",
    url: canonical,
    name: title,
    description,
    inLanguage: lang === "en" ? "en" : "zh-Hans",
    isPartOf: { "@type": "WebSite", name: "Mika", url: SITE + "/" },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item[lang].h1,
        url: (lang === "en" ? `${SITE}/${kind}/` : `${SITE}/zh/${kind}/`) + item.slug + "/",
      })),
    },
  };
  return `${headCommon({ lang, title, description, canonical, enHref, zhHref, prefix, ld, ogType: "website" })}
${chromeHeader({ lang, kind: "index", slug: "", prefix, current: kind })}
  <main id="main">
    <section class="kc-hero" aria-labelledby="index-title">
      <div class="kc-wrap">
        <p class="kc-hero-kicker"><a href="${lang === "en" ? "/knowledge/" : "/zh/knowledge/"}">${ui.knowledge}</a></p>
        <h1 id="index-title">${h1}</h1>
        <p class="kc-hero-lead">${lead}</p>
        <p class="kc-hero-note">${ui.note}</p>
      </div>
    </section>
    <section class="kc-section" aria-labelledby="index-list-title">
      <div class="kc-wrap">
        <div class="kc-section-head">
          <h2 class="kc-section-title" id="index-list-title">${kind === "blog" ? (lang === "en" ? "All posts" : "全部文章") : (lang === "en" ? "All answers" : "全部回答")}</h2>
          <p class="kc-section-lead">${items.length}</p>
        </div>
        <div class="kc-grid">
${cards}
        </div>
      </div>
    </section>
  </main>
${chromeFooter({ lang, prefix })}
`;
}

function siblingsOf(list, index) {
  return [1, 2].map((step) => list[(index + step) % list.length]);
}

function sitemapEntries(blogs, qas) {
  const rows = [];
  const add = (enPath, zhPath, priority) => {
    const en = SITE + enPath;
    const zh = SITE + zhPath;
    for (const loc of [en, zh]) {
      rows.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${en}" />
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="${zh}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}" />
  </url>`);
    }
  };
  add("/blog/", "/zh/blog/", "0.7");
  add("/qa/", "/zh/qa/", "0.7");
  for (const item of blogs) add(`/blog/${item.slug}/`, `/zh/blog/${item.slug}/`, "0.6");
  for (const item of qas) add(`/qa/${item.slug}/`, `/zh/qa/${item.slug}/`, "0.6");
  return rows;
}

function patchSitemap(entries) {
  const file = path.join(ROOT, "sitemap.xml");
  let xml = fs.readFileSync(file, "utf8");
  const before = (xml.match(/<loc>/g) || []).length;
  const block = `  <!-- blog-qa-start -->\n${entries.join("\n")}\n  <!-- blog-qa-end -->\n`;
  if (xml.includes("<!-- blog-qa-start -->")) {
    xml = xml.replace(/  <!-- blog-qa-start -->[\s\S]*?  <!-- blog-qa-end -->\n/, block);
  } else {
    if (!xml.includes("</urlset>")) throw new Error("sitemap missing urlset");
    xml = xml.replace("</urlset>", block + "</urlset>");
  }
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const dupes = locs.filter((loc, i) => locs.indexOf(loc) !== i);
  if (dupes.length) throw new Error("Duplicate loc: " + dupes.slice(0, 5).join(", "));
  if (locs.some((loc) => loc.includes("github.io"))) throw new Error("github.io loc found");
  fs.writeFileSync(file, xml, "utf8");
  return { before, after: locs.length };
}

function categoryCards(items, lang) {
  const ui = UI[lang];
  const bits = [];
  for (const item of items) {
    const href = `${lang === "en" ? "" : "/zh"}/${item.kind}/${item.slug}/`;
    bits.push(`          <a class="kc-card" href="${href}">
            <div class="kc-card-meta"><span class="kc-tag">${esc(item.kind === "blog" ? ui.blog : ui.qa)}</span></div>
            <h3 class="kc-card-title">${esc(item[lang].h1)}</h3>
            <p class="kc-card-blurb">${esc(item[lang].blurb)}</p>
            <span class="kc-card-link">${ui.read}</span>
          </a>`);
  }
  return bits.join("\n");
}

function patchCategories(blogs, qas) {
  const all = [...blogs, ...qas];
  for (const id of Object.keys(CATS)) {
    for (const lang of ["en", "zh"]) {
      const rel = `${lang === "zh" ? "zh/" : ""}knowledge/${id}/index.html`;
      const full = path.join(ROOT, rel);
      let html = fs.readFileSync(full, "utf8");
      const items = all.filter((item) => item.category === id);
      const ui = UI[lang];
      const section = `    <!-- blog-qa-related-start -->
    <section class="kc-section" id="blog-qa-related" aria-labelledby="blog-qa-related-title">
      <div class="kc-wrap">
        <div class="kc-section-head">
          <h2 class="kc-section-title" id="blog-qa-related-title">${esc(ui.relatedTitle)}</h2>
          <p class="kc-section-lead">${ui.relatedLead}</p>
        </div>
        <div class="kc-grid">
${categoryCards(items, lang)}
        </div>
      </div>
    </section>
    <!-- blog-qa-related-end -->
`;
      if (html.includes("<!-- blog-qa-related-start -->")) {
        html = html.replace(/    <!-- blog-qa-related-start -->[\s\S]*?    <!-- blog-qa-related-end -->\n/, section);
      } else if (html.includes("</main>")) {
        html = html.replace("</main>", section + "  </main>");
      } else {
        throw new Error("No </main> in " + rel);
      }
      if (lang === "en" && !html.includes('href="/blog/"')) {
        html = html.replace(
          `<nav class="kc-nav-links" aria-label="Primary">\n        <a href="/">Home</a>\n        <a href="/knowledge/">Knowledge</a>\n`,
          `<nav class="kc-nav-links" aria-label="Primary">\n        <a href="/">Home</a>\n        <a href="/knowledge/">Knowledge</a>\n        <a href="/blog/">Blog</a>\n        <a href="/qa/">Q&amp;A</a>\n`
        );
      }
      if (lang === "zh" && !html.includes('href="/zh/blog/"')) {
        html = html.replace(
          `<nav class="kc-nav-links" aria-label="主导航">\n        <a href="/zh/">首页</a>\n        <a href="/zh/knowledge/">知识中心</a>\n`,
          `<nav class="kc-nav-links" aria-label="主导航">\n        <a href="/zh/">首页</a>\n        <a href="/zh/knowledge/">知识中心</a>\n        <a href="/zh/blog/">博客</a>\n        <a href="/zh/qa/">问答</a>\n`
        );
      }
      fs.writeFileSync(full, html, "utf8");
    }
  }
}

function uniqueness(items) {
  const seen = new Map();
  for (const item of items) {
    for (const lang of ["en", "zh"]) {
      const key = item[lang].definition.trim();
      if (seen.has(key)) throw new Error("Duplicate definition: " + item.slug + " and " + seen.get(key));
      seen.set(key, item.slug + ":" + lang);
    }
  }
}

function main() {
  const bySlug = loadBatches();
  const blogs = merge(bySlug, "blogs");
  const qas = merge(bySlug, "qas");
  const extra = [...bySlug.keys()].filter((slug) => !blogs.some((b) => b.slug === slug) && !qas.some((q) => q.slug === slug));
  if (extra.length) throw new Error("Unexpected slugs: " + extra.join(", "));
  uniqueness([...blogs, ...qas]);
  if (blogs.length !== 20 || qas.length !== 50) throw new Error("Count mismatch");

  for (const [list, kind] of [[blogs, "blog"], [qas, "qa"]]) {
    list.forEach((item, i) => {
      const sibs = siblingsOf(list, i);
      writeFile(`${kind}/${item.slug}/index.html`, renderArticle(item, "en", sibs));
      writeFile(`zh/${kind}/${item.slug}/index.html`, renderArticle(item, "zh", sibs));
    });
    writeFile(`${kind}/index.html`, renderIndex(kind, "en", list));
    writeFile(`zh/${kind}/index.html`, renderIndex(kind, "zh", list));
  }

  patchCategories(blogs, qas);
  const counts = patchSitemap(sitemapEntries(blogs, qas));
  const htmlCount = (20 + 50) * 2 + 4;
  console.log(JSON.stringify({ blogTopics: 20, qaTopics: 50, htmlFiles: htmlCount, sitemapBefore: counts.before, sitemapAfter: counts.after, added: counts.after - counts.before }));
}

main();
