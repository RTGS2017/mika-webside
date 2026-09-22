# 中文完整性

中文首页原先把系统标签直接写在 HTML 里，例如 Deep Audit、SCAN、Entity clarity、Question Coverage。`src/hud/hud.js` 还会把 `data-system` / `data-status` 显示成 SYSTEM / STATUS。

## 处理方式

- 可见界面改成中文，保留 Mika、SEO、GEO、AI、GitHub、WhatsApp、URL、语言名和示例路径。
- HUD 在 `lang=zh` 时显示「系统 / …」和「状态：就绪」。
- 联系组件按页面语言切换「关闭 / 已复制 / 邮箱 / 微信」，号码不变。
- 没有英文 fallback。`npm run i18n:audit` 与 `npm run zh:content-audit` 都是 `python tools/zh_content_audit.py`，检查 `zh/index.html`，不是 `dist/zh/`。页面没有键值字典，所以审计看的是可见字符串，不是 en/zh key 表。

## 仍可出现的英文

品牌名 Mika Visibility、能力名 SEO / GEO、语言标签 EN / Español / Deutsch、仓库名和示例 URL。
