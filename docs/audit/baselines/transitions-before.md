# Transitions before-baseline

Captured **2026-10-28**, before any migration, against the DECIDED
[Transitions decisions](../THEME_DECISIONS.md#transitions) and
[audit plan](../THEME_AUDIT_PLAN.md#verification-traps).
The machine-readable evidence is [transitions-before.json](./transitions-before.json):
`observations[T-ID][theme][state]`, with exact selectors, element descriptions,
four computed transition fields, and referenced interaction sequences.

## Provenance

- HEAD and served source: **`cc7d57918acb4d6bc85b0ffeaf28ceac94976d9c`**.
  `git diff --name-only cc7d57918 -- packages common/config` was empty before
  building and after capture. No tracked source, theme, dependency or config changed.
  The two untracked AppBar settings files were not edited.
- Fresh build: `cd packages/geoview-core && rushx build-dev` — **passed**;
  webpack 5.112.0 compiled successfully in 3014ms. Installed MUI: **9.5.0**.
  Bundle SHA-256:
  `feaf426b6efb7791a6371910b24ea6a9334274ca3f59b36e21afb765dca2a015`.
- Served the fresh [dist output](../../../packages/geoview-core/dist/) at
  `http://127.0.0.1:8081` using
  `python3 /Users/kenchase/.copilot/session-state/fc4b315b-7a92-4cda-800c-74e89717f1b3/files/baseline-server.py`.
  Readiness was HTTP 200. The user's existing server on port 8080 was untouched.
  The session capture server was stopped after verification.
- Primary demo: Demos Navigator with `09-basic-footer-layers-tab.json`.
  Existing configurations `00-basic-footer-appbar-combo.json`,
  `16-package-area-of-interest.json`, `19-package-filter-panel.json` and
  `24b-initial-settings-states-controls.json` exposed the other consumers.
  Exact URLs are included with each JSON observation.
- Electron/Chromium: Chrome 150.0.7871.250, Electron 43.7.7;
  viewport **1600 x 1200**, DPR 1; reduced-motion preference **false**.
  This is one viewport, not a responsive/text-resize or external-theme test.

## Coverage

All rows below were exercised in **geo.ca, light, dark and canada.ca**.
There are **288 keyed state observations and 32 accepted interaction traces**.
Seventeen CSS/Fade rows plus the actual TooltipUI popup have computed-style
samples: **18/18 styled consumers**. The four JS-delay rows have observable
action sequences, but remain **partial** because their promise resolution and
private handler/lifecycle callback timestamps were not directly hooked.
No T-ID is wholly unobserved; this is not a claim that every callback was captured.

| T-ID | Exact consumer | Captured states in each theme; qualification |
|---|---|---|
| [T55](../THEME_DISCOVERY.md#T55) | Notifications close button | Popup-open rest, hover, focus-visible |
| [T49](../THEME_DISCOVERY.md#T49) | Generic Legend Panel section | Closed, open, focus-within context; section itself is not focusable |
| [T52](../THEME_DISCOVERY.md#T52) | Legend Panel CardHeader close button | Open rest, hover, focus-visible |
| [T15](../THEME_DISCOVERY.md#T15) | Settings back-to-details delay | **Partial:** content swap and focus() call; shared Fade samples under T46 |
| [T16](../THEME_DISCOVERY.md#T16) | Open-settings delay | **Partial:** content swap; shared Fade samples under T46 |
| [T17](../THEME_DISCOVERY.md#T17) | Information back-to-details delay | **Partial:** content swap and focus() call; shared Fade samples under T46 |
| [T18](../THEME_DISCOVERY.md#T18) | Open-information delay | **Partial:** content swap; shared Fade samples under T46 |
| [T46](../THEME_DISCOVERY.md#T46) | Actual Fade child Box | Exit/enter samples for information and back; exit/entered samples for settings and back |
| [T60](../THEME_DISCOVERY.md#T60) | Footer tabs container | Rest, expanded, collapsed; independently verified body collapse and dimensions |
| [T61](../THEME_DISCOVERY.md#T61) | Viewer host | Rest, expanded, collapsed; independently verified dimensions |
| [T29](../THEME_DISCOVERY.md#T29) | TooltipUI via map-info/overview controls | Settled subsequent hover-open and focus-visible-open; actual requested 200ms Tooltip timer verified |
| [T51](../THEME_DISCOVERY.md#T51) | CN Tower AOI card button | Open rest, hover, focus-visible |
| [T53](../THEME_DISCOVERY.md#T53) | AppBar Geolocator button | Rest, hover, focus-visible, geolocator open |
| [T54](../THEME_DISCOVERY.md#T54) | NavBar button | Zoom-in rest/hover/focus-visible; Map Rotation button with its panel open |
| [T68](../THEME_DISCOVERY.md#T68) | NavBar rotation icon Box | Rest, hover, panel open, verified keyboard-owner focus-visible |
| [T56](../THEME_DISCOVERY.md#T56) | Layers tab | Selected rest, hover, focus-visible |
| [T66](../THEME_DISCOVERY.md#T66) | Visible stacked layer-preview Icon | Rest, hover; aria-hidden, nonfocusable decoration: focus-visible not applicable |
| [T67](../THEME_DISCOVERY.md#T67) | Map-info arrow Box | Rest, hover, verified keyboard-owner focus-visible |
| [T58](../THEME_DISCOVERY.md#T58) | Selected raster-function card ButtonBase | Expanded rest, hover, focus-visible |
| [T59](../THEME_DISCOVERY.md#T59) | Raster-function section header ButtonBase | Expanded rest, hover, focus-visible, collapsed |
| [T65](../THEME_DISCOVERY.md#T65) | Filter disclosure IconButton, not its SVG | Expanded, hover, focus-visible, collapsed; expanded/collapsed transforms differ |
| [T69](../THEME_DISCOVERY.md#T69) | Inner overview-toggle Box, not OpenLayers button | Rest, expanded, collapsed, hover, verified keyboard-owner focus-visible |

Focus-visible on a nonfocusable styled Box means its actual keyboard owner
was focused and matched `:focus-visible`; JSON records both elements.
Containers without a distinct hover/focus rule were sampled in their layout
states, not made artificially focusable. Tooltips have no styled element at
rest. JS delays themselves have no computed CSS tuple.

**Two differently themed maps together: not captured.** The existing Navigator
has one map section, `map1`, and one theme selector, not a built-in multi-map
demo. No custom harness or source change was introduced.

## Computed tuples and baseline differences

The following are computed values, not the proposed after-migration MUI curves.
Each tuple is property / duration / timing function / delay.

| Rows | Computed tuple, all four themes |
|---|---|
| T49 | `all / 0.3s / ease / 0s` |
| T51, T52 | `all / 0.3s / ease-in-out / 0s` |
| T53, T54, T55, T56 | `background-color / 0.3s / ease-in-out / 0s` |
| T58 | `border-color, background-color / 0.2s, 0.2s / ease, ease / 0s, 0s` |
| T59 | `color / 0.2s / ease / 0s` |
| T60 | `height / 0.2s / ease-out / 0s` |
| T61 | `height / 0.2s / ease-out / 0.2s` |
| T65 | `transform / 0.2s / ease / 0s` |
| T66, T67, T68 | `transform / 0.3s / ease-in-out / 0s` |
| T69 | `transform / 0.3s / ease / 0s` |
| T46, while transition styling is present | `opacity / 0.3s / cubic-bezier(0.4, 0, 0.2, 1) / 0s` |

**Observed T46 variation:** seven settled settings samples compute
`all / 0s / ease / 0s`, rather than the active-transition tuple: open-settings
and back-from-settings in geo.ca/light/dark, and back-from-settings in canada.ca.
The source timeout remains 300ms. Installed MUI's
[Fade exit handler](../../../packages/geoview-core/node_modules/@mui/material/Fade/Fade.mjs#L109)
explicitly clears inline transition CSS. The exact lifecycle ordering in these
samples was not hooked; this records runtime behavior, not a claimed regression
or a proposed repair. JSON retains the zero-duration samples, active samples,
and per-state comparisons. All other selected declaration tuples match the
baseline source expectations.

**T29 is a JS delay, not a CSS animation duration.** The actual TooltipUI
consumer requests 200ms for a subsequent opening in every theme; observed
timer elapsed times were 900 / 908 / 853 / 662ms respectively, in theme order.
The popup's default Grow computes opacity/transform durations of 200/133ms
and zero CSS delays. These do not measure `enterNextDelay`.
Initial zoom-button popup samples were excluded: source inspection showed
[IconButton](../../../packages/geoview-core/src/ui/icon-button/icon-button.tsx#L3)
imports MaterialTooltip directly and therefore is not this wrapper consumer.

## Coupled sequences

Times below are **observed milliseconds after the triggering click**, not
promised scheduling bounds. Event dispatch and rendering were noisy. Focus
calls are directly observed DOM `.focus()` calls; private React callbacks are
not inferred from them. Raw event ordering and selectors are in JSON.

### C1: generic Panel

The requested completion wait was **350ms = standard 300ms + buffer 50ms**
in every theme. Internal `onOpen`/`onClose` callbacks were not directly exposed.

| Theme | Open: close-button focus / width end | Close: Legend-button focus / map focus / width end |
|---|---|---|
| geo.ca | 1081 / not observed | 157 / 589 / 595 |
| light | 859 / 862 | 202 / 959 / 964 |
| dark | 625 / not observed | 201 / 476 / not observed |
| canada.ca | 457 / not observed | 179 / 730 / 735 |

Thus light's open focus was observed 3ms before the dispatched width end;
close map-focus calls preceded dispatched width ends by 6/5/5ms where present.
Missing width ends prevent the other comparisons. Canada.ca open emitted
colour/scrollbar-colour ends, which are preserved but not substituted for width.
This run does not establish a guaranteed callback-after-end contract.

### C2: layer crossfade

The four source waits remain 300ms. Content replacement is the observable
proxy for changing active view; it is not a direct delay-resolution timestamp.
For compactness, end lists below are opacity `transitionend` times in order.

| Theme | Open info: swap; ends | Back info: swap / focus; ends | Open settings: swap; ends | Back settings: swap / focus; ends |
|---|---|---|---|---|
| geo.ca | 318; 613 | 325 / 326; 297, 614 | 872; none | 671 / 671; none |
| light | 319; 300, 620 | 328 / 330; 302, 622 | 1159; none | 1025 / 1030; none |
| dark | 318; 594 | 323 / 323; 625 | 958; none | 880 / 883; none |
| canada.ca | 317; 591 | 327 / 327; 610 | 400; 718 | 527 / 527; 485 |

Where both information exit/enter ends were observed, back focus fell between
them (geo.ca and light). Dark/canada.ca information focus preceded the only
observed enter end; their exit end was not observed. Canada.ca settings back
focus followed its observed exit end by 42ms; no corresponding enter end was
observed. Missing ends and cancellations are retained, not filled using 300ms.
Controlled settings traces used the existing controls' DOM `click()` method;
information traces used pointer clicks.

### R4: footer/host

Real collapse/expand was confirmed in every theme: footer height
**790px -> 49px -> 790px**, host **1542px -> 800px -> 1542px**, and the footer
body's inline height **empty -> 0px -> empty**. The footer itself remains
`height: fit-content`. The final traces observed **no T60/T61 transitionend**
despite the declared 200ms tuples, so there is no end timestamp against which
to compare the callback.

| Theme | Requested wait | Observed timer elapsed, collapse / expand |
|---|---|---|
| geo.ca | 25ms | 405 / 934ms |
| light | 25ms | 524 / 924ms |
| dark | 25ms | 370 / 851ms |
| canada.ca | 25ms | 541 / 843ms |

The timer is identified by its footer-bar call stack. Its firing is observed;
the subsequent `scrollIfNotVisible` invocation/completion is not directly
hooked. The held 100ms resize-button wait is outside these migration actions.

## Limitations and validation

- The initial browser clock was paused/virtual. Accepted timing traces were
  captured after resuming it; accelerated warm-ups and unreliable earlier
  settings traces are excluded. Browser absolute timestamps may be virtual;
  host capture date and raw-record ordering identify the evidence.
- Timer/rendering latency was substantial. These single-run observations
  cannot support tight numeric timing tolerances or universal ordering claims.
  Missing lifecycle callbacks and transition ends remain explicit gaps.
- Some remote fonts, AOI imagery and services failed to load; the named
  interactive controls and exact styled elements were nevertheless rendered.
- Validation passed: JSON parse; exact **22 ledger T-IDs x 4 themes**;
  nonempty per-theme state coverage; all four computed transition fields on
  styled samples; verified keyboard owners; requested TooltipUI 200ms timer;
  monotonic accepted trace events; and expected-tuples comparison retaining
  the seven T46 state variations. Audit authority files and protected files
  were unchanged. The two deliverables reside in the already git-ignored audit
  directory; no ignore rules were changed.
