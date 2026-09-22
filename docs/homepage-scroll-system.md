# 章节滚动

桌面细指针设备给 `html` 加上 `mika-chapter-scroll`：`scroll-snap-type: y mandatory`，每节 `scroll-snap-align: start` 且 `scroll-snap-stop: always`。

滚轮只在当前章节已经滚到边缘时才接管，一次手势只进一章，锁定约 900ms。章节比视口更高时，先自然阅读，不会直接跳过。触摸屏不启用这套接管。方向键和 PageUp / PageDown 在桌面、且焦点不在输入框时同样一次一章。锚点链接仍是普通 `<a href="#...">`。

减少动效时关闭强制吸附和滚轮接管。章节轨在左侧。1100px 以下隐藏。程序滚动时会暂时关掉 scroll-snap，避免和缓动抢位置。
