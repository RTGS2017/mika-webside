# Homepage v2 / 知识中心串联验收报告

> 验收日：2026-09-22  
> 仓库：`D:/NagaAssistance/b2bweb/site`  
> 域名：`https://mikaovo.ai/`  
> **发布模型：纯静态 GitHub Pages；站点根 = 仓库根；没有 `npm build`，没有 `dist/`。Pages 发布目录就是仓库根。**

---

## 1. 结论摘要

| 项 | 结果 |
| --- | --- |
| 34 slug × 中英 = 68 篇文章 | 全部存在 |
| `knowledge/index.html` / `zh/knowledge/index.html` | 存在 |
| 首页 Knowledge 链接 | EN → `/knowledge/`；ZH → `/zh/knowledge/` |
| 动效引用 | `src/motion/core.js` + `src/animations/home.js` 已挂在中英首页 |
| `sitemap.xml` | 72 条 loc（首页×2 + 知识索引×2 + 文章×68），无 `/dist/`、无不存在 URL |
| 本轮修复 | 8 篇 Research Note 补 `styles.css` + `contact-config.js` / `contact.js` |
| 本地 HTTP / Playwright | 抽样路径全部 200；控制台无 error；1440 / 390 无文档级横向溢出 |

---

## 2. 首页动效模块

动效只挂在英文 `index.html` 与中文 `zh/index.html`（知识中心页不动效）。

### 2.1 引用

- CSS：`src/sections/home.css`、`src/motion/motion.css`、`src/animations/home.css`
- JS：`src/motion/core.js`（`window.MikaMotion`）、`src/animations/home.js`（各区块 signature）

### 2.2 哪些模块有动画、类型

| 区块 | 动画类型（简述） |
| --- | --- |
| Hero · Visibility Field | Ambient 暗场网格；SEO/GEO 双流汇入 Website → Visibility；芯片独立保留 |
| Problem | Healthy / Growing 汇合，揭示 Health ≠ Growth |
| Framework | 轴 → 单元格；Health 圈 / Growth 线 |
| Deep Audit | 管道式步骤推进 + 计数；附免责声明 |
| Health vs Growth | 条形与计数（圈感 / 扩展填充） |
| Blueprint | Issue → 根因 → 排序行动（不循环业务数字） |
| SEO Growth | 覆盖条后机会节点生长 |
| GEO | Question → Topic → Intent → Entity → Evidence → Direct Answer 链 |
| Questions | 问题墙横向漂移（可见时）；匹配桥接 Intent / Page / Answer |
| Entity | 节点按序连线 + 指标计数 |
| Multilingual | 产品实体 → 语言卡 → Consistency |
| Methodology | SCAN → DIAGNOSE → BLUEPRINT → OPTIMIZE → RE-AUDIT 单圈 |
| FAQ | 答案常驻 DOM；交互仅高亮展开项 |
| CTA | 网站 → Search → Questions → Gaps → Blueprint，再挂载联系入口 |

### 2.3 移动端降级

- 隐藏次要 SVG 路径；问题墙改为静态网格（取消连续 translate）
- 缩短 stagger；减少装饰节点

### 2.4 `prefers-reduced-motion`

- `core.js` / `motion.css` / `home.css` 均监听 `prefers-reduced-motion: reduce`
- 降级：各 signature 直接跳到终态；计数写到 `data-count`；条形满宽；墙不滚动

---

## 3. 新增页面与文章体系

### 3.1 知识中心

- 索引：`/knowledge/`、`/zh/knowledge/`
- 样式与交互：`src/knowledge/center.css`、`center.js`、`articles.js`（34 slug SSOT）
- 栏目：seo / geo / search-visibility / content / technical / research / open-source / updates

### 3.2 34 个必存在 slug（中英各一份）

`what-is-a-website-seo-audit` · `how-to-check-website-crawlability` · `how-to-find-broken-internal-links` · `how-to-audit-canonical-urls` · `how-to-check-hreflang` · `how-to-analyze-xml-sitemaps` · `how-to-find-orphan-pages` · `how-to-detect-duplicate-content` · `how-to-find-content-gaps` · `how-to-map-search-intent` · `how-to-build-topic-coverage` · `how-to-identify-commercial-search-opportunities` · `how-to-build-product-page-content` · `how-to-expand-seo-into-new-markets` · `why-page-count-does-not-equal-seo-growth` · `what-is-geo` · `how-to-make-company-information-clearer` · `how-to-structure-product-information` · `how-to-answer-buyer-questions-directly` · `how-to-build-evidence-around-product-claims` · `how-to-improve-citation-readiness` · `how-to-build-consistent-entity-information` · `how-to-audit-ai-search-visibility` · `what-makes-a-page-easier-to-reference` · `seo-health-vs-seo-growth` · `geo-health-vs-geo-growth` · `audit-diagnosis-blueprint` · `question-coverage-for-websites` · `entity-evidence-answerability` · `multilingual-search-visibility` · `what-open-source-seo-crawlers-check` · `how-geo-handbooks-structure-source-backed-pages` · `what-a-technical-seo-geo-crawler-inspects` · `how-source-backed-bilingual-sites-are-structured`

路径约定：

- 英文：`knowledge/{slug}/index.html`
- 中文：`zh/knowledge/{slug}/index.html`（相对资源多一层 `../`）

### 3.3 SEO / GEO 内容结构（摘要）

- **SEO 文**：审计/抓取/内链/canonical/hreflang/sitemap/orphan/重复/缺口/意图/主题/商业机会/产品页/新市场；Health vs Growth 与诊断蓝图
- **GEO 文**：定义、公司与产品清晰度、直接答买家问题、证据、引用就绪、实体一致、AI 搜索可见度审计；禁止承诺「保证被引用/排名」
- **方法文**：`seo-health-vs-seo-growth`、`geo-health-vs-geo-growth`、`audit-diagnosis-blueprint`、`question-coverage-for-websites`、`entity-evidence-answerability`、`multilingual-search-visibility`
- **Research Note**：开源爬虫/手册/双语文档结构观察（见下节许可证）

详见：`docs/seo-content-architecture.md`、`docs/geo-content-architecture.md`、`docs/knowledge-center-architecture.md`

---

## 4. GitHub 来源与许可证

登记于 `tools/research/sources.json`（观察登记，非自动发布）：

| 仓库 | 许可证 | 对应文章 | 署名方式 |
| --- | --- | --- | --- |
| `paladini/generative-engine-optimization-basic-guide` | MIT | `how-source-backed-bilingual-sites-are-structured` | 事实归因 only |
| `ferinazumaDEV/generative-engine-optimization-handbook` | **CC BY-SA 4.0** | `how-geo-handbooks-structure-source-backed-pages` | 受启发表述共享 CC BY-SA 4.0；整站不改许可证 |
| `spronta/crawlie` | MIT（源码；GitHub API 可能显示 Other） | `what-a-technical-seo-geo-crawler-inspects` | 事实归因 only |
| `puneetindersingh/open-seo-crawler` | MIT | `what-open-source-seo-crawlers-check` | 事实归因 only |

验收：`how-geo-handbooks-structure-source-backed-pages` 中英页均可见 **CC BY-SA 4.0** 署名与许可证链接。

---

## 5. SEO 元数据

文章页（标准模板）具备：

- `title` / `meta description` / `robots`
- `link rel="canonical"`（语言各自 URL）
- `hreflang`：`en`、`zh-Hans`、`x-default`（x-default 指向英文）
- Open Graph / Twitter 基础字段
- JSON-LD：`Article` + `BreadcrumbList`（部分 Research Note 为精简 Article + `license`）

每篇仅 **一个 `h1`**（索引页亦单 h1）。相关文章内链抽样解析：无 404。

---

## 6. GEO 内容结构（站点侧）

与首页产品叙事对齐：

- **GEO Health**：实体清晰、主张有证据、关键问题有直接答案  
- **GEO Growth**：未覆盖问题、可扩展引用就绪主题、多语言实体对齐  

知识中心 GEO 文强制可读块：直接定义 → 短答 → 解释 → 例子 → 来源 → FAQ（见架构文档）。产品承诺边界：只谈就绪度，不保证回答面展示。

---

## 7. 本轮检查与修复

### 7.1 检查通过（无需改）

- 68 文章文件 + 2 索引全部在盘  
- `articles.js` 34 slug 与清单一致  
- 首页/页脚 Knowledge 链接正确；动效脚本已引用  
- canonical / hreflang（`zh-Hans`）互指正确  
- sitemap 72 URL，无 `/dist/`  
- CC BY-SA 4.0 署名在指定中英研究笔记可见  

### 7.2 本轮修复

**缺文件：** 无（必存在的文章与索引均已在）。

**修了什么：** 以下 4 个 Research Note slug 的中英共 **8** 个 HTML，原先只挂了 `center.css`，缺少站点 `styles.css` 与 contact 脚本：

1. `what-open-source-seo-crawlers-check`  
2. `how-geo-handbooks-structure-source-backed-pages`  
3. `what-a-technical-seo-geo-crawler-inspects`  
4. `how-source-backed-bilingual-sites-are-structured`  

补丁（相对路径）：

- EN：`../../styles.css` + `../../contact-config.js` + `../../contact.js`  
- ZH：`../../../styles.css` + `../../../contact-config.js` + `../../../contact.js`  

未改文章正文、未改联系号码、未 commit / 未推送 / 未改 Pages 设置。

---

## 8. 本地验收结果

服务：仓库根 `python -m http.server`（本机 `http://127.0.0.1:8765`）。

### 8.1 HTTP 状态（全部 200）

| 路径 | 状态 |
| --- | --- |
| `/` | 200 |
| `/zh/` | 200 |
| `/knowledge/` | 200 |
| `/zh/knowledge/` | 200 |
| `/knowledge/what-is-geo/` | 200 |
| `/zh/knowledge/what-is-geo/` | 200 |
| `/knowledge/how-geo-handbooks-structure-source-backed-pages/`（研究笔记） | 200 |
| `/zh/knowledge/seo-health-vs-seo-growth/`（中文） | 200 |
| `/knowledge/what-open-source-seo-crawlers-check/`（研究笔记） | 200 |
| `/src/knowledge/center.css`、`/styles.css`、`/src/motion/core.js`、`/src/animations/home.js`、`/contact.js`、`/sitemap.xml` | 200 |

### 8.2 浏览器 / 脚本

- Cursor IDE Browser MCP 本次不可用（无法建立 tab），改用 **Playwright Chromium** 无头检查。  
- 宽度 **1440** 与 **390**：首页、中文首页、中英知识索引、抽样文章共 16 次加载。  
- **控制台：** 无 `error` / `pageerror`；本域资源无 ≥400。  
- **横向溢出：** `documentElement.scrollWidth === clientWidth`（无文档级横向滚动）。首页 Questions 墙轨道 `.hv2-wall.mm-wall-track` 自身宽度大于视口，但被容器裁切，不撑开页面。

---

## 9. 仍未解决 / 已知限制

1. **Research Note 联系 UI 不完整：** 已补 contact 脚本，但部分研究笔记页未挂 `data-contact-cards` / dock 标记，与标准指南页交互密度不一致（功能不崩，体验不齐）。  
2. **Research Note SEO 外壳较薄：** 相对标准文章，少部分 OG/Twitter/Breadcrumb JSON-LD；不阻塞发布，若要对齐可另开润色 lane。  
3. **Cursor IDE Browser 未跑通：** 视觉验收依赖 Playwright；线上 GitHub Pages 仍需在真实域名做一次人工扫一眼。  
4. **临时验收脚本已删除**（`_qa_*.py`）；需要复跑时再生成即可。  
5. **本报告未触发 commit/push**；合并进主分支后 Pages 才会对外更新。

---

## 10. 发布提示

- **没有 `dist/`**，不要配置成从 `dist` 发布。  
- GitHub Pages：**仓库根即为发布根**。  
- Sitemap / 文章 / 知识中心 / 首页动效文件均在仓库根相对路径下可直接被 Pages 服务。
