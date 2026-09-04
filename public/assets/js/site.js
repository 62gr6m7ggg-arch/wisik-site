(() => {
  "use strict";

  const TOOLS = Array.isArray(window.WISIK_TOOLS) ? window.WISIK_TOOLS : [];
  const WISIK_CONTEXT_KEY = "wisik-last-attraction-context-v1";
  const VIEW_LABELS = Object.freeze({
    home: "Start",
    learn: "Leren per onderdeel",
    practice: "Adaptief oefenen",
    exam: "Toets nabootsen",
    stats: "Voortgang"
  });
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[char]);
  const cleanContextValue = (value, maxLength = 500) => String(value ?? "").trim().slice(0, maxLength);

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

  function readFeedbackSourceContext(currentUrl) {
    let stored = {};
    try {
      stored = JSON.parse(sessionStorage.getItem(WISIK_CONTEXT_KEY) || "{}") || {};
    } catch {
      stored = {};
    }

    const context = {
      pageUrl: cleanContextValue(currentUrl.searchParams.get("bron") || stored.pageUrl, 1000),
      product: cleanContextValue(currentUrl.searchParams.get("product") || stored.product, 120),
      productVersion: cleanContextValue(currentUrl.searchParams.get("productversie") || stored.productVersion, 40),
      view: cleanContextValue(currentUrl.searchParams.get("onderdeel") || stored.view, 80)
    };

    if (!context.pageUrl && document.referrer) {
      try {
        const referrer = new URL(document.referrer);
        if (referrer.origin === window.location.origin && referrer.pathname !== "/kladblok/") {
          context.pageUrl = referrer.href;
        }
      } catch {
        // Een ongeldige referrer wordt genegeerd.
      }
    }
    return context;
  }

  function applyFeedbackSourceContext(form, context) {
    const fieldValues = {
      Bronpagina: context.pageUrl,
      Bronproduct: context.product,
      Productversie: context.productVersion,
      Onderdeel: VIEW_LABELS[context.view] || context.view
    };

    for (const [name, value] of Object.entries(fieldValues)) {
      const field = form.elements.namedItem(name);
      if (field) field.value = value;
    }

    if (context.product === "Pabo Rekenklaar") {
      const attraction = form.elements.namedItem("Attractie of terrein");
      if (attraction) attraction.value = "Pabo Rekenklaar";
    }

    const subject = form.elements.namedItem("_subject");
    if (subject && context.product) {
      const version = context.productVersion ? ` ${context.productVersion}` : "";
      subject.value = `[Wisik-Kladblok] ${context.product}${version} — nieuwe notitie`;
    }

    const note = form.querySelector("[data-feedback-source]");
    if (note && (context.product || context.pageUrl)) {
      const parts = [context.product, context.productVersion, VIEW_LABELS[context.view] || context.view].filter(Boolean);
      note.hidden = false;
      note.textContent = `Automatisch meegestuurde context: ${parts.join(" · ") || "vorige Wisik-pagina"}.`;
    }
  }

  function setupFeedbackForms() {
    const forms = [...document.querySelectorAll(".wisik-direct-feedback-form")];
    if (!forms.length) return;

    const currentUrl = new URL(window.location.href);
    const delivered = currentUrl.searchParams.get("verzonden") === "1";
    const sourceContext = readFeedbackSourceContext(currentUrl);

    forms.forEach((form) => {
      const submit = form.querySelector("button[type='submit']");
      const status = form.querySelector(".form-status");

      applyFeedbackSourceContext(form, sourceContext);

      // Herstel altijd een eventueel door een oudere, gecachte scriptversie uitgeschakelde knop.
      if (submit) submit.disabled = false;

      if (delivered && status) {
        status.className = "form-status good";
        status.textContent = "Dank! Je notitie is bij Wisik aangekomen.";
      } else if (status) {
        status.className = "form-status";
        status.textContent = "";
      }

      form.addEventListener("submit", () => {
        applyFeedbackSourceContext(form, sourceContext);
        if (status) {
          status.className = "form-status";
          status.textContent = "Je notitie wordt beveiligd verzonden…";
        }
      });
    });

    if (delivered) {
      currentUrl.searchParams.delete("verzonden");
      const query = currentUrl.searchParams.toString();
      history.replaceState(null, "", `${currentUrl.pathname}${query ? `?${query}` : ""}${currentUrl.hash}`);
    }

    // iOS kan een pagina vanuit de terug-navigatiecache herstellen. Laat de knop dan bruikbaar.
    window.addEventListener("pageshow", (event) => {
      if (!event.persisted) return;
      forms.forEach((form) => {
        const submit = form.querySelector("button[type='submit']");
        const status = form.querySelector(".form-status");
        if (submit) submit.disabled = false;
        if (status?.textContent.includes("beveiligd verzonden")) {
          status.className = "form-status";
          status.textContent = "";
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
