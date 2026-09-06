(() => {
  "use strict";

  const TOOLS = Array.isArray(window.WISIK_TOOLS) ? window.WISIK_TOOLS : [];
  const WISIK_CONTEXT_KEY = "wisik-last-attraction-context-v1";
  const REQUIRED_RELEASE_GATES = Object.freeze([
    "source-integrity",
    "generated-variants",
    "reproducible-answers",
    "no-fallbacks",
    "readable-graphs",
    "diagnostic-patterns",
    "flirt-trigger-chain",
    "flirt-content-lock"
  ]);
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
    document.querySelectorAll("[data-site-version]").forEach((node) => { node.textContent = window.WISIK_SITE_VERSION || "onbekend"; });
  }

  function formatAuditDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "onbekend moment";
    return new Intl.DateTimeFormat("nl-NL", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
    }).format(date);
  }

  function auditGateMarkup(gate) {
    const passed = gate?.passed === true;
    return `<li class="audit-gate ${passed ? "passed" : "failed"}">
      <span class="audit-gate-icon" aria-hidden="true">${passed ? "✓" : "!"}</span>
      <span><strong>${escapeHtml(gate?.label || "Onbekende controle")}</strong><small>${escapeHtml(gate?.evidence || "Geen bewijsgegevens beschikbaar")}</small></span>
    </li>`;
  }

  function evaluateReleaseAudit(report, registeredToolVersion) {
    const gates = Array.isArray(report?.gates) ? report.gates : [];
    const gateIds = gates.map((gate) => gate?.id);
    const completeGateSet = gates.length === REQUIRED_RELEASE_GATES.length
      && new Set(gateIds).size === REQUIRED_RELEASE_GATES.length
      && REQUIRED_RELEASE_GATES.every((id) => gates.some((gate) => gate?.id === id && gate?.passed === true));
    const review = report?.flirtContent;
    const entries = Array.isArray(review?.entries) ? review.entries : [];
    const contentIssues = entries.filter(entry=>entry.verdict === "mismatch").length;
    const validReview = entries.length > 0 && entries.length === report?.counts?.diagnosticPatterns
      && new Set(entries.map(entry=>entry.code)).size === entries.length
      && entries.every(entry=>["aligned","aligned-with-notes","mismatch"].includes(entry.verdict))
      && review?.counts?.reviewed === entries.length && review?.counts?.needsRevision === contentIssues
      && (contentIssues ? review?.status === "revision-needed" : ["aligned","reviewed-with-notes"].includes(review?.status));
    const schemaValid = report?.schemaVersion === 1 && report?.tool === "Pabo Rekenklaar" && validReview;
    const versionsCurrent = report?.siteVersion === window.WISIK_SITE_VERSION && report?.toolVersion === registeredToolVersion;
    const passed = schemaValid && versionsCurrent && report?.status === "passed" && completeGateSet;
    const stale = schemaValid && report?.status === "passed" && completeGateSet && !versionsCurrent;
    return {
      gates,
      counts: report?.counts || {},
      passed,
      stale,
      passedGateCount: gates.filter((gate) => gate?.passed === true).length,
      requiredGateCount: REQUIRED_RELEASE_GATES.length
    };
  }

  function flirtReviewMarkup(review) {
    if (!review || !Array.isArray(review.entries)) return '<p>De inhoudelijke flirtbeoordeling ontbreekt.</p>';
    const labels = {aligned:"Sluit aan", "aligned-with-notes":"Sluit aan, met kanttekening", mismatch:"Beeldherstel nodig"};
    const issues = review.entries.filter(entry => entry.verdict === "mismatch");
    return `<section class="flirt-content-review" aria-label="Inhoudelijke beoordeling van flirts">
      <h5>Inhoudelijke beoordeling van de flirts</h5>
      <p>${Number(review.counts?.reviewed || 0)} flirts beoordeeld: ${Number(review.counts?.aligned || 0)} sluiten aan, ${Number(review.counts?.withNotes || 0)} hebben een kanttekening en <strong>${issues.length} vragen beeldherstel</strong>.</p>
      ${issues.length ? `<ul>${issues.map(entry=>`<li><strong>${escapeHtml(entry.code)} · ${escapeHtml(entry.title)}:</strong> ${escapeHtml(entry.notes?.[0] || entry.observedContent)}</li>`).join("")}</ul>` : ""}
      <p>De technische controles kunnen slagen terwijl inhoudelijke herstelpunten openstaan. Die punten krijgen daarmee geen inhoudelijke goedkeuring.</p>
      <details class="audit-gate-details"><summary>Bekijk de ${review.entries.length} inhoudelijke beoordelingen</summary>
        ${review.entries.map(entry=>`<details class="flirt-review-item"><summary>${escapeHtml(entry.code)} · ${escapeHtml(entry.title)} — ${escapeHtml(labels[entry.verdict] || "Niet beoordeeld")}</summary><p><strong>Bedoelde denkfout:</strong> ${escapeHtml(entry.expectedMisconception)}</p><p><strong>Gewenst inzicht:</strong> ${escapeHtml(entry.intendedInsight)}</p><p><strong>Beoordeling:</strong> ${escapeHtml(entry.observedContent)}</p>${entry.notes?.length?`<ul>${entry.notes.map(note=>`<li>${escapeHtml(note)}</li>`).join("")}</ul>`:""}</details>`).join("")}
      </details>
      <p class="muted">${escapeHtml(review.reviewer)}. ${escapeHtml(review.scope?.audio)} ${escapeHtml(review.scope?.limitations)}</p>
      <p><a href="/assets/data/flirt-content-review.json">Open de volledige review met beeldmomenten en bestandsvingerafdrukken</a></p>
    </section>`;
  }

  async function renderReleaseAudit() {
    const panel = document.querySelector("[data-release-audit]");
    const summary = document.querySelector("[data-release-audit-summary]");
    const intro = document.querySelector("[data-audit-intro]");
    if (!panel && !summary) return;
    const reportUrl = panel?.dataset.auditUrl || summary?.dataset.auditUrl;
    try {
      const response = await fetch(reportUrl, { cache: "no-store", headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const report = await response.json();
      const registeredToolVersion = TOOLS.find((tool) => tool.id === "pabo-rekenklaar")?.version;
      const { gates, counts, passed, stale, passedGateCount, requiredGateCount } = evaluateReleaseAudit(report, registeredToolVersion);
      const contentIssues = Number(report.flirtContent?.counts?.needsRevision || 0);
      const statusLabel = passed ? contentIssues ? "Technisch gecontroleerd · beeldherstel nodig" : "Online versie gecontroleerd" : stale ? "Bewijs hoort niet bij deze versie" : "Nieuwe versie niet vrijgegeven";

      if (summary) {
        summary.classList.toggle("passed", passed && !contentIssues);
        summary.classList.toggle("needs-review", Boolean(contentIssues));
        summary.classList.toggle("stale", stale);
        summary.classList.toggle("failed", !passed && !stale);
        summary.innerHTML = `<span class="release-summary-icon" aria-hidden="true">${passed && !contentIssues ? "✓" : "!"}</span>
          <span class="release-summary-copy"><strong>${escapeHtml(report.tool || "Attractie")} ${escapeHtml(report.toolVersion || "")} · ${escapeHtml(statusLabel)}</strong><small>${passedGateCount}/${requiredGateCount} technische controles geslaagd${contentIssues ? ` · ${contentIssues} flirts vragen beeldherstel` : ""} · bekijk het bewijs</small></span>
          <span class="release-summary-arrow" aria-hidden="true">↓</span>`;
      }

      if (intro) {
        intro.textContent = passed
          ? `${report.tool} ${report.toolVersion} is automatisch gecontroleerd. Alle ${requiredGateCount} technische controles zijn geslaagd.${contentIssues ? ` De inhoudelijke review benoemt daarnaast ${contentIssues} flirts die beeldherstel vragen.` : ""}`
          : stale
            ? `Het beschikbare controlebewijs hoort niet bij de huidige versie. De pagina toont daarom geen groene vrijgavestatus.`
            : `De kandidaatversie heeft niet alle verplichte controles doorstaan en is niet als geslaagde vrijgave gemarkeerd.`;
      }

      panel.classList.toggle("failed", !passed);
      panel.classList.toggle("stale", stale);
      panel.classList.toggle("needs-review", Boolean(contentIssues));
      panel.setAttribute("aria-busy", "false");
      panel.innerHTML = `<div class="audit-panel-head">
        <div><span class="audit-kicker">Laatste geverifieerde online vrijgave</span><h4>${escapeHtml(report.tool || "Attractie")} <span>${escapeHtml(report.toolVersion || "")}</span></h4></div>
        <span class="audit-status ${passed ? contentIssues ? "needs-review" : "passed" : stale ? "stale" : "failed"}" role="status" aria-atomic="true">${passed ? contentIssues ? "! Technisch gecontroleerd · beeldherstel nodig" : "✓ Online versie gecontroleerd" : stale ? "! Bewijs hoort niet bij deze versie" : "! Nieuwe versie niet vrijgegeven"}</span>
      </div>
      ${flirtReviewMarkup(report.flirtContent)}
      <div class="audit-metrics" aria-label="Samenvatting vrijgavecontrole">
        <div><strong>${Number(counts.generatedQuestions || 0).toLocaleString("nl-NL")}</strong><span>vragen doorgerekend</span></div>
        <div><strong>${Number(counts.generatorCombinations || 0).toLocaleString("nl-NL")}</strong><span>generatorcombinaties getest</span></div>
        <div><strong>${Number(counts.fallbackQuestions || 0).toLocaleString("nl-NL")}</strong><span>noodvragen gebruikt</span></div>
        <div><strong>${Number(counts.naturalDiagnosticCoverage || 0)}/${Number(counts.diagnosticPatterns || 0)}</strong><span>foutpatronen getest</span></div>
      </div>
      <details class="audit-gate-details"><summary>Bekijk alle ${gates.length} controles</summary><ul class="audit-gates">${gates.map(auditGateMarkup).join("")}</ul></details>
      <div class="audit-panel-foot">
        <p><strong>Gecontroleerd:</strong> ${escapeHtml(formatAuditDate(report.generatedAt))}</p>
        <p><strong>Versies:</strong> ${escapeHtml(report.tool || "Attractie")} ${escapeHtml(report.toolVersion || "onbekend")} · Wisik-site ${escapeHtml(report.siteVersion || "onbekend")}</p>
        <p><strong>Bronvingerafdruk:</strong> <code>${escapeHtml(String(report.source?.sha256 || "onbekend").slice(0, 16))}…</code></p>
        <p>${escapeHtml(report.scope || "")}</p>
      </div>`;
    } catch (error) {
      if (summary) {
        summary.classList.remove("passed", "stale");
        summary.classList.add("failed");
        summary.innerHTML = `<span class="release-summary-icon" aria-hidden="true">!</span>
          <span class="release-summary-copy"><strong>Controlebewijs tijdelijk niet zichtbaar</strong><small>Bekijk hieronder wat er aan de hand is</small></span>
          <span class="release-summary-arrow" aria-hidden="true">↓</span>`;
      }
      if (intro) intro.textContent = "Het actuele controlebewijs kan nu niet worden geladen. Daarom toont Backstage geen groene vrijgavestatus.";
      panel.classList.add("failed");
      panel.setAttribute("aria-busy", "false");
      panel.innerHTML = `<div class="audit-unavailable"><strong>Vrijgavebewijs kan niet worden geladen.</strong><p>De attractie blijft bereikbaar, maar dit Backstage-overzicht is op dit moment niet verifieerbaar. Probeer de pagina later opnieuw of meld het via het Kladblok.</p></div>`;
      console.warn("Wisik kon het openbare vrijgavebewijs niet laden", error);
    }
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
    renderReleaseAudit();
  });
})();
