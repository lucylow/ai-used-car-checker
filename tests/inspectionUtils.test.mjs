import test from 'node:test';
import assert from 'node:assert/strict';
import { getRepairTotal, getRiskScore, isValidVin, normalizeVin } from '../src/services/inspectionUtils.js';
import { buildInspectionReport, buildPhotoEvidenceHtml, formatPhotoEvidenceLabel, formatRepairPriorityHtml } from '../src/services/reportUtils.js';

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
