from pathlib import Path
import json

package_path = Path('package.json')
package = json.loads(package_path.read_text())
package['version'] = '0.1.23'
if 'test-grabbelton-cta.mjs' not in package['scripts']['check']:
    package['scripts']['check'] = package['scripts']['check'].replace(
        'node scripts/test-festival-venues.mjs',
        'node scripts/test-grabbelton-cta.mjs && node scripts/test-festival-venues.mjs'
    )
package_path.write_text(json.dumps(package, ensure_ascii=False, indent=2) + '\n')

for path in Path('public').rglob('*'):
    if not path.is_file() or path.suffix.lower() not in {'.html','.js','.json','.css','.webmanifest','.txt'}:
        continue
    try:
        text = path.read_text()
    except UnicodeDecodeError:
        continue
    updated = text.replace('0.1.22', '0.1.23')
    if updated != text:
        path.write_text(updated)

ownvoice_test = Path('scripts/test-ownvoice-release.mjs')
if ownvoice_test.exists():
    ownvoice_test.write_text(ownvoice_test.read_text().replace('0.1.22', '0.1.23'))

path = Path('public/assets/js/grabbelton.js')
text = path.read_text()
old = '    player.append(track);\n    const note = document.createElement("p");'
new = '''    player.append(track);

    const playerWrap = document.createElement("div");
    playerWrap.className = "grabbelton-player-wrap";
    Object.assign(playerWrap.style, { position: "relative", width: "100%" });
    playerWrap.append(player);

    const endCard = document.createElement("div");
    endCard.className = "grabbelton-end-card";
    endCard.hidden = true;
    Object.assign(endCard.style, {
      position: "absolute", inset: "0", zIndex: "3", display: "none",
      alignItems: "center", justifyContent: "center", flexDirection: "column",
      gap: "14px", padding: "24px", textAlign: "center", borderRadius: "16px",
      background: "#14344d", color: "#fff"
    });
    const endTitle = document.createElement("strong");
    endTitle.textContent = "Verder oefenen?";
    endTitle.style.fontSize = "clamp(1.45rem, 4vw, 2.25rem)";
    const endCopy = document.createElement("span");
    endCopy.textContent = "Ga verder met dit denkpatroon in Pabo Rekenklaar.";
    endCopy.style.fontSize = "1.02rem";
    const endLink = document.createElement("a");
    endLink.className = "btn coral";
    endLink.href = `/apps/pabo-rekenklaar/?misconcept=${encodeURIComponent(video.target.misconceptionCode)}&ingang=grabbelton`;
    endLink.textContent = "Open Pabo Rekenklaar";
    endCard.append(endTitle, endCopy, endLink);
    playerWrap.append(endCard);
    const showEndCard = () => { endCard.hidden = false; endCard.style.display = "flex"; };
    const hideEndCard = () => { endCard.hidden = true; endCard.style.display = "none"; };
    player.addEventListener("ended", showEndCard);
    player.addEventListener("play", hideEndCard);

    const note = document.createElement("p");'''
assert old in text, 'invoegpunt voor eindkaart niet gevonden'
text = text.replace(old, new, 1)
old = '    practice.href = "/apps/pabo-rekenklaar/";\n    practice.textContent = "Verder oefenen in Pabo Rekenklaar";'
new = '    practice.href = `/apps/pabo-rekenklaar/?misconcept=${encodeURIComponent(video.target.misconceptionCode)}&ingang=grabbelton`;\n    practice.textContent = "Verder oefenen in Pabo Rekenklaar";'
assert old in text, 'bestaande oefenlink niet gevonden'
text = text.replace(old, new, 1)
old = '    result.append(eyebrow, heading, summary, player, note, links);'
assert old in text, 'resultaatopbouw niet gevonden'
text = text.replace(old, '    result.append(eyebrow, heading, summary, playerWrap, note, links);', 1)
path.write_text(text)

path = Path('public/grabbelton/index.html')
text = path.read_text().replace(
    'Verdere uitleg, herstelsets en rubric blijven in Pabo Rekenklaar.',
    'Verdere uitleg, gerichte oefening en rubric blijven in Pabo Rekenklaar.'
)
path.write_text(text)

path = Path('public/apps/pabo-rekenklaar/index.html')
text = path.read_text()
old = 'const URL_FLAGS = new URLSearchParams(window.location.search);\nconst ADMIN_MODE'
new = 'const URL_FLAGS = new URLSearchParams(window.location.search);\nconst WISIK_MISCONCEPT_ENTRY = String(URL_FLAGS.get("misconcept")||"").toUpperCase();\nconst ADMIN_MODE'
assert old in text, 'URL_FLAGS-invoegpunt niet gevonden'
text = text.replace(old, new, 1)
old = '  if(DIAGNOSTIC_DIRECT_MODE)setTimeout(openDiagnosticRegister,120);else if(RELEASE_CHECK_MODE)setTimeout(runVisibleReleaseCheck,120);else if(WISIK_ENTRY_MODE==="moshpit-sprint")setTimeout(openMoshpitEntrance,120);else if(!state.profile.name)setTimeout(()=>openSettings(true),450);'
new = '  if(DIAGNOSTIC_DIRECT_MODE)setTimeout(openDiagnosticRegister,120);else if(RELEASE_CHECK_MODE)setTimeout(runVisibleReleaseCheck,120);else if(WISIK_ENTRY_MODE==="moshpit-sprint")setTimeout(openMoshpitEntrance,120);else if(MISCONCEPTION_CATALOG[WISIK_MISCONCEPT_ENTRY])setTimeout(()=>openDiagnosticPattern(WISIK_MISCONCEPT_ENTRY),120);else if(!state.profile.name)setTimeout(()=>openSettings(true),450);'
assert old in text, 'init-route niet gevonden'
text = text.replace(old, new, 1)
path.write_text(text)

test = '''import fs from "node:fs";\nconst fail = message => { throw new Error(message); };\nconst grab = fs.readFileSync("public/assets/js/grabbelton.js", "utf8");\nconst pabo = fs.readFileSync("public/apps/pabo-rekenklaar/index.html", "utf8");\nconst page = fs.readFileSync("public/grabbelton/index.html", "utf8");\nif (!grab.includes('endTitle.textContent = "Verder oefenen?"')) fail("klikbare eindkaart ontbreekt");\nif (!grab.includes('player.addEventListener("ended", showEndCard)')) fail("eindkaart verschijnt niet na afloop");\nif (!grab.includes('player.addEventListener("play", hideEndCard)')) fail("eindkaart verdwijnt niet bij opnieuw afspelen");\nif (!grab.includes('?misconcept=${encodeURIComponent(video.target.misconceptionCode)}&ingang=grabbelton')) fail("gerichte Pabo-link ontbreekt");\nif (!pabo.includes('const WISIK_MISCONCEPT_ENTRY = String(URL_FLAGS.get("misconcept")||"").toUpperCase()')) fail("Pabo deep-link parser ontbreekt");\nif (!pabo.includes('MISCONCEPTION_CATALOG[WISIK_MISCONCEPT_ENTRY]')) fail("Pabo opent het misconcept niet gericht");\nif (page.includes('Verdere uitleg, herstelsets en rubric')) fail("Grabbelton gebruikt nog herstelsetjargon");\nconsole.log("Grabbelton-vervolgroute geslaagd: klikbare eindkaart en gerichte Pabo-deeplink aanwezig.");\n'''
Path('scripts/test-grabbelton-cta.mjs').write_text(test)
print('Grabbelton vervolgroute voorbereid als Wisik 0.1.23.')
