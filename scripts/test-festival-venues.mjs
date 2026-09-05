import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const siteVersion = JSON.parse(read("package.json")).version;
const pabo = read("public/apps/pabo-rekenklaar/index.html");
const homepage = read("public/index.html");
const backstage = read("public/backstage/index.html");
const moshpit = read("public/moshpit/index.html");
const grabbelton = read("public/grabbelton/index.html");
const grabbeltonRuntime = read("public/assets/js/grabbelton.js");
const styles = read("public/assets/css/styles.css");
const sitemap = read("public/sitemap.xml");
const catalog = JSON.parse(read("public/assets/data/grabbelton-videos.json"));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function count(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function visibleMarkup(source) {
  return source.replace(/<!--[\s\S]*?-->/g, "");
}

const siteContext = vm.createContext({ window: {} });
vm.runInContext(read("public/assets/js/site-data.js"), siteContext);
const tools = siteContext.window.WISIK_TOOLS;
const venues = siteContext.window.WISIK_VENUES;
const registeredMisconceptionCodes = siteContext.window.WISIK_MISCONCEPTION_CODES;

assert(Array.isArray(tools) && tools.length >= 1, "Het centrale toolregister kon niet worden geladen");
assert(Array.isArray(registeredMisconceptionCodes), "Het centrale misconceptregister kon niet worden geladen");
assert(Array.isArray(venues) && venues.length === 2, "Het zijpodiaregister moet exact Moshpit en Grabbelton bevatten");
assert(new Set(venues.map((venue) => venue.id)).size === venues.length, "Zijpodium-id's zijn niet uniek");
assert(new Set(venues.map((venue) => venue.pageUrl)).size === venues.length, "Zijpodiumroutes zijn niet uniek");

const paboTool = tools.find((tool) => tool.id === "pabo-rekenklaar");
const moshpitVenue = venues.find((venue) => venue.id === "moshpit");
const grabbeltonVenue = venues.find((venue) => venue.id === "grabbelton");
assert(paboTool, "Pabo Rekenklaar ontbreekt in het toolregister");
assert(moshpitVenue?.source?.type === "tool-activity", "Moshpit is niet als ingang naar een bestaande activiteit geregistreerd");
assert(moshpitVenue.source.toolId === paboTool.id, "Moshpit verwijst niet naar de canonieke Pabo-tool");
assert(moshpitVenue.source.launchUrl === `${paboTool.appUrl}?ingang=moshpit&modus=sprint`, "De Moshpit-start wijkt af van de toegestane Pabo-ingang");
assert(grabbeltonVenue?.source?.catalogUrl === "/assets/data/grabbelton-videos.json", "Grabbelton verwijst niet naar de enige videocatalogus");
assert(grabbeltonVenue?.source?.toolId === paboTool.id, "Grabbelton is niet vast aan de canonieke Pabo-brontool gekoppeld");

for (const [name, html] of [["Moshpit", moshpit], ["Grabbelton", grabbelton]]) {
  assert(html.includes('class="site-header"'), `${name} mist de gewone Wisik-kop`);
  assert(html.includes(`href="/assets/css/styles.css?v=${siteVersion}"`), `${name} mist actuele, versiegebonden CSS`);
  assert(html.includes(`src="/assets/js/site-data.js?v=${siteVersion}"`), `${name} mist het actuele registerscript`);
  assert(html.includes(`src="/assets/js/site.js?v=${siteVersion}"`), `${name} mist het actuele sitescript`);
  assert(count(html, /<h1\b/g) === 1, `${name} moet exact één hoofdtitel hebben`);
  assert(html.includes('class="breadcrumbs"') && html.includes('href="/"'), `${name} mist een terugweg naar het terrein`);
  assert(html.includes('href="/kladblok/"'), `${name} mist de centrale Kladbloklink`);
}

const homeVisible = visibleMarkup(homepage);
assert(count(homeVisible, /href=["']\/moshpit\/["']/g) === 1, "Het terrein moet precies één zichtbare Moshpit-ingang hebben");
assert(count(homeVisible, /href=["']\/grabbelton\/["']/g) === 1, "Het terrein moet precies één zichtbare Grabbelton-ingang hebben");
assert(!homeVisible.includes('class="grabbel-sign"'), "De oude decoratieve en mobiel verborgen Grabbelton-aanduiding staat nog op het terrein");
for (const route of ["moshpit", "grabbelton"]) {
  assert(count(sitemap, new RegExp(`<loc>https://wisik\\.nl/${route}/</loc>`, "g")) === 1, `Sitemap bevat /${route}/ niet exact één keer`);
}

assert(moshpit.includes('href="/apps/pabo-rekenklaar/?ingang=moshpit&amp;modus=sprint"'), "Moshpit mist de toegestane klaarzetlink");
assert(!/<iframe\b|<form\b|<video\b/i.test(moshpit), "Moshpit bevat een tweede speler, formulier of video-implementatie");
assert(pabo.includes('function resolveWisikEntry(flags=URL_FLAGS)'), "Pabo Rekenklaar mist een begrensde Wisik-ingangsresolver");
assert(pabo.includes('WISIK_ENTRY_MODE==="moshpit-sprint")setTimeout(openMoshpitEntrance,120)'), "De Moshpit-link zet niet eerst het startscherm klaar");
assert(pabo.includes('if(a==="startMoshpit"){closeModal();startSprint()}'), "De bewuste Moshpit-start gebruikt niet de canonieke sprintfunctie");
assert(pabo.includes('data-action="startMoshpit" data-modal-autofocus'), "De bewuste Moshpit-start krijgt geen logische toetsenbordfocus");
assert(pabo.includes('root?.querySelector("#answerInput, .option-btn, .order-controls button")'), "Na de start krijgt de eerste bedienbare antwoordoptie geen focus");
assert(pabo.includes("function keepModalFocus(event)") && pabo.includes("if(keepModalFocus(e))return;"), "Toetsenbordfocus kan uit het modale Moshpit-startscherm ontsnappen");
assert(pabo.includes('if(activeSession.kind==="sprint"){domain=pick(["A","B","C"]);mode="head"}'), "De sprint is niet strikt tot hoofdrekenen in A, B en C beperkt");
assert(pabo.includes('q=activeSession.kind==="sprint"?generateSprintQuestion('), "De sprint gebruikt geen fail-closed vraagselectie");
assert(pabo.includes('function isSprintQuestion(q)'), "Het contract voor toegestane sprintvragen ontbreekt");
assert(pabo.includes('const countsAsLearningEvidence=s.kind!=="sprint"'), "Sprintantwoorden zijn niet van gewone leerdata gescheiden");
assert(pabo.includes('countMistakes:countsAsLearningEvidence'), "Sprintfouten kunnen nog in het gewone foutendossier belanden");
assert(pabo.includes('endsAt:Date.now()+60000'), "De sprint gebruikt geen echte verstreken eindtijd");
assert(pabo.includes('if(s.kind==="sprint"&&expireSprintIfNeeded())return;const q=s.current'), "Een antwoord na de sprintdeadline kan nog worden gescoord");
assert(pabo.includes('if(activeSession.kind==="sprint"&&expireSprintIfNeeded())return;'), "Een nieuwe sprintvraag kan na de deadline worden getoond");

const publicSources = [];
const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});
for (const file of walk(path.join(root, "public")).filter((candidate) => /\.(?:html|js)$/.test(candidate))) {
  publicSources.push(fs.readFileSync(file, "utf8"));
}
const combinedPublicSource = publicSources.join("\n");
assert(count(combinedPublicSource, /function\s+startSprint\s*\(/g) === 1, "Er bestaat meer dan één sprintimplementatie");
assert(count(combinedPublicSource, /const\s+QUESTION_BANK\s*=/g) === 1, "Er bestaat meer dan één Pabo-vragenbank");
assert(count(combinedPublicSource, /function\s+generateQuestion\s*\(/g) === 1, "Er bestaat meer dan één Pabo-vraaggenerator");

assert(catalog.schemaVersion === 1, "Grabbelton-catalogus heeft een onbekend schema");
assert(catalog.series?.targetMinimum >= 30, "Grabbelton is niet op minstens 30 filmpjes voorbereid");
assert(Array.isArray(catalog.videos), "De Grabbelton-videoverzameling ontbreekt");
assert(!/<video\b|<iframe\b|youtu(?:\.be|be\.com)|autoplay/i.test(grabbelton), "De lege Grabbelton bevat toch een speler, embed of autoplay");
assert(grabbelton.includes('id="grabbeltonDrawButton" type="button" disabled hidden'), "De lege Grabbelton heeft geen veilig uitgeschakelde grijpknop");
assert(styles.includes('.btn[hidden] { display: none !important; }'), "Knoppen met hidden kunnen door de algemene knopstijl toch zichtbaar worden");
assert(styles.includes('.btn.coral { background: var(--coral-dark); color: white;'), "De primaire koraalknop heeft onvoldoende tekstcontrast");
assert(styles.includes('.side-stage-card:focus-visible { outline: 3px solid var(--navy-2);'), "Zijpodiumkaarten missen een contrastrijke focusmarkering");
assert(grabbelton.includes("Er staan nu nog geen filmpjes klaar"), "De lege toestand van de Grabbelton is niet eerlijk zichtbaar");

const coreContext = vm.createContext({ URL, console });
vm.runInContext(read("public/assets/js/grabbelton-core.js"), coreContext);
const core = coreContext.WisikGrabbeltonCore;
assert(core, "De zuivere Grabbelton-selectielogica kon niet worden geladen");

const misconceptionCodes = [...pabo.matchAll(/"([A-D]\d{2})":Object\.freeze\(/g)].map((match) => match[1]);
assert(misconceptionCodes.length === 30 && new Set(misconceptionCodes).size === 30, "De canonieke Pabo-catalogus bevat niet exact 30 unieke misconceptcodes");
assert(JSON.stringify(registeredMisconceptionCodes) === JSON.stringify(misconceptionCodes), "Het publieke misconceptregister wijkt af van de canonieke Pabo-catalogus");
const strictValidation = { knownToolIds: tools.map((tool) => tool.id), knownMisconceptionCodes: misconceptionCodes, expectedCanonicalToolId: paboTool.id, requireKnownTargets: true };
assert(core.validateCatalog(catalog, strictValidation).length === 0, "De lege Grabbelton-catalogus is ongeldig");
assert(core.validateCatalog(catalog, { requireKnownTargets: true }).length > 0, "Ontbrekende canonieke registerdata sluit de Grabbelton niet");
for (const value of ["", null, undefined, "#", "?x", "/", ".", {}, 123]) assert(!core.isAllowedAssetUrl(value), "Een lege, relatieve of niet-tekstuele media-URL wordt onterecht als veilig gezien");
assert(!core.isAllowedAssetUrl("javascript:alert(1)"), "Een javascript-URL wordt onterecht als mediabron toegestaan");
assert(!core.isAllowedAssetUrl("https://media.wisik.nl.evil.example/video.mp4"), "Een lookalike mediadomein wordt onterecht toegestaan");
assert(!core.isAllowedAssetUrl("https://media.wisik.nl:444/video.mp4"), "Een niet-toegestane mediapoort wordt onterecht toegestaan");
assert(core.resolveAssetUrl("/media/video.mp4") === "https://wisik.nl/media/video.mp4", "Een lokale media-URL wordt niet vanaf de domeinroot opgelost");
assert(core.normalizeRecentIds({}).length === 0 && core.normalizeRecentIds("video-01").length === 0, "Beschadigde kijkgeschiedenis wordt niet veilig genegeerd");

const fixtureSeries = { targetMinimum: 30, canonicalToolId: "pabo-rekenklaar" };

function fixtureVideo(index, { band = "PABO", code = misconceptionCodes[index % misconceptionCodes.length], status = "published" } = {}) {
  const id = `video-${String(index).padStart(2, "0")}-${band.toLowerCase()}`;
  return {
    id,
    title: `Uitleg bij ${code}`,
    status,
    wristbands: [band],
    target: { toolId: "pabo-rekenklaar", misconceptionCode: code },
    durationSeconds: 75,
    summary: `Korte uitleg over het denkpatroon met code ${code}.`,
    source: { kind: "self-hosted", url: `https://media.wisik.nl/videos/${id}.mp4` },
    captionsSrc: `https://media.wisik.nl/captions/${id}.vtt`,
    transcriptUrl: `https://wisik.nl/transcripten/${id}/`
  };
}

for (const size of [1, 30, 45]) {
  const fixture = { schemaVersion: 1, series: fixtureSeries, videos: Array.from({ length: size }, (_, index) => fixtureVideo(index)) };
  const errors = core.validateCatalog(fixture, { knownToolIds: tools.map((tool) => tool.id), knownMisconceptionCodes: misconceptionCodes });
  assert(errors.length === 0, `Geldige catalogus met ${size} filmpjes wordt geweigerd: ${errors.join(" ")}`);
  assert(core.publishedForWristband(fixture, "PABO").length === size, `Catalogus schaalt niet correct naar ${size} publicaties`);
}

const incompletePublished = fixtureVideo(70);
incompletePublished.source.url = "";
delete incompletePublished.captionsSrc;
delete incompletePublished.transcriptUrl;
const incompleteErrors = core.validateCatalog(
  { schemaVersion: 1, series: fixtureSeries, videos: [incompletePublished] },
  { knownToolIds: tools.map((tool) => tool.id), knownMisconceptionCodes: misconceptionCodes }
);
assert(incompleteErrors.length >= 3, "Een gepubliceerde video zonder video, ondertiteling en transcript passeert de poort");

const unknownTarget = fixtureVideo(71);
unknownTarget.target = { toolId: "onbekend", misconceptionCode: "Z99" };
const unknownTargetErrors = core.validateCatalog(
  { schemaVersion: 1, series: fixtureSeries, videos: [unknownTarget] },
  { knownToolIds: tools.map((tool) => tool.id), knownMisconceptionCodes: misconceptionCodes }
);
assert(unknownTargetErrors.length >= 2, "Een video met een onbekende tool en misconceptcode passeert de poort");

const driftedTarget = fixtureVideo(72);
driftedTarget.target.toolId = "summer-course-bouwkunde";
const driftedTargetErrors = core.validateCatalog(
  { schemaVersion: 1, series: { ...fixtureSeries, canonicalToolId: "summer-course-bouwkunde" }, videos: [driftedTarget] },
  strictValidation
);
assert(driftedTargetErrors.some((error) => error.includes("verwachte canonieke brontool")), "Catalogus en items kunnen samen van Pabo Rekenklaar wegdrijven");

const selectionFixture = {
  schemaVersion: 1,
  series: fixtureSeries,
  videos: [
    fixtureVideo(1, { band: "PABO", code: "A01" }),
    fixtureVideo(2, { band: "PABO", code: "B01" }),
    fixtureVideo(3, { band: "VO", code: "C01" }),
    fixtureVideo(4, { band: "PABO", code: "D01", status: "draft" })
  ]
};
assert(core.publishedForWristband(selectionFixture, "PABO").length === 2, "Polsbandfilter laat concepten of andere routes door");
assert(core.publishedForWristband(selectionFixture, "VO").length === 1, "VO-polsbandfilter werkt niet");
assert(core.chooseVideo(catalog, { wristband: "PABO" }) === null, "Een lege catalogus levert toch een trekking op");
const preferred = core.chooseVideo(selectionFixture, { wristband: "PABO", preferredCodes: ["B01"], random: () => 0 });
assert(preferred?.video?.target?.misconceptionCode === "B01" && preferred.reason === "misconception", "Voorzichtige voorkeur voor een ondersteund misconcept werkt niet");
const noRepeat = core.chooseVideo(selectionFixture, { wristband: "PABO", recentIds: [selectionFixture.videos[0].id], random: () => 0 });
assert(noRepeat?.video?.id === selectionFixture.videos[1].id, "De Grabbelton vermijdt een directe herhaling niet wanneer er een alternatief is");
const preferredNoRepeat = core.chooseVideo(selectionFixture, { wristband: "PABO", preferredCodes: ["B01"], recentIds: [selectionFixture.videos[1].id], random: () => 0 });
assert(preferredNoRepeat?.video?.id === selectionFixture.videos[0].id, "Een recent aanbevolen filmpje blokkeert onterecht een nog niet bekeken alternatief");

const candidateIndex = grabbeltonRuntime.indexOf("const candidate = await response.json()");
const validationIndex = grabbeltonRuntime.indexOf("const errors = core.validateCatalog(candidate, validationOptions())");
const assignmentIndex = grabbeltonRuntime.indexOf("catalog = candidate");
assert(candidateIndex >= 0 && validationIndex > candidateIndex && assignmentIndex > validationIndex, "De runtime activeert de videocatalogus vóór veilige validatie");
assert(grabbeltonRuntime.includes("catalog = null;") && grabbeltonRuntime.includes("function failClosed"), "De Grabbelton sluit niet veilig bij catalogusfalen");
assert(grabbeltonRuntime.includes("core.validateCatalog(catalog, validationOptions()).length"), "Een trekking hercontroleert de actieve catalogus niet");
assert(grabbeltonRuntime.includes("requireKnownTargets: true"), "Runtime-validatie kan zonder canonieke tool- en misconceptregisters openvallen");
assert(grabbeltonRuntime.includes('venue.id === "grabbelton"') && grabbeltonRuntime.includes("expectedCanonicalToolId"), "Runtime-validatie mist de vaste Pabo-bron uit het zijpodiaregister");
assert(count(grabbeltonRuntime, /result\.querySelector\("video"\)\?\.pause\(\);/g) >= 2 && grabbeltonRuntime.includes("updateAvailability({ resetResult: true });"), "Een polsbandwissel of nieuwe trekking stopt een eerder filmpje niet");
assert(grabbeltonRuntime.includes('kind === "ready" ? "Klaar om te grabbelen"'), "De Grabbelton toont bij beschikbaar aanbod nog een onjuiste lege toestand");
assert(grabbeltonRuntime.includes("core.resolveAssetUrl(video.source.url") && grabbeltonRuntime.includes("core.resolveAssetUrl(video.transcriptUrl"), "Gevalideerde en geladen media-URL's kunnen vanaf een andere basis worden opgelost");
assert(grabbeltonRuntime.includes('player.crossOrigin = "anonymous";'), "Externe ondertiteling is niet voorbereid op anonieme CORS-media");

assert(backstage.includes("De Moshpit gebruikt de bestaande Pabo-sprint; er is geen tweede vragenbank."), "Backstage verantwoordt de gedeelde Pabo-oefenbank niet");
assert(backstage.includes("De Grabbelton gebruikt één gecontroleerde catalogus en heeft nu 0 gepubliceerde filmpjes."), "Backstage vermeldt de lege centrale Grabbelton-catalogus niet");

console.log("Zijpodiacontrole geslaagd: één Pabo-sprint, bewuste Moshpit-start, gescheiden leerdata en een lege schaalbare Grabbelton voor 30+ filmpjes.");
