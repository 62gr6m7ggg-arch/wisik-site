import {spawnSync} from 'node:child_process';
const args=process.argv.slice(2);
const plan=spawnSync(process.execPath,['scripts/classify-release-change.mjs',...args.filter(a=>a!=='--check')],{stdio:'inherit'});
if(plan.status!==0)process.exit(plan.status||1);
if(args.includes('--check')) {
 const check=spawnSync(process.execPath,['scripts/release-check.mjs','--write'],{stdio:'inherit'});
 process.exit(check.status??1);
}
console.log('Pakket en testplan voorbereid. Geen tests uitgevoerd; één vrijgavecontrole op de definitieve kandidaat in GitHub.');
