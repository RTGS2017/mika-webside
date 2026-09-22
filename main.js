(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // V1 SVG animateMotion may be absent on Homepage V2 — skip quietly.
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

  // Soft reveal for leftover .reveal nodes (V1). V2 motion is MikaHomeAnimations.
  const revealNodes = document.querySelectorAll(".reveal, .widget");
  if (revealNodes.length) {
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
    revealNodes.forEach((el) => observer.observe(el));
  }

  // Legacy V1 matrix / scan-log animations removed from Homepage V2 markup.
  // If those nodes reappear on another page, skip quietly — do not restart fake timers.
  // New homepage motion: window.MikaHomeAnimations (src/animations/home.js).
})();
