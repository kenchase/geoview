# D6. Focus-ring contract

## Constraints to remember

**One box-shadow layer only.** MUI's `focusVisible` supports a single
additive `boxShadow` beside the outline, and only the first layer is inset
on inner-indicator components. Comma-separated layers are not supported.
The current halo fits this, but the design cannot grow a second shadow
layer within MUI's API.

**Box-shadow is dropped in forced-colors mode.** The halo disappears there
and only the outline remains. The 3px solid outline is therefore
load-bearing for accessibility: never replace it with a shadow-only
treatment, and never use `outline: none` on a focus target.

## 1. Current contract

The current design has one shared GeoView colour pair and two styling paths:

1. MUI's top-level `theme.focusVisible` option styles focus-visible states on
   supported Material UI components.
2. GeoView's helpers style custom focus targets, composite controls, and
   fallbacks where the MUI theme option is absent.

The source of the pair is `IGeoViewColors.focusIndicator` in
[`types.ts`](../../packages/geoview-core/src/ui/style/types.ts). It is part of
the `geoViewColors` object, which the theme generator also exposes as the
custom `palette.geoViewColor` token. It is not one of MUI's standard palette
roles.

### Shared dimensions and helpers

[`themeOptionsGenerator.ts`](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts)
defines:

| Constant | Value | Use |
|---|---:|---|
| `FOCUS_OUTLINE_WIDTH` | `3px` | Shared outline width; the source comment identifies WCAG 2.1 SC 2.4.7. |
| `FOCUS_OUTLINE_OFFSET` | `2px` | Default distance outside the target. |
| `FOCUS_HALO_SIZE` | `6px` | Width of the additional halo box shadow. |

`getFocusIndicatorStyles` produces a `3px` solid outline using
`focusIndicator.outline`, offset `2px`, plus one `0 0 0 6px` box-shadow using
`focusIndicator.halo`. `getFormControlFocusIndicatorStyles` reuses that
outline and explicitly sets `boxShadow: 'none'`; its source comment says the
form control's own border/underline makes the halo visually redundant.

The same file sets the top-level `theme.focusVisible` object from the shared
pair and dimensions. Its configured outline is also `3px` with a `2px` offset,
and its one box-shadow is the `6px` halo. Thus the ordinary theme path and
helper path share colour and dimensions, but component-local styles can alter
the result.

### Theme colours

All four display themes resolve the pair as follows:

| Theme | Outline | Halo | Definition |
|---|---|---|---|
| `light` | `#000` | `#fff` | Explicit in [`light-theme.ts`](../../packages/geoview-core/src/ui/style/light-theme.ts). |
| `dark` | `#fff` | `rgba(0, 0, 0, 0.8)` | Explicit in [`dark-theme.ts`](../../packages/geoview-core/src/ui/style/dark-theme.ts). |
| `geo.ca` | `#000` | `#fff` | Inherits the default pair from [`default.ts`](../../packages/geoview-core/src/ui/style/default.ts), via [`geo-ca-theme.ts`](../../packages/geoview-core/src/ui/style/geo-ca-theme.ts). |
| `canada.ca` | `#000` | `#fff` | Inherits the default pair from [`default.ts`](../../packages/geoview-core/src/ui/style/default.ts), via [`canada-ca-theme.ts`](../../packages/geoview-core/src/ui/style/canada-ca-theme.ts). |

[`theme.tsx`](../../packages/geoview-core/src/ui/style/theme.tsx) builds each
theme through `generateThemeOptions`, so the resolved pair feeds both paths.

### Nine direct helper call sites

| Call site | Focus target / control | Current role |
|---|---|---|
| `getButtonStyleOverrides` in `themeOptionsGenerator.ts` | `appBarButtonStatic` MUI Button/IconButton variant | Local `:focus-visible` variant rule calls `getFocusIndicatorStyles`, then changes the offset and removes the halo. |
| `MuiInputBase` override in `themeOptionsGenerator.ts` | TextField, Select, Autocomplete, and date-picker input roots | Uses `getFormControlFocusIndicatorStyles` on a root containing `:focus-visible`, but only while the shell is in GeoView keyboard-active mode. |
| [`slider-style.ts`](../../packages/geoview-core/src/ui/slider/slider-style.ts) | MUI Slider thumb | Uses the helper when `theme.focusVisible` is absent; with it present, local hover/active rules restore the configured box-shadow that those states would otherwise replace. |
| [`switch-style.ts`](../../packages/geoview-core/src/ui/switch/switch-style.ts) | Wrapper around a Switch and its FormControlLabel | Gives the whole labeled control a two-layer ring when the inner SwitchBase is focus-visible; local rules suppress duplicate rings on the SwitchBase and track. |
| [`scale-style.ts`](../../packages/geoview-core/src/core/components/scale/scale-style.ts) | Expanded scale-format RadioGroup | Adds a ring to the group when any contained Radio receives focus; this is a composite wrapper, not the Radio's own ring. |
| [`map-style.ts`](../../packages/geoview-core/src/core/components/map/map-style.ts) | OpenLayers overview-map toggle button | Styles the native button's `:focus-visible` state and overrides OpenLayers CSS. |
| [`responsive-grid-layout-style.ts`](../../packages/geoview-core/src/core/components/common/responsive-grid-layout-style.ts) | Focusable `.panel-content-container` | Styles the custom content container; separate nested MUI ButtonBase controls have local inset geometry. |
| [`layer-settings-style.ts`](../../packages/geoview-core/src/core/components/layers/right-panel/layer-settings/layer-settings-style.ts) | Raster-function and WMS-style selectable cards | Fallback for a ButtonBase card only when `theme.focusVisible` is absent, including externally supplied themes. |
| [`map-info-rotation-button-style.ts`](../../packages/geoview-core/src/core/components/map-info/map-info-rotation-button-style.ts) | Focusable Box with `role="note"` for the map-rotation tooltip | Adds a ring to a non-MUI focusable element. |

### Local variations

- `appBarButtonStatic` uses the shared helper, but sets `outlineOffset: 0` and
  `boxShadow: 'none'`. It therefore renders a single outline rather than the
  configured outline-plus-halo treatment.
- `MuiMenuItem` uses a negative `outlineOffset` of `-3px` and
  `boxShadow: 'none'`. Its comment says this keeps the outline inside dense or
  clipped rows.
- Tabs use a negative `-3px` offset and an **inset** `6px` halo so focus stays
  inside the scrolling/clipped tab area. This is a local two-layer geometry.
- Data-table buttons, layer-list buttons, and other dense ButtonBase controls
  also set negative offsets and often suppress their local box-shadow.
- App-bar and NavBar rules set `outlineColor: 'transparent'` and
  `boxShadow: 'none'` on `.Mui-focusVisible`; their local focus appearance is
  not the same as the global two-colour ring.
- The NavBar suppression is intentional, not a missing indicator. The 3px ring
  with halo did not work visually on the 44px square nav buttons, and a
  high-contrast background treatment replaces it. `outlineColor: 'transparent'`
  rather than `outline: none` is deliberate too: the outline stays declared, so
  forced-colors mode repaints it, which is what MUI's docs recommend.

  Do not "restore" the global ring here. Two things are worth verifying if
  this is revisited: where the replacement background actually comes from —
  if it is MUI's TouchRipple then the indicator depends on an animation and
  `disableTouchRipple` would silently remove it — and whether the focused
  background clears 3:1 against the unfocused state in all four themes, per
  WCAG 2.2 focus appearance.
- The Switch and scale/coordinate radio groups draw their indicator around a
  wrapper/group, not just around the MUI child that receives focus. The Switch
  styles explicitly suppress child/track rings to avoid duplicate indicators.
- Mouse-position's radio group has a separate wrapper outline using the shared
  outline colour. Tabs and mouse-position also have mode-based colour
  fallbacks if `palette.geoViewColor` is unavailable.
- The InputBase helper drops the halo and uses `outlineOffset: 0`; it also
  suppresses the standard input underline pseudo-elements while keyboard
  focus is active.

The shell toggles `.geoview-keyboard-active` / `.geoview-keyboard-inactive`
according to GeoView's keyboard-navigation mode. The InputBase override is
scoped as `.geoview-keyboard-active &:has(:focus-visible)`. Its adjacent
source comments record the reason: `:focus-visible` alone still matches text
inputs on mouse click in the affected behavior, so that selector alone did
not preserve the mouse-user experience. The shell class is the additional
GeoView keyboard-only gate; the same scoped selector removes the native
underline when the custom form outline is shown.

Other hard-won focus behavior recorded in source comments includes explicit
focus-visible requests for skip-link targets, and intentionally using plain
`focus()` for the map target because the active crosshair already serves as
the visual keyboard-navigation indicator. These are separate from the
theme's component styling and must not be changed as a side effect.

## 2. Recommendation

**Consolidate controls covered by MUI's API, while keeping a shared GeoView
colour source for the remaining custom targets.**

For supported Material UI controls, let `theme.focusVisible` own the common
outline, offset, and single halo layer. Remove redundant per-control colour
definitions only after confirming the API produces the same two-layer ring.
Retain local component overrides for geometry that differs from the default,
including inset/negative offsets, clipped or dense layouts, hover/active
shadow interactions, and wrappers that represent a whole control group.

Keep custom focus styles for:

- InputBase form roots, because GeoView's keyboard-active scope, underline
  handling, and form-control treatment are not expressed by the MUI option.
- OpenLayers/native map controls and custom focusable content such as the
  overview-map toggle, responsive-grid content target, and map-rotation
  tooltip target.
- Composite group indicators around Switch labels, scale/coordinate
  RadioGroups, and any other wrapper whose child receives focus.
- Fallbacks for MUI controls used under external themes that omit
  `focusVisible`.

Keep the outline and halo as one shared `focusIndicator` pair in GeoView's
custom `geoViewColor` namespace, and derive the MUI `focusVisible` CSS from
that same source. Do **not** map the pair to a standard single palette role
such as `action.focus`: the contract needs two colours and MUI's second ring
layer is a CSS shadow, not a second palette role. This retains one canonical
colour source without duplicating values in the standard palette.

The recommendation does not remove the two-layer treatment. Existing local
rules that currently suppress a halo are documented differences, not a
recommendation to make that the consolidated behavior. Any migration must
preserve or restore the shared two-layer indicator wherever that treatment
is the contract; where a component's existing special appearance is retained,
verify and document the exception explicitly.

## 3. Verification before a change merges

Visual review alone is insufficient. Test computed behavior and actual
keyboard navigation for every affected focus-target type:

- **Keyboard-only navigation:** tab and use each control as intended: MUI
  buttons/IconButtons, MenuItems, list and table actions, tabs and tab
  scrollers, Slider, Switch and its label, TextField/Select/Autocomplete/date
  picker, scale and coordinate radio groups, map/overview controls,
  responsive-grid content, and the map-rotation tooltip target. Check focus
  order, indicator location, both ring colours, and return/skip-link focus.
- **Mouse versus keyboard:** verify pointer-clicked text inputs do not acquire
  the custom keyboard-only outline, while keyboard focus does. Exercise both
  GeoView keyboard-active and inactive shell states, and an external theme
  without `focusVisible`.
- **Forced-colors mode:** verify the outline remains visible when the browser
  removes box shadows; do not rely on the halo alone or use `outline: none`.
- **Clipped, dense, and inset contexts:** test MenuItem and layer-list rows,
  data-table controls, tabs in the scroller, and the responsive-grid panel.
  Ensure the outline is not clipped, does not overlap adjacent controls, and
  the halo remains visible at the intended inset.
- **All four themes:** repeat the checks in `light`, `dark`, `geo.ca`, and
  `canada.ca`. Confirm each theme resolves its pair correctly, including the
  dark semi-transparent halo, and check the ring against both light and dark
  surfaces.
- **Layer composition:** verify the outline and exactly one halo remain
  additive; test Slider hover/active while keyboard-focused, inner/inset
  controls, and controls inside AppBar/Alert/SnackbarContent-like coloured
  surfaces. Check that a custom box-shadow does not silently replace a
  necessary contrast layer.
- **Hard-won behavior:** explicitly test the InputBase keyboard-mode gate and
  underline suppression, skip-link focus, and the map-target crosshair path.
  The crosshair path intentionally uses plain `focus()` without a ring because
  the crosshair itself is the visual indicator.

## Bare `:focus` selectors

This inventory covers viewer UI source selectors containing bare `:focus`,
including combined selectors such as `:active, :focus` and `:hover, :focus`.
`:focus-visible` and `:focus-within` alone are not bare `:focus` selectors.
The add-layer tree rule below contains both `:focus` and `:focus-within`.

| File and line | What the selector styles | Visible to a mouse user? / likely intent | Relationship to D6 |
|---|---|---|---|
| [`card-media.tsx`](../../packages/geoview-core/src/ui/card-media/card-media.tsx#L20) | A 2px blue outline on the focusable CardMedia wrapper (`tabIndex={0}`). | Yes, after a pointer click leaves it focused. The outline appears intended as a keyboard focus indicator, so showing it on mouse focus is likely unintended. The component is marked unused in source today. | This is a separate, 2px custom outline rather than the shared D6 indicator; if used, it duplicates focus indication while diverging from the shared 3px outline/halo contract. |
| [`containers-style.ts`](../../packages/geoview-core/src/core/containers/containers-style.ts#L131) | Moves the shell skip link onscreen and expands its hidden dimensions while active or focused. | Not through an ordinary mouse click: the link is positioned offscreen until revealed. Revealing it on keyboard focus is intentional; after keyboard reveal a pointer can click it. | Revealing the link is not an indicator and does not duplicate D6. |
| [`themeOptionsGenerator.ts`](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L137) | On `.buttonFilled` AppBar Button/IconButton controls, applies the primary background and contrast text on hover or focus. | Yes. A mouse click leaves the same hover-like colors while the control remains focused. Pairing focus with hover suggests this shared interaction feedback may be intentional, though the persistent mouse-focus state should be confirmed. | These are surface/text state colors, not an outline or halo. They do not duplicate D6; the focus indicator can coexist. |
| [`notifications-style.ts`](../../packages/geoview-core/src/core/components/notifications/notifications-style.ts#L62) | Reveals and positions the visually hidden “skip to footer” link while active or focused. | Not through an ordinary mouse click while hidden; it becomes available on keyboard focus. This is intentional skip-link behavior. | Reveal/layout behavior, not an indicator; no D6 duplication. |
| [`map-style.ts`](../../packages/geoview-core/src/core/components/map/map-style.ts#L84) | Removes the OpenLayers control button's generic focus outline; the adjacent `:focus-visible` selector applies GeoView's focus indicator. | The suppression applies to mouse focus too, so the OpenLayers outline is not shown for a pointer click. This is intentional to override OpenLayers' generic `:focus` styling. | This is a deliberate reset paired with the D6 helper on `:focus-visible`, not a duplicate. Changing the reset to `:focus-visible` could expose OpenLayers' generic focus style to mouse users. |
| [`add-new-layer-style.ts`](../../packages/geoview-core/src/core/components/layers/left-panel/add-new-layer/add-new-layer-style.ts#L50) | Applies `action.hover` background to a TreeItem's content when the item itself is focused or contains focus (`:focus-within`). | Yes. Clicking a tree item can focus it and leave the row background visible. This looks intentional as active-row feedback shared by pointer and keyboard, but would be sticky after the pointer moves away. | It changes the row surface, not the focus indicator; no D6 duplication. |
| [`layer-icon-style.ts`](../../packages/geoview-core/src/core/components/common/layer-icon-style.ts#L95) | Sets `outlineColor` on the stacked-icons wrapper. | No in its current use: the target is a `span` with `aria-hidden` and no `tabIndex`, so ordinary pointer or keyboard interaction does not focus it. The declaration appears dormant/defensive. | `outlineColor` is an indicator property and therefore belongs to the D6 boundary, but this rule does not itself provide a visible outline or duplicate the shared ring in current usage. |
| [`layer-icon-style.ts`](../../packages/geoview-core/src/core/components/common/layer-icon-style.ts#L106) | Reverts the border on a single-icon preview when focused. | No in its current use: the preview is an `aria-hidden` SVG icon without `tabIndex`, not an interactive target. The rule appears dormant. | It is not an indicator and does not duplicate D6. |
| [`nav-bar-style.ts`](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L108) | On NavBar IconButtons, changes the background and text/icon color inside `&:focus`. | Yes. A mouse click can leave these colors visible after the pointer moves away. Because the `:hover` rule uses different colors, this looks more like keyboard focus styling than intentional persistent mouse feedback. | These are ordinary state colors, not an indicator; they do not duplicate D6. They remain in the color-sweep inventory. |

### Keyboard-only selector guidance

For ordinary ButtonBase controls such as the NavBar IconButtons and
`.buttonFilled` controls, changing a keyboard-only treatment from `:focus` to
`:focus-visible` is the appropriate first choice; the codebase documents no
button-specific exception requiring GeoView's `.geoview-keyboard-active`
gate. The same native selector is a reasonable candidate for the focus
outline in CardMedia if that currently unused component is brought into use.
For the TreeItem row, use `:focus-visible` (and an equivalent
`:has(:focus-visible)` test for descendant focus if needed) only if the desired
behavior is keyboard-only; retain ordinary `:focus` / `:focus-within` if
pointer-focused active-row feedback is intended.

The `.geoview-keyboard-active` gate is not a general replacement for
`:focus-visible`. The existing InputBase rule uses it because the source
documents a specific case where `:focus-visible` still matched text inputs on
mouse click. Do not add that gate to standard buttons or tree controls without
evidence of the same browser behavior. Keep the skip-link reveal rules and
OpenLayers outline reset as they are unless their separate behavior is being
changed: they serve visibility and third-party-style suppression, not a
keyboard-only color treatment.

The two NavBar expressions were previously excluded from the sweep as “focus
styles.” That was too broad: D6 protects focus-indicator declarations such as
outline, outline color/offset, halo, and the shared `focusIndicator` pair and
helpers; the NavBar `backgroundColor` and `color` are ordinary state colors
and belong in the sweep.
