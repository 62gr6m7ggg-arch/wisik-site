import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';

export const paboHtmlPath='public/apps/pabo-rekenklaar/index.html';
const digest=value=>createHash('sha256').update(value).digest('hex');
export function paboScript(html) {
  const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(([,attrs])=>! /\bsrc\s*=|application\/ld\+json/i.test(attrs));
  if(scripts.length!==1 || !scripts[0][2].includes('const APP_VERSION')) throw new Error('Verwacht één expliciete Pabo-applicatiebron; onbekende scriptstructuur vraagt controle.');
  return scripts[0][2];
}
export function readMisconceptions(root) {
  const script=paboScript(fs.readFileSync(path.join(root,paboHtmlPath),'utf8'));
  const start=script.indexOf('const MISCONCEPTION_CATALOG = Object.freeze({');
  const end=script.indexOf('\nconst DIAGNOSTIC_DEFAULT_STATE',start);
  if(start<0 || end<0)throw new Error('Canonieke misconceptdefinities ontbreken');
  // Evaluate only the constant definitions. Never initialize the app or generators.
  return JSON.parse(vm.runInNewContext(script.slice(start,end)+'\nJSON.stringify(MISCONCEPTION_CATALOG)',{}, {timeout:1000}));
}
export function paboSourceManifest(root,{read=file=>fs.readFileSync(file)}={}) {
  const files={};
  files[`${paboHtmlPath}#application-script`]=digest(paboScript(read(path.join(root,paboHtmlPath)).toString()));
  const inputs=[
    'scripts/audit-pabo-release.mjs','scripts/lib/pabo-source.mjs',
    ...fs.readdirSync(path.join(root,'scripts/lib')).filter(n=>/^pabo-.*\.mjs$/.test(n)&&n!=='pabo-source.mjs').map(n=>'scripts/lib/'+n),
    ...fs.readdirSync(path.join(root,'src/pabo')).filter(n=>n.endsWith('.js')).map(n=>'src/pabo/'+n),
  ];
  for(const file of [...new Set(inputs)].sort())files[file]=digest(read(path.join(root,file)));
  return {kind:'pabo-math-v1',files,sha256:digest(JSON.stringify(files))};
}

export function paboScriptReferences(html) {
  return [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(m=>m[1]).sort();
}
