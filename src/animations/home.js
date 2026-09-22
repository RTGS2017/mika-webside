/**
 * Mika Homepage V2 — animation engine (classic script, no build).
 * Explains product analysis flow; does not invent marketing copy.
 *
 * Public API: window.MikaHomeAnimations.init(root?)
 */
(function (global) {
  "use strict";

  var ATTR = "data-anim";
  var PREFIX = "hv2a-";

  var HERO_ORDER = ["seoHealth", "geoHealth", "seoGrowth", "geoGrowth"];
  var TAG_ORDER = ["intent", "commercial", "topic", "product", "evidence"];
  var PHASE_ORDER = ["audit", "diagnosis", "blueprint"];
  var LOOP_ORDER = ["scan", "diagnose", "blueprint", "optimize", "re-audit"];

  function prefersReducedMotion() {
    try {
      return global.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (_) {
      return false;
    }
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

  function hasClass(el, name) {
    return !!(el && el.classList && el.classList.contains(name));
  }

  function parseTarget(el, attr) {
    if (!el) return 0;
    var raw = el.getAttribute(attr);
    if (raw == null || raw === "") return 0;
    var n = parseFloat(raw);
    return isFinite(n) ? n : 0;
  }

  function setCountText(el, value) {
    if (!el) return;
    var rounded = Math.round(value);
    el.textContent = String(rounded);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * Count from 0 → target with rAF. Stops when host leaves viewport.
   * Ends exactly on data-count final value.
   */
  function animateCount(el, options) {
    options = options || {};
    var target = parseTarget(el, "data-count");
    var duration = options.duration != null ? options.duration : 1600;
    var onDone = options.onDone;
    var getActive = options.getActive || function () {
      return true;
    };

    if (prefersReducedMotion()) {
      setCountText(el, target);
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
      var value = target * easeOutCubic(t);
      setCountText(el, value);
      if (t < 1) {
        rafId = global.requestAnimationFrame(frame);
      } else {
        setCountText(el, target);
        if (onDone) onDone();
      }
    }

    setCountText(el, 0);
    rafId = global.requestAnimationFrame(frame);

    return {
      cancel: function () {
        cancelled = true;
        if (rafId) global.cancelAnimationFrame(rafId);
        setCountText(el, target);
      },
    };
  }

  function stagger(items, delayMs, apply, onDone) {
    var i = 0;
    var timers = [];
    var cancelled = false;

    function next() {
      if (cancelled) return;
      if (i >= items.length) {
        if (onDone) onDone();
        return;
      }
      apply(items[i], i);
      i += 1;
      if (i < items.length) {
        // Single short delay between discrete UI beats — not fake crawl progress.
        var id = global.setTimeout(next, delayMs);
        timers.push(id);
      } else if (onDone) {
        onDone();
      }
    }

    if (!items.length) {
      if (onDone) onDone();
      return {
        cancel: function () {
          cancelled = true;
        },
      };
    }

    next();
    return {
      cancel: function () {
        cancelled = true;
        timers.forEach(function (id) {
          global.clearTimeout(id);
        });
      },
    };
  }

  function observeOnce(el, callback, options) {
    if (!el || typeof IntersectionObserver === "undefined") {
      callback(el);
      return { disconnect: function () {} };
    }
    options = options || {};
    var threshold = options.threshold != null ? options.threshold : 0.28;
    var rootMargin = options.rootMargin || "0px 0px -8% 0px";
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
      { threshold: threshold, rootMargin: rootMargin }
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

  function sortByOrder(els, attr, order) {
    var map = {};
    order.forEach(function (key, idx) {
      map[String(key).toLowerCase()] = idx;
    });
    return els.slice().sort(function (a, b) {
      var ka = String(a.getAttribute(attr) || "").toLowerCase();
      var kb = String(b.getAttribute(attr) || "").toLowerCase();
      var ia = map.hasOwnProperty(ka) ? map[ka] : 999;
      var ib = map.hasOwnProperty(kb) ? map[kb] : 999;
      if (ia !== ib) return ia - ib;
      return 0;
    });
  }

  /* ── 1. Hero dashboard ────────────────────────────────────────────────── */

  function initHeroDashboard(root) {
    var host = qs(root, '[data-anim="hero-dashboard"]');
    if (!host) return;

    var metrics = qsa(host, "[data-metric]");
    if (!metrics.length) return;

    // Prefer semantic ids if Visual sets data-metric="seoHealth" etc.
    var ordered = sortByOrder(metrics, "data-metric", HERO_ORDER);
    // If attributes are empty / generic, keep DOM order (Visual: SEO Health → GEO Health → SEO Growth → GEO Growth)
    var useDomOrder = ordered.every(function (el) {
      var v = el.getAttribute("data-metric");
      return !v || v === "" || v === "true" || !isNaN(Number(v));
    });
    if (useDomOrder) ordered = metrics;

    function showAll() {
      ordered.forEach(function (el) {
        addClass(el, "hv2a-on");
      });
      addClass(host, "hv2a-in");
      addClass(host, "hv2a-done");
    }

    if (prefersReducedMotion()) {
      showAll();
      return;
    }

    observeOnce(host, function () {
      addClass(host, "hv2a-in");
      stagger(
        ordered,
        220,
        function (el) {
          addClass(el, "hv2a-on");
        },
        function () {
          addClass(host, "hv2a-done");
        }
      );
    });
  }

  /* ── 2. Audit crawl ───────────────────────────────────────────────────── */

  function initAuditCrawl(root) {
    var host = qs(root, '[data-anim="audit-crawl"]');
    if (!host) return;

    var steps = qsa(host, "[data-step]");
    var counts = qsa(host, "[data-count]");
    var controllers = [];
    var visible = false;

    function finalize() {
      steps.forEach(function (s) {
        removeClass(s, "hv2a-active");
        addClass(s, "hv2a-done");
      });
      counts.forEach(function (c) {
        setCountText(c, parseTarget(c, "data-count"));
      });
      removeClass(host, "hv2a-scanning");
      addClass(host, "hv2a-done");
    }

    if (prefersReducedMotion()) {
      finalize();
      return;
    }

    observeVisibility(host, function (isVisible) {
      visible = isVisible;
      if (!isVisible) {
        removeClass(host, "hv2a-scanning");
      }
    });

    observeOnce(host, function () {
      addClass(host, "hv2a-in");
      addClass(host, "hv2a-scanning");

      // Steps complete in sequence while primary counts run on rAF.
      if (steps.length) {
        stagger(
          steps,
          380,
          function (step, idx) {
            steps.forEach(function (s) {
              removeClass(s, "hv2a-active");
            });
            addClass(step, "hv2a-active");
            if (idx > 0) addClass(steps[idx - 1], "hv2a-done");
          },
          function () {
            steps.forEach(function (s) {
              removeClass(s, "hv2a-active");
              addClass(s, "hv2a-done");
            });
          }
        );
      }

      var pending = counts.length;
      if (!pending) {
        removeClass(host, "hv2a-scanning");
        addClass(host, "hv2a-done");
        return;
      }

      counts.forEach(function (el, idx) {
        // Longer duration for larger crawl totals (e.g. 128 pages).
        var target = parseTarget(el, "data-count");
        var duration = Math.min(2200, Math.max(900, 700 + target * 6));
        var ctrl = animateCount(el, {
          duration: duration,
          getActive: function () {
            return visible;
          },
          onDone: function () {
            pending -= 1;
            if (pending <= 0) {
              removeClass(host, "hv2a-scanning");
              addClass(host, "hv2a-done");
            }
          },
        });
        controllers.push(ctrl);
        // Stagger start of secondary counters slightly (one frame delay only).
        if (idx > 0) {
          /* already started via rAF independently — OK */
        }
      });
    });
  }

  /* ── 3. Coverage + health-growth bars ─────────────────────────────────── */

  function initBarsAndCounts(host) {
    if (!host) return;

    var bars = qsa(host, "[data-bar]");
    var counts = qsa(host, "[data-count]");
    var visible = true;
    var started = false;

    bars.forEach(function (bar) {
      var target = parseTarget(bar, "data-bar");
      bar.style.setProperty("--hv2a-bar-target", String(target));
    });

    function showFinal() {
      bars.forEach(function (bar) {
        var target = parseTarget(bar, "data-bar");
        bar.style.setProperty("--hv2a-bar-target", String(target));
        addClass(bar, "hv2a-fill");
      });
      counts.forEach(function (c) {
        setCountText(c, parseTarget(c, "data-count"));
      });
      addClass(host, "hv2a-in");
      addClass(host, "hv2a-done");
    }

    if (prefersReducedMotion()) {
      showFinal();
      return;
    }

    observeVisibility(host, function (isVisible) {
      visible = isVisible;
    });

    observeOnce(host, function () {
      if (started) return;
      started = true;
      addClass(host, "hv2a-in");

      // Force layout then fill — CSS transition handles bar growth.
      global.requestAnimationFrame(function () {
        bars.forEach(function (bar) {
          addClass(bar, "hv2a-fill");
        });
      });

      var pending = counts.length;
      if (!pending) {
        addClass(host, "hv2a-done");
        return;
      }

      counts.forEach(function (el) {
        var target = parseTarget(el, "data-count");
        var duration = Math.min(1400, Math.max(700, 500 + target * 8));
        animateCount(el, {
          duration: duration,
          getActive: function () {
            return visible;
          },
          onDone: function () {
            pending -= 1;
            if (pending <= 0) addClass(host, "hv2a-done");
          },
        });
      });
    });
  }

  function initCoverage(root) {
    initBarsAndCounts(qs(root, '[data-anim="coverage"]'));
  }

  function initHealthGrowth(root) {
    initBarsAndCounts(qs(root, '[data-anim="health-growth"]'));
  }

  /* ── 4. Question matching ─────────────────────────────────────────────── */

  function initQuestionMatch(root) {
    var host = qs(root, '[data-anim="question-match"]');
    if (!host) return;

    var tags = sortByOrder(qsa(host, "[data-tag]"), "data-tag", TAG_ORDER);
    // Fallback DOM order if Visual uses bare data-tag without values matching order.
    if (
      tags.every(function (el) {
        var v = (el.getAttribute("data-tag") || "").toLowerCase();
        return TAG_ORDER.indexOf(v) === -1;
      })
    ) {
      tags = qsa(host, "[data-tag]");
    }

    function showAll() {
      addClass(host, "hv2a-in");
      addClass(host, "hv2a-question-in");
      tags.forEach(function (t) {
        addClass(t, "hv2a-match");
      });
      addClass(host, "hv2a-done");
    }

    if (prefersReducedMotion()) {
      showAll();
      return;
    }

    observeOnce(host, function () {
      addClass(host, "hv2a-in");
      addClass(host, "hv2a-question-in");
      // Question settles first; then tags light up in analysis order.
      global.setTimeout(function () {
        stagger(
          tags,
          280,
          function (tag) {
            addClass(tag, "hv2a-match");
          },
          function () {
            addClass(host, "hv2a-done");
          }
        );
      }, 180);
    });
  }

  function initQuestionWall(root) {
    var host = qs(root, '[data-anim="question-wall"]');
    if (!host) return;

    var items = qsa(host, "[data-question]");
    if (!items.length) return;

    function showAll() {
      addClass(host, "hv2a-in");
      items.forEach(function (el) {
        addClass(el, "hv2a-on");
      });
      addClass(host, "hv2a-done");
    }

    if (prefersReducedMotion()) {
      showAll();
      return;
    }

    observeOnce(host, function () {
      addClass(host, "hv2a-in");
      stagger(
        items,
        70,
        function (el) {
          addClass(el, "hv2a-on");
        },
        function () {
          addClass(host, "hv2a-done");
        }
      );
    }, { threshold: 0.15 });
  }

  /* ── 5. Blueprint generation ──────────────────────────────────────────── */

  function initBlueprint(root) {
    var host = qs(root, '[data-anim="blueprint"]');
    if (!host) return;

    var phases = sortByOrder(qsa(host, "[data-phase]"), "data-phase", PHASE_ORDER);
    if (!phases.length) phases = qsa(host, "[data-phase]");

    function showAll() {
      phases.forEach(function (p) {
        addClass(p, "hv2a-expand");
        if ((p.getAttribute("data-phase") || "").toLowerCase() === "blueprint") {
          addClass(p, "hv2a-ready-phase");
        }
      });
      addClass(host, "hv2a-in");
      addClass(host, "hv2a-blueprint-ready");
      addClass(host, "hv2a-done");
    }

    if (prefersReducedMotion()) {
      showAll();
      return;
    }

    // Each phase expands when it enters the viewport (scroll storytelling).
    var completed = 0;
    phases.forEach(function (phase, idx) {
      observeOnce(
        phase,
        function () {
          addClass(host, "hv2a-in");
          addClass(phase, "hv2a-expand");
          completed += 1;
          var name = (phase.getAttribute("data-phase") || "").toLowerCase();
          if (name === "blueprint" || idx === phases.length - 1) {
            addClass(phase, "hv2a-ready-phase");
            addClass(host, "hv2a-blueprint-ready");
          }
          if (completed >= phases.length) {
            addClass(host, "hv2a-done");
          }
        },
        { threshold: 0.35 }
      );
    });
  }

  /* ── 6. Entity graph ──────────────────────────────────────────────────── */

  function initEntityGraph(root) {
    var host = qs(root, '[data-anim="entity-graph"]');
    if (!host) return;

    var nodes = qsa(host, "[data-node]");
    var edges = qsa(host, "[data-edge], .hv2a-edge");

    function showAll() {
      addClass(host, "hv2a-in");
      nodes.forEach(function (n) {
        addClass(n, "hv2a-linked");
      });
      edges.forEach(function (e) {
        addClass(e, "hv2a-linked");
      });
      addClass(host, "hv2a-done");
    }

    if (prefersReducedMotion()) {
      showAll();
      return;
    }

    observeOnce(host, function () {
      addClass(host, "hv2a-in");
      addClass(host, "hv2a-connecting");
      var sequence = [];
      var maxLen = Math.max(nodes.length, edges.length);
      var i;
      for (i = 0; i < maxLen; i += 1) {
        if (nodes[i]) sequence.push({ type: "node", el: nodes[i] });
        if (edges[i]) sequence.push({ type: "edge", el: edges[i] });
      }
      if (!sequence.length) {
        nodes.forEach(function (n) {
          sequence.push({ type: "node", el: n });
        });
      }

      stagger(
        sequence,
        160,
        function (item) {
          addClass(item.el, "hv2a-linked");
        },
        function () {
          removeClass(host, "hv2a-connecting");
          addClass(host, "hv2a-done");
        }
      );
    });
  }

  /* ── 7. Language sync ─────────────────────────────────────────────────── */

  function initLanguageSync(root) {
    var host = qs(root, '[data-anim="language-sync"]');
    if (!host) return;

    var langs = qsa(host, "[data-lang]");
    if (!langs.length) return;

    function showAll() {
      addClass(host, "hv2a-in");
      langs.forEach(function (l) {
        addClass(l, "hv2a-sync");
      });
      addClass(host, "hv2a-done");
    }

    if (prefersReducedMotion()) {
      showAll();
      return;
    }

    observeOnce(host, function () {
      addClass(host, "hv2a-in");
      stagger(
        langs,
        200,
        function (el) {
          addClass(el, "hv2a-sync");
        },
        function () {
          addClass(host, "hv2a-done");
        }
      );
    });
  }

  /* ── 8. Continuous loop ───────────────────────────────────────────────── */

  function initLoop(root) {
    var host = qs(root, '[data-anim="loop"]');
    if (!host) return;

    var steps = sortByOrder(qsa(host, "[data-loop-step]"), "data-loop-step", LOOP_ORDER);
    if (
      !steps.length ||
      steps.every(function (el) {
        var v = (el.getAttribute("data-loop-step") || "").toLowerCase();
        return LOOP_ORDER.indexOf(v) === -1;
      })
    ) {
      steps = qsa(host, "[data-loop-step]");
    }
    if (!steps.length) return;

    var index = 0;
    var rafId = 0;
    var lastTs = 0;
    var STEP_MS = 1400;
    var running = false;

    function paint(activeIndex) {
      steps.forEach(function (el, i) {
        if (i === activeIndex) addClass(el, "hv2a-loop-active");
        else removeClass(el, "hv2a-loop-active");
      });
    }

    function showStatic() {
      // Reduced motion: show full cycle state — all readable, first step marked.
      steps.forEach(function (el) {
        addClass(el, "hv2a-loop-active");
      });
      addClass(host, "hv2a-in");
      addClass(host, "hv2a-paused");
      addClass(host, "hv2a-done");
    }

    if (prefersReducedMotion()) {
      showStatic();
      return;
    }

    function tick(now) {
      if (!running) return;
      if (!lastTs) lastTs = now;
      if (now - lastTs >= STEP_MS) {
        lastTs = now;
        index = (index + 1) % steps.length;
        paint(index);
      }
      rafId = global.requestAnimationFrame(tick);
    }

    function start() {
      if (running) return;
      running = true;
      removeClass(host, "hv2a-paused");
      addClass(host, "hv2a-in");
      paint(index);
      lastTs = 0;
      rafId = global.requestAnimationFrame(tick);
    }

    function stop() {
      running = false;
      addClass(host, "hv2a-paused");
      if (rafId) {
        global.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    observeVisibility(
      host,
      function (isVisible) {
        if (isVisible) start();
        else stop();
      },
      { threshold: 0.25 }
    );
  }

  /* ── Boot ─────────────────────────────────────────────────────────────── */

  function init(root) {
    root = root || global.document;
    if (!root) return;

    try {
      addClass(root.documentElement || qs(global.document, "html"), "hv2a-ready");
    } catch (_) {
      /* ignore */
    }

    try {
      initHeroDashboard(root);
      initAuditCrawl(root);
      initHealthGrowth(root);
      initCoverage(root);
      initQuestionMatch(root);
      initQuestionWall(root);
      initBlueprint(root);
      initEntityGraph(root);
      initLanguageSync(root);
      initLoop(root);
    } catch (_) {
      /* Missing DOM / partial markup must never throw. */
    }
  }

  var api = {
    init: init,
    version: "2.0.0",
  };

  global.MikaHomeAnimations = api;

  function autoInit() {
    init(global.document);
  }

  if (global.document) {
    if (global.document.readyState === "loading") {
      global.document.addEventListener("DOMContentLoaded", autoInit, { once: true });
    } else {
      // Script at end of body — DOM already available.
      autoInit();
    }
  }
})(typeof window !== "undefined" ? window : this);
