(() => {
  "use strict";

  const WISIK_HOME = "https://wisik.nl/";
  const KLADBLOK_URL = "https://wisik.nl/kladblok/";
  const SNAPSHOT_KEY = "wisik:pabo-rekenklaar:last-exit";

  function currentContextUrl() {
    return window.location.href;
  }

  function currentAppVersion() {
    return String(window.PaboRekenklaarQA?.version || document.getElementById("homeVersion")?.textContent || "onbekend").trim();
  }

  function saveExitSnapshot(destination) {
    try {
      const active = document.activeElement;
      if (active && typeof active.blur === "function") active.blur();

      const controls = {};
      document.querySelectorAll("input, select, textarea").forEach((control, index) => {
        if (control.type === "password" || control.type === "file") return;
        const key = control.id || control.name || `control-${index}`;
        controls[key] = control.type === "checkbox" || control.type === "radio"
          ? Boolean(control.checked)
          : String(control.value ?? "");
      });

      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify({
        app: "Pabo Rekenklaar",
        version: currentAppVersion(),
        page: currentContextUrl(),
        destination,
        savedAt: new Date().toISOString(),
        controls
      }));

      // Geef de app ook gelegenheid haar eigen lokale opslaghandlers uit te voeren.
      document.dispatchEvent(new Event("change", { bubbles: true }));
      document.dispatchEvent(new Event("visibilitychange"));
      window.dispatchEvent(new Event("pagehide"));
    } catch (error) {
      console.warn("Wisik-uitgang: lokale voortgang kon niet aanvullend worden vastgelegd.", error);
    }
  }

  function leaveFor(destination) {
    saveExitSnapshot(destination);
    window.setTimeout(() => {
      window.location.assign(destination);
    }, 80);
  }

  function buildKladblokUrl() {
    const url = new URL(KLADBLOK_URL);
    url.searchParams.set("bron", currentContextUrl());
    url.searchParams.set("appversie", currentAppVersion());
    url.searchParams.set("attractie", "Pabo Rekenklaar");
    return url.href;
  }

  function createNavigation() {
    if (document.querySelector("[data-wisik-exit-nav]")) return;

    const nav = document.createElement("nav");
    nav.className = "wisik-exit-nav";
    nav.dataset.wisikExitNav = "";
    nav.setAttribute("aria-label", "Navigatie terug naar Wisik");

    const home = document.createElement("a");
    home.className = "wisik-exit-link wisik-exit-home";
    home.href = WISIK_HOME;
    home.innerHTML = '<img class="wisik-exit-mark" src="/assets/icons/wisik-20260914-192.png" width="26" height="26" alt="" aria-hidden="true"><span class="wisik-exit-label"><strong>Wisik</strong><small>Terug naar terrein</small></span>';
    home.setAttribute("aria-label", "Terug naar het Wisik-terrein");
    home.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      leaveFor(WISIK_HOME);
    });

    const feedback = document.createElement("a");
    feedback.className = "wisik-exit-link wisik-exit-feedback";
    feedback.href = buildKladblokUrl();
    feedback.textContent = "Kladblok";
    feedback.setAttribute("aria-label", "Ervaring of probleem melden via het Wisik-Kladblok");
    feedback.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      leaveFor(buildKladblokUrl());
    });

    nav.append(home, feedback);
    const topbar = document.querySelector(".app-shell > .topbar");
    if (topbar) {
      // Keep native links and their listeners, but give them one shared layout.
      const terrain = topbar.querySelector(".wisik-terrain-link");
      if (terrain) nav.appendChild(terrain);
      topbar.appendChild(nav);
      topbar.classList.add("wisik-header-integrated");
    } else {
      document.body.insertBefore(nav, document.body.firstChild);
    }
  }

  function makeExistingWisikMarksClickable() {
    document.querySelectorAll("img[alt*='Wisik' i], [data-wisik-logo]").forEach((mark) => {
      const existingLink = mark.closest("a");
      if (existingLink) {
        existingLink.href = WISIK_HOME;
        existingLink.addEventListener("click", () => saveExitSnapshot(WISIK_HOME), { capture: true });
        return;
      }

      const link = document.createElement("a");
      link.href = WISIK_HOME;
      link.setAttribute("aria-label", "Terug naar het Wisik-terrein");
      mark.parentNode?.insertBefore(link, mark);
      link.appendChild(mark);
      link.addEventListener("click", (event) => {
        event.preventDefault();
        leaveFor(WISIK_HOME);
      });
    });
  }

  function updateKladblokLinks() {
    document.querySelectorAll("a[href*='/kladblok']").forEach((link) => {
      link.href = buildKladblokUrl();
      link.addEventListener("click", () => saveExitSnapshot(link.href), { capture: true });
    });
  }

  function observeNavigationSize() {
    const topbar = document.querySelector(".topbar.wisik-header-integrated");
    const bottomNav = document.querySelector(".bottom-nav");
    const sync = () => {
      const root = document.documentElement;
      if (topbar) root.style.setProperty("--wisik-header-height", `${Math.ceil(topbar.getBoundingClientRect().height)}px`);
      const height = bottomNav?.getBoundingClientRect().height || 0;
      const bottom = bottomNav ? parseFloat(getComputedStyle(bottomNav).bottom) || 0 : 0;
      root.style.setProperty("--wisik-bottom-clearance", `${Math.ceil(height ? height + bottom : 0)}px`);
    };
    sync();
    if (typeof ResizeObserver === "function") {
      const observer = new ResizeObserver(sync);
      if (topbar) observer.observe(topbar);
      if (bottomNav) observer.observe(bottomNav);
    }
    window.addEventListener("resize", sync, { passive: true });
  }

  function initialize() {
    createNavigation();
    makeExistingWisikMarksClickable();
    updateKladblokLinks();
    observeNavigationSize();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
