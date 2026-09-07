# Space-tent — Ruimteklaar 0.3

Public client at /apps/ruimteklaar/. Source maintained here for the Wisik release.
Node 22+: npm ci; npm run build; npm run audit:build. Copy .space-dist to public/apps/ruimteklaar and .audit-dist to audit-runtime before regenerating the root Space audit. Root CI runs the committed audit-runtime without dependency installation and verifies the source and asset hashes.

The static entry always uses local progress. The optional account path is retained for compatibility with the original private prototype; no account endpoint is deployed on Wisik. Local results are not authenticated assessment evidence. Level 1 and the construction atelier are available; remaining levels and full examination preparation are not complete.
