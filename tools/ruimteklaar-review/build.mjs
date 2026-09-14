import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const here=path.dirname(fileURLToPath(import.meta.url)),space=path.resolve(here,'../space-tent'),repo=path.resolve(here,'../..');
const require=createRequire(path.join(space,'package.json')),esbuild=require('esbuild');
const out=path.join(here,'.build');fs.mkdirSync(out,{recursive:true});
await esbuild.build({entryPoints:[path.join(here,'main.tsx')],bundle:true,loader:{'.css':'empty'},platform:'browser',format:'esm',minify:true,jsx:'automatic',tsconfig:path.join(space,'tsconfig.json'),alias:{'@':space},nodePaths:[path.join(space,'node_modules')],define:{'process.env.NODE_ENV':'"production"'},outfile:path.join(out,'app.js'),sourcemap:false});
// The normal app's compiled stylesheet includes the Tailwind component utilities.
const style=fs.readdirSync(path.join(space,'.space-dist/assets')).find(f=>f.endsWith('.css'));const css=fs.readFileSync(path.join(space,'.space-dist/assets',style),'utf8')+'\n'+fs.readFileSync(path.join(here,'review.css'),'utf8');
const assets={'index.html':{type:'text/html; charset=utf-8',body:'<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Spacetent · Testmodus</title><link rel="stylesheet" href="/apps/ruimteklaar/test/app.css"></head><body><div id="root"></div><script type="module" src="/apps/ruimteklaar/test/app.js"></script></body></html>'},'app.js':{type:'text/javascript; charset=utf-8',body:fs.readFileSync(path.join(out,'app.js'),'utf8')},'app.css':{type:'text/css; charset=utf-8',body:css}};
fs.writeFileSync(path.join(here,'generated-assets.mjs'),'// GENERATED. Server-only: NEVER copy these files into public/.\nexport const assets='+JSON.stringify(assets)+';\n');
const files=[...fs.readdirSync(path.join(space,'app')).filter(f=>/\.(tsx?|json|css)$/.test(f)).map(f=>path.join(space,'app',f)),...['main.tsx','catalogue.ts','review.css','server.mjs','build.mjs'].map(f=>path.join(here,f))];
const hash=x=>createHash('sha256').update(x).digest('hex');
fs.writeFileSync(path.join(here,'build-manifest.json'),JSON.stringify({version:'0.1',sourceFiles:Object.fromEntries(files.map(f=>[path.relative(repo,f),hash(fs.readFileSync(f))])),protectedAssets:Object.fromEntries(Object.entries(assets).map(([k,a])=>[k,hash(a.body)]))},null,2)+'\n');
console.log('Built server-only review app; no public test assets written.');
