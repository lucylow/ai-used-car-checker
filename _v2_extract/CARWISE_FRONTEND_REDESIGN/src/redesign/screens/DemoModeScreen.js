import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { Badge, PrimaryButton, Screen, ScreenHeader, SectionHeader, SurfaceCard } from '../components/Primitives';
import { SegmentedProgress, PressableTile, PulseLabel } from '../components/Advanced';
import { StepRail } from '../components/Navigation';

const flow = [
  { id: 'new', label: 'New inspection', icon: 'add-circle-outline', description: 'Create a visual-first inspection.' },
  { id: 'vin', label: 'VIN + market', icon: 'barcode-outline', description: 'Identify the vehicle and establish market context.' },
  { id: 'media', label: 'Evidence capture', icon: 'camera-outline', description: 'Collect photos, video, voice, and documents.' },
  { id: 'ai', label: 'AI analysis', icon: 'sparkles-outline', description: 'Review findings and supporting evidence.' },
  { id: 'summary', label: 'Health + price', icon: 'analytics-outline', description: 'Translate condition into repair impact and fair price.' },
  { id: 'negotiation', label: 'Negotiation', icon: 'chatbubbles-outline', description: 'Turn findings into seller talking points.' },
  { id: 'contract', label: 'Contract', icon: 'document-text-outline', description: 'Prepare a human-authorized agreement.' },
  { id: 'certificate', label: 'Certificate', icon: 'shield-checkmark-outline', description: 'Finish with a verifiable inspection record.' },
];

export default function DemoModeScreen({ actions }) {
  const [active, setActive] = useState(0);
  const current = flow[active];
  const progress = Math.round(((active + 1) / flow.length) * 100);
  const nav = actions?.onNavigate;
  const open = () => nav?.(current.id === 'new' ? 'new' : current.id);
  const timeline = useMemo(() => flow.map((item, index) => ({ id: item.id, label: item.label, done: index < active, active: index === active })), [active]);
  return <Screen scroll contentStyle={styles.content}>
    <ScreenHeader title="Demo Journey" subtitle="Preview the complete CarWise visual flow with sample data." onBack={actions?.onBack} right={<Badge tone="cyan" label="DEMO" />} />
    <SurfaceCard tone="blue" style={styles.hero}>
      <PulseLabel text="DEMO MODE" />
      <Text style={styles.heroTitle}>One vehicle. One visual journey.</Text>
      <Text style={styles.heroBody}>Use this screen in development to quickly jump through the redesigned experience without needing every service to be live.</Text>
      <View style={styles.progressRow}><Text style={styles.progressNumber}>{progress}%</Text><Text style={styles.progressLabel}>journey preview</Text></View>
      <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>
    </SurfaceCard>

    <SectionHeader title="Flow navigator" subtitle="Tap completed or current steps" style={{ marginTop: 19 }} />
    <SegmentedProgress steps={timeline} active={active} onPress={setActive} />
    <View style={styles.stepRail}><StepRail steps={flow.map((item, index) => ({ label: item.label, icon: item.icon, state: index < active ? 'done' : index === active ? 'active' : 'idle' }))} /></View>

    <SurfaceCard style={styles.currentCard}>
      <View style={COMMON.row}><View style={styles.currentIcon}><Ionicons name={current.icon} size={24} color={COLORS.cyan} /></View><View style={COMMON.fill}><Text style={TYPOGRAPHY.eyebrow}>CURRENT PREVIEW</Text><Text style={styles.currentTitle}>{current.label}</Text><Text style={styles.currentBody}>{current.description}</Text></View></View>
      <PrimaryButton label={`Open ${current.label}`} icon="arrow-forward" onPress={open} style={{ marginTop: 13 }} />
    </SurfaceCard>

    <SectionHeader title="Demo controls" subtitle="Useful for Cursor integration" style={{ marginTop: 20 }} />
    <View style={styles.tiles}>
      {[
        ['load', 'Load sample Accord', 'car-sport-outline', () => actions?.onLoadDemo?.('accord')],
        ['visual', 'Visual system gallery', 'color-palette-outline', () => nav?.('visual-states')],
        ['motion', 'Motion playground', 'pulse-outline', () => nav?.('design-system')],
        ['reset', 'Reset inspection', 'refresh-outline', () => actions?.onResetDemo?.()],
      ].map(([id, title, icon, handler]) => <PressableTile key={id} icon={icon} title={title} subtitle="Developer tool" onPress={handler} />)}
    </View>

    <SurfaceCard tone="cyan" style={{ marginTop: 11 }}>
      <Text style={TYPOGRAPHY.eyebrow}>DESIGN QA CHECK</Text>
      <Text style={styles.qaTitle}>The screen should answer three questions.</Text>
      <View style={styles.qaRow}><Text style={styles.qaNumber}>01</Text><Text style={styles.qaText}>What vehicle am I looking at?</Text></View>
      <View style={styles.qaRow}><Text style={styles.qaNumber}>02</Text><Text style={styles.qaText}>What evidence supports the result?</Text></View>
      <View style={styles.qaRow}><Text style={styles.qaNumber}>03</Text><Text style={styles.qaText}>What should I do next?</Text></View>
    </SurfaceCard>
  </Screen>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  hero: { marginTop: 3, overflow: 'hidden' },
  heroTitle: { color: COLORS.text, fontSize: 26, lineHeight: 31, fontWeight: '900', marginTop: 14, maxWidth: 300 },
  heroBody: { color: COLORS.textSecondary, fontSize: 10, lineHeight: 15, marginTop: 6 },
  progressRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 19 },
  progressNumber: { color: COLORS.cyan, fontSize: 26, fontWeight: '900' },
  progressLabel: { color: COLORS.textTertiary, fontSize: 9, marginLeft: 6 },
  progressTrack: { height: 6, borderRadius: 99, backgroundColor: COLORS.surfaceSoft, overflow: 'hidden', marginTop: 7 },
  progressFill: { height: 6, backgroundColor: COLORS.cyan },
  stepRail: { marginTop: 10 },
  currentCard: { marginTop: 5 },
  currentIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: alpha(COLORS.cyan, 0.09), alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  currentTitle: { color: COLORS.text, fontSize: 15, fontWeight: '900', marginTop: 3 },
  currentBody: { color: COLORS.textSecondary, fontSize: 10, lineHeight: 15, marginTop: 4 },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  qaTitle: { color: COLORS.text, fontSize: 14, fontWeight: '850', marginTop: 6, marginBottom: 10 },
  qaRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, borderTopWidth: 1, borderTopColor: COLORS.border },
  qaNumber: { color: COLORS.cyan, fontSize: 9, fontWeight: '900', width: 30 },
  qaText: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '650' },
});
