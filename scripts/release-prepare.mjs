import {spawnSync} from 'node:child_process';
for (const args of [ ['scripts/classify-release-change.mjs',...process.argv.slice(2)], ['scripts/release-check.mjs','--prepare'] ]) {
 const r=spawnSync(process.execPath,args,{stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);
}
