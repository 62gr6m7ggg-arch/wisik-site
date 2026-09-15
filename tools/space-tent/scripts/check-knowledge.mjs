import {build} from 'esbuild';
import {execFileSync} from 'node:child_process';
await build({entryPoints:['scripts/knowledge-checks.tsx'],bundle:true,platform:'node',format:'cjs',outfile:'.audit-dist/check-knowledge.cjs'});
if(!process.argv.includes('--compile'))execFileSync(process.execPath,['.audit-dist/check-knowledge.cjs'],{stdio:'inherit'});
