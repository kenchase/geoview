# Remaining colour expressions

Current-source inventory at `cd9304c4b`. It contains **258 expressions in 64 files**, scanned from source after Pass 1 and the text-root substitutions.

## Scope and method

The scan covers viewer UI declarations in package `src/` TypeScript/TSX, the theme component overrides in `themeOptionsGenerator.ts`, first-party `geoview-core/src/ui/style/style.css`, and the drawer measurement stylesheet. Each row is one CSS-like declaration expression (including a custom GeoView token when it appears alongside a standard-role fallback). Declarations now using a standard MUI palette role without a remaining custom GeoView colour value are omitted.

D7 boundaries applied: user map symbology and drawing colours, API/config data, JSON test fixtures, demo/sandbox/release HTML, and vendored CodeMirror CSS are excluded. OpenLayers/geo implementation, test-suite code, measurement drawing-style declarations, and map/export canvas styling are also omitted as non-viewer-UI consumers; the explicitly listed first-party drawer stylesheet is included. Theme colour-seed declarations without a CSS property are not CSS expressions in this inventory. The report is a lexical source scan; the role column reflects only proposals stated in [`COLOUR_MAPPING.md`](./COLOUR_MAPPING.md), not a determination of visual intent.

A dash is not used for guessed mappings: “No explicit role” means the mapping has no proposal for that exact value/token/property; “Unresolved” means the mapping identifies the cluster but leaves its instance intent open. Line numbers refer to the source at the commit above.

## `packages/geoview-about-panel/src/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [about-panel-style.ts](../../packages/geoview-about-panel/src/about-panel-style.ts#L50) | 50 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |

## `packages/geoview-aoi-panel/src/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [area-of-interest-style.ts](../../packages/geoview-aoi-panel/src/area-of-interest-style.ts#L28) | 28 | <code>'2px solid rgba(255,255,255,0.25)'</code> | `border` | No explicit role in <code>COLOUR_MAPPING.md</code> |
| [area-of-interest-style.ts](../../packages/geoview-aoi-panel/src/area-of-interest-style.ts#L51) | 51 | <code>theme.palette.geoViewColor?.grey.dark[900]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (instance intent unresolved) |
| [area-of-interest-style.ts](../../packages/geoview-aoi-panel/src/area-of-interest-style.ts#L52) | 52 | <code>theme.palette.geoViewColor?.grey.light[900]</code> | `color` | <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |

## `packages/geoview-core/src/core/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [app-start.tsx](../../packages/geoview-core/src/core/app-start.tsx#L62) | 62 | <code>'1px solid red'</code> | `border` | No explicit role in <code>COLOUR_MAPPING.md</code> |

## `packages/geoview-core/src/core/components/app-bar/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [app-bar-style.ts](../../packages/geoview-core/src/core/components/app-bar/app-bar-style.ts#L17) | 17 | <code>theme.palette.geoViewColor?.bgColor.main</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [app-bar-style.ts](../../packages/geoview-core/src/core/components/app-bar/app-bar-style.ts#L30) | 30 | <code>theme.palette.geoViewColor?.grey.lighten(0.8, 0.8)</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (instance intent unresolved) |
| [app-bar-style.ts](../../packages/geoview-core/src/core/components/app-bar/app-bar-style.ts#L53) | 53 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [app-bar-style.ts](../../packages/geoview-core/src/core/components/app-bar/app-bar-style.ts#L63) | 63 | <code>&#96;1px solid ${theme.palette.geoViewColor?.primary.light[100] ?? theme.palette.divider}&#96;</code> | `borderRight` | <code>palette.primary.dark</code> / <code>palette.primary.light</code> (exact ramp-to-slot mapping not specified) |
| [app-bar-style.ts](../../packages/geoview-core/src/core/components/app-bar/app-bar-style.ts#L71) | 71 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [app-bar-style.ts](../../packages/geoview-core/src/core/components/app-bar/app-bar-style.ts#L85) | 85 | <code>theme.palette.geoViewColor?.bgColor.dark[450]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [app-bar-style.ts](../../packages/geoview-core/src/core/components/app-bar/app-bar-style.ts#L90) | 90 | <code>'transparent'</code> | `outlineColor` | Keep CSS <code>transparent</code> (no palette role) |
| [app-bar-style.ts](../../packages/geoview-core/src/core/components/app-bar/app-bar-style.ts#L108) | 108 | <code>&#96;1px solid ${theme.palette.geoViewColor?.grey.light[100] ?? theme.palette.divider}&#96;</code> | `borderTop` | <code>palette.divider</code> if a neutral separator |

## `packages/geoview-core/src/core/components/app-bar/buttons/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [version-style.ts](../../packages/geoview-core/src/core/components/app-bar/buttons/version-style.ts#L20) | 20 | <code>theme.palette.geoViewColor?.bgColor.light[200]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [version-style.ts](../../packages/geoview-core/src/core/components/app-bar/buttons/version-style.ts#L24) | 24 | <code>theme.palette.mode === 'light' ? theme.palette.secondary.contrastText : theme.palette.geoViewColor?.primary.light[300]</code> | `color` | <code>palette.primary.dark</code> / <code>palette.primary.light</code> (exact ramp-to-slot mapping not specified) |
| [version-style.ts](../../packages/geoview-core/src/core/components/app-bar/buttons/version-style.ts#L35) | 35 | <code>&#96;1px solid ${theme.palette.geoViewColor?.bgColor.dark[100]}&#96;</code> | `borderBottom` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |

## `packages/geoview-core/src/core/components/attribution/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [attribution-style.ts](../../packages/geoview-core/src/core/components/attribution/attribution-style.ts#L22) | 22 | <code>theme.palette.geoViewColor?.bgColor.light[200]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [attribution-style.ts](../../packages/geoview-core/src/core/components/attribution/attribution-style.ts#L32) | 32 | <code>theme.palette.geoViewColor?.textColor.light[250]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |

## `packages/geoview-core/src/core/components/common/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [full-screen-dialog-style.ts](../../packages/geoview-core/src/core/components/common/full-screen-dialog-style.ts#L22) | 22 | <code>&#96;1px solid ${theme.palette.geoViewColor?.bgColor.dark[300] ?? theme.palette.divider}&#96;</code> | `borderBottom` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [layer-icon-style.ts](../../packages/geoview-core/src/core/components/common/layer-icon-style.ts#L44) | 44 | <code>theme.palette.geoViewColor?.bgColor.dark[600]</code> | `borderColor` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [layer-icon-style.ts](../../packages/geoview-core/src/core/components/common/layer-icon-style.ts#L46) | 46 | <code>theme.palette.geoViewColor?.white</code> | `backgroundColor` | <code>palette.background.paper</code> / <code>palette.background.default</code>; use <code>palette.common.white</code> only if invariant white is intentional |
| [layer-icon-style.ts](../../packages/geoview-core/src/core/components/common/layer-icon-style.ts#L60) | 60 | <code>theme.palette.geoViewColor?.white</code> | `backgroundColor` | <code>palette.background.paper</code> / <code>palette.background.default</code>; use <code>palette.common.white</code> only if invariant white is intentional |
| [layer-icon-style.ts](../../packages/geoview-core/src/core/components/common/layer-icon-style.ts#L62) | 62 | <code>theme.palette.geoViewColor?.bgColor.dark[600]</code> | `borderColor` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [layer-icon-style.ts](../../packages/geoview-core/src/core/components/common/layer-icon-style.ts#L68) | 68 | <code>theme.palette.geoViewColor?.white</code> | `backgroundColor` | <code>palette.background.paper</code> / <code>palette.background.default</code>; use <code>palette.common.white</code> only if invariant white is intentional |
| [layer-icon-style.ts](../../packages/geoview-core/src/core/components/common/layer-icon-style.ts#L69) | 69 | <code>theme.palette.geoViewColor?.primary.main</code> | `borderColor` | <code>palette.primary.main</code> for brand/active content; use the matching <code>palette.action.*</code> role for interaction overlays |
| [layer-icon-style.ts](../../packages/geoview-core/src/core/components/common/layer-icon-style.ts#L72) | 72 | <code>theme.palette.geoViewColor?.bgColor.dark[800]</code> | `fill` | Unresolved — indexed <code>bgColor</code> ramp; instance role not determined |
| [layer-icon-style.ts](../../packages/geoview-core/src/core/components/common/layer-icon-style.ts#L82) | 82 | <code>theme.palette.geoViewColor?.white</code> | `backgroundColor` | <code>palette.background.paper</code> / <code>palette.background.default</code>; use <code>palette.common.white</code> only if invariant white is intentional |
| [layer-icon-style.ts](../../packages/geoview-core/src/core/components/common/layer-icon-style.ts#L84) | 84 | <code>theme.palette.geoViewColor?.primary.main</code> | `borderColor` | <code>palette.primary.main</code> for brand/active content; use the matching <code>palette.action.*</code> role for interaction overlays |
| [layer-icon-style.ts](../../packages/geoview-core/src/core/components/common/layer-icon-style.ts#L95) | 95 | <code>theme.palette.geoViewColor?.bgColor.dark[600]</code> | `outlineColor` | Unresolved — indexed <code>bgColor</code> ramp; instance role not determined |
| [layer-list-style.ts](../../packages/geoview-core/src/core/components/common/layer-list-style.ts#L24) | 24 | <code>theme.palette.geoViewColor?.bgColor.light[500]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [layer-list-style.ts](../../packages/geoview-core/src/core/components/common/layer-list-style.ts#L138) | 138 | <code>theme.palette.geoViewColor?.bgColor.dark[300]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [layer-list-style.ts](../../packages/geoview-core/src/core/components/common/layer-list-style.ts#L160) | 160 | <code>theme.palette.geoViewColor?.primary.dark[200]</code> | `color` | <code>palette.primary.dark</code> / <code>palette.primary.light</code> (exact ramp-to-slot mapping not specified) |
| [layer-list-style.ts](../../packages/geoview-core/src/core/components/common/layer-list-style.ts#L161) | 161 | <code>theme.palette.geoViewColor?.primary.lighten(0.9, 0.3)</code> | `backgroundColor` | No explicit role in <code>COLOUR_MAPPING.md</code>; instance review required |
| [responsive-grid-layout-style.ts](../../packages/geoview-core/src/core/components/common/responsive-grid-layout-style.ts#L47) | 47 | <code>theme.palette.geoViewColor?.bgColor.light[300]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [responsive-grid-layout-style.ts](../../packages/geoview-core/src/core/components/common/responsive-grid-layout-style.ts#L60) | 60 | <code>theme.palette.geoViewColor?.white</code> | `color` | <code>palette.common.white</code> only for deliberate reversed text; otherwise <code>palette.text.primary</code> |
| [responsive-grid-layout-style.ts](../../packages/geoview-core/src/core/components/common/responsive-grid-layout-style.ts#L87) | 87 | <code>theme.palette.geoViewColor?.primary.dark[300]</code> | `color` | <code>palette.primary.dark</code> / <code>palette.primary.light</code> (exact ramp-to-slot mapping not specified) |
| [responsive-grid-layout-style.ts](../../packages/geoview-core/src/core/components/common/responsive-grid-layout-style.ts#L97) | 97 | <code>theme.palette.geoViewColor?.white</code> | `backgroundColor` | <code>palette.background.paper</code> / <code>palette.background.default</code>; use <code>palette.common.white</code> only if invariant white is intentional |
| [responsive-grid-layout-style.ts](../../packages/geoview-core/src/core/components/common/responsive-grid-layout-style.ts#L99) | 99 | <code>&#96;2px solid ${theme.palette.geoViewColor?.primary.main}&#96;</code> | `border` | <code>palette.primary.main</code> for brand/active content; use the matching <code>palette.action.*</code> role for interaction overlays |
| [responsive-grid-layout-style.ts](../../packages/geoview-core/src/core/components/common/responsive-grid-layout-style.ts#L116) | 116 | <code>&#96;2px solid ${theme.palette.geoViewColor?.primary.main}&#96;</code> | `border` | <code>palette.primary.main</code> for brand/active content; use the matching <code>palette.action.*</code> role for interaction overlays |

## `packages/geoview-core/src/core/components/crosshair/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [crosshair-style.ts](../../packages/geoview-core/src/core/components/crosshair/crosshair-style.ts#L30) | 30 | <code>theme.palette.geoViewColor?.grey.lighten(0.1, 0.8)</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (instance intent unresolved) |

## `packages/geoview-core/src/core/components/data-table/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [data-panel.tsx](../../packages/geoview-core/src/core/components/data-table/data-panel.tsx#L431) | 431 | <code>theme.palette.geoViewColor?.grey.main</code> | `color` | <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [data-table-style.ts](../../packages/geoview-core/src/core/components/data-table/data-table-style.ts#L24) | 24 | <code>theme.palette.geoViewColor?.bgColor.main</code> | `background` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [data-table-style.ts](../../packages/geoview-core/src/core/components/data-table/data-table-style.ts#L53) | 53 | <code>theme.palette.geoViewColor?.textColor.light[200]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [data-table-style.ts](../../packages/geoview-core/src/core/components/data-table/data-table-style.ts#L68) | 68 | <code>theme.palette.geoViewColor?.grey.dark[900]</code> | `color` | <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [data-table-style.ts](../../packages/geoview-core/src/core/components/data-table/data-table-style.ts#L131) | 131 | <code>&#96;2px solid transparent&#96;</code> | `border` | Keep CSS <code>transparent</code> (no palette role) |
| [data-table-style.ts](../../packages/geoview-core/src/core/components/data-table/data-table-style.ts#L147) | 147 | <code>theme.palette.geoViewColor?.bgColor.dark[100]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [data-table-style.ts](../../packages/geoview-core/src/core/components/data-table/data-table-style.ts#L237) | 237 | <code>theme.palette.geoViewColor?.bgColor.darken(0.01)</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |

## `packages/geoview-core/src/core/components/details/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [details-style.ts](../../packages/geoview-core/src/core/components/details/details-style.ts#L21) | 21 | <code>&#96;0px 12px 9px -13px ${theme.palette.geoViewColor?.bgColor.dark[200]}&#96;</code> | `boxShadow` | No palette role — evaluate against MUI <code>theme.shadows</code> |
| [details-style.ts](../../packages/geoview-core/src/core/components/details/details-style.ts#L53) | 53 | <code>theme.palette.geoViewColor?.bgColor.darken(0.1)</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [details-style.ts](../../packages/geoview-core/src/core/components/details/details-style.ts#L54) | 54 | <code>theme.palette.geoViewColor?.bgColor.darken(0.9)</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [details-style.ts](../../packages/geoview-core/src/core/components/details/details-style.ts#L123) | 123 | <code>'transparent'</code> | `background` | Keep CSS <code>transparent</code> (no palette role) |
| [details-style.ts](../../packages/geoview-core/src/core/components/details/details-style.ts#L126) | 126 | <code>theme.palette.geoViewColor?.bgColor.light[600]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |

## `packages/geoview-core/src/core/components/export/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [export-modal-style.ts](../../packages/geoview-core/src/core/components/export/export-modal-style.ts#L78) | 78 | <code>'1px solid #ccc'</code> | `border` | <code>palette.divider</code> only if this is a neutral separator; instance review required |
| [export-modal-style.ts](../../packages/geoview-core/src/core/components/export/export-modal-style.ts#L90) | 90 | <code>'1px solid #ccc'</code> | `border` | <code>palette.divider</code> only if this is a neutral separator; instance review required |

## `packages/geoview-core/src/core/components/footer-bar/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [footer-bar-style.ts](../../packages/geoview-core/src/core/components/footer-bar/footer-bar-style.ts#L16) | 16 | <code>theme.palette.geoViewColor?.bgColor.main</code> | `background` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [footer-bar-style.ts](../../packages/geoview-core/src/core/components/footer-bar/footer-bar-style.ts#L25) | 25 | <code>theme.palette.geoViewColor?.bgColor.main</code> | `background` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [footer-bar-style.ts](../../packages/geoview-core/src/core/components/footer-bar/footer-bar-style.ts#L35) | 35 | <code>theme.palette.geoViewColor?.white</code> | `color` | <code>palette.common.white</code> only for deliberate reversed text; otherwise <code>palette.text.primary</code> |
| [footer-bar-style.ts](../../packages/geoview-core/src/core/components/footer-bar/footer-bar-style.ts#L40) | 40 | <code>theme.palette.geoViewColor?.white</code> | `color` | <code>palette.common.white</code> only for deliberate reversed text; otherwise <code>palette.text.primary</code> |
| [footer-bar-style.ts](../../packages/geoview-core/src/core/components/footer-bar/footer-bar-style.ts#L43) | 43 | <code>theme.palette.geoViewColor?.white</code> | `color` | <code>palette.common.white</code> only for deliberate reversed text; otherwise <code>palette.text.primary</code> |

## `packages/geoview-core/src/core/components/footer-bar/hooks/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [resize-footer-panel-style.ts](../../packages/geoview-core/src/core/components/footer-bar/hooks/resize-footer-panel-style.ts#L21) | 21 | <code>theme.palette.geoViewColor?.bgColor.light[200]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [resize-footer-panel-style.ts](../../packages/geoview-core/src/core/components/footer-bar/hooks/resize-footer-panel-style.ts#L30) | 30 | <code>&#96;1px solid ${theme.palette.geoViewColor?.bgColor.dark[100]}&#96;</code> | `borderBottom` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |

## `packages/geoview-core/src/core/components/guide/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [guide-style.ts](../../packages/geoview-core/src/core/components/guide/guide-style.ts#L14) | 14 | <code>theme.palette.geoViewColor?.grey.dark[800]</code> | `color` | <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [guide-style.ts](../../packages/geoview-core/src/core/components/guide/guide-style.ts#L22) | 22 | <code>&#96;2px solid ${theme.palette.geoViewColor?.primary.main}&#96;</code> | `borderBottom` | <code>palette.primary.main</code> for brand/active content; use the matching <code>palette.action.*</code> role for interaction overlays |
| [guide-style.ts](../../packages/geoview-core/src/core/components/guide/guide-style.ts#L36) | 36 | <code>&#96;2px solid ${theme.palette.geoViewColor?.secondary.main}&#96;</code> | `borderBottom` | <code>palette.secondary</code> only for secondary UI; otherwise <code>palette.divider</code> or <code>palette.action.*</code> (instance intent unresolved) |
| [guide-style.ts](../../packages/geoview-core/src/core/components/guide/guide-style.ts#L58) | 58 | <code>&#96;1px solid ${theme.palette.geoViewColor?.bgColor.dark[400]}&#96;</code> | `borderBottom` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [guide-style.ts](../../packages/geoview-core/src/core/components/guide/guide-style.ts#L132) | 132 | <code>'white'</code> | `color` | <code>palette.common.white</code> only for deliberate reversed text; otherwise <code>palette.text.primary</code> |
| [guide-style.ts](../../packages/geoview-core/src/core/components/guide/guide-style.ts#L163) | 163 | <code>theme.palette.geoViewColor?.bgColor.light[600]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [guide-style.ts](../../packages/geoview-core/src/core/components/guide/guide-style.ts#L175) | 175 | <code>theme.palette.geoViewColor?.textColor.light[200]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [guide-style.ts](../../packages/geoview-core/src/core/components/guide/guide-style.ts#L180) | 180 | <code>theme.palette.geoViewColor?.textColor.light[200]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |

## `packages/geoview-core/src/core/components/hover-tooltip/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [hover-tooltip-styles.ts](../../packages/geoview-core/src/core/components/hover-tooltip/hover-tooltip-styles.ts#L14) | 14 | <code>theme.palette.geoViewColor?.bgColor.light[900]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [hover-tooltip-styles.ts](../../packages/geoview-core/src/core/components/hover-tooltip/hover-tooltip-styles.ts#L15) | 15 | <code>theme.palette.geoViewColor?.bgColor.dark[900]</code> | `background` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [hover-tooltip-styles.ts](../../packages/geoview-core/src/core/components/hover-tooltip/hover-tooltip-styles.ts#L35) | 35 | <code>theme.palette.geoViewColor?.bgColor.light[900]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |

## `packages/geoview-core/src/core/components/layers/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [layers-toolbar-style.ts](../../packages/geoview-core/src/core/components/layers/layers-toolbar-style.ts#L17) | 17 | <code>theme.palette.geoViewColor?.bgColor.light[300]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |

## `packages/geoview-core/src/core/components/layers/left-panel/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [left-panel-styles.ts](../../packages/geoview-core/src/core/components/layers/left-panel/left-panel-styles.ts#L28) | 28 | <code>&#96;1px solid ${theme.palette.geoViewColor?.grey.darken(1, 0.12)}&#96;</code> | `borderBottom` | <code>palette.divider</code> if a neutral separator |
| [left-panel-styles.ts](../../packages/geoview-core/src/core/components/layers/left-panel/left-panel-styles.ts#L43) | 43 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [left-panel-styles.ts](../../packages/geoview-core/src/core/components/layers/left-panel/left-panel-styles.ts#L46) | 46 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [left-panel-styles.ts](../../packages/geoview-core/src/core/components/layers/left-panel/left-panel-styles.ts#L92) | 92 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |

## `packages/geoview-core/src/core/components/layers/left-panel/add-new-layer/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [add-new-layer-style.ts](../../packages/geoview-core/src/core/components/layers/left-panel/add-new-layer/add-new-layer-style.ts#L32) | 32 | <code>theme.palette.geoViewColor?.grey.opacity(0.95)</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (instance intent unresolved) |
| [add-new-layer-style.ts](../../packages/geoview-core/src/core/components/layers/left-panel/add-new-layer/add-new-layer-style.ts#L45) | 45 | <code>theme.palette.geoViewColor?.textColor.light[200]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |

## `packages/geoview-core/src/core/components/layers/right-panel/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [layer-details-style.ts](../../packages/geoview-core/src/core/components/layers/right-panel/layer-details-style.ts#L49) | 49 | <code>theme.palette.geoViewColor?.textColor.light[200]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [layer-details-style.ts](../../packages/geoview-core/src/core/components/layers/right-panel/layer-details-style.ts#L88) | 88 | <code>theme.palette.geoViewColor?.bgColor.dark[300]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [layer-details-style.ts](../../packages/geoview-core/src/core/components/layers/right-panel/layer-details-style.ts#L195) | 195 | <code>theme.palette.geoViewColor?.textColor.light[200]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |

## `packages/geoview-core/src/core/components/layers/right-panel/layer-opacity-control/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [layer-opacity-control-styles.ts](../../packages/geoview-core/src/core/components/layers/right-panel/layer-opacity-control/layer-opacity-control-styles.ts#L18) | 18 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [layer-opacity-control-styles.ts](../../packages/geoview-core/src/core/components/layers/right-panel/layer-opacity-control/layer-opacity-control-styles.ts#L23) | 23 | <code>theme.palette.geoViewColor?.primary.light[600]</code> | `backgroundColor` | <code>palette.primary.dark</code> / <code>palette.primary.light</code> (exact ramp-to-slot mapping not specified) |

## `packages/geoview-core/src/core/components/layers/right-panel/layer-settings/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [layer-settings-style.ts](../../packages/geoview-core/src/core/components/layers/right-panel/layer-settings/layer-settings-style.ts#L103) | 103 | <code>'transparent'</code> | `background` | Keep CSS <code>transparent</code> (no palette role) |

## `packages/geoview-core/src/core/components/legend/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [legend-styles.ts](../../packages/geoview-core/src/core/components/legend/legend-styles.ts#L20) | 20 | <code>theme.palette.geoViewColor?.bgColor.main</code> | `background` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [legend-styles.ts](../../packages/geoview-core/src/core/components/legend/legend-styles.ts#L93) | 93 | <code>&#96;1px solid ${theme.palette.geoViewColor?.bgColor.dark[100]}&#96;</code> | `borderBottom` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [legend-styles.ts](../../packages/geoview-core/src/core/components/legend/legend-styles.ts#L104) | 104 | <code>theme.palette.geoViewColor?.textColor.light[400]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [legend-styles.ts](../../packages/geoview-core/src/core/components/legend/legend-styles.ts#L109) | 109 | <code>theme.palette.geoViewColor?.textColor.light[400]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [legend-styles.ts](../../packages/geoview-core/src/core/components/legend/legend-styles.ts#L129) | 129 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [legend-styles.ts](../../packages/geoview-core/src/core/components/legend/legend-styles.ts#L133) | 133 | <code>theme.palette.geoViewColor?.textColor.light[600]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [legend-styles.ts](../../packages/geoview-core/src/core/components/legend/legend-styles.ts#L134) | 134 | <code>&#96;5px solid ${theme.palette.geoViewColor?.bgColor.dark[200]}&#96;</code> | `borderLeft` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [legend-styles.ts](../../packages/geoview-core/src/core/components/legend/legend-styles.ts#L137) | 137 | <code>&#96;5px solid ${theme.palette.geoViewColor?.bgColor.dark[200]} !important&#96;</code> | `borderLeft` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [legend-styles.ts](../../packages/geoview-core/src/core/components/legend/legend-styles.ts#L140) | 140 | <code>&#96;5px solid ${theme.palette.geoViewColor?.bgColor.dark[600]}&#96;</code> | `borderLeft` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [legend-styles.ts](../../packages/geoview-core/src/core/components/legend/legend-styles.ts#L143) | 143 | <code>&#96;5px solid ${theme.palette.geoViewColor?.bgColor.dark[600]} !important&#96;</code> | `borderLeft` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [legend-styles.ts](../../packages/geoview-core/src/core/components/legend/legend-styles.ts#L146) | 146 | <code>'5px solid transparent'</code> | `borderLeft` | Keep CSS <code>transparent</code> (no palette role) |
| [legend-styles.ts](../../packages/geoview-core/src/core/components/legend/legend-styles.ts#L165) | 165 | <code>&#96;1px solid ${theme.palette.geoViewColor?.bgColor.dark[100]}&#96;</code> | `borderBottom` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [legend-styles.ts](../../packages/geoview-core/src/core/components/legend/legend-styles.ts#L185) | 185 | <code>theme.palette.geoViewColor?.bgColor.dark[300]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [legend-styles.ts](../../packages/geoview-core/src/core/components/legend/legend-styles.ts#L189) | 189 | <code>'transparent'</code> | `background` | Keep CSS <code>transparent</code> (no palette role) |
| [legend-styles.ts](../../packages/geoview-core/src/core/components/legend/legend-styles.ts#L201) | 201 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [legend-styles.ts](../../packages/geoview-core/src/core/components/legend/legend-styles.ts#L203) | 203 | <code>'2px solid currentColor'</code> | `border` | No explicit role in <code>COLOUR_MAPPING.md</code> |

## `packages/geoview-core/src/core/components/lightbox/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [lightbox.tsx](../../packages/geoview-core/src/core/components/lightbox/lightbox.tsx#L218) | 218 | <code>'rgba(0, 0, 0, .9)'</code> | `backgroundColor` | No explicit role in <code>COLOUR_MAPPING.md</code> |

## `packages/geoview-core/src/core/components/map-info/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [map-info-expand-button-style.ts](../../packages/geoview-core/src/core/components/map-info/map-info-expand-button-style.ts#L18) | 18 | <code>theme.palette.geoViewColor?.bgColor.dark[650]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [map-info-rotation-button-style.ts](../../packages/geoview-core/src/core/components/map-info/map-info-rotation-button-style.ts#L23) | 23 | <code>theme.palette.geoViewColor?.bgColor.light[800]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [map-info-style.ts](../../packages/geoview-core/src/core/components/map-info/map-info-style.ts#L32) | 32 | <code>&#96;1px solid ${theme.palette.geoViewColor?.bgColor.dark[650] ?? theme.palette.divider}&#96;</code> | `borderBottom` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [map-info-style.ts](../../packages/geoview-core/src/core/components/map-info/map-info-style.ts#L33) | 33 | <code>theme.palette.geoViewColor?.bgColor.dark[650] ?? theme.palette.text.primary</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [map-info-style.ts](../../packages/geoview-core/src/core/components/map-info/map-info-style.ts#L34) | 34 | <code>theme.palette.geoViewColor?.bgColor.dark[50] ?? theme.palette.background.paper</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [map-info-style.ts](../../packages/geoview-core/src/core/components/map-info/map-info-style.ts#L37) | 37 | <code>&#96;0 0 5px ${theme.palette.geoViewColor?.bgColor.dark[200] ?? theme.palette.grey[300]}&#96;</code> | `boxShadow` | No palette role — evaluate against MUI <code>theme.shadows</code> |
| [map-info-style.ts](../../packages/geoview-core/src/core/components/map-info/map-info-style.ts#L42) | 42 | <code>theme.palette.geoViewColor?.grey.lighten(0.8, 0.8)</code> | `background` | <code>palette.background.default</code> / <code>palette.background.paper</code> (instance intent unresolved) |

## `packages/geoview-core/src/core/components/mouse-position/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [mouse-position-style.ts](../../packages/geoview-core/src/core/components/mouse-position/mouse-position-style.ts#L18) | 18 | <code>'transparent !important'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [mouse-position-style.ts](../../packages/geoview-core/src/core/components/mouse-position/mouse-position-style.ts#L20) | 20 | <code>theme.palette.geoViewColor?.bgColor.dark[650]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [mouse-position-style.ts](../../packages/geoview-core/src/core/components/mouse-position/mouse-position-style.ts#L25) | 25 | <code>'transparent !important'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [mouse-position-style.ts](../../packages/geoview-core/src/core/components/mouse-position/mouse-position-style.ts#L26) | 26 | <code>theme.palette.geoViewColor?.bgColor.dark[750]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [mouse-position-style.ts](../../packages/geoview-core/src/core/components/mouse-position/mouse-position-style.ts#L34) | 34 | <code>theme.palette.geoViewColor?.bgColor.dark[650]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [mouse-position-style.ts](../../packages/geoview-core/src/core/components/mouse-position/mouse-position-style.ts#L86) | 86 | <code>theme.palette.geoViewColor?.bgColor.dark[650]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |

## `packages/geoview-core/src/core/components/nav-bar/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L41) | 41 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L77) | 77 | <code>theme.palette.geoViewColor?.bgColor.light[500]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L80) | 80 | <code>theme.palette.geoViewColor?.bgColor.light[900]</code> | `borderColor` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L95) | 95 | <code>theme.palette.geoViewColor?.bgColor.light[500]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L96) | 96 | <code>theme.palette.geoViewColor?.bgColor.dark[900]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L107) | 107 | <code>&#96;1px solid ${theme.palette.geoViewColor?.bgColor.light[900]}&#96;</code> | `borderBottom` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L114) | 114 | <code>theme.palette.geoViewColor?.bgColor.light[500]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L115) | 115 | <code>theme.palette.geoViewColor?.bgColor.dark[700]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L118) | 118 | <code>theme.palette.geoViewColor?.bgColor.light[500]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L119) | 119 | <code>theme.palette.geoViewColor?.bgColor.dark[700]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L122) | 122 | <code>theme.palette.geoViewColor?.bgColor.light[500]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L123) | 123 | <code>theme.palette.geoViewColor?.bgColor.dark[950]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L127) | 127 | <code>theme.palette.geoViewColor?.white ?? theme.palette.common.white</code> | `color` | <code>palette.common.white</code> only for deliberate reversed text; otherwise <code>palette.text.primary</code> |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L130) | 130 | <code>&#96;${theme.palette.geoViewColor?.white ?? theme.palette.common.white}&#96;</code> | `fill` | <code>palette.common.white</code> only for deliberately fixed white graphics |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L131) | 131 | <code>&#96;${theme.palette.geoViewColor?.white ?? theme.palette.common.white}&#96;</code> | `stroke` | <code>palette.common.white</code> only for deliberately fixed white graphics |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L136) | 136 | <code>'transparent'</code> | `outlineColor` | Keep CSS <code>transparent</code> (no palette role) |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L159) | 159 | <code>&#96;1px solid ${theme.palette.geoViewColor?.bgColor.dark[100] ?? theme.palette.divider}&#96;</code> | `borderBottom` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L181) | 181 | <code>&#96;1px solid ${theme.palette.geoViewColor?.bgColor.dark[100] ?? theme.palette.divider}&#96;</code> | `borderBottom` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L203) | 203 | <code>theme.palette.geoViewColor?.white ?? theme.palette.common.white</code> | `color` | <code>palette.common.white</code> only for deliberate reversed text; otherwise <code>palette.text.primary</code> |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L206) | 206 | <code>theme.palette.geoViewColor?.white ?? theme.palette.common.white</code> | `color` | <code>palette.common.white</code> only for deliberate reversed text; otherwise <code>palette.text.primary</code> |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L207) | 207 | <code>theme.palette.geoViewColor?.white ?? theme.palette.common.white</code> | `fill` | <code>palette.common.white</code> only for deliberately fixed white graphics |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L208) | 208 | <code>theme.palette.geoViewColor?.white ?? theme.palette.common.white</code> | `stroke` | <code>palette.common.white</code> only for deliberately fixed white graphics |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L211) | 211 | <code>theme.palette.geoViewColor?.primary.dark[200] ?? theme.palette.primary.dark</code> | `backgroundColor` | <code>palette.primary.dark</code> / <code>palette.primary.light</code> (exact ramp-to-slot mapping not specified) |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L263) | 263 | <code>theme.palette.geoViewColor?.white ?? theme.palette.primary.contrastText</code> | `color` | <code>palette.common.white</code> only for deliberate reversed text; otherwise <code>palette.text.primary</code> |
| [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts#L265) | 265 | <code>theme.palette.geoViewColor?.primary.dark[200] ?? theme.palette.primary.dark</code> | `backgroundColor` | <code>palette.primary.dark</code> / <code>palette.primary.light</code> (exact ramp-to-slot mapping not specified) |

## `packages/geoview-core/src/core/components/notifications/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [notifications-style.ts](../../packages/geoview-core/src/core/components/notifications/notifications-style.ts#L30) | 30 | <code>theme.palette.geoViewColor?.bgColor.light[200]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [notifications-style.ts](../../packages/geoview-core/src/core/components/notifications/notifications-style.ts#L40) | 40 | <code>&#96;1px solid ${theme.palette.geoViewColor?.bgColor.dark[100]}&#96;</code> | `borderBottom` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [notifications-style.ts](../../packages/geoview-core/src/core/components/notifications/notifications-style.ts#L54) | 54 | <code>&#96;1px solid ${theme.palette.geoViewColor?.bgColor.dark[100]}&#96;</code> | `borderTop` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [notifications-style.ts](../../packages/geoview-core/src/core/components/notifications/notifications-style.ts#L60) | 60 | <code>theme.palette.geoViewColor?.white</code> | `backgroundColor` | <code>palette.background.paper</code> / <code>palette.background.default</code>; use <code>palette.common.white</code> only if invariant white is intentional |
| [notifications-style.ts](../../packages/geoview-core/src/core/components/notifications/notifications-style.ts#L94) | 94 | <code>&#96;1px solid ${theme.palette.geoViewColor?.bgColor.dark[300]}&#96;</code> | `borderBottom` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [notifications-style.ts](../../packages/geoview-core/src/core/components/notifications/notifications-style.ts#L103) | 103 | <code>theme.palette.geoViewColor?.textColor.light[250]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [notifications-style.ts](../../packages/geoview-core/src/core/components/notifications/notifications-style.ts#L115) | 115 | <code>theme.palette.geoViewColor?.bgColor.dark[800]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [notifications-style.ts](../../packages/geoview-core/src/core/components/notifications/notifications-style.ts#L116) | 116 | <code>theme.palette.geoViewColor?.bgColor.light[800]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |

## `packages/geoview-core/src/core/components/overview-map/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [overview-map-toggle-styles.ts](../../packages/geoview-core/src/core/components/overview-map/overview-map-toggle-styles.ts#L24) | 24 | <code>'black'</code> | `color` | <code>palette.text.primary</code> for ordinary text; <code>palette.common.black</code> only if invariant black is intentional |

## `packages/geoview-core/src/core/components/scale/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [scale-style.ts](../../packages/geoview-core/src/core/components/scale/scale-style.ts#L44) | 44 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [scale-style.ts](../../packages/geoview-core/src/core/components/scale/scale-style.ts#L47) | 47 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [scale-style.ts](../../packages/geoview-core/src/core/components/scale/scale-style.ts#L48) | 48 | <code>theme.palette.geoViewColor?.white</code> | `color` | <code>palette.common.white</code> only for deliberate reversed text; otherwise <code>palette.text.primary</code> |
| [scale-style.ts](../../packages/geoview-core/src/core/components/scale/scale-style.ts#L81) | 81 | <code>theme.palette.geoViewColor?.bgColor.dark[650]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [scale-style.ts](../../packages/geoview-core/src/core/components/scale/scale-style.ts#L83) | 83 | <code>&#96;2px solid ${theme.palette.geoViewColor?.bgColor.dark[650]}&#96;</code> | `borderBottom` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [scale-style.ts](../../packages/geoview-core/src/core/components/scale/scale-style.ts#L93) | 93 | <code>theme.palette.geoViewColor?.grey.dark[500]</code> | `color` | <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [scale-style.ts](../../packages/geoview-core/src/core/components/scale/scale-style.ts#L96) | 96 | <code>&#96;${theme.palette.geoViewColor?.grey.dark[500]} !important&#96;</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (instance intent unresolved) |
| [scale-style.ts](../../packages/geoview-core/src/core/components/scale/scale-style.ts#L107) | 107 | <code>theme.palette.geoViewColor?.bgColor.dark[650]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [scale-style.ts](../../packages/geoview-core/src/core/components/scale/scale-style.ts#L120) | 120 | <code>theme.palette.geoViewColor?.bgColor.light[800]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [scale.tsx](../../packages/geoview-core/src/core/components/scale/scale.tsx#L248) | 248 | <code>theme.palette.geoViewColor?.bgColor?.dark?.[650]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |

## `packages/geoview-core/src/core/containers/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [containers-style.ts](../../packages/geoview-core/src/core/containers/containers-style.ts#L49) | 49 | <code>theme.palette.geoViewColor?.grey.dark[100]</code> | `borderColor` | <code>palette.divider</code> if a neutral separator |
| [containers-style.ts](../../packages/geoview-core/src/core/containers/containers-style.ts#L51) | 51 | <code>theme.palette.geoViewColor?.white</code> | `background` | <code>palette.background.paper</code> / <code>palette.background.default</code>; use <code>palette.common.white</code> only if invariant white is intentional |
| [containers-style.ts](../../packages/geoview-core/src/core/containers/containers-style.ts#L61) | 61 | <code>theme.palette.geoViewColor?.primary.dark[300]</code> | `color` | <code>palette.primary.dark</code> / <code>palette.primary.light</code> (exact ramp-to-slot mapping not specified) |
| [containers-style.ts](../../packages/geoview-core/src/core/containers/containers-style.ts#L70) | 70 | <code>theme.palette.geoViewColor?.secondary.darken(0.5, 0.5)</code> | `background` | <code>palette.secondary</code> only for secondary UI; otherwise <code>palette.divider</code> or <code>palette.action.*</code> (instance intent unresolved) |
| [containers-style.ts](../../packages/geoview-core/src/core/containers/containers-style.ts#L74) | 74 | <code>theme.palette.geoViewColor?.secondary.darken(0.5)</code> | `background` | <code>palette.secondary</code> only for secondary UI; otherwise <code>palette.divider</code> or <code>palette.action.*</code> (instance intent unresolved) |
| [containers-style.ts](../../packages/geoview-core/src/core/containers/containers-style.ts#L79) | 79 | <code>&#96;1px solid ${theme.palette.geoViewColor?.bgColor.darken(0.5, 0.5)}&#96;</code> | `border` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [containers-style.ts](../../packages/geoview-core/src/core/containers/containers-style.ts#L80) | 80 | <code>&#96;0px 12px 9px -13px ${theme.palette.geoViewColor?.bgColor.darken(0.2, 0.5)}&#96;</code> | `boxShadow` | No palette role — evaluate against MUI <code>theme.shadows</code> |
| [containers-style.ts](../../packages/geoview-core/src/core/containers/containers-style.ts#L83) | 83 | <code>&#96;1px solid ${theme.palette.geoViewColor?.primary.darken(0.1, 0.9)}&#96;</code> | `border` | No explicit role in <code>COLOUR_MAPPING.md</code> |
| [containers-style.ts](../../packages/geoview-core/src/core/containers/containers-style.ts#L84) | 84 | <code>&#96;0px 12px 9px -13px ${theme.palette.geoViewColor?.bgColor.dark[200]}&#96;</code> | `boxShadow` | No palette role — evaluate against MUI <code>theme.shadows</code> |
| [containers-style.ts](../../packages/geoview-core/src/core/containers/containers-style.ts#L128) | 128 | <code>theme.palette.geoViewColor?.white</code> | `backgroundColor` | <code>palette.background.paper</code> / <code>palette.background.default</code>; use <code>palette.common.white</code> only if invariant white is intentional |

## `packages/geoview-core/src/ui/accordion/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [accordion.tsx](../../packages/geoview-core/src/ui/accordion/accordion.tsx#L118) | 118 | <code>'#f5f5f5'</code> | `backgroundColor` | <code>palette.background.paper</code> / <code>palette.background.default</code> (mapping leaves exact surface unresolved) |

## `packages/geoview-core/src/ui/button-drop-down/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [button-drop-down-style.ts](../../packages/geoview-core/src/ui/button-drop-down/button-drop-down-style.ts#L14) | 14 | <code>theme.palette.geoViewColor?.primary.dark</code> | `color` | No explicit role in <code>COLOUR_MAPPING.md</code>; instance review required |
| [button-drop-down-style.ts](../../packages/geoview-core/src/ui/button-drop-down/button-drop-down-style.ts#L15) | 15 | <code>theme.palette.geoViewColor?.bgColor.dark[50]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |

## `packages/geoview-core/src/ui/card-media/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [card-media.tsx](../../packages/geoview-core/src/ui/card-media/card-media.tsx#L21) | 21 | <code>'2px solid #1976d2'</code> | `outline` | Unresolved — outline intent unclear; mapping does not assign a role |

## `packages/geoview-core/src/ui/circular-progress/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [circular-progress-style.ts](../../packages/geoview-core/src/ui/circular-progress/circular-progress-style.ts#L21) | 21 | <code>theme.palette.geoViewColor?.bgColor.dark[900]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |

## `packages/geoview-core/src/ui/divider/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [divider-style.ts](../../packages/geoview-core/src/ui/divider/divider-style.ts#L23) | 23 | <code>theme.palette.geoViewColor?.primary.main</code> | `backgroundColor` | <code>palette.primary.main</code> for brand/active content; use the matching <code>palette.action.*</code> role for interaction overlays |

## `packages/geoview-core/src/ui/list/checkbox-list/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [checkbox-list-style.ts](../../packages/geoview-core/src/ui/list/checkbox-list/checkbox-list-style.ts#L26) | 26 | <code>'#dddddd'</code> | `backgroundColor` | <code>palette.background.paper</code> / <code>palette.background.default</code> (mapping leaves exact surface unresolved) |
| [checkbox-list-style.ts](../../packages/geoview-core/src/ui/list/checkbox-list/checkbox-list-style.ts#L27) | 27 | <code>theme.palette.geoViewColor?.primary.dark</code> | `color` | No explicit role in <code>COLOUR_MAPPING.md</code>; instance review required |

## `packages/geoview-core/src/ui/modal/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [modal-style.ts](../../packages/geoview-core/src/ui/modal/modal-style.ts#L17) | 17 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [modal-style.ts](../../packages/geoview-core/src/ui/modal/modal-style.ts#L45) | 45 | <code>&#96;1px solid ${theme.palette.geoViewColor?.bgColor.dark[300]}&#96;</code> | `borderBottom` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |

## `packages/geoview-core/src/ui/panel/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [panel-style.ts](../../packages/geoview-core/src/ui/panel/panel-style.ts#L31) | 31 | <code>theme.palette.geoViewColor?.bgColor.main</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [panel-style.ts](../../packages/geoview-core/src/ui/panel/panel-style.ts#L40) | 40 | <code>theme.palette.geoViewColor?.bgColor.dark[50]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [panel-style.ts](../../packages/geoview-core/src/ui/panel/panel-style.ts#L41) | 41 | <code>theme.palette.geoViewColor?.bgColor.dark[100]</code> | `borderBottomColor` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [panel-style.ts](../../packages/geoview-core/src/ui/panel/panel-style.ts#L67) | 67 | <code>&#96;1px solid ${theme.palette.geoViewColor?.primary.main}&#96;</code> | `border` | <code>palette.primary.main</code> for brand/active content; use the matching <code>palette.action.*</code> role for interaction overlays |
| [panel-style.ts](../../packages/geoview-core/src/ui/panel/panel-style.ts#L76) | 76 | <code>theme.palette.geoViewColor?.bgColor.dark[100]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |

## `packages/geoview-core/src/ui/select/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [select-style.ts](../../packages/geoview-core/src/ui/select/select-style.ts#L29) | 29 | <code>theme.palette.geoViewColor?.primary.light</code> | `background` | No explicit role in <code>COLOUR_MAPPING.md</code>; instance review required |

## `packages/geoview-core/src/ui/slider/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [slider-style.ts](../../packages/geoview-core/src/ui/slider/slider-style.ts#L19) | 19 | <code>theme.palette.geoViewColor?.white</code> | `color` | <code>palette.common.white</code> only for deliberate reversed text; otherwise <code>palette.text.primary</code> |
| [slider-style.ts](../../packages/geoview-core/src/ui/slider/slider-style.ts#L27) | 27 | <code>'0 2px 12px 0 rgba(0,0,0,0.4)'</code> | `boxShadow` | No palette role — evaluate as an elevation/shadow, not a colour role |
| [slider-style.ts](../../packages/geoview-core/src/ui/slider/slider-style.ts#L30) | 30 | <code>&#96;0px 0px 0px 8px ${'rgb(255 255 255 / 16%)'}&#96;</code> | `boxShadow` | No palette role — evaluate as an elevation/shadow, not a colour role |
| [slider-style.ts](../../packages/geoview-core/src/ui/slider/slider-style.ts#L47) | 47 | <code>'rgba(1, 0, 155, 0.7) 0px 0px 0px 3px !important'</code> | `boxShadow` | No palette role — evaluate as an elevation/shadow, not a colour role |
| [slider-style.ts](../../packages/geoview-core/src/ui/slider/slider-style.ts#L70) | 70 | <code>theme.palette.geoViewColor?.grey.darken(0.9, 0.87)</code> | `color` | <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [slider-style.ts](../../packages/geoview-core/src/ui/slider/slider-style.ts#L78) | 78 | <code>'#000'</code> | `color` | <code>palette.text.primary</code> for ordinary text; <code>palette.common.black</code> only if invariant black is intentional |
| [slider-style.ts](../../packages/geoview-core/src/ui/slider/slider-style.ts#L82) | 82 | <code>theme.palette.geoViewColor?.textColor.light[100]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |

## `packages/geoview-core/src/ui/style/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [dark-theme.ts](../../packages/geoview-core/src/ui/style/dark-theme.ts#L21) | 21 | <code>'#fff'</code> | `outline` | Unresolved — focus-ring contract (D6); no palette role proposed |
| [default.ts](../../packages/geoview-core/src/ui/style/default.ts#L120) | 120 | <code>'#000'</code> | `outline` | Unresolved — focus-ring contract (D6); no palette role proposed |
| [light-theme.ts](../../packages/geoview-core/src/ui/style/light-theme.ts#L15) | 15 | <code>'#000'</code> | `outline` | Unresolved — focus-ring contract (D6); no palette role proposed |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L40) | 40 | <code>&#96;${FOCUS_OUTLINE_WIDTH} solid ${geoViewColors.focusIndicator.outline}&#96;</code> | `outline` | Unresolved — focus-ring contract (D6); no palette role proposed |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L42) | 42 | <code>&#96;0 0 0 ${FOCUS_HALO_SIZE} ${geoViewColors.focusIndicator.halo}&#96;</code> | `boxShadow` | Unresolved — focus-ring contract (D6); no palette role proposed |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L76) | 76 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L77) | 77 | <code>&#96;3px solid transparent&#96;</code> | `border` | Keep CSS <code>transparent</code> (no palette role) |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L91) | 91 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L95) | 95 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L101) | 101 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L113) | 113 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L118) | 118 | <code>&#96;3px solid transparent&#96;</code> | `border` | Keep CSS <code>transparent</code> (no palette role) |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L134) | 134 | <code>&#96;transparent&#96;</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L135) | 135 | <code>&#96;2px solid transparent&#96;</code> | `border` | Keep CSS <code>transparent</code> (no palette role) |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L200) | 200 | <code>geoViewColors.focusIndicator.outline</code> | `outlineColor` | Unresolved — focus-ring contract (D6); no palette role proposed |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L202) | 202 | <code>&#96;0 0 0 ${FOCUS_HALO_SIZE} ${geoViewColors.focusIndicator.halo}&#96;</code> | `boxShadow` | Unresolved — focus-ring contract (D6); no palette role proposed |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L377) | 377 | <code>geoViewColors.bgColor.dark[800]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L378) | 378 | <code>geoViewColors.bgColor.light[800]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L398) | 398 | <code>&#96;0px 12px 9px -13px ${geoViewColors.bgColor.darken(0.2, 0.5)}&#96;</code> | `boxShadow` | No palette role — evaluate against MUI <code>theme.shadows</code> |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L435) | 435 | <code>'transparent !important'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L446) | 446 | <code>geoViewColors.error.lighten(0.7, 0.6)</code> | `background` | <code>palette.error.light</code> (or equivalent derived light; mapping proposal) |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L454) | 454 | <code>geoViewColors.info.lighten(0.7, 0.6)</code> | `background` | <code>palette.info.light</code> (or equivalent derived light; mapping proposal) |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L462) | 462 | <code>geoViewColors.grey.lighten(0.7, 0.6)</code> | `background` | Unresolved — registered state has no proposed status role |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L465) | 465 | <code>geoViewColors.info.main</code> | `color` | Unresolved — the registered state has no proposed status role |
| [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L510) | 510 | <code>'#FF4081'</code> | `backgroundColor` | No explicit role in <code>COLOUR_MAPPING.md</code> |

## `packages/geoview-core/src/ui/switch/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [switch-style.ts](../../packages/geoview-core/src/ui/switch/switch-style.ts#L30) | 30 | <code>'transparent'</code> | `outlineColor` | Keep CSS <code>transparent</code> (no palette role) |

## `packages/geoview-core/src/ui/tabs/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [tabs-style.ts](../../packages/geoview-core/src/ui/tabs/tabs-style.ts#L71) | 71 | <code>theme.palette.geoViewColor?.primary.light[200]</code> | `backgroundColor` | <code>palette.primary.dark</code> / <code>palette.primary.light</code> (exact ramp-to-slot mapping not specified) |
| [tabs-style.ts](../../packages/geoview-core/src/ui/tabs/tabs-style.ts#L72) | 72 | <code>theme.palette.geoViewColor?.white</code> | `color` | <code>palette.common.white</code> only for deliberate reversed text; otherwise <code>palette.text.primary</code> |

## `packages/geoview-custom-legend/src/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [custom-legend-style.ts](../../packages/geoview-custom-legend/src/custom-legend-style.ts#L20) | 20 | <code>theme.palette.geoViewColor?.bgColor.main</code> | `background` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [custom-legend-style.ts](../../packages/geoview-custom-legend/src/custom-legend-style.ts#L36) | 36 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [custom-legend-style.ts](../../packages/geoview-custom-legend/src/custom-legend-style.ts#L46) | 46 | <code>&#96;1px solid ${theme.palette.geoViewColor?.grey.light[800]}&#96;</code> | `borderBottom` | <code>palette.divider</code> if a neutral separator |
| [custom-legend-style.ts](../../packages/geoview-custom-legend/src/custom-legend-style.ts#L84) | 84 | <code>'1px solid #515BA5'</code> | `border` | <code>palette.primary.main</code> (mapping entry; value matches geo.ca primary only) |
| [custom-legend-style.ts](../../packages/geoview-custom-legend/src/custom-legend-style.ts#L85) | 85 | <code>theme.palette.geoViewColor?.bgColor.light[800]</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [custom-legend-style.ts](../../packages/geoview-custom-legend/src/custom-legend-style.ts#L138) | 138 | <code>'#393939'</code> | `color` | <code>palette.text.primary</code> (mapping entry) |
| [custom-legend-style.ts](../../packages/geoview-custom-legend/src/custom-legend-style.ts#L177) | 177 | <code>theme.palette.geoViewColor?.textColor.dark[200]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [custom-legend-style.ts](../../packages/geoview-custom-legend/src/custom-legend-style.ts#L179) | 179 | <code>'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [custom-legend-style.ts](../../packages/geoview-custom-legend/src/custom-legend-style.ts#L193) | 193 | <code>theme.palette.geoViewColor?.textColor.dark</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |

## `packages/geoview-drawer/src/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [measurement-styles.css](../../packages/geoview-drawer/src/measurement-styles.css#L4) | 4 | <code>rgba(0, 0, 0, 0.5)</code> | `background` | No explicit role in <code>COLOUR_MAPPING.md</code> |
| [measurement-styles.css](../../packages/geoview-drawer/src/measurement-styles.css#L6) | 6 | <code>white</code> | `color` | <code>palette.common.white</code> only for deliberate reversed text; otherwise <code>palette.text.primary</code> |
| [measurement-styles.css](../../packages/geoview-drawer/src/measurement-styles.css#L21) | 21 | <code>6px solid rgba(0, 0, 0, 0.5)</code> | `border-top` | No explicit role in <code>COLOUR_MAPPING.md</code> |
| [measurement-styles.css](../../packages/geoview-drawer/src/measurement-styles.css#L22) | 22 | <code>6px solid transparent</code> | `border-right` | Keep CSS <code>transparent</code> (no palette role) |
| [measurement-styles.css](../../packages/geoview-drawer/src/measurement-styles.css#L23) | 23 | <code>6px solid transparent</code> | `border-left` | Keep CSS <code>transparent</code> (no palette role) |

## `packages/geoview-drawer/src/buttons/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [style.tsx](../../packages/geoview-drawer/src/buttons/style.tsx#L42) | 42 | <code>'1px solid #ccc'</code> | `border` | <code>palette.divider</code> only if this is a neutral separator; instance review required |

## `packages/geoview-filter-panel/src/components/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [filter-panel-style.ts](../../packages/geoview-filter-panel/src/components/filter-panel-style.ts#L49) | 49 | <code>theme.palette.geoViewColor?.bgColor?.dark?.[100] &#124;&#124; 'divider'</code> | `borderColor` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [filter-panel-style.ts](../../packages/geoview-filter-panel/src/components/filter-panel-style.ts#L87) | 87 | <code>theme.palette.geoViewColor?.bgColor?.dark?.[100] &#124;&#124; 'divider'</code> | `borderColor` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |

## `packages/geoview-filter-panel/src/components/controls/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [control-styles.ts](../../packages/geoview-filter-panel/src/components/controls/control-styles.ts#L29) | 29 | <code>theme.palette.geoViewColor?.textColor?.light?.[400] &#124;&#124; 'text.secondary'</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [control-styles.ts](../../packages/geoview-filter-panel/src/components/controls/control-styles.ts#L43) | 43 | <code>theme.palette.geoViewColor?.bgColor?.dark?.[100] &#124;&#124; 'divider'</code> | `borderColor` | <code>palette.divider</code> if a neutral separator; retain state/active role otherwise |
| [control-styles.ts](../../packages/geoview-filter-panel/src/components/controls/control-styles.ts#L67) | 67 | <code>theme.palette.geoViewColor?.textColor?.light?.[400] &#124;&#124; 'text.secondary'</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [control-styles.ts](../../packages/geoview-filter-panel/src/components/controls/control-styles.ts#L87) | 87 | <code>theme.palette.geoViewColor?.textColor?.light?.[400] &#124;&#124; 'text.secondary'</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [control-styles.ts](../../packages/geoview-filter-panel/src/components/controls/control-styles.ts#L94) | 94 | <code>theme.palette.geoViewColor?.textColor?.light?.[400] &#124;&#124; 'text.secondary'</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |

## `packages/geoview-geochart/src/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [geochart.tsx](../../packages/geoview-geochart/src/geochart.tsx#L113) | 113 | <code>theme.palette.geoViewColor?.grey.light[100] ?? theme.palette.divider</code> | `borderColor` | <code>palette.divider</code> if a neutral separator |

## `packages/geoview-stac-browser/src/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [stac-browser-style.ts](../../packages/geoview-stac-browser/src/stac-browser-style.ts#L34) | 34 | <code>theme.palette.geoViewColor?.bgColor.dark[50] ?? theme.palette.background.paper</code> | `backgroundColor` | <code>palette.background.default</code> / <code>palette.background.paper</code> (depends on page vs contained surface) |
| [stac-browser-style.ts](../../packages/geoview-stac-browser/src/stac-browser-style.ts#L58) | 58 | <code>'2px solid transparent'</code> | `borderBottom` | Keep CSS <code>transparent</code> (no palette role) |
| [stac-browser-style.ts](../../packages/geoview-stac-browser/src/stac-browser-style.ts#L62) | 62 | <code>theme.palette.geoViewColor?.textColor.light[200]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [stac-browser-style.ts](../../packages/geoview-stac-browser/src/stac-browser-style.ts#L117) | 117 | <code>theme.palette.geoViewColor?.textColor.light[200]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [stac-browser-style.ts](../../packages/geoview-stac-browser/src/stac-browser-style.ts#L163) | 163 | <code>theme.palette.geoViewColor?.textColor.light[200]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [stac-browser-style.ts](../../packages/geoview-stac-browser/src/stac-browser-style.ts#L221) | 221 | <code>theme.palette.geoViewColor?.textColor.light[200]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [stac-browser-style.ts](../../packages/geoview-stac-browser/src/stac-browser-style.ts#L316) | 316 | <code>theme.palette.geoViewColor?.white</code> | `color` | <code>palette.common.white</code> only for deliberate reversed text; otherwise <code>palette.text.primary</code> |
| [stac-browser-style.ts](../../packages/geoview-stac-browser/src/stac-browser-style.ts#L326) | 326 | <code>theme.palette.geoViewColor?.textColor.light[200]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [stac-collection-list.tsx](../../packages/geoview-stac-browser/src/stac-collection-list.tsx#L125) | 125 | <code>sortAsc ? theme.palette.primary.main : theme.palette.geoViewColor?.textColor.light[200]</code> | `color` | <code>palette.text.primary</code> / <code>palette.text.secondary</code> / <code>palette.text.disabled</code> (instance intent unresolved) |
| [stac-collection-list.tsx](../../packages/geoview-stac-browser/src/stac-collection-list.tsx#L126) | 126 | <code>sortAsc ? theme.palette.action.selected : 'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |
| [stac-item-detail.tsx](../../packages/geoview-stac-browser/src/stac-item-detail.tsx#L304) | 304 | <code>isSelected ? theme.palette.action.selected : 'transparent'</code> | `backgroundColor` | Keep CSS <code>transparent</code> (no palette role) |

## `packages/geoview-swiper/src/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [swiper-style.ts](../../packages/geoview-swiper/src/swiper-style.ts#L18) | 18 | <code>'rgba(50,50,50,0.75)'</code> | `backgroundColor` | No explicit role in <code>COLOUR_MAPPING.md</code> |
| [swiper-style.ts](../../packages/geoview-swiper/src/swiper-style.ts#L19) | 19 | <code>'#fff'</code> | `color` | <code>palette.common.white</code> only for deliberate reversed text; otherwise <code>palette.text.primary</code> |
| [swiper-style.ts](../../packages/geoview-swiper/src/swiper-style.ts#L26) | 26 | <code>'rgba(50,50,50,0.75)'</code> | `backgroundColor` | No explicit role in <code>COLOUR_MAPPING.md</code> |

## `packages/geoview-time-slider/src/`

| File | Line | Current value or token | CSS property | Proposed role in `COLOUR_MAPPING.md` |
|---|---:|---|---|---|
| [time-slider-style.ts](../../packages/geoview-time-slider/src/time-slider-style.ts#L33) | 33 | <code>'0px 12px 9px -13px #E0E0E0'</code> | `boxShadow` | No palette role — evaluate as an elevation/shadow, not a colour role |
