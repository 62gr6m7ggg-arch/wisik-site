import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {classifyPaths,fullModules} from './release-policy.mjs';
import {paboHtmlPath,paboScript,paboScriptReferences} from './lib/pabo-source.mjs';
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
export function planForPaths(paths,{base=null,head=null,full=false,readBefore,readAfter}={}) {
  const onlyVersion=file=>{
    if(full||!paths.includes(file))return false;
    const clean=text=>{const v=JSON.parse(text);delete v.version;if(file==='package-lock.json'&&v.packages?.[''])delete v.packages[''].version;return v};
    return JSON.stringify(clean(readBefore(file)))===JSON.stringify(clean(readAfter(file)));
  };
  const versionOnly=paths.filter(p=>['package.json','package-lock.json'].includes(p)&&onlyVersion(p));
  const plan={...classifyPaths(paths.filter(p=>!versionOnly.includes(p)),{full}),base,head,paths,codes:[]};
  if(versionOnly.length)plan.modules=[...new Set([...plan.modules,'site'])].sort();
  if(!full && paths.includes(paboHtmlPath)) {
    const before=readBefore(paboHtmlPath),after=readAfter(paboHtmlPath);
    if(paboScript(before)!==paboScript(after) || JSON.stringify(paboScriptReferences(before).map(s=>s.split('?')[0]))!==JSON.stringify(paboScriptReferences(after).map(s=>s.split('?')[0]))) {
      plan.modules=[...new Set([...plan.modules,'pabo','player','pabo-ui'])].sort();
      plan.reason+='; Pabo-applicatiecode of scriptkoppeling gewijzigd';
    }
  }
  plan.full=fullModules.every(m=>plan.modules.includes(m));
  if(full || !plan.modules.includes('media'))return plan;
  const mediaPaths=paths.filter(p=>/^public\/(?:films\/rekenklaar\/|assets\/data\/(?:grabbelton-videos|flirt-content-review)\.json$)/.test(p));
  if(paths.some(p=>!mediaPaths.includes(p)&&classifyPaths([p]).modules.includes('media')))return plan;
  if(!mediaPaths.length)return plan; // e.g. a change to the media checks themselves
  const codes=new Set(mediaPaths.flatMap(p=>p.match(/^public\/films\/rekenklaar\/([A-D]\d{2})\//)?.slice(1)||[]));
  for(const [file,field,codeOf] of [
    ['public/assets/data/grabbelton-videos.json','videos',v=>v.target.misconceptionCode],
    ['public/assets/data/flirt-content-review.json','entries',v=>v.code],
  ]) {
    if(!paths.includes(file))continue;
    const before=JSON.parse(readBefore(file)),after=JSON.parse(readAfter(file));
    const globalFields=value=>Object.fromEntries(Object.entries(value).filter(([key])=>![field,'updatedAt','reviewedAt'].includes(key)));
    if(JSON.stringify(globalFields(before))!==JSON.stringify(globalFields(after)))return plan;
    if(JSON.stringify(before[field].map(codeOf).sort())!==JSON.stringify(after[field].map(codeOf).sort()))throw new Error('Een nieuwe/verwijderde flirt vraagt een expliciete catalogusmigratie, geen vervanging.');
    for(const entry of after[field])if(JSON.stringify(entry)!==JSON.stringify(before[field].find(v=>codeOf(v)===codeOf(entry))))codes.add(codeOf(entry));
  }
  plan.codes=[...codes].sort();
  return plan;
}
export function releasePlan({base,full=false}={}) {
  const paths=full?[]:changedPaths(base);
  return planForPaths(paths,{base,head:git('rev-parse','HEAD'),full,readBefore:p=>git('show',`${base}:${p}`),readAfter:p=>fs.readFileSync(p,'utf8')});
}
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes('--self-test')) { await import('./test-release-policy.mjs'); }
  else {
    const full = process.argv.includes('--full') || ['schedule','workflow_dispatch'].includes(process.env.GITHUB_EVENT_NAME);
    const base = process.argv.find(a=>a.startsWith('--base='))?.slice(7) || process.env.RELEASE_BASE_SHA || (process.env.GITHUB_EVENT_NAME==='pull_request' ? git('rev-parse','HEAD^1') : process.env.RELEASE_BEFORE_SHA) || (!full ? git('rev-parse','origin/main') : null);
    const plan = releasePlan({base,full});
    fs.mkdirSync('.release',{recursive:true}); fs.writeFileSync('.release/plan.json',JSON.stringify(plan,null,2)+'\n');
    console.log(JSON.stringify(plan,null,2));
    if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT,`media=${plan.modules.includes('media') || plan.modules.includes('konijnenhol')}\n`);
  }
}
