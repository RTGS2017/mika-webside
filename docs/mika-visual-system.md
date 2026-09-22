# Mika 视觉系统（Visibility Command Center）

首页与后续产品页共用同一套控制台语言：深色底板、HUD 外壳、五种动效、角色化强调色。知识中心与其它静态页若要对齐视觉，只链接本文件列出的样式，不要在页面内另起色板。

## 色彩职责

所有颜色写在 `src/hud/theme.css` 的 CSS 变量中。模块禁止再定一套局部色。

| 变量 | 值 | 职责 |
|------|-----|------|
| `--mika-bg` | `#070B14` | 整站深色底 |
| `--mika-bg-2` | `#0B1220` | 交替区块底 |
| `--mika-panel` | `#101A2C` | HUD / 面板面 |
| `--mika-panel-2` | `#121D30` | 次级面板 |
| `--mika-highlight` | `#0E1728` | 内嵌高亮面 |
| `--mika-text` | `#F8FAFC` | 主字色 |
| `--mika-muted` | `#94A3B8` | 次要字色 |
| `--mika-border` | `#1E293B` | 1px 边框 |
| `--mika-blue` | `#38BDF8` | **仅** SEO / Search |
| `--mika-violet` | `#8B5CF6` | **仅** GEO / AI visibility |
| `--mika-cyan` | `#22D3EE` | **仅** 系统进行中 |
| `--mika-green` | `#34D399` | **仅** 已验证 / 健康 |
| `--mika-amber` | `#FBBF24` | **仅** 警告 / 机会 |

比例建议：深色面约 70%，中间层面约 20%，强调色约 10%。不要全黑，也不要大片白底。

## 五种动效

实现于 `src/motion/primitives.js`，挂到 `window.MikaMotion`：

| 名称 | 用途 | 典型区块 |
|------|------|----------|
| `scan` | 细扫描线 / 环形进度 | Deep Audit、Health |
| `signal` | 节点点亮 | Entity、Evidence、Questions、GEO 链、多语言、CTA |
| `flow` | SVG 路径流动 | Hero Visibility Grid、搜索/GEO 路径 |
| `build` | 先角 → 边 → 标题 → 内容 | 各 `mika-hud` 区块入场 |
| `expand` | 节点向外扩张 | Growth、SEO 机会地图、Framework Growth 象限 |

约束：

- 使用 IntersectionObserver、CSS、SVG、`requestAnimationFrame`
- 离开视口暂停；`prefers-reduced-motion` 直接终态，不藏内容
- 禁止 Three.js / WebGL / 粒子宇宙
- 禁止整屏滚动吸附；禁止无限循环的重动画
- Hero 进度与滚动绑定（`Scroll.progress`）

## HUD class

- 容器：`.mika-hud`
- 必填属性：`data-system`、`data-status`
- 视觉：1px 边框、四角切角、顶栏系统标签 + 状态
- 悬停：一条细扫描线从左到右（`.mika-hud-scan`）
- 激活：`data-status="active"` / `.is-active` 时只亮四角
- 脚本：`src/hud/hud.js` → `window.MikaHud.init()`
- 桌面章节轨：`.mika-rail`（移动端隐藏）

禁止：玻璃态、大发光按钮、大圆角。

## 知识中心如何链接

知识中心页（`knowledge/**`、`zh/knowledge/**`）若要对齐 Command Center 底色与 HUD，在页面 `<head>` 中增加（路径按页面深度调整）：

```html
<link rel="stylesheet" href="/src/hud/theme.css">
<link rel="stylesheet" href="/src/hud/hud.css">
```

相对路径示例（`knowledge/foo/index.html`）：

```html
<link rel="stylesheet" href="../../src/hud/theme.css">
<link rel="stylesheet" href="../../src/hud/hud.css">
```

中文知识页（`zh/knowledge/foo/index.html`）：

```html
<link rel="stylesheet" href="../../../src/hud/theme.css">
<link rel="stylesheet" href="../../../src/hud/hud.css">
```

可选：需要 HUD 顶栏与悬停扫描线时再加载：

```html
<script src="/src/hud/hud.js" defer></script>
```

动效若需要，再按需加载：

```html
<script src="/src/motion/core.js" defer></script>
<script src="/src/motion/primitives.js" defer></script>
<link rel="stylesheet" href="/src/motion/motion.css">
```

不要复制首页 `home.css` 的整站布局；知识文章页只取主题色与 HUD 外壳即可。

## 首页脚本顺序

```html
<script src="./src/motion/core.js" defer></script>
<script src="./src/motion/primitives.js" defer></script>
<script src="./src/hud/hud.js" defer></script>
<script src="./src/animations/home.js" defer></script>
```

`styles.css` 仅将 `body` 底色与基础字色改为 `#070B14` / `#F8FAFC`，联系组件样式仍由既有 contact 规则负责。
