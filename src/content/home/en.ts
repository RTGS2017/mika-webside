import { faqEn } from "./faq.en";
import { CONTACT_FACTS, type HomeContent } from "./types";

/**
 * English homepage copy — V2 narrative contract.
 * Numbers are separated from labels for animation agents.
 */
export const homeEn: HomeContent = {
  locale: "en",

  nav: {
    brandName: "Mika",
    brandSuffix: "Visibility",
    ariaHome: "Mika Visibility home",
    menuLabel: "Menu",
    skipToContent: "Skip to content",
    links: [
      { label: "Product", href: "#problem" },
      { label: "Framework", href: "#framework" },
      { label: "How it works", href: "#blueprint" },
      { label: "SEO", href: "#seoGrowth" },
      { label: "GEO", href: "#geo" },
      { label: "FAQ", href: "#faq" },
    ],
    primaryCta: { label: "Start a structured audit", href: "#cta" },
  },

  hero: {
    id: "hero",
    eyebrow: "Search & AI visibility platform",
    headline: "Make Your Website Visible in Search and AI.",
    definition:
      "A structured visibility platform for technical SEO, search growth, website understanding, and AI discovery.",
    metricChips: [
      {
        id: "seoHealth",
        label: "SEO Health",
        hint: "Crawlable, indexable, structurally sound",
      },
      {
        id: "seoGrowth",
        label: "SEO Growth",
        hint: "Topics, intents, and markets still open",
      },
      {
        id: "geoHealth",
        label: "GEO Health",
        hint: "Clear entities, answers, and evidence",
      },
      {
        id: "geoGrowth",
        label: "GEO Growth",
        hint: "Uncovered questions and citation room",
      },
    ],
    support:
      "No black-box score. No one-size-fits-all checklist. Understand your website. Find the gaps. Build the next actions.",
    primaryCta: { label: "Start a structured audit", href: "#cta" },
    secondaryCta: { label: "See Health vs Growth", href: "#healthGrowth" },
    disclaimer:
      "Illustrative sample data on this page. Mika does not predict rankings or guarantee placement in any answer surface.",
  },

  problem: {
    id: "problem",
    kicker: "Visibility problem",
    headline: "Your website can be healthy and still be hard to discover.",
    lede: "Technical cleanliness and discoverability are related — they are not the same job.",
    healthy: {
      title: "Healthy",
      body: "Pages can be crawled, titles and structure make sense, and the site does not fight itself with noindex traps or broken architecture.",
      bullets: [
        "Crawl and index paths are intentional",
        "Architecture and internal links hold together",
        "On-page fundamentals are in place",
      ],
    },
    growing: {
      title: "Growing",
      body: "The site covers the topics, commercial intents, and markets buyers actually search — with enough depth to answer, not just mention.",
      bullets: [
        "Topic and intent coverage expands over time",
        "Product and application pages answer real questions",
        "Markets stay consistent without thin localization shells",
      ],
    },
    conclusion:
      "Health tells you what is working. Growth shows what is missing.",
  },

  framework: {
    id: "framework",
    kicker: "SEO + GEO framework",
    headline: "One website. Four independent capabilities.",
    lede: "SEO and GEO stay on separate tracks. Health and Growth stay on separate scales. There is no Overall Score that blends them.",
    cells: [
      {
        id: "seoHealth",
        axis: "Now · Search",
        title: "SEO Health",
        body: "Is the live site technically ready to be found and understood in search?",
        items: ["Technical", "Structure", "Content"],
      },
      {
        id: "geoHealth",
        axis: "Now · Answers",
        title: "GEO Health",
        body: "Can people find a clear, supportable answer about your business from the site itself?",
        items: ["Understanding", "Evidence", "Answers"],
      },
      {
        id: "seoGrowth",
        axis: "Next · Search",
        title: "SEO Growth",
        body: "Which coverage, intent depth, and markets are still unoccupied?",
        items: ["Coverage", "Intent", "Depth", "Markets"],
      },
      {
        id: "geoGrowth",
        axis: "Next · Answers",
        title: "GEO Growth",
        body: "Where can answer coverage, citations, and expansion still improve?",
        items: ["Query gaps", "Answer gaps", "Citation", "Expansion"],
      },
    ],
  },

  audit: {
    id: "audit",
    kicker: "Deep audit",
    headline: "Deep Audit sees the site as a system — not a single score.",
    lede: "A scan walks pages, structure, topics, entities, questions, and evidence before any blueprint is written.",
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
    note: "Sample dashboard values are illustrative. Your scan reports live numbers for your site.",
  },

  healthGrowth: {
    id: "healthGrowth",
    kicker: "Health vs Growth",
    headline: "Two scores. Two jobs. Never blended.",
    lede: "Use Health to stabilize foundations. Use Growth to see what demand is still unanswered.",
    health: {
      kicker: "SEO HEALTH",
      title: "Where the site stands",
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
      title: "What is still missing",
      score: { value: 71, label: "SEO Growth" },
      bars: [
        { label: "Topic", value: 62, unit: "%" },
        { label: "Intent", value: 54, unit: "%" },
        { label: "Commercial", value: 48, unit: "%" },
        { label: "Market", value: 31, unit: "%" },
        { label: "Topical depth", value: 57, unit: "%" },
      ],
    },
    philosophy:
      "A high health score does not automatically mean high growth potential.",
  },

  blueprint: {
    id: "blueprint",
    kicker: "Audit → Diagnosis → Blueprint",
    headline: "Don’t stop at findings. Ship the next action.",
    lede: "Scan produces facts. Diagnosis groups them. Blueprint turns groups into prioritized work with a validation step.",
    stages: [
      {
        step: "01",
        title: "Audit",
        body: "Collect crawl, structure, content, entity, question, and evidence facts with sample URLs.",
      },
      {
        step: "02",
        title: "Diagnosis",
        body: "Group issues by rule and severity so the story is actionable — not a vibe score.",
      },
      {
        step: "03",
        title: "Blueprint",
        body: "Convert groups into page-level actions with priority, changes, and a re-audit check.",
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
    executeNote:
      "Blueprint is guidance. It does not auto-edit or auto-publish your site.",
  },

  seoGrowth: {
    id: "seoGrowth",
    kicker: "SEO Growth",
    headline: "Find the searches your website does not answer yet.",
    lede: "Growth is coverage of real demand — topics, commercial intent, markets, and depth — not how many pages you already published.",
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
    note: "We do not report “keyword count” as a growth metric.",
  },

  geo: {
    id: "geo",
    kicker: "GEO",
    headline: "Can people find the right answer about your business?",
    lede: "Modern search often shows direct answers, summaries, and source links. GEO checks whether your website provides clear entities, direct answers, evidence, and consistent context.",
    modernSearch:
      "When someone searches, they may see a short answer, a summary, and links to sources — not only a list of blue links. Your site needs to be clear enough to support that.",
    checks: [
      "Clear company and product entities",
      "Direct answers to buyer questions",
      "Evidence tied to claims",
      "Consistent context across key pages and languages",
    ],
    disclaimer:
      "GEO measures whether information is understandable, supportable, and referenceable. It does not guarantee inclusion, recommendation, or citation in any AI product.",
  },

  questions: {
    id: "questions",
    kicker: "Search questions",
    headline: "What will people ask before they contact you?",
    lede: "If important buyer questions are missing, partial, or buried, traffic and trust both stall — even when the site looks technically fine.",
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
      question: "Which product is suitable for low-rise concrete placement?",
      suggestedAction:
        "Add a direct answer block on the relevant product page with use case, constraints, and a link to specifications.",
    },
    wallTitle: "Questions your buyers already ask",
    wall: [
      "Why isn't my website getting traffic?",
      "How do I improve product page visibility?",
      "Which topics are missing from my website?",
      "Why aren't some pages appearing in search?",
      "How can I reach more customers in new markets?",
      "Why do competitors appear for searches I should cover?",
      "Which pages should I improve first?",
      "What information is missing from my product pages?",
      "How do I know if my company information is clear enough?",
      "Which commercial intents does my site only partially answer?",
      "Why does my international site feel inconsistent across languages?",
      "How can I make product specifications easier to find?",
      "What should I fix before I expand into another market?",
      "Which application pages are too thin to support inquiries?",
      "How do I prioritize content when the site is already large?",
      "What proof is missing for the claims on my product pages?",
      "How can I align company and product names across languages?",
      "Which buyer questions should appear on the product page itself?",
    ],
  },

  entity: {
    id: "entity",
    kicker: "Evidence · Entity · Citation",
    headline: "Clear information is easier to trust, understand and reference.",
    lede: "People and modern search surfaces need stable entities, direct answers, and claims that point to evidence.",
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
    kicker: "Multilingual",
    headline: "One business. Consistent across every market.",
    lede: "Every language should keep the same company and product facts — while covering market-specific intent with real depth.",
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
    kicker: "Methodology",
    headline: "People-first visibility work — not a black-box score.",
    lede: "Mika separates technical health from growth opportunity, then explains why something matters and what to do next.",
    points: [
      "Scan the live site for crawl, structure, content, entities, questions, and evidence.",
      "Keep SEO Health, SEO Growth, GEO Health, and GEO Growth independent.",
      "Report reasons, sample URLs, opportunities, and next actions — not a mystery KPI.",
      "Validate progress with a re-audit after changes ship.",
    ],
  },

  faq: faqEn,

  cta: {
    id: "cta",
    kicker: "Next step",
    headline: "Know where your website stands. Know what to do next.",
    lede: "Run a structured SEO + GEO audit. Get health findings, growth gaps, and a blueprint you can act on.",
    primaryCta: { label: "Start a structured audit", href: "#cta" },
    secondaryCta: { label: "Ask a question on WhatsApp", href: CONTACT_FACTS.whatsappHref },
    contactIntro: "Prefer to talk first? Reach us directly.",
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
        label: "WeChat",
        display: CONTACT_FACTS.wechatId,
        href: "",
        copyOnly: true,
        copyHint: "Copy WeChat ID",
      },
    },
    note: "Scan guidance does not auto-publish changes. Contact details above are the source of truth for this homepage.",
  },

  footer: {
    tagline:
      "Structured visibility for technical SEO, search growth, website understanding, and AI discovery.",
    productHeading: "Product",
    productLinks: [
      { label: "Framework", href: "#framework" },
      { label: "Deep Audit", href: "#audit" },
      { label: "SEO Growth", href: "#seoGrowth" },
      { label: "GEO", href: "#geo" },
      { label: "FAQ", href: "#faq" },
    ],
    projectHeading: "Project",
    projectLinks: [
      { label: "GitHub", href: "https://github.com/RTGS2017/mika-webside" },
      { label: "Privacy", href: "#privacy" },
    ],
    contactHeading: "Contact",
    legal:
      "Sample UI on this page is illustrative. Mika Visibility does not sell rankings, guaranteed answer-surface placement, or fabricated commercial facts.",
  },
};
