import {build} from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd(),out=path.join(root,'.review-dist'),repo=path.resolve(root,'../..');
await build({configFile:false,root:path.join(root,'review'),base:'/apps/ruimteklaar/test/',publicDir:false,plugins:[react()],resolve:{alias:{'@':root}},css:{postcss:path.join(root,'postcss.config.mjs')},build:{outDir:out,emptyOutDir:true,sourcemap:false}});
const files=fs.readdirSync(path.join(out,'assets')).map(f=>'assets/'+f),assets={};
for(const rel of ['index.html',...files]){
 if(!/\.(html|js|css)$/.test(rel))throw new Error('Unexpected reviewer asset '+rel);
 assets[rel]={type:rel.endsWith('.js')?'text/javascript; charset=utf-8':rel.endsWith('.css')?'text/css; charset=utf-8':'text/html; charset=utf-8',body:fs.readFileSync(path.join(out,rel),'utf8')};
}
fs.mkdirSync(path.join(repo,'server'),{recursive:true});
fs.writeFileSync(path.join(repo,'server/ruimteklaar-test-assets.mjs'),'// Generated review assets. Server-only: never copy this file or its contents into public/.\nexport const assets='+JSON.stringify(assets)+';\n');
const manifest=Object.fromEntries(Object.entries(assets).map(([file,a])=>[file,createHash('sha256').update(a.body).digest('hex')]));
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
console.log('Built reviewer into server-only assets; normal learner bundle was not touched.');
