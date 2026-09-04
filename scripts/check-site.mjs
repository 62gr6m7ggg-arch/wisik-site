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
  path.join(publicDir, "assets/js/site.js"),
  path.join(root, "functions/api/config.js"),
  path.join(root, "functions/api/feedback.js")
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
if (!siteData.includes('window.WISIK_SITE_VERSION = "0.1.2"')) fail("Siteversie 0.1.2 ontbreekt in site-data.js");
if (!siteData.includes('id: "pabo-rekenklaar"')) fail("Pabo Rekenklaar ontbreekt in het attractieregister");

const feedbackFunction = fs.readFileSync(path.join(root, "functions/api/feedback.js"), "utf8");
const siteJs = fs.readFileSync(path.join(publicDir, "assets/js/site.js"), "utf8");
const wrangler = fs.readFileSync(path.join(root, "wrangler.jsonc"), "utf8");

if (!feedbackFunction.includes('FORM_ENDPOINT = "https://formsubmit.co/kladblok@wisik.nl"')) {
  fail("Kladblok mist de vaste gratis FormSubmit-bezorgroute");
}
if (!feedbackFunction.includes("delivery:") || !feedbackFunction.includes("TURNSTILE_SECRET_KEY")) {
  fail("Kladblok mist de server-side validatie of veilige bezorgdescriptor");
}
if (/formsubmit\.co\/ajax|\/email\/sending\/send|CF_ACCOUNT_ID|EMAIL_API_TOKEN/.test(feedbackFunction)) {
  fail("Kladblok bevat nog een geblokkeerde of betaalde server-to-server e-mailroute");
}
if (!siteJs.includes("submitViaBrowser") || !siteJs.includes('action.pathname !== "/kladblok@wisik.nl"') || !siteJs.includes("relay.submit()")) {
  fail("Kladblok mist de begrensde browserpost na server-side validatie");
}
if (!siteJs.includes('fetch("/api/feedback"')) fail("Kladblok omzeilt de Wisik-validatiefunctie");
if (/"send_email"|send_email\s*=/.test(wrangler)) fail("Pages-configuratie bevat een niet-ondersteunde send_email-binding");

const privacyNotes = fs.readFileSync(path.join(root, "PRIVACY-NOTITIES.md"), "utf8");
if (!/FormSubmit/i.test(privacyNotes) || !/30 dagen/i.test(privacyNotes)) {
  fail("Privacy-notities vermelden FormSubmit en de bewaartermijn van 30 dagen niet");
}

if (failures.length) {
  console.error(`Wisik kwaliteitscontrole mislukt (${failures.length}):`);
  for (const issue of failures) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`Wisik kwaliteitscontrole geslaagd: ${htmlFiles.length} HTML-pagina's, interne links, JavaScript-syntaxis, gevalideerde Kladblokbezorging en Pabo-releasecontrole.`);
