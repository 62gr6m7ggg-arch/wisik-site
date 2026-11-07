"""Strict source identity; only the exact independently captured hosting addition is recognized.

The public response contains a Cloudflare statistics script, inserted by hosting.
It is recorded explicitly rather than claiming that the raw HTML is unchanged.
All application bytes and all separate JS/audio/manifest files must still match.
A changed beacon or any other unexpected difference fails verification.
"""
from hashlib import sha256

HOSTING_ADDITION = b'''<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js/vce701823e78c4301a35b7e07294d87301792088814092" integrity="sha512-UKNk8GbxkABxKcXYuLkO16EleLGUkcvJWtpSNmExE0Too3ZaFAxTscNWEc1OdAv5/BikHawapSCaiD2XCmp+Bw==" data-cf-beacon='{"version":"2024.11.0","token":"0b201219ec3b4145b699633de3c2cfe3","r":1,"spa":2}' crossorigin="anonymous"></script>
'''

def compare_source(expected: bytes, received: bytes, name: str) -> dict:
    result = {
        'verified': False,
        'raw_equal': received == expected,
        'expected_sha256': sha256(expected).hexdigest(),
        'received_sha256': sha256(received).hexdigest(),
        'hosting_addition': None,
    }
    if received == expected:
        result['verified'] = True
    elif name == 'index.html' and received.count(HOSTING_ADDITION) == 1:
        application = received.replace(HOSTING_ADDITION, b'', 1)
        if application == expected:
            result['verified'] = True
            result['hosting_addition'] = 'Exact captured Cloudflare statistics beacon; not part of the teaching application'
            result['hosting_addition_sha256'] = sha256(HOSTING_ADDITION).hexdigest()
            result['application_sha256'] = sha256(application).hexdigest()
    return result

if __name__ == '__main__':
    source = b'<html><body>test</body></html>\n'
    hosted = source.replace(b'</body>', HOSTING_ADDITION + b'</body>')
    assert compare_source(source, source, 'index.html')['verified']
    assert compare_source(source, hosted, 'index.html')['verified']
    assert not compare_source(source, hosted, 'index.html')['raw_equal']
    assert not compare_source(source, hosted.replace(b'test', b'changed'), 'index.html')['verified']
    assert not compare_source(source, hosted.replace(b'crossorigin="anonymous"', b'crossorigin="changed"'), 'index.html')['verified']
    assert not compare_source(source, hosted.replace(HOSTING_ADDITION, HOSTING_ADDITION*2), 'index.html')['verified']
    assert not compare_source(source, hosted, 'mixer.js')['verified']
    assert not compare_source(source, hosted+b'<script>unknown()</script>', 'index.html')['verified']
    assert compare_source(b'wavebytes', b'wavebytes', 'goat-bleat.wav')['verified']
    assert not compare_source(b'wavebytes', b'changed', 'goat-bleat.wav')['verified']
    print('10 strict integrity checks passed: application changes and unknown hosting additions rejected.')
