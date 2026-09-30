const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "assets", "visuals");
fs.mkdirSync(dir, { recursive: true });

const blue = "#2F6FED";
const purple = "#7C3AED";
const cyan = "#22D3EE";
const ink = "#0B1220";
const muted = "#64748B";
const line = "#E6EAF2";
const bg = "#F5F7FB";
const green = "#15956A";
const amber = "#D97706";

function frame(title, body, w = 960, h = 640) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
  <title>${title}</title>
  <rect width="${w}" height="${h}" rx="28" fill="${bg}"/>
  <rect x="24" y="24" width="${w - 48}" height="${h - 48}" rx="20" fill="#fff" stroke="${line}"/>
  <text x="${w - 132}" y="52" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="12" letter-spacing="1.2">DEMO DATA</text>
  ${body}
</svg>
`;
}

function bar(x, y, w, label, value, color) {
  return `<text x="${x}" y="${y}" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="13">${label}</text>
  <text x="${x + 250}" y="${y}" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="13" font-weight="650">${value}</text>
  <rect x="${x}" y="${y + 10}" width="280" height="8" rx="4" fill="${line}"/>
  <rect x="${x}" y="${y + 10}" width="${w}" height="8" rx="4" fill="${color}"/>`;
}

const files = {
  "01-hero-scanner.svg": frame("Website visibility scanner demo", `
    <text x="56" y="78" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="13" letter-spacing="1.4">SCANNER</text>
    <text x="56" y="114" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="28" font-weight="700">网站可见性扫描器</text>
    <rect x="56" y="140" width="520" height="52" rx="12" fill="${bg}" stroke="${line}"/>
    <text x="76" y="172" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="16">https://example.com</text>
    <rect x="600" y="140" width="140" height="52" rx="12" fill="${blue}"/>
    <text x="632" y="172" fill="#fff" font-family="Segoe UI, sans-serif" font-size="16" font-weight="650">开始扫描</text>
    ${["页面结构","搜索基础","内容覆盖","商业意图","AI 答案","实体信息","证据","多语言"].map((label, i) => {
      const col = i < 4 ? 56 : 360;
      const row = 230 + (i % 4) * 42;
      return `<circle cx="${col + 10}" cy="${row - 4}" r="9" fill="${green}"/>
      <path d="M${col + 5} ${row - 4} l3 3 l6 -7" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <text x="${col + 28}" y="${row}" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="15">${label}</text>`;
    }).join("")}
    <rect x="56" y="420" width="684" height="150" rx="16" fill="${bg}"/>
    <text x="80" y="456" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="16" font-weight="700">网站可见性报告</text>
    <text x="80" y="480" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="12">示例数据，仅用于演示</text>
    ${[["SEO 健康度","92",blue],["SEO 增长","71",cyan],["GEO 健康度","84",purple],["GEO 增长","63","#A78BFA"]].map((item, i) => `
      <text x="${80 + (i % 4) * 165}" y="530" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="13">${item[0]}</text>
      <text x="${80 + (i % 4) * 165}" y="558" fill="${item[2]}" font-family="Segoe UI, sans-serif" font-size="28" font-weight="720">${item[1]}</text>
    `).join("")}
  `),

  "02-seo-audit-dashboard.svg": frame("SEO audit dashboard demo", `
    <rect x="48" y="48" width="180" height="544" rx="16" fill="${bg}"/>
    <text x="72" y="92" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="16" font-weight="700">SEO 审计</text>
    ${["概览","抓取","页面","内链","Sitemap"].map((t, i) => `<text x="72" y="${140 + i * 36}" fill="${i === 0 ? blue : muted}" font-family="Segoe UI, sans-serif" font-size="14" font-weight="${i === 0 ? 700 : 500}">${t}</text>`).join("")}
    <text x="260" y="92" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="24" font-weight="720">基础问题</text>
    <text x="260" y="118" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="13">example.com · 示例</text>
    ${[
      ["严重", "3", "#DC2626"],
      ["重要", "8", amber],
      ["建议", "14", blue]
    ].map((c, i) => `<rect x="${260 + i * 210}" y="146" width="190" height="88" rx="14" fill="#fff" stroke="${line}"/>
      <text x="${280 + i * 210}" y="180" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="13">${c[0]}</text>
      <text x="${280 + i * 210}" y="214" fill="${c[2]}" font-family="Segoe UI, sans-serif" font-size="28" font-weight="720">${c[1]}</text>`).join("")}
    ${bar(260, 280, 210, "抓取与收录", "可抓取", blue)}
    ${bar(260, 330, 160, "Canonical", "12 处需核对", purple)}
    ${bar(260, 380, 120, "孤立页面", "6 个示例", amber)}
    ${bar(260, 430, 190, "Sitemap", "已发现", green)}
    <rect x="260" y="490" width="620" height="78" rx="14" fill="${bg}"/>
    <text x="284" y="524" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="15" font-weight="650">Robots、重复内容、图片与语言信号会按页面列出</text>
    <text x="284" y="548" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="13">不是一个总分，是一组可以打开的检查项</text>
  `),

  "03-seo-growth-dashboard.svg": frame("Search growth dashboard demo", `
    <text x="56" y="86" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="24" font-weight="720">搜索增长机会</text>
    <text x="56" y="114" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="14">客户会搜索、站点尚未回答的主题 · 示例</text>
    ${[["主题机会","18"],["商业意图","7"],["市场","4"],["页面机会","11"]].map((c, i) => `
      <rect x="${56 + i * 210}" y="146" width="190" height="96" rx="14" fill="#fff" stroke="${line}"/>
      <text x="${76 + i * 210}" y="182" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="13">${c[0]}</text>
      <text x="${76 + i * 210}" y="216" fill="${i % 2 ? purple : blue}" font-family="Segoe UI, sans-serif" font-size="28" font-weight="720">${c[1]}</text>
    `).join("")}
    ${["产品对比问题尚未覆盖","规格页缺少使用场景","新市场语言只有薄镜像","商业查询没有对应页面"].map((row, i) => `
      <rect x="56" y="${270 + i * 64}" width="820" height="52" rx="12" fill="${bg}"/>
      <circle cx="84" cy="${296 + i * 64}" r="6" fill="${i < 2 ? blue : purple}"/>
      <text x="108" y="${302 + i * 64}" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="15">${row}</text>
      <text x="760" y="${302 + i * 64}" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="13">${["内容深度","意图","市场","页面"][i]}</text>
    `).join("")}
  `),

  "04-ai-visibility-dashboard.svg": frame("AI visibility dashboard demo", `
    <text x="56" y="86" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="24" font-weight="720">AI 可见性</text>
    <text x="56" y="114" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="14">示例查询，不是真实模型输出</text>
    <rect x="56" y="146" width="500" height="420" rx="16" fill="${bg}"/>
    <text x="80" y="186" fill="${purple}" font-family="Segoe UI, sans-serif" font-size="13" font-weight="700">示例问题</text>
    <text x="80" y="220" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="18" font-weight="650">这家公司提供什么产品？</text>
    <rect x="80" y="248" width="452" height="120" rx="12" fill="#fff" stroke="${line}"/>
    <text x="100" y="284" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="14">答案草稿 · 示例</text>
    <text x="100" y="314" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="15">产品定义清晰，使用场景不足</text>
    <text x="100" y="340" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="15">证据链接未在同一页出现</text>
    ${[["公司实体","清晰",green],["产品实体","部分",amber],["证据","缺口",purple],["引用准备","待补",blue]].map((r, i) => `
      <rect x="580" y="${146 + i * 104}" width="300" height="90" rx="14" fill="#fff" stroke="${line}"/>
      <text x="604" y="${182 + i * 104}" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="13">${r[0]}</text>
      <text x="604" y="${212 + i * 104}" fill="${r[2]}" font-family="Segoe UI, sans-serif" font-size="20" font-weight="720">${r[1]}</text>
    `).join("")}
  `),

  "05-question-coverage.svg": frame("Question coverage demo", `
    <text x="56" y="86" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="24" font-weight="720">问题覆盖</text>
    <circle cx="210" cy="300" r="92" fill="none" stroke="${line}" stroke-width="22"/>
    <circle cx="210" cy="300" r="92" fill="none" stroke="${blue}" stroke-width="22" stroke-dasharray="250 328" stroke-linecap="round" transform="rotate(-90 210 300)"/>
    <circle cx="210" cy="300" r="92" fill="none" stroke="${purple}" stroke-width="22" stroke-dasharray="120 458" stroke-dashoffset="-250" transform="rotate(-90 210 300)"/>
    <text x="168" y="294" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="28" font-weight="720">42</text>
    <text x="156" y="320" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="13">示例问题</text>
    ${[["已回答","18",blue],["部分回答","15",purple],["未覆盖","9",amber]].map((r, i) => `
      <rect x="390" y="${180 + i * 88}" width="480" height="72" rx="14" fill="#fff" stroke="${line}"/>
      <circle cx="422" cy="${216 + i * 88}" r="8" fill="${r[2]}"/>
      <text x="444" y="${222 + i * 88}" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="16" font-weight="650">${r[0]}</text>
      <text x="800" y="${222 + i * 88}" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="18" font-weight="720">${r[1]}</text>
    `).join("")}
    <text x="56" y="520" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="14">示例问题包括：为什么没有自然流量、竞品为何出现在答案里、产品页还缺什么</text>
  `),

  "06-entity-evidence.svg": frame("Entity and evidence demo", `
    <text x="56" y="86" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="24" font-weight="720">实体与证据</text>
    <rect x="360" y="250" width="200" height="72" rx="16" fill="${blue}"/>
    <text x="418" y="294" fill="#fff" font-family="Segoe UI, sans-serif" font-size="18" font-weight="720">公司</text>
    ${[["产品",120,160],["服务",700,160],["场景",120,420],["规格",700,420]].map((n) => `
      <rect x="${n[1]}" y="${n[2]}" width="140" height="56" rx="12" fill="#fff" stroke="${line}"/>
      <text x="${n[1] + 42}" y="${n[2] + 34}" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="16">${n[0]}</text>
      <path d="M${n[1] + 70} ${n[2] + (n[2] < 250 ? 56 : 0)} L460 ${n[2] < 250 ? 250 : 322}" stroke="${line}" stroke-width="2" fill="none"/>
    `).join("")}
    <rect x="250" y="500" width="460" height="72" rx="14" fill="${bg}"/>
    <text x="274" y="530" fill="${purple}" font-family="Segoe UI, sans-serif" font-size="14" font-weight="700">主张</text>
    <text x="330" y="530" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="15">适用于某工业场景</text>
    <text x="520" y="530" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="15">→</text>
    <text x="548" y="530" fill="${blue}" font-family="Segoe UI, sans-serif" font-size="14" font-weight="700">证据</text>
    <text x="600" y="530" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="15">规格页</text>
    <text x="274" y="554" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="12">示例关系，不是客户证明</text>
  `),

  "07-multilingual.svg": frame("Multilingual consistency demo", `
    <text x="56" y="86" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="24" font-weight="720">多语言一致性</text>
    <text x="56" y="116" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="14">同一事实在各语言页面上的对照 · 示例</text>
    ${["中文","English","日本語","Español","العربية","Deutsch"].map((lang, i) => `
      <rect x="${56 + (i % 6) * 140}" y="146" width="124" height="40" rx="20" fill="${i === 0 ? blue : "#fff"}" stroke="${line}"/>
      <text x="${74 + (i % 6) * 140}" y="172" fill="${i === 0 ? "#fff" : ink}" font-family="Segoe UI, sans-serif" font-size="14">${lang}</text>
    `).join("")}
    ${["公司名","产品名","规格","应用","主张"].map((row, i) => `
      <text x="56" y="${250 + i * 58}" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="14">${row}</text>
      <rect x="160" y="${228 + i * 58}" width="220" height="40" rx="10" fill="${bg}"/>
      <rect x="400" y="${228 + i * 58}" width="220" height="40" rx="10" fill="${bg}"/>
      <rect x="640" y="${228 + i * 58}" width="220" height="40" rx="10" fill="${i === 4 ? "#F5F3FF" : bg}" stroke="${i === 4 ? purple : "none"}"/>
      <text x="176" y="${254 + i * 58}" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="14">${["示例公司","示例产品","规格 A","场景 A","一致"][i]}</text>
      <text x="416" y="${254 + i * 58}" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="14">${["Example Co.","Example product","Spec A","Use A","一致"][i]}</text>
      <text x="656" y="${254 + i * 58}" fill="${i === 4 ? purple : ink}" font-family="Segoe UI, sans-serif" font-size="14">${["示例会社","サンプル","仕様 A","用途 A","待核对"][i]}</text>
    `).join("")}
  `),

  "08-optimization-blueprint.svg": frame("Optimization blueprint demo", `
    <text x="56" y="84" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="24" font-weight="720">优化蓝图</text>
    <rect x="56" y="120" width="520" height="450" rx="16" fill="${bg}"/>
    <text x="80" y="160" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="13">问题</text>
    <text x="80" y="190" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="20" font-weight="720">产品页内容过薄</text>
    <text x="80" y="224" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="14">缺少产品定义、使用场景、规格和证据</text>
    ${["补充产品定义","增加使用场景","补充规格","添加证据","增加常见问题"].map((step, i) => `
      <circle cx="98" cy="${280 + i * 48}" r="14" fill="${blue}"/>
      <text x="92" y="${285 + i * 48}" fill="#fff" font-family="Segoe UI, sans-serif" font-size="12">${i + 1}</text>
      <text x="128" y="${286 + i * 48}" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="16">${step}</text>
    `).join("")}
    <rect x="600" y="120" width="280" height="450" rx="16" fill="#fff" stroke="${line}"/>
    <text x="624" y="164" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="13">优先级</text>
    <text x="624" y="204" fill="${purple}" font-family="Segoe UI, sans-serif" font-size="32" font-weight="720">P1</text>
    <text x="624" y="250" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="13">目标 URL</text>
    <text x="624" y="278" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="16">/products/example/</text>
    <text x="624" y="330" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="13">验收</text>
    <text x="624" y="360" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="16">重新扫描</text>
    <text x="624" y="430" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="12">示例页面，不是客户站点</text>
  `),

  "09-knowledge-base.svg": frame("Knowledge workspace demo", `
    <text x="56" y="86" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="24" font-weight="720">SEO 与 GEO 知识库</text>
    ${[["SEO","网站结构与技术检查",blue],["GEO","AI 答案、实体与证据",purple],["内容优化","问题与页面覆盖",cyan],["AI 搜索","答案可见性说明","#A78BFA"]].map((c, i) => `
      <rect x="${56 + (i % 4) * 210}" y="120" width="196" height="110" rx="14" fill="#fff" stroke="${line}"/>
      <text x="${76 + (i % 4) * 210}" y="162" fill="${c[2]}" font-family="Segoe UI, sans-serif" font-size="16" font-weight="720">${c[0]}</text>
      <text x="${76 + (i % 4) * 210}" y="192" fill="${muted}" font-family="Segoe UI, sans-serif" font-size="13">${c[1]}</text>
    `).join("")}
    <text x="56" y="280" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="16" font-weight="700">最近更新</text>
    ${["什么是网站 SEO 审计","SEO 健康度与 SEO 增长","如何检查网站可抓取性"].map((t, i) => `
      <rect x="56" y="${304 + i * 72}" width="820" height="60" rx="12" fill="${bg}"/>
      <text x="80" y="${340 + i * 72}" fill="${ink}" font-family="Segoe UI, sans-serif" font-size="16">${t}</text>
      <text x="760" y="${340 + i * 72}" fill="${blue}" font-family="Segoe UI, sans-serif" font-size="14">指南</text>
    `).join("")}
  `)
};

for (const [name, svg] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name), svg, "utf8");
  console.log(name);
}
