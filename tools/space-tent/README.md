# Space-tent — Ruimteklaar 0.4.2

Public client at /apps/ruimteklaar/. Node 22+: npm ci; npm run build; npm run audit:build. Copy .space-dist to public/apps/ruimteklaar and .audit-dist to audit-runtime before regenerating the root Space audit. Root CI runs committed audit-runtime without dependency installation and binds source and assets by hash.

All six lessons and the summit are implemented: 23 teaching blocks, 261 questions, 99 numerical items, ten new construction tasks and two mixed final checks. Summit needs all six levels, correct checks A and B with B starting at least 24h after A, independent exam constructions and paper self-checks. Written arguments and paper drawings are self-assessed, not authenticated examination evidence.

Static entry uses local progress, with no account endpoints or result telemetry. Existing 0.3 progress is retained. Construction drafts save after each action and grade only after explicit submission. Correct answers stay hidden during checks; numeric expressions use a restricted parser.

validation/ contains source assets and independent mathematical checks. Run its Python scripts with numpy/scipy installed for additional coordinate/volume verification. They are separate from the dependency-free release gate.

0.4.2 clarifies the projection lesson: familiar oblique drawing → front orthographic view → rotated orthographic view. One geometric model supplies the displayed cube, the viewing ray, the image-plane orientation and the numeric image lengths. A fixed viewport scale makes shortening comparable; the animation pauses at the front view and respects reduced-motion preferences. Only projection illustrations p1, probe-p1 and retest-p1 were changed; questions, answers, diagnosis, progress and construction rules were retained.

The release checks validate 201 intermediate ray/plane projections and compare 523 unrelated rendered states against the 0.4.1 reference in validation/projection-regression-041.json. No new browser or physical-device testing is claimed for 0.4.2.
