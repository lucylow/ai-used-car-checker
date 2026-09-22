import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACE, TYPOGRAPHY, alpha, toneColor } from '../theme';
import { useReducedMotion, animateValue } from '../motion';

export function ScoreRing({ score = 0, label = 'Risk', tone = 'mint', size = 164 }) {
  const reduced = useReducedMotion();
  const value = useRef(new Animated.Value(0)).current;
  const color = toneColor(tone);
  useEffect(() => animateValue(value, Math.max(0, Math.min(100, score)), 850, reduced), [score, reduced, value]);
  const segmentCount = 30;
  const activeCount = Math.round((Math.max(0, Math.min(100, score)) / 100) * segmentCount);
  return <View style={[styles.ring, { width: size, height: size }]}>
    {Array.from({ length: segmentCount }).map((_, index) => {
      const angle = (index / segmentCount) * 360;
      const active = index < activeCount;
      return <View key={index} style={[styles.ringSegment, { backgroundColor: active ? color : COLORS.surfaceSoft, transform: [{ rotate: `${angle}deg` }, { translateY: -(size / 2 - 10) }, { rotate: `-${angle}deg` }], height: 8, width: 3, left: size / 2 - 1.5, top: size / 2 - 4 }]} />;
    })}
    <View style={[styles.ringInner, { width: size - 30, height: size - 30, borderRadius: (size - 30) / 2 }]}>
      <Text style={[styles.ringScore, { color }]}>{Math.round(score)}</Text>
      <Text style={styles.ringLabel}>{label.toUpperCase()}</Text>
      <View style={[styles.ringDot, { backgroundColor: color }]} />
    </View>
  </View>;
}

export function ConfidenceMeter({ confidence = 0, label = 'Confidence', tone = 'cyan' }) {
  const color = toneColor(tone);
  const percent = Math.round(Math.max(0, Math.min(1, confidence)) * 100);
  return <View style={styles.confidence}>
    <View style={styles.confHeader}><Text style={styles.confLabel}>{label}</Text><Text style={[styles.confValue, { color }]}>{percent}%</Text></View>
    <View style={styles.confTrack}><View style={[styles.confFill, { width: `${percent}%`, backgroundColor: color }]} /></View>
  </View>;
}

export function SparkBars({ values = [24, 42, 35, 61, 48, 66, 58, 76, 70, 82], height = 56, tone = 'blue' }) {
  const reduced = useReducedMotion();
  const color = toneColor(tone);
  return <View style={[styles.spark, { height }]}>
    {values.map((item, index) => <AnimatedBar key={index} value={item} max={100} height={height} color={color} delay={index * 30} reduced={reduced} />)}
  </View>;
}

function AnimatedBar({ value, max, height, color, delay, reduced }) {
  const progress = useRef(new Animated.Value(reduced ? value : 0)).current;
  useEffect(() => {
    if (reduced) { progress.setValue(value); return; }
    Animated.timing(progress, { toValue: value, duration: 450, delay, useNativeDriver: false }).start();
  }, [value, reduced, progress, delay]);
  const barHeight = progress.interpolate({ inputRange: [0, max], outputRange: [4, height] });
  return <Animated.View style={[styles.sparkBar, { height: barHeight, backgroundColor: color }]} />;
}

export function MiniLineChart({ points = [18, 30, 24, 48, 42, 61, 57, 72], tone = 'cyan', height = 88 }) {
  const color = toneColor(tone);
  const normalized = points.map((v) => Math.max(0, Math.min(100, Number(v) || 0)));
  return <View style={[styles.lineChart, { height }]}>
    {normalized.map((point, index) => {
      const x = normalized.length === 1 ? 0 : (index / (normalized.length - 1)) * 92;
      const y = 80 - point * 0.62;
      const next = normalized[index + 1];
      const nextX = index === normalized.length - 1 ? x : ((index + 1) / (normalized.length - 1)) * 92;
      const nextY = index === normalized.length - 1 ? y : 80 - next * 0.62;
      const dx = nextX - x;
      const dy = nextY - y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      return <React.Fragment key={index}>
        {index < normalized.length - 1 ? <View style={[styles.lineSegment, { backgroundColor: alpha(color, 0.65), width: length, left: `${x}%`, top: `${y}%`, transform: [{ rotate: `${angle}deg` }] }]} /> : null}
        <View style={[styles.linePoint, { backgroundColor: COLORS.bg, borderColor: color, left: `${x}%`, top: `${y}%` }]} />
      </React.Fragment>;
    })}
  </View>;
}

export function PriceRangeBar({ low, fair, current, high }) {
  const range = Math.max(1, high - low);
  const fairPct = Math.max(0, Math.min(100, ((fair - low) / range) * 100));
  const currentPct = Math.max(0, Math.min(100, ((current - low) / range) * 100));
  return <View style={styles.priceRange}>
    <View style={styles.priceRangeTrack}>
      <View style={[styles.priceRangeFair, { left: `${fairPct - 8}%`, right: `${92 - fairPct}%` }]} />
      <View style={[styles.priceMarker, { left: `${currentPct}%` }]}><View style={styles.priceMarkerDot} /><View style={styles.priceMarkerLabel}><Text style={styles.priceMarkerLabelText}>ASK</Text></View></View>
    </View>
    <View style={styles.priceRangeLabels}><Text style={styles.rangeLabel}>${Math.round(low).toLocaleString()}</Text><Text style={styles.rangeFair}>FAIR ${Math.round(fair).toLocaleString()}</Text><Text style={styles.rangeLabel}>${Math.round(high).toLocaleString()}</Text></View>
  </View>;
}

export function Waterfall({ rows }) {
  let cursor = 0;
  const total = rows.reduce((sum, row) => sum + Math.abs(Number(row.value) || 0), 0) || 1;
  return <View style={styles.waterfall}>
    {rows.map((row) => {
      const amount = Math.abs(Number(row.value) || 0);
      const width = Math.max(10, (amount / total) * 100);
      const start = cursor;
      cursor += width;
      return <View key={row.id || row.label} style={styles.waterRow}>
        <View style={styles.waterLabelRow}><Text style={styles.waterLabel}>{row.label}</Text><Text style={[styles.waterValue, { color: toneColor(row.tone || 'blue') }]}>{row.display}</Text></View>
        <View style={styles.waterTrack}><View style={[styles.waterFill, { width: `${width}%`, marginLeft: `${start}%`, backgroundColor: toneColor(row.tone || 'blue') }]} /></View>
      </View>;
    })}
  </View>;
}

export function HorizontalBars({ rows, max, tone = 'blue' }) {
  const color = toneColor(tone);
  const maximum = Math.max(1, max || Math.max(...rows.map((row) => Number(row.value) || 0)));
  return <View style={styles.bars}>
    {rows.map((row) => <View key={row.id || row.label} style={styles.barRow}>
      <View style={styles.barRowHeader}><Text style={styles.barLabel}>{row.label}</Text><Text style={[styles.barValue, { color: row.color || color }]}>{row.display ?? row.value}</Text></View>
      <View style={styles.barTrack}><View style={[styles.barFill, { width: `${Math.max(0, Math.min(100, (Number(row.value) || 0) / maximum * 100))}%`, backgroundColor: row.color || color }]} /></View>
    </View>)}
  </View>;
}

const styles = StyleSheet.create({
  ring: { justifyContent: 'center', alignItems: 'center' },
  ringSegment: { position: 'absolute', borderRadius: 3 },
  ringInner: { backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  ringScore: { fontSize: 42, lineHeight: 46, fontWeight: '900' },
  ringLabel: { color: COLORS.textSecondary, fontSize: 9, letterSpacing: 1.5, fontWeight: '850', marginTop: 2 },
  ringDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  confidence: { marginTop: 9 },
  confHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  confLabel: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '700' },
  confValue: { fontSize: 10, fontWeight: '900' },
  confTrack: { height: 5, borderRadius: 999, backgroundColor: COLORS.surfaceSoft, overflow: 'hidden' },
  confFill: { height: 5, borderRadius: 999 },
  spark: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  sparkBar: { flex: 1, minWidth: 5, borderRadius: 5, opacity: 0.78 },
  lineChart: { position: 'relative', marginTop: 8, width: '100%' },
  lineSegment: { height: 2, position: 'absolute', transformOrigin: 'left center', borderRadius: 2 },
  linePoint: { width: 7, height: 7, borderRadius: 4, borderWidth: 2, position: 'absolute', marginLeft: -3.5, marginTop: -3.5 },
  priceRange: { marginTop: 9 },
  priceRangeTrack: { height: 12, borderRadius: 999, backgroundColor: COLORS.surfaceSoft, position: 'relative', overflow: 'visible' },
  priceRangeFair: { position: 'absolute', top: 0, bottom: 0, backgroundColor: alpha(COLORS.mint, 0.3), borderRadius: 999 },
  priceMarker: { position: 'absolute', top: -9, width: 2, height: 30, backgroundColor: COLORS.white, marginLeft: -1, alignItems: 'center' },
  priceMarkerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.white, marginTop: -2 },
  priceMarkerLabel: { backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2, marginTop: 2 },
  priceMarkerLabelText: { color: COLORS.textSecondary, fontSize: 8, fontWeight: '900' },
  priceRangeLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 11 },
  rangeLabel: { color: COLORS.textTertiary, fontSize: 10, fontWeight: '700' },
  rangeFair: { color: COLORS.mint, fontSize: 10, fontWeight: '900' },
  waterfall: { marginTop: 8 },
  waterRow: { marginTop: 13 },
  waterLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 },
  waterLabel: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '700' },
  waterValue: { fontSize: 11, fontWeight: '900' },
  waterTrack: { height: 10, borderRadius: 999, backgroundColor: COLORS.surfaceSoft, overflow: 'hidden' },
  waterFill: { height: 10, borderRadius: 999 },
  bars: { gap: 14 },
  barRow: { gap: 7 },
  barRowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  barLabel: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '700' },
  barValue: { fontSize: 11, fontWeight: '850' },
  barTrack: { height: 8, borderRadius: 999, backgroundColor: COLORS.surfaceSoft, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 999 },
});
