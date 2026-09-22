# One-shot generator for Knowledge Center index pages + sitemap append.
# Not a build tool; run once then discard if desired.
from pathlib import Path
import html
import re

ROOT = Path(r"D:\NagaAssistance\b2bweb\site")

ARTICLES = [
  ("what-is-a-website-seo-audit", "seo", True, False,
   "What Is a Website SEO Audit", "What a structured SEO audit covers—and what it does not claim to predict.",
   "什么是网站 SEO 审计", "结构化 SEO 审计覆盖哪些层面，以及它不会承诺什么。"),
  ("how-to-check-website-crawlability", "seo", True, False,
   "How to Check Website Crawlability", "Practical checks for robots rules, status codes, and crawl paths.",
   "如何检查网站可抓取性", "针对 robots、状态码与抓取路径的实用检查。"),
  ("how-to-find-broken-internal-links", "seo", False, False,
   "How to Find Broken Internal Links", "Find dead internal links that waste crawl budget and user trust.",
   "如何查找失效内链", "找出浪费抓取预算并损害信任的失效内链。"),
  ("how-to-audit-canonical-urls", "seo", False, False,
   "How to Audit Canonical URLs", "Verify canonical tags point to the intended indexable URL.",
   "如何审计规范 URL（Canonical）", "核对 canonical 是否指向预期的可索引地址。"),
  ("how-to-check-hreflang", "seo", False, False,
   "How to Check Hreflang", "Validate language/region alternates without guessing rankings.",
   "如何检查 Hreflang", "校验语言与地区备用链接，而不猜测排名。"),
  ("how-to-analyze-xml-sitemaps", "seo", False, False,
   "How to Analyze XML Sitemaps", "Read sitemap coverage, freshness, and indexation mismatches.",
   "如何分析 XML Sitemap", "解读覆盖范围、更新频率与索引不一致。"),
  ("how-to-find-orphan-pages", "seo", False, False,
   "How to Find Orphan Pages", "Locate pages with no internal links and weak discovery paths.",
   "如何发现孤立页面", "找出缺少内链、发现路径薄弱的页面。"),
  ("how-to-detect-duplicate-content", "seo", False, False,
   "How to Detect Duplicate Content", "Spot near-duplicates and thin template collisions.",
   "如何检测重复内容", "识别近重复页面与薄弱模板冲突。"),
  ("how-to-find-content-gaps", "seo", True, False,
   "How to Find Content Gaps", "Compare buyer questions with what your site actually answers.",
   "如何发现内容缺口", "对照买家问题与站点实际回答的差距。"),
  ("how-to-map-search-intent", "seo", False, False,
   "How to Map Search Intent", "Align pages to informational, commercial, and transactional intent.",
   "如何映射搜索意图", "让页面匹配信息、商业与交易类意图。"),
  ("how-to-build-topic-coverage", "seo", False, False,
   "How to Build Topic Coverage", "Grow topical depth without manufacturing near-duplicate pages.",
   "如何建设主题覆盖", "加深主题覆盖，而不是批量制造近重复页。"),
  ("how-to-identify-commercial-search-opportunities", "seo", False, False,
   "How to Identify Commercial Search Opportunities", "Find commercial queries your product pages can honestly support.",
   "如何识别商业搜索机会", "找到产品页能诚实支撑的商业查询。"),
  ("how-to-build-product-page-content", "seo", False, False,
   "How to Build Product Page Content", "Structure specs, use cases, and proof buyers need before contact.",
   "如何撰写产品页内容", "组织规格、场景与联系前所需的证据。"),
  ("how-to-expand-seo-into-new-markets", "seo", False, False,
   "How to Expand SEO into New Markets", "Enter new languages or regions with real coverage—not copy spam.",
   "如何把 SEO 扩展到新市场", "用真实覆盖进入新语言或地区，而非复制垃圾页。"),
  ("why-page-count-does-not-equal-seo-growth", "seo", True, False,
   "Why Page Count Does Not Equal SEO Growth", "More URLs are not the same as more findable, useful coverage.",
   "为什么页面数量不等于 SEO 增长", "更多 URL 并不等于更多可发现、有用的覆盖。"),
  ("what-is-geo", "geo", True, False,
   "What Is GEO", "A clear definition of Generative Engine Optimization for B2B sites.",
   "什么是 GEO", "面向 B2B 站点的生成式引擎优化清晰定义。"),
  ("how-to-make-company-information-clearer", "geo", False, False,
   "How to Make Company Information Clearer", "State who you are, what you sell, and where you operate—without hype.",
   "如何让公司信息更清晰", "清楚说明你是谁、卖什么、在哪里运营。"),
  ("how-to-structure-product-information", "geo", False, False,
   "How to Structure Product Information", "Make product facts extractable for people and answer systems.",
   "如何结构化产品信息", "让产品事实便于人与回答系统提取。"),
  ("how-to-answer-buyer-questions-directly", "geo", True, False,
   "How to Answer Buyer Questions Directly", "Put short, sourceable answers on real pages—not only marketing copy.",
   "如何直接回答买家问题", "在真实页面给出可溯源短答，而不只是营销文案。"),
  ("how-to-build-evidence-around-product-claims", "geo", False, False,
   "How to Build Evidence Around Product Claims", "Support claims with specs, process, and verifiable context.",
   "如何为产品主张建立证据", "用规格、流程与可核验上下文支撑主张。"),
  ("how-to-improve-citation-readiness", "geo", False, False,
   "How to Improve Citation Readiness", "Make pages easier to quote—without promising guaranteed citations.",
   "如何提升被引用就绪度", "让页面更易被引用——但不承诺保证引用。"),
  ("how-to-build-consistent-entity-information", "geo", False, False,
   "How to Build Consistent Entity Information", "Keep names, products, and facts consistent across languages.",
   "如何建设一致的实体信息", "在多语言间保持名称、产品与事实一致。"),
  ("how-to-audit-ai-search-visibility", "geo", True, False,
   "How to Audit AI Search Visibility", "A checklist for answerability, entities, and evidence—not ranking guarantees.",
   "如何审计 AI 搜索可见度", "可答性、实体与证据清单——不是排名保证。"),
  ("what-makes-a-page-easier-to-reference", "geo", False, False,
   "What Makes a Page Easier to Reference", "Structure, definitions, and evidence that help other systems cite you.",
   "什么让页面更容易被引用", "有助于其他系统引用你的结构、定义与证据。"),
  ("seo-health-vs-seo-growth", "search-visibility", True, False,
   "SEO Health vs SEO Growth", "Separate crawl/index health from topic and market expansion.",
   "SEO 健康 vs SEO 增长", "把抓取/索引健康与主题、市场扩展分开看。"),
  ("geo-health-vs-geo-growth", "search-visibility", True, False,
   "GEO Health vs GEO Growth", "Clarity and evidence today versus uncovered questions tomorrow.",
   "GEO 健康 vs GEO 增长", "今天的清晰与证据，对比明天尚未覆盖的问题。"),
  ("audit-diagnosis-blueprint", "technical", True, False,
   "Audit Diagnosis Blueprint", "A repeatable path from findings to prioritized next actions.",
   "审计诊断蓝图", "从发现到优先级行动的可重复路径。"),
  ("question-coverage-for-websites", "content", False, False,
   "Question Coverage for Websites", "Map buyer questions to pages that answer them directly.",
   "网站的问题覆盖", "把买家问题映射到能直接回答的页面。"),
  ("entity-evidence-answerability", "content", False, False,
   "Entity, Evidence & Answerability", "Three building blocks of trustworthy website answers.",
   "实体、证据与可答性", "可信网站回答的三个基础构件。"),
  ("multilingual-search-visibility", "search-visibility", False, False,
   "Multilingual Search Visibility", "Keep EN/ZH coverage aligned without /en/ prefixes or thin mirrors.",
   "多语言搜索可见度", "对齐中英文覆盖，避免 /en/ 前缀与薄弱镜像页。"),
  ("what-open-source-seo-crawlers-check", "open-source", False, True,
   "What Open-Source SEO Crawlers Check", "A field map of signals common open-source crawlers inspect.",
   "开源 SEO 爬虫检查什么", "常见开源爬虫会检查的信号图谱。"),
  ("how-geo-handbooks-structure-source-backed-pages", "research", False, True,
   "How GEO Handbooks Structure Source-Backed Pages", "Patterns for definitions, short answers, examples, and sources.",
   "GEO 手册如何组织有来源的页面", "定义、短答、例子与来源的页面组织方式。"),
  ("what-a-technical-seo-geo-crawler-inspects", "technical", False, True,
   "What a Technical SEO/GEO Crawler Inspects", "Technical and answerability signals a combined crawler can surface.",
   "技术 SEO/GEO 爬虫会检查什么", "组合爬虫可暴露的技术与可答性信号。"),
  ("how-source-backed-bilingual-sites-are-structured", "research", False, True,
   "How Source-Backed Bilingual Sites Are Structured", "Architecture notes for parallel EN/ZH sites with shared facts.",
   "有来源的双语站点如何组织", "共享事实的中英文并行站点架构要点。"),
]

CATS = [
  ("seo", "SEO", "SEO"),
  ("geo", "GEO", "GEO"),
  ("search-visibility", "Search Visibility", "搜索可见度"),
  ("content", "Content", "内容"),
  ("technical", "Technical", "技术"),
  ("research", "Research", "研究"),
  ("open-source", "Open Source", "开源"),
  ("updates", "Updates", "更新"),
]

CAT_LABEL = {c[0]: (c[1], c[2]) for c in CATS}


def esc(s):
  return html.escape(s, quote=True)


def card(a, lang, prefix):
  slug, cat, _feat, _res, en_t, en_b, zh_t, zh_b = a
  title = en_t if lang == "en" else zh_t
  blurb = en_b if lang == "en" else zh_b
  cat_label = CAT_LABEL[cat][0 if lang == "en" else 1]
  tag_mod = ""
  if cat == "seo":
    tag_mod = " kc-tag--seo"
  elif cat == "geo":
    tag_mod = " kc-tag--geo"
  href = f"{prefix}{slug}/"
  search = f"{title} {blurb} {cat_label} {slug}".lower()
  read = "Read guide" if lang == "en" else "阅读指南"
  return f'''          <a class="kc-card" href="{esc(href)}" data-kc-category="{esc(cat)}" data-kc-search="{esc(search)}">
            <div class="kc-card-meta"><span class="kc-tag{tag_mod}">{esc(cat_label)}</span></div>
            <h3 class="kc-card-title">{esc(title)}</h3>
            <p class="kc-card-blurb">{esc(blurb)}</p>
            <span class="kc-card-link">{esc(read)} →</span>
          </a>'''


def featured_cards(lang, prefix):
  items = [a for a in ARTICLES if a[2]]
  return "\n".join(card(a, lang, prefix) for a in items)


def research_cards(lang, prefix):
  items = [a for a in ARTICLES if a[3]]
  return "\n".join(card(a, lang, prefix) for a in items)


def all_cards(lang, prefix):
  return "\n".join(card(a, lang, prefix) for a in ARTICLES)


def cat_blocks(lang):
  counts = {c[0]: 0 for c in CATS}
  for a in ARTICLES:
    counts[a[1]] = counts.get(a[1], 0) + 1
  out = []
  for cid, en, zh in CATS:
    name = en if lang == "en" else zh
    n = counts.get(cid, 0)
    count_txt = f"{n} guides" if lang == "en" else f"{n} 篇"
    mod = ""
    if cid == "seo":
      mod = " kc-cat--seo"
    elif cid == "geo":
      mod = " kc-cat--geo"
    out.append(f'''          <a class="kc-cat{mod}" href="#all-guides" data-kc-jump="{cid}">
            <p class="kc-cat-name">{esc(name)}</p>
            <p class="kc-cat-count">{esc(count_txt)}</p>
          </a>''')
  return "\n".join(out)


def filter_btns(lang):
  all_label = "All" if lang == "en" else "全部"
  parts = [f'            <button type="button" data-kc-filter="all" aria-pressed="true">{esc(all_label)}</button>']
  for cid, en, zh in CATS:
    label = en if lang == "en" else zh
    parts.append(f'            <button type="button" data-kc-filter="{cid}" aria-pressed="false">{esc(label)}</button>')
  return "\n".join(parts)


def os_links(lang, prefix):
  os_slugs = [
    "what-open-source-seo-crawlers-check",
    "what-a-technical-seo-geo-crawler-inspects",
    "how-source-backed-bilingual-sites-are-structured",
  ]
  by_slug = {a[0]: a for a in ARTICLES}
  items = []
  for s in os_slugs:
    a = by_slug[s]
    title = a[4] if lang == "en" else a[6]
    items.append(f'              <li><a href="{prefix}{s}/">{esc(title)}</a></li>')
  return "\n".join(items)


def build_page(lang):
  is_en = lang == "en"
  if is_en:
    asset = ".."
    prefix = "/knowledge/"
    home = "/"
    self_url = "https://mikaovo.ai/knowledge/"
    alt_url = "https://mikaovo.ai/zh/knowledge/"
    lang_attr = "en"
    og_locale = "en_US"
    og_alt = "zh_CN"
    title = "Knowledge Center | Mika Visibility"
    desc = "Guides on SEO audits, GEO, search visibility, content structure, and open-source research—built for B2B websites that need clarity, not ranking promises."
    h1 = "Understand Search. Understand Visibility. Build Better Websites."
    lead = "Practical guides on technical SEO, generative engine readiness, topic coverage, and source-backed bilingual sites—without black-box scores or guaranteed rankings."
    kicker = "Knowledge Center"
    note = "Educational material only. Mika does not guarantee search rankings or AI answer citations."
    feat_t, feat_l = "Featured guides", "Start with the frameworks teams use to separate health from growth."
    res_t, res_l = "Latest research", "Open notes on crawlers, handbooks, and bilingual source-backed structure."
    cat_t, cat_l = "Browse by category", "Eight lanes—from SEO and GEO to open-source research and updates."
    os_t = "Open-source research"
    os_l = "Field maps of what crawlers inspect and how source-backed pages are structured. Read the notes, then apply the checks on your own site."
    os_cta = "View open-source guides"
    all_t, all_l = "All guides", "Filter by category or search titles on this page—no backend required."
    search_ph = "Search guides…"
    search_hint = "Showing <span id=\"kc-result-count\">0</span> guides"
    empty = "No guides match this filter or search."
    footer_blurb = "Structured visibility for technical SEO, search growth, and AI discovery."
    f_product, f_kc, f_contact = "Product", "Knowledge", "Contact"
    f_privacy = "Educational guides only. Mika Visibility does not sell rankings, guaranteed answer-surface placement, or fabricated commercial facts."
    contact_label = "Contact"
    nav_home, nav_kc, nav_os = "Home", "Knowledge", "Open Source"
    en_cur, zh_cur = 'aria-current="page"', ""
    lang_switch_en, lang_switch_zh = "/knowledge/", "/zh/knowledge/"
  else:
    asset = "../.."
    prefix = "/zh/knowledge/"
    home = "/zh/"
    self_url = "https://mikaovo.ai/zh/knowledge/"
    alt_url = "https://mikaovo.ai/knowledge/"
    lang_attr = "zh-Hans"
    og_locale = "zh_CN"
    og_alt = "en_US"
    title = "知识中心 | Mika Visibility"
    desc = "面向 B2B 网站的 SEO 审计、GEO、搜索可见度、内容结构与开源研究指南——强调清晰与可执行，而非排名承诺。"
    h1 = "理解搜索。理解可见度。建设更好的网站。"
    lead = "技术 SEO、生成式引擎就绪、主题覆盖与有来源的双语站点实用指南——没有黑盒分数，也不保证排名。"
    kicker = "知识中心"
    note = "仅供学习参考。Mika 不保证搜索排名或 AI 回答引用。"
    feat_t, feat_l = "精选指南", "从「健康 vs 增长」等框架入手，建立可执行的诊断路径。"
    res_t, res_l = "最新研究", "关于爬虫、手册与双语有来源结构的公开笔记。"
    cat_t, cat_l = "按分类浏览", "八个栏目：SEO、GEO、搜索可见度、内容、技术、研究、开源、更新。"
    os_t = "开源研究入口"
    os_l = "爬虫检查什么、有来源页面如何组织——先读笔记，再在自己的站点上落地检查。"
    os_cta = "查看开源指南"
    all_t, all_l = "全部指南", "本页分类筛选与标题搜索，无需后端。"
    search_ph = "搜索指南…"
    search_hint = "显示 <span id=\"kc-result-count\">0</span> 篇"
    empty = "没有符合筛选或搜索的指南。"
    footer_blurb = "面向技术 SEO、搜索增长与 AI 发现的结构化可见度。"
    f_product, f_kc, f_contact = "产品", "知识中心", "联系"
    f_privacy = "仅供学习参考。Mika Visibility 不出售排名、不保证回答面曝光，也不编造商业事实。"
    contact_label = "联系"
    nav_home, nav_kc, nav_os = "首页", "知识中心", "开源"
    en_cur, zh_cur = "", 'aria-current="page"'
    lang_switch_en, lang_switch_zh = "/knowledge/", "/zh/knowledge/"

  return f'''<!DOCTYPE html>
<html lang="{lang_attr}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(desc)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="{self_url}">
  <link rel="alternate" hreflang="en" href="https://mikaovo.ai/knowledge/">
  <link rel="alternate" hreflang="zh-Hans" href="https://mikaovo.ai/zh/knowledge/">
  <link rel="alternate" hreflang="x-default" href="https://mikaovo.ai/knowledge/">
  <link rel="sitemap" type="application/xml" title="Sitemap" href="https://mikaovo.ai/sitemap.xml">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="{og_locale}">
  <meta property="og:locale:alternate" content="{og_alt}">
  <meta property="og:site_name" content="Mika">
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(desc)}">
  <meta property="og:url" content="{self_url}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="{esc(title)}">
  <meta name="twitter:description" content="{esc(desc)}">
  <meta name="theme-color" content="#101828">
  <link rel="icon" href="{asset}/assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{asset}/styles.css">
  <link rel="stylesheet" href="{asset}/src/knowledge/center.css">
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "{self_url}#page",
    "url": "{self_url}",
    "name": "{esc(title)}",
    "description": "{esc(desc)}",
    "inLanguage": "{lang_attr}",
    "isPartOf": {{ "@id": "https://mikaovo.ai/#website" }},
    "about": {{ "@id": "https://mikaovo.ai/#org" }}
  }}
  </script>
</head>
<body class="kc-page">
  <a class="kc-skip" href="#main">{"Skip to content" if is_en else "跳到正文"}</a>

  <header class="kc-header">
    <div class="kc-wrap kc-nav">
      <a class="kc-brand" href="{home}" aria-label="Mika Visibility home">
        <img src="{asset}/assets/logo.svg" alt="Mika Visibility" width="22" height="22">
        <span>Mika <span>Visibility</span></span>
      </a>
      <nav class="kc-nav-links" aria-label="{"Primary" if is_en else "主导航"}">
        <a href="{home}">{esc(nav_home)}</a>
        <a href="{prefix}" aria-current="page">{esc(nav_kc)}</a>
        <a href="#open-source">{esc(nav_os)}</a>
        <div class="kc-lang" aria-label="{"Language" if is_en else "语言"}">
          <a href="{lang_switch_en}" {en_cur}>EN</a>
          <a href="{lang_switch_zh}" {zh_cur}>中文</a>
        </div>
        <div class="kc-nav-contact">
          <button type="button" class="kc-nav-contact-btn" data-contact-open="header" aria-expanded="false" aria-haspopup="dialog" aria-controls="contact-popover-nav">{esc(contact_label)}</button>
          <div id="contact-popover-nav" class="contact-popover contact-popover-nav" hidden></div>
        </div>
      </nav>
    </div>
  </header>

  <main id="main">
    <section class="kc-hero" aria-labelledby="kc-hero-title">
      <div class="kc-wrap">
        <p class="kc-hero-kicker">{esc(kicker)}</p>
        <h1 id="kc-hero-title">{esc(h1)}</h1>
        <p class="kc-hero-lead">{esc(lead)}</p>
        <p class="kc-hero-note">{esc(note)}</p>
      </div>
    </section>

    <section class="kc-section kc-section--seo" aria-labelledby="featured-title">
      <div class="kc-wrap">
        <div class="kc-section-head">
          <h2 class="kc-section-title" id="featured-title">{esc(feat_t)}</h2>
          <p class="kc-section-lead">{esc(feat_l)}</p>
        </div>
        <div class="kc-grid">
{featured_cards(lang, prefix)}
        </div>
      </div>
    </section>

    <section class="kc-section kc-section--geo" aria-labelledby="research-title">
      <div class="kc-wrap">
        <div class="kc-section-head">
          <h2 class="kc-section-title" id="research-title">{esc(res_t)}</h2>
          <p class="kc-section-lead">{esc(res_l)}</p>
        </div>
        <div class="kc-grid">
{research_cards(lang, prefix)}
        </div>
      </div>
    </section>

    <section class="kc-section" id="categories" aria-labelledby="cat-title">
      <div class="kc-wrap">
        <div class="kc-section-head">
          <h2 class="kc-section-title" id="cat-title">{esc(cat_t)}</h2>
          <p class="kc-section-lead">{esc(cat_l)}</p>
        </div>
        <div class="kc-cat-grid">
{cat_blocks(lang)}
        </div>
      </div>
    </section>

    <section class="kc-section kc-section--navy" id="open-source" aria-labelledby="os-title">
      <div class="kc-wrap">
        <div class="kc-os-panel">
          <div>
            <h2 id="os-title">{esc(os_t)}</h2>
            <p>{esc(os_l)}</p>
            <a class="kc-btn kc-btn-primary" href="#all-guides" data-kc-jump="open-source">{esc(os_cta)}</a>
          </div>
          <ul class="kc-os-list">
{os_links(lang, prefix)}
          </ul>
        </div>
      </div>
    </section>

    <section class="kc-section kc-section--muted" id="all-guides" aria-labelledby="all-title">
      <div class="kc-wrap">
        <div class="kc-section-head">
          <h2 class="kc-section-title" id="all-title">{esc(all_t)}</h2>
          <p class="kc-section-lead">{esc(all_l)}</p>
        </div>
        <div class="kc-toolbar">
          <div class="kc-filters" role="group" aria-label="{"Filter by category" if is_en else "按分类筛选"}">
{filter_btns(lang)}
          </div>
          <div class="kc-search">
            <label class="kc-sr" for="kc-search">{"Search guides" if is_en else "搜索指南"}</label>
            <input id="kc-search" type="search" placeholder="{esc(search_ph)}" autocomplete="off">
            <p class="kc-search-hint">{search_hint}</p>
          </div>
        </div>
        <div class="kc-grid" id="kc-card-grid">
{all_cards(lang, prefix)}
        </div>
        <p class="kc-empty" id="kc-empty" role="status">{esc(empty)}</p>
      </div>
    </section>
  </main>

  <footer class="kc-footer">
    <div class="kc-wrap">
      <div class="kc-footer-grid">
        <div>
          <a class="kc-brand" href="{home}">
            <img src="{asset}/assets/logo.svg" alt="" width="22" height="22">
            <span>Mika <span>Visibility</span></span>
          </a>
          <p style="margin-top:12px">{esc(footer_blurb)}</p>
        </div>
        <div>
          <h3>{esc(f_product)}</h3>
          <ul class="kc-footer-links">
            <li><a href="{home}">{"Home" if is_en else "首页"}</a></li>
            <li><a href="{home}#seo-growth">SEO</a></li>
            <li><a href="{home}#geo">GEO</a></li>
          </ul>
        </div>
        <div>
          <h3>{esc(f_kc)}</h3>
          <ul class="kc-footer-links">
            <li><a href="{prefix}">{"All guides" if is_en else "全部指南"}</a></li>
            <li><a href="#open-source">{"Open Source" if is_en else "开源"}</a></li>
            <li><a href="#categories">{"Categories" if is_en else "分类"}</a></li>
          </ul>
        </div>
        <div>
          <h3>{esc(f_contact)}</h3>
          <div data-contact-footer></div>
        </div>
      </div>
      <div class="kc-footer-bottom">{esc(f_privacy)}</div>
    </div>
  </footer>

  <div class="contact-dock">
    <div id="contact-popover-dock" class="contact-popover contact-popover-dock" hidden></div>
    <button type="button" class="contact-dock-btn" data-contact-open="dock" aria-expanded="false" aria-haspopup="dialog" aria-controls="contact-popover-dock">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.5 3.5h11v7.2H6.2L3.2 13V10.7H2.5V3.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
      {esc(contact_label)}
    </button>
  </div>
  <div id="contact-sheet" class="contact-sheet" hidden role="dialog" aria-modal="true" aria-labelledby="contact-sheet-title">
    <div class="contact-sheet-card"></div>
  </div>
  <div id="contact-live" class="sr-only" aria-live="polite"></div>

  <script src="{asset}/contact-config.js"></script>
  <script src="{asset}/contact.js"></script>
  <script src="{asset}/src/knowledge/articles.js"></script>
  <script src="{asset}/src/knowledge/center.js"></script>
  <script>
  (function () {{
    document.querySelectorAll("[data-kc-jump]").forEach(function (el) {{
      el.addEventListener("click", function () {{
        var cat = el.getAttribute("data-kc-jump");
        var btn = document.querySelector('[data-kc-filter="' + cat + '"]');
        if (btn) btn.click();
      }});
    }});
  }})();
  </script>
</body>
</html>
'''


def sitemap_entry(en_url, zh_url, priority="0.7"):
  return f'''  <url>
    <loc>{en_url}</loc>
    <lastmod>2026-09-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>{priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="{en_url}" />
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="{zh_url}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="{en_url}" />
  </url>
  <url>
    <loc>{zh_url}</loc>
    <lastmod>2026-09-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>{priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="{en_url}" />
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="{zh_url}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="{en_url}" />
  </url>'''


def main():
  (ROOT / "knowledge" / "index.html").write_text(build_page("en"), encoding="utf-8")
  (ROOT / "zh" / "knowledge" / "index.html").write_text(build_page("zh"), encoding="utf-8")

  sm = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
  # Remove prior knowledge append if re-run
  sm = re.sub(r"\n  <!-- knowledge-center -->.*</urlset>", "\n</urlset>", sm, flags=re.S)
  if "<!-- knowledge-center -->" in sm:
    sm = re.sub(r"  <!-- knowledge-center -->.*?(?=</urlset>)", "", sm, flags=re.S)

  chunks = ["  <!-- knowledge-center -->"]
  chunks.append(sitemap_entry(
    "https://mikaovo.ai/knowledge/",
    "https://mikaovo.ai/zh/knowledge/",
    "0.8",
  ))
  for a in ARTICLES:
    slug = a[0]
    chunks.append(sitemap_entry(
      f"https://mikaovo.ai/knowledge/{slug}/",
      f"https://mikaovo.ai/zh/knowledge/{slug}/",
      "0.6",
    ))
  block = "\n".join(chunks) + "\n"
  sm = sm.replace("</urlset>", block + "</urlset>")
  (ROOT / "sitemap.xml").write_text(sm, encoding="utf-8")
  print("OK", len(ARTICLES), "articles")


if __name__ == "__main__":
  main()
