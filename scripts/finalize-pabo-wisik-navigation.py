from pathlib import Path

path = Path("public/apps/pabo-rekenklaar/index.html")
source = path.read_text(encoding="utf-8")
original = source


def replace_once(old: str, new: str, label: str) -> None:
    global source
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"{label}: verwacht exact 1 vindplaats, gevonden {count}")
    source = source.replace(old, new, 1)


replace_once(
    '<span id="homeVersion">1.5.9</span>',
    '<span id="homeVersion">1.6.0</span>',
    "statische homeversie",
)
replace_once(
    '    view:(activeView?.id||`view-${currentView}`).replace(/^view-/,""),',
    '    view:(currentView||activeView?.id||"home").replace(/^view-/,""),',
    "actief onderdeel in Wisik-context",
)

if source == original:
    raise SystemExit("Geen finalisatiewijziging uitgevoerd")
path.write_text(source, encoding="utf-8")
print("Pabo Rekenklaar 1.6.0-finalisatie geslaagd.")
