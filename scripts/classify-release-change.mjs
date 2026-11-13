import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {classifyPaths} from './release-policy.mjs';
export {classifyPaths};
const git = (...args) => execFileSync('git', args, {encoding:'utf8', maxBuffer:4e6}).trim();
export function changedPaths(base) {
  if (!base || !/^[a-f0-9]{40}$/.test(base) || /^0+$/.test(base)) throw new Error('Een concrete basiscommit is nodig; gebruik --base=<sha> of expliciet --full.');
  try { git('cat-file','-e',`${base}^{commit}`); }
  catch { git('fetch','--no-tags','--depth=1','origin',base); }
  const committed = git('diff','--no-renames','--name-only',base,'HEAD');
  const local = git('diff','--name-only','HEAD');
  const untracked = git('ls-files','--others','--exclude-standard');
  return [...new Set([committed,local,untracked].join('\n').split('\n').filter(p => p && !p.startsWith('.release/')))];
}
export function releasePlan({base, full=false} = {}) {
  const paths = full ? [] : changedPaths(base);
  const plan = {...classifyPaths(paths, {full}), base:base || null, head:git('rev-parse','HEAD'), paths, codes:[]};
  if (!plan.modules.includes('flirts')) return plan;
  // Shared player/logic changes require all films; isolated media changes only their codes.
  if (full || paths.some(p => !/^public\/(?:films\/rekenklaar\/|assets\/data\/(?:grabbelton-videos|flirt-content-review)\.json$)/.test(p) && !/^(docs\/|.*\.md$)/.test(p))) return plan;
  const codes = new Set(paths.flatMap(p => p.match(/^public\/films\/rekenklaar\/([A-D]\d{2})\//)?.slice(1) || []));
  for (const [file, field, codeOf] of [
    ['public/assets/data/grabbelton-videos.json','videos',v=>v.target.misconceptionCode],
    ['public/assets/data/flirt-content-review.json','entries',v=>v.code],
  ]) {
    if (!paths.includes(file)) continue;
    const before = JSON.parse(git('show',`${base}:${file}`));
    const after = JSON.parse(fs.readFileSync(file,'utf8'));
    if (JSON.stringify(before[field].map(codeOf).sort()) !== JSON.stringify(after[field].map(codeOf).sort())) throw new Error('Een nieuwe/verwijderde flirt vraagt een gerichte catalogusmigratie, geen vervanging.');
    for (const entry of after[field]) if (JSON.stringify(entry) !== JSON.stringify(before[field].find(v=>codeOf(v)===codeOf(entry)))) codes.add(codeOf(entry));
  }
  plan.codes = [...codes].sort();
  return plan;
}
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes('--self-test')) { await import('./test-release-policy.mjs'); }
  else {
    const full = process.argv.includes('--full') || ['schedule','workflow_dispatch'].includes(process.env.GITHUB_EVENT_NAME);
    const base = process.argv.find(a=>a.startsWith('--base='))?.slice(7) || process.env.RELEASE_BASE_SHA || (process.env.GITHUB_EVENT_NAME==='pull_request' ? git('rev-parse','HEAD^1') : process.env.RELEASE_BEFORE_SHA) || (!full ? git('rev-parse','origin/main') : null);
    const plan = releasePlan({base,full});
    fs.mkdirSync('.release',{recursive:true}); fs.writeFileSync('.release/plan.json',JSON.stringify(plan,null,2)+'\n');
    console.log(JSON.stringify(plan,null,2));
    if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT,`media=${plan.modules.includes('flirts') || plan.modules.includes('konijnenhol')}\n`);
  }
}
