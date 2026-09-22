import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { AI_FEATURE_UNIVERSE_V5 } from '../data/aiFeatureUniverseV5';
import { AI_FAILURE_STATES } from '../demo/aiFailureFixtures';
import { getV5MockBundle, simulateAiRun } from '../services/mockAiScenarioEngineV5';

export default function AIShowcaseV5({ onExit }) {
  const bundle = getV5MockBundle(7);
  const run = simulateAiRun(7);
  const palette = { bg: '#0B1220', surface: '#151F32', text: '#F2F7FB', muted: '#92A1B8', cyan: '#00D4FF', mint: '#35D0BA', amber: '#F4B740', coral: '#F16B6B' };
  const block = (label, value, accent = palette.cyan) => (
    <View style={{ backgroundColor: palette.surface, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#24354D' }}>
      <Text style={{ color: palette.muted, fontSize: 11, letterSpacing: 1.2 }}>{label.toUpperCase()}</Text>
      <Text style={{ color: accent, fontWeight: '800', fontSize: 20, marginTop: 6 }}>{String(value)}</Text>
    </View>
  );
  return (
    <ScrollView style={{ flex: 1, backgroundColor: palette.bg }} contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: palette.text, fontSize: 32, fontWeight: '800' }}>CarWise AI Lab</Text>
        {onExit ? <Pressable accessibilityRole="button" accessibilityLabel="Close AI lab" onPress={onExit} style={{ minWidth: 44, minHeight: 44, borderRadius: 14, borderWidth: 1, borderColor: '#24354D', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: palette.cyan, fontSize: 22 }}>×</Text></Pressable> : null}
      </View>
      <Text style={{ color: palette.muted, marginTop: 8, marginBottom: 24 }}>V5 multimodal mock-data showcase for frontend development.</Text>
      {block('Vehicle', bundle.vehicle, palette.cyan)}
      {block('AI Finding', bundle.finding.defect, palette.coral)}
      {block('Confidence', `${Math.round(bundle.finding.confidence * 100)}%`, palette.mint)}
      {block('Market Position', `${Math.round(bundle.market.position * 100)}%`, palette.amber)}
      {block('Repair', bundle.repair.repairName, palette.coral)}
      {block('Evidence', `${bundle.evidence.length} multimodal items`, palette.cyan)}
      {block('Failure states', `${AI_FAILURE_STATES.length} recoverable QA scenarios`, palette.amber)}
      {block('Failure example', `${AI_FAILURE_STATES[0].title} · ${AI_FAILURE_STATES[0].primaryAction}`, palette.coral)}
      <Text style={{ color: palette.text, fontSize: 19, fontWeight: '700', marginVertical: 12 }}>AI pipeline</Text>
      {run.map((stage) => (
        <View key={stage.key} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: stage.progress === 1 ? palette.mint : palette.cyan, marginRight: 12 }} />
          <Text style={{ color: palette.text, flex: 1 }}>{stage.label}</Text>
          <Text style={{ color: palette.muted }}>{Math.round(stage.progress * 100)}%</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export const AI_SHOWCASE_STATS = Object.fromEntries(Object.entries(AI_FEATURE_UNIVERSE_V5).map(([group, values]) => [group, Object.values(values).reduce((sum, list) => sum + list.length, 0)]));
