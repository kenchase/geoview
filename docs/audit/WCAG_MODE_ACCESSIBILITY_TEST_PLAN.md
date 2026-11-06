# Keyboard-navigation mode: before/after accessibility test plan

**Status:** Planned; this document records tests to run, not test results.  
**Prepared:** 2026-11-06  
**Target:** Focused WCAG 2.1 AA review of the dynamic-map keyboard-navigation mode, its new Settings entry point, and directly coupled focus/popup/map interactions.

## Purpose and limits

Compare the prior viewer experience with the current Settings/mixed-input implementation, then evaluate the candidate against the relevant WCAG 2.1 AA expectations. Baseline parity is useful for detecting regressions; it is not evidence that either version is accessible. In particular, the prior behavior in which pointer movement exited keyboard-navigation mode is a known baseline usability problem, not an acceptance criterion for the candidate.

This is a focused feature regression and accessibility plan, not a full GeoView conformance audit. Screen-reader scope is limited to inspecting source semantics, browser accessibility trees, and major ARIA relationships/state changes. **No screen-reader-user testing is planned**, and this work cannot certify conformance or establish that announcements are understandable in assistive technology. A human with assistive-technology expertise should conduct a separate evaluation before making broader claims.

The test surface includes:

- The entry/skip prompt, top and bottom skip links, Ctrl+M/Cmd+M, Ctrl+Q, map crosshair, map blur, and focus-indicator mode.
- The new Settings button/switch and mode lifecycle, non-modal click-away, focus boundaries, panel ownership, and interaction with genuine modal dialogs.
- App-bar panels and popovers that share focus/popup behavior: navigation panels, Guide, Layers and opacity, Notifications, About/Version, Geolocator, and panel switching.
- Pointer zoom/drag/wheel, keyboard pan/zoom and map actions, fullscreen, two maps, static maps, French, resizing/reflow, and repeated open/close/unmount sequences.

Do not treat the map canvas as a substitute for accessible alternatives or as evidence that every map operation is keyboard-operable. Verify the surrounding controls and the tested map actions explicitly.

## Version and comparison method

### Source snapshot inspected for this plan

- `git fetch upstream develop` succeeded. Refreshed `upstream/develop`, `HEAD`, and their merge base were all `89e86e533efdcef84d44c109855e23c3169b7371` (`feat(ui) Normalize font sizes through theme typography`, PR #3741).
- Therefore, this review's baseline is the refreshed `upstream/develop` snapshot at that commit. There are no committed feature commits ahead of it in this checkout.
- The candidate is the current **uncommitted worktree**, not a commit: the Settings implementation is untracked (`settings.tsx`, `settings-style.ts`); the other candidate changes are unstaged, including source, EN/FR locale files, and accessibility documentation. No staged changes were reported.
- The existing `docs/audit/` path is locally ignored by `.git/info/exclude`. This plan is saved there without staging or changing that ignore rule. Its presence on disk does not mean Git will include it.
- Read only `packages/geoview-core/src/` as runtime source. Do not compare stale `public/builds/` output.

### Safe execution for a future before/after run

1. Preserve the developer's current worktree exactly: do not checkout/reset it, stash, stage, commit, or apply a reverse patch there.
2. Materialize the baseline in a separate worktree at the exact baseline commit. Materialize the candidate in a second isolated directory from an immutable copy of the exact reviewed candidate snapshot, including its unstaged changes and both untracked Settings files. Record a manifest or hashes of the copied source and locale files so the candidate is reproducible. Do not use a clean `git worktree` at `HEAD` as a substitute for the dirty candidate.
3. Use separate development-server processes/ports and browser profiles for baseline and candidate. Start and stop only processes created for this test. Never reuse or stop a pre-existing shared viewer.
4. Use the same browser/OS, demo configuration, viewport, map content where deterministic, locale, theme, and test-data state for both. Record external layer/network failures; do not score scenarios whose map content did not load.
5. Suggested starting fixture is the dynamic demo previously used for implementation checks: `demos-navigator.html?config=./configs/navigator/demos/09-basic-footer-layers-tab.json`. Confirm it serves the exact isolated source. Keep a second dynamic viewer and a host-page focusable control available for cross-viewer/boundary tests.
6. First record each version's actual result without assuming parity. Then apply the candidate acceptance criteria below. Log an intentional behavior difference only where it matches the documented policy; log all other differences as regressions or unresolved.

No separate baseline or candidate server was started for this review.

## Relevant contracts, source, and external references

The public behavior contract is [docs/app/accessibility.md](../app/accessibility.md), especially “Keyboard Navigation Mode,” “Keyboard Focus Indicators,” “Focus Traps for Enhanced Navigation,” and “Intentional Interaction Patterns.” The earlier investigation and bounded browser evidence are in [WCAG_MODE_MOUSE_INTERACTION.md](WCAG_MODE_MOUSE_INTERACTION.md); use its Phase 2 table as **historical evidence**, not as a substitute for rerunning on the exact candidate.

Source checkpoints for the reviewer:

- `packages/geoview-core/src/core/containers/shell.tsx` — Settings lifecycle handoff to `FocusTrapDialog`, viewer shell trap, and skip-link handlers. The candidate changes the outer MUI trap to `disableEnforceFocus` while retaining the keyboard boundary (`:515`).
- `packages/geoview-core/src/core/containers/focus-trap.tsx` — shared mode lifecycle, entry prompt, skip-link focus, Ctrl+Q, and prompt pointer dismissal.
- `packages/geoview-core/src/core/components/app-bar/buttons/settings.tsx` and `settings-style.ts` — switch state, non-modal dialog semantics, focus-owner restoration, click-away, Escape, and theme styles.
- `packages/geoview-core/src/core/components/common/focus-trap-container.tsx` — single inner focus owner, boundary, Exit, and delayed focus behavior.
- `packages/geoview-core/src/core/components/common/hooks/use-map-popover.ts`, `ui/popper/popper.tsx`, `ui/switch/switch.tsx`, and `ui/panel/panel.tsx` — shared popup close/focus, wrapper semantics, and switch label/state behavior.
- `packages/geoview-core/src/core/components/map/map.tsx` and `packages/geoview-core/src/geo/map/map-viewer.ts` — map region name, Ctrl/Cmd+M, blur/Tab crosshair state, pointer-hover focus, and OpenLayers interaction configuration (`defaultInteractions({ onFocusOnly: false })`).
- Coupled surfaces: `core/components/app-bar/app-bar.tsx`, `app-bar/buttons/version.tsx`, `notifications/notifications.tsx`, `nav-bar/nav-bar-panel-button.tsx`, and `geolocator/geolocator.tsx`.
- MUI requested version is `^9.4.0` in `packages/geoview-core/package.json`; the Rush lockfile resolves `@mui/material@9.5.0`. No installed `node_modules/@mui/material` package was available in this checkout to inspect.

MUI MCP documentation was consulted for the locked version, Material UI 9.5.0, using `useMuiDocs` and `fetchDocs`. The following guidance informs the tests; it does not establish that the implementation passes them:

- [MUI Modal](https://llms.mui.com/material-ui/9.5.0/react-modal.md) and [Modal API](https://llms.mui.com/material-ui/9.5.0/api/modal.md): MUI normally contains and restores modal focus, warns that disabling automatic/enforced focus generally reduces modal accessibility, and requires naming relationships. Windows beneath a genuine modal are inert. Relaxing a non-modal viewer boundary is not permission to relax real modal dialogs; verify the latter independently.
- [MUI Popper](https://llms.mui.com/material-ui/9.5.0/react-popper.md): positioning does not provide a complete accessible dialog or dismissal policy. Verify the project's wrapper and consumers, not just the MUI primitive.
- [MUI Switch accessibility](https://llms.mui.com/material-ui/9.5.0/react-switch.md): associate the visible label with the input; if there is no label, name the actual input through `slotProps.input`. Check that the wrapper forwards naming to the interactive input rather than only its decorative parent.
- [MUI Click-Away Listener](https://llms.mui.com/material-ui/9.5.0/react-click-away-listener.md): leading mouse/touch events have different behavior from completed clicks, and leading-event handling ignores scrollbar interactions. The injected click handler can make an otherwise noninteractive wrapper appear clickable to screen readers; inspect whether a presentational wrapper is appropriate without hiding its interactive descendants. Test portals and scrollbar interaction explicitly.

## Prior evidence and remaining coverage

The Phase 2 section in `WCAG_MODE_MOUSE_INTERACTION.md` records browser checks dated 2026-11-06 for: repeated Settings toggles and Tab/Shift+Tab; pointer persistence; Settings Escape and host click-away; Guide search and Layers opacity; pointer wheel zoom while Guide search has focus; Ctrl+M and Ctrl+Q; entry enable and pointer-dismissed prompt; two dynamic viewers; genuine modal containment and precedence; Notifications/Basemap/About; French labels; static absence of Settings; and a French fullscreen resize. It also reports a prior implementation/translation/format validation pass.

Treat those results as useful leads, **not verification of the present snapshot by this plan**. The report does not establish a complete keyboard-only path through every entry/exit/panel state, every dismissal direction, all shortcut precedence, all map interactions, browser/OS coverage, high-contrast/reduced-motion behavior, automated accessibility scan results, or screen-reader behavior. The historical baseline investigation also records pointer movement unexpectedly exiting mode and returning focus to the top skip link. Reproduce that baseline behavior separately from direct focus changes caused by enabling the mode.

## Test setup and common observations

For each version, use a fresh browser context where possible. Record browser/OS/version, URL and source snapshot, locale, light/dark theme, static/dynamic config, viewport in CSS pixels, zoom level, pointer location, and whether the viewer/map finished loading. Start once with the pointer outside the viewer and once with it positioned over the viewer/Settings area before keyboard entry.

Use three distinct input protocols; do not infer one from another:

1. **Mouse-only:** interact by pointer, including enabling/disabling the Settings switch, pointer movement, panel changes, drag/wheel, click-away, and host-page targets. Record focus only as an observed side effect; do not use keyboard actions to rescue a failed pointer path.
2. **Mixed input:** enter by keyboard, deliberately alternate pointer and keyboard within the same task, and verify that a pointer operation does not destroy the user's mode or leave later keyboard input aimed at a surprising element. Also test keyboard entry followed by a pointer click outside and then keyboard continuation from the clicked control.
3. **Keyboard-only:** from a fresh page, use only Tab/Shift+Tab, Enter/Space, arrows, Escape, and documented shortcuts. Confirm the pre-existing useful route still works, including entry prompt/skip links, opening and leaving panels, and map keyboard actions. Do not use pointer interaction until the end of the run.

At every step, capture the active element (visible focus and `document.activeElement`), mode state (`activeTrapGeoView` reflected by the UI), crosshair state, open panel/modal, and console errors/warnings. For relevant checks also capture the browser accessibility tree and a screenshot. Wait for animations and focus-delay jobs to settle before recording the result; additionally sample immediately after the action and after a short delay to catch late focus theft.

## Scenario matrix

### A1 — Keyboard-only entry and both skip directions

**Steps:** Fresh dynamic viewer; Tab into viewer; test entry prompt, Enable, Skip, top-to-bottom and bottom-to-top link routes; repeat after prompt dismissal.

**Expected:** Prompt and links are reachable and named; focus order and resulting focus are visible and deterministic. Enable uses the shared mode and initially lands on the documented main-content skip link, not an unintended map focus. Skip remains a usable route that does not enable the mode. Compare baseline prompt/skip behavior; the candidate's documented initial destination is an intentional contract.

### A2 — Mouse-only and mixed Settings transitions

**Steps:** Open Settings by click in mode off/on; toggle on/off/on repeatedly; move pointer within/outside viewer and Settings; click switch and other controls.

**Expected:** Switch state tracks the same mode as the prompt; Settings remains open and the switch remains focused when toggled. Pointer movement alone does not disable enabled mode. Opening/closing does not produce stack overflow, duplicate owners, stale state, or focus jumps after a delay.

### A3 — Entry/exit and cancellation

**Steps:** Enable from prompt and Settings; close prompt by pointer movement, Skip, Escape, and normal dialog controls as applicable; exit by Settings and Ctrl+Q; interrupt each delayed focus operation by deliberately focusing/clicking another valid target.

**Expected:** Each route has a documented destination; cancelled focus work does not steal focus after the user acts elsewhere. Ctrl+Q exits only the focused viewer, turns off crosshair/mode, and follows documented focus restoration.

### A4 — Tab boundaries and visible focus

**Steps:** In mode on, enter Settings, Guide, Layers, another app-bar panel, and footer panel. Traverse every control with Tab/Shift+Tab; use Close/Exit and reopen; repeat with a control at each boundary.

**Expected:** One active inner owner at a time; expected wrap/exit boundary is consistent in both directions. No invisible sentinel or disabled element becomes the only focus stop. Focus indication remains visible on each keyboard-focused control, including switch, slider, panel Close/Exit, tab, and host control.

### A5 — Click-away and host boundary

**Steps:** With Settings and a non-modal panel open in turn, click another viewer control, shell chrome, host Reset Layers checkbox, and a focusable host link/input; type or press Tab afterward. Repeat while a genuine modal is open.

**Expected:** Non-modal panels close without turning mode off or reclaiming focus from the pointer target; subsequent keyboard input proceeds from that target. A genuine modal retains containment and blocks outside interaction/focus until dismissed. Verify the same results for mouse-down and touch where supported.

### A6 — Panel ownership and nested precedence

**Steps:** Open Layers, then Settings; dismiss Settings by Escape, Close, trigger, and click-away. Open/close Guide, Notifications, About/Version, Geolocator, Basemap, and a right/footer panel. Open Export or another genuine modal while Settings/panel owns focus; close via Escape and Close.

**Expected:** The innermost open surface receives Escape; keyboard dismissal restores its intended trigger/owner without a competing Exit focus job. Pointer click-away preserves the clicked destination. A real modal supersedes the non-modal Settings/panel and restores focus appropriately. No orphaned owner remains after close/unmount.

### A7 — Crosshair, shortcuts, and cleanup

**Steps:** Focus map using Ctrl+M/Cmd+M from map controls and text inputs; test Tab into/out of map, blur, Ctrl+Q, repeat mode off/on, drawing/measurement tool, pan/rotation/info-bar states. While map is focused, test Arrow keys, Shift+Arrow, Enter/Space, Shift+Enter/Space, wheel and drag.

**Expected:** Ctrl/Cmd+M acts only within the focused dynamic viewer, closes popovers before focusing map, activates crosshair, and does not toggle mode. Arrow/Enter/Space behavior matches documented map semantics and does not scroll the page unexpectedly. Real blur deactivates crosshair interactions but preserves mode. Tab or Ctrl+Q cleans up stale crosshair, shortcuts, map styles, and focus ownership.

### A8 — Map actions and feature panels

**Steps:** With crosshair active, query a feature; open Details; wait for loading; close with header Close and Escape; test sketch/measurement cancel sequence and fullscreen Escape precedence.

**Expected:** Feature details and drawing/measurement actions use the documented focus and map coordinate; one Escape cancels only the innermost pending action, and a subsequent Escape behaves as documented. Loading/status updates do not move focus unexpectedly. Fullscreen Escape follows the known browser/dialog precedence and does not leave mode or trap in a stale state.

### A9 — Pointer interaction while another control owns focus

**Steps:** Focus Guide search, switch, or another input; use wheel over map, drag/pan, and a pointer target without clicking the map; then Tab/Shift+Tab. Repeat with an active crosshair before and after the map actually blurs.

**Expected:** Pointer zoom/drag still works where intended without unsolicited focus theft or disabling mode; input value and keyboard focus persist. Crosshair interaction state is cleaned up when map focus genuinely leaves.

### A10 — Shared popup regression

**Steps:** In mode on/off, open/close Notifications (including remove/remove-all), About/Version, Geolocator, navigation popovers, and map popovers through click, keyboard, Escape, and Ctrl/Cmd+M. Repeat rapidly and after switching panels.

**Expected:** Correct accessible names/states and dismissal destinations; no popover reopens or steals focus after map focus transfer; no unrelated popup closes unexpectedly. For transient notification content, inspect live-region changes and ensure actions remain keyboard operable.

### A11 — Multiple viewers and static map

**Steps:** On a page with two dynamic maps, enable both; transfer by pointer and keyboard; invoke Ctrl+M/Ctrl+Q while focus is in each. Separately test a static viewer using mouse and keyboard.

**Expected:** Viewer state and shortcuts are scoped to the focused map; handoff does not leave both viewers fighting for focus. Static map does not expose dynamic Settings/crosshair navigation actions, but its remaining controls and attribution/scale are still reachable.

### A12 — EN/FR and theme

**Steps:** Repeat core A1–A7 in English and French; use supported light/dark/custom theme, plus forced-colors/high-contrast and reduced-motion preferences if available.

**Expected:** Every visible and accessible name/state is localized; no missing key or raw key appears. Switch has a clear checked/on state. Focus indicators and panel text remain distinguishable; no style depends on a nonstandard theme extension without guarding it. Reduced motion must not break delayed focus, panel ownership, or dismissal, and must not introduce unnecessary motion.

### A13 — Resize, zoom, and text spacing

**Steps:** At narrow/mobile and desktop widths, resize while Settings/panel/modal is open; test 200% and 400% browser zoom, enlarged text, and WCAG text-spacing overrides. Include fullscreen and a long French label.

**Expected:** Settings and Close/Exit remain reachable/visible, content reflows without obscuring controls or focus, and scrolling remains possible. Distinguish map-canvas limitations from app chrome; do not accept clipped Settings or a focus target outside the viewport.

### A14 — Repetition, unmount, and interrupted work

**Steps:** Repeat open/toggle/close and switch panels at least 10 times; close a panel while delayed focus is pending; unmount/remove a viewer with Settings/panel open; re-open viewer; repeat with Escape and click-away.

**Expected:** No stale timer/RAF restores focus to detached or unrelated content; no duplicate listeners, lost focus trap, growing console errors, or state leakage into a remounted/other viewer.

### A15 — Mode-off keyboard access and pointer cancellation

**Steps:** With mode off, use keyboard-only navigation from the host page through the entry/skip flow and into Settings. Traverse Settings without enabling mode, then close it by keyboard. Separately, press the pointer down on the mode switch, move away, and release; repeat on Close and other shared popup actions. Drag panel/host scrollbars while a click-away surface is open; repeat with a portal-mounted dropdown.

**Expected:** Turning enhanced navigation off must not make essential controls keyboard-inoperable or prevent a usable bypass/exit route. Document any deliberate entry prompt instead of assuming unrestricted tabbing. An aborted switch/control click must not perform an irreversible action on pointer-down without a valid exception or undo mechanism. Early popup dismissal is not automatically a failure: evaluate whether it causes lost input, an unintended underlying action, or inaccessible focus. Scrollbar use must remain possible; portal children must not be mistaken for outside targets.

### Execution precision and minimum evidence

- For A1, record the actual ordered focus destinations for both skip directions, Enable, and Skip in each version. For A4, capture the complete forward and reverse sequence in Settings plus at least one footer and one AppBar panel, not just the first successful Tab.
- For keyboard-only runs, park the pointer outside the viewer before loading and do not move it. Repeat the candidate's entry sequence once with the pointer stationary over the viewer to catch layout-triggered hover events. Programmatic focus may instrument observations but must not substitute for reaching controls by keyboard.
- For focus races, sample immediately, after the configured animation/focus delay, and after one second. Repeat at least 10 cycles. For the switch, compare exposed checked state and actual per-map mode after every transition.
- At 200% text enlargement, require all controls/content to remain usable. For reflow, test a 320 CSS-pixel-wide viewport (or 1280-pixel viewport at 400% browser zoom); do not substitute CSS `zoom` for browser zoom. The two-dimensional map exception does not automatically exempt Settings, headings, search, or buttons.
- Apply text spacing without loss of content/function: line height 1.5 times font size, paragraph spacing 2 times font size, letter spacing 0.12 times font size, and word spacing 0.16 times font size. Measure text contrast against the rendered background: 4.5:1 for normal text or 3:1 for qualifying large text; relevant control/state visual information needs 3:1 non-text contrast. Record focus visibility separately rather than claiming a WCAG 2.2 focus-area requirement.
- Minimum browser coverage: current Chromium and Firefox, plus Safari on macOS where available. Record exact versions. An unavailable browser is a coverage gap, not a pass. Include at least one native macOS Cmd+M check because browser/OS shortcuts can intercept it.
- Test modal containment through both actual Tab navigation and an attempted outside focus. A valid focus destination can be the modal's focusable container rather than a descendant with `role="dialog"`; confirm it is inside the active modal and that no inert background element can be operated.

### Detailed interaction checks

#### Entry, Settings, mode and focus

- Test both keyboard entry routes: Tab from the page into the viewer and both skip-link directions. The entry prompt should not appear repeatedly after it has been dismissed for the current viewer session unless the documented lifecycle says otherwise.
- With the pointer stationary over Settings before enabling, distinguish focus immediately after the switch click from focus after real pointer movement. The previous report reproduced the “Skip after Map element” destination after pointer movement, not as the direct result of Enable; record these as separate observations.
- Confirm mode entry and exit use the same per-viewer lifecycle. Check `checked`/on state, mode class, crosshair state, focus owner, active element, and tab sequence before/after each transition. Repeat via Settings, entry prompt, Ctrl+Q, and a second viewer.
- Settings is a non-modal anchored dialog. Confirm the button's name, `aria-haspopup`, expanded state and relationship to the open panel; confirm the panel has a programmatic name and does **not** claim `aria-modal=true`. Its focus boundary must still work when active, while an intentional pointer click-away is allowed.
- Test Escape while focus is on the switch, Close button, other panel content, host control, active modal, map, and during fullscreen. Escape must affect only the topmost cancellable surface and must not both cancel a child operation and close its parent in the same press.

#### Map keyboard and pointer behavior

- Check ArrowUp/Down/Left/Right pan, documented Shift+Arrow step changes, and zoom controls. Verify keyboard events do not trigger browser scrolling when map focus owns them; do not require page-level interception when focus is in a text field.
- Test Enter and Space for supported map actions, including drawing/measurement and feature query, plus Shift variants. Compare actions to the visible crosshair location rather than assuming a stale mouse coordinate. Check screen-reader live/status content is present in the accessibility tree but do not claim it was announced correctly.
- Test Ctrl+M and Cmd+M on macOS, Ctrl+Q, Tab away, map blur, mode toggles, and fullscreen transitions in combination. Verify popover closure and final focus after delayed render/animation; check that a shortcut in one map does not affect a second map.
- Exercise wheel and drag while focus is on a Guide search field and while keyboard mode is on. Verify map navigation still works as designed without stealing the input's focus; verify switching focus away from the map clears crosshair-only interactions, not the overall mode.
- Test Layers opacity with pointer drag and keyboard arrows, focus order to Exit and back, Guide search typing followed by Tab, panel switching, and scrollable content at both scroll endpoints. Confirm parent page scroll does not trap or chain unexpectedly when the panel reaches its limits.

## Semantics, names, focus, and visual inspection

Use browser accessibility-tree inspection and DOM inspection to check, at minimum:

- Settings trigger: button role; translated “Settings”/“Paramètres” name; correct expanded/collapsed state and popup relationship. The switch is exposed as a switch or checkbox consistently with the wrapper's intended native/MUI semantics, has the visible translated label, and exposes the correct checked state after every toggle.
- Settings panel: dialog role/name, no false modal state, Close button name, and a valid title relationship. Ensure the panel is not exposed as open when visually closed or left focusable while closed.
- Entry prompt and real modal: dialog name/description are associated; genuine modal reports modal semantics and contains keyboard focus; modal close restores an appropriate target.
- Map: named region and focusability only where intended; map loading/status and shortcut/live text have appropriate status semantics and do not create duplicate or incessant announcements. Closed/hidden panels and controls are absent from sequential keyboard navigation and appropriately hidden from the accessibility tree.
- Buttons, links, app-bar tabs, switches, sliders, search fields, and panel headings have unique useful names/roles/states. Verify visible label matches the accessible name (including the label-in-name expectation for speech input) and all ARIA ID references resolve uniquely.
- Observe focus indicator at every tab stop against its adjacent background, including focused icon controls and input fields. Verify indicator visibility is not suppressed by active/inactive classes or a pointer-induced focus state. Use project focus tokens/helpers; the Settings style currently uses MUI palette roles and spacing and does not define a custom theme extension.

If available, run an axe-style scan against the loaded candidate and representative baseline states without installing dependencies. Record tool/version, route, state, and findings. An automated scan is supplemental only: it cannot establish keyboard operation, logical focus order, visual focus visibility, correct map interaction, announcement quality, or WCAG conformance.

## Applicable WCAG 2.1 AA criteria in this focused scope

Use these as review prompts, not as a claim that the full criteria or application were audited:

- **1.3.1 Info and Relationships; 1.4.3 Contrast (Minimum); 1.4.4 Resize Text; 1.4.10 Reflow; 1.4.11 Non-text Contrast; 1.4.12 Text Spacing** — names/labels/relationships, control and focus contrast, and usable Settings/panel layout at enlargement and narrow widths. Apply reflow checks to application chrome and content; distinguish the map canvas from the non-map UI.
- **2.1.1 Keyboard; 2.1.2 No Keyboard Trap; 2.4.1 Bypass Blocks; 2.4.3 Focus Order; 2.4.6 Headings and Labels; 2.4.7 Focus Visible** — complete keyboard routes, purposeful skip links, boundaries with discoverable exits, logical/restored focus, and visible focus.
- **2.5.1 Pointer Gestures; 2.5.2 Pointer Cancellation; 2.5.3 Label in Name; 2.5.4 Motion Actuation** — check applicable gestures and their alternatives, activation/cancellation behavior, and switch naming. Do not infer a failure merely because maps support drag; evaluate the supported task and its alternatives.
- **3.1.1 Language of Page; 3.1.2 Language of Parts; 3.2.1 On Focus; 3.2.2 On Input; 3.3.2 Labels or Instructions** — EN/FR state, stable focus, and no unexpected context change from changing the switch.
- **4.1.2 Name, Role, Value; 4.1.3 Status Messages** — accurate names/roles/states and status semantics for the controls and messages in this scope. Tree inspection is not a substitute for testing actual assistive-technology output.

Do not use WCAG 2.2-only criteria as WCAG 2.1 AA requirements. They may be recorded as supplemental observations, not release blockers under this plan unless separately adopted.

## Known issues, risks, and classification

### Baseline defect / intentional difference

- The historical baseline check reports that pointer movement after enabling mode turns the mode off and moves focus to the top skip link. This is a confirmed baseline UX/accessibility defect to record, not a requirement to preserve. Candidate acceptance is that pointer movement alone leaves mode enabled and does not unexpectedly relocate focus.
- The baseline has no permanent Settings mode switch. Compare the entry prompt, skip navigation, map controls, and shared panels on both versions; test the candidate's new Settings route directly against its documented contract rather than inventing a baseline control.

### Candidate code-backed risks to verify at runtime

- **Non-modal outside focus and retained keyboard boundary (high priority):** candidate `shell.tsx:515` changes the outer MUI FocusTrap to `disableEnforceFocus`; `focus-trap-container.tsx` also uses a non-enforcing trap while implementing its keyboard boundary. This is intentional for pointer click-away, but it makes the host-control focus/Tab continuation contract a release-critical behavior. Test A4–A6, including a real host checkbox and a true modal.
- **Focus-owner races (high priority):** `settings.tsx` coordinates ownership and restores prior owners (`:65–203`); `FocusTrapContainer` has delayed focus behavior. Rapid close/reopen, Ctrl+M popover closure, click-away, modal takeover, and unmount must not allow stale work to steal focus. The existing report says several representative transitions passed; rerun them on the exact candidate.
- **Pointer operation without focus theft (high priority):** `map-viewer.ts` deliberately suppresses map hover-driven focus in active mode while configuring interactions with `onFocusOnly: false`. Verify wheel and drag with focus in an input and after actual map blur, in both modes. A static source inspection cannot prove OpenLayers behavior.
- **Dialog versus modal semantics (high priority):** Settings is exposed as `role="dialog"` and the button advertises a dialog (`settings.tsx:204–255`), but it is intentionally non-modal and does not set `aria-modal`. Verify the live accessibility tree and outside interaction match that policy; a role/name inspection alone does not prove correct modal behavior.

These are risks and required observations, not established candidate failures. No confirmed candidate-only WCAG violation was established by this static review. Conversely, absence of a code-level violation is not a pass for runtime interaction or WCAG conformance.

### Verified source-review note

- **Theme token mismatch (confirmed project styling-guidance violation; not itself a WCAG finding):** `packages/geoview-core/src/core/components/app-bar/buttons/settings-style.ts:22` gives the new Settings chrome panel `theme.palette.background.paper`. Shared UI guidance reserves `surface.low`/`surface.high` for chrome planes. Select the appropriate surface role for this floating panel; if the custom palette extension is optional in the component's supported themes, guard it and provide a safe fallback. This review is source-read-only, so no runtime/style file was changed.
- The new Settings controls use translated names/labels (`appbar.settings`, `appbar.keyboardNavigation`, `general.close`), the switch wrapper receives a caller ID, and the panel has a title relationship. Imports in the new Settings component use direct `@/ui/...` modules rather than the `@/ui` barrel. No direct missing name or `t()` key was found in the reviewed Settings markup; `npm run ai:check` passed for the current candidate's EN/FR and AI consistency checks.
- The Settings style uses standard palette/spacing fields; it does not dereference an unguarded custom theme extension. Focus indication is delegated to the shared controls/theme behavior and must still be visually tested.

## Prioritization, pass criteria, and release gate

**Block release / P0:** keyboard cannot enter or leave the viewer/panel; mode or crosshair cannot be turned off; focus becomes lost, repeatedly stolen, or trapped with no usable exit; genuine modal containment fails; keyboard-only map/panel tasks cannot be completed; wrong map/viewer receives shortcuts; or an actionable control has no usable name/state.

**Must fix before accessibility sign-off / P1:** inconsistent mode/switch state; non-modal click-away changes focus to an unrelated element; Escape closes multiple surfaces or prevents reaching the intended destination; focus indicator absent on a required control; key shared popup regresses; EN/FR labels or dialog descriptions are missing; critical controls clip or become unreachable at tested zoom/reflow.

**Record and triage / P2:** minor visual alignment, non-blocking animation or warning, or an issue with a viable equivalent route and no loss of state/task completion. Explain impact and owner; do not suppress a material keyboard/focus issue as cosmetic.

A candidate passes this **focused plan** only when all P0/P1 scenarios pass in the specified input mode and locale, no unexplained baseline-to-candidate regression remains, any intentional differences are documented, and all blocked scenarios have an owner and disposition. It does not imply full-app WCAG 2.1 AA conformance. Any release statement must state the tested browser/configuration and remaining AT/manual limitations.

## Test record template

For each scenario, save:

```text
ID / date / tester:
Version: baseline commit or candidate snapshot hash/manifest:
Browser + OS / URL / map config / map load state:
Input protocol: mouse-only | mixed | keyboard-only
Locale / theme / viewport CSS px / browser zoom:
Initial pointer position / focused element / mode / open surface:
Steps actually performed:
Expected behavior:
Observed behavior immediately and after focus/animation delay:
Accessibility-tree/DOM checks (if applicable):
Console errors/warnings / network failures:
Evidence (screenshot, trace, notes; no user data):
Result: pass | fail | blocked | not applicable
Severity / baseline comparison / intentional difference:
Follow-up owner and disposition:
```

## Non-goals and remaining work

This plan does not require adding a test dependency, modifying runtime code, running a production build, or changing translations. A focused axe-style scan is optional only when an existing tool is available. If validation requires an unsupported browser/tool or a failed map service prevents the scenario, mark it blocked rather than claiming success.

No screen-reader user sessions, exhaustive browser/device matrix, complete visual-contrast measurement of every viewer control, or full application audit is included. The minimum browser checks above remain planned, not executed. Source and accessibility-tree checks can catch obvious naming/role/state defects but cannot verify pronunciation, timing, duplicate announcements, reading order in real assistive technology, or the user's ability to complete tasks. Those remain explicit coverage limits before any certification or broad conformance claim.
