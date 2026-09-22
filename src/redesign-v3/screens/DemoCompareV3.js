import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import SectionHeader from '../components/SectionHeader';
import Surface from '../components/Surface';
import Text from '../components/Text';
import Badge from '../components/Badge';
import { COLORS } from '../tokens';
import { ALL_DEMO_VEHICLES } from '../data/demoCatalog';
import { compareDemoVehicles } from '../services/demoAnalytics';

const money = (value) => `$${Math.round(value).toLocaleString()}`;

export default function DemoCompareV3({ onBack }) {
  const [selected, setSelected] = useState(ALL_DEMO_VEHICLES.slice(0, 2).map((vehicle) => vehicle.id));
  const comparison = useMemo(() => {
    const vehicles = selected.map((id) => ALL_DEMO_VEHICLES.find((item) => item.id === id)).filter(Boolean);
    return vehicles.length >= 2 ? compareDemoVehicles(vehicles) : null;
  }, [selected]);

  const toggle = (id) => setSelected((current) => current.includes(id)
    ? current.filter((item) => item !== id)
    : current.length < 3 ? [...current, id] : [current[1], id]);

  return <Screen>
    <ScreenHeader title="Compare vehicles" eyebrow="DECISION LAB" subtitle="Put two or three inspected vehicles side by side." onBack={onBack} />
    {comparison ? <>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {comparison.vehicles.map((vehicle) => <Surface key={vehicle.id} style={{ flex: 1 }}>
          <Text variant="caption" color={COLORS.cyan}>{vehicle.year} {vehicle.make}</Text>
          <Text variant="h3" numberOfLines={2} style={{ marginTop: 4 }}>{vehicle.model}</Text>
          <Text variant="display" style={{ fontSize: 23, marginTop: 10 }}>{money(vehicle.askingPrice)}</Text>
          {vehicle.id === comparison.overallWinner ? <Badge label="BEST OVERALL" tone="success" /> : null}
        </Surface>)}
      </View>
      <SectionHeader title="Decision matrix" />
      <Surface>
        {comparison.rows.map((row) => <View key={row.label} style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.line }}>
          <Text variant="caption" muted>{row.label}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 5 }}>
            {row.values.map((value, index) => <Text key={`${row.label}-${index}`} variant="bodyStrong" color={index === row.bestIndex ? COLORS.mint : COLORS.white} style={{ flex: 1 }}>
              {formatValue(value, row.format)}
            </Text>)}
          </View>
        </View>)}
        <Text color={COLORS.mint} style={{ marginTop: 14 }}>{comparison.summary}</Text>
      </Surface>
    </> : <Surface><Text>Choose at least two vehicles to compare.</Text></Surface>}
    <SectionHeader title="Choose vehicles" subtitle={`${selected.length} of 3 selected`} />
    {ALL_DEMO_VEHICLES.map((vehicle) => <Pressable key={vehicle.id} onPress={() => toggle(vehicle.id)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: COLORS.line }}>
      <View style={{ flex: 1 }}><Text variant="bodyStrong">{vehicle.year} {vehicle.make} {vehicle.model}</Text><Text variant="caption" muted>{vehicle.mileage.toLocaleString()} mi · {money(vehicle.askingPrice)}</Text></View>
      <Badge label={selected.includes(vehicle.id) ? 'SELECTED' : 'ADD'} tone={selected.includes(vehicle.id) ? 'success' : 'info'} />
    </Pressable>)}
  </Screen>;
}

function formatValue(value, format) {
  if (format === 'currency') return money(value);
  if (format === 'percent') return `${value > 0 ? '+' : ''}${value}%`;
  if (format === 'risk') return `${value}/100`;
  return typeof value === 'number' ? value.toLocaleString() : String(value);
}