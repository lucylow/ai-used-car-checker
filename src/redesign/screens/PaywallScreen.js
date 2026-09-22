import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { Badge, MetricCard, PrimaryButton, Screen, ScreenHeader, SecondaryButton, SegmentedControl, SurfaceCard } from '../components/Primitives';
import { RiskDecisionCard } from '../components/AI';
import { SparkBars } from '../components/Charts';

const PLANS = [
  { value: 'monthly', label: 'Monthly', price: '$9.99', sub: '/ month' },
  { value: 'yearly', label: 'Yearly', price: '$99.99', sub: '/ year' },
];
const features = [
  ['Unlimited inspections', true, true],
  ['AI photo analysis', true, true],
  ['Market comparison', true, true],
  ['Repair cost estimates', true, true],
  ['Negotiation coach', true, true],
  ['Verified certificates', false, true],
  ['Advanced evidence report', false, true],
  ['Priority processing', false, true],
];

export default function PaywallScreen({ data, actions }) {
  const [plan, setPlan] = useState('yearly');
  const yearly = plan === 'yearly';
  const header = yearly ? '$8.33' : '$9.99';
  const valueBars = useMemo(() => [74, 82, 91, 94, 98], []);
  return <Screen scroll contentStyle={styles.content}>
    <ScreenHeader title="CarWise Pro" subtitle="Turn more inspection evidence into better decisions." onBack={actions?.onBack} right={<Badge tone="cyan" label="PRO" />} />
    <View style={styles.hero}>
      <View style={styles.heroGlow} /><View style={styles.heroIcon}><Ionicons name="sparkles" size={30} color={COLORS.cyan} /></View>
      <Text style={styles.heroTitle}>See the whole picture.</Text>
      <Text style={styles.heroBody}>Unlock the complete visual inspection workflow, unlimited evidence, deeper market context, and premium reporting.</Text>
    </View>

    <SegmentedControl options={PLANS} value={plan} onChange={setPlan} style={{ marginTop: 16 }} />
    <SurfaceCard tone="cyan" style={{ marginTop: 12 }}>
      <View style={COMMON.row}><View style={COMMON.fill}><Text style={styles.priceLabel}>{yearly ? 'Effective monthly price' : 'Monthly price'}</Text><View style={COMMON.row}><Text style={styles.price}>{header}</Text><Text style={styles.priceSub}>{yearly ? '/mo billed annually' : '/month'}</Text></View></View>{yearly ? <Badge tone="mint" label="SAVE 16%" /> : null}</View>
      <PrimaryButton label="Start free trial" icon="arrow-forward" onPress={() => actions?.onStartTrial?.(plan) || Alert.alert('Demo', `Starting the ${plan} trial flow.`)} style={{ marginTop: 13 }} />
      <Text style={styles.legal}>Cancel anytime. Billing terms and trial availability should be connected to your production subscription service.</Text>
    </SurfaceCard>

    <View style={styles.sectionTitle}><Text style={TYPOGRAPHY.h3}>What changes with Pro</Text><Text style={TYPOGRAPHY.meta}>FREE → PRO</Text></View>
    <SurfaceCard>
      {features.map(([label, free, pro], index) => <View key={label} style={[styles.featureRow, index !== features.length - 1 && { borderBottomWidth: 1, borderBottomColor: COLORS.border }]}><Text style={styles.featureLabel}>{label}</Text><View style={styles.featureValue}><Text style={styles.columnLabel}>{free ? '✓' : '—'}</Text><View style={styles.divider} /><Text style={[styles.columnLabel, { color: pro ? COLORS.mint : COLORS.textTertiary }]}>{pro ? '✓' : '—'}</Text></View></View>)}
    </SurfaceCard>

    <SurfaceCard tone="blue" style={{ marginTop: 12 }}>
      <View style={COMMON.row}><View style={[styles.smallIcon, { backgroundColor: alpha(COLORS.cyan, 0.1) }]}><Ionicons name="analytics-outline" size={18} color={COLORS.cyan} /></View><View style={COMMON.fill}><Text style={styles.cardTitle}>More signal, less guesswork</Text><Text style={styles.cardBody}>Show the user how premium views connect price, condition, evidence, and negotiation in one place.</Text></View></View>
      <SparkBars values={valueBars} tone="cyan" style={{ marginTop: 16 }} />
      <View style={styles.chartCaption}><Text style={styles.chartTiny}>INSPECTION DEPTH</Text><Text style={styles.chartTiny}>↑ EVIDENCE COVERAGE</Text></View>
    </SurfaceCard>

    <View style={styles.sectionTitle}><Text style={TYPOGRAPHY.h3}>Built around the buyer journey</Text></View>
    <View style={styles.grid}>
      <MetricCard label="Evidence" value="∞" note="photos + video + notes" icon="images-outline" tone="cyan" />
      <MetricCard label="Reports" value="PRO" note="shareable + detailed" icon="document-text-outline" tone="mint" />
      <MetricCard label="Market" value="LIVE" note="comparables + trends" icon="trending-up-outline" tone="blue" />
      <MetricCard label="Coach" value="AI" note="evidence-backed" icon="chatbubbles-outline" tone="amber" />
    </View>

    <RiskDecisionCard style={{ marginTop: 12 }} title="Make premium value obvious" description="Keep the paywall contextual. Show the user what evidence or action is locked, then explain what Pro unlocks." />
    <SecondaryButton label="Maybe later" icon="chevron-down" onPress={actions?.onBack} style={{ marginTop: 10, marginBottom: 30 }} />
  </Screen>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  hero: { position: 'relative', overflow: 'hidden', minHeight: 220, borderRadius: 24, borderWidth: 1, borderColor: alpha(COLORS.cyan, 0.25), backgroundColor: '#0A1726', padding: 22, justifyContent: 'flex-end' },
  heroGlow: { position: 'absolute', width: 240, height: 240, borderRadius: 120, right: -70, top: -90, backgroundColor: alpha(COLORS.cyan, 0.07) },
  heroIcon: { position: 'absolute', left: 22, top: 22, width: 62, height: 62, borderRadius: 21, backgroundColor: alpha(COLORS.cyan, 0.11), alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: alpha(COLORS.cyan, 0.18) },
  heroTitle: { color: COLORS.text, fontSize: 28, lineHeight: 32, fontWeight: '900', maxWidth: 260 },
  heroBody: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 17, maxWidth: 310, marginTop: 7 },
  priceLabel: { color: COLORS.textTertiary, fontSize: 9, fontWeight: '750', textTransform: 'uppercase', letterSpacing: 0.7 },
  price: { color: COLORS.text, fontSize: 32, fontWeight: '900', marginTop: 2 },
  priceSub: { color: COLORS.textSecondary, fontSize: 10, alignSelf: 'flex-end', marginLeft: 5, marginBottom: 6 },
  legal: { color: COLORS.textTertiary, fontSize: 8, lineHeight: 12, textAlign: 'center', marginTop: 8 },
  sectionTitle: { marginTop: 20, marginBottom: 10, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  featureRow: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  featureLabel: { flex: 1, color: COLORS.text, fontSize: 11, fontWeight: '700' },
  featureValue: { width: 88, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  columnLabel: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '850' },
  divider: { width: 1, height: 20, backgroundColor: COLORS.border },
  smallIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  cardTitle: { color: COLORS.text, fontSize: 13, fontWeight: '850' },
  cardBody: { color: COLORS.textSecondary, fontSize: 10, lineHeight: 15, marginTop: 3 },
  chartCaption: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  chartTiny: { color: COLORS.textTertiary, fontSize: 8, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
