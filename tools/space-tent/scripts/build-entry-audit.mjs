import fs from 'node:fs';
import path from 'node:path';
import {build} from 'esbuild';
const s=fs.readFileSync('scripts/check-entry-choice.mjs','utf8');
const a=s.indexOf('const compiled='),b=s.indexOf('let tests=0;');
if(a<0||b<0)throw new Error('Entry audit source markers changed');
const contents=s.slice(0,a).replace("import {build} from 'esbuild';",'')+"import * as E from '../app/entry-choice';import * as M from '../app/model';\n"+s.slice(b);
await build({stdin:{contents,resolveDir:path.resolve('scripts')},bundle:true,platform:'node',format:'esm',outfile:'.audit-dist/check-entry-choice.mjs'});
