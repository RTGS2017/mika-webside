# Website V3 — 文件所有权（知识中心车道）

> 与 `docs/homepage-v2-file-ownership.md` 并行。V3 聚焦 **知识中心**；首页 V2 文件所有权不变。  
> **禁止** `git commit` / push / 改 GitHub Pages 设置 / 新建 Vite/npm 构建工具（除非 Integration 另有指令）。

## 0. 仓库事实

| 项 | 值 |
| --- | --- |
| 栈 | 纯静态 HTML/CSS/JS，仓库根 = Pages 根 |
| 域名 | `https://mikaovo.ai/` |
| i18n | 英文根路径；中文 `/zh/`；**禁止 `/en/`** |
| 联系 SSOT | `contact-config.js` + `contact.js`（复用，不重写） |

## 1. 本车道（Knowledge Center）— 可写路径

| 路径 | 角色 |
| --- | --- |
| `src/knowledge/**` | 样式、脚本、文章元数据、索引生成辅助 |
| `knowledge/index.html` | 英文知识中心索引 |
| `zh/knowledge/index.html` | 中文知识中心索引 |
| `sitemap.xml` | **仅追加**知识中心 URL；保留现有首页 URL |
| `docs/knowledge-center-architecture.md` | 知识中心总架构 |
| `docs/seo-content-architecture.md` | SEO 文章写作契约 |
| `docs/geo-content-architecture.md` | GEO 文章写作契约 |
| `docs/website-v3-file-ownership.md` | 本文件 |

## 2. 文章正文车道 — 可写路径（本车道禁止）

| 路径 | 角色 |
| --- | --- |
| `knowledge/{slug}/**` | 英文文章页 |
| `zh/knowledge/{slug}/**` | 中文文章页 |

文章车道必须：消费 `articles.js` 的 slug/标题；使用 `center.css` 的 `kc-*` 文章 class；遵守 SEO/GEO 内容架构文档。

## 3. 全员禁止改动（除非 Integration）

- `index.html`、`zh/index.html`
- `src/sections/**`、`src/animations/**`、`src/motion/**`、`src/content/home/**`
- `robots.txt`、`tools/**`
- `contact-config.js` / `contact.js`（联系逻辑）
- 新建构建管线（`package.json`、Vite、Webpack 等）

## 4. 共享只读依赖

- `styles.css` — 联系组件样式与全局字体变量（知识中心索引通过 `<link>` 引入，**不修改**）
- `assets/logo.svg`、`assets/favicon.svg`
- Google Fonts：Instrument Sans + IBM Plex Mono（与首页一致）

## 5. Sitemap 规则

- 追加：`/knowledge/`、`/zh/knowledge/`、全部 `/knowledge/{slug}/` 与 `/zh/knowledge/{slug}/`
- 每条带 `xhtml:link` hreflang（en、zh-Hans、x-default→EN）
- `lastmod`：`2026-09-22`
- **不得**写入 `/src/`、`/dist/`、脚本路径

## 6. 命名

- 产品对外名称：Knowledge Center / 知识中心  
- **不要**使用 Blog / 博客 / Newsroom 作为栏目名  

## 7. 并行协作提示

1. 索引车道先交付链接与元数据（已完成）。  
2. 文章车道按 slug 并行写正文，不改索引 HTML（如需新 featured 标记，改 `articles.js` 并与索引车道协调再生成）。  
3. Integration 负责首页链入知识中心（本车道不改首页）。
