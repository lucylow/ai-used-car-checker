import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha, toneColor } from '../theme';
import { Badge, PrimaryButton, Screen, ScreenHeader, SectionHeader, SurfaceCard } from '../components/Primitives';
import { MiniLineChart, PriceRangeBar, SparkBars } from '../components/Charts';
import { formatMoney } from '../data';

export default function MarketScreen({ data, actions }) {
  const market = data.market || {};
  const delta = Number(market.current || 0) - Number(market.fair || 0);
  const deltaTone = delta <= 0 ? 'mint' : delta < 1000 ? 'amber' : 'coral';
  const comparables = market.comparables || [];
  const histogram = useMemo(() => [23, 31, 43, 51, 63, 74, 68, 57, 47, 33, 20], []);
  return <Screen contentStyle={styles.content}>
    <ScreenHeader title="Market Intelligence" subtitle="Compare asking price with current local signals." onBack={actions?.onBack} right={<Badge tone="cyan" label="PRICE INTEL" />} />
    <SurfaceCard tone="mint">
      <View style={styles.priceTop}><View style={COMMON.fill}><Text style={TYPOGRAPHY.eyebrow}>FAIR VALUE ESTIMATE</Text><Text style={styles.fairPrice}>{formatMoney(market.fair || 21100)}</Text><Text style={styles.fairMeta}>based on comparable listings and vehicle context</Text></View><View style={styles.confBadge}><Ionicons name="shield-checkmark-outline" size={18} color={COLORS.mint} /><Text style={styles.confValue}>{Math.round((market.confidence || 0.92) * 100)}%</Text><Text style={styles.confLabel}>confidence</Text></View></View>
      <PriceRangeBar low={market.low || 19800} fair={market.fair || 21100} current={market.current || 21900} high={market.high || 23900} />
    </SurfaceCard>

    <View style={styles.statGrid}><Stat label="Asking" value={formatMoney(market.current || 21900)} tone="blue" /><Stat label="Above fair" value={formatMoney(Math.max(0, delta))} tone={deltaTone} /><Stat label="30-day trend" value={`${market.trend > 0 ? '+' : ''}${market.trend || 2.4}%`} tone={market.trend >= 0 ? 'mint' : 'coral'} /></View>

    <View style={{ marginTop: 22 }}><SurfaceCard><View style={COMMON.rowBetween}><View><Text style={TYPOGRAPHY.eyebrow}>PRICE TREND</Text><Text style={TYPOGRAPHY.h3}>Recent local movement</Text></View><Badge tone={market.trend >= 0 ? 'mint' : 'coral'} label={`${market.trend >= 0 ? '+' : ''}${market.trend || 2.4}%`} /></View><MiniLineChart points={[36,39,35,42,43,49,46,57,52,65,63,69]} tone="mint" height={92} /><View style={styles.axis}><Text>30d ago</Text><Text>today</Text></View></SurfaceCard></View>

    <View style={{ marginTop: 22 }}><SurfaceCard><View style={COMMON.rowBetween}><View><Text style={TYPOGRAPHY.eyebrow}>LISTING DISTRIBUTION</Text><Text style={TYPOGRAPHY.h3}>Where this vehicle sits</Text></View><Ionicons name="analytics-outline" size={20} color={COLORS.cyan} /></View><SparkBars values={histogram} height={72} tone="blue" /><View style={styles.histogramLabels}><Text>LOW</Text><Text>FAIR</Text><Text>HIGH</Text></View></SurfaceCard></View>

    <View style={{ marginTop: 22 }}><SectionHeader eyebrow="COMPARABLES" title={`${comparables.length || 3} nearby listings`} subtitle="Swipe through alternatives and open the detail source." /></View>
    {(comparables.length ? comparables : []).map((item) => <Comparable key={item.id} item={item} />)}

    <SurfaceCard tone="blue" style={{ marginTop: 22 }}><Text style={TYPOGRAPHY.eyebrow}>CARWISE EXPLANATION</Text><Text style={TYPOGRAPHY.h3}>Why the asking price is different</Text><Text style={styles.explainBody}>The current asking price is compared with a local fair-value estimate. Repair findings can further change the user's negotiation range, but they are kept visually separate from market-value evidence.</Text><View style={styles.reasonList}><Reason label="Market comparables" value={formatMoney(market.fair || 21100)} /><Reason label="Current asking" value={formatMoney(market.current || 21900)} /><Reason label="Difference" value={formatMoney(delta)} /></View><PrimaryButton label="Use market data in negotiation" onPress={actions?.onOpenNegotiation} icon="chatbubbles-outline" /></SurfaceCard>
  </Screen>;
}

function Stat({ label, value, tone }) { return <View style={styles.stat}><Text style={styles.statLabel}>{label}</Text><Text style={[styles.statValue, { color: toneColor(tone) }]}>{value}</Text></View>; }
function Comparable({ item }) { return <Pressable style={styles.comparable}><View style={styles.compImage}><Ionicons name="car-sport" size={21} color={COLORS.textTertiary} /></View><View style={COMMON.fill}><Text style={styles.compTitle}>{item.title}</Text><Text style={styles.compMeta}>{Number(item.mileage || 0).toLocaleString()} mi · {item.city} · {item.distance}</Text></View><View style={{ alignItems: 'flex-end' }}><Text style={styles.compPrice}>{formatMoney(item.price)}</Text><Ionicons name="open-outline" size={14} color={COLORS.textTertiary} /></View></Pressable>; }
function Reason({ label, value }) { return <View style={styles.reason}><Text style={styles.reasonLabel}>{label}</Text><Text style={styles.reasonValue}>{value}</Text></View>; }

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  priceTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  fairPrice: { color: COLORS.mint, fontSize: 36, fontWeight: '900', marginTop: 6 },
  fairMeta: { color: COLORS.textSecondary, fontSize: 10, lineHeight: 15, maxWidth: 230, marginTop: 2 },
  confBadge: { width: 75, height: 75, borderRadius: 20, borderWidth: 1, borderColor: alpha(COLORS.mint, 0.24), backgroundColor: alpha(COLORS.mint, 0.08), justifyContent: 'center', alignItems: 'center' },
  confValue: { color: COLORS.mint, fontSize: 17, fontWeight: '900', marginTop: 2 },
  confLabel: { color: COLORS.textTertiary, fontSize: 8, marginTop: 1 },
  statGrid: { flexDirection: 'row', gap: 8, marginTop: 11 },
  stat: { flex: 1, borderRadius: 15, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, padding: 12 },
  statLabel: { color: COLORS.textTertiary, fontSize: 9, fontWeight: '750' },
  statValue: { fontSize: 15, fontWeight: '900', marginTop: 7 },
  axis: { flexDirection: 'row', justifyContent: 'space-between', color: COLORS.textTertiary, marginTop: 2 },
  histogramLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  comparable: { minHeight: 77, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  compImage: { width: 59, height: 55, borderRadius: 14, backgroundColor: COLORS.surfaceElevated, justifyContent: 'center', alignItems: 'center' },
  compTitle: { color: COLORS.text, fontSize: 11, fontWeight: '850' },
  compMeta: { color: COLORS.textTertiary, fontSize: 9, marginTop: 4 },
  compPrice: { color: COLORS.text, fontSize: 13, fontWeight: '900', marginBottom: 5 },
  explainBody: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 17, marginTop: 8 },
  reasonList: { marginVertical: 12, gap: 7 },
  reason: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  reasonLabel: { color: COLORS.textSecondary, fontSize: 11 },
  reasonValue: { color: COLORS.text, fontSize: 11, fontWeight: '850' },
});
