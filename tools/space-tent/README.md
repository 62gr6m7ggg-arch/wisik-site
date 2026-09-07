# Space-tent — Ruimteklaar 0.4

Public client at /apps/ruimteklaar/. Node 22+: npm ci; npm run build; npm run audit:build. Copy .space-dist to public/apps/ruimteklaar and .audit-dist to audit-runtime before regenerating the root Space audit. Root CI runs committed audit-runtime without dependency installation and binds source and assets by hash.

All six lessons and the summit are implemented: 23 teaching blocks, 261 questions, 99 numerical items, ten new construction tasks and two mixed final checks. Summit needs all six levels, correct checks A and B with B starting at least 24h after A, independent exam constructions and paper self-checks. Written arguments and paper drawings are self-assessed, not authenticated examination evidence.

Static entry uses local progress, with no account endpoints or result telemetry. Existing 0.3 progress is retained. Construction drafts save after each action and grade only after explicit submission. Correct answers stay hidden during checks; numeric expressions use a restricted parser.

validation/ contains source assets and independent mathematical checks. Run its Python scripts with numpy/scipy installed for additional coordinate/volume verification. They are separate from the dependency-free release gate.
