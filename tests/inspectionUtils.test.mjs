import test from 'node:test';
import assert from 'node:assert/strict';
import { getRepairTotal, getRiskScore, isValidVin, normalizeVin } from '../src/services/inspectionUtils.js';
import { buildInspectionReport } from '../src/services/reportUtils.js';

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
