import fs from 'node:fs';
import path from 'node:path';
import {build} from 'esbuild';
const source=fs.readFileSync('scripts/check-course.mjs','utf8');
const contents="import assert from 'node:assert/strict';import * as M from '../app/model';import * as C from '../app/course-construction';import * as L from '../app/local-progress';import * as G from '../app/geometry-math';import * as N from '../app/numeric';\n"+source.split('/* COURSE TESTS */')[1];
await build({stdin:{contents,resolveDir:path.resolve('scripts'),sourcefile:'check-course.mjs'},bundle:true,platform:'node',format:'esm',outfile:'.audit-dist/check-course.mjs'});
