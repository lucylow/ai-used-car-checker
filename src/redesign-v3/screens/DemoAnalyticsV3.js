import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface';
import Text from '../components/Text';
import StatCard from '../components/StatCard';
import { COLORS } from '../tokens';
import { ALL_DEMO_VEHICLES, getDemoStats } from '../data/demoCatalog';
import { getFinancingEstimate, getFuelProjection } from '../services/demoAnalytics';

export default function DemoAnalyticsV3({ onBack }) {
  const [metric, setMetric] = useState('risk');
  const stats = useMemo(() => getDemoStats(), []);
  const riskCounts = useMemo(() => ALL_DEMO_VEHICLES.reduce((result, vehicle) => {
    const level = vehicle.inspectionSummary.riskLevel;
    result[level] = (result[level] || 0) + 1;
    return result;
  }, {}), []);
  const featured = ALL_DEMO_VEHICLES[0];
  const financing = getFinancingEstimate(featured);
  const fuel = getFuelProjection(featured);

  return <Screen>
    <ScreenHeader title="Market analytics" eyebrow="DEMO INTELLIGENCE" subtitle="A compact view of risk, pricing, and ownership cost signals." onBack={onBack} />
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      <StatCard label="Vehicles" value={String(stats.total)} icon="car" tone={COLORS.cyan} />
      <StatCard label="Average price" value={`$${Math.round(stats.avgPrice).toLocaleString()}`} icon="cash" tone={COLORS.mint} />
      <StatCard label="Makes" value={String(stats.makes)} icon="pricetag" tone={COLORS.amber} />
      <StatCard label="Categories" value={String(stats.categories)} icon="grid" tone={COLORS.cyan} />
    </View>
    <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
      {[['risk', 'Risk mix'], ['cost', 'Ownership cost']].map(([id, label]) => <Pressable key={id} onPress={() => setMetric(id)} style={{ paddingVertical: 9, paddingHorizontal: 12, borderWidth: 1, borderColor: metric === id ? COLORS.cyan : COLORS.line, borderRadius: 999 }}><Text variant="caption" color={metric === id ? COLORS.cyan : COLORS.muted}>{label}</Text></Pressable>)}
    </View>
    {metric === 'risk' ? <Surface style={{ marginTop: 14 }}>
      <SectionHeader title="Risk distribution" />
      {['low', 'moderate', 'elevated', 'high'].map((level) => <View key={level} style={{ marginBottom: 12 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text variant="caption">{level.toUpperCase()}</Text><Text variant="caption" muted>{riskCounts[level] || 0}</Text></View><View style={{ height: 8, backgroundColor: COLORS.line, borderRadius: 4, marginTop: 5 }}><View style={{ height: '100%', width: `${((riskCounts[level] || 0) / stats.total) * 100}%`, backgroundColor: level === 'low' ? COLORS.mint : level === 'high' ? COLORS.coral : COLORS.amber, borderRadius: 4 }} /></View></View>)}
    </Surface> : <Surface style={{ marginTop: 14 }}>
      <SectionHeader title={`${featured.year} ${featured.make} ${featured.model}`} subtitle="Illustrative ownership estimate" />
      <View style={{ flexDirection: 'row', gap: 8 }}><StatCard label="60-mo payment" value={`$${financing.monthlyPayment}/mo`} icon="card" tone={COLORS.cyan} /><StatCard label="Annual fuel" value={`$${fuel.annualFuelCost.toLocaleString()}`} icon="speedometer" tone={COLORS.mint} /></View>
      <Text variant="caption" muted style={{ marginTop: 12 }}>Estimated financing uses a 10% down payment and good credit. Fuel projection assumes 12,000 miles.</Text>
    </Surface>}
    <SectionHeader title="Category coverage" />
    <Surface>{[...new Set(ALL_DEMO_VEHICLES.map((vehicle) => vehicle.category))].map((category) => { const count = ALL_DEMO_VEHICLES.filter((vehicle) => vehicle.category === category).length; return <View key={category} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 7, gap: 10 }}><Text variant="caption" style={{ width: 90, textTransform: 'capitalize' }}>{category.replace('_', ' ')}</Text><View style={{ flex: 1, height: 7, backgroundColor: COLORS.line, borderRadius: 4 }}><View style={{ height: '100%', width: `${(count / stats.total) * 100}%`, backgroundColor: COLORS.cyan, borderRadius: 4 }} /></View><Text variant="caption" muted>{count}</Text></View>; })}</Surface>
  </Screen>;
}