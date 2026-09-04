import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "public/kladblok/index.html"), "utf8");
const siteJs = fs.readFileSync(path.join(root, "public/assets/js/site.js"), "utf8");
const headers = fs.readFileSync(path.join(root, "public/_headers"), "utf8");

const requiredFragments = [
  'src="/assets/js/site-data.js?v=0.1.5"',
  'src="/assets/js/site.js?v=0.1.5"',
  'class="feedback-panel wisik-direct-feedback-form"',
  'action="https://formsubmit.co/kladblok@wisik.nl"',
  'method="POST"',
  'name="_subject"',
  'name="_template" value="table"',
  'name="_next" value="https://wisik.nl/kladblok/?verzonden=1"',
  'name="_url" value="https://wisik.nl/kladblok/"',
  'name="Siteversie" value="0.1.5"',
  'name="Categorie"',
  'name="Attractie of terrein"',
  'name="Bericht" minlength="10" maxlength="2000" required',
  'name="email" type="email"',
  'name="Toestemming geanonimiseerd citaat"',
  'name="_honey"'
];

for (const fragment of requiredFragments) {
  if (!html.includes(fragment)) throw new Error(`Kladblok mist: ${fragment}`);
}

if (/class=["'][^"']*\bfeedback-form\b/i.test(html)) {
  throw new Error("De oude formulierklasse kan nog door gecacht JavaScript worden uitgeschakeld");
}
if (/name=["']_captcha["'][^>]*value=["']false["']/i.test(html)) {
  throw new Error("FormSubmit-spamcontrole is ten onrechte uitgeschakeld");
}
if (!/FormSubmit/.test(html) || !/30 dagen/.test(html)) {
  throw new Error("Externe verwerking of bewaartermijn is niet zichtbaar bij het formulier");
}
if (!siteJs.includes('querySelectorAll(".wisik-direct-feedback-form")')) {
  throw new Error("Het nieuwe Kladblokformulier is niet gekoppeld aan het actuele script");
}
if (!siteJs.includes('searchParams.get("verzonden") === "1"')) {
  throw new Error("Bevestiging na succesvolle verzending ontbreekt");
}
if (!siteJs.includes("submit.disabled = false")) {
  throw new Error("Herstel van een eerder gecachte uitgeschakelde knop ontbreekt");
}
if (/turnstile|\/api\/feedback|\/api\/config/i.test(siteJs)) {
  throw new Error("De voorkant bevat nog overbodige Turnstile- of Kladblok-API-code");
}
if (!/form-action\s+'self'\s+https:\/\/formsubmit\.co/.test(headers)) {
  throw new Error("De Content-Security-Policy blokkeert FormSubmit");
}
if (!/\/assets\/js\/\*\s+[\s\S]*Cache-Control:\s*no-cache, max-age=0, must-revalidate/.test(headers)) {
  throw new Error("JavaScript kan nog langdurig door Safari worden gecachet");
}
if (/\/assets\/\*\s+[\s\S]*Cache-Control:\s*public, max-age=604800/.test(headers)) {
  throw new Error("Een brede assets-regel kan de JavaScript-cachefix overschrijven");
}
if (/challenges\.cloudflare\.com/.test(headers)) {
  throw new Error("De Content-Security-Policy bevat nog ongebruikte Turnstile-uitzonderingen");
}
if (fs.existsSync(path.join(root, "functions/api/config.js")) || fs.existsSync(path.join(root, "functions/api/feedback.js"))) {
  throw new Error("Overbodige Kladblok-API-functies zijn nog aanwezig");
}

console.log("Kladblokcontrole geslaagd: Safari-cache omzeild, knop herstelbaar, directe bezorging, spamcontrole, honeypot en succesroute.");
