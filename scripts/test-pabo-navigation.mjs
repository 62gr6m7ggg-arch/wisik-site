import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const siteVersion = JSON.parse(read("package.json")).version;

const pabo = read("public/apps/pabo-rekenklaar/index.html");
const bridge = read("public/apps/pabo-rekenklaar/wisik-bridge.js");
const bridgeCss = read("public/apps/pabo-rekenklaar/wisik-bridge.css");
const kladblok = read("public/kladblok/index.html");
const context = read("public/assets/js/kladblok-context.js");

const requiredPabo = [
  './wisik-bridge.css?v=1.1.1',
  './wisik-bridge.js?v=1.1.1'
];
for (const fragment of requiredPabo) {
  if (!pabo.includes(fragment)) throw new Error(`Pabo Rekenklaar mist ${fragment}`);
}
if (!/localStorage/i.test(pabo)) throw new Error("Pabo Rekenklaar bewaart voortgang niet lokaal");

const requiredBridge = [
  'https://wisik.nl/',
  'https://wisik.nl/kladblok/',
  'Terug naar het Wisik-terrein',
  'localStorage.setItem(SNAPSHOT_KEY',
  'active.blur()',
  'url.searchParams.set("bron"',
  'url.searchParams.set("appversie", currentAppVersion())',
  'window.PaboRekenklaarQA?.version',
  'version: currentAppVersion()'
];
for (const fragment of requiredBridge) {
  if (!bridge.includes(fragment)) throw new Error(`Wisik-bridge mist ${fragment}`);
}
if (/const APP_VERSION\s*=/.test(bridge)) throw new Error("Wisik-bridge bevat nog een tweede, handmatig versienummer");
if (!bridgeCss.includes("flex-wrap: wrap") || !bridgeCss.includes("safe-area-inset-top") || !bridgeCss.includes("@media (max-width: 620px)")) {
  throw new Error("De gezamenlijke Wisik-bovenbalk kan niet aantoonbaar mobiel doorlopen");
}
if (/position\s*:\s*fixed/.test(bridgeCss)) throw new Error("De Wisik-uitgang mag niet meer los bovenop de Pabo-bovenbalk zweven");
for (const fragment of ['topbar.appendChild(nav)', 'nav.appendChild(terrain)', 'wisik-header-integrated', 'observeNavigationSize()', 'ResizeObserver']) {
  if (!bridge.includes(fragment)) throw new Error(`Geïntegreerde navigatie mist ${fragment}`);
}
if (!bridgeCss.includes("--wisik-header-height") || !bridgeCss.includes("min-height: 44px") || !bridgeCss.includes("@media print")) {
  throw new Error("Dynamische headerhoogte, aanraakgrootte of printweergave ontbreekt");
}

const requiredKladblok = [
  `/assets/js/kladblok-context.js?v=${siteVersion}`,
  'name="Pagina"',
  'name="Attractieversie"',
  'data-feedback-context',
  `name="Siteversie" value="${siteVersion}"`,
  'Wisik Kladblok – nieuwe reactie'
];
for (const fragment of requiredKladblok) {
  if (!kladblok.includes(fragment)) throw new Error(`Kladblok mist ${fragment}`);
}

const requiredContext = [
  'params.get("bron")',
  'params.get("appversie")',
  'url.origin === window.location.origin',
  '[name=\'Pagina\']',
  '[name=\'Attractieversie\']'
];
for (const fragment of requiredContext) {
  if (!context.includes(fragment)) throw new Error(`Kladblokcontext mist ${fragment}`);
}

console.log("Pabo-navigatiecontrole geslaagd: gezamenlijke doorlopende bovenbalk, lokaal voortgangssnapshot, mobiele vormgeving en automatische Kladblokcontext.");
