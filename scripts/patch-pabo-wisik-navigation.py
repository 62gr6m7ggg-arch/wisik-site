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


# 1. Versie en release notes.
replace_once(
    '<title>Pabo Rekenklaar 1.5.9 – rubricgestuurd oefenen met diagnostische foutpatronen</title>',
    '<title>Pabo Rekenklaar 1.6.0 – rubricgestuurd oefenen met diagnostische foutpatronen</title>',
    "documenttitel",
)
replace_once(
    'const APP_VERSION = "1.5.9";\nconst STORAGE_KEY = "pabo-rekenklaar-state-v1";',
    'const APP_VERSION = "1.6.0";\nconst STORAGE_KEY = "pabo-rekenklaar-state-v1";\nconst WISIK_TERRAIN_URL = "https://wisik.nl/";\nconst WISIK_CONTEXT_KEY = "wisik-last-attraction-context-v1";',
    "appversie en Wisik-constanten",
)
replace_once(
    'const RELEASE_NOTES = [\n  {version:"1.5.9"',
    'const RELEASE_NOTES = [\n  {version:"1.6.0",date:"4 september 2026",title:"Herkenbare uitgang naar het Wisik-terrein",items:[\n    "De sticky bovenbalk bevat voortaan permanent een duidelijke knop terug naar het Wisik-terrein.",\n    "Het Wisik-logo linksboven werkt eveneens als terugweg naar de koepelsite.",\n    "Voor vertrek wordt de lokale voortgang expliciet opgeslagen, ook bij mobiele paginawissels.",\n    "De bronpagina, het actieve onderdeel en deze productversie worden als context klaargezet voor het Wisik-Kladblok.",\n    "De automatische releasecontrole blokkeert toekomstige versies wanneer de terugweg of contextregistratie ontbreekt."\n  ]},\n  {version:"1.5.9"',
    "release notes 1.6.0",
)

# 2. Navigatiestijl: duidelijk, sticky en op mobiel compact.
replace_once(
    '.brand{display:flex;align-items:center;gap:10px;min-width:0}\n.logo-orbit{width:44px;height:44px;border-radius:15px;background:linear-gradient(145deg,var(--navy),#246d9b);color:#fff;display:grid;place-items:center;box-shadow:0 9px 20px rgba(18,59,93,.25);font-weight:900;font-size:22px;transform:rotate(-3deg)}\n.brand-copy{min-width:0}',
    '.brand{display:flex;align-items:center;gap:10px;min-width:0}\n.logo-orbit{width:44px;height:44px;border-radius:15px;background:linear-gradient(145deg,var(--navy),#246d9b);color:#fff;display:grid;place-items:center;box-shadow:0 9px 20px rgba(18,59,93,.25);font-weight:900;font-size:22px;transform:rotate(-3deg);text-decoration:none;position:relative;flex:0 0 auto}\n.logo-orbit::after{content:"";position:absolute;width:8px;height:8px;border-radius:50%;background:#ffd563;right:5px;top:5px}\n.logo-orbit:hover{transform:rotate(-3deg) translateY(-1px)}\n.wisik-terrain-link{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:42px;padding:8px 12px;border:1px solid #bfd3df;border-radius:13px;background:var(--paper);color:var(--navy);font-weight:800;text-decoration:none;box-shadow:0 5px 14px rgba(23,50,75,.06);white-space:nowrap}\n.wisik-terrain-link:hover{background:var(--sky);border-color:#9fc5dc}\n.wisik-terrain-link .terrain-short{display:none}\n.brand-copy{min-width:0}',
    "navigatie-CSS",
)
replace_once(
    '  .logo-orbit{width:40px;height:40px;border-radius:13px}\n  .stat-pill small{display:none}',
    '  .logo-orbit{width:40px;height:40px;border-radius:13px}\n  .wisik-terrain-link{min-height:40px;padding:7px 10px}\n  .wisik-terrain-link .terrain-long{display:none}\n  .wisik-terrain-link .terrain-short{display:inline}\n  .stat-pill small{display:none}',
    "mobiele navigatiestijl",
)
replace_once(
    '@media(max-width:360px){\n  main{padding-left:max(10px,env(safe-area-inset-left));padding-right:max(10px,env(safe-area-inset-right))}',
    '@media(max-width:420px){\n  .top-stats .stat-pill:first-of-type{display:none}\n  .brand-copy strong{font-size:.98rem}\n  .wisik-terrain-link{padding-inline:9px}\n}\n@media(max-width:360px){\n  main{padding-left:max(10px,env(safe-area-inset-left));padding-right:max(10px,env(safe-area-inset-right))}',
    "extra smalle bovenbalk",
)

# 3. HTML: Wisik-logo en expliciete terreinuitgang.
replace_once(
    '    <div class="brand">\n      <div class="logo-orbit" aria-hidden="true">∑</div>\n      <div class="brand-copy">',
    '    <div class="brand">\n      <a class="logo-orbit" href="https://wisik.nl/" data-wisik-exit aria-label="Terug naar het Wisik-terrein" title="Terug naar het Wisik-terrein">√</a>\n      <div class="brand-copy">',
    "Wisik-logo",
)
replace_once(
    '    <div class="top-stats">\n      <div class="stat-pill" title="Huidige dagelijkse reeks">',
    '    <div class="top-stats">\n      <a class="wisik-terrain-link" href="https://wisik.nl/" data-wisik-exit aria-label="Terug naar het Wisik-terrein"><span aria-hidden="true">←</span><span class="terrain-long">Terug naar het Wisik-terrein</span><span class="terrain-short">Terrein</span></a>\n      <div class="stat-pill" title="Huidige dagelijkse reeks">',
    "terrein-knop",
)

# 4. Expliciet opslaan en Kladblokcontext registreren.
replace_once(
    'function saveState(){\n  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch(e){console.warn("Voortgang kon niet worden opgeslagen",e)}\n}\nfunction todayKey',
    'function saveState(){\n  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch(e){console.warn("Voortgang kon niet worden opgeslagen",e)}\n}\nfunction currentWisikContext(){\n  const activeView=document.querySelector(".view.active");\n  return {\n    product:"Pabo Rekenklaar",\n    productVersion:APP_VERSION,\n    pageUrl:window.location.href,\n    view:(activeView?.id||`view-${currentView}`).replace(/^view-/,""),\n    savedAt:new Date().toISOString()\n  };\n}\nfunction rememberWisikContext(){\n  try{sessionStorage.setItem(WISIK_CONTEXT_KEY,JSON.stringify(currentWisikContext()))}catch(e){console.warn("Wisik-context kon niet worden opgeslagen",e)}\n}\nfunction persistBeforeWisikExit(){saveState();rememberWisikContext()}\nfunction todayKey',
    "opslag- en contextfuncties",
)
replace_once(
    '  currentView=name;\n  document.querySelectorAll(".view").forEach',
    '  currentView=name;\n  rememberWisikContext();\n  document.querySelectorAll(".view").forEach',
    "context bij viewwissel",
)
replace_once(
    'function bindEvents(){\n  document.addEventListener("click",e=>{',
    'function bindEvents(){\n  document.querySelectorAll("[data-wisik-exit]").forEach(link=>{\n    link.addEventListener("pointerdown",persistBeforeWisikExit,{passive:true});\n    link.addEventListener("click",persistBeforeWisikExit);\n  });\n  window.addEventListener("pagehide",persistBeforeWisikExit);\n  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")persistBeforeWisikExit()});\n  document.addEventListener("click",e=>{',
    "exit-events",
)
replace_once(
    '  saveState();\n  applySettings();bindEvents();renderHome();',
    '  saveState();rememberWisikContext();\n  applySettings();bindEvents();renderHome();',
    "context bij init",
)

# 5. Interne QA-object maakt de navigatie-instellingen controleerbaar.
replace_once(
    'window.PaboRekenklaarQA=Object.freeze({version:APP_VERSION,diagnosticSchemaVersion:',
    'window.PaboRekenklaarQA=Object.freeze({version:APP_VERSION,wisikTerrainUrl:WISIK_TERRAIN_URL,wisikContextKey:WISIK_CONTEXT_KEY,diagnosticSchemaVersion:',
    "QA metadata",
)

if source == original:
    raise SystemExit("Geen wijzigingen uitgevoerd")

path.write_text(source, encoding="utf-8")
print("Pabo Rekenklaar 1.6.0: Wisik-uitgang, opslag en context toegevoegd.")
