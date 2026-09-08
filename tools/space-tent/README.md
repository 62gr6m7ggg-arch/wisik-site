# Space-tent — Ruimteklaar 0.4.3

Public client at /apps/ruimteklaar/. Node 22+: npm ci; npm run build; npm run audit:build. Copy .space-dist to public/apps/ruimteklaar and .audit-dist to audit-runtime before regenerating the root Space audit. Root CI runs committed audit-runtime without dependency installation and binds source and assets by hash.

All six lessons and the summit are implemented: 23 teaching blocks, 261 questions, 99 numerical items, ten new construction tasks and two mixed final checks. Summit needs all six levels, correct checks A and B with B starting at least 24h after A, independent exam constructions and paper self-checks. Written arguments and paper drawings are self-assessed, not authenticated examination evidence.

Static entry uses local progress, with no account endpoints or result telemetry. Existing 0.3 progress is retained. Construction drafts save after each action and grade only after explicit submission. Correct answers stay hidden during checks; numeric expressions use a restricted parser.

validation/ contains source assets and independent mathematical checks. Run its Python scripts with numpy/scipy installed for additional coordinate/volume verification. They are separate from the dependency-free release gate.

0.4.3 reviews the whole tool: 23 blocks, 96 instruction/repair states, 261 questions, ten construction tasks and eight paper tasks. The shared viewing guide uses the actual solid and active projection to show the eye, viewing ray and named orientation. Filled planes receive a matching color legend. Eighty explicitly discussed study-plane views let students compare spatial diagrams with a perpendicular view that preserves in-plane shapes and angles, including non-cubic solids. Existing flat metric diagrams keep their simpler presentation.

Targeted changes add the actual top view of the 60°/90° counterexample, use one screen scale for the two-view comparison, correct the stand-plane/viewing-direction wording, name the missing foot N in a worked height triangle, and tie later-lesson captions to the discussed distance or helper plane. Selecting a study plane temporarily shades its discussed polygon. The expanded overview follows the camera continuously to keep the viewing ray visible.

No supplemental viewing aid appears during diagnostic questions, level checks, summit checks, independent paper work or summit construction attempts. Practice allows only given planes or the already planar figure; changing its view records support. Construction mode keeps point selection and viewing separate. Answers, question data, diagnosis rules, paper tasks, construction targets and local-progress behavior are preserved.

Release checks cover 3,132 question-card states, 80 explicit plane views, 210 view/ray models, 201 intermediate projection-lesson states, ten construction tasks and eight paper tasks. The first main SVG of 520 question states remains identical to 0.4.2; the two deliberately reframed comparison states are separately checked. This is not a claim that all surrounding teaching markup stayed identical. validation/viewing-review-043.json records coverage; validation/learning-contract-042.json preserves the grading data. The previous 0.4.2 projection lesson and its checks are retained.

No new browser or physical-device testing is claimed for 0.4.3. Pointer interaction and real-screen readability have only the earlier 0.4 browser evidence; this release uses source, mathematical and React rendering checks.
