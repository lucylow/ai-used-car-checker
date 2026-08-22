const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

export const formatCurrency = (value) => `$${(Number(value) || 0).toLocaleString('en-US')}`;
export const getLocalSaveLabel = (state) => ({ saving: 'Saving locally…', saved: 'Saved locally', error: 'Save needs attention' }[state] || 'Local mode');
export const getReportActionStatus = (action, outcome = 'working') => { const name = action === 'pdf' ? 'PDF report' : 'text report'; return outcome === 'success' ? `${name} ready` : outcome === 'error' ? `${name} unavailable` : `Preparing ${name}…`; };
export const getProcessingLabel = (kind, state) => { const name = kind === 'photo' ? 'photo' : 'report'; return state === 'working' ? `Processing ${name}…` : state === 'success' ? `${name[0].toUpperCase()}${name.slice(1)} ready` : state === 'error' ? `${name[0].toUpperCase()}${name.slice(1)} unavailable` : ''; };
export const getOperationStatusLabel = (operation, outcome = 'success') => { const name = ({ photo: 'Photo', backup: 'Backup', restore: 'Backup restore', delete: 'Inspection deletion', duplicate: 'Inspection duplicate' }[operation] || 'Local operation'); return outcome === 'working' ? `${name} in progress…` : outcome === 'error' ? `${name} needs attention` : `${name} complete`; };
export const getRecoveryGuidance = (operation, outcome = 'error') => { const name = ({ photo: 'photo', backup: 'backup', restore: 'backup restore', report: 'report' }[operation] || 'action'); return outcome === 'error' ? `Could not complete ${name}. Try again when ready.` : `Your ${name} is ready.`; };
export const getProgressSummaryLabel = (completed, total) => { const safeCompleted = Math.max(0, Number(completed) || 0); const safeTotal = Math.max(0, Number(total) || 0); if (!safeTotal) return 'No sections yet'; if (safeCompleted >= safeTotal) return `All ${safeTotal} sections complete`; return `${safeCompleted} of ${safeTotal} sections complete`; };
export const getChecklistGuidance = (completed, total) => { const safeCompleted = Math.max(0, Number(completed) || 0); const safeTotal = Math.max(0, Number(total) || 0); if (!safeTotal || safeCompleted >= safeTotal) return 'All sections complete — ready to save.'; const remaining = safeTotal - safeCompleted; return `${remaining} section${remaining === 1 ? '' : 's'} remaining. You can save and finish later.`; };

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
