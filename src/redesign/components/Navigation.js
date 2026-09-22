import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, alpha } from '../theme';

const TABS = [
  { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'inspect', label: 'Inspect', icon: 'scan-outline', activeIcon: 'scan' },
  { key: 'reports', label: 'Reports', icon: 'document-text-outline', activeIcon: 'document-text' },
  { key: 'history', label: 'History', icon: 'time-outline', activeIcon: 'time' },
  { key: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

export function BottomNavigation({ active = 'home', onChange }) {
  return <View style={styles.bar}>{TABS.map((tab) => {
    const selected = active === tab.key;
    return <Pressable key={tab.key} accessibilityRole="tab" accessibilityState={{ selected }} onPress={() => onChange?.(tab.key)} style={styles.tab}>
      <View style={[styles.tabIcon, selected && styles.tabIconActive]}><Ionicons name={selected ? tab.activeIcon : tab.icon} size={20} color={selected ? COLORS.white : COLORS.textTertiary} /></View><Text style={[styles.tabText, selected && styles.tabTextActive]}>{tab.label}</Text>
    </Pressable>;
  })}</View>;
}

export function StepRail({ steps, activeIndex = 0, onSelect }) {
  return <View style={styles.stepRail}>{steps.map((step, index) => <React.Fragment key={step.id || index}><Pressable accessibilityRole="button" accessibilityLabel={`Go to ${step.label}`} onPress={() => onSelect?.(index)} style={styles.stepItem}><View style={[styles.stepCircle, index < activeIndex && styles.stepComplete, index === activeIndex && styles.stepActive]}>{index < activeIndex ? <Ionicons name="checkmark" size={11} color={COLORS.bg} /> : <Text style={[styles.stepNumber, index === activeIndex && { color: COLORS.bg }]}>{index + 1}</Text>}</View><Text style={[styles.stepLabel, index === activeIndex && styles.stepLabelActive]} numberOfLines={1}>{step.label}</Text></Pressable>{index < steps.length - 1 ? <View style={[styles.stepLine, index < activeIndex && styles.stepLineDone]} /> : null}</React.Fragment>)}</View>;
}

export function StickyActionBar({ primaryLabel, primaryIcon = 'arrow-forward', onPrimary, secondaryLabel, onSecondary, disabled = false }) {
  return <View style={styles.sticky}><View style={styles.stickyInner}>{secondaryLabel ? <Pressable disabled={disabled} accessibilityRole="button" onPress={onSecondary} style={styles.stickySecondary}><Text style={styles.stickySecondaryText}>{secondaryLabel}</Text></Pressable> : null}<Pressable disabled={disabled} accessibilityRole="button" onPress={onPrimary} style={[styles.stickyPrimary, disabled && { opacity: 0.45 }]}><Text style={styles.stickyPrimaryText}>{primaryLabel}</Text><Ionicons name={primaryIcon} size={18} color={COLORS.white} /></Pressable></View></View>;
}

export function StatusPill({ label, tone = 'mint', icon }) {
  const colors = { mint: COLORS.mint, amber: COLORS.amber, coral: COLORS.coral, blue: COLORS.blue, cyan: COLORS.cyan };
  const color = colors[tone] || COLORS.blue;
  return <View style={[styles.statusPill, { backgroundColor: alpha(color, 0.1), borderColor: alpha(color, 0.24) }]}>{icon ? <Ionicons name={icon} size={11} color={color} /> : <View style={[styles.statusDot, { backgroundColor: color }]} />}<Text style={[styles.statusText, { color }]}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  bar: { position: 'absolute', left: 10, right: 10, bottom: 10, height: 72, borderRadius: 23, borderWidth: 1, borderColor: COLORS.border, backgroundColor: 'rgba(13,23,40,0.98)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 4, shadowColor: COLORS.black, shadowOpacity: 0.24, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 10 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 58 },
  tabIcon: { width: 36, height: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tabIconActive: { backgroundColor: COLORS.blue, shadowColor: COLORS.blue, shadowOpacity: 0.24, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  tabText: { color: COLORS.textTertiary, fontSize: 9, fontWeight: '750', marginTop: 3 },
  tabTextActive: { color: COLORS.text },
  stepRail: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 6 },
  stepItem: { alignItems: 'center', width: 60 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: COLORS.borderStrong, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  stepActive: { backgroundColor: COLORS.cyan, borderColor: COLORS.cyan },
  stepComplete: { backgroundColor: COLORS.mint, borderColor: COLORS.mint },
  stepNumber: { color: COLORS.textTertiary, fontSize: 9, fontWeight: '900' },
  stepLabel: { color: COLORS.textTertiary, fontSize: 8, fontWeight: '750', marginTop: 5, textAlign: 'center' },
  stepLabelActive: { color: COLORS.text },
  stepLine: { flex: 1, height: 1, backgroundColor: COLORS.border, marginTop: 14 },
  stepLineDone: { backgroundColor: COLORS.mint },
  sticky: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16, paddingVertical: 11, backgroundColor: alpha(COLORS.bgElevated, 0.97), borderTopWidth: 1, borderTopColor: COLORS.border },
  stickyInner: { flexDirection: 'row', gap: 8 },
  stickySecondary: { minHeight: 50, borderRadius: 15, borderWidth: 1, borderColor: COLORS.borderStrong, backgroundColor: COLORS.surface, paddingHorizontal: 14, justifyContent: 'center', alignItems: 'center' },
  stickySecondaryText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '800' },
  stickyPrimary: { flex: 1, minHeight: 50, borderRadius: 15, backgroundColor: COLORS.blue, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stickyPrimaryText: { color: COLORS.white, fontSize: 14, fontWeight: '850' },
  statusPill: { minHeight: 25, borderRadius: 14, borderWidth: 1, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 9, fontWeight: '850', letterSpacing: 0.5 },
});
