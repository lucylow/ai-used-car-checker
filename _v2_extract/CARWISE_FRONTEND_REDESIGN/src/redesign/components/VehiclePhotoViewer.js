import React, { useMemo, useRef, useState } from 'react';
import { Dimensions, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, alpha } from '../theme';

const { width, height } = Dimensions.get('window');

export function FullscreenEvidenceViewer({ visible, photos = [], initialIndex = 0, onClose, onSelectFinding }) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const active = photos[index];
  const findings = active?.findings || [];
  const scale = useRef(1);
  const startScale = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const pinch = Gesture.Pinch().onBegin(() => { startScale.current = scale.current; }).onUpdate((event) => { const next = Math.max(1, Math.min(3.5, startScale.current * event.scale)); scale.current = next; setZoom(next); }).onEnd(() => { if (scale.current === 1) { panRef.current = { x: 0, y: 0 }; setPan({ x: 0, y: 0 }); } });
  const drag = Gesture.Pan().onUpdate((event) => { if (scale.current <= 1) return; panRef.current = { x: event.translationX, y: event.translationY }; setPan(panRef.current); });
  const gestures = Gesture.Simultaneous(pinch, drag);
  const go = (delta) => { const next = (index + delta + photos.length) % photos.length; setIndex(next); setZoom(1); scale.current = 1; setPan({ x: 0, y: 0 }); };
  if (!active) return null;
  return <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
    <View style={styles.root}><View style={styles.backdrop} />
      <View style={styles.header}><Pressable onPress={onClose} style={styles.headerButton}><Ionicons name="close" size={22} color={COLORS.text} /></Pressable><View style={COMMON.fill}><Text style={styles.headerTitle}>{active.label || 'Evidence photo'}</Text><Text style={styles.headerMeta}>{index + 1} / {photos.length} · {active.time || 'Captured today'}</Text></View><Pressable onPress={() => onSelectFinding?.(active)} style={styles.headerButton}><Ionicons name="ellipsis-horizontal" size={21} color={COLORS.text} /></Pressable></View>
      <GestureDetector gesture={gestures}><View style={styles.imageArea}><Image source={typeof (active.source || active.uri) === 'string' ? { uri: active.source || active.uri } : (active.source || active.uri)} resizeMode="contain" style={[styles.image, { transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: zoom }] }]} />{findings.map((finding) => <Pressable key={finding.id} onPress={() => onSelectFinding?.(finding)} style={[styles.marker, { left: `${finding.x || 50}%`, top: `${finding.y || 50}%` }]}><View style={styles.markerDot}><Ionicons name="warning" size={9} color={COLORS.bg} /></View><Text style={styles.markerLabel}>{finding.label || 'Finding'}</Text></Pressable>)}</View></GestureDetector>
      <View style={styles.bottom}><View style={styles.findingStrip}>{findings.length ? findings.map((finding) => <Pressable key={finding.id} onPress={() => onSelectFinding?.(finding)} style={styles.finding}><View style={[styles.findingDot, { backgroundColor: finding.tone === 'coral' ? COLORS.coral : COLORS.amber }]} /><View style={COMMON.fill}><Text style={styles.findingTitle}>{finding.label}</Text><Text style={styles.findingMeta}>{finding.confidence || 90}% confidence</Text></View><Ionicons name="chevron-forward" size={15} color={COLORS.textTertiary} /></Pressable>) : <Text style={styles.noFindings}>No annotations on this image.</Text>}</View><View style={styles.nav}><Pressable onPress={() => go(-1)} style={styles.navButton}><Ionicons name="chevron-back" size={20} color={COLORS.text} /></Pressable><Text style={styles.zoomText}>{Math.round(zoom * 100)}%</Text><Pressable onPress={() => go(1)} style={styles.navButton}><Ionicons name="chevron-forward" size={20} color={COLORS.text} /></Pressable></View></View>
    </View>
  </Modal>;
}

export function EvidenceStrip({ photos = [], activeId, onSelect }) {
  return <View><Text style={styles.stripLabel}>EVIDENCE</Text><View style={styles.thumbRow}>{photos.map((photo) => <Pressable key={photo.id} onPress={() => onSelect?.(photo)} style={[styles.thumb, activeId === photo.id && styles.thumbActive]}><Image source={typeof (photo.source || photo.uri) === 'string' ? { uri: photo.source || photo.uri } : (photo.source || photo.uri)} style={styles.thumbImage} /><View style={styles.thumbOverlay}><Text style={styles.thumbText}>{photo.type || 'PHOTO'}</Text></View>{photo.findings?.length ? <View style={styles.findingCount}><Text style={styles.findingCountText}>{photo.findings.length}</Text></View> : null}</Pressable>)}</View></View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
  header: { minHeight: 76, paddingTop: 26, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: alpha(COLORS.bg, 0.8) },
  headerButton: { width: 38, height: 38, borderRadius: 13, backgroundColor: alpha(COLORS.text, 0.08), alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: COLORS.text, fontSize: 12, fontWeight: '850' },
  headerMeta: { color: COLORS.textTertiary, fontSize: 8, marginTop: 2 },
  imageArea: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  image: { width, height: height * 0.62 },
  marker: { position: 'absolute', transform: [{ translateX: -13 }, { translateY: -13 }], alignItems: 'center' },
  markerDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.amber, borderWidth: 3, borderColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  markerLabel: { color: COLORS.text, backgroundColor: alpha(COLORS.bg, 0.82), fontSize: 7, fontWeight: '850', borderRadius: 6, paddingHorizontal: 5, paddingVertical: 3, marginTop: 3 },
  bottom: { paddingBottom: 22, backgroundColor: alpha(COLORS.bg, 0.92), paddingHorizontal: 14, paddingTop: 11 },
  findingStrip: { maxHeight: 80 },
  finding: { minHeight: 50, flexDirection: 'row', alignItems: 'center', gap: 7 },
  findingDot: { width: 7, height: 7, borderRadius: 3.5 },
  findingTitle: { color: COLORS.text, fontSize: 10, fontWeight: '800' },
  findingMeta: { color: COLORS.textTertiary, fontSize: 8, marginTop: 2 },
  noFindings: { color: COLORS.textTertiary, fontSize: 9, paddingVertical: 14 },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 7 },
  navButton: { width: 43, height: 43, borderRadius: 15, backgroundColor: COLORS.surfaceSoft, alignItems: 'center', justifyContent: 'center' },
  zoomText: { color: COLORS.textSecondary, fontSize: 9, fontWeight: '800' },
  stripLabel: { color: COLORS.textTertiary, fontSize: 8, fontWeight: '850', letterSpacing: 1, marginBottom: 7 },
  thumbRow: { flexDirection: 'row', gap: 7 },
  thumb: { width: 74, height: 64, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  thumbActive: { borderColor: COLORS.cyan, borderWidth: 2 },
  thumbImage: { width: '100%', height: '100%' },
  thumbOverlay: { position: 'absolute', left: 4, bottom: 4, borderRadius: 5, backgroundColor: alpha(COLORS.bg, 0.76), paddingHorizontal: 4, paddingVertical: 2 },
  thumbText: { color: COLORS.text, fontSize: 6, fontWeight: '850' },
  findingCount: { position: 'absolute', top: 4, right: 4, minWidth: 17, height: 17, borderRadius: 8.5, backgroundColor: COLORS.coral, alignItems: 'center', justifyContent: 'center' },
  findingCountText: { color: COLORS.bg, fontSize: 7, fontWeight: '900' },
});
