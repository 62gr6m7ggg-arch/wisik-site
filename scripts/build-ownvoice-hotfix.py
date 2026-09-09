from pathlib import Path
import hashlib
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
REVIEW_PATH = ROOT / "tests/pabo-eigenstem-review-2026-09-09.json"
CORE_PATH = ROOT / "public/assets/js/grabbelton-core.js"
MASTER_PATH = ROOT / "public/assets/audio/flirts-eigenstem-2026-09-09.m4a"
OUT_DIR = ROOT / "public/assets/audio/eigenstem-2026-09-09-r2"
PACKAGE_PATH = ROOT / "package.json"
TEST_PATH = ROOT / "scripts/test-ownvoice-release.mjs"
SITE_VERSION = "0.1.22"
RELEASE = "eigenstem-2026-09-09-r2"
EXPECTED = [
    "A01","A02","A03","A04","A05","A06","A07","A08",
    "B01","B02","B03","B04","B05","B06","B07","B08",
    "C01","C02","C03","C04","C05","C06","C07",
    "D01","D02","D03","D04","D05","D06","D07",
]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def probe_duration(path: Path) -> float:
    value = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(path)
    ], text=True).strip()
    return float(value)


def split_audio(review: dict) -> tuple[dict, dict]:
    master_clips = review.get("masterClips") or review["clips"]
    if sorted(master_clips) != sorted(EXPECTED):
        raise RuntimeError("Mastersegmenten dekken niet exact de 30 verwachte codes")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    mapping = {}
    files = {}
    for code in EXPECTED:
        cfg = master_clips[code]
        start = float(cfg["start"])
        duration = float(cfg["duration"])
        out = OUT_DIR / f"{code}.m4a"
        subprocess.run([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-ss", f"{start:.3f}", "-i", str(MASTER_PATH), "-t", f"{duration:.3f}",
            "-map_metadata", "-1", "-vn", "-ac", "1", "-ar", "24000",
            "-c:a", "aac", "-b:a", "40k", "-movflags", "+faststart", str(out)
        ], check=True)
        subprocess.run([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(out), "-f", "null", "-"
        ], check=True)
        actual = probe_duration(out)
        if abs(actual - duration) > 0.20:
            raise RuntimeError(f"{code}: gesplitste duur {actual:.3f}s wijkt te veel af van {duration:.3f}s")
        rel = "/" + out.relative_to(ROOT / "public").as_posix()
        mapping[code] = {
            "src": rel,
            "duration": round(actual, 3),
            "contentStart": cfg["contentStart"],
            "contentDuration": cfg["contentDuration"],
        }
        files[code] = {
            "path": out.relative_to(ROOT).as_posix(),
            "bytes": out.stat().st_size,
            "sha256": sha256(out),
            "durationSeconds": round(actual, 3),
        }
    return master_clips, mapping, files


def patch_core(mapping: dict) -> None:
    text = CORE_PATH.read_text()
    text, n = re.subn(
        r'  const OWN_VOICE_RELEASE = "[^"]+";\n  const OWN_VOICE = Object\.freeze\(\{[^\n]+\}\);',
        '  const OWN_VOICE_RELEASE = ' + json.dumps(RELEASE) + ';\n  const OWN_VOICE = Object.freeze(' + json.dumps(mapping, ensure_ascii=False, separators=(",", ":")) + ');',
        text,
        count=1,
    )
    if n != 1:
        raise RuntimeError("OWN_VOICE-config kon niet eenduidig worden vervangen")

    new_function = r'''  function attachOwnVoice(player) {
    if (!(player instanceof BrowserVideoElement) || player.dataset.wisikOwnVoice === "1") return;
    const code = codeFromVideo(player);
    const config = OWN_VOICE[code];
    if (!config) return;
    player.dataset.wisikOwnVoice = "1";
    player.dataset.wisikOwnVoiceRelease = OWN_VOICE_RELEASE;
    player.muted = true;
    player.defaultMuted = true;
    const audio = new BrowserAudio(versionedAssetUrl(config.src, globalThis.WISIK_SITE_VERSION || OWN_VOICE_RELEASE));
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    audio.setAttribute("aria-hidden", "true");
    let rate = 1;
    let voiceDuration = config.duration;
    let syncing = false;
    const targetAudioTime = () => Math.max(0, Math.min(Math.max(0, voiceDuration - 0.04), player.currentTime / Math.max(rate, 0.01)));
    const syncAudio = (force = false) => {
      if (!Number.isFinite(player.currentTime)) return false;
      const target = targetAudioTime();
      const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
      if (force || Math.abs(current - target) > 0.8) {
        try { audio.currentTime = target; } catch { return false; }
      }
      return true;
    };
    const configure = () => {
      if (!Number.isFinite(player.duration) || player.duration <= 0) return;
      if (Number.isFinite(audio.duration) && audio.duration > 0) voiceDuration = audio.duration;
      rate = Math.min(2, Math.max(0.35, player.duration / voiceDuration));
      syncing = true;
      player.defaultPlaybackRate = rate;
      player.playbackRate = rate;
      syncing = false;
      retimeCaptions(player, { ...config, duration: voiceDuration }, rate);
    };
    player.addEventListener("loadedmetadata", configure);
    audio.addEventListener("loadedmetadata", () => {
      configure();
      if (player.currentTime > 0.25) syncAudio(true);
    });
    if (player.readyState >= 1) configure();
    player.addEventListener("ratechange", () => {
      if (!syncing && Math.abs(player.playbackRate - rate) > 0.001) {
        syncing = true;
        player.playbackRate = rate;
        syncing = false;
      }
    });
    player.addEventListener("play", async () => {
      if (activeBinding && activeBinding.player !== player) {
        activeBinding.player.pause();
        activeBinding.audio.pause();
      }
      activeBinding = { player, audio };
      syncAudio(false);
      audio.volume = player.volume;
      try { await audio.play(); }
      catch (error) {
        player.pause();
        player.dataset.wisikAudioError = "1";
        console.error("De eigen stem kon niet worden gestart.", error);
      }
    });
    player.addEventListener("pause", () => audio.pause());
    player.addEventListener("ended", () => {
      audio.pause();
      if (activeBinding?.player === player) activeBinding = null;
    });
    player.addEventListener("seeking", () => audio.pause());
    player.addEventListener("seeked", () => {
      syncAudio(true);
      if (!player.paused) audio.play().catch(() => player.pause());
    });
    player.addEventListener("volumechange", () => {
      audio.volume = player.volume;
      player.muted = true;
    });
    audio.addEventListener("ended", () => {
      if (!player.ended && !player.paused) player.currentTime = player.duration;
    });
    audio.addEventListener("error", () => {
      player.pause();
      player.dataset.wisikAudioError = "1";
    });
  }'''
    text, n = re.subn(
        r'  function attachOwnVoice\(player\) \{[\s\S]*?\n  \}\n\n  function scanForOwnVoice',
        new_function + '\n\n  function scanForOwnVoice',
        text,
        count=1,
    )
    if n != 1:
        raise RuntimeError("attachOwnVoice kon niet eenduidig worden vervangen")
    if 'player.addEventListener("timeupdate"' in text:
        raise RuntimeError("Continue timeupdate-seeking is nog aanwezig")
    CORE_PATH.write_text(text)


def patch_site_version() -> None:
    package = json.loads(PACKAGE_PATH.read_text())
    old = package["version"]
    package["version"] = SITE_VERSION
    PACKAGE_PATH.write_text(json.dumps(package, ensure_ascii=False, indent=2) + "\n")
    lock = ROOT / "package-lock.json"
    if lock.exists():
        data = json.loads(lock.read_text())
        data["version"] = SITE_VERSION
        if isinstance(data.get("packages", {}).get(""), dict):
            data["packages"][""]["version"] = SITE_VERSION
        lock.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    for path in (ROOT / "public").rglob("*"):
        if not path.is_file() or path.suffix.lower() not in {".html", ".js", ".json", ".css", ".webmanifest", ".txt"}:
            continue
        try:
            text = path.read_text()
        except UnicodeDecodeError:
            continue
        updated = text.replace(old, SITE_VERSION)
        if updated != text:
            path.write_text(updated)


def write_release_test() -> None:
    TEST_PATH.write_text(r'''import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
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
  if (!html.includes("grabbelton-core.js?v=0.1.22")) fail(`${page} mist cacheversie 0.1.22`);
}
console.log(`Eigenstem-releasecontrole geslaagd: 30 losse M4A-bestanden, geen master-seeking, bronhash ${review.output.sha256}.`);
''')


def main() -> None:
    if not MASTER_PATH.exists():
        raise RuntimeError("Masteraudio ontbreekt")
    review = json.loads(REVIEW_PATH.read_text())
    master_clips, mapping, files = split_audio(review)
    patch_core(mapping)
    review["masterClips"] = master_clips
    review["clips"] = mapping
    review["release"] = RELEASE
    review["status"] = "per-flirt-files-verified"
    review["delivery"] = {
        "mode": "per-flirt-files",
        "reason": "Voorkomt random seeking en continue resynchronisatie in één lang M4A-bestand, met name op iPhone/Safari.",
        "files": files,
    }
    review.setdefault("checks", {})["splitFilesExpected"] = 30
    review["checks"]["splitFilesVerified"] = True
    REVIEW_PATH.write_text(json.dumps(review, ensure_ascii=False, separators=(",", ":")) + "\n")
    patch_site_version()
    write_release_test()
    print(f"Hotfix voorbereid: {len(files)} losse audiobestanden, siteversie {SITE_VERSION}.")


if __name__ == "__main__":
    main()
