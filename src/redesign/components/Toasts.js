import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, alpha } from '../theme';
import { useReducedMotion } from '../motion';

export function Toast({ visible, title, message, tone = 'cyan', onPress, onClose }) {
  const reduceMotion = useReducedMotion();
  const translate = React.useRef(new Animated.Value(20)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    if (reduceMotion) {
      translate.setValue(visible ? 0 : 20);
      opacity.setValue(visible ? 1 : 0);
      return undefined;
    }
    Animated.parallel([
      Animated.spring(translate, { toValue: visible ? 0 : 20, useNativeDriver: true, damping: 16, stiffness: 190 }),
      Animated.timing(opacity, { toValue: visible ? 1 : 0, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [opacity, reduceMotion, translate, visible]);
  const icon = tone === 'success' ? 'checkmark-circle' : tone === 'danger' ? 'alert-circle' : tone === 'warning' ? 'warning' : 'sparkles';
  const accent = tone === 'success' ? COLORS.mint : tone === 'danger' ? COLORS.coral : tone === 'warning' ? COLORS.amber : COLORS.cyan;
  return <Animated.View pointerEvents={visible ? 'auto' : 'none'} style={[styles.wrap, { opacity, transform: [{ translateY: translate }] }]}>
    <View style={[styles.card, { borderColor: alpha(accent, 0.28) }]}>
      <View style={[styles.icon, { backgroundColor: alpha(accent, 0.12) }]}><Ionicons name={icon} size={18} color={accent} /></View>
      <Pressable style={COMMON.fill} onPress={onPress} accessibilityRole={onPress ? 'button' : undefined}><Text style={styles.title}>{title}</Text>{message ? <Text style={styles.message}>{message}</Text> : null}</Pressable>
      <Pressable onPress={onClose} hitSlop={10} accessibilityRole="button" accessibilityLabel="Dismiss notification"><Ionicons name="close" size={17} color={COLORS.textTertiary} /></Pressable>
    </View>
  </Animated.View>;
}

export function SuccessPulse({ visible }) {
  const reduceMotion = useReducedMotion();
  const scale = React.useRef(new Animated.Value(0.82)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    if (!visible) { opacity.setValue(0); return undefined; }
    if (reduceMotion) { scale.setValue(1); opacity.setValue(1); return undefined; }
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 10, stiffness: 210 }),
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [opacity, reduceMotion, scale, visible]);
  return <Animated.View pointerEvents="none" style={[styles.success, { opacity, transform: [{ scale }] }]}><Ionicons name="checkmark" size={24} color={COLORS.mint} /></Animated.View>;
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 14, right: 14, bottom: 18, zIndex: 50 },
  card: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: COLORS.surfaceElevated, shadowColor: '#000', shadowOpacity: 0.28, shadowRadius: 18, shadowOffset: { width: 0, height: 9 }, elevation: 8 },
  icon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  title: { color: COLORS.text, fontSize: 13, fontWeight: '800' },
  message: { color: COLORS.textSecondary, fontSize: 10, lineHeight: 14, marginTop: 2 },
  success: { width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: alpha(COLORS.mint, 0.32), alignItems: 'center', justifyContent: 'center' },
});
