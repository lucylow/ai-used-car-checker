import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { Badge, PrimaryButton, Screen, ScreenHeader, SecondaryButton, SegmentedControl, SurfaceCard } from '../components/Primitives';
import { AnnotationOverlay, EvidenceGallery, GalleryLightbox, VideoEvidenceCard } from '../components/Media';
import { AIQualityCard } from '../components/AI';

const MODES = [
  { value: 'photo', label: 'Photo', icon: 'camera-outline' },
  { value: 'video', label: 'Video', icon: 'videocam-outline' },
  { value: 'gallery', label: 'Gallery', icon: 'images-outline' },
];

export default function MediaScreen({ data, actions }) {
  const [mode, setMode] = useState('gallery');
  const [selected, setSelected] = useState(null);
  const [lightbox, setLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const photos = data.photos || [];
  return <Screen contentStyle={styles.content}>
    <ScreenHeader title="Evidence" subtitle="Photos are the backbone of your AI-assisted inspection." onBack={actions?.onBack} right={<Badge tone="cyan" label={`${photos.length} ITEMS`} />} />
    <SegmentedControl options={MODES} value={mode} onChange={(value) => { setMode(value); if (value === 'photo') actions?.onCapturePhoto?.(); if (value === 'video') actions?.onCaptureVideo?.(); }} />

    {mode === 'photo' ? <CaptureCard onCapture={actions?.onCapturePhoto} /> : null}
    {mode === 'video' ? <VideoMode actions={actions} /> : null}
    {mode === 'gallery' ? <GalleryMode photos={photos} onOpen={(item) => { const index = photos.findIndex((photo) => photo.id === item.id); setLightboxIndex(Math.max(0, index)); setLightbox(true); }} onAdd={actions?.onCapturePhoto} /> : null}

    <View style={{ marginTop: 20 }}><AIQualityCard evidenceCount={photos.length} findingCount={data.findings?.length || data.issues?.length || 0} confidence={data.aiConfidence || 0.86} /></View>
    {selected ? <EvidenceDetail item={selected} onClose={() => setSelected(null)} onAnalyze={() => actions?.onAnalyzeEvidence?.(selected)} /> : null}
    <GalleryLightbox visible={lightbox} items={photos} index={lightboxIndex} onClose={() => setLightbox(false)} onChange={setLightboxIndex} />
  </Screen>;
}

function CaptureCard({ onCapture }) {
  return <SurfaceCard tone="cyan" style={styles.captureCard}><View style={styles.capturePreview}><View style={styles.captureCorners}><View style={[styles.corner, styles.cornerTL]} /><View style={[styles.corner, styles.cornerTR]} /><View style={[styles.corner, styles.cornerBL]} /><View style={[styles.corner, styles.cornerBR]} /></View><View style={styles.captureVehicle}><View style={styles.captureCabin} /><View style={styles.captureLightOne} /><View style={styles.captureLightTwo} /><View style={styles.captureWheelOne} /><View style={styles.captureWheelTwo} /></View><View style={styles.scanLine} /><Badge tone="cyan" label="ALIGN VEHICLE AREA" icon="scan-outline" /></View><Text style={TYPOGRAPHY.h3}>Capture a useful frame</Text><Text style={styles.captureText}>Center the panel, avoid glare, and keep enough context around the suspected issue.</Text><PrimaryButton label="Open camera" icon="camera" onPress={onCapture} /></SurfaceCard>;
}

function VideoMode({ actions }) {
  return <View><SurfaceCard tone="blue"><View style={COMMON.rowBetween}><View><Text style={TYPOGRAPHY.eyebrow}>10–20 SECOND CLIP</Text><Text style={TYPOGRAPHY.h3}>Capture motion or sound</Text></View><Badge tone="blue" label="MULTIMODAL" /></View><Text style={styles.captureText}>Useful for engine startup, walkaround, dashboard warnings, suspension noise, or a test-drive observation.</Text><View style={styles.videoTargets}>{['Engine startup', 'Dashboard', 'Walkaround', 'Suspension', 'Brake response'].map((label) => <View key={label} style={styles.videoTarget}><Ionicons name="videocam-outline" size={15} color={COLORS.cyan} /><Text style={styles.videoTargetText}>{label}</Text></View>)}</View><PrimaryButton label="Record video" icon="videocam" onPress={actions?.onCaptureVideo} /></SurfaceCard><VideoEvidenceCard title="Engine running" duration="00:10" events={[{ second: 3, label: 'Possible vibration', tone: 'amber' }, { second: 7, label: 'Dashboard indicator visible', tone: 'coral' }]} onPlay={actions?.onPlayVideo} /></View>;
}

function GalleryMode({ photos, onOpen, onAdd }) {
  return <View><SurfaceCard><View style={COMMON.rowBetween}><View><Text style={TYPOGRAPHY.eyebrow}>INSPECTION GALLERY</Text><Text style={TYPOGRAPHY.h3}>Evidence by vehicle area</Text></View><Pressable onPress={onAdd} style={styles.addCircle}><Ionicons name="add" size={20} color={COLORS.white} /></Pressable></View>{photos.length ? <EvidenceGallery items={photos} onOpen={onOpen} onAdd={onAdd} /> : <View style={styles.emptyGallery}><Ionicons name="images-outline" size={29} color={COLORS.textTertiary} /><Text style={styles.emptyTitle}>No evidence yet</Text><Text style={styles.emptyText}>Start with the front 3/4 photo, then capture anything that looks different.</Text><SecondaryButton label="Add first photo" icon="camera" onPress={onAdd} /></View>}</SurfaceCard></View>;
}

function EvidenceDetail({ item, onClose, onAnalyze }) {
  return <SurfaceCard tone="blue" style={{ marginTop: 18 }}><View style={COMMON.rowBetween}><View><Text style={TYPOGRAPHY.eyebrow}>SELECTED EVIDENCE</Text><Text style={TYPOGRAPHY.h3}>{item.label || item.zone || 'Evidence'}</Text></View><Pressable onPress={onClose}><Ionicons name="close-circle-outline" size={22} color={COLORS.textSecondary} /></Pressable></View><View style={styles.selectedMedia}>{item.uri ? <Image source={{ uri: item.uri }} resizeMode="cover" style={StyleSheet.absoluteFillObject} /> : <View style={styles.placeholderSelected}><Ionicons name="car-outline" size={42} color={COLORS.textTertiary} /><Text style={styles.emptyText}>Sample vehicle evidence</Text></View>}<AnnotationOverlay annotations={[{ id: 'a1', label: 'Possible scratch', x: 58, y: 46, tone: 'amber' }, { id: 'a2', label: 'Paint edge', x: 25, y: 68, tone: 'cyan' }]} onSelect={() => {}} /></View><Text style={styles.selectedText}>Review the AI overlay, then confirm or edit the observation. AI annotations remain estimates until reviewed.</Text><View style={{ flexDirection: 'row', gap: 8, marginTop: 13 }}><SecondaryButton label="Close" onPress={onClose} style={{ flex: 1 }} /><PrimaryButton label="Analyze evidence" icon="sparkles" onPress={onAnalyze} compact style={{ flex: 1 }} /></View></SurfaceCard>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  captureCard: { marginTop: 15 },
  capturePreview: { height: 260, borderRadius: 19, borderWidth: 1, borderColor: alpha(COLORS.cyan, 0.24), backgroundColor: '#06101B', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative', marginBottom: 15 },
  captureCorners: { position: 'absolute', left: 17, right: 17, top: 17, bottom: 17 },
  corner: { position: 'absolute', width: 28, height: 28, borderColor: COLORS.cyan },
  cornerTL: { left: 0, top: 0, borderLeftWidth: 2, borderTopWidth: 2, borderTopLeftRadius: 7 },
  cornerTR: { right: 0, top: 0, borderRightWidth: 2, borderTopWidth: 2, borderTopRightRadius: 7 },
  cornerBL: { left: 0, bottom: 0, borderLeftWidth: 2, borderBottomWidth: 2, borderBottomLeftRadius: 7 },
  cornerBR: { right: 0, bottom: 0, borderRightWidth: 2, borderBottomWidth: 2, borderBottomRightRadius: 7 },
  captureVehicle: { width: '54%', height: '40%', borderRadius: 40, borderWidth: 2, borderColor: alpha(COLORS.cyan, 0.5), backgroundColor: alpha(COLORS.blue, 0.07), position: 'relative' },
  captureCabin: { position: 'absolute', width: '50%', height: '46%', left: '25%', top: '-26%', borderRadius: 17, borderWidth: 2, borderColor: alpha(COLORS.cyan, 0.32) },
  captureLightOne: { position: 'absolute', left: 10, top: '43%', width: 18, height: 7, borderRadius: 4, backgroundColor: COLORS.cyan },
  captureLightTwo: { position: 'absolute', right: 10, top: '43%', width: 18, height: 7, borderRadius: 4, backgroundColor: COLORS.cyan },
  captureWheelOne: { position: 'absolute', left: 12, bottom: -17, width: 30, height: 40, borderRadius: 15, backgroundColor: '#050A12', borderWidth: 2, borderColor: COLORS.borderStrong },
  captureWheelTwo: { position: 'absolute', right: 12, bottom: -17, width: 30, height: 40, borderRadius: 15, backgroundColor: '#050A12', borderWidth: 2, borderColor: COLORS.borderStrong },
  scanLine: { position: 'absolute', left: '12%', right: '12%', top: '47%', height: 2, backgroundColor: alpha(COLORS.cyan, 0.7), shadowColor: COLORS.cyan, shadowOpacity: 0.6, shadowRadius: 12, shadowOffset: { width: 0, height: 0 } },
  captureText: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 17, marginTop: 6, marginBottom: 14 },
  videoTargets: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 14 },
  videoTarget: { minHeight: 33, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surfaceElevated, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8 },
  videoTargetText: { color: COLORS.textSecondary, fontSize: 9, fontWeight: '750' },
  addCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.blue, alignItems: 'center', justifyContent: 'center' },
  emptyGallery: { alignItems: 'center', paddingVertical: 31 },
  emptyTitle: { color: COLORS.text, fontSize: 14, fontWeight: '800', marginTop: 8 },
  emptyText: { color: COLORS.textTertiary, fontSize: 11, lineHeight: 16, textAlign: 'center', maxWidth: 290, marginTop: 4, marginBottom: 12 },
  selectedMedia: { height: 245, borderRadius: 18, overflow: 'hidden', backgroundColor: COLORS.bg, marginTop: 13, position: 'relative' },
  placeholderSelected: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  selectedText: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 17, marginTop: 10 },
});
