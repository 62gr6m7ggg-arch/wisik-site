import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createHash, webcrypto } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const paboPath = path.join(root, "public/apps/pabo-rekenklaar/index.html");
const reportPath = path.join(root, "public/assets/data/pabo-release-audit.json");
const writeReport = process.argv.includes("--write");

const html = fs.readFileSync(paboPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const script = html.match(/<script>([\s\S]*)<\/script>/)?.[1];
if (!script) throw new Error("De applicatiescriptcode van Pabo Rekenklaar ontbreekt.");

function createAuditContext() {
  const element = new Proxy(
    {
      classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
      style: {}, dataset: {}, addEventListener() {}, setAttribute() {}, removeAttribute() {},
      focus() {}, getContext() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; },
    },
    { get: (target, key) => (key in target ? target[key] : "") },
  );
  const storage = {};
  const sandboxMath = Object.create(Math);
  sandboxMath.random = Math.random;
  const context = {
    console, Math: sandboxMath, Date, JSON, Object, Array, Number, String, Boolean, RegExp, Map, Set,
    URL, URLSearchParams, TextEncoder, crypto: webcrypto, performance: { now: () => Date.now() },
    location: { search: "", href: "https://wisik.nl/apps/pabo-rekenklaar/" },
    document: {
      title: "Pabo Rekenklaar vrijgavecontrole", body: element, documentElement: element,
      scripts: [{ textContent: script }],
      getElementById: () => element, querySelector: () => element, querySelectorAll: () => [], addEventListener() {},
    },
    localStorage: { getItem: (key) => storage[key] ?? null, setItem: (key, value) => { storage[key] = value; } },
    sessionStorage: { getItem() { return null; }, setItem() {} }, navigator: {},
    setTimeout() {}, clearTimeout() {}, requestAnimationFrame() {}, AudioContext() {},
    speechSynthesis: {}, SpeechSynthesisUtterance() {},
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(script, context, { timeout: 20_000 });
  if (!context.PaboRekenklaarQA) throw new Error("De openbare kwaliteits-API van Pabo Rekenklaar ontbreekt.");
  return context;
}

function runInAuditContext(context, expression, timeout = 120_000) {
  return JSON.parse(JSON.stringify(vm.runInContext(expression, context, { timeout })));
}

function withoutTimestamp(report) {
  const copy = structuredClone(report);
  delete copy.generatedAt;
  return copy;
}

const context = createAuditContext();
const quality = runInAuditContext(context, "PaboRekenklaarQA.runQualityAudit({samplesPerCombination:100,seed:12062026})");
const replay = runInAuditContext(context, "PaboRekenklaarQA.runQualityAudit({samplesPerCombination:100,seed:12062026})");
const diagnostic = runInAuditContext(context, "PaboRekenklaarQA.runDiagnosticAudit({samplesPerPattern:20})");
const naturalClassification = runInAuditContext(context, `(() => {
  const result = { checks: 0, unambiguousMatches: 0, ambiguousSuppressed: 0, coveredCodes: [], failures: [] };
  const coveredCodes = new Set();
  const originalRandom = Math.random;
  Math.random = seededRandom(21062026);
  try {
    for (const [domain, generators] of Object.entries(QUESTION_BANK)) {
      for (const generator of generators) {
        for (const mode of generator.modes) {
          for (const level of generator.levels) {
            for (let index = 0; index < 160; index++) {
              const question = finalizeGeneratedQuestion(generator.fn(level, mode), {
                domain, mode, requestedLevel: level, effectiveLevel: level, generator
              });
              for (const code of question.diagnosticCodes || []) {
                coveredCodes.add(code);
                const response = PaboRekenklaarQA.diagnosticTestResponseFor(question, code);
                const classification = response === null ? null : PaboRekenklaarQA.classifyIncorrectResponse(question, response);
                result.checks++;
                if (classification?.kind === "pattern" && classification.code === code) result.unambiguousMatches++;
                else if (classification?.kind === "ambiguous" && classification.codes?.includes(code)) result.ambiguousSuppressed++;
                else if (result.failures.length < 25) result.failures.push(code + " wordt in een natuurlijke vraag verkeerd teruggeclassificeerd");
              }
            }
          }
        }
      }
    }
  } finally {
    Math.random = originalRandom;
  }
  result.coveredCodes = [...coveredCodes].sort();
  return result;
})()`);
const visualAudit = runInAuditContext(context, `(() => {
  const result = { charts: 0, exactReadableCharts: 0, failures: [] };
  const originalRandom = Math.random;
  Math.random = seededRandom(22062026);
  try {
    for (const [domain, generators] of Object.entries(QUESTION_BANK)) {
      for (const generator of generators) {
        for (const mode of generator.modes) {
          for (const level of generator.levels) {
            for (let index = 0; index < 100; index++) {
              const question = finalizeGeneratedQuestion(generator.fn(level, mode), {
                domain, mode, requestedLevel: level, effectiveLevel: level, generator
              });
              if (!["bar", "line"].includes(question.visualMeta?.kind)) continue;
              result.charts++;
              if (question.visualMeta.exactReadable) result.exactReadableCharts++;
              const markup = String(question.visual || "");
              if (!/<svg\\b/.test(markup) || !/viewBox=/.test(markup) || !/role="img"/.test(markup) || !/<desc>/.test(markup)) {
                result.failures.push(question.generator + " mist complete, toegankelijke grafiekmarkering");
              }
            }
          }
        }
      }
    }
  } finally {
    Math.random = originalRandom;
  }
  return result;
})()`);
const sourceIssues = runInAuditContext(context, "PaboRekenklaarQA.sourceIntegrityIssues()");
const duplicateDeclarations = runInAuditContext(context, "PaboRekenklaarQA.duplicateTopLevelFunctionNames()");
const entryContract = runInAuditContext(context, `({
  moshpit: PaboRekenklaarQA.resolveWisikEntry(new URLSearchParams("ingang=moshpit&modus=sprint")),
  incomplete: PaboRekenklaarQA.resolveWisikEntry(new URLSearchParams("ingang=moshpit")),
  unknown: PaboRekenklaarQA.resolveWisikEntry(new URLSearchParams("ingang=anders&modus=sprint"))
})`);
const sprintDeadlineContract = runInAuditContext(context, `({
  before: PaboRekenklaarQA.sprintDeadlineExpired({kind:"sprint",endsAt:1000},999),
  at: PaboRekenklaarQA.sprintDeadlineExpired({kind:"sprint",endsAt:1000},1000),
  after: PaboRekenklaarQA.sprintDeadlineExpired({kind:"sprint",endsAt:1000},1001),
  ordinaryPractice: PaboRekenklaarQA.sprintDeadlineExpired({kind:"practice",endsAt:1000},1001)
})`);
const sprintQuestionAudit = runInAuditContext(context, `(() => {
  const result = { checks: 0, fallbacks: 0, failures: [] };
  const originalRandom = Math.random;
  Math.random = seededRandom(5092026);
  try {
    for (const domain of ["A", "B", "C"]) {
      for (const level of [1, 2, 3]) {
        for (let index = 0; index < 250; index++) {
          const question = PaboRekenklaarQA.generateSprintQuestion(domain, level);
          result.checks++;
          if (question.generatedByFallback) result.fallbacks++;
          if (!PaboRekenklaarQA.isSprintQuestion(question) && result.failures.length < 25) {
            result.failures.push({ domain, level, type: question.type, mode: question.mode, visual: Boolean(question.visual) });
          }
        }
      }
    }
  } finally {
    Math.random = originalRandom;
  }
  return result;
})()`);
const toolVersion = String(context.PaboRekenklaarQA.version || "");

const answerContract = /issues\.push\(\.\.\.validateQualityRule\(q\)\)/.test(script)
  && /canoniek antwoord faalt in antwoordcontrole/.test(script);
const ambiguityContract = /meerkeuzeopties zijn niet uniek/.test(script)
  && /relatieve vergelijking klopt niet of is niet uniek/.test(script);
const graphContract = /exact af te lezen waarde ligt niet op een rasterlijn/.test(script)
  && /rasterlijnen liggen op mobiel te dicht bij elkaar/.test(script);
const diagnosticSafetyContract = /if\(classification\.kind!=="pattern"\)return classification/.test(script);
const moshpitSafetyContract = entryContract.moshpit === "moshpit-sprint"
  && entryContract.incomplete === null
  && entryContract.unknown === null
  && /if\(activeSession\.kind==="sprint"\)\{domain=pick\(\["A","B","C"\]\);mode="head"\}/.test(script)
  && /const countsAsLearningEvidence=s\.kind!=="sprint"/.test(script)
  && /countMistakes:countsAsLearningEvidence/.test(script)
  && sprintDeadlineContract.before === false
  && sprintDeadlineContract.at === true
  && sprintDeadlineContract.after === true
  && sprintDeadlineContract.ordinaryPractice === false
  && /if\(s\.kind==="sprint"&&expireSprintIfNeeded\(\)\)return;const q=s\.current/.test(script)
  && sprintQuestionAudit.checks === 2250
  && sprintQuestionAudit.failures.length === 0;
const deterministicReplay = JSON.stringify(quality) === JSON.stringify(replay);

const gates = [
  {
    id: "source-integrity",
    label: "Bron en declaraties",
    passed: sourceIssues.length === 0 && duplicateDeclarations.length === 0 && moshpitSafetyContract,
    evidence: `${sourceIssues.length} bronproblemen; ${duplicateDeclarations.length} dubbele functies; ${sprintQuestionAudit.checks} veilige sprintvragen; Moshpit-ingang ${moshpitSafetyContract ? "veilig begrensd" : "onveilig"}`,
  },
  {
    id: "generated-variants",
    label: "Gegenereerde vraagvarianten",
    passed: quality.passed && quality.counts.questions >= 16_000 && quality.counts.combinations >= 170 && ambiguityContract,
    evidence: `${quality.counts.questions.toLocaleString("nl-NL")} vragen in ${quality.counts.combinations} combinaties`,
  },
  {
    id: "reproducible-answers",
    label: "Herberekenbare antwoorden",
    passed: quality.passed && deterministicReplay && answerContract,
    evidence: "Vaste seed tweemaal gelijk; canonieke antwoorden en rekenregels herberekend",
  },
  {
    id: "no-fallbacks",
    label: "Geen terugvalvragen",
    passed: quality.counts.fallbacks === 0,
    evidence: `${quality.counts.fallbacks} terugvalvragen aangetroffen`,
  },
  {
    id: "readable-graphs",
    label: "Afleesbare grafieken",
    passed: quality.passed && graphContract && visualAudit.charts > 0 && visualAudit.failures.length === 0,
    evidence: `${visualAudit.charts.toLocaleString("nl-NL")} grafiekinstanties; rasterwaarden, asschaal, mobiele pixelafstand en toegankelijke SVG-markering gecontroleerd`,
  },
  {
    id: "diagnostic-patterns",
    label: "Diagnostische patronen",
    passed: diagnostic.passed && diagnostic.counts.patterns === 30 && diagnostic.counts.naturalCoverage === 30
      && naturalClassification.coveredCodes.length === 30 && naturalClassification.checks > 0
      && naturalClassification.failures.length === 0 && diagnosticSafetyContract,
    evidence: `${diagnostic.counts.patterns} patronen; ${diagnostic.counts.naturalCoverage}/30 natuurlijke dekking; ${diagnostic.counts.probes} controlevragen; ${naturalClassification.checks} natuurlijke classificatiechecks; ${naturalClassification.ambiguousSuppressed} dubbelzinnige gevallen veilig zonder diagnose`,
  },
];

const passed = gates.every((gate) => gate.passed);
const report = {
  schemaVersion: 1,
  auditVersion: "1.1.0",
  siteVersion: packageJson.version,
  tool: "Pabo Rekenklaar",
  toolVersion,
  generatedAt: new Date().toISOString(),
  status: passed ? "passed" : "failed",
  configuration: {
    generatorSeed: 12062026,
    samplesPerCombination: 100,
    diagnosticSamplesPerPattern: 20,
  },
  counts: {
    generatedQuestions: quality.counts.questions,
    generatorCombinations: quality.counts.combinations,
    rubricSelections: quality.counts.rubricSelections,
    fallbackQuestions: quality.counts.fallbacks,
    diagnosticPatterns: diagnostic.counts.patterns,
    diagnosticProbes: diagnostic.counts.probes,
    naturalDiagnosticCoverage: diagnostic.counts.naturalCoverage,
    naturalClassificationChecks: naturalClassification.checks,
    unambiguousDiagnosticMatches: naturalClassification.unambiguousMatches,
    ambiguousDiagnosticsSuppressed: naturalClassification.ambiguousSuppressed,
    chartInstances: visualAudit.charts,
    exactReadableChartInstances: visualAudit.exactReadableCharts,
    sprintQuestionChecks: sprintQuestionAudit.checks,
    sprintFallbackQuestions: sprintQuestionAudit.fallbacks,
  },
  gates,
  failures: [
    ...sourceIssues.map((issue) => ({ area: "source", issue })),
    ...quality.failures.slice(0, 25).map((failure) => ({ area: "generator", issue: failure })),
    ...diagnostic.failures.slice(0, 25).map((failure) => ({ area: "diagnostiek", issue: failure })),
    ...naturalClassification.failures.slice(0, 25).map((failure) => ({ area: "natuurlijke-diagnostiek", issue: failure })),
    ...visualAudit.failures.slice(0, 25).map((failure) => ({ area: "grafiek", issue: failure })),
    ...sprintQuestionAudit.failures.slice(0, 25).map((failure) => ({ area: "moshpit", issue: failure })),
  ],
  scope: "Sterke deterministische regressie- en consistentiecontrole. Dit is geen bewijs van leerwinst, geen empirische kalibratie en geen vervanging voor vakdidactische of mobiele gebruikerstests.",
  source: {
    file: "/apps/pabo-rekenklaar/index.html",
    sha256: createHash("sha256").update(html).digest("hex"),
  },
  provenance: {
    auditScript: "scripts/audit-pabo-release.mjs",
    requiredWorkflow: ".github/workflows/quality.yml",
    publicReport: "/assets/data/pabo-release-audit.json",
  },
};

if (!passed) {
  console.error("Pabo-vrijgavecontrole MISLUKT.");
  for (const gate of gates.filter((item) => !item.passed)) console.error(`- ${gate.label}: ${gate.evidence}`);
  for (const failure of report.failures.slice(0, 10)) console.error(`- ${failure.area}: ${JSON.stringify(failure.issue)}`);
  process.exit(1);
}

let existing = null;
if (fs.existsSync(reportPath)) {
  try { existing = JSON.parse(fs.readFileSync(reportPath, "utf8")); } catch { existing = null; }
}

if (writeReport) {
  if (existing && JSON.stringify(withoutTimestamp(existing)) === JSON.stringify(withoutTimestamp(report))) {
    report.generatedAt = existing.generatedAt;
  }
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Openbaar auditbewijs bijgewerkt voor Pabo Rekenklaar ${toolVersion}.`);
} else {
  if (!existing || JSON.stringify(withoutTimestamp(existing)) !== JSON.stringify(withoutTimestamp(report))) {
    console.error("Het openbare Backstage-auditbewijs ontbreekt of is niet actueel. Voer npm run audit:update uit.");
    process.exit(1);
  }
  console.log(`Pabo-vrijgavecontrole geslaagd en openbaar auditbewijs is actueel voor versie ${toolVersion}.`);
}
