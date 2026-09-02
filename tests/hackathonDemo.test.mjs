import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../DevNetworkHackathonApp.js', import.meta.url), 'utf8');

test('hackathon demo includes every requested sponsor mock', () => {
  for (const sponsor of ['SerpApi', 'Perfect Corp', 'Xano', 'Nutrient DWS', 'Doctavian', 'Foxit', 'name.com']) {
    assert.match(source, new RegExp(sponsor.replace('.', '\\.'), 'i'));
  }
});

test('hackathon demo exposes the complete journey and dashboard progress', () => {
  for (const screen of ['dashboard', 'inspection', 'market', 'paint', 'report', 'certificate', 'contract', 'sign', 'domain', 'certificateFinal']) {
    assert.match(source, new RegExp(`['\\"]${screen}['\\"]`));
  }
  assert.match(source, /completed\.length/);
  assert.match(source, /progressFill/);
  assert.match(source, /Appearance/);
});

test('hackathon demo is self-contained and uses deterministic mock services', () => {
  assert.match(source, /const mockServices =/);
  assert.match(source, /export default function DevNetworkHackathonApp/);
  assert.doesNotMatch(source, /from ['\"]@react-navigation/);
  assert.doesNotMatch(source, /process\.env/);
});

test('hackathon demo exposes realistic traceable sponsor payloads', () => {
  for (const marker of ['requestId', 'jobId', 'reportId', 'contractId', 'envelope', 'registrar', 'confidence', 'comps', 'demoContext', 'runId', 'traceId']) {
    assert.match(source, new RegExp(marker));
  }
  assert.match(source, /127 comparable listings/);
  assert.match(source, /auditTrail/);
  assert.match(source, /checklistVersion/);
});

test('hackathon demo makes prize mapping and sandbox provenance visible', () => {
  assert.match(source, /\$3,000 prize/);
  assert.match(source, /\$2,500 prize/);
  assert.match(source, /environment: 'sandbox'/);
  assert.match(source, /7 CONNECTORS READY/);
  assert.match(source, /Market → Paint → Report → Certificate → Contract → eSign → Domain/);
});
