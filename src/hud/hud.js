/**
 * Mika HUD — classic script.
 * Enhances .mika-hud shells and the desktop chapter rail.
 * Public: window.MikaHud.init(root?)
 */
(function (global) {
  "use strict";

  function qs(root, sel) {
    try {
      return root.querySelector(sel);
    } catch (_) {
      return null;
    }
  }

  function qsa(root, sel) {
    try {
      return Array.prototype.slice.call(root.querySelectorAll(sel));
    } catch (_) {
      return [];
    }
  }

  var ZH_SYSTEM = {
    visibility: "可见性",
    framework: "核心框架",
    "audit-engine": "深度审计",
    "health-growth": "健康与增长",
    blueprint: "优化蓝图",
    "seo-growth": "搜索机会",
    geo: "答案可见性",
    questions: "问题覆盖",
    entity: "实体与证据",
    multilingual: "多语言",
    methodology: "方法",
    faq: "常见问题",
    cta: "行动"
  };

  var ZH_STATUS = {
    online: "在线",
    ready: "就绪",
    scanning: "分析中",
    opportunity: "已发现机会",
    active: "进行中",
    verified: "已验证",
    warn: "注意"
  };

  function isZh() {
    var lang = (global.document.documentElement.lang || "").toLowerCase();
    return lang.indexOf("zh") === 0;
  }

  function systemLabel(el) {
    var raw = el.getAttribute("data-system") || "system";
    if (isZh()) return "系统 / " + (ZH_SYSTEM[raw] || raw);
    return "SYSTEM / " + raw;
  }

  function statusLabel(status) {
    if (isZh()) return "状态：" + (ZH_STATUS[status] || status);
    return "STATUS: " + status;
  }

  function ensureChrome(el) {
    if (!el || el.getAttribute("data-hud-ready") === "1") return;
    el.setAttribute("data-hud-ready", "1");

    if (!qs(el, ".mika-hud-corners")) {
      var corners = global.document.createElement("span");
      corners.className = "mika-hud-corners";
      corners.setAttribute("aria-hidden", "true");
      el.insertBefore(corners, el.firstChild);
    }

    if (!qs(el, ".mika-hud-scan")) {
      var scan = global.document.createElement("span");
      scan.className = "mika-hud-scan";
      scan.setAttribute("aria-hidden", "true");
      el.insertBefore(scan, el.firstChild);
    }

    if (!qs(el, ".mika-hud-bar")) {
      var bar = global.document.createElement("div");
      bar.className = "mika-hud-bar";
      bar.setAttribute("aria-hidden", "true");
      var status = el.getAttribute("data-status") || "ready";
      bar.innerHTML =
        '<span class="mika-hud-system">' +
        systemLabel(el) +
        '</span><span class="mika-hud-status">' +
        statusLabel(status) +
        "</span>";
      el.insertBefore(bar, el.firstChild);
    }
  }

  function setStatus(el, status) {
    if (!el) return;
    el.setAttribute("data-status", status);
    var label = qs(el, ".mika-hud-status");
    if (label) label.textContent = statusLabel(status);
    if (status === "active") el.classList.add("is-active");
    else el.classList.remove("is-active");
  }

  function activate(el) {
    setStatus(el, "active");
  }

  function deactivate(el) {
    var prev = el.getAttribute("data-status-default") || "ready";
    setStatus(el, prev);
  }

  function bindFaq(root) {
    qsa(root, ".hv2-faq-item.mika-hud, .mika-hud.hv2-faq-item").forEach(function (item) {
      if (!item.getAttribute("data-status-default")) {
        item.setAttribute("data-status-default", item.getAttribute("data-status") || "ready");
      }
      item.addEventListener("toggle", function () {
        if (item.open) activate(item);
        else deactivate(item);
      });
    });
  }

  var SECTION_MAP = [
    { id: "hero", key: "hero" },
    { id: "problem", key: "problem" },
    { id: "framework", key: "framework" },
    { id: "audit", key: "audit" },
    { id: "health-growth", key: "health-growth" },
    { id: "blueprint", key: "blueprint" },
    { id: "seo-growth", key: "seo-growth" },
    { id: "geo", key: "geo" },
    { id: "questions", key: "questions" },
    { id: "entity", key: "entity" },
    { id: "multilingual", key: "multilingual" },
    { id: "faq", key: "faq" },
    { id: "cta", key: "cta" }
  ];

  function initRail(root) {
    var rail = qs(root, ".mika-rail");
    if (!rail) return;
    var links = qsa(rail, "a[data-rail]");
    if (!links.length) return;

    function setCurrent(key) {
      links.forEach(function (a) {
        var on = a.getAttribute("data-rail") === key;
        a.classList.toggle("is-current", on);
        if (on) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }

    if (typeof IntersectionObserver === "undefined") {
      setCurrent("hero");
      return;
    }

    var best = { key: "hero", ratio: 0 };
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.id;
          var map = SECTION_MAP.filter(function (s) {
            return s.id === id;
          })[0];
          if (!map) return;
          if (entry.isIntersecting && entry.intersectionRatio >= best.ratio) {
            best = { key: map.key, ratio: entry.intersectionRatio };
            setCurrent(map.key);
          }
        });
        best.ratio = 0;
      },
      { threshold: [0.2, 0.35, 0.5], rootMargin: "-20% 0px -40% 0px" }
    );

    SECTION_MAP.forEach(function (s) {
      var el = qs(root, "#" + s.id);
      if (el) io.observe(el);
    });
  }

  function init(root) {
    root = root || global.document;
    if (!root) return;
    qsa(root, ".mika-hud").forEach(ensureChrome);
    bindFaq(root);
    initRail(root);
  }

  global.MikaHud = {
    init: init,
    ensureChrome: ensureChrome,
    setStatus: setStatus,
    activate: activate,
    deactivate: deactivate,
  };

  if (global.document && global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", function () {
      init(global.document);
    });
  } else if (global.document) {
    init(global.document);
  }
})(typeof window !== "undefined" ? window : this);
