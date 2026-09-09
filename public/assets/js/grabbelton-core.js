/* Wisik Grabbelton — selectie, validatie en gesynchroniseerde eigenstemweergave. */
(() => {
  "use strict";

  const VALID_STATUSES = new Set(["planned", "draft", "published"]);
  const VALID_WRISTBANDS = new Set(["ALL", "VO", "PABO", "HBO"]);
  const MEDIA_HOST = "media.wisik.nl";
  const OWN_VOICE_RELEASE = "eigenstem-2026-09-09-r2";
  const OWN_VOICE = Object.freeze({"A01":{"src":"/assets/audio/eigenstem-2026-09-09-r2/A01.m4a","duration":60.05,"contentStart":4.5,"contentDuration":54.05},"A02":{"src":"/assets/audio/eigenstem-2026-09-09-r2/A02.m4a","duration":60.996,"contentStart":4.5,"contentDuration":54.996},"A03":{"src":"/assets/audio/eigenstem-2026-09-09-r2/A03.m4a","duration":54.803,"contentStart":4.5,"contentDuration":48.803},"A04":{"src":"/assets/audio/eigenstem-2026-09-09-r2/A04.m4a","duration":53.35,"contentStart":4.5,"contentDuration":47.35},"A05":{"src":"/assets/audio/eigenstem-2026-09-09-r2/A05.m4a","duration":61.648,"contentStart":4.5,"contentDuration":55.648},"A06":{"src":"/assets/audio/eigenstem-2026-09-09-r2/A06.m4a","duration":61.291,"contentStart":4.5,"contentDuration":55.291},"A07":{"src":"/assets/audio/eigenstem-2026-09-09-r2/A07.m4a","duration":75.297,"contentStart":4.5,"contentDuration":69.297},"A08":{"src":"/assets/audio/eigenstem-2026-09-09-r2/A08.m4a","duration":60.197,"contentStart":4.5,"contentDuration":54.197},"B01":{"src":"/assets/audio/eigenstem-2026-09-09-r2/B01.m4a","duration":65.604,"contentStart":4.5,"contentDuration":59.604},"B02":{"src":"/assets/audio/eigenstem-2026-09-09-r2/B02.m4a","duration":72.192,"contentStart":4.5,"contentDuration":66.192},"B03":{"src":"/assets/audio/eigenstem-2026-09-09-r2/B03.m4a","duration":64.578,"contentStart":4.5,"contentDuration":58.578},"B04":{"src":"/assets/audio/eigenstem-2026-09-09-r2/B04.m4a","duration":75.865,"contentStart":4.5,"contentDuration":69.865},"B05":{"src":"/assets/audio/eigenstem-2026-09-09-r2/B05.m4a","duration":74.9,"contentStart":4.5,"contentDuration":68.9},"B06":{"src":"/assets/audio/eigenstem-2026-09-09-r2/B06.m4a","duration":63.447,"contentStart":4.5,"contentDuration":57.447},"B07":{"src":"/assets/audio/eigenstem-2026-09-09-r2/B07.m4a","duration":67.186,"contentStart":4.5,"contentDuration":61.186},"B08":{"src":"/assets/audio/eigenstem-2026-09-09-r2/B08.m4a","duration":59.481,"contentStart":4.5,"contentDuration":53.481},"C01":{"src":"/assets/audio/eigenstem-2026-09-09-r2/C01.m4a","duration":67.822,"contentStart":4.5,"contentDuration":61.822},"C02":{"src":"/assets/audio/eigenstem-2026-09-09-r2/C02.m4a","duration":64.902,"contentStart":4.5,"contentDuration":58.902},"C03":{"src":"/assets/audio/eigenstem-2026-09-09-r2/C03.m4a","duration":70.359,"contentStart":4.5,"contentDuration":64.359},"C04":{"src":"/assets/audio/eigenstem-2026-09-09-r2/C04.m4a","duration":61.615,"contentStart":4.5,"contentDuration":55.615},"C05":{"src":"/assets/audio/eigenstem-2026-09-09-r2/C05.m4a","duration":60.922,"contentStart":4.5,"contentDuration":54.922},"C06":{"src":"/assets/audio/eigenstem-2026-09-09-r2/C06.m4a","duration":63.88,"contentStart":4.5,"contentDuration":57.88},"C07":{"src":"/assets/audio/eigenstem-2026-09-09-r2/C07.m4a","duration":58.0,"contentStart":4.5,"contentDuration":52.0},"D01":{"src":"/assets/audio/eigenstem-2026-09-09-r2/D01.m4a","duration":59.287,"contentStart":4.5,"contentDuration":53.287},"D02":{"src":"/assets/audio/eigenstem-2026-09-09-r2/D02.m4a","duration":62.762,"contentStart":4.5,"contentDuration":56.762},"D03":{"src":"/assets/audio/eigenstem-2026-09-09-r2/D03.m4a","duration":57.452,"contentStart":4.5,"contentDuration":51.452},"D04":{"src":"/assets/audio/eigenstem-2026-09-09-r2/D04.m4a","duration":60.524,"contentStart":4.5,"contentDuration":54.524},"D05":{"src":"/assets/audio/eigenstem-2026-09-09-r2/D05.m4a","duration":61.287,"contentStart":4.5,"contentDuration":55.287},"D06":{"src":"/assets/audio/eigenstem-2026-09-09-r2/D06.m4a","duration":51.916,"contentStart":4.5,"contentDuration":45.916},"D07":{"src":"/assets/audio/eigenstem-2026-09-09-r2/D07.m4a","duration":68.91,"contentStart":4.5,"contentDuration":62.91}});

  const asText = (value) => String(value ?? "").trim();
  const asArray = (value) => Array.isArray(value) ? value : [];
  const BrowserVideoElement = globalThis.HTMLVideoElement || class {};
  const BrowserElement = globalThis.Element || class {};
  const BrowserAudio = globalThis.Audio || class {};
  const BrowserMutationObserver = globalThis.MutationObserver || class { observe() {} };

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

  function versionedAssetUrl(value, version) {
    const resolved = resolveAssetUrl(value);
    if (!resolved) return null;
    const url = new URL(resolved);
    url.searchParams.set("v", asText(version));
    return url.href;
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
    if (!Number.isInteger(catalog.series?.targetMinimum) || catalog.series.targetMinimum < 30) errors.push("De videoserie moet op minstens 30 publicaties zijn voorbereid.");
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
      if (!wristbands.length || wristbands.some((band) => !VALID_WRISTBANDS.has(asText(band).toUpperCase()))) errors.push(`${at} heeft geen geldige polsbandselectie.`);
      if (!toolId || (tools.size && !tools.has(toolId))) errors.push(`${at} verwijst naar een onbekende brontool.`);
      if (canonicalToolId && toolId !== canonicalToolId) errors.push(`${at} verwijst niet naar de canonieke brontool.`);
      if (!code || (codes.size && !codes.has(code))) errors.push(`${at} verwijst naar een onbekende misconceptcode.`);

      if (status === "published") {
        const sourceUrl = asText(video?.source?.url);
        if (asText(video?.title).length < 4) errors.push(`${at} mist een duidelijke titel.`);
        if (asText(video?.summary).length < 20) errors.push(`${at} mist een bruikbare samenvatting.`);
        if (!Number.isInteger(video?.durationSeconds) || video.durationSeconds < 15 || video.durationSeconds > 600) errors.push(`${at} heeft geen geldige duur van 15 tot 600 seconden.`);
        if (video?.source?.kind !== "self-hosted" || !isAllowedAssetUrl(sourceUrl)) errors.push(`${at} heeft geen toegestane zelfgehoste videobron.`);
        if (seenSources.has(sourceUrl)) errors.push(`${at} gebruikt een dubbele videobron.`);
        if (sourceUrl) seenSources.add(sourceUrl);
        if (video?.posterSrc !== undefined && !isAllowedAssetUrl(video.posterSrc)) errors.push(`${at} heeft geen toegestane posterbron.`);
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

  let activeBinding = null;

  function codeFromVideo(player) {
    const source = player.currentSrc || player.getAttribute("src") || "";
    const match = source.match(/\/films\/rekenklaar\/([A-D]\d{2})\/flirt\.mp4/i);
    return match?.[1]?.toUpperCase() || "";
  }

  function retimeCaptions(player, config, rate) {
    const apply = () => {
      const track = player.textTracks?.[0];
      const cues = track?.cues;
      if (!cues?.length) return false;
      const first = cues[0].startTime;
      const last = cues[cues.length - 1].endTime;
      const span = Math.max(0.1, last - first);
      for (const cue of cues) {
        if (cue.__wisikOriginalStart === undefined) {
          cue.__wisikOriginalStart = cue.startTime;
          cue.__wisikOriginalEnd = cue.endTime;
        }
        const relativeStart = Math.max(0, cue.__wisikOriginalStart - first) / span;
        const relativeEnd = Math.max(relativeStart, cue.__wisikOriginalEnd - first) / span;
        cue.startTime = (config.contentStart + relativeStart * config.contentDuration) * rate;
        cue.endTime = Math.min(config.duration * rate, (config.contentStart + relativeEnd * config.contentDuration) * rate);
      }
      track.mode = "showing";
      return true;
    };
    if (apply()) return;
    const trackElement = player.querySelector("track");
    trackElement?.addEventListener("load", apply, { once: true });
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (apply() || attempts > 20) clearInterval(timer);
    }, 250);
  }

  function attachOwnVoice(player) {
    if (!(player instanceof BrowserVideoElement) || player.dataset.wisikOwnVoice === "1") return;
    const code = codeFromVideo(player);
    const config = OWN_VOICE[code];
    if (!config) return;
    player.dataset.wisikOwnVoice = "1";
    player.dataset.wisikOwnVoiceRelease = OWN_VOICE_RELEASE;
    player.muted = true;
    player.defaultMuted = true;
    const audio = new BrowserAudio(versionedAssetUrl(config.src, globalThis.WISIK_SITE_VERSION || OWN_VOICE_RELEASE));
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    audio.setAttribute("aria-hidden", "true");
    let rate = 1;
    let voiceDuration = config.duration;
    let syncing = false;
    const targetAudioTime = () => Math.max(0, Math.min(Math.max(0, voiceDuration - 0.04), player.currentTime / Math.max(rate, 0.01)));
    const syncAudio = (force = false) => {
      if (!Number.isFinite(player.currentTime)) return false;
      const target = targetAudioTime();
      const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
      if (force || Math.abs(current - target) > 0.8) {
        try { audio.currentTime = target; } catch { return false; }
      }
      return true;
    };
    const configure = () => {
      if (!Number.isFinite(player.duration) || player.duration <= 0) return;
      if (Number.isFinite(audio.duration) && audio.duration > 0) voiceDuration = audio.duration;
      rate = Math.min(2, Math.max(0.35, player.duration / voiceDuration));
      syncing = true;
      player.defaultPlaybackRate = rate;
      player.playbackRate = rate;
      syncing = false;
      retimeCaptions(player, { ...config, duration: voiceDuration }, rate);
    };
    player.addEventListener("loadedmetadata", configure);
    audio.addEventListener("loadedmetadata", () => {
      configure();
      if (player.currentTime > 0.25) syncAudio(true);
    });
    if (player.readyState >= 1) configure();
    player.addEventListener("ratechange", () => {
      if (!syncing && Math.abs(player.playbackRate - rate) > 0.001) {
        syncing = true;
        player.playbackRate = rate;
        syncing = false;
      }
    });
    player.addEventListener("play", async () => {
      if (activeBinding && activeBinding.player !== player) {
        activeBinding.player.pause();
        activeBinding.audio.pause();
      }
      activeBinding = { player, audio };
      syncAudio(false);
      audio.volume = player.volume;
      try { await audio.play(); }
      catch (error) {
        player.pause();
        player.dataset.wisikAudioError = "1";
        console.error("De eigen stem kon niet worden gestart.", error);
      }
    });
    player.addEventListener("pause", () => audio.pause());
    player.addEventListener("ended", () => {
      audio.pause();
      if (activeBinding?.player === player) activeBinding = null;
    });
    player.addEventListener("seeking", () => audio.pause());
    player.addEventListener("seeked", () => {
      syncAudio(true);
      if (!player.paused) audio.play().catch(() => player.pause());
    });
    player.addEventListener("volumechange", () => {
      audio.volume = player.volume;
      player.muted = true;
    });
    audio.addEventListener("ended", () => {
      if (!player.ended && !player.paused) player.currentTime = player.duration;
    });
    audio.addEventListener("error", () => {
      player.pause();
      player.dataset.wisikAudioError = "1";
    });
  }

  function scanForOwnVoice(root = document) {
    if (root instanceof BrowserVideoElement) attachOwnVoice(root);
    root.querySelectorAll?.('video[src*="/films/rekenklaar/"]').forEach(attachOwnVoice);
  }

  function initializeOwnVoice() {
    scanForOwnVoice(document);
    new BrowserMutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof BrowserElement) scanForOwnVoice(node);
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  globalThis.WisikGrabbeltonCore = Object.freeze({
    validateCatalog,
    publishedForWristband,
    chooseVideo,
    normalizeRecentIds,
    isAllowedAssetUrl,
    resolveAssetUrl,
    versionedAssetUrl,
    attachOwnVoice,
    ownVoiceRelease: OWN_VOICE_RELEASE,
    ownVoiceCodes: Object.freeze(Object.keys(OWN_VOICE)),
    validStatuses: Object.freeze([...VALID_STATUSES]),
    validWristbands: Object.freeze([...VALID_WRISTBANDS])
  });

  if (globalThis.document) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializeOwnVoice, { once: true });
    else initializeOwnVoice();
  }
})();
