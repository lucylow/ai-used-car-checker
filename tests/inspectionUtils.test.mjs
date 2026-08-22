import test from 'node:test';
import assert from 'node:assert/strict';
import { getRepairTotal, getRiskScore, isValidVin, normalizeVin } from '../src/services/inspectionUtils.js';
import { buildInspectionReport, buildPhotoEvidenceHtml, formatPhotoEvidenceLabel, formatRepairPriorityHtml, getChecklistGuidance, getInspectionActionGuidance, getInspectionNavigationLabel, getLocalSaveLabel, getOperationStatusLabel, getProgressSummaryLabel, getRecoveryGuidance } from '../src/services/reportUtils.js';
import { getBackupSummary, parseInspectionBackup, serializeInspectionBackup } from '../src/services/backupUtils.js';
import { filterAndSortInspections, getHistoryActionMessage, getInspectionCompletion, getInspectionRepairTotal, getInspectionRiskLabel, getReportReadiness } from '../src/services/historyUtils.js';

test('serializes and restores a versioned local backup', () => {
  const raw = serializeInspectionBackup({ vehicle: { year: '2020' }, issues: [{ name: 'Brake wear' }], checklist: { Exterior: true }, photos: [{ id: 'p1' }], savedInspections: [{ id: 's1' }] });
  const restored = parseInspectionBackup(raw);
  assert.equal(restored.vehicle.year, '2020');
  assert.equal(restored.issues[0].name, 'Brake wear');
  assert.equal(getBackupSummary(restored), '1 saved inspection · 1 active photo');
  assert.throws(() => parseInspectionBackup('{"app":"other","version":1}'), /Unsupported Carwise backup/);
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
