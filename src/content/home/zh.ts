import { faqZh } from "./faq.zh";
import { CONTACT_FACTS, type HomeContent } from "./types";

/**
 * 中文首页文案 — V2 叙事合同。
 * 数字与标签分离，供后续动画智能体做计数。
 */
export const homeZh: HomeContent = {
  locale: "zh",

  nav: {
    brandName: "Mika",
    brandSuffix: "Visibility",
    ariaHome: "Mika Visibility 首页",
    menuLabel: "菜单",
    skipToContent: "跳到正文",
    links: [
      { label: "产品逻辑", href: "#problem" },
      { label: "能力框架", href: "#framework" },
      { label: "如何运作", href: "#blueprint" },
      { label: "SEO", href: "#seoGrowth" },
      { label: "GEO", href: "#geo" },
      { label: "常见问题", href: "#faq" },
    ],
    primaryCta: { label: "开始结构化审计", href: "#cta" },
  },

  hero: {
    id: "hero",
    eyebrow: "搜索与 AI 可见性平台",
    headline: "让你的网站在搜索与 AI 中都被看见。",
    definition:
      "面向技术 SEO、搜索增长、网站理解与 AI 发现的结构化可见性平台。",
    metricChips: [
      {
        id: "seoHealth",
        label: "SEO Health",
        hint: "可抓取、可收录、结构可靠",
      },
      {
        id: "seoGrowth",
        label: "SEO Growth",
        hint: "主题、意图与市场仍有空间",
      },
      {
        id: "geoHealth",
        label: "GEO Health",
        hint: "实体清晰、答案直接、证据可查",
      },
      {
        id: "geoGrowth",
        label: "GEO Growth",
        hint: "未覆盖问题与引用空间",
      },
    ],
    support:
      "没有黑盒分数，也没有一套打遍天下的清单。先读懂你的网站，找出缺口，再落到下一步动作。",
    primaryCta: { label: "开始结构化审计", href: "#cta" },
    secondaryCta: { label: "看 Health 与 Growth", href: "#healthGrowth" },
    disclaimer:
      "本页示例数据仅供说明。Mika 不预测排名，也不保证在任何答案展示位中出现。",
  },

  problem: {
    id: "problem",
    kicker: "可见性问题",
    headline: "网站可以很健康，却依然很难被发现。",
    lede: "技术干净与容易被发现相关，但不是同一件事。",
    healthy: {
      title: "健康（Healthy）",
      body: "页面能被抓取，标题与结构说得通，站点不会用意外 noindex 或断裂架构跟自己作对。",
      bullets: [
        "抓取与收录路径是明确、可解释的",
        "架构与内链能托住关键页面",
        "页面基础信号已经到位",
      ],
    },
    growing: {
      title: "增长（Growing）",
      body: "站点覆盖了买家真实会搜的主题、商业意图与市场，并且有足够深度去回答问题，而不只是提一句。",
      bullets: [
        "主题与意图覆盖会持续扩展",
        "产品页与应用页能回答真实问题",
        "多市场保持一致，而不是薄翻译壳",
      ],
    },
    conclusion: "Health 告诉你哪些在正常工作。Growth 指出还缺什么。",
  },

  framework: {
    id: "framework",
    kicker: "SEO + GEO 框架",
    headline: "一个网站，四项彼此独立的能力。",
    lede: "SEO 与 GEO 分轨；Health 与 Growth 分尺。没有把它们揉成一个 Overall Score。",
    cells: [
      {
        id: "seoHealth",
        axis: "现在 · 搜索",
        title: "SEO Health",
        body: "线上站点在技术上是否已准备好被搜索发现并理解？",
        items: ["Technical（技术）", "Structure（结构）", "Content（内容）"],
      },
      {
        id: "geoHealth",
        axis: "现在 · 答案",
        title: "GEO Health",
        body: "人们能否从网站本身找到关于你业务的清晰、可支撑答案？",
        items: ["Understanding（理解）", "Evidence（证据）", "Answers（答案）"],
      },
      {
        id: "seoGrowth",
        axis: "下一步 · 搜索",
        title: "SEO Growth",
        body: "还有哪些覆盖、意图深度与市场尚未占据？",
        items: ["Coverage（覆盖）", "Intent（意图）", "Depth（深度）", "Markets（市场）"],
      },
      {
        id: "geoGrowth",
        axis: "下一步 · 答案",
        title: "GEO Growth",
        body: "答案覆盖、引用与扩展还有哪些提升空间？",
        items: ["Query gaps（查询缺口）", "Answer gaps（答案缺口）", "Citation（引用）", "Expansion（扩展）"],
      },
    ],
  },

  audit: {
    id: "audit",
    kicker: "深度审计",
    headline: "Deep Audit 把网站当系统看——不是一个分数。",
    lede: "扫描会走过页面、结构、主题、实体、问题与证据，然后才写 Blueprint。",
    stats: [
      { id: "crawling", label: "Crawling", value: 128, valueLabel: "pages" },
      {
        id: "architecture",
        label: "Architecture",
        value: 386,
        valueLabel: "internal links",
      },
      { id: "content", label: "Content", value: 72, valueLabel: "topics" },
      {
        id: "searchIntent",
        label: "Search intent",
        value: 54,
        valueLabel: "commercial intents",
      },
      { id: "entities", label: "Entities", value: 34, valueLabel: "entities" },
      {
        id: "questions",
        label: "Questions",
        value: 216,
        valueLabel: "buyer questions",
      },
      { id: "evidence", label: "Evidence", value: 47, valueLabel: "evidence items" },
      { id: "languages", label: "Languages", value: 6, valueLabel: "languages" },
      { id: "images", label: "Images", value: 189, valueLabel: "images" },
    ],
    steps: [
      { id: "discover", label: "Discover pages" },
      { id: "structure", label: "Analyze structure" },
      { id: "topics", label: "Extract topics" },
      { id: "entities", label: "Map entities" },
      { id: "questions", label: "Evaluate questions" },
      { id: "evidence", label: "Check evidence" },
      { id: "opportunities", label: "Find opportunities" },
      { id: "blueprint", label: "Build blueprint" },
    ],
    note: "仪表盘数字为示例。真实扫描会报告你站点的现场数据。",
  },

  healthGrowth: {
    id: "healthGrowth",
    kicker: "Health vs Growth",
    headline: "两个分数，两件事，永不混算。",
    lede: "用 Health 稳住基础；用 Growth 看清还有哪些需求未被回答。",
    health: {
      kicker: "SEO HEALTH",
      title: "站点现在站在哪里",
      score: { value: 92, label: "SEO Health" },
      bars: [
        { label: "Crawlability", value: 98 },
        { label: "On-page", value: 94 },
        { label: "Architecture", value: 91 },
        { label: "Content", value: 86 },
        { label: "Internal links", value: 93 },
      ],
    },
    growth: {
      kicker: "SEO GROWTH",
      title: "还缺什么",
      score: { value: 71, label: "SEO Growth" },
      bars: [
        { label: "Topic", value: 62, unit: "%" },
        { label: "Intent", value: 54, unit: "%" },
        { label: "Commercial", value: 48, unit: "%" },
        { label: "Market", value: 31, unit: "%" },
        { label: "Topical depth", value: 57, unit: "%" },
      ],
    },
    philosophy: "健康分高，并不自动等于增长潜力高。",
  },

  blueprint: {
    id: "blueprint",
    kicker: "Audit → Diagnosis → Blueprint",
    headline: "不要停在发现问题上。把下一步动作交出来。",
    lede: "扫描产出事实；诊断把问题归组；Blueprint 把归组变成带优先级与验收的工作。",
    stages: [
      {
        step: "01",
        title: "Audit（审计）",
        body: "收集抓取、结构、内容、实体、问题与证据事实，并附带样例 URL。",
      },
      {
        step: "02",
        title: "Diagnosis（诊断）",
        body: "按规则与严重级别归组，让故事可执行——而不是一个感觉分。",
      },
      {
        step: "03",
        title: "Blueprint（蓝图）",
        body: "把问题组落成页面级动作：优先级、改什么、如何用复审验收。",
      },
    ],
    sampleAction: {
      code: "ACTION P023",
      targetPath: "/products/example/",
      title: "Expand product page",
      changes: [
        "Add product definition",
        "Add use case",
        "Add specifications",
        "Add evidence",
        "Add FAQ",
      ],
      priority: "P1",
      validation: "re-audit",
    },
    executeNote: "Blueprint 是指导，不会自动改站或自动发布。",
  },

  seoGrowth: {
    id: "seoGrowth",
    kicker: "SEO Growth",
    headline: "找出你的网站还没有覆盖的真实搜索需求。",
    lede: "增长看的是真实需求覆盖——主题、商业意图、市场与深度——不是你已经发了多少页。",
    coverage: [
      { value: 72, unit: "%", label: "Topic" },
      { value: 51, unit: "%", label: "Commercial" },
      { value: 34, unit: "%", label: "Market" },
      { value: 58, unit: "%", label: "Content depth" },
    ],
    opportunities: [
      { value: 18, label: "topic opportunities" },
      { value: 11, label: "commercial intents" },
      { value: 7, label: "market expansions" },
      { value: 5, label: "pages worth expanding" },
    ],
    note: "我们不以「关键词数量」作为增长指标。",
  },

  geo: {
    id: "geo",
    kicker: "GEO",
    headline: "人们能否找到关于你业务的正确答案？",
    lede: "现代搜索常常直接展示答案、摘要和来源链接。GEO 检查你的网站是否提供清晰实体、直接答案、证据，以及一致的上下文。",
    modernSearch:
      "当有人搜索时，他们可能先看到简短答案、摘要和来源链接——而不只是一串蓝链。你的网站需要足够清楚，才能支撑这种展示。",
    checks: [
      "清晰的公司与产品实体",
      "对买家问题的直接回答",
      "主张对应可查证据",
      "关键页面与语言间的上下文一致",
    ],
    disclaimer:
      "GEO 衡量信息是否可理解、可支撑、可引用。它不保证任何 AI 产品会收录、推荐或引用你的页面。",
  },

  questions: {
    id: "questions",
    kicker: "搜索问题",
    headline: "客户联系你之前，会先问什么？",
    lede: "如果重要买家问题缺失、只答一半，或藏得很深，流量与信任都会卡住——哪怕站点看起来技术上很干净。",
    coverageTitle: "Question Coverage",
    analyzed: { value: 216, label: "questions analyzed" },
    breakdown: [
      { label: "Answered", value: 74, unit: "%" },
      { label: "Partial", value: 22, unit: "%" },
      { label: "Uncovered", value: 4, unit: "%" },
    ],
    commercialGroup: {
      label: "Commercial",
      total: 41,
      covered: 26,
      partial: 9,
      missing: 6,
    },
    gapExample: {
      question: "低层浇筑该选哪款产品？",
      suggestedAction:
        "在对应产品页增加直接答案区块：适用场景、约束条件，并链到规格说明。",
    },
    wallTitle: "买家已经在问的问题",
    wall: [
      "为什么我的网站没有流量？",
      "怎样提升产品页可见性？",
      "网站还缺哪些主题？",
      "为什么有些页面搜不到？",
      "怎样在新市场触达更多客户？",
      "为什么竞品会出现在我本该覆盖的搜索里？",
      "应该先改哪些页面？",
      "产品页还缺哪些关键信息？",
      "怎样判断公司信息是否够清晰？",
      "哪些商业意图网站只答了一半？",
      "为什么国际站在不同语言间感觉不一致？",
      "怎样让产品规格更容易被找到？",
      "拓展新市场之前该先修什么？",
      "哪些应用页内容太薄，撑不起询盘？",
      "站点已经很大时，内容该怎么排优先级？",
      "产品页上的主张还缺哪些证明？",
      "怎样让公司名与产品名在多语言间对齐？",
      "哪些买家问题应该直接出现在产品页上？",
    ],
  },

  entity: {
    id: "entity",
    kicker: "Evidence · Entity · Citation",
    headline: "信息越清楚，越容易被信任、理解与引用。",
    lede: "人和现代搜索摘要都需要稳定的实体、直接答案，以及指向证据的主张。",
    tree: {
      label: "Company",
      children: [
        "Products",
        "Applications",
        "Technical Information",
        "Documentation",
        "Evidence",
      ],
    },
    metrics: [
      { value: 94, label: "Entity clarity" },
      { value: 87, label: "Answerability" },
      { value: 71, label: "Evidence coverage" },
      { value: 92, label: "Consistency" },
      { value: 64, label: "Citation readiness" },
    ],
  },

  multilingual: {
    id: "multilingual",
    kicker: "多语言",
    headline: "同一门生意，在每个市场保持一致。",
    lede: "每种语言都应守住同一套公司与产品事实，同时用真实深度覆盖当地意图。",
    languages: ["EN", "中文", "Español", "العربية", "Русский", "Deutsch"],
    fields: [
      { label: "Company name", status: "pass" },
      { label: "Product name", status: "pass" },
      { label: "Specifications", status: "pass" },
      { label: "Applications", status: "pass" },
      { label: "Claims", status: "watch" },
      { label: "Question coverage", status: "watch" },
    ],
    consistency: { value: 94, unit: "%", label: "Consistency" },
  },

  methodology: {
    id: "methodology",
    kicker: "方法与信任",
    headline: "以人为本的可见性工作——不是黑盒分数。",
    lede: "Mika 把技术健康与增长机会分开，再说明为什么重要、下一步该做什么。",
    points: [
      "扫描线上站点的抓取、结构、内容、实体、问题与证据。",
      "保持 SEO Health、SEO Growth、GEO Health、GEO Growth 彼此独立。",
      "报告原因、样例 URL、机会与下一步动作——而不是神秘 KPI。",
      "改完之后用复审验证进展。",
    ],
  },

  faq: faqZh,

  cta: {
    id: "cta",
    kicker: "下一步",
    headline: "先看清网站站在哪里，再决定下一步做什么。",
    lede: "做一次结构化的 SEO + GEO 审计，拿到健康发现、增长缺口，以及可执行的 Blueprint。",
    primaryCta: { label: "开始结构化审计", href: "#cta" },
    secondaryCta: { label: "用 WhatsApp 提问", href: CONTACT_FACTS.whatsappHref },
    contactIntro: "想先沟通？直接联系我们。",
    contact: {
      whatsapp: {
        id: "whatsapp",
        label: "WhatsApp",
        display: CONTACT_FACTS.whatsappDisplay,
        href: CONTACT_FACTS.whatsappHref,
      },
      email: {
        id: "email",
        label: "Email",
        display: CONTACT_FACTS.email,
        href: `mailto:${CONTACT_FACTS.email}`,
      },
      wechat: {
        id: "wechat",
        label: "微信",
        display: CONTACT_FACTS.wechatId,
        href: "",
        copyOnly: true,
        copyHint: "复制微信号",
      },
    },
    note: "扫描指导不会自动发布改动。以上联系方式为本首页唯一事实来源。",
  },

  footer: {
    tagline: "面向技术 SEO、搜索增长、网站理解与 AI 发现的结构化可见性。",
    productHeading: "产品",
    productLinks: [
      { label: "能力框架", href: "#framework" },
      { label: "深度审计", href: "#audit" },
      { label: "SEO Growth", href: "#seoGrowth" },
      { label: "GEO", href: "#geo" },
      { label: "常见问题", href: "#faq" },
    ],
    projectHeading: "项目",
    projectLinks: [
      { label: "GitHub", href: "https://github.com/RTGS2017/mika-webside" },
      { label: "隐私", href: "#privacy" },
    ],
    contactHeading: "联系",
    legal:
      "本页示例界面仅供说明。Mika Visibility 不出售排名、不保证答案展示位，也不编造商业事实。",
  },
};
