import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha, toneColor } from '../theme';
import { Badge, ChipRow, SearchInput, Screen, ScreenHeader, SecondaryButton, SurfaceCard } from '../components/Primitives';
import { MiniLineChart } from '../components/Charts';
import { DEMO_HISTORY } from '../data';

export default function HistoryScreen({ data, actions }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const source = data.savedInspections?.length ? data.savedInspections : DEMO_HISTORY;
  const filtered = useMemo(() => source.filter((item) => {
    const label = `${item.vehicle?.year || ''} ${item.vehicle?.make || ''} ${item.vehicle?.model || ''}`.toLowerCase();
    const matchesQuery = label.includes(query.toLowerCase());
    const risk = Number(item.risk ?? 0);
    const matchesFilter = filter === 'all' || (filter === 'low' && risk < 30) || (filter === 'watch' && risk >= 30 && risk < 55) || (filter === 'high' && risk >= 55);
    return matchesQuery && matchesFilter;
  }), [source, query, filter]);
  return <Screen contentStyle={styles.content}>
    <ScreenHeader title="Inspection History" subtitle="Every saved inspection becomes a reusable evidence record." onBack={actions?.onBack} right={<Badge tone="cyan" label={`${filtered.length} RECORDS`} />} />
    <SearchInput value={query} onChangeText={setQuery} placeholder="Search vehicle" />
    <View style={{ marginTop: 11 }}><ChipRow items={[{ value: 'all', label: 'All' }, { value: 'low', label: 'Low risk' }, { value: 'watch', label: 'Watch' }, { value: 'high', label: 'High risk' }]} selected={filter} onSelect={setFilter} /></View>
    <View style={styles.stats}><Stat label="Saved" value={source.length} /><Stat label="Low risk" value={source.filter((item) => Number(item.risk || 0) < 30).length} tone="mint" /><Stat label="Needs review" value={source.filter((item) => Number(item.risk || 0) >= 30).length} tone="amber" /></View>
    {filtered.length ? filtered.map((item) => <HistoryCard key={item.id} item={item} onOpen={() => actions?.onOpenSaved(item)} onCompare={() => actions?.onCompare(item)} />) : <SurfaceCard style={styles.empty}><View style={styles.emptyIcon}><Ionicons name="car-outline" size={28} color={COLORS.cyan} /></View><Text style={TYPOGRAPHY.h3}>{query ? 'No matching vehicles' : 'Your history is empty'}</Text><Text style={styles.emptyBody}>{query ? 'Try a broader search or clear the query.' : 'Finish your first inspection and it will appear here.'}</Text><SecondaryButton label="Start an inspection" icon="add" onPress={actions?.onStartInspection} /></SurfaceCard>}
  </Screen>;
}

function HistoryCard({ item, onOpen, onCompare }) {
  const risk = Number(item.risk ?? 0);
  const tone = risk >= 55 ? 'coral' : risk >= 30 ? 'amber' : 'mint';
  return <Pressable onPress={onOpen} style={styles.card}><View style={styles.cardHero}><View style={styles.carIcon}><Ionicons name="car-sport" size={27} color={COLORS.cyan} /></View><View style={COMMON.fill}><Text style={TYPOGRAPHY.eyebrow}>SAVED INSPECTION</Text><Text style={styles.title}>{item.vehicle?.year} {item.vehicle?.make} {item.vehicle?.model}</Text><Text style={styles.meta}>{item.date || 'Saved locally'} · {item.progress ?? 100}% complete</Text></View><Badge tone={tone} label={risk >= 55 ? 'HIGH' : risk >= 30 ? 'WATCH' : 'LOW'} /></View><View style={styles.cardStats}><Stat label="Fair price" value={`$${Number(item.fairPrice || 0).toLocaleString()}`} tone="mint" /><Stat label="Repairs" value={`$${Number(item.repairs || 0).toLocaleString()}`} tone="amber" /><Stat label="Risk" value={`${risk}`} tone={tone} /></View><MiniLineChart points={[20 + risk / 5, 27, 25, 40, 36, 48, 44, Math.max(34, 70 - risk / 2)]} tone={tone} height={56} /><View style={styles.actionRow}><SecondaryButton label="Open report" icon="document-text-outline" onPress={onOpen} style={{ flex: 1 }} /><SecondaryButton label="Compare" icon="git-compare-outline" onPress={onCompare} style={{ flex: 1 }} /></View></Pressable>;
}

function Stat({ label, value, tone = 'blue' }) { return <View style={styles.stat}><Text style={styles.statLabel}>{label}</Text><Text style={[styles.statValue, { color: toneColor(tone) }]}>{value}</Text></View>; }

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  stats: { flexDirection: 'row', gap: 7, marginTop: 12 },
  stat: { flex: 1, borderRadius: 13, backgroundColor: COLORS.surfaceElevated, padding: 10 },
  statLabel: { color: COLORS.textTertiary, fontSize: 9, fontWeight: '750' },
  statValue: { color: COLORS.text, fontSize: 17, fontWeight: '900', marginTop: 4 },
  card: { marginTop: 10, padding: 13, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  cardHero: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  carIcon: { width: 49, height: 49, borderRadius: 16, backgroundColor: alpha(COLORS.cyan, 0.08), alignItems: 'center', justifyContent: 'center' },
  title: { color: COLORS.text, fontSize: 14, fontWeight: '850', marginTop: 4 },
  meta: { color: COLORS.textTertiary, fontSize: 9, marginTop: 3 },
  cardStats: { flexDirection: 'row', gap: 7, marginTop: 12 },
  actionRow: { flexDirection: 'row', gap: 7, marginTop: 10 },
  empty: { marginTop: 24, alignItems: 'center', paddingVertical: 31 },
  emptyIcon: { width: 58, height: 58, borderRadius: 20, backgroundColor: alpha(COLORS.cyan, 0.09), alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  emptyBody: { color: COLORS.textTertiary, fontSize: 11, lineHeight: 16, textAlign: 'center', maxWidth: 285, marginTop: 4, marginBottom: 10 },
});
