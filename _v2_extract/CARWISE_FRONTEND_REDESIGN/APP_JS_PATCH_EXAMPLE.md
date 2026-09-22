# Minimal App.js Bridge Example

This is a guide, not a blind find/replace. Cursor should inspect the existing `App.js` and map exact function names.

```jsx
import { RedesignShell } from './src/redesign';

// Inside App(), after the existing state/functions are declared:
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

const redesignActions = {
  onNavigate: setScreen,
  onBack: () => setScreen('home'),
  onStartInspection: startInspection,
  onResumeInspection: () => setScreen('checklist'),
  onRunAnalysis: runAnalysis,
  onAcceptAiFindings: acceptAiFindings,
  onDismissAiFindings: dismissAiFindings,
  onSaveInspection: saveInspection,
  onRetry: retryLocalSave,
  onExportReport: exportReportPdf,
  onOpenSettings: () => setScreen('settings'),
  onNotifications: () => setScreen('notifications'),
  onOpenVin: () => setScreen('vin'),
  onOpenMedia: () => setScreen('photos'),
};

const USE_REDESIGN = true;

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

Important: connect existing media handlers (`ImagePicker`, documents, notes, PDF sharing) instead of creating duplicate implementations.
