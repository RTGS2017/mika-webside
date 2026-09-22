/**
 * Desktop wheel moves one homepage chapter at a time.
 * Touch, keyboard focus in fields, and reduced motion keep native scrolling.
 * window.MikaChapters.init()
 */
(function (global) {
  "use strict";

  var THRESHOLD = 24;
  var DURATION = 980;
  var lockedUntil = 0;
  var bucket = 0;
  var bucketAt = 0;
  var animating = false;
  var rafId = 0;

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

  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function targetY(el) {
    var nav = global.document.querySelector(".hv2-nav");
    var offset = nav ? nav.offsetHeight : 0;
    var y = el.getBoundingClientRect().top + (global.pageYOffset || global.scrollY || 0) - offset;
    return Math.max(0, y);
  }

  function finishMove() {
    animating = false;
    if (rafId) global.cancelAnimationFrame(rafId);
    rafId = 0;
    global.document.documentElement.classList.remove("is-chapter-moving");
    lockedUntil = Date.now() + 140;
  }

  function go(list, index) {
    var target = list[index];
    if (!target || animating) return;
    var start = global.pageYOffset || global.scrollY || 0;
    var dest = targetY(target);
    if (Math.abs(dest - start) < 2) return;
    if (reduced()) {
      global.scrollTo(0, dest);
      return;
    }
    animating = true;
    global.document.documentElement.classList.add("is-chapter-moving");
    var t0 = 0;
    function frame(now) {
      if (!t0) t0 = now;
      var p = Math.min(1, (now - t0) / DURATION);
      global.scrollTo(0, start + (dest - start) * ease(p));
      if (p < 1) rafId = global.requestAnimationFrame(frame);
      else {
        global.scrollTo(0, dest);
        finishMove();
      }
    }
    rafId = global.requestAnimationFrame(frame);
  }

  function onWheel(event) {
    if (!fineDesktop() || reduced()) return;
    if (event.ctrlKey) return;
    if (animating) {
      event.preventDefault();
      return;
    }
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

  function bindStates() {
    var list = sections();
    if (!list.length || typeof global.IntersectionObserver === "undefined") return;
    var seen = {};
    var io = new global.IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var el = entry.target;
        var id = el.id || "";
        if (!seen[id]) {
          seen[id] = true;
          if (entry.intersectionRatio > 0.55) el.setAttribute("data-chapter-state", "active");
          return;
        }
        if (entry.intersectionRatio > 0.55) el.setAttribute("data-chapter-state", "active");
        else if (entry.isIntersecting) {
          el.setAttribute("data-chapter-state", entry.boundingClientRect.top > 40 ? "enter" : "exit");
        } else {
          el.setAttribute("data-chapter-state", "exit");
        }
      });
    }, { threshold: [0, 0.25, 0.55, 0.85] });
    list.forEach(function (section) { io.observe(section); });
  }

  function init() {
    enableSnap();
    bindStates();
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
