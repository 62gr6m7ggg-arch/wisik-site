/* A read-only poster viewer: no tool registry, storage or course events. */
(() => {
  "use strict";

  const triggers = [...document.querySelectorAll("[data-space-billboard]")];
  if (!triggers.length) return;
  const source = triggers[0].querySelector("img").getAttribute("src");
  const artwork = () => {
    const frame = document.createElement("span");
    frame.className = "space-billboard-art";
    const image = document.createElement("img");
    image.src = source;
    image.alt = "";
    image.width = 1448;
    image.height = 1086;
    image.loading = "lazy";
    image.decoding = "async";
    image.draggable = false;
    frame.append(image);
    return frame;
  };

  const preview = document.createElement("div");
  preview.className = "space-billboard-preview";
  preview.hidden = true;
  preview.setAttribute("aria-hidden", "true");
  preview.append(artwork());
  document.body.append(preview);

  const dialog = document.createElement("dialog");
  dialog.id = "spaceBillboardDialog";
  dialog.className = "space-billboard-dialog";
  dialog.setAttribute("aria-labelledby", "spaceBillboardTitle");
  dialog.setAttribute("aria-describedby", "spaceBillboardDescription");
  dialog.innerHTML = `
    <div class="space-billboard-dialog-head">
      <p id="spaceBillboardTitle">Space-tent · toekomstmuziek</p>
      <button class="space-billboard-close" type="button" autofocus>Sluiten ×</button>
    </div>
    <p class="sr-only" id="spaceBillboardDescription">Een blik op wat hier kan groeien: één Space-tent met twee lesreeksen in één blokkenschema. Ruimtemeetkunde 1.1 in bordeaux, Ruimtemeetkunde 1.2 in oranje. Voorbeeldprogramma: Ruimte zien, Aanzichten en Doorsneden; Vectoren, Inproduct en Hoeken berekenen. Dit is een toekomstbeeld met voorbeeldlessen.</p>
    <div class="space-billboard-viewport" tabindex="0" role="region" aria-label="Vergroot billboard; scroll om het hele bord te bekijken"></div>
    <p class="space-billboard-mobile-note">Veeg om het hele bord te bekijken.</p>`;
  dialog.querySelector(".space-billboard-viewport").append(artwork());
  document.body.append(dialog);

  const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
  let timer;
  let opener;
  const hidePreview = () => {
    window.clearTimeout(timer);
    preview.hidden = true;
  };

  for (const trigger of triggers) {
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-controls", dialog.id);
    trigger.setAttribute("aria-expanded", "false");
    trigger.addEventListener("pointerenter", (event) => {
      if (!hover.matches || event.pointerType === "touch" || dialog.open) return;
      hidePreview();
      timer = window.setTimeout(() => { preview.hidden = false; }, 160);
    });
    trigger.addEventListener("pointerleave", hidePreview);
    trigger.addEventListener("pointercancel", hidePreview);
    trigger.addEventListener("click", () => {
      hidePreview();
      if (dialog.open) return;
      opener = trigger;
      dialog.showModal();
      trigger.setAttribute("aria-expanded", "true");
      document.body.classList.add("space-billboard-open");
      dialog.querySelector(".space-billboard-viewport").scrollTo(0, 0);
    });
  }

  dialog.querySelector(".space-billboard-close").addEventListener("click", () => dialog.close());
  // A click in the native backdrop closes the viewer; panning the poster does not.
  let backdropPress = false;
  dialog.addEventListener("pointerdown", (event) => { backdropPress = event.target === dialog; });
  dialog.addEventListener("click", (event) => {
    if (backdropPress && event.target === dialog) dialog.close();
    backdropPress = false;
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("space-billboard-open");
    if (opener) {
      opener.setAttribute("aria-expanded", "false");
      opener.focus({ preventScroll: true });
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hidePreview();
  });
  window.addEventListener("scroll", hidePreview, { passive: true });
  window.addEventListener("resize", hidePreview, { passive: true });
  window.addEventListener("blur", hidePreview);
  document.addEventListener("visibilitychange", hidePreview);
})();
