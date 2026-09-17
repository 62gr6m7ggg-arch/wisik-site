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
      const url = new URL(String(value), window.location.origin);
      if (!/^https?:$/.test(url.protocol) || url.origin !== window.location.origin) return "";
      return `${url.origin}${url.pathname}`;
    } catch {
      return "";
    }
  }

  function applyContext() {
    // Het moderne pad en dit zelfstandige vangnet hanteren hetzelfde URL-contract.
    const source = sameOriginUrl(form.querySelector("[name='Bronpagina']")?.value)
      || sameOriginUrl(params.get("bron")) || sameOriginUrl(document.referrer)
      || sameOriginUrl(window.location.href);
    const appVersion = String(form.querySelector("[name='Productversie']")?.value
      || params.get("productversie") || params.get("appversie") || "").trim().slice(0, 40);
    const attraction = String(params.get("product") || params.get("attractie") || "").trim().slice(0, 120);
    if (sourceInput) sourceInput.value = source;
    if (versionInput) versionInput.value = appVersion || "niet bekend";
    if (contextNote) {
      const primaryNote = form.querySelector("[data-feedback-source]");
      if (primaryNote && !primaryNote.hidden) {
        contextNote.hidden = true;
        contextNote.textContent = "";
      } else {
        const parts = [attraction, appVersion ? `versie ${appVersion}` : "", source].filter(Boolean);
        contextNote.textContent = `Automatisch meegestuurd: ${parts.join(" · ")}`;
        contextNote.hidden = false;
      }
    }
  }
  applyContext();
  form.addEventListener("submit", applyContext);
})();
