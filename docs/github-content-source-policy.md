# GitHub 内容来源政策（Mika）

生效观察日：2026-09-22  
适用范围：`https://mikaovo.ai/` 知识文章中引用公开 GitHub 仓库作为研究输入时。

## 原则

Mika 可以把公开开源仓库当作**研究输入**，用来观察工具如何检查站点、手册如何组织有来源页面、双语学习站如何对齐事实。产出必须是 **Mika 原创文章**：用自己的话重写观察与启发，并给出可见署名。

这不是自动发文流水线，也不是镜像站。

## 允许

- 登记仓库身份、许可证、源 URL、查看日期（见 `tools/research/sources.json`）。
- 记录可观察的设计事实：检查项类别、内容结构、公开元数据产物（如 `llms.txt`、sitemap、claims 表）、对审计工作的启发。
- 对 MIT 等宽松许可证仓库做**事实归因**（仓库名、作者、许可证、链接、日期）。
- 对 CC BY-SA 4.0 作品：商业使用与改编可以，但必须署名；文中受该作品启发的表述以 CC BY-SA 4.0 分享，并附许可证链接。**不要**把整站改成 CC BY-SA。

## 禁止

- 把 README 或其他文档**直译发布**为站点文章。
- 把源仓库正文、大段代码、整仓内容复制进本站。
- **批量抓取**后自动生成大量页面。
- **拼接**多个仓库内容去填页数。
- 把整仓克隆进静态站仓库。
- 自动改写并自动发布。
- 声称“保证被 AI 引用”或承诺排名结果。
- 对 MIT 仓库声称“复制了他们的文档”（我们只做事实归因）。

## 质量与风险意识

Google 将以操纵排名为主要目的的**批量低价值内容**视为风险。开源研究笔记应少而精：每篇对应清晰问题、可核验来源、人工复核。

## 许可证核对（2026-09-22）

| 仓库 | 预期 | 实际（公开核对） |
| --- | --- | --- |
| `paladini/generative-engine-optimization-basic-guide` | MIT | **MIT**（GitHub SPDX 与 LICENSE 一致） |
| `ferinazumaDEV/generative-engine-optimization-handbook` | CC BY-SA 4.0 | **CC BY-SA 4.0**（GitHub SPDX `CC-BY-SA-4.0`） |
| `spronta/crawlie` | MIT | **MIT**（`LICENSE` 文件正文为 MIT；GitHub API 因自定义前言报告 `NOASSERTION`/`Other`，以 LICENSE 为准） |
| `puneetindersingh/open-seo-crawler` | MIT | **MIT**（GitHub SPDX 与 LICENSE 一致） |

若日后上游变更许可证，以重新核对日的公开页为准，并更新本文件与 `sources.json`。

## 更新机制

发现上游仓库变化时，仅生成**待复核候选**（例如把 `pending_review` 设为 `true`），由人工决定是否更新简报与文章。可用：

```bash
node tools/research/list-updates.mjs
```

该脚本只读本地登记文件，不联网，不写页面。

## 页面署名最低要求

每篇 Research Note 的来源面板须可见，至少包含：

- 仓库名  
- 作者 / 所有者  
- 许可证  
- 源链接  
- 查看日期  

CC BY-SA 篇另需：作者署名、受启发表述以 CC BY-SA 4.0 分享的声明、许可证链接。
