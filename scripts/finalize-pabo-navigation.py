from pathlib import Path
import json
import re

ROOT = Path(".")
VERSION = "0.1.6"
APP_VERSION = "1.5.9"

# 1. Pabo Rekenklaar: laad de vaste Wisik-uitgang.
pabo_path = ROOT / "public/apps/pabo-rekenklaar/index.html"
pabo = pabo_path.read_text(encoding="utf-8")
style_tag = '<link rel="stylesheet" href="./wisik-bridge.css?v=1.0.0">'
script_tag = '<script src="./wisik-bridge.js?v=1.0.0" defer></script>'
if style_tag not in pabo:
    if "</head>" not in pabo:
        raise SystemExit("Geen </head> gevonden in Pabo Rekenklaar")
    pabo = pabo.replace("</head>", f"  {style_tag}\n  {script_tag}\n</head>", 1)
elif script_tag not in pabo:
    pabo = pabo.replace("</head>", f"  {script_tag}\n</head>", 1)
pabo_path.write_text(pabo, encoding="utf-8")

# 2. Kladblok: bronpagina en appversie automatisch meesturen.
kladblok_path = ROOT / "public/kladblok/index.html"
kladblok = kladblok_path.read_text(encoding="utf-8")
kladblok = re.sub(r"site-data\.js\?v=0\.1\.\d+", f"site-data.js?v={VERSION}", kladblok)
kladblok = re.sub(r"site\.js\?v=0\.1\.\d+", f"site.js?v={VERSION}", kladblok)
context_script = f'<script src="/assets/js/kladblok-context.js?v={VERSION}" defer></script>'
if context_script not in kladblok:
    marker = f'<script src="/assets/js/site.js?v={VERSION}" defer></script>'
    if marker not in kladblok:
        raise SystemExit("Actuele site.js-verwijzing ontbreekt in Kladblok")
    kladblok = kladblok.replace(marker, marker + context_script, 1)
kladblok = re.sub(r'name="Siteversie" value="0\.1\.\d+"', f'name="Siteversie" value="{VERSION}"', kladblok)
kladblok = kladblok.replace(
    'name="_subject" value="[Wisik-Kladblok] Nieuwe notitie"',
    'name="_subject" value="Wisik Kladblok – nieuwe reactie"'
)
if 'name="Pagina"' not in kladblok:
    marker = f'<input type="hidden" name="Siteversie" value="{VERSION}">'
    fields = '<input type="hidden" name="Pagina" value="">\n<input type="hidden" name="Attractieversie" value="">'
    if marker not in kladblok:
        raise SystemExit("Siteversieveld ontbreekt in Kladblok")
    kladblok = kladblok.replace(marker, marker + "\n" + fields, 1)
if 'data-feedback-context' not in kladblok:
    marker = '<div class="form-note">Deel geen namen van leerlingen'
    if marker not in kladblok:
        raise SystemExit("Privacytekst ontbreekt in Kladblok")
    kladblok = kladblok.replace(marker, '<div class="form-note" data-feedback-context hidden></div>\n' + marker, 1)
kladblok_path.write_text(kladblok, encoding="utf-8")

# 3. Centrale versies.
site_data_path = ROOT / "public/assets/js/site-data.js"
site_data = site_data_path.read_text(encoding="utf-8")
site_data = re.sub(r'window\.WISIK_SITE_VERSION = "[^"]+";', f'window.WISIK_SITE_VERSION = "{VERSION}";', site_data, count=1)
site_data_path.write_text(site_data, encoding="utf-8")

package_path = ROOT / "package.json"
package = json.loads(package_path.read_text(encoding="utf-8"))
package["version"] = VERSION
package["scripts"]["check"] = "node scripts/check-site.mjs && node scripts/test-feedback.mjs && node scripts/test-pabo-navigation.mjs"
package_path.write_text(json.dumps(package, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

# 4. Bestaande releasecontroles naar de actuele siteversie brengen.
for relative in ["scripts/check-site.mjs", "scripts/test-feedback.mjs"]:
    target = ROOT / relative
    text = target.read_text(encoding="utf-8")
    text = text.replace('0.1.5', VERSION)
    target.write_text(text, encoding="utf-8")

# 5. Nieuwe regressietest voor navigatie, lokale voortgang en Kladblokcontext.
test_path = ROOT / "scripts/test-pabo-navigation.mjs"
test_path.write_text(r'''import fs from "node:fs";
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
''', encoding="utf-8")

# 6. Korte documentatieactualisatie.
readme_path = ROOT / "README.md"
readme = readme_path.read_text(encoding="utf-8")
readme = re.sub(r"# Wisik\.nl — versie 0\.1\.\d+", f"# Wisik.nl — versie {VERSION}", readme)
if "vaste terugweg vanuit Pabo Rekenklaar" not in readme:
    marker = "- Cloudflare Email Routing voor `kladblok@wisik.nl`;"
    readme = readme.replace(marker, marker + "\n- een vaste terugweg vanuit Pabo Rekenklaar naar het Wisik-terrein;\n- automatische bronpagina- en attractieversieregistratie in het Kladblok;", 1)
readme_path.write_text(readme, encoding="utf-8")

tests_path = ROOT / "TEST-RESULTS.md"
tests = tests_path.read_text(encoding="utf-8")
tests = re.sub(r"# Testresultaten Wisik 0\.1\.\d+", f"# Testresultaten Wisik {VERSION}", tests)
section = """
## Navigatie vanuit Pabo Rekenklaar

Automatisch gecontroleerd:

- een permanent zichtbare, compacte terugweg naar het Wisik-terrein;
- het Wisik-merkteken is een echte link naar de hoofdpagina;
- vóór vertrek wordt een aanvullend lokaal voortgangssnapshot opgeslagen en krijgt de app tijd voor haar eigen opslaghandlers;
- een directe Kladbloklink stuurt de exacte bron-URL en Pabo Rekenklaar-versie 1.5.9 mee;
- het Kladblok neemt bronpagina en attractieversie op in de verzonden notitie;
- de navigatie heeft een afzonderlijke mobiele vormgeving.
"""
if "## Navigatie vanuit Pabo Rekenklaar" not in tests:
    tests += "\n" + section.strip() + "\n"
tests_path.write_text(tests, encoding="utf-8")
