import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createHash} from 'node:crypto';
import {assets} from './generated-assets.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../..'),manifest=JSON.parse(fs.readFileSync(path.join(here,'build-manifest.json'))),hash=v=>createHash('sha256').update(v).digest('hex');
for(const [file,expected] of Object.entries(manifest.sourceFiles))assert.equal(hash(fs.readFileSync(path.join(root,file))),expected,'Review source changed: '+file);
for(const [file,expected] of Object.entries(manifest.protectedAssets))assert.equal(hash(assets[file].body),expected,'Review asset changed: '+file);
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
for(const file of walk(path.join(root,'public'))){assert.ok(!file.includes('/ruimteklaar/test/'),'No test static files may be deployed');if(/\.(js|html)$/.test(file))assert.ok(!fs.readFileSync(file,'utf8').includes('TESTMODUS · Spacetent'),'No review bundle in static assets')}
const routes=JSON.parse(fs.readFileSync(path.join(root,'public/_routes.json')));assert.deepEqual(routes,{version:1,include:['/apps/ruimteklaar/test','/apps/ruimteklaar/test/*'],exclude:[]});
for(const file of ['index.js','[[path]].js'])assert.ok(fs.existsSync(path.join(root,'functions/apps/ruimteklaar/test',file)));
const source=fs.readFileSync(path.join(here,'main.tsx'),'utf8');assert.ok(!source.includes('createLocalProgressStore'));assert.ok(!source.includes("fetch('/api/progress"));assert.ok(!source.includes('localStorage.'));assert.ok(!source.includes('sessionStorage.'));
const evidence=JSON.parse(fs.readFileSync(path.join(here,'browser-results.json')));assert.equal(evidence.status,'passed');assert.deepEqual(evidence.errors,[]);assert.equal(evidence.results.length,18);
console.log('Review release check passed: source/asset hashes; server-only assets; restricted routes; no learner storage; browser evidence.');
