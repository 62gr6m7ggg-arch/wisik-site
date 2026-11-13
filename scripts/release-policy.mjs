// One explicit dependency map. Changes outside this map stop quickly; they never
// silently launch a site-wide audit. Extend the map when introducing a module.
export const modules = {
  delivery: ['scripts/test-delivery-source.mjs'],
  flirts: ['scripts/test-pabo-flirts.mjs', 'scripts/test-native-audio.mjs', 'scripts/test-roadie-release.mjs'],
  pabo: ['scripts/audit-pabo-release.mjs', 'scripts/pabo-didactic-audit.mjs', 'scripts/test-pabo-rich.mjs', 'scripts/test-pabo-navigation.mjs', 'scripts/test-backstage-audit.mjs'],
  space: ['scripts/audit-space-release.mjs', 'scripts/audit-ruimteklaar-review.mjs', 'scripts/test-space-artist-entrance.mjs'],
  meetkunde: ['scripts/test-meetkunde.mjs'],
  gonio: ['scripts/test-gonio.mjs'],
  konijnenhol: ['scripts/test-konijnenhol.mjs'],
  site: ['scripts/test-site-seo.mjs', 'scripts/check-site.mjs', 'scripts/test-feedback.mjs', 'scripts/test-privacy-terrein.mjs', 'scripts/test-grabbelton-cta.mjs', 'scripts/test-festival-venues.mjs', 'scripts/test-mobile-terrein.mjs', 'scripts/test-backstage-roadie.mjs', 'scripts/test-backstage-audit.mjs', 'scripts/test-rafelrandjes.mjs'],
};
export const fullModules = Object.keys(modules);
const rules = [
  [/^(?:AGENTS\.md|README\.md|DEPLOYMENT\.md|TEST-RESULTS\.md|PRIVACY-NOTITIES\.md|docs\/)/, []],
  [/^public\/(?:films\/rekenklaar\/|assets\/data\/(?:grabbelton-videos|flirt-content-review)\.json$)/, ['flirts']],
  [/^public\/assets\/js\/grabbelton(?:-core)?\.js$|^public\/grabbelton\//, ['flirts','site']],
  [/^public\/apps\/pabo-rekenklaar\/|^src\/pabo\/|^public\/assets\/data\/(?:pabo-release-audit|pabo-variation-catalog)\.json$|^public\/moshpit\//, ['pabo','flirts','site']],
  [/^tools\/space-tent\/|^public\/(?:apps\/ruimteklaar\/|films\/ruimteklaar\/|assets\/data\/ruimteklaar-release-audit\.json$)|^server\/ruimteklaar|^functions\/apps\/ruimteklaar\//, ['space']],
  [/^public\/apps\/(?:meetkunde|stoicheia)\//, ['meetkunde']],
  [/^public\/rafelrand\/sinus-s-en-de-geit\/|^tests\/gonio/, ['gonio']],
  [/^public\/rafelrand\/konijnenhol\//, ['konijnenhol']],
  [/^public\/rafelrand\/index\.html$/, ['site','gonio','konijnenhol']],
  [/^public\/_routes\.json$/, ['space','site']],
  [/^public\/(?:[^/]+\.(?:html|json|xml|txt|ico|png|webmanifest)|_headers|_redirects)$|^public\/(?:assets\/(?:css|img|js)\/|backstage\/|kladblok\/|hbo\/|pabo\/|vo\/|vrij\/|rafelrand\/space-tent\/)/, ['site']],
  [/^public\/assets\/audio\//, ['legacy-audio']],
  [/^scripts\/lib\/(?:flirt-chain-audit|flirt-content-audit)\.mjs$|^tests\/flirt-cases\.json$/, ['flirts']],
  [/^scripts\/lib\/pabo-|^scripts\/(?:apply-pabo|test-pabo|check-pabo|pabo-didactic|audit-pabo|export-pabo)/, ['pabo','flirts']],
  [/^scripts\/lib\/site-seo\.mjs$|^scripts\/build-site-seo\.mjs$/, ['site']],
  [/^scripts\/.*(?:space|ruimteklaar)/, ['space']],
  [/^scripts\/.*gonio/, ['gonio']],
  [/^scripts\/.*konijnenhol/, ['konijnenhol']],
  [/^scripts\/.*(?:flirt|roadie|ownvoice)|^tests\/(?:pabo-eigenstem|flirt-)/, ['flirts']],
  [/^scripts\/.*(?:privacy|feedback|backstage|festival|mobile|rafelrandjes|grabbelton|site)/, ['site']],
  [/^scripts\/.*meetkunde/, ['meetkunde']],
];
export function classifyPaths(paths, { full = false } = {}) {
  if (full) return { modules: fullModules, full: true, reason: 'explicit full audit' };
  const selected = new Set();
  const unknown = [];
  for (const file of paths) {
    if (/^scripts\/(?:verify-publication\.mjs|test-delivery-source\.mjs|lib\/delivery-source\.mjs)$|^\.github\/workflows\/publication\.yml$/.test(file)) { selected.add('delivery'); continue; }
    if (/^\.github\/|^scripts\/(?:release-|classify-release-change|test-release-|test-native-audio|verify-publication)|^(?:package(?:-lock)?\.json|wrangler\.jsonc|\.gitignore)$/.test(file)) {
      fullModules.forEach(m => selected.add(m)); continue;
    }
    const direct = Object.entries(modules).filter(([, scripts]) => scripts.includes(file)).map(([name]) => name);
    const rule = rules.find(([pattern]) => pattern.test(file));
    if (direct.length) direct.forEach(m => selected.add(m));
    else if (rule) rule[1].forEach(m => selected.add(m));
    else unknown.push(file);
  }
  if (unknown.length) throw new Error(`Geen modulekoppeling voor: ${unknown.join(', ')}. Voeg de afhankelijkheid toe aan scripts/release-policy.mjs; geen blinde volledige audit gestart.`);
  if (selected.has('pabo')) selected.add('flirts');
  return { modules: [...selected].sort(), full: fullModules.every(m => selected.has(m)), reason: `${paths.length} changed paths` };
}
