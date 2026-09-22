# Homepage V4 架构审计

站点是纯静态 HTML。仓库根就是 GitHub Pages 发布目录。没有会生成 `dist/` 的构建。英文首页是 `/`（`index.html`），中文首页是 `/zh/`（`zh/index.html`）。不使用 `/en/`。

## 技术栈

- HTML、CSS、原生 JavaScript。没有 Vue、Three.js、WebGL。
- 样式：`styles.css`、`src/hud/theme.css`、`src/hud/hud.css`、`src/sections/home.css`、`src/motion/motion.css`、`src/animations/home.css`、`src/visibility/tree.css`、`src/scroll/chapters.css`
- 脚本：`contact-config.js`、`contact.js`、`src/motion/core.js`、`src/motion/primitives.js`、`src/hud/hud.js`、`src/animations/home.js`、`src/visibility/tree.js`、`src/scroll/chapters.js`、`main.js`
- 动效只有 scan、signal、flow、build、expand。索引用 SVG、`stroke-dashoffset` 和 `requestAnimationFrame`。章节用 `IntersectionObserver`。

## 文案与语言

文案写在 HTML 里，不是运行时字典。`src/content/home/*.ts` 不参与渲染。中文页不会因为缺键而回退英文。`npm run i18n:audit` 与 `npm run zh:content-audit` 都扫描 `zh/index.html` 的可见残留英文，不扫描不存在的 `dist/zh/`。

## 和规格保持不一致的地方

- 章节轨在左侧。这是后来的明确要求，不改回右侧。
- 桌面滚轮一次一章，但用接近吸附加自定缓动，不用 `scroll-snap-type: y mandatory`。强制吸附会和缓动抢位置。
- 方法章节原来就在多语言和常见问题之间，滚轮会停在那里，所以章节轨补上了「方法」，常见问题是 13，联系是 14。
- 不新增 `npm run build`，也不把源码目录误当成另一套发布目录。
