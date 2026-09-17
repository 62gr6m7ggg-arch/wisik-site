"""Eenmalige, begrensde privacywijziging. Wordt vóór de uiteindelijke PR-diff verwijderd."""
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
BASE = 'd29c51f132a766b1590d141f18eaef1f6ac8fd4e'
subprocess.run(['git', 'merge-base', '--is-ancestor', BASE, 'HEAD'], cwd=ROOT, check=True)

def read(name):
    return (ROOT / name).read_text()

def write(name, value):
    target = ROOT / name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(value)

def replace(name, old, new):
    text = read(name)
    if text.count(old) != 1:
        raise RuntimeError(f'{name}: verwacht precies één wijzigingsanker: {old[:100]!r}')
    write(name, text.replace(old, new, 1))

package = json.loads(read('package.json'))
assert package['version'] == '0.1.28', 'Stop: onverwachte siteversie; eerst opnieuw afstemmen'

site = read('public/assets/js/site.js')
start = site.index('  function readFeedbackSourceContext(currentUrl) {')
end = site.index('  function setupFeedbackForms() {', start)
site = site[:start] + r'''  // Feedback krijgt alleen een lokale webpagina, nooit query, fragment of URL-inloggegevens.
  function sameOriginFeedbackPage(value) {
    if (!value) return "";
    try {
      const url = new URL(String(value), window.location.origin);
      if (!/^https?:$/.test(url.protocol) || url.origin !== window.location.origin) return "";
      return `${url.origin}${url.pathname}`;
    } catch {
      return "";
    }
  }

  function readFeedbackSourceContext(currentUrl) {
    let stored = {};
    try {
      const candidate = JSON.parse(sessionStorage.getItem(WISIK_CONTEXT_KEY) || "{}");
      if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) stored = candidate;
    } catch {
      // Ook met geblokkeerde of beschadigde sessieopslag blijft het formulier werken.
    }
    const params = currentUrl.searchParams;
    const queryPage = sameOriginFeedbackPage(params.get("bron"));
    const storedPage = sameOriginFeedbackPage(stored.pageUrl);
    const referrerPage = sameOriginFeedbackPage(document.referrer);
    const context = {
      pageUrl: queryPage || storedPage || (referrerPage === `${window.location.origin}/kladblok/` ? "" : referrerPage),
      product: cleanContextValue(params.get("product") || params.get("attractie") || stored.product, 120),
      productVersion: cleanContextValue(params.get("productversie") || params.get("appversie") || stored.productVersion, 40),
      view: cleanContextValue(params.get("onderdeel") || stored.view, 80)
    };
    // Alleen de vier expliciete feedbackvelden; geen antwoorden, XP of diagnosegegevens kopiëren.
    return context;
  }

  function applyFeedbackSourceContext(form, context) {
    const fieldValues = {
      Bronpagina: sameOriginFeedbackPage(context.pageUrl),
      Bronproduct: context.product,
      Productversie: context.productVersion,
      Onderdeel: VIEW_LABELS[context.view] || context.view
    };
    for (const [name, value] of Object.entries(fieldValues)) {
      const field = form.elements.namedItem(name);
      if (field) field.value = value;
    }
    const attraction = form.elements.namedItem("Attractie of terrein");
    if (context.product === "Pabo Rekenklaar") {
      if (attraction) attraction.value = "Pabo Rekenklaar";
    } else if (/^(Space-tent|Ruimteklaar|Space-tent · Ruimteklaar)$/.test(context.product)) {
      if (attraction) attraction.value = "Space-tent";
    }
    const subject = form.elements.namedItem("_subject");
    if (subject && context.product) {
      const version = context.productVersion ? ` ${context.productVersion}` : "";
      subject.value = `[Wisik-Kladblok] ${context.product}${version} — nieuwe notitie`;
    }
    const note = form.querySelector("[data-feedback-source]");
    if (note && (context.product || fieldValues.Bronpagina)) {
      const parts = [context.product, context.productVersion, VIEW_LABELS[context.view] || context.view, fieldValues.Bronpagina].filter(Boolean);
      note.hidden = false;
      note.textContent = `Automatisch meegestuurde context: ${parts.join(" · ")}.`;
    }
  }

''' + site[end:]
write('public/assets/js/site.js', site)

write('public/assets/js/kladblok-context.js', r'''(() => {
  "use strict";
  const form = document.querySelector(".wisik-direct-feedback-form");
  if (!form) return;
  const params = new URL(window.location.href).searchParams;
  const sourceInput = form.querySelector("[name='Pagina']");
  const versionInput = form.querySelector("[name='Attractieversie']");
  const contextNote = form.querySelector("[data-feedback-context]");

  function sameOriginUrl(value) {
    if (!value) return "";
    try {
      const url = new URL(String(value), window.location.origin);
      if (!/^https?:$/.test(url.protocol) || url.origin !== window.location.origin) return "";
      return `${url.origin}${url.pathname}`;
    } catch {
      return "";
    }
  }

  function applyContext() {
    // Het moderne pad en dit zelfstandige vangnet hanteren hetzelfde URL-contract.
    const source = sameOriginUrl(form.querySelector("[name='Bronpagina']")?.value)
      || sameOriginUrl(params.get("bron")) || sameOriginUrl(document.referrer)
      || sameOriginUrl(window.location.href);
    const appVersion = String(form.querySelector("[name='Productversie']")?.value
      || params.get("productversie") || params.get("appversie") || "").trim().slice(0, 40);
    const attraction = String(params.get("product") || params.get("attractie") || "").trim().slice(0, 120);
    if (sourceInput) sourceInput.value = source;
    if (versionInput) versionInput.value = appVersion || "niet bekend";
    if (contextNote) {
      const primaryNote = form.querySelector("[data-feedback-source]");
      if (primaryNote && !primaryNote.hidden) {
        contextNote.hidden = true;
        contextNote.textContent = "";
      } else {
        const parts = [attraction, appVersion ? `versie ${appVersion}` : "", source].filter(Boolean);
        contextNote.textContent = `Automatisch meegestuurd: ${parts.join(" · ")}`;
        contextNote.hidden = false;
      }
    }
  }
  applyContext();
  form.addEventListener("submit", applyContext);
})();
''')

old_card = '<div><h3>Privacy</h3><p class="muted">Gewoon gebruik van Pabo Rekenklaar bewaart voortgang lokaal. Het Wisik-Kladblok verzendt alleen wat de bezoeker zelf invult en de vooraf toegelichte broncontext.</p></div>'
new_card = '<div><h3>Privacy op het hele terrein</h3><p class="muted">Je kunt Wisik zonder account gebruiken. Pabo Rekenklaar en de Space-tent bewaren je voortgang in je eigen browser, niet in een centraal studentendossier. Via het Kladblok verstuur je zelf een bericht met de vooraf toegelichte brongegevens. Voor websitebezoek en externe diensten worden daarnaast technische gegevens verwerkt.</p><p><a href="#privacy">Lees hoe Wisik met gegevens omgaat →</a></p></div>'
replace('public/backstage/index.html', old_card, new_card)
privacy = '''
<section class="section compact" id="privacy" aria-labelledby="privacy-title">
  <style>#privacy{scroll-margin-top:100px}#privacy .privacy-intro{max-width:850px}#privacy details{min-width:0;overflow-wrap:anywhere}#privacy summary{cursor:pointer;font-weight:800;padding:8px 0;min-height:44px}#privacy summary:focus-visible{outline:3px solid currentColor;outline-offset:4px}#privacy details[open] summary{margin-bottom:12px}</style>
  <span class="kicker">Jouw gegevens, helder uitgelegd</span>
  <h2 id="privacy-title">Privacy op het hele Wisik-terrein</h2>
  <p class="privacy-intro">Leren zonder account, met je voortgang in je eigen browser. Hieronder staat wat lokaal blijft en wat er gebeurt wanneer je een bericht verstuurt of een externe dienst gebruikt.</p>
  <div class="content-grid">
    <details class="content-card"><summary>Oefenen en lokale leergegevens</summary><p>Pabo Rekenklaar en de Space-tent bewaren je oefenvoortgang in je eigen browser. Daarbij kunnen bijvoorbeeld antwoorden, scores en hulpgebruik horen. Wisik slaat die leergegevens niet op als centraal studentendossier.</p><p>Het Kladblok haalt geen rekenantwoorden, XP, diagnoses, foutpatronen of leerhistorie uit die lokale voortgang op.</p></details>
    <details class="content-card"><summary>Je browser is je bewaarplek</summary><p>Lokale voortgang hoort bij de gebruikte browser en het apparaat. Wissen van browsergegevens kan je voortgang verwijderen. Een andere browser of een ander apparaat neemt die gegevens niet vanzelf over.</p><p>In de Space-tent kun je zelf je voortgang als JSON-bestand exporteren en importeren. Dit bestand bevat leergegevens: jij kiest waar je het bewaart en met wie je het deelt.</p></details>
    <details class="content-card"><summary>Een bericht via het Kladblok</summary><p>Je kiest zelf wat je invult. Een e-mailadres is optioneel en bedoeld om een reactie te kunnen ontvangen. Het bericht verschijnt niet automatisch openbaar. Een geanonimiseerd citaat gebruiken we alleen wanneer je daarvoor het afzonderlijke vakje aanvinkt.</p><p>Het formulier voegt de siteversie toe en, wanneer beschikbaar, de tent of het product, de productversie, het actieve hoofdonderdeel en de bronpagina zonder queryparameters of fragment. Je ziet vóór verzending welke broncontext wordt meegestuurd. De context bevat geen automatisch gekopieerde lokale leerresultaten.</p></details>
    <details class="content-card"><summary>Hoe lang bewaren we Kladblokberichten?</summary><p>Ontvangen Kladblok-e-mails worden bij Wisik in beginsel maximaal <strong>3 maanden</strong> bewaard. Alleen wanneer een bericht nog nodig is voor opvolging of heeft geleid tot een vervolggesprek kan het langer worden bewaard. Zodra die noodzaak vervalt, bewaren we het bericht niet langer om die reden.</p><p>De bezorgdienst FormSubmit vermeldt voor zijn eigen inzendingenarchief een bewaartermijn van <strong>30 dagen</strong>. Dat is een andere termijn dan die van de ontvangen e-mails bij Wisik. <a href="https://formsubmit.co/documentation" rel="noreferrer">Lees de documentatie van FormSubmit</a>.</p></details>
    <details class="content-card"><summary>Technische verbindingen en externe diensten</summary><p>Lokale leeropslag betekent niet dat een websitebezoek zonder technische gegevensverwerking plaatsvindt. Hosting, beveiliging en e-mailbezorging verwerken technische verbindingsgegevens. Wisik gebruikt Cloudflare voor hosting en e-mailroutering en FormSubmit voor de bezorging van het Kladblok.</p><p>Na verzenden kan FormSubmit een spamcontrole tonen. Bij externe diensten gelden ook hun eigen voorwaarden en privacy-uitleg. De aparte artiesten-ingang gebruikt een tijdelijke toegangscookie; die is geen leerlingdossier.</p></details>
    <details class="content-card"><summary>Privacyvragen en contact</summary><p>Vragen over je gegevens of over het inzien of verwijderen van een Kladblokbericht? Neem contact op met Edwin van der Plas via <a href="mailto:kladblok@wisik.nl">kladblok@wisik.nl</a> of gebruik het <a href="/kladblok/">Wisik-Kladblok</a>.</p><p>Deel geen namen van leerlingen, studentnummers of andere gevoelige persoonsgegevens. Geef alleen de informatie die nodig is om je vraag te behandelen.</p></details>
  </div>
</section>
'''
replace('public/backstage/index.html', '</main>', privacy + '</main>')
replace('public/kladblok/index.html', '<option value="Pabo Rekenklaar">Pabo Rekenklaar</option>', '<option value="Pabo Rekenklaar">Pabo Rekenklaar</option><option value="Space-tent">Space-tent</option>')
replace('public/kladblok/index.html', 'De exacte bronpagina, het Wisik-product, het actieve onderdeel en de productversie worden alleen meegestuurd wanneer die context in deze browsersessie beschikbaar is. Na verzenden verwerkt FormSubmit de notitie, kan de dienst een spamcontrole tonen en bewaart zij inzendingen maximaal 30 dagen.', 'De bronpagina zonder queryparameters of fragment, het Wisik-product, het actieve hoofdonderdeel en de productversie worden meegestuurd wanneer die context beschikbaar is. Rekenantwoorden, XP, diagnoses en andere lokale leerresultaten worden niet automatisch toegevoegd. Na verzenden verwerkt FormSubmit de notitie en kan de dienst een spamcontrole tonen. FormSubmit vermeldt voor zijn inzendingenarchief een bewaartermijn van 30 dagen.')
replace('public/kladblok/index.html', '<button class="btn coral" type="submit">Leg op het Kladblok</button>', '<div class="form-note">Ontvangen Kladblok-e-mails worden bij Wisik in beginsel maximaal <strong>3 maanden</strong> bewaard. Alleen wanneer een bericht nog nodig is voor opvolging of heeft geleid tot een vervolggesprek kan het langer worden bewaard. <a href="/backstage/#privacy">Lees meer over privacy op Wisik</a>.</div>\n<button class="btn coral" type="submit">Leg op het Kladblok</button>')
replace('public/pabo/pabo-rekenklaar/index.html', '<p class="lead">Korte oefenreeksen, uitleg na fouten, een toetsnabootsing en diagnostische herstelsets — zonder account.</p>', '<p class="lead">Korte oefenreeksen, uitleg na fouten, een toetsnabootsing en diagnostische herstelsets — zonder account.</p><p>Je oefenvoortgang blijft in deze browser. <a href="/backstage/#privacy">Lees meer over privacy op Wisik</a>.</p>')
replace('public/hbo/space-tent/index.html', '<details><summary>Over bewaren en eerder oefenen</summary>', '<p><a href="/backstage/#privacy">Lees meer over privacy op het hele Wisik-terrein</a>.</p>\n      <details><summary>Over bewaren en eerder oefenen</summary>')
replace('scripts/test-feedback.mjs', 'html.includes("exacte bronpagina")', 'html.includes("bronpagina zonder queryparameters of fragment")')
replace('DEPLOYMENT.md', '- exacte bron-URL;', '- dataminimale bronpagina voor verzending (origin + pathname; geen queryparameters of fragment);')
replace('PRIVACY-NOTITIES.md', 'Laatst inhoudelijk gecontroleerd: 16 september 2026.', 'Laatst inhoudelijk gecontroleerd: 17 september 2026. FormSubmit-documentatie gecontroleerd: https://formsubmit.co/documentation (inzendingenarchief: 30 dagen). De daadwerkelijke Cloudflare-accountinstellingen zijn in deze ronde niet gecontroleerd.')

# Alleen gedeelde cache-URL's en siteversielabels bijwerken; appversies blijven staan.
tracked = subprocess.check_output(['git', 'ls-files'], cwd=ROOT, text=True).splitlines()
for name in tracked:
    if not (name.startswith('public/') or name.startswith('src/pabo/') or name == 'tools/space-tent/index.html'):
        continue
    if Path(name).suffix not in {'.html', '.js', '.mjs', '.ts', '.tsx'}:
        continue
    before = read(name)
    after = before.replace('?v=0.1.28', '?v=0.1.29').replace('data-site-version>0.1.28<', 'data-site-version>0.1.29<').replace('name="Siteversie" value="0.1.28"', 'name="Siteversie" value="0.1.29"')
    if before != after:
        write(name, after)
replace('public/assets/js/site-data.js', 'window.WISIK_SITE_VERSION = "0.1.28";', 'window.WISIK_SITE_VERSION = "0.1.29";')
package['version'] = '0.1.29'
assert package['scripts']['check'].count('node scripts/test-feedback.mjs') == 1
package['scripts']['check'] = package['scripts']['check'].replace('node scripts/test-feedback.mjs', 'node scripts/test-feedback.mjs && node scripts/test-privacy-terrein.mjs')
write('package.json', json.dumps(package, ensure_ascii=False, indent=2) + '\n')
if (ROOT / 'package-lock.json').exists():
    lock = json.loads(read('package-lock.json'))
    lock['version'] = '0.1.29'
    if '' in lock.get('packages', {}):
        lock['packages']['']['version'] = '0.1.29'
    write('package-lock.json', json.dumps(lock, ensure_ascii=False, indent=2) + '\n')

ruleset = {
    'name': 'Wisik main — gecontroleerde publicatie',
    'target': 'branch', 'enforcement': 'active', 'bypass_actors': [],
    'conditions': {'ref_name': {'include': ['refs/heads/main'], 'exclude': []}},
    'rules': [
        {'type': 'deletion'}, {'type': 'non_fast_forward'},
        {'type': 'pull_request', 'parameters': {
            'required_approving_review_count': 0, 'dismiss_stale_reviews_on_push': False,
            'require_code_owner_review': False, 'require_last_push_approval': False,
            'required_review_thread_resolution': False,
            'allowed_merge_methods': ['merge', 'squash', 'rebase']}},
        {'type': 'required_status_checks', 'parameters': {
            'strict_required_status_checks_policy': True,
            'required_status_checks': [{'context': 'Verplichte vrijgavecontrole', 'integration_id': 15368}]}}
    ]
}
write('.github/wisik-main-ruleset.json', json.dumps(ruleset, ensure_ascii=False, indent=2) + '\n')
write('docs/github-main-bescherming.md', '''# Hoofdversie beschermen — activering door de eigenaar

Dit importbestand wijzigt op zichzelf geen GitHub-instelling. De koppeling kreeg op 17 september 2026 bij het branch-protection-beheerendpoint HTTP 403 (Resource not accessible by integration). Er zijn geen extra tokens, secrets of omwegen ingesteld.

## Activeren

Open in `62gr6m7ggg-arch/wisik-site`: Settings → Rules → Rulesets → New ruleset → Import a ruleset. Importeer `.github/wisik-main-ruleset.json`. Controleer de instellingen hieronder en klik Create. Controleer dat Enforcement op Active staat.

- Alleen `refs/heads/main` wordt beschermd; werkbranches blijven bewerkbaar.
- Geen bypass-actoren: ook de beheerder moet de publicatieroute volgen.
- Een pull request is verplicht, maar nul externe goedkeuringen. Er wordt geen tweede reviewer vereist en de branch wordt niet read-only gemaakt.
- De check `Verplichte vrijgavecontrole` van GitHub Actions (app-ID 15368, uitgelezen bij de bestaande check) moet slagen, getest met de actuele main.
- Verwijderen en force-push zijn verboden. Gewone merge, squash en rebase blijven toegestaan.

Voorkom twee overlappende configuraties: gebruik deze ruleset óf de equivalente klassieke branchbescherming. Na activering opnieuw de actieve regels en een normale geteste PR controleren. Pas dan is de bescherming als actief af te melden. Dit beschermt niet tegen alle softwarefouten of tegen een beheerder die bewust de regels wijzigt.

Accountbeveiliging is apart: controleer bij GitHub Password and authentication of tweestapsverificatie/passkey en herstelmogelijkheden goed zijn ingesteld. Deel geen wachtwoorden, herstelcodes of geheime tokens in chat of repository. Die accountinstellingen en Cloudflare-instellingen zijn in deze ronde niet gewijzigd.

Bronnen (geraadpleegd 17 september 2026):
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/managing-rulesets-for-a-repository#importing-a-ruleset
- https://docs.github.com/en/rest/repos/rules#create-a-repository-ruleset
''')
write('docs/privacy-terrein-uitvoering-20260917.md', '''# Terreinbrede privacy — uitvoering

Opvolging van issue #56 op de bestaande privacybranch, bijgewerkt met de actuele main inclusief Pabo 1.8.0. Wisik-siteversie 0.1.29; appversies, vragen, antwoorden, beoordelingslogica en lokale voortgang blijven ongewijzigd.

Backstage bevat één terreinbrede privacysectie met zes native uitklaponderdelen. Beide productpagina's verwijzen ernaartoe. Kladblok vermeldt het afzonderlijke Wisik-beleid van drie maanden met uitzonderingen voor opvolging/vervolggesprek, plus de gedocumenteerde FormSubmit-termijn van dertig dagen. Space-tent is een eigen formulierkeuze. Er is nog steeds maar één formulier.

Beide contextpaden accepteren alleen dezelfde http(s)-origin en geven uitsluitend origin + pathname door, ook bij oude sessiecontext, referrer, rechtstreekse links en verzending. URL-credentials, queryparameters en fragmenten verdwijnen. De vier expliciete contextvelden worden behouden; er wordt geen lokale leerstatus ingelezen. De twee paden gebruiken dezelfde bron als het hoofdscript beschikbaar is; het zelfstandige vangnet blijft bruikbaar.

De nieuwe dependencyvrije privacyregressietest is onderdeel van npm run check/build. Browsercontrole onderschept de FormSubmit-POST vóór verzending; er wordt geen echte testmail verstuurd. De workflow bewaart bewijs en schermafbeeldingen. Voor publicatie moeten de gehele bestaande vrijgavecontrole en de nieuwe tests slagen. Na publicatie worden de daadwerkelijk geserveerde bestanden bytegelijk vergeleken en de privacybrowserroutes herhaald.

Grenzen: geen fysieke iPhone-test, juridische volledigheidsverklaring, pentest of inzage in Cloudflare-accountinstellingen. Het bewaarbeleid is gepubliceerd; er is geen automatische verwijdering van e-mails ingesteld en geen mailbox gewijzigd. Branchbescherming is alleen voorbereid in een importbestand en vereist activering door de eigenaar; zie github-main-bescherming.md.
''')
print('Privacywijziging aangebracht; nog geen tests of publicatie geclaimd.')
