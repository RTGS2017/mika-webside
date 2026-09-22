# Contact System 实现报告

## 1. 修改了哪些组件

项目是静态首页，没有 Vue / React 组件，也没有可复用的 Modal、Dropdown 或 Tooltip。本次在现有页面上接入联系系统：

- `index.html`：导航 Contact、Hero「Talk to Us」、联系区块、页脚 Contact、桌面悬浮入口、移动端 Sheet
- `404.html`：同一套悬浮入口和移动端 Sheet
- `styles.css`：沿用现有白底、细边框、navy 文字和 10–14px 圆角
- `main.js`：未改交互逻辑。移动端从导航打开联系面板时，会先收起导航菜单
- `README.md`：补充新文件说明
- `sitemap.xml`：`lastmod` 更新为 2026-09-22
- `robots.txt`：不索引 `/docs/`

首页原有 H1、title、description、canonical 和 JSON-LD 没有为 Contact 改写。工作区里原本未提交的 `mikaovo.ai` 规范地址仍然保留。

## 2. 新增了哪些文件

- `contact-config.js`
- `contact.js`
- `docs/contact-system-implementation.md`

没有 `contactConfig.ts`。仓库没有 TypeScript 或打包步骤，GitHub Pages 直接发布静态文件。配置放在浏览器可直接加载的脚本里，避免引入构建系统。

## 3. Contact 配置位置

`contact-config.js` 的 `window.MIKA_CONTACT`。

导航、Hero、悬浮入口、联系区块、页脚和 404 都从这里读取。页面不散落第二份号码、邮箱或微信号。

`wechat.wechatQrAsset` 预留为 `null`。以后填入图片路径后，会出现 “View QR Code”。当前没有二维码，也没有 `wechat://` 链接。

## 4. WhatsApp URL

展示：`+86 138 1401 5518`

跳转：`https://wa.me/8613814015518`

点击使用：

```js
window.open("https://wa.me/8613814015518", "_blank", "noopener,noreferrer")
```

脚本会拒绝带 `+` 或空格的地址。号码本身也可以点击复制。

## 5. Email mailto

`mailto:akizukiovo@gmail.com`

这是真实链接，不用 JavaScript 模拟打开邮箱。邮箱地址可以另外复制。

## 6. WeChat Copy 实现

复制值：`Xue2017105`

按钮文案从 “Copy WeChat ID” 变为 “Copied ✓”，约 1.8 秒后恢复。

优先 `navigator.clipboard.writeText`。若不可用或失败，在同一次点击里用隐藏 `textarea` 和 `document.execCommand("copy")` 作为后备。失败时只更新无障碍提示，不抛出页面错误。

电话和邮箱同样可以复制。

## 7. Header Contact

一级导航只有 “Contact”，不直接列出 WhatsApp、Email、WeChat。

桌面端点击后打开白底、1px 边框、轻阴影、14px 圆角的面板，标题为 “Get in touch”。Escape、点击外部或 Close 可关闭。

## 8. Hero Talk to Us

主按钮仍是 “Start a structured audit”。

第二个按钮改为 “Talk to Us”。它打开同一套联系面板，不直接跳到邮箱，也没有第三个大按钮。

## 9. Floating Contact Dock

桌面右下角是小型 “Contact” 按钮，不是圆形客服球。

点击后在按钮上方展开同一套联系内容。`prefers-reduced-motion` 时不做位移动画。

## 10. Contact Section

位于最终 CTA 之后、页脚之前。

- eyebrow：Get in touch
- 标题：Let's talk about your visibility.（H2，不是 H1）
- 说明：Have a question about SEO, GEO, or your website? Choose the channel that works best for you.
- 右侧三张纵向卡片：WhatsApp、Email、WeChat

背景 `#F7F8FA`，卡片白底、细边框。悬停只加深边框并上移 1px。

## 11. Footer

新增 Contact 列，样式与 Product、Project 一致：

- WhatsApp / +86 138 1401 5518
- Email / akizukiovo@gmail.com
- WeChat / Xue2017105

## 12. Mobile 处理

宽度不超过 760px 时，三个联系方式不会常驻底部。

页面只保留 Contact 按钮。点击后打开底部 Sheet，兼容 `safe-area-inset-bottom`。Sheet 使用 `position: fixed`，不改变文档流，避免横向滚动和页面跳动。

导航里的 Contact、Hero 的 Talk to Us 和悬浮按钮在手机上都打开这一个 Sheet。

## 13. Accessibility

- 键盘可聚焦，已有 `:focus-visible`
- `aria-expanded`、`aria-haspopup="dialog"`、`aria-controls`
- Sheet 使用 `role="dialog"` 和 `aria-modal="true"`
- Escape 关闭，焦点回到触发按钮
- 打开后面板内 Tab 循环
- 文案包含 “Contact us on WhatsApp”、“Send an email”、“Copy WeChat ID”
- `aria-live="polite"` 播报复制结果
- `prefers-reduced-motion: reduce` 时关闭位移动画

## 14. Analytics

项目里没有现成的统计脚本，因此没有新增统计平台。

如果页面上已经存在 `gtag` 或 `dataLayer`，会转发这些事件：

- `contact_whatsapp_click`
- `contact_email_click`
- `contact_wechat_copy`
- `contact_panel_open`
- `contact_panel_close`

没有这些接口时，事件不会发送。

## 15. SEO 是否有影响

没有影响首页的检索字段：

- title 仍是 “Mika Visibility — One engine for Search and AI”
- description、canonical、Open Graph 未因 Contact 改动
- 页面没有 hreflang，本次也没有新增
- JSON-LD 仍只有 WebSite 和 Organization，没有追加 contactPoint
- 全页只有一个 H1
- `/docs/` 已在 `robots.txt` 中禁止抓取，避免实现说明被当成公开页面

## 16. GitHub Pages 是否正常

部署方式仍是分支根目录的静态文件，没有 npm、Vite 或打包步骤。

`node --check` 已通过：`contact-config.js`、`contact.js`、`main.js`。

`npm run build` 无法执行，因为仓库没有 `package.json`，也不应为此新增构建系统。GitHub Pages 不依赖这次命令。

本地预览检查了 1440、1024、390 和 375 宽度：导航、联系区块和移动端 Sheet 没有横向溢出。预览浏览器拦截了剪贴板写入，页面会给出复制失败提示且不报错；在普通 HTTPS 浏览器中走 `navigator.clipboard`。
