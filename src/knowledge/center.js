/**
 * Knowledge Center — client-side filter + search (no backend).
 * Expects: [data-kc-filter], [data-kc-category] cards, #kc-search, #kc-empty, #kc-result-count
 */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var filterBtns = Array.prototype.slice.call(
      document.querySelectorAll("[data-kc-filter]")
    );
    var grid = document.getElementById("kc-card-grid");
    var cards = Array.prototype.slice.call(
      (grid || document).querySelectorAll("[data-kc-category]")
    );
    var search = document.getElementById("kc-search");
    var empty = document.getElementById("kc-empty");
    var countEl = document.getElementById("kc-result-count");
    var active = "all";

    if (!filterBtns.length && !search) return;

    function apply() {
      var q = search ? String(search.value || "").trim().toLowerCase() : "";
      var shown = 0;

      cards.forEach(function (card) {
        var cat = card.getAttribute("data-kc-category") || "";
        var text = (card.getAttribute("data-kc-search") || card.textContent || "")
          .toLowerCase();
        var catOk = active === "all" || cat === active;
        var qOk = !q || text.indexOf(q) !== -1;
        var ok = catOk && qOk;
        card.classList.toggle("is-hidden", !ok);
        card.hidden = !ok;
        if (ok) shown += 1;
      });

      if (empty) {
        empty.classList.toggle("is-visible", shown === 0);
      }
      if (countEl) {
        countEl.textContent = String(shown);
      }
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        active = btn.getAttribute("data-kc-filter") || "all";
        filterBtns.forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        apply();
      });
    });

    if (search) {
      search.addEventListener("input", apply);
    }

    /* Deep-link: #category-seo or ?cat=seo */
    var hash = (location.hash || "").replace(/^#/, "");
    var params = new URLSearchParams(location.search);
    var catParam = params.get("cat") || "";
    var fromHash = hash.indexOf("category-") === 0 ? hash.slice(9) : "";
    var initial = catParam || fromHash;
    if (initial) {
      var match = filterBtns.filter(function (b) {
        return b.getAttribute("data-kc-filter") === initial;
      })[0];
      if (match) {
        active = initial;
        filterBtns.forEach(function (b) {
          b.setAttribute(
            "aria-pressed",
            b.getAttribute("data-kc-filter") === initial ? "true" : "false"
          );
        });
      }
    }

    apply();
  });
})();
