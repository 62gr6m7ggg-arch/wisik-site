import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readSource, openTools, renderPage, stripSeo, pagePath, planSeo} from './lib/site-seo.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const {config, tools: registry} = readSource(root);
const tools = openTools(registry);
const parsed = html => JSON.parse(html.match(/<script type="application\/ld\+json" id="wisik-structured-data">\n([\s\S]*?)\n<\/script>/)[1]);
const head = '<html lang="nl"><head><title>Test &amp; leren</title><meta name="description" content="Samen rekenen &amp; ontdekken."></head>';
const fixture = head + '<body><h1>Test</h1><script>window.unchanged=true;</script></body></html>';
const {outputs, routes} = planSeo(root);
assert.equal(routes.length, tools.length + 1);
for (const [file, expected] of outputs) {
  if (!file.endsWith('.html') || !expected.includes('wisik-structured-data')) continue;
  const original = fs.readFileSync(path.join(root, file), 'utf8');
  assert.equal(stripSeo(expected), stripSeo(original), `${file}: uitsluitend beheerde metadata wijzigen`);
  const data = parsed(expected);
  assert.equal(data['@context'], 'https://schema.org');
  assert.equal(new Set(data['@graph'].map(item => item['@id'])).size, data['@graph'].length);
  assert.equal((expected.match(/rel="canonical"/g) || []).length, 1);
  assert.equal((expected.match(/type="application\/ld\+json"/g) || []).length, 1);
  for (const item of data['@graph']) {
    assert.ok(!('softwareVersion' in item) && !('dateModified' in item) && !('aggregateRating' in item) && !('review' in item));
    assert.ok(item['@id'].startsWith('https://wisik.nl/'));
  }
  const tool = tools.find(item => pagePath(item.productUrl) === file);
  const application = data['@graph'].find(item => Array.isArray(item['@type']));
  if (tool) {
    assert.equal(application.name, tool.title);
    assert.equal(application.url, config.origin + tool.appUrl);
    assert.deepEqual(application['@type'], ['WebApplication', 'LearningResource']);
  } else assert.ok(data['@graph'].some(item => item['@type'] === 'WebSite'));
}

const sample = tools[0];
const rendered = renderPage(fixture, config, sample.productUrl, tools);
assert.equal(renderPage(rendered, config, sample.productUrl, tools), rendered, 'Generatie moet idempotent zijn');
assert.equal(stripSeo(rendered), fixture, 'Body en appcode blijven byte-identiek');
assert.equal(parsed(rendered)['@graph'][0].name, 'Test & leren');
assert.equal(parsed(rendered)['@graph'][1].description, 'Samen rekenen & ontdekken.');
assert.ok(!parsed(rendered)['@graph'].some(item => item['@type'] === 'BreadcrumbList'), 'Geen fictief kruimelpad');
const malicious = tools.map(tool => ({...tool, title: '</script><script>alert(1)</script>'}));
const escaped = renderPage(fixture, config, sample.productUrl, malicious);
assert.equal(parsed(escaped)['@graph'][1].name, malicious[0].title);
assert.ok(!escaped.includes('<script>alert(1)'));
assert.throws(() => renderPage(head.replace('</head>', '<meta name="robots" content="noindex"></head>'), config, sample.productUrl, tools), /noindex/);
assert.throws(() => renderPage(head.replace('</head>', '<link rel="canonical" href="https://example.com/"></head>'), config, sample.productUrl, tools), /canonical/);
assert.throws(() => renderPage(head.replace('</head>', '<script type="application/ld+json">{}</script></head>'), config, sample.productUrl, tools), /onbeheerde/);
for (const route of ['/../private/', '//other.example/', '/app/?token=x', '/test/#anchor']) assert.throws(() => pagePath(route));
assert.equal(openTools([{...sample, status: 'concept'}]).length, 0);
assert.equal(openTools([{...sample, maturity: 'bouwplaats'}]).length, 0);
assert.throws(() => openTools([sample, sample]), /Dubbele/);
assert.throws(() => openTools([{...sample, appUrl: ''}]), /URL/);

// Een nieuwe, hernoemde, verplaatste en ingetrokken tent zonder extra SEO-record.
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'wisik-seo-test-'));
const write = (file, contents) => {
  const target = path.join(temporary, file);
  fs.mkdirSync(path.dirname(target), {recursive: true});
  fs.writeFileSync(target, contents);
};
try {
  write('src/site-metadata.json', JSON.stringify({...config, sitePages: ['/']}));
  write('public/index.html', fixture);
  const newTool = {...sample, id: 'nieuw', title: 'Nieuwe tent', productUrl: '/nieuw/', appUrl: '/apps/nieuw/'};
  const register = entries => write('public/assets/js/site-data.js', `window.WISIK_TOOLS=${JSON.stringify(entries)};window.WISIK_VENUES=[];`);
  register([newTool]);
  write('public/nieuw/index.html', fixture); write('public/apps/nieuw/index.html', fixture);
  let plan = planSeo(temporary);
  assert.ok(plan.outputs.get('public/sitemap.xml').includes('https://wisik.nl/nieuw/'));
  assert.equal(parsed(plan.outputs.get('public/nieuw/index.html'))['@graph'][1].name, 'Nieuwe tent');
  for (const [file, contents] of plan.outputs) write(file, contents);
  register([{...newTool, title: 'Andere naam', productUrl: '/verplaatst/'}]);
  write('public/verplaatst/index.html', fixture);
  plan = planSeo(temporary);
  assert.equal(parsed(plan.outputs.get('public/verplaatst/index.html'))['@graph'][1].name, 'Andere naam');
  assert.equal(plan.outputs.get('public/nieuw/index.html'), fixture);
  assert.ok(!plan.outputs.get('public/sitemap.xml').includes('/nieuw/'));
  for (const [file, contents] of plan.outputs) write(file, contents);
  register([{...newTool, productUrl: '/verplaatst/', status: 'closed'}]);
  plan = planSeo(temporary);
  assert.equal(plan.outputs.get('public/verplaatst/index.html'), fixture);
  assert.ok(!plan.outputs.get('public/sitemap.xml').includes('/verplaatst/'));
} finally {
  fs.rmSync(temporary, {recursive: true});
}
console.log('SEO-regressies geslaagd: bronbinding, veiligheid, bodybehoud, canonical, sitemap en levenscyclus van hoofdtenten.');
