# Colour normalization — what's left

Plain-language status and to-do list. Replaces the per-phase audit documents,
which are now history. The other retained references are
`COLOUR_DECISIONS.md` (why things are the way they are), `HELD.md` (the live
exception list), and `FOCUS.md` (reference for the one decision that was left
alone).

## Where things stand

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

**Tabs and AppBar hover treatment.** Both currently use `primary.main` as the
hover background and `primary.contrastText` as the foreground. The AppBar's
`primary.light` is a hover border, not its background. Decide whether the solid
primary hover is intended or whether these controls should use a lighter
treatment, and review the two together.

**Zebra striping contrast.** Alternating rows in the data table and feature
details currently use two different hand-picked shades. Mapping both to the
`background.paper` / `background.default` pair would make the details striping
nearly invisible. Decide whether that pair is enough separation or whether these
stay as they are.

**The AOI panel title strip.** It inverts against its card using a fixed grey
pair that does not follow the theme. Decide whether it should become
theme-adaptive — if so, it can use the existing `inverseContent` token.

---

## 2. Work that is settled but deliberately deferred

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

**Remove the optional-token guarding** — a chore, any time.

The custom palette tokens are declared optional, so every call site reads
`theme.palette.surface?.high ?? <fallback>`. Verbose everywhere, and the
fallbacks are often unreachable — including inside the generator that populates
the tokens.

The reason for optionality is real: `@/ui` wrapper components can receive an
external MUI theme from GeoChart. But that belongs at the `@/ui` boundary, where
GeoView defaults can be merged into the incoming theme once, not at every call
site. Then make the tokens required in the type and delete the guards.

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
