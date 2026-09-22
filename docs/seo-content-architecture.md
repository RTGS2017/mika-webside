# SEO 内容架构（知识中心）

> 约束文章 lane 撰写 SEO / 技术 / 搜索可见度 / 内容类指南。  
> 站点：`https://mikaovo.ai/` · 英文 `/knowledge/{slug}/` · 中文 `/zh/knowledge/{slug}/` · **无 `/en/`**。

## 1. 目标

帮助 B2B 站点理解：**可抓取、可索引、主题覆盖、意图对齐、商业机会**——输出可执行检查与下一步，而不是排名预测。

## 2. 适用 slug 族

- **技术基础：** crawlability、broken links、canonical、hreflang、sitemaps、orphan pages、duplicate content  
- **增长与内容：** content gaps、search intent、topic coverage、commercial opportunities、product page content、new markets  
- **方法论：** what-is-a-website-seo-audit、why-page-count-does-not-equal-seo-growth、seo-health-vs-seo-growth、audit-diagnosis-blueprint、multilingual-search-visibility  

栏目映射见 `src/knowledge/articles.js`（`seo` / `technical` / `content` / `search-visibility`）。

## 3. 文章必备区块（建议 DOM）

```html
<article class="kc-page">
  <header class="kc-header">…</header>
  <section class="kc-hero">
    <h1>…</h1>
    <div class="kc-meta">栏目 · 更新日期 · 阅读时长</div>
  </section>
  <div class="kc-layout">
    <aside class="kc-toc">…</aside>
    <div class="kc-body">…</div>
  </div>
  <section class="kc-sources">…</section>
  <section class="kc-related">…</section>
  <section class="kc-faq">…</section>
  <section class="kc-cta">…</section>
</article>
```

正文建议顺序：

1. **直接定义**（1–3 句，回答标题问题）  
2. **为什么重要**（与可见度/业务的关系，避免恐吓式话术）  
3. **检查清单或步骤**（可操作、可复现）  
4. **例子**（B2B 场景，真实结构描述，不编造客户数据）  
5. **常见误区**（例如「页面数量 = SEO 增长」）  
6. **下一步**（链到相关指南或首页审计 CTA）

## 4. SEO 写作规则

| 要做 | 不要做 |
| --- | --- |
| 一题一页，标题与 H1 一致 | 批量近重复页、同题换皮 |
| 用证据化表述（「检查 X」「记录 Y」） | 「保证上首页」「稳进 Top 3」 |
| 区分 **SEO Health**（抓取/索引/结构）与 **SEO Growth**（主题/意图/市场） | 把一切问题收成单一黑盒分数 |
| 内链到相关技术文 + 内容文 + 知识中心索引 | 孤岛页、无返回索引 |
| 中英事实对齐（数字、产品名、步骤） | `/en/` 前缀或仅机器翻译的空壳镜像 |

## 5. 内链模板

- 向上：`/knowledge/` 或 `/zh/knowledge/`  
- 横向：同栏目 2–4 篇；跨栏目时优先 Health↔Growth、技术↔内容  
- 产品：英文首页 `/` 或中文 `/zh/` 的 `#seo-growth`、`#audit`、`#framework`  
- 语言：对等 slug 的 `<link rel="alternate" hreflang>` + 导航 `<a>`

## 6. FAQ 与来源

- FAQ：3–6 个真实买家问题；答案可被摘录，但不承诺结果  
- Sources：公开文档、标准、官方帮助中心；标注访问语境，不伪造成内部数据  

## 7. 元数据

每篇文章独立 `title`、`description`、`canonical`、`hreflang`（en / zh-Hans / x-default→EN）、OG。正文仅一个 `h1`。

## 8. 与产品叙事对齐

首页已区分 SEO Health / SEO Growth。知识中心文章应强化该框架，避免把「审计」写成「排名服务」。
