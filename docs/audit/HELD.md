| File | Line | Current value | CSS property | Why no role fits |
|---|---:|---|---|---|
| `packages/geoview-aoi-panel/src/area-of-interest-style.ts` | 51 | `theme.palette.geoViewColor?.grey.dark[900]` | `backgroundColor` | The title strip deliberately contrasts with the light card surface; `background.paper` would remove that inverted treatment, and no custom token is decided yet. |
| `packages/geoview-aoi-panel/src/area-of-interest-style.ts` | 52 | `theme.palette.geoViewColor?.grey.light[900]` | `color` | Title text is paired with the inverted title-strip background; standard text roles do not express this contrast treatment, pending a custom token decision. |
| `packages/geoview-core/src/core/app-start.tsx` | 62 | `'1px solid red'` | `border` | The error boundary renders outside the theme provider so its fallback remains available when theme context is unavailable; a palette role cannot be resolved there. |
| `packages/geoview-core/src/core/components/common/layer-icon-style.ts` | 72 | `theme.palette.geoViewColor?.bgColor.dark[800]` | `fill` | The title icon glyph needs a foreground colour, but this background ramp value has no four-slot equivalent and its intended semantic role is unclear. |
| `packages/geoview-core/src/core/components/crosshair/crosshair-style.ts` | 30 | `theme.palette.geoViewColor?.grey.lighten(0.1, 0.8)` | `backgroundColor` | The full-width instruction overlay lets the map show through at 0.8 opacity; standard surface roles would remove that translucent overlay behavior. |
| `packages/geoview-core/src/core/components/data-table/data-table-style.ts` | 237 | `theme.palette.geoViewColor?.bgColor.darken(0.01)` | `backgroundColor` | This slightly shades odd table rows to create zebra striping; no standard surface role represents alternating rows. |
| `packages/geoview-core/src/core/components/details/details-style.ts` | 53 | `theme.palette.geoViewColor?.bgColor.darken(0.1)` | `backgroundColor` | This shades odd feature-info rows to create zebra striping; no standard surface role represents alternating rows. |
| `packages/geoview-core/src/core/components/layers/left-panel/add-new-layer/add-new-layer-style.ts` | 32 | `theme.palette.geoViewColor?.grey.opacity(0.95)` | `backgroundColor` | This translucent scrim emphasizes the file drop zone while leaving underlying content faintly visible; standard surface roles do not represent that overlay treatment. |
| `packages/geoview-core/src/core/components/lightbox/lightbox.tsx` | 218 | `'rgba(0, 0, 0, .9)'` | `backgroundColor` | This dims the map and surrounding interface behind the image viewer; standard surface roles do not represent the translucent lightbox backdrop. |
| `packages/geoview-core/src/core/components/map-info/map-info-rotation-button-style.ts` | 23 | `theme.palette.geoViewColor?.bgColor.light[800]` | `color` | This styles the North Arrow wrapper, but the SVG uses explicit path fills and strokes rather than `currentColor`; its intended text role is unclear. |
| `packages/geoview-core/src/core/components/map-info/map-info-style.ts` | 42 | `theme.palette.geoViewColor?.grey.lighten(0.8, 0.8)` | `background` | This translucent surface lets the map show through the static map-info badge; standard surface roles do not represent that overlay treatment. |
| `packages/geoview-core/src/core/components/mouse-position/mouse-position-style.ts` | 26 | `theme.palette.geoViewColor?.bgColor.dark[750]` | `color` | This changes the cycling button's foreground on hover; `action.hover` describes a background treatment, and no palette role expresses this hover foreground. |
| `packages/geoview-core/src/core/components/data-table/data-skeleton-style.ts` | 15 | `theme.palette.grey[400]` | `bgcolor` | This provides the loading placeholder bar color; surface roles describe UI planes, and action/text roles do not represent a skeleton placeholder. |
| `packages/geoview-core/src/ui/circular-progress/circular-progress-style.ts` | 21 | `theme.palette.geoViewColor?.bgColor.dark[900]` | `backgroundColor` | The full-area loading cover uses the opposite of the page surface to obscure the viewer while loading; standard surface roles follow the page theme and no role represents this deliberate inversion. |
| `packages/geoview-core/src/core/components/attribution/attribution.tsx` | 55 | `theme.palette.geoViewColor?.bgColor.dark[650]` | `color` | This sets the attribution icon foreground for a navigable map; text roles would mislabel an icon and `action.active` would discard this mode-specific, background-derived contrast color. |
| `packages/geoview-core/src/core/components/attribution/attribution.tsx` | 55 | `theme.palette.geoViewColor?.grey.dark[500]` | `color` | This sets the attribution icon foreground for a static thumbnail, but the button remains clickable to open attribution details; `text.disabled` would misstate its enabled behavior and no action role expresses this mode-specific neutral. |
| `packages/geoview-core/src/ui/slider/slider-style.ts` | 65 | `theme.palette.geoViewColor?.grey.darken(0.9, 0.87)` | `color` | This sets the inactive slider rail's translucent neutral base color; `divider` describes separators, not an unfilled track, and the action palette has no role for an inactive portion of an enabled slider. |
| `packages/geoview-core/src/core/components/map/map-style.ts` | 81 | `'#cccccc'` | `backgroundColor` | The OpenLayers overview-map control button needs a darker neutral backing over varying map imagery; the decided surface tokens resolve too close to the page background, while action colors represent interaction states rather than this resting control surface. |
| `packages/geoview-core/src/core/containers/containers-style.ts` | 51 | `theme.palette.geoViewColor?.white` | `background` | The `.layer-icon` background is a fixed white canvas behind arbitrary feature-icon artwork; replacing it with theme paper would remove its deliberate contrast in dark mode. |
| `packages/geoview-core/src/core/containers/containers-style.ts` | 83 | `theme.palette.geoViewColor?.primary.darken(0.1, 0.9)` | `border` | `.bordered-primary` uses a primary-accent border but does not mark a selected or active state; `divider` would remove the accent, and no other decided border role fits. |
| `packages/geoview-core/src/ui/style/themeOptionsGenerator.ts` | 458 | `geoViewColors.error.lighten(0.7, 0.6)` | `background` | The layer error-status background is held pending the status-color decisions described in `WHATS_LEFT.md`. |
| `packages/geoview-core/src/ui/style/themeOptionsGenerator.ts` | 466 | `geoViewColors.info.lighten(0.7, 0.6)` | `background` | The layer loading-status background is held pending the info/success distinction described in `WHATS_LEFT.md`. |
| `packages/geoview-core/src/ui/style/themeOptionsGenerator.ts` | 474 | `geoViewColors.grey.lighten(0.7, 0.6)` | `background` | The registered-status background is held pending the layer-status decision described in `WHATS_LEFT.md`. |
| `packages/geoview-core/src/ui/style/themeOptionsGenerator.ts` | 477 | `geoViewColors.info.main` | `color` | The registered-status text color is held pending the info/success and layer-status decisions described in `WHATS_LEFT.md`. |
| `packages/geoview-core/src/ui/style/themeOptionsGenerator.ts` | 522 | `'#FF4081'` | `backgroundColor` | The selected-tab indicator has no settled palette role; hue alone is not enough to map it to a semantic role. |
| `packages/geoview-drawer/src/measurement-styles.css` | 4 | `rgba(0, 0, 0, 0.5)` | `background` | A plain CSS file cannot read the theme, and D3 deferred `cssVariables`, which is the only mechanism that would let it. D7 lists first-party static CSS as in scope, but there is currently no means to migrate it. Revisit only if `cssVariables` is adopted. |
| `packages/geoview-drawer/src/measurement-styles.css` | 6 | `white` | `color` | A plain CSS file cannot read the theme, and D3 deferred `cssVariables`, which is the only mechanism that would let it. D7 lists first-party static CSS as in scope, but there is currently no means to migrate it. Revisit only if `cssVariables` is adopted. |
| `packages/geoview-drawer/src/measurement-styles.css` | 21 | `rgba(0, 0, 0, 0.5)` | `border-top` | A plain CSS file cannot read the theme, and D3 deferred `cssVariables`, which is the only mechanism that would let it. D7 lists first-party static CSS as in scope, but there is currently no means to migrate it. Revisit only if `cssVariables` is adopted. |
| `packages/geoview-swiper/src/swiper-style.ts` | 18 | `'rgba(50,50,50,0.75)'` | `backgroundColor` | This translucent overlay marks the draggable swipe bar while allowing the map underneath to remain visible; no standard palette role represents that treatment. |
| `packages/geoview-swiper/src/swiper-style.ts` | 26 | `'rgba(50,50,50,0.75)'` | `backgroundColor` | This translucent overlay forms the swipe bar behind its handle icons while allowing the map underneath to remain visible; no standard palette role represents that treatment. |

## Observations

| File | Expression | Observation |
|---|---|---|
| `packages/geoview-core/src/core/components/guide/guide-style.ts` | `theme.palette.geoViewColor?.primary.main` / `theme.palette.primary.main` | The migration is correct and an exact alias; the primary role supplies the first heading-level accent. |
| `packages/geoview-core/src/core/components/guide/guide-style.ts` | `theme.palette.geoViewColor?.secondary.main` / `theme.palette.secondary.main` | The migration is correct and an exact alias, but “secondary” here means the second heading level rather than a secondary UI element. Revisit at custom-token review if this pattern recurs. |
| `packages/geoview-core/src/core/containers/containers-style.ts` | `theme.palette.geoViewColor?.secondary.darken(0.5)` / `theme.palette.surface?.high ?? theme.palette.background.paper` | `surface.high` names plane elevation rather than the scrollbar thumb's darker appearance; the role fits because the thumb is the raised chrome plane above its track. |
| `packages/geoview-core/src/core/components/scale/scale-style.ts` | `theme.palette.text.primary` / `theme.palette.text.secondary` | Text roles also color the graphic scale's baseline and end ticks so they stay visually paired with their labels; the roles name text rather than scale marks. |
| `packages/geoview-custom-legend/src/custom-legend-style.ts` | `theme.palette.text.secondary` | The description toggle and description are muted text, but the dark theme currently resolves `text.secondary` to the same white as `text.primary`; this is the documented dark-theme ramp issue. |
| `packages/geoview-core/src/ui/slider/slider-style.ts` | `theme.palette.text.secondary` | `text.secondary` names inactive slider mark labels as secondary text, matching their muted role relative to the active label. |
## Deferred cleanup

**Optional palette tokens and call-site guarding.** The custom palette tokens
(`geoViewColor`, `inverseContent`, `layerVisibility`, `surface`) are declared
optional in `material-ui.d.ts`, so every consumer writes
`theme.palette.surface?.high ?? <fallback>`. This is verbose in every style
file and the fallbacks are often unreachable — for example inside
`themeOptionsGenerator.ts`, which populates the tokens itself.

The reason for optionality is real: `@/ui` wrapper components can receive an
external MUI theme (GeoChart), as noted in `material-ui.d.ts`. But that case
should be solved once at the `@/ui` boundary by merging defaults into the
incoming theme, not by guarding at every call site.

Proposed cleanup, after the colour phase: make the tokens required in the
type, merge GeoView defaults once where an external theme can arrive, and
remove the guards. The unused `backdrop` palette token was removed; MUI
`Dialog` still renders its default backdrop unless `hideBackdrop` is set.

Deferred: do not act on this during the colour sweep.

**`info` and `success` share a value.** Both GeoView roots are `#2e7d32`
(MUI's default success green; MUI's default `info` is blue). Status feedback
therefore cannot distinguish "this worked" from "here is information". The
`.loading` and `.registered` list-item states both render the same text
colour as a result.

Needs a product decision on whether `info` should become a distinct colour,
not a styling decision. Deferred.

**`.registered` layer state has no settled status role.** It uses a
grey-derived background with `info.main` text, while its comment says it
means metadata could not be queried because the server is slow — which reads
closer to a warning than information. Its two expressions in
`themeOptionsGenerator.ts` remain unmapped.

Needs input from whoever owns layer status semantics. Tied to the
`info`/`success` question above. Deferred.

**Dark theme ramp direction.** The dark theme's `textColor` root is
`#FFFFFF`. The ramp lightens from the root, and lightening white produces
white at every index, so the dark theme has no muted text colour —
`text.secondary` resolves identically to `text.primary`. Muted text in dark
mode needs to go darker, which the light ramp cannot express from a white
root.

`bgColor` already uses the inverse flag in this theme; `textColor` does not.
That may be the oversight, though it needs checking rather than assuming.

Options, in rough order of preference:

1. Use the inverse flag on the dark theme's `textColor`, matching what
   `bgColor` already does there
2. Change the root to something with headroom in both directions, e.g.
   `#E0E0E0`
3. Set `text.secondary` explicitly per theme rather than deriving it

**Related: `action.*` overlays are weak in the dark theme.** `action.hover`,
`action.selected` and `action.focus` are all derived from `primary` at 8%,
16% and 12% opacity. The dark theme's primary is `#8ec4fa`, so a pale blue
at those opacities barely registers against a dark surface, while a dark
purple at the same opacities reads clearly on near-white.

This affects roughly 15 call sites between `action.hover` and
`action.selected`, so it is one decision rather than a per-component fix:
either a different opacity set for the dark theme, or a less pale dark
primary. Belongs in the same PR.

Related: the surface token work resolved part of this by giving the chrome
planes explicit values, but `background.paper` being darker than
`background.default` in the dark theme was never addressed and may be a
second instance of the same cause.

Out of scope for the colour phase. Worth a dedicated PR with the same
contrast-checking method used to find the `text.secondary` WCAG failure —
resolve the values, check them against the surfaces they sit on, and fix
what fails. The dark theme has had little scrutiny since `palette.mode` was
first set correctly, so expect other findings.