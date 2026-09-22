import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha, toneColor } from '../theme';
import { Badge, ChipRow, InputField, MetricCard, PrimaryButton, Screen, ScreenHeader, SecondaryButton, SurfaceCard, WarningBanner } from '../components/Primitives';
import { HorizontalBars, MiniLineChart, PriceRangeBar } from '../components/Charts';
import { EvidenceComposer } from '../components/Media';

export function VinScreen({ data, actions }) {
  const [vin, setVin] = useState(data.vehicle?.vin || '');
  const [loading, setLoading] = useState(false);
  const [decoded, setDecoded] = useState(data.vehicle?.year ? { ...data.vehicle } : null);
  const decode = async () => { setLoading(true); await new Promise((r) => setTimeout(r, 550)); const next = { ...decoded, year: vin.length === 17 ? '2020' : data.vehicle?.year || '2020', make: data.vehicle?.make || 'Honda', model: data.vehicle?.model || 'Accord Sport', mileage: data.vehicle?.mileage || '42,180', vin }; setDecoded(next); setLoading(false); actions?.onVinDecoded?.(next); };
  return <Screen contentStyle={styles.content}>
    <ScreenHeader title="VIN Decoder" subtitle="Identify the vehicle before you trust any downstream analysis." onBack={actions?.onBack} right={<Badge tone="cyan" label="17 CHARACTERS" icon="barcode-outline" />} />
    <SurfaceCard tone="blue"><InputField label="Vehicle identification number" value={vin} onChangeText={(value) => setVin(value.toUpperCase().replace(/\s/g, '').slice(0, 17))} placeholder="Enter 17-character VIN" helper={`${vin.length}/17 characters`} mono leftIcon="scan-outline" /><PrimaryButton label="Decode VIN" loading={loading} disabled={vin.length !== 17} icon="arrow-forward" onPress={decode} /><Pressable onPress={() => { const sample = '1HGCV1F35LA000000'; setVin(sample); }} style={styles.sample}><Text style={styles.sampleText}>Use demo VIN</Text><Ionicons name="sparkles-outline" size={13} color={COLORS.cyan} /></Pressable></SurfaceCard>
    {decoded ? <VehicleDecodeCard vehicle={decoded} onContinue={actions?.onStartInspection} /> : <SurfaceCard style={{ marginTop: 12 }}><View style={styles.emptyTool}><Ionicons name="barcode-outline" size={30} color={COLORS.textTertiary} /><Text style={styles.emptyTitle}>Vehicle identity appears here</Text><Text style={styles.emptyText}>Decode a complete VIN to populate the vehicle profile.</Text></View></SurfaceCard>}
  </Screen>;
}

function VehicleDecodeCard({ vehicle, onContinue }) { return <SurfaceCard tone="mint" style={{ marginTop: 12 }}><View style={COMMON.rowBetween}><View><Text style={TYPOGRAPHY.eyebrow}>VIN DECODE COMPLETE</Text><Text style={TYPOGRAPHY.h2}>{vehicle.year} {vehicle.make}</Text><Text style={styles.decodeModel}>{vehicle.model}</Text></View><View style={styles.verifiedIcon}><Ionicons name="checkmark" size={21} color={COLORS.bg} /></View></View><View style={styles.decodeGrid}><DecodeCell label="VIN" value={vehicle.vin || '—'} mono /><DecodeCell label="Mileage" value={`${vehicle.mileage || '—'} mi`} /><DecodeCell label="Location" value={vehicle.location || 'Toronto, ON'} /></View><PrimaryButton label="Use vehicle in inspection" onPress={onContinue} /></SurfaceCard>; }
function DecodeCell({ label, value, mono }) { return <View style={styles.decodeCell}><Text style={styles.decodeLabel}>{label}</Text><Text style={[styles.decodeValue, mono && TYPOGRAPHY.mono]}>{value}</Text></View>; }

export function CostScreen({ data, actions }) {
  const [selected, setSelected] = useState('all');
  const rows = (data.findings || []).map((finding) => ({ id: finding.id, label: finding.title, value: ((finding.costLow || 0) + (finding.costHigh || 0)) / 2, display: `$${Math.round(((finding.costLow || 0) + (finding.costHigh || 0)) / 2).toLocaleString()}`, color: finding.severity === 'major' ? COLORS.amber : COLORS.mint }));
  const filtered = selected === 'all' ? rows : rows.filter((item) => { const finding = data.findings?.find((f) => f.id === item.id); return finding?.severity === selected; });
  const total = filtered.reduce((sum, row) => sum + row.value, 0);
  return <Screen contentStyle={styles.content}>
    <ScreenHeader title="Cost Estimator" subtitle="Separate market value from the possible impact of inspection findings." onBack={actions?.onBack} right={<Badge tone="amber" label={`$${Math.round(data.repairTotal || total).toLocaleString()}`} />} />
    <SurfaceCard tone="amber"><Text style={TYPOGRAPHY.eyebrow}>CURRENT REPAIR ESTIMATE</Text><Text style={styles.costHero}>${Math.round(data.repairTotal || total).toLocaleString()}</Text><Text style={styles.costBody}>Use this as a planning range. Actual repair pricing depends on the shop, parts, labor, and verified damage.</Text><View style={{ marginTop: 14 }}><HorizontalBars rows={filtered.length ? filtered : [{ label: 'No repair findings', value: 0, display: '$0' }]} /></View></SurfaceCard>
    <View style={{ marginTop: 12 }}><ChipRow items={[{ value: 'all', label: 'All' }, { value: 'major', label: 'Major' }, { value: 'minor', label: 'Minor' }, { value: 'critical', label: 'Critical' }]} selected={selected} onSelect={setSelected} /></View>
    {data.findings?.length ? data.findings.map((finding) => <RepairItem key={finding.id} finding={finding} onOpenAI={actions?.onOpenAI} />) : <SurfaceCard style={{ marginTop: 12 }}><Text style={TYPOGRAPHY.h3}>No repair items yet</Text><Text style={styles.emptyText}>Add or confirm an inspection finding before estimating repair impact.</Text></SurfaceCard>}
    <View style={{ marginTop: 18 }}><PrimaryButton label="Use repair impact in negotiation" icon="chatbubbles-outline" onPress={actions?.onOpenNegotiation} /></View>
  </Screen>;
}

function RepairItem({ finding, onOpenAI }) { const tone = finding.severity === 'critical' ? 'coral' : finding.severity === 'major' ? 'amber' : 'mint'; return <Pressable onPress={onOpenAI} style={styles.repairItem}><View style={[styles.repairIcon, { backgroundColor: alpha(toneColor(tone), 0.09) }]}><Ionicons name="build-outline" size={18} color={toneColor(tone)} /></View><View style={COMMON.fill}><Text style={styles.repairTitle}>{finding.title}</Text><Text style={styles.repairMeta}>{finding.zone} · {Math.round((finding.confidence || 0) * 100)}% confidence</Text></View><View style={{ alignItems: 'flex-end' }}><Badge tone={tone} label={finding.severity.toUpperCase()} /><Text style={styles.repairAmount}>${finding.costLow || 0}–${finding.costHigh || 0}</Text></View></Pressable>; }

export function TestDriveScreen({ data, actions }) {
  const items = [
    ['acceleration', 'Acceleration', 8.6], ['braking', 'Braking', 8.2], ['steering', 'Steering', 7.4], ['transmission', 'Transmission', 8.8], ['noise', 'Noise / vibration', 6.9], ['comfort', 'Ride / comfort', 8.1],
  ];
  const average = (items.reduce((sum, row) => sum + row[2], 0) / items.length).toFixed(1);
  return <Screen contentStyle={styles.content}>
    <ScreenHeader title="Test Drive" subtitle="Log observations while the vehicle is actually moving." onBack={actions?.onBack} right={<Badge tone="cyan" label="LIVE LOG" icon="car-outline" />} />
    <SurfaceCard tone="blue" style={styles.driveHero}><View style={styles.driveGauge}><Text style={styles.driveScore}>{average}</Text><Text style={styles.driveLabel}>AVG / 10</Text></View><View style={COMMON.fill}><Text style={TYPOGRAPHY.eyebrow}>DRIVE QUALITY</Text><Text style={TYPOGRAPHY.h2}>Keep the observation grounded.</Text><Text style={styles.driveBody}>Ratings are your own notes. CarWise should not invent vehicle behavior.</Text></View></SurfaceCard>
    <View style={{ marginTop: 15 }}><EvidenceComposer onPhoto={actions?.onCapturePhoto} onVideo={actions?.onCaptureVideo} onVoice={actions?.onCaptureVoice} onDocument={actions?.onPickDocument} onText={actions?.onAddNote} /></View>
    <View style={{ marginTop: 19, gap: 8 }}>{items.map(([id, label, rating]) => <DriveRow key={id} label={label} rating={rating} onPress={() => actions?.onLogDrive?.(id, rating)} />)}</View>
    <SurfaceCard style={{ marginTop: 18 }}><Text style={TYPOGRAPHY.eyebrow}>TREND</Text><Text style={TYPOGRAPHY.h3}>Drive observations over time</Text><MiniLineChart points={[55,57,61,59,62,64,66,65,70]} tone="cyan" height={76} /></SurfaceCard>
    <View style={{ marginTop: 18 }}><PrimaryButton label="Save test-drive log" icon="checkmark" onPress={actions?.onSaveTestDrive} /></View>
  </Screen>;
}

function DriveRow({ label, rating, onPress }) { const tone = rating >= 8 ? 'mint' : rating >= 7 ? 'amber' : 'coral'; return <Pressable onPress={onPress} style={styles.driveRow}><View style={COMMON.fill}><Text style={styles.driveRowLabel}>{label}</Text><View style={styles.ratingTrack}><View style={[styles.ratingFill, { width: `${rating * 10}%`, backgroundColor: toneColor(tone) }]} /></View></View><Text style={[styles.ratingValue, { color: toneColor(tone) }]}>{rating.toFixed(1)}</Text><Ionicons name="chevron-forward" size={15} color={COLORS.textTertiary} /></Pressable>; }

export function MaintenanceScreen({ data, actions }) {
  const [tab, setTab] = useState('upcoming');
  const items = [
    { id: 'oil', title: 'Oil + filter', due: 'Next 2,500 mi', status: 'upcoming', tone: 'amber', icon: 'water-outline' },
    { id: 'brakes', title: 'Brake inspection', due: 'Review now', status: 'due', tone: 'coral', icon: 'disc-outline' },
    { id: 'tires', title: 'Tire rotation', due: 'Next 4,000 mi', status: 'upcoming', tone: 'blue', icon: 'sync-outline' },
    { id: 'coolant', title: 'Coolant check', due: 'Next 8,000 mi', status: 'upcoming', tone: 'mint', icon: 'thermometer-outline' },
  ];
  const shown = items.filter((item) => tab === 'all' || (tab === 'upcoming' && item.status === 'upcoming') || (tab === 'due' && item.status === 'due'));
  return <Screen contentStyle={styles.content}>
    <ScreenHeader title="Maintenance Planner" subtitle="Turn the inspection into a simple next-service view." onBack={actions?.onBack} right={<Badge tone="amber" label="PLANNER" />} />
    <SurfaceCard><View style={COMMON.rowBetween}><View><Text style={TYPOGRAPHY.eyebrow}>MILEAGE</Text><Text style={styles.mileage}>{Number(data.vehicle?.mileage || 42180).toLocaleString()} mi</Text></View><View style={styles.serviceRing}><Text style={styles.serviceRingText}>3</Text><Text style={styles.serviceRingLabel}>DUE</Text></View></View><Text style={styles.maintenanceBody}>Maintenance timing is a planning aid. Confirm the vehicle's actual service records before relying on due intervals.</Text></SurfaceCard>
    <View style={{ marginTop: 12 }}><ChipRow items={[{ value: 'upcoming', label: 'Upcoming' }, { value: 'due', label: 'Due now' }, { value: 'all', label: 'All' }]} selected={tab} onSelect={setTab} /></View>
    <View style={{ marginTop: 12, gap: 8 }}>{shown.map((item) => <MaintenanceRow key={item.id} item={item} onPress={() => actions?.onLogMaintenance?.(item)} />)}</View>
    <SurfaceCard tone="blue" style={{ marginTop: 19 }}><Text style={TYPOGRAPHY.eyebrow}>SERVICE RECORDS</Text><Text style={TYPOGRAPHY.h3}>Missing maintenance evidence?</Text><Text style={styles.maintenanceBody}>Upload a service invoice or ask the seller for documentation. Keep the document attached to the inspection timeline.</Text><PrimaryButton label="Add service document" icon="document-attach-outline" onPress={actions?.onPickDocument} /></SurfaceCard>
  </Screen>;
}

function MaintenanceRow({ item, onPress }) { return <Pressable onPress={onPress} style={styles.maintenanceRow}><View style={[styles.maintenanceIcon, { backgroundColor: alpha(toneColor(item.tone), 0.1) }]}><Ionicons name={item.icon} size={19} color={toneColor(item.tone)} /></View><View style={COMMON.fill}><Text style={styles.maintenanceTitle}>{item.title}</Text><Text style={styles.maintenanceDue}>{item.due}</Text></View><Badge tone={item.tone} label={item.status === 'due' ? 'DUE' : 'UPCOMING'} /><Ionicons name="chevron-forward" size={15} color={COLORS.textTertiary} /></Pressable>; }

export function VehicleHistoryScreen({ data, actions }) {
  const rows = [
    ['Ownership', '2 recorded owners', 'mint'],
    ['Accident signals', 'Review source records', 'amber'],
    ['Service records', '6 events attached', 'mint'],
    ['Title status', 'No result in demo', 'amber'],
  ];
  return <Screen contentStyle={styles.content}>
    <ScreenHeader title="Vehicle History" subtitle="Keep source-backed ownership and service signals visible." onBack={actions?.onBack} right={<Badge tone="cyan" label="VIN LINKED" />} />
    <SurfaceCard tone="blue"><Text style={TYPOGRAPHY.eyebrow}>VIN</Text><Text style={[TYPOGRAPHY.h3, TYPOGRAPHY.mono]}>{data.vehicle?.vin || 'VIN not provided'}</Text><Text style={styles.historyBody}>This screen intentionally distinguishes source records from AI interpretation. A missing result is not evidence of a clean history.</Text></SurfaceCard>
    <View style={{ marginTop: 13, gap: 8 }}>{rows.map(([label, value, tone]) => <View key={label} style={styles.historyRow}><View style={styles.historyIcon}><Ionicons name={label === 'Ownership' ? 'people-outline' : label === 'Service records' ? 'construct-outline' : label === 'Title status' ? 'document-text-outline' : 'warning-outline'} size={17} color={toneColor(tone)} /></View><View style={COMMON.fill}><Text style={styles.historyLabel}>{label}</Text><Text style={styles.historyValue}>{value}</Text></View><Badge tone={tone} label={tone === 'mint' ? 'FOUND' : 'REVIEW'} /></View>)}</View>
    <SurfaceCard style={{ marginTop: 18 }}><Text style={TYPOGRAPHY.eyebrow}>SOURCE DOCUMENTS</Text><Text style={TYPOGRAPHY.h3}>Attach evidence</Text><Text style={styles.historyBody}>Upload a vehicle history PDF, service invoice, or seller-provided record.</Text><PrimaryButton label="Attach document" icon="document-attach-outline" onPress={actions?.onPickDocument} /></SurfaceCard>
    <View style={{ marginTop: 16 }}><SecondaryButton label="Record a history note" icon="create-outline" onPress={actions?.onAddHistoryNote} /></View>
  </Screen>;
}

export function CompareScreen({ data, actions }) {
  const vehicles = (data.compareVehicles?.length ? data.compareVehicles : [
    { id: 'a', title: '2020 Honda Accord Sport', price: 21100, risk: 32, repairs: 1350, mileage: 42180, evidence: 8 },
    { id: 'b', title: '2021 Toyota Camry SE', price: 22800, risk: 21, repairs: 780, mileage: 39800, evidence: 6 },
    { id: 'c', title: '2019 BMW 330i', price: 24900, risk: 61, repairs: 3200, mileage: 45300, evidence: 10 },
  ]).slice(0, 3);
  const rows = [
    ['Fair price', 'price', (item) => `$${Number(item.price).toLocaleString()}`],
    ['Risk', 'risk', (item) => `${item.risk}/100`],
    ['Repairs', 'repairs', (item) => `$${Number(item.repairs).toLocaleString()}`],
    ['Mileage', 'mileage', (item) => `${Number(item.mileage).toLocaleString()} mi`],
    ['Evidence', 'evidence', (item) => `${item.evidence} items`],
  ];
  return <Screen contentStyle={styles.content}>
    <ScreenHeader title="Compare Vehicles" subtitle="Compare the same decision signals across saved inspections." onBack={actions?.onBack} right={<Badge tone="blue" label={`${vehicles.length} CARS`} />} />
    <View style={styles.compareScroll}>{vehicles.map((vehicle) => <SurfaceCard key={vehicle.id} style={styles.compareCard}><View style={styles.compareImage}><Ionicons name="car-sport" size={25} color={COLORS.cyan} /></View><Text style={styles.compareTitle}>{vehicle.title}</Text><Badge tone={vehicle.risk >= 55 ? 'coral' : vehicle.risk >= 30 ? 'amber' : 'mint'} label={vehicle.risk >= 55 ? 'HIGH' : vehicle.risk >= 30 ? 'WATCH' : 'LOW'} /></SurfaceCard>)}</View>
    <SurfaceCard style={{ marginTop: 14 }}>{rows.map(([label, key, format]) => <View key={key} style={styles.compareRow}><Text style={styles.compareLabel}>{label}</Text>{vehicles.map((vehicle) => <Text key={vehicle.id} style={[styles.compareValue, key === 'risk' && { color: vehicle.risk >= 55 ? COLORS.coral : vehicle.risk >= 30 ? COLORS.amber : COLORS.mint }, key === 'repairs' && { color: COLORS.amber }]}>{format(vehicle)}</Text>)}</View>)}</SurfaceCard>
    <SurfaceCard tone="blue" style={{ marginTop: 14 }}><Text style={TYPOGRAPHY.eyebrow}>DECISION VIEW</Text><Text style={TYPOGRAPHY.h3}>Keep the tradeoffs visible</Text><Text style={styles.compareBody}>A lower asking price is not automatically better. Compare condition, evidence coverage, repair estimates, market context, and risk together.</Text><SecondaryButton label="Open selected vehicle report" icon="document-text-outline" onPress={actions?.onOpenReport} /></SurfaceCard>
  </Screen>;
}

export function SettingsScreen({ data, actions }) {
  return <Screen contentStyle={styles.content}>
    <ScreenHeader title="Profile & Settings" subtitle="Tune motion, appearance, and local-data behavior." onBack={actions?.onBack} right={<Badge tone="mint" label="LOCAL" />} />
    <SurfaceCard tone="blue"><View style={styles.profileTop}><View style={styles.avatar}><Text style={styles.avatarText}>{String(data.userName || 'CW').slice(0, 2).toUpperCase()}</Text></View><View style={COMMON.fill}><Text style={TYPOGRAPHY.eyebrow}>CARWISE ACCOUNT</Text><Text style={TYPOGRAPHY.h2}>{data.userName || 'CarWise user'}</Text><Text style={styles.profileMeta}>{data.userEmail || 'Local profile'}</Text></View><Badge tone="blue" label={data.plan || 'FREE'} /></View></SurfaceCard>
    <View style={{ marginTop: 18, gap: 8 }}>
      <SettingRow icon="sparkles-outline" title="AI disclosure" body="Keep AI estimates explicitly labeled." value={data.settings?.aiDisclosure !== false ? 'ON' : 'OFF'} tone="cyan" onPress={actions?.onToggleAiDisclosure} />
      <SettingRow icon="pulse-outline" title="Motion intensity" body="Gentle, standard, or lively animations." value={data.settings?.motionIntensity || 'standard'} tone="blue" onPress={actions?.onCycleMotion} />
      <SettingRow icon="moon-outline" title="Appearance" body="Dark-first mobile presentation." value="Dark" tone="blue" onPress={actions?.onToggleTheme} />
      <SettingRow icon="cloud-offline-outline" title="Offline demo data" body="Keep the prototype functional without live APIs." value={data.settings?.offlineDemoData === false ? 'OFF' : 'ON'} tone="mint" onPress={actions?.onToggleOfflineDemo} />
      <SettingRow icon="accessibility-outline" title="Reduced motion" body="Follow iOS accessibility settings or your app preference." value={data.settings?.reducedMotion ? 'ON' : 'SYSTEM'} tone="amber" onPress={actions?.onToggleReducedMotion} />
    </View>
    <SurfaceCard style={{ marginTop: 19 }}><Text style={TYPOGRAPHY.eyebrow}>LOCAL STORAGE</Text><Text style={TYPOGRAPHY.h3}>Inspection recovery</Text><Text style={styles.settingsBody}>The existing app already persists active inspection state and includes recovery helpers. Keep those flows intact while replacing only the visual layer.</Text><View style={styles.settingsGrid}><MiniSetting label="Saved inspections" value={`${data.savedInspections?.length || 0}`} /><MiniSetting label="Retry queue" value={`${data.retryQueueCount || 0}`} /><MiniSetting label="Photos" value={`${data.photos?.length || 0}`} /></View><SecondaryButton label="Open recovery log" icon="pulse-outline" onPress={actions?.onOpenRecovery} /></SurfaceCard>
    <View style={{ marginTop: 18 }}><SecondaryButton label="Export local backup" icon="download-outline" onPress={actions?.onExportBackup} /></View>
  </Screen>;
}

function SettingRow({ icon, title, body, value, tone, onPress }) { return <Pressable onPress={onPress} style={styles.settingRow}><View style={[styles.settingIcon, { backgroundColor: alpha(toneColor(tone), 0.09) }]}><Ionicons name={icon} size={18} color={toneColor(tone)} /></View><View style={COMMON.fill}><Text style={styles.settingTitle}>{title}</Text><Text style={styles.settingBody}>{body}</Text></View><Text style={styles.settingValue}>{value}</Text><Ionicons name="chevron-forward" size={15} color={COLORS.textTertiary} /></Pressable>; }
function MiniSetting({ label, value }) { return <View style={styles.miniSetting}><Text style={styles.miniSettingLabel}>{label}</Text><Text style={styles.miniSettingValue}>{value}</Text></View>; }

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  sample: { alignSelf: 'center', minHeight: 38, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10 },
  sampleText: { color: COLORS.cyan, fontSize: 10, fontWeight: '800' },
  emptyTool: { alignItems: 'center', paddingVertical: 28 },
  emptyTitle: { color: COLORS.text, fontSize: 14, fontWeight: '850', marginTop: 8 },
  emptyText: { color: COLORS.textTertiary, fontSize: 11, lineHeight: 16, marginTop: 5, textAlign: 'center', maxWidth: 290 },
  verifiedIcon: { width: 40, height: 40, borderRadius: 15, backgroundColor: COLORS.mint, alignItems: 'center', justifyContent: 'center' },
  decodeModel: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  decodeGrid: { gap: 7, marginVertical: 14 },
  decodeCell: { backgroundColor: COLORS.surfaceElevated, borderRadius: 12, padding: 9 },
  decodeLabel: { color: COLORS.textTertiary, fontSize: 8, textTransform: 'uppercase', fontWeight: '850' },
  decodeValue: { color: COLORS.text, fontSize: 11, fontWeight: '800', marginTop: 4 },
  costHero: { color: COLORS.amber, fontSize: 44, fontWeight: '900', marginTop: 5 },
  costBody: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 17, marginTop: 3 },
  repairItem: { marginTop: 8, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 9 },
  repairIcon: { width: 42, height: 42, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  repairTitle: { color: COLORS.text, fontSize: 12, fontWeight: '850' },
  repairMeta: { color: COLORS.textTertiary, fontSize: 9, marginTop: 3 },
  repairAmount: { color: COLORS.textSecondary, fontSize: 9, marginTop: 5, fontWeight: '750' },
  driveHero: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  driveGauge: { width: 87, height: 87, borderRadius: 44, borderWidth: 5, borderColor: alpha(COLORS.cyan, 0.35), backgroundColor: alpha(COLORS.cyan, 0.06), justifyContent: 'center', alignItems: 'center' },
  driveScore: { color: COLORS.cyan, fontSize: 28, fontWeight: '900' },
  driveLabel: { color: COLORS.textTertiary, fontSize: 8, fontWeight: '850' },
  driveBody: { color: COLORS.textSecondary, fontSize: 10, lineHeight: 15, marginTop: 5 },
  driveRow: { minHeight: 58, borderRadius: 15, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 10 },
  driveRowLabel: { color: COLORS.text, fontSize: 11, fontWeight: '800', marginBottom: 6 },
  ratingTrack: { height: 5, borderRadius: 99, backgroundColor: COLORS.surfaceSoft, overflow: 'hidden' },
  ratingFill: { height: 5, borderRadius: 99 },
  ratingValue: { width: 32, fontSize: 14, fontWeight: '900', textAlign: 'right' },
  maintenanceBody: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 17, marginTop: 7 },
  mileage: { color: COLORS.text, fontSize: 32, fontWeight: '900', marginTop: 5 },
  serviceRing: { width: 66, height: 66, borderRadius: 33, borderWidth: 1, borderColor: alpha(COLORS.amber, 0.3), backgroundColor: alpha(COLORS.amber, 0.07), justifyContent: 'center', alignItems: 'center' },
  serviceRingText: { color: COLORS.amber, fontSize: 21, fontWeight: '900' },
  serviceRingLabel: { color: COLORS.textTertiary, fontSize: 8, fontWeight: '850' },
  maintenanceRow: { minHeight: 70, borderRadius: 16, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 9 },
  maintenanceIcon: { width: 41, height: 41, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  maintenanceTitle: { color: COLORS.text, fontSize: 12, fontWeight: '850' },
  maintenanceDue: { color: COLORS.textTertiary, fontSize: 9, marginTop: 3 },
  historyBody: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 17, marginTop: 7 },
  historyRow: { minHeight: 64, borderRadius: 15, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 9 },
  historyIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: COLORS.surfaceElevated, justifyContent: 'center', alignItems: 'center' },
  historyLabel: { color: COLORS.textTertiary, fontSize: 9, fontWeight: '700' },
  historyValue: { color: COLORS.text, fontSize: 12, fontWeight: '850', marginTop: 3 },
  compareScroll: { flexDirection: 'row', gap: 7 },
  compareCard: { width: 118, padding: 11 },
  compareImage: { height: 76, borderRadius: 13, backgroundColor: COLORS.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  compareTitle: { color: COLORS.text, fontSize: 10, lineHeight: 13, fontWeight: '850', marginTop: 8, minHeight: 28 },
  compareRow: { minHeight: 44, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  compareLabel: { color: COLORS.textTertiary, width: 87, fontSize: 9, fontWeight: '750' },
  compareValue: { flex: 1, textAlign: 'center', color: COLORS.text, fontSize: 9, fontWeight: '850' },
  compareBody: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 17, marginTop: 7 },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 58, height: 58, borderRadius: 20, backgroundColor: COLORS.blue, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: COLORS.white, fontSize: 18, fontWeight: '900' },
  profileMeta: { color: COLORS.textTertiary, fontSize: 9, marginTop: 3 },
  settingRow: { minHeight: 70, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 9 },
  settingIcon: { width: 41, height: 41, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  settingTitle: { color: COLORS.text, fontSize: 12, fontWeight: '850' },
  settingBody: { color: COLORS.textTertiary, fontSize: 9, lineHeight: 13, marginTop: 3 },
  settingValue: { color: COLORS.textSecondary, fontSize: 9, fontWeight: '850', textTransform: 'uppercase' },
  settingsBody: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 17, marginTop: 6 },
  settingsGrid: { flexDirection: 'row', gap: 7, marginVertical: 13 },
  miniSetting: { flex: 1, backgroundColor: COLORS.surfaceElevated, borderRadius: 12, padding: 9 },
  miniSettingLabel: { color: COLORS.textTertiary, fontSize: 8, fontWeight: '750' },
  miniSettingValue: { color: COLORS.text, fontSize: 16, fontWeight: '900', marginTop: 4 },
});
