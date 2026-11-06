# WCAG mode: mixed-input interaction review

## Scope

This note records the investigation, approved focus policy, and implementation checks for persistent mixed mouse/keyboard navigation. The initial request was documentation-only; the user subsequently approved implementation of the policy on 2026-11-04. Earlier experiments below are historical evidence, not the current behavior.

## Phase 2: approved implementation (2026-11-04); final verification (2026-11-06)

The user explicitly approved: **"Approve the policy and proceed with staged implementation."**

Settings is now a permanent, non-configurable AppBar button below Notifications on dynamic maps. Its switch controls the existing per-map `activeTrapGeoView` lifecycle. Mouse movement no longer exits enabled mode. Settings retains its switch focus when toggled; non-modal focus boundaries permit intentional outside clicks; genuine modals retain strict containment.

### Additional root causes found during implementation

- **Map hover overrides keyboard dismissal.** Closing Settings under a stationary pointer generated `mouseenter`, moving focus from the restored Settings trigger to the map. Hover no longer changes focus during enabled mode, and mode-off hover respects keyboard-visible/dialog focus.
- **Pointer interactions depended on hover stealing focus.** Once hover focus was suppressed, OpenLayers' implicit focus-only interactions blocked wheel zoom from Guide search. Explicit default interactions with `onFocusOnly: false` restored pointer zoom/pan without taking focus from the input. Actual map blur now deactivates crosshair interactions without disabling the navigation mode.
- **Delayed focus can override deliberate input.** Entry/exit and popup jobs are cancellable and check whether focus has moved. Restoring panel ownership uses `focusOnEntry: false` instead of scheduling another jump to Exit.
- **Animated popup identity must be stable.** The shared animated Popper component is now created at module scope so state updates do not replace the focused subtree.
- **The entry prompt's overlay intercepts movement.** Inactive prompt dismissal listens on the map root, including its backdrop, while exempting movement within the dialog itself. Zero movement is still ignored. The EN/FR prompt no longer claims that outside focus is locked.
- **A custom Switch ID could sever its visible label.** The wrapper previously used a generated `htmlFor` while forwarding a caller-supplied ID to the input. It now applies the same ID to both, and the Settings switch's accessible name was verified through a browser role/name query.

### Browser regression checks

Playwright checks used the actual running viewer, real clicks/keyboard input, and temporary browser-only additional viewers. They did not modify demo files. The primary demo was `demos-navigator.html?config=./configs/navigator/demos/09-basic-footer-layers-tab.json`.

| Scenario                                              | Verified result                                                                                                               |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Settings on/off/on, including over Layers             | Panel stayed open and switch stayed focused; no competing-trap page errors in controlled checks.                              |
| Settings switch with caller-supplied ID                | The visible Keyboard navigation label named the switch in the accessibility tree; checked state matched the mode.             |
| Tab/Shift+Tab from the enabled Settings switch        | Wrapped to Close and back to the switch.                                                                                      |
| Real pointer movement while enabled                   | Mode remained enabled and keyboard position was preserved.                                                                    |
| Settings Escape after repeated toggles                | Returned to the Settings trigger, including with Layers open; no subsequent hover jump.                                       |
| Click-away to host Reset Layers checkbox              | Settings closed; checkbox retained focus; mode stayed enabled.                                                                |
| Guide search, typing, then Tab                        | Search retained entered text; Tab advanced to Previous match.                                                                 |
| Layer opacity slider, then Tab                        | Slider accepted value 50; Tab reached the panel Exit boundary without an unsolicited pre-Tab jump.                            |
| Guide input focused, wheel over map                   | Zoom changed from 3.5 to 4.5 while focus remained on Guide search.                                                            |
| Ctrl+M, then click Guide search                       | Crosshair became visible, then hid when actual focus left the map; navigation mode remained enabled.                          |
| Disable through Settings                              | Switch retained focus; map ArrowRight no longer panned (center unchanged).                                                    |
| Ctrl+Q from Settings                                  | Mode switched off and focus returned to the outer top skip link; switch reflected off state.                                  |
| Entry dialog enable                                   | Enabled the same mode and focused the inner main-map skip link.                                                               |
| Inactive entry prompt                                 | Synthetic zero-movement event left it open; real movement outside the dialog dismissed it without enabling mode.              |
| Two dynamic viewers, both enabled                     | Pointer focus handed over; Ctrl+Q exited only the focused viewer and returned to that viewer's skip link.                     |
| Genuine Export dialog                                 | `aria-modal=true`; attempted outside focus was reclaimed within the modal focus container; Escape returned to Export trigger. |
| Programmatic Export opening while Settings owns focus | Settings yields to the modal by closing without restoration; it does not leave a stale active panel behind.                   |
| Notifications, Basemap, About                         | Escape after initial-focus transition returned to their triggers; no page errors in the controlled consumer check.            |
| French dynamic viewer                                 | Paramètres and Navigation au clavier were accessible; switch enabled mode and Escape restored its trigger.                    |
| Static viewer                                         | Settings button absent.                                                                                                       |
| French viewer fullscreen, then 700 x 900 resize       | Settings remained visible, checked, and within the viewport; mode stayed enabled.                                             |

These are bounded integration checks, not a WCAG certification. External service failures include the demo's intentionally invalid layer URL. Existing diagnostics such as deprecated MUI LoadingButton usage and a Basemap `closePanel` DOM-prop warning were not migrated as part of this work.

### Verification limits and follow-up

Passed implementation checks: core TypeScript (`node packages/node_modules/typescript/bin/tsc --noEmit -p packages/geoview-core/tsconfig.json`), targeted ESLint and Prettier checks for all 17 changed TypeScript files, parity for all 599 EN/FR translation keys, `npm run ai:check --prefix packages`, and `git diff --check`. The final browser pass after correcting the Switch label association reconfirmed the accessible name, repeated switch changes, focus retention during real pointer movement, Tab/Shift+Tab boundaries, host click-away, Escape restoration, Ctrl+Q exit, and strict modal focus containment. Clicking the host checkbox immediately after footer Exit also retained checkbox focus after the delayed job. Footer Exit returned to its tab, Skip reached the bottom skip link, and keyboard entry from the reverse skip path stayed enabled during real mouse movement.

- Screen-reader/assistive-technology and additional browser testing remain manual release checks.
- No new repository test-suite cases were added: trusted pointer/Tab behavior was exercised through Playwright, not approximated with synthetic key events in the in-browser suite. The table above provides reproducible regression scenarios.
- The full Rush build was not run alongside the existing development server; targeted core type-check, lint, formatting, translation-key parity, and AI-documentation checks are the implementation checks.
- This audit is saved on disk but is excluded by the repository's local Git ignore configuration. It must be deliberately included in the eventual review deliverable; no ignore rules or staging were changed.

## Historical investigation

The remaining sections describe the baseline and temporary experiments before the approved implementation.

## Summary in simple terms

Based on the initial testing, **managing focus traps is the hardest part**, not adding the switch. A focus trap keeps keyboard navigation inside the viewer or the panel being used. Focus means the place where the next keystroke will go.

The main challenges are:

- **Moving the mouse cancelled the user's choice in the baseline.** Turning WCAG mode on and then moving the mouse turned it off again and moved the keyboard position elsewhere.
- **Panels can compete for keyboard control.** Opening Settings while another panel holds keyboard navigation caused errors and prevented normal movement through the Settings controls.
- **The mouse and keyboard can end up in different places.** Clicking a control outside the viewer can activate it, but the viewer pulls the keyboard position back inside. The next keystroke may not go where the user expects.

The encouraging result is that clicking, typing, and using Tab together worked inside individual panels. This suggests mixed mouse and keyboard use is feasible, but simply stopping the automatic mouse exit is not enough. We need clear rules for which panel controls keyboard navigation, where the keyboard position goes when panels open or close, and how users leave the viewer.

These were initial findings from one demo, not a guarantee that every interaction would work. No permanent fixes were included at that stage.

## Feasibility spike: decisions and method

The original spike below is historical. The follow-up Phase 1 investigation later in this note evaluates selective enforcement and trap ownership before permanent implementation.

- Agreed contract: WCAG mode enabled means focus trapping enabled. Mixed input is being evaluated, not assumed unsupported.
- One explicit setting shared by the switch and a shortcut is a proposed direction, not yet implemented. Ctrl+Q remains exit-only; the existing entry prompt remains unchanged during this spike.
- Temporarily bypass the mousemove exit handler, exercise pointer and keyboard focus boundaries in the running demo, then restore the original handler. No permanent runtime changes are part of this spike.
- Record observed focus, mode state, and reproducible steps. Distinguish confirmed behavior from suspected causes and tests not completed.

### Baseline behavior

`FocusTrapDialog` installs a `mousemove` listener on the viewer shell when keyboard navigation is entered. Any real movement (`movementX` or `movementY` is nonzero) dismisses the keyboard-entry prompt and exits keyboard-navigation mode. Exit removes the shell key handler, releases the focus trap, deactivates the crosshair, and moves focus to the top skip link. Zero-movement events do not exit the mode.

The public [accessibility guide](../app/accessibility.md) now describes the implemented mixed-input behavior.

## Reported focus issue

When enabling WCAG mode from the Settings panel, focus was observed to jump to the **“Skip after Map element”** link. The activation code currently schedules focus on the `main-map` skip link; mode exit instead schedules focus on the `toplink` (“Skip after Map element”). The observed destination therefore does not match the activation path's explicit focus request and needs reproduction and tracing through the viewer focus trap before assigning a root cause.

## Initial Playwright pass

Tested the dynamic demo at `demos-navigator.html?config=./configs/navigator/demos/09-basic-footer-layers-tab.json` in the integrated browser. This was an initial interaction check, not a full browser or accessibility audit.

| Action                                       | Observed result                                                                                                                                                                                                             |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Open Settings from the AppBar                | Settings panel opened as a dialog; its title and keyboard-navigation switch were exposed by accessible name.                                                                                                                |
| Enable the switch                            | Mode became active, the switch panel closed, and focus settled on `map1-main-map` (“Skip to main content - Map”). The reported jump to “Skip after Map element” was **not reproduced as the immediate result of enabling**. |
| Move the pointer over the map after enabling | Mode exited and focus moved to `map1-toplink` (“Skip after Map element”). This reproduces the reported destination following pointer movement, not directly on switch activation.                                           |
| Press Ctrl+Q from active mode                | Mode exited and focus moved to `map1-toplink` (“Skip after Map element”).                                                                                                                                                   |

This suggests the reported focus jump may coincide with the current pointer-movement exit behavior. Further testing should distinguish the switch activation itself from pointer movement immediately afterward, including cases where the pointer is already over the Settings panel or moves while the panel is open.

## Persistent-mode spike results

The same dynamic demo was tested with only mousemove exit temporarily bypassed; focus traps remained enabled. The integrated browser reported a hidden document. An initial page retained a loading overlay and could not be used; a fresh page loaded successfully. The viewport was enlarged to 1400 x 1600 to keep the map and footer accessible without repeated scrolling. Successful interactions below used normal Playwright clicks, not forced clicks or synthetic focus.

| Action                                                                  | Result                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Enable mode, then move the pointer over the map                         | The `geoview-keyboard-active` class remained present. This verifies the temporary bypass was active. Focus was sampled on `map1-mapTargetElement`; this run does not establish a deterministic activation focus destination.                                                                                                                                               |
| Click the Layers footer tab                                             | The tab opened and focus settled on `map1-footerBar-layers-panel-close-btn` (Exit).                                                                                                                                                                                                                                                                                        |
| Click the Layers opacity slider, then press Tab                         | Opacity changed from 100 to 50. Focus stayed on the slider after 500 ms; Tab wrapped to the panel Exit button. This is a working mixed-input case, not evidence that every panel control works.                                                                                                                                                                            |
| With Layers owning focus, click Settings, wait 500 ms, then press Tab   | Settings opened, but focus settled on its section rather than a control and remained there after Tab. MUI reported that the modal content node did not accept focus, followed by repeated `RangeError: Maximum call stack size exceeded` errors in `HTMLDocument.contain`. **Confirmed blocker:** the current overlapping focus traps cannot safely support this sequence. |
| Click the WCAG switch off in the affected Settings panel                | The pointer click disabled mode and closed Settings; focus settled on `map1-toplink`. Stack-overflow errors were also reported during recovery, so this is not a clean keyboard recovery guarantee.                                                                                                                                                                        |
| Re-enable mode and click the host page's Reset Layers checkbox          | At a 1400 x 2400 viewport with the host and viewer visible, the checkbox toggled from checked to unchecked, but focus immediately returned to `map1-shell` and remained there after 500 ms. **Confirmed boundary mismatch:** pointer action outside the viewer can succeed while keyboard focus is reclaimed by the viewer.                                                |
| Click Guide from Layers while mode remains active                       | Guide became the selected tab and focus settled on `map1-footerBar-guide-panel-close-btn`. Switching footer panels was possible with the pointer.                                                                                                                                                                                                                          |
| Click Guide's search field, type `map`, wait one second, then press Tab | Text entry retained focus and the value `map`; Tab reached Previous match. No forced Exit focus was observed in this sequence.                                                                                                                                                                                                                                             |

### Coverage limits

- One dynamic single-map demo in the integrated browser, not a cross-browser or assistive-technology audit. Multiple active viewers, screen-reader announcements, full-screen panels, and mobile/touch interactions remain untested.
- Pointer-focus theft on first entry to an already-open footer panel remains a code-backed hypothesis, not a confirmed issue: the tested slider and Guide input retained focus.
- The temporary handler bypass is restored after the experiment. No entry-prompt removal, shortcut remapping, trap coordination fix, or permanent change to mode semantics is included.

### Restoration and validation

- Restored the exact pre-spike movement guard: return only when both `movementX` and `movementY` are zero. The existing feature implementation and other worktree changes are preserved.
- An already-open browser page continued to exhibit the bypass behavior after the source restoration, so it was not treated as proof of the restored runtime. Reload timed out waiting for load; a fresh page also stalled on click stability and failed hit testing. **Runtime recheck of restored mouse exit remains pending in a freshly loaded, responsive viewer.**
- Prettier checks for the restored source and audit formatting passed; `git diff --check` passed. The experiment adds no permanent source behavior.
- This audit file is excluded by the local `docs/audit/` Git ignore rule. It is saved on disk but is not included in the branch unless explicitly added.

### Interpretation and proposed follow-up

- Mixed input is not inherently impossible: pointer manipulation and subsequent keyboard navigation worked inside one active panel.
- Simply removing mouse-exit behavior is not a viable permanent change. Settings needs coordinated trap ownership with the active panel, with the previous owner suspended while Settings is open and restored appropriately on close. This is a proposed fix, not implemented.
- The Settings trap root also needs a deliberate focusable initial target. Reproduce the MUI warning independently after ownership is coordinated; do not assume the warning alone explains the competing-trap failure.
- Define the viewer boundary contract explicitly. With trapping required while mode is on, host-page interaction needs a discoverable exit/transfer path; otherwise a mouse user can activate an outside control but continue typing inside the viewer. A multi-map handoff policy requires its own test before claiming coexistence across viewers.
- Keep this as a feasibility result, not a decision to abandon mixed input: the next implementation should coordinate one active inner trap and its return target before permanently removing mouse exit. Retain the single explicit mode setting as a proposed direction until entry and exit semantics are approved.

## Phase 1 follow-up: selective enforcement and ownership (2026-11-04)

### Confirmed implementation objective

The approved objective is a Settings switch for the existing per-map `activeTrapGeoView` mode, usable with both mouse and keyboard. Mode should remain enabled during mouse use, whether enabled through Settings or the existing entry dialog. Keep the dialog, skip links, Ctrl+Q exit, and Ctrl+M / Cmd+M behavior. The Settings switch should retain focus and leave Settings open when changed.

The focus policy below is a recommendation pending approval, not a permanent implementation or a replacement navigation mode.

### Method

- Baseline checkout was clean and the core TypeScript check passed. The old Settings prototype was absent.
- Used the running dynamic-map demo with a 1400 x 2400 viewport and ordinary Playwright clicks/keystrokes. Programmatic focus was used only to enter through the skip link and to probe modal containment.
- Suppressed mousemove propagation with a temporary browser capture listener while testing persistent behavior. This is instrumentation, not a candidate production implementation; it also suppresses other mousemove listeners.
- Mounted a temporary two-control Settings-like panel inside the real shell using the application's exported React and installed MUI FocusTrap. This is not the final Settings component.
- Tested existing strict traps, coordinated ownership through the existing UI controller, then temporarily added `disableEnforceFocus` to the shell and FocusTrapContainer. A full reload was needed to exercise the source edits; results before that reload were not used to evaluate the changed props.
- Genuine Export modal enforcement was not modified. Temporary source props, fixture, and browser instrumentation are removed after the investigation.

### Results

| Test                                                                                                                                     | Result                                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Baseline entry dialog, enable, then real mouse movement                                                                                  | Mode exited and focus returned to `map1-toplink`, reproducing the current behavior on fresh source.                                                                                                                                                                                |
| Suppress mouse exit, then click host Reset Layers checkbox with existing strict shell trapping                                           | Checkbox changed, but focus returned to `map1-shell`.                                                                                                                                                                                                                              |
| With Layers owning focus, mount an independently enforced Settings-like trap and click its switch                                        | Browser reported `RangeError: Maximum call stack size exceeded`; focus settled on the fixture section instead of its switch. This reproduces the competing-trap failure without restoring the old prototype.                                                                       |
| Register the fixture as the active inner owner before interacting                                                                        | Switch retained focus. Tab wrapped to its Close control; Shift+Tab returned to the switch. Ownership coordination solved this tested conflict without requiring all traps to be disabled.                                                                                          |
| Reload with temporary non-modal shell/panel enforcement disabled; enable mode and open Guide, then click the host checkbox               | Focus remained on `resetLayer` after 500 ms while mode remained enabled. Selective enforcement can address the outside-click mismatch.                                                                                                                                             |
| Coordinate the temporary Settings-like owner, relax non-modal enforcement, click its switch, Tab/Shift+Tab, then click the host checkbox | Switch retained focus when changed; Tab and Shift+Tab wrapped between its two controls; the host checkbox subsequently retained focus. A controlled repeat reported no page errors. This verifies primitive focus behavior, not final Settings lifecycle cleanup.                  |
| After the host click, naively restore Layers ownership                                                                                   | Focus jumped to `map1-footerBar-layers-panel-close-btn`. The explicit delayed Exit-focus effect overrides the outside target even with enforcement disabled. Restoration must distinguish keyboard dismissal from pointer click-away.                                              |
| Open the genuine Export modal with non-modal enforcement relaxed                                                                         | Programmatic focus on the host checkbox was reclaimed into the modal's focus container. Tab reached an input inside the dialog. Escape closed Export and returned focus to its trigger, while mode remained enabled. This is a containment check, not screen-reader certification. |

### Recommended policy for approval

- Treat the viewer, normal panels, and anchored Settings as non-modal navigation areas. Allow pointer focus to leave them without switching mode off or reclaiming focus. Retain appropriate keyboard focus indicators.
- While mode is enabled, retain Tab/Shift+Tab looping in the active working panel and viewer. Keep an explicit panel Exit path and Ctrl+Q / Settings mode exit; `disableEnforceFocus` alone does not remove MUI's boundary sentinels.
- Coordinate one active inner owner. Opening Settings suspends the previous panel trap; nested genuinely modal dialogs take precedence over Settings. The outer viewer remains a navigation boundary, not a competing inner owner.
- Keep Settings open and focus on its switch for both switch transitions. Keyboard close/Escape returns focus to the Settings trigger and restores prior panel ownership without scheduling another focus jump. Pointer click-away preserves the clicked target; do not blindly restore a panel's Exit focus.
- Escape acts on the innermost open surface only. A footer Exit releases its inner trap and returns focus to its tab. Preserve existing entry-dialog focus behavior and Ctrl+Q's explicit mode-exit destination; do not remap Ctrl+M.
- Keep genuine modal dialogs enforced and accurately described as modal. Remove `aria-modal` claims from normal panels if pointer interaction outside is allowed.
- Each viewer retains its mode independently. A click into another viewer should hand over focus rather than trigger a contest; test two enabled viewers during implementation before accepting this behavior.

### Implementation and validation work remaining at the end of Phase 1

Approval was required before permanent implementation of the policy. Full Settings lifecycle changes, cancellation of stale focus jobs, multi-viewer integration, non-modal AppBar semantics, fullscreen/resize, translation checks, automated regression coverage, and assistive-technology testing were not established by this spike. No permanent runtime fix was included in Phase 1; see Phase 2 above for subsequent results.

The two temporary source props were restored exactly and `git status --short` was clean afterward (this audit remains locally ignored). A subsequent full reload confirmed that the browser fixture and instrumentation were gone and mode was inactive. The demo then remained in its map-loading state, preventing a second entry/exit check after restoration; the successful fresh baseline movement-exit check above was recorded before the experiment. Source restoration and browser cleanup are verified, but a post-restoration interaction check is not claimed.

## Historical baseline UX/UI issues

- **The reported focus jump needs further reproduction.** The initial Playwright pass did not reproduce “Skip after Map element” as the direct result of enabling mode; it did reproduce that focus destination after pointer movement exits mode. A jump on activation remains an open observation until repeated with the pointer position and timing recorded.
- **Mixed-input users can lose keyboard context unexpectedly.** A user who enables keyboard mode and then moves the mouse over the viewer to inspect or operate a control immediately exits the mode. Focus is moved to the top skip link, which may be far from the control the user was using.
- **The Settings switch can appear to reverse the user's intent.** The switch reflects the active mode. If a user moves the pointer to the switch while the mode is active, the mouse listener exits mode before the click. The switch becomes unchecked; activating it after that state change can enable mode again, even if the user intended to turn it off.
- **The exit trigger is broad.** Movement over any part of the viewer shell is treated as a return to mouse interaction, rather than requiring an explicit mode-exit action. This can make keyboard mode fragile for users who alternate between mouse and keyboard.

## Initial proposed fixes (superseded by the approved policy)

- Make the intended post-activation focus destination explicit and ensure it is not overridden by focus-trap or exit cleanup. Confirm the desired destination before changing behavior.
- Exempt the Settings panel and its controls from automatic mouse-movement exit, so the switch can reliably turn the mode off.
- Consider making pointer movement alone non-destructive while preserving an explicit, discoverable exit control such as the Settings switch or `Ctrl+Q`.
- If automatic exit remains necessary, restrict it to a clearly defined transition back to pointer interaction and preserve focus at a meaningful viewer location instead of always returning to the top skip link.

## Source references

- [`focus-trap.tsx`](../../packages/geoview-core/src/core/containers/focus-trap.tsx) — owns the shared mode lifecycle, explicit exit, and inactive entry-prompt movement dismissal.
- [`settings.tsx`](../../packages/geoview-core/src/core/components/app-bar/buttons/settings.tsx) — the controlled Settings switch reflects the active keyboard-navigation state.
- [`accessibility.md`](../app/accessibility.md) — current user-facing interaction guidance.
