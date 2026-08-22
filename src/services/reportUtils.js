const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

export const formatCurrency = (value) => `$${(Number(value) || 0).toLocaleString('en-US')}`;
export const getLocalSaveLabel = (state) => ({ saving: 'Saving locally…', saved: 'Saved locally', error: 'Save needs attention' }[state] || 'Local mode');
export const getLocalSaveErrorGuidance = (queued = true) => queued ? 'Local save failed. A recovery copy is queued; tap Retry when storage is available.' : 'Local save failed again. Export a backup and try again when storage is available.';
export const getLocalRecoveryBanner = ({ retryCount = 0, saveRetry = false } = {}) => { const count = Math.max(0, Number(retryCount) || 0); if (!count && !saveRetry) return null; return { title: 'Local recovery needed', body: `${count || 1} local operation${(count || 1) === 1 ? '' : 's'} is waiting for retry. Your inspection remains available on this device.`, action: 'Retry local saves' }; };
export const getRecoveryLogEntry = ({ operation = 'Local operation', outcome = 'error', detail = '' } = {}) => ({ operation, outcome, detail: detail || (outcome === 'success' ? 'Completed on this device.' : 'Needs attention or retry.'), at: new Date().toISOString() });
export const getRecoveryLogPresentation = (entry = {}) => ({ title: `${entry.operation || 'Local operation'} · ${entry.outcome === 'success' ? 'Complete' : 'Needs attention'}`, detail: entry.detail || 'No additional details recorded.', at: entry.at || null, tone: entry.outcome === 'success' ? 'success' : 'error' });
export const getRestoreSanitizationNotice = (skippedCount = 0) => { const count = Math.max(0, Number(skippedCount) || 0); return count ? ` ${count} malformed saved record${count === 1 ? '' : 's'} skipped; the remaining data was restored safely.` : ''; };
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

export const buildPhotoEvidenceHtml = (photos = []) => photos.map((photo, index) => {
  const label = escapeHtml(formatPhotoEvidenceLabel(photo, index));
  if (photo.embeddedDataUri) {
    return `<figure style="display:inline-block; vertical-align:top; width:31%; margin:0 1% 14px 0; padding:8px; border:1px solid #D0D5DD; border-radius:10px; box-sizing:border-box"><img src="${photo.embeddedDataUri}" alt="${label}" style="display:block; width:100%; height:120px; object-fit:cover; border-radius:7px"/><figcaption style="margin-top:7px; color:#475467; font-size:10px; line-height:1.35">${label}</figcaption></figure>`;
  }
  return `<span style="display:inline-block; padding:8px 10px; margin:3px; border:1px solid #D0D5DD; border-radius:8px; color:#475467; font-size:11px">${label}</span>`;
}).join('');

export const getRepairPriority = (issue = {}) => ({ critical: 3, major: 2, minor: 1 }[issue.severity] || 0);

export const formatRepairPriorityHtml = (issues = []) => [...issues].sort((a, b) => getRepairPriority(b) - getRepairPriority(a) || (Number(b.cost) || 0) - (Number(a.cost) || 0)).map((issue, index) => `<li><strong>${escapeHtml(issue.severity || 'review').toUpperCase()}</strong> · ${escapeHtml(issue.name || 'Unspecified issue')} · $${Number(issue.cost) || 0}${index === 0 ? ' · address first' : ''}</li>`).join('');

export function buildInspectionReport({ vehicle, issues, checklist, photos, fairPrice, riskScore }) {
  const repairTotal = issues.reduce((sum, issue) => sum + (Number(issue.cost) || 0), 0);
  const completedSections = Object.values(checklist).filter(Boolean).length;
  const criticalCount = issues.filter((issue) => issue.severity === 'critical').length;
  return [
    'CARWISE INSPECTION REPORT',
    `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    `Mileage: ${vehicle.mileage || 'Not provided'}`,
    `Risk score: ${riskScore}/100`,
    `Issues found: ${issues.length} (${criticalCount} critical)`,
    `Estimated repairs: ${formatCurrency(repairTotal)}`,
    `AI fair price: ${formatCurrency(fairPrice)}`,
    `Checklist: ${completedSections}/5 sections complete`,
    `Photo evidence: ${photos.length} item(s)`,
    '',
    'This report is informational and should be confirmed by a qualified mechanic.'
  ].join('\n');
}

export const getPhotoActionGuidance = (photoCount = 0) => { const count = Math.max(0, Number(photoCount) || 0); return count ? `${count} photo${count === 1 ? '' : 's'} ready for AI analysis.` : 'No photos yet. Add at least one photo for stronger AI evidence.' };
export const getPhotoScreenGuidance = (photoCount = 0) => { const count = Math.max(0, Number(photoCount) || 0); return count ? `${count} photo${count === 1 ? '' : 's'} captured. Review or add more evidence before analysis.` : 'No photo evidence yet. Start with the exterior, tires, or engine bay.' };
export const getFunctionalActionLabel = (action, state = 'ready') => { const names = { start: 'Start a new inspection', resume: 'Resume inspection', checklist: 'Begin inspection checklist', analysis: 'Run AI analysis', save: 'Save inspection', photos: 'Add photo evidence' }; const name = names[action] || 'Continue'; return state === 'busy' ? `${name} in progress` : name; };
const hasVehicleDetails = (vehicle = {}) => /^\d{4}$/.test(String(vehicle.year || '').trim()) && Boolean(vehicle.make?.trim()) && Boolean(vehicle.model?.trim());
export const getMainFlowReadiness = ({ vehicle = {}, checklist = {}, photos = [] } = {}) => { const missing = []; if (!hasVehicleDetails(vehicle)) missing.push('vehicle details'); if (Object.keys(checklist).filter((key) => checklist[key]).length < 5) missing.push('checklist'); if (!photos.length) missing.push('photo evidence'); return { ready: missing.length === 0, missing }; };
export const getMediaErrorGuidance = (kind) => kind === 'camera' ? 'Could not open the camera. Check permissions or choose a photo from your library.' : 'Could not open the photo library. Check permissions or try again.';
export const getPermissionGuidance = (kind, status) => { const name = kind === 'camera' ? 'camera' : 'photo library'; return status === 'denied' ? `Carwise cannot access your ${name}. Enable permission in Settings or choose another option.` : `${name[0].toUpperCase()}${name.slice(1)} permission is ready.`; };
export const getToolInputGuidance = (type, value = '') => { if (type !== 'vin') return value ? 'Ready to run this local prototype check.' : 'Add an optional note, then run the check.'; const normalized = String(value).replace(/\s/g, '').toUpperCase(); if (!normalized) return 'Enter a 17-character VIN to validate it locally.'; return normalized.length === 17 ? 'VIN length is valid. Ready to decode.' : `${Math.max(0, 17 - normalized.length)} characters remaining for a valid VIN.`; };
export const getCanceledFlowGuidance = (kind) => { const labels = { camera: 'Camera capture canceled. You can try again or choose a photo from your library.', library: 'Photo selection canceled. Your existing evidence is unchanged.', backup: 'Backup restore canceled. Your existing local inspections are unchanged.' }; return labels[kind] || 'Action canceled. Your existing inspection data is unchanged.' };
