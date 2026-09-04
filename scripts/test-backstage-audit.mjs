import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const backstage = fs.readFileSync(path.join(root, "public/backstage/index.html"), "utf8");
const siteJs = fs.readFileSync(path.join(root, "public/assets/js/site.js"), "utf8");
const report = JSON.parse(fs.readFileSync(path.join(root, "public/assets/data/pabo-release-audit.json"), "utf8"));
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const pabo = fs.readFileSync(path.join(root, "public/apps/pabo-rekenklaar/index.html"), "utf8");
const homepage = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
const headers = fs.readFileSync(path.join(root, "public/_headers"), "utf8");
const paboVersion = pabo.match(/const APP_VERSION\s*=\s*["']([^"']+)["']/)?.[1];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(report.status === "passed", "Het openbare auditbewijs heeft geen geslaagde status");
assert(report.siteVersion === packageJson.version, "Het auditbewijs hoort niet bij de actuele Wisik-versie");
assert(report.toolVersion === paboVersion, "Het auditbewijs hoort niet bij de actuele Pabo Rekenklaar-versie");
assert(report.counts.generatedQuestions >= 16_000, "Te weinig vraagvarianten in het openbare auditbewijs");
assert(report.counts.generatorCombinations >= 170, "Te weinig generatorcombinaties in het openbare auditbewijs");
assert(report.counts.fallbackQuestions === 0, "Het auditbewijs bevat terugvalvragen");
assert(report.counts.diagnosticPatterns === 30, "Het auditbewijs bevat niet alle diagnostische patronen");
assert(report.counts.naturalDiagnosticCoverage === 30, "Niet elk diagnostisch patroon heeft natuurlijke dekking");
assert(report.counts.naturalClassificationChecks > 0, "Natuurlijke diagnostische antwoorden zijn niet teruggeclassificeerd");
assert(report.counts.ambiguousDiagnosticsSuppressed >= 0, "Veilig onderdrukte dubbelzinnige diagnoses ontbreken in het bewijs");

const expectedGates = [
  "source-integrity",
  "generated-variants",
  "reproducible-answers",
  "no-fallbacks",
  "readable-graphs",
  "diagnostic-patterns",
];
for (const id of expectedGates) {
  const gate = report.gates.find((item) => item.id === id);
  assert(gate?.passed === true, `Verplichte auditpoort ${id} ontbreekt of is niet geslaagd`);
}

const instrumentedSiteJs = siteJs.replace(
  '  document.addEventListener("DOMContentLoaded", () => {',
  '  window.__evaluateReleaseAudit = evaluateReleaseAudit;\n\n  document.addEventListener("DOMContentLoaded", () => {'
);
assert(instrumentedSiteJs !== siteJs, "De auditstatusfunctie kon niet voor de negatieve test worden ontsloten");
const auditWindow = { WISIK_SITE_VERSION: packageJson.version, WISIK_TOOLS: [] };
vm.runInNewContext(instrumentedSiteJs, {
  window: auditWindow,
  document: { addEventListener() {} },
  console,
  URL,
  Intl,
  Date,
  Set,
  Array,
  Object,
  String,
  Number,
});
const evaluateReleaseAudit = auditWindow.__evaluateReleaseAudit;
assert(typeof evaluateReleaseAudit === "function", "De auditstatusfunctie is niet uitvoerbaar in de testomgeving");
assert(evaluateReleaseAudit(report, paboVersion).passed === true, "Een compleet geldig rapport krijgt geen groene status");

const incompleteReport = { ...report, gates: report.gates.slice(0, 1) };
assert(evaluateReleaseAudit(incompleteReport, paboVersion).passed === false, "Een rapport met één controle krijgt ten onrechte een groene status");
const duplicateGateReport = { ...report, gates: Array.from({ length: 6 }, () => report.gates[0]) };
assert(evaluateReleaseAudit(duplicateGateReport, paboVersion).passed === false, "Zes dubbele controles krijgen ten onrechte een groene status");
const staleReport = { ...report, siteVersion: "0.0.0" };
const staleState = evaluateReleaseAudit(staleReport, paboVersion);
assert(staleState.passed === false && staleState.stale === true, "Een bewijs van een andere siteversie wordt niet als verouderd herkend");

assert(backstage.includes('id="vrijgavecontrole"'), "Backstage mist de sectie met het vrijgavebewijs");
assert(backstage.includes('data-audit-url="/assets/data/pabo-release-audit.json"'), "Backstage verwijst niet naar het openbare auditbewijs");
assert(backstage.includes('data-release-audit-summary'), "Backstage mist de direct zichtbare vrijgavesamenvatting in de hero");
assert(backstage.includes('href="#vrijgavecontrole"'), "Backstage mist een rechtstreekse sprong naar de vrijgavecontrole");
assert(backstage.indexOf('data-release-audit-summary') < backstage.indexOf('id="roadie"'), "De vrijgavesamenvatting staat niet vóór de lange roadie-sectie");
assert(backstage.includes('scroll-margin-top: 96px'), "De vrijgavecontrole houdt geen ruimte voor de vaste navigatiebalk");
assert(backstage.includes('<noscript>') && backstage.includes('Open het controlebewijs rechtstreeks als JSON'), "Backstage mist een bruikbare no-JavaScript-uitweg");
assert(backstage.includes(`src="/assets/js/site.js?v=${packageJson.version}"`), "Backstage gebruikt geen versiegebonden audit-JavaScript");
assert(backstage.includes("laat de kandidaatvrijgave niet slagen"), "Backstage legt de afwijzende werking van een mislukte audit niet uit");
assert(backstage.includes("verplichte GitHub- en Cloudflare-instellingen"), "Backstage verzwijgt de externe voorwaarden voor volledige publicatieblokkering");
assert(backstage.includes("bewust géén diagnose"), "Backstage legt de veilige afhandeling van dubbelzinnige fouten niet uit");
assert(backstage.includes("vakdidactische review") && backstage.includes("echte gebruikers"), "Backstage mist de begrenzing van de automatische audit");
assert(homepage.includes('/backstage/#vrijgavecontrole') && homepage.includes('Bekijk de live vrijgavecontrole'), "De homepage verwijst niet rechtstreeks naar het live bewijs");
assert(/\/backstage\/\*\s+[\s\S]*Cache-Control:\s*no-cache, no-store, max-age=0, must-revalidate/.test(headers), "Backstage heeft geen expliciete cachebestendige HTML-regel");
assert(siteJs.includes("async function renderReleaseAudit()"), "De renderer voor het Backstage-auditbewijs ontbreekt");
assert(siteJs.includes('fetch(reportUrl, { cache: "no-store"'), "Het auditbewijs wordt niet cachebestendig opgehaald");
assert(siteJs.includes('Online versie gecontroleerd') && siteJs.includes('Bewijs hoort niet bij deze versie'), "De vrijgavestatussen zijn niet precies genoeg geformuleerd");
assert(siteJs.includes('Bekijk alle ${gates.length} controles'), "De zes technische controles zijn niet compact uitklapbaar");
assert(siteJs.includes('vragen doorgerekend') && siteJs.includes('noodvragen gebruikt'), "De kerncijfers missen begrijpelijke labels");
assert(siteJs.includes('renderReleaseAudit();'), "De auditweergave wordt niet gestart");

console.log("Backstage-auditcontrole geslaagd: direct zichtbare hero-status, actueel bewijs, zes vrijgavepoorten, cachebestendige route en eerlijke begrenzing.");
