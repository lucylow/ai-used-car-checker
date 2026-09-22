import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { Badge, InputField, PrimaryButton, Screen, ScreenHeader, SecondaryButton, SegmentedControl, SurfaceCard } from '../components/Primitives';
import { EvidenceComposer } from '../components/Media';

export default function NewInspectionScreen({ data, actions }) {
  const [step, setStep] = useState(0);
  const [vehicle, setVehicle] = useState(data.vehicle || { year: '', make: '', model: '', mileage: '', asking: '', vin: '', location: '' });
  const [intent, setIntent] = useState('buying');
  const intents = [{ value: 'buying', label: 'Buying', icon: 'cart-outline' }, { value: 'selling', label: 'Selling', icon: 'pricetag-outline' }, { value: 'trade', label: 'Trade-in', icon: 'swap-horizontal-outline' }];
  const canNext = step === 0 ? Boolean(vehicle.make && vehicle.model) : true;
  const update = (key, value) => setVehicle((current) => ({ ...current, [key]: value }));
  const finish = () => actions?.onCreateInspection?.(vehicle, intent) || actions?.onStartInspection?.(vehicle);
  return <Screen contentStyle={styles.content}>
    <ScreenHeader title="New Inspection" subtitle="Build a vehicle profile first, then collect evidence." onBack={actions?.onBack} right={<Badge tone="cyan" label={`${step + 1}/3`} />} />
    <View style={styles.progress}><View style={[styles.progressFill, { width: `${((step + 1) / 3) * 100}%` }]} /></View>
    {step === 0 ? <VehicleStep vehicle={vehicle} update={update} actions={actions} /> : null}
    {step === 1 ? <SellerStep vehicle={vehicle} update={update} intent={intent} setIntent={setIntent} intents={intents} /> : null}
    {step === 2 ? <EvidenceStep actions={actions} vehicle={vehicle} /> : null}
    <View style={styles.bottom}>{step > 0 ? <SecondaryButton label="Back" icon="arrow-back" onPress={() => setStep((value) => value - 1)} style={{ marginBottom: 8 }} /> : null}<PrimaryButton label={step === 2 ? 'Create inspection' : 'Continue'} icon={step === 2 ? 'checkmark' : 'arrow-forward'} disabled={!canNext} onPress={() => step === 2 ? finish() : setStep((value) => value + 1)} /></View>
  </Screen>;
}

function VehicleStep({ vehicle, update, actions }) { return <View><SurfaceCard tone="blue"><Text style={TYPOGRAPHY.eyebrow}>STEP 1 · VEHICLE ID</Text><Text style={TYPOGRAPHY.h2}>Tell CarWise what you're looking at.</Text><Text style={styles.stepBody}>VIN can be scanned later. Start with the visible vehicle details if that is faster.</Text><View style={styles.row}><InputField label="Year" value={vehicle.year} onChangeText={(v) => update('year', v)} placeholder="2020" keyboardType="numeric" /><InputField label="Make" value={vehicle.make} onChangeText={(v) => update('make', v)} placeholder="Honda" /><InputField label="Model" value={vehicle.model} onChangeText={(v) => update('model', v)} placeholder="Accord Sport" /></View><InputField label="Mileage" value={vehicle.mileage} onChangeText={(v) => update('mileage', v)} placeholder="42,180" keyboardType="numeric" leftIcon="speedometer-outline" /><InputField label="Asking price" value={vehicle.asking} onChangeText={(v) => update('asking', v)} placeholder="21,900" keyboardType="numeric" leftIcon="cash-outline" /><InputField label="VIN (optional)" value={vehicle.vin} onChangeText={(v) => update('vin', v.toUpperCase().slice(0, 17))} placeholder="17 characters" mono leftIcon="barcode-outline" /></SurfaceCard><SurfaceCard style={{ marginTop: 13 }}><Pressable style={styles.vinShortcut} onPress={() => { if (actions) actions.onOpenVin?.(); }}><View style={styles.shortcutIcon}><Ionicons name="scan" size={18} color={COLORS.cyan} /></View><View style={COMMON.fill}><Text style={styles.shortcutTitle}>Scan VIN instead</Text><Text style={styles.shortcutBody}>Use the camera to identify the vehicle automatically.</Text></View><Ionicons name="chevron-forward" size={17} color={COLORS.textTertiary} /></Pressable></SurfaceCard></View>; }

function SellerStep({ vehicle, update, intent, setIntent, intents }) { return <View><SurfaceCard tone="blue"><Text style={TYPOGRAPHY.eyebrow}>STEP 2 · CONTEXT</Text><Text style={TYPOGRAPHY.h2}>Add the buying context.</Text><Text style={styles.stepBody}>These fields shape the market and negotiation views without pretending they are verified facts.</Text><SegmentedControl options={intents} value={intent} onChange={setIntent} /><InputField label="Seller / dealership" value={vehicle.seller || ''} onChangeText={(v) => update('seller', v)} placeholder="Optional" leftIcon="person-outline" /><InputField label="Location" value={vehicle.location || ''} onChangeText={(v) => update('location', v)} placeholder="Toronto, ON" leftIcon="location-outline" /><InputField label="Listing URL" value={vehicle.listingUrl || ''} onChangeText={(v) => update('listingUrl', v)} placeholder="Optional" autoCapitalize="none" leftIcon="link-outline" /><InputField label="Seller notes" value={vehicle.sellerNotes || ''} onChangeText={(v) => update('sellerNotes', v)} placeholder="Anything the seller told you" multiline leftIcon="create-outline" /></SurfaceCard></View>; }

function EvidenceStep({ actions, vehicle }) { return <View><SurfaceCard tone="cyan"><Text style={TYPOGRAPHY.eyebrow}>STEP 3 · FIRST EVIDENCE</Text><Text style={TYPOGRAPHY.h2}>Give the inspection a visual starting point.</Text><Text style={styles.stepBody}>A single good front 3/4 photo is enough to create the inspection. Add more later as you walk around the car.</Text><View style={styles.firstCapture}><View style={styles.captureIcon}><Ionicons name="camera" size={27} color={COLORS.cyan} /></View><Text style={styles.captureTitle}>{vehicle.make ? `${vehicle.make} ${vehicle.model}` : 'Vehicle photo'}</Text><Text style={styles.captureBody}>Front 3/4 · natural light · include the whole bumper and side panel</Text><PrimaryButton label="Capture first photo" icon="camera" onPress={actions?.onCapturePhoto} /></View></SurfaceCard><SurfaceCard style={{ marginTop: 13 }}><Text style={TYPOGRAPHY.eyebrow}>MORE INPUTS</Text><Text style={TYPOGRAPHY.h3}>Multimodal by default</Text><Text style={styles.stepBody}>You can attach video, voice, notes, or a service document to the inspection after creation.</Text><EvidenceComposer onPhoto={actions?.onCapturePhoto} onVideo={actions?.onCaptureVideo} onVoice={actions?.onCaptureVoice} onDocument={actions?.onPickDocument} onText={actions?.onAddNote} /></SurfaceCard></View>; }

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  progress: { height: 6, borderRadius: 99, backgroundColor: COLORS.surfaceSoft, overflow: 'hidden', marginTop: 4, marginBottom: 17 },
  progressFill: { height: 6, backgroundColor: COLORS.cyan },
  stepBody: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 17, marginTop: 6, marginBottom: 3 },
  row: { gap: 0 },
  vinShortcut: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 10 },
  shortcutIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: alpha(COLORS.cyan, 0.08), alignItems: 'center', justifyContent: 'center' },
  shortcutTitle: { color: COLORS.text, fontSize: 12, fontWeight: '850' },
  shortcutBody: { color: COLORS.textTertiary, fontSize: 9, lineHeight: 13, marginTop: 2 },
  firstCapture: { marginTop: 15, borderRadius: 18, backgroundColor: '#071321', borderWidth: 1, borderColor: alpha(COLORS.cyan, 0.23), padding: 17, alignItems: 'center' },
  captureIcon: { width: 62, height: 62, borderRadius: 23, backgroundColor: alpha(COLORS.cyan, 0.09), alignItems: 'center', justifyContent: 'center' },
  captureTitle: { color: COLORS.text, fontSize: 15, fontWeight: '850', marginTop: 10 },
  captureBody: { color: COLORS.textSecondary, fontSize: 10, lineHeight: 15, textAlign: 'center', maxWidth: 270, marginTop: 4, marginBottom: 12 },
  bottom: { marginTop: 22, paddingBottom: 20 },
});
