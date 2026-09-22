# CarWise Redesign Integration Map

This map connects the redesign routes to the existing `App.js` state, handlers, and persistence boundaries. It is the implementation reference for integrating `src/redesign`; the redesign screens remain presentation components.

## Host facts

- Entry point: `App.js`
- Current bridge: `redesignState`, `redesignActions`, and `RedesignShell`
- Package versions in this repository: Expo `~50.0.14`, React Native `0.73.6`
- Existing persistence: AsyncStorage-backed active inspection, pending backup, saved inspections, retry queue, recovery log, settings, and tool notes
- Existing real media capabilities: image picker, image library, document picker, image manipulation, local file handling, PDF print, and sharing
- Navigation is currently controlled by the `screen` state string, not by the redesign package

## Route map

| User destination | Host route | Redesign route | Screen | Existing state used | Required action adapters | Integration status |
| --- | --- | --- | --- | --- | --- | --- |
| Home | `home` | `home` | `HomeScreen` | vehicle, issues, photos, savedInspections, recoveryLog, retryQueueCount | start/resume inspection, history, settings, notifications | Bridge ready |
| New inspection | `new` | `new` | `NewInspectionScreen` | vehicle, settings, form validation | start inspection, create/update vehicle, VIN, checklist | Verify field mutation |
| VIN decoder | `vin` | `vin` | `VinScreen` | vehicle, settings | existing VIN decode and apply handler | Bridge required |
| Checklist | `checklist` | `inspection` | `InspectionScreen` | checklist, photos, issues, progress | begin checklist, toggle checklist item, add evidence, save | Verify every checklist mutation |
| Photo evidence | `photos` | `media` | `MediaScreen` | photos, issues, AI evidence state | take photo, choose photo, remove/replace, review, add finding | Photo actions real; verify viewer bridge |
| Camera studio | `camera-studio` | `camera-studio` | `CameraStudioScreen` | photos, aiResult | existing camera/picker handlers | Visual shell; use native picker/camera |
| AI analysis | `ai` | `ai` | `AIAnalysisScreen` | aiResult, aiPendingFindings, aiBusy, issues, photos | run, accept, dismiss, edit, remove finding | Bridge ready; verify trust copy |
| Evidence review | `evidence-review` | `evidence-review` | `EvidenceReviewScreen` | photos, findings, issues | open photo, review evidence, edit/remove finding | Verify selected-photo lifecycle |
| Summary | `summary` | `summary` | `SummaryScreen` | vehicle, risk, issues, photos, reportReadiness, aiResult | report, negotiation, evidence, save | Verify readiness and report links |
| Market comparison | `market` | `market` | `MarketScreen` | vehicle, marketComparison, issues | update market comparison, negotiation | Bridge required for edits |
| Repair cost | `cost` | `cost` | `CostScreen` | issues, repairTotal | edit/remove issue, save | Verify issue editor adapter |
| Test drive | `test` | `test` | `TestDriveScreen` | toolNotes | save/delete test-drive note | Existing note model; connect save/delete |
| Vehicle history | `history` tool | `vehicle-history` | `VehicleHistoryScreen` | toolNotes | save/delete history note | Existing note model; connect save/delete |
| Maintenance | `maintenance` | `maintenance` | `MaintenanceScreen` | toolNotes, issues | save/delete maintenance note | Verify note type and source |
| Negotiation | `negotiation` | `negotiation` | `NegotiationScreen` | vehicle, market, issues, repairTotal | contract, share, report | Verify values come from normalized data |
| Report | `report` | `report` | `ReportScreen` | reportReadiness, vehicle, issues, checklist, photos, aiResult | preview, export PDF, share, retry | Existing PDF/share must remain source of truth |
| Report composer | `report-composer` | `report-composer` | `ReportComposerScreen` | report sections, reportReadiness, evidence | existing report section and export handlers | Verify section changes persist |
| Certificate | `certificate` | `certificate` | `CertificateScreen` | report/readiness, vehicle, inspection metadata | certificate generation/share if available | Keep human-review and provenance labels |
| Contract | `contract` | `contract` | `ContractScreen` | vehicle, issues, market, report readiness | existing contract flow if present; otherwise explicit unavailable state | Verify before enabling signing claims |
| History list | `historyTab` | `history` | `HistoryScreen` | savedInspections, compareSelection, query, sort | open, compare, delete, restore/edit | Add route alias before enabling |
| Saved inspection detail | `savedDetail` | `inspection-detail` or `report` | `InspectionDetailScreen` | selectedSavedInspection | open, edit, photo viewer, compare | Preserve selected item; add route/state bridge |
| Compare inspections | `compare` | `compare` | `CompareScreen` | savedInspections, compareSelection | select/clear comparison | Verify selection remains local and bounded to two |
| Settings/profile | `profile` / `settings` | `profile` / `settings` | `ProfileScreen` / `SettingsScreen` | settings, recoveryLog, retryQueueCount | settings persistence, retry, recovery log | Bridge ready; test failure toggles |
| Notifications | `notifications` | `notifications` | `NotificationsScreen` | recoveryLog, retryQueueCount, save/report status | open settings, retry local save | Verify actionable recovery entries |
| Share center | `share` | `share` | `ShareCenterScreen` | report/readiness, saved inspection | existing share/PDF actions | Verify no duplicate document generation |
| Garage | `garage` | `garage` | `GarageScreen` | savedInspections, current vehicle | open inspection/detail | Verify selected inspection behavior |
| Onboarding | `onboarding` | `onboarding` | `OnboardingScreen` | onboarding state | finish/replay onboarding | Keep AsyncStorage preference |
| Paywall | `paywall` | `paywall` | `PaywallScreen` | plan/settings | existing purchase boundary | Do not invent entitlement state |
| Demo / QA screens | `demo`, `showcase`, `design-system`, `visual-states` | same | corresponding screen | demo data only | navigation only | Keep out of consumer navigation |

## Route fixes

The redesign boundary now includes explicit mappings for the host-only route names that were previously falling back to Home:

```js
historyTab: 'history',
savedDetail: 'inspection-detail',
profile: 'profile',
```

The redesign bottom History tab also navigates to `historyTab`, preserving the host saved-inspection list instead of opening the host history note tool. The legacy `saved-detail` alias now resolves to the inspection detail screen.

Do not rename the host routes globally. Add aliases or normalize them at the bridge boundary.

## Action adapter matrix

| Adapter | Existing host handler | Current bridge note | Acceptance check |
| --- | --- | --- | --- |
| `onStartInspection` | `startInspection` | Real | Creates a fresh inspection and clears prior transient state |
| `onResumeInspection` | `setScreen('checklist')` | Real route only | Does not reset vehicle, checklist, photos, or issues |
| `onCreateInspection` | `setVehicle` + route | Partial | Validate year/make/model through the existing flow |
| `onOpenVin` | `setScreen('vin')` | Real route | VIN screen can apply decoded vehicle through existing handler |
| `onCapturePhoto` | `takeInspectionPhoto` | Real | Permission denial/cancel/failure remains recoverable |
| `onOpenGallery` | `setScreen('photos')` | Real route | Gallery uses existing picker and local persistence |
| `onCaptureVideo` | currently status message | Placeholder | Either connect a real camera/video handler or label the feature unavailable |
| `onCaptureVoice` | currently status message | Placeholder | Connect the existing note model or remove the active affordance |
| `onPickDocument` | currently `importLocalBackup` | Risk | Do not present backup import as document evidence without a dedicated handler |
| `onRunAnalysis` | `runAnalysis` | Real | Busy, failure, retry, and human review states remain visible |
| `onAcceptAiFindings` | `acceptAiFindings` | Real | Findings become user-confirmed state only after review |
| `onDismissAiFindings` | `dismissAiFindings` | Real | Dismissal does not silently delete source evidence |
| `onOpenPhoto` | `setSelectedPhoto` | Redesign viewer wired | The shell opens `FullscreenEvidenceViewer`; preserve host viewer state if the legacy branch is used |
| `onSaveInspection` | `saveInspection` | Real | Local save and pending backup behavior are unchanged |
| `onRetry` | `retryLocalSave` | Real | Retry result updates recovery log and status |
| `onExportReport` | `exportReportPdf` | Real | Uses existing report HTML/PDF path |
| `onShareReport` | `shareReport` | Real | Uses existing generated report and sharing path |
| `onOpenSettings` | settings route | Real route | Recovery diagnostics remain available |
| `onNotifications` | notifications route | Real route | Failed operations expose an action |

## Data normalization boundary

All redesign screens should consume `buildRedesignData(state)` and should not reach into host state names. The adapter must remain the only place that converts:

- issue severity and cost shapes
- AI confidence values from `0..1` or `0..100`
- market comparison fallbacks
- saved inspection history rows
- checklist progress
- recovery and report readiness state

When live data is missing, label demo/fallback data clearly. Never allow demo findings or market values to look like a confirmed production result.

## Screen verification order

1. Home and recovery banner
2. New inspection and VIN
3. Checklist and evidence composer
4. Photo review and camera shell
5. AI processing, review, accept, dismiss, and edit
6. Summary and report readiness
7. Market, cost, test drive, and history tools
8. Negotiation, contract, certificate, and share
9. Saved history, detail, compare, garage
10. Settings, notifications, onboarding, and reduced motion
11. QA-only screens with demo data disabled from consumer routes
