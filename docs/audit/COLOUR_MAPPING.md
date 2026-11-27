# Proposed UI colour mapping

## Basis and limits

This proposal follows D4/D5 in [COLOUR_DECISIONS.md](./COLOUR_DECISIONS.md): map UI meanings to MUI palette roles and four-slot colour objects; retain indexed ramps for map rendering. Map rendering, OpenLayers, user drawing colours, test helpers, demos, and vendor CSS are not palette-mapping targets. Mixed or uncertain consumers are flagged rather than assigned a role by appearance alone.

Role semantics are checked against the MUI MCP's [Material UI palette documentation](https://llms.mui.com/material-ui/9.5.0/customization/palette.md). It describes `main`, `light`, `dark`, and `contrastText`, and identifies `primary`/`secondary` as interface roles and `error`/`warning`/`info`/`success` as status roles. The project resolves MUI 9.4.0; the MCP does not provide 9.4 documentation, so this proposal relies on the 9.5.0 docs only for these palette semantics and does not suggest adopting a newer API.

Counts below are the occurrence counts and property groupings in [COLOUR_PLAN.md](./COLOUR_PLAN.md), not new code measurements. In that inventory, `[...]` means the several indexed ramp values were grouped together. The source plan reports 54 literal clusters and 117 theme-token/property clusters, but does not enumerate every cluster: section A itemizes 16 rows and summarizes the remainder; section E itemizes 16 rows and describes additional clusters only in aggregate. Those unitemized rows are left unresolved below rather than assigned invented per-token counts. The proposal covers every cluster that the plan describes individually and the aggregate families it names.

## Proposed mappings by MUI role

### `palette.text.primary`

| Current cluster: value/token; CSS property; count | Proposal and rationale | Confidence | Outlier / colour shift |
|---|---|---|---|
| `geoViewColor.textColor.main`; `color`; 29 | Use `text.primary` for the default foreground. The token name and broad use as component text fit MUI's primary text role. | High | No inherent shift if the existing `textColor` main value is retained as `text.primary`; using a MUI default instead could change the GeoView text colour. |
| `palette.text.primary`; `color`; 12 | Keep as `text.primary`; it already names the semantic role. | High | None from role mapping alone. |
| Literal `#393939`; `color`; 1 (custom-legend) | Use `text.primary`; the plan says this literal matches the default text root. | High | No shift if the current `#393939` is retained in the role. |
| `geoViewColor.textColor.light[...]`; `color`; 18; `geoViewColor.bgColor.light[...]`; `color`; 5; `geoViewColor.bgColor.darken(...)`; `color`; 1 | Split these from surface/background ramps and use `text.primary` only where the instance is ordinary foreground text. Their colour source alone does not establish whether the text is primary, muted, or contrast text. | Low | The inventory includes tooltip, scale, notifications, map-info, and details consumers. Do not bulk-replace; the exact instance intent is unresolved. Choosing the wrong text role may visibly reduce contrast. |

### `palette.text.secondary` and `palette.text.disabled`

| Current cluster: value/token; CSS property; count | Proposal and rationale | Confidence | Outlier / colour shift |
|---|---|---|---|
| `geoViewColor.grey`; `color`; 6 of 18 total `grey` uses | Use `text.secondary` for genuinely muted, non-disabled copy; use `text.disabled` only for disabled text. D4 explicitly assigns those meanings to these MUI roles. | Low | The audit does not classify each of the six text instances as muted versus disabled. The root shade is not proof of either meaning. |
| MUI `palette.grey[...]`; `color`; 8 of 9 uses | Replace with `text.secondary` where the use is muted text, or `text.disabled` where disabled. | Low | The inventory lists layer-list, data-skeleton, layer-details, opacity-control, and legend but does not assign a semantic state to each occurrence. |
| `geoViewColor.bgColor.dark[...]`; `color`; 13; `geoViewColors.bgColor.dark[...]`; `color`; 5; `geoViewColor.bgColor.light[...]`; `color`; 5; `geoViewColors.bgColor.light[...]`; `color`; 1; `geoViewColor.bgColor.darken(...)`; `color`; 1; `geoViewColor.bgColor.dark[...]`; `color`; 1 | These are text uses of background ramps (28 total), not background uses. Use `text.secondary` or `text.disabled` only when the instance is truly muted or disabled; otherwise use `text.primary` or an appropriate contrast text role. | Low | Counts follow the seven section-C groups (28 uses). The plan identifies disabled/ARIA-disabled button overrides among them, but does not identify every instance. Forcing all 28 into one text role is not supported by the evidence. |
| `white` / `black`; `color`; literal section-A clusters include `white` 17, `#000` 1, and `black` 1 | Use `text.primary` for ordinary text; use `common.white` only when white text is required on a contrasting surface. | Low | White is concentrated in navigation and footer bars, but also appears elsewhere. Do not infer contrast text from the literal alone. A role change that removes reversed white text could be conspicuous. |

### `palette.background.default` and `palette.background.paper`

| Current cluster: value/token; CSS property; count | Proposal and rationale | Confidence | Outlier / colour shift |
|---|---|---|---|
| `geoViewColor.bgColor.light[...]`; `background-color`; 15 | Map page-level surfaces to `background.default`; map contained panels/cards to `background.paper`. These are the standard surface roles, rather than an indexed shade choice. | Low | The cluster mixes nav-bar, attribution, layer-list, and responsive-grid styles; the inventory does not say which is page versus contained surface. `background.paper` is already used 3 times. |
| `geoViewColor.bgColor.main`; `background`; 5 | Use `background.default` for page/canvas surface or `background.paper` for contained surfaces; decide by component structure, not shade. | Low | Exact paper/default split is not given. |
| `geoViewColor.bgColor.dark[...]`; `background-color`; 12 | Map only actual neutral panel surfaces to `background.paper`/`default`. Dark ramp uses that are hover, selected, status, or overlay states belong to other roles or remain unresolved. | Low | Concentrated in panel, layer-list, data-table, details, and legend; the plan does not separate surfaces from state backgrounds. Shifting dark surfaces to a light paper role could be noticeable. |
| `geoViewColor.white`; `background-color`; 7; literal `white`; `background-color`; 10 and `background`; 4; `grey`; `background-color`; 5 and `background`; 1 | Use `background.paper` for confirmed contained-panel surfaces and `background.default` for confirmed page surfaces; do not treat white or grey as a semantic role by itself. | Low | The literal white `background-color` cluster includes `map-style`; exclude that consumer rather than mapping the mixed cluster wholesale. The other white/grey rows include layer icons, layout, responsive grid, notifications, AOI, app bar, crosshair, add-layer, and scale; decide surface versus state per consumer. Mapping white to the current light-theme paper colour can be visible. |
| `palette.background.paper`; `background-color`; 3; `palette.background.default`; `background-color`; 1 | Keep as the existing standard roles. | High | None from role mapping alone. |

### `palette.divider`

| Current cluster: value/token; CSS property; count | Proposal and rationale | Confidence | Outlier / colour shift |
|---|---|---|---|
| `palette.divider`; `border-bottom`; 10; `border`; 6; other border sides; recurring | Keep as `divider` for non-interactive separators and neutral boundaries. | High | Selected/active borders are not dividers; retain those as state/primary styling. |
| `geoViewColor.bgColor.dark[...]`; `border-bottom`; 13 | Use `divider` when the border is a neutral separator. This is the exact D4 expected mapping for separators. | High | Any border marking selected/active state is an outlier and should use the corresponding state role instead. |
| `grey`; `border-bottom`; 2; `border-color`; 2; `border-top`; 1; `geoViewColor.grey`; `border-bottom`; 2; `border-color`; 2; `border-top`; 1 | Map neutral separators to `divider`. | High | The audit also counts `geoViewColor.grey` in other roles; only these border uses map here. A grey divider replaced by the current fixed `rgba(0,0,0,.12)` may be visibly different in some themes. |
| `palette.primary.contrastText`; `backgroundColor`; 2 (vertical/horizontal divider styles) | Change the semantic role to `divider`, not `primary.contrastText`. A divider is a separator, while `contrastText` is text intended to contrast with a palette colour's `main`. | High | This is likely a noticeable change: a strong primary contrast colour used as a divider can become the much subtler divider colour. Verify both orientations in all themes. |
| `geoViewColor.primary.main`; border; 6 and background; 3 (recurring section-E clusters) | Keep as `primary.main` for brand or selected/active outlines; do not convert those borders to `divider`. | Low | The plan does not distinguish decorative from selected borders in the aggregate. Primary borders used only as neutral separators are an outlier and should move to `divider`. |

### `palette.action.hover`, `palette.action.selected`, and `palette.action.focus`

| Current cluster: value/token; CSS property; count | Proposal and rationale | Confidence | Outlier / colour shift |
|---|---|---|---|
| `palette.action.hover`; `background-color`; 11; `palette.action.selected`; `background-color`; 4 | Keep these existing state roles. | High | No role change proposed. |
| `geoViewColor.primary.opacity(...)`; `hover`, `selected`, and `focus` palette slots; counts not itemized separately | Use the matching MUI `action` state slot for interaction-state overlays rather than treating each opacity-derived shade as a separate colour role. | High | Preserve the existing state semantics and alpha values when mapping; changing opacity or substituting a solid `primary.main` would change the appearance. |
| `geoViewColor.primary.main`; `background-color`; 6; text 15; plus primary fill/border uses | Keep `primary.main` for genuine brand/active/selected content. Split actual hover/selected/focus treatments to the relevant `action` role. | Low | The aggregate crosses text, surfaces, fills, and borders. The plan does not itemize which of the six backgrounds are interaction states. |
| `transparent`; `background-color`; 19; `background`; 3; `outline-color`; 3; `border-left`; 2; `border`; 1 | Keep CSS `transparent` where it means no fill/border/outline. It is not an interaction colour and should not be replaced with a new palette token. | High | Any transparent style that is actually a hover/focus state needs its state expressed separately; the literal itself does not establish that meaning. |

### `palette.primary`

| Current cluster: value/token; CSS property; count | Proposal and rationale | Confidence | Outlier / colour shift |
|---|---|---|---|
| `geoViewColor.primary.main`; `color`; 15; `background-color`; 6; border; 6 and background; 3 (recurring) | Use `palette.primary.main` for brand and primary/active interface content. This role already exists and is preferable to retaining a parallel `geoViewColor.primary` alias for UI. | High for clear brand/active uses; low for aggregate neutral/state uses | Keep action states, status states, and decorative separators split into their own roles. Retain the authored theme value to avoid an unintended brand change; substituting MUI's default blue for GeoView's `#515BA5` (`geo.ca`), `#0066CC` (`light`), `#8EC4FA` (`dark`), or `#26374A` (`canada.ca`) would be noticeable. |
| Literal `#515ba5`; `border`; 1 (custom legend) | Use `primary.main`; the plan confirms it matches the `geo.ca` primary root. | High | Exact value can be preserved in that theme's role. |
| `palette.primary.main`; `color`; 8; other existing primary references (counts not itemized) | Keep as `palette.primary` where the meaning is brand/primary. | High | Do not assume all remaining primary references are appropriate merely because the token name is correct; state-specific uses may be better represented by `action` or status roles. |
| `palette.primary.dark` / `palette.primary.contrastText`; component properties and counts not itemized separately | Retain the MUI four-slot role shape where the use is actually primary foreground/background contrast. | Low | `palette.primary.contrastText` used as a divider background (2) is the explicit mismatch listed above. |

### `palette.secondary`

| Current cluster: value/token; CSS property; count | Proposal and rationale | Confidence | Outlier / colour shift |
|---|---|---|---|
| `geoViewColor.secondary`; darkened background; 2; border; 1 | Use `palette.secondary` only if these instances really represent secondary interface elements; if the border is a separator, use `divider`, and if the backgrounds are interaction states, use `action`. | Low | The plan cannot establish whether the hue is secondary meaning or a convenient shade. The current source generator now reads the GeoView secondary object for `palette.secondary`; it comments that the default theme has no distinct secondary colour. This differs from the older wiring issue described in the plan, so no wiring correction is proposed here. |
| Literal `#1976d2`; `outline`; 1 (card-media) | Do not map to `secondary` solely because the value matches an earlier secondary root. Determine whether the outline indicates keyboard focus or another state first. | Low | Outlier pending inspection; replacing a blue outline with a generic secondary role could noticeably change it. |

### `palette.error`, `palette.warning`, `palette.info`, and `palette.success`

| Current cluster: value/token; CSS property; count | Proposal and rationale | Confidence | Outlier / colour shift |
|---|---|---|---|
| `geoViewColors.error.main`; `color`; 1 in theme component overrides; `error.lighten(...)`; `background`; 1 | Use `error.main` for error text and `error.light` (or a derived value in the role's light slot) for error status background. | High for explicit `.error` state | Preserve the current theme's authored error value. Using MUI's default red instead of the current value may change the status appearance noticeably. |
| `geoViewColors.info.main`; `color`; 2; `info.lighten(...)`; `background`; 1 | Use `info.main` for neutral information/loading status and `info.light` for its background. | High for explicit loading/processing state | The plan reports GeoView `info` and `success` both start at `#2e7d32`; MUI's default `info` is blue. Adopting MUI's default value would be a noticeable semantic and visual change; retain the authored value unless a separate product decision changes it. |
| `geoViewColors.grey.lighten(...)`; `background`; 1 and status text `geoViewColors.info.main`; 1 | The registered state has no clear MUI status role in the evidence. Do not force it to `info`, `success`, or `warning` based only on its grey background. | Low | It is a distinct registered/unqueryable state; intent requires product judgement. |
| `palette.warning.main`/`light`; `background-color`; one each | Keep as the existing `warning` role where the instance is a warning state. | High | The inventory does not name the specific component or state for these two uses; verify before consolidating. |
| `geoViewColors.error` / `warning` / `info` / `success`; generator `.main`, `.light`, `.dark`, `.contrastText` assignments; 53 references total across all default `geoViewColors` generator entries, not split by status role in the plan | Use the matching MUI role and its four slots; the generator already follows the standard role shape. | High | Current authored values, not MUI's default swatches, determine whether any visible shift occurs. Preserve the separate meanings even when two roots currently share a value. |

### `palette.common.white` / `palette.common.black`

| Current cluster: value/token; CSS property; count | Proposal and rationale | Confidence | Outlier / colour shift |
|---|---|---|---|
| `palette.common.white`; text/fill/stroke (property counts not split; all `common` references total 7); `geoViewColor.white`; `color`; 12 and `background-color`; 7; literal `white`; `fill`; 4 and `stroke`; 4 | Use `common.white` only for deliberately fixed white icons or text that must stay white against coloured content. For ordinary text or surfaces, use the relevant `text` or `background` role instead. | Low | The plan lists white in nav/footer bars, layer icons, layout, notifications, responsive grid, scale, slider, and other components. It does not establish that every use needs invariant white. |
| `#000` / `#000000` / `black`; text or fill; one-off clusters, with exact per-property counts not split in the plan | Use `common.black` for a deliberately fixed black graphic/text treatment; use `text.primary` for ordinary UI text. | Low | The plan groups black text/fill across overview-map and export utilities, and `#000000` text/fill in drawer state values. Map/export canvas or rendering consumers may be outside D7 UI scope; exclude unless confirmed as viewer UI. |

## Proposed custom tokens

**None proposed for the itemized UI clusters.** The MUI roles above cover the established meanings; adding names such as `borderColor`, `mutedText`, `panelSurface`, or `hoverColor` would duplicate `divider`, `text.secondary`, `background.paper`, or `action.hover`.

This does not recommend deleting the existing focus-indicator contract or map ramp. D6 leaves the exact focus-ring source open, and D5 explicitly retains the map ramp. Neither is a reason to invent a second palette alias in this mapping. Shadows should be evaluated against MUI's `shadows` theme field, not added as a colour-palette token.

## Clusters not resolved or excluded

| Cluster / known evidence | Why unresolved or excluded |
|---|---|
| Section A's unitemized remainder: 54 literal value/property clusters total, 16 itemized above; the plan groups the remaining one-offs rather than supplying a row for every property/value/count. | The report names examples including `#000000` drawer state text/fill, `#0000ff`/`#ff0000` map-config test helpers, custom-legend literals, canvas/map/time-slider/checkbox/accordion/swiper values, black text/fill, grey background/border/shadow, and one-off RGBA overlays/shadows. The red/blue test helpers and map/drawing/measurement styles are out of scope; the other grouped one-offs lack per-property counts or a reliable intent. Do not infer their role from hue. |
| Section E's unitemized remainder: 117 theme-token/property clusters total, 16 listed individually above, plus the recurring families described below. | The source plan does not list every token/property pair or count. It mentions `geoViewColor.bgColor.main` as background (5), GeoView primary as border (6) and background (3), MUI `background.paper` as background-color (3), `palette.common.white` across text/fill/stroke, and `palette.action.selected` as background-color (4). It says many other clusters occur once or twice without enumerating them. No per-cluster mapping or count is asserted for those omitted rows. |
| `geoViewColor.grey`; 18 uses: text 6, `background-color` 5, `border-bottom` 2, `border-color` 2, `background` 1, `border-top` 1, `box-shadow` 1. | Split the text, surfaces, and borders as proposed above. The shadow is not a divider or surface token; evaluate as an elevation/shadow use. The five backgrounds cannot be split into paper/default or neutral/state without checking each consumer. |
| MUI `palette.grey`; 9 uses, including one `box-shadow`. | The eight text uses need instance-level distinction between ordinary, muted, and disabled text. The shadow use is not a palette-grey semantic role. |
| Swiper `rgba(50,50,50,0.75)`; `background-color`; 2; map-style `rgb(0 0 0 / 65%)`; `box-shadow`; 2; other reported RGBA overlays/shadows. | A semi-transparent surface or overlay is not necessarily `background.paper`; a shadow is not a palette colour role. The plan's names alone do not establish whether these are UI overlays or map-rendering effects. Keep map/style and drawing consumers out of scope; inspect the UI-only cases separately. |
| Literal `#ccc`; `border`; 3 (export modal and drawer button); `#cccccc`, `#dddddd`, `#e0e0e0`, `#f5f5f5`, `#ffffff`, `#fff`; one-off UI style clusters. | Some can be dividers or surfaces, but the plan's summary does not identify their exact component state or per-value property/count. Map only after confirming the consumer. |
| Focus outline/halo and focus-visible states. | D6 remains open. MUI `action.focus` describes a state colour, not by itself the two-layer outline/halo contract. Do not collapse the pair or create a palette alias here; preserve the focus decision for its dedicated review. |

## Review notes

- Treat the confidence labels as role confidence, not visual approval. Low-confidence rows need instance-level intent review before any code change.
- A role alias change does not inherently change a colour if the existing authored values are moved into the corresponding MUI slots. Any use of MUI default swatches instead of the current GeoView theme values can change appearance; the likely most visible cases are primary/secondary brand colours, status colours (notably green `info` versus MUI's blue default), white-on-colour text, and the two primary-contrast divider backgrounds.
- The unitemized residual clusters above are deliberately not guessed. To satisfy a per-occurrence migration checklist, first publish the source scanner's full 54-row and 117-row value/token-property-count output; this proposal must not be treated as that complete checklist.
