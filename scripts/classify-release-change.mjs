import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

// Fail closed: only a strictly bounded film/media update may skip the full audit.
const mediaFile = /^public\/films\/rekenklaar\/[A-D]\d{2}\/(?:flirt\.mp4|poster\.jpg|captions\.vtt|transcript\.html)$/;
const metadataFiles = new Set([
  'public/assets/data/grabbelton-videos.json',
  'public/assets/data/flirt-content-review.json',
]);

export function classifyPaths(paths, verifiedFilmCodes = new Set(['A02', 'B03', 'B04'])) {
  if (!Array.isArray(paths) || paths.length === 0) return 'full';
  for (const filename of paths) {
    if (typeof filename !== 'string') return 'full';
    if (metadataFiles.has(filename)) continue;
    if (!mediaFile.test(filename)) return 'full';
    const code = filename.split('/')[3];
    if (!verifiedFilmCodes.has(code)) return 'full';
  }
  return 'roadie';
}

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function diffPaths(event) {
  if (!['pull_request', 'push'].includes(event)) return null;
  let base;
  if (event === 'pull_request') {
    // The checked-out PR synthetic merge commit has the target branch as parent 1.
    base = git('rev-parse', 'HEAD^1');
  } else {
    base = process.env.RELEASE_BEFORE_SHA || '';
    if (!/^[a-f0-9]{40}$/.test(base) || /^0+$/.test(base)) return null;
    try {
      git('cat-file', '-e', `${base}^{commit}`);
    } catch {
      // Pushes may contain multiple commits; compare against the actual before SHA.
      // If fetching fails, the caller selects the complete audit.
      git('fetch', '--no-tags', '--depth=1', 'origin', base);
    }
  }
  const changed = execFileSync('git', ['diff', '--no-renames', '--name-only', '-z', base, 'HEAD']);
  return changed.toString('utf8').split('\0').filter(Boolean);
}

if (process.argv.includes('--self-test')) {
  assert.equal(classifyPaths(['public/films/rekenklaar/B04/flirt.mp4']), 'roadie');
  assert.equal(classifyPaths(['public/films/rekenklaar/B04/flirt.mp4', 'public/assets/data/grabbelton-videos.json']), 'roadie');
  assert.equal(classifyPaths(['public/films/rekenklaar/A02/captions.vtt', 'public/assets/data/flirt-content-review.json']), 'roadie');
  assert.equal(classifyPaths(['public/assets/js/grabbelton-core.js', 'public/films/rekenklaar/B04/flirt.mp4']), 'full');
  assert.equal(classifyPaths(['.github/workflows/quality.yml']), 'full');
  assert.equal(classifyPaths(['scripts/test-roadie-release.mjs']), 'full');
  assert.equal(classifyPaths(['public/films/rekenklaar/B04/other.mp4']), 'full');
  assert.equal(classifyPaths(['public/films/rekenklaar/A04/flirt.mp4']), 'full');
  assert.equal(classifyPaths([]), 'full');
  console.log('Scopeclassificatie: 9 veiligheidsgevallen geslaagd.');
} else {
  let paths = null;
  let reason = 'no changes or unsupported event';
  try {
    paths = diffPaths(process.env.GITHUB_EVENT_NAME);
    reason = paths ? `${paths.length} changed files` : 'no safe Git comparison';
  } catch (error) {
    reason = `comparison unavailable (${error.message})`;
  }
  let filmCodes = new Set();
  try {
    const catalog = JSON.parse(fs.readFileSync('public/assets/data/grabbelton-videos.json', 'utf8'));
    filmCodes = new Set(catalog.videos
      .filter(video => /^roadie-/.test(video.release || '') || video.target?.misconceptionCode === 'A02')
      .map(video => video.target?.misconceptionCode));
  } catch {
    // Missing/unreadable catalog cannot enable the shorter audit.
  }
  const mode = classifyPaths(paths, filmCodes);
  console.log(`Vrijgavescope: ${mode} (${reason})`);
  for (const path of paths || []) console.log(`  ${path}`);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `mode=${mode}\n`);
}
