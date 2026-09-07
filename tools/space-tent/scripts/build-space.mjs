import {build} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
const root=process.cwd();
await build({configFile:false,root:path.join(root,'space'),base:'/apps/ruimteklaar/',publicDir:false,plugins:[react()],resolve:{alias:{'@':root}},css:{postcss:path.join(root,'postcss.config.mjs')},build:{outDir:path.join(root,'.space-dist'),emptyOutDir:true,sourcemap:false}});
