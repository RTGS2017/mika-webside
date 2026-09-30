(function () {
  var header = document.querySelector(".sa-header");
  var menu = document.querySelector("[data-menu]");
  if (menu && header) {
    menu.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      menu.setAttribute("aria-expanded", open ? "true" : "false");
    });
    header.querySelectorAll(".sa-nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("is-open");
        menu.setAttribute("aria-expanded", "false");
      });
    });
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stage = document.querySelector("[data-hero-stage]");
  var visual = stage && stage.querySelector("[data-hero-visual]");
  var formFace = stage && stage.querySelector("[data-hero-form]");

  function showHeroForm(open) {
    if (!stage || !visual || !formFace) return;
    var next = open ? formFace : visual;
    if (!reduce) {
      stage.style.height = stage.getBoundingClientRect().height + "px";
    }
    stage.classList.toggle("is-form", open);
    visual.toggleAttribute("inert", open);
    visual.setAttribute("aria-hidden", open ? "true" : "false");
    formFace.toggleAttribute("inert", !open);
    formFace.setAttribute("aria-hidden", open ? "false" : "true");
    if (!reduce) {
      window.requestAnimationFrame(function () {
        stage.style.height = next.scrollHeight + "px";
      });
      stage.addEventListener("transitionend", function done(event) {
        if (event.propertyName !== "height") return;
        stage.style.height = "";
        stage.removeEventListener("transitionend", done);
      });
    }
    if (open) {
      var field = formFace.querySelector("input[name=company]");
      if (field) field.focus({ preventScroll: true });
      window.requestAnimationFrame(function () {
        var header = document.querySelector(".sa-header");
        var headerH = header ? header.getBoundingClientRect().height : 0;
        var top = stage.getBoundingClientRect().top;
        if (top < headerH + 8) {
          window.scrollBy({ top: top - headerH - 12, behavior: reduce ? "auto" : "smooth" });
        }
      });
    }
  }

  document.querySelectorAll("[data-hero-open]").forEach(function (control) {
    control.addEventListener("click", function (event) {
      event.preventDefault();
      var hero = document.getElementById("hero");
      if (hero) hero.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
      showHeroForm(true);
    });
  });
  document.querySelectorAll("[data-hero-close]").forEach(function (control) {
    control.addEventListener("click", function () {
      showHeroForm(false);
      var opener = document.querySelector(".sa-actions [data-hero-open]");
      if (opener) opener.focus();
    });
  });

  var panel = document.querySelector("[data-scan-panel]");
  if (panel) {
    var items = panel.querySelectorAll("[data-check]");
    var report = panel.querySelector("[data-report]");
    function showReport() {
      items.forEach(function (item) { item.classList.add("is-on"); });
      if (report) report.hidden = false;
    }
    if (reduce) {
      showReport();
    } else {
      items.forEach(function (item, index) {
        window.setTimeout(function () { item.classList.add("is-on"); }, 280 * (index + 1));
      });
      window.setTimeout(showReport, 280 * (items.length + 1));
    }
  }

  document.querySelectorAll("[data-count]").forEach(function (node) {
    var target = Number(node.getAttribute("data-count"));
    if (!target || reduce) {
      node.textContent = String(target || node.textContent);
      return;
    }
    var start = 0;
    var step = Math.max(1, Math.round(target / 24));
    var timer = window.setInterval(function () {
      start += step;
      if (start >= target) {
        node.textContent = String(target);
        window.clearInterval(timer);
      } else {
        node.textContent = String(start);
      }
    }, 40);
  });

  function endpoint() {
    var host = location.hostname;
    if (host === "mikaovo.ai" || host === "www.mikaovo.ai") {
      return "https://api.mikaovo.ai/api/contact";
    }
    return "/api/contact";
  }

  document.querySelectorAll("[data-scan-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var status = form.querySelector("[data-status]");
      var button = form.querySelector("[type=submit]");
      var data = {
        company: form.company.value.trim(),
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        website: form.website.value.trim(),
        need: form.need.value,
        lang: form.locale.value,
        company_website: form.company_website.value
      };
      if (button) button.disabled = true;
      if (status) {
        status.className = "sa-status";
        status.textContent = form.getAttribute("data-sending") || "Sending…";
      }
      fetch(endpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(function (response) {
        return response.json().then(function (body) {
          return { ok: response.ok, body: body };
        });
      }).then(function (result) {
        if (!status) return;
        status.className = result.ok ? "sa-status is-ok" : "sa-status is-err";
        status.textContent = (result.body && result.body.message) || (result.ok ? "OK" : "Error");
        if (result.ok) form.reset();
      }).catch(function () {
        if (!status) return;
        status.className = "sa-status is-err";
        status.textContent = form.getAttribute("data-fail") || "Could not send.";
      }).finally(function () {
        if (button) button.disabled = false;
      });
    });
  });
})();
