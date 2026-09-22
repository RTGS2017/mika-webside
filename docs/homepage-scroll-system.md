# 章节滚动

桌面细指针、宽度至少 1100px 时，`html` 加上 `mika-chapter-scroll`。吸附是 `scroll-snap-type: y proximity`，不是 mandatory。程序滚动期间会加上 `is-chapter-moving` 并暂时关掉吸附，避免和缓动抢位置。

滚轮只在当前章节已经滚到边缘时才接管。累计超过 24px 才进一章，动画约 980ms，结束后再锁 140ms。章节比视口更高时先自然阅读。触摸屏不启用这套接管。方向键和 PageUp / PageDown 在桌面、且焦点不在输入框时同样一次一章。锚点链接仍是普通 `<a href="#...">`。

每个章节有 `data-chapter-state`：`enter`、`active`、`exit`。进入动效按章节区分：审计与健康是扫描，增长与答案是展开，问题与证据是信号，常见问题是聚焦，联系是汇聚。减少动效时关闭吸附、滚轮接管和这些进入动画。

章节轨在左侧。1100px 以下隐藏。
