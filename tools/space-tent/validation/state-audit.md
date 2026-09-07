# Independent state and interaction audit

Reviewed the seven-level expansion in `app/model.ts`, `learning.tsx`, `ruimteklaar.tsx`, `local-progress.ts`, `construction-lab.tsx`, `course-construction.ts`, `numeric.ts`, `route-header.tsx`, plus their direct rendering and diagnostic dependencies. Source files were read only; fixes were made by the root agent after the findings below were reported.

## Concrete findings and resolution

| Finding | Impact | Resolution verified in current source |
|---|---|---|
| Complete construction drafts were graded on every save, before submission. | Construction progress and XP could reveal whether a selected reason was correct during an exam attempt. Returning to a complete draft could also silently submit it. | Explicit `submitted` flag now distinguishes drafts and final attempts. `normalizeEvent` recalculates correctness only for submitted attempts; the lab resumes the actual submitted state. Automated positive and negative assertions pass for all ten tasks. |
| Selecting a construction reason did not save it until another action. | Navigating away through normal application tabs could discard this choice. | Reason changes now persist a draft immediately. |
| Normalization renamed all constructed lines to `h0`, `h1`, etc. | Resuming erased meaningful references such as `QR` and `lN door P ∥ QR`, making continuation difficult. | Validated original line IDs and names are retained. Round-trip assertions pass for all ten tasks. |
| Automatically generated student point names disagreed with worked solution names. | For example a standvlak solution referenced M and O while the student figure had S and U; these solution points did not appear in the feedback figure. | Tasks now have `solutionPoints`; the worked solution renders these names separately and explains that student point names may differ. |
| Scenes with `showCube: true` also supplied all twelve cube edges. | The duplicate solid edge layer overpainted the hidden-edge dashes, losing depth cues. | Geometry now filters matching and reversed duplicate cube edges before rendering extra edges. |

## Independent executable verification

Run:

```sh
node /workspace/scratch/f02d8d026cc6/level-expansion/audit-expansion-state.mjs
```

The script compiles the actual TypeScript modules into scratch, then performs 84 assertions. Current result: **84 passed, 0 failed**. It checks:

- Safe numeric expression parsing, unary/exponent precedence, supported Dutch decimal notation, invalid syntax, non-finite results and attempted executable strings.
- No XP or skill-evidence changes during an incomplete level check.
- A second answer to the same question within an attempt cannot erase the first incorrect answer.
- The delayed top-level check qualifies only if its first response is at least 24 hours after a passed first top-level check.
- Each of the ten construction tasks accepts its intended geometry, rejects an omitted target segment, rejects infinite helpers without final line segments, and requires the newly constructed target points.
- Complete drafts do not count as completed constructions; submitted correct work does; incorrect reasons do not.
- Reference-line identifiers and names survive normalization.

The script can run before candidate construction content is merged by loading the candidate JSON in this scratch directory into its isolated bundled module. It never edits the application source or user progress.

## Remaining practical checks

The script establishes state and geometry behavior, not mobile browser layout or empirical teaching effectiveness. The root agent's browser review should include resuming a construction draft, final submission after a saved reason, an incorrect numeric answer with its green correction, and point/line selection at phone width. A physical iPhone/Safari test remains useful for actual touch interaction.

One small usability limitation remains in the inspected source: the delayed top-level button computes availability with `Date.now()` during render, without a timer. If someone leaves the page open across the exact 24-hour boundary, they may need to revisit or refresh that page before the button becomes available. The stored progress criterion itself uses the correct start time.
