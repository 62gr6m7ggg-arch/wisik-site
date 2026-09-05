/* Wisik Grabbelton — zuivere selectie- en validatielogica, zonder videoinhoud. */
(() => {
  "use strict";

  const VALID_STATUSES = new Set(["planned", "draft", "published"]);
  const VALID_WRISTBANDS = new Set(["ALL", "VO", "PABO", "HBO"]);
  const MEDIA_HOST = "media.wisik.nl";

  const asText = (value) => String(value ?? "").trim();
  const asArray = (value) => Array.isArray(value) ? value : [];

  function isAllowedAssetUrl(value, baseUrl = "https://wisik.nl/") {
    if (typeof value !== "string") return false;
    const candidate = value.trim();
    if (!candidate || candidate === "/" || /^[#?]/.test(candidate) || (!candidate.startsWith("/") && !/^https:\/\//i.test(candidate))) return false;
    try {
      const base = new URL(baseUrl);
      const url = new URL(candidate, base);
      const trustedOrigin = url.origin === base.origin || (url.hostname === MEDIA_HOST && !url.port);
      return url.protocol === "https:" && !url.username && !url.password && url.pathname !== "/" && trustedOrigin;
    } catch {
      return false;
    }
  }

  function resolveAssetUrl(value, baseUrl = "https://wisik.nl/") {
    return isAllowedAssetUrl(value, baseUrl) ? new URL(value.trim(), new URL(baseUrl)).href : null;
  }

  function validateCatalog(catalog, { knownToolIds = [], knownMisconceptionCodes = [], expectedCanonicalToolId = "", requireKnownTargets = false } = {}) {
    const errors = [];
    const tools = new Set(knownToolIds);
    const codes = new Set(knownMisconceptionCodes);
    const seenIds = new Set();
    const seenSources = new Set();

    if (!catalog || typeof catalog !== "object") return ["Catalogus ontbreekt of is geen object."];
    if (requireKnownTargets && (!tools.size || !codes.size || !asText(expectedCanonicalToolId))) errors.push("De canonieke tool-, bron- of misconceptlijst ontbreekt.");
    if (catalog.schemaVersion !== 1) errors.push("Alleen catalogusschema 1 wordt ondersteund.");
    if (!Number.isInteger(catalog.series?.targetMinimum) || catalog.series.targetMinimum < 30) {
      errors.push("De videoserie moet op minstens 30 publicaties zijn voorbereid.");
    }
    if (!Array.isArray(catalog.videos)) return [...errors, "Catalogusveld videos moet een array zijn."];
    const canonicalToolId = asText(catalog.series?.canonicalToolId);
    if (!canonicalToolId || (tools.size && !tools.has(canonicalToolId))) errors.push("De catalogus mist een bekende canonieke brontool.");
    if (expectedCanonicalToolId && canonicalToolId !== asText(expectedCanonicalToolId)) errors.push("De catalogus wijkt af van de verwachte canonieke brontool.");

    catalog.videos.forEach((video, index) => {
      const at = `Video ${index + 1}`;
      const id = asText(video?.id);
      const status = asText(video?.status);
      const wristbands = asArray(video?.wristbands);
      const toolId = asText(video?.target?.toolId);
      const code = asText(video?.target?.misconceptionCode);

      if (!/^[a-z0-9][a-z0-9-]{2,80}$/.test(id)) errors.push(`${at} heeft geen geldige id.`);
      if (seenIds.has(id)) errors.push(`${at} gebruikt een dubbele id: ${id}.`);
      if (id) seenIds.add(id);
      if (!VALID_STATUSES.has(status)) errors.push(`${at} heeft een onbekende status.`);
      if (!wristbands.length || wristbands.some((band) => !VALID_WRISTBANDS.has(asText(band).toUpperCase()))) {
        errors.push(`${at} heeft geen geldige polsbandselectie.`);
      }
      if (!toolId || (tools.size && !tools.has(toolId))) errors.push(`${at} verwijst naar een onbekende brontool.`);
      if (canonicalToolId && toolId !== canonicalToolId) errors.push(`${at} verwijst niet naar de canonieke brontool.`);
      if (!code || (codes.size && !codes.has(code))) errors.push(`${at} verwijst naar een onbekende misconceptcode.`);

      if (status === "published") {
        const sourceUrl = asText(video?.source?.url);
        if (asText(video?.title).length < 4) errors.push(`${at} mist een duidelijke titel.`);
        if (asText(video?.summary).length < 20) errors.push(`${at} mist een bruikbare samenvatting.`);
        if (!Number.isInteger(video?.durationSeconds) || video.durationSeconds < 15 || video.durationSeconds > 600) {
          errors.push(`${at} heeft geen geldige duur van 15 tot 600 seconden.`);
        }
        if (video?.source?.kind !== "self-hosted" || !isAllowedAssetUrl(sourceUrl)) {
          errors.push(`${at} heeft geen toegestane zelfgehoste videobron.`);
        }
        if (seenSources.has(sourceUrl)) errors.push(`${at} gebruikt een dubbele videobron.`);
        if (sourceUrl) seenSources.add(sourceUrl);
        if (!isAllowedAssetUrl(video?.captionsSrc)) errors.push(`${at} mist Nederlandse ondertiteling op een toegestane bron.`);
        if (!isAllowedAssetUrl(video?.transcriptUrl)) errors.push(`${at} mist een transcript op een toegestane bron.`);
      }
    });

    return errors;
  }

  function publishedForWristband(catalog, wristband = "ALL") {
    const band = asText(wristband).toUpperCase() || "ALL";
    return asArray(catalog?.videos).filter((video) => {
      if (video?.status !== "published") return false;
      const bands = asArray(video.wristbands).map((value) => asText(value).toUpperCase());
      return band === "ALL" || bands.includes("ALL") || bands.includes(band);
    });
  }

  function normalizeRecentIds(value) {
    return asArray(value).filter((item) => typeof item === "string").map(asText).filter(Boolean).slice(0, 5);
  }

  function chooseVideo(catalog, { wristband = "ALL", preferredCodes = [], recentIds = [], random = Math.random } = {}) {
    let candidates = publishedForWristband(catalog, wristband);
    if (!candidates.length) return null;

    const recent = new Set(normalizeRecentIds(recentIds));
    const fresh = candidates.filter((video) => !recent.has(asText(video?.id)));
    if (fresh.length) candidates = fresh;

    const preferred = new Set(asArray(preferredCodes).map(asText));
    const preferredMatches = candidates.filter((video) => preferred.has(asText(video?.target?.misconceptionCode)));
    const reason = preferredMatches.length ? "misconception" : wristband === "ALL" ? "open" : "wristband";
    if (preferredMatches.length) candidates = preferredMatches;

    const raw = Number(typeof random === "function" ? random() : Math.random());
    const bounded = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 0.999999999) : 0;
    return { video: candidates[Math.floor(bounded * candidates.length)], reason };
  }

  globalThis.WisikGrabbeltonCore = Object.freeze({
    validateCatalog,
    publishedForWristband,
    chooseVideo,
    normalizeRecentIds,
    isAllowedAssetUrl,
    resolveAssetUrl,
    validStatuses: Object.freeze([...VALID_STATUSES]),
    validWristbands: Object.freeze([...VALID_WRISTBANDS])
  });
})();
