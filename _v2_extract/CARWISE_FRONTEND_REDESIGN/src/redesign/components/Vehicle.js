import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, RADIUS, SPACE, TYPOGRAPHY, alpha, toneColor } from '../theme';
import { Badge, Divider, SurfaceCard } from './Primitives';

const PARTS = [
  { id: 'roof', label: 'Roof', icon: 'remove-outline', x: 35, y: 12, w: 30, h: 16, severity: 'mint' },
  { id: 'hood', label: 'Hood', icon: 'remove-outline', x: 37, y: 30, w: 26, h: 12, severity: 'amber' },
  { id: 'front', label: 'Front bumper', icon: 'scan-outline', x: 39, y: 43, w: 22, h: 9, severity: 'amber' },
  { id: 'rear', label: 'Rear bumper', icon: 'scan-outline', x: 39, y: 0, w: 22, h: 8, severity: 'mint' },
  { id: 'left-wheel', label: 'Front left tire', icon: 'ellipse-outline', x: 20, y: 37, w: 12, h: 15, severity: 'amber' },
  { id: 'right-wheel', label: 'Front right tire', icon: 'ellipse-outline', x: 68, y: 37, w: 12, h: 15, severity: 'mint' },
  { id: 'left-rear', label: 'Rear left tire', icon: 'ellipse-outline', x: 20, y: 9, w: 12, h: 15, severity: 'mint' },
  { id: 'right-rear', label: 'Rear right tire', icon: 'ellipse-outline', x: 68, y: 9, w: 12, h: 15, severity: 'mint' },
];

export function VehicleHealthMap({ selectedId, onSelect, compact = false }) {
  const selected = PARTS.find((part) => part.id === selectedId) || PARTS[0];
  return <View style={[styles.mapWrap, compact && styles.mapCompact]}>
    <View style={styles.vehicleBody}>
      <View style={styles.vehicleGlass} />
      <View style={styles.vehicleCabinFront} />
      <View style={styles.vehicleCabinRear} />
      <View style={styles.vehicleHoodLine} />
      <View style={styles.vehicleTrunkLine} />
      {PARTS.map((part) => {
        const active = selected.id === part.id;
        const color = toneColor(part.severity);
        return <Pressable key={part.id} accessibilityRole="button" accessibilityLabel={`Inspect ${part.label}`} onPress={() => onSelect?.(part.id)} style={[styles.partHotspot, { left: `${part.x}%`, top: `${part.y}%`, width: `${part.w}%`, height: `${part.h}%` }, active && { borderColor: color, backgroundColor: alpha(color, 0.16), shadowColor: color }]}>
          {active ? <View style={[styles.hotspotDot, { backgroundColor: color }]} /> : null}
        </Pressable>;
      })}
      <View style={[styles.vehicleWheel, styles.vehicleWheelLeftTop]} />
      <View style={[styles.vehicleWheel, styles.vehicleWheelRightTop]} />
      <View style={[styles.vehicleWheel, styles.vehicleWheelLeftBottom]} />
      <View style={[styles.vehicleWheel, styles.vehicleWheelRightBottom]} />
    </View>
    <View style={styles.selectedZone}><View style={COMMON.fill}><Text style={TYPOGRAPHY.eyebrow}>SELECTED AREA</Text><Text style={styles.zoneTitle}>{selected.label}</Text><Text style={styles.zoneMeta}>{selected.severity === 'mint' ? 'Looks good' : 'Review recommended'}</Text></View><Badge tone={selected.severity} label={selected.severity === 'mint' ? 'PASS' : 'WATCH'} /></View>
  </View>;
}

export function VehicleHero({ vehicle, progress, riskLabel: riskText, riskScore, imageUri, onResume }) {
  return <SurfaceCard style={styles.heroCard} tone="blue">
    <View style={styles.heroImage}>
      <View style={styles.heroSky} />
      <View style={styles.heroRoad} />
      <View style={styles.heroCar}>
        <View style={styles.heroCabin} /><View style={styles.heroGlass} /><View style={styles.heroLightLeft} /><View style={styles.heroLightRight} /><View style={styles.heroWheelOne} /><View style={styles.heroWheelTwo} />
      </View>
      <View style={styles.heroImageBadge}><Badge tone="cyan" label="AI INSPECTION" icon="sparkles" /></View>
    </View>
    <View style={styles.heroBody}>
      <View style={COMMON.rowBetween}><View style={COMMON.fill}><Text style={TYPOGRAPHY.eyebrow}>ACTIVE VEHICLE</Text><Text style={TYPOGRAPHY.h2}>{vehicle?.year || '2020'} {vehicle?.make || 'Honda'} {vehicle?.model || 'Accord Sport'}</Text><Text style={TYPOGRAPHY.caption}>{vehicle?.mileage || '42,180'} mi · {vehicle?.location || 'Toronto, ON'}</Text></View><Badge tone={riskScore >= 55 ? 'coral' : riskScore >= 30 ? 'amber' : 'mint'} label={riskText || 'Moderate risk'} /></View>
      <Divider spacing={14} />
      <View style={COMMON.rowBetween}><View style={COMMON.fill}><Text style={styles.progressCaption}>{progress}% inspection complete</Text><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View></View><View style={styles.heroScore}><Text style={styles.heroScoreValue}>{riskScore}</Text><Text style={styles.heroScoreLabel}>RISK</Text></View></View>
      {onResume ? <Pressable accessibilityRole="button" onPress={onResume} style={styles.resume}><Text style={styles.resumeText}>Continue inspection</Text><Ionicons name="arrow-forward" size={17} color={COLORS.white} /></Pressable> : null}
    </View>
  </SurfaceCard>;
}

export function VehicleInfoStrip({ vehicle }) {
  const stats = [
    ['calendar-outline', 'YEAR', vehicle?.year || '2020'],
    ['speedometer-outline', 'MILEAGE', `${vehicle?.mileage || '42,180'}`],
    ['cash-outline', 'ASKING', `$${Number(vehicle?.asking || 21900).toLocaleString()}`],
  ];
  return <View style={styles.infoStrip}>{stats.map(([icon, label, value]) => <View key={label} style={styles.infoCell}><Ionicons name={icon} size={15} color={COLORS.cyan} /><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>)}</View>;
}

export function PartDetailCard({ partId = 'front' }) {
  const part = PARTS.find((item) => item.id === partId) || PARTS[2];
  const issue = part.severity !== 'mint';
  return <SurfaceCard tone={issue ? 'amber' : 'mint'}>
    <View style={COMMON.rowBetween}><View style={styles.partIcon}><Ionicons name={part.icon} size={20} color={toneColor(part.severity)} /></View><View style={COMMON.fill}><Text style={TYPOGRAPHY.eyebrow}>VEHICLE ZONE</Text><Text style={styles.partTitle}>{part.label}</Text></View><Badge tone={part.severity} label={issue ? 'WATCH' : 'PASS'} /></View>
    <Text style={styles.partBody}>{issue ? 'Evidence suggests a visible condition item here. Confirm with a closer inspection and record supporting media before making a decision.' : 'No obvious issue is represented for this demo area. Keep the zone marked complete and continue to the next check.'}</Text>
    {issue ? <View style={styles.partCost}><Text style={styles.costCaption}>Possible repair impact</Text><Text style={styles.costValue}>$150–$750</Text></View> : null}
  </SurfaceCard>;
}

export function ZonePicker({ onSelect }) {
  const [value, setValue] = useState('front');
  return <View><View style={styles.zoneGrid}>{PARTS.map((part) => <Pressable key={part.id} onPress={() => { setValue(part.id); onSelect?.(part.id); }} style={[styles.zoneButton, value === part.id && styles.zoneButtonSelected]}><Ionicons name={part.icon} size={15} color={value === part.id ? COLORS.white : COLORS.textSecondary} /><Text style={[styles.zoneButtonText, value === part.id && { color: COLORS.white }]}>{part.label}</Text></Pressable>)}</View></View>;
}

const styles = StyleSheet.create({
  mapWrap: { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderWidth: 1, borderRadius: 22, padding: 15, overflow: 'hidden' },
  mapCompact: { padding: 10 },
  vehicleBody: { height: 320, width: '58%', alignSelf: 'center', borderRadius: 70, backgroundColor: '#0C1B2E', borderWidth: 2, borderColor: alpha(COLORS.cyan, 0.26), position: 'relative', marginVertical: 18, shadowColor: COLORS.cyan, shadowOpacity: 0.08, shadowRadius: 28, shadowOffset: { width: 0, height: 0 }, elevation: 4 },
  vehicleGlass: { position: 'absolute', width: '50%', height: '34%', top: '23%', left: '25%', borderRadius: 20, borderWidth: 1, borderColor: alpha(COLORS.cyan, 0.35), backgroundColor: alpha(COLORS.cyan, 0.07) },
  vehicleCabinFront: { position: 'absolute', width: '42%', height: '16%', top: '19%', left: '29%', borderWidth: 1, borderColor: alpha(COLORS.text, 0.12), borderBottomColor: 'transparent', borderRadius: 25 },
  vehicleCabinRear: { position: 'absolute', width: '42%', height: '12%', top: '52%', left: '29%', borderWidth: 1, borderColor: alpha(COLORS.text, 0.1), borderTopColor: 'transparent', borderRadius: 20 },
  vehicleHoodLine: { position: 'absolute', left: '15%', right: '15%', top: '67%', height: 2, backgroundColor: alpha(COLORS.text, 0.1), borderRadius: 2 },
  vehicleTrunkLine: { position: 'absolute', left: '15%', right: '15%', top: '13%', height: 2, backgroundColor: alpha(COLORS.text, 0.1), borderRadius: 2 },
  partHotspot: { position: 'absolute', borderWidth: 1, borderColor: 'transparent', borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  hotspotDot: { width: 7, height: 7, borderRadius: 4, shadowOpacity: 0.7, shadowRadius: 7, shadowOffset: { width: 0, height: 0 } },
  vehicleWheel: { position: 'absolute', width: 44, height: 64, borderRadius: 22, backgroundColor: '#050A12', borderWidth: 3, borderColor: COLORS.borderStrong },
  vehicleWheelLeftTop: { left: -8, top: 40 },
  vehicleWheelRightTop: { right: -8, top: 40 },
  vehicleWheelLeftBottom: { left: -8, bottom: 40 },
  vehicleWheelRightBottom: { right: -8, bottom: 40 },
  selectedZone: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingTop: 4 },
  zoneTitle: { color: COLORS.text, fontSize: 15, fontWeight: '800', marginTop: 3 },
  zoneMeta: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
  heroCard: { padding: 0, overflow: 'hidden' },
  heroImage: { height: 210, backgroundColor: '#06101C', position: 'relative', overflow: 'hidden' },
  heroSky: { position: 'absolute', left: -50, right: -50, top: -50, height: 180, borderRadius: 130, backgroundColor: alpha(COLORS.blue, 0.14) },
  heroRoad: { position: 'absolute', left: -30, right: -30, bottom: -75, height: 170, borderRadius: 110, backgroundColor: alpha(COLORS.cyan, 0.06) },
  heroCar: { position: 'absolute', width: '63%', height: '48%', left: '18.5%', bottom: 44, borderRadius: 44, backgroundColor: '#0E2238', borderWidth: 2, borderColor: alpha(COLORS.cyan, 0.42), shadowColor: COLORS.cyan, shadowOpacity: 0.1, shadowRadius: 24, shadowOffset: { width: 0, height: 0 } },
  heroCabin: { position: 'absolute', width: '50%', height: '56%', top: '-26%', left: '25%', borderRadius: 22, borderWidth: 2, borderColor: alpha(COLORS.cyan, 0.34), backgroundColor: alpha(COLORS.cyan, 0.06) },
  heroGlass: { position: 'absolute', width: '39%', height: '24%', top: '-11%', left: '30.5%', borderRadius: 8, backgroundColor: alpha(COLORS.blue, 0.22) },
  heroLightLeft: { position: 'absolute', width: 24, height: 10, left: 14, top: '42%', borderRadius: 6, backgroundColor: COLORS.cyan, opacity: 0.7 },
  heroLightRight: { position: 'absolute', width: 24, height: 10, right: 14, top: '42%', borderRadius: 6, backgroundColor: COLORS.cyan, opacity: 0.7 },
  heroWheelOne: { position: 'absolute', width: 36, height: 50, left: 8, bottom: -19, borderRadius: 19, backgroundColor: '#050B12', borderWidth: 3, borderColor: COLORS.borderStrong },
  heroWheelTwo: { position: 'absolute', width: 36, height: 50, right: 8, bottom: -19, borderRadius: 19, backgroundColor: '#050B12', borderWidth: 3, borderColor: COLORS.borderStrong },
  heroImageBadge: { position: 'absolute', left: 14, top: 14 },
  heroBody: { padding: 16 },
  progressCaption: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '700' },
  progressTrack: { height: 7, backgroundColor: COLORS.surfaceSoft, borderRadius: 99, overflow: 'hidden', marginTop: 7 },
  progressFill: { height: 7, borderRadius: 99, backgroundColor: COLORS.cyan },
  heroScore: { width: 61, height: 61, borderRadius: 31, borderWidth: 1, borderColor: alpha(COLORS.amber, 0.32), backgroundColor: alpha(COLORS.amber, 0.08), justifyContent: 'center', alignItems: 'center', marginLeft: 13 },
  heroScoreValue: { color: COLORS.amber, fontSize: 22, fontWeight: '900' },
  heroScoreLabel: { color: COLORS.textTertiary, fontSize: 8, fontWeight: '850', letterSpacing: 1 },
  resume: { marginTop: 15, minHeight: 48, borderRadius: 14, backgroundColor: COLORS.blue, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14 },
  resumeText: { color: COLORS.white, fontSize: 14, fontWeight: '850' },
  infoStrip: { flexDirection: 'row', borderRadius: 17, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, paddingVertical: 10 },
  infoCell: { flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: COLORS.border },
  infoLabel: { color: COLORS.textTertiary, fontSize: 8, fontWeight: '850', letterSpacing: 0.8, marginTop: 4 },
  infoValue: { color: COLORS.text, fontSize: 12, fontWeight: '850', marginTop: 2 },
  partIcon: { width: 41, height: 41, borderRadius: 14, backgroundColor: COLORS.surfaceElevated, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  partTitle: { color: COLORS.text, fontSize: 16, fontWeight: '850', marginTop: 3 },
  partBody: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 14 },
  partCost: { marginTop: 13, padding: 11, borderRadius: 13, backgroundColor: COLORS.surfaceElevated },
  costCaption: { color: COLORS.textTertiary, fontSize: 10 },
  costValue: { color: COLORS.amber, fontSize: 18, fontWeight: '900', marginTop: 3 },
  zoneGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  zoneButton: { width: '48.5%', minHeight: 43, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 7 },
  zoneButtonSelected: { backgroundColor: COLORS.blue, borderColor: COLORS.blue },
  zoneButtonText: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '750', flexShrink: 1 },
});
