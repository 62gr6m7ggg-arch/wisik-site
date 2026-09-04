import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const paboPath = path.join(root, "public/apps/pabo-rekenklaar/index.html");
const pabo = fs.readFileSync(paboPath, "utf8");
const kladblok = fs.readFileSync(path.join(root, "public/kladblok/index.html"), "utf8");
const siteJs = fs.readFileSync(path.join(root, "public/assets/js/site.js"), "utf8");
const siteData = fs.readFileSync(path.join(root, "public/assets/js/site-data.js"), "utf8");
const productPage = fs.readFileSync(path.join(root, "public/pabo/pabo-rekenklaar/index.html"), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(/<title>Pabo Rekenklaar 1\.6\.0\b/.test(pabo), "Documenttitel vermeldt Pabo Rekenklaar 1.6.0 niet");
assert(/const APP_VERSION\s*=\s*["']1\.6\.0["']/.test(pabo), "APP_VERSION 1.6.0 ontbreekt");
assert(pabo.includes('<span id="homeVersion">1.6.0</span>'), "Zichtbare Pabo-versie 1.6.0 ontbreekt");
assert(pabo.includes('{version:"1.6.0"'), "Versiehistorie voor 1.6.0 ontbreekt");

const exitLinks = [...pabo.matchAll(/<a\b[^>]*data-wisik-exit[^>]*>/g)].map((match) => match[0]);
assert(exitLinks.length >= 2, "Er zijn minder dan twee herkenbare uitgangen naar Wisik");
assert(exitLinks.every((link) => /href=["']https:\/\/wisik\.nl\/["']/.test(link)), "Niet iedere Wisik-uitgang wijst naar het hoofddomein");
assert(pabo.includes('class="wisik-terrain-link"'), "De expliciete terreinuitgang ontbreekt");
assert(pabo.includes('Terug naar het Wisik-terrein'), "De terreinuitgang heeft geen duidelijke tekst");
assert(/class=["']logo-orbit["'][^>]*href=["']https:\/\/wisik\.nl\//.test(pabo), "Het Wisik-logo is geen teruglink");
assert(pabo.includes('class="terrain-short">Terrein</span>'), "De compacte mobiele terreinlabel ontbreekt");
assert(pabo.includes('@media(max-width:420px)'), "De terreinuitgang heeft geen specifieke smalschermregeling");
assert(pabo.includes('.top-stats .stat-pill:first-of-type{display:none}'), "De mobiele bovenbalk maakt onvoldoende ruimte voor de uitgang");

assert(pabo.includes('function persistBeforeWisikExit(){saveState();rememberWisikContext()}'), "Voortgang en context worden niet samen opgeslagen vóór vertrek");
assert(pabo.includes('link.addEventListener("pointerdown",persistBeforeWisikExit'), "Opslag bij pointerdown ontbreekt");
assert(pabo.includes('link.addEventListener("click",persistBeforeWisikExit)'), "Opslag bij klik ontbreekt");
assert(pabo.includes('window.addEventListener("pagehide",persistBeforeWisikExit)'), "Opslag bij mobiele paginawissel ontbreekt");
assert(pabo.includes('document.visibilityState==="hidden"'), "Opslag bij achtergrondwissel ontbreekt");
assert(pabo.includes('sessionStorage.setItem(WISIK_CONTEXT_KEY'), "Kladblokcontext wordt niet in de browsersessie bewaard");
assert(pabo.includes('product:"Pabo Rekenklaar"'), "Productnaam ontbreekt in de Kladblokcontext");
assert(pabo.includes('productVersion:APP_VERSION'), "Productversie ontbreekt in de Kladblokcontext");
assert(pabo.includes('pageUrl:window.location.href'), "Exacte bron-URL ontbreekt in de Kladblokcontext");
assert(pabo.includes('view:(currentView||activeView?.id||"home")'), "Actief Pabo-onderdeel ontbreekt in de Kladblokcontext");
assert(pabo.includes('wisikTerrainUrl:WISIK_TERRAIN_URL'), "De interne QA metadata controleert de terrein-URL niet");
assert(pabo.includes('wisikContextKey:WISIK_CONTEXT_KEY'), "De interne QA metadata controleert de contextopslag niet");

for (const field of ["Bronpagina", "Bronproduct", "Productversie", "Onderdeel"]) {
  assert(kladblok.includes(`name="${field}"`), `Kladblok mist verborgen veld ${field}`);
  assert(siteJs.includes(`${field}:`), `Kladblokscript vult ${field} niet`);
}
assert(kladblok.includes('data-feedback-source hidden'), "Zichtbare melding over automatisch meegestuurde context ontbreekt");
assert(siteJs.includes('sessionStorage.getItem(WISIK_CONTEXT_KEY)'), "Kladblok leest de Pabo-context niet uit sessionStorage");
assert(siteJs.includes('attraction.value = "Pabo Rekenklaar"'), "Kladblok selecteert Pabo Rekenklaar niet automatisch");
assert(siteJs.includes('[Wisik-Kladblok] ${context.product}${version}'), "Kladblokonderwerp bevat product en versie niet automatisch");

assert(siteData.includes('window.WISIK_SITE_VERSION = "0.1.6"'), "Wisik-siteversie 0.1.6 ontbreekt");
assert(/id:\s*["']pabo-rekenklaar["'][\s\S]*?version:\s*["']1\.6\.0["']/.test(siteData), "Attractieregister vermeldt Pabo Rekenklaar 1.6.0 niet");
assert(productPage.includes('<strong>Versie</strong><span>1.6.0</span>'), "Pabo-productpagina vermeldt versie 1.6.0 niet");
assert(productPage.includes('terugkeren naar het Wisik-terrein'), "Pabo-productpagina beschrijft de nieuwe terugweg niet");

console.log("Pabo-navigatiecontrole geslaagd: zichtbare uitgang, mobiel ontwerp, lokale opslag, Kladblokcontext en consistente versies.");
