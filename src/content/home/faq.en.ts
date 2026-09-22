import type { FaqContent } from "./types";

/**
 * English FAQ — visible Q&A contract for Visual + SEO (FAQPage JSON-LD only after public render).
 * Question stems avoid AI/LLM/RAG jargon.
 */
export const faqEn: FaqContent = {
  id: "faq",
  kicker: "FAQ",
  headline: "Clear answers before you start an audit.",
  lede: "Short answers about website SEO, search visibility, content gaps, and how Mika separates technical health from growth opportunity.",
  items: [
    {
      id: "faq-seo-audit",
      category: "seo",
      question: "What is a website SEO audit?",
      directAnswer:
        "A website SEO audit reviews how search engines can crawl, index, and understand your pages. It looks at technical foundations, page structure, and content signals — not at guessing a future ranking. The goal is a clear picture of what is working and what blocks visibility.",
      productEvidence:
        "Mika runs a structured SEO health pass: crawlability, architecture, on-page basics, internal links, and related technical checks. Findings stay grouped by rule with sample URLs, not a single black-box score.",
      nextAction: { label: "Start a structured audit", href: "#cta" },
    },
    {
      id: "faq-organic-traffic",
      category: "seo",
      question: "Why is my website not getting organic traffic?",
      directAnswer:
        "Traffic stalls when pages are hard to discover, thin on intent, or missing topics buyers actually search. Technical problems can hide pages; content gaps can leave pages visible but unused. Fixing only one side rarely unlocks sustained growth.",
      productEvidence:
        "Mika separates SEO Health (can the site be crawled and understood?) from SEO Growth (which searches and intents are still unanswered). You see both the blockers and the missing coverage.",
      nextAction: { label: "Talk through your traffic gaps", href: "#cta" },
    },
    {
      id: "faq-search-visibility",
      category: "seo",
      question: "How can I improve my search visibility?",
      directAnswer:
        "Improve crawl and index health first, then expand the topics, intents, and markets your site can honestly cover. Visibility grows when important pages are findable and when they answer real commercial questions with clear evidence.",
      productEvidence:
        "Mika maps technical issues into prioritized actions, then surfaces coverage gaps for topics, commercial intent, depth, and markets — so you improve foundations and expansion in the right order.",
      nextAction: { label: "Request a visibility scan", href: "#cta" },
    },
    {
      id: "faq-pages-not-appearing",
      category: "seo",
      question: "Why are some pages not appearing in search?",
      directAnswer:
        "Pages may be blocked by robots rules, unexpected noindex, weak internal links, duplicates, or thin templates that search systems deprioritize. Sometimes the page exists but is not connected or not worth indexing yet.",
      productEvidence:
        "Deep Audit checks crawl paths, index signals, architecture, and sample URLs for each issue group so you can see why a page is missing — not just that it is missing.",
      nextAction: { label: "Review crawl and index findings", href: "#cta" },
    },
    {
      id: "faq-product-page-visibility",
      category: "seo",
      question: "How can I improve product page visibility?",
      directAnswer:
        "Strong product pages define the product, use cases, specifications, and proof buyers need before contact. They also need clean titles, clear structure, and internal links from relevant hubs. Marketing slogans alone rarely carry a product page.",
      productEvidence:
        "Mika flags thin product templates, missing definitions, weak evidence, and expansion opportunities such as ACTION-style blueprints for specific product URLs.",
      nextAction: { label: "Audit a product URL", href: "#cta" },
    },
    {
      id: "faq-content-gaps",
      category: "growth",
      question: "How do I find content gaps on my website?",
      directAnswer:
        "Compare what your site already covers with the topics and intents your buyers search. Gaps appear as missing themes, shallow pages, or commercial questions that never get a direct answer. Page count is not the same as coverage.",
      productEvidence:
        "SEO Growth reports topic, commercial, market, and depth coverage with opportunity counts — so gaps are measurable, not guessed from a keyword list.",
      nextAction: { label: "See coverage opportunities", href: "#cta" },
    },
    {
      id: "faq-new-topics",
      category: "growth",
      question: "How do I identify new topics to target?",
      directAnswer:
        "Start from buyer jobs, applications, and commercial questions your current pages do not answer. Prioritize topics you can support with real product facts. Expanding into unsupported claims creates visibility that will not hold.",
      productEvidence:
        "Mika surfaces uncovered topics and commercial intents from the site map and content model, then turns priority gaps into blueprint actions with target pages.",
      nextAction: { label: "Map missing topics", href: "#cta" },
    },
    {
      id: "faq-new-markets",
      category: "growth",
      question: "How can I expand into new markets?",
      directAnswer:
        "Market expansion needs consistent company and product facts across languages, plus pages that cover local intent — not machine-translated shells. If entity names, specs, or answers drift by locale, trust and discoverability both suffer.",
      productEvidence:
        "Multilingual checks review language consistency, field completeness, and market expansion opportunities while keeping Health and Growth on separate scales.",
      nextAction: { label: "Discuss multilingual expansion", href: "#cta" },
    },
    {
      id: "faq-commercial-opportunities",
      category: "growth",
      question: "How do I identify commercial search opportunities?",
      directAnswer:
        "Commercial opportunities are searches where buyers compare options, choose a product, or prepare to inquire. They show up as intent clusters your site only partially answers — especially on product and application pages.",
      productEvidence:
        "Mika measures commercial coverage and lists intents that are covered, partial, or missing, with suggested next actions instead of raw keyword volume promises.",
      nextAction: { label: "Review commercial intent gaps", href: "#cta" },
    },
    {
      id: "faq-healthy-still-grow",
      category: "visibility",
      question: "Why does a technically healthy website still have room to grow?",
      directAnswer:
        "Health means the site can be crawled and understood. Growth means important searches, markets, and questions are still unanswered. A clean technical site can still leave demand on the table.",
      productEvidence:
        "Mika keeps SEO Health and SEO Growth as independent scores and panels. A high health score never becomes an automatic growth score.",
      nextAction: { label: "Compare Health vs Growth", href: "#cta" },
    },
    {
      id: "faq-company-clarity",
      category: "visibility",
      question: "How can I make my company information clearer?",
      directAnswer:
        "State who you are, what you offer, where you operate, and what proof supports your claims — in plain language on stable pages. Clear company information helps people and modern search surfaces trust and reference you.",
      productEvidence:
        "Entity and evidence checks score clarity, consistency, and citation readiness across company, product, application, and documentation nodes.",
      nextAction: { label: "Improve entity clarity", href: "#cta" },
    },
    {
      id: "faq-product-info-visibility",
      category: "visibility",
      question: "How can I improve the visibility of my product information?",
      directAnswer:
        "Put definitions, specifications, applications, and evidence where they can be found and quoted. Keep names and facts consistent across languages. Hide less behind banners and more in structured, readable sections.",
      productEvidence:
        "GEO-oriented checks evaluate answerability, evidence coverage, and citation readiness for product information — without promising placement in any specific answer product.",
      nextAction: { label: "Strengthen product answers", href: "#cta" },
    },
    {
      id: "faq-missing-customer-questions",
      category: "visibility",
      question: "Why are important customer questions missing from my website?",
      directAnswer:
        "Sites often describe features but skip the questions people ask before contacting sales. Those questions live in product selection, installation constraints, market fit, and proof — and they need direct answers on real pages.",
      productEvidence:
        "Question Coverage analyzes buyer questions, marks answered / partial / uncovered, and attaches suggested actions for missing commercial questions.",
      nextAction: { label: "Fill unanswered buyer questions", href: "#cta" },
    },
    {
      id: "faq-easier-to-reference",
      category: "visibility",
      question: "How can I make important information easier to reference?",
      directAnswer:
        "Use clear definitions, stable URLs, consistent entity names, and claims tied to evidence. Information that is scattered, slogan-heavy, or contradictory is harder for people — and for search answer surfaces — to trust and cite.",
      productEvidence:
        "Mika tracks evidence coverage, consistency, and citation readiness, then blueprints concrete pages to expand definitions, specs, use cases, and FAQ blocks.",
      nextAction: { label: "Build a referenceable blueprint", href: "#cta" },
    },
  ],
};
