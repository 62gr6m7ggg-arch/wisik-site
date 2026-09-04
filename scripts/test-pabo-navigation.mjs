import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

const pabo = read("public/apps/pabo-rekenklaar/index.html");
const bridge = read("public/apps/pabo-rekenklaar/wisik-bridge.js");
const bridgeCss = read("public/apps/pabo-rekenklaar/wisik-bridge.css");
const kladblok = read("public/kladblok/index.html");
const context = read("public/assets/js/kladblok-context.js");

const requiredPabo = [
  './wisik-bridge.css?v=1.0.0',
  './wisik-bridge.js?v=1.0.0'
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
  'url.searchParams.set("appversie", APP_VERSION)',
  'APP_VERSION = "1.5.9"'
];
for (const fragment of requiredBridge) {
  if (!bridge.includes(fragment)) throw new Error(`Wisik-bridge mist ${fragment}`);
}
if (!bridgeCss.includes("position: fixed") || !bridgeCss.includes("safe-area-inset-top") || !bridgeCss.includes("@media (max-width: 520px)")) {
  throw new Error("De vaste Wisik-uitgang is niet aantoonbaar mobiel ontworpen");
}

const requiredKladblok = [
  '/assets/js/kladblok-context.js?v=0.1.6',
  'name="Pagina"',
  'name="Attractieversie"',
  'data-feedback-context',
  'name="Siteversie" value="0.1.6"',
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

console.log("Pabo-navigatiecontrole geslaagd: vaste uitgang, lokaal voortgangssnapshot, mobiele vormgeving en automatische Kladblokcontext.");
