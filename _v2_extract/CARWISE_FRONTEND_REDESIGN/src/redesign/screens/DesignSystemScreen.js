import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, SPACE, RADIUS, TYPOGRAPHY, alpha } from '../theme';
import { Accordion, MetricPill, PressableTile, SegmentedProgress, PulseLabel, TagCloud } from '../components/Advanced';
import { Badge, ChipRow, Divider, IconButton, InputField, PrimaryButton, SecondaryButton, Screen, ScreenHeader, SectionHeader, SegmentedControl, SurfaceCard, WarningBanner } from '../components/Primitives';
import { ScoreRing, ConfidenceMeter, HorizontalBars, MiniLineChart, PriceRangeBar, SparkBars, Waterfall } from '../components/Charts';

const colorRows = [['bg', COLORS.bg], ['surface', COLORS.surface], ['surface elevated', COLORS.surfaceElevated], ['blue', COLORS.blue], ['cyan', COLORS.cyan], ['mint', COLORS.mint], ['amber', COLORS.amber], ['coral', COLORS.coral], ['text', COLORS.text], ['secondary', COLORS.textSecondary]];
const typeRows = [['Display', TYPOGRAPHY.display], ['H1', TYPOGRAPHY.h1], ['H2', TYPOGRAPHY.h2], ['H3', TYPOGRAPHY.h3], ['Body', TYPOGRAPHY.body], ['Meta', TYPOGRAPHY.meta], ['Eyebrow', TYPOGRAPHY.eyebrow]];

export default function DesignSystemScreen({ actions }) {
  const [selected, setSelected] = useState('Normal');
  const controls = useMemo(() => [{ value: 'Normal', label: 'Normal' }, { value: 'Compact', label: 'Compact' }, { value: 'Large', label: 'Large' }], []);
  return <Screen scroll contentStyle={styles.content}>
    <ScreenHeader title="CarWise Design System" subtitle="Tokens, components, charts, and interaction rules for frontend integration." onBack={actions?.onBack} right={<Badge tone="cyan" label="V2" />} />
    <SurfaceCard tone="blue"><PulseLabel text="SYSTEM READY" /><Text style={styles.title}>A consistent visual language prevents screen-by-screen drift.</Text><Text style={styles.body}>Use these primitives as the default building blocks for every new CarWise screen.</Text><View style={styles.tokenRow}><MetricPill label="GRID" value="8pt" /><MetricPill label="RADIUS" value="18" /><MetricPill label="TOUCH" value="44pt" /></View></SurfaceCard>

    <SectionHeader title="Color tokens" subtitle="semantic roles" style={{ marginTop: 20 }} />
    <SurfaceCard>{colorRows.map(([name, color]) => <View key={name} style={styles.colorRow}><View style={[styles.swatch, { backgroundColor: color, borderColor: alpha(COLORS.text, 0.08) }]} /><Text style={styles.colorName}>{name}</Text><Text style={styles.colorHex}>{color}</Text></View>)}</SurfaceCard>

    <SectionHeader title="Typography" subtitle="Hierarchy" style={{ marginTop: 20 }} />
    <SurfaceCard>{typeRows.map(([name, style]) => <View key={name} style={styles.typeRow}><Text style={[style, { flex: 1 }]}>{name === 'Display' ? 'CarWise' : name === 'H1' ? 'Vehicle overview' : name === 'H2' ? 'AI finding' : name === 'H3' ? 'Market insight' : name === 'Body' ? 'Visual evidence should explain the recommendation.' : name === 'Meta' ? 'LAST UPDATED · 2 MIN AGO' : 'AI ANALYSIS'}</Text><Text style={styles.typeName}>{name}</Text></View>)}</SurfaceCard>

    <SectionHeader title="Controls" subtitle="States" style={{ marginTop: 20 }} />
    <SegmentedControl options={controls} value={selected} onChange={setSelected} />
    <View style={styles.controls}><PrimaryButton label="Primary action" icon="arrow-forward" onPress={() => {}} /><SecondaryButton label="Secondary action" icon="chevron-forward" onPress={() => {}} /><InputField label="VIN" placeholder="1HGCV1F34LA000000" mono /><ChipRow items={[{ value: 'all', label: 'All' }, { value: 'issue', label: 'Issues' }, { value: 'pass', label: 'Pass' }]} selected="issue" onSelect={() => {}} /></View>

    <SectionHeader title="Charts" subtitle="Use sparingly" style={{ marginTop: 20 }} />
    <SurfaceCard><View style={styles.chartRow}><ScoreRing score={74} size={90} /><View style={COMMON.fill}><MiniLineChart points={[20, 26, 24, 31, 29, 36, 34]} tone="cyan" /><SparkBars values={[48, 61, 55, 76, 83, 71]} tone="mint" style={{ marginTop: 15 }} /></View></View><PriceRangeBar low={19400} fair={21100} current={21900} high={23900} style={{ marginTop: 18 }} /><HorizontalBars rows={[{ label: 'Exterior', value: 82 }, { label: 'Interior', value: 91 }, { label: 'Mechanical', value: 67 }, { label: 'Documents', value: 88 }]} style={{ marginTop: 17 }} /><Waterfall rows={[{ label: 'Market', value: 21100 }, { label: 'Repairs', value: -1700 }, { label: 'Target', value: 19400 }]} style={{ marginTop: 17 }} /></SurfaceCard>

    <SectionHeader title="Reusable tiles" subtitle="Consistency" style={{ marginTop: 20 }} />
    <View style={styles.tileGrid}><PressableTile title="VIN scan" subtitle="Fast identity" icon="barcode-outline" tone="cyan" /><PressableTile title="Evidence" subtitle="8 photos" icon="images-outline" tone="mint" /><PressableTile title="Needs review" subtitle="3 findings" icon="warning-outline" tone="amber" /><PressableTile title="Critical" subtitle="1 item" icon="alert-circle-outline" tone="coral" /></View>

    <SectionHeader title="Status communication" subtitle="Never color alone" style={{ marginTop: 20 }} />
    <View style={styles.badges}><Badge tone="mint" label="PASS · Verified" /><Badge tone="amber" label="WATCH · Review" /><Badge tone="coral" label="ISSUE · Critical" /><Badge tone="cyan" label="AI · Estimate" /></View>
    <WarningBanner title="AI output must stay contextual" body="Use confidence, evidence, and uncertainty labels. Do not present visual AI analysis as a definitive mechanical diagnosis." tone="cyan" />

    <SectionHeader title="Accord journey" subtitle="8 stage reference" style={{ marginTop: 20 }} />
    <SegmentedProgress steps={['New','VIN','Media','AI','Price','Negotiate','Contract','Certificate'].map((label) => ({ id: label.toLowerCase(), label }))} active={4} onPress={() => {}} />
    <Accordion title="Component implementation rule" icon="code-slash-outline" defaultOpen><Text style={styles.body}>Build once, reuse everywhere. Prefer semantic props like tone, severity, state, and density over page-specific style overrides.</Text><Divider style={{ marginVertical: 10 }} /><Text style={styles.body}>When a component needs new behavior, extend the shared primitive before cloning it into a screen.</Text></Accordion>

    <View style={styles.footer}><Text style={TYPOGRAPHY.meta}>CARWISE FRONTEND REDESIGN</Text><Text style={styles.footerBody}>This screen is intentionally dense: it is a reference for Cursor while integrating the visual system into the production app.</Text></View>
  </Screen>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  title: { color: COLORS.text, fontSize: 22, lineHeight: 27, fontWeight: '900', marginTop: 13 },
  body: { color: COLORS.textSecondary, fontSize: 10, lineHeight: 15, marginTop: 5 },
  tokenRow: { flexDirection: 'row', marginTop: 15 },
  colorRow: { minHeight: 43, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  swatch: { width: 32, height: 32, borderRadius: 10, borderWidth: 1, marginRight: 10 },
  colorName: { flex: 1, color: COLORS.text, fontSize: 10, fontWeight: '750', textTransform: 'capitalize' },
  colorHex: { color: COLORS.textTertiary, fontSize: 9, fontFamily: 'monospace' },
  typeRow: { minHeight: 62, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 10 },
  typeName: { width: 52, color: COLORS.textTertiary, fontSize: 8, fontWeight: '800', textAlign: 'right' },
  controls: { gap: 8, marginTop: 10 },
  chartRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 10 },
  footer: { paddingVertical: 30, alignItems: 'center' },
  footerBody: { color: COLORS.textTertiary, fontSize: 9, lineHeight: 14, textAlign: 'center', maxWidth: 290, marginTop: 6 },
});
