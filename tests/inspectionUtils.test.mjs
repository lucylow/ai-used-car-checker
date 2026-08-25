import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createNewInspectionState, getDerivedInspectionResetState, getNewInspectionTransientResetState, getRepairTotal, getRiskScore, isSameIssue, isValidVin, normalizeVin, normalizeActiveInspection } from '../src/services/inspectionUtils.js';
import { buildInspectionReport, formatCurrency, buildPhotoEvidenceHtml, formatPhotoEvidenceLabel, formatRepairPriorityHtml, getCanceledFlowGuidance, getChecklistGuidance, getDurablePhotoFileName, getFunctionalActionLabel, getInspectionActionGuidance, getInspectionNavigationLabel, getLocalSaveDelay, getMainFlowReadiness, getPhotoActionGuidance, getPhotoScreenGuidance, getLocalSaveLabel, getRestoreSourceLabel, getLocalRestoreErrorGuidance, getLocalSaveErrorGuidance, getLocalRecoveryBanner, getRecoveryLogEntry, getRestoreSanitizationNotice, getMediaErrorGuidance, getErrorDetail, normalizeRecoveryLog, filterRecoveryLogEntries, buildDiagnosticExport, getSafeDateLabel, getRecoveryLogTimeLabel, getReportErrorGuidance, getOperationStatusLabel, getProcessingLabel, getProgressSummaryLabel, getOnboardingProgressPercent, getOnboardingActionDestination, getOnboardingTransitionOffset, getRecentRecoveryEntries, getVinWalkthroughStep, normalizeCarwiseSettings, getMotionDuration, getAnimatedProgressPercent, getRecoveryGuidance, getRecoveryLogPresentation, getReportRetryLabel, getAiErrorGuidance, toggleReportSection, getSavedInspectionDisplayName, getReportActionState, getReportPreviewCloseState, getReportActionStartState, getSettingsSaveErrorGuidance, getLocalSaveSuccessLabel, getLocalSaveIndicator, getRestoreSourceForFlow, getReportProvenanceLabel, isSettingsPersistenceReady, shouldScheduleLocalPersistence, isCurrentPersistenceGeneration, escapeHtml, getTransientTimerCleanupKeys, getNextPersistenceGeneration, isCurrentActionGeneration } from '../src/services/reportUtils.js';
import { getBackupMetadata, getBackupSummary, parseInspectionBackup, selectInspectionRestorePayload, serializeInspectionBackup, upsertToolNote, removeToolNote, getToolNoteEditorState, getToolNoteTimeline, filterToolNoteTimeline, filterToolNoteTimelineBySource } from '../src/services/backupUtils.js';
import { applyDecodedVehicle, canApplyDecodedVehicle, clearVinCache, decodeVin, getVinResultCompleteness, canConfirmVinCapture, getVinCaptureConfidence, normalizeVinCandidate } from '../src/services/vinService.js';
import { clearRetry, clearRetryQueue, enqueueRetry, flushRetryQueue, getRetryDiagnostics, getRetryQueueSize } from '../src/services/retryQueue.js';
import { buildAiAnalysis, getAiConfidenceLabel, getAiEvidenceActions, getAiFindingExplanation, getAiQualitySummary, getAiReadinessMessage, getAiPriorityPlan, getEvidenceCoverage, getPhotoEvidenceReview, filterPhotoEvidenceReviews, updatePhotoReview, buildPhotoFindingDraft, patchIssueByName, getAiRecommendation, getEvidenceAudit, mergeAiFindings, resetAiHistory, getAiAnalysisStartState, canReviewAiFindings, getAiReviewStateAfterIssueMutation } from '../src/services/aiUtils.js';
import { formatComparisonMetricValue, getBackupPreviewRows, getIssueEvidencePhoto, getPhotoDeleteGuidance, getEvidenceHealth, replacePhotoAsset, normalizePhotoAssets, getNavigationOverlayCleanup, isPhotoActionLocked, getPhotoCount, getStablePhotoKey, normalizeReportPreviewCollections } from '../src/services/uiUtils.js';
import { filterAndSortInspections, getHistoryActionMessage, getInspectionCompletion, getInspectionRiskLabel, getInspectionRepairTotal, getInspectionComparison, getComparisonMetricRows, getReportReadiness, normalizeSavedInspection, shouldClearSavedSelection, shouldReplaceSavedInspection, pruneComparisonSelection, getSavedIssueDisplay } from '../src/services/historyUtils.js';

test('keeps AI evidence helpers safe for null top-level payloads', () => {
  assert.deepEqual(getEvidenceAudit(null).missing, ['clear photo evidence', '5 checklist sections', 'asking price']);
  assert.deepEqual(getAiQualitySummary(null).score, 0);
  assert.equal(buildAiAnalysis(null).findings.length, 1);
  assert.equal(getAiQualitySummary({ evidence: { score: Infinity, completedSections: 99, photoCount: 99 } }).score, 0);
  assert.deepEqual(getAiQualitySummary({ evidence: { score: Infinity, completedSections: 99, photoCount: 99 } }).drivers, ['5/5 checklist sections', '6 usable photos']);
  assert.equal(buildAiAnalysis({ issues: [{ cost: Infinity }, { cost: -5 }] }).repairTotal, 850);
  assert.deepEqual(getAiPriorityPlan(null), []);
  assert.equal(getAiRecommendation(null).tier, 'GATHER MORE');
  assert.match(getAiReadinessMessage(null), /Add checklist results/);
  assert.match(getAiFindingExplanation(null), /^0% confidence/);
  assert.equal(getAiConfidenceLabel(Infinity), 'Limited confidence');
  assert.deepEqual(getAiEvidenceActions(null), []);
  assert.equal(canReviewAiFindings(null), false);
  assert.deepEqual(getEvidenceAudit({ checklist: { alpha: true, beta: true, gamma: true, delta: true, epsilon: true } }).confirmed[0], '0/5 checklist sections');
  assert.equal(buildAiAnalysis({ checklist: { alpha: true, beta: true, gamma: true, delta: true, epsilon: true }, photos: [] }).evidence.completedSections, 0);
  assert.deepEqual(buildPhotoFindingDraft(null), { name: 'Photo evidence · Inspection photo', severity: 'minor', cost: 0, note: 'User-confirmed photo evidence requires in-person verification.', photoId: null, source: 'user-confirmed photo evidence' });
  assert.deepEqual(buildPhotoFindingDraft({ label: { unexpected: true }, note: { unexpected: true }, id: { unexpected: true } }), { name: 'Photo evidence · Inspection photo', severity: 'minor', cost: 0, note: 'User-confirmed photo evidence requires in-person verification.', photoId: null, source: 'user-confirmed photo evidence' });
  assert.deepEqual(filterPhotoEvidenceReviews([null, 'bad', { status: 'confirmed' }], 'all'), [{ status: 'confirmed' }]);
  const review = getPhotoEvidenceReview([{ uri: 'file://photo.jpg', id: { unexpected: true }, fileName: { unexpected: true }, reviewStatus: { unexpected: true }, reviewNote: { unexpected: true } }])[0];
  assert.deepEqual({ id: review.id, label: review.label, status: review.status, note: review.note }, { id: 'photo-1', label: 'Photo 1', status: 'needs-confirmation', note: '' });
  assert.doesNotMatch(getAiFindingExplanation({ evidence: { unexpected: true } }), /\[object Object\]/);
  assert.match(getAiPriorityPlan({ issues: [{ severity: { unexpected: true }, cost: 10 }] })[0].why, /^Minor concern/);
  assert.deepEqual(getAiPriorityPlan({ issues: [null, 'invalid', { name: 'Valid issue', severity: 'minor' }] }).map((issue) => issue.name), ['Valid issue']);
  assert.equal(getAiRecommendation({ issues: [null, 'invalid'], confidence: 80, evidenceScore: 80 }).tier, 'PROCEED');
});

test('formats actionable AI failure guidance for each recovery path', () => {
  assert.match(getAiErrorGuidance('analysis'), /existing findings are unchanged/i);
  assert.match(getLocalRecoveryBanner({ retryCount: Infinity, saveRetry: true }).body, /^1 local operation/);
  assert.equal(getRestoreSanitizationNotice(Infinity), '');
  assert.equal(getLocalRecoveryBanner(null), null);
  assert.equal(getLocalSaveSuccessLabel(null), 'Saved locally');
  assert.match(getInspectionActionGuidance(null), /Complete the checklist/);
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
  const malformed = getEvidenceAudit({ issues: [null, 'bad', { name: 'Valid issue' }], pendingFindings: [{ name: { unexpected: true } }, { name: '  Valid suggestion  ' }] });
  assert.match(malformed.confirmed[0], /0\/5/);
  assert.equal(malformed.confirmed[1], '1 recorded issue');
  assert.deepEqual(malformed.suggested, ['Valid suggestion']);
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
  assert.equal(getBackupSummary(null), '0 saved inspections · 0 active photos');
  assert.equal(JSON.parse(serializeInspectionBackup(null)).app, 'carwise');
  const serialized = JSON.parse(serializeInspectionBackup({ vehicle: 'bad', issues: [null, 'bad', { name: 'Valid issue' }], checklist: ['bad'], photos: [null, 'bad', { uri: 'file://valid.jpg' }], savedInspections: [null, 'bad', { id: 'saved-1' }], aiHistory: [null, 'bad', { confidence: 80 }] }));
  assert.equal(serialized.vehicle, null);
  assert.deepEqual(serialized.issues, [{ name: 'Valid issue' }]);
  assert.deepEqual(serialized.checklist, {});
  assert.deepEqual(serialized.photos, [{ uri: 'file://valid.jpg' }]);
  assert.deepEqual(serialized.savedInspections, [{ id: 'saved-1' }]);
  assert.deepEqual(serialized.aiHistory, [{ confidence: 80 }]);
  assert.equal(getBackupMetadata(null).sizeLabel, '0 B');
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
  assert.equal(selectInspectionRestorePayload({ malformed: true }, ['invalid']), null);
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
  const confidenceComparison = getInspectionComparison({ id: 'zero', vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, aiHistory: [{ confidence: 0 }] }, { id: 'over', vehicle: { year: '2019', make: 'Toyota', model: 'Camry' }, aiHistory: [{ confidence: 140 }] });
  assert.equal(confidenceComparison.left.confidence, 0);
  assert.equal(confidenceComparison.right.confidence, 100);
  assert.equal(getInspectionComparison({ vehicle: {} }, null), null);
  assert.deepEqual(getComparisonMetricRows({ left: null, right: {} }), []);
  const safeRows = getComparisonMetricRows({ left: { repairs: -10, photos: undefined }, right: { repairs: 'bad', photos: 2 } });
  assert.equal(safeRows.find((row) => row.key === 'repairs').leftRatio, 0);
  assert.equal(safeRows.find((row) => row.key === 'repairs').rightRatio, 0);
  assert.equal(safeRows.find((row) => row.key === 'photos').leftRatio, 0);
  assert.equal(safeRows.find((row) => row.key === 'photos').rightRatio, 1);
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
  const normalized = normalizeActiveInspection({ vehicle: ['bad'], issues: [{ name: ' Brake ', severity: 'unknown', cost: '-5' }, null, { cost: 20 }], checklist: { Exterior: true, bad: 'yes' }, photos: [null, 'bad', { uri: 'file://valid.jpg' }, ['bad']] });
  assert.equal(normalized.vehicle.year, '');
  assert.equal(normalized.issues.length, 2);
  assert.equal(normalized.issues[0].severity, 'minor');
  assert.equal(normalized.issues[0].cost, 0);
  assert.equal(normalized.issues[1].name, 'Unnamed finding');
  assert.deepEqual(normalized.checklist, { Exterior: true });
  assert.deepEqual(normalized.photos, [{ uri: 'file://valid.jpg' }]);
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
  const malformed = { savedInspections: [{ id: 'kept' }, null, 'bad'], photos: [{ uri: 'x' }, null, 'bad'], aiHistory: [{ confidence: 70 }, null, 'bad'] };
  assert.deepEqual(getBackupMetadata({ backup: malformed, serialized: '' }), { bytes: 0, sizeLabel: '0 B', savedInspections: 1, activePhotos: 1, aiSnapshots: 1, exportedAt: null });
  assert.equal(getBackupSummary(malformed), '1 saved inspection · 1 active photo');
});

test('normalizes saved inspections without allowing malformed nested data to crash screens', () => {
  assert.equal(normalizeSavedInspection(null), null);
  const safe = normalizeSavedInspection({ id: 'saved-1', vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, issues: [{ name: 'Brake', cost: 400 }, 'bad'], checklist: null, photos: [{ id: 'p1' }, null] });
  const malformedVehicle = normalizeSavedInspection({ id: 'saved-2', vehicle: { year: { value: 2020 }, make: ' Honda ', model: 2024, vin: ' 1hg cm82633a004352 ' } });
  assert.deepEqual(malformedVehicle.vehicle, { year: '', make: 'Honda', model: '2024', mileage: '', vin: '1HGCM82633A004352', asking: '' });
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
  assert.deepEqual(filterAndSortInspections([null, 'bad', inspections[0]], null).map((item) => item.id), ['a']);
  assert.deepEqual(filterAndSortInspections(null, 'Honda'), []);
  assert.deepEqual(inspections.map((item) => item.id), ['a', 'b']);
});

test('formats canceled-flow guidance consistently', () => {
  assert.match(getCanceledFlowGuidance('camera'), /canceled/i);
  assert.match(getCanceledFlowGuidance('library'), /unchanged/i);
  assert.match(getCanceledFlowGuidance('backup'), /unchanged/i);
});

test('reports main inspection flow readiness consistently', () => {
  assert.deepEqual(getMainFlowReadiness({ vehicle: { make: '', model: '' }, checklist: {}, photos: [] }), { ready: false, missing: ['vehicle details', 'checklist', 'photo evidence'] });
  assert.deepEqual(getMainFlowReadiness({ vehicle: null, checklist: null, photos: null }), { ready: false, missing: ['vehicle details', 'checklist', 'photo evidence'] });
  assert.deepEqual(getMainFlowReadiness(null), { ready: false, missing: ['vehicle details', 'checklist', 'photo evidence'] });
  assert.equal(getMainFlowReadiness({ vehicle: { make: 'Honda', model: 'Accord' }, checklist: { Exterior: true, 'Tires & brakes': true, 'Engine bay': true, Interior: true, 'Test drive': true }, photos: [{ uri: 'file://photo.jpg' }] }).ready, false);
  assert.deepEqual(getMainFlowReadiness({ vehicle: { year: '20', make: 'Honda', model: 'Accord' }, checklist: { Exterior: true, 'Tires & brakes': true, 'Engine bay': true, Interior: true, 'Test drive': true }, photos: [{ uri: 'file://photo.jpg' }] }).missing, ['vehicle details']);
  assert.deepEqual(getMainFlowReadiness({ vehicle: { year: '2020', make: '  ', model: 'Accord' }, checklist: { Exterior: true, 'Tires & brakes': true, 'Engine bay': true, Interior: true, 'Test drive': true }, photos: [{ uri: 'file://photo.jpg' }] }).missing, ['vehicle details']);
  assert.equal(getMainFlowReadiness({ vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, checklist: { Exterior: true, 'Tires & brakes': true, 'Engine bay': true, Interior: true, 'Test drive': true }, photos: [{ uri: 'file://photo.jpg' }] }).ready, true);
  assert.equal(getMainFlowReadiness({ vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, checklist: { alpha: true, beta: true, gamma: true, delta: true, epsilon: true }, photos: [{ uri: 'file://photo.jpg' }] }).ready, false);
  assert.deepEqual(getMainFlowReadiness({ vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, checklist: { Exterior: true, Tires: true, Engine: true, Interior: true, Test: true }, photos: [null, 'invalid'] }).missing, ['photo evidence']);
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
  assert.deepEqual(getReportReadiness({ vehicle: null, checklist: null, photos: null }), { ready: false, missing: ['vehicle details', 'checklist', 'photo evidence'] });
  assert.deepEqual(getReportReadiness(null), { ready: false, missing: ['vehicle details', 'checklist', 'photo evidence'] });
  assert.equal(getReportReadiness({ vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, checklist: { alpha: true, beta: true, gamma: true, delta: true, epsilon: true }, photos: [{ id: 'p1' }] }).ready, false);
  assert.deepEqual(getReportReadiness({ vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, checklist: { Exterior: true, Tires: true, Engine: true, Interior: true, Test: true }, photos: [null, 'invalid'] }).missing, ['photo evidence']);
});

test('formats saved-inspection risk and completion metadata consistently', () => {
  const item = { issues: [{ severity: 'critical', cost: 900 }, { severity: 'critical', cost: 300 }], checklist: { Exterior: true, Interior: true } };
  assert.equal(getInspectionRiskLabel(item), 'HIGH RISK');
  assert.equal(getInspectionCompletion(item), '2/5 sections');
  assert.equal(getInspectionCompletion(null), '0/5 sections');
  assert.equal(getInspectionCompletion({ checklist: [] }), '0/5 sections');
  assert.equal(getInspectionCompletion({ checklist: { one: true, two: true, three: true, four: true, five: true, extra: true } }), '0/5 sections');
  assert.equal(getInspectionCompletion({ checklist: { Exterior: true, Tires: true, Engine: true, Interior: true, Test: true, extra: true } }), '5/5 sections');
  assert.equal(getInspectionRepairTotal(item), 1200);
  assert.equal(getInspectionRepairTotal({ issues: [null, { cost: -500 }, { cost: 275 }, { cost: Infinity }] }), 275);
  assert.equal(getSavedIssueDisplay({ name: 'Bad cost', cost: Infinity }).cost, 0);
  assert.equal(getInspectionRiskLabel({ issues: [null, 'bad', { severity: 'critical' }, { severity: 'critical' }] }), 'HIGH RISK');
  const comparison = getInspectionComparison({ id: 'left', vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, checklist: { one: true, two: true, three: true, four: true, five: true }, photos: [] }, { id: 'right', vehicle: { year: '2021', make: 'Toyota', model: 'Camry' }, checklist: { Exterior: true, Tires: true, Engine: true, Interior: true, Test: true }, photos: [] });
  assert.equal(comparison.left.checklist, 0);
  assert.equal(comparison.right.checklist, 5);
});

test('clears derived AI and report state when loading another inspection', () => {
  assert.deepEqual(getDerivedInspectionResetState(), { ranAI: false, reportPreview: '' });
});

test('keeps saved-inspection replacement checks safe for malformed vehicles', () => {
  assert.equal(shouldReplaceSavedInspection(null, null), false);
  assert.equal(shouldReplaceSavedInspection({ vin: '1HGCM82633A004352' }, null), false);
  assert.equal(shouldReplaceSavedInspection(null, { vin: '1HGCM82633A004352' }), false);
  assert.equal(shouldReplaceSavedInspection({ vin: '1HGCM82633A004352' }, { vin: ' 1hgcm82633a004352 ' }), true);
});
test('matches issues by identity without conflating duplicate names', () => {
  const first = { id: 'one', name: 'Brake wear' };
  const second = { id: 'two', name: 'Brake wear' };
  assert.equal(isSameIssue(first, first), true);
  assert.equal(isSameIssue(first, { id: 'one', name: 'Brake wear' }), true);
  assert.equal(isSameIssue(first, second), false);
});

test('resets transient state when starting a new inspection', () => {
  const reset = getNewInspectionTransientResetState();
  assert.equal(reset.ranAI, false);
  assert.equal(reset.aiResult, null);
  assert.deepEqual(reset.aiPendingFindings, []);
  assert.deepEqual(reset.toolNotes, {});
  assert.equal(reset.selectedSavedInspection, null);
  assert.equal(reset.reportBusy, false);
  assert.deepEqual(reset.reportSections, { summary: true, evidence: false });
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

test('keeps report money formatting safe for invalid values', () => {
  assert.equal(formatCurrency(Infinity), '$0');
  assert.equal(formatCurrency(-25), '$0');
  const report = buildInspectionReport({ vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, issues: [{ cost: Infinity }, { cost: -40 }], fairPrice: Infinity });
  assert.match(report, /Estimated repairs: \$0/);
  assert.match(report, /AI fair price: Unavailable until AI analysis is completed/);
  assert.match(formatRepairPriorityHtml([{ severity: 'major', name: 'Invalid cost', cost: Infinity }]), /\$0/);
  assert.match(buildInspectionReport(null), /Vehicle details unavailable/);
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

test('keeps preview helpers safe for null top-level payloads', () => {
  assert.deepEqual(getBackupPreviewRows(null), [['File size', '0 B'], ['Saved inspections', 0], ['Active photos', 0], ['AI snapshots', 0]]);
  assert.deepEqual(getBackupPreviewRows({ sizeLabel: ' 2 KB ', savedInspections: -2, activePhotos: 2.8, aiSnapshots: Infinity }), [['File size', '2 KB'], ['Saved inspections', 0], ['Active photos', 2], ['AI snapshots', 0]]);
  assert.deepEqual(normalizeReportPreviewCollections(null), { photos: [], issues: [] });
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
  assert.equal(formatPhotoEvidenceLabel({ fileName: { unexpected: true }, width: Infinity, height: { unexpected: true } }, -2), 'Photo 1 · metadata only');
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

test('derives safe editor state when switching quick-tool notes', () => {
  assert.deepEqual(getToolNoteEditorState({ market: { note: '  Asking price is high. ', source: 'Seller' } }, 'market'), { note: 'Asking price is high.', source: 'Seller', editing: true });
  assert.deepEqual(getToolNoteEditorState({ history: 'legacy note' }, 'history'), { note: '', source: 'User-entered observation', editing: false });
  assert.deepEqual(getToolNoteEditorState(null, 'test'), { note: '', source: 'User-entered observation', editing: false });
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
  const malformed = upsertToolNote(null, 'market', { unexpected: true }, { unexpected: true }, { unexpected: true });
  assert.deepEqual(malformed.market, { note: '', savedAt: null, source: 'User-entered observation' });
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
  assert.deepEqual(filterToolNoteTimeline([null, 'invalid', ...timeline], 'all').map((entry) => entry.key), ['history', 'test', 'market']);
});

test('filters field-note timeline by provenance source without mutating order', () => {
  const timeline = getToolNoteTimeline({ market: { note: 'Price note', savedAt: '2026-08-20T12:00:00.000Z', source: 'Seller' }, history: { note: 'History note', savedAt: '2026-08-22T12:00:00.000Z', source: 'Mechanic' }, test: { note: 'Drive note', savedAt: '2026-08-21T12:00:00.000Z', source: 'Seller' } });
  assert.deepEqual(filterToolNoteTimelineBySource(timeline, 'Seller').map((entry) => entry.key), ['test', 'market']);
  assert.equal(filterToolNoteTimelineBySource(timeline, 'Mechanic')[0].key, 'history');
  assert.equal(filterToolNoteTimelineBySource(timeline, 'all').length, 3);
  assert.deepEqual(filterToolNoteTimelineBySource(null, 'Seller'), []);
  assert.deepEqual(filterToolNoteTimelineBySource([null, 'invalid', ...timeline], 'all').map((entry) => entry.key), ['history', 'test', 'market']);
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

test('normalizes report-preview evidence collections safely', () => {
  const normalized = normalizeReportPreviewCollections({ photos: [{ uri: 'file://photo.jpg' }, null, ['invalid'], { id: 'metadata-only' }], issues: [{ name: 'Brake noise' }, 'invalid', ['invalid']] });
  assert.equal(normalized.photos.length, 2);
  assert.equal(normalized.issues.length, 1);
  assert.deepEqual(normalized.photos[1], { id: 'metadata-only' });
  assert.deepEqual(normalizeReportPreviewCollections({ photos: null, issues: null }), { photos: [], issues: [] });
});

test('normalizes decoded VIN fields without object-string leakage', () => {
  assert.deepEqual(applyDecodedVehicle({ year: '2018', make: 'Toyota', model: 'Camry' }, { year: {}, make: null, model: ' Accord ' }, '1HGCM82633A004352'), { year: '2018', make: 'Toyota', model: 'Accord', vin: '1HGCM82633A004352' });
  assert.deepEqual(applyDecodedVehicle({ year: { unsafe: true }, make: { unsafe: true }, model: null, mileage: { unsafe: true }, asking: ['unsafe'], ignored: 'drop' }, null, null), { year: '', make: '', model: '', vin: '', mileage: '', asking: '' });
});

test('reports VIN identity completeness deterministically', () => {
  assert.deepEqual(getVinResultCompleteness({ year: '2020', make: 'Ford', model: 'Focus' }), { present: 3, total: 3, complete: true, missing: [], missingLabels: [] });
  assert.deepEqual(getVinResultCompleteness({ year: '2020', make: 'Ford' }), { present: 2, total: 3, complete: false, missing: ['model'], missingLabels: ['Model'] });
  assert.deepEqual(getVinResultCompleteness(null), { present: 0, total: 3, complete: false, missing: ['year', 'make', 'model'], missingLabels: ['Year', 'Make', 'Model'] });
});

test('blocks applying incomplete decoded VIN identity', () => {
  assert.equal(canApplyDecodedVehicle({ year: '2020', make: 'Ford', model: 'Focus' }), true);
  assert.equal(canApplyDecodedVehicle({ year: '2020', make: 'Ford' }), false);
  assert.equal(canApplyDecodedVehicle(null), false);
});

test('filters malformed photo records across AI evidence review boundaries', () => {
  const photos = [null, 'invalid', [], { uri: ' ' }, { id: 'photo-1', uri: ' file://valid.jpg ' }, { id: 'object-uri', uri: { unexpected: true } }];
  assert.equal(getPhotoEvidenceReview(photos).length, 1);
  assert.equal(getEvidenceCoverage({ photos }).photoCount, 1);
  assert.equal(getEvidenceAudit({ photos }).usablePhotoCount, 1);
  assert.deepEqual(updatePhotoReview(photos, 'photo-1', { unexpected: true }, { unexpected: true }), [{ id: 'photo-1', uri: ' file://valid.jpg ', reviewStatus: 'needs-confirmation', reviewNote: '' }]);
});

test('sanitizes malformed existing issues before AI analysis calculations', () => {
  const result = buildAiAnalysis({ issues: [null, 'invalid', { name: { unexpected: true }, severity: 'critical', cost: 5000 }, { name: '  Brake wear  ', severity: 'unexpected', cost: 'not-a-number', note: { unexpected: true }, source: { unexpected: true } }] });
  assert.deepEqual(result.issues.map((issue) => issue.name), ['Brake wear', 'Rust underneath']);
  assert.equal(result.issues[0].severity, 'minor');
  assert.equal(result.issues[0].cost, 0);
  assert.equal(result.issues[0].note, '');
  assert.equal(result.repairTotal, 850);
  assert.equal(result.recommendation.tier, 'PAUSE');
});

test('filters malformed findings across AI merge and decision helpers', () => {
  const malformed = [null, 'invalid', [], { name: { unexpected: true }, severity: 'critical' }, { name: 'Valid finding', severity: 'minor', cost: 120 }];
  const merged = mergeAiFindings(malformed, [{ name: { unexpected: true }, severity: 'critical' }, { name: 'New finding', severity: 'major', cost: 300 }]);
  assert.deepEqual(merged.map((issue) => issue.name), ['Valid finding', 'New finding']);
  assert.deepEqual(patchIssueByName(malformed, 'Valid finding', { cost: 250 }).map((issue) => issue.name), ['Valid finding']);
  assert.deepEqual(getAiPriorityPlan({ issues: malformed, evidenceScore: 80 }).map((issue) => issue.name), ['Unnamed finding', 'Valid finding']);
  assert.equal(getEvidenceAudit({ issues: malformed }).confirmed.at(-1), '1 recorded issue');
});

test('sanitizes malformed report export collections and embedded photo markup', () => {
  const photoHtml = buildPhotoEvidenceHtml([{ embeddedDataUri: 'data:image/svg+xml,<svg onerror="bad">', fileName: { unsafe: true } }, { embeddedDataUri: 'data:image/jpeg;base64,abc123', fileName: 'front.jpg' }, ['invalid'], null]);
  assert.equal((photoHtml.match(/<figure/g) || []).length, 1);
  assert.doesNotMatch(photoHtml, /onerror=/);
  const issueHtml = formatRepairPriorityHtml([{ name: { unsafe: true }, severity: { unsafe: true }, cost: 'bad' }, ['invalid'], { name: 'Brake wear', severity: 'major', cost: 400 }]);
  assert.match(issueHtml, /Brake wear/);
  assert.doesNotMatch(issueHtml, /\[object Object\]/);
  const report = buildInspectionReport({ vehicle: { year: { unsafe: true }, make: ' Honda ', model: ' Accord ' }, issues: [['invalid'], { name: { unsafe: true }, severity: 'critical', cost: 500 }], photos: [['invalid'], { uri: 'file://valid.jpg' }], checklist: { Exterior: true }, riskScore: 140 });
  assert.match(report, /Honda Accord/);
  assert.match(report, /Issues found: 1 \(1 critical\)/);
  assert.match(report, /Photo evidence: 1 item/);
  assert.match(report, /Risk score: 100\/100/);
  assert.doesNotMatch(report, /\[object Object\]/);
});

test('normalizes saved-history timestamps and bounds nested collections', () => {
  const normalized = normalizeSavedInspection({ vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, savedAt: { unsafe: true }, issues: Array.from({ length: 90 }, () => ({ name: 'Issue' })), photos: Array.from({ length: 90 }, () => ({ id: 'photo' })), aiHistory: Array.from({ length: 8 }, (_, index) => ({ confidence: index })) });
  assert.equal(normalized.savedAt, '1970-01-01T00:00:00.000Z');
  assert.equal(normalized.issues.length, 80);
  assert.equal(normalized.photos.length, 80);
  assert.equal(normalized.aiHistory.length, 6);
  const sorted = filterAndSortInspections([
    { id: 'invalid-date', vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, savedAt: { unsafe: true } },
    { id: 'dated', vehicle: { year: '2021', make: 'Honda', model: 'Civic' }, savedAt: '2026-08-24T00:00:00.000Z' },
  ]);
  assert.deepEqual(sorted.map((item) => item.id), ['dated', 'invalid-date']);
});

test('normalizes malformed retry entries and bounds diagnostic metadata', async () => {
  clearRetryQueue();
  assert.equal(enqueueRetry({ key: '  normalized-key  ', maxAttempts: 999, run: async () => { throw new Error('  offline  '); } }), true);
  const first = await flushRetryQueue();
  assert.deepEqual(first, { succeeded: 0, failed: 1, dropped: 0 });
  const diagnostic = getRetryDiagnostics()[0];
  assert.deepEqual({ key: diagnostic.key, attempts: diagnostic.attempts, maxAttempts: diagnostic.maxAttempts, detail: diagnostic.detail }, { key: 'normalized-key', attempts: 1, maxAttempts: 8, detail: 'offline' });
  assert.equal(Number.isNaN(Date.parse(diagnostic.at)), false);
  assert.equal(clearRetry(' normalized-key '), true);
  assert.equal(enqueueRetry({ key: { unsafe: true }, run: async () => {} }), false);
  assert.equal(enqueueRetry({ key: 'invalid-run', run: 'bad' }), false);
  clearRetryQueue();
});

test('sanitizes malformed VIN response fields and protects cached results', async () => {
  clearVinCache();
  const result = await decodeVin('3CZRE4H59AG700001', { fetchImpl: async () => ({ ok: true, async json() { return { Results: [{ ModelYear: { unsafe: true }, Make: ' Honda ', Model: ' Accord ', Trim: 'x'.repeat(200), DisplacementL: 'bad', EngineCylinders: 99 }] }; } }) });
  assert.deepEqual(result.vehicle, { year: '', make: 'Honda', model: 'Accord', trim: 'x'.repeat(120), bodyClass: '', engine: '' });
  result.vehicle.make = 'Mutated';
  const cached = await decodeVin('3CZRE4H59AG700001', { fetchImpl: async () => { throw new Error('cache should be used'); } });
  assert.equal(cached.vehicle.make, 'Honda');
  clearVinCache();
  const malformedPayload = await decodeVin('JH4KA9650MC012345', { fetchImpl: async () => ({ ok: true, async json() { return { Results: [null] }; } }) });
  assert.equal(malformedPayload.status, 'fallback');
});

test('does not treat empty or malformed evidence as report-ready', () => {
  const completeChecklist = { Exterior: true, Tires: true, Engine: true, Interior: true, Test: true };
  assert.deepEqual(getReportReadiness({ vehicle: { year: { unsafe: true }, make: 'Honda', model: 'Accord' }, checklist: completeChecklist, photos: [{}, { id: { unsafe: true } }, ['invalid']] }).missing, ['vehicle details', 'photo evidence']);
  assert.equal(getReportReadiness({ vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, checklist: completeChecklist, photos: [{ fileName: 'front.jpg' }] }).ready, true);
  assert.equal(getEvidenceHealth([{ photoId: { unsafe: true } }, ['invalid'], { photoId: 'photo-1' }], [{ id: 'photo-1', uri: 'file://one.jpg' }]).linkedCount, 1);
});

test('sanitizes malformed report-operation diagnostics and guidance inputs', () => {
  const parsed = JSON.parse(buildDiagnosticExport(null));
  assert.equal(parsed.appVersion, 'unknown');
  const diagnostics = JSON.parse(buildDiagnosticExport({ appVersion: { unsafe: true }, retryDiagnostics: [null, ['bad'], { key: { unsafe: true }, attempts: Infinity, maxAttempts: -4, detail: { unsafe: true } }] }));
  assert.deepEqual(diagnostics.retryQueue, [{ key: 'unknown', attempts: 0, maxAttempts: 0, detail: 'Needs attention or retry.' }]);
  assert.equal(getDurablePhotoFileName({ unsafe: true }, Infinity).startsWith('carwise-'), true);
  assert.match(getInspectionActionGuidance({ photoCount: Infinity, reportReady: true }), /add photos/i);
});

test('sanitizes malformed settings and motion preference values', () => {
  assert.deepEqual(normalizeCarwiseSettings([], []), { compactMode: false, aiDisclosure: true, motionIntensity: 'standard' });
  assert.deepEqual(normalizeCarwiseSettings({ motionIntensity: { unsafe: true } }, { motionIntensity: 'gentle' }), { compactMode: false, aiDisclosure: true, motionIntensity: 'gentle' });
  assert.equal(getMotionDuration(Infinity, 'standard'), 40);
  assert.equal(getMotionDuration(999999, 'standard'), 2000);
});

test('bounds malformed saved-history comparison metrics', () => {
  const comparison = getInspectionComparison({ id: 'left', vehicle: { year: Infinity, make: 'Honda', model: 'Accord' }, issues: [{ severity: 'critical' }, { severity: 'critical' }, { severity: 'critical' }], checklist: {}, photos: [] }, { id: 'right', vehicle: { year: '2021', make: 'Toyota', model: 'Camry' }, issues: [], checklist: {}, photos: [] });
  assert.equal(comparison.left.risk, 100);
  assert.equal(comparison.left.label, ' Honda Accord');
  const rows = getComparisonMetricRows({ left: { risk: Infinity, repairs: Infinity, checklist: Infinity, photos: Infinity, confidence: Infinity }, right: { risk: -2, repairs: -5, checklist: -3, photos: -4, confidence: -6 } });
  assert.equal(rows.find((row) => row.key === 'risk').leftRatio, 0);
  assert.equal(rows.find((row) => row.key === 'repairs').left, 0);
  assert.equal(rows.find((row) => row.key === 'checklist').left, 0);
  assert.equal(rows.find((row) => row.key === 'confidence').right, 0);
});

test('rejects object-valued saved-history identities during selection and duplicate checks', () => {
  assert.equal(shouldClearSavedSelection({ id: 'same' }, { id: 'same' }), false);
  assert.equal(shouldClearSavedSelection('saved-1', 'saved-1'), true);
  assert.deepEqual(pruneComparisonSelection([{ unsafe: true }, 'saved-1', 'missing'], [{ id: 'saved-1' }]), ['saved-1']);
  assert.equal(shouldReplaceSavedInspection({ vin: { unsafe: true } }, { vin: { unsafe: true } }), false);
  assert.equal(shouldReplaceSavedInspection({ vin: ' 1HGCM82633A004352 ' }, { vin: '1hgcm82633a004352' }), true);
});

test('sanitizes active merge keys and rejects malformed issue identities', () => {
  const checklist = JSON.parse('{"Exterior":true,"__proto__":true,"constructor":false,"Tires & brakes":true,"unsafe":"yes"}');
  const normalized = normalizeActiveInspection({ checklist });
  assert.deepEqual(normalized.checklist, { Exterior: true, 'Tires & brakes': true });
  assert.equal(isSameIssue({ id: { unsafe: true } }, { id: { unsafe: true } }), false);
  assert.equal(isSameIssue([], []), false);
  assert.equal(isSameIssue({ id: 'issue-1' }, { id: 'issue-1' }), true);
  assert.equal(normalizeVin({ unsafe: true }), '');
});

test('bounds malformed AI money and recommendation inputs', () => {
  const analysis = buildAiAnalysis({ vehicle: { asking: { unsafe: true } }, issues: [{ name: 'Extreme reserve', severity: 'major', cost: Number.MAX_VALUE }] });
  assert.equal(analysis.repairTotal, 100000000);
  assert.equal(analysis.fairPrice, null);
  assert.match(analysis.negotiation, /100,000,000/);
  assert.equal(getAiRecommendation({ issues: [], repairTotal: Number.MAX_VALUE, confidence: Infinity, evidenceScore: Infinity }).tier, 'NEGOTIATE');
  assert.equal(getAiPriorityPlan({ issues: [{ name: 'Large estimate', cost: Number.MAX_VALUE }], evidenceScore: Infinity })[0].cost, 100000000);
});

test('does not treat malformed truthy vehicle values as AI identity evidence', () => {
  const audit = getEvidenceAudit({ vehicle: { year: { unsafe: true }, make: [], model: { unsafe: true }, asking: { unsafe: true } }, checklist: { Exterior: true }, photos: [{ uri: 'file://photo.jpg' }] });
  assert.equal(audit.confirmed.includes('Vehicle identity'), false);
  assert.equal(audit.missing.includes('asking price'), true);
  const quality = getAiQualitySummary({ evidence: { score: 100, completedSections: 5, photoCount: 4 }, vehicle: { vin: { unsafe: true } } });
  assert.equal(quality.score, 80);
  assert.equal(quality.drivers.includes('VIN identified'), false);
});

test('formats unavailable saved market values without zero fabrication', async () => {
  const { getMarketComparisonDisplay } = await import('../src/services/marketUtils.js');
  assert.deepEqual(getMarketComparisonDisplay({}), { asking: 'Not provided', comparable: 'Not provided', mileage: 'Not provided', condition: 'fair' });
  assert.deepEqual(getMarketComparisonDisplay({ askingPrice: '22000', comparableLow: '20000' }), { asking: '$22,000', comparable: '$20,000–Not provided', mileage: 'Not provided', condition: 'fair' });
});

test('formats malformed saved market data safely for history review', async () => {
  const { normalizeMarketComparison, getMarketComparisonSummary } = await import('../src/services/marketUtils.js');
  const normalized = normalizeMarketComparison({ askingPrice: {}, comparableLow: [], comparableHigh: 'bad', mileage: null });
  assert.equal(normalized.askingPrice, 0);
  assert.equal(normalized.mileage, 0);
  assert.match(getMarketComparisonSummary(normalized), /asking price/);
});

test('keeps market form hook imports available for runtime initialization', () => {
  const source = readFileSync(new URL('../components/market-comparison-tool.js', import.meta.url), 'utf8');
  assert.match(source, /import React, \{ useEffect, useState \} from ['"]react['"];?/);
  assert.equal((source.match(/\buseEffect\b/g) || []).length >= 2, true);
  assert.equal((source.match(/\buseState\b/g) || []).length >= 3, true);
});

test('preserves validated market comparison through saved inspection normalization', async () => {
  const { normalizeMarketComparison } = await import('../src/services/marketUtils.js');
  const normalized = normalizeSavedInspection({ vehicle: { year: '2020', make: 'Honda', model: 'Accord' }, marketComparison: { askingPrice: '22000', comparableLow: '20000', comparableHigh: '24000' } });
  assert.deepEqual(normalized.marketComparison, normalizeMarketComparison({ askingPrice: '22000', comparableLow: '20000', comparableHigh: '24000' }));
});

test('does not claim a range exists when market bounds are incomplete', async () => {
  const { getMarketComparisonSummary } = await import('../src/services/marketUtils.js');
  assert.match(getMarketComparisonSummary({ askingPrice: 22000 }), /Add both comparable bounds/);
  assert.match(getMarketComparisonSummary({ askingPrice: 22000, comparableLow: 20000 }), /Add both comparable bounds/);
});

test('blocks invalid market drafts before persistence', async () => {
  const { shouldPersistMarketComparison } = await import('../src/services/marketUtils.js');
  assert.equal(shouldPersistMarketComparison({ askingPrice: 22000, comparableLow: 25000, comparableHigh: 20000 }), false);
  assert.equal(shouldPersistMarketComparison({ askingPrice: 22000, comparableLow: 20000, comparableHigh: 24000 }), true);
});

test('validates structured market ranges and normalizes unsafe values', async () => {
  const { normalizeMarketComparison, validateMarketComparison, getMarketComparisonSummary } = await import('../src/services/marketUtils.js');
  const value = normalizeMarketComparison({ askingPrice: '<22000', comparableLow: 25000, comparableHigh: 20000, mileage: '48,200', condition: 'unknown' });
  assert.deepEqual(value, { askingPrice: 22000, comparableLow: 25000, comparableHigh: 20000, mileage: 48200, condition: 'fair', source: '', updatedAt: null });
  assert.equal(validateMarketComparison(value).valid, false);
  assert.equal(validateMarketComparison({ askingPrice: 0 }).valid, false);
  assert.match(getMarketComparisonSummary(value), /Fix the comparable range/);
});

test('guards malformed decoded VIN vehicles before result rendering', async () => {
  const { getSafeDecodedVehicle } = await import('../src/services/vinService.js');
  assert.equal(getSafeDecodedVehicle(null), null);
  assert.equal(getSafeDecodedVehicle([]), null);
  assert.deepEqual(getSafeDecodedVehicle({ year: '2020', make: 'Honda' }), { year: '2020', make: 'Honda' });
});

test('discloses format-only VIN confidence to users', async () => {
  const { getVinConfidenceDisclosure } = await import('../src/services/vinService.js');
  assert.match(getVinConfidenceDisclosure(0.96), /Format-based confidence only/);
  assert.match(getVinConfidenceDisclosure(0.38), /Format check is incomplete/);
});

test('gates camera VIN confirmation by normalized length and confidence', () => {
  const candidate = normalizeVinCandidate('1HGCM82633A004352');
  assert.equal(getVinCaptureConfidence(candidate), 0.96);
  assert.equal(canConfirmVinCapture({ candidate, confidence: 0.96 }), true);
  assert.equal(canConfirmVinCapture({ candidate: '1HGCM82633A00435', confidence: 0.96 }), false);
  assert.equal(canConfirmVinCapture({ candidate, confidence: 0.62 }), false);
});

test('derives visible local-save indicator states', () => {
  assert.deepEqual(getLocalSaveIndicator({ state: 'saving' }), { label: 'Saving locally…', tone: 'active' });
  assert.deepEqual(getLocalSaveIndicator({ state: 'saved' }), { label: 'Saved locally', tone: 'success' });
  assert.deepEqual(getLocalSaveIndicator({ state: 'error', retry: true }), { label: 'Local recovery needed', tone: 'warning' });
});

test('rejects malformed persisted timestamps before date formatting', () => {
  assert.equal(getSafeDateLabel({ toString: () => '2026-01-15' }), 'Date unavailable');
  assert.equal(getSafeDateLabel(['2026-01-15']), 'Date unavailable');
  assert.equal(getSafeDateLabel(0), 'Date unavailable');
  assert.equal(getSafeDateLabel('   ', 'Time unavailable'), 'Time unavailable');
  assert.notEqual(getSafeDateLabel('2026-01-15T00:00:00.000Z'), 'Date unavailable');
});

test('requires strict pending-cleanup state before warning after local save', () => {
  assert.match(getLocalSaveSuccessLabel({ pendingCleanupFailed: true }), /older pending copy/);
  assert.equal(getLocalSaveSuccessLabel({ pendingCleanupFailed: 1 }), 'Saved locally');
  assert.equal(getLocalSaveSuccessLabel({ pendingCleanupFailed: 'true' }), 'Saved locally');
  assert.equal(getLocalSaveSuccessLabel({ pendingCleanupFailed: {}, payloadLength: 250001 }), 'Inspection is large — keeping a compact local copy');
});

test('requires strict retry state before showing local recovery guidance', () => {
  assert.equal(getLocalRecoveryBanner({ saveRetry: true })?.action, 'Retry local saves');
  assert.equal(getLocalRecoveryBanner({ saveRetry: 1 }), null);
  assert.equal(getLocalRecoveryBanner({ saveRetry: 'true' }), null);
  assert.equal(getLocalRecoveryBanner({ saveRetry: {}, retryCount: 0 }), null);
  assert.equal(getLocalRecoveryBanner({ retryCount: 1 })?.title, 'Local recovery needed');
});

test('escapes user-entered report text before HTML rendering', () => {
  assert.equal(escapeHtml('<script>alert("x")</script>'), '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
  assert.equal(escapeHtml("A & B"), 'A &amp; B');
  assert.equal(escapeHtml(null), 'null');
});

test('guards delayed AI results against replaced inspection generations', () => {
  assert.equal(isCurrentActionGeneration({ generation: 5, currentGeneration: 5 }), true);
  assert.equal(isCurrentActionGeneration({ generation: 5, currentGeneration: 6 }), false);
  assert.equal(isCurrentActionGeneration({ generation: '5', currentGeneration: 5 }), true);
});

test('guards late photo results against replaced inspection generations', () => {
  assert.equal(isCurrentActionGeneration({ generation: 3, currentGeneration: 3 }), true);
  assert.equal(isCurrentActionGeneration({ generation: 2, currentGeneration: 3 }), false);
  assert.equal(isCurrentActionGeneration({ generation: '3', currentGeneration: 3 }), true);
  assert.equal(isCurrentActionGeneration({ generation: Infinity, currentGeneration: Infinity }), false);
  assert.equal(isCurrentActionGeneration({ generation: 0, currentGeneration: -1 }), false);
});

test('advances persistence generations safely across destructive transitions', () => {
  assert.equal(getNextPersistenceGeneration(0), 1);
  assert.equal(getNextPersistenceGeneration('4'), 5);
  assert.equal(getNextPersistenceGeneration(-1), 0);
  assert.equal(getNextPersistenceGeneration(Infinity), 0);
  assert.equal(getNextPersistenceGeneration(Number.MAX_SAFE_INTEGER), 0);
});

test('lists every transient timer that must be canceled on unmount', () => {
  assert.deepEqual(getTransientTimerCleanupKeys(), ['ai', 'reportAction', 'persist', 'undo', 'findingUndo', 'noteUndo']);
  assert.equal(getTransientTimerCleanupKeys().length, 6);
});

test('accepts only the current autosave generation', () => {
  assert.equal(isCurrentPersistenceGeneration({ generation: 2, currentGeneration: 2 }), true);
  assert.equal(isCurrentPersistenceGeneration({ generation: 1, currentGeneration: 2 }), false);
  assert.equal(isCurrentPersistenceGeneration({ generation: '2', currentGeneration: 2 }), true);
  assert.equal(isCurrentPersistenceGeneration({ generation: -1, currentGeneration: -1 }), false);
  assert.equal(isCurrentPersistenceGeneration(null), false);
});

test('keeps market-comparison changes inside the autosave contract', async () => {
  const { normalizeMarketComparison } = await import('../src/services/marketUtils.js');
  const market = normalizeMarketComparison({ askingPrice: '22000', comparableLow: '20000', comparableHigh: '24000' });
  assert.equal(market.askingPrice, 22000);
  assert.equal(shouldScheduleLocalPersistence({ restored: true }), true);
});

test('gates active autosave scheduling until restore completes', () => {
  assert.equal(shouldScheduleLocalPersistence({ restored: false }), false);
  assert.equal(shouldScheduleLocalPersistence({ restored: true }), true);
  assert.equal(shouldScheduleLocalPersistence(null), false);
  assert.equal(shouldScheduleLocalPersistence({ restored: 1 }), false);
});

test('gates settings persistence until asynchronous restore completes', () => {
  assert.equal(isSettingsPersistenceReady({ settingsReady: false }), false);
  assert.equal(isSettingsPersistenceReady({ settingsReady: true }), true);
  assert.equal(isSettingsPersistenceReady(null), false);
  assert.equal(isSettingsPersistenceReady({ settingsReady: 1 }), false);
});

test('normalizes AI severity values before decision helpers count issues', () => {
  assert.equal(getAiRecommendation({ issues: [{ name: 'Brake risk', severity: ' CRITICAL ' }], repairTotal: 0, confidence: 80, evidenceScore: 80 }).tier, 'PAUSE');
  assert.equal(getAiRecommendation({ issues: [{ name: 'Unknown risk', severity: { unsafe: true } }], repairTotal: 0, confidence: 80, evidenceScore: 80 }).tier, 'PROCEED');
  assert.equal(getAiPriorityPlan({ issues: [{ name: 'Transmission concern', severity: ' MAJOR ', cost: 420 }], evidenceScore: 70 })[0].nextAction, 'Request service records and obtain a repair estimate.');
  assert.equal(patchIssueByName([{ name: 'Brake risk', severity: 'minor', cost: 10 }], 'Brake risk', { severity: ' CRITICAL ' })[0].severity, 'critical');
});
