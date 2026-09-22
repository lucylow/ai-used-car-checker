import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha, toneColor } from '../theme';
import { Badge, MetricCard, PrimaryButton, Screen, ScreenHeader, SectionHeader, SecondaryButton, SurfaceCard, WarningBanner } from '../components/Primitives';
import { ScoreRing, Waterfall } from '../components/Charts';
import { VehicleHealthMap } from '../components/Vehicle';
import { EvidenceGallery } from '../components/Media';

export default function SummaryScreen({ data, actions }) {
  const riskTone = data.riskScore >= 55 ? 'coral' : data.riskScore >= 30 ? 'amber' : 'mint';
  const total = Number(data.repairTotal || 0);
  const market = data.market || {};
  return <Screen contentStyle={styles.content}>
    <ScreenHeader title="Inspection Summary" subtitle="A decision-ready view of what CarWise knows, what still needs review, and why." onBack={actions?.onBack} right={<Badge tone={riskTone} label={data.riskLabel?.toUpperCase() || 'REVIEW'} />} />
    <SurfaceCard tone={riskTone} style={styles.hero}><View style={styles.heroTop}><View style={COMMON.fill}><Text style={TYPOGRAPHY.eyebrow}>OVERALL RISK</Text><Text style={TYPOGRAPHY.h1}>{data.riskLabel || 'Moderate risk'}</Text><Text style={styles.heroBody}>Risk is calculated from the current issue mix. It is a screening signal, not a professional mechanical inspection.</Text></View><ScoreRing score={data.riskScore || 0} label="Risk" tone={riskTone} size={138} /></View><View style={styles.summaryFlags}><Flag icon="images-outline" label="Evidence" value={`${data.photos?.length || 0} items`} /><Flag icon="alert-circle-outline" label="Findings" value={`${data.issues?.length || 0}`} /><Flag icon="build-outline" label="Repairs" value={`$${Math.round(total).toLocaleString()}`} /></View></SurfaceCard>

    <View style={styles.metricRow}><MetricCard label="Fair price" value={`$${Number(market.fair || data.aiResult?.fairPrice || 21100).toLocaleString()}`} note="market estimate" tone="mint" icon="pricetag-outline" /><MetricCard label="Asking" value={`$${Number(data.vehicle?.asking || market.current || 21900).toLocaleString()}`} note="seller ask" tone="blue" icon="cash-outline" /></View>

    {data.reportReadiness?.ready === false ? <View style={{ marginTop: 14 }}><WarningBanner title="Report is not fully ready" body={data.reportReadiness?.missing?.join(', ') || 'Add required vehicle details and evidence before exporting.'} tone="amber" /></View> : null}

    <View style={{ marginTop: 23 }}><SectionHeader eyebrow="VEHICLE HEALTH" title="Tap a zone to inspect it" subtitle="The map reflects the current inspection state, not a mechanical certification." /><VehicleHealthMap selectedId={data.selectedVehicleZone} onSelect={actions?.onSelectVehicleZone} /></View>

    <View style={{ marginTop: 23 }}><SurfaceCard><Text style={TYPOGRAPHY.eyebrow}>OWNERSHIP IMPACT</Text><Text style={TYPOGRAPHY.h3}>What the current findings change</Text><Waterfall rows={[{ id: 'm', label: 'Market estimate', value: Number(market.fair || 21100), display: `$${Number(market.fair || 21100).toLocaleString()}`, tone: 'mint' }, { id: 'r', label: 'Potential repair impact', value: total, display: `−$${Math.round(total).toLocaleString()}`, tone: 'amber' }, { id: 'a', label: 'Current asking', value: Number(data.vehicle?.asking || market.current || 21900), display: `$${Number(data.vehicle?.asking || market.current || 21900).toLocaleString()}`, tone: 'blue' }]} /></SurfaceCard></View>

    <View style={{ marginTop: 23 }}><SectionHeader eyebrow="EVIDENCE" title="Inspection media" actionLabel="Open all" onAction={actions?.onOpenPhotos} /><EvidenceGallery items={data.photos || []} onOpen={actions?.onOpenEvidence} onAdd={actions?.onAddEvidence} /></View>

    <View style={{ marginTop: 24 }}><SectionHeader eyebrow="NEXT ACTION" title="Keep moving forward" /><ActionTile icon="cash-outline" title="Check fair price" body="Compare asking price with market evidence." onPress={actions?.onOpenMarket} /><ActionTile icon="chatbubble-ellipses-outline" title="Prepare negotiation" body="Turn the strongest findings into seller talking points." onPress={actions?.onOpenNegotiation} /><ActionTile icon="document-text-outline" title="Build report" body="Package the vehicle, findings, and evidence into a shareable report." onPress={actions?.onOpenReport} /></View>

    <View style={{ marginTop: 22, gap: 9 }}><PrimaryButton label="Open negotiation coach" icon="chatbubbles-outline" onPress={actions?.onOpenNegotiation} /><SecondaryButton label="Review all findings" icon="scan-outline" onPress={actions?.onOpenAI} /></View>
  </Screen>;
}

function Flag({ icon, label, value }) { return <View style={styles.flag}><Ionicons name={icon} size={15} color={COLORS.cyan} /><Text style={styles.flagLabel}>{label}</Text><Text style={styles.flagValue}>{value}</Text></View>; }
function ActionTile({ icon, title, body, onPress }) { return <Pressable onPress={onPress} style={styles.actionTile}><View style={styles.actionIcon}><Ionicons name={icon} size={20} color={COLORS.cyan} /></View><View style={COMMON.fill}><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionBody}>{body}</Text></View><Ionicons name="arrow-up-right" size={16} color={COLORS.textTertiary} /></Pressable>; }

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  hero: { marginTop: 4 },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroBody: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 17, maxWidth: 205, marginTop: 5 },
  summaryFlags: { flexDirection: 'row', gap: 7, marginTop: 15 },
  flag: { flex: 1, paddingVertical: 9, paddingHorizontal: 7, borderRadius: 12, backgroundColor: COLORS.surfaceElevated, alignItems: 'center' },
  flagLabel: { color: COLORS.textTertiary, fontSize: 8, marginTop: 4, fontWeight: '800' },
  flagValue: { color: COLORS.text, fontSize: 11, fontWeight: '850', marginTop: 2 },
  metricRow: { flexDirection: 'row', gap: 8, marginTop: 11 },
  actionTile: { minHeight: 73, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  actionIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: alpha(COLORS.cyan, 0.08), alignItems: 'center', justifyContent: 'center' },
  actionTitle: { color: COLORS.text, fontSize: 13, fontWeight: '850' },
  actionBody: { color: COLORS.textTertiary, fontSize: 10, lineHeight: 14, marginTop: 3 },
});
