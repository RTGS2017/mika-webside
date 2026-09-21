(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    document.querySelectorAll("animateMotion").forEach((el) => el.remove());
  }

  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-stuck", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal, .widget").forEach((el) => observer.observe(el));

  const cells = document.querySelectorAll("[data-matrix] .cell");
  if (cells.length && !reduce) {
    let index = 0;
    window.setInterval(() => {
      cells.forEach((cell) => cell.classList.remove("is-on"));
      cells[index % cells.length].classList.add("is-on");
      index += 1;
    }, 2200);
  }

  const scanLines = [
    { text: "scanning_files          site directory mapped", cls: "tag-ok" },
    { text: "discovering_pages       48 routes · 5 languages", cls: "tag-ok" },
    { text: "checking_crawlability   robots + sitemap ok", cls: "tag-ok" },
    { text: "checking_indexability   unexpected noindex on 12 product shells", cls: "tag-warn" },
    { text: "checking_metadata       title collisions: 18", cls: "tag-warn" },
    { text: "checking_structure      internal edges 8340 · orphans 37", cls: "tag-warn" },
    { text: "checking_content        near-duplicate clusters: 9", cls: "tag-warn" },
    { text: "checking_semantic       topic mismatch on application hubs", cls: "tag-run" },
    { text: "checking_multilingual   hreflang reciprocal · AR thinner", cls: "tag-ok" },
    { text: "checking_structured_data missing Product JSON-LD: 14", cls: "tag-warn" },
    { text: "building_topic_map      coverage 58 · demand 47 · intent 44", cls: "tag-run" },
    { text: "mapping_entities        legalName KNOWN · certificates UNKNOWN", cls: "tag-ok" },
    { text: "evaluating_answerability who/what present · why sparse", cls: "tag-run" },
    { text: "analyzing_evidence      3 claims without source parked UNKNOWN", cls: "tag-warn" },
    { text: "finding_citation_opportunities  11 candidate blocks", cls: "tag-ok" },
    { text: "measuring_answer_surface 8 / 21 cells occupied", cls: "tag-run" },
    { text: "calculating_score       SEO Health 72 · Growth 41 (split)", cls: "tag-ok" },
    { text: "calculating_geo_health  GEO Health 68 · Growth 34 (split)", cls: "tag-ok" },
    { text: "generating_blueprint    18 tasks · execute: false", cls: "tag-ok" },
  ];

  const log = document.querySelector("[data-scan-log]");
  if (log) {
    log.innerHTML = scanLines
      .map((row, i) => `<div class="log-line" data-i="${i}"><span class="${row.cls}">▸</span> ${row.text}</div>`)
      .join("");
    const lines = Array.from(log.querySelectorAll(".log-line"));
    const paint = (count) => {
      lines.forEach((line, i) => {
        line.classList.toggle("done", i < count);
        line.classList.toggle("active", i === count);
      });
      const active = lines[Math.min(count, lines.length - 1)];
      if (active) {
        const top = active.offsetTop - 80;
        log.scrollTop = Math.max(0, top);
      }
    };
    if (reduce) {
      paint(lines.length);
    } else {
    let cursor = 0;
    const tick = () => {
      paint(cursor);
      cursor = (cursor + 1) % (lines.length + 3);
      window.setTimeout(tick, cursor === 0 ? 1600 : 720);
    };
    const logObserver = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        tick();
        logObserver.disconnect();
      }
    }, { threshold: 0.3 });
    logObserver.observe(log);
    }
  }

  const langMeta = {
    en: "/en/products/trailer-pump",
    zh: "/zh/products/trailer-pump",
    pt: "/pt/products/trailer-pump",
    ar: "/ar/products/trailer-pump",
    ru: "/ru/products/trailer-pump",
  };
  const tabs = document.querySelectorAll("[data-lang]");
  const urlLabel = document.querySelector("[data-lang-url]");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("is-on");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-on");
      tab.setAttribute("aria-selected", "true");
      if (urlLabel) urlLabel.textContent = langMeta[tab.getAttribute("data-lang")] || "";
    });
  });
})();
