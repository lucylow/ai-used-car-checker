import test from 'node:test';
import assert from 'node:assert/strict';
import { createNewInspectionState, getDerivedInspectionResetState, getRepairTotal, getRiskScore, isSameIssue, isValidVin, normalizeVin, normalizeActiveInspection } from '../src/services/inspectionUtils.js';
import { buildInspectionReport, buildPhotoEvidenceHtml, formatPhotoEvidenceLabel, formatRepairPriorityHtml, getCanceledFlowGuidance, getChecklistGuidance, getDurablePhotoFileName, getFunctionalActionLabel, getInspectionActionGuidance, getInspectionNavigationLabel, getLocalSaveDelay, getMainFlowReadiness, getPhotoActionGuidance, getPhotoScreenGuidance, getLocalSaveLabel, getRestoreSourceLabel, getLocalRestoreErrorGuidance, getLocalSaveErrorGuidance, getLocalRecoveryBanner, getRecoveryLogEntry, getRestoreSanitizationNotice, getMediaErrorGuidance, getErrorDetail, normalizeRecoveryLog, filterRecoveryLogEntries, buildDiagnosticExport, getSafeDateLabel, getRecoveryLogTimeLabel, getReportErrorGuidance, getOperationStatusLabel, getProcessingLabel, getProgressSummaryLabel, getOnboardingProgressPercent, getOnboardingActionDestination, getOnboardingTransitionOffset, getRecentRecoveryEntries, getVinWalkthroughStep, normalizeCarwiseSettings, getMotionDuration, getAnimatedProgressPercent, getRecoveryGuidance, getRecoveryLogPresentation, getReportRetryLabel, getAiErrorGuidance, toggleReportSection, getSavedInspectionDisplayName, getReportActionState, getReportPreviewCloseState, getReportActionStartState, getSettingsSaveErrorGuidance, getLocalSaveSuccessLabel, getRestoreSourceForFlow, getReportProvenanceLabel } from '../src/services/reportUtils.js';
import { getBackupMetadata, getBackupSummary, parseInspectionBackup, selectInspectionRestorePayload, serializeInspectionBackup, upsertToolNote, removeToolNote, getToolNoteTimeline, filterToolNoteTimeline, filterToolNoteTimelineBySource } from '../src/services/backupUtils.js';
import { clearVinCache, decodeVin } from '../src/services/vinService.js';
import { clearRetry, clearRetryQueue, enqueueRetry, flushRetryQueue, getRetryDiagnostics, getRetryQueueSize } from '../src/services/retryQueue.js';
import { buildAiAnalysis, getAiConfidenceLabel, getAiEvidenceActions, getAiFindingExplanation, getAiQualitySummary, getAiReadinessMessage, getAiPriorityPlan, getPhotoEvidenceReview, filterPhotoEvidenceReviews, updatePhotoReview, buildPhotoFindingDraft, patchIssueByName, getAiRecommendation, getEvidenceAudit, mergeAiFindings, resetAiHistory, getAiAnalysisStartState, canReviewAiFindings, getAiReviewStateAfterIssueMutation } from '../src/services/aiUtils.js';
import { formatComparisonMetricValue, getBackupPreviewRows, getIssueEvidencePhoto, getPhotoDeleteGuidance, getEvidenceHealth, replacePhotoAsset, normalizePhotoAssets, getNavigationOverlayCleanup, isPhotoActionLocked, getPhotoCount, getStablePhotoKey } from '../src/services/uiUtils.js';
import { filterAndSortInspections, getHistoryActionMessage, getInspectionCompletion, getInspectionRiskLabel, getInspectionRepairTotal, getInspectionComparison, getComparisonMetricRows, getReportReadiness, normalizeSavedInspection, shouldClearSavedSelection, shouldReplaceSavedInspection, pruneComparisonSelection, getSavedIssueDisplay } from '../src/services/historyUtils.js';

test('formats actionable AI failure guidance for each recovery path', () => {
  assert.match(getAiErrorGuidance('analysis'), /existing findings are unchanged/i);
  assert.match(getAiErrorGuidance('accept'), /existing issues are unchanged/i);
  assert.match(getAiErrorGuidance('dismiss'), /Reopen the analysis/i);
  assert.equal(getAiErrorGuidance('unknown'), getAiErrorGuidance('analysis'));
});

test('derives transparent AI analysis from inspection evidence', () => {
  const result = buildAiAnalysis({ vehicle: { asking: '$21,900', vin: '1HGCM82633A004352' }, issues: [{ name: 'Brake pad wear', severity: 'major', cost: 420 }], checklist: { Exterior: true, Tires: true, Engine: true, Interior: true, Test: true }, photos: [{ uri: 'file://one.jpg' }, { uri: 'file://two.jpg' }] });
  assert.equal(result.evidence.score, 80);
  assert.equal(result.confidence, 89);
  assert.equal(result.fairPrice, 21456);
  assert.match(result.negotiation, /repair estimate/);
});

test('summarizes AI quality from evidence and vehicle identity', () => {
  const early = getAiQualitySummary({ evidence: { score: 40, completedSections: 1, photoCount: 0 }, vehicle: {} });
  const strong = getAiQualitySummary({ evidence: { score: 100, completedSections: 5, photoCount: 4 }, vehicle: { vin: '1HGCM82633A004352' } });
  assert.ok(strong.score > early.score);
  assert.equal(early.label, 'Early signal only');
  assert.match(strong.drivers.join(' '), /5\/5|4 usable photos|VIN identified/);
  assert.match(strong.nextStep, /Verify critical findings/i);
});

test('keeps AI evidence changes interpretable for a confidence timeline', () => {
  const early = buildAiAnalysis({ vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, checklist: {}, photos: [] });
  const later = buildAiAnalysis({ vehicle: { year: '2020', make: 'Honda', model: 'Accord', vin: '1HGCM82633A004352' }, checklist: { Exterior: true, Tires: true, Engine: true, Interior: true, Test: true }, photos: [{ uri: 'file://one.jpg' }] });
  assert.ok(later.confidence > early.confidence);
  assert.ok(later.quality.score > early.quality.score);
  assert.equal(later.quality.drivers.length, 3);
});

test('maps missing AI evidence to direct completion actions', () => {
  const actions = getAiEvidenceActions({ missing: ['clear photo evidence', '4 checklist sections', 'asking price', 'clear photo evidence'] });
  assert.deepEqual(actions.map((action) => action.key), ['photos', 'checklist', 'asking']);
  assert.deepEqual(actions.map((action) => action.target), ['photos', 'checklist', 'new']);
});

test('audits AI evidence into confirmed, suggested, and missing signals', () => {
  const audit = getEvidenceAudit({ vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, checklist: { Exterior: true }, photos: [], issues: [{ name: 'Brake issue' }], pendingFindings: [{ name: 'Rust underneath' }] });
  assert.match(audit.confirmed.join(' '), /Vehicle identity|1\/5|1 recorded issue/);
  assert.deepEqual(audit.suggested, ['Rust underneath']);
  assert.match(audit.missing.join(' '), /photo|checklist|asking/i);
});

test('links AI priorities to usable evidence photos when available', () => {
  const withPhoto = getAiPriorityPlan({ issues: [{ name: 'Brake issue', severity: 'major', cost: 420 }], evidenceScore: 70, photos: [{ id: 'photo-1', uri: 'file://brake.jpg' }] });
  const withoutPhoto = getAiPriorityPlan({ issues: [{ name: 'Brake issue', severity: 'major', cost: 420 }], evidenceScore: 40, photos: [] });
  assert.equal(withPhoto[0].photoId, 'photo-1');
  assert.equal(withoutPhoto[0].photoId, null);
});

test('builds a severity-first explainable AI action plan', () => {
  const plan = getAiPriorityPlan({ issues: [{ name: 'Cosmetic scratch', severity: 'minor', cost: 150 }, { name: 'Brake issue', severity: 'major', cost: 420 }], evidenceScore: 60 });
  assert.deepEqual(plan.map((item) => item.name), ['Brake issue', 'Cosmetic scratch']);
  assert.match(plan[0].why, /Major concern.*420.*60%/);
  assert.match(plan[0].nextAction, /service records|repair estimate/i);
});

test('updates AI confidence as inspection evidence improves', () => {
  const before = buildAiAnalysis({ vehicle: {}, checklist: { Exterior: true }, photos: [] });
  const after = buildAiAnalysis({ vehicle: { vin: '1HGCM82633A004352' }, checklist: { Exterior: true, Tires: true, Engine: true, Interior: true, Test: true }, photos: [{ uri: 'file://photo.jpg' }, { uri: 'file://photo2.jpg' }] });
  assert.ok(after.evidence.score > before.evidence.score);
  assert.ok(after.confidence > before.confidence);
});

test('tiers AI recommendations into actionable next steps', () => {
  assert.equal(getAiRecommendation({ issues: [{ severity: 'critical' }], repairTotal: 850, confidence: 80, evidenceScore: 80 }).tier, 'PAUSE');
  assert.equal(getAiRecommendation({ issues: [{ severity: 'major' }], repairTotal: 420, confidence: 80, evidenceScore: 80 }).tier, 'NEGOTIATE');
  assert.equal(getAiRecommendation({ issues: [], repairTotal: 0, confidence: 40, evidenceScore: 40 }).tier, 'GATHER MORE');
  assert.equal(getAiRecommendation({ issues: [], repairTotal: 0, confidence: 80, evidenceScore: 80 }).tier, 'PROCEED');
});

test('explains AI finding confidence and evidence drivers', () => {
  const result = buildAiAnalysis({ vehicle: { asking: '21900' }, checklist: { Exterior: true }, photos: [{ uri: 'file://photo.jpg' }] });
  assert.equal(result.findings.length, 1);
  assert.match(getAiFindingExplanation(result.findings[0]), /confidence|usable photo|Confirm in person/i);
});

test('merges user-confirmed AI findings without duplicates', () => {
  const merged = mergeAiFindings([{ name: 'Brake pad wear' }], [{ name: 'Rust underneath' }, { name: 'Brake pad wear' }, {}]);
  assert.deepEqual(merged.map((issue) => issue.name), ['Brake pad wear', 'Rust underneath']);
});

test('labels AI confidence and readiness honestly', () => {
  assert.equal(getAiConfidenceLabel(80), 'Higher confidence');
  assert.equal(getAiConfidenceLabel(60), 'Moderate confidence');
  assert.equal(getAiConfidenceLabel(40), 'Limited confidence');
  assert.match(getAiReadinessMessage({ photoCount: 0, completedSections: 0 }), /checklist.*photo/i);
  assert.match(getAiReadinessMessage({ photoCount: 1, completedSections: 3 }), /3\/5/);
});

test('formats actionable report preparation error guidance', () => {
  assert.match(getReportErrorGuidance('pdf'), /PDF|preview|again/);
  assert.match(getReportErrorGuidance('share'), /shareable|preview|again/);
});

test('formats actionable media API error guidance', () => {
  assert.match(getMediaErrorGuidance('camera'), /camera|permissions|library/);
  assert.match(getMediaErrorGuidance('library'), /library|permissions|again/);
});

test('formats actionable local restore error guidance', () => {
  assert.match(getLocalRestoreErrorGuidance('malformed'), /invalid|Safe defaults/);
  assert.match(getLocalRestoreErrorGuidance('storage'), /unavailable|retry/);
});

test('formats restore review notice states consistently', () => {
  assert.equal(getRestoreSanitizationNotice(0), '');
  assert.match(`Local data restored safely.${getRestoreSanitizationNotice(2)}`, /2 malformed saved records skipped/);
});

test('formats restore sanitization notices consistently', () => {
  assert.equal(getRestoreSanitizationNotice(0), '');
  assert.match(getRestoreSanitizationNotice(1), /1 malformed saved record skipped/);
  assert.match(getRestoreSanitizationNotice(3), /3 malformed saved records skipped/);
});

test('handles malformed backup and recovery-log inputs safely', () => {
  assert.throws(() => parseInspectionBackup('not-json'), /not valid JSON/);
  assert.throws(() => parseInspectionBackup(''), /empty/);
  assert.equal(getBackupSummary({}), '0 saved inspections · 0 active photos');
  assert.equal(getRecoveryLogTimeLabel('not-a-date'), 'Time unavailable');
  assert.match(getRecoveryLogTimeLabel('2026-01-01T00:00:00.000Z'), /2026/);
});

test('normalizes retry diagnostics and recovery logs safely', async () => {
  clearRetryQueue();
  enqueueRetry({ key: 'diagnostic', maxAttempts: 2, run: async () => { throw new Error('network unavailable'); } });
  await flushRetryQueue();
  assert.equal(getRetryDiagnostics()[0].detail, 'network unavailable');
  const normalized = normalizeRecoveryLog([{ operation: 'Local save', outcome: 'success', detail: 'ok', at: '2026-01-01' }, null, { operation: 42, detail: 'x'.repeat(300) }]);
  assert.equal(normalized.length, 2);
  assert.equal(normalized[1].operation, 'Local operation');
  assert.equal(normalized[1].detail.length, 200);
  clearRetryQueue();
});

test('normalizes error details with safe bounded fallbacks', () => {
  assert.equal(getErrorDetail({ message: 'Storage unavailable' }), 'Storage unavailable');
  assert.equal(getErrorDetail({ code: 'E_STORAGE' }), 'E_STORAGE');
  assert.equal(getErrorDetail(null, 'fallback reason'), 'fallback reason');
  assert.equal(getErrorDetail({ message: 'x'.repeat(300) }).length, 160);
});

test('formats invalid persisted dates with safe fallbacks', () => {
  assert.equal(getSafeDateLabel('2026-01-15T00:00:00.000Z'), new Date('2026-01-15T00:00:00.000Z').toLocaleDateString());
  assert.equal(getSafeDateLabel('not-a-date'), 'Date unavailable');
  assert.equal(getSafeDateLabel(null, 'Time unavailable'), 'Time unavailable');
});

test('filters recovery logs by operation and outcome without exposing malformed entries', () => {
  const entries = [{ operation: 'Local save', outcome: 'success', detail: 'Saved.' }, { operation: 'Backup restore', outcome: 'error', detail: 'Invalid JSON.' }, null, { operation: 42 }];
  assert.equal(filterRecoveryLogEntries(entries).length, 3);
  assert.equal(filterRecoveryLogEntries(entries, { operation: 'Local save' }).length, 1);
  assert.equal(filterRecoveryLogEntries(entries, { outcome: 'error' }).length, 2);
  assert.equal(filterRecoveryLogEntries(entries, { operation: 'Backup restore', outcome: 'success' }).length, 0);
  assert.equal(filterRecoveryLogEntries(null).length, 0);
});

test('builds privacy-safe diagnostic exports from bounded operational data', () => {
  const raw = buildDiagnosticExport({ appVersion: '1.0.0', recoveryLog: [{ operation: 'Local save', outcome: 'error', detail: 'Storage unavailable', at: '2026-01-01T00:00:00.000Z' }], retryDiagnostics: [{ key: 'save', attempts: 2, maxAttempts: 3, detail: 'retrying' }] });
  const parsed = JSON.parse(raw);
  assert.equal(parsed.recoveryLog.length, 1);
  assert.equal(parsed.retryQueue[0].attempts, 2);
  assert.match(parsed.privacy, /operational diagnostics only/i);
  assert.doesNotMatch(raw, /1HGCM82633A004352|Honda|Accord|file:\/\/|inspection-photo/i);
  assert.doesNotMatch(buildDiagnosticExport({ recoveryLog: [{ operation: 'x', detail: '1'.repeat(500) }] }), /1{201}/);
});

test('formats detailed recovery-log presentation states consistently', () => {
  const success = getRecoveryLogPresentation({ operation: 'Local save', outcome: 'success', detail: 'Saved draft.' });
  const failure = getRecoveryLogPresentation({ operation: 'Backup restore', outcome: 'error' });
  assert.equal(getRecoveryLogPresentation(null).tone, 'error');
  assert.equal(getRecoveryLogEntry(null).operation, 'Local operation');
  assert.equal(success.title, 'Local save · Complete');
  assert.equal(success.tone, 'success');
  assert.equal(failure.tone, 'error');
  assert.equal(failure.detail, 'No additional details recorded.');
});

test('formats local recovery log entries consistently', () => {
  const success = getRecoveryLogEntry({ operation: 'Local save', outcome: 'success' });
  const failure = getRecoveryLogEntry({ operation: 'Retry all local saves', outcome: 'error', detail: 'Still queued.' });
  assert.equal(success.operation, 'Local save');
  assert.equal(success.outcome, 'success');
  assert.match(success.detail, /Completed/);
  assert.equal(failure.detail, 'Still queued.');
  assert.ok(Number.isNaN(Date.parse(success.at)) === false);
});

test('labels restore sources without exposing inspection details', () => {
  assert.equal(getRestoreSourceLabel('primary'), 'Primary local inspection');
  assert.equal(getRestoreSourceLabel('pending'), 'Pending local recovery copy');
  assert.equal(getRestoreSourceLabel('imported'), 'Imported Carwise backup');
  assert.equal(getRestoreSourceLabel('unknown'), 'No restore source recorded');
});

test('formats local recovery banner states consistently', () => {
  assert.equal(getLocalRecoveryBanner({ retryCount: 0, saveRetry: false }), null);
  assert.match(getLocalRecoveryBanner({ retryCount: 2 }).body, /2 local operations/);
  assert.equal(getLocalRecoveryBanner({ saveRetry: true }).action, 'Retry local saves');
});

test('formats local-save recovery guidance for queued and unqueued failures', () => {
  assert.match(getLocalSaveErrorGuidance(true), /recovery copy.*queued|Retry/i);
  assert.match(getLocalSaveErrorGuidance(false), /Export a backup|again/i);
});

test('formats report retry labels for PDF and sharing failures', () => {
  assert.equal(getReportRetryLabel('pdf'), 'Retry PDF export');
  assert.equal(getReportRetryLabel('share'), 'Retry sharing');
  assert.equal(getReportRetryLabel('unknown'), 'Retry sharing');
});

test('selects pending local-save payloads before older primary data', () => {
  assert.equal(selectInspectionRestorePayload('primary', 'pending'), 'pending');
  assert.equal(selectInspectionRestorePayload('primary', ''), 'primary');
  assert.equal(selectInspectionRestorePayload('', ''), null);
});

test('flushes retry work in insertion order and removes successful entries', async () => {
  clearRetryQueue();
  const order = [];
  enqueueRetry({ key: 'first', run: async () => { order.push('first'); } });
  enqueueRetry({ key: 'second', run: async () => { order.push('second'); } });
  const result = await flushRetryQueue();
  assert.deepEqual(order, ['first', 'second']);
  assert.deepEqual(result, { succeeded: 2, failed: 0, dropped: 0 });
  assert.equal(getRetryQueueSize(), 0);
});

test('replaces duplicate retry keys and drops repeatedly failing work at its limit', async () => {
  clearRetryQueue();
  let value = '';
  enqueueRetry({ key: 'same', run: async () => { value = 'old'; } });
  enqueueRetry({ key: 'same', run: async () => { value = 'new'; } });
  await flushRetryQueue();
  assert.equal(value, 'new');
  let attempts = 0;
  enqueueRetry({ key: 'failing', maxAttempts: 2, run: async () => { attempts += 1; throw new Error('offline'); } });
  const first = await flushRetryQueue();
  const second = await flushRetryQueue();
  assert.deepEqual(first, { succeeded: 0, failed: 1, dropped: 0 });
  assert.deepEqual(second, { succeeded: 0, failed: 1, dropped: 1 });
  assert.equal(attempts, 2);
  clearRetry('failing');
});

test('clears AI timeline state without mutating the current analysis', () => {
  const history = [{ id: 'one', confidence: 64 }, { id: 'two', confidence: 78 }];
  assert.deepEqual(resetAiHistory(history), []);
  assert.equal(history.length, 2);
});

test('preserves a bounded AI timeline in local backups', () => {
  const aiHistory = Array.from({ length: 8 }, (_, index) => ({ id: String(index), confidence: 40 + index }));
  const raw = serializeInspectionBackup({ vehicle: {}, issues: [], checklist: {}, photos: [], savedInspections: [], aiHistory });
  const restored = parseInspectionBackup(raw);
  assert.equal(restored.aiHistory.length, 6);
  assert.equal(restored.aiHistory[0].id, '2');
  const malformed = parseInspectionBackup(JSON.stringify({ app: 'carwise', version: 1, aiHistory: [{ id: 'kept' }, null, 'invalid'] }));
  assert.deepEqual(malformed.aiHistory, [{ id: 'kept' }]);
});

test('selects a usable backup copy without letting malformed pending data mask primary data', () => {
  const primary = JSON.stringify({ app: 'carwise', version: 1, vehicle: { year: '2020' } });
  const pending = JSON.stringify({ app: 'carwise', version: 1, vehicle: { year: '2021' } });
  assert.equal(selectInspectionRestorePayload(primary, pending), pending);
  assert.equal(selectInspectionRestorePayload(primary, '{broken-json'), primary);
  assert.equal(selectInspectionRestorePayload('', '{broken-json'), '{broken-json');
  assert.equal(selectInspectionRestorePayload(null, null), null);
});

test('serializes and restores a versioned local backup', () => {
  const raw = serializeInspectionBackup({ vehicle: { year: '2020' }, issues: [{ name: 'Brake wear' }], checklist: { Exterior: true }, photos: [{ id: 'p1' }], savedInspections: [{ id: 's1' }] });
  const restored = parseInspectionBackup(raw);
  assert.equal(restored.vehicle.year, '2020');
  assert.equal(restored.issues[0].name, 'Brake wear');
  assert.equal(getBackupSummary(restored), '1 saved inspection · 1 active photo');
  const sanitized = parseInspectionBackup(JSON.stringify({ app: 'carwise', version: 1, vehicle: 'invalid', issues: [{ name: 'kept' }, null, 'invalid'], checklist: [], photos: [{ id: 'kept' }, null], savedInspections: [{ id: 'kept' }, 7] }));
  assert.equal(sanitized.vehicle, null);
  assert.deepEqual(sanitized.issues, [{ name: 'kept' }]);
  assert.deepEqual(sanitized.checklist, {});
  assert.deepEqual(sanitized.photos, [{ id: 'kept' }]);
  assert.deepEqual(sanitized.savedInspections, [{ id: 'kept' }]);
  assert.throws(() => parseInspectionBackup('{"app":"other","version":1}'), /Unsupported Carwise backup/);
});

test('decodes VIN response fields and normalizes the submitted VIN', async () => {
  let requestedUrl = '';
  const result = await decodeVin('1hg cm82633a004352', { fetchImpl: async (url) => { requestedUrl = url; return { ok: true, async json() { return { Results: [{ ModelYear: '2003', Make: 'Honda', Model: 'Accord', Trim: 'EX', BodyClass: 'Sedan', DisplacementL: '2.4', EngineCylinders: '4' }] }; } }; } });
  assert.equal(result.status, 'decoded');
  assert.equal(result.vin, '1HGCM82633A004352');
  assert.equal(result.vehicle.model, 'Accord');
  assert.match(requestedUrl, /DecodeVinValuesExtended\/1HGCM82633A004352/);
  let calls = 0;
  clearVinCache();
  const fetchImpl = async () => { calls += 1; return { ok: true, async json() { return { Results: [{ ModelYear: '2003', Make: 'Honda', Model: 'Accord' }] }; } }; };
  await decodeVin(result.vin, { fetchImpl });
  await decodeVin(result.vin, { fetchImpl });
  assert.equal(calls, 1);
});

test('returns a fallback result when the VIN service fails', async () => {
  clearVinCache();
  const result = await decodeVin('1HGCM82633A004352', { fetchImpl: async () => { throw new Error('offline'); } });
  assert.equal(result.status, 'fallback');
  assert.equal(result.vehicle, null);
  assert.match(result.message, /unavailable/i);
});

test('returns actionable fallback feedback when VIN lookup times out', async () => {
  clearVinCache();
  const result = await decodeVin('2HGCM82633A004352', {
    timeoutMs: 5,
    fetchImpl: async (_url, { signal }) => await new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => { const error = new Error('aborted'); error.name = 'AbortError'; reject(error); });
    }),
  });
  assert.equal(result.status, 'fallback');
  assert.match(result.message, /timed out/i);
});

test('rejects invalid VINs before calling the service', async () => {
  await assert.rejects(() => decodeVin('not-a-vin'), /valid 17-character VIN/);
});

test('compares saved inspections with safe AI confidence fallbacks', () => {
  const comparison = getInspectionComparison({ id: 'one', vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, issues: [{ severity: 'major', cost: 500 }], checklist: { Exterior: true }, photos: [], aiHistory: [] }, { id: 'two', vehicle: { year: '2019', make: 'Toyota', model: 'Camry' }, issues: [], checklist: {}, photos: [{ id: 'p1' }], aiHistory: [{ confidence: 72 }] });
  assert.equal(comparison.left.risk, 20);
  assert.equal(comparison.left.confidence, null);
  assert.equal(comparison.right.confidence, 72);
  assert.equal(getInspectionComparison({ vehicle: {} }, null), null);
});

test('guards primitive VIN and malformed issue inputs', () => {
  assert.equal(normalizeVin(12345), '12345');
  assert.equal(isValidVin(null), false);
  assert.equal(getRepairTotal(null), 0);
  assert.equal(getRepairTotal([{ cost: 50 }, null, { cost: 'bad' }]), 50);
  assert.equal(getRiskScore(null), 0);
  assert.equal(getRiskScore([{ severity: 'major' }, null]), 20);
});

test('normalizes malformed active inspection data before restore', () => {
  const normalized = normalizeActiveInspection({ vehicle: ['bad'], issues: [{ name: ' Brake ', severity: 'unknown', cost: '-5' }, null, { cost: 20 }], checklist: { Exterior: true, bad: 'yes' }, photos: 'bad' });
  assert.equal(normalized.vehicle.year, '');
  assert.equal(normalized.issues.length, 2);
  assert.equal(normalized.issues[0].severity, 'minor');
  assert.equal(normalized.issues[0].cost, 0);
  assert.equal(normalized.issues[1].name, 'Unnamed finding');
  assert.deepEqual(normalized.checklist, { Exterior: true });
  assert.deepEqual(normalized.photos, []);
});

test('coerces imported backup values before they reach active inspection calculations', () => {
  const normalized = normalizeActiveInspection({ vehicle: { year: 2020, make: ' Honda ', model: ' Accord ', asking: 21900 }, issues: [{ name: 'Brake wear', severity: 'major', cost: '420' }, { name: 'Bad cost', cost: 'not-a-number' }], checklist: { Exterior: true, Tires: 'yes' }, photos: [{ id: 'photo-1', uri: 'file://brake.jpg' }] });
  assert.equal(normalized.vehicle.year, '2020');
  assert.equal(normalized.vehicle.make, 'Honda');
  assert.equal(normalized.issues[0].cost, 420);
  assert.equal(normalized.issues[1].cost, 0);
  assert.deepEqual(normalized.checklist, { Exterior: true });
  assert.equal(normalized.photos[0].uri, 'file://brake.jpg');
});

test('normalizes malformed persisted photos before rendering', () => {
  const normalized = normalizePhotoAssets([{ uri: ' file://one.jpg ', width: '640' }, null, { id: 'bad-no-uri' }, { id: 'two', uri: 'file://two.jpg', reviewStatus: 'unknown', note: 'x'.repeat(300) }]);
  assert.equal(normalized.length, 2);
  assert.equal(normalized[0].uri, 'file://one.jpg');
  assert.equal(normalized[0].id, 'restored-photo-1');
  assert.equal(normalized[0].reviewStatus, 'needs-review');
  assert.equal(normalized[1].id, 'two');
  assert.equal(normalized[1].note.length, 240);
  assert.equal(normalizePhotoAssets('invalid').length, 0);
});

test('reattaches replacement photo assets without changing evidence IDs', () => {
  const restored = replacePhotoAsset([], 'photo-9', { uri: 'file://replacement.jpg', fileName: 'replacement.jpg' });
  assert.equal(restored.length, 1);
  assert.equal(restored[0].id, 'photo-9');
  assert.equal(restored[0].reviewStatus, 'confirmed');
  const updated = replacePhotoAsset(restored, 'photo-9', { uri: 'file://new.jpg' });
  assert.equal(updated.length, 1);
  assert.equal(updated[0].uri, 'file://new.jpg');
});

test('reports evidence health for linked findings', () => {
  const health = getEvidenceHealth([{ photoId: 'photo-1' }, { photoId: 'photo-2' }], [{ id: 'photo-1', uri: 'file://one.jpg' }]);
  assert.equal(health.linkedCount, 2);
  assert.equal(health.resolvableCount, 1);
  assert.equal(health.missingCount, 1);
  assert.match(health.label, /1\/2 linked findings/);
  assert.equal(getEvidenceHealth([], []).missingCount, 0);
});

test('protects linked photos with deletion guidance', () => {
  const guidance = getPhotoDeleteGuidance('photo-1', [{ photoId: 'photo-1' }, { photoId: 'photo-1' }]);
  const safe = getPhotoDeleteGuidance('photo-2', [{ photoId: 'photo-1' }]);
  assert.equal(guidance.linkedCount, 2);
  assert.match(guidance.message, /metadata only/i);
  assert.equal(safe.linkedCount, 0);
});

test('filters photo reviews and patches issue details immutably', () => {
  const reviews = [{ id: 'one', status: 'needs-confirmation' }, { id: 'two', status: 'confirmed' }];
  assert.equal(filterPhotoEvidenceReviews(reviews, 'confirmed').length, 1);
  const issues = [{ name: 'Photo evidence · front.jpg', severity: 'minor', cost: 0 }];
  const updated = patchIssueByName(issues, issues[0].name, { severity: 'major', cost: '-5', note: 'Recheck panel.' });
  assert.equal(updated[0].severity, 'major');
  assert.equal(updated[0].cost, 0);
  assert.equal(issues[0].severity, 'minor');
});

test('resolves linked issue evidence with safe fallbacks', () => {
  const photos = [{ id: 'photo-1', uri: 'file://one.jpg', fileName: 'front.jpg' }];
  assert.equal(getIssueEvidencePhoto({ photoId: 'photo-1' }, photos).fileName, 'front.jpg');
  assert.equal(getIssueEvidencePhoto({ photoId: 'missing' }, photos), null);
  assert.equal(getIssueEvidencePhoto({ photoId: 'photo-1' }, [{ id: 'photo-1' }]), null);
});

test('persists photo review status and creates linked finding drafts', () => {
  const photos = [{ id: 'photo-1', uri: 'file://one.jpg' }];
  const review = getPhotoEvidenceReview(photos)[0];
  const updated = updatePhotoReview(photos, review.id, 'confirmed', 'Visible panel concern');
  assert.equal(updated[0].reviewStatus, 'confirmed');
  assert.equal(updated[0].reviewNote, 'Visible panel concern');
  const finding = buildPhotoFindingDraft({ ...review, note: 'Visible panel concern' });
  assert.equal(finding.photoId, 'photo-1');
  assert.equal(finding.source, 'user-confirmed photo evidence');
  assert.match(finding.name, /Photo evidence/);
});

test('creates transparent per-photo evidence review prompts', () => {
  const reviews = getPhotoEvidenceReview([{ id: 'one', uri: 'file://one.jpg', fileName: 'front.jpg' }, { id: 'two' }, { id: 'three', uri: 'file://three.jpg' }]);
  assert.equal(reviews.length, 2);
  assert.equal(reviews[0].label, 'front.jpg');
  assert.equal(reviews[0].status, 'needs-confirmation');
  assert.match(reviews[1].guidance, /tires|brake/i);
  assert.match(reviews[0].limitation, /not a visual diagnosis/i);
});

test('formats extracted comparison and backup preview UI helpers', () => {
  assert.equal(formatComparisonMetricValue({ key: 'repairs', prefix: '$' }, 1250), '$1,250');
  assert.equal(formatComparisonMetricValue({ key: 'confidence', suffix: '%' }, null), '—');
  assert.deepEqual(getBackupPreviewRows({ sizeLabel: '2.4 KB', savedInspections: 2, activePhotos: 3, aiSnapshots: 4 }), [['File size', '2.4 KB'], ['Saved inspections', 2], ['Active photos', 3], ['AI snapshots', 4]]);
});

test('builds bounded comparison bar rows and handles unavailable AI confidence', () => {
  const comparison = getInspectionComparison({ vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, issues: [{ severity: 'critical', cost: 1200 }], checklist: { Exterior: true }, photos: [] }, { vehicle: { year: '2019', make: 'Toyota', model: 'Camry' }, issues: [], checklist: {}, photos: [{ uri: 'x' }], aiHistory: [{ confidence: 80 }] });
  const rows = getComparisonMetricRows(comparison);
  assert.equal(rows.length, 5);
  assert.equal(rows.find((row) => row.key === 'risk').leftRatio, 0.34);
  assert.equal(rows.find((row) => row.key === 'confidence').left, null);
  assert.equal(rows.find((row) => row.key === 'confidence').rightRatio, 0.8);
  assert.equal(getComparisonMetricRows(null).length, 0);
});

test('reports backup metadata without changing serialized content', () => {
  const backup = { exportedAt: '2026-08-22T00:00:00.000Z', savedInspections: [{ id: 'one' }], photos: [{ uri: 'x' }], aiHistory: [{ confidence: 70 }] };
  const metadata = getBackupMetadata({ backup, serialized: '{"é":true}' });
  assert.equal(metadata.savedInspections, 1);
  assert.equal(metadata.activePhotos, 1);
  assert.equal(metadata.aiSnapshots, 1);
  assert.equal(metadata.bytes, 11);
  assert.equal(metadata.sizeLabel, '11 B');
});

test('normalizes saved inspections without allowing malformed nested data to crash screens', () => {
  assert.equal(normalizeSavedInspection(null), null);
  const safe = normalizeSavedInspection({ id: 'saved-1', vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, issues: [{ name: 'Brake', cost: 400 }, 'bad'], checklist: null, photos: [{ id: 'p1' }, null] });
  assert.equal(safe.issues.length, 1);
  assert.deepEqual(safe.checklist, {});
  assert.equal(safe.photos.length, 1);
  assert.ok(safe.savedAt);
});

test('clears saved selection only for the deleted record', () => {
  assert.equal(shouldClearSavedSelection('one', 'one'), true);
  assert.equal(shouldClearSavedSelection('one', 'two'), false);
  assert.equal(shouldClearSavedSelection(null, 'two'), false);
});

test('deduplicates saved inspections only when both VINs match', () => {
  assert.equal(shouldReplaceSavedInspection({ vin: '' }, { vin: '' }), false);
  assert.equal(shouldReplaceSavedInspection({ vin: '1hg cm82633a004352' }, { vin: '1HGCM82633A004352' }), true);
  assert.equal(shouldReplaceSavedInspection({ vin: '1HGCM82633A004352' }, { vin: '2HGCM82633A004352' }), false);
});

test('filters and sorts saved inspections without mutating source data', () => {
  const inspections = [
    { id: 'a', vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, issues: [{ severity: 'minor', cost: 100 }], savedAt: '2026-08-20T00:00:00Z' },
    { id: 'b', vehicle: { year: '2019', make: 'Toyota', model: 'RAV4' }, issues: [{ severity: 'critical', cost: 700 }], savedAt: '2026-08-21T00:00:00Z' },
  ];
  const newest = filterAndSortInspections(inspections, '', 'newest');
  const risk = filterAndSortInspections(inspections, '', 'risk');
  const repairs = filterAndSortInspections(inspections, '', 'repairs');
  assert.deepEqual(newest.map((item) => item.id), ['b', 'a']);
  assert.deepEqual(risk.map((item) => item.id), ['b', 'a']);
  assert.deepEqual(repairs.map((item) => item.id), ['b', 'a']);
  assert.deepEqual(filterAndSortInspections(inspections, 'honda', 'newest').map((item) => item.id), ['a']);
  assert.deepEqual(inspections.map((item) => item.id), ['a', 'b']);
});

test('formats canceled-flow guidance consistently', () => {
  assert.match(getCanceledFlowGuidance('camera'), /canceled/i);
  assert.match(getCanceledFlowGuidance('library'), /unchanged/i);
  assert.match(getCanceledFlowGuidance('backup'), /unchanged/i);
});

test('reports main inspection flow readiness consistently', () => {
  assert.deepEqual(getMainFlowReadiness({ vehicle: { make: '', model: '' }, checklist: {}, photos: [] }), { ready: false, missing: ['vehicle details', 'checklist', 'photo evidence'] });
  assert.equal(getMainFlowReadiness({ vehicle: { make: 'Honda', model: 'Accord' }, checklist: { Exterior: true, 'Tires & brakes': true, 'Engine bay': true, Interior: true, 'Test drive': true }, photos: [{ uri: 'file://photo.jpg' }] }).ready, false);
  assert.deepEqual(getMainFlowReadiness({ vehicle: { year: '20', make: 'Honda', model: 'Accord' }, checklist: { Exterior: true, 'Tires & brakes': true, 'Engine bay': true, Interior: true, 'Test drive': true }, photos: [{ uri: 'file://photo.jpg' }] }).missing, ['vehicle details']);
  assert.deepEqual(getMainFlowReadiness({ vehicle: { year: '2020', make: '  ', model: 'Accord' }, checklist: { Exterior: true, 'Tires & brakes': true, 'Engine bay': true, Interior: true, 'Test drive': true }, photos: [{ uri: 'file://photo.jpg' }] }).missing, ['vehicle details']);
  assert.equal(getMainFlowReadiness({ vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, checklist: { Exterior: true, 'Tires & brakes': true, 'Engine bay': true, Interior: true, 'Test drive': true }, photos: [{ uri: 'file://photo.jpg' }] }).ready, true);
});

test('formats functional action labels consistently', () => {
  assert.equal(getFunctionalActionLabel('start'), 'Start a new inspection');
  assert.equal(getFunctionalActionLabel('analysis', 'busy'), 'Run AI analysis in progress');
});

test('formats photo screen guidance consistently', () => {
  assert.equal(getPhotoScreenGuidance(0), 'No photo evidence yet. Start with the exterior, tires, or engine bay.');
  assert.equal(getPhotoScreenGuidance(1), '1 photo captured. Review or add more evidence before analysis.');
});

test('formats durable photo filenames consistently', () => {
  assert.equal(getDurablePhotoFileName('front wheel/left?.jpg', 123), 'carwise-123-front_wheel_left_.jpg');
  assert.equal(getDurablePhotoFileName('', 456), 'carwise-456-inspection.jpg');
});

test('formats processing labels consistently', () => {
  assert.equal(getProcessingLabel('photo', 'working'), 'Processing photo…');
  assert.equal(getProcessingLabel('photo', 'success'), 'Photo ready');
  assert.equal(getProcessingLabel('report', 'error'), 'Report unavailable');
});

test('formats photo action guidance consistently', () => {
  assert.equal(getPhotoActionGuidance(0), 'No photos yet. Add at least one photo for stronger AI evidence.');
  assert.equal(getPhotoActionGuidance(2), '2 photos ready for AI analysis.');
});

test('formats inspection action guidance consistently', () => {
  assert.equal(getInspectionActionGuidance({ photoCount: 0, reportReady: false }), 'Complete the checklist and add photo evidence before sharing.');
  assert.equal(getInspectionActionGuidance({ photoCount: 1, reportReady: true }), '1 photo attached · report ready to share.');
});

test('formats inspection navigation labels consistently', () => {
  assert.equal(getInspectionNavigationLabel('checklist'), 'Back to Inspection checklist');
  assert.equal(getInspectionNavigationLabel('summary', 'resume'), 'Resume inspection');
});

test('formats checklist guidance labels consistently', () => {
  assert.equal(getChecklistGuidance(0, 5), '5 sections remaining. You can save and finish later.');
  assert.equal(getChecklistGuidance(4, 5), '1 section remaining. You can save and finish later.');
  assert.equal(getChecklistGuidance(5, 5), 'All sections complete — ready to save.');
});

test('formats progress summary labels consistently', () => {
  assert.equal(getProgressSummaryLabel(0, 5), '0 of 5 sections complete');
  assert.equal(getProgressSummaryLabel(5, 5), 'All 5 sections complete');
  assert.equal(getProgressSummaryLabel(2, 0), 'No sections yet');
});

test('formats recovery guidance labels consistently', () => {
  assert.equal(getRecoveryGuidance('photo'), 'Could not complete photo. Try again when ready.');
  assert.equal(getRecoveryGuidance('report', 'success'), 'Your report is ready.');
});

test('formats local-operation status labels consistently', () => {
  assert.equal(getOperationStatusLabel('photo', 'working'), 'Photo in progress…');
  assert.equal(getOperationStatusLabel('backup'), 'Backup complete');
  assert.equal(getOperationStatusLabel('restore', 'error'), 'Backup restore needs attention');
});

test('formats local-save delay consistently', () => {
  assert.equal(getLocalSaveDelay(false), 0);
  assert.equal(getLocalSaveDelay(true), 300);
});

test('formats local-save status labels consistently', () => {
  assert.equal(getLocalSaveLabel('saving'), 'Saving locally…');
  assert.equal(getLocalSaveLabel('saved'), 'Saved locally');
  assert.equal(getLocalSaveLabel('error'), 'Save needs attention');
});

test('formats history action feedback consistently', () => {
  assert.equal(getHistoryActionMessage('delete'), 'Inspection deleted · Undo available');
  assert.equal(getHistoryActionMessage('duplicate'), 'Inspection duplicated · New copy added');
});

test('selects recent recovery entries safely and newest first', () => {
  const entries = [{ at: '2026-01-01T00:00:00.000Z' }, { at: '2026-01-02T00:00:00.000Z' }, { at: '2026-01-03T00:00:00.000Z' }, { at: '2026-01-04T00:00:00.000Z' }];
  assert.deepEqual(getRecentRecoveryEntries(entries, 2), [entries[3], entries[2]]);
  assert.deepEqual(getRecentRecoveryEntries(null), []);
  assert.deepEqual(getRecentRecoveryEntries(entries, -2), []);
});

test('describes guided VIN lookup states without exposing unsafe input', () => {
  assert.deepEqual(getVinWalkthroughStep(), { index: 0, title: 'Find the VIN', detail: 'Look through the windshield or inside the driver-side door frame.' });
  assert.equal(getVinWalkthroughStep({ value: '1hg-cm' }).detail, '5/17 characters entered. The lookup needs all 17 characters.');
  assert.equal(getVinWalkthroughStep({ value: '1HGCM82633A004352' }).title, 'Ready to check');
  assert.equal(getVinWalkthroughStep({ value: '1HGCM82633A004352', busy: true }).title, 'Checking your VIN');
  assert.equal(getVinWalkthroughStep({ status: 'error' }).title, 'Review the VIN');
  assert.equal(getVinWalkthroughStep({ status: 'decoded' }).index, 3);
});

test('normalizes persisted Carwise settings with safe defaults', () => {
  assert.deepEqual(normalizeCarwiseSettings({ compactMode: 1, aiDisclosure: false, motionIntensity: 'lively' }), { compactMode: true, aiDisclosure: false, motionIntensity: 'lively' });
  assert.deepEqual(normalizeCarwiseSettings({ compactMode: 'no', motionIntensity: 'unknown' }), { compactMode: true, aiDisclosure: true, motionIntensity: 'standard' });
  assert.deepEqual(normalizeCarwiseSettings(null, { compactMode: true, aiDisclosure: false, motionIntensity: 'gentle' }), { compactMode: false, aiDisclosure: true, motionIntensity: 'gentle' });
});

test('routes onboarding actions to manual setup or VIN decoding', () => {
  assert.equal(getOnboardingActionDestination('manual'), 'new');
  assert.equal(getOnboardingActionDestination('decode-vin'), 'vin');
  assert.equal(getOnboardingActionDestination('unknown'), 'new');
});

test('scales motion duration by intensity while honoring reduced motion', () => {
  assert.equal(getMotionDuration(200, 'gentle'), 270);
  assert.equal(getMotionDuration(200, 'standard'), 200);
  assert.equal(getMotionDuration(200, 'lively'), 140);
  assert.equal(getMotionDuration(200, 'lively', true), 0);
  assert.equal(getMotionDuration('invalid', 'unknown'), 40);
});

test('moves onboarding content in the direction of the selected step', () => {
  assert.equal(getOnboardingTransitionOffset(1, 0), 16);
  assert.equal(getOnboardingTransitionOffset(0, 1), -16);
  assert.equal(getOnboardingTransitionOffset('invalid', 'invalid'), -16);
});

test('bounds onboarding progress for safe first-use guidance', () => {
  assert.equal(getOnboardingProgressPercent(0, 3), 33.33333333333333);
  assert.equal(getOnboardingProgressPercent(2, 3), 100);
  assert.equal(getOnboardingProgressPercent(8, 3), 100);
  assert.equal(getOnboardingProgressPercent('invalid', 0), 100);
});

test('bounds animated checklist progress for safe visual feedback', () => {
  assert.equal(getAnimatedProgressPercent(0, 5), 8);
  assert.equal(getAnimatedProgressPercent(3, 5), 60);
  assert.equal(getAnimatedProgressPercent(7, 5), 100);
  assert.equal(getAnimatedProgressPercent('invalid', 0), 8);
});

test('reports readiness with precise missing sections', () => {
  const incomplete = getReportReadiness({ vehicle: { make: 'Honda' }, checklist: { Exterior: true }, photos: [] });
  assert.equal(incomplete.ready, false);
  assert.deepEqual(incomplete.missing, ['vehicle details', 'checklist', 'photo evidence']);
  assert.deepEqual(getReportReadiness({ vehicle: { year: '2020', make: ' ', model: 'Accord' }, checklist: { Exterior: true, Tires: true, Engine: true, Interior: true, Test: true }, photos: [{ id: 'p1' }] }).missing, ['vehicle details']);
  const ready = getReportReadiness({ vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, checklist: { Exterior: true, Tires: true, Engine: true, Interior: true, Test: true }, photos: [{ id: 'p1' }] });
  assert.equal(ready.ready, true);
  assert.deepEqual(ready.missing, []);
});

test('formats saved-inspection risk and completion metadata consistently', () => {
  const item = { issues: [{ severity: 'critical', cost: 900 }, { severity: 'critical', cost: 300 }], checklist: { Exterior: true, Interior: true } };
  assert.equal(getInspectionRiskLabel(item), 'HIGH RISK');
  assert.equal(getInspectionCompletion(item), '2/5 sections');
  assert.equal(getInspectionRepairTotal(item), 1200);
});

test('clears derived AI and report state when loading another inspection', () => {
  assert.deepEqual(getDerivedInspectionResetState(), { ranAI: false, reportPreview: '' });
});

test('matches issues by identity without conflating duplicate names', () => {
  const first = { id: 'one', name: 'Brake wear' };
  const second = { id: 'two', name: 'Brake wear' };
  assert.equal(isSameIssue(first, first), true);
  assert.equal(isSameIssue(first, { id: 'one', name: 'Brake wear' }), true);
  assert.equal(isSameIssue(first, second), false);
});

test('creates clean defaults for a new inspection', () => {
  assert.deepEqual(createNewInspectionState(), {
    vehicle: { year: '', make: '', model: '', mileage: '', vin: '', asking: '' },
    issues: [],
    checklist: {},
    photos: [],
  });
});

test('normalizes VIN input and validates a 17-character VIN', () => {
  assert.equal(normalizeVin('1hg-cm82633a004352'), '1HGCM82633A004352');
  assert.equal(isValidVin('1hg-cm82633a004352'), true);
  assert.equal(isValidVin('1HGCM82633A00435'), false);
});

test('calculates repair totals without allowing negative values', () => {
  assert.equal(getRepairTotal([{ cost: 420 }, { cost: '180' }, { cost: -10 }]), 600);
});

test('calculates a capped risk score from issue severity', () => {
  assert.equal(getRiskScore([{ severity: 'critical' }, { severity: 'major' }, { severity: 'minor' }]), 62);
  assert.equal(getRiskScore(Array.from({ length: 10 }, () => ({ severity: 'critical' }))), 100);
});

test('keeps report helpers safe for malformed collection inputs', () => {
  assert.match(buildInspectionReport(), /Vehicle details unavailable/);
  assert.match(buildInspectionReport({ vehicle: null, issues: null, checklist: null, photos: null }), /Issues found: 0/);
  assert.match(buildInspectionReport({ issues: [{ cost: '420' }, null, { cost: '-5' }] }), /Estimated repairs: \$420/);
  assert.equal(buildPhotoEvidenceHtml(null), '');
  assert.equal(formatRepairPriorityHtml(null), '');
});

test('builds a share-ready report with key inspection facts', () => {
  const report = buildInspectionReport({ vehicle: { year: '2020', make: 'Honda', model: 'Accord', mileage: '42,000' }, issues: [{ severity: 'major', cost: 600 }], checklist: { Exterior: true }, photos: [{ uri: 'file://photo.jpg' }], fairPrice: 19400, riskScore: 20 });
  assert.match(report, /2020 Honda Accord/);
  assert.match(report, /Estimated repairs: \$600/);
  assert.match(report, /Checklist: 1\/5 sections complete/);
  assert.match(buildInspectionReport({ vehicle: { year: '2020' } }), /AI fair price: Unavailable until AI analysis is completed/);
});

test('formats repair priorities with critical issues first and escaped names', () => {
  const html = formatRepairPriorityHtml([
    { name: 'Loose trim', severity: 'minor', cost: 80 },
    { name: '<Brake> leak', severity: 'critical', cost: 900 },
    { name: 'Tire wear', severity: 'major', cost: 500 },
  ]);
  assert.ok(html.indexOf('CRITICAL') < html.indexOf('MAJOR'));
  assert.match(html, /\$900 · address first/);
  assert.match(html, /&lt;Brake&gt; leak/);
});

test('renders embedded photo thumbnails and safe metadata fallbacks', () => {
  const html = buildPhotoEvidenceHtml([
    { fileName: 'front.jpg', width: 1200, height: 900, embeddedDataUri: 'data:image/jpeg;base64,abc123' },
    { fileName: 'rear.jpg', width: 800, height: 600, uri: 'file://rear.jpg' },
    { fileName: 'side.jpg' },
  ]);
  assert.match(html, /<img src="data:image\/jpeg;base64,abc123"/);
  assert.match(html, /local asset unavailable for embed/);
  assert.match(html, /metadata only/);
  assert.equal(formatPhotoEvidenceLabel({ fileName: 'front.jpg', width: 1200, height: 900, embeddedDataUri: 'data:image\/jpeg;base64,abc' }, 0), 'Photo 1 · front.jpg · 1200×900 · embedded image');
  const escaped = buildPhotoEvidenceHtml([{ fileName: '<script>alert(1)</script>', uri: 'file://unsafe.jpg' }]);
  assert.doesNotMatch(escaped, /<script>alert/);
  assert.match(escaped, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
});

test('merges a manually entered custom finding without duplicating an existing issue', () => {
  const existing = [{ name: 'Windshield chip', severity: 'minor', cost: 120, note: 'Existing note' }];
  const custom = { name: 'Windshield chip', severity: 'major', cost: 250, note: 'Updated by user', source: 'Manual finding' };
  const merged = mergeAiFindings(existing, [custom]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].severity, 'minor');
  assert.equal(merged[0].cost, 120);
});

test('restores a removed finding through the same merge path used by Undo', () => {
  const removed = { name: 'Door dent', severity: 'major', cost: 600, note: 'Rear passenger door', source: 'Manual finding' };
  const restored = mergeAiFindings([], [removed]);
  assert.deepEqual(restored, [removed]);
});

test('preserves bounded local tool observations through backup round-trip', () => {
  const serialized = serializeInspectionBackup({ vehicle: {}, issues: [], checklist: {}, photos: [], toolNotes: { market: 'Seller has two comparable listings.', history: 'Title report reviewed.', test: 'Steering stayed centered.' }, savedInspections: [] });
  const parsed = parseInspectionBackup(serialized);
  assert.equal(parsed.toolNotes.market.note, 'Seller has two comparable listings.');
  assert.equal(parsed.toolNotes.history.note, 'Title report reviewed.');
  assert.equal(parsed.toolNotes.test.note, 'Steering stayed centered.');
  assert.equal(parsed.toolNotes.market.source, 'User-entered observation');
});

test('upserts field-note provenance deterministically and removes only the requested note', () => {
  const initial = { market: { note: 'Old', savedAt: '2026-01-01T00:00:00.000Z', source: 'Seller' }, history: { note: 'Title checked', savedAt: '2026-01-01T00:00:00.000Z', source: 'Report' } };
  const updated = upsertToolNote(initial, 'market', `  ${'x'.repeat(1200)}  `, '2026-08-22T12:00:00.000Z', 'Mechanic');
  assert.equal(updated.market.note.length, 1000);
  assert.equal(updated.market.savedAt, '2026-08-22T12:00:00.000Z');
  assert.equal(updated.market.source, 'Mechanic');
  const roundTrip = parseInspectionBackup(serializeInspectionBackup({ vehicle: {}, issues: [], checklist: {}, photos: [], toolNotes: updated, savedInspections: [] }));
  assert.equal(roundTrip.toolNotes.market.source, 'Mechanic');
  assert.equal(roundTrip.toolNotes.market.savedAt, '2026-08-22T12:00:00.000Z');
  assert.equal(updated.history.note, 'Title checked');
  const removed = removeToolNote(updated, 'market');
  assert.equal(removed.market, undefined);
  assert.equal(removed.history.note, 'Title checked');
  assert.equal(updated.market.note.length, 1000);
});

test('orders field-note timeline by valid timestamp and safely includes legacy notes', () => {
  const timeline = getToolNoteTimeline({ market: { note: 'Older', savedAt: '2026-08-20T12:00:00.000Z', source: 'Seller' }, history: { note: 'Newest', savedAt: '2026-08-22T12:00:00.000Z', source: 'Report' }, test: 'Legacy note' });
  assert.deepEqual(timeline.map((entry) => entry.label), ['History', 'Market', 'Test drive']);
  assert.equal(timeline[0].source, 'Report');
  assert.equal(timeline[2].source, 'User-entered observation');
  assert.equal(getToolNoteTimeline({ market: { note: 'Bad date', savedAt: 'not-a-date' } })[0].savedAt, null);
});

test('filters field-note timeline by category without mutating source data', () => {
  const timeline = getToolNoteTimeline({ market: { note: 'Price note', savedAt: '2026-08-20T12:00:00.000Z' }, history: { note: 'History note', savedAt: '2026-08-22T12:00:00.000Z' }, test: { note: 'Drive note', savedAt: '2026-08-21T12:00:00.000Z' } });
  assert.equal(filterToolNoteTimeline(timeline, 'history')[0].key, 'history');
  assert.equal(filterToolNoteTimeline(timeline, 'market')[0].note, 'Price note');
  assert.equal(filterToolNoteTimeline(timeline, 'all').length, 3);
  assert.deepEqual(filterToolNoteTimeline(timeline, 'unknown'), []);
  assert.equal(timeline.length, 3);
});

test('filters field-note timeline by provenance source without mutating order', () => {
  const timeline = getToolNoteTimeline({ market: { note: 'Price note', savedAt: '2026-08-20T12:00:00.000Z', source: 'Seller' }, history: { note: 'History note', savedAt: '2026-08-22T12:00:00.000Z', source: 'Mechanic' }, test: { note: 'Drive note', savedAt: '2026-08-21T12:00:00.000Z', source: 'Seller' } });
  assert.deepEqual(filterToolNoteTimelineBySource(timeline, 'Seller').map((entry) => entry.key), ['test', 'market']);
  assert.equal(filterToolNoteTimelineBySource(timeline, 'Mechanic')[0].key, 'history');
  assert.equal(filterToolNoteTimelineBySource(timeline, 'all').length, 3);
  assert.deepEqual(filterToolNoteTimelineBySource(null, 'Seller'), []);
});

test('preserves field-note provenance when normalizing saved inspections', () => {
  const saved = normalizeSavedInspection({ id: 'saved-1', vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, issues: [], checklist: {}, photos: [], toolNotes: { market: { note: 'Seller price', source: 'Seller', savedAt: '2026-08-22T10:00:00.000Z' } } });
  assert.equal(saved.toolNotes.market.note, 'Seller price');
  assert.equal(saved.toolNotes.market.source, 'Seller');
  assert.equal(saved.toolNotes.market.savedAt, '2026-08-22T10:00:00.000Z');
});

test('filters invalid or oversized local tool observations during backup parsing', () => {
  const raw = JSON.stringify({ app: 'carwise', version: 1, toolNotes: { market: 'ok', history: 42, test: 'x'.repeat(1200), ignored: 'nope' } });
  const parsed = parseInspectionBackup(raw);
  assert.equal(parsed.toolNotes.market.note, 'ok');
  assert.equal(parsed.toolNotes.history, undefined);
  assert.equal(parsed.toolNotes.test.note.length, 1000);
  assert.equal(parsed.toolNotes.ignored, undefined);
});

test('toggles report-preview sections with safe state boundaries', () => {
  assert.deepEqual(toggleReportSection({ summary: true, evidence: false }, 'evidence'), { summary: true, evidence: true });
  assert.deepEqual(toggleReportSection({ summary: true, evidence: true }, 'summary'), { summary: false, evidence: true });
  assert.deepEqual(toggleReportSection(null, 'summary'), { summary: true, evidence: false });
  assert.deepEqual(toggleReportSection({ summary: true }, 'unknown'), { summary: true, evidence: false });
});

test('labels restore sources without exposing inspection contents', () => {
  assert.equal(getRestoreSourceLabel('primary'), 'Primary local inspection');
  assert.equal(getRestoreSourceLabel('pending'), 'Pending local recovery copy');
  assert.equal(getRestoreSourceLabel('imported'), 'Imported Carwise backup');
  assert.equal(getRestoreSourceLabel('unexpected'), 'No restore source recorded');
});

test('renders safe saved-inspection names for complete and incomplete vehicle records', () => {
  assert.equal(getSavedInspectionDisplayName({ year: '2020', make: 'Honda', model: 'Accord' }), '2020 Honda Accord');
  assert.equal(getSavedInspectionDisplayName({ make: 'Honda' }), 'Honda');
  assert.equal(getSavedInspectionDisplayName(null), 'Saved inspection');
  assert.equal(getSavedInspectionDisplayName('invalid'), 'Saved inspection');
});

test('normalizes report action states for idle, busy, and retry flows', () => {
  assert.deepEqual(getReportActionState(), { busy: false, primaryLabel: 'Export PDF report', retryVisible: false, retryLabel: 'Retry sharing', retryKind: 'text', closeLabel: 'Done' });
  assert.equal(getReportActionState({ busy: true, action: 'Preparing PDF…', retry: 'failed', retryKind: 'pdf' }).retryVisible, false);
  assert.deepEqual(getReportActionState({ retry: 'failed', retryKind: 'pdf' }), { busy: false, primaryLabel: 'Export PDF report', retryVisible: true, retryLabel: 'Retry PDF export', retryKind: 'pdf', closeLabel: 'Done' });
  assert.equal(getReportActionState({ retry: 'failed', retryKind: 'unknown' }).retryKind, 'text');
});

test('clears stale restore provenance only for new and decoded flows', () => {
  assert.equal(getRestoreSourceForFlow('pending', 'new'), '');
  assert.equal(getRestoreSourceForFlow('imported', 'decoded'), '');
  assert.equal(getRestoreSourceForFlow('primary', 'restored'), 'primary');
  assert.equal(getRestoreSourceForFlow('unexpected', 'restored'), '');
});

test('formats report-preview provenance without exposing invalid source values', () => {
  assert.equal(getReportProvenanceLabel('primary'), 'Source context · Primary local inspection');
  assert.equal(getReportProvenanceLabel('pending'), 'Source context · Pending local recovery copy');
  assert.equal(getReportProvenanceLabel('imported'), 'Source context · Imported Carwise backup');
  assert.equal(getReportProvenanceLabel('unknown'), '');
  assert.equal(getReportProvenanceLabel(null), '');
});

test('resets all transient report-preview state on close', () => {
  assert.deepEqual(getReportPreviewCloseState(), {
    reportPreview: '',
    reportAction: '',
    reportBusy: false,
    reportRetry: false,
    reportRetryKind: '',
  });
});

test('clears transient navigation overlays as one safe cleanup state', () => {
  assert.deepEqual(getNavigationOverlayCleanup(), {
    selectedPhoto: null,
    selectedSavedInspection: null,
    historyConfirm: null,
  });
});

test('explains settings persistence failures without implying inspection loss', () => {
  const guidance = getSettingsSaveErrorGuidance();
  assert.match(guidance, /could not be saved/i);
  assert.match(guidance, /inspection data is unchanged/i);
  assert.match(guidance, /try again/i);
});

test('starts each AI analysis from a clean transient state', () => {
  assert.deepEqual(getAiAnalysisStartState(), {
    aiResult: null,
    aiPendingFindings: [],
    ranAI: false,
    aiBusy: true,
  });
});

test('allows AI finding review only when pending findings are ready', () => {
  assert.equal(canReviewAiFindings({ busy: true, pendingFindings: [{ name: 'Rust' }] }), false);
  assert.equal(canReviewAiFindings({ busy: false, pendingFindings: [] }), false);
  assert.equal(canReviewAiFindings({ busy: false, pendingFindings: [{ name: 'Rust' }] }), true);
});

test('clears pending AI review after an issue mutation', () => {
  assert.deepEqual(getAiReviewStateAfterIssueMutation(), { aiPendingFindings: [] });
});

test('preserves local recovery warning after successful save', () => {
  assert.match(getLocalSaveSuccessLabel({ pendingCleanupFailed: true }), /older pending copy could not be cleared/i);
  assert.equal(getLocalSaveSuccessLabel({ payloadLength: 250001 }), 'Inspection is large — keeping a compact local copy');
  assert.equal(getLocalSaveSuccessLabel({ payloadLength: 120 }), 'Saved locally');
});

test('locks photo actions only while media processing is active', () => {
  assert.equal(isPhotoActionLocked(true), true);
  assert.equal(isPhotoActionLocked(false), false);
  assert.equal(isPhotoActionLocked(undefined), false);
});

test('does not fabricate a fair price when AI data is unavailable', () => {
  const report = buildInspectionReport({ vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, fairPrice: null, riskScore: 0 });
  assert.match(report, /AI fair price: Unavailable until AI analysis is completed/);
  assert.doesNotMatch(report, /19400/);
});

test('resets report retry metadata at action start', () => {
  assert.deepEqual(getReportActionStartState(), { reportRetry: false, reportRetryKind: '' });
});

test('normalizes checklist photo counts for malformed persisted collections', () => {
  assert.equal(getPhotoCount([{ uri: 'file://photo.jpg' }]), 1);
  assert.equal(getPhotoCount(null), 0);
  assert.equal(getPhotoCount({ length: 4 }), 0);
});

test('prunes comparison selection to existing saved records', () => {
  const inspections = [{ id: 'keep-1' }, { id: 'keep-2' }];
  assert.deepEqual(pruneComparisonSelection(['missing', 'keep-1', 'keep-2'], inspections), ['keep-1', 'keep-2']);
  assert.deepEqual(pruneComparisonSelection(['keep-1', 'keep-2', 'keep-3'], inspections), ['keep-1', 'keep-2']);
  assert.deepEqual(pruneComparisonSelection(null, inspections), []);
});

test('normalizes saved issue display metadata safely', () => {
  assert.deepEqual(getSavedIssueDisplay({ name: '  Brake noise ', severity: 'major', cost: -40 }), { name: 'Brake noise', severity: 'MAJOR', cost: 0 });
  assert.deepEqual(getSavedIssueDisplay({}), { name: 'Unnamed finding', severity: 'MINOR', cost: 0 });
});

test('creates stable keys for saved photo evidence', () => {
  assert.equal(getStablePhotoKey({ id: 'photo-7', uri: 'file://one.jpg' }, 0), 'photo-7');
  assert.equal(getStablePhotoKey({ uri: 'file://two.jpg' }, 1), 'file://two.jpg');
  assert.equal(getStablePhotoKey({}, 2), 'photo-3');
});
