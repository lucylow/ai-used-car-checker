import test from 'node:test';
import assert from 'node:assert/strict';
import { createNewInspectionState, getDerivedInspectionResetState, getRepairTotal, getRiskScore, isSameIssue, isValidVin, normalizeVin } from '../src/services/inspectionUtils.js';
import { buildInspectionReport, buildPhotoEvidenceHtml, formatPhotoEvidenceLabel, formatRepairPriorityHtml, getCanceledFlowGuidance, getChecklistGuidance, getDurablePhotoFileName, getFunctionalActionLabel, getInspectionActionGuidance, getInspectionNavigationLabel, getLocalSaveDelay, getMainFlowReadiness, getPhotoActionGuidance, getPhotoScreenGuidance, getLocalSaveLabel, getOperationStatusLabel, getProcessingLabel, getProgressSummaryLabel, getRecoveryGuidance } from '../src/services/reportUtils.js';
import { getBackupSummary, parseInspectionBackup, serializeInspectionBackup } from '../src/services/backupUtils.js';
import { clearVinCache, decodeVin } from '../src/services/vinService.js';
import { clearRetry, clearRetryQueue, enqueueRetry, flushRetryQueue, getRetryQueueSize } from '../src/services/retryQueue.js';
import { filterAndSortInspections, getHistoryActionMessage, getInspectionCompletion, getInspectionRepairTotal, getInspectionRiskLabel, getReportReadiness, shouldClearSavedSelection, shouldReplaceSavedInspection } from '../src/services/historyUtils.js';

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

test('builds a share-ready report with key inspection facts', () => {
  const report = buildInspectionReport({ vehicle: { year: '2020', make: 'Honda', model: 'Accord', mileage: '42,000' }, issues: [{ severity: 'major', cost: 600 }], checklist: { Exterior: true }, photos: [{ uri: 'file://photo.jpg' }], fairPrice: 19400, riskScore: 20 });
  assert.match(report, /2020 Honda Accord/);
  assert.match(report, /Estimated repairs: \$600/);
  assert.match(report, /Checklist: 1\/5 sections complete/);
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
