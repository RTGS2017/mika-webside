/**
 * Desktop wheel moves one homepage chapter at a time.
 * Touch, keyboard focus in fields, and reduced motion keep native scrolling.
 * window.MikaChapters.init()
 */
(function (global) {
  "use strict";

  var LOCK_MS = 900;
  var THRESHOLD = 60;
  var lockedUntil = 0;
  var bucket = 0;
  var bucketAt = 0;

  function fineDesktop() {
    if (!global.matchMedia) return false;
    return global.matchMedia("(min-width: 1100px) and (pointer: fine)").matches;
  }

  function reduced() {
    return global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function sections() {
    return Array.prototype.slice.call(global.document.querySelectorAll("main .hv2-section"));
  }

  function currentIndex(list) {
    var best = 0;
    var bestDist = Infinity;
    list.forEach(function (section, index) {
      var dist = Math.abs(section.getBoundingClientRect().top);
      if (dist < bestDist) {
        bestDist = dist;
        best = index;
      }
    });
    return best;
  }

  function atEdge(section, direction) {
    var rect = section.getBoundingClientRect();
    if (direction > 0) return rect.bottom <= global.innerHeight + 12;
    return rect.top >= -12;
  }

  function go(list, index) {
    var target = list[index];
    if (!target) return;
    lockedUntil = Date.now() + LOCK_MS;
    target.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
  }

  function onWheel(event) {
    if (!fineDesktop() || reduced()) return;
    if (event.ctrlKey) return;
    var list = sections();
    if (list.length < 2) return;
    var index = currentIndex(list);
    var section = list[index];
    var direction = event.deltaY > 0 ? 1 : -1;
    if (!atEdge(section, direction)) return;

    event.preventDefault();
    var now = Date.now();
    if (now < lockedUntil) return;
    if (now - bucketAt > 240) bucket = 0;
    bucketAt = now;
    bucket += event.deltaY;
    if (Math.abs(bucket) < THRESHOLD) return;
    bucket = 0;
    var next = index + (direction > 0 ? 1 : -1);
    if (next < 0 || next >= list.length) return;
    go(list, next);
  }

  function onKey(event) {
    if (!fineDesktop() || reduced()) return;
    var tag = (event.target && event.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (event.target && event.target.isContentEditable)) return;
    var map = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 };
    if (!map[event.key]) return;
    var list = sections();
    if (!list.length) return;
    var index = currentIndex(list);
    if (!atEdge(list[index], map[event.key])) return;
    event.preventDefault();
    var next = index + map[event.key];
    if (next < 0 || next >= list.length) return;
    go(list, next);
  }

  function enableSnap() {
    if (!fineDesktop() || reduced()) return;
    global.document.documentElement.classList.add("mika-chapter-scroll");
  }

  function init() {
    enableSnap();
    global.addEventListener("wheel", onWheel, { passive: false });
    global.addEventListener("keydown", onKey);
  }

  if (global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.MikaChapters = { init: init };
})(window);
