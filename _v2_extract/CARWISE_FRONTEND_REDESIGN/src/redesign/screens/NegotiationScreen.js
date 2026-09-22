import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha, toneColor } from '../theme';
import { Badge, PrimaryButton, Screen, ScreenHeader, SecondaryButton, SurfaceCard } from '../components/Primitives';
import { Waterfall } from '../components/Charts';

export default function NegotiationScreen({ data, actions }) {
  const fair = Number(data.market?.fair || 21100);
  const asking = Number(data.vehicle?.asking || data.market?.current || 21900);
  const repairs = Number(data.repairTotal || 0);
  const opening = Math.max(0, Math.round((fair - repairs * 0.55) / 100) * 100);
  const target = Math.max(0, Math.round((fair - repairs * 0.8) / 100) * 100);
  const maximum = Math.max(target, Math.round((fair - repairs * 0.2) / 100) * 100);
  const talkingPoints = [
    `The current asking price is ${formatDelta(asking - fair)} compared with the fair-value estimate.`,
    repairs ? `Current repair estimates total about $${repairs.toLocaleString()}, subject to confirmation.` : 'No repair estimate has been added yet.',
    `${data.issues?.length || 0} inspection finding${data.issues?.length === 1 ? '' : 's'} is recorded in the current inspection.`,
  ];
  const copyText = `CarWise inspection\nOpening offer: $${opening.toLocaleString()}\nTarget: $${target.toLocaleString()}\nMaximum: $${maximum.toLocaleString()}\n\n${talkingPoints.join('\n')}`;
  const copy = async () => { try { await Share.share({ message: copyText }); } catch (_) { actions?.onToast?.('Share is unavailable on this device'); } };

  return <Screen contentStyle={styles.content}>
    <ScreenHeader title="Negotiation Coach" subtitle="Turn inspection evidence into a clear, human-controlled offer conversation." onBack={actions?.onBack} right={<Badge tone="blue" label="COACH" icon="chatbubbles-outline" />} />
    <SurfaceCard tone="blue" style={styles.hero}><Text style={TYPOGRAPHY.eyebrow}>NEGOTIATION RANGE</Text><Text style={styles.heroTitle}>Know your numbers before the conversation.</Text><Text style={styles.heroBody}>The figures below are decision-support estimates built from the current market and inspection inputs.</Text><Waterfall rows={[{ id: 'opening', label: 'Opening offer', value: opening, display: `$${opening.toLocaleString()}`, tone: 'cyan' }, { id: 'target', label: 'Target', value: target, display: `$${target.toLocaleString()}`, tone: 'mint' }, { id: 'max', label: 'Maximum', value: maximum, display: `$${maximum.toLocaleString()}`, tone: 'amber' }, { id: 'ask', label: 'Seller asking', value: asking, display: `$${asking.toLocaleString()}`, tone: 'coral' }]} /></SurfaceCard>

    <View style={styles.rangeRow}><RangeCard label="Opening" value={opening} tone="cyan" note="Conversation starter" /><RangeCard label="Target" value={target} tone="mint" note="Preferred outcome" /><RangeCard label="Maximum" value={maximum} tone="amber" note="Your ceiling" /></View>

    <View style={{ marginTop: 23 }}><SurfaceCard><View style={COMMON.rowBetween}><View><Text style={TYPOGRAPHY.eyebrow}>SELLER TALKING POINTS</Text><Text style={TYPOGRAPHY.h3}>Use evidence, not drama</Text></View><Pressable onPress={copy} style={styles.copy}><Ionicons name="copy-outline" size={16} color={COLORS.cyan} /><Text style={styles.copyText}>Copy</Text></Pressable></View>{talkingPoints.map((point, index) => <TalkingPoint key={point} index={index} text={point} onEvidence={actions?.onOpenAI} />)}</SurfaceCard></View>

    <View style={{ marginTop: 23 }}><SurfaceCard tone="amber"><Text style={TYPOGRAPHY.eyebrow}>REPAIR IMPACT</Text><Text style={TYPOGRAPHY.h3}>Don't hide the assumptions</Text><Text style={styles.repairBody}>Ask the seller to verify the highest-impact findings. Repair ranges are estimates and can change after a professional assessment.</Text><View style={styles.repairTotal}><Text style={styles.repairCaption}>Current estimate</Text><Text style={styles.repairValue}>${repairs.toLocaleString()}</Text></View><SecondaryButton label="Review repair details" icon="build-outline" onPress={actions?.onOpenCost} /></SurfaceCard></View>

    <SurfaceCard style={{ marginTop: 23 }}><Text style={TYPOGRAPHY.eyebrow}>CONVERSATION SCRIPT</Text><Text style={styles.script}>“I like the vehicle, but I’m seeing a few condition items that affect what I’m comfortable paying. Based on the current market and the documented findings, I’d like to discuss an offer around ${opening.toLocaleString()} and work toward ${target.toLocaleString()}.”</Text><Text style={styles.disclaimer}>Keep the script human. CarWise provides a framework; you remain responsible for what you say and agree to.</Text></SurfaceCard>

    <View style={{ marginTop: 23 }}><PrimaryButton label="Generate contract" icon="document-text-outline" onPress={actions?.onGenerateContract} /><SecondaryButton label="Return to inspection" icon="arrow-back" onPress={actions?.onBackToInspection} style={{ marginTop: 9 }} /></View>
  </Screen>;
}

function RangeCard({ label, value, tone, note }) { return <View style={styles.rangeCard}><Text style={styles.rangeLabel}>{label}</Text><Text style={[styles.rangeValue, { color: toneColor(tone) }]}>${value.toLocaleString()}</Text><Text style={styles.rangeNote}>{note}</Text></View>; }
function TalkingPoint({ index, text, onEvidence }) { return <View style={styles.point}><View style={styles.pointNumber}><Text style={styles.pointNumberText}>{index + 1}</Text></View><View style={COMMON.fill}><Text style={styles.pointText}>{text}</Text><Pressable onPress={onEvidence} hitSlop={8}><Text style={styles.pointEvidence}>View supporting evidence →</Text></Pressable></View></View>; }
function formatDelta(value) { return value > 0 ? `$${Math.abs(value).toLocaleString()} above fair value` : value < 0 ? `$${Math.abs(value).toLocaleString()} below fair value` : 'at the fair-value estimate'; }

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  hero: { marginTop: 4 },
  heroTitle: { color: COLORS.text, fontSize: 21, lineHeight: 27, fontWeight: '850', marginTop: 7 },
  heroBody: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 17, marginTop: 6 },
  rangeRow: { flexDirection: 'row', gap: 7, marginTop: 11 },
  rangeCard: { flex: 1, borderRadius: 15, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, padding: 11 },
  rangeLabel: { color: COLORS.textTertiary, fontSize: 9, fontWeight: '850', textTransform: 'uppercase' },
  rangeValue: { fontSize: 17, fontWeight: '900', marginTop: 8 },
  rangeNote: { color: COLORS.textTertiary, fontSize: 9, lineHeight: 13, marginTop: 3 },
  copy: { minHeight: 34, borderRadius: 11, borderWidth: 1, borderColor: alpha(COLORS.cyan, 0.25), backgroundColor: alpha(COLORS.cyan, 0.08), paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', gap: 5 },
  copyText: { color: COLORS.cyan, fontSize: 10, fontWeight: '850' },
  point: { flexDirection: 'row', gap: 9, marginTop: 14 },
  pointNumber: { width: 25, height: 25, borderRadius: 9, backgroundColor: COLORS.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  pointNumberText: { color: COLORS.cyan, fontSize: 10, fontWeight: '900' },
  pointText: { color: COLORS.text, fontSize: 12, lineHeight: 18 },
  pointEvidence: { color: COLORS.blue, fontSize: 10, fontWeight: '800', marginTop: 5 },
  repairBody: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 17, marginTop: 7 },
  repairTotal: { marginVertical: 12, padding: 12, borderRadius: 13, backgroundColor: COLORS.surfaceElevated },
  repairCaption: { color: COLORS.textTertiary, fontSize: 10 },
  repairValue: { color: COLORS.amber, fontSize: 24, fontWeight: '900', marginTop: 2 },
  script: { color: COLORS.text, fontSize: 15, lineHeight: 23, marginTop: 10 },
  disclaimer: { color: COLORS.textTertiary, fontSize: 10, lineHeight: 15, marginTop: 10 },
});
