# Keyboard-navigation accessibility test results

**Date:** 2026-11-06  
**Plan:** [Before/after accessibility test plan](WCAG_MODE_ACCESSIBILITY_TEST_PLAN.md)  
**Outcome:** Candidate integration testing performed; issues found. Live baseline comparison blocked. **Not ready for accessibility sign-off.**

## Summary in plain language

The central mixed-input experience worked in several important checks: keyboard navigation stayed enabled during mouse movement, Settings usually kept focus on its switch, keyboard users could reach and leave Settings, a host-page click retained focus, and the Export modal kept outside focus out.

Testing also found problems and unresolved observations:

1. **Choosing Skip in the entry prompt lost focus to the page body instead of the intended skip link.** The same incorrect destination lookup exists in upstream source, so this is not established as a new regression.
2. **Settings does not fit fully at 320 CSS pixels wide.** The panel and part of Close extend outside the viewport. This is a new feature issue and a reflow concern.
3. **Scale choices expose raw translation keys as accessible names.** This is present in baseline source as well.
4. **One of ten switch cycles briefly put focus on a Layers control rather than the switch.** This needs a controlled reproduction before assigning a root cause or claiming a consistent regression.
5. **One two-map Ctrl+Q check ended on the map rather than its skip link.** A repeat ended correctly. Mode-off hover focus remains a plausible source-backed risk.

No application source, configuration, or translation was changed. Testing used temporary browser state and fixtures, followed by cleanup. No fixes were attempted.

This report is deliberately not an all-pass result. It covers meaningful parts of all input protocols, but not every branch of every scenario. The original implementation has not been run alongside this candidate, so keyboard-only behavioral parity is **not established**.

## Environment and source identification

- Candidate branch: `3694-wcag-mode-button`.
- Candidate HEAD and intended baseline: `89e86e533efdcef84d44c109855e23c3169b7371`, `upstream/develop`.
- Feature is uncommitted: tracked changes plus untracked Settings component/style. The existing localhost server was used without changing or restarting it. The live page exposed the new Settings button and current DomHelper-generated WCAG IDs, consistent with the candidate; no independently built immutable candidate bundle was produced.
- Starting tracked-diff SHA-256 (`git diff --binary | shasum -a 256`): `e7fbcb75bbe8a86828e3e16e0f9bf851e07def845a16eadf58ee66b5a447683a`.
- Starting status SHA-256 (`git status --porcelain | shasum -a 256`): `65b1d140741be0eb75899dd95bf7dfa902d20b75160d7337e2213e684ba9911d`.
- Untracked Settings source SHA-256: `e16d23c8f3fc32974d7796bcf0739b0c47bdd69c114e71e013f9fc4a5ae72f54`.
- Untracked Settings style SHA-256: `2113b01f084e900ff71dc7eb5df25aad6c70b4ea3fa91a4d6874b65b79002e46`.
- Browser: VS Code integrated Electron 43.8.3 / Chromium 150.0.7871.250; user-agent reports macOS. This is not a native Safari or Firefox test.
- Main URL: `http://localhost:8080/demos-navigator.html?config=./configs/navigator/demos/09-basic-footer-layers-tab.json`.
- Candidate test page: `90f3f8b2-288e-421f-a741-7c4fadf1f31d`. The supplied page `f081a2cc-4ef4-4854-bb80-c20f8c0411e8` remained busy after reload, so a fresh page was opened. The fresh page reached both direct shell statuses `aria-busy=false`.
- Viewports: 1400 x 1800 and 320 x 900 CSS pixels, including fullscreen. Tests were at default browser zoom; no claim of true 200%/400% browser-zoom execution.
- English primary map; browser-only French dynamic map `audit-two` and English static map `audit-static`, each 700 pixels high, no configured data layers, empty basemap, created through the public API.
- Primary demo includes an intentional invalid layer URL. Font/Geolocator requests also failed. Tests requiring deterministic remote feature content are not scored as complete.
- Both pages reported `document.visibilityState="hidden"` even after bringing them forward. Trusted keyboard/pointer operations worked in the fresh page, but animation completion and timing observations need confirmation in a normal visible browser.

### Baseline execution attempt

An exact `git archive` of the baseline was extracted into a temporary directory, with existing installed dependencies linked for a separate server. Temporary Git metadata was needed by the existing build's `git rev-parse HEAD`; its generated development version was therefore not the baseline commit ID, although the archived source was the baseline.

Starting the isolated server on port 8081 failed:

```text
Error: listen EPERM: operation not permitted 0.0.0.0:8081
```

The active sandbox policy blocked listening on that port. No workaround or alteration of the existing server was attempted. Baseline live interaction results remain **blocked**. The sandbox policy must allow the test server's listening endpoint before completing the live before/after comparison.

Baseline classifications below use `git show upstream/develop:<path>` source evidence only, not a live baseline pass/fail.

## Execution matrix

**Partial** means the listed observations were obtained, but additional checks in that scenario remain unexecuted. **Fail** means at least one tested expectation failed; it does not mean every subcase failed. Every live baseline column is blocked by the server restriction.

| Plan ID                         | Candidate result                                       | Actual observations and remaining gaps                                                                                                                                                                                                                                                                           |
| ------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1: entry/skip                  | **Fail**                                               | Fresh keyboard-only Tab sequence reached entry prompt. Enable reached inner main-map link. Skip reproducibly left `BODY` focused, not the bottom skip link. Full reverse Skip destination was not successfully validated.                                                                                        |
| A2: Settings transitions        | **Partial; intermittent issue**                        | Keyboard Space and pointer toggles kept Settings open; most retained switch focus. Movement kept mode enabled. Ten cycles completed with no captured page errors, but one immediate sample had Layers focus; see F4.                                                                                             |
| A3: exit/cancellation           | **Partial**                                            | Ctrl+Q normally focused the outer skip link, disabled mode and keyboard map interactions. One two-map destination differed; repeat passed. Not every delayed-focus interruption/unmount was exercised.                                                                                                           |
| A4: boundaries/focus            | **Partial**                                            | Enabled Settings wrapped switch -> Close -> switch using Tab/Shift+Tab. Guide forward sequence reached Exit and Exit returned to its tab. Close had keyboard focus styling. Exhaustive reverse footer/AppBar traversal and all focus-stop visual checks remain open.                                             |
| A5: click-away/host             | **Pass for sampled mouse/mixed path; partial overall** | Settings -> Reset Layers checkbox: Settings closed, focus remained `resetLayer` after one second, mode stayed active. Programmatic outside focus under Export was reclaimed. Touch and all host target types not run.                                                                                            |
| A6: owner/modal precedence      | **Partial**                                            | Settings opened over Layers and Guide; normal Escape returned to Settings trigger. Export reported `aria-modal=true`, reclaimed outside focus, and Escape returned to Export. Complete nested child Escape, programmatic Settings-to-modal takeover, and every close variant remain open.                        |
| A7: keyboard map/cleanup        | **Partial**                                            | Ctrl+M focused map; active KeyboardPan/KeyboardZoom observed. ArrowRight moved center; + zoomed. Space did not scroll host page. Ctrl+Q deactivated both interactions. Native Cmd+M, Shift variants and drawing/measurement not completed.                                                                       |
| A8: feature/details             | **Partial**                                            | Space from map selected Details and left map focused with no page-scroll delta. No deterministic returned feature, complete Details focus lifecycle, measurement/drawing cancellation, or nested fullscreen Escape result established.                                                                           |
| A9: pointer while input focused | **Partial / timing unresolved**                        | Guide input retained focus during wheel sample. First wheel sample showed unchanged zoom; later zoom advanced during subsequent interaction. Drag moved map and focused map on mouse-down. Hidden-page animations prevent treating this as a settled wheel pass or confirmed wheel failure.                      |
| A10: shared popups              | **Pass for sampled paths; partial overall**            | Notifications, About, Basemap, and Geolocator opened and Escape returned to their triggers after initial focus settled. Remove/remove-all, all rapid Ctrl+M races, and every popup consumer remain open.                                                                                                         |
| A11: multi-map/static           | **Partial**                                            | Both dynamic modes could be enabled independently; French Ctrl+Q disabled only French map. One focus destination differed before a correct repeat. Static map had no Settings. Keyboard-only cross-map transfer and all static controls remain open.                                                             |
| A12: locale/theme               | **Partial**                                            | French Settings/switch names and trigger restoration worked. Forced-colors/reduced-motion media emulation retained Close's focus CSS. Full dark/custom-theme contrast and real AT output not tested.                                                                                                             |
| A13: reflow/spacing/zoom        | **Fail**                                               | 320px fullscreen Settings extended to x=335/336; Close extended beyond x=320. French nonfullscreen needed horizontal scrolling. Sample French text-spacing override fit at desktop width. True browser zoom, enlarged text, complete WCAG spacing/contrast matrix not run.                                       |
| A14: repetitions/unmount        | **Partial; intermittent issue**                        | Ten open/off/on/Escape cycles, all returned to Settings trigger; one immediate switch sample had Layers focus. No captured `pageerror` in that run. Unmount while work pending and listener-leak measurement remain open.                                                                                        |
| A15: mode-off/cancellation      | **Partial**                                            | Mode-off Settings initially focused switch; Shift+Tab reached Close, Enter closed to trigger. Forward Tab left panel to bottom skip link; reverse traversal from that link reopened entry prompt. Pointer-down on switch followed by release elsewhere did not toggle. Portal/scrollbar/touch cases remain open. |

No scenario's full before-and-after matrix is complete. There are candidate failures in A1 and A13, and numerous partial scenarios; this report cannot substantiate the plan's complete release gate.

## Detailed findings and fix directions

### F1 — Skip loses explicit focus destination

**Priority:** P1. **Evidence:** reproduced candidate failure; baseline source defect also present.  
**Relevant criteria:** 2.4.3 Focus Order; investigate impact on 2.4.1 Bypass Blocks. Not a finding that the entire viewer is an inescapable keyboard trap.

Reproduction using keyboard after reaching active viewer controls:

1. Ctrl+Q -> `map1-wcag-toplink`.
2. Tab -> `map1-enable-focus`.
3. Tab -> `map1-skip-focus`.
4. Enter; wait one second.
5. Actual focus: `BODY`, ID empty. Expected: `map1-wcag-bottomlink`.
6. Next Tab reached the host `configGeoview` text area in this run.

Source: [focus-trap.tsx](../../packages/geoview-core/src/core/containers/focus-trap.tsx), `handleSkip` around line 268 and `navigationLinkRef` assignment around line 292. The ref stores `bottomlink`/`toplink`, then `DomHelper.getGVElementById` looks up those suffixes. Actual links use `wcag-bottomlink`/`wcag-toplink`; see [dom-helper.ts](../../packages/geoview-core/src/core/utils/dom-helper.ts), around lines 1044–1075. The same ref/suffix mismatch exists in baseline source.

**Direction, not implemented:** resolve both destinations through the canonical WCAG link helpers, then retest both directions, delayed focus cancellation, and post-Skip Tab order on both versions.

### F2 — New Settings clips at narrow reflow width

**Priority:** P1. **Evidence:** repeated candidate geometry in English and French; new surface absent in baseline.  
**Relevant criterion:** 1.4.10 Reflow; related focus-visibility usability concern. Treat as a focused reflow failure needing remediation, not as evidence about map-canvas conformance.

1. Open viewer fullscreen; open Settings.
2. Resize viewport to 320 x 900 CSS pixels; wait one second.
3. English panel: x=55, width=280, right=335. Close: x=290, width=36, right=326.
4. French fullscreen panel: x=56, width=280, right=336.
5. Close remained partly clickable and focusable, but its right edge/outline was outside the viewport. Keyboard Shift+Tab to Close did not make its entire bounds fit.
6. In a separate French nonfullscreen sample, panel right=357 and Close right=348. Scrolling the panel into view required horizontal page scroll (`scrollX=52`).

Source: [settings-style.ts](../../packages/geoview-core/src/core/components/app-bar/buttons/settings-style.ts), lines 18–20: minimum width 280px, maximum width `min(420px, 70vw)`, plus anchor/margin positioning in [settings.tsx](../../packages/geoview-core/src/core/components/app-bar/buttons/settings.tsx). At 320px, the minimum defeats the smaller maximum and available space beside the AppBar.

**Direction, not implemented:** bound panel size and placement to actual available viewport space, permit wrapping/vertical scrolling, and retest 320px, long French labels, text spacing and genuine 400% browser zoom. Do not rely on the map's two-dimensional-layout exception for Settings.

### F3 — Raw scale translation keys in accessible names

**Priority:** P2, with naming-quality review required. **Evidence:** candidate accessibility snapshot/DOM; identical baseline source.  
**Relevant criteria:** 2.4.6 Headings and Labels / 4.1.2 Name, Role, Value review. Names exist, so this is not claimed as a missing-name violation.

Expanding map information exposed:

- Radiogroup name: `mapnav.scale.selectFormat`.
- Radio name example: `500 km mapnav.scale.graphicScale`.

Source: [scale.tsx](../../packages/geoview-core/src/core/components/scale/scale.tsx), lines 230 and 242. Locale scale data uses a different key shape. The same lookups are present in baseline source; scale source is not changed by this feature.

**Direction, not implemented:** use valid localized descriptive keys and verify all scale format names in EN/FR. This is relevant to the user's major code/ARIA concern even though it predates the feature.

### F4 — Intermittent focus loss during Settings toggle

**Priority:** P1 investigation; **not a consistently reproduced failure or established root cause**.  
**Relevant criterion:** potential 2.4.3 Focus Order concern.

After working with layer selection/opacity, ten pointer open -> off -> on -> Escape cycles were sampled. All ten restored the trigger on Escape; nine immediate off samples focused the switch. The first off sample instead focused `map1-footerBar-layers-airborne_radioactivity/1` while Settings remained open and its switch was off. No `pageerror` was captured by that run.

Possible overlapping layer-selection/focus work needs tracing; the immediate sample may reflect event/render timing. Other isolated keyboard and pointer toggles retained switch focus after one second. Do not attribute this observation solely to `disableEnforceFocus` or report all ten cycles as clean focus retention.

**Direction, not implemented:** reproduce from a fresh page with the same layer selection, sample switch focus immediately and after all known delays, and trace the initiating focus call/owner. Establish baseline behavior of the shared layer path separately.

### F5 — Intermittent Ctrl+Q focus destination under pointer

**Priority:** P1 investigation; inconsistent observation, not a confirmed repeatable regression.

With both dynamic viewers enabled, Ctrl+Q in the French viewer correctly disabled only that viewer but a one-second sample focused `audit-two-mapTargetElement` rather than `audit-two-wcag-toplink`. Repeating Ctrl+Q from Settings trigger produced the correct skip link immediately and after one second. Primary-map Ctrl+Q also normally passed.

Source risk: [map-viewer.ts](../../packages/geoview-core/src/geo/map/map-viewer.ts), around lines 2102–2117, still focuses/blurs on hover once mode is off. [focus-trap.tsx](../../packages/geoview-core/src/core/containers/focus-trap.tsx), around lines 205–210, explicitly targets the top skip link. A popup disappearing/viewport scrolling beneath a stationary pointer may cause hover focus; causation was not instrumented in this run.

**Direction, not implemented:** repeat with pointer parked over map, Settings, and outside; trace focus calls and layout/hover events. Preserve the explicit exit destination without breaking ordinary pointer operation.

### Diagnostics, not independently established WCAG failures

- Settings repeatedly logged MUI: “The modal content node does not accept focus … tabIndex … set to -1.” Its FocusTrap child Paper does not explicitly declare `tabIndex`. The library supplied it at runtime, and tested switch/Close traversal worked. Review wrapper contract; do not call the warning proof of keyboard failure.
- The existing deprecated LoadingButton warning occurred in Export.
- Narrow multi-map fixture resizing produced MUI out-of-range panel-selector warnings. The French fixture had Guide but no selected footer tab; do not generalize this fixture warning to normal configured maps.
- The earlier plan's background-paper versus surface token note is a project styling convention issue, not a measured contrast failure.

## Positive evidence worth preserving

### Real keyboard-only routes

The fresh candidate page was traversed with Tab, not programmatically focused to the target:

```text
Back to Main
Layers Navigator
configLoader
switchLang
resetLayer
switchTheme
switchProjection
switchDatetimeTimezone
Layers Status
map1-wcag-toplink
map1-enable-focus
```

A controlled re-entry sequence then produced:

```text
Ctrl+Q -> map1-wcag-toplink
Tab -> Enable
Enter -> map1-wcag-link-to-map
Tab -> Geolocator
Tab -> Export map
Tab -> Notifications
Tab -> Settings
Enter -> keyboard-navigation switch
Tab -> Close
Shift+Tab -> switch
Space -> off, Settings open, switch focused after one second
Space -> on
Escape -> Settings trigger
```

Guide search forward traversal:

```text
Previous match -> Next match -> Clear search
-> loadingStatus -> navigationControls -> mapInformationBar
-> sidebar -> footerPanel -> issues
-> Enlarge -> Full screen, Guide -> content DIV -> Exit
Enter -> map1-tab-guide
```

This confirms specific usable keyboard routes, not exhaustive logical order or all reverse boundaries.

### Mixed input and mouse operations

- Settings switch retained focus through ordinary toggles and real pointer movement; mode remained active.
- Clicking host Reset Layers closed Settings, kept focus on `resetLayer`, and kept mode enabled after one second.
- Guide search accepted `map`; Tab reached Previous match.
- Selecting Airborne Radioactivity, clicking the actual slider track at its midpoint, then ArrowLeft changed opacity 50 -> 49. Tab reached Enlarge. Initial attempts aimed at MUI's hidden input/thumb or an offscreen Points control were invalid automation targets and were not treated as application failures.
- Pointer-down on the unchecked switch, moving away, then releasing elsewhere left it unchecked.
- Geolocator search received initial focus; Escape returned to Geolocator trigger.
- About and Notifications initially focused their named Close buttons; Escape restored their respective triggers. Basemap Escape returned to Change basemap.

### Map keyboard and genuine modal behavior

- Ctrl+M focused `map1-mapTargetElement`; KeyboardPan and KeyboardZoom reported active.
- A settled ArrowRight check changed map center from `[-10256237.250711244,11740165.151498675]` to `[-9370696.124006975,11740165.151498675]`; page scroll stayed 507.5.
- Plus key reached zoom 5.5.
- Space left page scroll at 445.5 and selected Details. Deterministic feature return was not established.
- Ctrl+Q switched mode off, normally focused `map1-wcag-toplink`, and both keyboard interactions reported inactive.
- Export's Map preview dialog reported `aria-modal=true` and a title reference. Attempting to programmatically focus `resetLayer` was reclaimed inside `.MuiDialog-root`; Escape returned to `map1-appBar-export-modal-btn`. This is a diagnostic containment attempt, not a user action used to prove normal reachability. Complete modal Tab wrapping was not recorded.

### Major name/role/state inspection

- Settings trigger: name Settings, `aria-expanded=true`, `aria-controls=map1-appBar-settings-panel`.
- Panel: `role=dialog`, title reference resolved to Settings, no false `aria-modal=true`.
- Actual input: `role=switch`, native checked state, associated visible label Keyboard navigation.
- No duplicate IDs inside the sampled Settings subtree; its title reference resolved.
- French Paramètres / Navigation au clavier were exposed by name; Escape restored the French trigger.
- Static fixture had no Settings button.
- Close matched `:focus-visible` and had a 3px solid outline in standard and forced-colors/reduced-motion samples. This is computed-style evidence, not a complete screenshot/contrast inspection.
- Sample Settings foreground/background were RGB(57,57,57) and RGB(249,249,251), respectively: calculated contrast **10.98:1**, passing normal-text contrast for this pair. This cannot establish contrast of every control/state.

## WCAG scope, unresolved coverage, and decision

**Focused release recommendation: HOLD accessibility sign-off.** Address or explicitly disposition F1/F2, investigate F4/F5, and complete blocked comparison/critical coverage before claiming keyboard-only parity. Baseline defects must not be silently accepted just because they predate this change.

Outstanding:

- Live baseline comparison: blocked by sandbox port-listen policy.
- Firefox, Safari, native macOS Cmd+M: not available/executed in this integrated Chromium run.
- Actual 200%/400% browser zoom and 200% enlarged text: not executed. A 320 CSS-pixel viewport was genuinely tested, not CSS zoom.
- Full WCAG text-spacing overrides across content: only a partial desktop French Settings override was applied (line-height 1.5, letter-spacing .12em, word-spacing .16em; paragraph selector did not establish all required paragraph cases).
- Complete text/control/focus contrast measurements across supported themes and states: not executed.
- Complete keyboard reverse sequences, both Skip directions, mode-off ordinary keyboard flow, drawing/measurement shortcuts and nested fullscreen Escape: incomplete.
- Mouse-only task completion beyond sampled actions, touch, portal/scrollbar click-away, rapid interrupted work, unmount/listener cleanup, all shared popup consumers: incomplete.
- Automated axe scan: `window.axe` was undefined; no dependency was installed and no scan is claimed.
- Accessibility-tree evidence used integrated browser snapshots plus DOM inspection, not real screen-reader output. No screen-reader-user testing was performed, as agreed.

Relevant WCAG 2.1 AA areas include 1.3.1, 1.4.3/4/10/11/12, 2.1.1/2, 2.4.1/3/6/7, 2.5.2/3, 3.2.1/2 and 4.1.2/3 where applicable. This focused test does not assess full application conformance. No WCAG 2.2-only requirement is used as a WCAG 2.1 AA blocker.

## Cleanup and verification

The existing server was never stopped or modified. The isolated baseline server exited on the sandbox denial. Temporary fixtures and diagnostic CSS/media settings were removed by page reload; temporary baseline files were cleaned up. The original source/status fingerprints and both untracked Settings hashes were rechecked after testing. This audit directory remains locally Git-ignored; no staging, stash changes, or application commits were made.
