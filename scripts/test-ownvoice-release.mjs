import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteVersion = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version;
const review = JSON.parse(fs.readFileSync(path.join(root, "tests/pabo-eigenstem-review-2026-09-09.json"), "utf8"));
const fail = message => { console.error(`Eigenstem-releasecontrole MISLUKT: ${message}`); process.exit(1); };
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const expected = ["A01","A02","A03","A04","A05","A06","A07","A08","B01","B02","B03","B04","B05","B06","B07","B08","C01","C02","C03","C04","C05","C06","C07","D01","D02","D03","D04","D05","D06","D07"];

const masterPath = path.join(root, review.output.path);
if (!fs.existsSync(masterPath)) fail("masteraudio ontbreekt");
const master = fs.readFileSync(masterPath);
if (master.length !== review.output.bytes || sha256(master) !== review.output.sha256) fail("masteraudio wijkt af van het gecontroleerde bronbestand");
if (review.delivery?.mode !== "per-flirt-files") fail("release gebruikt niet de losse-audiobestandstrategie");
if (JSON.stringify(Object.keys(review.clips).sort()) !== JSON.stringify([...expected].sort())) fail("mapping dekt niet exact alle 30 codes");
if (JSON.stringify(Object.keys(review.delivery.files || {}).sort()) !== JSON.stringify([...expected].sort())) fail("bestandsbewijs dekt niet exact alle 30 codes");

for (const code of expected) {
  const cfg = review.clips[code];
  const evidence = review.delivery.files[code];
  if (cfg.start !== undefined) fail(`${code}: spelerconfig bevat nog een masteraudio-starttijd`);
  if (!cfg.src.endsWith(`/${code}.m4a`)) fail(`${code}: bron is geen eigen los audiobestand`);
  const file = path.join(root, evidence.path);
  if (!fs.existsSync(file)) fail(`${code}: audiobestand ontbreekt`);
  const bytes = fs.readFileSync(file);
  if (bytes.length !== evidence.bytes || sha256(bytes) !== evidence.sha256) fail(`${code}: audiobestand wijkt af van reviewbewijs`);
  const moov = bytes.indexOf(Buffer.from("moov"));
  const mdat = bytes.indexOf(Buffer.from("mdat"));
  if (moov < 0 || mdat < 0 || moov > mdat) fail(`${code}: M4A is niet fast-start geschikt`);
}

const core = fs.readFileSync(path.join(root, "public/assets/js/grabbelton-core.js"), "utf8");
const match = core.match(/const OWN_VOICE = Object\.freeze\((\{[^\n]+\})\);/);
if (!match) fail("OWN_VOICE-mapping ontbreekt");
if (JSON.stringify(JSON.parse(match[1])) !== JSON.stringify(review.clips)) fail("spelermapping wijkt af van het gecontroleerde segmentoverzicht");
if (!core.includes(`const OWN_VOICE_RELEASE = "${review.release}"`)) fail("release-id in speler wijkt af");
if (core.includes('player.addEventListener("timeupdate"')) fail("continue resynchronisatie via timeupdate is teruggekeerd");
if (core.includes("config.start +")) fail("speler probeert nog midden in masteraudio te seeken");
for (const page of ["public/grabbelton/index.html", "public/apps/pabo-rekenklaar/index.html"]) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  if (!html.includes(`grabbelton-core.js?v=${siteVersion}`)) fail(`${page} mist cacheversie ${siteVersion}`);
}

// Films met definitieve eigen audio moeten buiten de historische M4A-koppeling blijven.
// Controleer werkelijk spelersgedrag: een ontbrekende bypass zou B04 vertragen,
// muten en zijn al getimede ondertitels opnieuw verdelen.
const createdAudio = [];
class TestVideo {
  constructor(code, duration) {
    this.currentSrc = `https://wisik.nl/films/rekenklaar/${code}/flirt.mp4?v=test`;
    this.dataset = { audioMode: "legacy" };
    this.muted = false;
    this.defaultMuted = false;
    this.playbackRate = 1;
    this.defaultPlaybackRate = 1;
    this.currentTime = 0;
    this.duration = duration;
    this.readyState = 1;
    this.events = new Map();
    this.textTracks = [{ mode: "hidden", cues: [
      { startTime: 0.256, endTime: 1.207 },
      { startTime: 39.927, endTime: 41.816 }
    ] }];
  }
  getAttribute(name) { return name === "src" ? this.currentSrc : null; }
  addEventListener(name, fn) { this.events.set(name, fn); }
  querySelector() { return null; }
}
class TestAudio {
  constructor(src) {
    this.src = src;
    this.duration = Number.NaN;
    this.currentTime = 0;
    this.events = new Map();
    createdAudio.push(this);
  }
  addEventListener(name, fn) { this.events.set(name, fn); }
  setAttribute() {}
}
const mediaContext = { URL, console, HTMLVideoElement: TestVideo, Audio: TestAudio };
vm.runInNewContext(core, mediaContext);
const catalog = JSON.parse(fs.readFileSync(path.join(root, "public/assets/data/grabbelton-videos.json"), "utf8"));
for (const {target: {misconceptionCode: code}, durationSeconds: duration} of catalog.videos.filter(v => v.audioMode === "embedded")) {
  const player = new TestVideo(code, duration);
  player.dataset.audioMode = "embedded";
  const beforeCues = JSON.stringify(player.textTracks);
  const audioCount = createdAudio.length;
  mediaContext.WisikGrabbeltonCore.attachOwnVoice(player);
  player.events.get("loadedmetadata")?.();
  assert.equal(createdAudio.length, audioCount, `${code}: oude losse audio mag niet worden aangemaakt`);
  assert.equal(player.muted, false, `${code}: ingebouwde eigen stem moet hoorbaar blijven`);
  assert.equal(player.defaultMuted, false, `${code}: native audio mag niet standaard gemute worden`);
  assert.equal(player.playbackRate, 1, `${code}: natuurlijke snelheid moet behouden blijven`);
  assert.equal(player.defaultPlaybackRate, 1, `${code}: standaardsnelheid moet 1× blijven`);
  assert.equal(JSON.stringify(player.textTracks), beforeCues, `${code}: definitieve VTT-tijden mogen niet veranderen`);
  assert.equal(player.dataset.wisikOwnVoice, undefined, `${code}: geen historische eigenstem-binding`);
}
const legacy = new TestVideo("A01", 49.72);
mediaContext.WisikGrabbeltonCore.attachOwnVoice(legacy);
assert.equal(createdAudio.length, 1, "A01: de bestaande losse-eigenstemroute moet actief blijven");
assert.ok(createdAudio[0].src.includes("/A01.m4a?v="), "A01: juiste historische audiobron");
assert.equal(legacy.dataset.wisikOwnVoice, "1");
assert.equal(legacy.muted, true);
assert.ok(Math.abs(legacy.playbackRate - 49.72 / review.clips.A01.duration) < 1e-9);
assert.notEqual(legacy.textTracks[0].cues[0].startTime, 0.256, "A01: bestaande captionaanpassing blijft actief");
console.log("Roadie-mediacontrole geslaagd: Alle catalogus-Roadies behouden native audio, snelheid en VTT; A01 behoudt de losse eigenstemroute.");
console.log(`Eigenstem-releasecontrole geslaagd: 30 losse M4A-bestanden, geen master-seeking, bronhash ${review.output.sha256}.`);
