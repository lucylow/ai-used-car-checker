export function buildInspectionReport() {
  return { title: 'Inspection report', findings: [] };
}

export function buildPhotoEvidenceHtml() {
  return '<html><body></body></html>';
}

export function formatCurrency(value) {
  const amount = Number(value || 0);
  return `$${amount.toLocaleString()}`;
}

export function formatRepairPriorityHtml() {
  return '<span>Review</span>';
}

export function getInspectionActionGuidance() {
  return 'Review inspection findings';
}

export function getCanceledFlowGuidance() {
  return 'The workflow was canceled.';
}

export function getFunctionalActionLabel() {
  return 'Continue';
}

export function getInspectionNavigationLabel() {
  return 'Inspection';
}

export function getLocalSaveLabel() {
  return 'Save locally';
}

export function getLocalSaveDelay() {
  return 0;
}

export function getRestoreSourceLabel() {
  return 'Manual restore';
}

export function getMainFlowReadiness() {
  return { ready: true, reasons: [] };
}

export function getPhotoActionGuidance() {
  return 'Add photos';
}

export function getOperationStatusLabel() {
  return 'Ready';
}

export function getMediaErrorGuidance() {
  return 'Media issue';
}

export function getPermissionGuidance() {
  return 'Permissions required';
}

export function getToolInputGuidance() {
  return 'Provide input';
}

export function getProgressSummaryLabel() {
  return 'Progress';
}

export function getRecoveryGuidance() {
  return 'Recovery available';
}

export function getLocalSaveErrorGuidance() {
  return 'Could not save locally';
}

export function getLocalRecoveryBanner() {
  return null;
}

export function getRecoveryLogEntry() {
  return { operation: 'Inspect', outcome: 'success' };
}

export function getRestoreSanitizationNotice() {
  return 'Restore is safe';
}

export function getLocalRestoreErrorGuidance() {
  return 'Could not restore locally';
}

export function getReportErrorGuidance() {
  return 'Could not generate report';
}

export function getReportActionStatus() {
  return 'idle';
}

export function getProcessingLabel() {
  return 'Processing';
}

export function getDurablePhotoFileName() {
  return 'photo.jpg';
}

export function getOnboardingProgressPercent() {
  return 0;
}

export function getOnboardingActionDestination() {
  return 'home';
}

export function getOnboardingTransitionOffset() {
  return 0;
}

export function getRecentRecoveryEntries() {
  return [];
}

export function normalizeCarwiseSettings(value) {
  return value || {};
}

export function getMotionDuration() {
  return 200;
}

export function getMotionFeedbackOpacity() {
  return 1;
}

export function getAnimatedProgressPercent() {
  return 0;
}

export function getErrorDetail() {
  return 'No error details';
}

export function normalizeRecoveryLog(value) {
  return Array.isArray(value) ? value : [];
}

export function getAiErrorGuidance() {
  return 'AI guidance unavailable';
}

export function buildDiagnosticExport() {
  return JSON.stringify({});
}

export function getSafeDateLabel(value, fallback = 'Unavailable') {
  return value || fallback;
}

export function toggleReportSection() {
  return null;
}

export function getRestoreSourceForFlow() {
  return 'local';
}

export function getReportProvenanceLabel() {
  return 'Local report';
}

export function getReportPreviewCloseState() {
  return 'closed';
}

export function getReportActionStartState() {
  return 'idle';
}

export function getSettingsSaveErrorGuidance() {
  return 'Settings could not be saved';
}

export function getLocalSaveSuccessLabel() {
  return 'Saved';
}

export function getLocalSaveIndicator() {
  return { status: 'idle' };
}

export function isSettingsPersistenceReady() {
  return true;
}

export function shouldScheduleLocalPersistence() {
  return false;
}

export function isCurrentPersistenceGeneration() {
  return true;
}

export function getTransientTimerCleanupKeys() {
  return [];
}

export function getNextPersistenceGeneration() {
  return 1;
}

export function isCurrentActionGeneration() {
  return true;
}

export function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
