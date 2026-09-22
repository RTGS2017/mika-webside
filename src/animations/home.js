/**
 * Mika Homepage — Command Center animations.
 * Uses only MikaMotion primitives: scan | signal | flow | build | expand
 * Public: window.MikaHomeAnimations.init(root?)
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

  function buildSections(root) {
    var mm = M();
    if (!mm || !mm.build) return;
    mm.qsa(root, ".mika-hud[data-motion-build], section.mika-hud").forEach(function (el) {
      if (el.closest("#faq") && el.classList.contains("hv2-faq-item")) return;
      mm.build(el);
    });
  }

  /* Hero: grid + flow + scroll converge */
  function initHero(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, "#hero");
    if (!host) return;
    var stage = mm.qs(host, ".hv2-vf-stage") || host;

    function finalState() {
      mm.addClass(host, "mm-grid-on");
      mm.addClass(host, "mm-final");
      mm.addClass(stage, "mm-converged");
      mm.addClass(stage, "mm-final");
      mm.qsa(host, ".hv2-chip").forEach(function (c) {
        mm.addClass(c, "mm-on");
      });
    }

    if (reduced()) {
      finalState();
      return;
    }

    global.requestAnimationFrame(function () {
      mm.addClass(host, "mm-grid-on");
    });

    if (mm.flow) {
      mm.flow(stage, {
        threshold: 0.15,
        paths: mm.qsa(stage, ".mm-flow-path"),
        nodes: mm.qsa(stage, ".mm-node"),
      });
    }

    var chips = mm.qsa(host, ".hv2-chip");
    mm.Scroll.once(host, function () {
      if (mm.expand) {
        mm.expand(host, { nodes: chips, threshold: 0.1 });
      } else {
        chips.forEach(function (c) {
          mm.addClass(c, "mm-on");
        });
      }
    }, { threshold: 0.12 });

    mm.Scroll.progress(host, function (t) {
      if (t > 0.4) mm.addClass(stage, "mm-converged");
      else mm.removeClass(stage, "mm-converged");
      host.style.setProperty("--mm-hero-t", String(t));
    });
  }

  /* Deep Audit: sequential engine counts */
  function initAudit(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, "#audit");
    if (!host) return;

    var engineOrder = ["pages", "links", "topics", "entities", "questions", "evidence"];
    var engineEls = engineOrder
      .map(function (key) {
        return mm.qs(host, '[data-engine="' + key + '"] [data-count], [data-count][data-engine="' + key + '"]');
      })
      .filter(Boolean);

    // Fallback: first 6 data-count in known labels if markup lacks data-engine
    if (!engineEls.length) {
      var all = mm.qsa(host, ".hv2-stat [data-count]");
      engineEls = all.slice(0, 6);
    }

    var otherCounts = mm.qsa(host, ".hv2-stat [data-count]").filter(function (el) {
      return engineEls.indexOf(el) === -1;
    });

    function finalize() {
      mm.qsa(host, "[data-count]").forEach(function (c) {
        mm.Product.setText(c, mm.Product.parseNum(c, "data-count"));
      });
      mm.qsa(host, ".hv2-audit-step").forEach(function (s) {
        mm.addClass(s, "mm-on");
      });
      mm.addClass(host, "mm-audit-done");
      mm.addClass(host, "mm-final");
    }

    if (reduced()) {
      finalize();
      return;
    }

    if (mm.scan) mm.scan(host, { duration: 2200 });

    mm.Scroll.once(host, function () {
      var steps = mm.qsa(host, ".hv2-audit-step");
      mm.Product.stagger(steps, mobile() ? 120 : 200, function (step) {
        mm.addClass(step, "mm-on");
        mm.addClass(step, "mm-active");
      });

      if (mm.countSequence) {
        mm.countSequence(engineEls, {
          host: host,
          duration: mobile() ? 700 : 950,
          onDone: function () {
            otherCounts.forEach(function (el) {
              mm.Product.count(el, { duration: 600 });
            });
            mm.addClass(host, "mm-audit-done");
          },
        });
      } else {
        finalize();
      }
    });
  }

  /* Health: ring scan + growth expand */
  function initHealthGrowth(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, "#health-growth");
    if (!host) return;
    var health = mm.qs(host, ".is-health");
    var growth = mm.qs(host, ".is-growth");

    function showFinal() {
      mm.Product.fillBars(host);
      mm.qsa(host, "[data-count]").forEach(function (c) {
        mm.Product.setText(c, mm.Product.parseNum(c, "data-count"));
      });
      mm.qsa(host, "[data-scan-ring]").forEach(function (r) {
        r.style.setProperty("--mm-scan", String(mm.Product.parseNum(r, "data-scan-ring")));
        mm.addClass(r, "mm-scan-on");
      });
      mm.addClass(host, "mm-final");
    }

    if (reduced()) {
      showFinal();
      return;
    }

    if (health && mm.scan) mm.scan(health, { duration: 1600 });
    if (growth && mm.expand) {
      mm.expand(growth, {
        nodes: mm.qsa(growth, ".hv2-bar-row, .hv2-hg-score"),
      });
    }

    mm.Scroll.once(host, function () {
      mm.Product.fillBars(host);
      var visible = true;
      mm.Scroll.whileVisible(host, function (v) {
        visible = v;
      });
      mm.qsa(host, "[data-count]").forEach(function (el) {
        mm.Product.count(el, {
          duration: 1000,
          getActive: function () {
            return visible;
          },
        });
      });
    });
  }

  /* Blueprint: build + pipe states already in markup */
  function initBlueprint(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, "#blueprint");
    if (!host) return;
    var issues = mm.qsa(host, ".mm-bp-issue");
    var action = mm.qs(host, ".hv2-action");

    if (reduced()) {
      issues.forEach(function (i) {
        mm.addClass(i, "mm-on");
      });
      if (action) mm.addClass(action, "mm-on");
      mm.addClass(host, "mm-final");
      return;
    }

    mm.Scroll.once(host, function () {
      if (mm.signal) {
        mm.signal(host, { nodes: issues, delay: 120 });
      }
      global.setTimeout(function () {
        if (action) mm.addClass(action, "mm-on");
      }, 500);
    });
  }

  /* SEO Growth: expand opportunity map */
  function initSeoGrowth(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, "#seo-growth");
    if (!host) return;
    var nodes = mm.qsa(host, ".mika-opp-node, .hv2-opp, [data-expand]");

    function showFinal() {
      mm.Product.fillBars(host);
      mm.qsa(host, "[data-count]").forEach(function (c) {
        mm.Product.setText(c, mm.Product.parseNum(c, "data-count"));
      });
      nodes.forEach(function (n) {
        mm.addClass(n, "mm-on");
        mm.addClass(n, "mm-expanded");
      });
      mm.addClass(host, "mm-final");
    }

    if (reduced()) {
      showFinal();
      return;
    }

    if (mm.expand) mm.expand(host, { nodes: nodes });

    mm.Scroll.once(host, function () {
      mm.Product.fillBars(host);
      mm.qsa(host, "[data-count]").forEach(function (el) {
        mm.Product.count(el, { duration: 900 });
      });
    });
  }

  /* GEO: violet signal chain */
  function initGeo(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, "#geo");
    if (!host) return;
    var steps = mm.qsa(host, ".mm-geo-step");
    if (mm.signal) {
      mm.signal(host, { nodes: steps, delay: mobile() ? 100 : 160 });
    } else if (reduced()) {
      steps.forEach(function (s) {
        mm.addClass(s, "mm-on");
      });
    }
  }

  /* Question wall: gray → bright → capture; pause off-screen */
  function initQuestions(root) {
    var mm = M();
    if (!mm) return;
    var wall = mm.qs(root, '[data-anim="question-wall"]') || mm.qs(root, ".hv2-wall");
    var match = mm.qs(root, '[data-anim="question-match"]');

    if (match && mm.signal) {
      mm.signal(match, {
        nodes: mm.qsa(match, "[data-tag]"),
        delay: 160,
      });
    }

    if (!wall) return;
    var items = mm.qsa(wall, "[data-question]");
    if (!items.length) return;

    if (mm.signal) {
      mm.signal(wall, {
        nodes: mobile() ? items.slice(0, 8) : items,
        delay: mobile() ? 90 : 130,
        capture: true,
      });
    } else if (reduced()) {
      items.forEach(function (el) {
        mm.addClass(el, "mm-on");
      });
    }

    // Coverage counts
    var host = mm.qs(root, "#questions");
    if (host) {
      mm.Scroll.once(host, function () {
        mm.Product.fillBars(host);
        mm.qsa(host, ".hv2-q-layout [data-count]").forEach(function (el) {
          mm.Product.count(el, { duration: 800 });
        });
      });
    }
  }

  /* Entity network: hover related nodes */
  function initEntity(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, "#entity");
    if (!host) return;
    var graph = mm.qs(host, ".hv2-graph");
    var nodes = mm.qsa(host, "[data-node]");

    if (mm.signal) mm.signal(graph || host, { nodes: nodes, delay: 100 });

    if (graph && !reduced()) {
      nodes.forEach(function (node) {
        node.addEventListener("mouseenter", function () {
          mm.addClass(graph, "is-dim");
          mm.addClass(node, "is-related");
          var rootNode = mm.qs(graph, ".hv2-node-root");
          if (rootNode) mm.addClass(rootNode, "is-related");
          if (node !== rootNode) {
            /* keep root related while hovering children */
          }
        });
        node.addEventListener("mouseleave", function () {
          mm.removeClass(graph, "is-dim");
          nodes.forEach(function (n) {
            mm.removeClass(n, "is-related");
          });
        });
      });
    }

    mm.Scroll.once(host, function () {
      mm.qsa(host, "[data-count]").forEach(function (el) {
        mm.Product.count(el, { duration: 900 });
      });
    });
  }

  /* Multilingual: signal from hub to languages */
  function initMulti(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, "#multilingual");
    if (!host) return;
    var langs = mm.qsa(host, "[data-lang]");
    if (mm.signal) mm.signal(host, { nodes: langs, delay: 110 });
    mm.Scroll.once(host, function () {
      var c = mm.qs(host, ".hv2-consistency [data-count]");
      if (c) mm.Product.count(c, { duration: 900 });
    });
  }

  /* CTA: signals converge */
  function initCta(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, "#cta");
    if (!host) return;
    var steps = mm.qsa(host, ".mm-cta-step");
    if (mm.signal) mm.signal(host, { nodes: steps, delay: 140 });
  }

  /* Framework cells via expand on growth + signal on health */
  function initFramework(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, "#framework");
    if (!host) return;
    var cells = mm.qsa(host, ".hv2-fw-cell");
    var growth = mm.qsa(host, "[data-growth]");
    var health = cells.filter(function (c) {
      return !c.hasAttribute("data-growth");
    });

    if (reduced()) {
      cells.forEach(function (c) {
        mm.addClass(c, "mm-on");
      });
      return;
    }

    if (mm.signal) mm.signal(host, { nodes: health, delay: 150 });
    if (mm.expand) mm.expand(host, { nodes: growth });
  }

  /* Problem */
  function initProblem(root) {
    var mm = M();
    if (!mm) return;
    var host = mm.qs(root, "#problem");
    if (!host) return;
    var cols = mm.qsa(host, ".hv2-problem-col");
    if (mm.signal) mm.signal(host, { nodes: cols, delay: 180 });
  }

  /* FAQ highlight via Interaction + Hud activate already bound */
  function initFaq(root) {
    var mm = M();
    if (!mm) return;
    if (mm.Interaction && mm.Interaction.faqHighlight) {
      mm.Interaction.faqHighlight(root);
    }
  }

  function init(root) {
    root = root || global.document;
    var mm = M();
    if (!mm) return;
    mm.init(root);

    buildSections(root);
    initHero(root);
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
    initFaq(root);
    initCta(root);
  }

  global.MikaHomeAnimations = { init: init };

  if (global.document && global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", function () {
      init(global.document);
    });
  } else if (global.document) {
    init(global.document);
  }
})(typeof window !== "undefined" ? window : this);
