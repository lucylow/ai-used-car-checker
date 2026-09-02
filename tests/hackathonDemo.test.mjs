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
