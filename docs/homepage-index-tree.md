# Visibility Index Tree

Hero 前景里的 Query / Page / Website 卡片和四项能力芯片已从发布页 DOM 移除，不再用 `display: none` 藏起来。`src/sections/en/main.html` 与 `src/sections/zh/main.html` 是旧片段，不参与发布。

背景由 `src/visibility/tree.js` 画成装饰性 SVG，`aria-hidden="true"`。根节点先出现，然后搜索链依次长出：页面、结构、主题、意图、搜索可见性。接着答案链：问题、实体、证据、答案、答案可见性。搜索用蓝 `#38BDF8`，答案用紫 `#8B5CF6`，根与信号用青 `#22D3EE`。

窄于 760px 时只保留较短的两条链：页面 / 结构 / 搜索可见性，以及问题 / 证据 / 答案可见性。

文案层 `z-index: 10`，树在 `z-index: 2`。待机节点透明度约 0.28，当前节点为 1。连线 1px。构建用描边，之后信号沿路径移动。离开 Hero 时树向上收缩。`prefers-reduced-motion` 直接显示终态，不收缩。真正的标题、段落和链接仍在 HTML 里。
