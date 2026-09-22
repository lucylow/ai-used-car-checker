# CarWise Cursor Migration Checklist

Use this checklist while integrating `src/redesign` into the existing Expo app. Complete each phase in order and keep the legacy render path available until the parity checks pass.

## Phase 0: Establish the baseline

- [ ] Confirm the working tree and preserve unrelated user changes.
- [ ] Run the existing static checks before changing the bridge.
- [ ] Confirm the host versions from `package.json` rather than relying on package notes.
- [ ] Launch the current app and record the starting route, persistence behavior, media behavior, AI behavior, and report behavior.
- [ ] Capture one known-good inspection fixture with vehicle details, at least one issue, checklist state, photo evidence, AI output, and a saved inspection.

## Phase 1: Inventory the host contract

- [ ] Read `App.js` and list every state value passed to the redesign.
- [ ] List every action function used by the redesign.
- [ ] Verify each action is an existing host handler or a thin route adapter.
- [ ] Mark handlers that are placeholders, status messages, or demo-only behavior.
- [ ] Confirm the host route strings, especially `historyTab` and `savedDetail`.
- [ ] Confirm the current persistence keys and retry/recovery flow.
- [ ] Confirm the existing PDF/report generation and sharing functions are the only report source of truth.

## Phase 2: Install the presentation layer

- [ ] Copy only `src/redesign` into the repository.
- [ ] Confirm the redesign entry point is `src/redesign/index.js`.
- [ ] Keep existing services, domain types, API clients, and legacy components intact.
- [ ] Confirm imports resolve against installed dependencies.
- [ ] Do not add navigation, state management, animation, SVG, or UI libraries unless the host already uses them and the change is necessary.
- [ ] Keep the old render branch behind a temporary feature flag.

## Phase 3: Build the bridge

- [ ] Create `redesignState` with vehicle, issues, checklist, photos, AI state, saved inspections, market data, settings, notes, report readiness, retry count, and recovery log.
- [ ] Keep the state object memoized with all of those values in its dependency list.
- [ ] Create `redesignActions` with route adapters and existing business handlers.
- [ ] Connect `onStartInspection` to the real reset/start flow.
- [ ] Connect `onResumeInspection` without resetting inspection state.
- [ ] Connect vehicle creation and VIN decode to the existing validation and apply handlers.
- [ ] Connect checklist changes to the existing checklist state model.
- [ ] Connect AI run, accept, dismiss, edit, remove, and custom finding actions.
- [ ] Connect save and retry to local persistence and the retry queue.
- [ ] Connect report preview, PDF export, and sharing to existing implementations.
- [ ] Connect photo selection to the existing fullscreen viewer lifecycle.
- [ ] Add aliases for `historyTab` and `savedDetail` before testing redesigned navigation.

## Phase 4: Remove false affordances

- [ ] Replace the current video status placeholder with the real camera/video handler, or hide/disable the action with an explicit unavailable state.
- [ ] Replace the current voice-note status placeholder with the existing note model, or hide/disable the action.
- [ ] Do not map document evidence to backup import unless that is intentionally the same user workflow.
- [ ] Do not claim live market, certificate, contract, or signature behavior unless the host handler exists.
- [ ] Ensure every demo fallback is labeled as demo, local, estimated, or unavailable.

## Phase 5: Verify data and trust semantics

- [ ] Confirm `buildRedesignData` is the only normalization boundary.
- [ ] Test empty vehicle data, missing photos, missing AI result, and empty saved history.
- [ ] Test one photo, many photos, malformed restored photos, and a removed photo linked to a finding.
- [ ] Test AI confidence represented as both a fraction and a percentage.
- [ ] Confirm AI findings use estimate/possible issue language and expose evidence/confidence.
- [ ] Confirm accepting findings is a deliberate user action.
- [ ] Confirm dismissing findings does not delete the source photo or note.
- [ ] Confirm report readiness reflects the actual host requirements.
- [ ] Confirm asking, fair, repair, target, and savings values come from normalized data rather than demo constants.

## Phase 6: Route-by-route QA

- [ ] Home: active inspection, saved preview, recovery banner, retry action.
- [ ] New inspection: valid/invalid vehicle details, VIN entry, back navigation.
- [ ] VIN: decode success, cancel, invalid VIN, apply to current inspection.
- [ ] Checklist: toggle sections, progress, evidence actions, save, resume.
- [ ] Photos: camera permission, picker cancel, picker failure, review, remove, replace, open viewer.
- [ ] Camera studio: native capture path or explicit unavailable state.
- [ ] AI: idle, busy, success, failure, retry, evidence, accept, dismiss, edit, remove.
- [ ] Summary: risk, repair total, evidence health, readiness, report action.
- [ ] Market and cost: real values, issue editing, empty state, unavailable service state.
- [ ] Test drive, history, maintenance: note creation, source, edit/delete, restore.
- [ ] Negotiation: evidence-linked talking points and correct price math.
- [ ] Report/composer: section state, preview, PDF export, share, failure, retry.
- [ ] Certificate/contract: only enable real operations; preserve human review and signing boundaries.
- [ ] History/detail/compare/garage: open, edit, compare exactly two, return without losing selection.
- [ ] Settings/profile: settings persistence, motion setting, failure toggles, diagnostics.
- [ ] Notifications/share/onboarding: actionable notices, sharing, replay, and persisted onboarding state.

## Phase 7: Failure, accessibility, and recovery QA

- [ ] Simulate storage failure and verify the inspection remains usable.
- [ ] Simulate report failure and verify retry does not restart the inspection.
- [ ] Simulate camera/library permission denial and cancellation.
- [ ] Restore a pending inspection and verify the source and recovery notice are visible.
- [ ] Verify retry queue count and recovery log entries update after failures and retries.
- [ ] Test system reduced motion and the app motion-intensity setting.
- [ ] Test screen-reader labels, roles, hints, disabled states, and live regions.
- [ ] Test long vehicle names, long notes, missing values, and narrow screens.
- [ ] Verify no interactive control is hidden behind the bottom navigation or keyboard.

## Phase 8: Validation and rollout

- [ ] Run the focused lint/type/test command for the changed slice.
- [ ] Run the full project checks.
- [ ] Build and launch the Expo app on the target platform.
- [ ] Walk the seven-stage flow: identify, inspect, capture evidence, analyze, price, negotiate, report/sign.
- [ ] Compare the redesigned flow with the baseline fixture.
- [ ] Turn off demo-only routes and demo data for the consumer entry points.
- [ ] Keep the legacy branch available until the acceptance checklist passes.
- [ ] Remove the feature flag only after a successful device/runtime pass.
- [ ] Remove unused legacy visual code only after confirming no business logic or tests depend on it.
- [ ] Record known limitations and any intentionally unavailable media or sponsor operations.

## Definition of done

- [ ] The app starts on the redesign without losing an active inspection.
- [ ] Existing local persistence, pending backups, retries, and recovery logs still work.
- [ ] Existing photo, AI, report, and sharing flows remain the source of truth.
- [ ] Every critical AI result is traceable to evidence and labeled as an estimate requiring confirmation.
- [ ] All host routes resolve to the intended redesign destination.
- [ ] Empty, loading, error, success, and unavailable states are present.
- [ ] Accessibility and reduced-motion behavior remain intact.
- [ ] A device/runtime build has passed, not just static syntax validation.
