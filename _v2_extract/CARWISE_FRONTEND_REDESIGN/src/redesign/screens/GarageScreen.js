import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { Badge, InputField, MetricCard, PrimaryButton, Screen, ScreenHeader, SectionHeader, SecondaryButton, SurfaceCard } from '../components/Primitives';
import { EvidenceTimeline, GlassStat, PressableTile, TagCloud } from '../components/Advanced';
import { ScoreRing, SparkBars } from '../components/Charts';

export default function GarageScreen({ data, actions }) {
  const [view, setView] = useState('vehicles');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(data.vehicle.id || 'vehicle-1');
  const vehicles = useMemo(() => {
    const source = data.history?.length ? data.history : [
      { id: 'vehicle-1', name: data.vehicle.name, year: data.vehicle.year, mileage: data.vehicle.mileage, asking: data.vehicle.asking, risk: data.risk.score },
      { id: 'vehicle-2', name: '2021 Toyota RAV4 XLE', year: '2021', mileage: '38,442', asking: '$27,900', risk: 42 },
      { id: 'vehicle-3', name: '2019 BMW 330i', year: '2019', mileage: '61,820', asking: '$24,600', risk: 71 },
    ];
    return source.filter((item) => !query || item.name.toLowerCase().includes(query.toLowerCase()));
  }, [data.history, data.risk.score, data.vehicle.asking, data.vehicle.id, data.vehicle.mileage, data.vehicle.name, data.vehicle.year, query]);
  const active = vehicles.find((item) => item.id === selected) || vehicles[0];
  return <Screen scroll contentStyle={styles.content}>
    <ScreenHeader title="My Garage" subtitle="Every inspection, vehicle, and evidence trail in one place." onBack={actions?.onBack} right={<Badge tone="cyan" label={`${vehicles.length} CARS`} />} />
    <View style={styles.topSwitch}><Pressable onPress={() => setView('vehicles')} style={[styles.switchItem, view === 'vehicles' && styles.switchActive]}><Ionicons name="car-sport-outline" size={16} color={view === 'vehicles' ? COLORS.bg : COLORS.textSecondary} /><Text style={[styles.switchText, view === 'vehicles' && styles.switchActiveText]}>Vehicles</Text></Pressable><Pressable onPress={() => setView('activity')} style={[styles.switchItem, view === 'activity' && styles.switchActive]}><Ionicons name="pulse-outline" size={16} color={view === 'activity' ? COLORS.bg : COLORS.textSecondary} /><Text style={[styles.switchText, view === 'activity' && styles.switchActiveText]}>Activity</Text></Pressable></View>
    {view === 'vehicles' ? <><InputField value={query} onChangeText={setQuery} placeholder="Search make, model, VIN..." leftIcon="search" /><View style={styles.vehicleList}>{vehicles.map((item) => <VehicleGarageCard key={item.id} vehicle={item} selected={item.id === active?.id} onPress={() => setSelected(item.id)} onOpen={() => actions?.onOpenInspection?.(item)} />)}</View>
      {active ? <><SectionHeader title="Selected vehicle" subtitle="At a glance" style={{ marginTop: 19 }} /><SurfaceCard tone="blue"><View style={COMMON.row}><View style={styles.vehicleThumb}><Ionicons name="car-sport" size={34} color={COLORS.text} /></View><View style={COMMON.fill}><Text style={styles.activeName}>{active.name}</Text><Text style={styles.activeMeta}>{active.year} · {active.mileage} mi · {active.asking}</Text></View><ScoreRing score={active.risk || 0} size={72} /></View><View style={styles.miniStats}><GlassStat label="Market" value="$21.1k" hint="fair value" icon="trending-up-outline" tone="mint" /><GlassStat label="Repairs" value="$1.7k" hint="estimate" icon="build-outline" tone="amber" /></View><PrimaryButton label="Continue inspection" icon="arrow-forward" onPress={() => actions?.onOpenInspection?.(active)} style={{ marginTop: 12 }} /></SurfaceCard></> : null}
      <SectionHeader title="Garage tools" subtitle="Fast actions" style={{ marginTop: 20 }} /><View style={styles.tiles}><PressableTile title="Scan another VIN" subtitle="New vehicle" icon="barcode-outline" tone="cyan" onPress={actions?.onOpenVin} /><PressableTile title="Compare vehicles" subtitle="Side-by-side" icon="git-compare-outline" tone="mint" onPress={actions?.onCompare} /><PressableTile title="Import document" subtitle="Service history" icon="document-attach-outline" tone="amber" onPress={actions?.onPickDocument} /><PressableTile title="Share report" subtitle="Buyer-ready" icon="share-outline" tone="blue" onPress={actions?.onShareReport} /></View>
    </> : <ActivityView />}
  </Screen>;
}

function VehicleGarageCard({ vehicle, selected, onPress, onOpen }) {
  const risk = Number(vehicle.risk || 0);
  const tone = risk >= 70 ? COLORS.coral : risk >= 45 ? COLORS.amber : COLORS.mint;
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.vehicleCard, selected && { borderColor: alpha(COLORS.cyan, 0.45), backgroundColor: alpha(COLORS.cyan, 0.045) }, pressed && { opacity: 0.78 }]}><View style={styles.cardImage}><Ionicons name="car-sport" size={29} color={COLORS.textSecondary} /></View><View style={COMMON.fill}><Text style={styles.vehicleName} numberOfLines={1}>{vehicle.name}</Text><Text style={styles.vehicleMeta}>{vehicle.year} · {vehicle.mileage} mi</Text><View style={styles.vehicleBottom}><Text style={styles.vehiclePrice}>{vehicle.asking || '$21,900'}</Text><View style={[styles.riskBadge, { backgroundColor: alpha(tone, 0.11) }]}><Text style={[styles.riskText, { color: tone }]}>{risk} RISK</Text></View></View></View><Pressable onPress={onOpen} style={styles.openButton}><Ionicons name="arrow-forward" size={15} color={COLORS.cyan} /></Pressable></Pressable>;
}

function ActivityView() {
  const events = [
    { id: 'a1', time: '11:02', type: 'REPORT', title: 'Inspection report exported', description: 'Vehicle report is ready to share.', color: COLORS.mint },
    { id: 'a2', time: '10:47', type: 'PHOTO', title: 'Front bumper evidence captured', description: 'Two visible findings linked.', color: COLORS.cyan },
    { id: 'a3', time: '10:41', type: 'AI', title: 'Condition analysis completed', description: '7 findings ready for review.', color: COLORS.cyan },
    { id: 'a4', time: '10:35', type: 'VIN', title: 'VIN matched', description: 'Vehicle identity added to garage.', color: COLORS.mint },
  ];
  return <><SectionHeader title="Garage activity" subtitle="Latest events" style={{ marginTop: 15 }} /><SurfaceCard><EvidenceTimeline events={events} /></SurfaceCard><SectionHeader title="Coverage" subtitle="Evidence by category" style={{ marginTop: 20 }} /><SurfaceCard><SparkBars values={[72, 88, 61, 94, 48, 80, 71]} tone="cyan" /><View style={styles.activityLegend}><TagCloud tags={['Exterior', 'Interior', 'Engine', 'Drive', 'Docs']} tone="cyan" /></View></SurfaceCard><MetricCard label="Last action" value="11:02" note="Report exported" icon="time-outline" tone="mint" style={{ marginTop: 11 }} /></>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  topSwitch: { flexDirection: 'row', padding: 4, borderRadius: 15, backgroundColor: COLORS.surfaceSoft, marginBottom: 11 },
  switchItem: { flex: 1, minHeight: 39, borderRadius: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  switchActive: { backgroundColor: COLORS.cyan },
  switchText: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '800' },
  switchActiveText: { color: COLORS.bg },
  vehicleList: { gap: 8, marginTop: 11 },
  vehicleCard: { minHeight: 90, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 9 },
  cardImage: { width: 65, height: 65, borderRadius: 15, backgroundColor: COLORS.surfaceSoft, alignItems: 'center', justifyContent: 'center' },
  vehicleName: { color: COLORS.text, fontSize: 12, fontWeight: '850' },
  vehicleMeta: { color: COLORS.textTertiary, fontSize: 8, marginTop: 3 },
  vehicleBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 9 },
  vehiclePrice: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '850', flex: 1 },
  riskBadge: { borderRadius: 99, paddingHorizontal: 6, paddingVertical: 4 },
  riskText: { fontSize: 7, fontWeight: '900' },
  openButton: { width: 33, height: 33, borderRadius: 11, backgroundColor: alpha(COLORS.cyan, 0.08), alignItems: 'center', justifyContent: 'center' },
  activeName: { color: COLORS.text, fontSize: 15, fontWeight: '900' },
  activeMeta: { color: COLORS.textSecondary, fontSize: 9, marginTop: 3 },
  miniStats: { flexDirection: 'row', marginTop: 14 },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  activityLegend: { marginTop: 12 },
});
