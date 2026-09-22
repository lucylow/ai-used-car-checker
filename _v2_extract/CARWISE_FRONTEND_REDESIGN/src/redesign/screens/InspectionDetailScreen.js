import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { Accordion, EvidenceTimeline, MetricPill, PressableTile } from '../components/Advanced';
import { Badge, ChipRow, PrimaryButton, Screen, ScreenHeader, SectionHeader, SecondaryButton, SurfaceCard, WarningBanner } from '../components/Primitives';
import { ConfidenceMeter, HorizontalBars, ScoreRing, Waterfall } from '../components/Charts';
import { EvidenceGallery } from '../components/Media';
import { VehicleHealthMap } from '../components/Vehicle';

export default function InspectionDetailScreen({ data, actions }) {
  const [tab, setTab] = useState('overview');
  const tabs = ['overview', 'evidence', 'findings', 'price', 'activity'];
  const issueCount = data.findings?.length || data.issues?.length || 0;
  const events = useMemo(() => [
    { id: 'd1', time: '10:35', type: 'VIN', title: 'Vehicle identity verified', description: `${data.vehicle.vin || 'VIN'} is attached to this inspection.`, color: COLORS.cyan },
    { id: 'd2', time: '10:41', type: 'AI', title: 'Condition analysis completed', description: `${issueCount} findings are available for review.`, color: COLORS.mint },
    { id: 'd3', time: '10:51', type: 'PRICE', title: 'Fair price calculated', description: 'Market context and repair estimates are linked.', color: COLORS.blue },
  ], [data.vehicle.vin, issueCount]);
  return <Screen scroll contentStyle={styles.content}>
    <ScreenHeader title="Inspection Detail" subtitle="A visual command center for one vehicle." onBack={actions?.onBack} right={<Badge tone={data.risk.score >= 70 ? 'coral' : 'amber'} label={`${data.risk.score} RISK`} />} />
    <VehicleHeader data={data} />
    <ChipRow items={tabs.map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) }))} selected={tab} onSelect={setTab} style={{ marginTop: 12 }} />
    {tab === 'overview' ? <Overview data={data} actions={actions} /> : null}
    {tab === 'evidence' ? <EvidenceTab data={data} actions={actions} /> : null}
    {tab === 'findings' ? <FindingsTab data={data} actions={actions} /> : null}
    {tab === 'price' ? <PriceTab data={data} actions={actions} /> : null}
    {tab === 'activity' ? <ActivityTab events={events} /> : null}
  </Screen>;
}

function VehicleHeader({ data }) {
  return <SurfaceCard tone="blue" style={styles.hero}><View style={styles.heroCar}><Ionicons name="car-sport" size={44} color={COLORS.text} /></View><View style={COMMON.fill}><Text style={TYPOGRAPHY.eyebrow}>ACTIVE INSPECTION</Text><Text style={styles.heroName}>{data.vehicle.name}</Text><Text style={styles.heroMeta}>{data.vehicle.year} · {data.vehicle.mileage} mi · {data.vehicle.asking}</Text></View><ScoreRing score={data.risk.score} size={80} /></SurfaceCard>;
}

function Overview({ data, actions }) {
  return <><SectionHeader title="Health snapshot" subtitle="What needs your attention" style={{ marginTop: 18 }} /><View style={styles.metrics}><MetricPill label="FINDINGS" value={`${data.findings?.length || 7}`} tone="coral" /><MetricPill label="REPAIRS" value={data.repairTotal || '$1.7k'} tone="amber" /><MetricPill label="MARKET" value="$21.1k" tone="mint" /><MetricPill label="EVIDENCE" value={`${data.photos?.length || 8}`} tone="cyan" /></View><SurfaceCard style={{ marginTop: 11 }}><VehicleHealthMap issues={data.issues} /><Text style={styles.helper}>Tap a vehicle zone to inspect linked evidence, issues, and repair impact.</Text></SurfaceCard><SectionHeader title="Condition categories" subtitle="Coverage" style={{ marginTop: 19 }} /><SurfaceCard><HorizontalBars rows={[{ label: 'Exterior', value: 82 }, { label: 'Interior', value: 91 }, { label: 'Mechanical', value: 67 }, { label: 'Documents', value: 88 }]} /></SurfaceCard><SectionHeader title="Recommended next actions" style={{ marginTop: 19 }} /><View style={styles.tiles}><PressableTile title="Review findings" subtitle="AI annotations" icon="sparkles-outline" tone="cyan" onPress={() => actions?.onNavigate?.('ai')} /><PressableTile title="Check market" subtitle="Fair value" icon="trending-up-outline" tone="mint" onPress={() => actions?.onNavigate?.('market')} /><PressableTile title="Estimate repairs" subtitle="Cost impact" icon="construct-outline" tone="amber" onPress={() => actions?.onNavigate?.('cost')} /><PressableTile title="Prepare offer" subtitle="Negotiation" icon="chatbubbles-outline" tone="blue" onPress={() => actions?.onNavigate?.('negotiation')} /></View></>;
}

function EvidenceTab({ data, actions }) { return <><SectionHeader title="Evidence library" subtitle={`${data.photos?.length || 0} photos`} style={{ marginTop: 18 }} /><EvidenceGallery items={data.photos} onOpen={(photo) => actions?.onOpenPhoto?.(photo)} /><WarningBanner title="Evidence first" body="Make every important recommendation traceable to a photo, video, voice note, document, or manual observation." tone="cyan" style={{ marginTop: 12 }} /></>; }

function FindingsTab({ data, actions }) { return <><SectionHeader title="Findings" subtitle="Tap for evidence" style={{ marginTop: 18 }} />{data.findings.map((finding) => <SurfaceCard key={finding.id} tone={finding.tone === 'coral' ? 'coral' : finding.tone === 'amber' ? 'amber' : 'default'} style={{ marginBottom: 9 }}><View style={COMMON.row}><View style={[styles.findingMarker, { backgroundColor: alpha(finding.tone === 'coral' ? COLORS.coral : COLORS.amber, 0.12) }]}><Ionicons name="warning-outline" size={17} color={finding.tone === 'coral' ? COLORS.coral : COLORS.amber} /></View><View style={COMMON.fill}><View style={COMMON.row}><Text style={styles.findingTitle}>{finding.title}</Text><Text style={styles.findingCost}>{finding.cost}</Text></View><Text style={styles.findingBody}>{finding.description}</Text><View style={styles.findingFoot}><MetricPill label="CONFIDENCE" value={`${finding.confidence || 90}%`} tone="cyan" /><Pressable onPress={() => actions?.onOpenFinding?.(finding)}><Text style={styles.viewEvidence}>View evidence →</Text></Pressable></View></View></View></SurfaceCard>)}</>; }

function PriceTab({ data, actions }) { return <><SectionHeader title="Price intelligence" subtitle="Evidence-linked estimate" style={{ marginTop: 18 }} /><SurfaceCard tone="blue"><View style={COMMON.row}><View style={COMMON.fill}><Text style={TYPOGRAPHY.eyebrow}>CURRENT ASKING</Text><Text style={styles.asking}>$21,900</Text><Text style={styles.marketHint}>Market context: $19,800 – $23,900</Text></View><MetricPill label="FAIR" value="$21.1k" tone="mint" /></View><Waterfall rows={[{ label: 'Market', value: 21100 }, { label: 'Repairs', value: -1700 }, { label: 'Target', value: 19400 }]} style={{ marginTop: 17 }} /></SurfaceCard><SurfaceCard style={{ marginTop: 10 }}><ConfidenceMeter confidence={0.92} label="Market confidence" caption="Display data provenance and update timing next to this indicator." /><PrimaryButton label="Open negotiation coach" icon="chatbubbles" onPress={() => actions?.onNavigate?.('negotiation')} style={{ marginTop: 13 }} /></SurfaceCard></>; }

function ActivityTab({ events }) { return <><SectionHeader title="Inspection timeline" subtitle="Audit-friendly activity" style={{ marginTop: 18 }} /><SurfaceCard><EvidenceTimeline events={events} /></SurfaceCard><Accordion title="Why keep this timeline?" icon="shield-checkmark-outline" defaultOpen><Text style={styles.helper}>A chronological record makes it easier to review what was observed, what AI processed, and when each recommendation entered the inspection.</Text></Accordion></>; }

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  hero: { marginTop: 2 },
  heroCar: { width: 67, height: 67, borderRadius: 19, backgroundColor: alpha(COLORS.cyan, 0.09), alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  heroName: { color: COLORS.text, fontSize: 16, fontWeight: '900', marginTop: 3 },
  heroMeta: { color: COLORS.textSecondary, fontSize: 9, marginTop: 4 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap' },
  helper: { color: COLORS.textSecondary, fontSize: 9, lineHeight: 14, marginTop: 9 },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  findingMarker: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  findingTitle: { color: COLORS.text, fontSize: 12, fontWeight: '850', flex: 1 },
  findingCost: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '850', marginLeft: 7 },
  findingBody: { color: COLORS.textSecondary, fontSize: 9, lineHeight: 14, marginTop: 3 },
  findingFoot: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  viewEvidence: { color: COLORS.cyan, fontSize: 9, fontWeight: '850', marginLeft: 3 },
  asking: { color: COLORS.text, fontSize: 29, fontWeight: '900', marginTop: 3 },
  marketHint: { color: COLORS.textSecondary, fontSize: 9, marginTop: 4 },
});
