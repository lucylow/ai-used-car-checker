import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { Badge, ChipRow, InputField, Screen, ScreenHeader, SectionHeader, SurfaceCard } from '../components/Primitives';
import { MetricPill, PressableTile } from '../components/Advanced';
import { MiniLineChart, PriceRangeBar } from '../components/Charts';

const listings = [
  { id: 'm1', name: '2020 Honda Accord Sport', mileage: '42,180', price: '$21,900', city: 'Toronto, ON', delta: '+$800', tone: 'amber' },
  { id: 'm2', name: '2020 Honda Accord Sport', mileage: '38,990', price: '$20,700', city: 'Mississauga, ON', delta: '-$400', tone: 'mint' },
  { id: 'm3', name: '2020 Honda Accord Sport', mileage: '47,221', price: '$22,400', city: 'Markham, ON', delta: '+$1,300', tone: 'coral' },
  { id: 'm4', name: '2020 Honda Accord Sport', mileage: '44,108', price: '$20,950', city: 'Oakville, ON', delta: '-$150', tone: 'mint' },
];

export default function MarketplaceScreen({ data, actions }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => listings.filter((item) => (!query || item.name.toLowerCase().includes(query.toLowerCase())) && (filter === 'all' || (filter === 'below' ? item.delta.startsWith('-') : !item.delta.startsWith('-')))), [filter, query]);
  return <Screen scroll contentStyle={styles.content}>
    <ScreenHeader title="Market Explorer" subtitle="Visualize the listings behind your price context." onBack={actions?.onBack} right={<Badge tone="mint" label="LIVE" />} />
    <SurfaceCard tone="blue"><Text style={TYPOGRAPHY.eyebrow}>VEHICLE</Text><Text style={styles.heroName}>{data.vehicle.name}</Text><Text style={styles.heroMeta}>{data.vehicle.year} · {data.vehicle.mileage} mi · current asking {data.vehicle.asking}</Text><PriceRangeBar low={19800} fair={21100} current={21900} high={23900} style={{ marginTop: 15 }} /></SurfaceCard>
    <View style={styles.miniRow}><MetricPill label="MEDIAN" value="$21.1k" tone="mint" /><MetricPill label="LISTINGS" value="48" tone="cyan" /><MetricPill label="TREND" value="+2.4%" tone="mint" /><MetricPill label="ASKING" value="+$800" tone="amber" /></View>
    <SectionHeader title="Search comparables" subtitle="Local market context" style={{ marginTop: 19 }} />
    <InputField value={query} onChangeText={setQuery} placeholder="Search comparable listings" leftIcon="search" />
    <ChipRow items={[{ value: 'all', label: 'All' }, { value: 'below', label: 'Below fair' }, { value: 'above', label: 'Above fair' }]} selected={filter} onSelect={setFilter} style={{ marginTop: 8 }} />
    <View style={styles.chartCard}><Text style={styles.chartTitle}>30-day pricing trend</Text><MiniLineChart points={[28, 30, 29, 31, 33, 32, 35, 34, 36, 38]} tone="cyan" /><View style={COMMON.row}><Text style={styles.chartLabel}>LOW</Text><Text style={[styles.chartValue, { color: COLORS.mint }]}>+2.4%</Text><Text style={styles.chartLabel}>vs. previous month</Text></View></View>
    <SectionHeader title="Comparable vehicles" subtitle={`${filtered.length} matching listings`} style={{ marginTop: 19 }} />
    {filtered.map((item) => <ListingCard key={item.id} item={item} onPress={() => actions?.onSelectListing?.(item)} />)}
    <SectionHeader title="Market actions" subtitle="Turn context into a decision" style={{ marginTop: 19 }} /><View style={styles.tools}><PressableTile title="Open negotiation" subtitle="Use evidence" icon="chatbubbles-outline" tone="blue" onPress={() => actions?.onNavigate?.('negotiation')} /><PressableTile title="Save market snapshot" subtitle="Keep this context" icon="bookmark-outline" tone="mint" onPress={() => actions?.onSaveMarket?.()} /></View>
  </Screen>;
}

function ListingCard({ item, onPress }) {
  const tone = item.tone === 'mint' ? COLORS.mint : item.tone === 'coral' ? COLORS.coral : COLORS.amber;
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.listing, pressed && { opacity: 0.78 }]}><View style={styles.listingImage}><Ionicons name="car-sport" size={28} color={COLORS.textSecondary} /></View><View style={COMMON.fill}><View style={COMMON.row}><Text style={styles.listingName}>{item.name}</Text><Text style={[styles.delta, { color: tone }]}>{item.delta}</Text></View><Text style={styles.listingMeta}>{item.mileage} mi · {item.city}</Text><View style={styles.listingBottom}><Text style={styles.listingPrice}>{item.price}</Text><View style={styles.provider}><Ionicons name="storefront-outline" size={10} color={COLORS.textTertiary} /><Text style={styles.providerText}>Comparable</Text></View></View></View><Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} /></Pressable>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  heroName: { color: COLORS.text, fontSize: 18, fontWeight: '900', marginTop: 3 },
  heroMeta: { color: COLORS.textSecondary, fontSize: 9, marginTop: 4 },
  miniRow: { flexDirection: 'row', marginTop: 11, flexWrap: 'wrap' },
  chartCard: { borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 14, marginTop: 11 },
  chartTitle: { color: COLORS.text, fontSize: 11, fontWeight: '850', marginBottom: 9 },
  chartLabel: { color: COLORS.textTertiary, fontSize: 8, fontWeight: '700', flex: 1 },
  chartValue: { fontSize: 10, fontWeight: '900' },
  listing: { minHeight: 84, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 8 },
  listingImage: { width: 62, height: 62, borderRadius: 15, backgroundColor: COLORS.surfaceSoft, alignItems: 'center', justifyContent: 'center' },
  listingName: { color: COLORS.text, fontSize: 10, fontWeight: '850', flex: 1 },
  listingMeta: { color: COLORS.textTertiary, fontSize: 8, marginTop: 4 },
  delta: { fontSize: 8, fontWeight: '900', marginLeft: 7 },
  listingBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  listingPrice: { color: COLORS.text, fontSize: 13, fontWeight: '900', flex: 1 },
  provider: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  providerText: { color: COLORS.textTertiary, fontSize: 7 },
  tools: { flexDirection: 'row', justifyContent: 'space-between' },
});
