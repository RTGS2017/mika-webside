# Visibility Index Tree

Hero 前景里的 Query / Page / Website 卡片和四项能力芯片已从 DOM 移除，不再用 `display: none` 藏起来。

背景由 `src/visibility/tree.js` 画成装饰性 SVG，`aria-hidden="true"`。根节点是「网站」或 WEBSITE。左侧搜索链：页面、结构、主题、意图、搜索可见性。右侧答案链：问题、实体、证据、答案、答案可见性。搜索用蓝，答案用紫，根节点用青。

文案层 `z-index: 10`，树在 `z-index: 2`。连线整体透明度约 0.28，避免盖住标题。构建用 stroke 描边，之后有一条信号沿路径移动。离开 Hero 视口会停。`prefers-reduced-motion` 直接显示终态。真正的标题、段落和链接仍在 HTML 里。
