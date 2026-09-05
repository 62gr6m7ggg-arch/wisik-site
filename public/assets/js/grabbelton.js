/* Wisik Grabbelton — rendert uitsluitend gepubliceerde items uit de centrale catalogus. */
(() => {
  "use strict";

  const CATALOG_URL = "/assets/data/grabbelton-videos.json";
  const WRISTBAND_KEY = "wisik-polsband-v1";
  const HISTORY_KEY = "wisik-grabbelton-history-v1";
  const PABO_STATE_KEY = "pabo-rekenklaar-state-v1";
  const ALLOWED_BANDS = new Set(["ALL", "VO", "PABO", "HBO"]);
  const core = globalThis.WisikGrabbeltonCore;
  let catalog = null;
  let wristband = "ALL";

  const byId = (id) => document.getElementById(id);
  const readLocalJson = (key, fallback) => {
    try { return JSON.parse(globalThis.localStorage?.getItem(key) || "") || fallback; } catch { return fallback; }
  };
  const safeBand = (value) => {
    const band = String(value || "").toUpperCase();
    return ALLOWED_BANDS.has(band) ? band : "ALL";
  };
  const validationOptions = () => {
    const tools = Array.isArray(globalThis.WISIK_TOOLS) ? globalThis.WISIK_TOOLS : [];
    const codes = Array.isArray(globalThis.WISIK_MISCONCEPTION_CODES) ? globalThis.WISIK_MISCONCEPTION_CODES : [];
    const venues = Array.isArray(globalThis.WISIK_VENUES) ? globalThis.WISIK_VENUES : [];
    const expectedCanonicalToolId = venues.find((venue) => venue.id === "grabbelton")?.source?.toolId || "";
    return { knownToolIds: tools.map((tool) => tool.id), knownMisconceptionCodes: codes, expectedCanonicalToolId, requireKnownTargets: true };
  };

  function preferredMisconceptionCodes() {
    const state = readLocalJson(PABO_STATE_KEY, {});
    const patterns = state?.diagnostics?.patterns || {};
    return Object.entries(patterns)
      .filter(([, value]) => value?.status === "likely" || value?.status === "recovering")
      .map(([code]) => code);
  }

  function recentIds() {
    return core.normalizeRecentIds(readLocalJson(HISTORY_KEY, []));
  }

  function rememberVideo(id) {
    try {
      const next = [id, ...recentIds().filter((item) => item !== id)].slice(0, 5);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      // De Grabbelton blijft werken wanneer lokale opslag niet beschikbaar is.
    }
  }

  function setWristband(next) {
    wristband = safeBand(next);
    try { localStorage.setItem(WRISTBAND_KEY, wristband); } catch {}
    document.querySelectorAll("[data-grabbelton-band]").forEach((button) => {
      const selected = button.dataset.grabbeltonBand === wristband;
      button.setAttribute("aria-pressed", String(selected));
      button.classList.toggle("active", selected);
    });
    updateAvailability({ resetResult: true });
  }

  function clearResult(kind = "empty") {
    const result = byId("grabbeltonResult");
    if (!result) return;
    result.querySelector("video")?.pause();
    result.replaceChildren();
    const heading = document.createElement("h2");
    heading.textContent = kind === "error" ? "De Grabbelton is even dicht" : kind === "ready" ? "Klaar om te grabbelen" : "De Grabbelton wordt gevuld";
    const copy = document.createElement("p");
    copy.textContent = kind === "error"
      ? "De veilige videocatalogus kon niet worden geladen. Probeer het later opnieuw; er wordt nu geen filmpje getoond."
      : kind === "ready"
        ? "Druk op ‘Grijp een filmpje’ voor één korte uitleg die bij dit polsbandje past."
      : "Er staan voor dit polsbandje nog geen filmpjes klaar. Straks vind je hier korte uitleg: één filmpje per hardnekkig denkpatroon.";
    const links = document.createElement("div");
    links.className = "button-row";
    links.innerHTML = '<a class="btn primary" href="/moshpit/">Oefen in de Moshpit</a><a class="btn ghost" href="/pabo/pabo-rekenklaar/">Bekijk Pabo Rekenklaar</a>';
    result.append(heading, copy, links);
  }

  function failClosed(message = "De Grabbelton is tijdelijk niet beschikbaar.") {
    catalog = null;
    const count = byId("grabbeltonAvailableCount");
    const button = byId("grabbeltonDrawButton");
    const status = byId("grabbeltonStatus");
    if (count) count.textContent = "0";
    if (button) { button.disabled = true; button.hidden = true; }
    if (status) status.textContent = message;
    clearResult("error");
  }

  function updateAvailability({ resetResult = false } = {}) {
    if (!catalog || !core) return;
    const published = core.publishedForWristband(catalog, wristband);
    const count = byId("grabbeltonAvailableCount");
    const button = byId("grabbeltonDrawButton");
    if (count) count.textContent = String(published.length);
    if (button) {
      button.disabled = published.length === 0;
      button.hidden = published.length === 0;
    }
    if (resetResult || !published.length) clearResult(published.length ? "ready" : "empty");
    const status = byId("grabbeltonStatus");
    if (status) status.textContent = published.length
      ? `${published.length} ${published.length === 1 ? "filmpje past" : "filmpjes passen"} bij dit polsbandje.`
      : "Nog geen gepubliceerd filmpje voor deze keuze.";
  }

  function renderVideo(selection) {
    const { video, reason } = selection;
    const result = byId("grabbeltonResult");
    if (!result) return;
    result.querySelector("video")?.pause();
    result.replaceChildren();

    const eyebrow = document.createElement("span");
    eyebrow.className = "kicker";
    eyebrow.textContent = `Misconcept ${video.target.misconceptionCode}`;
    const heading = document.createElement("h2");
    heading.textContent = video.title;
    const summary = document.createElement("p");
    summary.className = "lead";
    summary.textContent = video.summary;
    const player = document.createElement("video");
    player.className = "grabbelton-player";
    player.controls = true;
    player.playsInline = true;
    player.preload = "metadata";
    player.crossOrigin = "anonymous";
    player.src = core.resolveAssetUrl(video.source.url);
    const track = document.createElement("track");
    track.kind = "captions";
    track.srclang = "nl";
    track.label = "Nederlands";
    track.src = core.resolveAssetUrl(video.captionsSrc);
    track.default = true;
    player.append(track);
    const note = document.createElement("p");
    note.className = "muted";
    note.textContent = reason === "misconception"
      ? "Gekozen omdat Pabo Rekenklaar in deze browser meerdere aanwijzingen voor dit denkpatroon zag. Dit is geen diagnose."
      : reason === "wristband"
        ? "Willekeurig gekozen uit de filmpjes die bij jouw polsbandje passen."
        : "Willekeurig gekozen uit alle gepubliceerde filmpjes.";
    const transcript = document.createElement("a");
    transcript.className = "btn ghost small";
    transcript.href = core.resolveAssetUrl(video.transcriptUrl);
    transcript.textContent = "Lees het transcript";
    result.append(eyebrow, heading, summary, player, note, transcript);
    rememberVideo(video.id);
  }

  function drawVideo() {
    if (!catalog || core.validateCatalog(catalog, validationOptions()).length) {
      failClosed();
      return;
    }
    const selection = core?.chooseVideo(catalog, {
      wristband,
      preferredCodes: preferredMisconceptionCodes(),
      recentIds: recentIds()
    });
    if (selection) renderVideo(selection); else clearResult();
  }

  async function initialize() {
    if (!core) {
      const status = byId("grabbeltonStatus");
      if (status) status.textContent = "De selectielogica kon niet worden geladen.";
      return;
    }

    document.querySelectorAll("[data-grabbelton-band]").forEach((button) => {
      button.addEventListener("click", () => setWristband(button.dataset.grabbeltonBand));
    });
    byId("grabbeltonDrawButton")?.addEventListener("click", drawVideo);

    const requested = new URL(window.location.href).searchParams.get("polsband");
    const stored = (() => { try { return localStorage.getItem(WRISTBAND_KEY); } catch { return null; } })();
    wristband = safeBand(requested || stored || "ALL");

    try {
      const version = encodeURIComponent(globalThis.WISIK_SITE_VERSION || "current");
      const response = await fetch(`${CATALOG_URL}?v=${version}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const candidate = await response.json();
      const errors = core.validateCatalog(candidate, validationOptions());
      if (errors.length) throw new Error(errors.join(" "));
      catalog = candidate;
      const total = core.publishedForWristband(catalog, "ALL").length;
      const totalNode = byId("grabbeltonPublishedCount");
      const targetNode = byId("grabbeltonTargetCount");
      if (totalNode) totalNode.textContent = String(total);
      if (targetNode) targetNode.textContent = String(catalog.series.targetMinimum);
      setWristband(wristband);
    } catch (error) {
      console.error("Grabbelton-catalogus kon niet veilig worden geladen.", error);
      failClosed();
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
