import React, { useMemo, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { useReducedMotion } from '../motion';
import { Badge, Divider, PrimaryButton, Screen, ScreenHeader, SectionHeader, SecondaryButton, SurfaceCard } from '../components/Primitives';
import { Accordion, GlassStat, MetricPill, PulseLabel, PressableTile, SegmentedProgress } from '../components/Advanced';
import { ConfidenceMeter, HorizontalBars, MiniLineChart, PriceRangeBar, ScoreRing, SparkBars, Waterfall } from '../components/Charts';
import { EvidenceGallery } from '../components/Media';
import { VehicleHealthMap } from '../components/Vehicle';

const frames = [
  { id: 'home', label: 'Home', headline: 'Know the car before you buy it.', tone: COLORS.cyan },
  { id: 'market', label: 'Market', headline: 'See the price behind the listing.', tone: COLORS.mint },
  { id: 'media', label: 'Evidence', headline: 'Show the evidence, not just the score.', tone: COLORS.amber },
  { id: 'ai', label: 'AI', headline: 'Let AI surface what you might miss.', tone: COLORS.cyan },
  { id: 'report', label: 'Report', headline: 'Turn observations into a buyer-ready report.', tone: COLORS.blue },
  { id: 'negotiation', label: 'Negotiate', headline: 'Turn findings into a fair offer.', tone: COLORS.mint },
  { id: 'contract', label: 'Contract', headline: 'Move from inspection to human authorization.', tone: COLORS.amber },
  { id: 'certificate', label: 'Certificate', headline: 'Finish with a trusted inspection record.', tone: COLORS.mint },
];

export default function PresentationShowcaseScreen({ data, actions }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const opacity = useRef(new Animated.Value(1)).current;
  const frame = frames[index];
  const go = (next) => { const target = Math.max(0, Math.min(frames.length - 1, next)); if (target === index) return; if (reduceMotion) { setIndex(target); return; } Animated.sequence([Animated.timing(opacity, { toValue: 0.2, duration: 100, useNativeDriver: true }), Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true })]).start(); setIndex(target); };
  return <Screen scroll contentStyle={styles.content}>
    <ScreenHeader title="Design Showcase" subtitle="Presentation-ready visual system and product story." onBack={actions?.onBack} right={<Badge tone="cyan" label="SHOWCASE" />} />
    <SurfaceCard tone="blue"><PulseLabel text="CARWISE · FRONTEND V2" /><Text style={styles.heroTitle}>{frame.headline}</Text><Text style={styles.heroBody}>Use this screen as a visual acceptance test while Cursor integrates the redesign into the existing React Native flow.</Text><View style={styles.frameRail}>{frames.map((item, i) => <Pressable key={item.id} onPress={() => go(i)} style={[styles.frameDot, i === index && { backgroundColor: item.tone, width: 28 }]} accessibilityRole="tab" accessibilityState={{ selected: i === index }} />)}</View></SurfaceCard>
    <Animated.View style={{ opacity, marginTop: 13 }}>{frame.id === 'home' ? <HomeFrame data={data} onNavigate={actions?.onNavigate} /> : null}{frame.id === 'market' ? <MarketFrame /> : null}{frame.id === 'media' ? <MediaFrame data={data} /> : null}{frame.id === 'ai' ? <AIFrame data={data} /> : null}{frame.id === 'report' ? <ReportFrame data={data} /> : null}{frame.id === 'negotiation' ? <NegotiationFrame data={data} /> : null}{frame.id === 'contract' ? <ContractFrame data={data} /> : null}{frame.id === 'certificate' ? <CertificateFrame data={data} /> : null}</Animated.View>
    <View style={styles.navRow}><SecondaryButton label="Previous" icon="arrow-back" disabled={index === 0} onPress={() => go(index - 1)} /><SecondaryButton label="Next" icon="arrow-forward" disabled={index === frames.length - 1} onPress={() => go(index + 1)} /></View>
    <SectionHeader title="Figma handoff notes" subtitle="Use these as screenshot criteria" style={{ marginTop: 20 }} />
    <SurfaceCard><Check text="Vehicle imagery is the visual anchor, not decoration." /><Check text="Every AI result exposes evidence and uncertainty." /><Check text="Every screen has one obvious next action." /><Check text="Cards feel automotive, not generic SaaS." /><Check text="Loading, empty, success, and error states are designed." /><Check text="Motion communicates state and respects reduced motion." /></SurfaceCard>
    <PrimaryButton label="Open current product flow" icon="play" onPress={() => actions?.onNavigate?.('home')} style={{ marginTop: 12 }} /><SecondaryButton label="Open design system" icon="color-palette-outline" onPress={() => actions?.onNavigate?.('design-system')} style={{ marginTop: 8, marginBottom: 30 }} />
  </Screen>;
}

function HomeFrame({ data, onNavigate }) { return <SurfaceCard><View style={styles.mockHero}><View style={styles.mockCar}><Ionicons name="car-sport" size={56} color={COLORS.text} /></View><View style={styles.mockOverlay}><Badge tone="mint" label="INSPECTION 72%" /><Text style={styles.mockTitle}>{data.vehicle.name}</Text><Text style={styles.mockSub}>Evidence collected · 8 photos · 2 notes</Text></View></View><View style={styles.mockMetrics}><GlassStat label="Risk" value="68" hint="Moderate" icon="pulse-outline" tone="amber" /><GlassStat label="Market" value="$21.1k" hint="92% confidence" icon="trending-up-outline" tone="mint" /><GlassStat label="Repair" value="$1.7k" hint="estimate" icon="construct-outline" tone="amber" /></View><PrimaryButton label="Continue inspection" icon="arrow-forward" onPress={() => onNavigate?.('checklist')} style={{ marginTop: 12 }} /></SurfaceCard>; }

function MarketFrame() { return <SurfaceCard tone="blue"><Text style={TYPOGRAPHY.eyebrow}>INSTANT PRICE INTELLIGENCE</Text><View style={styles.priceHero}><Text style={styles.priceLarge}>$21,100</Text><Badge tone="mint" label="FAIR VALUE" /></View><PriceRangeBar low={19800} fair={21100} current={21900} high={23900} style={{ marginTop: 10 }} /><MiniLineChart points={[22, 25, 24, 28, 27, 31, 33, 32]} tone="cyan" style={{ marginTop: 17 }} /><Text style={styles.mockSub}>30-day trend · +2.4%</Text><Divider style={{ marginVertical: 13 }} /><Text style={styles.mockSection}>Comparable listings</Text>{['$20,700 · 38,990 mi', '$20,950 · 44,108 mi', '$22,400 · 47,221 mi'].map((row) => <View key={row} style={styles.compareLine}><Ionicons name="car-outline" size={16} color={COLORS.textTertiary} /><Text style={styles.compareText}>{row}</Text><Ionicons name="chevron-forward" size={14} color={COLORS.textTertiary} /></View>)}</SurfaceCard>; }

function MediaFrame({ data }) { return <SurfaceCard><View style={styles.mediaHero}><Ionicons name="camera" size={30} color={COLORS.cyan} /><Text style={styles.mockTitle}>AI-powered condition scan</Text><Text style={styles.mockSub}>Capture the vehicle, then let evidence drive the analysis.</Text></View><EvidenceGallery items={data.photos.slice(0, 4)} /><View style={styles.capturePills}><MetricPill label="PHOTOS" value="8" tone="cyan" /><MetricPill label="VIDEO" value="1" tone="blue" /><MetricPill label="VOICE" value="2" tone="amber" /></View></SurfaceCard>; }

function AIFrame({ data }) { return <SurfaceCard tone="blue"><View style={styles.aiHero}><ScoreRing score={data.risk.score} size={110} /><View style={COMMON.fill}><PulseLabel text="AI ANALYSIS COMPLETE" /><Text style={styles.mockTitle}>7 visible findings</Text><Text style={styles.mockSub}>3 major · 4 minor · evidence linked</Text><ConfidenceMeter confidence={0.92} label="Evidence confidence" caption="Show confidence beside the result." style={{ marginTop: 9 }} /></View></View>{data.findings.slice(0, 2).map((finding) => <View key={finding.id} style={styles.aiFinding}><Ionicons name="warning-outline" size={17} color={finding.tone === 'coral' ? COLORS.coral : COLORS.amber} /><View style={COMMON.fill}><Text style={styles.findingText}>{finding.title}</Text><Text style={styles.mockSub}>{finding.cost} · {Math.round((finding.confidence || 0) * 100)}% confidence</Text></View><Text style={styles.viewText}>Evidence →</Text></View>)}</SurfaceCard>; }

function ReportFrame({ data }) { return <SurfaceCard><Text style={TYPOGRAPHY.eyebrow}>BUYER-READY REPORT</Text><Text style={styles.mockTitle}>{data.vehicle.name}</Text><View style={styles.reportScore}><ScoreRing score={data.risk.score} size={84} /><View style={COMMON.fill}><MetricPill label="MARKET" value="$21.1k" tone="mint" /><MetricPill label="REPAIRS" value="$1.7k" tone="amber" /><MetricPill label="FINDINGS" value="7" tone="coral" /></View></View><HorizontalBars rows={[{ label: 'Exterior', value: 82 }, { label: 'Interior', value: 91 }, { label: 'Mechanical', value: 67 }]} style={{ marginTop: 16 }} /></SurfaceCard>; }

function NegotiationFrame({ data }) { return <SurfaceCard tone="blue"><Text style={TYPOGRAPHY.eyebrow}>NEGOTIATION COACH</Text><Text style={styles.mockTitle}>Turn evidence into a fair offer.</Text><View style={styles.offerRow}><Offer label="OPENING" value="$18,900" tone="cyan" /><Offer label="TARGET" value="$19,400" tone="mint" /><Offer label="MAX" value="$20,000" tone="amber" /></View><Waterfall rows={[{ label: 'Market', value: 21100 }, { label: 'Repairs', value: -1700 }, { label: 'Target', value: 19400 }]} style={{ marginTop: 16 }} /><Accordion title="Suggested talking point" icon="chatbubble-ellipses-outline" defaultOpen><Text style={styles.body}>“The market is around $21,100, and the documented repairs add about $1,700 of impact. I’d be comfortable at $19,400.”</Text></Accordion></SurfaceCard>; }

function Offer({ label, value, tone }) { const color = tone === 'mint' ? COLORS.mint : tone === 'amber' ? COLORS.amber : COLORS.cyan; return <View style={[styles.offer, { borderColor: alpha(color, 0.22) }]}><Text style={styles.offerLabel}>{label}</Text><Text style={[styles.offerValue, { color }]}>{value}</Text></View>; }

function ContractFrame({ data }) { return <SurfaceCard><View style={styles.docHeader}><Ionicons name="document-text" size={22} color={COLORS.cyan} /><View style={COMMON.fill}><Text style={styles.mockTitle}>Vehicle Purchase Agreement</Text><Text style={styles.mockSub}>{data.vehicle.name} · human review required</Text></View><Badge tone="amber" label="REVIEW" /></View><Divider style={{ marginVertical: 13 }} />{['Vehicle identification', 'Purchase terms', 'Known condition', 'Inspection acknowledgement'].map((label, index) => <View key={label} style={styles.clauseRow}><Text style={styles.clauseNumber}>0{index + 1}</Text><Text style={styles.clauseText}>{label}</Text><Ionicons name="checkmark-circle-outline" size={16} color={COLORS.textTertiary} /></View>)}<View style={styles.humanBox}><Ionicons name="person-circle-outline" size={22} color={COLORS.amber} /><View style={COMMON.fill}><Text style={styles.humanTitle}>Only the human can sign.</Text><Text style={styles.mockSub}>AI prepares. The user reviews and authorizes.</Text></View></View></SurfaceCard>; }

function CertificateFrame({ data }) { return <SurfaceCard tone="mint"><View style={styles.certificate}><View style={styles.certificateSeal}><Ionicons name="shield-checkmark" size={35} color={COLORS.mint} /></View><Text style={styles.certificateTitle}>Inspection Verified</Text><Text style={styles.certificateVehicle}>{data.vehicle.name}</Text><Text style={styles.certificateSub}>Evidence-backed inspection record</Text><View style={styles.certGrid}><MetricPill label="RISK" value={`${data.risk.score}`} tone="amber" /><MetricPill label="EVIDENCE" value="11" tone="cyan" /><MetricPill label="STATUS" value="VALID" tone="mint" /></View><View style={styles.hash}><Text style={styles.hashLabel}>CERTIFICATE HASH</Text><Text style={styles.hashValue}>CW-9F3A-7B22-4D81</Text></View></View></SurfaceCard>; }

function Check({ text }) { return <View style={styles.check}><Ionicons name="checkmark-circle" size={16} color={COLORS.mint} /><Text style={styles.checkText}>{text}</Text></View>; }

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  heroTitle: { color: COLORS.text, fontSize: 27, lineHeight: 32, fontWeight: '900', marginTop: 14 },
  heroBody: { color: COLORS.textSecondary, fontSize: 10, lineHeight: 15, marginTop: 6 },
  frameRail: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 17 },
  frameDot: { width: 10, height: 6, borderRadius: 3, backgroundColor: COLORS.surfaceSoft },
  navRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  mockHero: { height: 215, borderRadius: 22, overflow: 'hidden', backgroundColor: '#0B1725', justifyContent: 'flex-end' },
  mockCar: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mockOverlay: { padding: 14, backgroundColor: alpha(COLORS.bg, 0.65) },
  mockTitle: { color: COLORS.text, fontSize: 16, fontWeight: '900', marginTop: 5 },
  mockSub: { color: COLORS.textSecondary, fontSize: 9, lineHeight: 14, marginTop: 2 },
  mockMetrics: { flexDirection: 'row', marginTop: 11 },
  priceHero: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 7 },
  priceLarge: { color: COLORS.text, fontSize: 34, fontWeight: '900' },
  mockSection: { color: COLORS.text, fontSize: 12, fontWeight: '850', marginBottom: 4 },
  compareLine: { minHeight: 43, borderTopWidth: 1, borderTopColor: COLORS.border, flexDirection: 'row', alignItems: 'center', gap: 8 },
  compareText: { color: COLORS.textSecondary, flex: 1, fontSize: 9 },
  mediaHero: { minHeight: 115, borderRadius: 18, backgroundColor: COLORS.surfaceSoft, padding: 16, justifyContent: 'flex-end' },
  capturePills: { flexDirection: 'row', marginTop: 10 },
  aiHero: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  aiFinding: { minHeight: 61, borderTopWidth: 1, borderTopColor: COLORS.border, flexDirection: 'row', alignItems: 'center', gap: 8 },
  findingText: { color: COLORS.text, fontSize: 11, fontWeight: '850' },
  viewText: { color: COLORS.cyan, fontSize: 8, fontWeight: '850' },
  reportScore: { flexDirection: 'row', alignItems: 'center', marginTop: 13, gap: 14 },
  offerRow: { flexDirection: 'row', marginTop: 13, gap: 8 },
  offer: { flex: 1, minHeight: 66, borderWidth: 1, borderRadius: 14, backgroundColor: COLORS.surface, padding: 10 },
  offerLabel: { color: COLORS.textTertiary, fontSize: 7, fontWeight: '850' },
  offerValue: { fontSize: 13, fontWeight: '900', marginTop: 7 },
  body: { color: COLORS.textSecondary, fontSize: 10, lineHeight: 15 },
  docHeader: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  clauseRow: { minHeight: 46, borderTopWidth: 1, borderTopColor: COLORS.border, flexDirection: 'row', alignItems: 'center', gap: 9 },
  clauseNumber: { color: COLORS.textTertiary, fontSize: 8, fontWeight: '900', width: 24 },
  clauseText: { color: COLORS.text, flex: 1, fontSize: 10, fontWeight: '700' },
  humanBox: { marginTop: 12, borderRadius: 15, backgroundColor: alpha(COLORS.amber, 0.08), borderWidth: 1, borderColor: alpha(COLORS.amber, 0.22), padding: 12, flexDirection: 'row', alignItems: 'center', gap: 9 },
  humanTitle: { color: COLORS.text, fontSize: 10, fontWeight: '850' },
  certificate: { alignItems: 'center', paddingVertical: 5 },
  certificateSeal: { width: 82, height: 82, borderRadius: 41, borderWidth: 2, borderColor: alpha(COLORS.mint, 0.35), backgroundColor: alpha(COLORS.mint, 0.08), alignItems: 'center', justifyContent: 'center' },
  certificateTitle: { color: COLORS.text, fontSize: 23, fontWeight: '900', marginTop: 14 },
  certificateVehicle: { color: COLORS.textSecondary, fontSize: 11, marginTop: 4 },
  certificateSub: { color: COLORS.textTertiary, fontSize: 8, marginTop: 2 },
  certGrid: { flexDirection: 'row', marginTop: 15 },
  hash: { alignSelf: 'stretch', borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: 14, paddingTop: 12, alignItems: 'center' },
  hashLabel: { color: COLORS.textTertiary, fontSize: 7, fontWeight: '850', letterSpacing: 0.8 },
  hashValue: { color: COLORS.textSecondary, fontFamily: 'monospace', fontSize: 9, marginTop: 4 },
  check: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 38, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  checkText: { color: COLORS.textSecondary, flex: 1, fontSize: 10, lineHeight: 14 },
});
