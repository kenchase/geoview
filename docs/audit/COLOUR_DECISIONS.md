# Colour normalization — decisions

Input: `docs/audit/COLOUR_PLAN.md`
Status: decided except D6 and D7. Hand to the agent as the authoritative basis for
all subsequent phases.

---

## P1. Latent theme bugs — **DONE**

Fixed ahead of normalization, so the semantic layer is not built on a broken theme.

| Defect                                                    | Resolution                                                                                                                                                            |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `palette.secondary` built from GeoView primary            | Generator now reads `geoViewColors.secondary`. `default.ts` secondary set to `#515BA5` to mirror primary; `secondary.dark` index aligned to `[200]` to match primary. |
| `canada.ca` secondary `#5b7592`                           | Commented; under review with the theme owner. Now reaches `palette.secondary` for real.                                                                               |
| `palette.mode` never set                                  | Added as a third parameter to `generateThemeOptions`, defaulting to `'light'`. All four cases in `theme.tsx` pass it explicitly.                                      |
| `info` and `success` both `#2e7d32`                       | Commented for review. Visible in the `.loading` and `.registered` list-item states, which are meant to be distinguishable.                                            |
| `backgroundcolor` typo in `MuiListItem` dragging override | Override removed as dead code.                                                                                                                                        |
| `Palette.border.primary`                                  | Removed.                                                                                                                                                              |

**Open follow-up:** some custom overrides may now be redundant, since MUI's dark
defaults apply correctly for the first time. Handle during phase 2, when
`theme.components` is being reviewed anyway. Method is manual: comment out one
override, check both light and dark, keep what changes.

---

## P2. Upgrade to MUI 9.5.0 — **OPEN**

Lockfile is 9.4.0; manifests allow `^9.4.0`, so 9.5.0 is in range. The MCP serves
9.5.0 but not 9.4.0, which forced hedging throughout the audit. Low risk, closes the
documentation gap. Attempt it; abandon if it surfaces breakage.

---

## D1. Theme dimensions — **A: flat, four independent themes**

No brand requires a dark variant. `dark` is not a dark version of any brand — it has
its own primary (`#8ec4fa`) unrelated to geo.ca's purple. With no second dimension to
model, `colorSchemes` would add structure for a problem that does not exist.

Consequences: no provider restructure, no `schema.json` change, no public API break.
`palette.mode` now describes each theme accurately, which is all the mode-awareness
needed.

Revisit only if a brand later requires a dark variant.

---

## D2. Mode selection — **moot; explicit config only**

Follows from D1. The per-map `theme` config decides. No system preference, no
cross-tab sync, no scheme precedence rules.

---

## D3. `cssVariables` — **No; deferred to separate scope**

Evaluated previously and judged scope creep. Confirmed here: with D1=A the
mode-switching benefits do not apply, the main remaining benefit is static CSS
reaching tokens (phase 5, small), and the cost lands on every file in phases 3 and 4.

The nested `ThemeProvider` in the overview map is the specific thing to test whenever
this is revisited.

**This is a deliberate deferral, not an oversight. Do not propose it again within this
project.**

---

## D4 / D5. Canonical palette and the indexed ramps — **MUI roles for UI; ramp retained for map rendering**

These are one decision. The ramp survives in UI code only because MUI's four slots
cannot serve `bgColor.dark[800]`; removing the ramp from UI requires a semantic layer
to replace it.

**Decided:**

- UI styling uses MUI's standard palette roles and the four slots
  (`main`/`light`/`dark`/`contrastText`).
- The 20-step ramps are retained for OpenLayers and map rendering, as a documented
  exception with a named consumer.
- Prefer MUI's existing role names over inventing new ones. Custom tokens only where
  MUI has no concept for the role.

**Rationale:** 41 shades per colour means shade selection happens by eye. Two
developers styling the same kind of border pick `dark[300]` and `dark[250]`, and
nothing records that they meant the same thing. Four slots plus semantic roles remove
that room for drift.

**Expected mapping direction** — most ramp usage resolves to names MUI already has:

| Current usage                 | MUI role                                          |
| ----------------------------- | ------------------------------------------------- |
| borders, separators           | `divider`                                         |
| panel and page surfaces       | `background.paper`, `background.default`          |
| muted text                    | `text.secondary`                                  |
| disabled text                 | `text.disabled`                                   |
| hover, selected, focus states | `action.hover`, `action.selected`, `action.focus` |

`geoViewColor.grey` alone currently does six of these jobs across 18 usages.

**Accepted cost:** there is no four-slot equivalent for `dark[800]`. Colours will shift
slightly. This is a design pass with per-cluster review, not a mechanical substitution,
and it gets its own phase.

---

## D6. Focus-ring contract — **OPEN**

Does not block the mapping work. MUI's `focusVisible` API is confirmed available in
v9.4 and is already partly in use. Open question is whether custom controls can move
to it or need to keep a shared colour source.

**Risk note:** accessibility regressions are invisible to visual A/B review. Keyboard-
only testing and forced-colors mode must be explicit when this is implemented.

---

## D7. Scope — **recommended, confirm**

**In:** viewer UI, theme source, `theme.components`, first-party static CSS
(`style.css`, drawer stylesheet).

**Out:** user map symbology and drawing colours (API/config data, separate product
decision); JSON test fixtures; demo, sandbox and release HTML; vendored CodeMirror CSS.

Follows from D5 — map rendering keeps the ramp, so it is not part of this work.

---

## D8. `nativeColor` — **Deferred**

Depends on D3, which is deferred. OpenLayers may not accept CSS relative-colour syntax.

---

## Next task: propose the semantic mapping

Hand the agent this file plus `docs/audit/COLOUR_PLAN.md`, with the following prompt.

```
Planning task. Read-only — do not modify any file except the single output file
named at the end.

docs/audit/COLOUR_DECISIONS.md records decisions already made. Treat them as
settled. Where it conflicts with docs/audit/COLOUR_PLAN.md, the decisions file
wins. Do not re-litigate a decision; if one appears unworkable, stop and report
rather than choosing differently.

## Task
Propose a mapping from current colour usage to MUI's standard palette roles,
per decision D4/D5.

Work from the clusters in COLOUR_PLAN.md Part 3, sections A, C, D and E. Use the
mui-mcp server for MUI role semantics; do not answer from memory.

## For each cluster
- The current value or token, the CSS properties it sets, and its usage count
- The MUI role you propose it maps to, and why
- Your confidence: high (the role is unambiguous) or low (needs my judgement)
- Any usage within the cluster that does not fit the proposed role, listed
  separately rather than forced into it

## Rules
- Prefer an existing MUI role over a new token, always. Propose a custom token
  only where no MUI role covers the meaning, and justify each one individually.
- Do not propose a custom token that duplicates an MUI role under a different
  name. This is what produced the secondary bug.
- Where a cluster splits across several roles, say so and split it. A single
  token doing six jobs is the problem being solved, not a shape to preserve.
- Map rendering, OpenLayers, and user drawing colours are out of scope (D7).
  Exclude them. If a cluster spans both UI and map consumers, flag it rather
  than mapping it.
- Mark any mapping that would change a colour noticeably, not just slightly.
- Where you cannot determine intent from the code, say so. Do not guess.

## Output
A table of proposed mappings, grouped by MUI role, with a separate section for
proposed custom tokens and a separate section for clusters you could not resolve.

Write to docs/audit/COLOUR_MAPPING.md. Nothing else written or modified.
```

When reviewing the result, the two things to check are: whether any proposed custom
token is really an MUI role under a different name, and whether the low-confidence
list is short enough to work through by hand.
