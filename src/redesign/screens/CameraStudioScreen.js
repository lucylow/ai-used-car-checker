import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { Badge, PrimaryButton, Screen, ScreenHeader, SectionHeader, SecondaryButton, SurfaceCard } from '../components/Primitives';
import { AudioWaveform, CameraViewport, CaptureGuide, CaptureModeSelector, RecordingPill } from '../components/MediaCapture';
import { EvidenceGallery } from '../components/Media';
import { MetricPill } from '../components/Advanced';
import { AIQualityCard } from '../components/AI';

const guideLabels = ['Front 3/4', 'Rear 3/4', 'Driver side', 'Passenger side', 'Interior', 'Engine bay'];

export default function CameraStudioScreen({ data, actions }) {
  const [mode, setMode] = useState('photo');
  const [guideIndex, setGuideIndex] = useState(0);
  const [completed, setCompleted] = useState([0, 1]);
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(8);
  const addCapture = () => { setCompleted((items) => items.includes(guideIndex) ? items : [...items, guideIndex]); setGuideIndex((index) => Math.min(guideLabels.length - 1, index + 1)); Alert.alert('Evidence captured', `${guideLabels[guideIndex]} is now linked to the inspection.`); actions?.onCapturePhoto?.(); };
  const nextGuide = (index) => setGuideIndex(Math.max(0, Math.min(guideLabels.length - 1, index)));
  return <Screen scroll contentStyle={styles.content}>
    <ScreenHeader title="Camera Studio" subtitle="Capture better evidence with visual guidance." onBack={actions?.onBack} right={<Badge tone="cyan" label={`${completed.length}/${guideLabels.length}`} />} />
    <CaptureModeSelector mode={mode} onChange={setMode} />
    <CameraViewport mode={mode} guideIndex={guideIndex} onCapture={mode === 'voice' ? () => setRecording(true) : addCapture} onOpenGallery={actions?.onOpenGallery} />
    {mode === 'voice' ? <View style={{ marginTop: 9 }}><RecordingPill running={recording} duration={`00:${String(duration).padStart(2, '0')}`} onStop={() => setRecording(false)} /><AudioWaveform active={recording} /></View> : null}
    <SectionHeader title="Capture checklist" subtitle="Follow the visual sequence" style={{ marginTop: 18 }} />
    <CaptureGuide active={guideIndex} completed={completed} onSelect={nextGuide} />
    <SectionHeader title="Capture quality" subtitle="Before AI analysis" style={{ marginTop: 18 }} />
    <AIQualityCard score={recording ? 86 : 93} />
    <SurfaceCard tone="blue" style={{ marginTop: 10 }}><View style={COMMON.row}><View style={styles.tipIcon}><Ionicons name="sunny-outline" size={20} color={COLORS.amber} /></View><View style={COMMON.fill}><Text style={styles.tipTitle}>Lighting tip</Text><Text style={styles.tipBody}>Natural, indirect light produces cleaner paint and surface evidence than harsh direct reflections.</Text></View></View></SurfaceCard>
    <SectionHeader title="Current evidence" subtitle={`${data.photos?.length || 0} existing photos`} style={{ marginTop: 18 }} />
    <EvidenceGallery items={data.photos?.slice(0, 6) || []} onOpen={(photo) => actions?.onOpenPhoto?.(photo)} />
    <View style={styles.summary}><MetricPill label="COMPLETE" value={`${completed.length}/${guideLabels.length}`} tone="mint" /><MetricPill label="PHOTO" value="8" tone="cyan" /><MetricPill label="VIDEO" value="1" tone="blue" /><MetricPill label="VOICE" value="2" tone="amber" /></View>
    <PrimaryButton label="Continue to AI analysis" icon="sparkles" onPress={() => actions?.onNavigate?.('ai')} style={{ marginTop: 13 }} /><SecondaryButton label="Add document evidence" icon="document-attach-outline" onPress={actions?.onPickDocument} style={{ marginTop: 8, marginBottom: 30 }} />
  </Screen>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  tipIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: alpha(COLORS.amber, 0.1), alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  tipTitle: { color: COLORS.text, fontSize: 11, fontWeight: '850' },
  tipBody: { color: COLORS.textSecondary, fontSize: 9, lineHeight: 14, marginTop: 2 },
  summary: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
});
