/**
 * Homepage is cut into viewport pages and scrolls natively.
 * Long sections stay clipped until one more wheel plays a reveal.
 * window.MikaChapters.init()
 */
(function (global) {
  "use strict";

  var LOCK_MS = 720;
  var ALIGN = 64;
  var MIN_SHIFT = 48;
  var lockedUntil = 0;

  function fineDesktop() {
    if (!global.matchMedia) return false;
    return global.matchMedia("(min-width: 1100px) and (pointer: fine)").matches;
  }

  function reduced() {
    return global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function sliceMode() {
    return fineDesktop() && !reduced();
  }

  function sections() {
    return Array.prototype.slice.call(global.document.querySelectorAll("main .hv2-section"));
  }

  function foldTop(wrap, fold) {
    var top = 0;
    var el = fold;
    while (el && el !== wrap) {
      top += el.offsetTop;
      el = el.offsetParent;
    }
    return top;
  }

  function measure(section) {
    var wrap = section.querySelector(":scope > .hv2-wrap");
    if (!wrap) return 0;
    var cs = global.getComputedStyle(section);
    var padTop = parseFloat(cs.paddingTop) || 0;
    var padBottom = parseFloat(cs.paddingBottom) || 0;
    var available = section.clientHeight - padTop - padBottom;
    var overflow = Math.max(0, Math.ceil(wrap.scrollHeight - available));
    var clip = 0;
    var fold = section.querySelector("[data-cut-fold]");
    if (fold && wrap.scrollHeight >= available - 8) {
      var top = foldTop(wrap, fold);
      if (top < available - 24) {
        clip = Math.max(0, Math.ceil(Math.min(wrap.scrollHeight, available) - top));
        section.style.setProperty("--fold-line", padTop + top + "px");
      } else {
        section.style.removeProperty("--fold-line");
      }
    } else {
      section.style.removeProperty("--fold-line");
    }
    section.style.setProperty("--cut-clip", clip + "px");
    section.style.setProperty("--cut-shift", overflow + "px");
    section.classList.toggle("has-fold", clip >= 24);
    return Math.max(clip, overflow);
  }

  function measureAll() {
    sections().forEach(function (section) {
      if (section.classList.contains("is-reveal")) measure(section);
    });
  }

  function alignedSection() {
    var list = sections();
    var best = null;
    var bestDist = Infinity;
    list.forEach(function (section) {
      var dist = Math.abs(section.getBoundingClientRect().top);
      if (dist < bestDist) {
        bestDist = dist;
        best = section;
      }
    });
    if (!best || bestDist > ALIGN) return null;
    return best;
  }

  function syncMode() {
    var on = sliceMode();
    global.document.documentElement.classList.toggle("mika-slice", on);
    if (!on) {
      sections().forEach(function (section) {
        section.classList.remove("is-open");
      });
    } else {
      measureAll();
    }
  }

  function onWheel(event) {
    if (!sliceMode() || event.ctrlKey) return;
    if (Date.now() < lockedUntil) {
      event.preventDefault();
      return;
    }
    var section = alignedSection();
    if (!section || !section.classList.contains("is-reveal")) return;
    var shift = measure(section);
    if (shift < MIN_SHIFT) return;
    var open = section.classList.contains("is-open");
    var dir = event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0;
    if (!dir) return;
    if (dir > 0 && !open) {
      event.preventDefault();
      section.classList.add("is-open");
      lockedUntil = Date.now() + LOCK_MS;
      return;
    }
    if (dir < 0 && open) {
      event.preventDefault();
      section.classList.remove("is-open");
      lockedUntil = Date.now() + LOCK_MS;
    }
  }

  function onKey(event) {
    if (!sliceMode()) return;
    var tag = (event.target && event.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (event.target && event.target.isContentEditable)) return;
    var map = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 };
    if (!map[event.key]) return;
    var section = alignedSection();
    if (!section || !section.classList.contains("is-reveal")) return;
    if (measure(section) < MIN_SHIFT) return;
    var open = section.classList.contains("is-open");
    if (map[event.key] > 0 && !open) {
      event.preventDefault();
      section.classList.add("is-open");
    } else if (map[event.key] < 0 && open) {
      event.preventDefault();
      section.classList.remove("is-open");
    }
  }

  function init() {
    syncMode();
    global.addEventListener("wheel", onWheel, { passive: false });
    global.addEventListener("keydown", onKey);
    global.addEventListener("resize", function () {
      syncMode();
    });
    if (global.document.fonts && global.document.fonts.ready) {
      global.document.fonts.ready.then(measureAll);
    }
  }

  if (global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.MikaChapters = { init: init, measure: measureAll };
})(window);
