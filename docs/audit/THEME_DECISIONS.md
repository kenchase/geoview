# Transitions, shadows and font sizes: decisions

Status: **Audit complete 2026-10-29.** Transitions rules R1-R5 and holds H1-H9 are **DECIDED**; R6 is **REVERSED**
2026-10-29, with T29 moved to H6. Original decisions were recorded
2026-10-28. Transitions: **Complete 2026-10-29**; migrated **22**, retained **14**,
held **26**, context **10**. Execution and review history is recorded per unit.
Shadows decisions are **DECIDED**, recorded 2026-10-28; Fonts Gate 2 is
**DECIDED — Decided 2026-10-29**, including fallback policy A.
Fonts: **Complete 2026-10-29**; migrated **3**, retained **24**, held **89**,
context **127**. F-A, F-B and cross-concern X-A are migrated; see the Fonts
migration evidence, including the preserved timing outlier and reproducibility check.
Occurrence authority: [discovery](./THEME_DISCOVERY.md); decision procedure:
the [audit plan](./THEME_AUDIT_PLAN.md), copied unchanged from the supplied
session-state plan.
Existing authority: [colour decisions](./COLOUR_DECISIONS.md),
[held exceptions](./HELD.md), [outstanding work](./WHATS_LEFT.md).

Original decision/discovery source checks used **`cc7d57918`**, via `git show`/`git grep`;
the discovery demo's build provenance remains unknown. Migration runtime evidence
and build provenance are recorded in the ledger and linked baselines below.
Final Transitions source reconciliation compares current commit
`72cda9157311963f61b12e7e6f34f7abb56880ec` against `cc7d57918`.
Closeout changes documentation only; holds and follow-ups are now transferred
to [HELD.md](./HELD.md) and [WHATS_LEFT.md](./WHATS_LEFT.md).

## Transitions

**Complete 2026-10-29.** Final totals: migrated **22**, retained **14**,
held **26**, context **10**; **72** rows reconciled, including T25's Fonts-gate
cross-concern follow-up X-A.

### 1. End state

The plan's goal is that every non-held duration/easing reads
`theme.transitions`. Coupled JS delays/timeouts derive from the same theme value
as the CSS they mirror, or are held with a reason. Every remaining occurrence
is accounted for by a disposition; decided holds are now listed in
[HELD.md](./HELD.md#transitions-holds) with reasons and end conditions.
Gate 2 may revise these goals, but must state them before proposing rules.

**DECIDED clarification:**

Decided 2026-10-28

Preserve no-motion sentinels (`0`,
`none`), caller-controlled/automatic timing and lifecycle-only slots rather than
inventing theme names for them. Treat non-mirroring render/focus waits as
explicit holds when no motion role is established. This distinguishes motion
normalization from changing asynchronous UI behavior; accepted under Q1.

### 2. Classification

T01-T72 identify discovery rows in their existing order, not new occurrences.
Each linked ID points to its exact discovery row, which links to baseline
source. Role means **UI action + target property + state**; consumers below are
visible elements, not implementation paths. Times are milliseconds. A tuple is
`property; duration; easing; delay`, unless the row is explicitly a wait, prop,
slot or configuration field. CSS defaults are distinguished from MUI curves.
Each row has exactly one role below, including shared configuration rows.

| Role | Observable consumer | Row count | Discovery rows | Current timing tuple(s) |
|---|---|---:|---|---|
| Open/close or change slide / library animation props / image viewer active | Enlarged image viewer | 1 | [T01](./THEME_DISCOVERY.md#T01) | Fade 250; swipe 500; curve controlled by library, not specified here |
| Reveal / opacity / panel header and content entering | AppBar panel title and body | 4 | [T02](./THEME_DISCOVERY.md#T02), [T03](./THEME_DISCOVERY.md#T03), [T05](./THEME_DISCOVERY.md#T05), [T06](./THEME_DISCOVERY.md#T06) | Opacity 0 to 1; 500; CSS ease-in-out; title delay 300, body delay 400 |
| Indicate loading / rotation / accordion transition pending | Accordion loading icon | 1 | [T04](./THEME_DISCOVERY.md#T04) | Transform 360deg to 0deg; 1000; linear; 0; infinite |
| Commit keyboard resize / focus / resize popper just closed | Footer resize button | 1 | [T07](./THEME_DISCOVERY.md#T07) | Focus wait 100 after close; comment specifies DOM reflow |
| Navigate match / section availability then scrolling / search result selected | Guide search result and highlighted passage | 2 | [T08](./THEME_DISCOVERY.md#T08), [T13](./THEME_DISCOVERY.md#T13) | Wait 300 after section selection, optionally click collapsed content, wait 100, smooth-scroll; no authored scroll duration |
| Open overlay / focus / overlay visible | Popover close button; popper's configured focus target | 2 | [T09](./THEME_DISCOVERY.md#T09), [T10](./THEME_DISCOVERY.md#T10) | Wait shortest 150; no enforced link to animation completion |
| Exit image viewer / focus / exited callback | Image-viewer launch element | 1 | [T11](./THEME_DISCOVERY.md#T11) | Wait 250 after exited callback, only with active focus trap |
| Expand/collapse footer / scroll into view / header clicked | Footer tab panel | 1 | [T12](./THEME_DISCOVERY.md#T12) | Wait 25, then scroll helper; not a 200ms completion wait |
| Follow anchor / scroll then focus / guide link activated | Guide anchor destination | 1 | [T14](./THEME_DISCOVERY.md#T14) | Browser smooth scroll; focus wait 300; no authored scroll duration |
| Switch view / opacity and content swap / details-settings-info exit then entry | Layer details, settings and information views | 5 | [T15](./THEME_DISCOVERY.md#T15), [T16](./THEME_DISCOVERY.md#T16), [T17](./THEME_DISCOVERY.md#T17), [T18](./THEME_DISCOVERY.md#T18), [T46](./THEME_DISCOVERY.md#T46) | Fade enter/exit 300; four waits 300; Fade easing is not specified at these rows |
| Finish panel toggle / lifecycle and focus work / after container transition | AppBar panel and its controls | 1 | [T19](./THEME_DISCOVERY.md#T19) | Wait standard 300 + buffer 50 = 350 |
| Navigate tab / callback and optional scroll / footer or AppBar tab opened | Destination tool tab; footer panel when applicable | 2 | [T20](./THEME_DISCOVERY.md#T20), [T21](./THEME_DISCOVERY.md#T21) | Caller wait or missing default: undefined, effectively about 0; intended delay unknown |
| Hover/focus / tooltip appearance delay / first tooltip | Layer-list, layer-panel and legend tooltips; reusable tooltip | 4 | [T22](./THEME_DISCOVERY.md#T22), [T23](./THEME_DISCOVERY.md#T23), [T24](./THEME_DISCOVERY.md#T24), [T25](./THEME_DISCOVERY.md#T25) | Initial delay 1000; three theme refs, one wrapper default |
| Hover/focus / tooltip appearance delay / subsequent tooltip | Same tooltip consumers | 4 | [T26](./THEME_DISCOVERY.md#T26), [T27](./THEME_DISCOVERY.md#T27), [T28](./THEME_DISCOVERY.md#T28), [T29](./THEME_DISCOVERY.md#T29) | Three caller delays 1000; wrapper default 200; caller wins |
| Show tooltip / transition component / icon-button tooltip visible | Icon-button tooltip | 1 | [T30](./THEME_DISCOVERY.md#T30) | Fade slot; no duration |
| Complete dialog entry/exit / focus and callbacks / dialog lifecycle | Fullscreen dialog close button; export dialog | 2 | [T31](./THEME_DISCOVERY.md#T31), [T32](./THEME_DISCOVERY.md#T32) | Lifecycle slots; no duration |
| Mount / opacity / wrapper entering | AppBar, grouped buttons, modal, popper and snackbar | 5 | [T33](./THEME_DISCOVERY.md#T33), [T34](./THEME_DISCOVERY.md#T34), [T35](./THEME_DISCOVERY.md#T35), [T36](./THEME_DISCOVERY.md#T36), [T37](./THEME_DISCOVERY.md#T37) | Opacity 0 to 1; 500; JS identity easing; 0 |
| Announce new notification / x translation / repeating attention indication | Notification bell's animated content | 2 | [T38](./THEME_DISCOVERY.md#T38), [T40](./THEME_DISCOVERY.md#T40) | x 2, -2, 0; 50 per step; inherited JS identity easing; loop |
| Configure shared entry/attention motion / opacity and transforms / mount or repeat | The preceding five entry consumers and notification animation; other exported helpers have no in-scope callers | 2 | [T39](./THEME_DISCOVERY.md#T39), [T41](./THEME_DISCOVERY.md#T41) | Common duration 500 (shake overrides with 50); common easing `(t) => t` |
| Expand/collapse legend / height / legend visibility toggled | Layer symbols, WMS legend image and collapsible legend content | 3 | [T42](./THEME_DISCOVERY.md#T42), [T43](./THEME_DISCOVERY.md#T43), [T44](./THEME_DISCOVERY.md#T44) | `auto`: MUI height-derived duration |
| Finish loading / opacity / splash enters or exits | Loading overlay | 1 | [T45](./THEME_DISCOVERY.md#T45) | Enter 0, exit splash 1500; Fade easing not specified here |
| Expand/collapse caller content / height / caller-controlled transition | Reusable collapsible content | 1 | [T47](./THEME_DISCOVERY.md#T47) | Forwarded caller timeout; not fixed |
| Update map orientation / all and transform / orientation changes | North-arrow indicator | 1 | [T48](./THEME_DISCOVERY.md#T48) | all + transform; standard 300; MUI easeOut; 0 |
| Open/close panel / container dimensions / panel toggled | AppBar panel container | 1 | [T49](./THEME_DISCOVERY.md#T49) | all; standard 300; CSS ease; 0 |
| Hover/focus/drag / thumb dimensions and halo / slider interaction | Slider thumb | 1 | [T50](./THEME_DISCOVERY.md#T50) | all; 300; cubic-bezier(.47,1.64,.41,.8); 0 |
| Hover / all (authored border change) / AOI card hovered | Area-of-interest card | 1 | [T51](./THEME_DISCOVERY.md#T51) | all; 300; CSS ease-in-out; 0 |
| Hover / all (authored background change) / close button hovered | AppBar panel close button | 1 | [T52](./THEME_DISCOVERY.md#T52) | all; 300; CSS ease-in-out; 0 |
| Hover / background-color / toolbar or close button interaction | AppBar and NavBar buttons; popper/dialog close buttons | 3 | [T53](./THEME_DISCOVERY.md#T53), [T54](./THEME_DISCOVERY.md#T54), [T55](./THEME_DISCOVERY.md#T55) | background-color; 300; CSS ease-in-out; 0 |
| Hover/select / background-color / tab interaction | Tab button | 1 | [T56](./THEME_DISCOVERY.md#T56) | background-color; 300; CSS ease-in-out; 0 |
| Unresolved action/state / border-color or width / trigger not established | Raster/mosaic/WMS settings group border; geolocator text input | 2 | [T57](./THEME_DISCOVERY.md#T57), [T72](./THEME_DISCOVERY.md#T72) | Border 200 CSS ease; input width standard 300 MUI easeInOut. T57 declares no alternate border state at its consumers; T72 keeps width 100% and declares no alternate width. Theme/ancestor-driven changes remain possible; intent unknown |
| Hover/select / border-color and background-color / settings card interaction | Layer settings option card | 1 | [T58](./THEME_DISCOVERY.md#T58) | Both properties; 200; implicit CSS ease; 0 |
| Hover / color / settings heading interaction | Layer settings group heading | 1 | [T59](./THEME_DISCOVERY.md#T59) | color; 200; implicit CSS ease; 0 |
| Expand/collapse footer / height / footer or host geometry changes | Footer tab container and outer viewer host | 2 | [T60](./THEME_DISCOVERY.md#T60), [T61](./THEME_DISCOVERY.md#T61) | Height 200 CSS ease-out; footer delay 0, host delay 200 |
| Update undo countdown / stroke transition suppression / countdown changes | Delete-layer undo progress ring | 1 | [T62](./THEME_DISCOVERY.md#T62) | `none` on progress circle |
| Measure host / temporary transition suppression and restore / synchronous measurement | Embedded viewer host | 2 | [T63](./THEME_DISCOVERY.md#T63), [T64](./THEME_DISCOVERY.md#T64) | `none`, then restore captured runtime transition after layout flush |
| Expand/collapse filter group / transform / layer group toggled | Filter-panel disclosure arrow | 1 | [T65](./THEME_DISCOVERY.md#T65) | transform; 200; implicit CSS ease; 0 |
| Hover / transform / layer preview hovered | Layer preview icon | 1 | [T66](./THEME_DISCOVERY.md#T66) | transform; 300; CSS ease-in-out; 0; rotate/translate on hover |
| Update orientation / transform / rotation changes | Map-info north-arrow button | 1 | [T67](./THEME_DISCOVERY.md#T67) | transform; 300; CSS ease-in-out; 0 |
| Update orientation / transform / rotation changes | NavBar map-rotation icon | 1 | [T68](./THEME_DISCOVERY.md#T68) | transform; 300; CSS ease-in-out; 0 |
| Open/close overview / transform / minimap toggled | Overview-map toggle arrow | 1 | [T69](./THEME_DISCOVERY.md#T69) | transform; 300; CSS ease; 0 |
| Close drawer / width / drawer exiting | Drawer panel | 1 | [T70](./THEME_DISCOVERY.md#T70) | width; leavingScreen 195; MUI sharp; 0 |
| Open drawer / width / drawer entering | Drawer panel | 1 | [T71](./THEME_DISCOVERY.md#T71) | width; enteringScreen 225; MUI sharp; 0 |

**Per-role reconciliation:** the 42 rows above partition all 72 occurrences;
70 have established actions/states, 2 have unresolved triggers (T57, T72).
The shared configuration role counts definitions once, not once per consumer.
Numeric equality was not used to assign a role or a consumer.

**Context, not migration candidates: 10 rows.** These still retain their roles
and are counted above; this list is a separate disposition, not another count.

| Rows | Why context |
|---|---|
| [T30](./THEME_DISCOVERY.md#T30) | Selects Fade, not its duration; preserve slot behavior |
| [T31](./THEME_DISCOVERY.md#T31), [T32](./THEME_DISCOVERY.md#T32) | Lifecycle/focus callbacks, not timing declarations |
| [T42](./THEME_DISCOVERY.md#T42), [T43](./THEME_DISCOVERY.md#T43), [T44](./THEME_DISCOVERY.md#T44) | `auto` delegates to MUI's height-derived Collapse timing; replacing it with a named fixed duration changes behavior |
| [T47](./THEME_DISCOVERY.md#T47) | Caller timeout forwarding; assigning a constant changes the wrapper contract |
| [T62](./THEME_DISCOVERY.md#T62) | Explicit suppression; not a duration/easing to alias |
| [T63](./THEME_DISCOVERY.md#T63), [T64](./THEME_DISCOVERY.md#T64) | Temporary suppression and captured-value restore are a synchronous measurement pair, not new timing constants |

### 3. Coupled timing pairs

The table distinguishes enforced relationships, equal-number candidates and
rejected mirror hypotheses. A group can contain several JS waits. "Numeric"
does not establish intent. Prospective ledger units are **PROPOSED** only.
The links below are baseline source; T IDs above provide the discovery links.

| ID / evidence | Files and both values | Enforced or numeric? | PROPOSED ledger boundary |
|---|---|---|---|
| C1: panel completion, T19 + T49 | [panel.tsx:100](../../packages/geoview-core/src/ui/panel/panel.tsx#L100): standard 300 + [buffer 50](../../packages/geoview-core/src/ui/panel/panel.tsx#L28); [panel-style.ts:26](../../packages/geoview-core/src/ui/panel/panel-style.ts#L26): standard 300 CSS duration | **Enforced**, shared theme field plus explicit buffer; caller panelStyles may override CSS. This does not wait for the full staged title/body fades (800/900ms including delays) | Both panel files; preserve buffer and callback order. Generator definitions, if changed, are a separate deliberately ordered unit |
| C2: layer sequential fade, T15-T18 + T46 | [layer-details.tsx:385](../../packages/geoview-core/src/core/components/layers/right-panel/layer-details.tsx#L385), :399, :412, :426 wait 300; [Fade:799](../../packages/geoview-core/src/core/components/layers/right-panel/layer-details.tsx#L799) enters/exits in 300; all read [TIMEOUT.fadingPanelDuration:189](../../packages/geoview-core/src/core/utils/constant.ts#L189) | **Enforced**, one constant, not yet theme-derived; four JS-to-Fade links form one group | The layer-details file, all five rows together; constant definition file only if its declaration is changed, not merely to clean up an unused key |
| C3: image-viewer focus, T11 + T01 | [use-light-box.tsx:61](../../packages/geoview-core/src/core/components/common/hooks/use-light-box.tsx#L61) waits focusDelayLightbox 250; [lightbox.tsx:46](../../packages/geoview-core/src/core/components/lightbox/lightbox.tsx#L46) fade 250, swipe 500 | **Numeric-only candidate**, not proven mirror: [exited:240](../../packages/geoview-core/src/core/components/lightbox/lightbox.tsx#L240) invokes the callback, then the extra 250ms wait starts. Equality does not prove that the extra wait is intended to track fade duration | Both lightbox files, and constant definition if edited; no removal of extra wait without approval |
| V1: footer geometry candidates, T60 + T61 + T12 | [footer-bar-style.ts:19](../../packages/geoview-core/src/core/components/footer-bar/footer-bar-style.ts#L19): height 200, CSS ease-out, no delay; [use-map-resize.ts:104](../../packages/geoview-core/src/core/containers/use-map-resize.ts#L104): height 200 with delay 200; [footer-bar.tsx:112](../../packages/geoview-core/src/core/components/footer-bar/footer-bar.tsx#L112): wait 25 before scroll helper | **CSS-only numeric relationship** (three 200ms operands), not a matching JS wait. Comment says allow resize, but 25 is not 200 or the host's 400ms duration-plus-delay; completion is not enforced | Three footer/host files as one reviewed set under approved R4; preserve 25 under decided H4/Q11; no constant-definition edit is needed |
| V2: search section availability, T13 + T08 | [guide-search.tsx:396](../../packages/geoview-core/src/core/components/guide/guide-search.tsx#L396) selects section, waits 300, optionally clicks collapsed content, waits 100, then scrolls; [guide.tsx:160](../../packages/geoview-core/src/core/components/guide/guide.tsx#L160) updates selected content, [render:199](../../packages/geoview-core/src/core/components/guide/guide.tsx#L199) inserts an article | **No verified fixed-duration pair.** No Collapse/Accordion is wired for this selection. The 100ms comment mentions possible expansion, but content-dependent collapsed markup has no established duration here. The first 300ms wait precedes the optional expansion click | Guide-search + guide if reviewed together; otherwise held. Do not equate 300 with MUI standard as evidence of completion |
| V3: anchor focus, T14 | [guide.tsx:277](../../packages/geoview-core/src/core/components/guide/guide.tsx#L277): browser `scrollTo({behavior:'smooth'})`; focus wait 300 at :288 | **No fixed-duration pair**: browser controls scroll timing; no authored 300ms motion duration to derive from | Guide file; any later scroll-completion redesign is new behavior, not an alias |
| V4: resize focus, T07 | [resize-footer-panel.tsx:196](../../packages/geoview-core/src/core/components/footer-bar/hooks/resize-footer-panel.tsx#L196): wait 100 after keyboard-close; footer CSS is 200 | **Independent reflow wait in source**, not a matching CSS duration. Comment explicitly names DOM reflow; no transition-derived value | Resize hook if changed; do not silently link it to footer duration |
| V5: popover opening focus, T09 | [popover.tsx:83](../../packages/geoview-core/src/ui/popover/popover.tsx#L83): shortest 150; [MaterialPopover:102](../../packages/geoview-core/src/ui/popover/popover.tsx#L102) receives caller props, no fixed transition duration here | **No enforced pair**: comment says wait transition period, but timing remains default/caller-controlled | Popover file and any identified caller, only if coupling is later approved |
| V6: popper opening focus, T10 + T36 | [popper.tsx:141](../../packages/geoview-core/src/ui/popper/popper.tsx#L141): shortest 150; [useFadeIn:93](../../packages/geoview-core/src/ui/popper/popper.tsx#L93): shared 500ms opacity fade | **Not a numeric mirror**: 150 differs from 500 and is not derived from it; comment does not enforce completion | Popper + spring helper if approved to change coupling; otherwise preserve current focus timing |

**Coupling count:** 2 verified enforced groups (C1 and C2), comprising
1 + 4 = **5 JS-to-transition links**. C3 adds **1 numeric-only candidate group**
(1 candidate link), not a confirmed mirror. Thus 3 groups were presented for
coupling review: 2 enforced / 1 numeric-only candidate. C1 is retained with its
panel CSS migration, C2 is approved for shared theme derivation, and C3 is held.
V1 is an additional
CSS-to-CSS numeric candidate, not another JS pair. V2-V6 do not establish a
matching fixed-duration pair. No other mirror was established among the
15 coordinated-delay rows and 6 timeout rows: forwarded/auto/splash rows do
not add JS mirror sites.

### 4. Findings that constrain rules

**Tooltip precedence.** [TooltipUI:35](../../packages/geoview-core/src/ui/tooltip/tooltip.tsx#L35)
renders `enterDelay={1000} enterNextDelay={200} {...props}`. The later spread
wins. Layer-list, single-layer and legend consumers therefore use **1000 for
both props**, not wrapper next-delay 200. The wrapper defaults affect callers
that omit those props. Changing prop order would be a behavior change and is
not part of any proposed alias.

**Reduced motion.** The [four discovery handlers](./THEME_DISCOVERY.md#reduced-motion-baseline-supplementary-context)
are preference checks at
[AppBar:292](../../packages/geoview-core/src/core/components/app-bar/app-bar.tsx#L292),
[AppBar:312](../../packages/geoview-core/src/core/components/app-bar/app-bar.tsx#L312),
[utilities:1910](../../packages/geoview-core/src/core/utils/utilities.ts#L1910) and
[utilities:1943](../../packages/geoview-core/src/core/utils/utilities.ts#L1943).
All affect scrolling, not transitions, keyframes or react-spring. Preserving
existing behavior means not breaking those four scroll handlers, including
their missing-matchMedia fallback. UI-motion reduced-motion support would be
**new behavior**, not a migration. Under Q7 it is out of scope; no such
implementation is authorized here.

**Duplicate keyframes.** Panel styles define identical local `fadein` keyframes
at [55](../../packages/geoview-core/src/ui/panel/panel-style.ts#L55) and
[92](../../packages/geoview-core/src/ui/panel/panel-style.ts#L92).
Q8 leaves both definitions in place; no extraction/removal is authorized.

**Missing shortcut delay.** [TIMEOUT:170](../../packages/geoview-core/src/core/utils/constant.ts#L170)
is `Record<string, number>` but has no `shortcutToTab` initializer.
[The hook default:44](../../packages/geoview-core/src/core/components/common/hooks/use-navigate-to-tab.ts#L44)
therefore supplies `undefined`: the two timers queue a zero-delay task, about
0ms subject to scheduling/clamping, not the commented 350ms. Intent is unknown.
Q9 accepts H5; the follow-up is now in [WHATS_LEFT.md](./WHATS_LEFT.md),
without choosing a value.

**Spring theme access.** [The shared helper:1](../../packages/geoview-core/src/core/utils/useSpringAnimations.ts#L1)
imports no theme hook and constructs `commonConfig` at module scope. None of
the six calls passes a config. Contrary to the blanket premise that callers
cannot access theme, three already have one:

| Caller | Existing theme access | Motion/config constraint |
|---|---|---|
| [AppBar:50](../../packages/geoview-core/src/ui/appbar/appbar.tsx#L50) | No theme read in this component | `useFadeIn()`; adding a theme hook or making the animation hook theme-aware is a scope choice |
| [ButtonGroup:62](../../packages/geoview-core/src/ui/button-group/button-group.tsx#L62) | No theme read in this component | Same |
| [Modal:205](../../packages/geoview-core/src/ui/modal/modal.tsx#L205) | Already `useTheme()` | `useFadeIn()` at :207 ignores that theme |
| [Popper:95](../../packages/geoview-core/src/ui/popper/popper.tsx#L95) | Already `useTheme()` | `useFadeIn()` at :93 ignores it; separate focus wait is 150 |
| [Snackbar:66](../../packages/geoview-core/src/ui/snackbar/snackbar.tsx#L66) | No theme read in this component | `useFadeIn()` |
| [Notifications:273](../../packages/geoview-core/src/core/components/notifications/notifications.tsx#L273) | Already `useTheme()` | `useShake()` at :316 ignores it |

The hooks accept `SpringConfig`, so fade duration/easing can be supplied, but
[shake config:82](../../packages/geoview-core/src/core/utils/useSpringAnimations.ts#L82)
writes `duration: 50` **after** caller config and overrides its duration.
The 500ms common duration has no equal MUI duration; `complex` is **375**.
The 50ms step has no named equal either. MUI easing fields are CSS strings,
whereas react-spring expects a JS function; identity is linear, and no existing
MUI linear field is defined. Changing to a MUI curve would also need an approved
adapter and change the rendered curve. Equality with unrelated 500ms panel
fades is not evidence of shared intent. A per-map theme must never be captured
in a module-global config.

**Theme fields and external MUI themes.** The
[generator:357](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L357)
sets shortest 150, shorter 200, short 250, standard 300, complex 375,
enteringScreen 225 and leavingScreen 195. Its curves are easeInOut
`cubic-bezier(0.4,0,0.2,1)`, easeOut `cubic-bezier(0,0,0.2,1)`, easeIn
`cubic-bezier(0.4,0,1,1)` and sharp `cubic-bezier(0.4,0,0.6,1)`.
CSS `ease`, `ease-in-out`, `ease-out`, linear and the slider overshoot are
not aliases of those fields.

`theme.transitions` and its standard fields exist on a complete MUI theme,
including external themes used by `ui/`. GeoView's **tooltipDelay and splash
do not** exist on a plain external MUI theme; T45 already assumes splash.
Flagging that pre-existing boundary is not a regression claim or permission to
fix it. Q16 retains existing extension assumptions and holds; revisit at the
Fonts gate as a single cross-concern external-theme fallback rule
(`tooltipDelay`, `splash`, `geoViewFontSize`, `geoViewColor`).
External custom standard durations/curves
may differ from GeoView defaults, so a baseline-exact alias is not guaranteed
to preserve a formerly literal value under every host override.
Font-size/colour fallbacks remain for the later concern decisions; none is
settled here.

### 5. Decided rules

R1-R5 remain **DECIDED** on 2026-10-28; R6 was reversed on 2026-10-29.
The original documentation task does
not execute migration. Classification is at the recorded source baseline: exact alias
means no rendered timing change there; behavior-change rows are individually
enumerated. Standard-field substitutions intentionally start honoring any
external host's customized field. Capture the recorded-commit runtime baseline
before any later implementation, and re-confirm each ledger unit's source.
No custom token is proposed: an unmatched number or curve alone is not a role.

#### R1 — DECIDED: retain established theme ownership

Decided 2026-10-28

**Affected first: 14 exact-alias/unchanged rows:** [T09](./THEME_DISCOVERY.md#T09),
[T10](./THEME_DISCOVERY.md#T10), [T19](./THEME_DISCOVERY.md#T19),
[T22](./THEME_DISCOVERY.md#T22), [T23](./THEME_DISCOVERY.md#T23),
[T24](./THEME_DISCOVERY.md#T24), [T26](./THEME_DISCOVERY.md#T26),
[T27](./THEME_DISCOVERY.md#T27), [T28](./THEME_DISCOVERY.md#T28),
[T45](./THEME_DISCOVERY.md#T45), [T48](./THEME_DISCOVERY.md#T48),
[T70](./THEME_DISCOVERY.md#T70), [T71](./THEME_DISCOVERY.md#T71),
[T72](./THEME_DISCOVERY.md#T72).

**DECIDED rule:** retain these existing reads of shortest, standard,
tooltipDelay, splash, enteringScreen, leavingScreen and the existing easing
fields, preserving caller precedence, buffer arithmetic and no-motion sentinels.

Justification: these rows already implement theme ownership; touching them
merely to count edits would not normalize anything. C1 remains shared between
T19/T49; both panel files are reviewed together when R3 changes T49. T72's trigger
remains unresolved, but its existing theme read needs no invented replacement.
External-theme impact: standard fields remain safe; Q16 retains T45's custom
splash assumption, and the tooltipDelay consumers are viewer-context usages. Do not
silently add missing-extension defaults in this rule.

#### R2 — DECIDED: common 300ms interaction transitions

Decided 2026-10-28

**Affected first: 9 intentional-behavior-change rows:**
[T51](./THEME_DISCOVERY.md#T51), [T52](./THEME_DISCOVERY.md#T52),
[T53](./THEME_DISCOVERY.md#T53), [T54](./THEME_DISCOVERY.md#T54),
[T55](./THEME_DISCOVERY.md#T55), [T56](./THEME_DISCOVERY.md#T56),
[T66](./THEME_DISCOVERY.md#T66), [T67](./THEME_DISCOVERY.md#T67),
[T68](./THEME_DISCOVERY.md#T68).

**DECIDED rule:** use `transitions.create` with duration.standard and
easing.easeInOut for these existing 300ms interaction transitions, preserving
each original target property/list and zero delay.

For **each** listed row, CSS `ease-in-out` becomes
`cubic-bezier(0.4,0,0.2,1)`; duration stays 300 and targets stay unchanged,
including `all` where authored. This is curve normalization, not an exact alias.
No verified JS mirror is touched. T55's helper
[signature:68](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L68)
receives palette, not transitions; its
[two root callbacks:498](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L498)
already receive the current theme and would need to forward transitions.
That generator/helper work is its own ledger unit, not a global-theme import.
External-theme impact: panel/tabs helpers use standard fields available in
MUI themes, honoring host overrides; no GeoView extension is needed.
Q2 approves these concrete curve changes.

#### R3 — DECIDED: CSS-ease interaction transitions

Decided 2026-10-28

**Affected first: 5 intentional-behavior-change rows:**
[T49](./THEME_DISCOVERY.md#T49), [T58](./THEME_DISCOVERY.md#T58),
[T59](./THEME_DISCOVERY.md#T59), [T65](./THEME_DISCOVERY.md#T65),
[T69](./THEME_DISCOVERY.md#T69).

**DECIDED rule:** use `transitions.create` with easing.easeInOut, retaining
duration.standard for T49/T69 and using duration.shorter for T58/T59/T65.

For **each** listed row, explicit/implicit CSS `ease` becomes
`cubic-bezier(0.4,0,0.2,1)`; durations stay 300, 200, 200, 200, 300 respectively,
targets/delays stay unchanged. C1's JS standard + 50 remains unchanged and is
reviewed with T49: both sides retain the same standard value. External-theme
impact: panel styles use standard MUI fields; customized host easing changes
the former literal curve. Q2/Q3 approve the curves and shorter-role mappings.
T57 is not swept into this rule merely because its number matches.

#### R4 — DECIDED: footer/host height timing

Decided 2026-10-28

**Affected first: 2 intentional-behavior-change rows:**
[T60](./THEME_DISCOVERY.md#T60), [T61](./THEME_DISCOVERY.md#T61).

**DECIDED rule:** derive both height durations and T61's existing delay from
duration.shorter, with easing.easeOut, preserving T60's zero delay.

For **both** rows CSS `ease-out` becomes `cubic-bezier(0,0,0.2,1)`; durations
stay 200, T61 delay stays 200. V1's CSS sides move together; the JS 25ms wait
is **not** changed to 200 and remains H4 under Q11, as does the independent
100ms resize-focus wait.
At baseline the hook has no theme read, but per-viewer theme access is available:
[AppStart:91](../../packages/geoview-core/src/core/app-start.tsx#L91) selects the
theme by `mapViewer.mapId`, its
[ThemeProvider:112](../../packages/geoview-core/src/core/app-start.tsx#L112)
wraps [Shell:127](../../packages/geoview-core/src/core/app-start.tsx#L127),
and [Shell:74](../../packages/geoview-core/src/core/containers/shell.tsx#L74)
reads that theme before invoking
[useMapResize:119](../../packages/geoview-core/src/core/containers/shell.tsx#L119).
A hook-local `useTheme()` can read this same context without a global theme
import or provider restructuring. This satisfies Q2's condition: **R4 is
approved; H10 is not created**. These are viewer-owned surfaces, not
external `ui/` wrappers; standard transitions still exist on external MUI
themes. Q2/Q3/Q11 approve this rule and the footer/host review unit.

#### R5 — DECIDED: sequential layer-view crossfade

Decided 2026-10-28

**Affected first: 5 exact-alias rows:** [T15](./THEME_DISCOVERY.md#T15),
[T16](./THEME_DISCOVERY.md#T16), [T17](./THEME_DISCOVERY.md#T17),
[T18](./THEME_DISCOVERY.md#T18), [T46](./THEME_DISCOVERY.md#T46).

**DECIDED rule:** derive the Fade timeout and all four content-swap waits
from the same current theme duration.standard.

All five remain 300 at baseline, with Fade curve, swap order and focus behavior
unchanged. C2's **four JS links and the Fade move together**, in one file.
LayerDetails already reads its theme at
[163](../../packages/geoview-core/src/core/components/layers/right-panel/layer-details.tsx#L163).
This preserves existing constant coupling while making it theme-derived; no
TIMEOUT cleanup is implied. It is viewer-owned, and standard exists on external
MUI themes. Q1 accepts this exact baseline mapping; future overrides
must affect both sides, not just Fade.

#### R6 — REVERSED: wrapper next-tooltip default

**REVERSED 2026-10-29: interaction delays must not derive from animation durations; numeric equality with `shorter` was coincidental.**

T29 remains held under H6; T25 migrated separately in X-A after fallback A
was decided. The original rule below is historical,
not an active migration authorization.

Decided 2026-10-28

**Affected first: 1 exact-alias row:** [T29](./THEME_DISCOVERY.md#T29).

**Original DECIDED rule (reversed):** read duration.shorter for the wrapper's 200ms enterNextDelay,
leaving the trailing caller-prop spread in place.

At baseline it stays 200, and explicit consumer 1000 values still win.
No coupled pair is touched. External-theme impact: shorter exists on MUI
themes, but a host's customized shorter changes the wrapper's former fixed 200.
Initial-delay T25 was held under H6 at reversal; X-A later applied the approved
`tooltipDelay ?? 1000` fallback, not an animation-duration alias.
Q3/Q5/Q16 accept these tooltip choices.

#### Decided holds

Transferred 2026-10-29 to [HELD.md](./HELD.md#transitions-holds).

Each hold is **DECIDED** on 2026-10-28. No existing fitting theme role has been
established for it, or choosing a mapping would go beyond the accepted scope.
Rows are individually identified even when one reason covers several.

| DECIDED hold | Rows / count | Reason and decision reference |
|---|---|---|
| **DECIDED H1 image-viewer timing**<br>Decided 2026-10-28 | [T01](./THEME_DISCOVERY.md#T01), [T11](./THEME_DISCOVERY.md#T11) / **2** | Fade 250 matches short numerically, but swipe 500 has no equal field and the focus wait is after exited; C3's intended coupling is unknown. Preserve whole animation-prop row, not half-count it; Q10 |
| **DECIDED H2 staged panel reveal**<br>Decided 2026-10-28 | [T02](./THEME_DISCOVERY.md#T02), [T03](./THEME_DISCOVERY.md#T03), [T05](./THEME_DISCOVERY.md#T05), [T06](./THEME_DISCOVERY.md#T06) / **4** | Fade 500, CSS ease-in-out and stagger 300/400 form choreography not expressed by one existing MUI role; equality with standard for one delay is not intent. Q8/Q14 |
| **DECIDED H3 looping loading rotation**<br>Decided 2026-10-28 | [T04](./THEME_DISCOVERY.md#T04) / **1** | 1000ms linear infinite rotation is a loading cycle, not tooltipDelay; no fitting existing cycle/linear field. Q14 |
| **DECIDED H4 unverified completion/render waits**<br>Decided 2026-10-28 | [T07](./THEME_DISCOVERY.md#T07), [T08](./THEME_DISCOVERY.md#T08), [T12](./THEME_DISCOVERY.md#T12), [T13](./THEME_DISCOVERY.md#T13), [T14](./THEME_DISCOVERY.md#T14) / **5** | 100ms reflow, 100/300ms guide visibility, 25ms footer resize and 300ms anchor focus are not established mirrors of fixed motion durations. V1-V4; Q11/Q12 |
| **DECIDED H5 missing tab-navigation default**<br>Decided 2026-10-28 | [T20](./THEME_DISCOVERY.md#T20), [T21](./THEME_DISCOVERY.md#T21) / **2** | Effective default about 0ms, caller override possible, intended default unknown; do not alias commented 350 or invent a value. Q9 |
| **DECIDED H6 tooltip interaction delays**<br>Decided 2026-10-28; narrowed 2026-10-29 after X-A | [T29](./THEME_DISCOVERY.md#T29) / **1** | Keep the 200ms next-tooltip literal and caller precedence; no dedicated next-delay value is approved. T25 migrated separately to `tooltipDelay ?? 1000`. End condition remains: cross-theme fallback policy decided. Q5/Q16; R6 reversed 2026-10-29 |
| **DECIDED H7 spring definitions and consumers**<br>Decided 2026-10-28 | [T33](./THEME_DISCOVERY.md#T33), [T34](./THEME_DISCOVERY.md#T34), [T35](./THEME_DISCOVERY.md#T35), [T36](./THEME_DISCOVERY.md#T36), [T37](./THEME_DISCOVERY.md#T37), [T38](./THEME_DISCOVERY.md#T38), [T39](./THEME_DISCOVERY.md#T39), [T40](./THEME_DISCOVERY.md#T40), [T41](./THEME_DISCOVERY.md#T41) / **9** | Theme currently unread by hooks, 500/50 have no equal duration role, JS identity easing has no MUI CSS equivalent; consumer/definition migration and any adapter need approval. Q6/Q13 |
| **DECIDED H8 slider overshoot**<br>Decided 2026-10-28 | [T50](./THEME_DISCOVERY.md#T50) / **1** | No MUI overshoot field; a custom curve needs a purpose beyond its appearance, or replacing it changes behavior. Also spans hover/active/focus halo motion; flag for later Shadows classification. Q4 |
| **DECIDED H9 settings border trigger**<br>Decided 2026-10-28 | [T57](./THEME_DISCOVERY.md#T57) / **1** | Border transition declared, but no alternate border state established in the inspected selector consumers; intended action unresolved. Q15 |

### 6. Recorded answers

These are the user's decisions, not implementation results. No source change
is authorized by this documentation task.

1. **Q1 — DECIDED: End state and existing/exact mappings.**
   Decided 2026-10-28

   Accept the sentinel/context clarification, R1 and R5.
2. **Q2 — DECIDED: Curves, R2/R3/R4.**
   Decided 2026-10-28

   Approve R2/R3's curve changes. Approve R4 because the baseline check above
   establishes per-viewer theme context at the hook's caller; no H10 is needed.
3. **Q3 — DECIDED: 200ms roles.**
   Decided 2026-10-28

   Accept shorter for R3, R4 and R6's 200ms roles.
   R6's part of this answer is superseded by the reversal on 2026-10-29.
4. **Q4 — DECIDED: Slider overshoot.**
   Decided 2026-10-28

   Accept H8; preserve the overshoot.
5. **Q5 — DECIDED: Tooltip wrapper defaults.**
   Decided 2026-10-28

   Accept R6 + H6, preserving effective 1000/200 defaults and caller precedence.
   Superseded 2026-10-29: R6 reversed; both wrapper delays were held under H6.
   Fonts-gate fallback A subsequently approved X-A for T25; only T29 remains held.
6. **Q6 — DECIDED: Spring.**
   Decided 2026-10-28

   Accept H7; no spring migration or adapter design in this phase.
7. **Q7 — DECIDED: UI-motion reduced motion.**
   Decided 2026-10-28

   Out of scope. Preserve the four existing scrolling handlers; list new
   UI-motion support as a follow-up in [WHATS_LEFT.md](./WHATS_LEFT.md), not a migration.
8. **Q8 — DECIDED: Duplicate fadein definitions.**
   Decided 2026-10-28

   Leave both definitions; no sharing/extraction.
9. **Q9 — DECIDED: shortcutToTab.**
   Decided 2026-10-28

   Accept H5. Intent remains unknown; do not propose or apply a value.
   Record the missing default as a follow-up in [WHATS_LEFT.md](./WHATS_LEFT.md).
10. **Q10 — DECIDED: Numeric-only C3.**
    Decided 2026-10-28

    Accept H1; preserve image-viewer timing and its post-exit focus wait
    without asserting an intended coupling.
11. **Q11 — DECIDED: Footer V1 and resize focus V4.**
    Decided 2026-10-28

    Option 1: R4's CSS-only mapping, with JS 25ms footer and 100ms resize-focus
    waits held under H4. Do not convert either wait to 200.
12. **Q12 — DECIDED: Guide waits V2/V3.**
    Decided 2026-10-28

    Accept H4; preserve the guide timing heuristics.
13. **Q13 — DECIDED: Overlay focus V5/V6.**
    Decided 2026-10-28

    Retain the independent 150ms waits under R1.
14. **Q14 — DECIDED: Staged panel/loading cycles.**
    Decided 2026-10-28

    Accept H2 and H3; preserve the choreography/cycles and C1's +50ms buffer.
15. **Q15 — DECIDED: Unresolved triggers.**
    Decided 2026-10-28

    Accept H9; leave T72 unchanged under R1. Unknown trigger intent stays unknown.
16. **Q16 — DECIDED: External-theme boundary.**
    Decided 2026-10-28

    Retain existing extension assumptions with holds; revisit at the Fonts
    gate as a single cross-concern external-theme fallback rule
    (`tooltipDelay`, `splash`, `geoViewFontSize`, `geoViewColor`).

### 7. Counts reconciliation

| Disposition | Groups | Rows |
|---|---:|---:|
| Migrated and reviewed (R2-R5) | 4 | 9 + 5 + 2 + 5 = **21** |
| Migrated cross-concern follow-up (X-A / fallback A) | 1 | **1** |
| Retained unchanged (R1) | 1 | **14** |
| Held (DECIDED H1-H9) | 9 | 2 + 4 + 1 + 5 + 2 + 1 + 9 + 1 + 1 = **26** |
| Context | 6 listed groups | 1 + 2 + 3 + 1 + 1 + 2 = **10** |
| **Total** | | **22 + 14 + 26 + 10 = 72** |

Rule rows comprise **19 exact-alias/unchanged** and **16 intentional
behavior-change** rows at baseline: the approved 21-row migration scope is
5 exact aliases + 16 intentional behavior changes; 14 already-themed rows
are retained unchanged. All 21 original migration rows are implemented and reviewed;
X-A adds T25 as a literal-preserving interaction-delay alias with fallback A.
the reversed T29 migration is historical and counts only in held.
R4 remains approved, so no H10/count transfer is needed. Each T ID occurs in exactly one
classification role and one disposition; cross-references in findings/pairs
are not extra occurrences. Four scrolling reduced-motion handlers remain
supplementary context outside the 72, as in discovery.

**Final source reconciliation — 2026-10-29.** The original check covered all 72 discovery
occurrences at current commit `72cda9157311963f61b12e7e6f34f7abb56880ec`
against `cc7d57918`, comparing the occurrence expressions rather than requiring
whole files to match (some files also have unrelated import changes).
At HEAD `af8d78d2466e2f3bea0111a886af02f215a9ee7a` plus the migration worktree,
T25 is the only subsequent Transitions disposition change: X-A is verified
below. The other 71 occurrence dispositions carry forward unchanged.

| Disposition | T-IDs | Expected | Confirmed | Mismatches |
|---|---|---:|---:|---|
| Migrated R2-R5 | T15-T18, T46, T49, T51-T56, T58-T61, T65-T69 | 21 | 21 | None |
| Migrated X-A / fallback A | T25 | 1 | 1 | None; 1000ms requests preserved on GeoView and plain MUI |
| Retained R1 | T09, T10, T19, T22-T24, T26-T28, T45, T48, T70-T72 | 14 | 14 | None |
| Held H1-H9 | T01-T08, T11-T14, T20, T21, T29, T33-T41, T50, T57 | 26 | 26 | None; tooltip's explanatory comment is not an occurrence-expression change |
| Context | T30-T32, T42-T44, T47, T62-T64 | 10 | 10 | None |
| **Total** | **T01-T72, each exactly once** | **72** | **72** | **None** |

All 21 migrated occurrences resolve to their DECIDED theme sources: R2/R3 use
standard 300ms or shorter 200ms and easeInOut, preserving property lists and zero
delays; R4 uses shorter 200ms and easeOut with T60 delay 0 and T61 delay 200ms;
R5's four waits and Fade share the local standard 300ms value. T55 receives the
current theme's transitions through both generator callbacks; T61 uses its
hook-local viewer theme. Theme transition scales and timing constants remain
unchanged from `cc7d57918`. R1 expressions, all held expressions and all context
expressions are unchanged. T19 retains standard + 50ms = 350ms; T12 retains
25ms. T25 now reads `tooltipDelay ?? 1000`; T29 retains literal 200ms and
the trailing caller-prop spread stays in place. All three actual explicit-delay
consumers still render 1000/1000; X-A's runtime/two-map results are below.
T45 remains R1, reading the existing GeoView-only splash value.
This closeout is source reconciliation, not a new runtime capture; earlier
runtime differences and limitations remain recorded in the ledger.

**Discovery discrepancies:** no occurrence/count correction established.
Discovery already calls the spring sites "not read here"; this does not mean
their callers cannot obtain a theme. Its tooltip literals/consumer values are
correct but need the precedence explanation above. Its coordinated-delay
label is context, not proof of CSS coupling: guide waits, footer 25ms and
lightbox's post-exited wait require the distinctions above. Trigger intent for
T57/T72 remains unresolved. Discovery changed only to add the stable T-ID
column; original cells, order, grouping, totals and other sections are unchanged.

Follow-ups transferred to [WHATS_LEFT.md](./WHATS_LEFT.md) on 2026-10-29.

### Ledger units (Transitions)

**Completed migration ledger; historical instructions and evidence retained.**
Paths below are relative to the repository; T-IDs identify discovery rows.
Units 1-14 cover the original 21 migration rows; unit 5 is reversed and held.
The additional T25 migration X-A is recorded in the Fonts cross-concern ledger,
bringing the final migrated count to 22 without duplicating a unit here.
Retained/held/context rows sharing those
files are named as guardrails, not extra edits. Generator/theme changes are a
separate unit first; no transition-scale values or global theme imports are
authorized. Each later invocation re-confirms that unit's discovery rows
against current source, notes drift, and compares against a before-baseline
captured on a recorded commit. Review between units; never auto-select.

1. **Generator/helper, R2:** [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts),
   [T55](./THEME_DISCOVERY.md#T55). Forward current-theme transitions through the
   helper callbacks; do not alter unrelated definitions or other concerns.
   **Migrated 2026-10-29, reviewed.** T55 only; R2's approved curve
   change passed all 12 baseline comparisons (four themes x three states).
   Package TypeScript, focused lint and baseline-command build passed.
   Required two-map check passed for geo.ca/dark and light/canada.ca.
   [After-capture and validation](./baselines/transitions-after-generator-helper.json).
2. **C1 panel pair, R2/R3 + R1 retention:**
   [panel.tsx](../../packages/geoview-core/src/ui/panel/panel.tsx) and
   [panel-style.ts](../../packages/geoview-core/src/ui/panel/panel-style.ts),
   [T49](./THEME_DISCOVERY.md#T49), [T52](./THEME_DISCOVERY.md#T52);
   retain [T19](./THEME_DISCOVERY.md#T19) and its buffer; preserve H2's
   [T02](./THEME_DISCOVERY.md#T02), [T03](./THEME_DISCOVERY.md#T03),
   [T05](./THEME_DISCOVERY.md#T05), [T06](./THEME_DISCOVERY.md#T06) and both keyframes.
   **Migrated 2026-10-29, reviewed.** T49/T52 only; all 24 like-state
   CSS comparisons passed with only the DECIDED R3/R2 curve changes.
   `panel.tsx` is byte-identical to discovery: T19 still requests standard
   300ms + buffer 50ms = 350ms in all eight observed open/close sequences.
   Package TypeScript, focused lint/format and baseline-command build passed.
   No new theme read; two-map check not required.
   **Timing differences require review:** 7/8 timer-elapsed comparisons exceed
   the 20ms tolerance, as do all four available timer-to-width-end comparisons;
   focus/event timing differences and missing baseline ends are recorded, not
   dismissed as noise. No retained timer or callback code was changed.
   [After-capture and comparisons](./baselines/transitions-after-c1-panel-pair.json).
3. **C2 crossfade, R5:**
   [layer-details.tsx](../../packages/geoview-core/src/core/components/layers/right-panel/layer-details.tsx),
   [T15](./THEME_DISCOVERY.md#T15), [T16](./THEME_DISCOVERY.md#T16),
   [T17](./THEME_DISCOVERY.md#T17), [T18](./THEME_DISCOVERY.md#T18),
   [T46](./THEME_DISCOVERY.md#T46), all five together.
   **Migrated 2026-10-29, reviewed.** All four waits and the Fade timeout
   now derive from the existing LayerDetails `theme.transitions.duration.standard`;
   their callbacks track that duration. No new theme read; two-map check not required.
   Current C2 source was byte-identical to discovery before editing.
   [Fresh before-recapture](./baselines/transitions-before-c2-recapture.json)
   contains 16 sequences captured before editing, with a visible page, resumed
   clock, 1600x1200 viewport and DPR 1; all waits requested 300ms and fired in
   300-302ms. Original baseline timing was degraded (for example 350ms observed
   at 874ms), so it is used only for computed styles.
   [After-capture and comparisons](./baselines/transitions-after-c2-crossfade.json):
   all 16 waits still request 300ms and fire in 300-305ms, within the design's
   +/-20ms window; before/after timer differences are also within 20ms.
   Swap then return-focus (where applicable) then enter-end order is unchanged.
   **Differences require review:** one light-theme back-from-info sequence has
   an additional native exit-end before swap instead of the recapture's exit
   cancellation; five click-relative enter-end comparisons exceed 20ms
   (+22, -24, -24, +22, +32ms). Against the original CSS baseline, 39/48
   like-phase comparisons match, seven settled settings samples differ
   (`all / 0s / ease / 0s` versus `opacity / 0.3s / easeInOut / 0s`), and two
   light back-from-settings active samples lack an active original comparator.
   The fresh unmigrated recapture already has the after CSS tuple in all 48
   corresponding states; this supplemental check does not replace the original
   CSS authority or turn its seven differences into passes.
   Package TypeScript, focused lint/format and baseline-command build passed.
4. **Footer/host set, R4:**
   [footer-bar-style.ts](../../packages/geoview-core/src/core/components/footer-bar/footer-bar-style.ts),
   [use-map-resize.ts](../../packages/geoview-core/src/core/containers/use-map-resize.ts),
   [footer-bar.tsx](../../packages/geoview-core/src/core/components/footer-bar/footer-bar.tsx);
   migrate [T60](./THEME_DISCOVERY.md#T60), [T61](./THEME_DISCOVERY.md#T61) together,
   with hook-local per-viewer theme access; footer-bar is review-only to preserve
   [T12](./THEME_DISCOVERY.md#T12) at 25ms. No shell/provider edit is needed.
   H4's [T07](./THEME_DISCOVERY.md#T07) resize hook stays outside edit scope.
   **Migrated 2026-10-29, reviewed.** T60 and T61 now derive height
   duration from `duration.shorter` and easing from `easing.easeOut`; T61 also
   derives its 200ms delay from `shorter`. T60's delay remains zero.
   No unit source drift from discovery before editing. The new hook-local
   `useTheme()` reads the viewer context; no global theme import was added.
   [Before-recapture](./baselines/transitions-before-footer-host-recapture.json)
   was saved before editing. [After-capture and comparisons](./baselines/transitions-after-footer-host.json)
   cover four themes, seven states per theme and both styled elements:
   all 56 CSS comparisons pass with only the DECIDED ease-out to MUI easeOut
   curve change. Original baseline resting tuples agree with the recapture.
   The unchanged capture helper/selectors ran with a visible page, resumed
   clock, 1600x1200 viewport and DPR 1.
   `footer-bar.tsx` remains byte-identical to discovery: all eight T12 requests
   remain 25ms. **Existing timing design failure:** before waits fired in
   112-134ms and after waits in 112-135ms, outside 25ms +/-20ms in both captures.
   Observable timer/scroll ordering is unchanged; corresponding click-relative
   events remain within the standing prompt's +/-40ms comparison tolerance.
   No native height-transition ends occur in either capture: this demo uses
   intrinsic `fit-content` heights. No transition completion is inferred.
   Required temporary two-map checks passed for geo.ca/dark and light/canada.ca:
   React context and hook/memo dependencies confirm each footer and host use
   their own theme object and distinct transitions object, not just equal values.
   Package TypeScript, focused lint/format and baseline-command builds passed.
5. **Tooltip wrapper, R6 REVERSED 2026-10-29; no active migration unit:**
   [tooltip.tsx](../../packages/geoview-core/src/ui/tooltip/tooltip.tsx),
   [T29](./THEME_DISCOVERY.md#T29) and [T25](./THEME_DISCOVERY.md#T25) were held under H6 at reversal.
   T25 subsequently migrated in Fonts-gate X-A; only T29 remains held.
   The reversal restored literal `enterNextDelay={200}` and removed the added `useTheme()`;
   T25's 1000ms default and trailing caller-prop spread remain unchanged.
   Reason: tooltip interaction delays; migrate to dedicated delay values once
   the cross-theme fallback policy is decided.
   Reversal validation: focused Prettier, ESLint, package TypeScript and
   baseline-command build passed. Fresh runtime checks in all four themes
   confirm unchanged 1000/200ms requests; the 200ms timer fired in 200-201ms.
   At reversal, source matched cc7d57918 apart from the user's preserved comment.
   **Historical migration record (reversed; not current source):**
   **Migrated 2026-10-29, reviewed (superseded).** T29 then read
   `theme.transitions.duration.shorter` through a new wrapper-local `useTheme()`;
   T25's 1000ms literal and the trailing caller-prop spread are unchanged.
   No source drift from discovery before editing.
   [Before-recapture](./baselines/transitions-before-tooltip-wrapper-recapture.json)
   was saved before editing; [after-capture and comparisons](./baselines/transitions-after-tooltip-wrapper.json)
   use the same capture helper, selectors, timing observers, visible page,
   resumed clock, 1600x1200 viewport and DPR 1 in all four themes.
   All eight actual Tooltip requests remain 1000/200ms; elapsed differences
   against recapture are at most 2ms, and tooltip insertion differences at most
   8ms. Timer/open/close ordering is unchanged. All three live consumer groups
   retain 1000/1000ms props in every theme: layer-list and single-layer use the
   wrapper; legend uses MUI Tooltip directly and is unaffected by this wrapper.
   **Capture limitations and differences require review:** of 16 CSS samples,
   eight match in the same observed phase, four are not phase-comparable and
   four focus samples are unavailable in both captures because existing viewer
   focus handling redirects rotation-control focus to the map target. State
   labels alone are not used to equate active and settled samples.
   Native Grow transition-end ordering differs for geo.ca and dark; light's
   two comparable subsequent-opening completion events differ by +206ms
   (transform) and +155ms (opacity), outside the +/-40ms chain tolerance.
   These differences are preserved, not attributed to the alias or dismissed.
   Original baseline's delayed timers are informational only.
   Required temporary two-map checks passed for geo.ca/dark and light/canada.ca:
   each wrapper reads its own viewer theme/transition object by identity, not
   merely matching 200ms values. A standalone wrapper under MUI's default
   external theme also passes at 1000/200ms without GeoView palette fields or
   tooltipDelay. Only standard MUI `duration.shorter` is read.
   Package TypeScript, focused lint/format and baseline-command builds passed.
6. **AOI hover, R2:**
   [area-of-interest-style.ts](../../packages/geoview-aoi-panel/src/area-of-interest-style.ts),
   [T51](./THEME_DISCOVERY.md#T51).
   **Migrated 2026-10-29, reviewed.** All 12 four-theme/state comparisons
   pass: only the approved easeInOut curve changes. No timers or new theme read.
   Evidence: [before recapture](./baselines/transitions-before-aoi-hover-recapture.json)
   and [after](./baselines/transitions-after-aoi-hover.json).
7. **AppBar button hover, R2:**
   [app-bar-style.ts](../../packages/geoview-core/src/core/components/app-bar/app-bar-style.ts),
   [T53](./THEME_DISCOVERY.md#T53).
   **Migrated 2026-10-29, reviewed.** All 16 four-theme/state comparisons
   pass: only the approved easeInOut curve changes. No timers or new theme read.
   Evidence: [before recapture](./baselines/transitions-before-appbar-button-hover-recapture.json)
   and [after](./baselines/transitions-after-appbar-button-hover.json).
8. **NavBar hover and rotation, R2:**
   [nav-bar-style.ts](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-style.ts),
   [T54](./THEME_DISCOVERY.md#T54), [T68](./THEME_DISCOVERY.md#T68).
   **Migrated 2026-10-29, reviewed.** All 32 four-theme/state comparisons
   pass: only the approved easeInOut curves change. No timers or new theme read.
   Evidence: [before recapture](./baselines/transitions-before-navbar-hover-rotation-recapture.json)
   and [after](./baselines/transitions-after-navbar-hover-rotation.json).
9. **Tabs, R2:** [tabs-style.ts](../../packages/geoview-core/src/ui/tabs/tabs-style.ts),
   [T56](./THEME_DISCOVERY.md#T56).
   **Migrated 2026-10-29, reviewed.** All 12 four-theme/state comparisons
   pass: only the approved easeInOut curve changes. No timers or new theme read.
   Evidence: [before recapture](./baselines/transitions-before-tabs-recapture.json)
   and [after](./baselines/transitions-after-tabs.json).
10. **Layer preview, R2:**
    [layer-icon-style.ts](../../packages/geoview-core/src/core/components/common/layer-icon-style.ts),
    [T66](./THEME_DISCOVERY.md#T66).
    **Migrated 2026-10-29, reviewed.** All 8 four-theme/state comparisons
    pass: only the approved easeInOut curve changes. No timers or new theme read.
    Evidence: [before recapture](./baselines/transitions-before-layer-preview-recapture.json)
    and [after](./baselines/transitions-after-layer-preview.json).
11. **Map-info rotation, R2:**
    [map-info-rotation-button-style.ts](../../packages/geoview-core/src/core/components/map-info/map-info-rotation-button-style.ts),
    [T67](./THEME_DISCOVERY.md#T67).
    **Migrated 2026-10-29, reviewed.** All 12 four-theme/state comparisons
    pass: only the approved easeInOut curve changes. No timers or new theme read.
    Evidence: [before recapture](./baselines/transitions-before-map-info-rotation-recapture.json)
    and [after](./baselines/transitions-after-map-info-rotation.json).
12. **Layer settings, R3:**
    [layer-settings-style.ts](../../packages/geoview-core/src/core/components/layers/right-panel/layer-settings/layer-settings-style.ts),
    [T58](./THEME_DISCOVERY.md#T58), [T59](./THEME_DISCOVERY.md#T59);
    preserve [T57](./THEME_DISCOVERY.md#T57) under H9.
    **Migrated 2026-10-29, reviewed.** All 28 four-theme/state comparisons
    pass: only the approved easeInOut curves change. T57 remains byte-identical.
    No timers or new theme read.
    Evidence: [before recapture](./baselines/transitions-before-layer-settings-recapture.json)
    and [after](./baselines/transitions-after-layer-settings.json).
13. **Filter disclosure, R3:**
    [filter-panel-style.ts](../../packages/geoview-filter-panel/src/components/filter-panel-style.ts),
    [T65](./THEME_DISCOVERY.md#T65).
    **Migrated 2026-10-29, reviewed.** All 16 four-theme/state comparisons
    pass: only the approved easeInOut curve changes. No timers or new theme read.
    Evidence: [before recapture](./baselines/transitions-before-filter-disclosure-recapture.json)
    and [after](./baselines/transitions-after-filter-disclosure.json).
14. **Overview toggle, R3:**
    [overview-map-toggle-styles.ts](../../packages/geoview-core/src/core/components/overview-map/overview-map-toggle-styles.ts),
    [T69](./THEME_DISCOVERY.md#T69).
    **Migrated 2026-10-29, reviewed.** All 20 four-theme/state comparisons
    pass: only the approved easeInOut curve changes. No timers or new theme read.
    Evidence: [before recapture](./baselines/transitions-before-overview-toggle-recapture.json)
    and [after](./baselines/transitions-after-overview-toggle.json).

Units 6–14 used one shared before build at commit
`7af9cb2f85386b572cec9beb09b655691fbff0b9`
(bundle SHA256 `dfd343648e24f3e5d0190b214ac1ea3b58871c8caedc771591a5898ffe9518a6`),
captured before any of these source edits. Each unit then passed focused
Prettier, ESLint, package TypeScript, its own build and computed-style comparison
before the next unit was edited. All 156 comparisons across geo.ca, light, dark
and canada.ca preserve properties, durations and delays; only R2/R3's approved
curves change. Captures used the unchanged baseline helper, visible pages,
resumed clocks and 1600×1200 at DPR 1. Hidden setup probes were excluded;
the Layers panel was opened before capturing its visible consumers.
No functional timers were found in the nine style units, so timing sequences
were not captured. All nine use existing per-viewer theme parameters; none adds
a theme read, so no batch unit requires a two-map check.

Retained R1 rows are confirmed by the final reconciliation in Section 7;
they require no ledger units or source edits.

Other held/context-only files have no migration unit. Their rows stay listed
in the disposition tables, not silently counted as migrated. No TIMEOUT
definition cleanup, reduced-motion redesign or external-theme fallback work
is added to the ledger.

## Shadows

Status: Shadows retention rules and holds are **DECIDED**.
Decided 2026-10-28.
The conditional Paper-removal rule SR5 and its generator unit SU1 are
**NOT ADOPTED**; their original proposal text is preserved for reference.
Source checks use
**`cc7d57918`**, not a later working-tree version; this is the Shadows
decision baseline, not a claim that current whole files match it.
Installed component/default checks use **MUI 9.5.0**. This section does not
reopen Transitions or [D6](./COLOUR_DECISIONS.md#d6-focus-ring-contract--decided-leave-as-is).
Backups made before editing: `decisions-before-shadows.md` and
`discovery-before-shadows.md` in this session's files folder.
Answer-recording backup: `decisions-before-shadows-answers.md`.

**Shadows phase requires no source changes under the KEEP decision; Ledger units (Shadows): none.**

### 1. End state

The plan's Shadows end state is that every non-held shadow reads
`theme.shadows`, the focus contract, or a decided named treatment. Every
remaining occurrence is eventually recorded in HELD.md with a reason.

**DECIDED clarification**

Decided 2026-10-28.

Keep `none` as an explicit suppression rather than
replacing it with an elevation index, and retain elevation props/numeric `sx`
as MUI shadow-scale access. These carry different state/cascade contracts from
focus halos and edge separation. The existing MuiPaper override is the
**DECIDED named "edge separation" treatment**, satisfying the shadows end
state without a new token or source change. Its occurrence is retained as an
individual hold for colour preservation, not unified with matching geometry.
D6 geometry and colours remain unchanged. Holds recorded here were transferred
to [HELD.md](./HELD.md#shadows-holds) at closeout on 2026-10-29.

### 2. MuiPaper override: DECIDED KEEP

Decided 2026-10-28.

Retain S09 unchanged as the named **edge separation** treatment. Do not scope
or remove the override. SR5 and SU1 are NOT ADOPTED.

The [generator root override:422](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L422),
[S09](./THEME_DISCOVERY.md#S09), sets one layer:
`0px 12px 9px -13px bgColor.darken(0.2,0.5)`. It applies to Paper roots,
including Paper-backed components, not just explicit `<Paper>`.

Installed [Paper.js:36](../../packages/geoview-core/node_modules/@mui/material/Paper/Paper.js#L36)
defines elevation variants using `box-shadow: var(--Paper-shadow)`;
[110](../../packages/geoview-core/node_modules/@mui/material/Paper/Paper.js#L110)
sets that variable to `theme.shadows[elevation]`. The theme root override
replaces the property, not the variable. It does not remove dark-mode Paper's
separate background overlay, borders or border radius. This analysis describes
the current generated-theme cascade, not newly sampled computed styles.

#### Reach: Paper consumers in the scoped source

The following inventory distinguishes direct Paper shadows from children
inside a non-Paper Popper. A local `sx` shadow replaces S09 on the **same**
Paper; styling a child does not remove an outer Popover/Dialog paper's shadow.
Reusable wrappers forward caller props: unobserved external callers can
replace a slot/component or supply `sx`, and are not assumed to render the
default Paper.

| Consumer family and observable instances | Local shadow replacement at baseline | Result with S09 today |
|---|---|---|
| Plain Paper: [version:154](../../packages/geoview-core/src/core/components/app-bar/buttons/version.tsx#L154), [attribution:144](../../packages/geoview-core/src/core/components/attribution/attribution.tsx#L144), [notifications:494](../../packages/geoview-core/src/core/components/notifications/notifications.tsx#L494), [footer resize:261](../../packages/geoview-core/src/core/components/footer-bar/hooks/resize-footer-panel.tsx#L261) | `versionInfoPanel`, attribution/notification `popoverPaper`, resize `panel` use `boxShadow:2` (S43/S44/S50/S49) | Local `theme.shadows[2]` wins. These panels are Paper children of Popper, not Popover's paper slot |
| Plain Paper: [feature information:349](../../packages/geoview-core/src/core/components/details/feature-info.tsx#L349) | `featurePaper` has `none`, S25; also border none | No box shadow, not S09 |
| Plain Paper: [geolocator filters:147](../../packages/geoview-core/src/core/components/geolocator/geolocator-result.tsx#L147), [add-layer wizard:1086](../../packages/geoview-core/src/core/components/layers/left-panel/add-new-layer/add-new-layer.tsx#L1086), [layer details:786](../../packages/geoview-core/src/core/components/layers/right-panel/layer-details.tsx#L786), [NavBar tool panel:155](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-panel-button.tsx#L155) | None: wizard/detail styles only add layout/padding; NavBar `popoverPaper` has no boxShadow despite its name | S09, including geolocator elevation 4 |
| Plain Paper: [button-dropdown menu:141](../../packages/geoview-core/src/ui/button-drop-down/button-drop-down.tsx#L141), [table skeleton:24](../../packages/geoview-core/src/core/components/data-table/data-skeleton.tsx#L24) (`TableContainer component={Paper}`), [exported Paper wrapper:54](../../packages/geoview-core/src/ui/paper/paper.tsx#L54) | No fixed replacement; wrapper forwards props | S09 unless caller supplies a stronger local shadow |
| Card: [AppBar panel:181](../../packages/geoview-core/src/ui/panel/panel.tsx#L181), [exported Card wrapper:64](../../packages/geoview-core/src/ui/card/card.tsx#L64) | Panel `panelCard` has no shadow; caller `panelStyles`/wrapper rest props can override | S09, not Card's default Paper elevation 1 or raised 8. CardHeader/CardContent are not additional Papers |
| Popover/Menu paper: [Popover wrapper:102](../../packages/geoview-core/src/ui/popover/popover.tsx#L102), [Menu wrapper:57](../../packages/geoview-core/src/ui/menu/menu.tsx#L57), [table export menu:123](../../packages/geoview-core/src/core/components/data-table/export-button.tsx#L123), [show/hide columns:153](../../packages/geoview-core/src/core/components/data-table/show-hide-columns-button.tsx#L153) | No fixed shadow replacement in these wrappers/calls; show/hide uses list slot aria-label only | S09 instead of default Popover/Menu elevation 8; caller paper slots/props can replace it |
| Select's non-native Menu: [Select wrapper](../../packages/geoview-core/src/ui/select/select.tsx), including geolocator filters | No fixed paper-shadow replacement in the wrapper; caller menu props remain possible | Default menu Paper gets S09; native select has no popup Paper |
| Dialog: [share:171](../../packages/geoview-core/src/core/components/app-bar/buttons/share.tsx#L171), [fullscreen:73](../../packages/geoview-core/src/core/components/common/full-screen-dialog.tsx#L73), [export:340](../../packages/geoview-core/src/core/components/export/export-modal.tsx#L340), [Modal wrapper:312](../../packages/geoview-core/src/ui/modal/modal.tsx#L312) and its focus-trap dialogs | No local boxShadow replacement. Modal's descendant Paper rules change radius/size, not shadow; title/content/actions are not Paper roots | S09 instead of Dialog default elevation 24 |
| Drawer: [wrapper:97](../../packages/geoview-core/src/ui/drawer/drawer.tsx#L97) | Generator `MuiDrawer.paper` only sets position relative; wrapper width/transition styles do not set shadow | S09 even for permanent/persistent drawer paper (MUI elevation 0); temporary normally uses 16 |
| Alert: [snackbar wrapper:31](../../packages/geoview-core/src/ui/snackbar/snackbar.tsx#L31), [usage:98](../../packages/geoview-core/src/ui/snackbar/snackbar.tsx#L98) | Alert filled variant/elevation 6; local `sx` is width only. No shadow replacement | S09, not requested elevation 6; caller props spread can override elevation/slot/sx |
| Accordion: [wrapper:193](../../packages/geoview-core/src/ui/accordion/accordion.tsx#L193) | No local shadow; wrapper `sx` is on outer Box, not Accordion root | S09 on each Accordion Paper rather than default 1 |
| Autocomplete popup: [wrapper:65](../../packages/geoview-core/src/ui/autocomplete/autocomplete.tsx#L65), plus table filter autocomplete | No fixed paper-shadow replacement; autoCompleteProps forward caller slots. Listbox itself is `ul`, **not** Paper | S09 on default popup Paper (default Paper elevation 1), not on listbox/options |
| MUI AppBar: [geolocator bar:37](../../packages/geoview-core/src/core/components/geolocator/geolocator-bar.tsx#L37), via [AppBarUI:51](../../packages/geoview-core/src/ui/appbar/appbar.tsx#L51) | No shadow replacement; geolocator descendant Paper styles set background/foreground only | S09 instead of AppBar default elevation 4. Core viewer AppBar is a Box and is not itself a Paper |
| MaterialReactTable: [table paper props:1170](../../packages/geoview-core/src/core/components/data-table/data-table.tsx#L1170), table action/filter menus, [date-picker filter props:634](../../packages/geoview-core/src/core/components/data-table/data-table.tsx#L634) | Main `tablePaper` adds flex/height only. No baseline GeoView shadow override for its menu/autocomplete/date-paper slots | Main table and default menu/autocomplete Papers get S09. Date picker desktop Paper (installed picker default 8) and mobile Dialog paper also inherit S09 when rendered; date/calendar cells are not additional Papers |

Installed family inheritance was checked in MUI's Card, Popover, Menu, Dialog,
Drawer, Alert, Accordion, Autocomplete and AppBar implementations. Select opens
Menu; plain TableContainer is not Paper unless `component={Paper}`. Popper,
Tooltip, ButtonGroup, Stepper and the Box-based footer/map-info/shell are not
Paper by default. Snackbar normally has a Paper-backed SnackbarContent when
using MUI's message slot, but this wrapper supplies an Alert child, so there is
no second SnackbarContent Paper here. No actual MobileStepper/SnackbarContent
JSX caller was found in the scoped first-party source. Library internals are
consumer context, not added discovery occurrences.

**Two elevation-prop rows today:**

- [S52](./THEME_DISCOVERY.md#S52), geolocator `elevation={4}`: one S09 layer,
  not MUI shadows[4]'s three black layers. Paper still sets its elevation-4
  variable/overlay; no local shadow supersedes S09.
- [S53](./THEME_DISCOVERY.md#S53), filled snackbar Alert `elevation={6}`:
  the same one S09 layer, not shadows[6]'s three black layers. Its actual
  in-scope caller passes width/severity/close props, no alternate elevation.

**Historical scope interpretation (not needed under KEEP):** changing just the MuiPaper root's
boxShadow declaration is a theme-style policy change, **not** a theme/provider
restructure: no provider, theme dimensions or API need change. Its broad visual
impact still requires explicit approval; this is not permission to change
colours, borders, overlays, focus rings or other Paper styles.

**Options reviewed (SQ1); KEEP is DECIDED**

Decided 2026-10-28.

- **Keep — DECIDED:** preserve every listed result; elevation props remain ineffective
  for shadow on non-overridden Paper roots, and S09 remains an individual
  colour-preserving hold SH5 and the named edge separation treatment.
- **Scope — NOT ADOPTED:** keep the existing treatment only on an explicitly approved set of
  named edge-separation consumers; restore native elevation elsewhere. This
  narrows global reach but needs your exact consumer list before an executable
  rule or ledger can be completed.
- **Remove only this declaration — NOT ADOPTED:** restore component-requested/default MUI
  shadows on all non-locally-overridden Papers, including zero on permanent
  drawers and Alert defaults outside this wrapper. Existing `sx` 2 and
  `featurePaper:none` remain; elevation appearance intentionally changes.

The geolocator `elevation={4}` (S52) and Alert `elevation={6}` (S53) are
**inert for box-shadow under the override**: changing their elevation numbers
has no visible shadow effect. This is not a claim that elevation has no other
effect: Paper's separate dark-mode background overlay can still depend on
elevation, as recorded above. Neither prop is changed in this normalization.
There is no adopted elevation-changing rule.

### 3. Classification

Each S-ID has exactly one role and observable consumer. Geometry alone was
not used as evidence of elevation. S09 now has the DECIDED edge separation
role under KEEP; its previous mixed-global-policy classification is resolved
by the user's answer, not by geometry. "Other" records icon framing whose
elevation intent is not established.
Focus-helper rows are classified by their **composed result**: a helper call
followed by `none` is outline-only focus suppression, not a painted halo.

| Role | Observable consumer | Count | S-IDs | Normalized value(s) |
|---|---|---:|---|---|
| Elevation | Slider thumb base relief | 1 | [S12](./THEME_DISCOVERY.md#S12) | One pseudo-element layer: 0 2px 12px 0 rgba(0,0,0,.4) |
| Elevation | Version, attribution, footer-resize and notification floating panels | 4 | [S43](./THEME_DISCOVERY.md#S43), [S44](./THEME_DISCOVERY.md#S44), [S49](./THEME_DISCOVERY.md#S49), [S50](./THEME_DISCOVERY.md#S50) | sx shadow index 2 |
| Elevation | Geolocator results/filter paper; snackbar Alert | 2 | [S52](./THEME_DISCOVERY.md#S52), [S53](./THEME_DISCOVERY.md#S53) | Requested 4 / 6; effective S09, see preceding section |
| Edge separation | Map-info strip | 1 | [S06](./THEME_DISCOVERY.md#S06) | 0 0 5px 0 bg-dark20 alpha 1; external grey[300] fallback |
| Edge separation | Time-slider header; framed layer-list rows; details status header; selected-layer frame | 4 | [S07](./THEME_DISCOVERY.md#S07), [S08](./THEME_DISCOVERY.md#S08), [S10](./THEME_DISCOVERY.md#S10), [S11](./THEME_DISCOVERY.md#S11) | 0 12px 9px -13px; literal #E0E0E0 / bg-dark20 alpha .5 / bg-dark20 alpha 1 |
| Edge separation | Footer tab-panel boundary | 1 | [S48](./THEME_DISCOVERY.md#S48) | sx shadow index 2; already scale-owned, role established by boundary consumer, not index |
| Focus halo | Shared focus-helper consumers; MUI focus-enabled controls; slider focused plus hover/active | 3 | [S02](./THEME_DISCOVERY.md#S02), [S03](./THEME_DISCOVERY.md#S03), [S04](./THEME_DISCOVERY.md#S04) | 0 0 0 6px focus halo; D6 |
| Focus halo | Focused tab | 1 | [S13](./THEME_DISCOVERY.md#S13) | inset 0 0 0 6px focus halo; outline also inset |
| Focus suppression | Panel content, settings-card fallback, map-info rotation note, expanded scale group | 4 | [S54](./THEME_DISCOVERY.md#S54), [S55](./THEME_DISCOVERY.md#S55), [S56](./THEME_DISCOVERY.md#S56), [S57](./THEME_DISCOVERY.md#S57) | Helper outline retained; halo suppressed by subsequent local none |
| Focus halo | Slider external-theme fallback | 1 | [S58](./THEME_DISCOVERY.md#S58) | Helper outline + halo when theme.focusVisible is absent |
| Focus suppression | Form-control/static-button helper composition | 2 | [S59](./THEME_DISCOVERY.md#S59), [S60](./THEME_DISCOVERY.md#S60) | Helper outline retained; subsequent none removes halo |
| Focus halo | Switch label group; custom-legend disclosure fallback | 2 | [S61](./THEME_DISCOVERY.md#S61), [S62](./THEME_DISCOVERY.md#S62) | Helper outline + halo |
| Focus suppression | Drawing-format button helper composition | 1 | [S63](./THEME_DISCOVERY.md#S63) | Helper outline retained; subsequent none removes halo |
| Focus suppression | AppBar and NavBar buttons | 2 | [S14](./THEME_DISCOVERY.md#S14), [S31](./THEME_DISCOVERY.md#S31) | none + transparent outline; replacement concerns below |
| Focus suppression | Layer-list button; responsive panel action buttons and content region | 3 | [S15](./THEME_DISCOVERY.md#S15), [S16](./THEME_DISCOVERY.md#S16), [S17](./THEME_DISCOVERY.md#S17) | none; retained inset outline / explicit helper outline |
| Focus suppression | Data-table pin controls, sort badge root/child, header actions, toolbar and image-viewer button | 6 | [S19](./THEME_DISCOVERY.md#S19), [S20](./THEME_DISCOVERY.md#S20), [S21](./THEME_DISCOVERY.md#S21), [S22](./THEME_DISCOVERY.md#S22), [S23](./THEME_DISCOVERY.md#S23), [S24](./THEME_DISCOVERY.md#S24) | none on respective focus selectors; badge-root selector applicability noted below |
| Focus suppression | Guide search navigation/clear; layer settings cards; map-info rotation note; mouse-position cycle | 5 | [S26](./THEME_DISCOVERY.md#S26), [S27](./THEME_DISCOVERY.md#S27), [S28](./THEME_DISCOVERY.md#S28), [S29](./THEME_DISCOVERY.md#S29), [S30](./THEME_DISCOVERY.md#S30) | none; outline remains |
| Focus suppression | Scale cycle and expanded group; keyboard-navigation prompt buttons | 3 | [S32](./THEME_DISCOVERY.md#S32), [S33](./THEME_DISCOVERY.md#S33), [S34](./THEME_DISCOVERY.md#S34) | none; outline remains |
| Focus suppression | Form-control helper, static AppBar-style button and MenuItem | 3 | [S35](./THEME_DISCOVERY.md#S35), [S36](./THEME_DISCOVERY.md#S36), [S37](./THEME_DISCOVERY.md#S37) | none; helper outline or MUI inset outline |
| Focus suppression | Switch thumb-button/track; drawing-format button; keyboard-focused InputBase | 4 | [S39](./THEME_DISCOVERY.md#S39), [S40](./THEME_DISCOVERY.md#S40), [S41](./THEME_DISCOVERY.md#S41), [S64](./THEME_DISCOVERY.md#S64) | none; switch wrapper ring / helper outline. S64 is helper call, not another literal none |
| Elevation suppression | Responsive layout enlarge button; feature-information paper; layer-list frame | 3 | [S18](./THEME_DISCOVERY.md#S18), [S25](./THEME_DISCOVERY.md#S25), [S38](./THEME_DISCOVERY.md#S38) | none; root/state details below |
| Hover/active affordance | Slider hover ring | 2 | [S01](./THEME_DISCOVERY.md#S01), [S05](./THEME_DISCOVERY.md#S05) | 3px blue .7 !important; 8px white .16; later S01 overrides S05 on matching hover |
| Hover/active affordance | Active responsive-layout button; hoverable layer preview | 2 | [S42](./THEME_DISCOVERY.md#S42), [S45](./THEME_DISCOVERY.md#S45) | sx index 1 / 2 |
| Edge separation | All non-overridden Papers listed above | 1 | [S09](./THEME_DISCOVERY.md#S09) | 0 12px 9px -13px bg-dark20 alpha .5; DECIDED named treatment under KEEP |
| Other: icon framing/relief, elevation intent unknown | Stacked layer preview; general preview; legacy layer-icon image | 3 | [S46](./THEME_DISCOVERY.md#S46), [S47](./THEME_DISCOVERY.md#S47), [S51](./THEME_DISCOVERY.md#S51) | sx index 2; not recast as floating surface by geometry |

**Per-role counts:** elevation **7**, edge separation **7**, focus halo **7**,
focus suppression **33**, elevation suppression **3**, hover/active affordance
**4**, other **3**: **7 + 7 + 7 + 33 + 3 + 4 + 3 = 64**.
The 33 focus-suppression roles include 25 literal none rows, seven helper calls
composed into those outline-only treatments, and the S64 form-control helper
application; those eight context calls are not extra literal declarations.

#### The 28 literal `none` rows

The split is **25 focus suppressions + 3 elevation/resting-shadow suppressions
= 28**. S64 is an additional outline-only helper application, not a 29th
literal `none`. Each focus suppression below names the surviving indicator
or explicitly flags its uncertainty. "Outline remains" is source evidence,
not a computed contrast/clipping/accessibility certification.

| Focus-suppression rows | Replacement and inspected default |
|---|---|
| [S14](./THEME_DISCOVERY.md#S14) | **Flag: replacement not established for every target.** AppBar `& button` sets outlineColor transparent and shadow none. Dynamic `buttonFilled` controls have an explicit focus background/foreground at [generator:137](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L137), but AppBar scroll controls have no such class. Static-style helper outlines can also meet this broader suppression; no universal safe outline/ring is established. MUI IconButton inherits ButtonBase's opt-in ring; a possible ripple is not proof of an equivalent indicator |
| [S31](./THEME_DISCOVERY.md#S31) | **Flag: no replacement established** for NavBar ordinary/closed tool buttons. Transparent outline + none suppress the MUI ring; highlighted/active/hover styles do not establish a distinct keyboard-focus treatment. The [NavBar panel trigger:117](../../packages/geoview-core/src/core/components/nav-bar/nav-bar-panel-button.tsx#L117) has no separate focus wrapper |
| [S15](./THEME_DISCOVERY.md#S15) | ListItemButton retains theme focus outline, offset -2px. MUI 9.5 insets its ring for clipping lists; none removes the halo, not the outline |
| [S16](./THEME_DISCOVERY.md#S16) | Panel ButtonBase-derived action buttons retain the theme outline with -2px offset; focus none also supersedes their active sx shadow 1 (S42) |
| [S17](./THEME_DISCOVERY.md#S17) | Explicit helper S54 leaves the 3px outline inset by 3px on the focusable content Box |
| [S19](./THEME_DISCOVERY.md#S19), [S22](./THEME_DISCOVERY.md#S22), [S23](./THEME_DISCOVERY.md#S23), [S24](./THEME_DISCOVERY.md#S24) | Pin/header/toolbar IconButtons and the outlined image-viewer Button retain ButtonBase theme outline, with -3px offset. None removes halo (and any combined contained-button elevation where applicable), not outline |
| [S20](./THEME_DISCOVERY.md#S20) | Badge root has action.focus background but no outline declaration. Installed MRT sort badge root is a nonfocusable span; its TableSortLabel child receives focus. Badge does not acquire `.Mui-focusVisible` by default, so this selector is **not an established replacement or an established active suppression**; caller overrides could change applicability. Retain pending evidence, not delete as redundant |
| [S21](./THEME_DISCOVERY.md#S21) | Actual sort-label child is a ButtonBase-derived span; MUI theme outline survives with -3px offset and action.focus background. Additional badge-content spans are not default focus targets |
| [S26](./THEME_DISCOVERY.md#S26), [S27](./THEME_DISCOVERY.md#S27) | Guide IconButtons retain theme outline at -3px |
| [S28](./THEME_DISCOVERY.md#S28) | Settings option is a ButtonBase with disableRipple. Theme outline survives when focusVisible is configured; otherwise S55 explicitly supplies the outline. None only drops halo |
| [S29](./THEME_DISCOVERY.md#S29) | Focusable map-info Box role=note has explicit S56 helper outline at offset 0 |
| [S30](./THEME_DISCOVERY.md#S30), [S32](./THEME_DISCOVERY.md#S32) | Mouse-position/scale text Buttons disableRipple but retain MUI theme outline at offset 0; a plain external theme without focusVisible does **not** gain a new indicator from these styles |
| [S33](./THEME_DISCOVERY.md#S33) | Parent expanded-scale group has explicit S57 outline on :has(:focus-visible), offset 0; child radio focus remains separate |
| [S34](./THEME_DISCOVERY.md#S34) | Keyboard-navigation prompt Button retains MUI theme outline. Native :focus-visible selector means MUI class/native-state combinations need runtime confirmation; removing none is not justified by resting appearance |
| [S35](./THEME_DISCOVERY.md#S35) | Form-control helper S59 deliberately keeps the shared outline and removes its own halo; comment cites existing border/underline |
| [S36](./THEME_DISCOVERY.md#S36) | Static-style Button/IconButton has explicit S60 helper outline at offset 0; ancestor S14 can still suppress its outline colour in AppBar, so this is not proof that the composed AppBar control is safe |
| [S37](./THEME_DISCOVERY.md#S37) | MenuItem retains MUI theme inset outline; none removes its inset halo, offset -3px. Plain external themes have MUI action.focus fallback background rather than GeoView's opt-in ring |
| [S39](./THEME_DISCOVERY.md#S39), [S40](./THEME_DISCOVERY.md#S40) | Switch's **whole FormControlLabel** receives S61 helper outline + halo. Local styles suppress switch-base ring and MUI 9.5's separate sibling-track ring; these are not redundant restatements |
| [S41](./THEME_DISCOVERY.md#S41) | Drawing-format IconButton explicitly receives S63 helper outline at offset 0, then drops halo |

The other three literal `none` sites:

- [S18](./THEME_DISCOVERY.md#S18), outlined enlarge Button: resting shadow
  suppression. MUI outlined Button has no resting elevation, but contained
  variants have 2/4/8 and focus 6 plus theme halo; default variant alone does
  not prove this override redundant in all inherited/caller states. Preserve.
- [S25](./THEME_DISCOVERY.md#S25), featurePaper: removes S09/default Paper
  elevation, with border none. Removing it changes the flat feature surface.
- [S38](./THEME_DISCOVERY.md#S38), `.layer-panel` ListItem: ListItem itself
  has no MUI elevation. This also targets rows carrying shared
  `.bordered`/`.bordered-primary` shadow classes; exact winner depends on
  selector/injection order. It is not safe to delete based on MUI default alone.

**Focus-related Transitions cross-reference:** [T50](./THEME_DISCOVERY.md#T50)
is `all 300ms` with overshoot and is held as Transitions H8: it can animate
slider halo/hover shadows S01/S02/S05/S58 as well as thumb dimensions.
Do not separate its shadow behavior from that held interaction. Other
focus-bearing consumers have T53/T54 (AppBar/NavBar background),
T56 (tab background, not its halo), T58 (settings border/background), and
T67 (map-info arrow transform, not its outline). None of these authorizes
focus-indicator changes under the accepted transition curve migrations.

**Separate context: 13 rows.** [S52](./THEME_DISCOVERY.md#S52) and
[S53](./THEME_DISCOVERY.md#S53) are requested elevations already using MUI's
public API; their effective result is controlled by S09, not a literal to
replace at the prop site. The eleven helper applications
[S54](./THEME_DISCOVERY.md#S54), [S55](./THEME_DISCOVERY.md#S55),
[S56](./THEME_DISCOVERY.md#S56), [S57](./THEME_DISCOVERY.md#S57),
[S58](./THEME_DISCOVERY.md#S58), [S59](./THEME_DISCOVERY.md#S59),
[S60](./THEME_DISCOVERY.md#S60), [S61](./THEME_DISCOVERY.md#S61),
[S62](./THEME_DISCOVERY.md#S62), [S63](./THEME_DISCOVERY.md#S63),
[S64](./THEME_DISCOVERY.md#S64) compose the settled focus contract and
demonstrate replacement indicators; they are not independent literal shadows
to normalize. They retain their classification roles above.

### 4. Findings that constrain rules

**Placeholder equivalence verified.**
[types.ts:8](../../packages/geoview-core/src/ui/style/types.ts#L8) includes
200 in the 50-step range; [80](../../packages/geoview-core/src/ui/style/types.ts#L80)
assigns `this.dark[i] = this.darken(i / 1000)`.
[137-141](../../packages/geoview-core/src/ui/style/types.ts#L137)
defines `darken(coefficient, opacity = 1)`, respecting isInverse.
Thus `bgColor.dark[200]` **equals `bgColor.darken(0.2)` at alpha 1**,
including inverse themes. No placeholder split is required. Five declarations
S07/S08/S09/S10/S11 do share **0 12px 9px -13px geometry**, not one colour:
literal #E0E0E0 (S07), bg-dark20 alpha .5 (S08/S09), bg-dark20 alpha 1
(S10/S11). Matching geometry establishes neither equal composited appearance
nor the same role across all Paper descendants.

**Colour ownership, not a new colour decision.**
[D4/D5](./COLOUR_DECISIONS.md#d4--d5-canonical-palette-and-the-indexed-ramps--mui-roles-for-ui-ramp-retained-for-map-rendering)
owns ramp-to-semantic UI colour policy;
[D6](./COLOUR_DECISIONS.md#d6-focus-ring-contract--decided-leave-as-is) owns
focusIndicator and its two-layer contract;
[D7](./COLOUR_DECISIONS.md#d7-scope--confirmed-as-written) defines scope.
HELD's [`.bordered-primary` border entry](./HELD.md#L19) covers its primary
accent **border**, not S11's bg-derived shadow. Its map-info background and
time-slider-related text discussions do not hold these shadow declarations.
No explicit colour-hold entry was found for **any of S07-S11**, and HELD's
`#E0E0E0` example is a possible textColor root, not authority to replace
time-slider shadow colour. Record that coverage gap here; do not silently
claim the colour sweep approved these expressions or choose their replacements.
Preserve their current colour/alpha under the DECIDED holds. SQ2/SQ5 record
individual retention and colour-owner referral, not a palette substitution;
HELD/WHATS_LEFT are unchanged.

**Missing external-theme fallbacks (pending cross-concern revisit):**

| Row | Baseline source | Missing optional value and result |
|---|---|---|
| [S08](./THEME_DISCOVERY.md#S08) | [containers-style.ts:67](../../packages/geoview-core/src/core/containers/containers-style.ts#L67) | `.bordered`: `geoViewColor?.bgColor.darken(.2,.5)` |
| [S11](./THEME_DISCOVERY.md#S11) | [containers-style.ts:71](../../packages/geoview-core/src/core/containers/containers-style.ts#L71) | `.bordered-primary`: `geoViewColor?.bgColor.dark[200]` |
| [S10](./THEME_DISCOVERY.md#S10) | [details-style.ts:21](../../packages/geoview-core/src/core/components/details/details-style.ts#L21) | `rightPanelStatus`: `geoViewColor?.bgColor.dark[200]` |

If geoViewColor is absent, these template strings contain literal `undefined`
and are invalid CSS shadow values. They are not valid shadow fallbacks to
`none`; a lower-priority declaration/default may then win. These three sites
are included in the **Fonts-gate cross-concern fallback revisit** in
[WHATS_LEFT.md](./WHATS_LEFT.md), alongside Transitions Q16 (`tooltipDelay`,
`splash`, `geoViewFontSize`, `geoViewColor`). No fallback value or new behavior
is proposed here.

**Theme access at every literal/template site (12 rows):**

| Sites | Access at `cc7d57918` |
|---|---|
| [S01](./THEME_DISCOVERY.md#S01), [S05](./THEME_DISCOVERY.md#S05), [S12](./THEME_DISCOVERY.md#S12) | Slider styles already accept a `Theme` argument; reusable `ui/` component receives current provider theme, including external MUI themes |
| [S03](./THEME_DISCOVERY.md#S03) | Focus helper accepts `IGeoViewColors`, not full Theme; callers supply per-viewer values or existing explicit fallback. It must not import a global theme |
| [S04](./THEME_DISCOVERY.md#S04), [S09](./THEME_DISCOVERY.md#S09) | Generator accepts the colour object for the selected theme; Paper override callback already receives current theme. No provider restructure is needed to read shadows there |
| [S06](./THEME_DISCOVERY.md#S06) | [MapInfo:45](../../packages/geoview-core/src/core/components/map-info/map-info.tsx#L45) reads theme, passes it to styles at :73; explicit grey fallback already present |
| [S07](./THEME_DISCOVERY.md#S07) | [TimeSlider:94](../../packages/geoview-time-slider/src/time-slider.tsx#L94) reads provider theme through exported ui.useTheme, passes it at :97; literal colour is not due to lack of theme access |
| [S08](./THEME_DISCOVERY.md#S08), [S11](./THEME_DISCOVERY.md#S11) | [Shell:74](../../packages/geoview-core/src/core/containers/shell.tsx#L74) reads per-viewer theme and passes it to getShellSxClasses at :115 |
| [S10](./THEME_DISCOVERY.md#S10) | [DetailsPanel:78](../../packages/geoview-core/src/core/components/details/details-panel.tsx#L78) reads provider theme and passes it at :81 |
| [S13](./THEME_DISCOVERY.md#S13) | Tabs style helper accepts current Theme and resolves existing focusIndicator fallbacks; retain inset D6 geometry |

**Numeric `sx` is already shadow-scale access.** Installed system
[shadows.js:11](../../packages/geoview-core/node_modules/@mui/system/shadows/shadows.js#L11)
uses `themeKey:'shadows'`; evaluating installed styleFunctionSx with
`{boxShadow:2}` returns `theme.shadows[2]`, not `2px`.
Indices 1 and 2 have **three black layers**, unlike the one-layer edge strings.
Installed
[createStyled.js:195](../../packages/geoview-core/node_modules/@mui/system/createStyled/createStyled.js#L195)
adds styleOverrides before [sx:222](../../packages/geoview-core/node_modules/@mui/system/createStyled/createStyled.js#L222).
For a same-Paper root with ordinary equal specificity, local `sx` wins over
S09: S43/S44/S49/S50 use shadows[2], S25 uses none.
Unrelated higher-specificity ancestor/state rules or `!important` still need
normal cascade review; this is not a universal "sx beats everything" rule.

**Installed-default evidence used for all suppressions:** MUI 9.5
[ButtonBase:58](../../packages/geoview-core/node_modules/@mui/material/ButtonBase/ButtonBase.js#L58)
resets native outline, then
[92](../../packages/geoview-core/node_modules/@mui/material/ButtonBase/ButtonBase.js#L92)
applies theme.focusVisible. IconButton and TableSortLabel inherit it;
Badge is a span and supplies no independent ring.
[Button:119](../../packages/geoview-core/node_modules/@mui/material/Button/Button.js#L119)
uses elevation 2/4/8 and focus 6 plus halo for contained; outlined/text do not
use those elevation variants. ListItem has no shadow default.
[ListItemButton:97](../../packages/geoview-core/node_modules/@mui/material/ListItemButton/ListItemButton.js#L97)
and [MenuItem:100](../../packages/geoview-core/node_modules/@mui/material/MenuItem/MenuItem.js#L100)
inset focus rings; without theme.focusVisible they use focus background.
[Switch:140](../../packages/geoview-core/node_modules/@mui/material/Switch/Switch.js#L140)
adds a track sibling ring; thumb still has shadows[1] at :241.
[InputBase:168](../../packages/geoview-core/node_modules/@mui/material/InputBase/InputBase.js#L168)
resets input outline; GeoView's keyboard-mode parent outline is provided by
S64. [Slider:276](../../packages/geoview-core/node_modules/@mui/material/Slider/Slider.js#L276)
has default pseudo-shadow shadows[2], colour-alpha hover/focus ring 8px and
active ring 14px; GeoView's replacements are not mere restatements.
These checks justify **not deleting** suppressions; no redundancy finding or
focus repair is made from resting styles alone.

### 5. Decided retention rules and holds

SR1-SR4 and SH1-SH5 are **DECIDED**, with no source migration.
Rows retained unchanged require final reconciliation, **not** ledger units.
SR5's intentional-change proposal is NOT ADOPTED and retained for reference.

#### SR1 — DECIDED: retain numeric sx shadow-scale access

Decided 2026-10-28.

**Affected first: 10 exact-alias/unchanged rows:**
[S42](./THEME_DISCOVERY.md#S42), [S43](./THEME_DISCOVERY.md#S43),
[S44](./THEME_DISCOVERY.md#S44), [S45](./THEME_DISCOVERY.md#S45),
[S46](./THEME_DISCOVERY.md#S46), [S47](./THEME_DISCOVERY.md#S47),
[S48](./THEME_DISCOVERY.md#S48), [S49](./THEME_DISCOVERY.md#S49),
[S50](./THEME_DISCOVERY.md#S50), [S51](./THEME_DISCOVERY.md#S51).

**DECIDED rule:** retain numeric boxShadow in sx as existing theme.shadows
access without reassigning indices by visual similarity.

Every listed row preserves its index, three-layer geometry and colour exactly;
S42 is 1, all others 2. Same-state S16 focus suppression still wins over S42's
active elevation; no pair moves. External MUI themes already supply shadows,
and their customized entries continue to apply. **Ledger: none**, unchanged.

#### SR2 — DECIDED: retain the settled focus shadow contract

Decided 2026-10-28.

**Affected first: 4 exact-alias/unchanged rows:**
[S02](./THEME_DISCOVERY.md#S02), [S03](./THEME_DISCOVERY.md#S03),
[S04](./THEME_DISCOVERY.md#S04), [S13](./THEME_DISCOVERY.md#S13).

**DECIDED rule:** retain existing shared focus definitions/lookups and the
tab's inset treatment under D6, outside the elevation scale.

All four preserve 6px halo geometry/colour and existing outline behavior.
S02 stays coupled to the slider focus/hover/active selectors and held T50;
S03/S04 keep helper and MUI contract synchronized; S13 stays inset. External
theme fallbacks/assumptions stay as they are; no conversion to shadows[6].
**Ledger: none**, unchanged; no D6 geometry or colour proposal.

#### SR3 — DECIDED: retain focus suppressions with source-supported indicators

Decided 2026-10-28.

**Affected first: 23 exact-alias/unchanged rows:**
[S15](./THEME_DISCOVERY.md#S15), [S16](./THEME_DISCOVERY.md#S16),
[S17](./THEME_DISCOVERY.md#S17), [S19](./THEME_DISCOVERY.md#S19),
[S20](./THEME_DISCOVERY.md#S20), [S21](./THEME_DISCOVERY.md#S21),
[S22](./THEME_DISCOVERY.md#S22), [S23](./THEME_DISCOVERY.md#S23),
[S24](./THEME_DISCOVERY.md#S24), [S26](./THEME_DISCOVERY.md#S26),
[S27](./THEME_DISCOVERY.md#S27), [S28](./THEME_DISCOVERY.md#S28),
[S29](./THEME_DISCOVERY.md#S29), [S30](./THEME_DISCOVERY.md#S30),
[S32](./THEME_DISCOVERY.md#S32), [S33](./THEME_DISCOVERY.md#S33),
[S34](./THEME_DISCOVERY.md#S34), [S35](./THEME_DISCOVERY.md#S35),
[S36](./THEME_DISCOVERY.md#S36), [S37](./THEME_DISCOVERY.md#S37),
[S39](./THEME_DISCOVERY.md#S39), [S40](./THEME_DISCOVERY.md#S40),
[S41](./THEME_DISCOVERY.md#S41).

**DECIDED rule:** retain these literal none suppressions and their existing
outline/wrapper-indicator composition, including the unconfirmed applicability
of S20, rather than replacing them with elevation zero or deleting them.

For **every** listed row the shadow remains none: no added layers, changed
offsets or colour. S20 is retained conservatively, not certified a safe active
suppression. S36's local outline does not certify S14's ancestor composition.
Preserve S17/S54, S28/S55, S29/S56, S33/S57, S35/S59, S36/S60, S39/S40/S61
and S41/S63 as composed contracts. External themes without focusVisible may
not supply inherited outlines (notably S30/S32); this pre-existing boundary
joins the later fallback review, not a new fallback rule. **Ledger: none**.

#### SR4 — DECIDED: retain flat/resting-shadow suppressions

Decided 2026-10-28.

**Affected first: 3 exact-alias/unchanged rows:**
[S18](./THEME_DISCOVERY.md#S18), [S25](./THEME_DISCOVERY.md#S25),
[S38](./THEME_DISCOVERY.md#S38).

**DECIDED rule:** retain explicit none on these flat consumers without treating
it as an elevation-role token or a redundant restatement.

Each retains no shadow layers/colour/offsets at its selector. S25 continues to
suppress Paper even if S09 changes; S38's interaction with S08/S11 stays subject
to existing cascade. No coupled row moves. External Paper themes still respect
local none; no new GeoView extension. **Ledger: none**.

#### SR5 — NOT ADOPTED: conditional restoration of native Paper elevation

Decided 2026-10-28.

KEEP rejects this conditional removal rule. The original proposal below is
reference only; it contributes no adopted rule rows and no source-changing unit.

**Affected first: 1 inventory row with intentional behavior change:**
[S09](./THEME_DISCOVERY.md#S09). S52/S53 and the reach list are affected-consumer
context, **not** additional declarations in this rule's count.

**PROPOSED conditional rule:** only if SQ1 selects removal, remove the global
MuiPaper root boxShadow declaration so native elevation resolves theme.shadows.

This removes one `0 12px 9px -13px` bg-derived alpha-.5 layer and reveals each
consumer's requested shadow: default MUI entries use three black layers for
positive elevations, none for 0. For S52, index 4 is
`0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14),
0 1px 10px 0 rgba(0,0,0,.12)`; S53 index 6 is
`0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14),
0 1px 18px 0 rgba(0,0,0,.12)`.
This deliberately changes geometry, layer count and colour/opacity through
MUI's existing elevation contract, not an alleged colour-preserving alias.
It requires approval of that effect, not a separate invented palette colour.
Local sx2/none overrides remain unchanged.

No JS/CSS timing pair moves; native Paper's box-shadow transition can animate
changed elevation results. External themes without this generated override are
unaffected; GeoView themes using custom shadows now honor them. Generator is
its own **conditional ledger unit SU1**. If SQ1 selects keep, S09 transfers to
hold SH5 instead (no source unit). If scope is selected, this broad removal
rule is not executable: revise the exact target list, rule/hold partition and
ledger before implementation. No named edge token is proposed solely to
preserve the shared geometry: several class consumers are frames, while S09
is a mixed global policy.

#### Decided holds (Shadows)

Transferred 2026-10-29 to [HELD.md](./HELD.md#shadows-holds).

**SH1 — DECIDED**

Decided 2026-10-28.

**SH2 — DECIDED (each occurrence separately)**

Decided 2026-10-28.

**SH3 — DECIDED**

Decided 2026-10-28.

**SH4 — DECIDED, accessibility follow-up out of scope**

Decided 2026-10-28.

**SH5 — DECIDED, KEEP named edge separation treatment**

Decided 2026-10-28.

| DECIDED hold | Rows / count | Reason |
|---|---|---|
| SH1 slider hover/base literals | [S01](./THEME_DISCOVERY.md#S01), [S05](./THEME_DISCOVERY.md#S05), [S12](./THEME_DISCOVERY.md#S12) / **3** | Keep the important blue hover ring, overridden white hover declaration and thumb base relief together with [Transitions H8](#decided-holds)/[T50](./THEME_DISCOVERY.md#T50). No shadow or motion change |
| SH2 map-info edge treatment | [S06](./THEME_DISCOVERY.md#S06) / **1** | Existing MUI shadows are not exact aliases. Preserve this independent strip treatment, geometry, colour/alpha and existing fallback |
| SH2 bordered frame, individual hold | [S08](./THEME_DISCOVERY.md#S08) / **1** | Retain separately: shared geometry uses three colour sources; unification would change colour, owned by COLOUR_DECISIONS. Preserve bg-dark20 alpha .5 |
| SH2 status header, individual hold | [S10](./THEME_DISCOVERY.md#S10) / **1** | Retain separately for the same colour-ownership reason; preserve bg-dark20 alpha 1 |
| SH2 bordered-primary frame, individual hold | [S11](./THEME_DISCOVERY.md#S11) / **1** | Retain separately for the same colour-ownership reason; preserve bg-dark20 alpha 1 |
| SH3 time-slider header, individual hold | [S07](./THEME_DISCOVERY.md#S07) / **1** | Preserve #E0E0E0 and geometry separately: unification would change colour across the three sources, owned by COLOUR_DECISIONS. Refer this literal to the colour owner; follow-up in [WHATS_LEFT.md](./WHATS_LEFT.md) |
| SH4 toolbar focus safety | [S14](./THEME_DISCOVERY.md#S14), [S31](./THEME_DISCOVERY.md#S31) / **2** | Focus concerns for NavBar and AppBar targets without replacement indicators are out of scope. Retain unchanged without certifying safety; accessibility follow-up in [WHATS_LEFT.md](./WHATS_LEFT.md), no fix proposed |
| SH5 Paper override, individual hold and named treatment | [S09](./THEME_DISCOVERY.md#S09) / **1** | KEEP as the DECIDED named edge separation treatment. Retain separately: three colour sources mean unification would change colour, owned by COLOUR_DECISIONS. Preserve bg-dark20 alpha .5 and current global reach |

SH1-SH5 total **3 + 4 + 1 + 2 + 1 = 11 held rows**.
S09 satisfies the end state as a decided named treatment but is counted only
once, in held, to preserve the KEEP partition and its individual colour hold.
SR5 contributes zero adopted rows.

### 6. Review answers and topic mapping

1. **User answer 1 → SQ1: DECIDED KEEP.**

   Decided 2026-10-28.

   Retain S09/SH5 as the named edge separation treatment. SR5 and SU1 are
   NOT ADOPTED, preserved as historical proposals. No provider/scope change.
2. **User answer 2 → SQ2: DECIDED individual holds.**

   Decided 2026-10-28.

   Retain each S07-S11 occurrence separately under SH3, SH2 or SH5; three
   colour sources mean unification would change colour owned by COLOUR_DECISIONS.
3. **User answer 3 → SQ3: DECIDED SH1.**

   Decided 2026-10-28.

   Slider literal shadows remain held with Transitions H8/T50.
4. **User answer 4 → SQ4: DECIDED out of scope.**

   Decided 2026-10-28.

   S31 and S14 targets without replacement indicators remain unchanged under
   SH4. Record the runtime accessibility verification follow-up, not a fix.
   S20 remains conservatively retained under SR3.
5. **User answer 5 → SQ5 (also SQ2's S07): DECIDED SH3.**

   Decided 2026-10-28.

   Hold time-slider #E0E0E0 and refer it to the colour owner.
6. **User answer 6 → SQ6: DECIDED retain SR1-SR4 and context.**

   Decided 2026-10-28.

   Existing scale/focus/suppression rows remain unchanged; no D6 changes.
7. **User answer 7 → SQ7: DECIDED pending Fonts-gate revisit.**

   Decided 2026-10-28.

   Add S08/S10/S11 and the other recorded external-theme limitations to the
   existing cross-concern review; no fallback is chosen in Shadows.

Follow-ups transferred to [WHATS_LEFT.md](./WHATS_LEFT.md) on 2026-10-29.

### 7. Reconciliation

**DECIDED KEEP partition.**

Decided 2026-10-28.

| DECIDED disposition | Groups | Rows |
|---|---:|---:|
| Unchanged rules SR1-SR4 | 4 | 10 + 4 + 23 + 3 = **40** |
| Holds SH1-SH5 (including individual S07-S11 holds) | 5 | 3 + 4 + 1 + 2 + 1 = **11** |
| Context: elevation props + helper calls | 2 categories | 2 + 11 = **13** |
| **Total: rule/retain + held + context** | | **40 + 11 + 13 = 64** |

SR5/SU1 are NOT ADOPTED and contribute zero migrated rows/units.
S14/S31 are holds rather than retained-rule rows; S09 is counted once in SH5.
Every S-ID has one classification role and one final disposition;
repeated findings/coupling references do not add rows.
Discovery totals remain **72 / 64 / 243 = 379 across 120 main-table files**.

### Ledger units (Shadows)

**DECIDED: none.**

Decided 2026-10-28.

**Shadows phase requires no source changes under the KEEP decision; Ledger units (Shadows): none.**

#### SU1 — NOT ADOPTED (original conditional unit retained for reference)

Decided 2026-10-28.

1. **SU1, conditional on SQ1 removal/SR5:** change only the Paper shadow
   declaration for [S09](./THEME_DISCOVERY.md#S09) in
   [themeOptionsGenerator.ts](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts).
   Generator/helper work is its own unit; coordinate its order with the
   already-decided Transitions generator unit without silently combining
   invocations. Capture a recorded-commit before-baseline for all affected
   Paper families across four themes, state transitions and differently themed
   viewers before changing it; re-confirm discovery/current-source drift and
   compare after styles/timing to that baseline.

KEEP is selected: there are **0 Shadows source-changing units**. The unit
above is historical, not executable or part of the active ledger. SR1-SR4,
S52/S53 and helper calls are checked at final reconciliation; they are
**not** ledger units. Held rows have no implementation unit.

### Discovery discrepancies and backup-diff verification

No wrong shadow occurrence, placeholder equivalence or count was established.
The inventory's shared geometry is correct; it is not a shared-colour or
shared-role claim. Its optional-value templates require the explicit invalid
CSS caveat above. The effective S52/S53 result follows S09, not their numbers.
S05's hover declaration is present but overridden by S01 in the matching
non-focus hover state; it remains a counted declaration, not a second
simultaneously painted halo.

The prior gate added only the **ID** column S01-S64 to discovery. This
answer-recording task makes **no discovery edits**. Its diff against
`decisions-before-shadows-answers.md` changes only Shadows decisions and the
header's Shadows status; Transitions and Fonts stay byte-identical.
ID-based partition/link checks verify all 64 final dispositions. No source,
colour/hold/outstanding-work document or configuration changes are part of
this task.

## Fonts

**Complete 2026-10-29. DECIDED — Decided 2026-10-29.** The user approved the end-state clarification,
three exact aliases and exact-match-only icon rule, and confirmed the holds
below. Fallback A remains decided. Migration batch 2026-10-29 is complete:
F-A, F-B and cross-concern X-A migrated. Fonts totals are **3 migrated,
24 retained, 89 held, 127 context = 243**. X-A passed the user-approved
reproducibility rule, actual-consumer checks and two-map identity check.
Transitions totals/H6 are updated for T25; Shadows remains byte-identical.

Source checked at HEAD **`af8d78d2466e2f3bea0111a886af02f215a9ee7a`**.
The installed MUI package is **9.5.0**. Stable IDs **F001-F243** follow discovery
table order; the ID column is the only discovery edit. All **243** occurrence
lines across **83** files map to unchanged declarations/JSX lines from discovery's
`cc7d57918`, using surrounding source context to account for shifted lines.
This confirms occurrence-level non-drift, not that entire files are unchanged.
Local consumers, selectors, slot overrides and variant cascades were also read
at HEAD; effective rendered sizes still require Gate 3 runtime verification.

### 1. Classification: role and observable consumer

The discovery split is **217 text + 26 icon = 243**. Roles below describe the
observable consumer, not a role inferred from a matching number. Theme
definitions and the forwarding Typography wrapper have no single known
consumer role and remain **other**. A title names a panel/card/dialog; a heading
introduces content; a label names a field/option; a value reports data; control
is text inside an actionable control; caption is subordinate explanatory/status
text. Hidden live messages retain their content role, not an invented size role.
These are source classifications, not proposals to restyle those roles.

| Role | Count |
|---|---:|
| text / control | 9 |
| text / value | 26 |
| text / body | 47 |
| text / label | 42 |
| text / other | 7 |
| text / title | 26 |
| text / caption | 22 |
| text / heading | 38 |
| icon / by font-size | 11 |
| icon / named SvgIcon size | 15 |
| **Total** | **243** |

The following partition assigns every F-ID exactly once. Values are declarations
or pre-cascade variant candidates; they are not claims of final computed styles.
The ID column in [discovery](./THEME_DISCOVERY.md) supplies each original
expression, source, selector/state and Text/icon tag.

<details>
<summary>All 243 rows by role, consumer and normalized value</summary>

| Role | Observable consumer | Count | F-IDs | Normalized value(s), before cascade |
|---|---|---:|---|---|
| text / control | Custom-legend description disclosure label | 1 | F001 | 0.75rem |
| text / value | Guide search match count | 1 | F002 | 0.7rem |
| text / body | Guide empty-search message | 1 | F003 | 0.7rem |
| text / label | Layer-opacity slider marks | 1 | F004 | 0.7rem |
| text / value | Slider value bubble | 1 | F005 | 0.7rem |
| text / other | Theme subtitle2 definition; future consumer role is caller-controlled | 1 | F006 | 0.7rem |
| text / title | AOI card title strip | 1 | F007 | 0.875rem |
| text / caption | Layer-list secondary paragraphs | 3 | F008, F020, F034 | 0.875rem; 0.875rem !important |
| text / heading | Available/hidden layer section headings | 1 | F009 | 0.875rem |
| icon / by font-size | Responsive layout close-button icon | 1 | F010 | 0.875rem |
| text / value | Data-table selected-row count | 1 | F011 | 0.875rem |
| text / control | Data-table header filter input | 1 | F012 | 0.875rem |
| text / body | Data-table instructions | 1 | F013 | 0.875rem |
| text / label | Geolocator filter input label | 2 | F014, F097 | 0.875rem; 1rem |
| text / value | Geolocator location/category result cells | 2 | F015-F016 | 0.875rem |
| icon / by font-size | Guide search navigation/clear icons | 2 | F017-F018 | 0.875rem |
| icon / by font-size | Add-layer button responsive icon: labelled / icon-only breakpoint | 2 | F019, F083 | 0.875rem; 1.6rem |
| text / body | Layer-information service/filter/time content container | 1 | F021 | 0.875rem |
| text / caption | Layer-details subtitle and attribution | 4 | F022-F023, F159-F160 | 0.875rem; body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / caption | Settings selected-option summary | 4 | F024, F197, F199-F200 | 0.875rem; body2: 0.875rem; before sx/parent/cascade |
| text / caption | Legend stack subtitle / title subordinate paragraph | 3 | F025-F026, F175 | 0.875rem; body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / body | Notification message | 1 | F027 | 0.875rem |
| text / value | Notification count | 1 | F028 | 0.875rem |
| text / control | Select input and menu option | 2 | F029-F030 | 0.875rem |
| text / other | Theme overline definition; role selected by callers | 1 | F031 | 0.875rem |
| text / body | Custom-legend description | 2 | F032, F186 | 0.875rem; body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / body | Time-slider description / layer-name summary | 2 | F033, F194 | 0.875rem; body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / caption | Filter available-date bounds | 2 | F035, F213 | 0.875rem; fallback: 0.875rem; caption: 0.75rem; before sx/parent/cascade |
| text / value | Filter range endpoints | 1 | F036 | 0.875rem; fallback: 0.875rem |
| text / label | Add-layer tree root and important item-label selector | 2 | F037-F038 | 0.8rem; 0.8rem !important |
| text / control | GeoChart horizontal text-button group | 1 | F039 | 0.9rem |
| text / body | Layer-panel no-selection prompt | 3 | F040, F135-F136 | 1.125rem; body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / body | Geolocator service/result messages | 4 | F041, F154-F156 | 1.125rem; body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| icon / by font-size | Geolocator clear-filters icon | 1 | F042 | 1.125rem |
| text / heading | Guide h3 content headings | 1 | F043 | 1.125rem |
| text / title | Legend panel/layer title | 2 | F044-F045 | 1.125rem |
| text / value | Static map scale label | 1 | F046 | 1.125rem |
| text / heading | Custom-legend header/group title | 4 | F047-F048, F187-F188 | 1.125rem; body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / heading | Guide navigation headings: collapsed / expanded | 2 | F049, F079 | 1.125rem !important; 1.3rem !important |
| text / label | Filter attribute headings | 12 | F050, F217-F227 | 1.125rem; fallback: 1rem; h4: 2.125rem; before sx/parent/cascade |
| text / body | Filter loading / empty messages | 10 | F051, F203-F211 | 1.125rem; fallback: 1rem; body2: 0.875rem; before sx/parent/cascade |
| text / heading | Filter layer section name | 2 | F052, F216 | 1.125rem; fallback: 1rem; h3: 3rem; before sx/parent/cascade |
| icon / named SvgIcon size | Mosaic-rule section leading and expanded/collapsed chevrons | 3 | F053-F055 | SvgIcon small: 1.25rem before parent selectors |
| icon / named SvgIcon size | Raster-function section leading and expanded/collapsed chevrons | 3 | F056-F058 | SvgIcon small: 1.25rem before parent selectors |
| icon / named SvgIcon size | WMS-style section leading and expanded/collapsed chevrons | 3 | F059-F061 | SvgIcon small: 1.25rem before parent selectors |
| icon / named SvgIcon size | Measurement line/area/clear controls | 3 | F062-F064 | SvgIcon small: 1.25rem before parent selectors |
| icon / named SvgIcon size | NavBar panel close icon | 1 | F065 | SvgIcon small: 1.25rem before parent selectors |
| icon / named SvgIcon size | Custom-legend description expanded/collapsed arrows | 2 | F066-F067 | SvgIcon small: 1.25rem before parent selectors |
| icon / by font-size | Custom-legend group visibility icons | 1 | F068 | 1.25rem |
| text / title | Fullscreen dialog title | 1 | F069 | 1.3rem |
| text / title | Layer-list primary name / layout selected-layer title | 4 | F070-F071, F131, F134 | 1.3rem; body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / heading | Data-table instruction heading | 1 | F072 | 1.3rem |
| text / heading | Guide h2 content headings | 1 | F073 | 1.3rem |
| text / title | Layer-details category title | 2 | F074, F158 | 1.3rem; body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / heading | Legend empty-state instruction heading | 3 | F075, F173, F215 | 1.3rem; body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade; h3: 3rem; before sx/parent/cascade |
| icon / by font-size | Coordinate-format / scale-format checkmarks | 2 | F076-F077 | 1.3rem |
| text / title | Time-slider panel title | 2 | F078, F192 | 1.3rem; body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / title | Filter panel title | 1 | F080 | 1.3rem; fallback: 1.125rem |
| text / title | About panel title | 2 | F081, F214 | 1.6rem; h3: 3rem; before sx/parent/cascade |
| text / heading | Guide h1 content headings | 1 | F082 | 1.6rem |
| text / body | Add-layer drop-zone prompt | 1 | F084 | 1.6rem |
| text / other | Theme custom control definition; no in-scope consumer found | 1 | F085 | 11px |
| text / caption | Drawer measurement tooltip | 1 | F086 | 12px |
| text / label | ListItemText wrapper default primary text | 1 | F087 | 14px |
| text / caption | Custom-legend sublayer count | 2 | F088, F212 | 14px; caption: 0.75rem; before sx/parent/cascade |
| text / title | Drawer colour-picker injected header | 1 | F089 | 14px |
| icon / by font-size | Drawer colour-picker injected close glyph (not SvgIcon) | 1 | F090 | 16px |
| text / title | Version panel heading | 2 | F091, F127 | 1rem; body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / label | Layer-list primary text selectors | 4 | F092-F093, F102, F116 | 1rem; 1rem !important |
| text / body | Feature-info container text | 1 | F094 | 1rem |
| text / label | Export-option label | 1 | F095 | 1rem |
| text / title | Footer resize-dialog title | 2 | F096, F151 | 1rem; body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / control | Geolocator search input | 1 | F098 | 1rem |
| text / heading | Guide h4 content headings | 1 | F099 | 1rem |
| text / body | Hover feature-tooltip content | 2 | F100-F101 | 1rem |
| text / label | Layer-details table action label | 1 | F103 | 1rem |
| text / heading | Shared layer-info section-heading style: service/filter/time/swiper/interactions | 7 | F104, F161-F164, F166-F167 | 1rem; body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / heading | Layer-settings section headings | 4 | F105, F168, F170, F172 | 1rem; body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / body | Legend empty-state instruction text | 3 | F106, F174, F177 | 1rem; body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / value | Mouse-position coordinates and selectable format text | 2 | F107-F108 | 1rem |
| text / title | Notifications panel title | 2 | F109, F179 | 1rem; body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / value | Interactive map scale label | 1 | F110 | 1rem |
| text / title | Reusable panel header title | 1 | F111 | 1rem |
| text / label | Select field label | 1 | F112 | 1rem |
| text / other | Theme subtitle1 and button size definitions; consumer role varies | 2 | F113-F114 | 1rem |
| text / label | Switch control label | 1 | F115 | 1rem |
| text / title | NavBar popover title and title-label helpers | 2 | F117-F118 | 1rem; external-theme fallback: typography.fontSize (MUI default 14px) |
| text / control | Footer tab label | 1 | F119 | 1rem; external-theme fallback: typography.fontSize (MUI default 14px) |
| icon / by font-size | Details clear-highlight control icon | 1 | F120 | 24px |
| text / heading | Caller-sized custom-legend header | 1 | F121 | caller-configured px; value unknown |
| text / other | Legend nested title div inherits parent size | 1 | F122 | inherit |
| text / control | Dropdown button label | 1 | F123 | typography.fontSize; MUI default 14px, external theme may differ |
| text / control | AOI card button inherited font shorthand | 1 | F124 | inherit (all font shorthand fields) |
| text / body | About load/error status | 2 | F125-F126 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / value | Version number and timestamp | 2 | F128-F129 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / caption | Attribution text | 1 | F130 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / heading | Available/hidden layer section heading Typography sites | 2 | F132-F133 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / body | Keyboard crosshair instructions | 1 | F137 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / heading | Coordinate-format subsection labels | 6 | F138, F141, F229-F232 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade; subtitle1: 1rem; before sx/parent/cascade |
| text / value | Coordinates, map-sheet lines and elevation | 9 | F139-F140, F142-F148 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / value | Feature-detail modal name-field value | 1 | F149 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / caption | Feature not-symbolized note | 1 | F150 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / value | Geolocator result name/category Typography sites | 2 | F152-F153 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / title | Geolocator accessible panel heading (visually hidden) | 1 | F157 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / label | Opacity control label | 1 | F165 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / label | Raster/WMS option-card names | 2 | F169, F171 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / label | Legend layer-name accessible label | 1 | F176 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / body | Measurement accessible live status | 1 | F178 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / body | Notification empty-state message | 1 | F180 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / body | Map loading/processing accessible announcements | 4 | F181-F184 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / other | Typography wrapper forwarding; caller determines consumer and role | 1 | F185 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / body | Filter configuration/controller errors | 2 | F189-F190 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / body | GeoChart loading status | 1 | F191 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / body | Time-slider accessible live status | 1 | F193 | body1 default: 1rem; caller/spread/cascade unresolved; before sx/parent/cascade |
| text / body | About panel description | 1 | F195 | body1: 1rem; before sx/parent/cascade |
| text / heading | Feature header name | 1 | F196 | body1: 1rem; before sx/parent/cascade |
| text / body | Raster-function option description | 1 | F198 | body2: 0.875rem; before sx/parent/cascade |
| text / value | Map rotation status label | 1 | F201 | body2: 0.875rem; before sx/parent/cascade |
| text / label | Checkbox-list option label | 1 | F202 | body2: 0.875rem; before sx/parent/cascade |
| text / caption | Layer-list status text | 1 | F228 | subtitle1: 1rem; before sx/parent/cascade |
| text / label | Drawer text/font/colour/size/halo/format/fill/icon/stroke setting labels | 11 | F233-F243 | subtitle2: 0.7rem; before sx/parent/cascade |

</details>

#### Context rows (separate disposition)

Context rows still participate in the role table above; they are counted only
once in reconciliation, not again as rule rows.

| F-IDs | Count | Why context; DECIDED treatment |
|---|---:|---|
| F125-F194 | 70 | Implicit/default Typography candidates, including the forwarding wrapper F185. Default `body1` is not proof of effective 1rem: `sx`, selectors, `component`, props and inherited styles must be preserved. No new size is needed. |
| F195-F243 | 49 | Explicit existing variants. Preserve variant/semantic-element/caller overrides; h3/h4 and other local overrides are detailed below. Already using variants is not migration work. |
| F006, F031, F113, F114 | 4 | Existing generator subtitle2/overline/subtitle1/button definitions consume xs/sm/default/default. Do not redesign the scale or variants. |
| F121 | 1 | Custom-legend header `${item.fontSize}px` is caller-configured; no fixed value or root-scaling contract can be inferred. |
| F122 | 1 | Nested legend title `fontSize: 'inherit'` deliberately follows its parent. |
| F123 | 1 | Dropdown reads standard `theme.typography.fontSize`, not a GeoView extension. Preserve host base-size customization. |
| F124 | 1 | AOI button `font: 'inherit'` is a shorthand inheritance contract, not a literal size. |
| **Total** | **127** | No source-changing ledger units for context. |

### 2. End state (DECIDED — Decided 2026-10-29)

The [plan](./THEME_AUDIT_PLAN.md#approach-and-order) says: every non-held text
size reads a typography variant or `geoViewFontSize`; icons follow a decided
icon rule; remaining exceptions are recorded in HELD with a reason.

**DECIDED clarification — Decided 2026-10-29:** already inherited,
caller-configured and standard MUI base-size context may remain unchanged
without forcing an explicit variant or GeoView lookup. Treat a local override
as authoritative over its variant, not as evidence to delete either. Reason:
the 127 context rows include legitimate inheritance/semantic/caller contracts;
turning those into explicit sizes would be a redesign. Numeric equality alone
does not establish typography role or permit px-to-rem conversion.

No new sizes, multiplier keys, scale changes, provider restructuring or CSS
variables are proposed. This gate does not reopen colour D6, focus geometry,
reduced-motion work or the individual Shadows treatments.

### 3. Cross-concern fallback rule (DECIDED A, 2026-10-29)

**User answer: A.** Preserve existing literals/base-size fallbacks. For
missing-role cases with no current literal, preserve today's rendered result
on a plain MUI theme and **hold them**: add no fallback to existing
`geoViewFontSize` reads that have none, and none to shadow templates that
serialize `undefined`. Invalid external-theme CSS is a known pre-existing
issue, not permission to repair it during normalization.

**DECIDED dependent directions, for later scoped source changes:**

- **T25:** `theme.transitions.duration.tooltipDelay ?? 1000`.
- **T45 correction, 2026-10-29:** retain `theme.transitions.duration.splash`
  under R1. On plain MUI themes it is undefined, so Fade uses MUI's default
  exit timing. Adding `?? 1500` would change that timing and is a missing-role
  repair prohibited by fallback A. The former X-B unit is withdrawn.
- **T29:** retain literal **200**, held under H6; no dedicated token is approved.
- Preserve trailing caller-prop precedence and the three explicit 1000ms
  tooltip consumers. Neither functional requests nor the four GeoView themes'
  current values may change.
- FR1's approved aliases use their exact former literals as fallbacks.
  **Decided 2026-10-29**; no further fallback or alias approval is outstanding.
- FR3 preserves all nine existing fallback branches; no normalization of the
  four unequal rem branches is approved.

No source changes follow from this documentation answer. T45's historical R1
retention and H6's historical inventory above remain unchanged; the directions
here are follow-up decisions, not claims that migration has happened.
The [known-issue entry](./WHATS_LEFT.md#1-decisions-that-need-a-person-not-a-prompt)
records the missing-font/invalid-shadow holds.

The policy concerns
reusable UI receiving plain MUI themes and the viewer/plugin paths that share
its helpers; it must not replace a viewer's own theme with a global theme.
Existing optional extensions explicitly support external consumers in
[material-ui.d.ts:38](../../packages/geoview-core/src/core/types/material-ui.d.ts#L38).
Missing extension handling and a partially populated extension are separate
cases: optional chaining alone can produce omitted declarations or literal
`undefined` inside templates. Both require an explicit policy.

The alternatives below retain the comparison requested at Gate 2. **A is
selected with the explicit hold constraint above; B/C are not adopted.**

| Option | Contract considered | Trade-off |
|---|---|---|
| **A: GeoView value, otherwise current literal (DECIDED)** | Prefer the current per-viewer extension leaf; preserve an existing site-specific literal/MUI-base fallback. A newly tokenized literal falls back to that exact literal. Existing reads with no fallback stay held with their current plain-MUI rendering; do not add one. | Preserves current output, including unequal rem branches and pre-existing missing/invalid declarations; does not silently repair colour/focus roles. |
| **B: GeoView value, otherwise MUI-standard equivalent** | Prefer the extension leaf; use a standard MUI field only when its consumer/role is established. Existence of a numerically similar variant is insufficient. Unsupported roles remain held, not silently mapped to a nearby size/colour/duration. | Responds to host typography/palette customization, but can change plain-MUI rendering and cannot express every GeoView role or interaction delay. |
| **C: keep extension reads; require a GeoView theme** | Retain reads and document a GeoView-theme requirement for affected reusable UI. Existing explicit fallbacks remain unless separately removed. No provider changes are included. | Conflicts with the current external-theme contract; requires an explicit compatibility decision. Documentation alone neither fixes `undefined` CSS nor makes unsupported plain-MUI use safe. |

#### Existing nine font fallbacks

All nine are occurrence rows, not nine distinct consumers. At a default plain
MUI theme, `typography.fontSize` is numeric **14**, hence **14px**, not 1rem.
The values below use root **16px / 20px**; GeoView values are the same in all
four display themes. A host may customize its MUI typography.

| F-IDs / count | Current GeoView result | Current absent-extension fallback | Option A | Option B | Option C |
|---|---|---|---|---|---|
| F035-F036 / 2 repeated | sm: 14 / 17.5px | 0.875rem: 14 / 17.5px | Preserve exactly; no collapse/removal of fallback proposed. | A role-matched MUI caption/body field must be chosen: caption is normally 0.75rem (12 / 15px), body2 0.875rem (14 / 17.5px). Matching 14 is not a role decision. | Preserve reads/fallbacks, require supported theme; plain-MUI current fallback still happens to work here. |
| F050-F052 / 3 unequal | md: 18 / 22.5px | 1rem: 16 / 20px | Preserve the unequal fallback; do not silently make it 1.125rem. | Attribute label, loading message and layer heading need individual role choices; body1's usual 1rem is not automatically suitable for all three. | Existing plain-MUI fallback remains 1rem, but unsupported-theme policy changes. |
| F080 / 1 unequal | lg: 20.8 / 26px | 1.125rem: 18 / 22.5px | Preserve 1.125rem. | No exact default MUI typography size of 1.125rem; title role does not select h6 automatically (normally 1.25rem). Hold mapping pending answer. | Preserve existing fallback; unsupported-theme policy changes. |
| F117-F119 / 3 MUI base-size | default: 16 / 20px | `typography.fontSize`: default 14 / 14px; host-controlled | Preserve MUI-base fallback; do not replace it with a new literal. | Already a standard MUI fallback. Keeping base size preserves behavior; switching to a rem variant would change plain-MUI text scaling. | Keep current fallback, including host customizations; do not remove it under the guise of documenting a requirement. |

Thus **4 unequal rem + 3 MUI base-size + 2 repeated = 9**.

#### Effect on every parked category

| Pending category | Option A effect | Option B effect | Option C effect |
|---|---|---|---|
| Font reads without fallback: **77 component/helper rows**, plus **4 generator definitions** with required local scale input | **DECIDED:** hold the 77 component rows under FH8 with no new fallback; preserve plain-MUI omission/invalid-template behavior. Generator definitions already have local input and remain context, not missing-role repairs. | Choose roles per consumer, not key-to-variant aliases. Missing exact equivalents remain held. In particular custom sm/md/lg/xl are not globally interchangeable with MUI variants. | No code repair; missing extension remains unsupported and may omit styling or serialize `undefined`. Existing UI callers would need contract review outside this gate. |
| `geoViewColor` reads | Preserve existing literal/default-object fallbacks. Missing-role cases without a current literal remain held; no blanket `defaultGeoViewColors` import or new role choice is authorized. | Existing standard roles can be used only where COLOUR_DECISIONS establishes that role. Do not equate ramps, custom surface roles or focus colours with arbitrary MUI palette fields. | Leaves extension absence/partial absence unsupported; no repair of omitted/invalid CSS. Changes the documented external-UI contract, not the four GeoView palettes. |
| `.bordered` S08, `.bordered-primary` S11, `rightPanelStatus` S10 | **DECIDED:** preserve current invalid templates when the extension leaf is absent; add no fallback. Record the known issue in WHATS_LEFT and keep each individual SH2 treatment held. | Map the individual colour roles only after approval; MUI `shadows[n]` is not a colour-equivalent repair. Plain-MUI output changes from invalid to valid, so not an alias. | Leaves invalid external-theme shadow templates; merely calling them unsupported does not fix them. |
| Focus-helper assumptions SR3, notably S30/S32/S37, when `focusVisible` is absent | Preserve existing helper fallbacks; missing-role cases remain held with current rendering. No new local colour or focus contract is authorized. | Standard palette fields do not by themselves define D6's outline/halo geometry or contrast contract. Hold mapping until focus policy is explicit. | Does not repair absent `focusVisible`; unsupported-theme/API impact must be accepted. |
| T45 `duration.splash` | **DECIDED retained R1, corrected 2026-10-29:** plain MUI themes get MUI's default Fade exit timing; a fallback would change it. No fallback or source unit. GeoView retains splash 1500ms. | MUI has no splash role; using another duration changes timing. | Existing plain-theme behavior is preserved, not repaired. |
| T25 tooltip initial delay; `tooltipDelay` exists in GeoView | **DECIDED follow-up:** `tooltipDelay ?? 1000`, preserving caller overrides and current **1000ms** request. | MUI has no global interaction-delay scale, but `components.MuiTooltip.defaultProps.enterDelay` expresses this component default. It is not configured here today; MUI's built-in 100ms is not a compatible substitute. Supporting an unconfigured plain theme at 1000ms still needs a literal exception/hybrid policy. | Theme-only migration would require configured defaults/GeoView context; plain-MUI support is lost unless the current literal remains. H6 does not automatically end. |
| T29 tooltip next delay; no dedicated GeoView value exists | **DECIDED:** retain literal **200**, held H6; no new token or MUI-default migration now. | `components.MuiTooltip.defaultProps.enterNextDelay` expresses the role without a new custom token. It is not configured today; MUI's built-in 0ms is not 200ms. An unconfigured external theme still needs a 200ms exception/hybrid. `shorter` is not an alias. | A required GeoView theme does not create a dedicated value or resolve precedence. Keep current 200ms until authorized. |

Counts are **90 existing GeoView font-size reads = 86 palette reads + 4
generator reads**; the palette reads comprise **77 without fallback + 9 with
fallback**. Reusable `ui/`'s five existing no-fallback palette rows are F029,
F030, F111, F112, F115; template consumers elsewhere also need attention.
The table does not authorize an 81-row optional-token cleanup: the plan excludes
that sweep, and the user explicitly holds the existing missing-fallback cases.

**T29 token test (future question; current literal hold DECIDED):** next-tooltip interaction delay is a real
purpose, unlike an animation-duration alias, but that alone does **not** justify
a custom token: MUI already expresses a Tooltip-only policy through
`components.MuiTooltip.defaultProps.enterNextDelay`. The current
[MuiTooltip configuration](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L399)
sets portal slot props, not either delay. Installed Tooltip resolves
`useDefaultProps` before its 100/0ms defaults, while
[TooltipUI](../../packages/geoview-core/src/ui/tooltip/tooltip.tsx#L38) explicitly
supplies 1000/200ms, so adding theme defaults alone would not change the wrapper's
requests. A custom shared interaction-delay token would need evidence of a
broader consumer/policy MUI's component defaults cannot express; that intent
is currently unknown. Compare retaining the literal, MUI component defaults
with explicit missing-value fallback, or a separately justified shared token.
No field name, location, creation or precedence change is approved here.
T29's 200ms request, T25's 1000ms request and trailing caller-prop precedence
must remain unchanged. Sharing `shorter` because it equals 200 remains rejected.

### 4. Findings that constrain rules

#### Units, roots and nominal values

For comparison, **125% text scaling here means root 16px -> 20px**, at fixed
viewport and 100% page zoom. It is not a claim that every browser's text-only
zoom has the same implementation. Page zoom can enlarge both px and rem;
changing root/default text size enlarges rem but leaves a fixed CSS-px
declaration unchanged. Therefore px-to-rem is a behavior change even when
values coincide at root 16. These are source-derived nominal values, not new
runtime captures or a promise that more-specific selectors cannot override them.

| Existing size | Root 16px | Root 20px |
|---|---:|---:|
| xs / 0.7rem | 11.2px | 14px |
| sm / 0.875rem | 14px | 17.5px |
| md / 1.125rem | 18px | 22.5px |
| lg / 1.3rem | 20.8px | 26px |
| xl / 1.6rem | 25.6px | 32px |
| xxl / 2rem (definition; no inventoried consumer) | 32px | 40px |
| default / 1rem | 16px | 20px |
| 0.75rem (F001) | 12px | 15px |
| 0.8rem (F037-F038) | 12.8px | 16px |
| 0.9rem (F039) | 14.4px | 18px |
| 1.25rem (F068) | 20px | 25px |

Named scale definitions:
[default.ts:125](../../packages/geoview-core/src/ui/style/default.ts#L125).
MUI variant definitions:
[themeOptionsGenerator.ts:308](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L308).
MUI typography uses rem, `htmlFontSize` calibration and a base `fontSize` of
14; `pxToRem` also responds to theme typography configuration. See
[MUI typography](https://mui.com/material-ui/customization/typography/).
Do not invoke `pxToRem` as proof that a conversion preserves external themes.

**Every numeric/px row, including numeric fallback branches:**

| F-IDs | Source declaration / consumer | Current px at roots 16 / 20 | If represented by the same nominal rem at root 16 | Finding |
|---|---|---|---|---|
| F085 | numeric 11, generator custom control | 11 / 11 | 0.6875rem -> 11 / 13.75 | No matching named GeoView key; no observed consumer; not an alias. |
| F086 | 12px, drawer measurement tooltip CSS | 12 / 12 | 0.75rem -> 12 / 15 | Static CSS; root-responsive change, not alias. |
| F087 | numeric 14, ListItemText primary slot | 14 / 14 | sm = 0.875rem -> 14 / 17.5 | Caller slot props override the default. Changing units is behavior change. |
| F088 | 14px, custom-legend sublayer count | 14 / 14 | sm -> 14 / 17.5 | Local size overrides caption variant; behavior change. |
| F089 | 14px, drawer injected colour-picker header | 14 / 14 | sm -> 14 / 17.5 | Portal owner problem remains separate; behavior change. |
| F090 | 16px, drawer injected close glyph | 16 / 16 | default -> 16 / 20 | Native text glyph, not SvgIcon; behavior change. |
| F117-F119 | fallback to numeric MUI `typography.fontSize` | Default plain MUI 14 / 14; GeoView branch 16 / 20 | Replacing fallback by 0.875rem gives 14 / 17.5; default 1rem gives 16 / 20 | Host base size may differ; neither variant substitution is an unconditional alias. |
| F120 | numeric 24, details clear-highlight icon | 24 / 24 | 1.5rem / named medium -> 24 / 30 | No matching named GeoView key; named SvgIcon medium changes root scaling. |
| F121 | `${item.fontSize}px`, caller-configured legend header | v / v, unknown v | v/16 rem -> v / 1.25v | No fixed value is knowable; preserve caller contract. |
| F123 | MUI `typography.fontSize`, dropdown | Default MUI 14 / 14, host-dependent | Depends on chosen conversion and host htmlFontSize/fontSize | Standard MUI context, not a literal-to-token candidate. |

Numbers passed as a fontSize style/slot value are CSS pixels, not `sx` spacing
multipliers. No px-to-rem conversion is proposed for approval by implication.

#### Cascade: explicit h3/h4 rows

All **14** explicit h3/h4 rows have a local `sx` font-size override. The
generator's h1-h5 heading object sets family/weight, **not size**. The default
MUI h3 3rem (48 / 60px) and h4 2.125rem (34 / 42.5px) in discovery are
pre-cascade candidates, not the rendered sizes in these consumers.

| F-IDs / count | Current HEAD evidence | Effective authored size, roots 16 / 20 |
|---|---|---|
| F214 / 1 | About h3 [about-panel.tsx:166](../../packages/geoview-about-panel/src/about-panel.tsx#L166), `title` sx [about-panel-style.ts:64](../../packages/geoview-about-panel/src/about-panel-style.ts#L64) | xl: 25.6 / 32px |
| F215 / 1 | Legend empty-state h3 [legend.tsx:146](../../packages/geoview-core/src/core/components/legend/legend.tsx#L146), `legendInstructionsTitle` [legend-styles.ts:157](../../packages/geoview-core/src/core/components/legend/legend-styles.ts#L157) | lg: 20.8 / 26px |
| F216 / 1 | Filter layer heading h3 [layer-filter-section.tsx:278](../../packages/geoview-filter-panel/src/components/layer-filter-section.tsx#L278), [filter-panel-style.ts:105](../../packages/geoview-filter-panel/src/components/filter-panel-style.ts#L105) | md: 18 / 22.5px; absent-extension fallback 16 / 20px |
| F217-F227 / 11 | Date F217-F219, Multiselect F220-F222, Range F223-F225, Select F226-F227 all use `filterLabel`; first branch [date-filter.tsx:213](../../packages/geoview-filter-panel/src/components/controls/date-filter.tsx#L213), last [select-filter.tsx:110](../../packages/geoview-filter-panel/src/components/controls/select-filter.tsx#L110); shared [control-styles.ts:24](../../packages/geoview-filter-panel/src/components/controls/control-styles.ts#L24) | md: 18 / 22.5px; absent-extension fallback 16 / 20px |

The Guide's h1/h2/h3/h4 *parent selectors* also size injected guide content
through xl/lg/md/default; they do not justify mapping every h3 variant to md.
Do not remove semantic headings, local overrides or `!important` while aliasing.

#### Generated keys and custom control

The loop in [default.ts:135](../../packages/geoview-core/src/ui/style/default.ts#L135)
creates **99 multiplier entries**, from `0.2x` to `9.99999999999998x`, including
`0.30000000000000004x`; not all 99 spellings contain an artifact.
No in-scope source consumer of these generated entries was found: discovery
has no such row, and searches for bracket/dynamic scale access and multiplier
key reads found none. This is not a guarantee about external API consumers.
**DECIDED hold — Decided 2026-10-29:** preserve the exported generated keys.
Renaming the floating-point keys requires a separate API decision, recorded
in WHATS_LEFT; no removal, rounding or regeneration change is authorized here.

F085 defines `typography.control.fontSize: 11` with weight 500 at
[themeOptionsGenerator.ts:340](../../packages/geoview-core/src/ui/style/themeOptionsGenerator.ts#L340);
the augmentation declares it at
[material-ui.d.ts:118](../../packages/geoview-core/src/core/types/material-ui.d.ts#L118).
No in-scope `typography.control`/`variant="control"` consumer was found.
It is a definition, not evidence that every control should be 11px.
External consumers are unknown; neither removing it nor assigning existing
controls to it is proposed.

#### Static CSS and drawer cssText: actual theme access

F086's measurement tooltip is plain
[measurement-styles.css:10](../../packages/geoview-drawer/src/measurement-styles.css#L10):
it has no theme object. F089/F090's native header/close button `cssText` at
[style.tsx:290](../../packages/geoview-drawer/src/buttons/style.tsx#L290) and
[style.tsx:302](../../packages/geoview-drawer/src/buttons/style.tsx#L302)
does not read a theme. **The enclosing React component does already call
`useTheme()` at line 102.** It would be inaccurate to say that this file has no
theme access. Its global query can reach colour-picker portals outside any
map subtree, so the owning map cannot safely be inferred from that theme
variable. A theme read exists; correct per-portal ownership is not established.
These sites are DECIDED holds (Decided 2026-10-29); no CSS variables, DOM refactor or provider
change is authorized.

#### Icons: all 26 rows

Installed MUI SvgIcon implements small/medium/large with `pxToRem(20/24/35)`,
nominally 1.25/1.5/2.1875rem under default calibration; inherit is also allowed.
Parent Button/startIcon selectors, local sx and theme overrides can win the
cascade, so these nominal values are not a computed-style substitute. See
[MUI SvgIcon](https://mui.com/material-ui/api/svg-icon/).

| F-IDs | Consumer | Authored size | Does a named SvgIcon size express it? |
|---|---|---|---|
| F010 | Responsive layout close-button icon | 0.875rem | No exact small/medium/large match; held unchanged under the decided icon rule. |
| F017-F018 | Guide search navigation/clear icons | 0.875rem | No exact small/medium/large match; held unchanged under the decided icon rule. |
| F019, F083 | Add-layer button responsive icon: labelled / icon-only breakpoint | 0.875rem; 1.6rem | No exact small/medium/large match; held unchanged under the decided icon rule. |
| F042 | Geolocator clear-filters icon | 1.125rem | No exact small/medium/large match; held unchanged under the decided icon rule. |
| F053-F055 | Mosaic-rule section leading and expanded/collapsed chevrons | SvgIcon small: 1.25rem before parent selectors | Yes: already small; retain (20px / 25px at 16px / 20px roots, before parent overrides). |
| F056-F058 | Raster-function section leading and expanded/collapsed chevrons | SvgIcon small: 1.25rem before parent selectors | Yes: already small; retain (20px / 25px at 16px / 20px roots, before parent overrides). |
| F059-F061 | WMS-style section leading and expanded/collapsed chevrons | SvgIcon small: 1.25rem before parent selectors | Yes: already small; retain (20px / 25px at 16px / 20px roots, before parent overrides). |
| F062-F064 | Measurement line/area/clear controls | SvgIcon small: 1.25rem before parent selectors | Yes: already small; retain (20px / 25px at 16px / 20px roots, before parent overrides). |
| F065 | NavBar panel close icon | SvgIcon small: 1.25rem before parent selectors | Yes: already small; retain (20px / 25px at 16px / 20px roots, before parent overrides). |
| F066-F067 | Custom-legend description expanded/collapsed arrows | SvgIcon small: 1.25rem before parent selectors | Yes: already small; retain (20px / 25px at 16px / 20px roots, before parent overrides). |
| F068 | Custom-legend group visibility icons | 1.25rem | Small matches nominal default MUI geometry, but selector/consumer cascade equivalence is not established. Held pending exact-match proof; no additional migration unit is approved. |
| F076-F077 | Coordinate-format / scale-format checkmarks | 1.3rem | No exact small/medium/large match; held unchanged under the decided icon rule. |
| F090 | Drawer colour-picker injected close glyph (not SvgIcon) | 16px | No: native button text glyph, not SvgIcon; replacing it is component/geometry work. |
| F120 | Details clear-highlight control icon | 24px | Medium matches 24px at root 16 only; at root 20 it becomes 30px, unlike the authored 24px. Behaviour change, not alias. |

This is **15 named small + 11 font-size = 26**; the latter includes the native
F090 glyph, which is not an SvgIcon. There are zero additional "other" icon
sizing mechanisms. The eight token-sized SvgIcon rows are F010, F017-F019,
F042, F076-F077, F083. F019/F083 are a responsive pair and must remain coupled.
F068's parent selector affects visibility icons in
[group-item.tsx](../../packages/geoview-custom-legend/src/components/group-item.tsx),
not the description arrows already sized small in F066-F067.

### 5. Fonts rules (DECIDED — Decided 2026-10-29)

FR1, FR3 and FR4 make up the rule side of reconciliation. FR2 records the
decided hold constraint and assigns its rows only to FH8, not twice.
The unadopted fallback options in section 3 are not extra assigned F-rows.
The value table in section 4 supplies roots 16/20 for **each** scale key;
the role table supplies each row's key/value. "Alias" below means a
declaration-preserving substitution under the stated theme contract, not a
runtime certification. Gate 3 must still capture computed styles.

#### FR1 DECIDED — Decided 2026-10-29: exact literal aliases

**F005, F032, F048: 3 rows.**

| F-ID | DECIDED substitution | Root 16 / 20 | Alias or change | External themes / ledger |
|---|---|---|---|---|
| F005 | Slider value label `'0.7rem'` -> `theme.palette.geoViewFontSize?.xs ?? '0.7rem'` | 11.2 / 14px | Exact alias in the four unchanged GeoView themes; existing scales are already the font-size mechanism for this consumer family. | Decided A supplies the exact .7rem fallback; no external geometry change. Unit F-A. |
| F032 | Custom-legend description `'0.875rem'` -> `theme.palette.geoViewFontSize?.sm ?? '0.875rem'` | 14 / 17.5px | Exact alias under current GeoView scale; no variant/semantic-role change. | Decided A supplies the exact .875rem fallback; no external geometry change. Unit F-B. |
| F048 | Custom-legend group title `'1.125rem'` -> `theme.palette.geoViewFontSize?.md ?? '1.125rem'` | 18 / 22.5px | Exact alias under current GeoView scale; do not change heading level. | Decided A supplies the exact 1.125rem fallback; no external geometry change. Unit F-B. |

F032/F048 share a file, not a coupled size relationship. Decided A settles
fallbacks for these **new** reads, not permission to rewrite any pre-existing
optional read. All three aliases are approved; migration status is recorded
per unit below. No functional timers are involved.

#### FR2 DECIDED — Decided 2026-10-29: hold existing no-fallback palette reads

**77 rows:** F002-F004, F007-F030, F033-F034, F040-F047, F049,
F069-F079, F081-F084, F091-F112, F115-F116.

Assign these **69 text + 8 icon** rows to **FH8**, not the rule subtotal.
Preserve each current key, selector, important suffix and text/icon consumer.
No new fallback is permitted. Current GeoView values stay as in section 4;
plain-MUI output stays as today, including omitted/invalid declarations.
No global remapping to MUI variants or optional-token sweep is authorized.
No source-changing ledger unit. The exact-match-only icon rule likewise holds
the eight unmatched token-sized icons without altering their geometries.

#### FR3 DECIDED — Decided 2026-10-29: retain all existing fallback branches under A

**F035-F036, F050-F052, F080, F117-F119: 9 rows.**

Preserve their operators, extension keys, literal/MUI-base fallbacks and
current root-dependent outputs in the nine-fallback table under decided A.
**Exact retention, zero behavior change.** No fallback answer is outstanding
and no unequal branch may be silently changed. F035/F036 repeat a fallback but
have different consumers; no extraction is proposed. F117/F118 are title helpers, F119 a tab label:
matching default-size expressions are not a redesign coupling.
No source-changing ledger unit.

#### FR4 DECIDED — Decided 2026-10-29: exact-match-only named icon sizes

**F053-F067: 15 rows.** Retain `fontSize="small"` at all 15 SvgIcon
consumers. Exact retention: nominal 20 / 25px under MUI's default calibration,
subject to existing parent overrides. All options A/B/C retain the MUI-standard
SvgIcon path; no GeoView-only field is introduced. No ledger unit.

**DECIDED icon boundary — Decided 2026-10-29:** use a named SvgIcon size only
where it matches exactly, including root scaling and the actual cascade.
Do not snap to the nearest size. Preserve the eight token-sized icons in FH8;
hold F068 pending cascade proof, F120 because medium changes root scaling,
and the native F090 glyph. No additional icon migration unit is approved.
This is not a new size scale.

#### Couplings and non-couplings

- F019/F083: responsive labelled/icon-only add-button geometry stays together;
  neither side is changed by the approved alias units.
- F037/F038: root and important tree-label override must stay together if a
  future approved rule changes their units; both are held now.
- F068: parent `.MuiSvgIcon-root` selector and **all** group visibility-icon
  consumers must move together if choosing small props. Inspect parent button
  specificity before claiming an alias.
- F088/F212 and F048/F187: local style and Typography consumer must be verified
  together; the latter consumer is context, not a second migrated declaration.
- F050/F217-F227 and F052/F216: local override wins over the explicit variant.
  Do not remove that override to "normalize" the same number twice.
- F089/F090: shared global portal ownership must be resolved together, even
  though header text and close glyph do not share a typography role.

### 6. Fonts holds (not yet added to HELD.md)

**DECIDED — Decided 2026-10-29.** **89 rows** remain outside the counted rules
and context: **12** under FH1-FH7, plus **77** missing-fallback holds under FH8.
Every hold in this table is DECIDED.
The table records a reason and exit condition without inventing intent.

| Hold / status | F-IDs / count | Consumer / current value | Reason and end condition |
|---|---|---|---|
| FH1 | F001 / 1 | Description disclosure button, .75rem (12 / 15px) | No scale key; snapping would be a redesign. MUI caption's numeric match does not establish a control role. End: a separately approved typography redesign, not this normalization. |
| FH2 | F037-F038 / 2 | Add-layer tree root/label, .8rem (12.8 / 16px) | No scale key; snapping would be a redesign. Preserve coupled root/important selector. End: a separately approved typography redesign. |
| FH3 | F039 / 1 | GeoChart text-button group, .9rem (14.4 / 18px) | No scale key; snapping would be a redesign; intended reason remains unknown. End: a separately approved typography redesign. |
| FH4 | F068, F120 / 2 | Visibility icons 1.25rem; clear-highlight icon 24px | F068's nominal small match lacks cascade/consumer proof. F120 medium changes 24px to 30px at root 20, so px-to-rem is held. End: exact-match proof and explicit bounded unit for F068; separate accessibility/unit-conversion decision for F120. |
| FH5 | F085 / 1 | Custom control definition, fixed 11px | No observed in-scope consumer; no matching named key; external use unknown. End: owner confirms API/consumer intent. No removal or reassignment now. |
| FH6 | F086, F089-F090 / 3 | Drawer CSS 12px; injected header 14px / glyph 16px | Hold static-CSS and cssText sites unchanged. No theme in stylesheet; native portal ownership is unresolved despite enclosing hook. All rem conversions are held. End: separate accessibility/unit-conversion decision and portal-ownership resolution before a theme-based migration. |
| FH7 | F087-F088 / 2 | Primary list text and legend count, fixed 14px | sm matches at root 16 only; 17.5px at root 20 would change behavior. End: explicit per-consumer px/rem choice, preserving caller slot precedence and caption override. |
| FH8 **DECIDED** | F002-F004, F007-F030, F033-F034, F040-F047, F049, F069-F079, F081-F084, F091-F112, F115-F116 / 77 | Existing component/helper font reads without fallback; nominal GeoView sizes in section 4 | User chose to preserve today's plain-MUI rendering, including omitted/invalid CSS. Add no fallback. Known issue recorded in WHATS_LEFT. End: a separate explicit decision approves a missing-role repair and its external-theme behavior; not part of this normalization. |
| **Total** | **89** | | All holds DECIDED — Decided 2026-10-29; no new size or token. |

**Generated multiplier keys: DECIDED hold — Decided 2026-10-29.** Preserve all
99 exported entries; renaming floating-point keys is a separate API decision,
recorded in WHATS_LEFT. These definitions are not extra occurrence rows.
All px-to-rem conversions are held, including fixed-px and caller-configured
context; the separate accessibility decision must address browser text settings.

### 7. Ledger units (DECIDED — Decided 2026-10-29)

Only source-changing units are listed. The three Fonts aliases and T25
follow-up were explicitly requested and migrated. Retained rules, context
and holds have no units.
No generator/theme unit is approved. F032/F048 share one file unit: four
source-changing rows in three ledger units. T45 remains retained under R1.

| Order | DECIDED unit | File(s) | Rows changed | Required verification |
|---:|---|---|---|---|
| 1 | F-A: slider value-label alias — **Migrated 2026-10-29** | [slider-style.ts](../../packages/geoview-core/src/ui/slider/slider-style.ts) | F005 / 1 | `geoViewFontSize?.xs ?? '0.7rem'`; Prettier, ESLint, core TypeScript and build passed. Exact 11.2px before/after in all four themes and plain MUI at root 16. Existing theme parameter; no new context read. |
| 2 | F-B: custom-legend description/group-title aliases — **Migrated 2026-10-29** | [custom-legend-style.ts](../../packages/geoview-custom-legend/src/custom-legend-style.ts) | F032, F048 / 2 | Prettier, ESLint, package TypeScript and build passed after core declaration regeneration cleared all five stale-export errors. Exact 14px / 18px before/after in all four themes and plain MUI at root 16. F001/F068/F088 and caller-configured F121 unchanged. |

**Cross-concern follow-up units: DECIDED and migrated.** These are listed
separately, outside the 243 Fonts rows. T25 updates the final Transitions
totals but does not rewrite the original migration history.

| Unit | File | Rows | Settled change / required checks |
|---|---|---|---|
| X-A: tooltip initial-delay fallback — **Migrated 2026-10-29** | [tooltip.tsx](../../packages/geoview-core/src/ui/tooltip/tooltip.tsx) | T25 only | Approved `tooltipDelay ?? 1000` applied; T29 literal 200 and caller spread preserved. Prettier, ESLint, core TypeScript and build passed. Requests remain 1000ms on all four GeoView themes and plain MUI. Initial geo.ca outlier retained; user-approved reproducibility PASS (four valid repeats within tolerance, hidden fifth excluded). Actual LayerListItem, SingleLayer and LegendListItem render 1000/1000. Actual TooltipUI hooks in geo.ca/dark maps read their own distinct provider theme objects. |

Any other fallback repair, tooltip token or px/rem/icon change requires a later
explicitly counted decision/unit, not an extra file in these units.

### 8. Recorded answers (DECIDED — Decided 2026-10-29)

All Fonts answers are recorded below. A hold is a settled decision to preserve
current code, not an unanswered migration proposal.

| Question | DECIDED answer — Decided 2026-10-29 |
|---|---|
| **Q1: fallback contract — DECIDED A** | Preserve existing literal/base-size fallbacks; preserve and hold missing-role sites without adding any fallback. T25 becomes `tooltipDelay ?? 1000`; T45 stays R1 without a fallback because plain MUI already uses Fade's default exit timing. B/C are not adopted; compatibility is not narrowed. |
| **Q2: T29 — DECIDED current hold** | Keep literal **200** under H6; no new token now. A future MUI component-default or shared-token investigation would need a separate explicit request and cannot use an animation duration. |
| **Q3: F001 .75rem disclosure control** | Hold literal: no scale key; snapping would be a redesign. Preserve 12 / 15px. |
| **Q4: F037-F038 .8rem tree labels** | Hold coupled literals: no scale key; snapping would be a redesign. Preserve 12.8 / 16px. |
| **Q5: F039 .9rem GeoChart buttons** | Hold literal: no scale key; snapping would be a redesign. Preserve 14.4 / 18px; intent remains unknown. |
| **Q6: icon rule and F068 1.25rem** | Use named SvgIcon sizes only for exact matches, including cascade and root scaling; hold the rest. Retain the 15 existing named-small rows. Hold F068 pending cascade proof, with no additional source unit authorized. |
| **Q7: F120 fixed 24px icon** | Hold fixed px: named medium would change root-20 size to 30px. All px-to-rem conversions are held. |
| **Q8: generated multiplier keys** | Hold all generated entries unchanged. Renaming floating-point keys is a separate API decision, recorded in WHATS_LEFT. |
| **Q9: F085 custom control 11px** | Hold unchanged. No observed in-scope consumer establishes a role; external use remains unknown. No deletion, reassignment or unit conversion. |
| **Q10: F086 drawer 12px static CSS** | Hold static-CSS site unchanged; no theme injection, CSS variables or px-to-rem conversion. |
| **Q11: F087 primary list text 14px** | Hold fixed 14px and preserve caller slot overrides. Rem conversion is separate accessibility work. |
| **Q12: F088 legend count 14px** | Hold fixed 14px override; do not expose caption's different size or convert units. |
| **Q13: F089 drawer injected header 14px** | Hold cssText site unchanged; portal ownership remains unresolved. |
| **Q14: F090 drawer close glyph 16px** | Hold native glyph/cssText unchanged; no unit conversion or SvgIcon replacement. |
| **Q15: px-to-rem generally** | Hold every conversion. Preserve nine existing fallback branches under A. Record browser-text-setting limitations and decide accessibility/rem conversion separately. |
| **Q16: end-state clarification and FR1 units** | Approve context/inheritance clarification and all three exact aliases using settled A fallbacks. No size/scale redesign; migrations not executed by this documentation task. |

### 9. Reconciliation and cross-concern unblocking

| Disposition / status | Count | Coverage |
|---|---:|---|
| FR1 migrated exact aliases | 3 | F005, F032, F048 verified and migrated |
| FR3 decided retention of existing fallback branches under A | 9 | F035-F036, F050-F052, F080, F117-F119 |
| FR4 retain named small SvgIcons | 15 | F053-F067 |
| **Rules subtotal** | **27** | 3 approved aliases + 15 named-icon retentions + 9 fallback retentions; all DECIDED. |
| FH1-FH7 decided holds | 12 | Exact disjoint ID sets in section 6 |
| FH8 decided missing-fallback holds | 77 | Exact ID set in FR2/FH8, counted once |
| **Holds subtotal** | **89** | **12 + 77, all DECIDED** |
| Context | 127 | Exact disjoint ID sets in section 1 |
| **Total** | **243** | **27 + 89 + 127 = 243** |

Role counts are independently **217 text + 26 icon = 243**. Context and rule
classifications describe the same rows; they are not extra occurrences.
No row is left unassigned; no new literal/token size is proposed.

#### Migration batch evidence — complete 2026-10-29

The requested final closeout is **applied**: **3 Fonts rows migrated**,
**24 retained rule rows**, **89 held**, **127 context**;
**3 + 24 + 89 + 127 = 243**. Transitions' verified ledger totals are
**22 migrated / 14 retained / 26 held / 10 context**. T25 leaves H6;
HELD keeps T29 only under H6, with its end condition unchanged.

One full before-build preceded every source edit. Session-only harness
`final-runtime.js` rendered production SliderUI, GroupItem/DescriptionText and
TooltipUI with real map controller/store/i18n providers. Named caller-override
fixtures pass the three consumers' 1000/1000 props; they are not claimed to be
the actual LayerListItem/SingleLayer/LegendListItem components.
Page visible, clock resumed, viewport 1600x1200, DPR 1, root 16px.
Plain themes were produced by MUI `createTheme()` with no GeoView font/colour
or tooltip-delay extensions. The same script/selectors were used for each
after-capture. MUI useTheme adds a shallow `vars` wrapper; palette/transitions
object identities remain the supplied provider's exact references.

| Unit / row | geo.ca before -> after | light | dark | canada.ca | Plain MUI | Verdict |
|---|---|---|---|---|---|---|
| F-A / F005 | 11.2px -> 11.2px | 11.2px -> 11.2px | 11.2px -> 11.2px | 11.2px -> 11.2px | 11.2px -> 11.2px | PASS, visible production value label |
| F-B / F032 | 14px -> 14px | 14px -> 14px | 14px -> 14px | 14px -> 14px | 14px -> 14px | PASS, visible production description |
| F-B / F048 | 18px -> 18px | 18px -> 18px | 18px -> 18px | 18px -> 18px | 18px -> 18px | PASS, visible production group title |
| X-A / T25 requested | 1000ms -> 1000ms | 1000ms -> 1000ms | 1000ms -> 1000ms | 1000ms -> 1000ms | 1000ms -> 1000ms | PASS |
| X-A / T25 initial elapsed | 1001ms -> 1104ms | 1001ms -> 1001ms | 1000ms -> 1002ms | 1001ms -> 1001ms | 1001ms -> 1000ms | Original geo.ca FAIL retained; later reproducibility PASS below |

Before/after TooltipUI next-delay props were 200ms; each override fixture retained
1000ms for both props in all five themes. Observed initial timers in the accepted recapture were
1001/1001/1000/1001/1001ms (geo.ca/light/dark/canada.ca/plain). An earlier
unaccepted setup capture included a 1042ms timer while maps were settling;
it is not comparison authority. Baseline probe setup also exposed MUI's shared
tooltip hysteresis: the script waits for mouse-leave handling before unmounting,
so the next theme's capture measures initial, not next-tooltip, timing.
No requested application timer value changed. No new theme context read was
added by F-A or F-B. X-A adds useTheme; the batch initially stopped at its
elapsed-time failure. The failed sample remains intact, not replaced by a
passing retry. Its cause is unestablished, not evidence that the unchanged
1000ms request caused a regression.
The exemption for delay present in both captures does not apply to 1001ms
before versus 1104ms after.
The user subsequently updated the explanatory tooltip comment; this
verification pass changed no production source or configuration.

**Reproducibility decision and result — 2026-10-29.** The user authorized five
additional geo.ca captures after both maps report mapReady and a 2000ms idle
wait before each run. Requested delay must stay 1000ms in every run; at least
four new runs must be within inclusive +/-20ms of the 1001ms recapture.
Two or more valid new runs outside tolerance would stop the unit.
The existing production-consumer timer script and build were unchanged.

| Sample | Requested ms | Elapsed ms | Delta from 1001ms | Environment / verdict |
|---|---:|---:|---:|---|
| Original failing after-capture | 1000 | 1104 | +103 | Visible; original FAIL retained |
| New run 1 | 1000 | 1000 | -1 | Visible; PASS |
| New run 2 | 1000 | 1021 | +20 | Visible; PASS (inclusive boundary) |
| New run 3 | 1000 | 1001 | 0 | Visible; PASS |
| New run 4 | 1000 | 1001 | 0 | Visible; PASS |
| New run 5 | 1000 | 1385 | +384 | Tab became hidden; INVALID, excluded from both pass and fail counts |

The user explicitly accepted the timing result: **four valid passes, zero valid
failures, one excluded hidden capture** among the five new captures; every run
requested 1000ms. Hidden-tab throttling invalidates run 5, which is retained
as evidence, not silently discarded or replaced. X-A timing therefore **PASSES**
under the new rule. The original outlier is not counted among the five new
captures and is not retrospectively relabeled as a passing measurement.

**Actual consumers — PASS.** Production components were rendered from the
built source modules with session-only row data and real map controller/store/
i18n providers. No Tooltip fixture or component mock supplied their delay props.
SingleLayer used an unregistered probe path; no data layer was loaded or modified.
React fiber inspection confirmed the props reaching the actual MUI Tooltip:

| Actual consumer | enterDelay | enterNextDelay | Wrapper path |
|---|---:|---:|---|
| LayerListItem | 1000 | 1000 | TooltipUI -> MUI Tooltip; caller props override wrapper defaults |
| SingleLayer | 1000 | 1000 | TooltipUI -> MUI Tooltip; caller props override wrapper defaults |
| ItemsList / LegendListItem | 1000 | 1000 | Direct MUI Tooltip import; does not use TooltipUI |

**Required two-map check — PASS.** Existing coordinate-format and scale
TooltipUI instances inside the real geo.ca mapA and dark mapB were inspected,
not substitute probes. Each TooltipUI hook's theme-context palette and
transitions references are identical to its own map's provider references.
The two maps' theme, palette and transitions objects are distinct from each
other. Both maps' default wrappers render 1000/200ms. This proves per-viewer
object ownership, not just equality of delay values.

Evidence:
[F-A before](./baselines/fonts-before-f-a-recapture.json),
[F-A after](./baselines/fonts-after-f-a.json),
[F-B before](./baselines/fonts-before-f-b-recapture.json),
[F-B after](./baselines/fonts-after-f-b.json),
[X-A before](./baselines/transitions-before-x-a-recapture.json),
[X-A original after, failed](./baselines/transitions-after-x-a.json),
[X-A reproducibility, actual consumers and two-map](./baselines/transitions-x-a-reproducibility.json).
Each contains source commit and SHA256 build provenance. Before core bundle:
`7b97924a2eaa4ca2cde3a1384ca992f0ecdd3fcd952fe3acd98ea66a748d4379`;
F-A after core bundle:
`25173f3cc0d37957433b2155f8bf9f0218e9901429e5e1f35c57baff7ffe3cdf`.
F-B after core bundle:
`cfc3495fa55011faa597d56fdb1a578f63312a15e1ce2656012d123cc387d78b`;
X-A after core bundle:
`8e076e1c06ac26b47eae72cf4958aa5924e5fd64ed1d0d2e4fb35a00e92849f3`.

Commands and results (from `packages/`, except builds):

- `node node_modules/prettier/bin/prettier.cjs --check geoview-core/src/ui/slider/slider-style.ts`
  — PASS.
- `node --max-old-space-size=8192 node_modules/eslint/bin/eslint.js geoview-core/src/ui/slider/slider-style.ts`
  — PASS.
- `node node_modules/typescript/bin/tsc --project geoview-core/tsconfig.json --noEmit --tsBuildInfoFile <session>/final-fa.tsbuildinfo`
  — PASS.
- `cd geoview-core && rushx build-dev` — PASS before and after F-A.
- `node node_modules/prettier/bin/prettier.cjs --check geoview-custom-legend/src/custom-legend-style.ts`
  — PASS.
- `node --max-old-space-size=8192 node_modules/eslint/bin/eslint.js geoview-custom-legend/src/custom-legend-style.ts`
  — PASS.
- `node node_modules/typescript/bin/tsc --project geoview-custom-legend/tsconfig.json --noEmit --tsBuildInfoFile <session>/final-fb.tsbuildinfo`
  — FAIL: TS2339, missing List/ListItem/ListItemIcon in core's generated UI
  declaration exports, at group-item lines 55-57, legend-item line 28 and
  custom-legend-panel line 30. A read-only compiler-host overlay with the two
  original F-B expressions and the same project references reproduces exactly
  these five diagnostics. This initial failure was resolved on resume by
  regenerating core declarations, without source or config changes.
- `node node_modules/typescript/bin/tsc --build geoview-core/tsconfig.json --force`
  — PASS; regenerates the declaration-only output in geoview-core/lib.
- `node node_modules/typescript/bin/tsc --project geoview-custom-legend/tsconfig.json --noEmit --tsBuildInfoFile <session>/final-fb-regenerated.tsbuildinfo`
  — PASS; all five TS2339 diagnostics gone: stale declarations, not alias errors.
  No baseline-failure entry is needed in WHATS_LEFT.
- F-B Prettier and ESLint commands above rerun — PASS.
- `node node_modules/typescript/bin/tsc --project geoview-custom-legend/tsconfig.json --noEmit --tsBuildInfoFile <session>/final-fb-resumed.tsbuildinfo`
  — PASS.
- `node node_modules/prettier/bin/prettier.cjs --check geoview-core/src/ui/tooltip/tooltip.tsx`
  — PASS.
- `node --max-old-space-size=8192 node_modules/eslint/bin/eslint.js geoview-core/src/ui/tooltip/tooltip.tsx`
  — PASS.
- `node node_modules/typescript/bin/tsc --project geoview-core/tsconfig.json --noEmit --tsBuildInfoFile <session>/final-xa.tsbuildinfo`
  — PASS.
- `cd geoview-core && rushx build-dev` — PASS after F-B and after X-A.
- `node <session>/final-evidence.cjs after-f-b` — PASS all five themes.
- `node <session>/final-evidence.cjs after-x-a` — FAIL geo.ca elapsed-time
  comparison; original failed capture persisted with build hashes.
- `verifyFinalConsumers()` from session-only `final-closeout-checks.js` — PASS:
  three actual consumers and actual two-map TooltipUI hook identities.
- `node <session>/final-repro-evidence.cjs` — PASS under the user-approved
  reproducibility rule; records every repeat and preserves the original
  failure, checks unchanged bundle hash and saves combined closeout evidence.

**Effect of decided A, and the unadopted alternatives (not an execution request):**

- **A (DECIDED):** settles T25's tooltipDelay/1000ms follow-up, retains T45
  unchanged under R1 (plain MUI uses Fade's default exit timing), retains
  T29's literal 200 under H6, settles literal-preserving
  fallbacks for FR1's three approved aliases and preserves all nine existing
  font fallback branches. The 77 no-fallback component rows stay held under
  FH8. Colour-role gaps, S08/S10/S11 invalid templates and unresolved focus
  assumptions stay held with today's plain-MUI rendering; no new fallback.
- **B:** can unblock those font/colour/focus sites that have approved MUI role
  equivalents, and preserve the three existing MUI-base branches. It does
  **not** supply a splash equivalent or preserve unconfigured plain-MUI
  tooltip delays: MUI's component-default fields express those roles, but their
  missing-value defaults are 100/0ms, not 1000/200ms. An explicit exception or
  hybrid is needed. It cannot resolve the shadow-template
  colours by selecting an elevation number. No blanket role mapping is implied.
- **C:** can settle an intentionally narrower supported-theme contract only
  after accepting the compatibility impact. It does **not** repair missing
  extension output, create T29's token or meet the parked plain-MUI fallback
  requirement; those items remain held/unresolved rather than "fixed".

The unrelated parked reduced-motion, missing shortcut default, keyboard-focus
verification S14/S31 and time-slider colour referral are not unblocked merely
by choosing a fallback option. Existing lists remain in
[WHATS_LEFT.md](./WHATS_LEFT.md). At migration closeout its completed T25
follow-up is recorded; HELD is narrowed to T29 in H6. All other holds remain.

#### Discovery accuracy and backup verification

No occurrence-expression, order, count or Text/icon-tag correction was required.
Two interpretation traps are recorded here rather than changing discovery:
variant values are explicitly pre-cascade candidates, and drawer native
`cssText` has no theme read **at the site**, not a theme-free enclosing component.
The 99 generated keys are definitions, not 99 extra occurrence rows.

**Historical Gate 2 verification:** earlier backups and ID-only discovery validation remain available.
Before recording the final answers, THEME_DECISIONS and WHATS_LEFT were each
backed up again and diffed afterwards. Discovery is unchanged in this answer pass.
Validation removes only the added ID cells from discovery and compares the
result byte-for-byte to its backup; IDs must be F001-F243 in original order.
The complete Transitions-through-Shadows block is compared byte-for-byte to
the decisions backup; outside Fonts, only the header's Fonts status may differ.
The disjoint row partitions and role/tag counts are independently checked.
No source/theme/config changes or build are part of this documentation gate.

**Migration closeout verification — 2026-10-29:** THEME_DECISIONS, HELD,
WHATS_LEFT and THEME_MIGRATION_PROMPT were each backed up before editing and
diffed afterwards. Shadows remains byte-identical to the closeout backup;
Transitions changed only for T25's final disposition/totals and historical
clarifications. Fonts ledger/status/evidence are updated; discovery is unchanged.
HELD now has 26 Transitions rows with H6 T29 only and its end condition preserved.
WHATS_LEFT records completed T25 work while preserving the splash default-timing
entry and other holds. Step 6 of the standing prompt includes the five-repeat
outlier rule and hidden-capture exclusion. No production source/configuration
change was made by this reproducibility/closeout pass.
