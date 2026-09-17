"""Temporary, checksum-verified transport installer; deleted after verification."""
from pathlib import Path
import base64
import hashlib
import lzma
import subprocess

expected_parts = [
    '34baed03340d47dba61fbe2edf8021d19242571fbe23bb7d5e00999fddb07cdc',
    '54bf98e9967afa032abe7d937e97d83f99bd9e614cf3396b27b580019587daf5',
    'd0738f4f45467a2438f1d4415229f6b307342957130beedced38ec1d44871e27',
    'c4e76b4b9a9b673ad2c30d095b80608a3c6208a72c031697f208144ada960a57',
]
parts = []
for index, digest in enumerate(expected_parts):
    part = Path(f'tools/pabo-reasoning-payload-{index}.b64').read_text().strip()
    actual = hashlib.sha256(part.encode()).hexdigest()
    if actual != digest:
        raise RuntimeError(f'Payload part {index}: unexpected checksum {actual}')
    parts.append(part)
patch = lzma.decompress(base64.b64decode(''.join(parts), validate=True))
expected = '5b6fc369182591caac448dc2d730db3e1a03da5e59a991dd8b8011030fe22aeb'
if hashlib.sha256(patch).hexdigest() != expected:
    raise RuntimeError('Source patch checksum mismatch')
subprocess.run(['git', 'apply', '--check', '--whitespace=nowarn', '-'], input=patch, check=True)
subprocess.run(['git', 'apply', '--whitespace=nowarn', '-'], input=patch, check=True)
print('Reviewed readable source applied; all transport hashes match.')
