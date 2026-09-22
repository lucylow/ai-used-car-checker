# CARWISE FRONTEND V2 — CURSOR INTEGRATION PROMPT

Paste this file into Cursor after copying `src/redesign` into the existing repository.

## Objective

Replace the visually weak frontend presentation of the existing CarWise Expo / React Native app with the frontend contained in `src/redesign`, while preserving all existing business logic, persistence, API boundaries, AI behavior, document handling, photo handling, and navigation semantics.

Before editing, read the repository-specific [`CARWISE_REDESIGN_INTEGRATION_MAP.md`](../../CARWISE_REDESIGN_INTEGRATION_MAP.md) and [`CARWISE_CURSOR_MIGRATION_CHECKLIST.md`](../../CARWISE_CURSOR_MIGRATION_CHECKLIST.md). They identify the host route names, real handlers, known placeholders, and verification order.

The current repository declares Expo `~50.0.14` and React Native `0.73.6` in `package.json`. Verify the installed host versions before changing dependencies. It has `@expo/vector-icons`, `expo-image-picker`, `expo-document-picker`, `expo-image-manipulator`, `expo-file-system`, `expo-print`, `expo-sharing`, async storage, and gesture-handler. Prefer those installed capabilities rather than adding libraries unless a capability genuinely cannot be implemented with the current stack.

The current bridge already exists in `App.js`. Treat it as an integration starting point: inspect and repair it rather than pasting the example blindly. In particular, `historyTab` and `savedDetail` need explicit redesign route aliases, while video and voice actions are currently placeholders and document import is currently wired to backup import.

## Important constraints

1. Do not rewrite the backend.
2. Do not delete existing API services.
3. Do not replace local persistence.
4. Do not remove recovery/retry behavior.
5. Do not remove accessibility or reduced-motion behavior.
6. Do not create fake production API integrations.
7. Do not expose AI estimates as definitive diagnoses.
8. Do not make users restart an inspection when an operation fails.
9. Preserve the current seven-stage end-to-end workflow.
10. Keep existing sponsor/API integration boundaries intact.

## Existing App.js integration points

Current `App.js` already owns:

- `tab`
- `screen`
- `vehicle`
- `issues`
- `checklist`
- `photos`
- `aiResult`
- `aiPendingFindings`
- `aiBusy`
- `savedInspections`
- `marketComparison`
- `settings`
- `toolNotes`
- `reportPreview`
- `reportSections`
- `recoveryLog`
- `reduceMotionEnabled`
- `retryQueueCount`

It also already has functions such as:

- `startInspection`
- `beginChecklist`
- `saveInspection`
- `runAnalysis`
- `acceptAiFindings`
- `dismissAiFindings`
- `addCustomFinding`
- `openIssueEditor`
- `saveIssueEdit`
- `removeAiFinding`
- `retryLocalSave`
- `exportReportPdf`
- `selectViewerPhoto`
- `addPickedPhoto`

Use those functions whenever the redesigned UI needs to mutate real application state.

## Step 1 — Copy the redesign folder

Copy:

`src/redesign/*`

to the existing repository:

`src/redesign/*`

Do not merge these files into the old `App.js` initially.

## Step 2 — Add RedesignShell import to App.js

At the import section:

```js
import { RedesignShell } from './src/redesign';
```

Adjust the import path only if the existing repository places `App.js` somewhere else.

## Step 3 — Build the state bridge

Inside `App()` create a memoized state object:

```js
const redesignState = useMemo(() => ({
  vehicle,
  issues,
  checklist,
  photos,
  aiResult,
  aiPendingFindings,
  aiBusy,
  savedInspections,
  marketComparison,
  settings,
  toolNotes,
  reportReadiness,
  retryQueueCount,
  recoveryLog,
  userName: 'CarWise Driver',
  userEmail: '',
  plan: 'prototyping',
}), [
  vehicle,
  issues,
  checklist,
  photos,
  aiResult,
  aiPendingFindings,
  aiBusy,
  savedInspections,
  marketComparison,
  settings,
  toolNotes,
  reportReadiness,
  retryQueueCount,
  recoveryLog,
]);
```

Do not invent additional application state unless the existing app already has it.

## Step 4 — Build action adapters

Create:

```js
const redesignActions = {
  onNavigate: (next) => setScreen(next),
  onBack: () => setScreen('home'),

  onStartInspection: startInspection,
  onResumeInspection: () => setScreen('checklist'),
  onCreateInspection: (nextVehicle) => {
    setVehicle((current) => ({ ...current, ...nextVehicle }));
    setScreen('checklist');
  },

  onOpenVin: () => setScreen('vin'),
  onOpenMedia: () => setScreen('photos'),
  onOpenGallery: () => setScreen('photos'),
  onOpenInspection: () => setScreen('checklist'),
  onOpenFinding: () => setScreen('ai'),
  onOpenPhoto: (photo) => {
    setSelectedPhoto(photo);
    // Keep using the existing photo viewer state and handlers.
  },

  onCapturePhoto: capturePhoto,
  onCaptureVideo: captureVideo,
  onCaptureVoice: addVoiceNote,
  onPickDocument: pickDocument,
  onAddNote: openCustomFindingOrNoteFlow,

  onRunAnalysis: runAnalysis,
  onAcceptAiFindings: acceptAiFindings,
  onDismissAiFindings: dismissAiFindings,

  onSaveInspection: saveInspection,
  onRetry: retryLocalSave,
  onExportReport: exportReportPdf,
  onShareReport: shareReport,

  onNavigateToSummary: () => setScreen('summary'),
  onNavigateToNegotiation: () => setScreen('negotiation'),
  onNavigateToContract: () => setScreen('contract'),
  onNavigateToCertificate: () => setScreen('certificate'),

  onOpenSettings: () => setScreen('settings'),
  onNotifications: () => setScreen('notifications'),
};
```

IMPORTANT: Before pasting the example above, inspect the actual function names already present in `App.js`. Reuse exact existing functions. Do not create duplicate versions of photo capture, notes, PDF generation, storage, or AI analysis.

## Step 5 — Feature-flag the redesign

Create a temporary constant near the top of `App()`:

```js
const USE_REDESIGN = true;
```

Immediately before the old screen/tab rendering block, add:

```jsx
if (USE_REDESIGN) {
  return (
    <RedesignShell
      screen={screen}
      state={redesignState}
      actions={redesignActions}
      showNavigation
    />
  );
}
```

Do not delete the original rendering path. This gives a safe fallback while integrating.

## Step 6 — Map legacy screen names

The redesign already includes aliases for:

```txt
home
new
checklist
photos
photo-evidence
ai
summary
market
vin
history
saved-detail
report
negotiation
cost
test
maintenance
history-tool
compare
settings
certificate
onboarding
paywall
notifications
contract
garage
inspection-detail
evidence-review
market-explorer
profile
share
demo
design-system
visual-states
showcase
camera-studio
report-composer
```

If the existing app uses another screen identifier, add it to `ROUTE_ALIASES` rather than changing the current business logic.

## Step 7 — Preserve real media handling

The repository already has image-picker/document-picker flows and local photo persistence. The redesigned UI is only a frontend layer.

Wire:

```txt
Photo button   → existing ImagePicker/capture flow
Gallery        → existing ImagePicker gallery flow
Document       → existing DocumentPicker flow
PDF            → existing Print + Sharing flow
Voice note     → existing note/timeline model if present
```

Do not make the new visual camera screen pretend that it has a live camera feed if the current app uses a native picker.

The `CameraStudioScreen` is a visual shell. Its buttons should call the existing real handlers.

## Step 8 — Preserve AI trust semantics

The current app explicitly treats AI output as estimates and allows user review/acceptance.

Keep this behavior in every redesigned destination.

Use:

```txt
AI estimate
Possible issue
Confidence
Evidence
Requires confirmation
```

Never change an AI estimate into a definitive mechanical diagnosis.

The evidence review screen should remain a human checkpoint.

## Step 9 — Connect the report flow

Existing PDF/report functionality should remain the source of truth.

Use the redesigned `ReportScreen` and `ReportComposerScreen` as the visual shell while calling the existing:

`exportReportPdf`

and existing report/readiness state.

Do not rebuild PDF HTML unless the visual report itself is intentionally being upgraded later.

## Step 10 — Connect local recovery

The existing app already has:

- local persistence
- pending inspection backup
- retries
- recovery log
- storage failure states
- restoration handling

Expose these through:

- Home recovery banner
- Settings / diagnostics
- Notifications
- error banners
- retry actions

Never hide recovery information just because the visual redesign looks cleaner.

## Step 11 — Fix data normalization at the adapter boundary

All frontend screens should receive:

```js
{
  vehicle: {
    name,
    year,
    make,
    model,
    mileage,
    asking,
    vin,
    location,
  },
  risk: {
    score,
    label,
    tone,
  },
  riskScore,
  riskLabel,
  repairTotal,
  progress,
  findings,
  issues,
  checklist,
  photos,
  market,
  history,
  aiResult,
  aiConfidence,
  aiBusy,
  recoveryLog,
  reportReadiness,
}
```

Do not scatter data-shape conversions across screens.

The adapter is the single normalization boundary.

## Step 12 — Do a dependency audit

The redesign intentionally uses only dependencies already available in the current app:

- react
- react-native
- @expo/vector-icons
- react-native-gesture-handler

Do not add:

- Reanimated
- SVG packages
- LinearGradient
- a new UI framework
- a new navigation system
- a new state manager

unless the host project already includes them and the integration clearly benefits from them.

## Step 13 — Visual QA order

After integration, verify in this order:

1. Home
2. New inspection
3. VIN
4. Checklist
5. Camera / photo flow
6. AI analysis
7. Summary
8. Market
9. Cost
10. Negotiation
11. Report
12. Certificate
13. Settings

Then test:

- long text
- missing vehicle data
- no photos
- one photo
- many photos
- AI busy
- AI failed
- storage failure
- report failure
- restored inspection
- reduced motion
- accessibility labels

## Step 14 — Remove the old visual layer only after parity

Once the redesign is stable:

- delete unused legacy visual components
- keep all backend/service logic
- keep persistence/recovery functions
- keep test helpers
- keep API integration modules
- keep existing domain/data transformation helpers

Do not delete functionality simply because the new UI has a replacement component.

## Acceptance criteria

The redesign is successful only when:

- the app starts on the new CarWise visual system
- the current inspection data appears in the redesigned screens
- the existing photo flow still works
- the existing AI flow still works
- the existing local persistence still works
- the existing PDF export still works
- navigation does not reset inspection state
- every critical AI result exposes evidence/confidence
- the UI feels premium and automotive rather than generic SaaS
- motion is smooth and reduced-motion settings are respected
- empty/loading/error/success states exist
- no sponsor badge or hackathon branding appears in the consumer UI

## Final instruction to Cursor

Do not merely restyle the existing components.

Refactor the frontend around the principle:

**SEE THE CAR → UNDERSTAND THE RISK → KNOW THE PRICE → NEGOTIATE WITH EVIDENCE → SIGN WITH CONFIDENCE**

Use `src/redesign` as the visual system and component source of truth, but preserve the existing CarWise application logic underneath it.
