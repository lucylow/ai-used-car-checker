import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { canApplyDecodedVehicle, decodeVin, getVinResultCompleteness } from '../src/services/vinService';
import { getInspectionNavigationLabel, getToolInputGuidance, getVinWalkthroughStep } from '../src/services/reportUtils';

function VinTool({ onHome, onUse, Card, ActionButton, colors, styles }) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

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

  const vehicleLabel = result?.vehicle ? [result.vehicle.year, result.vehicle.make, result.vehicle.model].filter(Boolean).join(' ') : '';
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
      <ActionButton accessibilityLabel="Decode VIN" accessibilityHint="Looks up vehicle details from the entered VIN" disabled={busy} label={busy ? 'Decoding…' : 'Decode VIN'} onPress={runDecode} />
    </Card>
    {result?.status === 'decoded' ? <Card style={styles.resultCard}><Text style={styles.cardEyebrow}>LIVE RESULT</Text><Text style={styles.cardTitle}>{vehicleLabel || 'Vehicle identity returned'}</Text><Text style={styles.muted}>Identity fields returned: {resultCompleteness.present}/{resultCompleteness.total}{resultCompleteness.complete ? ' · Ready to use' : ' · Review before using'}</Text>{result.vehicle.trim ? <Text style={styles.muted}>Trim: {result.vehicle.trim}</Text> : null}{result.vehicle.bodyClass ? <Text style={styles.muted}>Body: {result.vehicle.bodyClass}</Text> : null}{result.vehicle.engine ? <Text style={styles.muted}>Engine: {result.vehicle.engine}</Text> : null}<Text style={styles.muted}>{resultCompleteness.complete ? 'All required identity fields are available.' : 'Complete the missing identity fields manually before applying this result.'}</Text><TouchableOpacity accessibilityRole="button" accessibilityLabel={resultCompleteness.complete ? `Use ${vehicleLabel || 'decoded vehicle'} in inspection` : 'Apply decoded vehicle unavailable until identity is complete'} accessibilityState={{ disabled: !resultCompleteness.complete }} disabled={!canApplyDecodedVehicle(result.vehicle)} style={[styles.secondaryButton, !resultCompleteness.complete && styles.disabledButton]} onPress={() => onUse({ year: result.vehicle.year, make: result.vehicle.make, model: result.vehicle.model, vin: result.vin })}><Text style={styles.secondaryButtonText}>{resultCompleteness.complete ? 'Use in inspection' : 'Complete identity first'}</Text></TouchableOpacity></Card> : null}
    {result?.status === 'fallback' ? <Card style={styles.resultCard}><Text style={styles.cardEyebrow}>OFFLINE FALLBACK</Text><Text style={styles.muted}>No vehicle details were changed. You can retry the lookup or continue entering details manually.</Text></Card> : null}
    {result?.status === 'error' ? <Card style={styles.resultCard}><Text style={styles.cardEyebrow}>CHECK THE VIN</Text><Text style={styles.muted}>{result.message}</Text><Text style={styles.muted}>Your inspection details remain unchanged. Correct the VIN and try again.</Text></Card> : null}
  </ScrollView>;
}

export default VinTool;

// Component styles are supplied by the parent so Carwise retains one visual system.
// The parent also supplies Card and ActionButton to avoid duplicating interaction semantics.
