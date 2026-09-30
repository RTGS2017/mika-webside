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
