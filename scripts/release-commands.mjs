import {modules} from './release-policy.mjs';
export function commandsForPlan(plan,{write=false}={}) {
  const commands=[['scripts/test-release-policy.mjs']];
  for(const name of plan.modules) {
    if(name==='legacy-audio'){commands.push(['scripts/test-ownvoice-release.mjs']);continue;}
    for(const script of modules[name])commands.push([script,...(script==='scripts/test-konijnenhol.mjs'?['--media']:[]),...(write&&/^scripts\/audit-/.test(script)?['--write']:[])]);
  }
  if(plan.modules.includes('media'))commands.push(['scripts/test-flirt-player.mjs']);
  if(plan.modules.includes('site'))commands.push(['scripts/build-site-seo.mjs','--check']);
  if(plan.modules.includes('gonio'))commands.push(['python:tests/gonio_integrity.py']);
  commands.push(['scripts/test-pabo-evidence.mjs']);
  return [...new Map(commands.map(c=>[c.join(' '),c])).values()];
}
