import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const review = JSON.parse(fs.readFileSync(path.join(root, "tests/pabo-eigenstem-review-2026-09-09.json"), "utf8"));
const audioPath = path.join(root, review.output.path);
const fail = message => { console.error(`Eigenstem-releasecontrole MISLUKT: ${message}`); process.exit(1); };

if (!fs.existsSync(audioPath)) fail("masteraudio ontbreekt");
const bytes = fs.readFileSync(audioPath);
if (bytes.length !== review.output.bytes) fail(`bestandsgrootte ${bytes.length} wijkt af van ${review.output.bytes}`);
const sha = createHash("sha256").update(bytes).digest("hex");
if (sha !== review.output.sha256) fail("SHA-256 van masteraudio wijkt af");

const expected = [
  "A01","A02","A03","A04","A05","A06","A07","A08",
  "B01","B02","B03","B04","B05","B06","B07","B08",
  "C01","C02","C03","C04","C05","C06","C07",
  "D01","D02","D03","D04","D05","D06","D07"
];
const prepared = Object.keys(review.clips).sort();
if (JSON.stringify(prepared) !== JSON.stringify([...expected].sort())) fail("segmentmapping dekt niet exact alle 30 codes");

const core = fs.readFileSync(path.join(root, "public/assets/js/grabbelton-core.js"), "utf8");
const match = core.match(/const OWN_VOICE = Object\.freeze\((\{[^\n]+\})\);/);
if (!match) fail("OWN_VOICE-mapping ontbreekt in grabbelton-core.js");
const mapped = JSON.parse(match[1]);
if (JSON.stringify(mapped) !== JSON.stringify(review.clips)) fail("spelermapping wijkt af van het gecontroleerde segmentoverzicht");
if (!core.includes(`const OWN_VOICE_RELEASE = "${review.release}"`)) fail("release-id in speler wijkt af");

for (const page of ["public/grabbelton/index.html", "public/apps/pabo-rekenklaar/index.html"]) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  if (!html.includes("grabbelton-core.js?v=0.1.20-eigenstem-20260909")) fail(`${page} mist de eigenstem-cacheversie`);
}

console.log(`Eigenstem-releasecontrole geslaagd: ${prepared.length} codes, ${bytes.length} bytes, SHA-256 ${sha}.`);
