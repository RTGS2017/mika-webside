/**
 * Mika Motion System — classic script, no build.
 * Four layers: Ambient · Scroll · Product · Interaction
 * Public API: window.MikaMotion
 */
(function (global) {
  "use strict";

  var NS = "mm";
  var mobileMq = null;
  var reduceMq = null;

  function media(q) {
    try {
      return global.matchMedia(q);
    } catch (_) {
      return { matches: false, addEventListener: function () {}, addListener: function () {} };
    }
  }

  function prefersReducedMotion() {
    if (!reduceMq) reduceMq = media("(prefers-reduced-motion: reduce)");
    return !!reduceMq.matches;
  }

  function isMobile() {
    if (!mobileMq) mobileMq = media("(max-width: 768px)");
    return !!mobileMq.matches;
  }

  function qsa(root, sel) {
    try {
      return Array.prototype.slice.call(root.querySelectorAll(sel));
    } catch (_) {
      return [];
    }
  }

  function qs(root, sel) {
    try {
      return root.querySelector(sel);
    } catch (_) {
      return null;
    }
  }

  function addClass(el, name) {
    if (el && el.classList) el.classList.add(name);
  }

  function removeClass(el, name) {
    if (el && el.classList) el.classList.remove(name);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function parseNum(el, attr) {
    if (!el) return 0;
    var raw = el.getAttribute(attr);
    if (raw == null || raw === "") return 0;
    var n = parseFloat(raw);
    return isFinite(n) ? n : 0;
  }

  function setText(el, value) {
    if (!el) return;
    el.textContent = String(Math.round(value));
  }

  /* ── Ambient ──────────────────────────────────────────────────────────── */

  var Ambient = {
    /**
     * Soft ambient presence: grid fade, path draw, no permanent spam loop.
     * pause when host leaves viewport.
     */
    bind: function (host, options) {
      options = options || {};
      var reduced = prefersReducedMotion();
      var active = false;
      var onEnter = options.onEnter || function () {};
      var onLeave = options.onLeave || function () {};
      var onFrame = options.onFrame || null;
      var rafId = 0;
      var last = 0;

      function frame(now) {
        if (!active || reduced || !onFrame) return;
        if (!last) last = now;
        onFrame(now - last, now);
        last = now;
        rafId = global.requestAnimationFrame(frame);
      }

      function start() {
        if (active) return;
        active = true;
        addClass(host, "mm-ambient-on");
        onEnter();
        if (onFrame && !reduced) {
          last = 0;
          rafId = global.requestAnimationFrame(frame);
        }
      }

      function stop() {
        active = false;
        removeClass(host, "mm-ambient-on");
        onLeave();
        if (rafId) {
          global.cancelAnimationFrame(rafId);
          rafId = 0;
        }
      }

      if (reduced) {
        addClass(host, "mm-final");
        onEnter();
        return { start: start, stop: stop, destroy: function () {} };
      }

      var io = observeVisibility(host, function (vis) {
        if (vis) start();
        else stop();
      }, { threshold: options.threshold != null ? options.threshold : 0.12 });

      return {
        start: start,
        stop: stop,
        destroy: function () {
          stop();
          io.disconnect();
        },
      };
    },
  };

  /* ── Scroll ───────────────────────────────────────────────────────────── */

  function observeOnce(el, callback, options) {
    if (!el || typeof IntersectionObserver === "undefined") {
      callback(el);
      return { disconnect: function () {} };
    }
    options = options || {};
    var fired = false;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || fired) return;
          fired = true;
          io.disconnect();
          callback(entry.target);
        });
      },
      {
        threshold: options.threshold != null ? options.threshold : 0.28,
        rootMargin: options.rootMargin || "0px 0px -8% 0px",
      }
    );
    io.observe(el);
    return { disconnect: function () { io.disconnect(); } };
  }

  function observeVisibility(el, onChange, options) {
    if (!el || typeof IntersectionObserver === "undefined") {
      onChange(true);
      return { disconnect: function () {} };
    }
    options = options || {};
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          onChange(entry.isIntersecting, entry);
        });
      },
      {
        threshold: options.threshold != null ? options.threshold : 0.2,
        rootMargin: options.rootMargin || "0px",
      }
    );
    io.observe(el);
    return { disconnect: function () { io.disconnect(); } };
  }

  var Scroll = {
    once: observeOnce,
    whileVisible: observeVisibility,
    /**
     * Progress 0–1 based on section position in viewport (no fake timers).
     */
    progress: function (el, onProgress, options) {
      options = options || {};
      if (!el || prefersReducedMotion()) {
        onProgress(1);
        return { disconnect: function () {} };
      }
      function update() {
        var rect = el.getBoundingClientRect();
        var vh = global.innerHeight || 1;
        var start = vh * 0.85;
        var end = vh * 0.2;
        var mid = rect.top + rect.height * 0.35;
        var t = (start - mid) / (start - end);
        if (t < 0) t = 0;
        if (t > 1) t = 1;
        onProgress(t);
      }
      var ticking = false;
      function onScroll() {
        if (ticking) return;
        ticking = true;
        global.requestAnimationFrame(function () {
          ticking = false;
          update();
        });
      }
      update();
      global.addEventListener("scroll", onScroll, { passive: true });
      global.addEventListener("resize", onScroll, { passive: true });
      return {
        disconnect: function () {
          global.removeEventListener("scroll", onScroll);
          global.removeEventListener("resize", onScroll);
        },
      };
    },
  };

  /* ── Product ──────────────────────────────────────────────────────────── */

  function animateCount(el, options) {
    options = options || {};
    var target = parseNum(el, "data-count");
    var duration = options.duration != null ? options.duration : 1600;
    var getActive = options.getActive || function () { return true; };
    var onDone = options.onDone;

    if (prefersReducedMotion()) {
      setText(el, target);
      if (onDone) onDone();
      return { cancel: function () {} };
    }

    var start = null;
    var rafId = 0;
    var cancelled = false;

    function frame(now) {
      if (cancelled) return;
      if (!getActive()) {
        rafId = global.requestAnimationFrame(frame);
        return;
      }
      if (start == null) start = now;
      var t = Math.min(1, (now - start) / duration);
      setText(el, target * easeOutCubic(t));
      if (t < 1) {
        rafId = global.requestAnimationFrame(frame);
      } else {
        setText(el, target);
        if (onDone) onDone();
      }
    }

    setText(el, 0);
    rafId = global.requestAnimationFrame(frame);
    return {
      cancel: function () {
        cancelled = true;
        if (rafId) global.cancelAnimationFrame(rafId);
        setText(el, target);
      },
    };
  }

  function stagger(items, delayMs, apply, onDone) {
    var i = 0;
    var timers = [];
    var cancelled = false;
    var mobile = isMobile();
    var delay = mobile ? Math.max(40, Math.round(delayMs * 0.65)) : delayMs;

    function next() {
      if (cancelled) return;
      if (i >= items.length) {
        if (onDone) onDone();
        return;
      }
      apply(items[i], i);
      i += 1;
      if (i < items.length) {
        timers.push(global.setTimeout(next, delay));
      } else if (onDone) {
        onDone();
      }
    }

    if (!items.length) {
      if (onDone) onDone();
      return { cancel: function () { cancelled = true; } };
    }
    next();
    return {
      cancel: function () {
        cancelled = true;
        timers.forEach(function (id) { global.clearTimeout(id); });
      },
    };
  }

  function fillBars(host) {
    var bars = qsa(host, "[data-bar]");
    bars.forEach(function (bar) {
      var target = parseNum(bar, "data-bar");
      bar.style.setProperty("--mm-bar", String(target));
      bar.style.setProperty("--hv2a-bar-target", String(target));
      addClass(bar, "mm-fill");
      addClass(bar, "hv2a-fill");
    });
  }

  var Product = {
    count: animateCount,
    stagger: stagger,
    fillBars: fillBars,
    parseNum: parseNum,
    setText: setText,
    ease: easeOutCubic,
  };

  /* ── Interaction ──────────────────────────────────────────────────────── */

  var Interaction = {
    /**
     * FAQ: answers stay in DOM; only highlight the open/current item.
     */
    faqHighlight: function (root) {
      var list = qs(root, ".hv2-faq-list") || root;
      var items = qsa(list, ".hv2-faq-item");
      if (!items.length) return { destroy: function () {} };

      function sync() {
        items.forEach(function (item) {
          if (item.open || item.hasAttribute("open")) {
            addClass(item, "mm-faq-active");
          } else {
            removeClass(item, "mm-faq-active");
          }
        });
      }

      items.forEach(function (item) {
        item.addEventListener("toggle", sync);
      });
      sync();
      return {
        destroy: function () {
          items.forEach(function (item) {
            item.removeEventListener("toggle", sync);
          });
        },
      };
    },
  };

  /* ── Boot helpers ─────────────────────────────────────────────────────── */

  function markReady(root) {
    var html = root.documentElement || qs(global.document, "html");
    addClass(html, "mm-ready");
    addClass(html, "hv2a-ready");
    if (prefersReducedMotion()) addClass(html, "mm-reduced");
    if (isMobile()) addClass(html, "mm-mobile");
  }

  function init(root) {
    root = root || global.document;
    if (!root) return;
    markReady(root);
  }

  var api = {
    version: "1.0.0",
    Ambient: Ambient,
    Scroll: Scroll,
    Product: Product,
    Interaction: Interaction,
    prefersReducedMotion: prefersReducedMotion,
    isMobile: isMobile,
    qs: qs,
    qsa: qsa,
    addClass: addClass,
    removeClass: removeClass,
    init: init,
  };

  global.MikaMotion = api;
})(typeof window !== "undefined" ? window : this);
