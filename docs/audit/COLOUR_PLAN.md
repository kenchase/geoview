# Colour normalization plan

## Audit basis and limits

This is a planning inventory, not a change request or a claim that every candidate is wrong. It separates observed code from decisions that need design intent. No application files were changed to produce it.

The workspace lockfile resolves `@mui/material` to **9.4.0** (`common/config/rush/pnpm-lock.yaml`); package manifests use `^9.4.0`. The MUI MCP does not offer 9.4 documentation: its available Material UI versions are 5.18.0, 6.5.0, 7.3.11, and 9.5.0. The comparison below therefore cites MCP-served 9.5 docs, calls out the 9.4 facts they explicitly give, and does not infer 9.4 availability for APIs whose introduction is not stated. This version gap is an open verification item, not permission to adopt an unverified API.

The source inventory scanned 869 tracked package files with code, stylesheet, HTML, or JSON extensions, excluding generated `types/` outputs and the prohibited stale `packages/geoview-core/public/builds/` artifacts. A static property/value scan found 680 literal color-like declarations: it is useful for locating values, but it is not a semantic classifier. Palette root values declared as `new GeoViewColorClass(...)`, runtime values passed through variables, and strings that cannot be associated with a CSS-like property are inventoried separately. Test fixtures, map symbology, demo pages, and third-party CSS are not assumed to be application UI defects.

## 1. Current theme and colour model

### Files and composition

| File | Contribution |
|---|---|
| [`default.ts`](../../packages/geoview-core/src/ui/style/default.ts) | Base `geoViewColors`, focus indicator, and the shared opacity constants. |
| [`types.ts`](../../packages/geoview-core/src/ui/style/types.ts) | `GeoViewColorClass`: `main`, indexed `light`/`dark` ramps, opacity, and contrast-text derivation; also defines `IGeoViewColors`. |
| [`light-theme.ts`](../../packages/geoview-core/src/ui/style/light-theme.ts) | Spreads the default palette, then overrides background, primary, text, and focus colours. |
| [`dark-theme.ts`](../../packages/geoview-core/src/ui/style/dark-theme.ts) | Spreads the default palette, then overrides background, primary, text, and focus colours; the background ramp is inverted. |
| [`geo-ca-theme.ts`](../../packages/geoview-core/src/ui/style/geo-ca-theme.ts) | Copies the default palette unchanged, including its focus indicator. |
| [`canada-ca-theme.ts`](../../packages/geoview-core/src/ui/style/canada-ca-theme.ts) | Spreads the default palette, then overrides background, primary, secondary, text, and grey; also exports its font stack. |
| [`themeOptionsGenerator.ts`](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts) | Maps GeoView colours to MUI palette keys, declares the MUI component overrides, and defines the root `focusVisible` styling. |
| [`material-ui.d.ts`](../../packages/geoview-core/src/core/types/material-ui.d.ts) | Augments MUI `ThemeOptions`, `Palette`, and `PaletteOptions` for GeoView extensions. |
| [`theme.tsx`](../../packages/geoview-core/src/ui/style/theme.tsx) | Selects the color definition, calls `createTheme`, and declares the extra `Palette.border` type. |
| [`map-schema-types.ts`](../../packages/geoview-core/src/api/types/map-schema-types.ts) and [`schema.json`](../../packages/geoview-core/schema.json) | Define and validate the four display-theme names. |
| [`app-state.ts`](../../packages/geoview-core/src/core/stores/states/app-state.ts), [`ui-domain.ts`](../../packages/geoview-core/src/core/domains/ui-domain.ts), [`ui-controller.ts`](../../packages/geoview-core/src/core/controllers/ui-controller.ts), and [`map-viewer.ts`](../../packages/geoview-core/src/geo/map/map-viewer.ts) | Store, set, and expose the selected display theme. |
| [`app-start.tsx`](../../packages/geoview-core/src/core/app-start.tsx) | Reads the map-scoped display theme and wraps the app in `ThemeProvider` using `getTheme(theme)`. |
| [`overview-map.tsx`](../../packages/geoview-core/src/core/components/overview-map/overview-map.tsx) | Creates a nested provider with fixed `cgpvTheme` (`geo.ca`) for the overview-map toggle. |

The app-config theme is selected per map, stored in app state, and passed to `getTheme` by `AppStart`. `getTheme` chooses one of four configurations and makes a **separate `createTheme` result** for that selected configuration. The default configured display theme is `geo.ca`; `cgpvTheme` is also a `geo.ca` theme. The overview map is a nested exception and always receives that fixed theme. This is not currently one MUI theme with multiple MUI color schemes.

There are four project display themes, but they are not four equal light/dark modes:

| Display theme | Relationship and authored root colours |
|---|---|
| `geo.ca` | Default palette, unchanged: `bgColor #F1F2F5`, `primary #515BA5`, `textColor #393939`, `secondary #1976d2`, `success #2e7d32`, `error #d32f2f`, `warning #ed6c02`, `info #2e7d32`, `grey #9e9e9e`, `white #FFFFFF`; focus outline `#000`, halo `#fff`. |
| `light` | Default palette with `bgColor #F9F9F9`, `primary #0066CC`, `textColor #000000`, focus outline `#000`, halo `#fff`. Other roots are inherited. |
| `dark` | Default palette with `bgColor #3C3E42` and inverse ramp generation, `primary #8ec4fa`, `textColor #ffffff`, focus outline `#fff`, halo `rgba(0, 0, 0, 0.8)`. Other roots are inherited. |
| `canada.ca` | Default palette with `bgColor #F8F8F8`, `primary #26374A`, `secondary #5b7592`, `textColor #000000`, and `grey #969696`; focus colors are inherited. Its font is `'Helvetica Neue', Helvetica, Arial, sans-serif`. |

### Generated palette structure

`GeoViewColorClass` generates `dark` and `light` entries at 20 indexed levels, `50` through `1000` in increments of `50`, by calling MUI `darken`, `lighten`, and `alpha`. The inverse flag swaps the lighten/darken operations for the dark background. These are color values used both by UI styles and non-MUI map/rendering code; they are not just a replacement for MUI's four `main`/`light`/`dark`/`contrastText` palette slots.

For each theme, `generateThemeOptions` sets the following palette:

| Palette key | Current value construction |
|---|---|
| `common.black`, `common.white` | Fixed `#000`, `#fff` for every display theme. |
| `primary` | `main` = GeoView primary `main`; `light` = primary `light[600]`; `dark` = primary `dark[200]`; `contrastText` = custom luminance-threshold calculation. |
| `secondary` | Currently constructed from **GeoView primary**, not GeoView secondary: `main` = primary `main`, `light` = primary `light[600]`, `dark` = primary `dark[300]`, and `contrastText` = primary contrast. The `canada.ca` secondary override therefore does not flow into `theme.palette.secondary`. |
| `error`, `warning`, `info`, `success` | Each uses its matching GeoView root with `light[600]`, `dark[300]`, and calculated contrast text. GeoView `info` and `success` both start at `#2e7d32`. |
| `text` | `primary` = `textColor.light[50]`; `secondary` = `textColor.light[500]`; `disabled` = fixed `rgba(0, 0, 0, 0.38)` in every display theme. |
| `divider` | Fixed `rgba(0, 0, 0, 0.12)` in every display theme. |
| `background` | `paper` = `bgColor.light[600]`; `default` = `bgColor.light[500]`. |
| `action` | `active` = GeoView primary main; `hover`, `selected`, and `focus` are opacity-derived primary colors; opacity constants are hover `.08`, selected `.16`, focus `.12`, disabled `.38`, activated `.24`; `disabled` is fixed black `.26`, and `disabledBackground` is black at focus opacity. |
| `contrastThreshold`, `tonalOffset` | Explicitly set to `3` and `0.2`; the palette's light/dark shades are already supplied directly. |
| `backdrop` | Custom, fixed `#3F3F3F50` across display themes. |
| `geoViewColor` | Custom nested palette containing the GeoView color objects, including their generated ramps and `focusIndicator`. |
| `geoViewFontSize`, `geoViewSpacingAndSizing` | Custom palette entries but not colour tokens; included here only because they are part of the actual augmented palette. |

No `palette.mode`, `colorSchemes`, `cssVariables`, or `theme.vars` is configured or used. MUI documents light as the default palette mode. Consequently, the current `dark` display theme changes GeoView roots and generated overrides, but does not set MUI's mode to dark; built-in MUI dark palette defaults are not selected. The fixed disabled text, divider, action-disabled values, and common colours also do not switch by display theme.

### Custom typing

`material-ui.d.ts` augments `@mui/material/styles/createPalette` with `backdrop`, `geoViewColor`, `geoViewFontSize`, and `geoViewSpacingAndSizing` on both `Palette` and `PaletteOptions`. It also augments `ThemeOptions` with a top-level `geoViewColor` field. `theme.tsx` separately augments `Palette` with `border.primary`; this key is not populated in the generator and no use was found in the scanned source. The palette extensions other than `border` are used in the generated palette.

### Colour in `theme.components`

`themeOptionsGenerator.ts` sets colour values in:

- `MuiTooltip`: background from `bgColor.dark[800]`, text from `bgColor.light[800]`.
- `MuiPaper`: border and shadow from alpha-adjusted `bgColor`.
- `MuiListItem`: layer-panel background, selected border, status backgrounds, and status text from GeoView colours; transparent/unset states; the `dragging` object uses the misspelled key `backgroundcolor`, a one-off likely not emitted as CSS.
- `MuiButton` and `MuiIconButton`: shared hover, active, disabled, outline, filled, and focus colour rules, based on primary, white, and background shades.
- `MuiTabs`: background from `bgColor.dark[100]`, with a literal `#FF4081` indicator.
- `MuiTab`: text from `textColor` and selected text from primary.
- `MuiTypography`: global text from `textColor.main`.
- `MuiInputBase`: placeholder text and keyboard focus outline/halo.
- `MuiFormLabel`: label and focused-label text from `textColor`.

The root-level `focusVisible` theme option also receives GeoView outline and halo colors. This is a MUI API, not a palette key; MUI's MCP documentation says it is available starting in v9.4.

## 2. Assessment against MUI conventions

### Version and evidence boundary

The MUI MCP pages used are its 9.5.0 pages for [CSS theme variables](https://llms.mui.com/material-ui/9.5.0/customization/css-theme-variables/overview.md), [configuration](https://llms.mui.com/material-ui/9.5.0/customization/css-theme-variables/configuration.md), [usage](https://llms.mui.com/material-ui/9.5.0/customization/css-theme-variables/usage.md), [native color](https://llms.mui.com/material-ui/9.5.0/customization/css-theme-variables/native-color.md), [palette](https://llms.mui.com/material-ui/9.5.0/customization/palette.md), [dark mode](https://llms.mui.com/material-ui/9.5.0/customization/dark-mode.md), [focus visible](https://llms.mui.com/material-ui/9.5.0/customization/focus-visible.md), and [deprecated APIs](https://llms.mui.com/material-ui/9.5.0/migration/migrating-from-deprecated-apis.md). The MCP's 9.4 lookup failed because that version is unavailable there.

| Gap or fit | What GeoView does | What MUI documents | Why MUI's approach exists | Adoption cost / cost of not adopting |
|---|---|---|---|---|
| CSS variables and `theme.vars` | No `cssVariables` option, CSS theme variables, or `theme.vars`; app styles mostly resolve theme values in JS through `ThemeProvider`. | `cssVariables: true` generates CSS variables; `theme.vars` mirrors serializable theme values, and palette channel variables are generated for alpha colors. MUI recommends `theme.vars` in theme-aware styles. | CSS variables support theme changes without regenerating every component style, improve token inspection, and allow scheme rules to be applied by CSS before paint. | **Adopt:** verify 9.4 support, update styles and external-theme fallbacks, account for generated CSS size and CSS-variable context; test nested providers and map-per-theme behavior. **Do not:** keep JS-based styling and token resolution; hardcoded styles still bypass the theme and mode changes can continue requiring new theme objects. The 9.5 MCP docs do not state when `cssVariables`/`theme.vars` were introduced, so availability in 9.4 must be verified before recommendation becomes implementation. |
| Separate themes versus `colorSchemes` | Each selected display theme is composed into a separate `createTheme` result. Four GeoView names mix a light/dark distinction with branding; Canada.ca also changes the font. | MUI calls `colorSchemes` an enhanced API, preferred for this purpose starting in **v6**. It supports light/dark palettes in one theme; the docs describe automatic system preference and cross-tab synchronization. The CSS-variable overview says additional schemes can be created. | One theme can represent mode-specific palettes without treating each mode as an unrelated theme; built-in scheme behavior includes mode selection and synchronization. | **Adopt:** decide whether the four GeoView display names are schemes or separate branded themes, retain per-map configuration semantics, and prevent system-preference defaults from overriding explicit config. Verify Canada.ca typography and fixed overview-map theming. **Do not:** continue duplicating theme creation and risk mode drift, including the current default-light `palette.mode` issue. `colorSchemes` is documented as available since v6, so its version is not a 9.4 blocker. |
| `palette.mode` and conditional styles | `palette.mode` is never set by the generator, but four style expressions inspect it. | MUI's dark-mode docs show `palette.mode: 'dark'` for a single dark palette. With CSS variables, MUI advises using `theme.applyStyles()` rather than `theme.palette.mode` for light/dark branches to avoid style flicker. | The mode is the semantic input that controls MUI's palette defaults; CSS-variable selector rules can style a scheme before React computes a different theme. | **Adopt:** first agree whether dark theme should be MUI dark mode and correct per-mode state; then retest the three affected components. **Do not:** the expressions continue to take light branches for a dark display theme. `theme.applyStyles` is only a candidate if CSS variables are verified and enabled; the MCP does not state its introduction version, so verify 9.4 availability before using it. |
| Native color | GeoView precomputes shade ramps in JavaScript with MUI `lighten`, `darken`, and `alpha`; those values are used in CSS styles and map styles. | The MCP's 9.5 docs describe `nativeColor: true` under `cssVariables`; theme color functions then use relative CSS colors/`color-mix()` and modern spaces. The page warns that it only works in modern browsers. | CSS-native transformations can operate in modern color spaces and derive values without JavaScript color manipulation. | **Adopt:** browser support and visual/contrast differences need testing; confirm every consumer can accept CSS color expressions. In particular, OpenLayers and exported map styles may not accept CSS relative-color syntax. **Do not:** retain JS-generated shades and their repeated manual tuning. The MCP does not state `nativeColor`'s introduction version and the 9.4 docs are unavailable; do not build the plan around it until 9.4 support is confirmed. |
| Custom GeoView palette names | `geoViewColor` wraps custom roles and repeats several roles also set directly on `palette`. | MUI already has `primary`, `secondary`, `error`, `warning`, `info`, `success`, `grey`, `common.black/white`, `text`, `divider`, `background`, and `action`. MUI allows custom colors but expects their token shape to be defined/augmented. | Standard names let components and MUI utilities select purpose-based colors consistently; they also avoid two separately maintained sources for one role. | **Adopt:** migrate UI usage only after identifying consumers that require extended ramps, optional external themes, or non-UI rendering; preserve those exceptions deliberately. **Do not:** duplicate values can drift, as shown by `secondary` being defined in `geoViewColors` but wired from primary in the MUI palette. |
| Focus indicator colours | GeoView keeps a nested `focusIndicator` outline/halo pair and uses it both in MUI's root `focusVisible` option and in custom styles. | MUI's [focus-visible feature](https://llms.mui.com/material-ui/9.5.0/customization/focus-visible.md) is documented as available starting in **v9.4**. It accepts an object to customize the outline, and supports an additional `boxShadow` layer for two-colour focus. GeoView's installed version is 9.4.0. | A shared MUI-level focus API supplies a consistent keyboard indicator across ButtonBase components, including inset handling, while preserving high-contrast behavior. | **Adopt:** retain the deliberate outline/halo contrast, but decide whether the nested color source remains necessary for non-ButtonBase controls; ensure the existing `3px` width and custom keyboard-only behavior remain. **Do not:** leave the same color contract spread between MUI's API and custom selectors. This is a verified v9.4 fit, not a proposal to replace the WCAG design. |
| Custom background/text/grey roles | `geoViewColor.bgColor`, `textColor`, `grey`, and `white` coexist with MUI background/text/grey/common palette roles. | MUI's palette already distinguishes background `default`/`paper`, text `primary`/`secondary`/`disabled`, the grey ramp, and `common.black/white`. | Named semantic roles make intended use clearer than a shared appearance-based bag of colors. | **Adopt:** decide which MUI standard role is the source of truth and retain only roles with a separately justified contract. **Do not:** future UI code can continue selecting a visually similar shade from a role named for a different purpose. |
| Custom `backdrop` and `border` | `backdrop` is supplied as a custom palette color. `border.primary` is only declared on `Palette`, not supplied by the generator or used in scanned source. | The MUI palette documentation identifies `divider` and background/text roles; it does not establish an exact equivalent for GeoView's `backdrop` usage. MUI permits deliberate custom palette tokens and TypeScript augmentation. | A custom token is justified when its semantic contract is genuinely distinct, rather than just another name for an existing role. | **Adopt:** verify whether the backdrop value should follow mode and whether `border.primary` is dead typing; keep any genuinely distinct token. **Do not:** custom API surface remains larger than the values used. No exact MUI equivalent for `backdrop` is claimed here. |

**Standard-palette duplication found:** `geoViewColor.primary`, `secondary`, `success`, `error`, `info`, `warning`, `grey`, and `white` overlap MUI `palette.primary`, `secondary`, etc., `palette.grey`, and `palette.common.white`. `geoViewColor.bgColor` overlaps `palette.background`; `textColor` overlaps `palette.text`. `focusIndicator` overlaps part of MUI's v9.4 `focusVisible` styling contract, but remains used to generate custom focus styles. `backdrop` and the 20-step ramps have no exact equivalent established by the fetched docs. The font/spacing palette additions are outside this colour audit.

**Deprecated APIs:** no use was found of MUI's deprecated `Divider.light`, color-related System props such as standalone `bgcolor`, or legacy composed color class selectors in the scanned application source. MUI's 9.5 Typography API still documents the component `color` prop used by the app (including `error` and palette text colors); this is distinct from deprecated standalone System props. `theme.palette.mode` is valid, not deprecated; it is simply a poor conditional mechanism if CSS variables are enabled. No color API migration is proposed here. MUI 9.5's deprecated-API page documents other non-color deprecations; those are outside this report. The MCP cannot certify the complete 9.4 deprecation list.

**Newer-version consideration:** the MCP only exposes 9.5 docs. Its `nativeColor` page is therefore an exploratory option, not a 9.4 recommendation; the page does not state its introduction version. Do not add an API solely because it appears in the 9.5 docs. `colorSchemes` (v6) and `focusVisible` (v9.4) have documented introduction versions.

## 3. Colour application patterns and inventory

### Counting and clustering method

Property/value counts below are mechanical candidates, not an assertion that a value is wrong. The scan normalizes case and whitespace, groups by value **and** property, and lists the files/components where each cluster concentrates. Palette token counts are reference counts, not computed rendered-color counts. Values passed through a variable or component prop may not appear in the literal-property scan. When intent is not inferable from property/token names, entries are explicitly called candidates.

### A. Hardcoded values in runtime UI source

**Definition/detection:** literal CSS color values and named colors in source styles, inline styles, CSS files, and style-valued properties. This includes RGB/RGBA, hex, named colors, and `transparent`. In tracked package runtime source (excluding separate theme generator/source, map engine, fixtures, and demos), the scan found **133 occurrences, 31 normalized values, and 54 value/property clusters**. Detection is mechanical; whether each value is a brand token, state color, browser keyword, or intentional exception requires judgment.

| Value | Property | Count | Concentration |
|---|---|---:|---|
| `transparent` | `background-color` | 19 | `left-panel-styles`, `app-bar-style`, `legend-styles`, `mouse-position-style`, `scale-style` |
| `white` | `color` | 17 | `nav-bar-style` (7), `footer-bar-style` (3), then responsive-grid, guide, scale |
| `grey` | `color` | 13 | `layer-list-style` (3), AOI, data-panel, data-table, guide, layer-details |
| `white` | `background-color` | 10 | `layer-icon-style` (4), layout, responsive-grid, map-style, notifications |
| `grey` | `background-color` | 5 | AOI, app-bar, crosshair, add-layer, scale |
| `white` | `background` | 4 | `useWhatChanged` (3), containers |
| `white` | `fill` | 4 | nav-bar |
| `white` | `stroke` | 4 | nav-bar |
| `#ccc` | `border` | 3 | export-modal (2), drawer button style |
| `transparent` | `background` | 3 | details, layer-settings, legend |
| `transparent` | `outline-color` | 3 | app-bar, nav-bar, switch |
| `grey` | `border-bottom` | 2 | left-panel, custom legend |
| `grey` | `border-color` | 2 | containers, geochart |
| `rgb(0 0 0 / 65%)` | `box-shadow` | 2 | map-style |
| `rgba(50,50,50,0.75)` | `background-color` | 2 | swiper |
| `transparent` | `border-left` | 2 | legend, measurement CSS |

**Other runtime UI clusters (one-offs, count 1 each):** `#000` text (slider); `#000000` text/fill state values (drawer state); `#0000ff` and `#ff0000` text or fill/stroke in map-config test helpers; `#1976d2` outline (card-media); `#393939` text and `#515ba5` border (custom legend); `#cccccc`, `#dddddd`, `#e0e0e0`, `#f5f5f5`, `#ffffff`, `#fff` (map/canvas/time-slider/checkbox/accordion/swiper styles); black text/fill (overview-map/export); grey background/border/shadow (map-info/app-bar); and single RGBA overlays/shadows in measurement, map, drawer, slider, and drawing styles. These are candidates for review; several are intentionally stateful, map-specific, or shadow colors.

**Concentration and overlap:** most repeated UI literals are in core component style modules, and the largest repeated values are `transparent`, `white`, and `grey`. Literal `#515ba5` in custom-legend and static CSS matches the `geo.ca` primary root; `#393939` matches the default text root; `#1976d2` matches the default GeoView secondary root. These overlaps point toward checking for one missing/ignored token rather than treating each occurrence as an independent color defect.

### B. Literal values in theme source and overrides

The scan found **30 property-associated literal occurrences, 10 normalized values, and 15 clusters** in theme source. This does not include palette roots listed in Part 1, because those are constructor arguments rather than CSS property declarations.

| Value | Property | Count | Files/components |
|---|---|---:|---|
| `transparent` | `background-color` | 7 | theme button overrides |
| `white` | `color` | 5 | theme button overrides |
| `#000` | `outline` | 3 | default and light focus; vendor CSS |
| `transparent` | `border` | 3 | theme button overrides |
| `#000000` | text-color | 2 | light and canada.ca roots |
| `#000` | `color` | 1 | vendor CSS |
| `#515ba5` | `background-color` | 1 | vendor CSS |
| `#ff4081` | `background-color` | 1 | `MuiTabs` indicator |
| `#fff` | `box-shadow`, `color`, `outline` | 1 each | vendor CSS and dark focus |
| `#ffffff` | text-color | 1 | dark theme root |
| `grey` | `background` | 1 | theme component override |
| `white` | `background-color` | 1 | vendor CSS |

The top override outlier is the one-off pink `MuiTabs` indicator. The component override also uses the typo `backgroundcolor` for the dragging state, so that particular color application is a candidate for a property-name fix, not a new token.

### C. Theme token/property mismatches — candidates

**Definition/detection:** compare the token name with the CSS property it sets. The direct scanner found **28 occurrences in 7 token/property clusters** that warrant review. These are **candidates**, not findings: a background shade can intentionally be selected as foreground for contrast, and the final choice requires visual/contrast intent.

| Token | Property | Count | Concentration |
|---|---|---:|---|
| `geoViewColor.bgColor.dark[...]` | text `color` | 13 | mouse-position (4), nav-bar (4), app-bar, map-info, map-info expand, scale, panel |
| `geoViewColors.bgColor.dark[...]` | text `color` | 5 | disabled/ARIA-disabled states in theme button overrides |
| `geoViewColor.bgColor.light[...]` | text `color` | 5 | hover-tooltip (2), map-info rotation, notifications, scale |
| `palette.primary.contrastText` | `backgroundColor` | 2 | vertical and horizontal divider styles |
| `geoViewColors.bgColor.light[...]` | text `color` | 1 | tooltip override |
| `geoViewColor.bgColor.darken(...)` | text `color` | 1 | details style |
| `geoViewColor.bgColor.dark[...]` | text `color` | 1 | scale component |

There is no mechanically detected reverse case of a `textColor` token used for a background in the scanned styles. `palette.primary.contrastText` used as a divider background is an additional semantic candidate, not automatically wrong: confirm the intended divider contrast before changing it.

### D. Non-semantic but valid token usage — judgement candidates

**Definition/detection:** a token is valid for the property, but may have been chosen for its appearance instead of a stable purpose. This cannot be established mechanically.

- `geoViewColor.grey` appears **18 times** across text (6), background-color (5), border-bottom (2), border-color (2), background (1), border-top (1), and box-shadow (1). It is concentrated in AOI, data-table/data-panel, guide, scale, slider, app-bar, crosshair, left-panel, custom-legend, containers, and geochart.
- MUI `palette.grey` appears **9 times**: text/color in layer-list, data-skeleton, layer-details, opacity-control, legend and one box-shadow in map-info. Several are likely legitimate neutral uses; confirm whether they represent semantic text, a divider/border, or a neutral surface.
- GeoView primary is used for text, backgrounds, fills, and borders across navigation, selected/active controls, layout, layers, and STAC components. These are not automatically non-semantic: “primary” may accurately describe an active/brand state. Review instances where it is used for a neutral or status-specific role.
- GeoView secondary appears as a darkened background in two container rules and a border in guide styling; confirm whether those roles mean “secondary” or merely reuse its hue.

This category overlaps the mismatch and hardcoded categories: e.g. a literal matching a theme grey and a `grey` token used for a divider may be two manifestations of the same absent semantic divider role. Do not count those as independent palette needs until intent is reviewed.

### E. Theme token application clusters

Across source style properties, the mechanical token scan found **387 theme-related references** (one is a `palette.mode` conditional), **58 distinct token expressions**, and **117 token/property clusters**. This includes 233 uses rooted at `theme.palette.geoViewColor`, 53 default `geoViewColors` references in the generator, and 101 MUI palette references. The remaining MUI references include `primary` (20), `action` (19), `divider` (24), `background` (4), `secondary` (2), `text` (13), `grey` (9), `warning` (2), and `common` (7); totals overlap with the 387 aggregate as listed, and `mode` accounts for one non-colour conditional.

| Token | Property | Count | Components with highest concentration |
|---|---|---:|---|
| `geoViewColor.textColor.main` | text | 29 | STAC browser (8), nav-bar (3), layer-details (2), custom-legend (2) |
| `geoViewColor.textColor.light[...]` | text | 18 | STAC browser (5), legend (3), guide (2), layer-details (2) |
| `geoViewColor.bgColor.light[...]` | background-color | 15 | nav-bar (5), attribution, layer-list, responsive-grid |
| `geoViewColor.primary.main` | text | 15 | nav-bar, slider, STAC, app-bar, attribution |
| `geoViewColor.bgColor.dark[...]` | border-bottom | 13 | legend, nav-bar, notifications, app-bar |
| `geoViewColor.bgColor.dark[...]` | text | 13 | mouse-position and nav-bar (4 each), app-bar, map-info, scale |
| `geoViewColor.bgColor.dark[...]` | background-color | 12 | panel, layer-list, data-table, layer-details, legend |
| `geoViewColor.white` | text | 12 | nav-bar (4), footer-bar (3), responsive-grid, scale, slider |
| `palette.text.primary` | text | 12 | nav-bar (3), select (3), layer-list, export, geolocator |
| `palette.action.hover` | background-color | 11 | STAC (5), layer settings (2), data-table, add-layer |
| `palette.divider` | border-bottom | 10 | STAC (3), nav-bar (2), app-bar, full-screen dialog |
| `geoViewColor.grey[...]` | text | 8 | layer-list (3), data-table, layer-details, guide, scale |
| `palette.primary.main` | text | 8 | nav-bar (2), about, attribution, data-table, layer settings |
| `geoViewColor.white` | background-color | 7 | layer-icon (4), responsive-grid, notifications, containers |
| `palette.divider` | border | 6 | STAC (4), data-table (2) |
| `geoViewColor.primary.main` | background-color | 6 | nav-bar (3), responsive-grid, divider, STAC |

Other recurring clusters include `geoViewColor.bgColor.main` as a background (5), GeoView primary as border (6), GeoView primary as background (3), MUI `background.paper` as background-color (3), `palette.common.white` as text/fill/stroke, and `palette.action.selected` as background-color (4). Many remaining token/property clusters occur only once or twice; they need the same per-property review and are not automatically inconsistent.

### F. Derived colours, alpha, and opacity

**Definition/detection:** colour values produced through helper calls or partial transparency, rather than selected directly from a token. There are **34 source lines with `lighten`, `darken`, `alpha`, or `.opacity` calls in 13 files**, including the helper's own implementation; excluding `GeoViewColorClass` internals leaves 24 direct style-generation call lines. The repeated areas are `themeOptionsGenerator`, containers, details, layer-list, map-info, left-panel, app-bar, crosshair, and slider.

`GeoViewColorClass` generates 20 lighter and 20 darker values per instance; `opacity()` and the optional alpha parameter use MUI `alpha`. The generated shades are then separately selected by index in styles. There are also explicit RGBA values in the literal inventory, MUI action-state opacity values, and CSS `opacity` declarations. The latter include animation/visibility use and are not all colour defects; only cases that visually substitute for a semantic color need judgment.

**Remedy distinction:** UI component states can often use MUI palette roles and their `main`/`light`/`dark` values; opacity-only states may fit MUI `action` tokens or CSS-variable channel tokens. Map renderer/feature colors are consumed outside ordinary CSS and must be handled separately. `nativeColor` cannot be assumed to work for those consumers.

### G. Colours passed as props, stored in configuration/data, and map rendering

**Definition/detection:** color values stored in configs, data, or state and passed to non-theme consumers. These require a different remedy from replacing UI literals: MUI UI palette normalization must not silently rewrite user-authored layer symbology or OpenLayers renderer inputs.

- The parsed source/config inventory has **173 property-associated literals, 76 normalized values, and 78 value/property clusters** in JSON fixtures/configuration. Frequent groups are `rgba(0,0,0,1)` as color (39), `rgba(153,153,153,0.251)` (11), `rgba(255,255,255,0.502)` (6), `#000000` fill (4), and `rgba(128,0,0,1)` (3). Repeated color groups concentrate in `25-configured-feature-labels.json`, `esri-feature-errors.json`, `esri-feature.json`, `29-symbol-shapes-fill-patterns.json`, `00-basic-footer-appbar-combo.json`, `27-complex-classifications.json`, `metadata.json`, and the WFS/CDTK fixtures. The remaining 48 clusters are single occurrences, chiefly individual feature/ramp colors in test-data JSON; they are one-off symbology data, not evidence for UI tokens.
- Runtime map-engine code has **48 literal occurrences, 27 normalized values, and 30 value/property clusters**, concentrated in `transform-base.ts`, `feature-highlight.ts`, `geometry.ts`, `utilities.ts`, `layer-mockup.ts`, and `wfs-renderer.ts`. Repeated examples: `#333` text (4) and stroke (2); `blue` text (3); `orange` text (3); transparent color (3); and two each for `aqua` stroke, `green` text, `rgba(100,100,100,0.5)`, `rgba(128,0,128,1)`, `rgba(160,160,160,0.8)`, `rgba(255,0,255,0.5)`, and `rgba(255,235,59,0.8)`. Most others occur once as Fill/Stroke/highlight values.
- Drawer drawing colors are user/data driven: `fillColor`, `strokeColor`, `textColor`, and `textHaloColor` flow through store state and component props into SVG attributes and drawing styles (`geometry-picker.tsx`, drawer style state/config). The observed `#000000` and white/alpha halo fallbacks are defaults for that feature, not MUI text/background tokens. Whether configurable drawing colors should share a design palette is a product/API decision.

**Conditional colour logic:** four `theme.palette.mode` references occur in three components: two branches in tabs, one in mouse-position, and one in version styling. The first two choose black/white or an alpha-derived overlay; version styling chooses secondary contrast text or GeoView primary light. Because the theme generator never sets `palette.mode`, these branches currently see MUI's default light mode even when the display theme is `dark`. The component locations are mechanical; whether their intended visual behavior should change is a decision. MUI says `theme.applyStyles()` is the scheme-aware alternative when using CSS variables.

### H. Static CSS, public assets, and demos

These are separate mechanisms and scopes; some are third-party or example styling and should not automatically be moved into the application palette.

| Scope | Count | Repeated clusters (count, property, concentration) |
|---|---|---|
| Tracked `packages/**/public/css` stylesheets | **124 occurrences, 67 values, 83 value/property clusters** | `#ddd` border (7), `white` text (7), `#0f0` text (3), `#262626` background (3), `#333` text (3), `#404040` border (3), `#515ba5` background (3), `#c080ff` text (3), `#fff` text (3). The bulk is `style.css` and CodeMirror's `liquibyte.css`; many other clusters occur once. |
| Static/demo/release HTML styles | **165 occurrences, 49 values, 66 clusters** | `#6c757d` text (35) and `#d73a49` text (12) in `sandbox.html`; `#eee` border-bottom (15) in production-config/developer-tools release pages; `white` text (6); `#515ba5` border-bottom (5). The remainder is mostly singleton demo, test, release, and documentation-page styling. |
| Other package tooling source | **7 occurrences, 6 values, 7 clusters** | All are one-offs in `codedoc.js`: `#515ba5` border-bottom/text, `#666` background, `#fff` background, `orange` text, `rgba(0,0,0,0.5)` background, and `white` text. |

Mechanically, CSS/HTML values can be searched and clustered; judgment is needed to separate a GeoView viewer surface from documentation, browser metadata, test harnesses, examples, and vendored styles. Those surfaces should be triaged by owner before any mass replacement.

### I. Additional one-offs and overlaps

- `#FF4081` is a single selected-tab indicator in the theme generator.
- `backgroundcolor` in the `MuiListItem` dragging override is a lower-case style key, unlike MUI's `backgroundColor`; verify/fix that property independently of token taxonomy.
- Custom-legend hardcoded `#393939` matches the default `textColor` root; `#515ba5` matches the default primary root; the card-media `#1976d2` outline matches the GeoView secondary root. These overlap the literal and palette categories and are likely tokenization candidates, not three new colors.
- Hardcoded `white`/`black` overlap `palette.common.white/black`; CSS `grey` overlaps both MUI `palette.grey` and GeoView `geoViewColor.grey`. Which source is semantically correct needs review.
- `transparent`, `unset`, and color-bearing shadows are not interchangeable with solid palette entries; do not replace them with opaque values.

## 4. Recommended approach

### Decisions required before code changes

| Decision | Options and trade-off | Recommendation |
|---|---|---|
| What do the four display-theme names mean? | Keep four separate MUI themes; use all four as MUI color schemes; or use MUI schemes for light/dark while preserving geo.ca/canada.ca as branded theme variants. MUI prefers `colorSchemes` since v6, while Canada.ca has a distinct font and current map config names are public behavior. | Treat the distinction explicitly before changing provider structure. Start by mapping `light`/`dark` as appearance modes and `geo.ca`/`canada.ca` as brand choices; verify whether the desired product model supports composing those dimensions, or whether each current choice must remain a single scheme. |
| What selects light/dark: per-map config, user preference, or system preference? | Preserve explicit `theme` config and per-map `setTheme`; add a user toggle; follow `prefers-color-scheme`; or combine them with precedence rules. MUI `colorSchemes` provides system and cross-tab behavior, which can conflict with explicit map configuration. | Preserve explicit config as authoritative for existing maps. Decide separately whether a user/system preference is desired and define precedence before using built-in selection/storage behavior. |
| Which palette is canonical for UI roles? | Use MUI standard palette roles; retain the full GeoView role bundle; or keep an explicit subset for special behavior. | Use MUI's standard `primary`, `secondary`, `success`, `error`, `warning`, `info`, `text`, `background`, `grey`, `common`, `divider`, and `action` names where their purpose fits. Keep custom roles only when they represent a distinct contract, such as focus-ring styling or OpenLayers-specific ramps. Correct the current primary-to-secondary wiring as part of palette mapping, after confirming intended secondary behavior. |
| Should indexed GeoView shade ramps remain? | Replace UI use with MUI's four conventional color slots; keep current ramps globally; or retain ramps only for map rendering and cases needing exact indexed shades. | Prefer four semantic MUI slots for UI surfaces and states. Preserve a deliberate indexed ramp for consumers that need it, especially non-MUI map rendering, until consumer coverage and output compatibility are verified. |
| Is MUI `nativeColor` in scope? | Adopt where supported; use only for CSS; or defer. Modern CSS color functions may not be accepted by OpenLayers or every supported browser. | Defer. First confirm 9.4 availability through authoritative versioned docs and test every non-CSS consumer; do not use a 9.5-only assumption. |
| Which focus-ring contract is authoritative? | Use MUI `focusVisible` for ButtonBase only; centralize all colors in the MUI theme; or retain a common GeoView color source for custom controls. | Keep the existing outline/halo contrast requirements. Use the MUI v9.4 `focusVisible` API for supported MUI controls, and retain a shared source only for custom controls that cannot consume that API. Validate keyboard-only behavior and forced-colors behavior. |
| Which color surfaces are in scope for normalization? | Include UI, OpenLayers/map symbols, user-configured drawing colors, demos, tests, and vendor CSS together; or separate them by consumer/owner. | Normalize viewer UI first. Keep user map symbology and drawing colors as a separate API/data pass; do not rewrite test/sample colors, documentation styles, or vendored CSS unless their owners explicitly choose to do so. |

### Candidate palette structure

This is a proposal for review, not a statement of current tokens. Begin with MUI's own `palette` roles and values; avoid a parallel `geoViewColor` wrapper for roles already represented by MUI. Use `palette.background.default`/`paper` for surfaces, `palette.text.primary`/`secondary`/`disabled` for foreground text, `palette.divider` for separators, `palette.action` for interaction states, and the standard semantic color objects for primary/secondary/status states. Keep the root focus configuration under MUI's `focusVisible` API. Retain custom palette tokens only where the decisions above establish an additional contract (candidate examples: a true backdrop-specific value or a map-only indexed ramp); verify `border.primary` before preserving it.

### Candidate semantic groupings from observed clusters

These groupings are candidates, not final token names or accepted semantic roles:

1. **Surfaces and elevation:** repeated `white`/`grey`/transparent backgrounds, `bgColor` ramps, paper backgrounds, and alpha shadows. Confirm which are page, panel, tooltip, selection, and overlay surfaces.
2. **Foreground and muted text:** `white`, `grey`, `textColor`, and uses of `bgColor` as text. Resolve the 26 `bgColor`-as-text candidates before choosing a foreground scale.
3. **Brand and selected/active controls:** repeated primary text/background/border/focus colors and the pink tab indicator. Confirm whether `#FF4081` is intentionally distinct from the brand accent.
4. **Borders and separators:** grey borders, divider token references, primary selection borders, transparent boundaries, and `primary.contrastText` divider backgrounds. Confirm one stable border/divider role versus selected-state roles.
5. **Status and feedback:** error/info/registered layer backgrounds generated through lighten/alpha and status text. Check contrast in all four current themes.
6. **Keyboard focus:** the outline/halo pair already used in MUI `focusVisible` and custom focus styles. Preserve the WCAG contract; do not collapse the two layers without testing.
7. **Map symbology and drawing styles:** OpenLayers `Fill`/`Stroke`, feature highlight/transform handles, configured renderer colors, and drawer style props. Keep these separate from UI surface semantics unless a deliberate API bridge is selected.

### Pass grouping and sequence

| Phase | Categories and scope | Why here; verification before the next phase |
|---|---|---|
| 0. Lock decisions and baselines | Theme dimensions, mode precedence, canonical MUI roles, scope exclusions, contrast/focus expectations. Capture current appearances for all four display choices and representative map/drawing colors. | Avoids silently changing public theme names or user-configured symbology. Verify default `geo.ca`, each explicit theme, theme switching, nested overview map, and map-specific configuration. |
| 1. Repair theme structure and semantic mapping | Theme construction, palette mapping, `palette.mode`/color-scheme behavior, `secondary` wiring, custom type surface. | This is prerequisite to later token substitution. Verify computed theme values and all four themes before touching component styles; explicitly test mode-specific branches in tabs, mouse-position, and version styling. |
| 2. Normalize shared component overrides and high-frequency token/property candidates | `theme.components`, especially shared buttons, tabs, tooltip/paper, list-item states, text/form labels, and the `bgColor` foreground candidates. | Central overrides affect many components and can change contrast broadly. Check every display theme, disabled/error/selected/dragging states, keyboard focus, WCAG contrast, and the misspelled dragging property. |
| 3. Normalize reusable UI components and repeated literal clusters | Hardcoded runtime UI values and valid-but-appearance-driven grey/white/primary choices, one folder at a time. Prioritize high-frequency `transparent`, `white`, `grey`, and duplicated palette-matching literals. | Low-uniqueness but high-reach clusters should be handled only after the palette contract is stable. Verify both MUI theme and external-theme fallbacks for reusable `@/ui` components. |
| 4. Normalize derived UI colors and alpha states | `lighten`/`darken`/`alpha` call sites, opacity-derived interaction states, and shadows. | Derived colors depend on the final palette. Verify computed values, state contrast, transparency compositing, and visual equivalence; keep map-only ramps out of this pass. |
| 5. Migrate static first-party UI CSS | First-party CSS such as `packages/geoview-core/src/ui/style/style.css` and the drawer stylesheet; do not bulk-edit vendored CodeMirror styles. | CSS variables or explicit token bridges can now be selected without destabilizing the palette design. Verify stylesheet load order, variable availability, and behavior outside the GeoView provider. |
| 6. Separate map renderer and drawing styles | OpenLayers feature highlighting/transform tools, map geometry utilities, drawer props and persisted style configuration. | Highest risk: these are non-MUI consumers and user-visible map symbology may be API/config data. Verify rendering, editing, serialization, reloading, export, and supported color formats; test CSS-variable/native-color strings only if explicitly approved. |
| 7. Triage examples, tests, and third-party CSS | Demo/release pages, fixtures, sample layer configs, and public/vendor CSS. | These should not block UI normalization. Update only owned examples/tests when they document changed behavior; preserve intentional fixture colors and vendored files. Re-run affected release/test scenarios. |

### Multi-theme and light/dark ordering

The palette mapping and correct MUI mode/scheme selection must precede folder-by-folder token migration. Otherwise a component can be “normalized” to a token whose value remains light-only or whose custom role still diverges between themes. During each folder pass, compare the four existing display choices, not only one light/dark pair. Keep the current default `geo.ca`, `canada.ca` font, and fixed overview-map provider behavior until the theme-dimension decision explicitly changes them.

If `cssVariables` is adopted, do it after palette roles and scheme precedence are settled but before converting static CSS. Test that CSS variables are present for the correct map/theme scope and do not leak or resolve incorrectly across nested providers. Do not switch to `nativeColor` in that phase without version and OpenLayers compatibility evidence.

### Verification between phases

- Check palette output for each current display theme: `main`, `light`, `dark`, `contrastText`, background/text/action/divider values, and any deliberately retained custom extension.
- Verify the display-theme selector/config/schema/API continues to accept the same four names and that `setTheme` updates the correct map.
- For each folder, inspect MUI and non-MUI consumers, including optional external-theme fallbacks; run the smallest package build/type-check that covers the changed packages.
- Compare key UI states in all four themes: text, disabled, hover, selected, error/loading/registered layers, tooltips, borders, and shadows.
- Check keyboard-only focus indication, contrast across both outline/halo layers, forced-colors behavior, and focus inside clipped/inset components.
- If CSS variables are enabled, verify generated variables, `theme.vars` typing, no undefined variables under external/nested themes, no unwanted flash, and no unwanted system-preference override.
- For map/drawing changes, verify OpenLayers styles, editable features, saved/reloaded user styles, transparency, supported color strings, and exports; keep these checks separate from MUI component snapshots.
- Update existing source documentation only when the approved behavior/API changes. This planning document itself requires no test run.

### Open questions

1. Which MUI MCP/document source can provide authoritative **9.4.0** pages for `cssVariables`, `theme.vars`, and `nativeColor`? The available MCP only serves 9.5.0, and its native-color page does not state an introduction version.
2. Should light/dark be MUI color schemes, while Geo.ca/Canada.ca remain brand themes, or must each existing display-theme option remain an indivisible per-map selection?
3. Is MUI/system dark preference desired, or must explicit map configuration always win? What precedence should apply to persisted user selections?
4. Is `geoViewColors.secondary` expected to feed MUI `palette.secondary`? The current generator maps both MUI primary and secondary from GeoView primary.
5. Which GeoView indexed shade consumers are genuinely UI semantics versus OpenLayers/map renderer requirements?
6. Should the overview-map toggle intentionally stay on fixed `geo.ca`, or follow the enclosing map's selected theme?
7. Is the `backdrop` value intentionally fixed across themes, and is `Palette.border.primary` an unused legacy augmentation?
8. Are the demo/release HTML styles and public CodeMirror CSS in normalization scope, or should they remain independent examples/vendor assets?
