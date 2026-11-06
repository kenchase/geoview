# Typography normalization: final record

**Status:** Earlier batches and drawer D2/D3 are committed. D3 measurement-label typography is rolled back to fixed 12px/bold styling pending a separate PR; picker typography improvements remain. See [FONT_WEIGHT_PLAN.md](FONT_WEIGHT_PLAN.md) for weight rules.

## Approach

- [default.ts](../../packages/geoview-core/src/ui/style/default.ts) owns the finite text-size scale. The [theme generator](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts) maps typography variants to scale keys.
- Components use their owning map's theme, not the global default theme. [AppStart](../../packages/geoview-core/src/core/app-start.tsx) memoizes themes by map and display theme.
- [Theme construction](../../packages/geoview-core/src/ui/style/theme.tsx) calibrates `htmlFontSize` once per document: `computedHtmlRoot * 16 / computedBrowserDefault`. A hidden `font: medium sans-serif` probe measures the browser default; the host root is unchanged. The base theme supplies calibrated `pxToRem` to the completed theme; `typography.fontSize` stays 14 so MUI's conversion coefficient stays 1.
- Sizes follow the user's browser default independently of the host root, provided the host root font size is set before the first map initializes. This guarantee applies to calibrated GeoView themes; external plain-MUI themes use their own conversion.

## Scale

Design pixels below assume a 16px browser default; at a 20px default, multiply by 1.25. Changing only the host root does not change calibrated sizes.

| Scale key | Design px |
| --------- | --------: |
| `xs`      |        12 |
| `sm`      |        14 |
| `default` |        16 |
| `md`      |        18 |
| `lg`      |        20 |
| `xl`      |        24 |
| `xxl`     |        32 |
| `display` |        48 |

## Typography variants

| Variant          | Scale key | Design px |
| ---------------- | --------- | --------: |
| `h1`             | `display` |        48 |
| `h2`             | `xxl`     |        32 |
| `h3`             | `xl`      |        24 |
| `h4`             | `lg`      |        20 |
| `h5`             | `md`      |        18 |
| `h6`             | `default` |        16 |
| `subtitle1`      | `default` |        16 |
| `subtitle2`      | `xs`      |        12 |
| `body1`          | `default` |        16 |
| `body2`          | `sm`      |        14 |
| `caption`        | `xs`      |        12 |
| `overline`       | `sm`      |        14 |
| `button`         | `default` |        16 |
| `label` (custom) | `sm`      |        14 |

Hover tooltips use `caption` (12px); touch tooltips use `body2` (14px). Both sizes were browser-verified at host roots 16px and 10px.

### Per-theme scale-key overrides

Display themes pass typed `scaleOverrides` through `getThemeOptions` to the generator, choosing scale keys rather than raw sizes. For example, `scaleOverrides: { h3: 'xxl', label: 'xs' }` changes those variants to calibrated 32px and 12px at a 16px browser default. Other variants keep their default mapping. The current built-in display themes do not supply overrides.

Custom-legend header config uses `fontSizeStep` with the same eight scale keys. A valid named step wins over numeric `fontSize`; an unknown step logs a warning and leaves the default header size. Without either property, the header remains 18px.

## Migration rules

- MUI Typography and components exposing Typography slots use the target `variant` prop and remove local sizes. An already-correct implicit default needs no redundant prop. Variant changes can change line-height.
- When changing variant would change font-weight, retain the rendered variant and use only `fontSize: theme.typography.<target>.fontSize`. Verified weight/role carryovers are in [FONT_WEIGHT_PLAN.md](FONT_WEIGHT_PLAN.md); that table does not select future fixes.
- Non-Typography elements use only `.fontSize`, not a spread of the whole variant; retain existing line-height and weight.
- Shared UI wrappers use standard MUI variants and remain compatible with external plain-MUI themes.
- Icons use `fontSize="small" | "medium" | "large" | "inherit"`. MUI owns icon size inside Buttons; no workaround overrides its start/end-icon sizing.
- No component literal sizes, `palette.geoViewFontSize`, generated multiplier keys or deprecated `control` variant. `fontSize: 'inherit'` is allowed.

## Deprecations

All four compatibility APIs below are deprecated and **removed in the next breaking release**.

| Deprecated API                                                    | Replacement                                                                                     |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `palette.geoViewFontSize`                                         | Typography `variant`, or `theme.typography.<variant>.fontSize`                                  |
| Generated multiplier keys                                         | A semantic typography variant; display-theme size customization uses scale keys                 |
| `control` typography variant (retained at 11px during transition) | An appropriate standard MUI variant, or GeoView `label` for internal labels                     |
| Numeric custom-legend `fontSize`                                  | `fontSizeStep`; legacy numbers still use exact calibrated `pxToRem` conversion without rounding |

## Lint rule

[packages/eslint.config.js](../../packages/eslint.config.js) applies typography `no-restricted-syntax` checks at the existing warning severity to `geoview-*/src/**/*.{js,jsx,ts,tsx}`.

It flags numeric and unit-bearing literal font sizes in style values, sx/styled, JSX and static templates; legacy palette/generated-key reads; and deprecated `control` usage. Literal checks follow value-producing containers (including responsive objects/arrays and conditional branches), not helper-call arguments, lookup keys or condition tests. Typography tokens, variant props, named icon sizes, inherit and implicit MUI variants remain allowed.

The final repository lint run had zero warnings/errors after the approved exemptions. `dom-helper.ts` retains its separate DOM-access allowance, but its typography checks remain enabled.

## Exceptions

These are current boundaries, not additional planned migrations within this completed work.

| Site                                                               | Current exception and reason                                                                                                                                           |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `geoview-core/src/ui/style/**`                                     | Path exemption: owns scale/variant definitions and deprecated compatibility values.                                                                                    |
| `**/*.d.ts` and globally ignored declaration files                 | Type declarations are not rendered UI and are excluded by config.                                                                                                      |
| `geoview-core/src/core/components/export/layout-styles.ts`         | Path exemption: PDF/canvas layout describes exported artwork, not viewer UI. Export modal UI remains checked.                                                          |
| Core measurement button, `measurement.tsx`                         | One line-level disable for OpenLayers 13px segment-label text; its literal is map drawing, not viewer UI.                                                              |
| Other OpenLayers/canvas text, including `geoview-text-renderer.ts` | Out-of-scope map-rendered text. Dynamic canvas font strings and the renderer's destructuring default do not match the rule; the renderer has no typography disable.    |
| Other export PDF/canvas text and layout calculations               | Exported artwork remains unchanged. Canvas font strings/calculations do not match viewer-UI literal checks; no package-wide export exemption.                          |
| Console formatting in `useWhatChanged.ts`                          | DevTools strings, not viewer UI; no disable needed.                                                                                                                    |
| JSDoc font-size examples                                           | Comments, not executable style values; no disable needed.                                                                                                              |
| Custom-legend numeric `fontSize` compatibility path                | Exact dynamic conversion of deprecated config remains supported. It is not a literal UI size and needs no disable; the rest of custom legend remains checked.          |

## Remaining work

- Breaking-release removals: `palette.geoViewFontSize`, generated multiplier keys, `control`, and numeric custom-legend `fontSize`.
- Review unused styles for removal: filter `filterTitle`, nav `popoverTitle`, legend `title`, and data-table instruction styles. Common layer-list legacy ListItemText selectors also have no current matching consumer.
- GeoChart text buttons use the button size (16px), but have not yet been browser-measured.
- Font-weight phase: use the source-verified [deferral table](FONT_WEIGHT_PLAN.md).

## STAC browser

### Inventory and browser evidence

The demo is [stac-browser.html](../../packages/geoview-core/public/templates/demos/stac-browser.html). It defines three open STAC panels: `mapSTAC` (Datacube), `mapSTAC2` (NAPL), and `mapSTAC3` (Sentinel). The configs do not override the display theme. Browser inspection used the default theme with `html` computed to `16px`; measurements below are computed CSS values. Typography variants are read from the rendered `MuiTypography-*` class.

The source inventory found 23 `palette.geoViewFontSize` reads and 14 numeric `fontWeight` declarations, all in [stac-browser-style.ts](../../packages/geoview-stac-browser/src/stac-browser-style.ts). It also found 13 icon `fontSize="small"` props and two `font: 'inherit'` shorthands. No other literal font-size/font-weight declarations or typography reads were found under the package `src/`.

The browser states exercised included Datacube collection listing/detail, item listing/detail, and selected assets; NAPL search filters/results, selected results, and item metadata; and the Sentinel collection listing. The `dateInput` style is unused: it has no consumer in `src/`. The native date/property inputs that render in the demo instead use `getNativeInputSx`'s `font: 'inherit'` and compute to 16px / 400 / 24px.

### Applied site mapping

The "current" computed values below are pre-migration measurements of representative rendered elements at the demo root size. `body1` is the implicit Typography variant when no variant prop is supplied. Weight tokens follow [FONT_WEIGHT_PLAN.md](FONT_WEIGHT_PLAN.md): computed 600 maps to `fontWeightBold`, and 500 maps to `fontWeightMedium`.

| Site in `stac-browser-style.ts`                  | Current computed size / weight / line-height / variant | Role                                                  | Applied target and application                      | Weight token         | Resulting size | Flag                                     |
| ------------------------------------------------ | ------------------------------------------------------ | ----------------------------------------------------- | --------------------------------------------------- | -------------------- | -------------: | ---------------------------------------- |
| `modeButton` (116–117), `modeButtonActive` (133) | 14px / 500 inactive or 600 active / 24.5px / none      | Browse/search tabs                                    | `label` size-only on button                         | Medium / Bold tokens |           14px | No size change                           |
| `filterLabel` (160–161)                          | 14px / 600 / 21px / body1                              | Filter and section labels                             | `label` variant                                     | Bold token           |           14px | Variant line-height/letter-spacing apply |
| `resultTitle` (196–197)                          | 16px / 600 / 24px / body1                              | Item title (`component="p"`)                          | `h6` variant; local size/weight removed             | Heading default bold |           16px | Variant line-height/letter-spacing apply |
| `resultMeta` (201)                               | 14px / 400 / 21px / body1                              | Dates and secondary item/collection metadata          | `body2` variant                                     | Regular default      |           14px | Variant line-height/letter-spacing apply |
| `detailTitle` (214–215)                          | 20px / 600 / 30px / body1                              | Collection/item detail title (`component="h3"`)       | `h4` variant; local size/weight removed             | Heading default bold |           20px | Variant line-height/letter-spacing apply |
| `detailDescription` (219)                        | 16px / 400 / 24px / body1                              | Collection/search description                         | Retain implicit `body1`; local size removed         | Regular default      |           16px | No size change                           |
| `assetTitleSelected` (234)                       | 14px / 600 / 21px / body1 when selected                | Selected asset title (`component="p"`)                | `label` variant, conditional Bold token             | Bold when selected   |           14px | Variant line-height/letter-spacing apply |
| `pageRange` (259)                                | 14px / 400 / 21px / body1                              | Search-result range/status                            | `body2` variant                                     | Regular default      |           14px | Variant line-height/letter-spacing apply |
| `dateInput`                                      | Unused; deleted after confirming no consumer           | No rendered role                                      | Deleted                                             | —                    |              — | No consumer                              |
| `collectionTitle` (319–320)                      | 16px / 600 / 24px / body1                              | Collection card title (`component="span"`)            | `h6` variant; local size/weight removed             | Heading default bold |           16px | Variant line-height/letter-spacing apply |
| `collectionDescription` (323)                    | 14px / 400 / 19.6px / body1                            | Secondary collection description (`component="span"`) | `body2` variant; local size and line-height removed | Regular default      |           14px | Variant line-height/letter-spacing apply |
| `keywordChip` (342)                              | 12px / 400 / 18px / none                               | Collection keyword chip                               | `caption` size-only                                 | Inherited            |           12px | No size change                           |
| `metadataLabel` (361–362)                        | 14px / 600 / 21px / body1                              | Collection metadata labels                            | `label` variant                                     | Bold token           |           14px | Variant line-height/letter-spacing apply |
| `zoomButton` (368)                               | 14px / 500 / 24.5px / none                             | Zoom action (`Button`)                                | `size="small"`; theme maps small Buttons to `body2` | MUI Button default   |           14px | No size change                           |
| `itemsSectionTitle` (373–374)                    | 16px / 600 / 24px / body1                              | Collection item-section heading (`component="h4"`)    | `h6` variant; local size/weight removed             | Heading default bold |           16px | Variant line-height/letter-spacing apply |
| `itemSummary` (397)                              | 14px / 400 / 21px / none                               | Item summary fields                                   | `body2` size-only                                   | Inherited            |           14px | No size change                           |
| `itemSummaryLabel` (401–402)                     | 14px / 600 / 21px / none                               | Bold labels within item summaries (non-Typography)    | `label` size-only + Bold token                      | Bold token           |           14px | No size change                           |
| `itemCardActions .MuiButton-root` (410)          | 14px / 500 / 24.5px / none                             | Zoom/details action buttons                           | `size="small"`; theme maps small Buttons to `body2` | MUI Button default   |           14px | No size change                           |
| `selectionBar` (423)                             | 14px / 400 / 21px / none                               | Selected-item status message                          | `body2` size-only                                   | Inherited            |           14px | No size change                           |
| `metadataGrid` (435)                             | 14px / 400 / 21px / none                               | Item metadata `<dl>` content                          | `body2` size-only                                   | Inherited            |           14px | No size change                           |
| `metadataKey` (441)                              | 14px / 600 / 21px / body1                              | Metadata field key (`component="dt"`)                 | `label` variant                                     | Bold token           |           14px | Variant line-height/letter-spacing apply |
| `metadataValue` (449)                            | 14px / 400 / 21px / body1                              | Metadata field value (`component="dd"`)               | `body2` variant                                     | Regular default      |           14px | Variant line-height/letter-spacing apply |
| `assetTypeBadge` (466–467)                       | 12px / 600 / 18px / none                               | Asset-type badge                                      | `caption` size-only + Bold token                    | Bold token           |           12px | No size change                           |
| `assetRoleBadge` (476–477)                       | 12px / 500 / 18px / none                               | Asset-role badge                                      | `caption` size-only + Medium token                  | Medium token         |           12px | No size change                           |
| `collectionGroupTitle` (504)                     | 16px / 600 / 24px / body1                              | Search-result collection heading (`component="h4"`)   | `h6` variant; local size/weight removed             | Heading default bold |           16px | Variant line-height/letter-spacing apply |

When applying a variant to an existing Typography, keep its current HTML element with `component` (notably the existing `h3`, `h4`, `span`, `dt`, and `dd` elements). All heading-title rows use their heading variant directly; h1–h6 are bold. `itemSummaryLabel` is not a Typography, so it uses size-only with the bold token. Every changed Typography keeps its original HTML element through `component` where needed. Converted elements take the target variant's line-height and letter-spacing; no overrides preserve their old values. The two Button size changes from 14px to 16px are approved, with weight left to MUI.

### Other font-affecting sites

| Site                                                                                                                                                                                      | Current browser result                                                                        | Proposal                                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `getNativeInputSx` `font: 'inherit'` (40)                                                                                                                                                 | Native date/property inputs: 16px / 400 / 24px; no Typography variant                         | Keep inheritance; no explicit size or weight to migrate      |
| `collectionCard` `font: 'inherit'` (312)                                                                                                                                                  | Collection button: 16px / 400 / 24px; no Typography variant                                   | Keep inheritance; child Typography owns its text sizes       |
| 13 icon props: `stac-collection-detail.tsx` (225, 325, 334), `stac-search-results.tsx` (161, 207, 216), `stac-item-card.tsx` (112, 135), `stac-item-detail.tsx` (147, 151, 217, 227, 237) | All use `fontSize="small"`; rendered at 18px in MUI Button icon slots and 20px in IconButtons | Keep MUI named `small`; Button slots retain MUI-owned sizing |

### Post-migration browser measurements

The Datacube, NAPL, and Sentinel demo maps were inspected under `geo.ca` and `canada.ca` with the host root at 16px and 10px (62.5%). Datacube collection/item details and a selected asset were exercised; the NAPL search returned 50 results and an item detail; Sentinel collection cards were inspected. The measured typography values below were consistent across the theme/root combinations. Sizes and line-heights are computed CSS pixels; `600 → 700` changes preserve the rendered bold face.

| Site                              | Before: size / weight / line-height | After: size / weight / line-height | Note                                                                   |
| --------------------------------- | ----------------------------------- | ---------------------------------- | ---------------------------------------------------------------------- |
| `modeButton` / `modeButtonActive` | 14px / 500 or 600 / 24.5px          | 14px / 500 or 700 / 24.5px         | No size change                                                         |
| `filterLabel`                     | 14px / 600 / 21px                   | 14px / 700 / 21px                  | Same rendered bold face                                                |
| `resultTitle`                     | 16px / 600 / 24px                   | 16px / 700 / 25.6px                | Same rendered bold face                                                |
| `resultMeta`                      | 14px / 400 / 21px                   | 14px / 400 / 20.02px               | —                                                                      |
| `detailTitle`                     | 20px / 600 / 30px                   | 20px / 700 / 24.7px                | **Line-height −5.3px**                                                 |
| `detailDescription`               | 16px / 400 / 24px                   | 16px / 400 / 24px                  | —                                                                      |
| `assetTitleSelected`              | 14px / 600 / 21px                   | 14px / 700 / 21px                  | Same rendered bold face                                                |
| `pageRange`                       | 14px / 400 / 21px                   | 14px / 400 / 20.02px               | —                                                                      |
| `collectionTitle`                 | 16px / 600 / 24px                   | 16px / 700 / 25.6px                | Same rendered bold face                                                |
| `collectionDescription`           | 14px / 400 / 19.6px                 | 14px / 400 / 20.02px               | Old `lineHeight: 1.4` removed                                          |
| `keywordChip`                     | 12px / 400 / 18px                   | 12px / 400 / 18px                  | —                                                                      |
| `metadataLabel`                   | 14px / 600 / 21px                   | 14px / 700 / 21px                  | Same rendered bold face                                                |
| `zoomButton`                      | 16px / 500 / 28px                   | 13px / 500 / 22.75px               | Removed local 16px font size; `size="small"` uses MUI's own small size |
| `itemsSectionTitle`               | 16px / 600 / 24px                   | 16px / 700 / 25.6px                | Same rendered bold face                                                |
| `itemSummary`                     | 14px / 400 / 21px                   | 14px / 400 / 21px                  | —                                                                      |
| `itemSummaryLabel`                | 14px / 600 / 21px                   | 14px / 700 / 21px                  | Same rendered bold face                                                |
| `itemCardActions .MuiButton-root` | 16px / 500 / 28px                   | 13px / 500 / 22.75px               | Removed local 16px font size; `size="small"` uses MUI's own small size |
| `selectionBar`                    | 14px / 400 / 21px                   | 14px / 400 / 20.02px               | —                                                                      |
| `metadataGrid`                    | 14px / 400 / 21px                   | 14px / 400 / 21px                  | —                                                                      |
| `metadataKey`                     | 14px / 600 / 21px                   | 14px / 700 / 21px                  | Same rendered bold face                                                |
| `metadataValue`                   | 14px / 400 / 21px                   | 14px / 400 / 20.02px               | —                                                                      |
| `assetTypeBadge`                  | 12px / 600 / 18px                   | 12px / 700 / 18px                  | Same rendered bold face                                                |
| `assetRoleBadge`                  | 12px / 500 / 18px                   | 12px / 500 / 18px                  | —                                                                      |
| `collectionGroupTitle`            | 16px / 600 / 24px                   | 16px / 700 / 25.6px                | Same rendered bold face                                                |

### Compact Button follow-up

The theme keeps MUI's default `Button size="small"` font size (13px). The three STAC zoom/details action buttons previously had local 16px sizing and now use MUI's small size; other small Buttons remain at their MUI-defined size. MUI owns sizes inside its components, including small Button text and icons in Buttons. Local Button font-size declarations are not allowed.

The explicit small Button sites are in `geoview-core/src/core/components/common/responsive-grid-layout.tsx`, `data-table/data-table.tsx`, `layers/layers-toolbar.tsx`, `layers/left-panel/add-new-layer/add-new-layer.tsx`, `nav-bar/buttons/basemap-select.tsx`, `nav-bar/buttons/map-rotation.tsx`, `nav-bar/buttons/projection.tsx`, `notifications/notifications.tsx`, `geoview-core/src/ui/button-drop-down/button-drop-down.tsx`, `geoview-custom-legend/src/components/description-text.tsx`, `geoview-filter-panel/src/components/layer-filter-section.tsx`, and the STAC browser components (`stac-browser.tsx`, `stac-collection-detail.tsx`, `stac-item-card.tsx`, `stac-item-detail.tsx`, and `stac-search-results.tsx`). Drawer sites remain excluded.

## Drawer

### Batch D, step 1: inventory only (2026-11-03)

This subsection is the historical D1 inventory: no source changes or commits were made in that step. Its source line numbers and hand-off status describe the pre-D2/D3 baseline, not the current implementation. D3 below records the subsequently approved mappings and verification; the measurement-label portion was later rolled back as noted there.

Scope: every TS/TSX/CSS file in `packages/geoview-drawer`, including cssText, and the core DrawerController measurement helper. There are five hard-coded size/weight declarations, eleven existing Typography variant sites, and seven compact Button sites. No additional size/weight declarations, sx/styled typography overrides, DOM `style.fontSize`/`style.fontWeight` assignments, or OpenLayers font styles were found in the drawer package. All five declarations have live consumers; none is unused. The helper itself has no font declaration: it attaches the two CSS classes below to an OpenLayers overlay's DOM element.

Source paths below are relative to the repository root; line numbers describe the inventory baseline. Measurements are computed size / weight / line-height. Proposed sizes assume browser default and host root both 16px. Flags: **P** = new theme/ownership plumbing; **A** = role/token choice needs approval beyond the standing mappings; **S** = size changes. There are no proposed size changes in this inventory.

### Explicit declarations and helper binding

| Site (file:line) | What it styles / application / current value | Browser baseline | Proposal and resulting size / weight | Owning-map theme delivery / flags |
| --- | --- | --- | --- | --- |
| `packages/geoview-drawer/src/measurement-styles.css:10` | Line length and polygon perimeter/area label; static `.drawer-tooltip` CSS, `font-size: 12px` | Line and polygon: 12px / 700 / 18px | Size-only `caption.fontSize`; keep bold via `fontWeightBold`; 12px / 700. Do not spread caption or change the inherited line-height. | **P**: always-mounted, map-scoped drawer UI theme bridge -> controller setter -> existing and newly created overlay elements. Not a global CSS variable/default theme, and not an effect confined to the optional StylePanel. |
| `packages/geoview-drawer/src/measurement-styles.css:17` | Same measurement label; static `.drawer-tooltip-measure` CSS, `font-weight: bold` | 12px / 700 / 18px | `theme.typography.fontWeightBold`; paired with caption size-only, 12px / 700 | **P**: pass weight with size through the same controller bridge; remove only the static typography declarations when implementing, not other CSS. |
| `packages/geoview-core/src/core/controllers/drawer-controller.ts:3011` and `:3012` | Creates `div`, assigns `drawer-tooltip drawer-tooltip-measure`; DOM element rendered by OpenLayers Overlay. No local size/weight; consumes both CSS declarations above. | Line `2,765.30 km`; polygon `6,809.18 km` and `2,099,552.40 km` plus superscript 2; 12px / 700 / 18px | Same caption size-only + bold token; keep the `div` and current line-height. No Typography variant can be applied directly to this non-React element. | **P**: helper is static and has no theme input. Wire all seven call sites (1141, 1903, 2202, 2266, 2301, 2549, 2651), including hidden/recreated/history labels; setter must update existing labels and react to that map's theme changes. Helper starts at line 2994. |
| `packages/geoview-drawer/src/buttons/style.tsx:290` | Injected colour-picker header `div`; cssText `font-size: 14px` | 14px / 500 / normal | Size-only `body2.fontSize`, paired with medium token; 14px / 500, retain normal line-height | **P, A**: use StylePanel's `useTheme()` and a ref/setup tied to its own popover, not the global observer. A 14px medium picker heading is not clearly the approved secondary-text role; do not silently make it h6 or regular body2. |
| `packages/geoview-drawer/src/buttons/style.tsx:291` | Same injected header; cssText `font-weight: 500` | 14px / 500 / normal | `theme.typography.fontWeightMedium`; body2 size-only avoids changing 500 to body2's 400 | **P, A**: same owned-popover setup and heading-role decision as above. |
| `packages/geoview-drawer/src/buttons/style.tsx:302` | Injected close `button` containing the text glyph `✕`; cssText `font-size: 16px`; no authored weight | 16px / 400 / normal (Arial, browser button default) | Size-only `body1.fontSize`; regular token if explicitly setting weight; 16px / 400. Keep button semantics and existing line-height; not a Typography conversion. | **P, A**: take values from the owning StylePanel theme during its own popover setup. This action glyph is not approved 16px body copy; confirm keeping the glyph with body1 sizing versus a separately approved MUI icon conversion. No spacing/colour/timing changes proposed. |

For direct DOM styles, numeric theme font sizes need a `px` suffix; unit-bearing strings must be preserved. Numeric weight tokens must be stringified for DOM CSS. The bridge must use the live owning map's theme, never import a global default theme. The future popover setup must retain the existing body portal and React provider context; verify the installed MuiColorInput ref/Popover API before selecting the exact hook. New ref/setup ownership is explicitly proposed plumbing, not an already-existing helper.

### Already theme-owned Typography and compact Buttons

These are real size/weight selection sites even though they have no local font declarations. Keep existing variants, weights, HTML elements and MUI ownership; no migration is proposed. All eleven label sites render `h6` elements with `subtitle2`, not the bold `h6` variant. Their current field-label role and medium weight are intentional baseline carryovers; converting to caption would change weight and is unnecessary.

| Site in `packages/geoview-drawer/src/` | Role / current application | Measured size / weight / line-height | Target / variant vs size-only / resulting size and weight | Flags |
| --- | --- | --- | --- | --- |
| `buttons/style.tsx:360` | Text label; Typography `subtitle2` | 12px / 500 / 15px | Keep `subtitle2` variant, 12px / 500 | None |
| `buttons/style.tsx:367` | Font label; Typography `subtitle2` | 12px / 500 / 15px | Keep `subtitle2` variant, 12px / 500 | None |
| `buttons/style.tsx:398` | Text Colour label; Typography `subtitle2` | 12px / 500 / 15px | Keep `subtitle2` variant, 12px / 500 | None |
| `buttons/style.tsx:409` | Font Size label; Typography `subtitle2` | 12px / 500 / 15px | Keep `subtitle2` variant, 12px / 500 | None |
| `buttons/style.tsx:431` | Halo Colour label; Typography `subtitle2` | 12px / 500 / 15px | Keep `subtitle2` variant, 12px / 500 | None |
| `buttons/style.tsx:442` | Halo Width label; Typography `subtitle2` | 12px / 500 / 15px | Keep `subtitle2` variant, 12px / 500 | None |
| `buttons/style.tsx:460` | Text formatting label; Typography `subtitle2` | 12px / 500 / 15px | Keep `subtitle2` variant, 12px / 500 | None |
| `buttons/style.tsx:490` | Fill Colour label; Typography `subtitle2` | 12px / 500 / 15px | Keep `subtitle2` variant, 12px / 500 | None |
| `buttons/style.tsx:500` | Icon Size label; Typography `subtitle2` | 12px / 500 / 15px | Keep `subtitle2` variant, 12px / 500 | None |
| `buttons/style.tsx:521` | Stroke Colour label; Typography `subtitle2` | 12px / 500 / 15px | Keep `subtitle2` variant, 12px / 500 | None |
| `buttons/style.tsx:533` | Stroke Width label; Typography `subtitle2` | 12px / 500 / 15px | Keep `subtitle2` variant, 12px / 500 | None |
| `buttons/geometry-picker.tsx:255` | Point Button `size="small"` | 13px / 500 / 22.75px | Keep MUI small Button; 13px / 500, no local variant-size override | None |
| `buttons/geometry-picker.tsx:272` | Text Button `size="small"` | 13px / 500 / 22.75px | Keep MUI small Button; 13px / 500 | None |
| `buttons/geometry-picker.tsx:289` | Line Button `size="small"` | 13px / 500 / 22.75px | Keep MUI small Button; 13px / 500 | None |
| `buttons/geometry-picker.tsx:306` | Polygon Button `size="small"` | 13px / 500 / 22.75px | Keep MUI small Button; 13px / 500 | None |
| `buttons/geometry-picker.tsx:323` | Rectangle Button `size="small"` | 13px / 500 / 22.75px | Keep MUI small Button; 13px / 500 | None |
| `buttons/geometry-picker.tsx:340` | Circle Button `size="small"` | 13px / 500 / 22.75px | Keep MUI small Button; 13px / 500 | None |
| `buttons/geometry-picker.tsx:357` | Star Button `size="small"` | 13px / 500 / 22.75px | Keep MUI small Button; 13px / 500 | None |

The React provider already delivers the owning map theme to these sites; no new plumbing is needed. If a later approved change switches a Typography variant, retain its existing HTML element with `component` and accept the target variant's line-height/letter-spacing.

### Other rendered typography and non-UI font data

| Surface / source | Computed size / weight / line-height at baseline | Ownership / proposal |
| --- | --- | --- |
| Geometry/style panel headings, supplied by core panel infrastructure through `draw-navbar.tsx:60` and `:78` | 16px / 700 / 25.6px; `h2` element, `h6` variant | Already map-theme-owned; keep core h6. No drawer font declaration. |
| StylePanel TextField/MuiColorInput text, numeric inputs, textarea and native font selector (`style.tsx:363`, `:370`, `:401`, `:412`, `:434`, `:445`, `:493`, `:503`, `:524`, `:536`) | 16px / 400 / 23px | MUI/theme-owned inputs; keep defaults. The textarea's hidden sizing clone is not another visible text site. |
| Geometry Buttons' start icons | 18px / 500 / 31.5px | MUI owns icon size inside Buttons; no local override proposed. |
| Drawing-tools IconButton SVGs | 24px / 400 / normal | MUI/core wrapper ownership; leave unchanged. |
| Style panel close IconButton SVG | 20px / 400 / normal | MUI small IconButton ownership; distinct from the injected text-glyph close button. Leave unchanged. |
| Polygon area superscript, generated measurement markup consumed by the helper | 10px / 700 / 15px | Browser `sup` relative sizing, inherits measurement weight. No literal font declaration in scope; preserve markup/relative sizing, not a new scale token. |
| Colour picker hue/alpha range inputs | 13.3333px / 400 / normal on the input nodes; no visible text content | Browser/library internals, not authored drawer text; no override. |
| `style.tsx:413` (`style.textSize || 14`), `:154`-`:159` size handler, and `:255`-`:258` bold handler | User drawing data; Font Size input displays `14` with the input typography above | OpenLayers/canvas artwork settings, not the UI input's font size/weight. Preserve user-configured artwork, not caption/body tokens. No direct OpenLayers font declaration in the package/helper scope. |
| `utils/fonts.ts:44` Google Fonts URL `wght@400;700`; called by `style.tsx:143` and `:347` | Font-face loading capability, not a rendered size/weight assignment | Used, not dead CSS. Preserve the requested font faces; this is not a UI token migration site. |

### Browser method and hand-off reconciliation

Primary evidence came from a fresh, visible Demos Navigator page at `http://localhost:8080/demos-navigator.html?config=./configs/navigator/demos/15-package-drawer.json`, using the actual config, its default light theme (Roboto), a 16px computed `html` root, and a 16px browser-default probe. Drew a line and polygon with pointer input, enabled drawer measurements, opened Change Style and its fill picker, and exercised Text and Point controls to expose every label. Geometry Button metrics were checked for all seven buttons. Non-React measurement labels have fixed CSS size/weight, although font family and line-height inherit through the owning map. Picker header/glyph sizes and header weight are fixed cssText, not theme values; the close weight comes from the browser. The header inherits the picker portal's Roboto font family, while the close button uses Arial.

An earlier reused, hidden browser tab had a frozen document timeline/loading state; manual plugin/progress API setup there was not used as measurement evidence. A new visible page loaded the drawer normally without those interventions. Remote layer/legend warnings did not prevent that fresh demo from rendering or drawing.

For isolation, added only an in-memory second map (`drawerInventoryB`) on the same visible page, based on the same drawer config with its remote layer list emptied and theme set to `canada.ca`; set its language to French through `setLanguage('fr', false)`. No fixture files or application source were created. Map A retained Roboto/English; map B's labels computed to Helvetica Neue/Helvetica/Arial and French, confirming distinct map theme/language contexts. Programmatic trigger clicks kept both StylePanels mounted concurrently without incidental pointer click-away. Then opened real MuiColorInput pickers; no fake picker DOM was used.

| Old hand-off item | Status at the D1 inventory | Source and browser evidence / proposed disposition at D1 |
| --- | --- | --- |
| a. Static 12px `.drawer-tooltip` measurement label | **Still applies; not fixed** | CSS line 10 and helper class assignment at 3012 remain. Both drawn feature labels computed to 12px / 700 / 18px. Add the map-local controller typography bridge described above; include the previously deferred bold weight. |
| b. cssText picker header 14px and close glyph 16px | **Still applies; not fixed** | `style.tsx:290` and `:302` remain literal. Header additionally hard-codes 500 at line 291. Measured 14px / 500 / normal and 16px / 400 / normal. Use body2 size + medium and body1 size respectively, pending the flagged role approvals. |
| c. Global observer injecting into another map's picker | **Still applies; reproduced both directions** | `style.tsx:277` globally queries every `.MuiColorInput-PopoverBody`; `:337`-`:338` observes all body descendants. With French B's observer mounted first, English A's picker received `Choisissez une couleur`. Reversing mount order made French B's picker receive English `Pick a colour`. Both StylePanels remained expanded; only one injected close/header appeared, because the first observer's parent-level close-button guard wins. B's picker header still used Roboto, despite B's map labels using Helvetica. Keep body portals/provider context; replace global scanning with per-owned-popover setup, not a map-subtree query that cannot reach the portal. |

The unrelated map B geometry popover received zero injected headers; after the picker exit completed, the document had zero `.color-picker-close-btn` elements. The demonstrated contamination is specific to colour-input popovers matched by the global selector, not evidence that every MUI popover is modified. The second-map fixture was deleted through the API after testing; its DOM removal was verified.

Step 1 did not test a 62.5% host root, custom typography-scale overrides, or live theme updates: these remain implementation acceptance tests, along with existing/new/hidden/history labels, independent maps, portal positioning/stacking, focus, and closing behavior. No size, weight, colour, spacing or timing was changed by this step.

### D3 implementation and verification

**2026-11-04 scope correction:** The measurement-label migration described below is historical and has
been rolled back. Labels again use fixed `12px`/`bold` CSS, with the original static creation helper and
no typography setter or React synchronization. The Draw button is absent on static maps, so its effect
could not supply typography for API imports. Moving it into core `Map` fixed availability but added
plugin-specific lifecycle coupling. Theme-aware measurement styling is deferred to a separate PR;
consider map-scoped themed CSS rather than another controller bridge. Picker typography and ownership
improvements remain. The measurement scaling and setter results below do not describe current behavior.

The D1 mappings are now approved and implemented. Measurement CSS no longer declares font size or
weight. The always-mounted `buttons/draw.tsx` reads its map's `caption.fontSize` and `fontWeightBold`
and calls `DrawerController.setMeasurementTypography` from its theme-dependent effect. The controller
stores those values per instance, updates existing measurement elements in that map's overlay
collection, and applies them in its now-instance `#createMeasureTooltip`. All seven creation/recreation
call sites use that instance helper, including drawing, import, transform and history paths.
No global theme, document-wide typography variable or other map's DOM is used.

The D2 picker-owned paper-ref setup now applies `body2.fontSize` / `fontWeightMedium` to the header
and `body1.fontSize` / `fontWeightRegular` to the close glyph, both on creation and while open when
the owning theme changes. Calibrated strings are passed through unchanged; numeric sizes receive
`px`, and weight tokens are stringified. DOM helper parameters are styled with `style.setProperty`
rather than reassigned; no lint disables were added. Field labels remain `subtitle2`; geometry
Buttons remain `size="small"`. Both drawer typography lint exemptions were removed.

The complete before/after matrix used two actual maps on one page, light/English and
canada.ca/French, based on `15-package-drawer.json` with remote layers omitted. Each map completed
a real OpenLayers Draw interaction for a line and polygon (`appendCoordinates` / `finishDrawing`),
enabled measurements and opened its real colour picker. Both pickers were open together for
measurements. The fixture was session-only, with the root established before loading GeoView.
CDP `Page.setFontSizes` set each browser default before theme construction; a native `font: medium`
probe and computed `html` size verified every setting. Fresh documents prevented calibration reuse.
The before build used committed D2 (`db0eaad`) source for the four affected runtime files via a
session-only webpack pre-loader, with output outside the worktree; the after build used D3.
Earlier exploratory runs whose roots/probes were not applied correctly are excluded.

Each cell below is computed **size / weight**, and applies independently to both maps and both
measurement geometries. All sizes are px.

| Browser default | Host root setting (computed root) | Measurement before -> after | Picker header before -> after | Close glyph before -> after |
| --- | --- | --- | --- | --- |
| 16px | 16px (16px) | 12 / 700 -> 12 / 700 | 14 / 500 -> 14 / 500 | 16 / 400 -> 16 / 400 |
| 16px | 62.5% (10px) | 12 / 700 -> 12 / 700 | 14 / 500 -> 14 / 500 | 16 / 400 -> 16 / 400 |
| 20px | 16px (16px) | 12 / 700 -> 15 / 700 | 14 / 500 -> 17.5 / 500 | 16 / 400 -> 20 / 400 |
| 20px | 62.5% (12.5px) | 12 / 700 -> 15 / 700 | 14 / 500 -> 17.5 / 500 | 16 / 400 -> 20 / 400 |

Measurement line-height remains inherited at 1.5: 18px at the normal default, naturally scaling
to 22.5px with the 15px label. Header/glyph computed line-height remains `normal`. No line-height
or letter-spacing override was introduced. Before/after comparisons found no changes to weights,
colours, padding, field-label typography, picker font families, header counts, portals or z-index.
Both portals remained under the body, with one correctly localized header each and z-index 1300.

Changing only map A from light to canada.ca triggered exactly its setter (`1.2rem`, 700 in the
20px-default / 62.5% case); map B's setter was not called and its labels stayed byte-for-byte
unchanged in the measured properties. Existing hidden labels updated, then displayed at 15px/700;
new line/polygon labels and an undo/redo-recreated label also used 15px/700. The built-in themes
have the same scale, so the theme switch preserves size while changing A's inherited font family.
A separate numeric setter check produced `12px`/700 on all A labels without changing B, then
restored the calibrated token.

D2 checks passed for both opening orders and simultaneous pickers: one English/Roboto header
and one French/Helvetica header, with no cross-map injection. Single-picker focus entry, eight
Tab/Shift+Tab steps, close-glyph closing, and actual outside pointer-click closing passed in both
maps. Live language/theme changes updated an open header without replacing the focused close
button. The unrelated geometry popover received no header. Synthetic backdrop clicks and
background drawing while multiple modal pickers were open were not used as focus/closing
acceptance evidence; real pointer clicks and isolated active-modal checks were used instead.

Validation passed: targeted Prettier write/check; repo-wide `npm run lint` (zero errors/warnings);
drawer `rushx build`; core `node node_modules/typescript/bin/tsc --noEmit`; core `rushx build-dev`;
and `git diff --check`. Public styling guidance and the AI lint-maintenance reference now include
drawer typography rather than listing it as an exemption. No commit was made.

### Progress notes

- 2026-11-04 - D3 measurement labels: restored pre-branch 12px/bold CSS and static helper; removed measurement typography state/setter and React effects. Theme migration deferred; picker improvements retained.
- 2026-11-03 - D2: replaced the global observer with each MuiColorInput's `PopoverProps.slotProps.paper.ref`; headers update in place using their owning map's language/font family, retaining the body portal, 14px/500 header and 16px/400 glyph; two-map light/English and canada.ca/French isolation passed in both opening orders and with both pickers open, including live language/theme updates, positioning, z-index 1300, focus entry/Tab containment, close-glyph/outside-click closing and unrelated-popover isolation; Prettier, repo-wide lint, drawer `rushx build`, core `rushx build-dev` and `git diff --check` passed; no commit.
- 2026-11-03 - D3: drawer measurement/picker typography now uses owning-map caption/body2/body1 sizes and Bold/Medium/Regular tokens; both exemptions removed; full two-map/default/root before-after matrix, isolated theme updates, hidden/new/history labels and D2 checks passed; formatting, zero-finding repo lint, drawer build, core type-check/build-dev and whitespace checks passed; not committed.

## Implementation progress

- 2026-10-29 - Calibration: committed; prototype evidence verified browser-default/host-root independence within its tested scope.
- 2026-10-29 - Theme foundation: committed; scale, variants, calibration, compatibility values and per-map theme memoization.
- 2026-10-29 - Batch 1: committed; overview-map toggle uses its owning map's React/theme context.
- 2026-10-30 - Batch 2: committed; core UI wrappers and standard MUI defaults.
- 2026-10-30 - Batch 3a: committed; app bar, nav bar, footer and notifications.
- 2026-10-30 - Batch 3b: committed; layers, legend, details and data table.
- 2026-10-30 - Batch 3c: committed; remaining core UI, including final body1 geolocator results/messages/filter summaries.
- 2026-10-30 - Batch 4a: committed; filter panel and time slider.
- 2026-11-02 - Batch 4b: committed; About, AOI, custom legend and GeoChart.
- 2026-11-02 - Batch 5c: committed; legend scale keys, numeric compatibility/deprecation, runtime guard and schema correction.
- 2026-11-02 - Batch 6: committed; lint/selectors, hover/touch tooltip sizes and developer/integrator documentation.
- 2026-11-03 - Batch S: STAC browser typography migrated; Datacube, NAPL, and Sentinel browser measurements matched across both themes and host roots; included in shared typography lint.
- 2026-11-03 - Batch S follow-up: compact Buttons use MUI's default 13px small size; local STAC Button font sizing removed.

## Evidence

Earlier browser/validation evidence is in `/Users/kenchase/.copilot/session-state/af3d5ce3-70c4-4214-92bb-9c0d3cd263b0/files/`:

- `typography-calibration-evidence.md` (Chrome/Firefox coverage; Safari was not tested).
- `typography-step3-evidence.md`.
- `overview-evidence.md`.
- `batch2-evidence.md`.
- `batch3a-evidence.md`.
- `batch3b-evidence.md`.
- `batch3c-baseline-results.json`, `batch3c-evidence.md`, `batch3c-results.json`.
- `batch4a-evidence.md` and adjacent `batch4a-*` evidence files.

Original reconciliation backup: `/Users/kenchase/.copilot/session-state/a815e068-ab0a-4aa6-8a35-c2b8eaff9733/files/TYPOGRAPHY_PLAN.md.before-reconciliation`.
