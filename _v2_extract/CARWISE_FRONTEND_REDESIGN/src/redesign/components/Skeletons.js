import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { COLORS, alpha } from '../theme';
import { useReducedMotion } from '../motion';

function Block({ width = '100%', height = 14, radius = 8, style }) {
  return <View style={[styles.block, { width, height, borderRadius: radius }, style]} />;
}

export function Skeleton({ style, lines = 3 }) {
  const reduceMotion = useReducedMotion();
  const opacity = React.useRef(new Animated.Value(0.55)).current;
  React.useEffect(() => {
    if (reduceMotion) {
      opacity.setValue(0.55);
      return undefined;
    }
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(opacity, { toValue: 0.28, duration: 650, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.75, duration: 650, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [opacity, reduceMotion]);
  return <Animated.View style={[styles.wrap, { opacity }, style]}>
    <Block height={150} radius={18} />
    <Block width="72%" height={18} radius={6} style={{ marginTop: 14 }} />
    {Array.from({ length: Math.max(1, lines - 1) }).map((_, index) => <Block key={index} width={`${94 - index * 12}%`} height={11} radius={5} style={{ marginTop: 8 }} />)}
  </Animated.View>;
}

export function SkeletonRow({ style }) {
  return <View style={[styles.row, style]}><Block width={56} height={56} radius={18} /><View style={styles.rowText}><Block width="70%" height={13} radius={5} /><Block width="46%" height={10} radius={5} style={{ marginTop: 8 }} /></View><Block width={36} height={18} radius={9} /></View>;
}

export function SkeletonList({ count = 4 }) {
  return <View>{Array.from({ length: count }).map((_, index) => <SkeletonRow key={index} style={{ marginBottom: 9 }} />)}</View>;
}

export function ShimmerBar({ width = '100%', height = 8, style }) {
  const reduceMotion = useReducedMotion();
  const opacity = React.useRef(new Animated.Value(0.35)).current;
  React.useEffect(() => {
    if (reduceMotion) return undefined;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(opacity, { toValue: 0.85, duration: 450, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.25, duration: 450, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [opacity, reduceMotion]);
  return <Animated.View style={[styles.shimmer, { width, height, opacity }, style]} />;
}

const styles = StyleSheet.create({
  wrap: { padding: 2 },
  block: { backgroundColor: alpha(COLORS.textTertiary, 0.16) },
  row: { minHeight: 70, flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 16, backgroundColor: COLORS.surface },
  rowText: { flex: 1, marginLeft: 11 },
  shimmer: { borderRadius: 99, backgroundColor: alpha(COLORS.cyan, 0.18) },
});
