# 知识中心架构

> 静态 GitHub Pages · 域名 `https://mikaovo.ai/` · 英文根路径 · 中文 `/zh/` · **不用 `/en/` 前缀**  
> 名称：**Knowledge Center / 知识中心**（不要叫 Blog）

## 1. 目录结构

```
knowledge/index.html              # 英文索引（可发布）
zh/knowledge/index.html           # 中文索引（可发布）
knowledge/{slug}/index.html       # 英文文章（由文章 lane 写；本 lane 不创建）
zh/knowledge/{slug}/index.html    # 中文文章（由文章 lane 写；本 lane 不创建）

src/knowledge/
  articles.js                     # 文章元数据 SSOT（slug、栏目、标题、摘要）
  center.css                      # 索引 + 文章页样式（类名前缀 kc-）
  center.js                       # 页面内筛选 / 搜索（无后端）
  _generate_index.py              # 一次性生成索引与 sitemap 追加（非构建管线）
```

**禁止写入 sitemap 的路径：** `/src/`、`/dist/`、生成脚本本身。

## 2. URL 约定

| 语言 | 索引 | 文章 |
| --- | --- | --- |
| EN | `https://mikaovo.ai/knowledge/` | `https://mikaovo.ai/knowledge/{slug}/` |
| ZH | `https://mikaovo.ai/zh/knowledge/` | `https://mikaovo.ai/zh/knowledge/{slug}/` |

- `hreflang`：`en`、`zh-Hans`、`x-default`（x-default 指向英文）
- 语言切换必须是可抓取的 `<a href>`，不可仅靠 JS

## 3. 栏目（8）

| id | EN | 中文 |
| --- | --- | --- |
| `seo` | SEO | SEO |
| `geo` | GEO | GEO |
| `search-visibility` | Search Visibility | 搜索可见度 |
| `content` | Content | 内容 |
| `technical` | Technical | 技术 |
| `research` | Research | 研究 |
| `open-source` | Open Source | 开源 |
| `updates` | Updates | 更新 |

索引页筛选按钮使用 `data-kc-filter`；卡片使用 `data-kc-category`。

## 4. 文章字段（元数据）

`src/knowledge/articles.js` 每条至少包含：

| 字段 | 说明 |
| --- | --- |
| `slug` | URL 段，全小写连字符 |
| `category` | 上表 8 个 id 之一 |
| `featured` | 是否进入「精选指南」 |
| `research` | 是否进入「最新研究」 |
| `date` | ISO 日期（sitemap lastmod 对齐） |
| `en.title` / `en.blurb` | 英文标题与卡片摘要 |
| `zh.title` / `zh.blurb` | 中文标题与卡片摘要 |

正文字段（文章 lane）：定义、短答、解释、步骤/例子、来源、FAQ、相关阅读——详见 `docs/seo-content-architecture.md` 与 `docs/geo-content-architecture.md`。

## 5. 索引页信息架构

首页不是普通博客卡片墙，固定区块：

1. **Hero** — 唯一 `h1`：*Understand Search. Understand Visibility. Build Better Websites.*（中文自然对应）
2. **精选指南** — `featured: true`
3. **最新研究** — `research: true`
4. **分类** — 八栏目入口（点击跳转并触发筛选）
5. **开源研究入口** — 深色面板 + 关键开源/研究文链接
6. **全部指南** — `data-kc-filter` + `#kc-search` 页面内过滤

## 6. 文章页统一 class（已在 `center.css`）

`kc-page` · `kc-header` · `kc-nav` · `kc-hero` · `kc-meta` · `kc-layout` · `kc-toc` · `kc-body` · `kc-sources` · `kc-related` · `kc-faq` · `kc-cta`

## 7. 视觉与字体

- 平面 B2B；深海军蓝 `#101828`；SEO 蓝 / GEO 紫；白与浅灰节奏
- 圆角：大组件 `12px`，按钮/控件 `8px`
- 字体：站点已有 **Instrument Sans** + **IBM Plex Mono**（与首页 Google Fonts 一致）
- 390 宽度不横向溢出（`overflow-x: clip` + 弹性网格）

## 8. 联系挂载

复用根目录 `contact-config.js` + `contact.js` + `styles.css` 中的 contact 样式。

| 页面 | 相对路径 |
| --- | --- |
| `knowledge/index.html` | `../contact-config.js`、`../contact.js`、`../styles.css` |
| `zh/knowledge/index.html` | `../../contact-config.js`、`../../contact.js`、`../../styles.css` |

挂载钩子：`data-contact-open="header|dock"`、`#contact-popover-nav`、`#contact-popover-dock`、`#contact-sheet`、`[data-contact-footer]`、`#contact-live`。

## 9. 内链原则

- 索引 ↔ 全部文章 slug（即使正文并行未写完，索引也必须链出）
- 文章 → 同栏目 2–4 篇相关 + 索引 + 首页对应能力锚点（如 `/#seo-growth`、`/#geo`）
- EN ↔ ZH 互链（hreflang + 导航语言切换）
- **不要**批量制造近乎重复的页；一题一页，深度优先于数量

## 10. 合规表述

全文与 UI 备注统一：**不承诺保证引用、不承诺保证排名、不出售黑盒分数**。教育与诊断导向。

## 11. 首批 34 篇 slug

见 `articles.js`。分组：SEO 15 · GEO 9 · 方法/可见度/内容/技术 6 · 研究/开源 4。
