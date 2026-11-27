| File | Line | Current value | CSS property | Why no role fits |
|---|---:|---|---|---|
| `packages/geoview-aoi-panel/src/area-of-interest-style.ts` | 51 | `theme.palette.geoViewColor?.grey.dark[900]` | `backgroundColor` | The title strip deliberately contrasts with the light card surface; `background.paper` would remove that inverted treatment, and no custom token is decided yet. |
| `packages/geoview-aoi-panel/src/area-of-interest-style.ts` | 52 | `theme.palette.geoViewColor?.grey.light[900]` | `color` | Title text is paired with the inverted title-strip background; standard text roles do not express this contrast treatment, pending a custom token decision. |
| `packages/geoview-core/src/core/app-start.tsx` | 62 | `'1px solid red'` | `border` | The error boundary renders outside the theme provider so its fallback remains available when theme context is unavailable; a palette role cannot be resolved there. |
| `packages/geoview-core/src/core/components/crosshair/crosshair-style.ts` | 30 | `theme.palette.geoViewColor?.grey.lighten(0.1, 0.8)` | `backgroundColor` | The full-width instruction overlay lets the map show through at 0.8 opacity; standard surface roles would remove that translucent overlay behavior. |
| `packages/geoview-core/src/core/components/data-table/data-table-style.ts` | 237 | `theme.palette.geoViewColor?.bgColor.darken(0.01)` | `backgroundColor` | This slightly shades odd table rows to create zebra striping; no standard surface role represents alternating rows. |
| `packages/geoview-core/src/core/components/details/details-style.ts` | 53 | `theme.palette.geoViewColor?.bgColor.darken(0.1)` | `backgroundColor` | This shades odd feature-info rows to create zebra striping; no standard surface role represents alternating rows. |
| `packages/geoview-core/src/core/components/layers/left-panel/add-new-layer/add-new-layer-style.ts` | 32 | `theme.palette.geoViewColor?.grey.opacity(0.95)` | `backgroundColor` | This translucent scrim emphasizes the file drop zone while leaving underlying content faintly visible; standard surface roles do not represent that overlay treatment. |
| `packages/geoview-core/src/core/components/lightbox/lightbox.tsx` | 218 | `'rgba(0, 0, 0, .9)'` | `backgroundColor` | This dims the map and surrounding interface behind the image viewer; standard surface roles do not represent the translucent lightbox backdrop. |
| `packages/geoview-core/src/core/components/map-info/map-info-rotation-button-style.ts` | 23 | `theme.palette.geoViewColor?.bgColor.light[800]` | `color` | This styles the North Arrow wrapper, but the SVG uses explicit path fills and strokes rather than `currentColor`; its intended text role is unclear. |
| `packages/geoview-core/src/core/components/map-info/map-info-style.ts` | 42 | `theme.palette.geoViewColor?.grey.lighten(0.8, 0.8)` | `background` | This translucent surface lets the map show through the static map-info badge; standard surface roles do not represent that overlay treatment. |
| `packages/geoview-core/src/core/components/scale/scale-style.ts` | 88, 91 | `theme.palette.geoViewColor?.grey.dark[500]` | `color`, current-colour `borderBottom`, tick `backgroundColor` | The static scale label, baseline and tick marks sit on the invariant map-info badge surface held in the preceding row, so their foreground is held too; no theme text role preserves this deliberately invariant pair. |
| `packages/geoview-core/src/core/components/mouse-position/mouse-position-style.ts` | 26 | `theme.palette.geoViewColor?.bgColor.dark[750]` | `color` | This changes the cycling button's foreground on hover; `action.hover` describes a background treatment, and no palette role expresses this hover foreground. |
| `packages/geoview-core/src/core/components/data-table/data-skeleton-style.ts` | 15 | `theme.palette.grey[400]` | `bgcolor` | This provides the loading placeholder bar color; surface roles describe UI planes, and action/text roles do not represent a skeleton placeholder. |
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

## Transitions holds

Recorded at closeout 2026-10-29; decisions and occurrence authority:
[Transitions decisions](./THEME_DECISIONS.md#decided-holds) and
[discovery](./THEME_DISCOVERY.md). Line numbers below are discovery-baseline
locations at `cc7d57918`; T-IDs remain stable when source lines move.
These nine groups cover **26** held rows. T25 migrated in X-A on 2026-10-29;
H6 keeps T29 only. T45 remains retained under R1,
not H6; its splash fallback question is in [WHATS_LEFT.md](./WHATS_LEFT.md).

| File | Line | Current value | CSS property | Why no role fits |
|---|---:|---|---|---|
| [lightbox.tsx](../../packages/geoview-core/src/core/components/lightbox/lightbox.tsx), [use-light-box.tsx](../../packages/geoview-core/src/core/components/common/hooks/use-light-box.tsx) | 230; 66 | **H1: T01, T11** — fade 250ms, swipe 500ms; post-exited focus wait 250ms | Animation prop; JS focus wait | Intended coupling is unknown; 250 matching MUI short is not sufficient and 500 has no equal field. Preserve the whole animation prop. **End condition:** image-viewer choreography and the focus wait's role are decided together, with an approved mapping. |
| [panel-style.ts](../../packages/geoview-core/src/ui/panel/panel-style.ts) | 53, 90; 54, 91 | **H2: T02, T03, T05, T06** — fade 500ms ease-in-out; stagger 300/400ms | `animation`, `animationDelay` | Staged panel choreography is not expressed by one existing MUI role. **End condition:** an explicit choreography decision establishes the fade/stagger relationship and approved theme mapping. |
| [accordion.tsx](../../packages/geoview-core/src/ui/accordion/accordion.tsx) | 50 | **H3: T04** — 1000ms linear infinite rotation | `animation` | A loading cycle is not tooltipDelay; no fitting existing cycle/linear field is established. **End condition:** a loading-motion policy and fitting cycle/easing representation are approved. |
| [resize-footer-panel.tsx](../../packages/geoview-core/src/core/components/footer-bar/hooks/resize-footer-panel.tsx), [guide-search.tsx](../../packages/geoview-core/src/core/components/guide/guide-search.tsx), [footer-bar.tsx](../../packages/geoview-core/src/core/components/footer-bar/footer-bar.tsx), [guide.tsx](../../packages/geoview-core/src/core/components/guide/guide.tsx) | 214; 425, 405; 112; 288 | **H4: T07, T08, T12, T13, T14** — 100/100/25/300/300ms waits | JS completion/render/focus waits | No fixed-motion mirror is established for these waits; numeric equality is not intent. **End condition:** each wait's completion/render/focus contract is verified and any replacement is explicitly approved without silently changing functional timing. |
| [use-navigate-to-tab.ts](../../packages/geoview-core/src/core/components/common/hooks/use-navigate-to-tab.ts) | 57, 73 | **H5: T20, T21** — caller delay; missing `TIMEOUT.shortcutToTab` default gives about 0ms | JS navigation waits | Intended default is unknown; neither commented 350ms nor another value is authorized. **End condition:** the tab-navigation owner decides the intended default and caller-override contract. |
| [tooltip.tsx](../../packages/geoview-core/src/ui/tooltip/tooltip.tsx) | 35 | **H6: T29** — 200ms next-tooltip delay | `enterNextDelay` | Interaction delays must not derive from animation durations; equality with shorter was coincidental (R6 reversed 2026-10-29). Preserve literal 200 and trailing caller-prop precedence. T25 migrated separately to `tooltipDelay ?? 1000`; no dedicated next-delay value is approved. **End condition:** cross-theme fallback policy decided. |
| [appbar.tsx](../../packages/geoview-core/src/ui/appbar/appbar.tsx), [button-group.tsx](../../packages/geoview-core/src/ui/button-group/button-group.tsx), [modal.tsx](../../packages/geoview-core/src/ui/modal/modal.tsx), [popper.tsx](../../packages/geoview-core/src/ui/popper/popper.tsx), [snackbar.tsx](../../packages/geoview-core/src/ui/snackbar/snackbar.tsx), [notifications.tsx](../../packages/geoview-core/src/core/components/notifications/notifications.tsx), [useSpringAnimations.ts](../../packages/geoview-core/src/core/utils/useSpringAnimations.ts) | 50; 62; 207; 93; 66; 316; 5, 82 | **H7: T33-T41** — six spring consumers, duration 500/50ms and identity JS easing | Spring consumers, duration, easing | Hooks do not read a theme; these durations lack established roles and JS identity easing is not a MUI CSS easing string. **End condition:** per-viewer theme access, consumer/definition coupling and any JS/CSS easing adapter are approved together. |
| [slider-style.ts](../../packages/geoview-core/src/ui/slider/slider-style.ts) | 22 | **H8: T50** — all-property 300ms overshoot | `transition` | No MUI overshoot field; replacing the curve changes behaviour. Hover/active/focus halo motion is coupled to Shadows SH1. **End condition:** slider interaction motion and its coupled shadows receive an explicit approved treatment; no D6 geometry/colour change is implied. |
| [layer-settings-style.ts](../../packages/geoview-core/src/core/components/layers/right-panel/layer-settings/layer-settings-style.ts) | 33 | **H9: T57** — border-color 200ms, implicit ease | `transition` | No alternate border state was established in the inspected consumers; trigger intent is unresolved. **End condition:** the triggering action/state is established and an approved transition mapping is chosen. |

## Shadows holds

Recorded at closeout 2026-10-29; authority:
[Shadows decisions](./THEME_DECISIONS.md#decided-holds-shadows) and
[discovery](./THEME_DISCOVERY.md). These five groups cover **11** held rows.
SH2's occurrences remain independent treatments; shared geometry is not
permission to unify their colours. Line numbers are at `cc7d57918`.

| File | Line | Current value | CSS property | Why no role fits |
|---|---:|---|---|---|
| [slider-style.ts](../../packages/geoview-core/src/ui/slider/slider-style.ts) | 44, 27, 24 | **SH1: S01, S05, S12** — important blue hover ring, overridden white hover declaration, thumb base relief | `boxShadow` | Retain together with Transitions H8/T50; no motion or shadow change is authorized. **End condition:** an explicit slider treatment resolves the H8 motion/shadow coupling while respecting D6. |
| [map-info-style.ts](../../packages/geoview-core/src/core/components/map-info/map-info-style.ts), [containers-style.ts](../../packages/geoview-core/src/core/containers/containers-style.ts), [details-style.ts](../../packages/geoview-core/src/core/components/details/details-style.ts) | 36; 67, 71; 21 | **SH2: S06, S08, S10, S11** — S06 independent `0 0 5px` strip; S08 alpha .5 frame; S10/S11 alpha 1 status/primary frames | `boxShadow` | S06 has no exact MUI alias; preserve its geometry, colour and existing fallback. S08/S10/S11 remain individual holds: unifying the `0 12px 9px -13px` family changes colour across three sources owned by COLOUR_DECISIONS. **End condition:** S06 receives an approved role-preserving mapping; each shared-geometry occurrence is revisited only after the colour owner decides its treatment. Missing-extension fallback work is separately deferred to the Fonts gate. |
| [time-slider-style.ts](../../packages/geoview-time-slider/src/time-slider-style.ts) | 33 | **SH3: S07** — `0px 12px 9px -13px #E0E0E0` | `boxShadow` | Preserve literal colour and geometry independently; no colour decision is reopened by normalization. **End condition:** the colour owner resolves the `#E0E0E0` referral and approves any replacement. |
| [app-bar-style.ts](../../packages/geoview-core/src/core/components/app-bar/app-bar-style.ts), [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts) | 88; 115 | **SH4: S14, S31** — focus-shadow suppression | `boxShadow: none` | Retain without certifying keyboard-focus safety; NavBar and AppBar targets lacking a visible replacement are an out-of-scope accessibility concern. **End condition:** verify visible keyboard focus at runtime; if absent, scoped repair per D6, outside this normalization. |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts) | 422 | **SH5: S09** — Paper `0px 12px 9px -13px`, bg-dark20 alpha .5 | `boxShadow` | DECIDED KEEP named edge separation treatment, including its global Paper reach; retain this occurrence separately under colour ownership. It satisfies the end state and needs no source change. **End condition:** only a new explicit Paper-treatment/colour-owner decision can reopen KEEP; no automatic removal or elevation restoration. |

## Observations

| File | Expression | Observation |
|---|---|---|
| `packages/geoview-core/src/ui/tabs/tabs-style.ts`, `packages/geoview-core/src/ui/style/themeOptionsGenerator.ts` | `action.hover` / `primary.main` / `primary.dark` | Resolved: resting controls show the page surface; unselected hover uses `action.hover` / `text.primary`, selected uses `primary.main` / `primary.contrastText`, and selected-hover uses `primary.dark` with the selected foreground inherited. All four states checked for tabs and dynamic/static AppBar buttons in all four themes; existing primary-coloured resting icons and AppBar foregrounds are unchanged, as is the static AppBar's `primary.light` hover border. |
| [NavBar panel buttons](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts), [responsive-layout Guide toggle](../../packages/geoview-core/src/core/components/common/responsive-grid-layout-style.ts), [STAC alphabetical-sort toggle](../../packages/geoview-stac-browser/src/stac-browser-style.ts), [shared button variants](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts) | `.highlighted.active`, `.active`, `[aria-pressed="true"]`, shared `.highlighted` / `.buttonOutline` / `.buttonFilledOutline` | Follow-up: selected/active controls lack distinct hover feedback, the same defect fixed for tabs and AppBar. Address the in-scope controls in one consistency commit using a combined selected-class hover selector (`&.<selected-class>:hover`) with `primary.dark`; verify inherited foregrounds, since the outline variants currently use `primary.dark` text and cannot inherit it onto the same fill. STAC is excluded pending the other developer's work. Layer-list rows deliberately suppress selected-hover and are not part of this follow-up. |
| `packages/geoview-core/src/core/components/guide/guide-style.ts` | `theme.palette.geoViewColor?.primary.main` / `theme.palette.primary.main` | The migration is correct and an exact alias; the primary role supplies the first heading-level accent. |
| `packages/geoview-core/src/core/components/guide/guide-style.ts` | `theme.palette.geoViewColor?.secondary.main` / `theme.palette.secondary.main` | The migration is correct and an exact alias, but “secondary” here means the second heading level rather than a secondary UI element. Revisit at custom-token review if this pattern recurs. |
| `packages/geoview-core/src/core/containers/containers-style.ts` | `theme.palette.geoViewColor?.secondary.darken(0.5)` / `theme.palette.surface?.high ?? theme.palette.background.paper` | `surface.high` names plane elevation rather than the scrollbar thumb's darker appearance; the role fits because the thumb is the raised chrome plane above its track. |
| `packages/geoview-custom-legend/src/custom-legend-style.ts` | `theme.palette.text.secondary` | The description toggle and description are muted text, but the dark theme currently resolves `text.secondary` to the same white as `text.primary`; this is the documented dark-theme ramp issue. |
| `packages/geoview-core/src/ui/slider/slider-style.ts` | `theme.palette.text.secondary` | `text.secondary` names inactive slider mark labels as secondary text, matching their muted role relative to the active label. |

### Held background / migrated foreground pairing hazard

A held invariant, inverted or translucent background does not make a migrated
foreground safe. When a background is held, the foreground painted on it is held too.
Check the rendered pair together in all four themes, including
inherited colours, SVG fills/strokes, borders, scale marks and focus indicators.
Composite translucent layers against the actual underlay; black/white underlays
give bounds for arbitrary map imagery, not a single opaque background colour.
Use 4.5:1 for normal text and 3:1 for essential non-text graphics; decorative
borders and authored map symbology are not automatically UI contrast failures.
The invariant pairing rule applies to content, not decoration: a frame whose
removal loses no information is exempt from WCAG 1.4.11 and may remain
theme-adaptive on a held surface.
Check git history before classifying a mismatch as a sweep regression: a
colour-preserving alias migration is not a regression, even when the resolved
colour was already failing. Pre-existing failures belong to deferred work,
not this appearance-preserving refactor.

Held static scale pair:

- [Static map-info overlay](../../packages/geoview-core/src/core/components/map-info/map-info-style.ts)
  / [scale labels, baseline and ticks](../../packages/geoview-core/src/core/components/scale/scale-style.ts):
  the foreground is held as `geoViewColor?.grey.dark[500]` for the label,
  current-colour baseline and both ticks: `#4F4F4F` in light/dark/geo.ca,
  `#4B4B4B` in canada.ca. The retained badge is
  `rgba(235,235,235,0.8)` (canada.ca: `234`), giving 4.31-7.12:1
  (canada.ca: 4.55-7.53:1) over black/white map underlays.
  The marginal original 4.31:1 text contrast is pre-existing and deferred,
  outside the scope of this held-expression decision.
  Dynamic scale styles and the already paired attribution icon are unchanged.

The five other attempted pairing fixes were reverted to their post-sweep
expressions after git history established pre-existing failures. See
the **Dark theme ramp direction** deferred item below for the measured
defects and provenance. No new glyph overrides, icon backing, local crosshair
colour, file-drop foreground or loading inverse-content pair remain.

Still deferred:

- Held translucent error/loading/registered backgrounds in the
  [theme generator](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts)
  / migrated text and action colours: over dark paper the resulting surfaces
  are approximately `#9a7d7e`, `#7d8b7e`, `#919191`. White text gives
  3.75:1, 3.57:1, 3.17:1; pale-primary graphics give 2.04:1, 1.94:1, 1.72:1.
  [Left-panel secondary text](../../packages/geoview-core/src/core/components/layers/left-panel/left-panel-styles.ts)
  explicitly overrides status colours with `text.primary !important`, so check
  the cascade, not just the generator's status foreground declarations.
  Migrate these background/foreground pairs together in the already deferred
  status-colour work; do not resolve their semantics with a local colour patch.

Other held surfaces were checked: the AOI title strip retains its paired grey
foreground; overview-map chevron is invariant black on `#cccccc`; swiper icons
are invariant white on the translucent dark handle; lightbox controls have
invariant black/white button backings from `vendor.css`.
Zebra rows remain theme-adaptive; skeleton bars and the pink tab indicator have
no foreground content painted on them.

### Drawer measurement tooltip contrast

[Drawer measurement labels](../../packages/geoview-drawer/src/measurement-styles.css)
now match Measure totals: white on 70%-black at full element opacity, giving approximately
8.5:1 contrast over white map content. The historical 50%-black measurement backing gave
3.98:1. The base tooltip rule still specifies 0.7 element opacity, but measurement labels
override it to 1; do not apply the historical base-opacity calculation to current measurements.
Theme integration and browser-default-font-size scaling remain deferred.

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

Deferred: do not act on this during the colour sweep. At Transitions closeout,
the boundary/default approach remains a proposal pending the Fonts-gate
cross-concern fallback rule in [WHATS_LEFT.md](./WHATS_LEFT.md), not authorization
to remove guards or restructure providers.

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

Known held-surface failures retained after the pairing review (ranges composite
translucent surfaces over black/white underlays). These predate the sweep and
are out of scope; colour-preserving alias migrations stay:

- [Fallback/group glyphs](../../packages/geoview-core/src/core/components/common/layer-icon.tsx):
  dark tooltip fallback and inherited group foreground are white on the held
  white canvas (1.00:1); layer-panel fallback inherits pale `primary.main`
  (`#8EC4FA`, 1.84:1). Tooltip `textColor.main` predates the sweep
  (`3cbd1f44ab`, then `c39141b1db`); `83911059a` aliases it to
  `text.primary` without changing the colour. Existing group inheritance and
  primary-coloured enclosing icons also predate the sweep. Removed the new
  black glyph styles, shared SVG override and added single-fallback backing.
- [Annotation glyph](../../packages/geoview-core/src/core/components/common/layer-icon-style.ts):
  retain `geoViewColor?.bgColor.dark[800]`, from `c39141b1db`, on white.
  Dark resolves to `#D8D8D9`, 1.42:1. The foreground was held, not migrated.
  The original path fill rule remains; only the new black substitution was
  reverted. Decorative `iconBox`/`titleIcon` borders intentionally remain
  `primary.main`: light `#0066CC` (5.57:1), dark `#8EC4FA` (1.84:1),
  geo.ca `#515BA5` (6.20:1), canada.ca `#26374A` (12.15:1) on white.
  These frames convey no essential information and have no WCAG 1.4.11
  contrast requirement; they are not content-pairing defects.
- [Crosshair instruction Typography](../../packages/geoview-core/src/core/components/crosshair/crosshair.tsx):
  retain global `text.primary` on `rgba(167,167,167,0.8)` (canada.ca: `160`).
  Dark white text gives 1.97-3.66:1; geo.ca `#393939` gives 3.16-5.86:1.
  The global `textColor.main` override dates to `e9d474d9b1`; `171bc32b8`
  changed it to an equivalent role. Removed the local black Typography style.
- [File-drop heading](../../packages/geoview-core/src/core/components/layers/left-panel/add-new-layer/add-new-layer-style.ts):
  retain `text.primary` on the 95%-opaque grey scrim. Dark white text gives
  2.53-2.95:1, failing even large-text contrast. Geo.ca gives 3.91-4.57:1
  (large-text compliant). The original `textColor.main` and scrim were paired
  in `6807c9bafe`; `83911059a` only changed the foreground alias.
- [Loading cover/spinner](../../packages/geoview-core/src/ui/circular-progress/circular-progress-style.ts):
  retain `geoViewColor?.bgColor.dark[900]` with MUI's default primary stroke.
  Cover/stroke: light `#181818` / `#0066CC` (3.19:1), dark `#EBEBEC` /
  `#8EC4FA` (1.54:1), geo.ca `#181818` / `#515BA5` (2.87:1), canada.ca
  `#181818` / `#26374A` (1.46:1). The cover dates to `81e7c2424c`;
  the default primary stroke was already present before `83911059a`.
  Removed the inverse-content pair and its colour-override composition.
- [Static scale's original low-end contrast](../../packages/geoview-core/src/core/components/scale/scale-style.ts):
  restored `grey.dark[500]` gives 4.31:1 over black map imagery in light,
  dark and geo.ca (canada.ca: 4.55:1). The marginal normal-text failure is
  pre-existing; baseline/ticks exceed 3:1. Only the sweep-induced substitution
  with `text.secondary` was fixed, preserving the original appearance.

`bgColor` already uses the inverse flag in this theme; `textColor` does not.
That may be the oversight, though it needs checking rather than assuming.

The pale dark-theme primary (`#8ec4fa`) also demonstrates that applying
`darken()` is not a reliable way to derive a contrasting foreground: the
darkened value can converge toward the dark surface behind it. Resolve derived
colors against their actual background roles rather than assuming a darkened
primary will retain contrast.

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

Concrete example from the tabs/AppBar state-collision fix: in the dark theme,
`rgba(142, 196, 250, 0.08)` over the `#3c3e42` footer/dynamic AppBar surface
composites to approximately `#434951` (1.17:1 against resting). The static
AppBar's `#18181a` backing becomes approximately `#21262c` (1.16:1).
Browser inspection confirms the tint is subtle, although white hover
labels/icons remain legible (9.13:1 and 15.26:1 respectively) and clearly
different from the selected `#8ec4fa` fill with black text/icons.
Selected-hover now darkens that fill to `#719cc8`, retaining black text/icons
at 7.29:1; browser inspection confirms a visible change from selection.
No per-control opacity or colour workaround was applied.

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