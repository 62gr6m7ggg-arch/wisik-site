import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

export const digest = bytes => createHash("sha256").update(bytes).digest("hex");
export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}

export function snapshotFlirtSources(root, catalog, misconceptions) {
  const entries = [];
  for (const video of catalog.videos.filter(item => item.status === "published")) {
    const code = video.target.misconceptionCode;
    const assets = { video: video.source.url, poster: video.posterSrc, captions: video.captionsSrc, transcript: video.transcriptUrl };
    const fingerprints = { misconception: digest(canonicalJson(misconceptions[code])), catalogItem: digest(canonicalJson(video)) };
    for (const [kind, route] of Object.entries(assets)) {
      // Deze beoordeelde serie is lokaal gehost. Een andere bron vraagt een nieuwe reviewprocedure.
      if (typeof route !== "string" || !route.startsWith("/films/rekenklaar/") || route.includes("..") || /[?#]/.test(route)) throw new Error(`${code}: ${kind} heeft geen lokale beoordeelbare bron`);
      fingerprints[kind] = digest(fs.readFileSync(path.join(root, "public", route)));
    }
    entries.push({ code, videoId: video.id, title: video.title, fingerprints });
  }
  return entries;
}

export function verifyFlirtContentReview(review, snapshot, codes) {
  const failures = [];
  const entries = Array.isArray(review?.entries) ? review.entries : [];
  if (review?.schemaVersion !== 1 || !review.reviewedAt || !review.reviewer || !review.scope?.limitations) failures.push("Methode, datum of begrenzing van inhoudsreview ontbreekt");
  if (canonicalJson(entries.map(e => e.code).sort()) !== canonicalJson([...codes].sort())) failures.push("De inhoudsreview dekt niet exact ieder canoniek patroon");
  if (new Set(snapshot.map(e => e.code)).size !== snapshot.length || snapshot.length !== entries.length) failures.push("Publicaties en inhoudsreview zijn niet één-op-één gekoppeld");
  for (const current of snapshot) {
    const reviewed = entries.find(entry => entry.code === current.code);
    if (!reviewed) { failures.push(`${current.code}: inhoudsreview ontbreekt`); continue; }
    if (!['aligned','aligned-with-notes','mismatch'].includes(reviewed.verdict)) failures.push(`${current.code}: inhoudelijk oordeel ontbreekt`);
    for (const field of ['expectedMisconception','intendedInsight','observedContent','captionEvidence']) if (typeof reviewed[field] !== 'string' || reviewed[field].trim().length < 15) failures.push(`${current.code}: ${field} ontbreekt`);
    if (!Array.isArray(reviewed.visualEvidence) || !reviewed.visualEvidence.length) failures.push(`${current.code}: beeldbewijs ontbreekt`);
    if (!Array.isArray(reviewed.notes) || (reviewed.verdict !== 'aligned' && !reviewed.notes.length)) failures.push(`${current.code}: inhoudelijke kanttekening ontbreekt`);
    if (reviewed.videoId !== current.videoId || reviewed.title !== current.title) failures.push(`${current.code}: film of titel verschilt van de inhoudsreview`);
    for (const [part, hash] of Object.entries(current.fingerprints)) {
      if (reviewed.fingerprints?.[part] !== hash) failures.push(`${current.code}: ${part} gewijzigd — inhoudelijke herbeoordeling nodig`);
    }
  }
  const count = verdict => entries.filter(entry => entry.verdict === verdict).length;
  return {
    passed: failures.length === 0, failures,
    // Een ongewijzigde review is geen inhoudelijk groen licht voor bekende beeldproblemen.
    contentStatus: count('mismatch') ? 'revision-needed' : count('aligned-with-notes') ? 'reviewed-with-notes' : 'aligned',
    counts: { reviewed: entries.length, aligned: count('aligned'), withNotes: count('aligned-with-notes'), needsRevision: count('mismatch') },
  };
}

export function auditFlirtContent(root, catalog, misconceptions) {
  const review = JSON.parse(fs.readFileSync(path.join(root, 'public/assets/data/flirt-content-review.json'), 'utf8'));
  const snapshot = snapshotFlirtSources(root, catalog, misconceptions);
  return { ...verifyFlirtContentReview(review, snapshot, Object.keys(misconceptions)), review, snapshot };
}
