import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "public/kladblok/index.html"), "utf8");
const homepage = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
const siteJs = fs.readFileSync(path.join(root, "public/assets/js/site.js"), "utf8");
const headers = fs.readFileSync(path.join(root, "public/_headers"), "utf8");
const siteVersion = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version;

function hasClassToken(markup, token) {
  return [...markup.matchAll(/\sclass=["']([^"']+)["']/g)]
    .some((match) => match[1].split(/\s+/).includes(token));
}

function headerBlock(source, route) {
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === route);
  if (start < 0) return "";
  let end = start + 1;
  while (end < lines.length && lines[end].trim() !== "") end += 1;
  return lines.slice(start, end).join("\n");
}

function visibleMarkup(source) {
  return source.replace(/<!--[\s\S]*?-->/g, "");
}

const requiredFragments = [
  `src="/assets/js/site-data.js?v=${siteVersion}"`,
  `src="/assets/js/site.js?v=${siteVersion}"`,
  'class="feedback-panel wisik-direct-feedback-form"',
  'action="https://formsubmit.co/kladblok@wisik.nl"',
  'method="POST"',
  'name="_subject"',
  'name="_template" value="table"',
  'name="_next" value="https://wisik.nl/kladblok/?verzonden=1"',
  'name="_url" value="https://wisik.nl/kladblok/"',
  `name="Siteversie" value="${siteVersion}"`,
  'name="Bronpagina"',
  'name="Bronproduct"',
  'name="Productversie"',
  'name="Onderdeel"',
  'name="Categorie"',
  'name="Attractie of terrein"',
  'name="Bericht" minlength="10" maxlength="2000" required',
  'name="email" type="email"',
  'name="Toestemming geanonimiseerd citaat"',
  'name="_honey"',
  'data-feedback-source hidden'
];

for (const fragment of requiredFragments) {
  if (!html.includes(fragment)) throw new Error(`Kladblok mist: ${fragment}`);
}

if (hasClassToken(html, "feedback-form")) throw new Error("De oude formulierklasse kan nog door gecacht JavaScript worden uitgeschakeld");
const homepageKladblok = visibleMarkup(homepage).match(/<section\b[^>]*id=["']kladblok["'][\s\S]*?<\/section>/i)?.[0] || "";
if (!homepageKladblok.includes('data-kladblok-entry')) throw new Error("De homepage mist de centrale Kladblokdoorgang");
if (!homepageKladblok.includes('href="/kladblok/">Open het Kladblok')) throw new Error("De Kladblokdoorgang wijst niet naar de centrale pagina");
if (/<form\b/i.test(homepageKladblok)) throw new Error("De homepage bevat opnieuw een tweede Kladblokformulier");
if (hasClassToken(homepage, "feedback-form") || hasClassToken(homepage, "turnstile-mount")) throw new Error("De homepage bevat nog oude Kladblok- of Turnstile-code");
if (!homepage.includes(`src="/assets/js/site-data.js?v=${siteVersion}"`) || !homepage.includes(`src="/assets/js/site.js?v=${siteVersion}"`)) throw new Error(`De homepage gebruikt geen cachebestendige scripts voor siteversie ${siteVersion}`);
if (/Cloudflare-sleutels|\/api\/feedback|\/api\/config/i.test(homepage)) throw new Error("De homepage bevat nog achterhaalde Cloudflare- of Kladblok-API-tekst");
if (/name=["']_captcha["'][^>]*value=["']false["']/i.test(html)) throw new Error("FormSubmit-spamcontrole is ten onrechte uitgeschakeld");
if (!/FormSubmit/.test(html) || !/30 dagen/.test(html)) throw new Error("Externe verwerking of bewaartermijn is niet zichtbaar bij het formulier");
if (!html.includes("exacte bronpagina") || !html.includes("productversie")) throw new Error("De gebruiker wordt niet geïnformeerd over meegestuurde context");
if (!siteJs.includes('querySelectorAll(".wisik-direct-feedback-form")')) throw new Error("Het nieuwe Kladblokformulier is niet gekoppeld aan het actuele script");
if (!siteJs.includes('searchParams.get("verzonden") === "1"')) throw new Error("Bevestiging na succesvolle verzending ontbreekt");
if (!siteJs.includes("submit.disabled = false")) throw new Error("Herstel van een eerder gecachte uitgeschakelde knop ontbreekt");
if (!siteJs.includes('const WISIK_CONTEXT_KEY = "wisik-last-attraction-context-v1"')) throw new Error("De gedeelde Wisik-contextsleutel ontbreekt");
if (!siteJs.includes('sessionStorage.getItem(WISIK_CONTEXT_KEY)')) throw new Error("Het Kladblok leest broncontext niet uit de browsersessie");
for (const mapping of ["Bronpagina:", "Bronproduct:", "Productversie:", "Onderdeel:"]) {
  if (!siteJs.includes(mapping)) throw new Error(`Automatische contextmapping ontbreekt: ${mapping}`);
}
if (!siteJs.includes('attraction.value = "Pabo Rekenklaar"')) throw new Error("Pabo Rekenklaar wordt vanuit broncontext niet automatisch geselecteerd");
if (!siteJs.includes('note.textContent = `Automatisch meegestuurde context:')) throw new Error("Zichtbare contextbevestiging ontbreekt");
if (!siteJs.includes('[Wisik-Kladblok] ${context.product}${version}')) throw new Error("Product en productversie ontbreken in het automatische e-mailonderwerp");
if (/turnstile|\/api\/feedback|\/api\/config/i.test(siteJs)) throw new Error("De voorkant bevat nog overbodige Turnstile- of Kladblok-API-code");
if (!/form-action\s+'self'\s+https:\/\/formsubmit\.co/.test(headerBlock(headers, "/*"))) throw new Error("De Content-Security-Policy blokkeert FormSubmit");
if (!/Cache-Control:\s*no-cache, max-age=0, must-revalidate/.test(headerBlock(headers, "/assets/js/*"))) throw new Error("JavaScript kan nog langdurig door Safari worden gecachet");
if (/Cache-Control:\s*public, max-age=604800/.test(headerBlock(headers, "/assets/*"))) throw new Error("Een brede assets-cache-regel kan de JavaScript-cachefix overschrijven");
if (/challenges\.cloudflare\.com/.test(headers)) throw new Error("De Content-Security-Policy bevat nog ongebruikte Turnstile-uitzonderingen");
if (fs.existsSync(path.join(root, "functions/api/config.js")) || fs.existsSync(path.join(root, "functions/api/feedback.js"))) throw new Error("Overbodige Kladblok-API-functies zijn nog aanwezig");

console.log("Kladblokcontrole geslaagd: één centraal formulier, terrein-doorgang, directe bezorging, cachefix, broncontext, spamcontrole en succesroute.");
