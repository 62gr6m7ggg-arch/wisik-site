import re
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


version_match = re.search(r'const APP_VERSION = "([^"]+)";', source)
if not version_match:
    raise SystemExit("APP_VERSION ontbreekt")
app_version = version_match.group(1)

home_pattern = r'<span id="homeVersion">[^<]+</span>'
home_matches = re.findall(home_pattern, source)
if len(home_matches) != 1:
    raise SystemExit(f"statische homeversie: verwacht exact 1 vindplaats, gevonden {len(home_matches)}")
source = re.sub(home_pattern, f'<span id="homeVersion">{app_version}</span>', source, count=1)

old_context = '    view:(activeView?.id||`view-${currentView}`).replace(/^view-/,""),'
new_context = '    view:(currentView||activeView?.id||"home").replace(/^view-/,""),'
if old_context in source:
    replace_once(old_context, new_context, "actief onderdeel in Wisik-context")
elif new_context not in source:
    raise SystemExit("actief onderdeel in Wisik-context: bekende oude en nieuwe vorm ontbreken")

if source != original:
    path.write_text(source, encoding="utf-8")
    print(f"Pabo Rekenklaar {app_version}-finalisatie uitgevoerd.")
else:
    print(f"Pabo Rekenklaar {app_version} was al correct gefinaliseerd.")
