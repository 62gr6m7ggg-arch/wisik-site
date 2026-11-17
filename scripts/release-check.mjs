import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {commandsForPlan} from './release-commands.mjs';
const plan=JSON.parse(fs.readFileSync('.release/plan.json','utf8'));
const write=process.argv.includes('--write') || process.argv.includes('--prepare');
const result={head:plan.head,base:plan.base,modules:plan.modules,codes:plan.codes,startedAt:new Date().toISOString(),status:'running',completed:[],failed:null};
const save=()=>fs.writeFileSync('.release/result.json',JSON.stringify(result,null,2)+'\n');
fs.mkdirSync('.release/logs',{recursive:true});save();
const unique=commandsForPlan(plan,{write});
for(const args of unique){
 const name=args[0],logPath=`.release/logs/${name.replace(/[^a-zA-Z0-9._-]/g,'_')}.log`;
 const start=Date.now(); const env={...process.env};
 if(plan.codes.length && !plan.modules.includes('player') && !plan.modules.includes('pabo')) env.WISIK_FLIRT_CODES=plan.codes.join(','); else delete env.WISIK_FLIRT_CODES;
 result.currentCommand=args; save();
 console.log(`Controle: ${args.join(' ')}`);
 const py=name.startsWith('python:');
 const child=spawnSync(py?'python3':process.execPath,py?[name.slice(7),...args.slice(1)]:args,{encoding:'utf8',env,timeout:name.includes('audit-pabo')?420000:120000,maxBuffer:8e6});
 const output=(child.stdout||'')+(child.stderr||'')+(child.error?`\n${child.error.message}`:'');fs.writeFileSync(logPath,output);
 if(child.status!==0){result.status='failed';result.failed={command:args,log:logPath,error:child.error?.message||`exit ${child.status}`};save();console.error(output.slice(-6000));console.error(`Gestopt bij ${name}; geen automatische herhaling. Hervatpunt: .release/result.json`);process.exit(1);}
 result.completed.push({command:args,seconds:Number(((Date.now()-start)/1000).toFixed(2))});save();console.log(output.trim().split('\n').slice(-2).join('\n'));
}
result.currentCommand=null;result.status='passed';result.finishedAt=new Date().toISOString();save();
console.log(`Vrijgave geslaagd: ${plan.modules.join(', ') || 'documentatie'}, ${unique.length} unieke controles.`);
if(process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,`## Vrijgave\nModules: ${plan.modules.join(', ')||'documentatie'}\n\nFilms: ${plan.codes.join(', ')||'modulebreed waar nodig'}\n\n${result.completed.map(r=>`- ${r.command.join(' ')}: ${r.seconds}s`).join('\n')}\n`);
