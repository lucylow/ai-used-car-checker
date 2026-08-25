import { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { canApplyDecodedVehicle, decodeVin, getVinResultCompleteness, getSafeDecodedVehicle, canConfirmVinCapture, getVinCaptureConfidence, getVinConfidenceDisclosure, normalizeVinCandidate } from '../src/services/vinService';
import { getInspectionNavigationLabel, getToolInputGuidance, getVinWalkthroughStep } from '../src/services/reportUtils';

function VinTool({ onHome, onUse, Card, ActionButton, colors, styles }) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [cameraBusy, setCameraBusy] = useState(false);
  const [captureCandidate, setCaptureCandidate] = useState('');
  const [captureConfidence, setCaptureConfidence] = useState(0);
  const [capturedUri, setCapturedUri] = useState('');
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  const captureVin = async () => { if (cameraBusy || busy) return; setCameraBusy(true); try { const permission = await ImagePicker.requestCameraPermissionsAsync(); if (permission.status !== 'granted') { if (mountedRef.current) setResult({ status: 'error', message: 'Camera permission is required for VIN capture. You can still enter the VIN manually.', vehicle: null }); return; } const captured = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [16, 5], quality: 0.8 }); if (captured.canceled || !captured.assets?.[0]) return; if (mountedRef.current) { setCaptureCandidate(''); setCaptureConfidence(0); setCapturedUri(captured.assets[0].uri || ''); setResult({ status: 'captured', message: 'VIN image captured. Enter or verify the characters below before decoding.', vehicle: null }); } } catch (error) { if (mountedRef.current) setResult({ status: 'error', message: error?.message || 'Camera capture was unavailable. Enter the VIN manually.', vehicle: null }); } finally { if (mountedRef.current) setCameraBusy(false); } };
  const confirmCapture = () => { const normalized = normalizeVinCandidate(captureCandidate); if (!canConfirmVinCapture({ candidate: normalized, confidence: captureConfidence })) { setResult({ status: 'error', message: 'Confirm all 17 VIN characters before decoding. The candidate confidence is below the safe threshold.', vehicle: null }); return; } setValue(normalized); setResult(null); };

  const runDecode = async () => {
    if (busy) return;
    setBusy(true);
    setResult(null);
    try {
      const decoded = await decodeVin(value);
      if (!mountedRef.current) return;
      setValue(decoded.vin);
      setResult(decoded);
    } catch (error) {
      if (mountedRef.current) setResult({ status: 'error', message: error?.message || 'Enter a valid 17-character VIN before decoding.', vehicle: null });
    } finally {
      if (mountedRef.current) setBusy(false);
    }
  };

  const decodedVehicle = getSafeDecodedVehicle(result?.vehicle);
  const vehicleLabel = decodedVehicle ? [decodedVehicle.year, decodedVehicle.make, decodedVehicle.model].filter(Boolean).join(' ') : '';
  const resultCompleteness = getVinResultCompleteness(result?.vehicle);
  const walkthrough = getVinWalkthroughStep({ value, status: result?.status, busy });
  const progress = Math.min(100, Math.max(8, (Math.min(3, walkthrough.index + 1) / 3) * 100));

  return <ScrollView contentContainerStyle={styles.content}>
    <Text accessibilityRole="button" accessibilityLabel={getInspectionNavigationLabel('home')} style={styles.back} onPress={onHome}>‹ Home</Text>
    <Text style={styles.pageTitle}>VIN decoder</Text>
    <Text style={styles.pageBody}>Decode a 17-character VIN with the public NHTSA vPIC service.</Text>
    <Card><Text style={styles.cardEyebrow}>GUIDED LOOKUP · STEP {Math.min(3, Math.max(1, walkthrough.index + 1))} OF 3</Text><Text style={styles.cardTitle}>{walkthrough.title}</Text><Text accessibilityLiveRegion="polite" style={styles.muted}>{walkthrough.detail}</Text><View style={styles.onboardingProgress}><View style={[styles.onboardingProgressFill, { width: `${progress}%` }]} /></View></Card>
    <Text accessibilityLiveRegion="polite" style={styles.muted}>{result?.message || getToolInputGuidance('vin', value)}</Text>
    <Card>
      <TextInput accessibilityLabel="Vehicle identification number" accessibilityHint="Enter the 17-character vehicle identification number" style={styles.inputFull} value={value} onChangeText={setValue} placeholder="Enter VIN" placeholderTextColor={colors.muted} autoCapitalize="characters" autoCorrect={false} maxLength={17} returnKeyType="done" onSubmitEditing={runDecode} />
      <View style={{ flexDirection: 'row', gap: 10 }}><View style={{ flex: 1 }}><ActionButton accessibilityLabel="Decode VIN" accessibilityHint="Looks up vehicle details from the entered VIN" disabled={busy || cameraBusy} label={busy ? 'Decoding…' : 'Decode VIN'} onPress={runDecode} /></View><TouchableOpacity accessibilityRole="button" accessibilityLabel="Capture VIN with camera" style={[styles.secondaryButton, { flex: 1 }]} disabled={busy || cameraBusy} onPress={captureVin}><Text style={styles.secondaryButtonText}>{cameraBusy ? 'Opening camera…' : 'Use camera'}</Text></TouchableOpacity></View>
    </Card>
    {result?.status === 'captured' ? <Card style={styles.resultCard}><Text style={styles.cardEyebrow}>CAMERA CAPTURE</Text>{capturedUri ? <Image accessibilityLabel="Captured VIN reference image" source={{ uri: capturedUri }} style={{ width: '100%', height: 120, borderRadius: 12, marginTop: 10 }} resizeMode="cover" /> : null}<Text style={styles.muted}>{result.message}</Text><TextInput accessibilityLabel="Captured VIN candidate" style={styles.inputFull} value={captureCandidate} onChangeText={(next) => { const normalized = normalizeVinCandidate(next); setCaptureCandidate(normalized); setCaptureConfidence(getVinCaptureConfidence(normalized)); }} placeholder="Verify 17 VIN characters" placeholderTextColor={colors.muted} autoCapitalize="characters" autoCorrect={false} maxLength={17} /><Text style={styles.muted}>Candidate confidence: {Math.round(captureConfidence * 100)}% · {captureConfidence >= 0.8 ? 'Ready for confirmation' : 'Verify every character manually'}</Text><Text style={styles.muted}>{getVinConfidenceDisclosure(captureConfidence)}</Text><TouchableOpacity accessibilityRole="button" accessibilityLabel="Confirm captured VIN" accessibilityState={{ disabled: !canConfirmVinCapture({ candidate: captureCandidate, confidence: captureConfidence }) }} disabled={!canConfirmVinCapture({ candidate: captureCandidate, confidence: captureConfidence })} style={[styles.primaryButton, !canConfirmVinCapture({ candidate: captureCandidate, confidence: captureConfidence }) && styles.disabledButton]} onPress={confirmCapture}><Text style={styles.primaryButtonText}>Confirm VIN candidate</Text><Text style={styles.buttonArrow}>✓</Text></TouchableOpacity></Card> : null}
    {result?.status === 'decoded' ? <Card style={styles.resultCard}><Text style={styles.cardEyebrow}>LIVE RESULT</Text><Text style={styles.cardTitle}>{vehicleLabel || 'Vehicle identity returned'}</Text><Text style={styles.muted}>Identity fields returned: {resultCompleteness.present}/{resultCompleteness.total}{resultCompleteness.complete ? ' · Ready to use' : ' · Review before using'}</Text>{decodedVehicle?.trim ? <Text style={styles.muted}>Trim: {decodedVehicle.trim}</Text> : null}{decodedVehicle?.bodyClass ? <Text style={styles.muted}>Body: {decodedVehicle.bodyClass}</Text> : null}{decodedVehicle?.engine ? <Text style={styles.muted}>Engine: {decodedVehicle.engine}</Text> : null}<Text style={styles.muted}>{resultCompleteness.complete ? 'All required identity fields are available.' : `Complete missing fields manually: ${resultCompleteness.missingLabels.join(', ')}.`}</Text><TouchableOpacity accessibilityRole="button" accessibilityLabel={resultCompleteness.complete ? `Use ${vehicleLabel || 'decoded vehicle'} in inspection` : 'Apply decoded vehicle unavailable until identity is complete'} accessibilityState={{ disabled: !resultCompleteness.complete }} disabled={!canApplyDecodedVehicle(decodedVehicle)} style={[styles.secondaryButton, !resultCompleteness.complete && styles.disabledButton]} onPress={() => onUse({ year: decodedVehicle?.year, make: decodedVehicle?.make, model: decodedVehicle?.model, vin: result.vin })}><Text style={styles.secondaryButtonText}>{resultCompleteness.complete ? 'Use in inspection' : 'Complete identity first'}</Text></TouchableOpacity></Card> : null}
    {result?.status === 'fallback' ? <Card style={styles.resultCard}><Text style={styles.cardEyebrow}>OFFLINE FALLBACK</Text><Text style={styles.muted}>No vehicle details were changed. You can retry the lookup or continue entering details manually.</Text></Card> : null}
    {result?.status === 'error' ? <Card style={styles.resultCard}><Text style={styles.cardEyebrow}>CHECK THE VIN</Text><Text style={styles.muted}>{result.message}</Text><Text style={styles.muted}>Your inspection details remain unchanged. Correct the VIN and try again.</Text></Card> : null}
  </ScrollView>;
}

export default VinTool;

// Component styles are supplied by the parent so Carwise retains one visual system.
// The parent also supplies Card and ActionButton to avoid duplicating interaction semantics.
