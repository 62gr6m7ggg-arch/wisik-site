import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const failures = [];
const siteVersion = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function fail(message) { failures.push(message); }
function rel(file) { return path.relative(root, file).replaceAll(path.sep, "/"); }
function hasClassToken(html, token) {
  return [...html.matchAll(/\sclass=["']([^"']+)["']/g)]
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

const htmlFiles = walk(publicDir).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  if (!/<html\s+lang=["']nl["']/i.test(html)) fail(`${rel(file)} mist lang=nl`);
  if (!/<meta\s+name=["']viewport["']/i.test(html)) fail(`${rel(file)} mist viewport-meta`);
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${rel(file)} mist een titel`);

  const coreScriptRefs = [...html.matchAll(/\ssrc=["'](\/assets\/js\/(?:site-data|site)\.js(?:\?[^"']*)?)["']/g)];
  if (hasClassToken(html, "site-header") && coreScriptRefs.length !== 2) {
    fail(`${rel(file)} mist één of beide gedeelde sitescripts`);
  }
  const cacheVersionedScriptRefs = [...html.matchAll(/\ssrc=["'](\/assets\/js\/[A-Za-z0-9._-]+\.js(?:\?[^"']*)?)["']/g)];
  for (const [, source] of cacheVersionedScriptRefs) {
    const script = source.split("?")[0].split("/").pop();
    if (source !== `/assets/js/${script}?v=${siteVersion}`) {
      fail(`${rel(file)} gebruikt ${script} zonder actuele cacheversie ${siteVersion}`);
    }
  }
  if (hasClassToken(html, "site-header") && !html.includes(`href="/assets/css/styles.css?v=${siteVersion}"`)) {
    fail(`${rel(file)} gebruikt de gedeelde vormgeving niet met cacheversie ${siteVersion}`);
  }

  if (hasClassToken(html, "feedback-form")) fail(`${rel(file)} bevat nog het oude Kladblokformulier`);
  if (hasClassToken(html, "turnstile-mount")) fail(`${rel(file)} bevat nog een oude Turnstile-plaatsaanduiding`);
  if (/Cloudflare-sleutels|\/api\/feedback|\/api\/config/i.test(html)) fail(`${rel(file)} bevat nog achterhaalde Kladbloktekst of API-code`);

  for (const [, version] of html.matchAll(/data-site-version[^>]*>\s*([^<\s]+)\s*</g)) {
    if (version !== siteVersion) fail(`${rel(file)} toont siteversie ${version} in plaats van ${siteVersion}`);
  }

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

const formLocations = htmlFiles.flatMap((file) => {
  const count = (fs.readFileSync(file, "utf8").match(/<form\b/gi) || []).length;
  return Array.from({ length: count }, () => rel(file));
});
if (formLocations.length !== 1 || formLocations[0] !== "public/kladblok/index.html") {
  fail(`Verwacht exact één formulier op de centrale Kladblokpagina; gevonden in: ${formLocations.join(", ") || "geen pagina"}`);
}

for (const file of walk(publicDir).filter((candidate) => candidate.endsWith(".js"))) {
  try { execFileSync(process.execPath, ["--check", file], { stdio: "pipe" }); }
  catch (error) { fail(`${rel(file)} heeft een JavaScript-syntaxfout: ${String(error.stderr || error.message).trim()}`); }
}

const paboFile = path.join(publicDir, "apps/pabo-rekenklaar/index.html");
const pabo = fs.readFileSync(paboFile, "utf8");
const paboVersion = pabo.match(/const APP_VERSION\s*=\s*["']([^"']+)["']/)?.[1];
if (!paboVersion) fail("Pabo Rekenklaar bevat geen herkenbare APP_VERSION");
if (!pabo.includes(`<title>Pabo Rekenklaar ${paboVersion}`)) fail(`Pabo Rekenklaar-documenttitel vermeldt niet versie ${paboVersion}`);
if (!pabo.includes(`<span id="homeVersion">${paboVersion}</span>`)) fail(`Pabo Rekenklaar toont op het beginscherm niet versie ${paboVersion}`);
const conversionDeclarations = (pabo.match(/function\s+genBConversions\s*\(/g) || []).length;
if (conversionDeclarations !== 1) fail(`genBConversions komt ${conversionDeclarations} keer voor; verwacht exact 1`);
if (/RWT\s+versie\s+3\.1|handreiking-31\.pdf/i.test(pabo)) fail("Pabo Rekenklaar bevat de afgekeurde RWT 3.1-verwijzing");
if (!/rwt-handreiking_22\.pdf/.test(pabo)) fail("Pabo Rekenklaar mist de officiële handreiking 2.2-link");

const exitLinks = [...pabo.matchAll(/<a\b[^>]*data-wisik-exit[^>]*>/g)].map((match) => match[0]);
if (exitLinks.length < 2) fail("Pabo Rekenklaar mist een dubbele, herkenbare uitgang naar het Wisik-terrein");
if (exitLinks.some((link) => !/href=["']https:\/\/wisik\.nl\/["']/.test(link))) fail("Een Pabo-terreinuitgang wijst niet naar https://wisik.nl/");
if (!pabo.includes('Terug naar het Wisik-terrein') || !pabo.includes('class="terrain-short">Terrein</span>')) fail("Pabo Rekenklaar mist duidelijke desktop- of mobiele uitgangstekst");
if (!pabo.includes('function persistBeforeWisikExit(){saveState();rememberWisikContext()}')) fail("Pabo Rekenklaar slaat voortgang en context niet expliciet op vóór vertrek");
if (!pabo.includes('window.addEventListener("pagehide",persistBeforeWisikExit)')) fail("Pabo Rekenklaar mist opslag bij mobiele paginawissels");
if (!pabo.includes('sessionStorage.setItem(WISIK_CONTEXT_KEY')) fail("Pabo Rekenklaar bewaart geen Kladblokcontext in de browsersessie");
if (!pabo.includes('productVersion:APP_VERSION') || !pabo.includes('pageUrl:window.location.href')) fail("Pabo Rekenklaar registreert productversie of bron-URL niet voor het Kladblok");

const siteData = fs.readFileSync(path.join(publicDir, "assets/js/site-data.js"), "utf8");
if (!siteData.includes(`window.WISIK_SITE_VERSION = "${siteVersion}"`)) fail(`Siteversie ${siteVersion} ontbreekt in site-data.js`);
if (!siteData.includes('id: "pabo-rekenklaar"')) fail("Pabo Rekenklaar ontbreekt in het attractieregister");
if (!new RegExp(`id:\\s*["']pabo-rekenklaar["'][\\s\\S]*?version:\\s*["']${paboVersion.replaceAll(".", "\\.")}["']`).test(siteData)) fail(`Attractieregister vermeldt Pabo Rekenklaar ${paboVersion} niet`);

const productPage = fs.readFileSync(path.join(publicDir, "pabo/pabo-rekenklaar/index.html"), "utf8");
if (!new RegExp(`<strong>Versie</strong>\\s*<span>${paboVersion.replaceAll(".", "\\.")}</span>`).test(productPage)) fail(`Pabo-productpagina vermeldt versie ${paboVersion} niet`);
if (!productPage.includes('terugkeren naar het Wisik-terrein')) fail("Pabo-productpagina beschrijft de nieuwe terugweg niet");
const homepage = fs.readFileSync(path.join(publicDir, "index.html"), "utf8");
if (!homepage.includes(`RWT-voorbereiding · versie ${paboVersion}.`)) fail(`Homepage vermeldt Pabo Rekenklaar ${paboVersion} niet`);
const moshpitPage = fs.readFileSync(path.join(publicDir, "moshpit/index.html"), "utf8");
if (!moshpitPage.includes(`Pabo Rekenklaar ${paboVersion}`)) fail(`Moshpit vermeldt Pabo Rekenklaar ${paboVersion} niet`);
const homepageKladblok = visibleMarkup(homepage).match(/<section\b[^>]*id=["']kladblok["'][\s\S]*?<\/section>/i)?.[0] || "";
if (!homepageKladblok.includes('data-kladblok-entry') || !homepageKladblok.includes('href="/kladblok/">Open het Kladblok')) {
  fail("Homepage mist de centrale doorgang naar het Wisik-Kladblok");
}
if (/<form\b/i.test(homepageKladblok)) {
  fail("Homepage bevat opnieuw een tweede Kladblokformulier");
}

const kladblok = fs.readFileSync(path.join(publicDir, "kladblok/index.html"), "utf8");
const siteJs = fs.readFileSync(path.join(publicDir, "assets/js/site.js"), "utf8");
const wrangler = fs.readFileSync(path.join(root, "wrangler.jsonc"), "utf8");
const headers = fs.readFileSync(path.join(publicDir, "_headers"), "utf8");

if (!kladblok.includes(`src="/assets/js/site-data.js?v=${siteVersion}"`) || !kladblok.includes(`src="/assets/js/site.js?v=${siteVersion}"`)) {
  fail(`Kladblok mist versiegebonden JavaScript-URL's voor siteversie ${siteVersion}`);
}
if (!hasClassToken(kladblok, "wisik-direct-feedback-form") || hasClassToken(kladblok, "feedback-form")) {
  fail("Kladblok gebruikt nog de oude formulierklasse die gecacht JavaScript kan uitschakelen");
}
if (!kladblok.includes('action="https://formsubmit.co/kladblok@wisik.nl"') || !kladblok.includes('method="POST"')) {
  fail("Kladblok mist de directe gratis FormSubmit-bezorgroute");
}
if (!kladblok.includes(`name="Siteversie" value="${siteVersion}"`)) fail(`Kladblok vermeldt niet siteversie ${siteVersion}`);
for (const field of ["Bronpagina", "Bronproduct", "Productversie", "Onderdeel"]) {
  if (!kladblok.includes(`name="${field}"`)) fail(`Kladblok mist automatisch contextveld ${field}`);
  if (!siteJs.includes(`${field}:`)) fail(`Kladblokscript vult automatisch contextveld ${field} niet`);
}
if (!kladblok.includes('data-feedback-source hidden')) fail("Kladblok mist een zichtbare melding over meegestuurde context");
if (!siteJs.includes('sessionStorage.getItem(WISIK_CONTEXT_KEY)')) fail("Kladblok leest de Pabo-context niet uit sessionStorage");
if (!siteJs.includes('attraction.value = "Pabo Rekenklaar"')) fail("Kladblok selecteert Pabo Rekenklaar niet automatisch vanuit broncontext");
if (!kladblok.includes('name="_honey"') || /name=["']_captcha["'][^>]*value=["']false["']/i.test(kladblok)) {
  fail("Kladblok mist de honeypot of schakelt de provider-spamcontrole uit");
}
if (!siteJs.includes('querySelectorAll(".wisik-direct-feedback-form")') || !siteJs.includes("submit.disabled = false")) {
  fail("Kladblokscript mist de nieuwe formulierkoppeling of herstelroute voor de knop");
}
const publicFrontend = walk(publicDir)
  .filter((file) => /\.(?:html|js|css)$/.test(file))
  .map((file) => fs.readFileSync(file, "utf8"))
  .join("\n");
if (/turnstile|\/api\/feedback|\/api\/config|Cloudflare-sleutels/i.test(publicFrontend)) {
  fail("Kladblok bevat nog overbodige Turnstile- of Pages Function-code");
}
if (fs.existsSync(path.join(root, "functions/api/config.js")) || fs.existsSync(path.join(root, "functions/api/feedback.js"))) {
  fail("Overbodige Kladblok-API-functies zijn nog aanwezig");
}
const globalHeaders = headerBlock(headers, "/*");
const javascriptHeaders = headerBlock(headers, "/assets/js/*");
const dataHeaders = headerBlock(headers, "/assets/data/*");
const cssHeaders = headerBlock(headers, "/assets/css/*");
const backstageHeaders = headerBlock(headers, "/backstage/*");
const broadAssetHeaders = headerBlock(headers, "/assets/*");
if (!/form-action\s+'self'\s+https:\/\/formsubmit\.co/.test(globalHeaders)) {
  fail("Content-Security-Policy blokkeert de Kladblokpost naar FormSubmit");
}
if (!/Cache-Control:\s*no-cache, max-age=0, must-revalidate/.test(javascriptHeaders)) {
  fail("JavaScript kan nog langdurig in Safari worden gecachet");
}
if (!/Cache-Control:\s*no-cache, max-age=0, must-revalidate/.test(dataHeaders)) {
  fail("Het openbare vrijgavebewijs kan nog langdurig worden gecachet");
}
if (!/Cache-Control:\s*no-cache, max-age=0, must-revalidate/.test(cssHeaders)) {
  fail("De gedeelde CSS kan nog langdurig in mobiele browsers worden gecachet");
}
if (!/Cache-Control:\s*no-cache, no-store, max-age=0, must-revalidate/.test(backstageHeaders)) {
  fail("De Backstage-HTML heeft geen expliciete cachebestendige route");
}
if (/Cache-Control:\s*public, max-age=604800/.test(broadAssetHeaders)) {
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

console.log(`Wisik kwaliteitscontrole geslaagd: ${htmlFiles.length} HTML-pagina's, versiegebonden scripts en CSS, één centraal Kladblok, interne links, JavaScript-syntaxis, Pabo-terreinuitgang en Pabo-releasecontrole.`);
