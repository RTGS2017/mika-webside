# Homepage V4 架构审计

站点是纯静态 HTML。仓库根就是 GitHub Pages 发布目录，没有 `package.json` 构建，也没有 `dist/`。英文首页是 `index.html`，中文首页是 `zh/index.html`。

## 入口

- 样式：`styles.css`、`src/hud/theme.css`、`src/hud/hud.css`、`src/sections/home.css`、`src/motion/motion.css`、`src/animations/home.css`
- 脚本：`contact-config.js`、`contact.js`、`src/motion/core.js`、`src/motion/primitives.js`、`src/hud/hud.js`、`src/animations/home.js`、`main.js`
- 文案写在 HTML 里，不是 `en.ts` / `zh.ts` 运行时字典。`src/content/home/*.ts` 不参与页面渲染。
- 中文页不会回退到英文键。缺翻译时表现为硬编码英文残留，而不是 i18n fallback。

## 本次文件边界

- 索引树：`src/visibility/tree.js`、`src/visibility/tree.css`
- 章节滚动：`src/scroll/chapters.js`、`src/scroll/chapters.css`
- HUD 中文状态：`src/hud/hud.js`
- 中文界面：`zh/index.html`、`contact.js`（按 `lang` 切换联系文案）
- 英文首页只换 Hero 背景和章节轨，不改英文产品文案

## 不做的事

不引入 Vue、Three.js 或 WebGL。不新增会改变 Pages 发布方式的 `dist` 构建。语言审计扫描 `zh/`，不扫描不存在的 `dist/zh/`。
