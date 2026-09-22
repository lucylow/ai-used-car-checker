import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import SectionHeader from '../components/SectionHeader';
import Text from '../components/Text';
import Badge from '../components/Badge';
import { COLORS, RADIUS, SPACE } from '../tokens';
import { DEMO_CATEGORIES, ALL_DEMO_VEHICLES, getDemoStats, searchDemoVehicles } from '../data/demoCatalog';

const money = (value) => `$${Math.round(value).toLocaleString()}`;
const riskTone = (level) => level === 'high' || level === 'elevated' ? 'danger' : level === 'moderate' ? 'watch' : 'success';

function VehicleCard({ vehicle, onPress }) {
  const risk = vehicle.inspectionSummary;
  return <Pressable accessibilityRole="button" accessibilityLabel={`Load ${vehicle.year} ${vehicle.make} ${vehicle.model}`} onPress={onPress} style={({ pressed }) => [styles.vehicleCard, pressed && styles.pressed]}>
    <Image source={{ uri: vehicle.heroImage }} style={styles.vehicleImage} />
    <View style={styles.imageShade} />
    <View style={styles.cardTop}><Badge label={`${risk.riskScore} · ${risk.riskLevel.toUpperCase()}`} tone={riskTone(risk.riskLevel)} /><View style={styles.price}><Text style={styles.priceText}>{money(vehicle.askingPrice)}</Text></View></View>
    <View style={styles.cardBottom}><Text style={styles.vehicleTitle}>{vehicle.year} {vehicle.make} {vehicle.model}</Text><Text style={styles.vehicleTrim}>{vehicle.trim}</Text><View style={styles.meta}><Text style={styles.metaText}>{vehicle.mileage.toLocaleString()} mi</Text><Text style={styles.metaText}>{vehicle.category.replace('_', ' ')}</Text><Text style={styles.metaText}>{vehicle.inspectionSummary.demoFindings.length} findings</Text></View></View>
  </Pressable>;
}

export default function DemoGarageV3({ onBack, onNavigate, onSelectVehicle }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const stats = useMemo(() => getDemoStats(), []);
  const vehicles = useMemo(() => {
    const source = query ? searchDemoVehicles(query) : ALL_DEMO_VEHICLES;
    return category === 'all' ? source : source.filter((item) => item.category === category);
  }, [category, query]);
  return <Screen>
    <ScreenHeader title="Demo Garage" eyebrow="CARWISE CATALOG" subtitle="Explore complete inspection scenarios across the vehicle market." onBack={onBack} right={<Badge label={`${stats.total} VEHICLES`} tone="info" />} />
    <View style={styles.stats}><View><Text style={styles.statValue}>{stats.total}</Text><Text style={styles.statLabel}>vehicles</Text></View><View><Text style={styles.statValue}>{stats.makes}</Text><Text style={styles.statLabel}>makes</Text></View><View><Text style={styles.statValue}>{stats.categories}</Text><Text style={styles.statLabel}>categories</Text></View><View><Text style={styles.statValue}>{money(stats.avgPrice / 1000)}k</Text><Text style={styles.statLabel}>average</Text></View></View>
    <View style={styles.search}><Ionicons name="search-outline" size={19} color={COLORS.muted} /><TextInput value={query} onChangeText={setQuery} placeholder="Search make, model, year, or tag" placeholderTextColor={COLORS.muted} style={styles.searchInput} accessibilityLabel="Search demo vehicles" />{query ? <Pressable onPress={() => setQuery('')} accessibilityLabel="Clear search"><Ionicons name="close-circle" size={19} color={COLORS.muted} /></Pressable> : null}</View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}><Pressable onPress={() => setCategory('all')} style={[styles.chip, category === 'all' && styles.chipActive]}><Ionicons name="grid-outline" size={15} color={category === 'all' ? COLORS.cyan : COLORS.muted} /><Text style={[styles.chipText, category === 'all' && styles.chipTextActive]}>All</Text></Pressable>{DEMO_CATEGORIES.map((item) => <Pressable key={item.id} onPress={() => setCategory(item.id)} style={[styles.chip, category === item.id && styles.chipActive]}><Ionicons name={item.icon} size={15} color={category === item.id ? COLORS.cyan : COLORS.muted} /><Text style={[styles.chipText, category === item.id && styles.chipTextActive]}>{item.label}</Text></Pressable>)}</ScrollView>
    <View style={{ flexDirection: 'row', gap: 8, marginBottom: SPACE.sm }}><Pressable onPress={() => onNavigate?.('demoCompare')} style={styles.toolButton}><Ionicons name="git-compare-outline" size={15} color={COLORS.cyan} /><Text style={styles.toolButtonText}>Compare</Text></Pressable><Pressable onPress={() => onNavigate?.('demoAnalytics')} style={styles.toolButton}><Ionicons name="analytics-outline" size={15} color={COLORS.cyan} /><Text style={styles.toolButtonText}>Analytics</Text></Pressable></View>
    <SectionHeader title={`${vehicles.length} inspection scenarios`} subtitle="Select a vehicle to open its full demo journey." style={styles.section} />
    {vehicles.map((item) => <VehicleCard key={item.id} vehicle={item} onPress={() => onSelectVehicle?.(item)} />)}
    {!vehicles.length ? <View style={styles.empty}><Ionicons name="car-outline" size={38} color={COLORS.muted} /><Text variant="section" style={styles.emptyTitle}>No vehicles match</Text><Text muted>Try another search or category.</Text></View> : null}
  </Screen>;
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACE.md, paddingHorizontal: SPACE.sm, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.line },
  statValue: { color: COLORS.cyan, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  statLabel: { color: COLORS.muted, fontSize: 10, textAlign: 'center', marginTop: 2 },
  search: { height: 50, marginTop: SPACE.md, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface, paddingHorizontal: SPACE.sm, flexDirection: 'row', alignItems: 'center', gap: 8 },
  searchInput: { flex: 1, color: COLORS.white, fontSize: 14 },
  categoryRow: { gap: 8, paddingVertical: SPACE.md },
  chip: { minHeight: 36, paddingHorizontal: 11, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface, flexDirection: 'row', alignItems: 'center', gap: 5 },
  chipActive: { borderColor: COLORS.cyan, backgroundColor: 'rgba(0,212,255,.08)' },
  chipText: { color: COLORS.muted, fontSize: 11, fontWeight: '700' },
  chipTextActive: { color: COLORS.cyan },
  toolButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 9, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.cyan, backgroundColor: 'rgba(0,212,255,.08)' },
  toolButtonText: { color: COLORS.cyan, fontSize: 12, fontWeight: '800' },
  section: { marginTop: 2, marginBottom: SPACE.sm },
  vehicleCard: { height: 218, borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACE.md, backgroundColor: COLORS.surface, position: 'relative' },
  pressed: { opacity: 0.86 },
  vehicleImage: { width: '100%', height: '100%' },
  imageShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(7,17,31,.24)' },
  cardTop: { position: 'absolute', left: SPACE.sm, right: SPACE.sm, top: SPACE.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { backgroundColor: 'rgba(7,17,31,.82)', borderRadius: RADIUS.pill, paddingHorizontal: 11, paddingVertical: 6 },
  priceText: { color: COLORS.white, fontWeight: '800', fontSize: 13 },
  cardBottom: { position: 'absolute', left: SPACE.sm, right: SPACE.sm, bottom: SPACE.sm, backgroundColor: 'rgba(7,17,31,.88)', borderRadius: RADIUS.md, padding: SPACE.sm },
  vehicleTitle: { color: COLORS.white, fontSize: 17, fontWeight: '800' },
  vehicleTrim: { color: COLORS.cloud, opacity: 0.72, fontSize: 11, marginTop: 3 },
  meta: { flexDirection: 'row', gap: 14, marginTop: 9 },
  metaText: { color: COLORS.cloud, opacity: 0.82, fontSize: 10, textTransform: 'capitalize' },
  empty: { alignItems: 'center', paddingVertical: 50, gap: 8 },
  emptyTitle: { marginTop: 6 },
});
