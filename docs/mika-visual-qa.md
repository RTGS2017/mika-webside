# Mika 视觉接线 QA

日期：2026-09-22  
范围：首页深色 HUD 与知识中心深色 HUD 的接线核对（不发明第三套视觉、不改文案）。

## 色板是否统一

| 角色 | 首页 (`src/hud/theme.css` → `--mika-*`) | 知识中心 (`src/knowledge/center.css` → `--kc-*`) |
|------|------------------------------------------|--------------------------------------------------|
| 整站底 | `#070B14` | `#070B14` |
| 交替底 | `#0B1220` | `#0B1220` |
| 面板 | `#101A2C` / `#121D30` | `#101A2C` / `#121D30` |
| 主字 / 次字 | `#F8FAFC` / `#94A3B8` | `#F8FAFC` / `#94A3B8` |
| 边框 | `#1E293B` | `#1E293B` |
| SEO / GEO / 进行中 / 健康 / 警告 | `#38BDF8` / `#8B5CF6` / `#22D3EE` / `#34D399` / `#FBBF24` | 同值（`--kc-seo` 等） |

结论：**色值统一**。变量名分两套是刻意的——知识中心 `center.css` 自包含深色色板，**未**批量改 68 篇文章去链 `theme.css` / `hud.css`。

`styles.css` 的 `html, body` 已为 `#070B14` / `#F8FAFC`。知识中心仍链 `styles.css`（联系组件布局）+ `center.css`；实测无白底区块，正文为 `#94A3B8` on `#070B14`。

## 修了什么

| 文件 | 变更 |
|------|------|
| `src/sections/home.css` | 补齐 `.hv2-root` 下联系弹层 / 卡片 / dock / sheet 的深色外壳，消费 `--mika-*`（对齐知识中心 `.kc-page` 联系覆写）。此前仅改了字色、保留 `styles.css` 白底，造成浅字+白底对比度失效。 |

未改：

- `index.html` / `zh/index.html`：HUD / motion / home 动画引用已齐全，无重复旧动画脚本可删。
- 知识中心 68 篇文章：已自包含深色，无白底 / 404，未为形式补链 hud 文件。
- 文案、FAQ 内容、示例免责声明。

## 本地检查结果

静态服务：`python -m http.server 8765`（仓库根）。浏览器 MCP 不可用；用 **Playwright Chromium** 做控制台与横向溢出检查。

### HTTP 状态

| URL | 状态 |
|-----|------|
| `/` | 200 |
| `/zh/` | 200 |
| `/knowledge/` | 200 |
| `/zh/knowledge/` | 200 |
| `/knowledge/what-is-geo/` | 200 |
| `/zh/knowledge/what-is-geo/` | 200 |
| `/knowledge/how-geo-handbooks-structure-source-backed-pages/`（CC BY-SA） | 200 |
| `/zh/knowledge/how-geo-handbooks-structure-source-backed-pages/` | 200 |
| `theme.css` / `hud.css` / `hud.js` / `primitives.js` / `home.js` / `center.css` 等关键资源 | 200 |

### 首页接线

| 检查项 | EN `/` | ZH `/zh/` |
|--------|--------|-----------|
| `theme.css` + `hud.css` + `hud.js` | 有 | 有 |
| `primitives.js` + `home.js`（及 `core.js` / `motion.css` / `home.css`） | 有 | 有 |
| 联系脚本 `contact.js` / `contact-config.js` | 保留 | 保留 |
| `main.js` | 保留（仅 nav / 遗留 `.reveal`，不与五种动效抢） | 同 |
| `body` 计算色 | `rgb(7, 11, 20)` | 同 |
| `h1` 数量 | 1 | 1 |
| FAQ 答案在 HTML（`.hv2-faq-body`） | 14 | 14 |
| 联系挂载 | 有 | 有 |
| 知识中心链接 | `/knowledge/` | `/zh/knowledge/` |
| 示例免责 | 有 | 有 |
| 控制台 error / pageerror / 失败请求 | 0 | 0 |
| 1440 / 390 横向 overflow | 否 | 否 |

### 知识中心

| 检查项 | 结果 |
|--------|------|
| 入口与文章 `body` | `#070B14`，无白底 section |
| 文章正文对比度 | `#94A3B8` on `#070B14` |
| 链到 hud 文件 | **否**（依赖 `center.css` 自包含，符合「不为形式改 68 篇」） |
| CC BY-SA 署名页 | EN/ZH 均可打开；页内含 CC BY-SA 声明与许可证链接 |
| 控制台 / 横向 overflow（入口 + 样例文章） | 干净 / 无 overflow |

## 仍不一致的地方

1. **变量命名双轨**：首页 `--mika-*`，知识中心 `--kc-*`，色值相同、文件不共享。若以后要单一源，再让知识中心链 `theme.css` 并映射变量即可。
2. **`styles.css` `:root` 仍留浅色 token**（`--bg` / `--white` 等），供联系布局基线与 404 等旧壳；深色页靠 `.hv2-root` / `.kc-page` 覆写。未整文件改写成第三套主题。
3. **CC BY-SA Research Note** 仍加载 `contact.js`，但页内无 `data-contact-open` / dock 挂载（仅 CTA 链到 `/#contact`）。其它标准知识文有完整联系挂载。属模板差异，非白底/404，本次未改文章 HTML。
4. **HUD 扫描线 / skip link** 会短暂出现在视口外（`left: -9999` 等），`scrollWidth` 仍等于视口，不算横向溢出。

## 四个入口状态（摘要）

| 入口 | 深色底 | HUD/动效资源 | 控制台 | 横向溢出 |
|------|--------|--------------|--------|----------|
| `/` | 是 | 齐全 | 干净 | 无 |
| `/zh/` | 是 | 齐全 | 干净 | 无 |
| `/knowledge/` | 是（center） | 不链 hud（自包含） | 干净 | 无 |
| `/zh/knowledge/` | 是（center） | 不链 hud（自包含） | 干净 | 无 |
