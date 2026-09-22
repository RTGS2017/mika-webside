# SEO / GEO → 整合路注意事项

## 页面与路径

| 语言 | 公开 URL | 仓库文件 |
| --- | --- | --- |
| 英文 | `https://mikaovo.ai/` | `index.html`（仓库根） |
| 中文 | `https://mikaovo.ai/zh/` | `zh/index.html`（由整合路创建） |

中文页 `<head>` 内部片段已写在 `src/seo/head.zh.html`（不含 `<head>` 标签）。资源路径按 `zh/index.html` 相对根目录写成 `../assets/...`、`../styles.css`。英文片段：`src/seo/head.en.html`（`./` 相对根），并已同步进当前 `index.html` 的 `<head>`。

## 正文与可抓取性

1. **正文必须只有一个 `h1`。** 英文 H1 合同：`Make Your Website Visible in Search and AI.`；中文用 `zh.ts` 的 `hero.headline`。不要在 head 之外再造第二个 H1。
2. **语言切换必须是可抓取的 `<a href>`**（例如 `/` ↔ `/zh/`），不要用仅靠 JS 的假链接。
3. **内链与图片 alt** 由整合路在装配 body 时处理；本路未改 body。
4. **不要声称保证 AI 引用、推荐或答案位展示。** GEO 文案与 FAQ / disclaimer 已写明不保证。

## FAQ JSON-LD

- 活页当前**没有** V2 FAQ 可见区块 → **不要**把 FAQPage schema 插进当前 `index.html`。
- FAQ 进入页面后：
  - 英文：把 `src/seo/faq.en.jsonld` 包进 `<script type="application/ld+json">`，放在 `<!-- hv2-faq-jsonld -->` 占位处。
  - 中文：用 `src/seo/faq.zh.jsonld`，同样只在 FAQ 可见后插入。
- Schema 问答与 `faq.en.ts` / `faq.zh.ts` 的 `question` + `directAnswer` 一致；不要添加页面上没有的隐藏问题。

## CSS 占位

`<!-- hv2-section-css -->` 处：等 Visual / Animation 落地后再链接：

- `src/sections/home.css`
- `src/animations/home.css`

并行期间不要先写进 head，以免 404。

## 联系方式

公开联系事实以 `contact-config.js`（`window.MIKA_CONTACT`）为准。Organization JSON-LD 已对齐：Email `akizukiovo@gmail.com`，WhatsApp `+86 138 1401 5518` / `https://wa.me/8613814015518`。WeChat ID `Xue2017105` 为 copy-only，未写入 schema URL。

## sitemap / robots

- `sitemap.xml`：英文首页 + 中文首页，带 `xhtml:link` hreflang；不含 `/src/`、`/docs/`、`/dist/`。
- `robots.txt`：可抓取；显式允许 `OAI-SearchBot`。允许抓取 ≠ 保证展示或引用（见 `geo-access.md`）。
