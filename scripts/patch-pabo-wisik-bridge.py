from pathlib import Path

path = Path("public/apps/pabo-rekenklaar/index.html")
source = path.read_text(encoding="utf-8")

style_tag = '<link rel="stylesheet" href="./wisik-bridge.css?v=1.0.0">'
script_tag = '<script src="./wisik-bridge.js?v=1.0.0" defer></script>'

if style_tag not in source:
    marker = "</head>"
    if marker not in source:
        raise SystemExit("Geen </head> gevonden in Pabo Rekenklaar")
    source = source.replace(marker, f"  {style_tag}\n  {script_tag}\n{marker}", 1)
elif script_tag not in source:
    source = source.replace("</head>", f"  {script_tag}\n</head>", 1)

path.write_text(source, encoding="utf-8")
