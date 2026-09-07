import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
fs.mkdirSync('.audit-dist',{recursive:true});
const jobs=[
 ['check-learning',source=>{const a=source.indexOf('async function load('),b=source.indexOf('const bank=');return source.slice(0,a).replace("import {build} from 'esbuild';",'')+"import * as M from '../app/model';import * as G from '../app/geometry-math';import * as W from '../app/workbench-math';import * as R from '../app/route-progress';import * as S from '../app/insight-scenes';import * as V from '../app/question-visuals';\n"+source.slice(b)}],
 ['check-diagnostic',source=>{const a=source.indexOf("import {build}"),b=source.indexOf('let n=0');return source.slice(0,a)+"import * as M from '../app/model';import * as D from '../app/diagnostic';\n"+source.slice(b)}],
 ['check-local-progress',source=>{const a=source.indexOf('// Works before'),b=source.indexOf('let serial =');return source.slice(0,a)+"import * as L from '../app/local-progress';import * as M from '../app/model';import * as W from '../app/workbench-math';const localEntry=resolve(process.cwd(),'app/local-progress.ts');\n"+source.slice(b)}],
];
for(const [name,transform] of jobs){const contents=transform(fs.readFileSync('scripts/'+name+'.mjs','utf8'));await build({stdin:{contents,resolveDir:path.resolve('scripts'),sourcefile:name+'.mjs'},bundle:true,platform:'node',format:'esm',outfile:'.audit-dist/'+name+'.mjs'});}
