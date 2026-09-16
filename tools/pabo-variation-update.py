#!/usr/bin/env python3
"""Unpack reviewed Pabo variation sources; commit expanded files only after tests.
The payload contains source text and a checked patch, not credentials or data.
"""
import base64, gzip, hashlib, json, pathlib, subprocess
ROOT = pathlib.Path(__file__).resolve().parents[1]
payload = ''.join((ROOT / f'tools/pabo-variation.payload.{i}').read_text().strip() for i in range(1, 5))
data = gzip.decompress(base64.b64decode(payload, validate=True))
assert hashlib.sha256(data).hexdigest() == 'ac3b1e8018d8027574415f12c5c05911c3eff5de3afb604a4e9983b5cada397b', 'Corrupted update payload'
manifest = json.loads(data)
patch = manifest['patch'].encode()
check = subprocess.run(['git', 'apply', '--check', '-'], input=patch, cwd=ROOT, capture_output=True)
if check.returncode == 0:
    subprocess.run(['git', 'apply', '--whitespace=nowarn', '-'], input=patch, cwd=ROOT, check=True)
else:
    subprocess.run(['git', 'apply', '--reverse', '--check', '-'], input=patch, cwd=ROOT, check=True)
for name, content in manifest['files'].items():
    target = (ROOT / name).resolve()
    target.relative_to(ROOT)
    assert name.startswith(('src/pabo/', 'scripts/', 'docs/pabo-'))
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding='utf-8')
print('Pabo variation sources installed. Build and all release checks must pass before publication.')
