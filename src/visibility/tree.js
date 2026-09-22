/**
 * Visibility Index Tree. Decorative SVG behind the hero copy.
 * window.MikaVisibilityTree.init()
 */
(function (global) {
  "use strict";

  var COPY = {
    en: {
      root: "WEBSITE",
      search: ["Pages", "Structure", "Topics", "Intent", "Search visibility"],
      answer: ["Questions", "Entities", "Evidence", "Answers", "Answer visibility"]
    },
    zh: {
      root: "网站",
      search: ["页面", "结构", "主题", "意图", "搜索可见性"],
      answer: ["问题", "实体", "证据", "答案", "答案可见性"]
    }
  };

  function reduced() {
    return global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function langOf(el) {
    var raw = (el.getAttribute("data-lang") || global.document.documentElement.lang || "en").toLowerCase();
    return raw.indexOf("zh") === 0 ? "zh" : "en";
  }

  function svgEl(name, attrs) {
    var node = global.document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.keys(attrs).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function layout(copy, compact) {
    var root = { id: "root", x: 600, y: compact ? 520 : 575, label: copy.root, kind: "root" };
    var searchLabels = compact ? [copy.search[0], copy.search[1], copy.search[4]] : copy.search;
    var answerLabels = compact ? [copy.answer[0], copy.answer[2], copy.answer[4]] : copy.answer;
    var searchPos = compact
      ? [[250, 430], [140, 250], [280, 70]]
      : [[250, 500], [145, 360], [130, 210], [220, 120], [390, 150]];
    var answerPos = compact
      ? [[950, 430], [1060, 250], [920, 70]]
      : [[950, 500], [1055, 360], [1070, 210], [980, 120], [810, 150]];
    var search = searchLabels.map(function (label, i) {
      return { id: "s" + i, x: searchPos[i][0], y: searchPos[i][1], label: label, kind: "search" };
    });
    var answer = answerLabels.map(function (label, i) {
      return { id: "a" + i, x: answerPos[i][0], y: answerPos[i][1], label: label, kind: "answer" };
    });
    var edges = [];
    search.forEach(function (node, i) {
      var from = i === 0 ? root : search[i - 1];
      edges.push({ from: from, to: node, kind: "search" });
    });
    answer.forEach(function (node, i) {
      var from = i === 0 ? root : answer[i - 1];
      edges.push({ from: from, to: node, kind: "answer" });
    });
    return { root: root, nodes: [root].concat(search, answer), edges: edges };
  }

  function draw(host, model) {
    var svg = svgEl("svg", {
      viewBox: "0 0 1200 640",
      preserveAspectRatio: "xMidYMid slice",
      "aria-hidden": "true",
      focusable: "false"
    });
    var defs = svgEl("defs", {});
    var pattern = svgEl("pattern", { id: "vit-grid", width: "48", height: "48", patternUnits: "userSpaceOnUse" });
    pattern.appendChild(svgEl("path", {
      d: "M48 0H0V48",
      fill: "none",
      stroke: "rgba(148,163,184,0.16)",
      "stroke-width": "1"
    }));
    defs.appendChild(pattern);
    svg.appendChild(defs);
    svg.appendChild(svgEl("rect", { width: "1200", height: "640", fill: "url(#vit-grid)" }));

    var edgeNodes = [];
    model.edges.forEach(function (edge) {
      var path = svgEl("path", {
        class: "vit-edge is-" + edge.kind,
        d: "M" + edge.from.x + " " + edge.from.y + " L" + edge.to.x + " " + edge.to.y,
        "data-from": edge.from.id,
        "data-to": edge.to.id
      });
      svg.appendChild(path);
      edgeNodes.push(path);
    });

    var nodeEls = [];
    model.nodes.forEach(function (node) {
      var g = svgEl("g", {
        class: "vit-node is-" + node.kind + (node.kind === "root" ? " is-hot" : " is-pending"),
        "data-node-id": node.id
      });
      g.appendChild(svgEl("circle", { cx: node.x, cy: node.y, r: node.kind === "root" ? 7 : 4 }));
      var text = svgEl("text", {
        x: node.x,
        y: node.y - 12,
        "text-anchor": "middle"
      });
      text.textContent = node.label;
      g.appendChild(text);
      svg.appendChild(g);
      nodeEls.push(g);
    });

    var signal = svgEl("circle", { class: "vit-signal", r: "3", fill: "#22d3ee" });
    svg.appendChild(signal);
    host.appendChild(svg);
    return { svg: svg, edges: edgeNodes, nodes: nodeEls, signal: signal };
  }

  function showFinal(drawn) {
    drawn.edges.forEach(function (path) {
      path.style.opacity = "0.28";
    });
    drawn.nodes.forEach(function (node) {
      node.classList.remove("is-pending");
    });
    drawn.signal.setAttribute("opacity", "0");
  }

  function paintHot(drawn, path) {
    var from = path ? path.getAttribute("data-from") : "";
    var to = path ? path.getAttribute("data-to") : "";
    drawn.nodes.forEach(function (node) {
      var id = node.getAttribute("data-node-id");
      var hot = id === "root" || id === from || id === to;
      node.classList.toggle("is-hot", hot);
      if (hot) node.classList.remove("is-pending");
    });
  }

  function play(drawn) {
    var reduce = reduced();
    drawn.edges.forEach(function (path) {
      var len = 0;
      try { len = path.getTotalLength(); } catch (_) { len = 0; }
      if (!len || reduce) {
        path.style.opacity = "0.28";
        return;
      }
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
      path.style.opacity = "0.28";
    });
    if (reduce) {
      showFinal(drawn);
      return function () {};
    }

    var start = 0;
    var buildMs = 2200;
    var stopped = false;
    var raf = 0;

    function frame(now) {
      if (stopped) return;
      if (!start) start = now;
      var t = Math.min(1, (now - start) / buildMs);
      drawn.edges.forEach(function (path, index) {
        var len = 0;
        try { len = path.getTotalLength(); } catch (_) { len = 0; }
        var local = Math.min(1, Math.max(0, t * drawn.edges.length - index));
        path.style.strokeDashoffset = String(len * (1 - local));
        if (local > 0.9) {
          var born = drawn.nodes[index + 1];
          if (born) {
            born.classList.remove("is-pending");
            born.classList.add("is-hot");
          }
        }
      });
      if (t < 1) {
        raf = global.requestAnimationFrame(frame);
        return;
      }
      flow();
    }

    var flowStart = 0;
    function flow(now) {
      if (stopped) return;
      if (!flowStart) flowStart = now || 0;
      var elapsed = (now || 0) - flowStart;
      var edge = drawn.edges[Math.floor(elapsed / 1600) % drawn.edges.length];
      paintHot(drawn, edge);
      var len = 0;
      try { len = edge.getTotalLength(); } catch (_) { len = 0; }
      var p = len ? ((elapsed % 1600) / 1600) : 0;
      var pt = len ? edge.getPointAtLength(len * p) : { x: 0, y: 0 };
      drawn.signal.setAttribute("cx", pt.x);
      drawn.signal.setAttribute("cy", pt.y);
      drawn.signal.setAttribute("opacity", "0.9");
      drawn.signal.setAttribute("fill", edge.classList.contains("is-answer") ? "#8B5CF6" : "#38BDF8");
      raf = global.requestAnimationFrame(flow);
    }

    raf = global.requestAnimationFrame(frame);
    return function stop() {
      stopped = true;
      if (raf) global.cancelAnimationFrame(raf);
    };
  }

  function mount(host) {
    if (!host || host.getAttribute("data-vit-ready") === "1") return;
    host.setAttribute("data-vit-ready", "1");
    host.setAttribute("aria-hidden", "true");
    var compact = global.matchMedia && global.matchMedia("(max-width: 760px)").matches;
    var model = layout(COPY[langOf(host)], compact);
    var drawn = draw(host, model);
    var stop = function () {};
    var running = false;

    function start() {
      if (running) return;
      running = true;
      stop = play(drawn);
    }
    function halt() {
      if (!running) return;
      running = false;
      stop();
    }

    if (typeof global.IntersectionObserver === "undefined") {
      start();
      return;
    }
    var io = new global.IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) start();
        else halt();
      });
    }, { threshold: 0.2 });
    var section = host.closest("section") || host;
    io.observe(section);

    var ticking = false;
    function contract() {
      if (ticking) return;
      ticking = true;
      global.requestAnimationFrame(function () {
        ticking = false;
        if (reduced()) {
          host.style.transform = "";
          return;
        }
        var rect = section.getBoundingClientRect();
        var p = Math.min(1, Math.max(0, -rect.top / (rect.height || 1)));
        host.style.transform = "translate3d(0," + (-56 * p).toFixed(1) + "px,0) scale(" + (1 - 0.14 * p).toFixed(3) + ")";
      });
    }
    global.addEventListener("scroll", contract, { passive: true });
  }

  function init(root) {
    var scope = root || global.document;
    var nodes = scope.querySelectorAll("[data-visibility-tree]");
    Array.prototype.forEach.call(nodes, mount);
  }

  if (global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", function () { init(); });
  } else {
    init();
  }

  global.MikaVisibilityTree = { init: init };
})(window);
