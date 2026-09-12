/* Wisik mobile festival walk 1.0.0 — © Edwin van der Plas. */
(() => {
  "use strict";
  const directory = document.querySelector("[data-terrain-directory]");
  if (!directory) return;
  const smallScreen = window.matchMedia("(max-width: 1000px)");
  const map = document.querySelector("#terrein");
  const sequence = [".zone-pabo", ".side-stage-card.moshpit", ".side-stage-card.grabbelton", ".zone-stoicheia", ".zone-space", ".kh-entry--map", ".space-billboard-map", ".zone-vo", ".zone-hbo", ".zone-backstage", ".zone-kladblok"];
  const stops = map ? sequence.map(selector => map.querySelector(selector)).filter(Boolean).map(node => {
    const marker = document.createComment("terrain-stop");
    node.parentNode.insertBefore(marker, node);
    return { node, marker };
  }) : [];
  const toolLinks = [...document.querySelectorAll("[data-terrain-tool]")].map(link => ({
    link,
    original: link.getAttribute("href"),
    tool: (window.WISIK_TOOLS || []).find(tool => tool.id === link.dataset.terrainTool),
  }));
  // Build the compact alternative from the same stops, so its labels and routes cannot drift.
  const walkList = document.querySelector("[data-terrain-walk-list]");
  const listLinks = walkList ? stops.filter(({node}) => node.tagName === "A").map(({node}) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    const title = document.createElement("strong");
    const description = document.createElement("span");
    title.textContent = node.querySelector("h3, strong").textContent;
    description.textContent = node.querySelector(".terrain-short").textContent;
    link.appendChild(title);
    link.appendChild(description);
    item.appendChild(link);
    walkList.appendChild(item);
    return { link, stop: node };
  }) : [];
  if (listLinks.length) walkList.hidden = false;
  // Native details remains usable with no JavaScript; desktop keeps the full list.
  function syncDirectory() {
    directory.open = !smallScreen.matches;
    // Match DOM/focus order to the visible walk, retaining the original desktop slots.
    stops.forEach(({node, marker}) => {
      if (smallScreen.matches) map.appendChild(node);
      else marker.parentNode.insertBefore(node, marker.nextSibling);
    });
    toolLinks.forEach(({link, original, tool}) => {
      link.setAttribute("href", smallScreen.matches && tool?.appUrl ? tool.appUrl : original);
    });
    listLinks.forEach(({link, stop}) => link.setAttribute("href", stop.getAttribute("href")));
  }
  syncDirectory();
  smallScreen.addEventListener("change", syncDirectory);
  document.querySelectorAll('[href="#vandaag-open"]').forEach(link => {
    link.addEventListener("click", () => { directory.open = true; });
  });
  if (window.location.hash === "#vandaag-open") directory.open = true;
  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#vandaag-open") directory.open = true;
  });
})();
