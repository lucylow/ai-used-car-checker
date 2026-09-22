import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { Accordion, EvidenceTimeline, MetricPill, PressableTile } from '../components/Advanced';
import { Badge, PrimaryButton, Screen, ScreenHeader, SectionHeader, SecondaryButton, SurfaceCard, WarningBanner } from '../components/Primitives';
import { ScoreRing, HorizontalBars, PriceRangeBar, Waterfall } from '../components/Charts';
import { EvidenceGallery } from '../components/Media';

const SECTIONS = [
  { id: 'cover', label: 'Cover', icon: 'image-outline' },
  { id: 'summary', label: 'Summary', icon: 'pulse-outline' },
  { id: 'market', label: 'Market', icon: 'trending-up-outline' },
  { id: 'evidence', label: 'Evidence', icon: 'images-outline' },
  { id: 'repairs', label: 'Repairs', icon: 'construct-outline' },
  { id: 'negotiate', label: 'Offer', icon: 'chatbubbles-outline' },
];

export default function ReportComposerScreen({ data, actions }) {
  const [active, setActive] = useState('cover');
  const [includeAI, setIncludeAI] = useState(true);
  const [includeEvidence, setIncludeEvidence] = useState(true);
  const [includeSeller, setIncludeSeller] = useState(false);
  const selected = useMemo(() => SECTIONS.find((item) => item.id === active), [active]);
  return <Screen scroll contentStyle={styles.content}>
    <ScreenHeader title="Report Composer" subtitle="Assemble the buyer-ready story without hiding the evidence." onBack={actions?.onBack} right={<Badge tone="cyan" label="EDIT" />} />
    <SurfaceCard tone="blue"><View style={COMMON.row}><View style={styles.reportIcon}><Ionicons name="document-text" size={24} color={COLORS.cyan} /></View><View style={COMMON.fill}><Text style={TYPOGRAPHY.eyebrow}>REPORT DRAFT</Text><Text style={styles.title}>{data.vehicle.name}</Text><Text style={styles.meta}>Buyer-facing inspection report · editable sections</Text></View><Badge tone="amber" label="DRAFT" /></View><View style={styles.metrics}><MetricPill label="RISK" value={`${data.risk.score}`} tone="amber" /><MetricPill label="MARKET" value="$21.1k" tone="mint" /><MetricPill label="REPAIRS" value="$1.7k" tone="amber" /><MetricPill label="EVIDENCE" value="11" tone="cyan" /></View></SurfaceCard>
    <SectionHeader title="Report sections" subtitle={`${selected.label} selected`} style={{ marginTop: 19 }} />
    <View style={styles.sectionStrip}>{SECTIONS.map((item) => <Pressable key={item.id} onPress={() => setActive(item.id)} style={[styles.sectionTab, active === item.id && styles.sectionTabActive]} accessibilityRole="tab" accessibilityState={{ selected: active === item.id }}><Ionicons name={item.icon} size={16} color={active === item.id ? COLORS.bg : COLORS.textSecondary} /><Text style={[styles.sectionTabText, active === item.id && { color: COLORS.bg }]}>{item.label}</Text></Pressable>)}</View>
    {active === 'cover' ? <Cover data={data} /> : null}
    {active === 'summary' ? <Summary data={data} /> : null}
    {active === 'market' ? <Market /> : null}
    {active === 'evidence' ? <Evidence data={data} actions={actions} /> : null}
    {active === 'repairs' ? <Repairs data={data} /> : null}
    {active === 'negotiate' ? <Offer data={data} /> : null}
    <SectionHeader title="Publishing controls" subtitle="Keep the report honest" style={{ marginTop: 20 }} />
    <SurfaceCard><ToggleRow title="Include AI findings" subtitle="Show AI-assisted annotations with confidence labels." value={includeAI} onChange={setIncludeAI} /><ToggleRow title="Include visual evidence" subtitle="Include supporting thumbnails and linked evidence." value={includeEvidence} onChange={setIncludeEvidence} /><ToggleRow title="Include seller-entered notes" subtitle="Include user-supplied context and comments." value={includeSeller} onChange={setIncludeSeller} /></SurfaceCard>
    <WarningBanner title="Report language" body="Use neutral, evidence-backed language. Separate observed facts, AI estimates, and buyer-entered notes." tone="cyan" style={{ marginTop: 11 }} />
    <View style={styles.actions}><PrimaryButton label="Export buyer report" icon="download-outline" onPress={() => actions?.onExportReport?.()} /><SecondaryButton label="Preview certificate" icon="shield-checkmark-outline" onPress={() => actions?.onNavigate?.('certificate')} style={{ marginTop: 8 }} /><SecondaryButton label="Open share center" icon="share-outline" onPress={() => actions?.onNavigate?.('share')} style={{ marginTop: 8, marginBottom: 30 }} /></View>
  </Screen>;
}

function Cover({ data }) { return <SurfaceCard><View style={styles.coverArt}><Ionicons name="car-sport" size={58} color={COLORS.text} /><View style={styles.coverBadge}><Badge tone="mint" label="INSPECTED" /></View></View><Text style={styles.coverKicker}>CARWISE INSPECTION REPORT</Text><Text style={styles.coverTitle}>{data.vehicle.name}</Text><Text style={styles.coverMeta}>{data.vehicle.year} · {data.vehicle.mileage} miles · VIN {data.vehicle.vin || '—'}</Text><View style={styles.coverScore}><ScoreRing score={data.risk.score} size={94} /><View style={COMMON.fill}><Text style={styles.coverScoreTitle}>{data.risk.label}</Text><Text style={styles.coverScoreBody}>Visual and user-entered inspection evidence summarized across the vehicle journey.</Text></View></View></SurfaceCard>; }
function Summary({ data }) { return <><SurfaceCard tone="blue"><View style={COMMON.row}><ScoreRing score={data.risk.score} size={92} /><View style={COMMON.fill}><Text style={TYPOGRAPHY.eyebrow}>EXECUTIVE SUMMARY</Text><Text style={styles.summaryTitle}>{data.findings.length} visible findings</Text><Text style={styles.summaryBody}>3 major · 4 minor · evidence linked to inspection items.</Text></View></View></SurfaceCard><SurfaceCard style={{ marginTop: 10 }}><HorizontalBars rows={[{ label: 'Exterior', value: 82 }, { label: 'Interior', value: 91 }, { label: 'Mechanical', value: 67 }, { label: 'Documentation', value: 88 }]} /></SurfaceCard></>; }
function Market() { return <><SurfaceCard tone="blue"><Text style={TYPOGRAPHY.eyebrow}>MARKET CONTEXT</Text><Text style={styles.marketValue}>$21,100</Text><PriceRangeBar low={19800} fair={21100} current={21900} high={23900} style={{ marginTop: 8 }} /><Text style={styles.summaryBody}>Asking price is shown separately from the estimated market context.</Text></SurfaceCard><SurfaceCard style={{ marginTop: 10 }}><Waterfall rows={[{ label: 'Market', value: 21100 }, { label: 'Repairs', value: -1700 }, { label: 'Target', value: 19400 }]} /></SurfaceCard></>; }
function Evidence({ data, actions }) { return <><EvidenceGallery items={data.photos} onOpen={(photo) => actions?.onOpenPhoto?.(photo)} /><Accordion title="Evidence traceability" icon="link-outline" defaultOpen><Text style={styles.summaryBody}>Every major finding should expose at least one linked evidence item in the published report.</Text><EvidenceTimeline events={[{ id: 'p1', time: '10:47', type: 'PHOTO', title: 'Front bumper evidence', description: 'Scratch annotation linked.', color: COLORS.coral }, { id: 'p2', time: '10:48', type: 'AI', title: 'Finding created', description: '92% confidence; user confirmation required.', color: COLORS.cyan }]} /></Accordion></>; }
function Repairs({ data }) { return <><SurfaceCard>{data.findings.map((finding) => <View key={finding.id} style={styles.repairRow}><View style={styles.repairIcon}><Ionicons name="construct-outline" size={16} color={finding.tone === 'coral' ? COLORS.coral : COLORS.amber} /></View><View style={COMMON.fill}><Text style={styles.repairTitle}>{finding.title}</Text><Text style={styles.repairBody}>{finding.description}</Text></View><Text style={styles.repairCost}>{finding.cost}</Text></View>)}</SurfaceCard><SurfaceCard tone="amber" style={{ marginTop: 10 }}><View style={COMMON.row}><Ionicons name="calculator-outline" size={21} color={COLORS.amber} /><View style={COMMON.fill}><Text style={styles.summaryTitle}>Estimated repair impact</Text><Text style={styles.summaryBody}>Use ranges and source context rather than implying a guaranteed invoice.</Text></View></View></SurfaceCard></>; }
function Offer({ data }) { return <><View style={styles.offerGrid}><MetricPill label="OPENING" value="$18.9k" tone="cyan" /><MetricPill label="TARGET" value="$19.4k" tone="mint" /><MetricPill label="MAX" value="$20.0k" tone="amber" /></View><SurfaceCard tone="blue" style={{ marginTop: 10 }}><Text style={styles.summaryTitle}>Evidence to bring to the seller</Text>{data.findings.slice(0, 3).map((finding) => <View key={finding.id} style={styles.talking}><Ionicons name="checkmark-circle-outline" size={16} color={COLORS.mint} /><Text style={styles.talkingText}>{finding.title} · {finding.cost}</Text></View>)}</SurfaceCard></>; }
function ToggleRow({ title, subtitle, value, onChange }) { return <Pressable onPress={() => onChange(!value)} style={styles.toggle} accessibilityRole="switch" accessibilityState={{ checked: value }}><View style={COMMON.fill}><Text style={styles.toggleTitle}>{title}</Text><Text style={styles.toggleBody}>{subtitle}</Text></View><View style={[styles.switch, value && styles.switchOn]}><View style={[styles.switchKnob, value && styles.switchKnobOn]} /></View></Pressable>; }

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  reportIcon: { width: 52, height: 52, borderRadius: 17, backgroundColor: alpha(COLORS.cyan, 0.1), alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  title: { color: COLORS.text, fontSize: 17, fontWeight: '900' },
  meta: { color: COLORS.textSecondary, fontSize: 9, marginTop: 3 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14 },
  sectionStrip: { flexDirection: 'row', gap: 7, overflow: 'hidden' },
  sectionTab: { minWidth: 72, height: 52, borderRadius: 15, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 7 },
  sectionTabActive: { backgroundColor: COLORS.cyan, borderColor: COLORS.cyan },
  sectionTabText: { color: COLORS.textSecondary, fontSize: 8, fontWeight: '800', marginTop: 4 },
  coverArt: { height: 205, borderRadius: 19, backgroundColor: '#091625', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  coverBadge: { position: 'absolute', left: 11, top: 11 },
  coverKicker: { color: COLORS.textTertiary, fontSize: 8, fontWeight: '850', letterSpacing: 1.1, marginTop: 14 },
  coverTitle: { color: COLORS.text, fontSize: 24, fontWeight: '900', marginTop: 3 },
  coverMeta: { color: COLORS.textSecondary, fontSize: 9, marginTop: 3 },
  coverScore: { flexDirection: 'row', alignItems: 'center', marginTop: 17, gap: 12 },
  coverScoreTitle: { color: COLORS.text, fontSize: 15, fontWeight: '900' },
  coverScoreBody: { color: COLORS.textSecondary, fontSize: 9, lineHeight: 14, marginTop: 3, maxWidth: 190 },
  summaryTitle: { color: COLORS.text, fontSize: 13, fontWeight: '900' },
  summaryBody: { color: COLORS.textSecondary, fontSize: 9, lineHeight: 14, marginTop: 3 },
  marketValue: { color: COLORS.text, fontSize: 34, fontWeight: '900', marginTop: 4 },
  repairRow: { minHeight: 66, borderBottomWidth: 1, borderBottomColor: COLORS.border, flexDirection: 'row', alignItems: 'center', gap: 9 },
  repairIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: COLORS.surfaceSoft, alignItems: 'center', justifyContent: 'center' },
  repairTitle: { color: COLORS.text, fontSize: 10, fontWeight: '850' },
  repairBody: { color: COLORS.textTertiary, fontSize: 8, lineHeight: 12, marginTop: 2 },
  repairCost: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '850', marginLeft: 5 },
  offerGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  talking: { flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 38, borderTopWidth: 1, borderTopColor: COLORS.border },
  talkingText: { color: COLORS.textSecondary, fontSize: 9, flex: 1 },
  toggle: { minHeight: 65, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 10 },
  toggleTitle: { color: COLORS.text, fontSize: 10, fontWeight: '850' },
  toggleBody: { color: COLORS.textTertiary, fontSize: 8, lineHeight: 12, marginTop: 2 },
  switch: { width: 45, height: 27, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surfaceSoft, padding: 3 },
  switchOn: { borderColor: alpha(COLORS.cyan, 0.35), backgroundColor: alpha(COLORS.cyan, 0.3) },
  switchKnob: { width: 19, height: 19, borderRadius: 10, backgroundColor: COLORS.textTertiary },
  switchKnobOn: { backgroundColor: COLORS.cyan, alignSelf: 'flex-end' },
  actions: { marginTop: 14 },
});
