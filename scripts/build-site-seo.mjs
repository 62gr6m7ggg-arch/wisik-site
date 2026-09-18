import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {planSeo} from './lib/site-seo.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
if (args.length !== 1 || !['--write', '--check'].includes(args[0])) throw new Error('Gebruik --write of --check');
const {outputs, routes, tools} = planSeo(root);
const changed = [];
for (const [file, expected] of outputs) {
  const full = path.join(root, file);
  if (fs.readFileSync(full, 'utf8') === expected) continue;
  changed.push(file);
  if (args[0] === '--write') fs.writeFileSync(full, expected);
}
if (args[0] === '--check' && changed.length) {
  throw new Error(`Zoekmachinegegevens zijn verouderd. Voer npm run seo:build uit:\n${changed.join('\n')}`);
}
console.log(`SEO: ${routes.length} pagina's, ${tools.length} hoofdtenten, sitemap; ${changed.length} ${args[0] === '--write' ? 'bestanden bijgewerkt' : 'afwijkingen'}.`);
