import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, alpha } from '../theme';
import { useReducedMotion } from '../motion';

const MODES = [
  { id: 'photo', label: 'Photo', icon: 'camera-outline', hint: 'High-quality still' },
  { id: 'video', label: 'Video', icon: 'videocam-outline', hint: 'Short evidence clip' },
  { id: 'voice', label: 'Voice', icon: 'mic-outline', hint: 'Describe what you noticed' },
];
const GUIDES = ['FRONT 3/4', 'REAR 3/4', 'DRIVER SIDE', 'PASSENGER SIDE', 'INTERIOR', 'ENGINE BAY'];

export function CaptureModeSelector({ mode, onChange }) {
  return <View style={styles.modeBar}>{MODES.map((item) => <Pressable key={item.id} onPress={() => onChange?.(item.id)} style={({ pressed }) => [styles.mode, mode === item.id && styles.modeActive, pressed && { opacity: 0.72 }]} accessibilityRole="tab" accessibilityState={{ selected: mode === item.id }}><Ionicons name={item.icon} size={17} color={mode === item.id ? COLORS.bg : COLORS.textSecondary} /><Text style={[styles.modeText, mode === item.id && styles.modeTextActive]}>{item.label}</Text></Pressable>)}</View>;
}

export function CameraViewport({ mode = 'photo', guideIndex = 0, onCapture, onOpenGallery }) {
  const reduceMotion = useReducedMotion();
  const scan = useRef(new Animated.Value(0)).current;
  const focus = useRef(new Animated.Value(0)).current;
  const [focusPoint, setFocusPoint] = useState(null);
  useEffect(() => {
    if (reduceMotion || mode !== 'photo') return undefined;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(scan, { toValue: 1, duration: 1900, useNativeDriver: true }),
      Animated.timing(scan, { toValue: 0, duration: 1900, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [mode, reduceMotion, scan]);
  const onFocus = () => { setFocusPoint({ x: 0.5, y: 0.42 }); Animated.sequence([Animated.timing(focus, { toValue: 1, duration: 120, useNativeDriver: true }), Animated.spring(focus, { toValue: 0, useNativeDriver: true, damping: 13 })]).start(); };
  const translateY = scan.interpolate({ inputRange: [0, 1], outputRange: [-118, 118] });
  return <View style={styles.viewport}>
    <View style={styles.cameraTop}><View style={styles.cameraStatus}><View style={styles.liveDot} /><Text style={styles.liveText}>{mode === 'video' ? 'RECORDING READY' : mode === 'voice' ? 'VOICE READY' : 'CAMERA READY'}</Text></View><View style={styles.cameraTools}><Pressable style={styles.toolButton}><Ionicons name="flash-off-outline" size={18} color={COLORS.text} /></Pressable><Pressable style={styles.toolButton} onPress={onOpenGallery}><Ionicons name="images-outline" size={18} color={COLORS.text} /></Pressable></View></View>
    <View style={styles.guideFrame}><View style={styles.cornerTopLeft} /><View style={styles.cornerTopRight} /><View style={styles.cornerBottomLeft} /><View style={styles.cornerBottomRight} /><View style={styles.vehicleGhost}><Ionicons name="car-sport-outline" size={72} color={alpha(COLORS.text, 0.18)} /></View>{mode === 'photo' ? <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} /> : null}{focusPoint ? <Animated.View style={[styles.focusRing, { opacity: focus }]}><View style={styles.focusCross} /></Animated.View> : null}</View>
    <View style={styles.cameraOverlay}><Text style={styles.guideTitle}>{mode === 'voice' ? 'Tap record and describe what you noticed' : `Capture ${GUIDES[guideIndex]}`}</Text><Text style={styles.guideBody}>{mode === 'photo' ? 'Keep the entire panel inside the frame and avoid glare.' : mode === 'video' ? 'Record 5–15 seconds with the subject clearly visible.' : 'Use your natural voice; CarWise will attach your note to this step.'}</Text></View>
    <Pressable onPress={onFocus} style={styles.tapFocus} accessibilityRole="button" accessibilityLabel="Focus camera">{focusPoint ? <Text style={styles.focusText}>FOCUS</Text> : null}</Pressable>
    <View style={styles.cameraBottom}><View style={styles.guideCounter}><Text style={styles.guideCounterValue}>{guideIndex + 1}</Text><Text style={styles.guideCounterSlash}>/</Text><Text style={styles.guideCounterTotal}>{GUIDES.length}</Text></View><Pressable onPress={onCapture} style={styles.shutter} accessibilityRole="button" accessibilityLabel={`Capture ${mode}`}><View style={[styles.shutterInner, mode === 'video' && styles.shutterVideo, mode === 'voice' && styles.shutterVoice]}>{mode === 'voice' ? <Ionicons name="mic" size={26} color={COLORS.bg} /> : mode === 'video' ? <View style={styles.videoStop} /> : null}</View></Pressable><View style={styles.flipSpacer}><Ionicons name="scan-outline" size={21} color={COLORS.textSecondary} /></View></View>
  </View>;
}

export function CaptureGuide({ active = 0, completed = [], onSelect }) {
  return <View style={styles.guideList}>{GUIDES.map((label, index) => { const done = completed.includes(index); return <Pressable key={label} onPress={() => onSelect?.(index)} style={({ pressed }) => [styles.guideItem, index === active && styles.guideItemActive, pressed && { opacity: 0.74 }]}><View style={[styles.guideIcon, done && styles.guideIconDone, index === active && styles.guideIconActive]}>{done ? <Ionicons name="checkmark" size={14} color={COLORS.bg} /> : <Text style={styles.guideIndex}>{index + 1}</Text>}</View><View style={COMMON.fill}><Text style={[styles.guideLabel, index === active && { color: COLORS.text }]}>{label}</Text><Text style={styles.guideHint}>{done ? 'Evidence captured' : index === active ? 'Capture now' : 'Recommended'}</Text></View>{index === active ? <Ionicons name="chevron-forward" size={15} color={COLORS.cyan} /> : null}</Pressable>; })}</View>;
}

export function RecordingPill({ running, duration = '00:00', onStop }) {
  const reduceMotion = useReducedMotion();
  const pulse = useRef(new Animated.Value(0.35)).current;
  useEffect(() => { if (!running || reduceMotion) { pulse.setValue(running ? 1 : 0.35); return undefined; } const loop = Animated.loop(Animated.sequence([Animated.timing(pulse, { toValue: 1, duration: 450, useNativeDriver: true }), Animated.timing(pulse, { toValue: 0.25, duration: 650, useNativeDriver: true })])); loop.start(); return () => loop.stop(); }, [pulse, reduceMotion, running]);
  return <View style={styles.recording}><Animated.View style={[styles.recordDot, { opacity: pulse }]} /><Text style={styles.recordTime}>{duration}</Text><Text style={styles.recordLabel}>{running ? 'Recording' : 'Ready'}</Text><Pressable onPress={onStop} disabled={!running} style={[styles.recordStop, !running && { opacity: 0.45 }]}><Ionicons name="stop" size={11} color={COLORS.bg} /></Pressable></View>;
}

export function AudioWaveform({ bars = 28, active = false }) {
  const reduceMotion = useReducedMotion();
  const values = Array.from({ length: bars }).map((_, index) => 8 + ((index * 19) % 23));
  return <View style={styles.wave}>{values.map((height, index) => <Animated.View key={index} style={[styles.waveBar, { height: active && !reduceMotion ? height + ((index % 5) * 4) : height, opacity: active ? 0.9 : 0.4 }]} />)}</View>;
}

const styles = StyleSheet.create({
  modeBar: { flexDirection: 'row', gap: 7, marginBottom: 11 },
  mode: { flex: 1, minHeight: 44, borderRadius: 14, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  modeActive: { backgroundColor: COLORS.cyan, borderColor: COLORS.cyan },
  modeText: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '800' },
  modeTextActive: { color: COLORS.bg },
  viewport: { height: 514, overflow: 'hidden', borderRadius: 25, borderWidth: 1, borderColor: alpha(COLORS.cyan, 0.21), backgroundColor: '#030912', position: 'relative' },
  cameraTop: { position: 'absolute', left: 12, right: 12, top: 13, zIndex: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cameraStatus: { borderRadius: 99, backgroundColor: alpha(COLORS.bg, 0.72), paddingHorizontal: 9, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.cyan },
  liveText: { color: COLORS.text, fontSize: 8, fontWeight: '850', letterSpacing: 0.7 },
  cameraTools: { flexDirection: 'row', gap: 7 },
  toolButton: { width: 34, height: 34, borderRadius: 11, backgroundColor: alpha(COLORS.bg, 0.7), alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: alpha(COLORS.text, 0.1) },
  guideFrame: { position: 'absolute', left: 30, right: 30, top: 78, bottom: 112, borderRadius: 26, borderWidth: 1, borderColor: alpha(COLORS.text, 0.12), overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  cornerTopLeft: { position: 'absolute', left: -1, top: -1, width: 43, height: 43, borderTopWidth: 3, borderLeftWidth: 3, borderColor: COLORS.cyan, borderTopLeftRadius: 23 },
  cornerTopRight: { position: 'absolute', right: -1, top: -1, width: 43, height: 43, borderTopWidth: 3, borderRightWidth: 3, borderColor: COLORS.cyan, borderTopRightRadius: 23 },
  cornerBottomLeft: { position: 'absolute', left: -1, bottom: -1, width: 43, height: 43, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: COLORS.cyan, borderBottomLeftRadius: 23 },
  cornerBottomRight: { position: 'absolute', right: -1, bottom: -1, width: 43, height: 43, borderBottomWidth: 3, borderRightWidth: 3, borderColor: COLORS.cyan, borderBottomRightRadius: 23 },
  vehicleGhost: { opacity: 0.8 },
  scanLine: { position: 'absolute', left: 14, right: 14, height: 1, backgroundColor: COLORS.cyan, shadowColor: COLORS.cyan, shadowOpacity: 0.9, shadowRadius: 9 },
  focusRing: { position: 'absolute', width: 68, height: 68, borderWidth: 1, borderColor: COLORS.amber, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  focusCross: { width: 2, height: 36, backgroundColor: alpha(COLORS.amber, 0.7) },
  cameraOverlay: { position: 'absolute', left: 24, right: 24, bottom: 96, alignItems: 'center' },
  guideTitle: { color: COLORS.text, fontSize: 14, fontWeight: '900', textAlign: 'center' },
  guideBody: { color: COLORS.textSecondary, fontSize: 9, lineHeight: 14, marginTop: 5, textAlign: 'center', maxWidth: 290 },
  tapFocus: { position: 'absolute', left: 60, right: 60, top: 130, bottom: 180 },
  focusText: { alignSelf: 'center', color: COLORS.amber, fontSize: 8, fontWeight: '850', letterSpacing: 0.8, marginTop: 76 },
  cameraBottom: { position: 'absolute', left: 24, right: 24, bottom: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  guideCounter: { width: 60, flexDirection: 'row', alignItems: 'baseline' },
  guideCounterValue: { color: COLORS.text, fontSize: 18, fontWeight: '900' },
  guideCounterSlash: { color: COLORS.textTertiary, marginHorizontal: 2 },
  guideCounterTotal: { color: COLORS.textTertiary, fontSize: 12, fontWeight: '800' },
  shutter: { width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: COLORS.text, alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.text, alignItems: 'center', justifyContent: 'center' },
  shutterVideo: { backgroundColor: COLORS.coral },
  shutterVoice: { backgroundColor: COLORS.cyan },
  videoStop: { width: 19, height: 19, borderRadius: 5, backgroundColor: COLORS.bg },
  flipSpacer: { width: 60, alignItems: 'flex-end' },
  guideList: { gap: 7 },
  guideItem: { minHeight: 65, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 9 },
  guideItemActive: { borderColor: alpha(COLORS.cyan, 0.37), backgroundColor: alpha(COLORS.cyan, 0.045) },
  guideIcon: { width: 33, height: 33, borderRadius: 12, backgroundColor: COLORS.surfaceSoft, alignItems: 'center', justifyContent: 'center' },
  guideIconDone: { backgroundColor: COLORS.mint },
  guideIconActive: { backgroundColor: COLORS.cyan },
  guideIndex: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '900' },
  guideLabel: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '850' },
  guideHint: { color: COLORS.textTertiary, fontSize: 8, marginTop: 2 },
  recording: { minHeight: 45, borderRadius: 15, borderWidth: 1, borderColor: alpha(COLORS.coral, 0.3), backgroundColor: alpha(COLORS.coral, 0.07), flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11, gap: 7 },
  recordDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.coral },
  recordTime: { color: COLORS.text, fontSize: 11, fontWeight: '900', fontVariant: ['tabular-nums'] },
  recordLabel: { color: COLORS.textSecondary, fontSize: 9, flex: 1 },
  recordStop: { width: 28, height: 28, borderRadius: 9, backgroundColor: COLORS.coral, alignItems: 'center', justifyContent: 'center' },
  wave: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, minHeight: 54, borderRadius: 15, backgroundColor: alpha(COLORS.cyan, 0.05), paddingHorizontal: 10 },
  waveBar: { width: 3, borderRadius: 3, backgroundColor: COLORS.cyan },
});
