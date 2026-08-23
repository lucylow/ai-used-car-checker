const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

const getSafeMoneyValue = (value) => { const numeric = Number(value); return Number.isFinite(numeric) ? Math.max(0, numeric) : 0; };
const getSafeCount = (value) => { const numeric = Number(value); return Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : 0; };
export const formatCurrency = (value) => `$${getSafeMoneyValue(value).toLocaleString('en-US')}`;
export const getLocalSaveLabel = (state) => ({ saving: 'Saving locally…', saved: 'Saved locally', error: 'Save needs attention' }[state] || 'Local mode');
export const getLocalSaveErrorGuidance = (queued = true) => queued ? 'Local save failed. A recovery copy is queued; tap Retry when storage is available.' : 'Local save failed again. Export a backup and try again when storage is available.';
export const getSettingsSaveErrorGuidance = () => 'Settings could not be saved on this device. Your inspection data is unchanged; try again when storage is available.';
export const getLocalSaveSuccessLabel = ({ pendingCleanupFailed = false, payloadLength = 0 } = {}) => pendingCleanupFailed ? 'Saved locally, but an older pending copy could not be cleared. Retry later.' : payloadLength > 250000 ? 'Inspection is large — keeping a compact local copy' : 'Saved locally';
export const getRestoreSourceLabel = (source) => ({ primary: 'Primary local inspection', pending: 'Pending local recovery copy', imported: 'Imported Carwise backup' }[source] || 'No restore source recorded');
export const getReportProvenanceLabel = (source) => ['primary', 'pending', 'imported'].includes(source) ? `Source context · ${getRestoreSourceLabel(source)}` : '';
export const getLocalRecoveryBanner = ({ retryCount = 0, saveRetry = false } = {}) => { const count = getSafeCount(retryCount); if (!count && !saveRetry) return null; return { title: 'Local recovery needed', body: `${count || 1} local operation${(count || 1) === 1 ? '' : 's'} is waiting for retry. Your inspection remains available on this device.`, action: 'Retry local saves' }; };
export const getRecoveryLogEntry = (input = {}) => { const safe = input && typeof input === 'object' ? input : {}; const operation = typeof safe.operation === 'string' && safe.operation ? safe.operation.slice(0, 80) : 'Local operation'; const outcome = safe.outcome === 'success' ? 'success' : 'error'; const detail = typeof safe.detail === 'string' ? safe.detail.slice(0, 200) : ''; return { operation, outcome, detail: detail || (outcome === 'success' ? 'Completed on this device.' : 'Needs attention or retry.'), at: new Date().toISOString() }; };
export const getRecoveryLogPresentation = (entry = {}) => { const safe = entry && typeof entry === 'object' ? entry : {}; return { title: `${typeof safe.operation === 'string' && safe.operation ? safe.operation : 'Local operation'} · ${safe.outcome === 'success' ? 'Complete' : 'Needs attention'}`, detail: typeof safe.detail === 'string' && safe.detail ? safe.detail : 'No additional details recorded.', at: typeof safe.at === 'string' ? safe.at : null, tone: safe.outcome === 'success' ? 'success' : 'error' }; };
export const getErrorDetail = (error, fallback = 'Unknown error') => { const raw = error?.message || error?.code || error; const detail = typeof raw === 'string' ? raw.trim() : ''; return detail ? detail.slice(0, 160) : fallback; };
export const normalizeRecoveryLog = (entries = []) => (Array.isArray(entries) ? entries : []).filter((entry) => entry && typeof entry === 'object').map((entry) => ({ operation: typeof entry.operation === 'string' ? entry.operation.slice(0, 80) : 'Local operation', outcome: entry.outcome === 'success' ? 'success' : 'error', detail: typeof entry.detail === 'string' ? entry.detail.slice(0, 200) : 'Needs attention or retry.', at: typeof entry.at === 'string' && !Number.isNaN(Date.parse(entry.at)) ? entry.at : null })).slice(-6);
export const filterRecoveryLogEntries = (entries = [], { operation = 'all', outcome = 'all' } = {}) => normalizeRecoveryLog(entries).filter((entry) => (operation === 'all' || entry.operation === operation) && (outcome === 'all' || entry.outcome === outcome));
export const buildDiagnosticExport = ({ recoveryLog = [], retryDiagnostics = [], appVersion = 'unknown' } = {}) => JSON.stringify({ app: 'carwise', diagnosticVersion: 1, appVersion: String(appVersion || 'unknown').slice(0, 40), exportedAt: new Date().toISOString(), privacy: 'Contains operational diagnostics only; no VIN, vehicle, issue, or photo data.', recoveryLog: normalizeRecoveryLog(recoveryLog), retryQueue: (Array.isArray(retryDiagnostics) ? retryDiagnostics : []).filter((item) => item && typeof item === 'object').slice(-6).map((item) => ({ key: typeof item.key === 'string' ? item.key.slice(0, 80) : 'unknown', attempts: Math.max(0, Number(item.attempts) || 0), maxAttempts: Math.max(0, Number(item.maxAttempts) || 0), detail: typeof item.detail === 'string' ? item.detail.slice(0, 160) : 'Needs attention or retry.' })) }, null, 2);
export const getSafeDateLabel = (value, fallback = 'Date unavailable', options = {}) => { if (!value || Number.isNaN(Date.parse(value))) return fallback; try { return new Date(value).toLocaleDateString(undefined, options); } catch { return fallback; } };
export const getRecoveryLogTimeLabel = (at) => { if (!at || Number.isNaN(Date.parse(at))) return 'Time unavailable'; try { return new Date(at).toLocaleString(); } catch { return 'Time unavailable'; } };
export const getRestoreSanitizationNotice = (skippedCount = 0) => { const count = getSafeCount(skippedCount); return count ? ` ${count} malformed saved record${count === 1 ? '' : 's'} skipped; the remaining data was restored safely.` : ''; };
export const getLocalSaveDelay = (restored) => restored ? 300 : 0;
export const getReportErrorGuidance = (kind) => kind === 'pdf' ? 'Could not prepare the PDF report. Try again; the preview is still available.' : 'Could not prepare the shareable report. Try again; the preview is still available.';
export const getReportRetryLabel = (kind) => kind === 'pdf' ? 'Retry PDF export' : 'Retry sharing';
export const getReportActionStatus = (action, outcome = 'working') => { const name = action === 'pdf' ? 'PDF report' : 'text report'; return outcome === 'success' ? `${name} ready` : outcome === 'error' ? `${name} unavailable` : `Preparing ${name}…`; };
export const getDurablePhotoFileName = (fileName = 'inspection.jpg', timestamp = Date.now()) => {
  const safeName = String(fileName || 'inspection.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
  return `carwise-${timestamp}-${safeName}`;
};

export const getProcessingLabel = (kind, state) => { const name = kind === 'photo' ? 'photo' : 'report'; return state === 'working' ? `Processing ${name}…` : state === 'success' ? `${name[0].toUpperCase()}${name.slice(1)} ready` : state === 'error' ? `${name[0].toUpperCase()}${name.slice(1)} unavailable` : ''; };
export const getOperationStatusLabel = (operation, outcome = 'success') => { const name = ({ photo: 'Photo', backup: 'Backup', restore: 'Backup restore', delete: 'Inspection deletion', duplicate: 'Inspection duplicate' }[operation] || 'Local operation'); return outcome === 'working' ? `${name} in progress…` : outcome === 'error' ? `${name} needs attention` : `${name} complete`; };
export const getLocalRestoreErrorGuidance = (reason = 'storage') => reason === 'malformed' ? 'Saved inspection data was invalid. Safe defaults loaded; you can continue and save again.' : 'Local inspection restore unavailable. Continue safely and retry after storage recovers.';
export const getRecoveryGuidance = (operation, outcome = 'error') => { const name = ({ photo: 'photo', backup: 'backup', restore: 'backup restore', report: 'report' }[operation] || 'action'); return outcome === 'error' ? `Could not complete ${name}. Try again when ready.` : `Your ${name} is ready.`; };
export const getMotionDuration = (baseDuration, intensity = 'standard', reduceMotion = false) => { if (reduceMotion) return 0; const base = Math.max(0, Number(baseDuration) || 0); const multiplier = intensity === 'gentle' ? 1.35 : intensity === 'lively' ? 0.7 : 1; return Math.max(40, Math.round(base * multiplier)); };
export const getMotionFeedbackOpacity = (reduceMotion = false) => reduceMotion ? 1 : 0.72;
export const getRecentRecoveryEntries = (entries, limit = 3) => Array.isArray(entries) ? entries.slice().reverse().slice(0, Math.max(0, Number(limit) || 0)) : [];
export const normalizeCarwiseSettings = (value, fallback = { compactMode: false, aiDisclosure: true, motionIntensity: 'standard' }) => { const source = value && typeof value === 'object' ? value : {}; return { compactMode: Boolean(source.compactMode), aiDisclosure: source.aiDisclosure !== false, motionIntensity: ['gentle', 'standard', 'lively'].includes(source.motionIntensity) ? source.motionIntensity : fallback.motionIntensity }; };
export const getOnboardingActionDestination = (action) => action === 'decode-vin' ? 'vin' : 'new';
export const getVinWalkthroughStep = ({ value = '', status = '', busy = false } = {}) => { const normalized = String(value || '').replace(/[^a-zA-Z0-9]/g, ''); if (busy) return { index: 2, title: 'Checking your VIN', detail: 'We are validating the identifier and requesting vehicle details.' }; if (status === 'decoded') return { index: 3, title: 'VIN decoded', detail: 'Review the returned identity before using it in your inspection.' }; if (status === 'error') return { index: 1, title: 'Review the VIN', detail: 'Correct the highlighted identifier and try the lookup again.' }; if (normalized.length === 17) return { index: 2, title: 'Ready to check', detail: 'Your VIN has 17 characters. Start the lookup when ready.' }; if (normalized.length) return { index: 1, title: 'Enter the full VIN', detail: `${normalized.length}/17 characters entered. The lookup needs all 17 characters.` }; return { index: 0, title: 'Find the VIN', detail: 'Look through the windshield or inside the driver-side door frame.' }; };
export const getOnboardingTransitionOffset = (nextStep, previousStep = 0) => Number(nextStep) >= Number(previousStep) ? 16 : -16;
export const getOnboardingProgressPercent = (step, total = 3) => { const safeStep = Math.max(0, Number(step) || 0); const safeTotal = Math.max(1, Number(total) || 1); return Math.min(100, Math.max(0, ((safeStep + 1) / safeTotal) * 100)); };
export const getAnimatedProgressPercent = (completed, total = 5) => { const safeCompleted = Math.max(0, Number(completed) || 0); const safeTotal = Math.max(1, Number(total) || 1); return Math.min(100, Math.max(8, (safeCompleted / safeTotal) * 100)); };
export const getProgressSummaryLabel = (completed, total) => { const safeCompleted = Math.max(0, Number(completed) || 0); const safeTotal = Math.max(0, Number(total) || 0); if (!safeTotal) return 'No sections yet'; if (safeCompleted >= safeTotal) return `All ${safeTotal} sections complete`; return `${safeCompleted} of ${safeTotal} sections complete`; };
export const getChecklistGuidance = (completed, total) => { const safeCompleted = Math.max(0, Number(completed) || 0); const safeTotal = Math.max(0, Number(total) || 0); if (!safeTotal || safeCompleted >= safeTotal) return 'All sections complete — ready to save.'; const remaining = safeTotal - safeCompleted; return `${remaining} section${remaining === 1 ? '' : 's'} remaining. You can save and finish later.`; };
export const getInspectionNavigationLabel = (destination, action = 'back') => { const names = { home: 'Home', new: 'Vehicle details', checklist: 'Inspection checklist', photos: 'Inspection photos', ai: 'AI analysis', summary: 'Inspection summary' }; const name = names[destination] || 'previous screen'; return action === 'resume' ? 'Resume inspection' : `Back to ${name}`; };
export const getInspectionActionGuidance = ({ photoCount = 0, reportReady = false } = {}) => { if (!reportReady) return photoCount ? 'Finish the required sections before sharing your report.' : 'Complete the checklist and add photo evidence before sharing.'; return photoCount ? `${photoCount} photo${photoCount === 1 ? '' : 's'} attached · report ready to share.` : 'Report ready to share; add photos for stronger evidence.'; };

export const formatPhotoEvidenceLabel = (photo = {}, index = 0) => {
  const name = photo.fileName ? ` · ${photo.fileName}` : '';
  const dimensions = photo.width && photo.height ? ` · ${photo.width}×${photo.height}` : '';
  const source = photo.embeddedDataUri ? ' · embedded image' : photo.uri ? ' · local asset unavailable for embed' : ' · metadata only';
  return `Photo ${index + 1}${name}${dimensions}${source}`;
};

export const buildPhotoEvidenceHtml = (photos = []) => (Array.isArray(photos) ? photos : []).filter((photo) => photo && typeof photo === 'object').map((photo, index) => {
  const label = escapeHtml(formatPhotoEvidenceLabel(photo, index));
  if (photo.embeddedDataUri) {
    return `<figure style="display:inline-block; vertical-align:top; width:31%; margin:0 1% 14px 0; padding:8px; border:1px solid #D0D5DD; border-radius:10px; box-sizing:border-box"><img src="${photo.embeddedDataUri}" alt="${label}" style="display:block; width:100%; height:120px; object-fit:cover; border-radius:7px"/><figcaption style="margin-top:7px; color:#475467; font-size:10px; line-height:1.35">${label}</figcaption></figure>`;
  }
  return `<span style="display:inline-block; padding:8px 10px; margin:3px; border:1px solid #D0D5DD; border-radius:8px; color:#475467; font-size:11px">${label}</span>`;
}).join('');

export const getRepairPriority = (issue = {}) => ({ critical: 3, major: 2, minor: 1 }[issue.severity] || 0);

export const formatRepairPriorityHtml = (issues = []) => (Array.isArray(issues) ? issues : []).filter((issue) => issue && typeof issue === 'object').sort((a, b) => getRepairPriority(b) - getRepairPriority(a) || getSafeMoneyValue(b.cost) - getSafeMoneyValue(a.cost)).map((issue, index) => `<li><strong>${escapeHtml(issue.severity || 'review').toUpperCase()}</strong> · ${escapeHtml(issue.name || 'Unspecified issue')} · ${formatCurrency(issue.cost)}${index === 0 ? ' · address first' : ''}</li>`).join('');

export function buildInspectionReport({ vehicle = {}, issues = [], checklist = {}, photos = [], toolNotes = {}, fairPrice, riskScore } = {}) {
  const safeVehicle = vehicle && typeof vehicle === 'object' && !Array.isArray(vehicle) ? vehicle : {};
  const safeIssues = Array.isArray(issues) ? issues.filter((issue) => issue && typeof issue === 'object') : [];
  const safeChecklist = checklist && typeof checklist === 'object' && !Array.isArray(checklist) ? checklist : {};
  const safePhotos = Array.isArray(photos) ? photos.filter((photo) => photo && typeof photo === 'object') : [];
  const repairTotal = safeIssues.reduce((sum, issue) => sum + getSafeMoneyValue(issue.cost), 0);
  const completedSections = Object.values(safeChecklist).filter(Boolean).length;
  const criticalCount = safeIssues.filter((issue) => issue.severity === 'critical').length;
  const safeToolNotes = toolNotes && typeof toolNotes === 'object' && !Array.isArray(toolNotes) ? [['market', 'Market comparison'], ['history', 'Vehicle history'], ['test', 'Test drive']].map(([key, label]) => { const entry = toolNotes[key]; const note = typeof entry === 'string' ? entry : entry && typeof entry.note === 'string' ? entry.note : ''; const source = entry && typeof entry === 'object' && typeof entry.source === 'string' ? entry.source.slice(0, 80) : 'User-entered observation'; const savedAt = entry && typeof entry === 'object' && typeof entry.savedAt === 'string' && !Number.isNaN(Date.parse(entry.savedAt)) ? ` · ${entry.savedAt}` : ''; return note.trim() ? `${label}: ${note.trim().slice(0, 1000)} · ${source}${savedAt}` : ''; }).filter(Boolean) : [];
  return [
    'CARWISE INSPECTION REPORT',
    `${safeVehicle.year || ''} ${safeVehicle.make || ''} ${safeVehicle.model || ''}`.trim() || 'Vehicle details unavailable',
    `Mileage: ${safeVehicle.mileage || 'Not provided'}`,
    `Risk score: ${riskScore}/100`,
    `Issues found: ${safeIssues.length} (${criticalCount} critical)`,
    `Estimated repairs: ${formatCurrency(repairTotal)}`,
    `AI fair price: ${Number.isFinite(Number(fairPrice)) && Number(fairPrice) > 0 ? formatCurrency(fairPrice) : 'Unavailable until AI analysis is completed'}`,
    `Checklist: ${completedSections}/5 sections complete`,
    `Photo evidence: ${safePhotos.length} item(s)`,
    safeToolNotes.length ? ['', 'FIELD NOTES', ...safeToolNotes] : '',
    '',
    'This report is informational and should be confirmed by a qualified mechanic.'
  ].join('\n');
}

export const getPhotoActionGuidance = (photoCount = 0) => { const count = Math.max(0, Number(photoCount) || 0); return count ? `${count} photo${count === 1 ? '' : 's'} ready for AI analysis.` : 'No photos yet. Add at least one photo for stronger AI evidence.' };
export const getPhotoScreenGuidance = (photoCount = 0) => { const count = Math.max(0, Number(photoCount) || 0); return count ? `${count} photo${count === 1 ? '' : 's'} captured. Review or add more evidence before analysis.` : 'No photo evidence yet. Start with the exterior, tires, or engine bay.' };
export const getFunctionalActionLabel = (action, state = 'ready') => { const names = { start: 'Start a new inspection', resume: 'Resume inspection', checklist: 'Begin inspection checklist', analysis: 'Run AI analysis', save: 'Save inspection', photos: 'Add photo evidence' }; const name = names[action] || 'Continue'; return state === 'busy' ? `${name} in progress` : name; };
const hasVehicleDetails = (vehicle = {}) => { const safeVehicle = vehicle && typeof vehicle === 'object' && !Array.isArray(vehicle) ? vehicle : {}; return /^\d{4}$/.test(String(safeVehicle.year || '').trim()) && Boolean(String(safeVehicle.make || '').trim()) && Boolean(String(safeVehicle.model || '').trim()); };
export const getMainFlowReadiness = (input = {}) => { const safeInput = input && typeof input === 'object' && !Array.isArray(input) ? input : {}; const { vehicle = {}, checklist = {}, photos = [] } = safeInput; const safeChecklist = checklist && typeof checklist === 'object' && !Array.isArray(checklist) ? checklist : {}; const safePhotos = Array.isArray(photos) ? photos : []; const missing = []; if (!hasVehicleDetails(vehicle)) missing.push('vehicle details'); if (Object.keys(safeChecklist).filter((key) => safeChecklist[key]).length < 5) missing.push('checklist'); if (!safePhotos.length) missing.push('photo evidence'); return { ready: missing.length === 0, missing }; };
export const getMediaErrorGuidance = (kind) => kind === 'camera' ? 'Could not open the camera. Check permissions or choose a photo from your library.' : 'Could not open the photo library. Check permissions or try again.';
export const getPermissionGuidance = (kind, status) => { const name = kind === 'camera' ? 'camera' : 'photo library'; return status === 'denied' ? `Carwise cannot access your ${name}. Enable permission in Settings or choose another option.` : `${name[0].toUpperCase()}${name.slice(1)} permission is ready.`; };
export const getToolInputGuidance = (type, value = '') => { if (type !== 'vin') return value ? 'Ready to run this local prototype check.' : 'Add an optional note, then run the check.'; const normalized = String(value).replace(/\s/g, '').toUpperCase(); if (!normalized) return 'Enter a 17-character VIN to validate it locally.'; return normalized.length === 17 ? 'VIN length is valid. Ready to decode.' : `${Math.max(0, 17 - normalized.length)} characters remaining for a valid VIN.`; };
export const getCanceledFlowGuidance = (kind) => { const labels = { camera: 'Camera capture canceled. You can try again or choose a photo from your library.', library: 'Photo selection canceled. Your existing evidence is unchanged.', backup: 'Backup restore canceled. Your existing local inspections are unchanged.' }; return labels[kind] || 'Action canceled. Your existing inspection data is unchanged.' };
export const getAiErrorGuidance = (kind = 'analysis') => { const labels = { analysis: 'AI analysis could not be completed. Check the inspection details and try again; your existing findings are unchanged.', accept: 'AI findings could not be added. Review the suggested findings and try again; your existing issues are unchanged.', dismiss: 'AI suggestions could not be dismissed cleanly. Reopen the analysis and try again; your existing issues are unchanged.' }; return labels[kind] || labels.analysis; };

export const toggleReportSection = (sections = {}, section) => {
  const safe = sections && typeof sections === 'object' && !Array.isArray(sections) ? sections : {};
  if (!['summary', 'evidence'].includes(section)) return { summary: Boolean(safe.summary), evidence: Boolean(safe.evidence) };
  return { summary: Boolean(safe.summary), evidence: Boolean(safe.evidence), [section]: !Boolean(safe[section]) };
};

export const getSavedInspectionDisplayName = (vehicle = {}) => {
  const safe = vehicle && typeof vehicle === 'object' && !Array.isArray(vehicle) ? vehicle : {};
  const parts = [safe.year, safe.make, safe.model].map((value) => String(value || '').trim()).filter(Boolean);
  return parts.length ? parts.join(' ') : 'Saved inspection';
};

export const getReportActionState = ({ busy = false, action = '', retry = '', retryKind = 'text' } = {}) => {
  const safeKind = retryKind === 'pdf' ? 'pdf' : 'text';
  return {
    busy: Boolean(busy),
    primaryLabel: String(action || '').trim() || 'Export PDF report',
    retryVisible: Boolean(retry) && !Boolean(busy),
    retryLabel: getReportRetryLabel(safeKind),
    retryKind: safeKind,
    closeLabel: 'Done',
  };
};

export const getReportPreviewCloseState = () => ({ reportPreview: '', reportAction: '', reportBusy: false, reportRetry: false, reportRetryKind: '' });
export const getReportActionStartState = () => ({ reportRetry: false, reportRetryKind: '' });

export const getRestoreSourceForFlow = (source = '', flow = 'restored') => {
  if (flow === 'new' || flow === 'decoded') return '';
  return ['primary', 'pending', 'imported'].includes(source) ? source : '';
};
