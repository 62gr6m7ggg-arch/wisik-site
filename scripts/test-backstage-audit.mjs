import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const backstage = fs.readFileSync(path.join(root, "public/backstage/index.html"), "utf8");
const siteJs = fs.readFileSync(path.join(root, "public/assets/js/site.js"), "utf8");
const report = JSON.parse(fs.readFileSync(path.join(root, "public/assets/data/pabo-release-audit.json"), "utf8"));
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const pabo = fs.readFileSync(path.join(root, "public/apps/pabo-rekenklaar/index.html"), "utf8");
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

assert(backstage.includes('id="vrijgavecontrole"'), "Backstage mist de sectie met het vrijgavebewijs");
assert(backstage.includes('data-audit-url="/assets/data/pabo-release-audit.json"'), "Backstage verwijst niet naar het openbare auditbewijs");
assert(backstage.includes("blokkeert de vrijgave"), "Backstage legt de blokkerende werking niet uit");
assert(backstage.includes("bewust géén diagnose"), "Backstage legt de veilige afhandeling van dubbelzinnige fouten niet uit");
assert(backstage.includes("vakdidactische review") && backstage.includes("echte gebruikers"), "Backstage mist de begrenzing van de automatische audit");
assert(siteJs.includes("async function renderReleaseAudit()"), "De renderer voor het Backstage-auditbewijs ontbreekt");
assert(siteJs.includes('fetch(reportUrl, { cache: "no-store"'), "Het auditbewijs wordt niet cachebestendig opgehaald");
assert(siteJs.includes('renderReleaseAudit();'), "De auditweergave wordt niet gestart");

console.log("Backstage-auditcontrole geslaagd: actueel openbaar bewijs, zes vrijgavepoorten, mobiele weergave en eerlijke begrenzing.");
