"""Compare published bytes, accounting only for one pinned hosting insertion.

Observed on the canonical URL in diagnostic run 42353276207 (2026-11-07).
This does not disable analytics, edit the served page, or remove arbitrary scripts.
Any other insertion, changed application byte, beacon version/token/integrity change,
extra beacon, or changed non-HTML asset still fails. Raw hashes remain in evidence.
"""
import hashlib

HOSTING_BEACON = (
    b'<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js/'
    b'vce701823e78c4301a35b7e07294d87301792088814092" '
    b'integrity="sha512-UKNk8GbxkABxKcXYuLkO16EleLGUkcvJWtpSNmExE0Too3ZaFAxTscNWEc1OdAv5/BikHawapSCaiD2XCmp+Bw==" '
    b'data-cf-beacon=\'{"version":"2024.11.0","token":"0b201219ec3b4145b699633de3c2cfe3","r":1,"spa":2}\' '
    b'crossorigin="anonymous"></script>\n'
)


def compare_asset(expected: bytes, received: bytes, *, html: bool = False) -> dict:
    """Accept byte identity or precisely the recorded insertion before </body>."""
    if not isinstance(expected, bytes) or not isinstance(received, bytes):
        raise TypeError('Expected bytes for both assets')
    raw_match = expected == received
    hosted_match = (
        html and not raw_match and expected.count(b'</body>') == 1
        and received == expected.replace(b'</body>', HOSTING_BEACON + b'</body>', 1)
    )
    normalized = expected if hosted_match else received
    return {
        'matches': raw_match or hosted_match,
        'raw_match': raw_match,
        'hosting_insertion': 'pinned Cloudflare Web Analytics beacon' if hosted_match else None,
        'expected_sha256': hashlib.sha256(expected).hexdigest(),
        'received_sha256': hashlib.sha256(received).hexdigest(),
        'application_sha256': hashlib.sha256(normalized).hexdigest(),
        'bytes': len(received),
    }


def self_test() -> None:
    base = b'<html><body><p>0.2.0</p><script>safe()</script></body></html>\n'
    hosted = base.replace(b'</body>', HOSTING_BEACON + b'</body>')
    assert compare_asset(base, base, html=True)['matches']
    assert compare_asset(base, hosted, html=True)['matches']
    assert not compare_asset(base, hosted)['matches'], 'No exception for non-HTML files'
    for modified in (
        hosted.replace(b'safe()', b'evil()'),
        hosted.replace(b'0.2.0', b'0.1.0'),
        hosted.replace(b'</body>', HOSTING_BEACON + b'</body>'),
        hosted.replace(b'crossorigin="anonymous"', b'crossorigin="changed"'),
        hosted.replace(b'0b201219', b'00000000'),
        hosted.replace(b'</body>', b'<script>evil()</script></body>'),
        HOSTING_BEACON + base,
        base + b' ',
    ):
        assert not compare_asset(base, modified, html=True)['matches']
    assert not compare_asset(b'RIFF-test', b'RIFF-changed')['matches']
    print('Live identity: exact source or one pinned hosting insertion only; mutation tests passed.')


if __name__ == '__main__':
    self_test()
