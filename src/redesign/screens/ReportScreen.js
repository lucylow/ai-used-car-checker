import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha, toneColor } from '../theme';
import { Badge, Divider, PrimaryButton, Screen, ScreenHeader, SectionHeader, SecondaryButton, SurfaceCard } from '../components/Primitives';
import { ScoreRing, HorizontalBars } from '../components/Charts';
import { EvidenceGallery } from '../components/Media';

const SECTIONS = ['Overview', 'Vehicle', 'Market', 'Evidence', 'Findings', 'Repairs', 'Negotiation', 'Documents'];

export default function ReportScreen({ data, actions }) {
  const [section, setSection] = useState('Overview');
  const score = data.riskScore || 0;
  const tone = score >= 55 ? 'coral' : score >= 30 ? 'amber' : 'mint';
  return <Screen contentStyle={styles.content}>
    <ScreenHeader title="Inspection Report" subtitle="A visual, evidence-linked report built from the current inspection." onBack={actions?.onBack} right={<Badge tone="mint" label="DRAFT" icon="document-text-outline" />} />
    <SurfaceCard tone={tone} style={styles.reportHero}><View style={styles.reportHeroTop}><View style={styles.vehicleMini}><Ionicons name="car-sport" size={29} color={COLORS.cyan} /></View><View style={COMMON.fill}><Text style={TYPOGRAPHY.eyebrow}>VEHICLE</Text><Text style={TYPOGRAPHY.h2}>{data.vehicle?.year || '2020'} {data.vehicle?.make || 'Honda'} {data.vehicle?.model || 'Accord Sport'}</Text><Text style={styles.vehicleMeta}>{data.vehicle?.mileage || '42,180'} mi · {data.vehicle?.location || 'Toronto, ON'}</Text></View><ScoreRing score={score} label="Risk" tone={tone} size={108} /></View><Divider spacing={12} /><View style={styles.reportMetrics}><Mini label="Evidence" value={`${data.photos?.length || 0}`} /><Mini label="Findings" value={`${data.issues?.length || 0}`} /><Mini label="Repairs" value={`$${Math.round(data.repairTotal || 0).toLocaleString()}`} /><Mini label="Fair" value={`$${Number(data.market?.fair || 21100).toLocaleString()}`} /></View></SurfaceCard>

    <View style={{ marginTop: 16 }}><SectionTabs value={section} onChange={setSection} /></View>
    {section === 'Overview' ? <Overview data={data} actions={actions} /> : null}
    {section === 'Evidence' ? <Evidence data={data} actions={actions} /> : null}
    {section === 'Findings' ? <Findings data={data} actions={actions} /> : null}
    {section === 'Repairs' ? <Repairs data={data} /> : null}
    {section === 'Market' ? <MarketSummary data={data} /> : null}
    {section === 'Negotiation' ? <NegotiationSummary data={data} actions={actions} /> : null}
    {section === 'Documents' ? <Documents data={data} actions={actions} /> : null}
    {section === 'Vehicle' ? <VehicleSection data={data} /> : null}

    <View style={styles.actionStack}><PrimaryButton label="Export PDF" icon="download-outline" onPress={actions?.onExportPdf} /><SecondaryButton label="Share report" icon="share-outline" onPress={actions?.onShareReport} /><SecondaryButton label="Generate certificate" icon="shield-checkmark-outline" onPress={actions?.onOpenCertificate} /></View>
  </Screen>;
}

function SectionTabs({ value, onChange }) { return <View style={styles.tabs}>{SECTIONS.map((item) => <Pressable key={item} onPress={() => onChange(item)} style={[styles.tab, value === item && styles.tabActive]}><Text style={[styles.tabText, value === item && styles.tabTextActive]}>{item}</Text></Pressable>)}</View>; }
function Overview({ data, actions }) { return <View><SurfaceCard><Text style={TYPOGRAPHY.eyebrow}>REPORT READOUT</Text><Text style={TYPOGRAPHY.h3}>What changed your decision</Text><Text style={styles.longText}>CarWise consolidates the inspection state into a visual summary so the next action is clear. Review evidence before using any AI finding as a negotiation point.</Text><View style={styles.insightGrid}><Insight icon="images-outline" title="Evidence" value={`${data.photos?.length || 0} media items`} tone="cyan" /><Insight icon="warning-outline" title="Review" value={`${data.issues?.length || 0} findings`} tone="amber" /><Insight icon="shield-checkmark-outline" title="Trust" value="Human review" tone="mint" /></View><SecondaryButton label="Open AI findings" icon="sparkles-outline" onPress={actions?.onOpenAI} /></SurfaceCard><SurfaceCard style={{ marginTop: 12 }}><Text style={TYPOGRAPHY.eyebrow}>DECISION QUALITY</Text><HorizontalBars rows={[{ label: 'Evidence coverage', value: Math.min(100, (data.photos?.length || 0) * 18), display: `${data.photos?.length || 0} media`, color: COLORS.cyan }, { label: 'Checklist completion', value: data.progress || 0, display: `${data.progress || 0}%`, color: COLORS.blue }, { label: 'Finding review', value: data.findings?.length ? data.findings.filter((f) => f.status === 'confirmed').length / data.findings.length * 100 : 0, display: `${data.findings?.filter((f) => f.status === 'confirmed').length || 0}/${data.findings?.length || 0}`, color: COLORS.mint }]} max={100} /></SurfaceCard></View>; }
function Evidence({ data, actions }) { return <View><SectionHeader eyebrow="MEDIA" title="Evidence gallery" subtitle="Tap any image to inspect its context." /><EvidenceGallery items={data.photos || []} onOpen={actions?.onOpenEvidence} onAdd={actions?.onAddEvidence} /></View>; }
function Findings({ data, actions }) { return <View><SectionHeader eyebrow="AI + MANUAL" title="Findings" subtitle="Keep evidence, uncertainty, and human confirmation visible." />{(data.findings || []).map((item) => <SurfaceCard key={item.id} tone={item.severity === 'critical' ? 'coral' : item.severity === 'major' ? 'amber' : 'mint'}><View style={COMMON.rowBetween}><View style={COMMON.fill}><Text style={styles.findingTitle}>{item.title}</Text><Text style={styles.findingMeta}>{item.zone} · {Math.round((item.confidence || 0) * 100)}%</Text></View><Badge tone={item.severity === 'critical' ? 'coral' : item.severity === 'major' ? 'amber' : 'mint'} label={(item.status || 'review').toUpperCase()} /></View><Text style={styles.longText}>{item.description}</Text><View style={styles.findingBottom}><Text style={styles.repairEstimate}>${item.costLow || 0}–${item.costHigh || 0}</Text><Pressable onPress={() => actions?.onOpenEvidenceById?.(item.evidenceIds?.[0])}><Text style={styles.link}>View evidence →</Text></Pressable></View></SurfaceCard>)}</View>; }
function Repairs({ data }) { const rows = (data.findings || []).map((f) => ({ label: f.title, value: ((f.costLow || 0) + (f.costHigh || 0)) / 2, display: `$${Math.round(((f.costLow || 0) + (f.costHigh || 0)) / 2).toLocaleString()}`, color: f.severity === 'major' ? COLORS.amber : COLORS.mint })); return <View><SurfaceCard><Text style={TYPOGRAPHY.eyebrow}>REPAIR ESTIMATES</Text><Text style={TYPOGRAPHY.h3}>Potential near-term cost</Text><Text style={styles.longText}>These are estimates from the current inspection evidence. Confirm quotes with a qualified repair professional.</Text><HorizontalBars rows={rows.length ? rows : [{ label: 'No repair items', value: 0, display: '$0' }]} /></SurfaceCard></View>; }
function MarketSummary({ data }) { return <View><SurfaceCard tone="mint"><Text style={TYPOGRAPHY.eyebrow}>MARKET VALUE</Text><Text style={styles.bigMoney}>${Number(data.market?.fair || 21100).toLocaleString()}</Text><Text style={styles.longText}>Estimated fair value compared with an asking price of ${Number(data.vehicle?.asking || 21900).toLocaleString()}.</Text><View style={styles.marketCompare}><Mini label="Fair" value={`$${Number(data.market?.fair || 21100).toLocaleString()}`} /><Mini label="Ask" value={`$${Number(data.vehicle?.asking || 21900).toLocaleString()}`} /><Mini label="Trend" value={`${data.market?.trend > 0 ? '+' : ''}${data.market?.trend || 2.4}%`} /></View></SurfaceCard></View>; }
function NegotiationSummary({ data, actions }) { return <View><SurfaceCard tone="blue"><Text style={TYPOGRAPHY.eyebrow}>NEGOTIATION</Text><Text style={TYPOGRAPHY.h3}>Ready to turn evidence into an offer</Text><Text style={styles.longText}>Review the negotiation coach for opening, target, and maximum numbers alongside the evidence that supports them.</Text><PrimaryButton label="Open negotiation coach" icon="chatbubbles-outline" onPress={actions?.onOpenNegotiation} /></SurfaceCard></View>; }
function Documents({ actions }) { return <View><SurfaceCard><Text style={TYPOGRAPHY.eyebrow}>DOCUMENTS</Text><Text style={TYPOGRAPHY.h3}>Keep proof attached</Text><Text style={styles.longText}>Service records, ownership documents, inspection PDFs, and generated contracts can all sit beside the report.</Text><SecondaryButton label="Add a document" icon="document-attach-outline" onPress={actions?.onPickDocument} /></SurfaceCard></View>; }
function VehicleSection({ data }) { return <View><SurfaceCard><Text style={TYPOGRAPHY.eyebrow}>VEHICLE IDENTITY</Text><Text style={TYPOGRAPHY.h2}>{data.vehicle?.year} {data.vehicle?.make} {data.vehicle?.model}</Text><View style={styles.vehicleGrid}><Mini label="VIN" value={data.vehicle?.vin || 'Not provided'} /><Mini label="Mileage" value={`${data.vehicle?.mileage || '—'} mi`} /><Mini label="Location" value={data.vehicle?.location || '—'} /></View></SurfaceCard></View>; }
function Mini({ label, value }) { return <View style={styles.mini}><Text style={styles.miniLabel}>{label}</Text><Text style={styles.miniValue}>{value}</Text></View>; }
function Insight({ icon, title, value, tone }) { return <View style={styles.insight}><View style={[styles.insightIcon, { backgroundColor: alpha(toneColor(tone), 0.1) }]}><Ionicons name={icon} size={16} color={toneColor(tone)} /></View><Text style={styles.insightTitle}>{title}</Text><Text style={styles.insightValue}>{value}</Text></View>; }

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  reportHero: { marginTop: 4 },
  reportHeroTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  vehicleMini: { width: 48, height: 48, borderRadius: 16, backgroundColor: alpha(COLORS.cyan, 0.08), alignItems: 'center', justifyContent: 'center' },
  vehicleMeta: { color: COLORS.textTertiary, fontSize: 10, marginTop: 3 },
  reportMetrics: { flexDirection: 'row', gap: 7 },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  tab: { minHeight: 33, borderRadius: 17, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, paddingHorizontal: 11, justifyContent: 'center' },
  tabActive: { backgroundColor: COLORS.blue, borderColor: COLORS.blue },
  tabText: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '750' },
  tabTextActive: { color: COLORS.white },
  longText: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 19, marginTop: 8 },
  insightGrid: { flexDirection: 'row', gap: 7, marginTop: 15 },
  insight: { flex: 1, borderRadius: 13, backgroundColor: COLORS.surfaceElevated, padding: 10 },
  insightIcon: { width: 29, height: 29, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  insightTitle: { color: COLORS.textTertiary, fontSize: 9, fontWeight: '750', marginTop: 7 },
  insightValue: { color: COLORS.text, fontSize: 11, fontWeight: '850', marginTop: 2 },
  findingTitle: { color: COLORS.text, fontSize: 14, fontWeight: '850' },
  findingMeta: { color: COLORS.textTertiary, fontSize: 9, marginTop: 3 },
  findingBottom: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  repairEstimate: { color: COLORS.amber, fontSize: 16, fontWeight: '900' },
  link: { color: COLORS.blue, fontSize: 10, fontWeight: '850' },
  bigMoney: { color: COLORS.mint, fontSize: 38, fontWeight: '900', marginTop: 6 },
  marketCompare: { flexDirection: 'row', gap: 7, marginTop: 14 },
  vehicleGrid: { gap: 8, marginTop: 13 },
  mini: { flex: 1, backgroundColor: COLORS.surfaceElevated, borderRadius: 12, padding: 9 },
  miniLabel: { color: COLORS.textTertiary, fontSize: 8, textTransform: 'uppercase', fontWeight: '800' },
  miniValue: { color: COLORS.text, fontSize: 11, fontWeight: '850', marginTop: 4 },
  actionStack: { gap: 8, marginTop: 24 },
});
