import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function localAsset(url) {
  assert.match(url, /^\/films\/rekenklaar\/[A-D]\d{2}\/(?:flirt\.mp4|poster\.jpg|captions\.vtt|transcript\.html)$/);
  const local = path.join(root, 'public', url.slice(1));
  assert.ok(fs.existsSync(local), `Publicatiebestand ontbreekt: ${url}`);
  assert.ok(fs.statSync(local).isFile(), `Publicatiebestand is geen bestand: ${url}`);
  return local;
}

function probe(file) {
  return JSON.parse(execFileSync('ffprobe', [
    '-v', 'error', '-show_entries', 'stream=codec_type,codec_name:format=duration',
    '-of', 'json', file,
  ], { encoding: 'utf8', timeout: 30000, maxBuffer: 1000000 }));
}

function audioLevel(file) {
  // Keep stderr to retrieve volumedetect's max_volume diagnostic.
  const response = spawnSync('ffmpeg', [
    '-hide_banner', '-nostats', '-i', file, '-map', '0:a:0', '-vn',
    '-af', 'volumedetect', '-f', 'null', '-',
  ], { encoding: 'utf8', timeout: 60000, maxBuffer: 400000 });
  if (response.error) throw response.error;
  assert.equal(response.status, 0, `Audio kan niet gedecodeerd worden: ${file}\n${response.stderr}`);
  const match = response.stderr.match(/max_volume:\s*(-?[\d.]+) dB/);
  assert.ok(match, `Meetbaar geluid ontbreekt: ${file}`);
  const volume = Number(match[1]);
  assert.ok(Number.isFinite(volume) && volume > -60, `Ingebedde audio is praktisch stil (${volume} dB): ${file}`);
  return volume;
}
function lastCaptionEnd(captions) {
  const times = [...captions.matchAll(/-->\s*((?:\d\d:)?\d\d:\d\d[.,]\d{3})/g)];
  assert.ok(times.length > 0, 'De ondertiteling heeft geen tijdcodes');
  const last = times.at(-1)[1].replace(',', '.').split(':').map(Number);
  return last.reduce((secs, part) => secs * 60 + part, 0);
}

const catalog = JSON.parse(fs.readFileSync(path.join(root, 'public/assets/data/grabbelton-videos.json'), 'utf8'));
const selectedCodes = process.env.WISIK_FLIRT_CODES?.split(',').filter(Boolean);
const roadies = catalog.videos.filter(video => selectedCodes ? selectedCodes.includes(video.target?.misconceptionCode) : video.audioMode === 'embedded');
if (selectedCodes) assert.equal(roadies.length, selectedCodes.length, 'Onbekende of dubbele flirtcode');
assert.ok(roadies.length > 0, 'Roadie-catalogus is onverwacht leeg');
const checked = new Set();
for (const video of roadies) {
  const code = video.target?.misconceptionCode;
  assert.match(code || '', /^[A-D]\d{2}$/, 'Ongeldige Roadie-code');
  assert.ok(!checked.has(code), `Dubbele Roadie-code: ${code}`);
  checked.add(code);
  const media = localAsset(video.source?.url);
  const poster = localAsset(video.posterSrc);
  const subtitles = localAsset(video.captionsSrc);
  const transcript = localAsset(video.transcriptUrl);
  assert.ok(fs.statSync(poster).size > 1000, `${code}: poster is leeg`);
  assert.ok(fs.statSync(transcript).size > 100, `${code}: transcript is leeg`);
  const info = probe(media);
  const types = new Set(info.streams.map(stream => stream.codec_type));
  assert.ok(types.has('video'), `${code}: geen videostream`);
  if (video.audioMode === 'embedded') assert.ok(types.has('audio'), `${code}: geen ingebedde audiostream`);
  const duration = Number(info.format?.duration);
  assert.ok(duration > 2 && duration < 600, `${code}: ongeldige speelduur`);
  assert.ok(Math.abs(duration - video.durationSeconds) < 5, `${code}: catalogusduur wijkt af van video (${duration})`);
  const captions = fs.readFileSync(subtitles, 'utf8');
  assert.ok(captions.trimStart().startsWith('WEBVTT'), `${code}: ondertitels zijn geen VTT`);
  assert.ok(lastCaptionEnd(captions) <= duration + 5, `${code}: ondertitels lopen na de film door`);
  const peak = video.audioMode === 'embedded' ? audioLevel(media) : 'legacy';
  assert.match(fs.readFileSync(transcript, 'utf8'), /<meta\s+name=["']viewport["']/i, `${code}: mobiel transcript mist viewport`);
  console.log(`${code}: video ${duration.toFixed(2)}s, audio max ${peak} dB, VTT/poster/transcript gecontroleerd.`);
}
console.log(`Roadie-filmcontrole geslaagd voor ${roadies.length} gepubliceerde Roadie-films.`);
