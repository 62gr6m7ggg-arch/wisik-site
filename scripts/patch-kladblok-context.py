from pathlib import Path

path = Path("public/kladblok/index.html")
source = path.read_text(encoding="utf-8")

source = source.replace("site-data.js?v=0.1.5", "site-data.js?v=0.1.6")
source = source.replace("site.js?v=0.1.5", "site.js?v=0.1.6")
source = source.replace('name="Siteversie" value="0.1.5"', 'name="Siteversie" value="0.1.6"')

context_script = '<script src="/assets/js/kladblok-context.js?v=0.1.6" defer></script>'
if context_script not in source:
    marker = '<script src="/assets/js/site.js?v=0.1.6" defer></script>'
    if marker not in source:
        raise SystemExit("Actuele site.js-verwijzing niet gevonden in Kladblok")
    source = source.replace(marker, f"{marker}{context_script}", 1)

source_fields = (
    '<input type="hidden" name="Pagina" value="">\n'
    '<input type="hidden" name="Attractieversie" value="">'
)
if 'name="Pagina"' not in source:
    marker = '<input type="hidden" name="Siteversie" value="0.1.6">'
    if marker not in source:
        raise SystemExit("Siteversieveld niet gevonden in Kladblok")
    source = source.replace(marker, f"{marker}\n{source_fields}", 1)

context_note = '<div class="form-note" data-feedback-context hidden></div>'
if 'data-feedback-context' not in source:
    marker = '<div class="form-note">Deel geen namen van leerlingen'
    if marker not in source:
        raise SystemExit("Privacytekst niet gevonden in Kladblok")
    source = source.replace(marker, f"{context_note}\n{marker}", 1)

path.write_text(source, encoding="utf-8")
