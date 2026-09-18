import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

export const blockPattern = /\n<!-- wisik-seo:start -->[\s\S]*?<!-- wisik-seo:end -->\n/g;
export const stripSeo = html => html.replace(blockPattern, '');
const decode = text => text.replace(/&(?:amp|quot|apos|lt|gt|#39);/g, entity => ({
  '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>', '&#39;': "'"
})[entity]).replace(/&#(x[\da-f]+|\d+);/gi, (_, value) => String.fromCodePoint(
  value[0].toLowerCase() === 'x' ? parseInt(value.slice(1), 16) : Number(value)));
const plain = text => decode(text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim());
const attr = (tag, name) => decode(tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1] || '');

export function pagePath(route) {
  assert.match(route, /^\/(?:[a-z0-9][a-z0-9-]*\/)*$/, `Geen schoon openbaar paginapad: ${route}`);
  return `public${route}index.html`;
}

export function readSource(root) {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'src/site-metadata.json'), 'utf8'));
  const context = vm.createContext({window: {}}, {codeGeneration: {strings: false, wasm: false}});
  vm.runInContext(fs.readFileSync(path.join(root, 'public/assets/js/site-data.js'), 'utf8'), context, {timeout: 1000});
  const tools = JSON.parse(JSON.stringify(context.window.WISIK_TOOLS));
  const venues = JSON.parse(JSON.stringify(context.window.WISIK_VENUES));
  return {config, tools, venues};
}

export function openTools(tools) {
  const selected = tools.filter(tool => tool.maturity === 'mainstage' && ['open', 'openingsklaar'].includes(tool.status));
  const ids = new Set(), pages = new Set();
  for (const tool of selected) {
    assert.ok(tool.id && tool.title && tool.appUrl && tool.productUrl, 'Open hoofdtent mist naam of URL');
    assert.ok(!ids.has(tool.id), `Dubbele tent-id: ${tool.id}`);
    assert.ok(!pages.has(tool.productUrl), `Dubbele tentpagina: ${tool.productUrl}`);
    ids.add(tool.id); pages.add(tool.productUrl);
    pagePath(tool.productUrl); pagePath(tool.appUrl);
    assert.notEqual(tool.productUrl, '/', 'Een tent moet een eigen pagina hebben');
  }
  return selected;
}

export function pageInfo(html) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
  assert.ok(head, 'Head ontbreekt');
  const meta = [...head.matchAll(/<meta\b[^>]*>/gi)].map(match => match[0]);
  assert.ok(!meta.some(tag => ['robots', 'googlebot'].includes(attr(tag, 'name').toLowerCase()) && /\b(noindex|none)\b/i.test(attr(tag, 'content'))), 'Openbare SEO-pagina heeft noindex');
  const name = plain(head.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  const description = attr(meta.find(tag => attr(tag, 'name') === 'description') || '', 'content');
  assert.ok(name && description, 'SEO-pagina mist titel of metaomschrijving');
  return {name, description};
}

export function graphForPage(config, html, route, tools) {
  const url = config.origin + route;
  const info = pageInfo(html);
  const websiteId = `${config.origin}/#website`;
  const creatorId = `${config.origin}/#edwin-van-der-plas`;
  const page = {
    '@type': 'WebPage', '@id': `${url}#webpage`, url,
    ...info, inLanguage: config.language, isPartOf: {'@id': websiteId}
  };
  const graph = [page];
  if (route === '/') {
    graph.push({
      '@type': 'WebSite', '@id': websiteId, url, name: config.name,
      description: info.description, inLanguage: config.language, creator: {'@id': creatorId},
      hasPart: tools.map(tool => ({'@id': `${config.origin}${tool.productUrl}#webpage`}))
    }, {
      '@type': 'Person', '@id': creatorId, name: config.creator.name,
      url: config.origin + config.creator.page
    });
  } else {
    const tool = tools.find(item => item.productUrl === route);
    assert.ok(tool, `Tent ontbreekt bij ${route}`);
    const toolId = `${config.origin}/#tool-${tool.id}`;
    page.mainEntity = {'@id': toolId};
    graph.push({
      '@type': ['WebApplication', 'LearningResource'], '@id': toolId,
      name: tool.title, description: info.description,
      url: config.origin + tool.appUrl,
      inLanguage: config.language, applicationCategory: 'EducationalApplication',
      mainEntityOfPage: {'@id': page['@id']}
    });
  }
  // Alleen een echt zichtbaar kruimelpad beschrijven, geen verzonnen hiërarchie.
  const nav = html.match(/<nav\b[^>]*class=["'][^"']*\bbreadcrumbs\b[^"']*["'][^>]*>([\s\S]*?)<\/nav>/i)?.[1];
  if (nav) {
    const items = [...nav.matchAll(/<(a|span)\b([^>]*)>([\s\S]*?)<\/\1>/gi)]
      .map(([, tag, attributes, body]) => ({name: plain(body), item: tag === 'a' ? attr(attributes, 'href') : route}))
      .filter(item => item.name && !['›', '»', '>', '→', '/'].includes(item.name));
    if (items.length > 1) {
      graph.push({
        '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`,
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem', position: index + 1, name: item.name,
          item: new URL(item.item, config.origin).href
        }))
      });
      page.breadcrumb = {'@id': `${url}#breadcrumb`};
    }
  }
  return {'@context': 'https://schema.org', '@graph': graph};
}

export function renderPage(html, config, route, tools) {
  const clean = stripSeo(html);
  assert.ok(!/<script\b[^>]*type=["']application\/ld\+json["']/i.test(clean), `Bestaande onbeheerde JSON-LD op ${route}; eerst beoordelen`);
  const url = config.origin + route;
  const head = clean.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '';
  const canonicals = [...head.matchAll(/<link\b[^>]*>/gi)].map(match => match[0]).filter(tag => attr(tag, 'rel') === 'canonical');
  assert.ok(canonicals.length <= 1, `Dubbele canonical op ${route}`);
  if (canonicals.length) assert.equal(attr(canonicals[0], 'href'), url, `Afwijkende canonical op ${route}`);
  const data = JSON.stringify(graphForPage(config, clean, route, tools), null, 2)
    .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  const canonical = canonicals.length ? '' : `<link rel="canonical" href="${url}">\n`;
  const block = `\n<!-- wisik-seo:start -->\n${canonical}<script type="application/ld+json" id="wisik-structured-data">\n${data}\n</script>\n<!-- wisik-seo:end -->\n`;
  return clean.replace(/<\/head>/i, () => `${block}</head>`);
}

const walkHtml = dir => fs.readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walkHtml(full) : full.endsWith('.html') ? [full] : [];
});

export function planSeo(root) {
  const {config, tools: registry, venues} = readSource(root);
  assert.equal(config.origin, 'https://wisik.nl', 'Productiemetadata moet naar het hoofddomein wijzen');
  const tools = openTools(registry);
  const routes = ['/', ...tools.map(tool => tool.productUrl)];
  const outputs = new Map();
  for (const tool of tools) assert.ok(fs.existsSync(path.join(root, pagePath(tool.appUrl))), `App ontbreekt: ${tool.appUrl}`);
  for (const route of routes) {
    const file = pagePath(route);
    outputs.set(file, renderPage(fs.readFileSync(path.join(root, file), 'utf8'), config, route, tools));
  }
  // Bij intrekken of verplaatsen geen oude, actieve tentbeschrijving achterlaten.
  for (const full of walkHtml(path.join(root, 'public'))) {
    const file = path.relative(root, full).replaceAll(path.sep, '/');
    if (outputs.has(file)) continue;
    const html = fs.readFileSync(full, 'utf8');
    if (html.includes('<!-- wisik-seo:start -->')) outputs.set(file, stripSeo(html));
  }
  const sitemapRoutes = [...new Set([...config.sitePages,
    ...venues.filter(venue => venue.status === 'open').map(venue => venue.pageUrl),
    ...tools.map(tool => tool.productUrl)])].sort();
  for (const route of sitemapRoutes) {
    const html = fs.readFileSync(path.join(root, pagePath(route)), 'utf8');
    pageInfo(html);
    assert.ok(!/<meta\b[^>]*http-equiv=["']refresh["']/i.test(html), `Redirect in sitemap: ${route}`);
  }
  const xmlEscape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  outputs.set('public/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + sitemapRoutes.map(route => `  <url><loc>${xmlEscape(config.origin + route)}</loc></url>`).join('\n')
    + '\n</urlset>\n');
  return {outputs, routes, tools};
}
