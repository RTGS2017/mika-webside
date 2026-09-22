import type { FaqContent } from "./types";

/**
 * 中文 FAQ — 自然表达，非直译腔。
 * 题干避免 AI / LLM / RAG 等术语。
 */
export const faqZh: FaqContent = {
  id: "faq",
  kicker: "常见问题",
  headline: "开始审计前，先看清这些问题。",
  lede: "用简短答案说明网站 SEO、搜索可见性、内容缺口，以及 Mika 如何把技术健康与增长机会分开衡量。",
  items: [
    {
      id: "faq-seo-audit",
      category: "seo",
      question: "什么是网站 SEO 审计？",
      directAnswer:
        "网站 SEO 审计会检查搜索引擎能否顺利抓取、收录并理解你的页面。它关注技术基础、页面结构和内容信号，而不是预测未来排名。目标是看清哪些地方在正常工作，哪些地方在挡住可见性。",
      productEvidence:
        "Mika 会做结构化的 SEO Health 检查：可抓取性、架构、页面基础、内链及相关技术项。发现按规则分组，并附带样例 URL，而不是一个黑盒总分。",
      nextAction: { label: "开始结构化审计", href: "#cta" },
    },
    {
      id: "faq-organic-traffic",
      category: "seo",
      question: "为什么我的网站没有自然流量？",
      directAnswer:
        "流量停滞，往往是因为页面难以被发现、对搜索意图覆盖太薄，或缺少买家真正会搜的主题。技术问题会把页面藏起来；内容缺口会让页面“存在却用不上”。只修一边，通常很难带来持续增长。",
      productEvidence:
        "Mika 把 SEO Health（站点能否被抓取与理解）和 SEO Growth（还有哪些搜索与意图未被回答）分开呈现，让你同时看到阻塞点与覆盖缺口。",
      nextAction: { label: "沟通流量缺口", href: "#cta" },
    },
    {
      id: "faq-search-visibility",
      category: "seo",
      question: "怎样提升搜索可见性？",
      directAnswer:
        "先把抓取与收录健康度修好，再扩展站点能够诚实覆盖的主题、意图与市场。重要页面可被发现，并且能回答真实的商业问题、提供清晰证据时，可见性才会更稳地增长。",
      productEvidence:
        "Mika 先把技术问题落成优先级动作，再呈现主题、商业意图、深度与市场的覆盖缺口，帮助你按正确顺序打基础与做扩展。",
      nextAction: { label: "申请可见性扫描", href: "#cta" },
    },
    {
      id: "faq-pages-not-appearing",
      category: "seo",
      question: "为什么有些页面搜不到？",
      directAnswer:
        "页面可能被 robots 规则挡住、意外 noindex、内链太弱、存在重复，或模板内容过薄而被降权。有时页面存在，但没有被连上，或不值得优先收录。",
      productEvidence:
        "Deep Audit 会检查抓取路径、收录信号、站点架构，并为每个问题组给出样例 URL，让你看清“为什么缺失”，而不只是“缺失了”。",
      nextAction: { label: "查看抓取与收录发现", href: "#cta" },
    },
    {
      id: "faq-product-page-visibility",
      category: "seo",
      question: "怎样提升产品页可见性？",
      directAnswer:
        "强产品页需要写清产品定义、使用场景、规格参数，以及买家联系前需要的证据。同时要有清晰标题、结构和来自相关栏目页的内链。只堆营销口号，很难撑起产品页。",
      productEvidence:
        "Mika 会标出过薄的产品模板、缺失定义、证据不足，以及针对具体产品 URL 的扩展机会（含 Blueprint 动作）。",
      nextAction: { label: "审计一个产品 URL", href: "#cta" },
    },
    {
      id: "faq-content-gaps",
      category: "growth",
      question: "如何发现网站上的内容缺口？",
      directAnswer:
        "把站点已覆盖的内容，和买家真实会搜的主题、意图做对比。缺口会表现为缺失主题、页面过浅，或商业问题始终没有直接答案。页面数量不等于覆盖质量。",
      productEvidence:
        "SEO Growth 会报告主题、商业、市场与深度覆盖，并给出机会数量——缺口可衡量，而不是靠关键词清单猜测。",
      nextAction: { label: "查看覆盖机会", href: "#cta" },
    },
    {
      id: "faq-new-topics",
      category: "growth",
      question: "如何发现值得做的新主题？",
      directAnswer:
        "从买家任务、应用场景和现有页面尚未回答的商业问题出发。优先选择你能用真实产品事实支撑的主题。为无法证明的主张去扩展，带来的可见性很难站得住。",
      productEvidence:
        "Mika 会从站点地图与内容模型中找出未覆盖主题和商业意图，再把优先缺口写成带目标页面的 Blueprint 动作。",
      nextAction: { label: "梳理缺失主题", href: "#cta" },
    },
    {
      id: "faq-new-markets",
      category: "growth",
      question: "怎样拓展新市场？",
      directAnswer:
        "市场拓展需要跨语言保持公司与产品信息一致，并覆盖当地意图——而不是机翻壳页面。如果实体名称、规格或答案在不同语言间漂移，信任与可发现性都会受损。",
      productEvidence:
        "多语言检查会审一致性、字段完整度与市场扩展机会，同时保持 Health 与 Growth 分轨计分。",
      nextAction: { label: "讨论多语言拓展", href: "#cta" },
    },
    {
      id: "faq-commercial-opportunities",
      category: "growth",
      question: "如何识别有商业价值的搜索机会？",
      directAnswer:
        "商业机会对应买家在比较方案、选型或准备询盘时的搜索。它们常表现为站点只部分回答的意图簇——尤其集中在产品页与应用页。",
      productEvidence:
        "Mika 会衡量商业意图覆盖，并列出已覆盖 / 部分覆盖 / 缺失的意图，配套下一步动作，而不是承诺关键词数量或流量保证。",
      nextAction: { label: "复盘商业意图缺口", href: "#cta" },
    },
    {
      id: "faq-healthy-still-grow",
      category: "visibility",
      question: "为什么技术很健康的网站仍有增长空间？",
      directAnswer:
        "健康表示站点能被抓取与理解；增长表示仍有重要搜索、市场与问题未被回答。技术干净的网站，同样可能把需求留在桌面上。",
      productEvidence:
        "Mika 把 SEO Health 与 SEO Growth 作为独立分数与面板呈现。高健康分绝不会自动变成高增长分。",
      nextAction: { label: "对比 Health 与 Growth", href: "#cta" },
    },
    {
      id: "faq-company-clarity",
      category: "visibility",
      question: "怎样让公司信息更清晰？",
      directAnswer:
        "在稳定页面上用直白话写清：你们是谁、提供什么、在哪里运营、主张有哪些证据支撑。清晰的公司信息，能帮助人和现代搜索摘要更放心地理解与引用你们。",
      productEvidence:
        "实体与证据检查会评估公司、产品、应用与文档节点上的清晰度、一致性与引用准备度。",
      nextAction: { label: "提升实体清晰度", href: "#cta" },
    },
    {
      id: "faq-product-info-visibility",
      category: "visibility",
      question: "怎样让产品信息更容易被看见？",
      directAnswer:
        "把定义、规格、应用与证据放在可被找到、可被引用的位置；跨语言保持名称与事实一致。少靠横幅口号，多靠结构清晰、可读的内容区块。",
      productEvidence:
        "面向 GEO 的检查会评估产品信息的可回答性、证据覆盖与引用准备度——不会承诺任何特定答案产品的展示位置。",
      nextAction: { label: "强化产品答案", href: "#cta" },
    },
    {
      id: "faq-missing-customer-questions",
      category: "visibility",
      question: "为什么网站上缺少客户真正会问的重要问题？",
      directAnswer:
        "很多站点写功能，却跳过客户联系销售前会问的问题。这些问题往往落在选型、安装约束、市场适配与证明材料上，需要在真实页面给出直接答案。",
      productEvidence:
        "Question Coverage 会分析买家问题，标记已回答 / 部分回答 / 未覆盖，并为缺失的商业问题附上建议动作。",
      nextAction: { label: "补齐未回答的买家问题", href: "#cta" },
    },
    {
      id: "faq-easier-to-reference",
      category: "visibility",
      question: "怎样让重要信息更容易被引用？",
      directAnswer:
        "使用清晰定义、稳定 URL、一致的实体名称，以及有证据支撑的主张。信息散乱、口号化或自相矛盾时，人和搜索答案表面都更难信任与引用。",
      productEvidence:
        "Mika 会跟踪证据覆盖、一致性与引用准备度，再把需要扩展定义、规格、场景与 FAQ 的页面写进 Blueprint。",
      nextAction: { label: "生成可引用的 Blueprint", href: "#cta" },
    },
  ],
};
