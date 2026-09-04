(() => {
  "use strict";

  const form = document.querySelector(".wisik-direct-feedback-form");
  if (!form) return;

  const params = new URL(window.location.href).searchParams;
  const sourceInput = form.querySelector("[name='Pagina']");
  const versionInput = form.querySelector("[name='Attractieversie']");
  const contextNote = form.querySelector("[data-feedback-context]");

  function sameOriginUrl(value) {
    if (!value) return "";
    try {
      const url = new URL(value, window.location.origin);
      return url.origin === window.location.origin ? url.href : "";
    } catch {
      return "";
    }
  }

  const sourceFromQuery = sameOriginUrl(params.get("bron"));
  const sourceFromReferrer = sameOriginUrl(document.referrer);
  const source = sourceFromQuery || sourceFromReferrer || window.location.href;
  const appVersion = String(params.get("appversie") || "").trim().slice(0, 40);
  const attraction = String(params.get("attractie") || "").trim().slice(0, 80);

  if (sourceInput) sourceInput.value = source;
  if (versionInput) versionInput.value = appVersion || "niet bekend";

  if (contextNote && (sourceFromQuery || appVersion || attraction)) {
    const sourceUrl = new URL(source);
    const locationLabel = sourceUrl.pathname === "/apps/pabo-rekenklaar/"
      ? "Pabo Rekenklaar"
      : sourceUrl.pathname;
    const parts = [attraction || locationLabel];
    if (appVersion) parts.push(`versie ${appVersion}`);
    contextNote.textContent = `Automatisch meegestuurd: ${parts.join(" · ")} · ${sourceUrl.pathname}${sourceUrl.search}${sourceUrl.hash}`;
    contextNote.hidden = false;
  }
})();
