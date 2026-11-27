# Theme normalization — what's left

Plain-language status and to-do list. Replaces the colour per-phase audit
documents, which are now history. Transitions/Shadows decisions and verification
remain in [THEME_DECISIONS.md](./THEME_DECISIONS.md). The other retained references are
`COLOUR_DECISIONS.md` (why things are the way they are), `HELD.md` (the live
exception list), and `FOCUS.md` (reference for the one decision that was left
alone).

## Where things stand

**Transitions complete 2026-10-29:** 21 migrated, 14 retained, 27 held and 10
context rows reconciled against current source. Shadows KEEP requires no source
changes (40 retained, 11 held, 13 context). Fonts decisions remain pending.
Transitions H1-H9 and Shadows SH1-SH5 are recorded in [HELD.md](./HELD.md).

Done and committed:

- Six theme bugs fixed, including an unset `palette.mode` and a `text.secondary`
  that failed WCAG contrast in three of the four themes
- Button, tooltip, tab, typography and form-control overrides in the theme
  generator now use MUI palette roles
- Three custom tokens added where MUI has no equivalent role: `surface.low` /
  `surface.high`, `inverseContent`, `layerVisibility`
- One dead palette token (`backdrop`) removed
- The in-scope colour sweep is complete; see the record below

The sweep covered **77 expressions across 30 files**, including
`packages/geoview-stac-browser/src/stac-browser-style.ts`. A verification rescan
confirmed the in-scope expressions are accounted for: it found one previously
unaccounted footer-bar hover-icon expression, now using `primary.contrastText`,
and five generator exceptions now recorded in [HELD.md](./HELD.md). Other
exceptions are listed there as well.

## 1. Decisions that need a person, not a prompt

These are blocked on judgement, not on effort. Each is small once answered.

**Generated size keys — separate API decision (Fonts, Decided 2026-10-29).**
Rename the floating-point multiplier keys only through a separate API decision:
the 99 exported generated entries include names such as `0.30000000000000004x`.
They remain held unchanged in this normalization. Establish external-consumer
impact and the compatibility/migration contract before choosing new spellings.
See [Fonts decisions](./THEME_DECISIONS.md#fonts).

**Accessibility: px font sizes and browser text settings — separate rem
decision (Fonts, Decided 2026-10-29).** Fixed CSS-px font sizes do not scale
with changes to browser text settings/root font size in the way rem sizes do.
Page zoom is distinct and can enlarge both. Decide on rem conversion separately,
with browser-specific text-setting checks, root-16/root-20 comparisons and
per-consumer geometry/caller-contract review. All px-to-rem conversions,
including drawer static-CSS/cssText and icon sizes, remain held; numerical
equality at a 16px root does not authorize an alias.

**`info` and `success` are the same colour.** Both resolve to `#2e7d32` — MUI's
default success green. So the viewer cannot visually distinguish "this worked"
from "here is some information". The `.loading` and `.registered` layer states
render identical text as a result. Someone needs to decide whether `info`
becomes a distinct colour (MUI's own default is blue).

**The `.registered` layer state has no settled meaning.** It renders a grey
background with info-coloured text, while the code comment says it means
metadata could not be queried because the server is slow — which reads closer
to a warning. Needs whoever owns layer status semantics. Tied to the question
above.

**The pink tab indicator (`#FF4081`).** An arbitrary colour with no relationship
to any theme. Do not map it on hue alone; decide whether the pink was deliberate
or whether it should use a semantic palette role.

**Tabs and AppBar hover treatment — decided.** Use `action.hover` / `text.primary` for hover, `primary.main` / `primary.contrastText` for selection, and `primary.dark` with the selected foreground for selected-hover, so selection stays identifiable and still responds to the pointer.

**Zebra striping contrast.** Alternating rows in the data table and feature
details currently use two different hand-picked shades. Mapping both to the
`background.paper` / `background.default` pair would make the details striping
nearly invisible. Decide whether that pair is enough separation or whether these
stay as they are.

**The AOI panel title strip.** It inverts against its card using a fixed grey
pair that does not follow the theme. Decide whether it should become
theme-adaptive — if so, it can use the existing `inverseContent` token.

**Time-slider shadow colour referral (S07 / SH3).** The header in
[time-slider-style.ts](../../packages/geoview-time-slider/src/time-slider-style.ts)
uses `0px 12px 9px -13px #E0E0E0`. Refer the hard-coded colour to the colour owner
under COLOUR_DECISIONS; preserve its individual shadow hold until that decision.
Shared geometry with other shadows does not authorize colour unification.

**Cross-concern fallback — DECIDED A at the Fonts gate, 2026-10-29; missing-role
cases held.** Preserve existing literals/base-size fallbacks and today's
plain-MUI rendering. Add no fallback to existing `geoViewFontSize` reads that
have none (77 component/helper rows, FH8 in
[Fonts decisions](./THEME_DECISIONS.md#fonts)). Missing leaves can omit CSS or,
inside templates, serialize `undefined`; these are known pre-existing issues,
held for a separate explicitly approved missing-role repair, not this
normalization.

**Known invalid shadow templates — held, no new fallbacks.**
`.bordered` (S08) and `.bordered-primary` (S11) in
[containers-style.ts](../../packages/geoview-core/src/core/containers/containers-style.ts)
and `rightPanelStatus` (S10) in
[details-style.ts](../../packages/geoview-core/src/core/components/details/details-style.ts):
their optional geoViewColor reads serialize `undefined` into shadow templates
when the extension leaf is absent. Preserve that current plain-MUI output and
the independent SH2 treatments; do not add a fallback or unify their colours.
**End condition:** a separate role/colour-owner decision explicitly approves a
repair and its external-theme behavior.

Existing geoViewColor/focus-helper fallbacks remain unchanged. Missing-role
focus assumptions where `theme.focusVisible` is absent (SR3, notably S30/S32
and MenuItem S37) remain held; no fallback, focus geometry, provider or colour
change is authorized. T29 stays literal 200ms under H6; no dedicated next-delay
token or animation-duration alias is approved.

---

## 2. Work that is settled but deliberately deferred

**Tooltip next-delay follow-up — H6, 2026-10-29.**
T25's fallback work is complete: X-A migrated to
`theme.transitions.duration.tooltipDelay ?? 1000`, with the 1000ms request,
per-viewer ownership and caller precedence verified. T29 alone remains literal
200ms under H6; no dedicated next-delay value is approved. See the
[completed unit and runtime evidence](./THEME_DECISIONS.md#fonts).

**Splash plain-theme behavior — retained R1, corrected 2026-10-29.**
T45 keeps `theme.transitions.duration.splash`: plain MUI themes get MUI's
default Fade exit timing; a fallback would change it. This is a missing-role
case under fallback A, not an unblocked fallback migration. Preserve GeoView's
1500ms value and plain-MUI's existing default; no source unit or new fallback.

**Reduced-motion support for UI motion (Transitions Q7).** Treat this as new
behaviour in a separate scoped change, not part of transition token aliasing.
Using `transitions.create` alone does not establish reduced-motion support.
Preserve the existing four scrolling reduced-motion handlers; they are
supplementary context, not additional transition rows.

**Missing `TIMEOUT.shortcutToTab` default (T20/T21 / H5).** In
[use-navigate-to-tab.ts](../../packages/geoview-core/src/core/components/common/hooks/use-navigate-to-tab.ts)
the missing default gives an effective delay of about 0ms; caller override is
possible, but the intended default is unknown. Establish the intended navigation
contract before repairing it. Do not infer a 350ms default from commented code.

**Keyboard-focus verification (S31 NavBar; S14 AppBar targets without a replacement indicator).**
In [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts)
and [app-bar-style.ts](../../packages/geoview-core/src/core/components/app-bar/app-bar-style.ts),
**verify visible keyboard focus at runtime; if absent, scoped repair per D6**.
This is an accessibility follow-up outside normalization, not a proposed fix
or a certification that current suppression is safe.

**Dark theme ramp direction** — its own PR, after item 1.

The dark theme's `textColor` root is `#FFFFFF`. The ramp lightens from the root,
and lightening white produces white, so the dark theme has no muted text colour
at all: `text.secondary` resolves identically to `text.primary`. Muted text in
dark mode needs to go _darker_, which the light ramp cannot express from a white
root.

`bgColor` already uses the inverse flag in that theme; `textColor` does not,
which is probably the oversight. Related: `background.paper` is darker than
`background.default` in dark mode, inverting the relationship the three light
themes have. Likely the same cause.

Use the method that found the `text.secondary` contrast failure: resolve the
values, check each against the surface it sits on, fix what fails. The dark
theme has had little scrutiny since `palette.mode` was first set correctly, so
expect further findings.

**Optional-token guarding** — prior cleanup proposal, pending the Fonts-gate policy above.

The custom palette tokens are declared optional, so every call site reads
`theme.palette.surface?.high ?? <fallback>`. Verbose everywhere, and the
fallbacks are often unreachable — including inside the generator that populates
the tokens.

The reason for optionality is real: `@/ui` wrapper components can receive an
external MUI theme from GeoChart. But that belongs at the `@/ui` boundary, where
GeoView defaults can be merged into the incoming theme once, not at every call
site. Making tokens required and deleting guards remains a proposal, not
settled work: the cross-concern policy above must be decided first, including
the proper external-theme boundary and fallbacks.

**`cssVariables`** — evaluated twice and deferred both times. Do not reopen
within this project. The nested `ThemeProvider` in the overview map is the thing
to test whenever it is revisited.

---

## 3. Held on purpose — no action needed

Expressions with no fitting MUI role, plus the generator holds pending decisions,
are recorded in `HELD.md`. Revisit them only when those roles or decisions are
resolved.

## 4. Lock in what is done

Not yet done, and the reason this decays if skipped:

- **ESLint rules** banning raw hex values in `sx` and `style={{}}` entirely
- **Fold the conventions into the project-wide UI/A11Y instructions** — the
  filter is "would MUI's own docs tell you this?" If yes, leave it out. What
  remains is the three custom tokens, the `common.white`-when-invariant rule,
  and the ramp-is-for-map-rendering exception
- **Re-check the A11Y instructions against v9**, which added `enhanceHighContrast`
  and improved roving tabindex on Tabs, Stepper and MenuList. Some of what that
  file mandates may now be handled upstream

---

## Done when

- No colour values outside the theme in viewer UI
- Tokens are semantic and match the properties they set
- Light/dark handled by the theme, not by per-component conditionals
- Lint rules prevent regression
- Conventions documented, exceptions justified
