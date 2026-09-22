import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Share } from 'react-native';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { Badge, ChipRow, PrimaryButton, Screen, ScreenHeader, SectionHeader, SecondaryButton, SurfaceCard } from '../components/Primitives';
import { MetricPill, PressableTile } from '../components/Advanced';

const formats = [
  { id: 'buyer', label: 'Buyer brief', icon: 'person-outline', description: 'One-page summary with price, risk, and top findings.' },
  { id: 'report', label: 'Full report', icon: 'document-text-outline', description: 'Detailed evidence report for review and export.' },
  { id: 'certificate', label: 'Certificate', icon: 'shield-checkmark-outline', description: 'Verification-focused summary with audit details.' },
];

export default function ShareCenterScreen({ data, actions }) {
  const [type, setType] = useState('buyer');
  const [includeEvidence, setIncludeEvidence] = useState(true);
  const [includePrices, setIncludePrices] = useState(true);
  const active = useMemo(() => formats.find((item) => item.id === type), [type]);
  const share = async () => { try { await Share.share({ message: `CarWise · ${data.vehicle.name}\nRisk ${data.risk.score}/100\nMarket $21,100\nAsking $21,900\nRepairs $1,700\n${includeEvidence ? 'Evidence attached.' : 'Evidence omitted.'}` }); } catch (error) { Alert.alert('Share unavailable', error.message || 'Try again.'); } };
  return <Screen scroll contentStyle={styles.content}>
    <ScreenHeader title="Share Center" subtitle="Choose the smallest useful package for the recipient." onBack={actions?.onBack} right={<Badge tone="cyan" label="SHARE" />} />
    <SurfaceCard tone="blue"><Text style={TYPOGRAPHY.eyebrow}>READY TO SHARE</Text><Text style={styles.title}>{data.vehicle.name}</Text><Text style={styles.meta}>{data.vehicle.mileage} miles · inspection complete · {data.risk.score}/100 risk</Text><View style={styles.metrics}><MetricPill label="MARKET" value="$21.1k" tone="mint" /><MetricPill label="REPAIRS" value="$1.7k" tone="amber" /><MetricPill label="FINDINGS" value="7" tone="coral" /></View></SurfaceCard>
    <SectionHeader title="Share format" subtitle="Match the audience" style={{ marginTop: 20 }} />
    <ChipRow items={formats.map((item) => ({ value: item.id, label: item.label }))} selected={type} onSelect={setType} />
    <SurfaceCard style={{ marginTop: 10 }}><View style={styles.formatHeader}><View style={styles.formatIcon}><Ionicons name={active.icon} size={21} color={COLORS.cyan} /></View><View style={COMMON.fill}><Text style={styles.formatTitle}>{active.label}</Text><Text style={styles.formatBody}>{active.description}</Text></View></View><View style={styles.preview}><View style={styles.previewTop}><View style={styles.previewDot} /><View style={[styles.previewLine, { width: '52%' }]} /><View style={[styles.previewLine, { width: '21%' }]} /></View><View style={styles.previewBody}><View style={styles.previewScore}><Text style={styles.previewScoreText}>{data.risk.score}</Text><Text style={styles.previewScoreLabel}>RISK</Text></View><View style={COMMON.fill}><Text style={styles.previewTitle}>CarWise inspection summary</Text><Text style={styles.previewText}>Evidence-linked findings, market context, repair impact, and next actions.</Text></View></View></View></SurfaceCard>
    <SectionHeader title="Privacy controls" subtitle="Before sharing" style={{ marginTop: 20 }} />
    <SurfaceCard><ToggleRow title="Include evidence thumbnails" subtitle="Show the supporting photos in the recipient package." value={includeEvidence} onChange={setIncludeEvidence} /><ToggleRow title="Include price context" subtitle="Show market estimate, asking price, and repair impact." value={includePrices} onChange={setIncludePrices} /></SurfaceCard>
    <SectionHeader title="Delivery" subtitle="Fast actions" style={{ marginTop: 20 }} /><View style={styles.delivery}><PressableTile title="System share" subtitle="Messages, Mail, AirDrop" icon="share-outline" tone="cyan" onPress={share} /><PressableTile title="Save PDF" subtitle="Print / export" icon="download-outline" tone="mint" onPress={() => actions?.onExportReport?.()} /><PressableTile title="Copy summary" subtitle="Clipboard text" icon="copy-outline" tone="amber" onPress={() => Alert.alert('Copy', 'Connect to clipboard support in the host app.')} /><PressableTile title="Open report" subtitle="Interactive review" icon="document-text-outline" tone="blue" onPress={() => actions?.onNavigate?.('report')} /></View>
    <PrimaryButton label={`Share ${active.label}`} icon="share" onPress={share} style={{ marginTop: 13 }} /><SecondaryButton label="Back to report" icon="arrow-back" onPress={actions?.onBack} style={{ marginTop: 8, marginBottom: 30 }} />
  </Screen>;
}
function ToggleRow({ title, subtitle, value, onChange }) { return <View style={styles.toggleRow}><View style={COMMON.fill}><Text style={styles.toggleTitle}>{title}</Text><Text style={styles.toggleBody}>{subtitle}</Text></View><Pressable onPress={() => onChange(!value)} style={[styles.toggle, value && styles.toggleOn]} accessibilityRole="switch" accessibilityState={{ checked: value }}><View style={[styles.toggleKnob, value && styles.toggleKnobOn]} /></Pressable></View>; }

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  title: { color: COLORS.text, fontSize: 20, fontWeight: '900', marginTop: 3 },
  meta: { color: COLORS.textSecondary, fontSize: 9, marginTop: 4 },
  metrics: { flexDirection: 'row', marginTop: 13 },
  formatHeader: { flexDirection: 'row', alignItems: 'center' },
  formatIcon: { width: 45, height: 45, borderRadius: 15, backgroundColor: alpha(COLORS.cyan, 0.08), alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  formatTitle: { color: COLORS.text, fontSize: 13, fontWeight: '850' },
  formatBody: { color: COLORS.textSecondary, fontSize: 9, lineHeight: 14, marginTop: 3 },
  preview: { marginTop: 15, borderRadius: 15, backgroundColor: '#F4F7FA', padding: 12, minHeight: 108 },
  previewTop: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  previewDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.cyan },
  previewLine: { height: 5, borderRadius: 99, backgroundColor: '#D8E0E8' },
  previewBody: { flexDirection: 'row', marginTop: 16, gap: 10 },
  previewScore: { width: 54, height: 54, borderRadius: 27, borderWidth: 5, borderColor: COLORS.amber, alignItems: 'center', justifyContent: 'center' },
  previewScoreText: { color: '#1A2838', fontSize: 16, fontWeight: '900' },
  previewScoreLabel: { color: '#6E7D8C', fontSize: 6, fontWeight: '900' },
  previewTitle: { color: '#182739', fontSize: 11, fontWeight: '900' },
  previewText: { color: '#697789', fontSize: 8, lineHeight: 12, marginTop: 3 },
  toggleRow: { minHeight: 61, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  toggleTitle: { color: COLORS.text, fontSize: 11, fontWeight: '800' },
  toggleBody: { color: COLORS.textTertiary, fontSize: 8, lineHeight: 12, marginTop: 2, maxWidth: 280 },
  toggle: { width: 46, height: 27, borderRadius: 14, padding: 3, backgroundColor: COLORS.surfaceSoft, borderWidth: 1, borderColor: COLORS.border },
  toggleOn: { backgroundColor: alpha(COLORS.cyan, 0.28), borderColor: alpha(COLORS.cyan, 0.38) },
  toggleKnob: { width: 19, height: 19, borderRadius: 10, backgroundColor: COLORS.textSecondary },
  toggleKnobOn: { alignSelf: 'flex-end', backgroundColor: COLORS.cyan },
  delivery: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
