import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { useReducedMotion } from '../motion';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

export function GlassStat({ icon = 'sparkles-outline', label, value, hint, tone = 'cyan', onPress }) {
  const color = tone === 'mint' ? COLORS.mint : tone === 'amber' ? COLORS.amber : tone === 'coral' ? COLORS.coral : COLORS.cyan;
  return <Pressable disabled={!onPress} onPress={onPress} style={({ pressed }) => [styles.glass, pressed && styles.pressed, { borderColor: alpha(color, 0.25) }]}>
    <View style={[styles.glassIcon, { backgroundColor: alpha(color, 0.1) }]}><Ionicons name={icon} size={17} color={color} /></View>
    <View style={COMMON.fill}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text>{hint ? <Text style={styles.hint}>{hint}</Text> : null}</View>
  </Pressable>;
}

export function InsightCarousel({ items = [], onOpen }) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel} snapToInterval={WINDOW_WIDTH * 0.78 + 12} decelerationRate="fast">
    {items.map((item) => <Pressable key={item.id} onPress={() => onOpen?.(item)} style={({ pressed }) => [styles.insightCard, pressed && styles.pressed]}>
      <View style={styles.insightTop}><View style={[styles.smallDot, { backgroundColor: item.color || COLORS.cyan }]} /><Text style={styles.insightLabel}>{item.label}</Text><Ionicons name="arrow-up-right" size={15} color={COLORS.textTertiary} /></View>
      <Text style={styles.insightTitle}>{item.title}</Text>
      <Text style={styles.insightBody}>{item.body}</Text>
      <View style={styles.insightFooter}><Text style={[styles.insightMetric, { color: item.color || COLORS.cyan }]}>{item.metric}</Text><Text style={styles.insightAction}>View evidence</Text></View>
    </Pressable>)}
  </ScrollView>;
}

export function EvidenceTimeline({ events = [], compact = false }) {
  return <View style={styles.timeline}>{events.map((event, index) => <View key={`${event.id}-${index}`} style={styles.timelineRow}>
    <View style={styles.timelineRail}><View style={[styles.timelineDot, { backgroundColor: event.color || COLORS.cyan }]} />{index !== events.length - 1 ? <View style={styles.timelineLine} /> : null}</View>
    <View style={styles.timelineBody}><View style={COMMON.row}><Text style={styles.timelineTime}>{event.time}</Text><Text style={styles.timelineType}>{event.type}</Text></View><Text style={styles.timelineTitle}>{event.title}</Text>{!compact && event.description ? <Text style={styles.timelineDescription}>{event.description}</Text> : null}</View>
  </View>)}</View>;
}

export function FloatingActionDock({ actions = [] }) {
  return <View style={styles.dock}>{actions.map((action) => <Pressable key={action.id} onPress={action.onPress} style={({ pressed }) => [styles.dockButton, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={action.accessibilityLabel || action.label}>
    <Ionicons name={action.icon} size={18} color={action.color || COLORS.text} /><Text style={[styles.dockLabel, { color: action.color || COLORS.text }]}>{action.label}</Text>
  </Pressable>)}</View>;
}

export function AnimatedNumber({ value, duration = 800, prefix = '', suffix = '', decimals = 0, style }) {
  const reduceMotion = useReducedMotion();
  const animated = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);
  const target = Number(value) || 0;
  useEffect(() => {
    if (reduceMotion) { animated.setValue(target); setDisplay(target); return undefined; }
    const listener = animated.addListener(({ value: next }) => setDisplay(next));
    Animated.timing(animated, { toValue: target, duration, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    return () => animated.removeListener(listener);
  }, [animated, duration, reduceMotion, target]);
  return <Text style={style}>{prefix}{display.toFixed(decimals)}{suffix}</Text>;
}

export function PressableTile({ icon, title, subtitle, tone = 'cyan', onPress, selected = false }) {
  const color = tone === 'mint' ? COLORS.mint : tone === 'amber' ? COLORS.amber : tone === 'coral' ? COLORS.coral : COLORS.cyan;
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.tile, selected && { borderColor: alpha(color, 0.65), backgroundColor: alpha(color, 0.08) }, pressed && styles.pressed]} accessibilityRole="button" accessibilityState={{ selected }}>
    <View style={[styles.tileIcon, { backgroundColor: alpha(color, selected ? 0.16 : 0.08) }]}><Ionicons name={icon} size={19} color={color} /></View>
    <Text style={styles.tileTitle}>{title}</Text>
    {subtitle ? <Text style={styles.tileSubtitle}>{subtitle}</Text> : null}
  </Pressable>;
}

export function SegmentedProgress({ steps, active, onPress }) {
  return <View style={styles.stepper}>{steps.map((step, index) => { const done = index < active; const current = index === active; return <React.Fragment key={step.id || index}>
    <Pressable onPress={() => onPress?.(index)} disabled={!done && !current} style={styles.stepperItem} accessibilityRole="button" accessibilityState={{ selected: current }}><View style={[styles.stepCircle, done && styles.stepDone, current && styles.stepCurrent]}>{done ? <Ionicons name="checkmark" size={13} color={COLORS.bg} /> : <Text style={[styles.stepNumber, current && { color: COLORS.bg }]}>{index + 1}</Text>}</View><Text style={[styles.stepText, current && styles.stepTextCurrent]} numberOfLines={1}>{step.label}</Text></Pressable>{index < steps.length - 1 ? <View style={[styles.stepConnector, index < active && styles.connectorDone]} /> : null}
  </React.Fragment>; })}</View>;
}

export function PulseLabel({ text = 'LIVE AI', tone = 'cyan' }) {
  const reduceMotion = useReducedMotion();
  const opacity = useRef(new Animated.Value(0.45)).current;
  const color = tone === 'mint' ? COLORS.mint : tone === 'amber' ? COLORS.amber : COLORS.cyan;
  useEffect(() => {
    if (reduceMotion) { opacity.setValue(1); return undefined; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.35, duration: 900, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [opacity, reduceMotion]);
  return <Animated.View style={[styles.pulse, { opacity, borderColor: alpha(color, 0.26), backgroundColor: alpha(color, 0.08) }]}><View style={[styles.pulseDot, { backgroundColor: color }]} /><Text style={[styles.pulseText, { color }]}>{text}</Text></Animated.View>;
}

export function MetricPill({ label, value, tone = 'cyan' }) {
  const color = tone === 'mint' ? COLORS.mint : tone === 'amber' ? COLORS.amber : tone === 'coral' ? COLORS.coral : COLORS.cyan;
  return <View style={[styles.metricPill, { borderColor: alpha(color, 0.22), backgroundColor: alpha(color, 0.07) }]}><Text style={styles.metricPillLabel}>{label}</Text><Text style={[styles.metricPillValue, { color }]}>{value}</Text></View>;
}

export function Accordion({ title, icon, children, defaultOpen = false, tone = 'cyan' }) {
  const [open, setOpen] = useState(defaultOpen);
  const height = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;
  const color = tone === 'mint' ? COLORS.mint : tone === 'amber' ? COLORS.amber : tone === 'coral' ? COLORS.coral : COLORS.cyan;
  useEffect(() => { Animated.spring(height, { toValue: open ? 1 : 0, useNativeDriver: true, damping: 18, stiffness: 220 }).start(); }, [height, open]);
  return <View style={[styles.accordion, { borderColor: alpha(color, 0.18) }]}><Pressable onPress={() => setOpen((value) => !value)} style={styles.accordionHeader} accessibilityRole="button" accessibilityState={{ expanded: open }}><View style={[styles.accordionIcon, { backgroundColor: alpha(color, 0.1) }]}><Ionicons name={icon || 'information-circle-outline'} size={16} color={color} /></View><Text style={styles.accordionTitle}>{title}</Text><Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={17} color={COLORS.textTertiary} /></Pressable><Animated.View style={[styles.accordionBody, { opacity: height, transform: [{ scaleY: height }] }]} pointerEvents={open ? 'auto' : 'none'}>{children}</Animated.View></View>;
}

export function TagCloud({ tags = [], tone = 'cyan', onTagPress }) {
  const color = tone === 'mint' ? COLORS.mint : tone === 'amber' ? COLORS.amber : tone === 'coral' ? COLORS.coral : COLORS.cyan;
  return <View style={styles.tagCloud}>{tags.map((tag) => <Pressable key={tag} onPress={() => onTagPress?.(tag)} style={({ pressed }) => [styles.tag, { borderColor: alpha(color, 0.18), backgroundColor: alpha(color, 0.06) }, pressed && styles.pressed]}><Text style={[styles.tagText, { color }]}>{tag}</Text></Pressable>)}</View>;
}

const styles = StyleSheet.create({
  glass: { width: 150, minHeight: 102, borderRadius: 18, borderWidth: 1, backgroundColor: alpha(COLORS.surfaceElevated, 0.86), padding: 13, marginRight: 9 },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
  glassIcon: { width: 32, height: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 9 },
  label: { color: COLORS.textTertiary, fontSize: 9, fontWeight: '750', letterSpacing: 0.6, textTransform: 'uppercase' },
  value: { color: COLORS.text, fontSize: 19, lineHeight: 23, fontWeight: '900', marginTop: 2 },
  hint: { color: COLORS.textSecondary, fontSize: 9, marginTop: 3 },
  carousel: { paddingBottom: 2, paddingRight: 16 },
  insightCard: { width: WINDOW_WIDTH * 0.78, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 16, marginRight: 12 },
  insightTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  smallDot: { width: 8, height: 8, borderRadius: 4 },
  insightLabel: { flex: 1, color: COLORS.textTertiary, fontSize: 9, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7 },
  insightTitle: { color: COLORS.text, fontSize: 17, lineHeight: 22, fontWeight: '850', marginTop: 12 },
  insightBody: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 17, marginTop: 5 },
  insightFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  insightMetric: { fontSize: 14, fontWeight: '900' },
  insightAction: { color: COLORS.textTertiary, fontSize: 10, fontWeight: '700' },
  timeline: { paddingTop: 2 },
  timelineRow: { flexDirection: 'row', minHeight: 68 },
  timelineRail: { width: 25, alignItems: 'center' },
  timelineDot: { width: 9, height: 9, borderRadius: 4.5, marginTop: 4 },
  timelineLine: { width: 1, flex: 1, backgroundColor: COLORS.border, marginTop: 4, marginBottom: 2 },
  timelineBody: { flex: 1, paddingBottom: 12 },
  timelineTime: { color: COLORS.textTertiary, fontSize: 9, fontWeight: '700' },
  timelineType: { color: COLORS.textTertiary, fontSize: 9, marginLeft: 7 },
  timelineTitle: { color: COLORS.text, fontSize: 12, fontWeight: '800', marginTop: 3 },
  timelineDescription: { color: COLORS.textSecondary, fontSize: 10, lineHeight: 15, marginTop: 2 },
  dock: { flexDirection: 'row', gap: 8, paddingVertical: 5 },
  dockButton: { flex: 1, minHeight: 48, borderRadius: 14, backgroundColor: COLORS.surfaceSoft, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  dockLabel: { fontSize: 9, fontWeight: '800', marginTop: 4 },
  tile: { width: '48%', minHeight: 104, borderRadius: 18, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, padding: 13, marginBottom: 10 },
  tileIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tileTitle: { color: COLORS.text, fontSize: 12, fontWeight: '850', marginTop: 9 },
  tileSubtitle: { color: COLORS.textTertiary, fontSize: 9, marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  stepperItem: { flex: 1, alignItems: 'center', minWidth: 60 },
  stepCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surfaceSoft, alignItems: 'center', justifyContent: 'center' },
  stepDone: { backgroundColor: COLORS.mint, borderColor: COLORS.mint },
  stepCurrent: { backgroundColor: COLORS.cyan, borderColor: COLORS.cyan },
  stepNumber: { color: COLORS.textTertiary, fontSize: 10, fontWeight: '800' },
  stepText: { color: COLORS.textTertiary, fontSize: 8, marginTop: 5, textAlign: 'center' },
  stepTextCurrent: { color: COLORS.text, fontWeight: '800' },
  stepConnector: { height: 1, flex: 0.65, backgroundColor: COLORS.border, marginTop: -14 },
  connectorDone: { backgroundColor: alpha(COLORS.mint, 0.5) },
  pulse: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 5 },
  pulseDot: { width: 6, height: 6, borderRadius: 3 },
  pulseText: { fontSize: 8, fontWeight: '850', letterSpacing: 0.6 },
  metricPill: { borderWidth: 1, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 6, marginRight: 7 },
  metricPillLabel: { color: COLORS.textTertiary, fontSize: 8, fontWeight: '700' },
  metricPillValue: { fontSize: 9, fontWeight: '900', marginTop: 2 },
  accordion: { borderWidth: 1, borderRadius: 16, overflow: 'hidden', backgroundColor: COLORS.surface },
  accordionHeader: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 12 },
  accordionIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  accordionTitle: { flex: 1, color: COLORS.text, fontSize: 11, fontWeight: '800' },
  accordionBody: { paddingHorizontal: 12, paddingBottom: 13, transformOrigin: 'top' },
  tagCloud: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  tag: { borderWidth: 1, borderRadius: 99, paddingHorizontal: 9, paddingVertical: 6 },
  tagText: { fontSize: 9, fontWeight: '750' },
});
