/* Wisik.nl — centrale attractieregistratie. */
window.WISIK_SITE_VERSION = "0.1.18";
window.WISIK_MISCONCEPTION_CODES = Object.freeze([
  "A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08",
  "B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08",
  "C01", "C02", "C03", "C04", "C05", "C06", "C07",
  "D01", "D02", "D03", "D04", "D05", "D06", "D07"
]);
window.WISIK_TOOLS = Object.freeze([
  Object.freeze({
    id: "ruimteklaar",
    title: "Space-tent · Ruimteklaar",
    route: "HBO",
    programme: "Lerarenopleiding Wiskunde tweedegraads",
    phase: "Ruimtemeetkunde · zes lessen en toplevel",
    level: "Hbo · ruimtelijk inzicht en construeren",
    subject: "Projecties, doorsneden, inhoud, hoeken en afstanden",
    venue: "Rafelrand · Space-tent",
    maturity: "prototype",
    status: "prototype",
    statusLabel: "Technisch prototype",
    version: "0.4",
    summary: "Zes leslevels met visuele uitleg, adaptief oefenen en construeren. Het toplevel verbindt de stof in twee gemengde proeven en papierwerk.",
    productUrl: "/rafelrand/space-tent/",
    appUrl: "/apps/ruimteklaar/",
    icon: "◇",
    accent: "blue",
    featured: false,
    tags: Object.freeze(["ruimtemeetkunde", "construeren", "ruimtelijk inzicht"])
  }),
  Object.freeze({
    id: "pabo-rekenklaar",
    title: "Pabo Rekenklaar",
    route: "PABO",
    programme: "Lerarenopleiding Basisonderwijs",
    phase: "Instroom en eerste studiefase",
    level: "Instroom → overwegend 3F / RWT-voorbereiding",
    subject: "Rekenen en toetsvertrouwen",
    venue: "Pabo-MainStage",
    maturity: "mainstage",
    status: "openingsklaar",
    statusLabel: "Openingsklaar",
    version: "1.6.2",
    summary: "Versterk je rekenbasis, oefen rubricgestuurd en ontdek welke terugkerende denkpatronen je mogelijk in de weg zitten.",
    productUrl: "/pabo/pabo-rekenklaar/",
    appUrl: "/apps/pabo-rekenklaar/",
    icon: "∑",
    accent: "coral",
    featured: true,
    tags: Object.freeze(["adaptief", "diagnostiek", "RWT"])
  }),
  Object.freeze({
    id: "summer-course-bouwkunde",
    title: "Wiskunde Summer Course Bouwkunde",
    route: "HBO",
    programme: "Bouwkunde en Civiele Techniek",
    phase: "Instroom / jaar 1",
    level: "Basisvaardigheden voor technische opleidingen",
    subject: "Rekenen, algebra, meten en verbanden",
    venue: "HBO-Werkplaats",
    maturity: "bouwplaats",
    status: "concept",
    statusLabel: "Concept",
    version: "0.0",
    summary: "Een toekomstige route waarin wiskundige basisvaardigheden worden verbonden aan bouwen, meten, ontwerpen en constructies.",
    productUrl: "/hbo/#summer-course-bouwkunde",
    appUrl: "",
    icon: "△",
    accent: "blue",
    featured: false,
    tags: Object.freeze(["bouwkunde", "instroom", "summer course"])
  })
]);

/* Zijpodia ontsluiten bestaande inhoud; ze zijn nadrukkelijk geen tweede toolregister. */
window.WISIK_VENUES = Object.freeze([
  Object.freeze({
    id: "moshpit",
    title: "Moshpit",
    status: "open",
    statusLabel: "Open",
    pageUrl: "/moshpit/",
    source: Object.freeze({
      type: "tool-activity",
      toolId: "pabo-rekenklaar",
      activity: "sprint",
      launchUrl: "/apps/pabo-rekenklaar/?ingang=moshpit&modus=sprint"
    })
  }),
  Object.freeze({
    id: "grabbelton",
    title: "Grabbelton",
    status: "open",
    statusLabel: "Festivalversie v1",
    pageUrl: "/grabbelton/",
    source: Object.freeze({
      type: "video-catalog",
      toolId: "pabo-rekenklaar",
      catalogUrl: "/assets/data/grabbelton-videos.json"
    })
  })
]);
