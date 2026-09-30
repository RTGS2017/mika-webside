const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

const needs = [
  ["seo", "SEO 技术问题", "SEO technical issues"],
  ["growth", "搜索流量增长", "Search growth"],
  ["ai", "AI / GEO 可见性", "AI / GEO visibility"],
  ["content", "内容优化", "Content"],
  ["multilingual", "多语言网站", "Multilingual site"],
  ["unsure", "还不确定", "Not sure yet"]
];

function faqLd(items) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a }
    }))
  });
}

function graph(t) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://mikaovo.ai/#org",
        name: "Mika",
        alternateName: t.brandSub,
        url: "https://mikaovo.ai/",
        logo: "https://mikaovo.ai/assets/logo.svg",
        email: "akizukiovo@gmail.com",
        description: t.desc
      },
      {
        "@type": "WebSite",
        "@id": "https://mikaovo.ai/#website",
        name: "Mika",
        url: "https://mikaovo.ai/",
        description: t.desc,
        inLanguage: ["en", "zh-Hans"],
        publisher: { "@id": "https://mikaovo.ai/#org" }
      },
      {
        "@type": "SoftwareApplication",
        name: "Mika",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: t.canonical,
        description: t.desc,
        provider: { "@id": "https://mikaovo.ai/#org" }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Mika", item: "https://mikaovo.ai/" },
          { "@type": "ListItem", position: 2, name: t.crumb, item: t.canonical }
        ]
      }
    ]
  });
}

function form(t, id) {
  const options = needs.map((item) => `<option value="${item[0]}">${t.lang === "zh" ? item[1] : item[2]}</option>`).join("");
  return `<form class="sa-form" id="${id}" data-scan-form data-sending="${t.sending}" data-fail="${t.fail}" novalidate>
    <input class="sa-hp" type="text" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true">
    <input type="hidden" name="locale" value="${t.lang}">
    <label class="sa-field">${t.company}<input name="company" required maxlength="120" autocomplete="organization"></label>
    <label class="sa-field">${t.person}<input name="name" required maxlength="80" autocomplete="name"></label>
    <label class="sa-field">${t.email}<input name="email" type="email" required maxlength="160" autocomplete="email"></label>
    <label class="sa-field">${t.urlLabel}<input name="website" type="url" required placeholder="https://example.com" maxlength="300"></label>
    <label class="sa-field">${t.need}<select name="need" required><option value="">${t.needPh}</option>${options}</select></label>
    <button class="sa-btn sa-btn-primary" type="submit">${t.cta}</button>
    <p class="sa-note">${t.formNote} <a href="${t.privacyHref}">${t.privacy}</a></p>
    <p class="sa-status" data-status role="status"></p>
  </form>`;
}

function page(t) {
  const asset = t.lang === "zh" ? "../" : "./";
  const checks = t.checks.map((label) => `<li data-check>${label}</li>`).join("");
  const scores = t.scores.map((item) => `<article><span>${item[0]}</span><strong data-count="${item[1]}">0</strong></article>`).join("");
  const pains = t.pains.map((item) => `<article class="sa-card"><svg class="sa-mini" viewBox="0 0 72 48" aria-hidden="true"><rect x="1" y="1" width="70" height="46" rx="8" fill="#F5F7FB" stroke="#E6EAF2"/><rect x="10" y="12" width="28" height="6" rx="3" fill="#2F6FED"/><rect x="10" y="24" width="40" height="4" rx="2" fill="#7C3AED" opacity=".7"/></svg><p class="sa-no">${item.no}</p><h3>${item.title}</h3><p>${item.body}</p></article>`).join("");
  const steps = t.steps.map((item) => `<li><p class="sa-no">${item.no}</p><strong>${item.title}</strong><p>${item.body}</p></li>`).join("");
  const features = `<section class="sa-section sa-tight" id="results">
      <div class="sa-wrap">
        <div class="sa-section-head">
          <p class="sa-kicker">${t.resultsKicker}</p>
          <h2 class="sa-h2">${t.resultsTitle}</h2>
          <p class="sa-lead">${t.resultsLead}</p>
        </div>
        ${t.features.map((item) => `<article class="sa-result${item.flip ? " is-flip" : ""}" id="${item.id}"><div><p class="sa-kicker">${item.kicker}</p><h3>${item.title}</h3><p>${item.lead}</p><ul class="sa-chips">${item.points.map((p) => `<li>${p}</li>`).join("")}</ul></div><img class="sa-shot" src="${asset}assets/visuals/${item.img}" alt="${item.alt}" width="960" height="640" loading="lazy"></article>`).join("")}
        <h3 class="sa-sub">${t.moreTitle}</h3>
        <div class="sa-cards">${t.more.map((item) => `<article class="sa-card" id="${item.id}"><p class="sa-no">${item.kicker}</p><h3>${item.title}</h3><p>${item.body}</p></article>`).join("")}</div>
      </div>
    </section>`;
  const faqs = t.faqs.map((item) => `<details><summary>${item.q}</summary><p>${item.a}</p></details>`).join("");
  const audiences = t.audiences.map((item) => `<article><h3>${item.title}</h3><p>${item.body}</p></article>`).join("");
  const kb = t.kb.map((item) => `<a href="${item.href}"><p class="sa-no">${item.kicker}</p><h3>${item.title}</h3><p>${item.body}</p></a>`).join("");
  return `<!DOCTYPE html>
<html lang="${t.htmlLang}">
<head>
  <meta charset="UTF-8">
  <meta name="baidu-site-verification" content="codeva-YhxGNuIWT5">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title}</title>
  <meta name="description" content="${t.desc}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${t.canonical}">
  <link rel="alternate" hreflang="en" href="https://mikaovo.ai/">
  <link rel="alternate" hreflang="zh-Hans" href="https://mikaovo.ai/zh/">
  <link rel="alternate" hreflang="x-default" href="https://mikaovo.ai/">
  <link rel="sitemap" type="application/xml" title="Sitemap" href="https://mikaovo.ai/sitemap.xml">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${t.ogLocale}">
  <meta property="og:site_name" content="Mika">
  <meta property="og:title" content="${t.title}">
  <meta property="og:description" content="${t.desc}">
  <meta property="og:url" content="${t.canonical}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${t.title}">
  <meta name="twitter:description" content="${t.desc}">
  <meta name="theme-color" content="#F5F7FB">
  <link rel="icon" href="${asset}assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${asset}src/home/home.css">
  <script type="application/ld+json">${graph(t)}</script>
  <script type="application/ld+json">${faqLd(t.faqs)}</script>
</head>
<body class="saas-home">
  <a class="sa-skip" href="#main">${t.skip}</a>
  <header class="sa-header">
    <div class="sa-wrap sa-header-inner">
      <a class="sa-brand" href="${t.home}">
        <img src="${asset}assets/logo.svg" alt="" width="28" height="28">
        <span><strong>Mika</strong><span>${t.brandSub}</span></span>
      </a>
      <nav class="sa-nav" aria-label="${t.navLabel}">
        <a href="#framework">${t.nav.product}</a>
        <a href="#seo-audit">${t.nav.audit}</a>
        <a href="#ai-visibility">${t.nav.ai}</a>
        <a href="#blueprint">${t.nav.blueprint}</a>
        <a href="${t.knowledge}">${t.nav.knowledge}</a>
        <a href="${t.blog}">${t.nav.blog}</a>
      </nav>
      <div class="sa-tools">
        <a class="sa-lang" href="${t.otherHref}" hreflang="${t.otherLang}">${t.otherLabel}</a>
        <a class="sa-btn sa-btn-primary" href="#hero" data-hero-open>${t.cta}</a>
        <button class="sa-menu" type="button" data-menu aria-expanded="false" aria-label="${t.menu}">☰</button>
      </div>
    </div>
  </header>
  <main id="main">
    <section class="sa-hero" id="hero">
      <div class="sa-wrap sa-hero-grid">
        <div>
          <p class="sa-eyebrow">SEARCH &amp; AI VISIBILITY</p>
          <h1 class="sa-h1">${t.h1}</h1>
          <p class="sa-lead">${t.heroLead}</p>
          <div class="sa-actions">
            <button class="sa-btn sa-btn-primary" type="button" data-hero-open>${t.cta}</button>
            <a class="sa-btn sa-btn-ghost" href="#framework">${t.secondary}</a>
          </div>
        </div>
        <div class="sa-stage" data-hero-stage>
          <div class="sa-stage-face is-visual sa-panel" data-hero-visual data-scan-panel>
            <label class="sa-field">${t.demoUrl}<input value="https://example.com" readonly></label>
            <ul class="sa-checks">${checks}</ul>
            <div data-report hidden>
              <p class="sa-demo">${t.demoNote}</p>
              <div class="sa-report">${scores}</div>
            </div>
            <button class="sa-btn sa-btn-primary sa-stage-cta" type="button" data-hero-open>${t.openForm}</button>
          </div>
          <div class="sa-stage-face is-form-face sa-panel" data-hero-form inert aria-hidden="true">
            <div class="sa-form-head">
              <h2>${t.scanTitle}</h2>
              <button class="sa-text-btn" type="button" data-hero-close>${t.backSample}</button>
            </div>
            <p class="sa-lead">${t.scanLead}</p>
            ${form(t, "scan-form-hero")}
          </div>
        </div>
      </div>
    </section>
    <section class="sa-section" id="problem">
      <div class="sa-wrap">
        <div class="sa-section-head">
          <p class="sa-kicker">${t.painKicker}</p>
          <h2 class="sa-h2">${t.painTitle}</h2>
        </div>
        <div class="sa-cards">${pains}</div>
      </div>
    </section>
    <section class="sa-section" id="framework">
      <div class="sa-wrap">
        <div class="sa-section-head">
          <h2 class="sa-h2">${t.frameTitle}</h2>
          <p class="sa-lead">${t.frameLead}</p>
        </div>
        <div class="sa-quad-wrap">
          <div class="sa-axis-y">${t.now} · ${t.next}</div>
          <div>
            <div class="sa-quad">
              <a href="#seo-audit"><strong>${t.quad[0][0]}</strong><span>${t.quad[0][1]}</span></a>
              <a href="#ai-visibility"><strong>${t.quad[1][0]}</strong><span>${t.quad[1][1]}</span></a>
              <a href="#seo-growth"><strong>${t.quad[2][0]}</strong><span>${t.quad[2][1]}</span></a>
              <a href="#geo-growth"><strong>${t.quad[3][0]}</strong><span>${t.quad[3][1]}</span></a>
            </div>
            <div class="sa-axis-x"><span>${t.search}</span><span>${t.ai}</span></div>
          </div>
        </div>
      </div>
    </section>
    <section class="sa-section" id="method">
      <div class="sa-wrap">
        <div class="sa-section-head">
          <h2 class="sa-h2">${t.methodTitle}</h2>
          <p class="sa-lead">${t.methodLead}</p>
        </div>
        <ol class="sa-steps">${steps}</ol>
      </div>
    </section>
    ${features}
    <section class="sa-section sa-tight" id="blueprint">
      <div class="sa-wrap sa-blueprint">
        <div>
          <h2 class="sa-h2">${t.blueTitle}</h2>
          <p class="sa-lead">${t.blueLead}</p>
          <ul>
            <li>${t.bluePoints[0]}</li>
            <li>${t.bluePoints[1]}</li>
            <li>${t.bluePoints[2]}</li>
          </ul>
        </div>
        <img class="sa-shot" src="${asset}assets/visuals/08-optimization-blueprint.svg" alt="${t.blueAlt}" width="960" height="640" loading="lazy">
      </div>
    </section>
    <section class="sa-section sa-tight" id="knowledge">
      <div class="sa-wrap">
        <div class="sa-section-head">
          <p class="sa-kicker">${t.kbKicker}</p>
          <h2 class="sa-h2">${t.kbTitle}</h2>
          <p class="sa-lead">${t.kbLead}</p>
        </div>
        <div class="sa-kb">${kb}</div>
        <img class="sa-shot sa-shot-slim" src="${asset}assets/visuals/09-knowledge-base.svg" alt="${t.kbAlt}" width="960" height="640" loading="lazy">
      </div>
    </section>
    <section class="sa-section sa-tight" id="why">
      <div class="sa-wrap">
        <h2 class="sa-h2">${t.whyTitle}</h2>
        <p class="sa-lead">${t.whyLead}</p>
        <div class="sa-flow">${t.flow.map((item) => `<span>${item}</span>`).join("")}</div>
      </div>
    </section>
    <section class="sa-section sa-tight" id="audience">
      <div class="sa-wrap">
        <div class="sa-section-head"><h2 class="sa-h2">${t.whoTitle}</h2></div>
        <div class="sa-audience">${audiences}</div>
      </div>
    </section>
    <section class="sa-section sa-faq sa-tight" id="faq">
      <div class="sa-wrap">
        <div class="sa-section-head"><h2 class="sa-h2">${t.faqTitle}</h2></div>
        ${faqs}
      </div>
    </section>
    <section class="sa-section" id="scan-final">
      <div class="sa-wrap sa-final">
        <div class="sa-form-card">
          <h2 class="sa-h2">${t.finalTitle}</h2>
          <p class="sa-lead">${t.finalLead}</p>
          ${form(t, "scan-form-final")}
        </div>
        <div>
          <h3>${t.contactTitle}</h3>
          <p><a href="https://wa.me/8613814015518">WhatsApp +86 138 1401 5518</a></p>
          <p><a href="mailto:akizukiovo@gmail.com">akizukiovo@gmail.com</a></p>
          <p>WeChat Xue2017105</p>
        </div>
      </div>
    </section>
  </main>
  <footer class="sa-footer">
    <div class="sa-wrap sa-footer-grid">
      <div><strong>Mika</strong><p>${t.brandSub}</p></div>
      <div><strong>${t.nav.product}</strong><ul><li><a href="#seo-audit">${t.nav.audit}</a></li><li><a href="#ai-visibility">${t.nav.ai}</a></li><li><a href="#blueprint">${t.nav.blueprint}</a></li></ul></div>
      <div><strong>${t.nav.knowledge}</strong><ul><li><a href="${t.knowledge}">${t.nav.knowledge}</a></li><li><a href="${t.blog}">${t.nav.blog}</a></li><li><a href="${t.qa}">${t.nav.qa}</a></li></ul></div>
      <div><strong>${t.contactTitle}</strong><ul><li><a href="mailto:akizukiovo@gmail.com">akizukiovo@gmail.com</a></li><li><a href="${t.privacyHref}">${t.privacy}</a></li></ul></div>
    </div>
  </footer>
  <script src="${asset}src/home/home.js"></script>
</body>
</html>
`;
}

const zhFaqs = [
  ["什么是 SEO 审计？", "SEO 审计是对网站能否被抓取、页面基础、结构和内链做的一次检查。Mika 把这些问题按严重程度列出，并写成可以执行的下一步，而不是只给一个分数。"],
  ["为什么网站已经做了 SEO，还是没有流量？", "技术上能打开的网站，仍可能缺少客户正在搜索的主题、意图或页面。Mika 把“现在能不能被发现”和“还有哪些需求没覆盖”分开看。"],
  ["SEO 和 AI 搜索可见性有什么区别？", "SEO 关心搜索引擎能否发现并理解页面。AI 搜索可见性关心 ChatGPT、Gemini 等系统能否根据网站上的清晰信息理解企业和产品。两者都需要同一套事实，但检查的问题不同。"],
  ["什么是 GEO？", "GEO 是让生成式系统更容易理解网站内容的一组做法，包括实体、直接答案和证据。它是 Mika 的能力之一，不是使用产品前必须先学会的概念。"],
  ["ChatGPT / Gemini 为什么有时候不会提到我的公司？", "常见原因是公司、产品和证据在网站上不够清晰或彼此不一致。Mika 标出这些缺口，但不保证一定会被某个模型提到。"],
  ["Mika 会不会自动修改我的网站？", "不会。Mika 给出问题和建议的改法，网站仍由你的团队修改，然后再做复审。"],
  ["Mika 和普通 SEO 检测工具有什么区别？", "普通检测往往停在问题列表。Mika 同时看搜索基础、增长机会、AI 理解和证据，并把发现写成带优先级的优化动作。"],
  ["知识库可以做什么？", "知识库存放 SEO、GEO、内容结构和 AI 搜索的指南与文章，用来解释扫描里出现的概念。它不替代对你自己网站的检查。"],
  ["是否支持多语言网站？", "支持对照中文、英文以及其他语言页面上的公司名、产品名、规格、应用和主张是否一致。"],
  ["免费扫描会检查哪些内容？", "申请会请我们查看页面、结构、内链、主题、问题、实体、证据、语言和图片相关信号。结果通过邮件沟通，不在提交瞬间生成一份自动分数。"]
];

const enFaqs = [
  ["What is an SEO audit?", "An SEO audit checks whether a site can be crawled, and whether page basics, structure, and internal links are in place. Mika groups those findings by severity and turns them into next actions instead of a single score."],
  ["Why can a site still lack traffic after SEO work?", "A site that loads can still miss the topics, intent, or pages customers search for. Mika separates “can this be found today” from “which demand is still uncovered.”"],
  ["How is SEO different from AI search visibility?", "SEO asks whether search engines can find and understand pages. AI search visibility asks whether systems such as ChatGPT or Gemini can understand the company and products from clear site information. They share the same facts and ask different questions."],
  ["What is GEO?", "GEO is the work of making a site easier for generative systems to understand: entities, direct answers, and evidence. It is one Mika capability, not a concept you must learn before the product makes sense."],
  ["Why might ChatGPT or Gemini leave my company out?", "The company, products, or evidence on the site may be unclear or inconsistent. Mika marks those gaps. It does not promise that a model will mention you."],
  ["Will Mika edit my website automatically?", "No. Mika lists problems and suggested changes. Your team edits the site, then a later scan checks what changed."],
  ["How is Mika different from a typical SEO checker?", "A typical checker stops at a problem list. Mika also looks at search growth, AI understanding, and evidence, then writes prioritized actions."],
  ["What is the knowledge base for?", "It holds guides and articles on SEO, GEO, content structure, and AI search, so the terms in a scan have an explanation. It does not replace a look at your own site."],
  ["Does Mika cover multilingual sites?", "Yes. It compares whether company names, product names, specs, uses, and claims stay consistent across language versions."],
  ["What does the free scan look at?", "The request asks us to review signals around pages, structure, internal links, topics, questions, entities, evidence, language, and images. Follow-up is by email. Submitting the form does not instantly mint a score."]
];

function packFaqs(rows) {
  return rows.map((row) => ({ q: row[0], a: row[1] }));
}

const zh = {
  lang: "zh",
  htmlLang: "zh-Hans",
  ogLocale: "zh_CN",
  title: "Mika｜让你的网站在搜索与 AI 中被看见",
  desc: "Mika 帮助企业发现网站 SEO 问题、搜索增长机会与 AI 答案可见性缺口，并把问题转化为可以执行的优化方案。",
  canonical: "https://mikaovo.ai/zh/",
  crumb: "首页",
  home: "/zh/",
  otherHref: "/",
  otherLang: "en",
  otherLabel: "EN",
  knowledge: "/zh/knowledge/",
  blog: "/zh/blog/",
  qa: "/zh/qa/",
  privacyHref: "/zh/privacy/",
  skip: "跳到正文",
  menu: "打开菜单",
  navLabel: "主导航",
  brandSub: "搜索与 AI 可见性平台",
  nav: { product: "产品能力", audit: "SEO 审计", ai: "AI 可见性", blueprint: "优化蓝图", knowledge: "知识库", blog: "博客", qa: "问答" },
  cta: "免费扫描我的网站",
  openForm: "用我的网站试一次",
  backSample: "返回示例",
  secondary: "看看 Mika 能发现什么",
  h1: "让客户在搜索和 AI 里找到你。",
  heroLead: "Google 搜索、ChatGPT、Gemini 等入口正在改变客户发现企业的方式。Mika 帮你检查网站哪里出了问题、还有哪些搜索机会没有覆盖，以及 AI 是否能够正确理解你的企业、产品和内容。",
  demoUrl: "输入你的网站地址",
  demoNote: "示例数据，仅用于演示",
  scannerAlt: "网站可见性扫描器的示例界面，分数为演示数据",
  checks: ["页面结构", "搜索基础", "内容覆盖", "商业意图", "AI 答案", "实体信息", "证据", "多语言"],
  scores: [["SEO 健康度", "92"], ["SEO 增长", "71"], ["GEO 健康度", "84"], ["GEO 增长", "63"]],
  scanTitle: "先留下网站，我们按这个范围查看。",
  scanLead: "不需要电话。提交后我们通过邮件联系你。",
  company: "公司名称",
  person: "姓名",
  email: "邮箱",
  urlLabel: "网站 URL",
  need: "主要需求",
  needPh: "请选择",
  formNote: "我们会通过邮件发送扫描结果及后续通知。",
  privacy: "隐私政策",
  sending: "正在发送…",
  fail: "发送失败，请稍后再试。",
  painKicker: "很多网站的问题，不是没有内容，而是没有被正确发现。",
  painTitle: "你的网站，可能正在错过本来可以获得的客户。",
  pains: [
    { no: "01", title: "网站存在，但客户找不到。", body: "页面可能无法被正确抓取、结构混乱、重要页面没有被充分连接，或者搜索需求覆盖不足。" },
    { no: "02", title: "客户问 ChatGPT，答案里却没有你。", body: "AI 是否能够识别你的公司、产品、服务和专业信息，取决于网站提供的信息是否清晰、一致、可理解、可验证。" },
    { no: "03", title: "知道有问题，却不知道先改哪里。", body: "Mika 将扫描结果整理成问题、机会和页面级优化动作，让你知道先处理什么。" }
  ],
  frameTitle: "一个平台，看清网站从“被找到”到“被理解”的全过程。",
  frameLead: "Mika 不只是检查技术问题，而是同时观察搜索、内容、商业意图和 AI 答案中的可见性。",
  now: "现在",
  next: "下一步",
  search: "搜索",
  ai: "AI",
  quad: [
    ["SEO 健康度", "网站现在是否具备被搜索发现和理解的基础？抓取、页面、结构、内链、技术问题。"],
    ["GEO 健康度", "AI 是否能够正确理解你的企业和产品？实体、直接答案、证据、一致性。"],
    ["SEO 增长", "还有哪些真实搜索需求没有覆盖？主题、意图、内容深度、市场。"],
    ["GEO 增长", "还有哪些 AI 问题与答案机会没有覆盖？问题缺口、答案缺口、引用机会。"]
  ],
  methodTitle: "Mika 会真正检查你的网站，而不是只给你一个分数。",
  methodLead: "不是发现问题就结束，而是把问题转化成下一步行动。",
  steps: [
    { no: "01", title: "扫描", body: "查看页面、架构、内链、主题、问题、实体、证据、语言和图片。" },
    { no: "02", title: "诊断", body: "按严重、重要、建议归组。" },
    { no: "03", title: "优化蓝图", body: "写清问题在哪里、为什么重要、改什么、哪一页、优先级和如何验收。" },
    { no: "04", title: "执行", body: "由你的团队按蓝图修改网站。" },
    { no: "05", title: "复审", body: "重新扫描，观察哪些地方已经改善。" }
  ],
  resultsKicker: "接上前面的四个问题",
  resultsTitle: "扫描之后，看到的就是这四件事。",
  resultsLead: "不是另起一份技术清单。每一块都回到上面已经提出的问题：现在能不能被找到，AI 能不能理解你，下一步还缺什么。",
  features: [
    { id: "seo-audit", kicker: "SEO 健康度 · 现在", title: "搜索现在能不能找到你。", lead: "接着「网站存在，但客户找不到」。先看抓取、页面和内链有没有挡住发现。", points: ["抓取与收录", "重要页面是否连得上", "这一页在说什么"], img: "02-seo-audit-dashboard.svg", alt: "SEO 健康示例面板，按严重、重要和建议分组", flip: false },
    { id: "seo-growth", kicker: "SEO 增长 · 下一步", title: "客户在搜的，网站还没回答。", lead: "接着「还有哪些真实搜索需求没有覆盖」。看主题、购买意图，以及还没写到的页面。", points: ["客户会搜的主题", "页面能支撑的意图", "还缺的页面"], img: "03-seo-growth-dashboard.svg", alt: "搜索增长机会示例面板", flip: true },
    { id: "ai-visibility", kicker: "GEO 健康度 · 现在", title: "AI 现在能不能说清你是谁。", lead: "接着「客户问 ChatGPT，答案里却没有你」。看公司、产品和证据是否清楚、一致。", points: ["公司与产品", "直接回答", "主张对应到证据"], img: "04-ai-visibility-dashboard.svg", alt: "AI 可见性示例界面，标注为示例查询", flip: false },
    { id: "geo-growth", kicker: "GEO 增长 · 下一步", title: "还有哪些问题，AI 也答不上。", lead: "问题会标成已回答、部分回答或未覆盖。这是下一步要补的答案，不是另一个分数。", points: ["已回答", "部分回答", "未覆盖"], img: "05-question-coverage.svg", alt: "问题覆盖示例，含已回答、部分回答和未覆盖", flip: true }
  ],
  moreTitle: "这三件事，让上面的判断落在具体页面上。",
  more: [
    { id: "questions", kicker: "问题", title: "客户问的，对到哪一页。", body: "每个问题要么已经有页面回答，要么标成还没覆盖。" },
    { id: "entity", kicker: "实体与证据", title: "你是谁、卖什么，要对得上。", body: "公司、产品、规格、场景和证据需要是同一套事实。" },
    { id: "multilingual", kicker: "多语言", title: "多种语言，仍是同一套事实。", body: "对照各语言页面上的名称、规格、应用和主张。" }
  ],
  blueTitle: "不要只告诉我“哪里错了”。",
  blueLead: "告诉你下一步应该怎么改：问题、原因、动作、页面和验收方式。",
  bluePoints: ["示例：产品页内容过薄，因为缺少定义、场景、规格和证据。", "动作包括补定义、场景、规格、证据和常见问题。", "优先级、目标 URL 和“重新扫描”写在同一张蓝图上。"],
  blueAlt: "优化蓝图示例，优先级为 P1，页面为示例地址",
  kbKicker: "SEO & GEO 知识库",
  kbTitle: "不仅发现问题，还可以随时找到解决问题的方法。",
  kbLead: "把 SEO、GEO、网站优化和 AI 搜索相关的知识、文章和资料集中到一个工作空间。",
  kb: [
    { href: "/zh/knowledge/seo/", kicker: "SEO 知识库", title: "网站结构与搜索增长", body: "学习网站结构、技术 SEO、内容优化和搜索增长。" },
    { href: "/zh/knowledge/geo/", kicker: "GEO 知识库", title: "AI 搜索与证据", body: "学习 AI 搜索、AI 答案、实体、证据和引用。" },
    { href: "/zh/blog/", kicker: "博客", title: "持续更新", body: "SEO、GEO、AI 搜索和网站增长的文章。" }
  ],
  kbAlt: "知识库工作台示例，列出 SEO、GEO 和最近指南",
  whyTitle: "搜索正在从“给你链接”变成“直接给你答案”。",
  whyLead: "用户获取信息的方式正在变化。他们可能从传统搜索进入网站，也可能先通过 ChatGPT、Gemini、AI 搜索等工具获取答案。企业需要同时关注：网站能不能被搜索发现，能不能回答真实问题，AI 能不能正确理解企业信息，重要内容有没有清晰证据。Mika 把这些问题放在同一个可见性框架里。",
  flow: ["搜索", "网站", "内容", "AI 理解", "答案", "客户"],
  whoTitle: "谁适合 Mika",
  audiences: [
    { title: "企业老板", body: "想知道网站为什么没有带来足够客户。" },
    { title: "市场负责人", body: "需要知道应该继续做什么内容。" },
    { title: "SEO / 内容团队", body: "需要更快发现技术问题和内容缺口。" },
    { title: "外贸 / 国际业务团队", body: "需要检查多语言网站和海外市场的搜索可见性。" }
  ],
  faqTitle: "常见问题",
  faqs: packFaqs(zhFaqs),
  finalTitle: "把网站地址发给我们。",
  finalLead: "我们会通过邮件发送扫描结果及后续通知。",
  contactTitle: "其他联系方式"
};

const en = {
  ...zh,
  lang: "en",
  htmlLang: "en",
  ogLocale: "en_US",
  title: "Mika | Get found in search and AI",
  desc: "Mika helps companies find website SEO issues, search growth opportunities, and AI answer visibility gaps, then turn them into actions they can carry out.",
  canonical: "https://mikaovo.ai/",
  crumb: "Home",
  home: "/",
  otherHref: "/zh/",
  otherLang: "zh-Hans",
  otherLabel: "中文",
  knowledge: "/knowledge/",
  blog: "/blog/",
  qa: "/qa/",
  privacyHref: "/privacy/",
  skip: "Skip to content",
  menu: "Open menu",
  navLabel: "Primary",
  brandSub: "Search & AI Visibility Platform",
  nav: { product: "Product", audit: "SEO audit", ai: "AI visibility", blueprint: "Blueprint", knowledge: "Knowledge", blog: "Blog", qa: "Q&A" },
  cta: "Scan my site free",
  openForm: "Try it with my site",
  backSample: "Back to the sample",
  secondary: "See what Mika looks for",
  h1: "Help customers find you in search and AI.",
  heroLead: "Google, ChatGPT, Gemini, and similar doors are changing how customers discover a company. Mika checks what is wrong on the site, which search demand is still uncovered, and whether AI can understand your company, products, and content.",
  demoUrl: "Website address",
  demoNote: "Sample data, for demonstration only",
  scannerAlt: "Sample website visibility scanner. Scores are demo data.",
  checks: ["Page structure", "Search basics", "Content coverage", "Commercial intent", "AI answers", "Entity information", "Evidence", "Languages"],
  scores: [["SEO health", "92"], ["SEO growth", "71"], ["GEO health", "84"], ["GEO growth", "63"]],
  scanTitle: "Send the site. This is the scope we review.",
  scanLead: "No phone number required. We reply by email.",
  company: "Company",
  person: "Name",
  email: "Email",
  urlLabel: "Website URL",
  need: "Main need",
  needPh: "Choose one",
  formNote: "We email the scan notes and later updates.",
  privacy: "Privacy",
  sending: "Sending…",
  fail: "Could not send. Try again.",
  painKicker: "The issue is often not a lack of pages. It is that the right people never find them.",
  painTitle: "Your site may be missing customers it could have reached.",
  pains: [
    { no: "01", title: "The site exists. Customers still cannot find it.", body: "Pages may be hard to crawl, the structure may be tangled, important pages may be poorly linked, or search demand may be uncovered." },
    { no: "02", title: "Someone asks ChatGPT. The answer does not mention you.", body: "Whether AI can recognize your company, products, services, and expertise depends on information that is clear, consistent, understandable, and checkable." },
    { no: "03", title: "You know something is wrong, not what to fix first.", body: "Mika turns a scan into problems, opportunities, and page-level actions so the first move is obvious." }
  ],
  frameTitle: "One platform, from being found to being understood.",
  frameLead: "Mika does not stop at technical faults. It also watches visibility in search, content, commercial intent, and AI answers.",
  now: "Now",
  next: "Next",
  search: "Search",
  ai: "AI",
  quad: [
    ["SEO health", "Can search engines find and understand the site today? Crawl, pages, structure, links, technical issues."],
    ["GEO health", "Can AI understand the company and products? Entities, direct answers, evidence, consistency."],
    ["SEO growth", "Which real search demand is still uncovered? Topics, intent, depth, markets."],
    ["GEO growth", "Which AI questions and answers are still open? Question gaps, answer gaps, citation opportunities."]
  ],
  methodTitle: "Mika inspects the site. It does not stop at a score.",
  methodLead: "Finding a problem is not the end. The point is the next action.",
  steps: [
    { no: "01", title: "Scan", body: "Pages, architecture, links, topics, questions, entities, evidence, language, and images." },
    { no: "02", title: "Diagnose", body: "Group findings as severe, important, or suggested." },
    { no: "03", title: "Blueprint", body: "Where it is, why it matters, what to change, which page, priority, and how to check." },
    { no: "04", title: "Do the work", body: "Your team edits the site from the blueprint." },
    { no: "05", title: "Scan again", body: "A later pass shows what improved." }
  ],
  resultsKicker: "The same four questions",
  resultsTitle: "After the scan, you see these four things.",
  resultsLead: "This is not a second checklist. Each block returns to a question already on the page: can people find you now, can AI understand you, and what is still missing.",
  features: [
    { id: "seo-audit", kicker: "SEO health · now", title: "Can search find you today?", lead: "This follows “the site exists, and customers still cannot find it.” Crawl, pages, and links are checked for what blocks discovery.", points: ["Crawl and indexation", "Important pages are linked", "The page states what it is"], img: "02-seo-audit-dashboard.svg", alt: "Sample SEO health panel grouped into severe, important, and suggested", flip: false },
    { id: "seo-growth", kicker: "SEO growth · next", title: "Customers search for answers the site does not have.", lead: "This follows “which real search demand is still uncovered.” Topics, buying intent, and missing pages.", points: ["Topics customers search", "Intent a page can support", "Pages still missing"], img: "03-seo-growth-dashboard.svg", alt: "Sample search growth panel", flip: true },
    { id: "ai-visibility", kicker: "GEO health · now", title: "Can AI say who you are today?", lead: "This follows “someone asks ChatGPT, and the answer does not mention you.” Company, product, and evidence need to be clear and consistent.", points: ["Company and products", "A direct answer", "Claims tied to evidence"], img: "04-ai-visibility-dashboard.svg", alt: "Sample AI visibility screen marked as an example query", flip: false },
    { id: "geo-growth", kicker: "GEO growth · next", title: "Which questions can AI still not answer?", lead: "Each question is marked answered, partial, or uncovered. That is the next answer to add, not another score.", points: ["Answered", "Partial", "Uncovered"], img: "05-question-coverage.svg", alt: "Sample question coverage with answered, partial, and uncovered", flip: true }
  ],
  moreTitle: "Three checks that put those judgments on a real page.",
  more: [
    { id: "questions", kicker: "Questions", title: "Match each question to a page.", body: "A question is either answered on a page, or marked still uncovered." },
    { id: "entity", kicker: "Entity and evidence", title: "Who you are and what you sell have to agree.", body: "Company, product, specs, uses, and evidence stay one set of facts." },
    { id: "multilingual", kicker: "Languages", title: "Several languages, the same facts.", body: "Names, specs, uses, and claims are compared across language versions." }
  ],
  blueTitle: "Do not only tell me what is wrong.",
  blueLead: "Say what to change next: the problem, the reason, the action, the page, and how to check it.",
  bluePoints: ["Example: a thin product page because definition, use, specs, and evidence are missing.", "Actions include those five additions, plus a FAQ.", "Priority, target URL, and a rescan sit on the same blueprint."],
  blueAlt: "Sample optimization blueprint with priority P1 and an example URL",
  kbKicker: "SEO & GEO knowledge",
  kbTitle: "Find the problem, then find how to work on it.",
  kbLead: "Guides and articles on SEO, GEO, site improvement, and AI search live in one workspace.",
  kb: [
    { href: "/knowledge/seo/", kicker: "SEO", title: "Structure and search growth", body: "Site structure, technical SEO, content, and search growth." },
    { href: "/knowledge/geo/", kicker: "GEO", title: "AI search and evidence", body: "AI search, AI answers, entities, evidence, and citations." },
    { href: "/blog/", kicker: "Blog", title: "Ongoing notes", body: "Articles on SEO, GEO, AI search, and site growth." }
  ],
  kbAlt: "Sample knowledge workspace listing SEO, GEO, and recent guides",
  whyTitle: "Search is shifting from a list of links to a direct answer.",
  whyLead: "People still arrive from classic search, and they also ask ChatGPT, Gemini, and other AI search tools first. A company needs the site to be findable, to answer real questions, to be understood, and to support important claims with evidence. Mika keeps those questions in one visibility frame.",
  flow: ["Search", "Site", "Content", "AI understanding", "Answer", "Customer"],
  whoTitle: "Who Mika is for",
  audiences: [
    { title: "Founders", body: "You want to know why the site is not bringing enough customers." },
    { title: "Marketing leads", body: "You need to know which content to make next." },
    { title: "SEO and content teams", body: "You want technical issues and content gaps found faster." },
    { title: "Export and international teams", body: "You need multilingual pages and overseas search visibility checked." }
  ],
  faqTitle: "Questions",
  faqs: packFaqs(enFaqs),
  finalTitle: "Send the website address.",
  finalLead: "We email the scan notes and later updates.",
  contactTitle: "Other ways to reach us"
};

fs.writeFileSync(path.join(root, "index.html"), page(en), "utf8");
fs.writeFileSync(path.join(root, "zh", "index.html"), page(zh), "utf8");
console.log("homepages written");

function privacy(lang) {
  const zhPage = lang === "zh";
  const title = zhPage ? "隐私政策 | Mika" : "Privacy | Mika";
  const canonical = zhPage ? "https://mikaovo.ai/zh/privacy/" : "https://mikaovo.ai/privacy/";
  const other = zhPage ? "/privacy/" : "/zh/privacy/";
  const home = zhPage ? "/zh/" : "/";
  const asset = zhPage ? "../../" : "../";
  const body = zhPage
    ? "<p>免费扫描表单只收集公司名称、姓名、邮箱、网站 URL 和主要需求。这些内容通过邮件发给 Mika，用于回复扫描申请。</p><p>我们不把这些信息出售，也不要求电话号码。邮箱用于发送确认和后续通知。</p><p>联系邮箱：akizukiovo@gmail.com</p>"
    : "<p>The free scan form collects company, name, email, website URL, and the main need. Those fields are emailed to Mika so we can reply to the request.</p><p>We do not sell this information, and we do not ask for a phone number. Email is used for the confirmation and later notes.</p><p>Contact: akizukiovo@gmail.com</p>";
  return `<!DOCTYPE html>
<html lang="${zhPage ? "zh-Hans" : "en"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${zhPage ? "Mika 免费扫描表单收集哪些信息，以及这些信息如何被使用。" : "What the Mika scan form collects and how that information is used."}">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="en" href="https://mikaovo.ai/privacy/">
  <link rel="alternate" hreflang="zh-Hans" href="https://mikaovo.ai/zh/privacy/">
  <link rel="alternate" hreflang="x-default" href="https://mikaovo.ai/privacy/">
  <link rel="stylesheet" href="${asset}src/home/home.css">
</head>
<body class="saas-home">
  <header class="sa-header"><div class="sa-wrap sa-header-inner"><a class="sa-brand" href="${home}"><strong>Mika</strong></a><a class="sa-lang" href="${other}">${zhPage ? "EN" : "中文"}</a></div></header>
  <main class="sa-section"><div class="sa-wrap"><h1 class="sa-h1">${zhPage ? "隐私政策" : "Privacy"}</h1>${body}<p><a href="${home}">${zhPage ? "返回首页" : "Back home"}</a></p></div></main>
</body>
</html>`;
}

fs.mkdirSync(path.join(root, "privacy"), { recursive: true });
fs.mkdirSync(path.join(root, "zh", "privacy"), { recursive: true });
fs.writeFileSync(path.join(root, "privacy", "index.html"), privacy("en"), "utf8");
fs.writeFileSync(path.join(root, "zh", "privacy", "index.html"), privacy("zh"), "utf8");
console.log("privacy written");
