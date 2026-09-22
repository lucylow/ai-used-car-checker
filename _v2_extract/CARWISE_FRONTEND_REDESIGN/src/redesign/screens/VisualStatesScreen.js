import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { Accordion, AnimatedNumber, GlassStat, MetricPill, PressableTile, PulseLabel, TagCloud } from '../components/Advanced';
import { Badge, Divider, EmptyState, PrimaryButton, Screen, ScreenHeader, SecondaryButton, SurfaceCard, WarningBanner } from '../components/Primitives';
import { AIProcessingCard, AIInsightCard } from '../components/AI';
import { Skeleton, SkeletonList } from '../components/Skeletons';
import { Toast, SuccessPulse } from '../components/Toasts';
import { ScoreRing, PriceRangeBar, ConfidenceMeter } from '../components/Charts';

export default function VisualStatesScreen({ data, actions }) {
  const [tab, setTab] = useState('all');
  const [toast, setToast] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const switchDemo = (mode) => { setLoading(mode === 'loading'); setToast(mode === 'toast'); setSuccess(mode === 'success'); if (mode === 'error') Alert.alert('Demo error state', 'Use the existing recovery handler to retry without losing the inspection.'); };
  return <Screen scroll contentStyle={styles.content}>
    <ScreenHeader title="Visual QA Lab" subtitle="A living catalog of the redesigned CarWise states." onBack={actions?.onBack} right={<Badge tone="cyan" label="UI LAB" />} />
    <TagCloud tags={['all', 'cards', 'media', 'ai', 'loading', 'empty', 'error', 'success']} tone="cyan" onTagPress={setTab} />

    <Section title="Signal cards">
      <View style={styles.horizontal}><GlassStat label="Market value" value="$21.1k" hint="92% confidence" icon="trending-up-outline" tone="mint" /><GlassStat label="Risk score" value="68" hint="Moderate" icon="pulse-outline" tone="amber" /><GlassStat label="Findings" value="7" hint="3 major" icon="warning-outline" tone="coral" /></View>
    </Section>

    <Section title="Score + price">
      <SurfaceCard tone="blue"><View style={COMMON.row}><ScoreRing score={68} size={92} /><View style={COMMON.fill}><Text style={TYPOGRAPHY.eyebrow}>CONDITION SUMMARY</Text><Text style={styles.bigTitle}>Moderate risk</Text><Text style={styles.body}>Make evidence visible before the user reaches a recommendation.</Text><View style={styles.pills}><MetricPill label="FINDINGS" value="7" tone="coral" /><MetricPill label="REPAIRS" value="$1.7k" tone="amber" /></View></View></View><PriceRangeBar low={19800} fair={21100} current={21900} high={23900} style={{ marginTop: 18 }} /></SurfaceCard>
    </Section>

    <Section title="AI explanation">
      <AIInsightCard finding={data.findings[0]} />
      <ConfidenceMeter confidence={0.92} label="Evidence confidence" caption="Based on image quality + visible feature matching" style={{ marginTop: 10 }} />
    </Section>

    <Section title="Processing states">
      <AIProcessingCard activeStep={loading ? 2 : 5} compact={false} />
      <View style={styles.actionRow}><SecondaryButton label="Loading" icon="hourglass-outline" onPress={() => switchDemo('loading')} /><SecondaryButton label="Success" icon="checkmark-circle-outline" onPress={() => switchDemo('success')} /><SecondaryButton label="Toast" icon="notifications-outline" onPress={() => switchDemo('toast')} /></View>
    </Section>

    <Section title="Empty + error states">
      <EmptyState icon="images-outline" title="No evidence yet" body="Add a photo, video, voice note, or document to start building the inspection record." actionLabel="Add evidence" onAction={actions?.onOpenMedia} />
      <WarningBanner title="Market data unavailable" body="The vehicle is saved locally. Retry when network access is restored; do not force the user to restart the inspection." tone="amber" style={{ marginTop: 10 }} />
    </Section>

    <Section title="Skeletons">
      <Skeleton style={{ marginBottom: 10 }} />
      <SkeletonList count={3} />
    </Section>

    <Section title="Interactive affordances">
      <View style={styles.tiles}><PressableTile title="Photo quality" subtitle="Good framing" icon="camera-outline" tone="mint" selected onPress={() => setToast(true)} /><PressableTile title="Voice note" subtitle="00:08 recorded" icon="mic-outline" tone="amber" onPress={() => setSuccess(true)} /><PressableTile title="Document" subtitle="Service invoice" icon="document-outline" tone="cyan" onPress={() => setToast(true)} /><PressableTile title="Risk detail" subtitle="7 findings" icon="warning-outline" tone="coral" onPress={() => setToast(true)} /></View>
      <Accordion title="Motion should communicate state" icon="pulse-outline" defaultOpen><Text style={styles.body}>Use movement for progress, causality, confirmation, and focus. Keep decorative motion restrained and respect reduced-motion settings.</Text><Divider style={{ marginVertical: 10 }} /><Text style={styles.body}>Examples: a scan line means scanning; a count-up means calculation; a springing check means confirmation; an expanding panel means more evidence is available.</Text></Accordion>
    </Section>

    <View style={styles.bottomButtons}><PrimaryButton label="Simulate success" icon="sparkles" onPress={() => { setSuccess(true); setToast(true); }} /><SecondaryButton label="Open design system" icon="color-palette-outline" onPress={() => actions?.onNavigate?.('design-system')} style={{ marginTop: 8, marginBottom: 30 }} /></View>
    <Toast visible={toast} title="CarWise interaction" message="This is a frontend feedback pattern. Connect it to your real event system." onClose={() => setToast(false)} />
    <View style={styles.successOverlay} pointerEvents="none"><SuccessPulse visible={success} /></View>
  </Screen>;
}

function Section({ title, children }) { return <View style={styles.section}><View style={styles.sectionHeader}><Text style={TYPOGRAPHY.h3}>{title}</Text><Text style={TYPOGRAPHY.meta}>PREVIEW</Text></View>{children}</View>; }

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  section: { marginTop: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  horizontal: { flexDirection: 'row' },
  bigTitle: { color: COLORS.text, fontSize: 18, fontWeight: '900', marginTop: 2 },
  body: { color: COLORS.textSecondary, fontSize: 10, lineHeight: 15, marginTop: 4 },
  pills: { flexDirection: 'row', marginTop: 8 },
  actionRow: { flexDirection: 'row', gap: 7, marginTop: 9 },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  bottomButtons: { marginTop: 20 },
  successOverlay: { position: 'absolute', left: 0, right: 0, bottom: 96, alignItems: 'center' },
});
