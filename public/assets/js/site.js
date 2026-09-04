(() => {
  "use strict";

  const TOOLS = Array.isArray(window.WISIK_TOOLS) ? window.WISIK_TOOLS : [];
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[char]);

  const statusClass = (status) => status === "openingsklaar" || status === "open" ? "live" : "concept";
  const toolCardMarkup = (tool) => {
    const primary = tool.appUrl
      ? `<a class="btn primary small" href="${escapeHtml(tool.productUrl)}">Bekijk attractie</a>`
      : `<a class="btn ghost small" href="${escapeHtml(tool.productUrl)}">Bekijk bouwplaats</a>`;
    return `<article class="tool-card" data-accent="${escapeHtml(tool.accent)}" data-route="${escapeHtml(tool.route)}" data-status="${escapeHtml(tool.status)}">
      <div class="tool-card-icon" aria-hidden="true">${escapeHtml(tool.icon)}</div>
      <div class="label-row">
        <span class="label">${escapeHtml(tool.route)}</span>
        <span class="label ${statusClass(tool.status)}">${escapeHtml(tool.statusLabel)}</span>
        <span class="label">${escapeHtml(tool.venue)}</span>
      </div>
      <h3>${escapeHtml(tool.title)}</h3>
      <p>${escapeHtml(tool.summary)}</p>
      <dl class="tool-meta">
        <dt>Opleiding</dt><dd>${escapeHtml(tool.programme)}</dd>
        <dt>Fase</dt><dd>${escapeHtml(tool.phase)}</dd>
        <dt>Niveau</dt><dd>${escapeHtml(tool.level)}</dd>
        <dt>Onderwerp</dt><dd>${escapeHtml(tool.subject)}</dd>
        <dt>Versie</dt><dd>${escapeHtml(tool.version)}</dd>
      </dl>
      <div class="tool-actions">${primary}</div>
    </article>`;
  };

  function renderToolGrids() {
    document.querySelectorAll("[data-tools-grid]").forEach((grid) => {
      const route = (grid.dataset.route || "ALL").toUpperCase();
      const status = grid.dataset.status || "";
      const selected = TOOLS.filter((tool) => (route === "ALL" || tool.route === route) && (!status || tool.status === status));
      grid.innerHTML = selected.length
        ? selected.map(toolCardMarkup).join("")
        : `<div class="content-card"><h3>Hier wordt nog gebouwd</h3><p class="muted">Er staat nog geen openbare attractie in deze selectie. Zodra een tool inhoudelijk en technisch voldoende is uitgewerkt, verschijnt die hier met een duidelijk statuslabel.</p></div>`;
    });
  }

  function bindFilters() {
    const grid = document.querySelector("#allToolsGrid");
    if (!grid) return;
    document.querySelectorAll("[data-filter-route]").forEach((button) => {
      button.addEventListener("click", () => {
        const route = button.dataset.filterRoute;
        document.querySelectorAll("[data-filter-route]").forEach((item) => item.classList.toggle("active", item === button));
        grid.innerHTML = TOOLS.filter((tool) => route === "ALL" || tool.route === route).map(toolCardMarkup).join("");
      });
    });
  }

  function bindMobileNavigation() {
    const button = document.querySelector("#mobileMenuButton");
    const nav = document.querySelector("#mobileNav");
    if (!button || !nav) return;
    const close = () => {
      nav.classList.remove("open");
      document.body.classList.remove("nav-open");
      button.setAttribute("aria-expanded", "false");
      button.textContent = "☰";
    };
    button.addEventListener("click", () => {
      const open = !nav.classList.contains("open");
      nav.classList.toggle("open", open);
      document.body.classList.toggle("nav-open", open);
      button.setAttribute("aria-expanded", String(open));
      button.textContent = open ? "×" : "☰";
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  function bindRouteDialog() {
    const backdrop = document.querySelector("#routeDialogBackdrop");
    if (!backdrop) return;
    const closeButton = backdrop.querySelector("[data-close-route-dialog]");
    const open = () => {
      backdrop.classList.add("open");
      backdrop.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeButton?.focus();
    };
    const close = () => {
      backdrop.classList.remove("open");
      backdrop.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    document.querySelectorAll("[data-open-route-dialog]").forEach((button) => button.addEventListener("click", open));
    closeButton?.addEventListener("click", close);
    backdrop.addEventListener("click", (event) => { if (event.target === backdrop) close(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && backdrop.classList.contains("open")) close(); });
  }

  function bindScrollButtons() {
    document.querySelectorAll("[data-scroll-to]").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelector(button.dataset.scrollTo)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  let turnstileScriptPromise = null;
  function loadTurnstileScript() {
    if (window.turnstile) return Promise.resolve();
    if (turnstileScriptPromise) return turnstileScriptPromise;
    turnstileScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error("Turnstile kon niet worden geladen"));
      document.head.appendChild(script);
    });
    return turnstileScriptPromise;
  }

  async function feedbackConfig() {
    try {
      const response = await fetch("/api/config", { headers: { "accept": "application/json" } });
      if (!response.ok) throw new Error("config niet beschikbaar");
      return await response.json();
    } catch {
      return { feedbackEnabled: false, turnstileSiteKey: "" };
    }
  }

  async function setupFeedbackForms() {
    const forms = [...document.querySelectorAll(".feedback-form")];
    if (!forms.length) return;
    const config = await feedbackConfig();

    if (!config.feedbackEnabled || !config.turnstileSiteKey) {
      forms.forEach((form) => {
        const status = form.querySelector(".form-status");
        const submit = form.querySelector("button[type='submit']");
        if (submit) submit.disabled = true;
        if (status) {
          status.className = "form-status";
          status.innerHTML = `Het automatische Kladblok wordt geactiveerd zodra de Cloudflare-sleutels en het ontvangstadres zijn ingesteld. Voor nu kun je mailen naar <a href="mailto:kladblok@wisik.nl">kladblok@wisik.nl</a>.`;
        }
      });
      return;
    }

    try {
      await loadTurnstileScript();
      forms.forEach((form) => {
        const mount = form.querySelector(".turnstile-mount");
        if (!mount) return;
        form.dataset.turnstileWidget = String(window.turnstile.render(mount, {
          sitekey: config.turnstileSiteKey,
          theme: "light",
          size: "flexible",
          action: "wisik_kladblok"
        }));
      });
    } catch {
      forms.forEach((form) => {
        const submit = form.querySelector("button[type='submit']");
        if (submit) submit.disabled = true;
        const status = form.querySelector(".form-status");
        if (status) {
          status.className = "form-status bad";
          status.textContent = "De spamcontrole kon niet worden geladen. Probeer het later opnieuw.";
        }
      });
      return;
    }

    const returnedFromDelivery = new URL(window.location.href);
    if (returnedFromDelivery.searchParams.get("verzonden") === "1") {
      forms.forEach((form) => {
        const status = form.querySelector(".form-status");
        if (status) {
          status.className = "form-status good";
          status.textContent = "Dank! Je notitie is bij Wisik aangekomen.";
        }
      });
      returnedFromDelivery.searchParams.delete("verzonden");
      const query = returnedFromDelivery.searchParams.toString();
      history.replaceState(null, "", `${returnedFromDelivery.pathname}${query ? `?${query}` : ""}${returnedFromDelivery.hash}`);
    }

    const submitViaBrowser = (delivery) => {
      const action = new URL(String(delivery?.action || ""));
      if (
        delivery?.method !== "POST" ||
        action.origin !== "https://formsubmit.co" ||
        action.pathname !== "/kladblok@wisik.nl" ||
        !delivery.fields ||
        typeof delivery.fields !== "object" ||
        Array.isArray(delivery.fields)
      ) {
        throw new Error("De bezorgroute is niet geldig");
      }

      const relay = document.createElement("form");
      relay.method = "POST";
      relay.action = action.href;
      relay.acceptCharset = "UTF-8";
      relay.hidden = true;

      for (const [name, value] of Object.entries(delivery.fields)) {
        if (!name || value === undefined || value === null) continue;
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = String(name);
        input.value = String(value);
        relay.appendChild(input);
      }

      document.body.appendChild(relay);
      relay.submit();
    };

    forms.forEach((form) => {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const submit = form.querySelector("button[type='submit']");
        const status = form.querySelector(".form-status");
        const data = new FormData(form);
        const message = String(data.get("message") || "").trim();
        if (message.length < 10) {
          status.className = "form-status bad";
          status.textContent = "Schrijf iets meer, zodat je notitie goed te begrijpen is.";
          return;
        }
        const token = String(data.get("cf-turnstile-response") || "");
        if (!token) {
          status.className = "form-status bad";
          status.textContent = "Rond eerst de spamcontrole af.";
          return;
        }

        submit.disabled = true;
        status.className = "form-status";
        status.textContent = "Je notitie wordt gecontroleerd…";
        const payload = {
          category: String(data.get("category") || "algemeen"),
          attraction: String(data.get("attraction") || "algemeen"),
          message,
          email: String(data.get("email") || "").trim(),
          quotePermission: data.get("quotePermission") === "yes",
          company: String(data.get("company") || ""),
          page: window.location.pathname,
          siteVersion: window.WISIK_SITE_VERSION || "onbekend",
          turnstileToken: token
        };

        try {
          const response = await fetch("/api/feedback", {
            method: "POST",
            headers: { "content-type": "application/json", "accept": "application/json" },
            body: JSON.stringify(payload)
          });
          const result = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(result.message || "controle mislukt");

          if (result.ignored) {
            form.reset();
            status.className = "form-status good";
            status.textContent = "Dank! Je notitie is bij Wisik aangekomen.";
            submit.disabled = false;
            const widgetId = Number(form.dataset.turnstileWidget);
            if (window.turnstile && Number.isFinite(widgetId)) window.turnstile.reset(widgetId);
            return;
          }

          status.textContent = "De spamcontrole is geslaagd. Je notitie wordt beveiligd bezorgd…";
          submitViaBrowser(result.delivery);
        } catch (error) {
          status.className = "form-status bad";
          status.textContent = `De notitie kon niet worden verzonden. Probeer later opnieuw of mail naar kladblok@wisik.nl. (${error.message})`;
          submit.disabled = false;
          const widgetId = Number(form.dataset.turnstileWidget);
          if (window.turnstile && Number.isFinite(widgetId)) window.turnstile.reset(widgetId);
        }
      });
    });
  }

  function markCurrentNav() {
    const route = (document.body.dataset.route || "").toLowerCase();
    document.querySelectorAll(`[data-nav-route="${CSS.escape(route)}"]`).forEach((link) => link.setAttribute("aria-current", "page"));
  }

  function setFooterDetails() {
    document.querySelectorAll("[data-current-year]").forEach((node) => { node.textContent = String(new Date().getFullYear()); });
    document.querySelectorAll("[data-site-version]").forEach((node) => { node.textContent = window.WISIK_SITE_VERSION || "0.1.0"; });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderToolGrids();
    bindFilters();
    bindMobileNavigation();
    bindRouteDialog();
    bindScrollButtons();
    markCurrentNav();
    setFooterDetails();
    setupFeedbackForms();
  });
})();
