/**
 * Mika Motion Primitives — only five product motions.
 * Extends window.MikaMotion (requires core.js first).
 * scan | signal | flow | build | expand
 */
(function (global) {
  "use strict";

  var mm = global.MikaMotion;
  if (!mm) {
    console.warn("[MikaMotion] primitives.js requires core.js");
    return;
  }

  function reduced() {
    return mm.prefersReducedMotion();
  }

  function mobile() {
    return mm.isMobile();
  }

  function pauseWhenHidden(host, ctrl) {
    if (!host || !ctrl) return;
    mm.Scroll.whileVisible(host, function (vis) {
      if (vis) {
        if (ctrl.resume) ctrl.resume();
      } else if (ctrl.pause) {
        ctrl.pause();
      }
    }, { threshold: 0.08 });
  }

  /* ── scan: thin scanline for audit & health ───────────────────────────── */

  function scan(host, options) {
    options = options || {};
    if (!host) return { destroy: function () {} };

    function finalState() {
      mm.addClass(host, "mm-scan-done");
      mm.addClass(host, "mm-final");
      var rings = mm.qsa(host, "[data-scan-ring]");
      rings.forEach(function (r) {
        var t = mm.Product.parseNum(r, "data-scan-ring") || 100;
        r.style.setProperty("--mm-scan", String(t));
        mm.addClass(r, "mm-scan-on");
      });
    }

    if (reduced()) {
      finalState();
      return { destroy: function () {} };
    }

    var active = false;
    var rafId = 0;
    var start = null;
    var duration = options.duration || 1800;

    function frame(now) {
      if (!active) return;
      if (start == null) start = now;
      var t = Math.min(1, (now - start) / duration);
      host.style.setProperty("--mm-scan-progress", String(t));
      mm.qsa(host, "[data-scan-ring]").forEach(function (r) {
        var target = mm.Product.parseNum(r, "data-scan-ring") || 100;
        r.style.setProperty("--mm-scan", String(target * t));
      });
      if (t < 1) {
        rafId = global.requestAnimationFrame(frame);
      } else {
        finalState();
      }
    }

    function startScan() {
      if (host.classList.contains("mm-scan-done")) return;
      active = true;
      mm.addClass(host, "mm-scanning");
      start = null;
      rafId = global.requestAnimationFrame(frame);
    }

    function pause() {
      active = false;
      if (rafId) {
        global.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      mm.removeClass(host, "mm-scanning");
    }

    function resume() {
      if (host.classList.contains("mm-scan-done")) return;
      if (!active) {
        active = true;
        mm.addClass(host, "mm-scanning");
        rafId = global.requestAnimationFrame(frame);
      }
    }

    mm.Scroll.once(host, startScan, { threshold: options.threshold || 0.25 });
    pauseWhenHidden(host, { pause: pause, resume: resume });

    return {
      pause: pause,
      resume: resume,
      destroy: function () {
        pause();
      },
    };
  }

  /* ── signal: node light-up for entity / evidence / questions ──────────── */

  function signal(host, options) {
    options = options || {};
    if (!host) return { destroy: function () {} };
    var nodes = options.nodes || mm.qsa(host, "[data-signal], [data-node], [data-question], .mm-signal-node");
    var delay = options.delay != null ? options.delay : mobile() ? 80 : 140;
    var capture = options.capture || false;
    var running = false;
    var timers = [];
    var rafId = 0;
    var idx = 0;

    function finalState() {
      nodes.forEach(function (n, i) {
        mm.addClass(n, "mm-signal-on");
        mm.addClass(n, "mm-on");
        if (capture) {
          var tone = i % 2 === 0 ? "seo" : "geo";
          mm.addClass(n, "mm-captured");
          mm.addClass(n, tone === "seo" ? "is-seo" : "is-geo");
        }
      });
      mm.addClass(host, "mm-signal-done");
      mm.addClass(host, "mm-final");
    }

    if (reduced()) {
      finalState();
      return { destroy: function () {} };
    }

    function lightOne(n, i) {
      mm.addClass(n, "mm-signal-on");
      mm.addClass(n, "mm-on");
      if (capture) {
        global.setTimeout(function () {
          mm.addClass(n, "mm-captured");
          mm.addClass(n, i % 2 === 0 ? "is-seo" : "is-geo");
        }, 220);
      }
    }

    function run() {
      if (running || host.classList.contains("mm-signal-done")) return;
      running = true;
      mm.addClass(host, "mm-signaling");
      idx = 0;

      function step() {
        if (!running) return;
        if (idx >= nodes.length) {
          mm.addClass(host, "mm-signal-done");
          running = false;
          return;
        }
        lightOne(nodes[idx], idx);
        idx += 1;
        timers.push(global.setTimeout(step, delay));
      }
      step();
    }

    function pause() {
      running = false;
      timers.forEach(function (id) {
        global.clearTimeout(id);
      });
      timers = [];
      if (rafId) {
        global.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    function resume() {
      if (host.classList.contains("mm-signal-done")) return;
      run();
    }

    mm.Scroll.once(host, run, { threshold: options.threshold || 0.2 });
    pauseWhenHidden(host, { pause: pause, resume: resume });

    return { pause: pause, resume: resume, destroy: pause };
  }

  /* ── flow: SVG path draw for search & GEO ─────────────────────────────── */

  function flow(host, options) {
    options = options || {};
    if (!host) return { destroy: function () {} };
    var paths = options.paths || mm.qsa(host, ".mm-flow-path, [data-flow-path]");
    var nodes = options.nodes || mm.qsa(host, ".mm-node, [data-flow-node]");

    function prep(p) {
      if (mobile() && p.hasAttribute("data-mobile-skip")) {
        p.style.display = "none";
        return null;
      }
      var len = 400;
      try {
        len = p.getTotalLength ? p.getTotalLength() : 400;
      } catch (_) {}
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
      return len;
    }

    function finalState() {
      paths.forEach(function (p) {
        if (p.style.display === "none") return;
        p.style.strokeDashoffset = "0";
        mm.addClass(p, "mm-drawn");
      });
      nodes.forEach(function (n) {
        mm.addClass(n, "mm-on");
      });
      mm.addClass(host, "mm-flow-done");
      mm.addClass(host, "mm-final");
    }

    if (reduced()) {
      finalState();
      return { destroy: function () {} };
    }

    paths.forEach(prep);
    mm.addClass(host, "mm-quiet");
    var active = false;
    var timers = [];

    function start() {
      if (host.classList.contains("mm-flow-done")) return;
      active = true;
      mm.removeClass(host, "mm-quiet");
      mm.addClass(host, "mm-flowing");
      paths.forEach(function (p, i) {
        if (p.style.display === "none") return;
        timers.push(
          global.setTimeout(function () {
            if (!active) return;
            mm.addClass(p, "mm-drawn");
            p.style.strokeDashoffset = "0";
          }, (mobile() ? 80 : 140) * i)
        );
      });
      var showNodes = mobile() ? nodes.slice(0, Math.min(6, nodes.length)) : nodes;
      mm.Product.stagger(showNodes, mobile() ? 80 : 120, function (n) {
        mm.addClass(n, "mm-on");
      }, function () {
        mm.addClass(host, "mm-flow-done");
      });
    }

    function pause() {
      active = false;
      timers.forEach(function (id) {
        global.clearTimeout(id);
      });
      timers = [];
    }

    function resume() {
      if (!host.classList.contains("mm-flow-done") && !host.classList.contains("mm-flowing")) {
        start();
      }
    }

    mm.Scroll.once(host, start, { threshold: options.threshold || 0.2 });
    pauseWhenHidden(host, { pause: pause, resume: resume });

    return { pause: pause, resume: resume, destroy: pause, finalState: finalState };
  }

  /* ── build: corners → edges → title → content ─────────────────────────── */

  function build(host, options) {
    options = options || {};
    if (!host) return { destroy: function () {} };

    function finalState() {
      mm.addClass(host, "mm-build-corners");
      mm.addClass(host, "mm-build-edges");
      mm.addClass(host, "mm-build-title");
      mm.addClass(host, "mm-build-content");
      mm.addClass(host, "mm-build-done");
      mm.addClass(host, "mm-final");
    }

    if (reduced()) {
      finalState();
      return { destroy: function () {} };
    }

    mm.addClass(host, "mm-build");
    var timers = [];

    function start() {
      if (host.classList.contains("mm-build-done")) return;
      mm.addClass(host, "mm-build-corners");
      timers.push(
        global.setTimeout(function () {
          mm.addClass(host, "mm-build-edges");
        }, 120)
      );
      timers.push(
        global.setTimeout(function () {
          mm.addClass(host, "mm-build-title");
        }, 260)
      );
      timers.push(
        global.setTimeout(function () {
          mm.addClass(host, "mm-build-content");
          mm.addClass(host, "mm-build-done");
        }, 420)
      );
    }

    mm.Scroll.once(host, start, { threshold: options.threshold || 0.18 });

    return {
      destroy: function () {
        timers.forEach(function (id) {
          global.clearTimeout(id);
        });
      },
    };
  }

  /* ── expand: nodes expand outward for growth ──────────────────────────── */

  function expand(host, options) {
    options = options || {};
    if (!host) return { destroy: function () {} };
    var nodes = options.nodes || mm.qsa(host, "[data-expand], .mm-expand-node, .hv2-opp");

    function finalState() {
      nodes.forEach(function (n) {
        mm.addClass(n, "mm-expanded");
        mm.addClass(n, "mm-on");
      });
      mm.addClass(host, "mm-expand-done");
      mm.addClass(host, "mm-final");
    }

    if (reduced()) {
      finalState();
      return { destroy: function () {} };
    }

    mm.addClass(host, "mm-expand-host");
    var running = false;
    var ctrl = null;

    function start() {
      if (host.classList.contains("mm-expand-done") || running) return;
      running = true;
      mm.addClass(host, "mm-expanding");
      ctrl = mm.Product.stagger(
        nodes,
        mobile() ? 90 : 140,
        function (n) {
          mm.addClass(n, "mm-expanded");
          mm.addClass(n, "mm-on");
        },
        function () {
          mm.addClass(host, "mm-expand-done");
          running = false;
        }
      );
    }

    function pause() {
      running = false;
      if (ctrl && ctrl.cancel) ctrl.cancel();
    }

    mm.Scroll.once(host, start, { threshold: options.threshold || 0.22 });
    pauseWhenHidden(host, {
      pause: pause,
      resume: function () {
        if (!host.classList.contains("mm-expand-done")) start();
      },
    });

    return { pause: pause, destroy: pause };
  }

  /* ── sequential count helper (Deep Audit engine) ──────────────────────── */

  function countSequence(els, options) {
    options = options || {};
    var visible = true;
    var host = options.host;
    var i = 0;
    var cancelled = false;

    function finalizeAll() {
      els.forEach(function (el) {
        mm.Product.setText(el, mm.Product.parseNum(el, "data-count"));
        mm.addClass(el, "mm-count-done");
      });
    }

    if (reduced()) {
      finalizeAll();
      if (options.onDone) options.onDone();
      return { cancel: function () {} };
    }

    if (host) {
      mm.Scroll.whileVisible(host, function (v) {
        visible = v;
      });
    }

    function next() {
      if (cancelled) return;
      if (i >= els.length) {
        if (options.onDone) options.onDone();
        return;
      }
      var el = els[i];
      i += 1;
      mm.addClass(el.closest ? el.closest(".hv2-stat") || el : el, "mm-engine-active");
      mm.Product.count(el, {
        duration: options.duration || 900,
        getActive: function () {
          return visible && !cancelled;
        },
        onDone: function () {
          var wrap = el.closest ? el.closest(".hv2-stat") : null;
          if (wrap) {
            mm.removeClass(wrap, "mm-engine-active");
            mm.addClass(wrap, "mm-engine-done");
          }
          mm.addClass(el, "mm-count-done");
          next();
        },
      });
    }

    next();
    return {
      cancel: function () {
        cancelled = true;
        finalizeAll();
      },
    };
  }

  mm.Primitives = {
    scan: scan,
    signal: signal,
    flow: flow,
    build: build,
    expand: expand,
    countSequence: countSequence,
  };

  /* Convenience aliases on MikaMotion root */
  mm.scan = scan;
  mm.signal = signal;
  mm.flow = flow;
  mm.build = build;
  mm.expand = expand;
  mm.countSequence = countSequence;
})(typeof window !== "undefined" ? window : this);
