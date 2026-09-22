# Homepage V2 整合验收报告

> 验收对象：**仓库根 = GitHub Pages 站点根**（`index.html` 与 `robots.txt` 同级）。  
> **没有 npm / Vite / `dist/` 构建步骤**；本地用静态服务直接打开站点根验收。  
> 域名保持 `https://mikaovo.ai/`，未回退。联系号码未改。

---

## 1. 组装方式

### 英文首页 `/` → `index.html`

| 部分 | 来源 |
| --- | --- |
| `<head>` | 既有 SEO head（与 `src/seo/head.en.html` 一致）：title / description / canonical / hreflang / OG / Twitter / Organization·WebSite·WebPage JSON-LD |
| FAQ JSON-LD | `src/seo/faq.en.jsonld` 插入 `<!-- hv2-faq-jsonld -->` |
| Section + Animation CSS | `./src/sections/home.css`、`./src/animations/home.css` 插入 `<!-- hv2-section-css -->` |
| `<body>` | `src/sections/en/main.html`（`hv2-root` 全文） |
| 脚本 | `./contact-config.js`、`./contact.js`、`./src/animations/home.js`（defer）、`./main.js`（defer） |
| 资源前缀 | 站点根相对：`./styles.css`、`./assets/`、`./src/...` |

### 中文首页 `/zh/` → `zh/index.html`（新建）

| 部分 | 来源 |
| --- | --- |
| `<head>` | `src/seo/head.zh.html` |
| FAQ JSON-LD | `src/seo/faq.zh.jsonld` |
| CSS | `../styles.css`、`../src/sections/home.css`、`../src/animations/home.css` |
| `<body>` | `src/sections/zh/main.html` |
| 脚本 | `../contact-config.js`、`../contact.js`、`../src/animations/home.js`、`../main.js` |
| 语言 | `<html lang="zh-Hans">`；语言切换可抓取链接：中文页 → `/`，英文页 → `/zh/` |

---

## 2. 新增区块（可见结构）

稳定锚点（kebab-case）：

`#hero` · `#problem` · `#framework` · `#audit` · `#health-growth` · `#blueprint` · `#seo-growth` · `#geo` · `#questions` · `#entity` · `#multilingual` · `#methodology` · `#faq` · `#cta`

导航使用 `#seo-growth` / `#health-growth` 等与页面 id 一致，未改内容合同字段名。

---

## 3. 新增内容 / 中文内容

- 英文正文来自 Visual 已渲染的 `src/sections/en/main.html`（对应 `src/content/home/en.ts` + `faq.en.ts`）。
- 中文正文来自 `src/sections/zh/main.html`（对应 `zh.ts` + `faq.zh.ts`）。
- **未改** `src/content/**` 文案；未发明新营销文案；未声称保证 ChatGPT 推荐或 AI 引用。

---

## 4. SEO 改动

- 英文：保留既有 SEO head；**新增** FAQPage JSON-LD（FAQ 已可见后才插入）。
- 中文：新建 `zh/index.html`，使用中文 head（canonical `https://mikaovo.ai/zh/`，hreflang 与英文互指）。
- `sitemap.xml` / `robots.txt`：**未改抓取策略**；OAI-SearchBot 仍为 Allow。
- 每页 **单个 h1**；canonical + hreflang（en / zh-Hans / x-default）已核对。

---

## 5. GEO 改动

- 可见 FAQ + FAQPage schema 提升可抽取问答。
- Organization / WebSite / WebPage JSON-LD 保持与联系事实一致。
- robots 允许 OAI-SearchBot：**可访问 ≠ 保证展示/引用**（与 `src/seo/geo-access.md` 一致）。

---

## 6. FAQ

- 英文 / 中文各 **14** 条可见 FAQ（`<details>`）。
- JSON-LD 的 `name` + `acceptedAnswer.text` 与可见「Direct answer / 直接答案」**逐条一致**（验收脚本比对通过）。
- Schema 不一致时以可见文案为准；本次无需修正 JSON-LD。

---

## 7. 动画

- V2 动画由 `window.MikaHomeAnimations`（`src/animations/home.js`）自动 init。
- `main.js` 仅保留导航粘性 / 移动菜单 / 可选 `.reveal` 观察；**已移除** V1 matrix `setInterval` 与 scan-log `setTimeout` 假扫描；缺失节点安静跳过。
- 未在 `main.js` 再写一套仪表盘动画。

---

## 8. 颜色系统

- V2 令牌在 `src/sections/home.css` 的 `.hv2-root`（白 / 浅灰 / 深蓝 / SEO 蓝 / GEO 紫 / 健康绿等）。
- 区块背景按 Visual 合同（Hero `#F8FAFC`、Audit 深色、SEO Growth 浅蓝、GEO 浅紫、CTA `#111827` 等）。
- **未**把 `hv2-` 样式搬进 `styles.css`。

---

## 9. 响应式与联系组件

- `styles.css`：增加 `overflow-x: clip`；联系 dock 底部留白扩展到 `.hv2-footer`；保留字体、reset、联系组件样式。
- 联系挂载：`data-contact-open`、`#contact-popover-*`、`#contact-sheet`、`[data-contact-cards]`、`[data-contact-footer]`、`#contact-live` 英中均在。
- WhatsApp `https://wa.me/8613814015518`；邮件 `mailto:akizukiovo@gmail.com`；微信 `Xue2017105` 仅复制。

---

## 10. 本整合改动的文件

| 文件 | 动作 |
| --- | --- |
| `index.html` | 换 body 为 V2；插入 FAQ JSON-LD 与 section/animation CSS；挂动画脚本 |
| `zh/index.html` | **新建**中文首页 |
| `main.js` | 去掉 V1 假扫描/matrix；缺失节点安静跳过；保留导航 |
| `styles.css` | 仅冲突修复（overflow、V2 footer 留白、移动端联系按钮） |
| `docs/homepage-v2-implementation-report.md` | 本报告 |

未改：`src/content/**`、`robots.txt` 策略、`contact-config.js` 号码、域名相关既有改动。

---

## 11. 验收命令与结果

**无构建。** 在站点根启动静态服务：

```bash
python -m http.server 8765 --directory D:/NagaAssistance/b2bweb/site
```

### 静态 / HTTP 检查

- `GET /` → **200**
- `GET /zh/` → **200**
- 单 h1、canonical、hreflang 互指、FAQ 可见 = JSON-LD（14）、内部相对资源无 404、无 `/dist/` 路径 → **通过**

### Playwright（Cursor 内置 browser MCP 当时无可用标签，改用本地 Chromium）

| 项 | EN | ZH |
| --- | --- | --- |
| 控制台 error / pageerror | 无 | 无 |
| FAQ 展开 | 通过 | 通过 |
| 联系 dock 打开 | 通过 | 通过 |
| 语言切换 `/` ↔ `/zh/` | 通过 | 通过 |
| 移动菜单 390 | 通过 | 通过 |
| 横向溢出 1440 / 390 | 无（scrollWidth = clientWidth） | 同左 |
| MikaHomeAnimations / MIKA_CONTACT | 存在 | 存在 |

---

## 12. 剩余问题 / 后续可选

1. **V1 样式体积**：`styles.css` 仍含大量旧首页选择器（`.hero` / `.pipeline` 等），对 `hv2-*` 基本不生效，但可在确认无其它页面依赖后做清理。
2. **Hero 联系气泡**：页面保留 `#contact-popover-hero`，但 Hero 区无 `data-contact-open="hero"` 按钮；当前靠 header / dock / CTA 卡片联系，功能完整。
3. **SEO head 首行缩进**：`head.*.html` 首行 `<meta charset>` 无前导空格，仅格式问题。
4. **Cursor IDE browser MCP**：本轮无法稳定开标签；视觉交互由 Playwright 补齐。上线前建议人工再扫一眼真机字体与动效。
5. **未部署**：按要求未 `git commit` / 未推送；线上需人工发布后验证 `https://mikaovo.ai/` 与 `/zh/`。

---

## 13. 验收结论

Homepage V2 已在**站点根**完成英中双页组装与本地验收：SEO head + FAQ schema、可见 FAQ 一致、联系挂载可用、动画由 `MikaHomeAnimations` 负责、无构建产物路径。可进入发布前人工 spot-check。
