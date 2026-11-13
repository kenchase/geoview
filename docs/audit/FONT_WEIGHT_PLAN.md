## Status

Earlier batches are committed. Drawer D2 is committed; D3 weight-token migration is recorded below (not committed).

## Current typography

- Bundled Roboto has 300, 400, 500, and 700 faces, but no 600; a requested 600 renders as 700.
- The `canada.ca` font stack (Helvetica Neue, Helvetica, Arial) also has no 600 face.
- Components use `theme.typography.fontWeightLight`, `fontWeightRegular`, `fontWeightMedium`, or `fontWeightBold`, defined in the theme generator. Their mapping is 300 → Light, 400 → Regular, 500 → Medium, and 600/700/`bold` → Bold.
- Headings h1–h6 are bold. Prefer a Typography variant over size or weight overrides; preserve the HTML element with `component` when changing variants. Converted elements take the variant's line-height and letter-spacing.
- MUI component defaults (including tooltips, slider labels, and Buttons) remain unchanged. Configuration-driven weights are allowed.

## Weight lint

The shared `no-restricted-syntax` checks flag numeric and numeric-string weights, `bold`, `bolder`, `lighter`, `normal`, and `semibold` in style objects, responsive and conditional values, JSX props, DOM `style.fontWeight` assignments, and static `font-weight` declarations in tagged templates. Theme token references, `'inherit'`, and configuration-driven values are allowed. Drawer source and the DrawerController measurement helper are included, with no drawer-specific exemptions; the remaining exceptions are listed below.

## Exceptions

| Site                                                                  | Reason                                                                                                        |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `geoview-core/src/ui/style/**`                                        | Theme definitions own the typography scale and tokens.                                                        |
| `**/*.d.ts`                                                           | Type declarations do not render UI.                                                                           |
| `geoview-core/src/core/components/export/layout-styles.ts`            | PDF/canvas layout describes exported artwork.                                                                 |
| Measurement button's line-level disable                               | OpenLayers/canvas measurement text is map artwork, not viewer UI.                                             |
| `geo/interaction/transform/transform-base.ts` text-editor toggle line | Changes the user's map-text formatting, not UI typography.                                                    |

## Reviewed visible changes

| Site                                                      | Change                                                                                               |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Four h6 DialogTitles (share, export, and two modal paths) | Font-weight 400 → bold; line-height remains 25.6px.                                                  |
| Legend primary title                                      | Line-height 27px → 24.01px (−2.99px).                                                                |
| Legend instruction title, normal and fullscreen           | 30px → 24.7px (−5.3px); its 1.5em line-height override was removed during W1. Reviewed and approved. |
| Layer-details category title                              | 27px → 24.01px (−2.99px).                                                                            |
| Full-screen dialog title                                  | 32px → 24.7px (−7.3px).                                                                              |
| Selected-layer header                                     | 36px → 28.01px (−7.99px).                                                                            |
| Filter layer names                                        | 21.006px → 24.012px (+3.006px).                                                                      |
| Selected time-slider title                                | 30px → 24.7px (−5.3px).                                                                              |

## Remaining work

- Export title invalid `'semibold'` fixed: shared style now specifies bold for PDF and canvas.
- Filter-panel ESLint config fixed to use the shared default config, matching other plugin configs. The broken named import originated in `469f2f15f8dcedda5a88ede35550d316c6d3297d`.

## Progress

- 2026-11-04 - D3 measurement-label migration rolled back to pre-branch fixed `12px`/`bold` CSS; controller typography synchronization removed and theme support deferred to a separate PR. Picker header/glyph token improvements remain. The D3 entry below records historical verification, not current measurement-label behavior.
- W1 committed: Core weight tokens, bold h6 headings, and eligible variant conversions.
- W2 committed: Plugin weight tokens and eligible variant conversions.
- W3 committed: Weight lint checks and documentation; AOI title tokenized and map-text toggle exemption recorded.
- Batch S completed: STAC Browser weight sites migrated to theme tokens, browser-checked under both display themes and host roots, and included in shared lint.
- 2026-11-03 - D3 completed (not committed): measurement labels use their owning controller's `fontWeightBold`, picker headers `fontWeightMedium`, and close glyphs `fontWeightRegular`; weights remain 700/500/400 in both maps at both host roots and 16px/20px browser defaults; drawer path/helper exemptions removed, repo lint reports zero findings, and drawer/core validation passed; full before/after evidence is in [Typography plan: D3](TYPOGRAPHY_PLAN.md#d3-implementation-and-verification).
