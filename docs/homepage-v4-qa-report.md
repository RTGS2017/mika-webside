# Homepage V4 验收记录

1. 架构：静态站，发布根是仓库根，不是 `dist/`。
2. 删除了 Hero 前景卡片和旧的 Website 方框，概念留在索引树节点和后续章节正文里。
3. 索引树由 SVG 生长，搜索蓝、答案紫。
4. 动效仍是描边、信号流动，没有 WebGL。
5. 桌面滚轮一次一章；高章节可先读完。
6. 手机隐藏章节轨，不接管滚轮。
7. 中文首页界面词已替换；`python tools/zh_content_audit.py` 通过。
8. SEO 正文仍在 DOM。canonical / hreflang 未改。
9. 没有 npm build。发布就是推送 `main`。
10. 知识文章正文没有逐篇重写。索引树不会在每个章节换成另一棵树，背景树目前只在 Hero。
