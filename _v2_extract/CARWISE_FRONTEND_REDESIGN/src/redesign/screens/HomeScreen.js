import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, SPACE, TYPOGRAPHY, alpha, toneColor } from '../theme';
import { Badge, MetricCard, PrimaryButton, SectionHeader, Screen, SurfaceCard, WarningBanner } from '../components/Primitives';
import { VehicleHero, VehicleInfoStrip } from '../components/Vehicle';
import { SparkBars, ScoreRing, MiniLineChart } from '../components/Charts';
import { DEMO_HISTORY } from '../data';
import { useReveal } from '../motion';

export default function HomeScreen({ data, actions }) {
  const reveal = useReveal(`home-${data?.progress || 0}-${data?.savedInspections?.length || 0}`);
  const toolItems = [
    ['scan-outline', 'VIN decode', 'Identify a vehicle', 'vin'],
    ['analytics-outline', 'Market', 'Check fair price', 'market'],
    ['document-text-outline', 'History', 'Ownership signals', 'history-tool'],
    ['car-outline', 'Test drive', 'Log observations', 'test'],
  ];
  return <Screen contentStyle={styles.content}>
    <AnimatedHeader data={data} actions={actions} />
    <View style={styles.heroCopy}><Text style={TYPOGRAPHY.eyebrow}>GOOD EVENING</Text><Text style={TYPOGRAPHY.display}>Know the car.<Text style={{ color: COLORS.cyan }}> Know the deal.</Text></Text><Text style={styles.heroBody}>CarWise turns vehicle evidence into a decision-ready inspection you can understand at a glance.</Text></View>

    {data?.hasRecoveryNotice ? <View style={{ marginTop: 16 }}><WarningBanner title="Local work recovered" body={data.recoveryNotice} tone="amber" actionLabel="View" onAction={actions?.onOpenSettings} /></View> : null}

    {data?.vehicle ? <Animated.View style={reveal}><VehicleHero vehicle={data.vehicle} progress={data.progress} riskLabel={data.riskLabel} riskScore={data.riskScore} imageUri={data.heroImage} onResume={actions?.onResumeInspection} /></Animated.View> : <SurfaceCard tone="blue" style={styles.startCard}><View style={styles.startIcon}><Ionicons name="car-sport" size={28} color={COLORS.cyan} /></View><Text style={TYPOGRAPHY.h2}>Start with the vehicle</Text><Text style={styles.startBody}>Scan a VIN, enter the details, or load a saved inspection. CarWise will guide the next best step.</Text><PrimaryButton label="Start an inspection" onPress={actions?.onStartInspection} icon="arrow-forward" /></SurfaceCard>}

    {data?.vehicle ? <View style={styles.section}><VehicleInfoStrip vehicle={data.vehicle} /></View> : null}

    <View style={styles.section}><SectionHeader eyebrow="FAST TOOLS" title="Do it in a tap" subtitle="Keep research and evidence close to the inspection." />
      <View style={styles.toolGrid}>{toolItems.map(([icon, title, subtitle, route], index) => <ToolCard key={route} index={index} icon={icon} title={title} subtitle={subtitle} onPress={() => actions?.onOpenTool(route)} />)}</View>
    </View>

    <View style={styles.section}><SectionHeader eyebrow="ACTIVE SIGNALS" title="Vehicle confidence" subtitle="A compact readout of the work already captured." />
      <View style={styles.metricGrid}><MetricCard label="Evidence" value={`${data?.photos?.length || 0}`} note="photos / media" tone="cyan" icon="images-outline" /><MetricCard label="Findings" value={`${data?.issues?.length || 0}`} note="reviewed items" tone="amber" icon="alert-circle-outline" /><MetricCard label="Repairs" value={`$${Math.round(data?.repairTotal || 0).toLocaleString()}`} note="current estimate" tone="amber" icon="build-outline" /><MetricCard label="AI confidence" value={`${Math.round((data?.aiConfidence || 0.86) * 100)}%`} note="current run" tone="mint" icon="sparkles-outline" /></View>
    </View>

    <View style={styles.section}><SurfaceCard style={styles.marketPreview} tone="blue"><View style={COMMON.rowBetween}><View><Text style={TYPOGRAPHY.eyebrow}>MARKET SIGNAL</Text><Text style={TYPOGRAPHY.h3}>Asking vs. local market</Text></View><Badge tone="mint" label="LIVE-READY" /></View><View style={styles.marketPreviewBody}><View style={COMMON.fill}><Text style={styles.marketPrice}>${Number(data?.market?.current || 21900).toLocaleString()}</Text><Text style={styles.marketSub}>asking price</Text><Text style={styles.marketDelta}>Fair estimate ${Number(data?.market?.fair || 21100).toLocaleString()} · {data?.market?.trend > 0 ? '+' : ''}{data?.market?.trend || 2.4}% 30d</Text></View><MiniLineChart points={[28,31,30,42,38,55,51,64,61,69]} tone="cyan" height={82} /></View><SparkBars values={[35,40,55,44,60,54,72,70,78,84]} height={46} tone="blue" /></SurfaceCard></View>

    <View style={styles.section}><SectionHeader eyebrow="RECENT" title="Inspection history" actionLabel="See all" onAction={() => actions?.onTabChange('history')} />
      {((data?.savedInspections?.length ? data.savedInspections : DEMO_HISTORY).slice(0, 3)).map((item) => <SavedPreview key={item.id} item={item} onPress={() => actions?.onOpenSaved(item)} />)}
    </View>

    <SurfaceCard style={styles.trustCard}><View style={styles.trustTop}><ScoreRing score={100 - Math.min(100, data?.riskScore || 0)} label="Readiness" tone="mint" size={104} /><View style={COMMON.fill}><Text style={TYPOGRAPHY.eyebrow}>CARWISE PRINCIPLE</Text><Text style={TYPOGRAPHY.h3}>See the evidence before you decide.</Text><Text style={styles.trustBody}>AI assists the inspection, while human review remains the final gate for findings and signatures.</Text></View></View><Badge tone="cyan" label="AI-ASSISTED · HUMAN-REVIEWABLE" /></SurfaceCard>
  </Screen>;
}

function AnimatedHeader({ actions }) {
  return <View style={styles.header}><View style={COMMON.rowBetween}><View style={styles.brand}><View style={styles.brandMark}><Ionicons name="shield-checkmark" size={19} color={COLORS.white} /></View><View><Text style={styles.brandText}>CARWISE</Text><Text style={styles.brandSub}>USED CAR INTELLIGENCE</Text></View></View><Pressable accessibilityRole="button" accessibilityLabel="Open notifications" onPress={actions?.onNotifications} style={styles.notification}><Ionicons name="notifications-outline" size={19} color={COLORS.text} /></Pressable></View></View>;
}

function ToolCard({ icon, title, subtitle, onPress, index }) {
  const reveal = useReveal(`tool-${index}`, { delay: index * 45, duration: 260, distance: 10 });
  return <Animated.View style={[{ flex: 1 }, reveal]}><Pressable onPress={onPress} style={styles.toolCard}><View style={styles.toolIcon}><Ionicons name={icon} size={21} color={COLORS.cyan} /></View><View style={COMMON.fill}><Text style={styles.toolTitle}>{title}</Text><Text style={styles.toolSubtitle}>{subtitle}</Text></View><Ionicons name="arrow-up-right" size={15} color={COLORS.textTertiary} /></Pressable></Animated.View>;
}

function SavedPreview({ item, onPress }) {
  const score = Number(item.risk ?? 30);
  const tone = score >= 55 ? 'coral' : score >= 30 ? 'amber' : 'mint';
  return <Pressable onPress={onPress} style={styles.savedRow}><View style={styles.savedThumb}><Ionicons name="car-sport" size={22} color={COLORS.textTertiary} /></View><View style={COMMON.fill}><Text style={styles.savedTitle}>{item.vehicle?.year} {item.vehicle?.make} {item.vehicle?.model}</Text><Text style={styles.savedMeta}>{item.date || 'Saved inspection'} · {item.issues?.length ?? item.progress === 100 ? item.issues?.length ?? 0 : '—'} findings</Text></View><View style={{ alignItems: 'flex-end' }}><Badge tone={tone} label={score >= 55 ? 'HIGH' : score >= 30 ? 'WATCH' : 'LOW'} /><Text style={styles.savedPrice}>${Number(item.fairPrice || 0).toLocaleString()}</Text></View></Pressable>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  header: { paddingBottom: 6 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 39, height: 39, borderRadius: 13, backgroundColor: COLORS.blue, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.cyan, shadowOpacity: 0.2, shadowRadius: 14, shadowOffset: { width: 0, height: 4 } },
  brandText: { color: COLORS.text, fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  brandSub: { color: COLORS.textTertiary, fontSize: 7, letterSpacing: 1, fontWeight: '800', marginTop: 2 },
  notification: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  heroCopy: { marginTop: 23, marginBottom: 17 },
  heroBody: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 9, maxWidth: 350 },
  startCard: { marginTop: 10 },
  startIcon: { width: 50, height: 50, borderRadius: 18, backgroundColor: alpha(COLORS.cyan, 0.08), alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  startBody: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 5 },
  section: { marginTop: 27 },
  toolGrid: { flexDirection: 'row', gap: 8 },
  toolCard: { minHeight: 103, flex: 1, borderRadius: 17, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 12 },
  toolIcon: { width: 33, height: 33, borderRadius: 11, backgroundColor: alpha(COLORS.cyan, 0.08), alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  toolTitle: { color: COLORS.text, fontSize: 12, fontWeight: '850' },
  toolSubtitle: { color: COLORS.textTertiary, fontSize: 9, lineHeight: 13, marginTop: 3 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  marketPreview: { padding: 15 },
  marketPreviewBody: { flexDirection: 'row', alignItems: 'center', marginTop: 13, gap: 10 },
  marketPrice: { color: COLORS.mint, fontSize: 28, fontWeight: '900' },
  marketSub: { color: COLORS.textTertiary, fontSize: 10, marginTop: 1 },
  marketDelta: { color: COLORS.textSecondary, fontSize: 10, lineHeight: 15, marginTop: 8 },
  savedRow: { minHeight: 76, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  savedThumb: { width: 58, height: 54, borderRadius: 13, backgroundColor: COLORS.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  savedTitle: { color: COLORS.text, fontSize: 12, fontWeight: '850' },
  savedMeta: { color: COLORS.textTertiary, fontSize: 9, marginTop: 4 },
  savedPrice: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '750', marginTop: 5 },
  trustCard: { marginTop: 28, padding: 15 },
  trustTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  trustBody: { color: COLORS.textSecondary, fontSize: 10, lineHeight: 15, marginTop: 5 },
});
