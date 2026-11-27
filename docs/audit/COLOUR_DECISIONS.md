# Colour normalization — decisions

Outstanding colour work: see [WHATS_LEFT.md](./WHATS_LEFT.md).

Status: all decisions are closed. D7 is confirmed as written.

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

## D6. Focus-ring contract — **Decided: leave as is**

The GeoView focus helpers are not a duplicate of MUI's `focusVisible` API.
`docs/audit/FOCUS.md` found nine call sites, and most style targets MUI
cannot reach: an OpenLayers native button, a focusable Box with
`role="note"`, and three wrapper rings where a child receives focus but the
indicator is drawn on the parent group. MUI's global option has no way to
express a wrapper target.

Consolidating would remove the shared ring from roughly four controls while
keeping the helper for the rest, plus all of the per-component geometry
overrides. That is a smaller split rather than consolidation, with a real
risk of keyboard accessibility regressions that visual review would not
catch.

The `focusIndicator` pair stays in `geoViewColor` rather than moving to a
standard palette role. The contract needs two colours, and MUI's second
layer is a CSS shadow, not a palette role — `action.focus` cannot express
it.

Revisit only if MUI's API gains wrapper-target support, or if the custom
call sites reduce to MUI components alone.

---

## D7. Scope — **confirmed as written**

**In:** viewer UI, theme source, `theme.components`, first-party static CSS
(`style.css`, drawer stylesheet).

**Out:** user map symbology and drawing colours (API/config data, separate product
decision); JSON test fixtures; demo, sandbox and release HTML; vendored CodeMirror CSS.

First-party static CSS is in scope by intent, but unreachable in practice while
D3 stands: a plain stylesheet cannot read the theme, and `cssVariables` is
deferred. This is a current implementation limitation, not an oversight.

Follows from D5 — map rendering keeps the ramp, so it is not part of this work.

---

## D8. `nativeColor` — **Deferred**

Depends on D3, which is deferred. OpenLayers may not accept CSS relative-colour syntax.
