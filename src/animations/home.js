/**
 * Mika Homepage motion — product signatures on MikaMotion.
 * Public: window.MikaHomeAnimations.init(root?)
 * Depends on: window.MikaMotion (src/motion/core.js)
 */
(function (global) {
  "use strict";

  function M() {
    return global.MikaMotion;
  }

  function reduced() {
    return M() ? M().prefersReducedMotion() : false;
  }

  function mobile() {
    return M() ? M().isMobile() : false;
  }

  /* ── 1. Hero Visibility Field ─────────────────────────────────────────── */

  function initVisibilityField(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, '[data-motion="visibility-field"]') || mm.qs(root, "#hero");
    if (!host) return;
    var stage = mm.qs(host, ".hv2-vf-stage") || host;
    var paths = mm.qsa(stage, ".mm-flow-path");
    var nodes = mm.qsa(stage, ".mm-node");
    var chips = mm.qsa(host, ".hv2-chip");

    function finalState() {
      mm.addClass(stage, "mm-final");
      mm.addClass(stage, "mm-converged");
      paths.forEach(function (p) {
        p.style.strokeDashoffset = "0";
        mm.addClass(p, "mm-drawn");
      });
      nodes.forEach(function (n) {
        mm.addClass(n, "mm-on");
      });
      chips.forEach(function (c) {
        mm.addClass(c, "mm-on");
        mm.addClass(c, "hv2a-on");
      });
    }

    if (reduced()) {
      finalState();
      return;
    }

    // Quiet start, then flows appear; scroll converges to center.
    mm.addClass(stage, "mm-quiet");
    paths.forEach(function (p) {
      var len = 0;
      try {
        len = p.getTotalLength ? p.getTotalLength() : 400;
      } catch (_) {
        len = 400;
      }
      if (mobile() && p.hasAttribute("data-mobile-skip")) {
        p.style.display = "none";
        return;
      }
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
    });

    var entered = false;
    mm.Scroll.once(stage, function () {
      entered = true;
      mm.removeClass(stage, "mm-quiet");
      mm.addClass(stage, "mm-flowing");
      // Draw paths once (not infinite spam).
      paths.forEach(function (p, i) {
        if (p.style.display === "none") return;
        global.setTimeout(function () {
          mm.addClass(p, "mm-drawn");
          p.style.strokeDashoffset = "0";
        }, mobile() ? 80 * i : 160 * i);
      });
      var showNodes = mobile() ? nodes.slice(0, Math.min(6, nodes.length)) : nodes;
      mm.Product.stagger(showNodes, mobile() ? 90 : 140, function (n) {
        mm.addClass(n, "mm-on");
      });
      mm.Product.stagger(chips, 180, function (c) {
        mm.addClass(c, "mm-on");
        mm.addClass(c, "hv2a-on");
      });
    }, { threshold: 0.2 });

    mm.Scroll.progress(host, function (t) {
      if (!entered) return;
      if (t > 0.45) {
        mm.addClass(stage, "mm-converged");
      }
    });

    mm.Ambient.bind(stage, {
      threshold: 0.08,
      onLeave: function () {
        /* pause ambient — paths stay drawn, no new animation */
      },
    });
  }

  /* ── 2. Problem: Healthy / Growing → Health ≠ Growth ──────────────────── */

  function initProblem(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, "#problem");
    if (!host) return;
    var healthy = mm.qs(host, ".is-healthy");
    var growing = mm.qs(host, ".is-growing");
    var neq = mm.qs(host, "[data-motion-neq]") || mm.qs(host, ".hv2-conclusion");

    function finalState() {
      mm.addClass(host, "mm-problem-done");
      if (healthy) mm.addClass(healthy, "mm-converge");
      if (growing) mm.addClass(growing, "mm-converge");
      if (neq) mm.addClass(neq, "mm-neq-on");
    }

    if (reduced()) {
      finalState();
      return;
    }

    mm.Scroll.once(host, function () {
      mm.addClass(host, "mm-problem-in");
      if (healthy) mm.addClass(healthy, "mm-converge");
      if (growing) mm.addClass(growing, "mm-converge");
      global.setTimeout(function () {
        if (neq) mm.addClass(neq, "mm-neq-on");
        mm.addClass(host, "mm-problem-done");
      }, 520);
    });
  }

  /* ── 3. Framework: axes → cells; Health circle / Growth lines ──────────── */

  function initFramework(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, "#framework");
    if (!host) return;
    var map = mm.qs(host, ".hv2-fw-map");
    var axes = mm.qsa(host, ".hv2-fw-colhead, .hv2-fw-rowhead, .mm-fw-axis");
    var cells = mm.qsa(host, ".hv2-fw-cell");

    function finalState() {
      mm.addClass(host, "mm-fw-done");
      axes.forEach(function (a) { mm.addClass(a, "mm-on"); });
      cells.forEach(function (c) { mm.addClass(c, "mm-on"); });
    }

    if (reduced()) {
      finalState();
      return;
    }

    mm.Scroll.once(map || host, function () {
      mm.addClass(host, "mm-fw-in");
      mm.Product.stagger(axes, 90, function (a) {
        mm.addClass(a, "mm-on");
      }, function () {
        mm.Product.stagger(cells, 160, function (c) {
          mm.addClass(c, "mm-on");
        }, function () {
          mm.addClass(host, "mm-fw-done");
        });
      });
    }, { threshold: 0.22 });
  }

  /* ── 4. Deep Audit pipeline ───────────────────────────────────────────── */

  function initAudit(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, '[data-anim="audit-crawl"]') || mm.qs(root, "#audit");
    if (!host) return;
    var steps = mm.qsa(host, ".mm-audit-pipe-step, .hv2-audit-step");
    var counts = mm.qsa(host, "[data-count]");
    var visible = false;

    function finalize() {
      steps.forEach(function (s) {
        mm.addClass(s, "mm-on");
        mm.addClass(s, "hv2a-done");
      });
      counts.forEach(function (c) {
        mm.Product.setText(c, mm.Product.parseNum(c, "data-count"));
      });
      mm.addClass(host, "mm-audit-done");
      mm.addClass(host, "hv2a-done");
    }

    if (reduced()) {
      finalize();
      return;
    }

    mm.Scroll.whileVisible(host, function (v) {
      visible = v;
      if (!v) mm.removeClass(host, "hv2a-scanning");
    });

    mm.Scroll.once(host, function () {
      mm.addClass(host, "mm-audit-in");
      mm.addClass(host, "hv2a-scanning");
      mm.Product.stagger(steps, mobile() ? 160 : 280, function (step, idx) {
        steps.forEach(function (s) { mm.removeClass(s, "mm-active"); });
        mm.addClass(step, "mm-active");
        mm.addClass(step, "mm-on");
        mm.addClass(step, "hv2a-active");
        if (idx > 0) {
          mm.addClass(steps[idx - 1], "hv2a-done");
        }
      }, function () {
        steps.forEach(function (s) {
          mm.removeClass(s, "mm-active");
          mm.removeClass(s, "hv2a-active");
          mm.addClass(s, "hv2a-done");
          mm.addClass(s, "mm-on");
        });
      });

      var pending = counts.length;
      if (!pending) {
        mm.removeClass(host, "hv2a-scanning");
        mm.addClass(host, "mm-audit-done");
        return;
      }
      counts.forEach(function (el) {
        var target = mm.Product.parseNum(el, "data-count");
        var duration = Math.min(2400, Math.max(1000, 800 + target * 5));
        mm.Product.count(el, {
          duration: duration,
          getActive: function () { return visible; },
          onDone: function () {
            pending -= 1;
            if (pending <= 0) {
              mm.removeClass(host, "hv2a-scanning");
              mm.addClass(host, "mm-audit-done");
              mm.addClass(host, "hv2a-done");
            }
          },
        });
      });
    });
  }

  /* ── 5. Health vs Growth ──────────────────────────────────────────────── */

  function initHealthGrowth(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, '[data-anim="health-growth"]') || mm.qs(root, "#health-growth");
    if (!host) return;
    var visible = true;

    function showFinal() {
      mm.Product.fillBars(host);
      mm.qsa(host, "[data-count]").forEach(function (c) {
        mm.Product.setText(c, mm.Product.parseNum(c, "data-count"));
      });
      mm.addClass(host, "mm-hg-done");
      mm.addClass(host, "hv2a-done");
      mm.addClass(host, "hv2a-in");
    }

    if (reduced()) {
      showFinal();
      return;
    }

    mm.Scroll.whileVisible(host, function (v) { visible = v; });
    mm.Scroll.once(host, function () {
      mm.addClass(host, "mm-hg-in");
      mm.addClass(host, "hv2a-in");
      global.requestAnimationFrame(function () {
        mm.Product.fillBars(host);
      });
      var counts = mm.qsa(host, "[data-count]");
      var pending = counts.length;
      counts.forEach(function (el) {
        var target = mm.Product.parseNum(el, "data-count");
        mm.Product.count(el, {
          duration: Math.min(1400, Math.max(700, 500 + target * 8)),
          getActive: function () { return visible; },
          onDone: function () {
            pending -= 1;
            if (pending <= 0) {
              mm.addClass(host, "mm-hg-done");
              mm.addClass(host, "hv2a-done");
            }
          },
        });
      });
    });
  }

  /* ── 6. Blueprint: issues → root cause → ranked actions → stop ────────── */

  function initBlueprint(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, '[data-anim="blueprint"]') || mm.qs(root, "#blueprint");
    if (!host) return;
    var issues = mm.qsa(host, ".mm-bp-issue");
    var rootCause = mm.qs(host, ".mm-bp-root");
    var action = mm.qs(host, ".hv2-action, .mm-bp-action");
    var phases = mm.qsa(host, "[data-phase]");

    function finalState() {
      issues.forEach(function (i) { mm.addClass(i, "mm-on"); });
      if (rootCause) mm.addClass(rootCause, "mm-on");
      if (action) mm.addClass(action, "mm-on");
      phases.forEach(function (p) {
        mm.addClass(p, "hv2a-expand");
        mm.addClass(p, "mm-on");
      });
      mm.addClass(host, "mm-bp-done");
      mm.addClass(host, "hv2a-blueprint-ready");
      mm.addClass(host, "hv2a-done");
    }

    if (reduced()) {
      finalState();
      return;
    }

    mm.Scroll.once(host, function () {
      mm.addClass(host, "mm-bp-in");
      mm.addClass(host, "hv2a-in");
      // Phase cards
      mm.Product.stagger(phases, 200, function (p) {
        mm.addClass(p, "hv2a-expand");
        mm.addClass(p, "mm-on");
      }, function () {
        // Issue cards merge → root → action (once, no number looping)
        if (issues.length) {
          mm.Product.stagger(issues, 120, function (i) {
            mm.addClass(i, "mm-on");
          }, function () {
            mm.addClass(host, "mm-bp-merge");
            if (rootCause) mm.addClass(rootCause, "mm-on");
            global.setTimeout(function () {
              if (action) mm.addClass(action, "mm-on");
              mm.addClass(host, "mm-bp-done");
              mm.addClass(host, "hv2a-blueprint-ready");
              mm.addClass(host, "hv2a-done");
            }, 400);
          });
        } else {
          if (action) mm.addClass(action, "mm-on");
          mm.addClass(host, "mm-bp-done");
          mm.addClass(host, "hv2a-blueprint-ready");
          mm.addClass(host, "hv2a-done");
        }
      });
    });
  }

  /* ── 7. SEO Growth: coverage + opportunity nodes ──────────────────────── */

  function initSeoGrowth(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, '[data-anim="coverage"]') || mm.qs(root, "#seo-growth");
    if (!host) return;
    var opps = mm.qsa(host, ".hv2-opp, .mm-opp-node");
    var visible = true;

    function showFinal() {
      mm.Product.fillBars(host);
      mm.qsa(host, "[data-count]").forEach(function (c) {
        mm.Product.setText(c, mm.Product.parseNum(c, "data-count"));
      });
      opps.forEach(function (o) { mm.addClass(o, "mm-on"); });
      mm.addClass(host, "mm-seo-done");
      mm.addClass(host, "hv2a-done");
      mm.addClass(host, "hv2a-in");
    }

    if (reduced()) {
      showFinal();
      return;
    }

    mm.Scroll.whileVisible(host, function (v) { visible = v; });
    mm.Scroll.once(host, function () {
      mm.addClass(host, "mm-seo-in");
      mm.addClass(host, "hv2a-in");
      global.requestAnimationFrame(function () {
        mm.Product.fillBars(host);
      });
      var counts = mm.qsa(host, ".hv2-coverage [data-count], .hv2-cov-meta [data-count]");
      counts.forEach(function (el) {
        mm.Product.count(el, {
          duration: 1100,
          getActive: function () { return visible; },
        });
      });
      // Opportunity nodes grow beside bars — not only number bounce
      mm.Product.stagger(opps, 160, function (o) {
        mm.addClass(o, "mm-on");
        var num = mm.qs(o, "[data-count]");
        if (num) {
          mm.Product.count(num, {
            duration: 900,
            getActive: function () { return visible; },
          });
        }
      }, function () {
        mm.addClass(host, "mm-seo-done");
        mm.addClass(host, "hv2a-done");
      });
    });
  }

  /* ── 8. GEO chain ─────────────────────────────────────────────────────── */

  function initGeo(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, "#geo");
    if (!host) return;
    var steps = mm.qsa(host, ".mm-geo-step");

    function finalState() {
      steps.forEach(function (s) { mm.addClass(s, "mm-on"); });
      mm.addClass(host, "mm-geo-done");
    }

    if (reduced()) {
      finalState();
      return;
    }

    mm.Scroll.once(host, function () {
      mm.addClass(host, "mm-geo-in");
      mm.Product.stagger(steps, mobile() ? 100 : 180, function (s) {
        mm.addClass(s, "mm-on");
      }, function () {
        mm.addClass(host, "mm-geo-done");
      });
    });
  }

  /* ── 9. Question wall + match ─────────────────────────────────────────── */

  function initQuestions(root) {
    var mm = M();
    if (!mm) return;
    var wall = mm.qs(root, '[data-anim="question-wall"]');
    var match = mm.qs(root, '[data-anim="question-match"]');
    var track = null;
    var rafId = 0;
    var offset = 0;
    var running = false;

    if (match) {
      var tags = mm.qsa(match, "[data-tag]");
      if (reduced()) {
        mm.addClass(match, "hv2a-in");
        tags.forEach(function (t) { mm.addClass(t, "hv2a-match"); });
        mm.addClass(match, "hv2a-done");
      } else {
        mm.Scroll.once(match, function () {
          mm.addClass(match, "hv2a-in");
          mm.addClass(match, "mm-match-in");
          // Center question connects Intent / Page / Answer
          var bridges = mm.qsa(match, ".mm-bridge");
          mm.Product.stagger(bridges.length ? bridges : tags, 200, function (el) {
            mm.addClass(el, "mm-on");
            mm.addClass(el, "hv2a-match");
          }, function () {
            mm.addClass(match, "hv2a-done");
          });
        });
      }
    }

    if (!wall) return;
    var items = mm.qsa(wall, "[data-question]");
    if (!items.length) return;

    if (reduced()) {
      mm.addClass(wall, "hv2a-in");
      items.forEach(function (el) { mm.addClass(el, "hv2a-on"); mm.addClass(el, "mm-on"); });
      mm.addClass(wall, "hv2a-done");
      return;
    }

    // Horizontal drift while visible; pause off-screen
    mm.addClass(wall, "mm-wall-track");
    function tick() {
      if (!running) return;
      offset -= mobile() ? 0.25 : 0.4;
      var width = wall.scrollWidth / 2;
      if (width > 0 && Math.abs(offset) > width) offset = 0;
      wall.style.transform = "translate3d(" + offset + "px,0,0)";
      rafId = global.requestAnimationFrame(tick);
    }

    function start() {
      if (running || reduced()) return;
      running = true;
      mm.addClass(wall, "hv2a-in");
      mm.addClass(wall, "mm-wall-moving");
      rafId = global.requestAnimationFrame(tick);
    }

    function stop() {
      running = false;
      mm.removeClass(wall, "mm-wall-moving");
      if (rafId) {
        global.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    // Duplicate items for seamless scroll only on desktop; mobile shows static grid
    if (!mobile() && items.length > 4) {
      var frag = global.document.createDocumentFragment();
      items.slice(0, Math.min(8, items.length)).forEach(function (el) {
        frag.appendChild(el.cloneNode(true));
      });
      wall.appendChild(frag);
    }

    items.forEach(function (el) {
      mm.addClass(el, "mm-on");
      mm.addClass(el, "hv2a-on");
    });

    if (mobile()) {
      mm.Scroll.once(wall, function () {
        mm.addClass(wall, "hv2a-in");
        mm.addClass(wall, "hv2a-done");
      }, { threshold: 0.12 });
    } else {
      mm.Scroll.whileVisible(wall, function (vis) {
        if (vis) start();
        else stop();
      }, { threshold: 0.1 });
    }
  }

  /* ── 10. Entity graph ─────────────────────────────────────────────────── */

  function initEntity(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, '[data-anim="entity-graph"]') || mm.qs(root, "#entity .hv2-graph");
    var section = mm.qs(root, "#entity");
    if (!host) return;
    var nodes = mm.qsa(host, "[data-node]");
    var metrics = section ? mm.qsa(section, ".hv2-entity-metric") : [];
    var visible = true;

    function finalState() {
      nodes.forEach(function (n) { mm.addClass(n, "hv2a-linked"); mm.addClass(n, "mm-on"); });
      metrics.forEach(function (m) { mm.addClass(m, "mm-on"); });
      if (section) {
        mm.qsa(section, "[data-count]").forEach(function (c) {
          mm.Product.setText(c, mm.Product.parseNum(c, "data-count"));
        });
      }
      mm.addClass(host, "hv2a-done");
    }

    if (reduced()) {
      finalState();
      return;
    }

    if (section) {
      mm.Scroll.whileVisible(section, function (v) { visible = v; });
    }

    mm.Scroll.once(host, function () {
      mm.addClass(host, "hv2a-in");
      mm.addClass(host, "hv2a-connecting");
      mm.Product.stagger(nodes, 150, function (n) {
        mm.addClass(n, "hv2a-linked");
        mm.addClass(n, "mm-on");
      }, function () {
        mm.removeClass(host, "hv2a-connecting");
        mm.Product.stagger(metrics, 120, function (m, idx) {
          mm.addClass(m, "mm-on");
          var num = mm.qs(m, "[data-count]");
          if (num) {
            mm.Product.count(num, {
              duration: 900,
              getActive: function () { return visible; },
            });
          }
        }, function () {
          mm.addClass(host, "hv2a-done");
        });
      });
    });
  }

  /* ── 11. Multilingual: entity → language cards → Consistency ──────────── */

  function initMulti(root) {
    var mm = M();
    if (!mm) return;
    var section = mm.qs(root, "#multilingual");
    if (!section) return;
    var host = mm.qs(section, '[data-anim="language-sync"]') || section;
    var langs = mm.qsa(section, "[data-lang]");
    var entity = mm.qs(section, ".mm-multi-entity");
    var consistency = mm.qs(section, ".hv2-consistency");
    var visible = true;

    function finalState() {
      if (entity) mm.addClass(entity, "mm-on");
      langs.forEach(function (l) { mm.addClass(l, "hv2a-sync"); mm.addClass(l, "mm-on"); });
      if (consistency) mm.addClass(consistency, "mm-on");
      var c = mm.qs(section, ".hv2-consistency [data-count]");
      if (c) mm.Product.setText(c, mm.Product.parseNum(c, "data-count"));
      mm.addClass(host, "hv2a-done");
    }

    if (reduced()) {
      finalState();
      return;
    }

    mm.Scroll.whileVisible(section, function (v) { visible = v; });
    mm.Scroll.once(section, function () {
      mm.addClass(host, "hv2a-in");
      if (entity) mm.addClass(entity, "mm-on");
      mm.Product.stagger(langs, 160, function (l) {
        mm.addClass(l, "hv2a-sync");
        mm.addClass(l, "mm-on");
      }, function () {
        if (consistency) {
          mm.addClass(consistency, "mm-on");
          var c = mm.qs(consistency, "[data-count]");
          if (c) {
            mm.Product.count(c, {
              duration: 1000,
              getActive: function () { return visible; },
            });
          }
        }
        mm.addClass(host, "hv2a-done");
      });
    });
  }

  /* ── 12. Methodology ring — one lap ───────────────────────────────────── */

  function initMethod(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, '[data-anim="loop"]') || mm.qs(root, "#methodology .hv2-loop");
    if (!host) return;
    var steps = mm.qsa(host, "[data-loop-step]");
    if (!steps.length) return;
    var ring = mm.qs(host, ".mm-method-ring") || host;
    var index = 0;
    var done = false;

    function paint(i) {
      steps.forEach(function (el, j) {
        if (j === i) mm.addClass(el, "hv2a-loop-active");
        else mm.removeClass(el, "hv2a-loop-active");
        if (j <= i) mm.addClass(el, "mm-passed");
      });
      ring.style.setProperty("--mm-ring", String((i + 1) / steps.length));
    }

    function finalState() {
      steps.forEach(function (el) {
        mm.addClass(el, "hv2a-loop-active");
        mm.addClass(el, "mm-passed");
      });
      ring.style.setProperty("--mm-ring", "1");
      mm.addClass(host, "mm-method-done");
      mm.addClass(host, "hv2a-done");
    }

    if (reduced()) {
      finalState();
      return;
    }

    mm.Scroll.once(host, function () {
      mm.addClass(host, "hv2a-in");
      paint(0);
      // One lap only — no permanent cycle spam
      function step() {
        if (done) return;
        index += 1;
        if (index >= steps.length) {
          done = true;
          paint(steps.length - 1);
          mm.addClass(host, "mm-method-done");
          mm.addClass(host, "hv2a-done");
          return;
        }
        paint(index);
        global.setTimeout(step, 700);
      }
      global.setTimeout(step, 700);
    }, { threshold: 0.3 });

    // Pause visual pulse when off-screen (class only; lap already one-shot)
    mm.Scroll.whileVisible(host, function (vis) {
      if (vis) mm.removeClass(host, "hv2a-paused");
      else mm.addClass(host, "hv2a-paused");
    });
  }

  /* ── 13. FAQ highlight ────────────────────────────────────────────────── */

  function initFaq(root) {
    var mm = M();
    if (!mm) return;
    var section = mm.qs(root, "#faq");
    if (!section) return;
    mm.Interaction.faqHighlight(section);
  }

  /* ── 14. CTA chain ────────────────────────────────────────────────────── */

  function initCta(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, "#cta");
    if (!host) return;
    var steps = mm.qsa(host, ".mm-cta-step");

    function finalState() {
      steps.forEach(function (s) { mm.addClass(s, "mm-on"); });
      mm.addClass(host, "mm-cta-done");
    }

    if (reduced()) {
      finalState();
      return;
    }

    mm.Scroll.once(host, function () {
      mm.addClass(host, "mm-cta-in");
      mm.Product.stagger(steps, 180, function (s) {
        mm.addClass(s, "mm-on");
      }, function () {
        mm.addClass(host, "mm-cta-done");
      });
    }, { threshold: 0.25 });
  }

  /* ── Boot ─────────────────────────────────────────────────────────────── */

  function init(root) {
    root = root || global.document;
    if (!root || !M()) return;
    try {
      M().init(root);
      initVisibilityField(root);
      initProblem(root);
      initFramework(root);
      initAudit(root);
      initHealthGrowth(root);
      initBlueprint(root);
      initSeoGrowth(root);
      initGeo(root);
      initQuestions(root);
      initEntity(root);
      initMulti(root);
      initMethod(root);
      initFaq(root);
      initCta(root);
    } catch (_) {
      /* Partial markup must never throw. */
    }
  }

  global.MikaHomeAnimations = {
    init: init,
    version: "3.0.0",
  };

  function autoInit() {
    // Wait a tick so MikaMotion is present if scripts are adjacent.
    if (!M()) {
      global.setTimeout(autoInit, 0);
      return;
    }
    init(global.document);
  }

  if (global.document) {
    if (global.document.readyState === "loading") {
      global.document.addEventListener("DOMContentLoaded", autoInit, { once: true });
    } else {
      autoInit();
    }
  }
})(typeof window !== "undefined" ? window : this);
