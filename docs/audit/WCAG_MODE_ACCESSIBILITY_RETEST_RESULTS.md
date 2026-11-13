# Keyboard-navigation accessibility regression retest

**Date:** 2026-11-06  
**Commit:** `10afd8eee6bed3ea397697519f2aa6728e793022`  
**Plan:** [Accessibility test plan](WCAG_MODE_ACCESSIBILITY_TEST_PLAN.md)  
**Previous observations:** [Initial test results](WCAG_MODE_ACCESSIBILITY_TEST_RESULTS.md)  
**Outcome:** No new regression confirmed in completed checks. Known failures remain. Partial coverage; not WCAG 2.1 AA sign-off.

## Summary

The committed implementation passed the sampled core keyboard and mixed mouse/keyboard checks. Ten consecutive Settings off/on cycles preserved switch focus and returned focus to the Settings button on Escape. The intermittent switch-focus jump from the first run was not reproduced in those cycles; this does not prove it has been resolved.

The previously reported Skip focus loss and narrow-screen Settings overflow were reproduced. No application code was changed during this retest.

Two browser-tool calls stalled and were interrupted by the user. Testing stopped rather than making further potentially blocking browser requests. This report records only completed observations, not an all-pass execution of the full plan.

## Environment and reproducibility

- Branch: `3694-wcag-mode-button`; commit `10afd8eee6` (`feat(a11y): Add persistent keyboard navigation settings (#3694)`).
- Git worktree was clean before testing and again at final verification.
- Existing development server at `http://localhost:8080` was used without restarting or reconfiguring it.
- Test URL: `http://localhost:8080/demos-navigator.html?config=./configs/navigator/demos/09-basic-footer-layers-tab.json`.
- Browser page: `8dded050-e567-45c3-97c5-00de97c3cee9`, VS Code integrated browser. No cross-browser results are claimed.
- The live page exposed Settings and the expected keyboard-navigation behavior. This was not an independently built immutable bundle; the served bundle's exact commit was not independently verified.
- The page reported `document.hidden=false`, unlike the earlier test page.
- Normal viewport: 1400 x 1000 CSS pixels. Narrow check: 320 x 900 CSS pixels, default zoom, not fullscreen.
- Remote layer requests remained slow or failed, and Export was initially disabled. It later became available and was tested.
- No baseline server was attempted again. Live upstream comparison remains unavailable; the earlier report documents the sandbox listening restriction.

## Completed browser checks

Passes below apply only to the stated steps, not the entire corresponding plan scenario.

| Area                        | Result                       | Observation                                                                                                                                                                                                                                                                                             |
| --------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keyboard-only entry         | Pass                         | Tab from host controls reached the top skip link and entry prompt. Enter on Enable focused `map1-wcag-link-to-map` and enabled mode.                                                                                                                                                                    |
| Keyboard access to Settings | Pass                         | Tab reached Geolocator, Notifications and Settings; Enter opened Settings and focused its switch. Export was disabled at this point, so its absence from this sequence was expected.                                                                                                                    |
| Settings Tab boundary       | Pass                         | Tab moved from switch to Close, then back to switch. Shift+Tab from switch reached Close.                                                                                                                                                                                                               |
| Keyboard switch off/on      | Pass                         | Space on the switch disabled and re-enabled mode while retaining switch focus and keeping Settings open. Escape returned focus to Settings' button.                                                                                                                                                     |
| Mouse movement              | Pass                         | Moving the pointer outside Settings left mode enabled and focus on the switch.                                                                                                                                                                                                                          |
| Repeated pointer toggles    | Pass, 10 cycles              | Each cycle opened Settings, clicked off, clicked on, then pressed Escape. All 20 settled toggle samples retained switch focus with the expected mode state; all 10 Escape samples returned to the trigger. No `pageerror` was captured during this loop. Console diagnostics still occurred; see below. |
| Click-away to host control  | Pass                         | Clicking the Reset Layers checkbox closed Settings, retained focus on `resetLayer` after one second and left mode enabled.                                                                                                                                                                              |
| About dismissal             | Pass                         | Opened About with a pointer and pressed Escape; focus returned to `map1-appBar-version-btn`. Its visible dialog had no `aria-modal` declaration.                                                                                                                                                        |
| Notifications dismissal     | Pass                         | Opened Notifications and pressed Escape; focus returned to `map1-appBar-notifications-btn`. Its visible dialog had no `aria-modal` declaration.                                                                                                                                                         |
| Geolocator dismissal        | Pass                         | Opened Geolocator and pressed Escape; focus returned to `map1-appBar-geolocator-panel-btn`. Its visible dialog had no `aria-modal` declaration.                                                                                                                                                         |
| Basemap dismissal           | Pass                         | Opened Change basemap; the Close control received focus. Escape returned focus to Change basemap.                                                                                                                                                                                                       |
| Genuine Export modal        | Pass for sampled containment | Dialog retained `aria-modal="true"`. Tab reached an internal combobox. Attempted programmatic focus on the host checkbox was reclaimed into the modal container. Escape restored the Export trigger. This programmatic probe tests containment, not keyboard reachability.                              |
| Ctrl+M from Settings        | Pass                         | Closed Settings, focused `map1-mapTargetElement` and retained mode.                                                                                                                                                                                                                                     |
| Keyboard map zoom           | Pass                         | `+` increased zoom from approximately 3.5278 to 4.5278.                                                                                                                                                                                                                                                 |
| Keyboard map pan            | Pass, settled check          | ArrowRight changed center from `[-3018013.0399575606, 9583078.070392126]` to `[-2149382.372465257, 9583078.070392126]`. Host scroll remained 567.5. An earlier combined pan/zoom sample did not isolate pan; only this separate settled sample is scored as the pan result.                             |
| Ctrl+Q                      | Pass, single-map sample      | Focus returned to `map1-wcag-toplink`; mode class was absent and OpenLayers KeyboardPan/KeyboardZoom were inactive.                                                                                                                                                                                     |
| Settings with mode off      | Pass                         | Opened Settings while mode was off; it stayed open, switch was unchecked and focused.                                                                                                                                                                                                                   |
| Entry prompt Skip           | **Fail, previously known**   | Ctrl+Q, Tab to Enable, Tab to Skip, Enter: focus ended on `BODY`, not the intended skip link.                                                                                                                                                                                                           |
| Settings at 320 CSS pixels  | **Fail, previously known**   | Panel bounds were x=77, width=280, right=357 in a 320-pixel viewport. Close bounds were x=312 through 348. The panel and Close extended beyond the viewport.                                                                                                                                            |

### Interpretation of Export containment

An initial diagnostic checked whether the active element was a descendant of `[role=dialog]` and returned false after attempted outside focus. A narrower follow-up inspected the actual active element: focus had been reclaimed to `.MuiDialog-container`, inside `.MuiModal-root` but outside the dialog Paper. It was not on the host control or page body. The initial false result is therefore not classified as escaped modal focus.

### Diagnostics

- MUI repeatedly reported that modal content did not accept focus and that it was adding `tabIndex="-1"`. This warning was already observed in the initial run. Sampled navigation worked, but the diagnostic remains unresolved.
- Opening Export produced the existing MUI LoadingButton deprecation warning.
- Layer metadata and remote-font requests produced warnings/failures. This run does not establish deterministic layer-dependent behavior.
- No uncaught page error was captured during the ten-cycle loop. Error capture was not maintained across the entire session, so this is not a session-wide zero-error claim.

## Comparison with the earlier run

| Earlier finding                                 | Retest                                                                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Skip destination loses focus                    | Reproduced. Earlier source comparison identified the same lookup problem in upstream; no new live baseline comparison was performed. |
| Settings clips at narrow widths                 | Reproduced at 320 CSS pixels.                                                                                                        |
| Scale accessible names contain translation keys | Not retested. Remains open from the earlier report.                                                                                  |
| Intermittent switch focus jump                  | Not reproduced in ten settled off/on cycles. Root cause and absence under other timing conditions are not established.               |
| Intermittent two-map Ctrl+Q destination         | Not retested. Single-map Ctrl+Q passed; this does not resolve the two-map observation.                                               |

## Source validation

The following commands passed during this retest:

```bash
cd packages
node node_modules/eslint/bin/eslint.js \
  geoview-core/src/core/components/app-bar/buttons/{settings,version}.tsx \
  geoview-core/src/core/components/common/focus-trap-container.tsx \
  geoview-core/src/core/components/common/hooks/use-map-popover.ts \
  geoview-core/src/core/components/{geolocator/geolocator,map/map,nav-bar/nav-bar-panel-button,notifications/notifications}.tsx \
  geoview-core/src/core/containers/{focus-trap,shell}.tsx \
  geoview-core/src/core/stores/states/ui-state.ts \
  geoview-core/src/ui/{panel/panel,popper/popper,switch/switch}.tsx
node node_modules/typescript/bin/tsc --noEmit -p geoview-core/tsconfig.json
```

Final repository-root `git diff --check` also passed. No full Rush build was run.

## Coverage limits and remaining checks

This was a bounded regression retest, not a complete repeat of A1-A15:

- No live baseline parity comparison, native Safari/Firefox testing or actual screen-reader testing.
- No fresh two-map, French, static-map, fullscreen, browser zoom, text-spacing, contrast or forced-colors evaluation.
- No complete footer/Guide reverse traversal, layer-opacity test, pointer cancellation, pointer drag/wheel or deterministic map-feature query.
- No comprehensive panel-to-panel switching or delayed-focus interruption/unmount sequence. In particular, the class-cleanup change was not verified through a controlled component unmount.
- The final browser request combined Escape, viewport restoration and reading map configuration. It was interrupted; its completion and final browser state were not verified. No temporary map fixtures, injected styles or additional servers were created in this retest.
- The prior test report remains the source for earlier observations outside the completed checks above; they must not be relabeled as passes for this commit.

## Recommendation

The completed checks are encouraging and found no confirmed additional regression. They support the sampled core mouse/keyboard workflows, not a claim that keyboard-only behavior is identical to upstream or that WCAG 2.1 AA is satisfied.

Keep the known Skip and reflow failures, unresolved diagnostics and remaining focus observations tracked for follow-up. Accessibility sign-off remains on hold.

Only this testing document was added. It is locally Git-ignored under `docs/audit/`; application source, configuration, translations, index and commits were not changed.

## Follow-up: map-query Details focus return

**Date:** 2026-11-06  
**Scope:** Follow-up browser validation of the map-query focus-return fix; not a repeat of the full accessibility retest.

- **Keyboard mode remains enabled:** With keyboard navigation enabled, Ctrl+M focused the map, arrow keys moved the crosshair, and Enter opened AppBar Details. Closing Details returned focus to the map; pressing Enter again opened Details. **Pass.**
- **Keyboard mode disabled while Details is open:** With a keyboard-origin query open in Details, Settings was used to turn keyboard navigation off. After closing Settings and then Details, the mode remained off when checked in Settings. **Pass for preserving the mode setting.** The browser check did not independently inspect OpenLayers interaction internals.
- **Pointer-origin Details:** The pointer-query path was not separately retested in this follow-up.

The check used the existing VS Code integrated browser and the demo URL `http://localhost:8080/demos-navigator.html?config=./configs/navigator/demos/10-basic-appbar-data-table-tab.json`. The served bundle was not independently identified by commit. Targeted ESLint, the core TypeScript check, and repository-root `git diff --check` passed for the focus-return changes. No full Rush build or test suite was run.
