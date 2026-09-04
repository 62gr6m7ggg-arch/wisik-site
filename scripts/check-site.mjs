import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const failures = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function fail(message) { failures.push(message); }
function rel(file) { return path.relative(root, file).replaceAll(path.sep, "/"); }

const htmlFiles = walk(publicDir).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  if (!/<html\s+lang=["']nl["']/i.test(html)) fail(`${rel(file)} mist lang=nl`);
  if (!/<meta\s+name=["']viewport["']/i.test(html)) fail(`${rel(file)} mist viewport-meta`);
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${rel(file)} mist een titel`);

  const markupOnly = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  const ids = [...markupOnly.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) fail(`${rel(file)} bevat dubbele id's: ${[...new Set(duplicates)].join(", ")}`);

  for (const match of html.matchAll(/\shref=["']([^"']+)["']/g)) {
    const href = match[1];
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const clean = href.split(/[?#]/)[0];
    if (!clean || clean === "/") continue;
    const target = path.join(publicDir, clean.replace(/^\//, ""));
    const candidates = [target, path.join(target, "index.html"), `${target}.html`];
    if (!candidates.some((candidate) => fs.existsSync(candidate))) fail(`${rel(file)} verwijst naar ontbrekend pad ${href}`);
  }
}

for (const file of [
  path.join(publicDir, "assets/js/site-data.js"),
  path.join(publicDir, "assets/js/site.js")
]) {
  try { execFileSync(process.execPath, ["--check", file], { stdio: "pipe" }); }
  catch (error) { fail(`${rel(file)} heeft een JavaScript-syntaxfout: ${String(error.stderr || error.message).trim()}`); }
}

const paboFile = path.join(publicDir, "apps/pabo-rekenklaar/index.html");
const pabo = fs.readFileSync(paboFile, "utf8");
if (!/const APP_VERSION\s*=\s*["']1\.5\.9["']/.test(pabo)) fail("Pabo Rekenklaar in de site is niet versie 1.5.9");
const conversionDeclarations = (pabo.match(/function\s+genBConversions\s*\(/g) || []).length;
if (conversionDeclarations !== 1) fail(`genBConversions komt ${conversionDeclarations} keer voor; verwacht exact 1`);
if (/RWT\s+versie\s+3\.1|handreiking-31\.pdf/i.test(pabo)) fail("Pabo Rekenklaar bevat de afgekeurde RWT 3.1-verwijzing");
if (!/rwt-handreiking_22\.pdf/.test(pabo)) fail("Pabo Rekenklaar mist de officiële handreiking 2.2-link");

const siteData = fs.readFileSync(path.join(publicDir, "assets/js/site-data.js"), "utf8");
if (!siteData.includes('window.WISIK_SITE_VERSION = "0.1.5"')) fail("Siteversie 0.1.5 ontbreekt in site-data.js");
if (!siteData.includes('id: "pabo-rekenklaar"')) fail("Pabo Rekenklaar ontbreekt in het attractieregister");

const kladblok = fs.readFileSync(path.join(publicDir, "kladblok/index.html"), "utf8");
const siteJs = fs.readFileSync(path.join(publicDir, "assets/js/site.js"), "utf8");
const wrangler = fs.readFileSync(path.join(root, "wrangler.jsonc"), "utf8");
const headers = fs.readFileSync(path.join(publicDir, "_headers"), "utf8");

if (!kladblok.includes('src="/assets/js/site-data.js?v=0.1.5"') || !kladblok.includes('src="/assets/js/site.js?v=0.1.5"')) {
  fail("Kladblok mist versiegebonden JavaScript-URL's en kan daardoor oud Safari-script laden");
}
if (!kladblok.includes('class="feedback-panel wisik-direct-feedback-form"') || /class=["'][^"']*\bfeedback-form\b/i.test(kladblok)) {
  fail("Kladblok gebruikt nog de oude formulierklasse die gecacht JavaScript kan uitschakelen");
}
if (!kladblok.includes('action="https://formsubmit.co/kladblok@wisik.nl"') || !kladblok.includes('method="POST"')) {
  fail("Kladblok mist de directe gratis FormSubmit-bezorgroute");
}
if (!kladblok.includes('name="Siteversie" value="0.1.5"')) fail("Kladblok vermeldt niet siteversie 0.1.5");
if (!kladblok.includes('name="_honey"') || /name=["']_captcha["'][^>]*value=["']false["']/i.test(kladblok)) {
  fail("Kladblok mist de honeypot of schakelt de provider-spamcontrole uit");
}
if (!siteJs.includes('querySelectorAll(".wisik-direct-feedback-form")') || !siteJs.includes("submit.disabled = false")) {
  fail("Kladblokscript mist de nieuwe formulierkoppeling of herstelroute voor de knop");
}
if (/turnstile|\/api\/feedback|\/api\/config/i.test(siteJs + kladblok)) {
  fail("Kladblok bevat nog overbodige Turnstile- of Pages Function-code");
}
if (fs.existsSync(path.join(root, "functions/api/config.js")) || fs.existsSync(path.join(root, "functions/api/feedback.js"))) {
  fail("Overbodige Kladblok-API-functies zijn nog aanwezig");
}
if (!/form-action\s+'self'\s+https:\/\/formsubmit\.co/.test(headers)) {
  fail("Content-Security-Policy blokkeert de Kladblokpost naar FormSubmit");
}
if (!/\/assets\/js\/\*\s+[\s\S]*Cache-Control:\s*no-cache, max-age=0, must-revalidate/.test(headers)) {
  fail("JavaScript kan nog langdurig in Safari worden gecachet");
}
if (/\/assets\/\*\s+[\s\S]*Cache-Control:\s*public, max-age=604800/.test(headers)) {
  fail("Een brede assets-cache-regel kan de JavaScript-cachefix overschrijven");
}
if (/challenges\.cloudflare\.com/.test(headers)) {
  fail("Content-Security-Policy bevat nog ongebruikte Turnstile-uitzonderingen");
}
if (/TURNSTILE|FEEDBACK_|CF_ACCOUNT_ID|EMAIL_API_TOKEN|send_email/i.test(wrangler)) {
  fail("Pages-configuratie bevat nog overbodige Kladblokvariabelen of betaalde e-mailconfiguratie");
}

const privacyNotes = fs.readFileSync(path.join(root, "PRIVACY-NOTITIES.md"), "utf8");
if (!/FormSubmit/i.test(privacyNotes) || !/30 dagen/i.test(privacyNotes)) {
  fail("Privacy-notities vermelden FormSubmit en de bewaartermijn van 30 dagen niet");
}

if (failures.length) {
  console.error(`Wisik kwaliteitscontrole mislukt (${failures.length}):`);
  for (const issue of failures) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`Wisik kwaliteitscontrole geslaagd: ${htmlFiles.length} HTML-pagina's, interne links, JavaScript-syntaxis, Safari-cachefix, direct Kladblokformulier en Pabo-releasecontrole.`);
