import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, alpha } from '../theme';
import { useReducedMotion } from '../motion';

export function CarWiseSplash({ onFinished, duration = 1500 }) {
  const reduceMotion = useReducedMotion();
  const scale = useRef(new Animated.Value(0.88)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const line = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduceMotion) { opacity.setValue(1); scale.setValue(1); line.setValue(1); const timer = setTimeout(() => onFinished?.(), 300); return () => clearTimeout(timer); }
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, damping: 12, stiffness: 190, useNativeDriver: true }),
      ]),
      Animated.timing(line, { toValue: 1, duration: 620, useNativeDriver: true }),
    ]).start(({ finished }) => { if (finished) setTimeout(() => onFinished?.(), duration - 950); });
  }, [duration, line, onFinished, opacity, reduceMotion, scale]);
  return <View style={styles.root}><Animated.View style={[styles.logo, { opacity, transform: [{ scale }] }]}><View style={styles.logoCircle}><Ionicons name="car-sport" size={42} color={COLORS.text} /></View><View style={styles.shieldBadge}><Ionicons name="checkmark" size={13} color={COLORS.bg} /></View></Animated.View><Animated.View style={[styles.line, { transform: [{ scaleX: line }] }]} /><Animated.Text style={[styles.wordmark, { opacity }]}>CAR<Text style={styles.wordmarkAccent}>WISE</Text></Animated.Text><Animated.Text style={[styles.tagline, { opacity }]}>SEE THE CAR · UNDERSTAND THE RISK</Animated.Text></View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 104, height: 104, alignItems: 'center', justifyContent: 'center', borderRadius: 36, backgroundColor: alpha(COLORS.cyan, 0.05), borderWidth: 1, borderColor: alpha(COLORS.cyan, 0.18) },
  logoCircle: { width: 84, height: 84, borderRadius: 30, backgroundColor: COLORS.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  shieldBadge: { position: 'absolute', right: -4, bottom: -2, width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.mint, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: COLORS.bg },
  line: { width: 120, height: 2, backgroundColor: COLORS.cyan, marginTop: 24, transformOrigin: 'left' },
  wordmark: { color: COLORS.text, fontSize: 26, fontWeight: '900', letterSpacing: 2.4, marginTop: 17 },
  wordmarkAccent: { color: COLORS.cyan },
  tagline: { color: COLORS.textTertiary, fontSize: 8, fontWeight: '800', letterSpacing: 1.6, marginTop: 7 },
});
