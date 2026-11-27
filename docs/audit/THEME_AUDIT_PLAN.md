# Transitions, shadows and font sizes: audit plan

## Approach and order

Discover all three together, then decide separately in this order: **transitions → shadows → font sizes**. This is a bounded planning sample, not an inventory or a proposed normalization standard.

**End state:** every non-held duration/easing reads `theme.transitions`; every non-held shadow reads `theme.shadows`, the focus contract, or a decided named treatment; every non-held text size reads a typography variant or `geoViewFontSize`, and icons follow a decided icon rule. Coupled JS delays/timeouts derive from the same theme value as the CSS they mirror, or are held with a reason. Every remaining occurrence is listed in `HELD.md` with a reason. Gate 2 may revise these goals, but must state them before proposing rules.

- **Transitions first:** the generator already defines MUI durations/easings; drawer and north-arrow code demonstrate `transitions.create`. NavBar still uses `0.3s ease-in-out`; panel CSS uses a theme duration with literal `ease`, alongside a coordinated completion delay. Existing patterns make this a useful first decision set.
- **Shadows next:** repeated `0px 12px 9px -13px …` strings suggest shared treatments, but focus halos have a separate, settled accessibility contract. The shell's `boxShadow: 2` already consumes MUI's shadow scale through `sx`; the scale is not wholly unused.
- **Font sizes last:** custom-legend styles mix tokens, rem and px; generator typography mixes GeoView sizes, MUI variants and a numeric custom `control` size. This needs role and inheritance evidence, not just numerical matching.

The local installed MUI package reports **9.5.0**, not 9.4.0. Discovery must reconcile manifests/lockfile with installed code before treating upstream defaults as authoritative; no dependency upgrade is planned.

## Discovery: facts only

Cover viewer UI in core and first-party plugins, theme source/component overrides, and first-party static CSS. Exclude STAC browser, map rendering/OpenLayers, user drawing symbology, test fixtures, demo/sandbox/release HTML and vendored CSS. Classify mixed files by owning expression, not filename. Do not edit unrelated untracked settings files.

For **every occurrence**, record path/line, owner, selector/state/breakpoint, property or prop, original expression, normalized value, styling mechanism (`sx`, override, inline, CSS), theme availability. Include existing tokens, defaults, suppressions and fallbacks—not only literals. Preserve originals; unknown intent stays unknown.

Discovery groups by property and normalized value, and records owner/selector/state for each row. Observable consumer (the user-visible element, such as "legend panel title", not a code path) and role are classified per concern at the decision gate below.

| Concern | Inventory and clustering | Existing fields to evaluate later; possible gaps |
|---|---|---|
| Transitions | Expand shorthand/longhands into target property, duration in ms, easing and delay, retaining omitted CSS defaults and enter/exit direction. Group by property and normalized value; record owner/selector/state for each row. Include transition props, keyframes/animation timings and coordinated callbacks/delays as context; exclude unrelated timers. Inventory existing reduced-motion handling with an explicit count, even if zero: `prefers-reduced-motion` media queries, `useMediaQuery` checks, react-spring `reducedMotion`/`immediate` settings and equivalents. | `transitions.create`, `duration`, `easing`; retain existing `tooltipDelay`/`splash` roles. CSS `ease`/`ease-in-out` differ from MUI's curves; linear/steps, delays and animation cycles may lack named equivalents. |
| Shadows | Preserve ordered layers, offsets, blur, spread, inset and colour expression/resolution. Group by property and normalized value; record owner/selector/state for each row. Include numeric `sx`, explicit shadow lookups and component elevation props. | `theme.shadows`, Paper elevation and component defaults for elevation. Focus halos are not elevation; inset/edge treatments may have no fitting MUI role. Preserve D6's focus contract. |
| Font sizes | Include longhand/shorthand, numeric values, rem/px/em/percent, named/generated scale keys, fallbacks and inherited variants. Group by property and normalized value; record owner/selector/state for each row, resolved size and root/parent assumptions. Tag every font-size occurrence `text` or `icon` during discovery, verified against source; if source does not settle it, mark `unresolved` with a reason rather than guessing. | Existing `palette.geoViewFontSize`; MUI typography variants, `typography.pxToRem` and SvgIcon sizing for their own consumers. No assumed one-to-one mapping between GeoView sizes and typography roles. |

## Judgement gates and deliverables

1. **Discovery document:** one shared, recommendation-free inventory with occurrence totals by concern/property/cluster and explicit exclusions/unresolved intent.
2. **Decision document:** one concise record, separate sections per concern. Each section starts by classifying that concern's rows by role and observable UI consumer, and reports per-role counts before any proposed rule. Classification happens per concern, in decision order: transitions, then shadows, then fonts. Role vocabularies:
   - Transitions: UI action + target property + state.
   - Shadows: elevation | edge separation | focus halo | focus suppression | elevation suppression | hover/active affordance | other. Cross-reference any focus-related transition rows because focus treatments span both concerns. Before any elevation-based rule, decide the fate of the generator's global MuiPaper root box-shadow override, which currently defeats Paper elevation. State whether changing it is within scope despite the no-restructure constraint.
   - Fonts: text (with role) | icon.
   Unknown intent stays unknown. Count affected occurrences before each proposed rule. Ask about curve/timing changes, shadow elevation versus edge treatment, unmatched sizes, generated keys, icon/text distinctions and static-CSS holds. Ask about the fallback rule for components that can receive external MUI themes (`ui/`), covering GeoView font sizes and colours. Explicitly list and ask about coupled timing pairs: JS delays or timeouts that mirror a CSS duration in another file. A custom token needs a purpose MUI cannot express, not a visual nickname.
3. **Change document:** only after decisions, one standing migration/verification prompt and file ledger. One explicit ledger unit per invocation. A unit is one file, or a coupled set of files identified in gate 2 (including any coupled timing pair). Generator/theme changes are their own unit, ordered deliberately in the ledger. Review between units; never auto-select the next unit. Each invocation first re-confirms that unit's discovery rows against current source and notes any drift. Record exceptions with reasons in existing `HELD.md`, not another exception document.

No typography redesign, theme/provider restructure, CSS variables, optional-token cleanup or adjacent colour/contrast fixes. Exact aliases and intentional behavior changes must be distinguished.

## Verification traps

Before removing restating hover/focus/`none` overrides, inspect installed MUI defaults: they may suppress elevation or motion. Preserve per-map theme ownership, external-theme safety, portals and nested providers. Do not equate rem and px without root-size evidence, or alter icon geometry by treating icons as text. Check history before calling an exposed defect a regression.

Before the first change, capture a before-baseline of computed styles and interaction timing for the listed themes and states, on a recorded commit. Every later comparison is against this baseline.

During migration, compare computed styles and interaction timing before/after on the running page across all four independent themes, keyboard focus, enter/exit, responsive states, text resizing, external themes and two differently themed maps together. Verify coordinated callbacks; preserve existing reduced-motion behavior against the explicit discovery baseline. Verify icon geometry using the discovery text/icon tags. Run focused type/lint checks and reconcile the final inventory against migrated and held occurrences.
