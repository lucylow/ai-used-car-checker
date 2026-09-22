import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, RADIUS, SPACE, TYPOGRAPHY, alpha, toneColor } from '../theme';
import { Badge, SurfaceCard, SecondaryButton, PrimaryButton, Divider } from './Primitives';
import { ConfidenceMeter, HorizontalBars, ScoreRing } from './Charts';
import { useReducedMotion, pulseAnimation } from '../motion';

export function AIProcessingCard({ stages, activeStage = 0, title = 'CarWise is reviewing the evidence' }) {
  const reduced = useReducedMotion();
  const pulse = useRef(new Animated.Value(0.42)).current;
  useEffect(() => pulseAnimation(pulse, reduced, 0.42, 1), [pulse, reduced]);
  return <SurfaceCard tone="blue" style={styles.processingCard}>
    <View style={styles.processingOrbWrap}><Animated.View style={[styles.processingOrb, { opacity: pulse }]}><Ionicons name="sparkles" size={25} color={COLORS.white} /></Animated.View></View>
    <Text style={TYPOGRAPHY.h3}>{title}</Text>
    <Text style={styles.processingBody}>Combining image evidence, inspection notes, and vehicle context. AI results remain estimates until reviewed.</Text>
    <View style={styles.stageList}>{stages.map((stage, index) => { const complete = index < activeStage; const active = index === activeStage; return <View key={stage} style={styles.stageRow}><View style={[styles.stageDot, complete && styles.stageDotComplete, active && styles.stageDotActive]}>{complete ? <Ionicons name="checkmark" size={11} color={COLORS.bg} /> : <Text style={[styles.stageNumber, active && { color: COLORS.bg }]}>{index + 1}</Text>}</View><View style={COMMON.fill}><Text style={[styles.stageText, active && { color: COLORS.text }]}>{stage}</Text></View>{active ? <Badge tone="cyan" label="WORKING" /> : null}</View>; })}</View>
  </SurfaceCard>;
}

export function AIInsightCard({ finding, expanded, onToggle, onConfirm, onEdit }) {
  const [showEvidence, setShowEvidence] = useState(false);
  const tone = finding?.severity === 'critical' ? 'coral' : finding?.severity === 'major' ? 'amber' : 'mint';
  const color = toneColor(tone);
  return <SurfaceCard tone={tone}>
    <Pressable accessibilityRole="button" onPress={onToggle} style={styles.findingHeader}>
      <View style={[styles.findingIcon, { backgroundColor: alpha(color, 0.12) }]}><Ionicons name={finding?.severity === 'critical' ? 'alert' : 'scan-outline'} size={20} color={color} /></View>
      <View style={COMMON.fill}><Text style={styles.findingTitle}>{finding?.title || 'Finding'}</Text><Text style={styles.findingMeta}>{finding?.zone || 'Vehicle area'} · {Math.round((finding?.confidence || 0) * 100)}% confidence</Text></View><Badge tone={tone} label={(finding?.severity || 'minor').toUpperCase()} /><Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={17} color={COLORS.textTertiary} />
    </Pressable>
    {expanded ? <View style={styles.findingExpanded}>
      <Text style={styles.findingDescription}>{finding?.description}</Text>
      <ConfidenceMeter confidence={finding?.confidence || 0} label="AI confidence" tone={tone} />
      <View style={styles.findingCostRow}><View><Text style={styles.costCaption}>Repair range</Text><Text style={styles.costValue}>${Number(finding?.costLow || 0).toLocaleString()}–${Number(finding?.costHigh || 0).toLocaleString()}</Text></View><Badge tone="blue" label="ESTIMATE" /></View>
      <Pressable onPress={() => setShowEvidence((value) => !value)} style={styles.whyRow}><Ionicons name="information-circle-outline" size={16} color={COLORS.cyan} /><Text style={styles.whyText}>{showEvidence ? 'Hide evidence details' : 'Why am I seeing this?'}</Text><Ionicons name={showEvidence ? 'chevron-up' : 'chevron-down'} size={15} color={COLORS.textSecondary} /></Pressable>
      {showEvidence ? <EvidenceReasonPanel finding={finding} /> : null}
      <View style={styles.findingActions}><SecondaryButton label="Edit finding" onPress={() => onEdit?.(finding)} style={{ flex: 1 }} /><PrimaryButton label="Confirm" icon="checkmark" onPress={() => onConfirm?.(finding)} compact style={{ flex: 1 }} /></View>
    </View> : null}
  </SurfaceCard>;
}

function EvidenceReasonPanel({ finding }) {
  const evidence = finding?.evidenceIds?.length || 0;
  return <View style={styles.evidencePanel}><Text style={styles.evidencePanelTitle}>Evidence used</Text><View style={styles.evidenceReasonRow}><Ionicons name="images-outline" size={15} color={COLORS.cyan} /><Text style={styles.evidenceReasonText}>{evidence ? `${evidence} linked image${evidence === 1 ? '' : 's'}` : 'No linked photo yet'}</Text></View><View style={styles.evidenceReasonRow}><Ionicons name="location-outline" size={15} color={COLORS.textSecondary} /><Text style={styles.evidenceReasonText}>{finding?.zone || 'Vehicle area'} selected</Text></View><View style={styles.evidenceReasonRow}><Ionicons name="shield-checkmark-outline" size={15} color={COLORS.mint} /><Text style={styles.evidenceReasonText}>Review before adding to verified report</Text></View></View>;
}

export function AIQualityCard({ evidenceCount = 0, findingCount = 0, confidence = 0.86 }) {
  const quality = Math.min(100, 35 + evidenceCount * 9 + findingCount * 7 + Math.round(confidence * 30));
  const tone = quality >= 80 ? 'mint' : quality >= 55 ? 'amber' : 'coral';
  return <SurfaceCard>
    <View style={COMMON.rowBetween}><View><Text style={TYPOGRAPHY.eyebrow}>ANALYSIS QUALITY</Text><Text style={TYPOGRAPHY.h3}>Evidence coverage</Text></View><Badge tone={tone} label={quality >= 80 ? 'STRONG' : quality >= 55 ? 'GOOD' : 'LIMITED'} /></View>
    <Text style={[styles.qualityScore, { color: toneColor(tone) }]}>{quality}</Text>
    <Text style={styles.qualityBody}>More independent photos and reviewed findings generally improve the usefulness of the AI-assisted summary.</Text>
    <HorizontalBars tone={tone} rows={[{ label: 'Media coverage', value: Math.min(100, evidenceCount * 18), display: `${evidenceCount} items` }, { label: 'Finding review', value: Math.min(100, findingCount * 25), display: `${findingCount} findings` }, { label: 'Confidence', value: Math.round(confidence * 100), display: `${Math.round(confidence * 100)}%` }]} max={100} />
  </SurfaceCard>;
}

export function AIActionRail({ onReview, onAddMedia, onOpenCopilot, disabled = false }) {
  return <View style={styles.actionRail}>
    <Pressable disabled={disabled} onPress={onReview} style={styles.railAction}><View style={styles.railIcon}><Ionicons name="checkmark-circle-outline" size={19} color={COLORS.mint} /></View><Text style={styles.railLabel}>Review</Text></Pressable>
    <Pressable disabled={disabled} onPress={onAddMedia} style={styles.railAction}><View style={styles.railIcon}><Ionicons name="camera-outline" size={19} color={COLORS.cyan} /></View><Text style={styles.railLabel}>Add evidence</Text></Pressable>
    <Pressable disabled={disabled} onPress={onOpenCopilot} style={styles.railAction}><View style={styles.railIcon}><Ionicons name="sparkles-outline" size={19} color={COLORS.blue} /></View><Text style={styles.railLabel}>Ask AI</Text></Pressable>
  </View>;
}

export function RiskDecisionCard({ riskScore, riskText, fairPrice, asking, repairs, onPress }) {
  const tone = riskScore >= 55 ? 'coral' : riskScore >= 30 ? 'amber' : 'mint';
  return <SurfaceCard tone={tone}>
    <View style={styles.riskHeader}><View><Text style={TYPOGRAPHY.eyebrow}>DECISION SNAPSHOT</Text><Text style={TYPOGRAPHY.h2}>{riskText}</Text></View><ScoreRing score={riskScore} label="Risk" tone={tone} size={100} /></View>
    <Divider spacing={12} />
    <View style={styles.decisionGrid}><DecisionMetric label="Fair price" value={`$${Number(fairPrice || 0).toLocaleString()}`} tone="mint" /><DecisionMetric label="Asking" value={`$${Number(asking || 0).toLocaleString()}`} tone="blue" /><DecisionMetric label="Repairs" value={`$${Number(repairs || 0).toLocaleString()}`} tone="amber" /></View>
    {onPress ? <SecondaryButton label="Open full decision view" onPress={onPress} /> : null}
  </SurfaceCard>;
}

function DecisionMetric({ label, value, tone }) {
  return <View style={styles.decisionMetric}><Text style={styles.decisionLabel}>{label}</Text><Text style={[styles.decisionValue, { color: toneColor(tone) }]}>{value}</Text></View>;
}

export function CopilotSuggestion({ question, answer, evidence, onAsk }) {
  return <SurfaceCard tone="blue">
    <View style={COMMON.rowBetween}><View style={styles.copilotTitle}><View style={styles.aiDot}><Ionicons name="sparkles" size={14} color={COLORS.white} /></View><Text style={TYPOGRAPHY.h3}>CarWise Copilot</Text></View><Badge tone="cyan" label="AI" /></View>
    <Text style={styles.question}>{question}</Text>
    <Text style={styles.answer}>{answer}</Text>
    <View style={styles.evidenceChipRow}>{(evidence || []).map((item) => <View key={item} style={styles.evidenceChip}><Ionicons name="link-outline" size={11} color={COLORS.cyan} /><Text style={styles.evidenceChipText}>{item}</Text></View>)}</View>
    <SecondaryButton label="Ask a follow-up" icon="sparkles-outline" onPress={onAsk} />
  </SurfaceCard>;
}

const styles = StyleSheet.create({
  processingCard: { alignItems: 'center' },
  processingOrbWrap: { width: 70, height: 70, borderRadius: 35, backgroundColor: alpha(COLORS.cyan, 0.07), justifyContent: 'center', alignItems: 'center', marginBottom: 13 },
  processingOrb: { width: 53, height: 53, borderRadius: 27, backgroundColor: COLORS.blue, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.cyan, shadowOpacity: 0.25, shadowRadius: 20, shadowOffset: { width: 0, height: 0 } },
  processingBody: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18, textAlign: 'center', maxWidth: 310, marginTop: 7 },
  stageList: { width: '100%', marginTop: 17, gap: 5 },
  stageRow: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 9 },
  stageDot: { width: 25, height: 25, borderRadius: 13, backgroundColor: COLORS.surfaceSoft, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  stageDotComplete: { backgroundColor: COLORS.mint, borderColor: COLORS.mint },
  stageDotActive: { backgroundColor: COLORS.cyan, borderColor: COLORS.cyan },
  stageNumber: { color: COLORS.textTertiary, fontSize: 9, fontWeight: '900' },
  stageText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700' },
  findingHeader: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  findingIcon: { width: 40, height: 40, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  findingTitle: { color: COLORS.text, fontSize: 14, fontWeight: '850' },
  findingMeta: { color: COLORS.textTertiary, fontSize: 10, marginTop: 3 },
  findingExpanded: { marginTop: 13 },
  findingDescription: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18 },
  findingCostRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 11, borderRadius: 13, backgroundColor: COLORS.surfaceElevated, marginTop: 12 },
  costCaption: { color: COLORS.textTertiary, fontSize: 10 },
  costValue: { color: COLORS.amber, fontSize: 17, fontWeight: '900', marginTop: 2 },
  whyRow: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 7 },
  whyText: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '750', flex: 1 },
  evidencePanel: { padding: 12, borderRadius: 14, backgroundColor: alpha(COLORS.cyan, 0.06), borderWidth: 1, borderColor: alpha(COLORS.cyan, 0.18), marginTop: 2 },
  evidencePanelTitle: { color: COLORS.text, fontSize: 11, fontWeight: '850', marginBottom: 6 },
  evidenceReasonRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  evidenceReasonText: { color: COLORS.textSecondary, fontSize: 10, lineHeight: 15 },
  findingActions: { flexDirection: 'row', gap: 8, marginTop: 13 },
  qualityScore: { fontSize: 45, fontWeight: '900', marginTop: 12 },
  qualityBody: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 17, marginTop: 1, marginBottom: 12 },
  actionRail: { flexDirection: 'row', gap: 8, marginTop: 10 },
  railAction: { flex: 1, minHeight: 70, borderRadius: 15, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  railIcon: { width: 33, height: 33, borderRadius: 11, backgroundColor: COLORS.surfaceElevated, justifyContent: 'center', alignItems: 'center' },
  railLabel: { color: COLORS.textSecondary, fontSize: 9, fontWeight: '750', marginTop: 5 },
  riskHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  decisionGrid: { flexDirection: 'row', gap: 7, marginBottom: 13 },
  decisionMetric: { flex: 1, borderRadius: 13, backgroundColor: COLORS.surfaceElevated, padding: 10 },
  decisionLabel: { color: COLORS.textTertiary, fontSize: 9, fontWeight: '700' },
  decisionValue: { fontSize: 15, fontWeight: '900', marginTop: 4 },
  copilotTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiDot: { width: 29, height: 29, borderRadius: 10, backgroundColor: COLORS.blue, justifyContent: 'center', alignItems: 'center' },
  question: { color: COLORS.textTertiary, fontSize: 10, fontWeight: '750', marginTop: 14 },
  answer: { color: COLORS.text, fontSize: 14, lineHeight: 21, marginTop: 5 },
  evidenceChipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 11, marginBottom: 2 },
  evidenceChip: { minHeight: 23, borderRadius: 12, backgroundColor: alpha(COLORS.cyan, 0.08), borderWidth: 1, borderColor: alpha(COLORS.cyan, 0.16), paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', gap: 4 },
  evidenceChipText: { color: COLORS.textSecondary, fontSize: 9, fontWeight: '700' },
});
