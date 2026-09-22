/**
 * Mika homepage V2 content contract.
 * Static site today (index.html). These modules are the single source of truth
 * for copy; Visual / Animation / SEO / Integration agents consume them —
 * they do not invent parallel strings.
 */

export type Locale = "en" | "zh";

/** Numeric value separated from labels for count-up / progress animations. */
export interface MetricNumber {
  /** Raw number used by animation (e.g. 92, 71, 74). */
  value: number;
  /** Optional unit rendered after the number (e.g. "%"). Empty string = bare number. */
  unit?: "%" | "" | string;
  label: string;
}

export interface TextLink {
  label: string;
  href: string;
}

export interface NavContent {
  brandName: string;
  brandSuffix: string;
  ariaHome: string;
  menuLabel: string;
  skipToContent: string;
  links: TextLink[];
  primaryCta: TextLink;
}

export interface HeroMetricChip {
  id: "seoHealth" | "seoGrowth" | "geoHealth" | "geoGrowth";
  label: string;
  /** Short capability line under the label — not a composite score. */
  hint: string;
}

export interface HeroContent {
  id: "hero";
  eyebrow: string;
  /** Core positioning — keep stable across locales conceptually. */
  headline: string;
  /** Product definition sentence. */
  definition: string;
  metricChips: HeroMetricChip[];
  support: string;
  primaryCta: TextLink;
  secondaryCta: TextLink;
  disclaimer: string;
}

export interface ProblemColumn {
  title: string;
  body: string;
  bullets: string[];
}

export interface ProblemContent {
  id: "problem";
  kicker: string;
  headline: string;
  lede: string;
  healthy: ProblemColumn;
  growing: ProblemColumn;
  conclusion: string;
}

export interface FrameworkCell {
  id: "seoHealth" | "seoGrowth" | "geoHealth" | "geoGrowth";
  axis: string;
  title: string;
  body: string;
  items: string[];
}

export interface FrameworkContent {
  id: "framework";
  kicker: string;
  headline: string;
  lede: string;
  cells: FrameworkCell[];
}

export interface AuditStat {
  id: string;
  label: string;
  value: number;
  /** Human suffix shown after the number, e.g. "pages", "internal links". */
  valueLabel: string;
}

export interface AuditStep {
  id: string;
  label: string;
}

export interface AuditContent {
  id: "audit";
  kicker: string;
  headline: string;
  lede: string;
  stats: AuditStat[];
  steps: AuditStep[];
  note: string;
}

export interface HealthGrowthBar {
  label: string;
  value: number;
  unit?: "%" | "" | string;
}

export interface HealthGrowthPanel {
  kicker: string;
  title: string;
  score: MetricNumber;
  bars: HealthGrowthBar[];
}

export interface HealthGrowthContent {
  id: "healthGrowth";
  kicker: string;
  headline: string;
  lede: string;
  health: HealthGrowthPanel;
  growth: HealthGrowthPanel;
  philosophy: string;
}

export interface BlueprintAction {
  code: string;
  targetPath: string;
  title: string;
  changes: string[];
  priority: string;
  validation: string;
}

export interface BlueprintStage {
  step: string;
  title: string;
  body: string;
}

export interface BlueprintContent {
  id: "blueprint";
  kicker: string;
  headline: string;
  lede: string;
  stages: BlueprintStage[];
  sampleAction: BlueprintAction;
  executeNote: string;
}

export interface SeoGrowthContent {
  id: "seoGrowth";
  kicker: string;
  headline: string;
  lede: string;
  coverage: MetricNumber[];
  opportunities: MetricNumber[];
  note: string;
}

export interface GeoContent {
  id: "geo";
  kicker: string;
  headline: string;
  lede: string;
  modernSearch: string;
  checks: string[];
  disclaimer: string;
}

export interface QuestionCoverageBreakdown {
  label: string;
  value: number;
  unit?: "%" | "" | string;
}

export interface QuestionCoverageGroup {
  label: string;
  total: number;
  covered: number;
  partial: number;
  missing: number;
}

export interface QuestionGapExample {
  question: string;
  suggestedAction: string;
}

export interface QuestionsContent {
  id: "questions";
  kicker: string;
  headline: string;
  lede: string;
  coverageTitle: string;
  analyzed: MetricNumber;
  breakdown: QuestionCoverageBreakdown[];
  commercialGroup: QuestionCoverageGroup;
  gapExample: QuestionGapExample;
  wallTitle: string;
  /** Business questions for the question wall — no AI/LLM jargon in stems. */
  wall: string[];
}

export interface EntityTreeNode {
  label: string;
  children?: string[];
}

export interface EntityContent {
  id: "entity";
  kicker: string;
  headline: string;
  lede: string;
  tree: EntityTreeNode;
  metrics: MetricNumber[];
}

export type ConsistencyStatus = "pass" | "watch";

export interface MultilingualField {
  label: string;
  status: ConsistencyStatus;
}

export interface MultilingualContent {
  id: "multilingual";
  kicker: string;
  headline: string;
  lede: string;
  languages: string[];
  fields: MultilingualField[];
  consistency: MetricNumber;
}

export interface MethodologyContent {
  id: "methodology";
  kicker: string;
  headline: string;
  lede: string;
  points: string[];
}

export type FaqCategory = "seo" | "growth" | "visibility";

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  /** 2–4 sentences, people-first. */
  directAnswer: string;
  /** How Mika handles this. */
  productEvidence: string;
  nextAction: TextLink;
}

export interface FaqContent {
  id: "faq";
  kicker: string;
  headline: string;
  lede: string;
  items: FaqItem[];
}

export interface ContactChannel {
  id: "whatsapp" | "email" | "wechat";
  label: string;
  /** Display string shown in UI. */
  display: string;
  /** Action href when applicable (wa.me / mailto). Empty for WeChat copy-only. */
  href: string;
  /** WeChat is copy-only — no deep link. */
  copyOnly?: boolean;
  copyHint?: string;
}

export interface ContactContent {
  whatsapp: ContactChannel;
  email: ContactChannel;
  wechat: ContactChannel;
}

export interface CtaContent {
  id: "cta";
  kicker: string;
  headline: string;
  lede: string;
  primaryCta: TextLink;
  secondaryCta: TextLink;
  contactIntro: string;
  contact: ContactContent;
  note: string;
}

export interface FooterContent {
  tagline: string;
  productHeading: string;
  productLinks: TextLink[];
  projectHeading: string;
  projectLinks: TextLink[];
  contactHeading: string;
  legal: string;
}

/**
 * Full homepage content for one locale.
 * Section ids are stable anchors for Visual / Animation / Integration.
 */
export interface HomeContent {
  locale: Locale;
  nav: NavContent;
  hero: HeroContent;
  problem: ProblemContent;
  framework: FrameworkContent;
  audit: AuditContent;
  healthGrowth: HealthGrowthContent;
  blueprint: BlueprintContent;
  seoGrowth: SeoGrowthContent;
  geo: GeoContent;
  questions: QuestionsContent;
  entity: EntityContent;
  multilingual: MultilingualContent;
  methodology: MethodologyContent;
  faq: FaqContent;
  cta: CtaContent;
  footer: FooterContent;
}

/**
 * Shared contact facts for homepage CTA/FAQ copy.
 * Live UI SSOT is `contact-config.js` (`window.MIKA_CONTACT`) — keep these identical.
 * Do not change numbers/ids without product approval. Do not invent a second contact widget.
 */
export const CONTACT_FACTS = {
  whatsappDisplay: "+86 138 1401 5518",
  whatsappHref: "https://wa.me/8613814015518",
  email: "akizukiovo@gmail.com",
  wechatId: "Xue2017105",
} as const;
