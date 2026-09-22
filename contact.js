(function () {
  var config = window.MIKA_CONTACT;
  if (!config) return;

  var zhUi = (document.documentElement.lang || "").toLowerCase().indexOf("zh") === 0;
  var ui = zhUi
    ? {
        touch: "联系我们",
        close: "关闭",
        copied: "已复制",
        copyPrefix: "复制 ",
        qr: "查看二维码"
      }
    : {
        touch: "Get in touch",
        close: "Close",
        copied: "Copied",
        copyPrefix: "Copy ",
        qr: "View QR Code"
      };
  if (zhUi) {
    config.email.label = "邮箱";
    config.email.action = "发送邮件";
    config.email.actionAria = "发送邮件";
    config.wechat.label = "微信";
    config.wechat.action = "复制微信号";
    config.wechat.actionAria = "复制微信号";
    config.whatsapp.action = "用 WhatsApp 联系";
    config.whatsapp.actionAria = "用 WhatsApp 联系";
  }

  var ORDER = ["whatsapp", "email", "wechat"];
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mobileQuery = window.matchMedia("(max-width: 760px)");
  var openKey = null;
  var lastTrigger = null;
  var closeTimer = 0;
  var copyTimers = new WeakMap();

  var ICONS = {
    whatsapp:
      '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3.2 14.7 4.1 12a5.8 5.8 0 1 1 2.1 2.1l-3 .6Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M6.7 8.1c.15.7.45 1.3.9 1.8.45.5 1 .85 1.7 1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    email:
      '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><rect x="2.2" y="4" width="13.6" height="10" rx="1.4" stroke="currentColor" stroke-width="1.4"/><path d="M3 5.2 9 9.6l6-4.4" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    wechat:
      '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 8.2a4.2 4.2 0 0 1 4.2-4.2c2.2 0 4 1.6 4.2 3.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M6.2 7.2h.01M9.2 7.2h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7.4 9.2h5.2A3.4 3.4 0 0 1 16 12.6c0 .7-.2 1.3-.6 1.8l.5 1.8-1.9-.6c-.5.2-1 .3-1.6.3-1.9 0-3.5-1.4-3.5-3.2 0-1.6 1.1-2.9 2.5-3.3" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M11.2 12.4h.01M13.4 12.4h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  };

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function track(name) {
    try {
      if (typeof window.gtag === "function") window.gtag("event", name);
      if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name });
    } catch (err) {
      /* Analytics must never break the contact UI. */
    }
  }

  function isMobile() {
    return mobileQuery.matches;
  }

  function safeWhatsappHref(href) {
    return /^https:\/\/wa\.me\/\d+$/.test(href) ? href : "";
  }

  function panelKey(source) {
    if (isMobile()) return "sheet";
    if (source === "header") return "header";
    if (source === "hero") return "hero";
    return "dock";
  }

  function panelEl(key) {
    if (key === "header") return document.getElementById("contact-popover-nav");
    if (key === "hero") return document.getElementById("contact-popover-hero");
    if (key === "dock") return document.getElementById("contact-popover-dock");
    if (key === "sheet") return document.getElementById("contact-sheet");
    return null;
  }

  function focusables(root) {
    return Array.prototype.filter.call(
      root.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      function (el) {
        return !el.closest("[hidden]");
      }
    );
  }

  function channelBlock(key, variant) {
    var item = config[key];
    if (!item) return "";
    var copy = item.copyValue || item.display;
    var valueBtn =
      '<button type="button" class="contact-value" data-copy="' +
      esc(copy) +
      '" data-copy-label="' +
      esc(item.display) +
      '">' +
      esc(item.display) +
      "</button>";

    var action = "";
    if (key === "whatsapp") {
      var href = safeWhatsappHref(item.href);
      if (href) {
        action =
          '<a class="contact-action" href="' +
          esc(href) +
          '" data-contact-whatsapp aria-label="' +
          esc(item.actionAria) +
          '">' +
          esc(item.action) +
          ' <span aria-hidden="true">→</span></a>';
      }
    } else if (key === "email") {
      action =
        '<a class="contact-action" href="' +
        esc(item.href) +
        '" data-contact-email aria-label="' +
        esc(item.actionAria) +
        '">' +
        esc(item.action) +
        ' <span aria-hidden="true">→</span></a>';
    } else {
      action =
        '<button type="button" class="contact-action" data-copy="' +
        esc(copy) +
        '" data-copy-label="' + esc(config.wechat.action) + '" data-copied-label="' + esc(ui.copied) + '" data-contact-wechat aria-label="' +
        esc(item.actionAria) +
        '">' +
        esc(item.action) +
        "</button>";
      if (item.wechatQrAsset) {
        action +=
          '<a class="contact-action" href="' +
          esc(item.wechatQrAsset) +
          '" data-contact-qr>' + esc(ui.qr) + "</a>";
      }
    }

    if (variant === "footer") {
      var primary = "";
      if (key === "whatsapp" && safeWhatsappHref(item.href)) {
        primary =
          '<a href="' +
          esc(item.href) +
          '" data-contact-whatsapp aria-label="' +
          esc(item.actionAria) +
          '">' +
          esc(item.label) +
          "</a>";
      } else if (key === "email") {
        primary =
          '<a href="' +
          esc(item.href) +
          '" data-contact-email aria-label="' +
          esc(item.actionAria) +
          '">' +
          esc(item.label) +
          "</a>";
      } else {
        primary =
          '<button type="button" class="footer-contact-label" data-copy="' +
          esc(copy) +
          '" data-copy-label="' + esc(config.wechat.label) + '" data-copied-label="' + esc(ui.copied) + '" data-contact-wechat aria-label="' +
          esc(item.actionAria) +
          '">' +
          esc(item.label) +
          "</button>";
      }
      return (
        '<p class="footer-contact-item">' +
        primary +
        "<br>" +
        '<button type="button" class="footer-contact-value" data-copy="' +
        esc(copy) +
        '" data-copy-label="' +
        esc(item.display) +
        '" aria-label="' + esc(ui.copyPrefix) +
        esc(item.label) +
        " " +
        esc(item.display) +
        '">' +
        esc(item.display) +
        "</button></p>"
      );
    }

    var tag = variant === "card" ? "article" : "div";
    var cls = variant === "card" ? "contact-card" : "contact-channel";
    return (
      "<" + tag + ' class="' + cls + '">' +
      '<div class="contact-label"><span class="contact-icon">' +
      ICONS[key] +
      "</span><span>" +
      esc(item.label) +
      "</span></div>" +
      valueBtn +
      action +
      "</" + tag + ">"
    );
  }

  function panelInner(titleId, withClose) {
    var channels = ORDER.map(function (key) {
      return channelBlock(key, "panel");
    }).join("");
    return (
      '<div class="contact-panel-head">' +
      '<p class="contact-kicker" id="' +
      titleId +
      '">' + ui.touch + "</p>" +
      (withClose
        ? '<button type="button" class="contact-close" data-contact-close>' + ui.close + "</button>"
        : "") +
      "</div>" +
      channels
    );
  }

  function mount() {
    var nav = document.getElementById("contact-popover-nav");
    var hero = document.getElementById("contact-popover-hero");
    var dock = document.getElementById("contact-popover-dock");
    var sheetCard = document.querySelector("#contact-sheet .contact-sheet-card");
    var cards = document.querySelector("[data-contact-cards]");
    var footer = document.querySelector("[data-contact-footer]");

    if (nav) {
      nav.innerHTML = panelInner("contact-nav-title", true);
      nav.setAttribute("role", "dialog");
      nav.setAttribute("aria-labelledby", "contact-nav-title");
    }
    if (hero) {
      hero.innerHTML = panelInner("contact-hero-title", true);
      hero.setAttribute("role", "dialog");
      hero.setAttribute("aria-labelledby", "contact-hero-title");
    }
    if (dock) {
      dock.innerHTML = panelInner("contact-dock-title", true);
      dock.setAttribute("role", "dialog");
      dock.setAttribute("aria-labelledby", "contact-dock-title");
    }
    if (sheetCard) {
      sheetCard.innerHTML = panelInner("contact-sheet-title", true);
    }
    if (cards) {
      cards.innerHTML = ORDER.map(function (key) {
        return channelBlock(key, "card");
      }).join("");
    }
    if (footer) {
      footer.innerHTML = ORDER.map(function (key) {
        return channelBlock(key, "footer");
      }).join("");
    }
  }

  function live(message) {
    var region = document.getElementById("contact-live");
    if (!region) return;
    region.textContent = "";
    window.setTimeout(function () {
      region.textContent = message;
    }, 30);
  }

  function fallbackCopy(value) {
    var previous = document.activeElement;
    var field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.top = "0";
    field.style.left = "0";
    field.style.width = "1px";
    field.style.height = "1px";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.focus();
    field.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (err) {
      ok = false;
    }
    field.remove();
    if (previous && typeof previous.focus === "function") previous.focus();
    return ok;
  }

  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value).then(
        function () {
          return true;
        },
        function () {
          return fallbackCopy(value);
        }
      );
    }
    return Promise.resolve(fallbackCopy(value));
  }

  function showCopied(button) {
    var label = button.getAttribute("data-copy-label") || button.textContent;
    var copied = button.getAttribute("data-copied-label") || ui.copied;
    button.textContent = copied;
    button.classList.add("is-copied");
    var previous = copyTimers.get(button);
    if (previous) window.clearTimeout(previous);
    copyTimers.set(
      button,
      window.setTimeout(function () {
        button.textContent = label;
        button.classList.remove("is-copied");
      }, 1800)
    );
  }

  function finishCopy(button, value, ok) {
    if (!ok) {
      live("Could not copy. Select the text and copy it manually.");
      return;
    }
    showCopied(button);
    live(ui.copied + " " + value);
    if (value === config.wechat.copyValue) track("contact_wechat_copy");
  }

  function onCopy(button) {
    var value = button.getAttribute("data-copy") || "";
    var synced = false;
    try {
      synced = fallbackCopy(value);
    } catch (err) {
      synced = false;
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value).then(
        function () {
          finishCopy(button, value, true);
        },
        function () {
          finishCopy(button, value, synced);
        }
      );
      return;
    }
    finishCopy(button, value, synced);
  }

  function hidePanel(panel) {
    if (!panel || panel.hasAttribute("hidden")) return;
    var token = String(Date.now()) + Math.random();
    panel.setAttribute("data-hide-token", token);
    panel.classList.remove("is-open");
    var done = function () {
      if (panel.getAttribute("data-hide-token") !== token) return;
      panel.setAttribute("hidden", "");
      panel.removeEventListener("transitionend", done);
    };
    if (reduce) {
      done();
      return;
    }
    panel.addEventListener("transitionend", done);
    window.setTimeout(done, 220);
  }

  function showPanel(panel) {
    if (!panel) return;
    panel.setAttribute("data-hide-token", "");
    panel.removeAttribute("hidden");
    if (reduce) {
      panel.classList.add("is-open");
      return;
    }
    panel.classList.remove("is-open");
    window.requestAnimationFrame(function () {
      panel.classList.add("is-open");
    });
  }

  function syncTriggers() {
    var buttons = document.querySelectorAll("[data-contact-open]");
    Array.prototype.forEach.call(buttons, function (button) {
      var key = panelKey(button.getAttribute("data-contact-open"));
      var panel = panelEl(key);
      var expanded = openKey === key;
      button.setAttribute("aria-expanded", expanded ? "true" : "false");
      if (panel) button.setAttribute("aria-controls", panel.id);
    });
  }

  function closePanel() {
    if (!openKey) return;
    var panel = panelEl(openKey);
    var trigger = lastTrigger;
    openKey = null;
    window.clearTimeout(closeTimer);
    hidePanel(panel);
    syncTriggers();
    track("contact_panel_close");
    if (trigger && typeof trigger.focus === "function") trigger.focus();
    lastTrigger = null;
  }

  function openPanel(source, trigger) {
    var key = panelKey(source);
    if (openKey === key) {
      closePanel();
      return;
    }
    if (openKey) {
      hidePanel(panelEl(openKey));
      track("contact_panel_close");
    }
    openKey = key;
    lastTrigger = trigger || null;
    if (isMobile()) {
      var menu = document.getElementById("nav-menu");
      var toggle = document.querySelector("[data-nav-toggle]");
      if (menu) menu.classList.remove("is-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
    showPanel(panelEl(key));
    syncTriggers();
    track("contact_panel_open");
    window.setTimeout(function () {
      var panel = panelEl(key);
      if (!panel || openKey !== key) return;
      var preferred = panel.querySelector(".contact-action");
      if (preferred) preferred.focus();
    }, reduce ? 0 : 40);
  }

  function onKeydown(event) {
    if (event.key === "Escape" && openKey) {
      event.preventDefault();
      closePanel();
      return;
    }
    if (event.key !== "Tab" || !openKey) return;
    var panel = panelEl(openKey);
    if (!panel) return;
    var items = focusables(panel);
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function onPointerDown(event) {
    if (!openKey) return;
    var panel = panelEl(openKey);
    var target = event.target;
    if (panel && panel.contains(target)) {
      if (openKey === "sheet" && target === panel) closePanel();
      return;
    }
    if (target.closest && target.closest("[data-contact-open]")) return;
    closePanel();
  }

  function onClick(event) {
    var opener = event.target.closest ? event.target.closest("[data-contact-open]") : null;
    if (opener) {
      event.preventDefault();
      openPanel(opener.getAttribute("data-contact-open"), opener);
      return;
    }
    var closer = event.target.closest ? event.target.closest("[data-contact-close]") : null;
    if (closer) {
      event.preventDefault();
      closePanel();
      return;
    }
    var copyBtn = event.target.closest ? event.target.closest("[data-copy]") : null;
    if (copyBtn) {
      event.preventDefault();
      onCopy(copyBtn);
      return;
    }
    var whatsapp = event.target.closest ? event.target.closest("[data-contact-whatsapp]") : null;
    if (whatsapp) {
      var href = safeWhatsappHref(whatsapp.getAttribute("href") || "");
      if (!href) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      track("contact_whatsapp_click");
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    var email = event.target.closest ? event.target.closest("[data-contact-email]") : null;
    if (email) track("contact_email_click");
  }

  function onViewportChange() {
    if (openKey) closePanel();
  }

  mount();
  var sheet = document.getElementById("contact-sheet");
  if (sheet) {
    var blockBackdropScroll = function (event) {
      if (event.target === sheet) event.preventDefault();
    };
    sheet.addEventListener("wheel", blockBackdropScroll, { passive: false });
    sheet.addEventListener("touchmove", blockBackdropScroll, { passive: false });
  }

  document.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeydown);
  document.addEventListener("pointerdown", onPointerDown);
  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", onViewportChange);
  } else if (typeof mobileQuery.addListener === "function") {
    mobileQuery.addListener(onViewportChange);
  }
  syncTriggers();
})();
