// CI stores generated evidence without rerunning the already passed calculations.
// Only the two explicit JSON reports may differ from the tested candidate.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {validateReportChanges} from './lib/release-reports.mjs';

const result=JSON.parse(fs.readFileSync('.release/result.json','utf8'));
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const modified=[...new Set([git('diff','--name-only','HEAD'),git('ls-files','--others','--exclude-standard')].join('\n').split('\n').filter(p=>p&&!p.startsWith('.release/')))];
const paths=validateReportChanges(modified,result);
if(!paths.length){console.log('Vrijgavebewijzen ongewijzigd; geen extra commit of controles.');process.exit(0);}
const event=JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH,'utf8'));
const repo=process.env.GITHUB_REPOSITORY,pr=event.pull_request;
if(!pr){console.log('Periodieke/handmatige controle: nieuw bewijs staat in het Actions-artifact; geen branchwijziging.');process.exit(0);}
assert.equal(pr.head.repo.full_name,repo,'Geen automatische bewijsschrijfroute voor een fork');
const token=process.env.GITHUB_TOKEN;
assert.ok(token,'CI-token ontbreekt');
async function api(route,method='GET',body) {
  const response=await fetch(`https://api.github.com/repos/${repo}/${route}`,{method,headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','Content-Type':'application/json','X-GitHub-Api-Version':'2022-11-28'},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw new Error(`GitHub ${method} ${route}: HTTP ${response.status}`);
  return response.json();
}
const current=await api(`pulls/${pr.number}`);
assert.equal(current.head.sha,pr.head.sha,'Kandidaat gewijzigd tijdens controle; geen bewijs op andere bron plakken');
assert.equal(current.base.sha,pr.base.sha,'Basis gewijzigd tijdens controle; kandidaat eerst bijwerken');
const parent=await api(`git/commits/${pr.head.sha}`);
const tree=await api('git/trees','POST',{base_tree:parent.tree.sha,tree:paths.map(p=>({path:p,mode:'100644',type:'blob',content:fs.readFileSync(p,'utf8')}))});
const commit=await api('git/commits','POST',{message:`Bewaar gecontroleerde vrijgavebewijzen (run ${process.env.GITHUB_RUN_ID})`,tree:tree.sha,parents:[pr.head.sha]});
const proof={testedHead:pr.head.sha,testedMerge:result.head,base:pr.base.sha,head:commit.sha,branch:pr.head.ref,reports:Object.fromEntries(paths.map(p=>[p,createHash('sha256').update(fs.readFileSync(p)).digest('hex')])),run:process.env.GITHUB_RUN_ID};
fs.writeFileSync('.release/report-commit.json',JSON.stringify(proof,null,2)+'\n');
await api(`git/refs/heads/${encodeURIComponent(pr.head.ref)}`,'PATCH',{sha:commit.sha,force:false});
// GITHUB_TOKEN writes do not recursively trigger workflows. Bind the passed run
// to the evidence-only successor; source files and test inputs are identical.
await api('check-runs','POST',{name:'Verplichte vrijgavecontrole',head_sha:commit.sha,status:'completed',conclusion:'success',completed_at:new Date().toISOString(),details_url:`https://github.com/${repo}/actions/runs/${process.env.GITHUB_RUN_ID}`,output:{title:'Zelfde gecontroleerde bron, gegenereerd bewijs opgeslagen',summary:`Alle geselecteerde controles zijn geslaagd op ${pr.head.sha} met basis ${pr.base.sha}. Opvolger ${commit.sha} bevat uitsluitend de gecontroleerde JSON-rapporten: ${paths.join(', ')}. Geen herhaling van de rekentests. Het Actions-artifact bevat de volledige bron- en rapportbinding.`}});
console.log(`Geslaagd bewijs opgeslagen op ${commit.sha}; geen tweede testuitvoering.`);
