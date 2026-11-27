# Standing migration prompt — Transitions ledger units

Run once per ledger unit. The unit to migrate is named in the request.

Authority: docs/audit/THEME_AUDIT_PLAN.md; the DECIDED Transitions section and "Ledger units (Transitions)" in docs/audit/THEME_DECISIONS.md; docs/audit/baselines/transitions-before.json (cross-check only).

## Rules
- Change ONLY the files listed for the named unit. Never start another unit.
- Migrate only rows whose rule is DECIDED. Leave held and context rows untouched, even in the same file.
- **Never change a functional timer.** No `setTimeout`, wait, delay or callback timing may change its requested value. If a change would alter one, stop and report instead of editing. Only rows whose DECIDED rule explicitly names a JS wait may switch it to a theme source, and its value must stay identical.
- Read the theme from the per-viewer context (existing `theme`, `useTheme()`, or the theme already passed to the style function). Never import a global or default theme.
- Use `theme.transitions.create(...)` and the existing `duration`/`easing` fields exactly as the rule states. Preserve target properties (including `all` where authored), delays and no-motion sentinels.
- Coupled rows move together: both sides derive from the same theme value in the same change.
- No new tokens, refactoring, comment rewrites or unrelated fixes. Report anything else you notice; don't fix it.
- Do not commit. Before editing THEME_DECISIONS.md, back it up to session-state and diff afterwards.

## Steps
1. **Drift check:** re-read the unit's rows in current source. If any line, value or expression differs from discovery, stop and report it.
2. **Before-recapture (before editing):** build the current unmigrated files (`cd packages/geoview-core && rushx build-dev`, served on 127.0.0.1:8081). Capture computed styles and timing for the unit's rows: a visible page, a resumed clock, 1600×1200 at DPR 1, and the session-state capture script and selectors, unchanged. Save as `docs/audit/baselines/transitions-before-<unit>-recapture.json`. This recapture is the comparison authority.
3. Make the change.
4. **Focused checks:** Prettier, ESLint and TypeScript for the changed files and package. Report the commands and results.
5. **Build and after-capture** under identical conditions. Save as `docs/audit/baselines/transitions-after-<unit>.json`, with the build hash.
6. **Compare against the recapture:**
   - Like phases only: active with active, settled with settled.
   - **Exact-alias rows:** property, duration, timing function and delay strings identical.
   - **Behaviour-change rows:** only the documented difference may appear; every other field identical.
   - **Timers:** requested delays identical. Observed elapsed time within ±20ms of the recapture’s observed elapsed time for a single timer, and ±40ms for events that follow a timer plus render plus transition chain. The order of swaps, focus calls and transition ends unchanged. Elapsed times far above the requested delay in *both* captures are pre-existing main-thread delay: report them as information, not failures.
   - A single timing outlier with identical requested delays is checked by five repeat captures; it passes if at least four are within tolerance.
   - A capture taken while the page was hidden is invalid and is excluded from pass and fail counts.
   - Report any disagreement with the original baseline as information, not as a failure.
7. **Two-map check, required if the unit adds a new theme read:** build a temporary two-map page in session-state (never in the repo), with different themes. Verify that each map's affected elements read their own theme object, not just matching values. State whether the check was required and the result.
8. Mark the unit "Migrated <date>, pending review" in the ledger.
9. **Report:** the diff per file; checks and build; a per-T-ID comparison table (recapture, after, verdict); timer requested delays; the two-map result; any drift or differences; the next unit in the ledger order (named only).
