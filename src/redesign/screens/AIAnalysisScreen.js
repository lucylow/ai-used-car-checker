import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha, toneColor } from '../theme';
import { Badge, PrimaryButton, Screen, ScreenHeader, SectionHeader, SurfaceCard, WarningBanner } from '../components/Primitives';
import { AIActionRail, AIInsightCard, AIProcessingCard, CopilotSuggestion } from '../components/AI';
import { ScoreRing, HorizontalBars } from '../components/Charts';
import { EvidenceGallery } from '../components/Media';

const STAGES = ['Preparing evidence', 'Reviewing images', 'Cross-checking findings', 'Building price impact', 'Preparing decision summary'];

export default function AIAnalysisScreen({ data, actions }) {
  const [expanded, setExpanded] = useState(data.findings?.[0]?.id || null);
  const [running, setRunning] = useState(Boolean(data.aiBusy));
  const [activeStage, setActiveStage] = useState(data.aiStage || 2);
  const findings = data.findings || [];
  const quality = findings.length ? Math.round(findings.reduce((sum, item) => sum + (item.confidence || 0), 0) / findings.length * 100) : Math.round((data.aiConfidence || 0.86) * 100);
  const counts = useMemo(() => findings.reduce((acc, item) => { acc[item.severity] = (acc[item.severity] || 0) + 1; return acc; }, {}), [findings]);

  const run = async () => {
    setRunning(true);
    for (let i = 0; i < STAGES.length; i += 1) {
      setActiveStage(i);
      await new Promise((resolve) => setTimeout(resolve, 260));
    }
    await actions?.onRunAI?.();
    setRunning(false);
    setActiveStage(STAGES.length - 1);
  };

  return <Screen contentStyle={styles.content}>
    <ScreenHeader title="AI Analysis" subtitle="Computer vision and inspection context in one reviewable layer." onBack={actions?.onBack} right={<Badge tone="cyan" label="AI ASSIST" icon="sparkles" />} />
    {running ? <AIProcessingCard stages={STAGES} activeStage={activeStage} /> : null}

    {!running ? <>
      <SurfaceCard tone={data.riskScore >= 55 ? 'coral' : data.riskScore >= 30 ? 'amber' : 'mint'} style={styles.scoreHero}>
        <View style={styles.scoreTop}><View style={COMMON.fill}><Text style={TYPOGRAPHY.eyebrow}>AI RISK SUMMARY</Text><Text style={TYPOGRAPHY.h2}>{data.riskLabel}</Text><Text style={styles.scoreBody}>This score is derived from current inspection issues. It is an estimate, not a mechanical diagnosis.</Text></View><ScoreRing score={data.riskScore} label="Risk" tone={data.riskScore >= 55 ? 'coral' : data.riskScore >= 30 ? 'amber' : 'mint'} size={132} /></View>
        <View style={styles.countRow}><CountPill tone="coral" value={counts.critical || 0} label="critical" /><CountPill tone="amber" value={counts.major || 0} label="major" /><CountPill tone="mint" value={counts.minor || 0} label="minor" /><CountPill tone="cyan" value={data.photos?.length || 0} label="evidence" /></View>
      </SurfaceCard>

      {(data.photos?.length || 0) < 2 ? <WarningBanner title="Add more evidence" body="Two or more clear images usually produce a more useful visual review. Capture the vehicle from multiple angles before confirming findings." tone="amber" actionLabel="Add photos" onAction={actions?.onAddEvidence} /> : null}

      <View style={styles.railWrap}><AIActionRail onReview={() => setExpanded(findings[0]?.id)} onAddMedia={actions?.onAddEvidence} onOpenCopilot={actions?.onOpenCopilot} /></View>

      <View style={{ marginTop: 22 }}><SectionHeader eyebrow="EVIDENCE" title="What the model reviewed" subtitle="Open an image to inspect the context behind a finding." /><EvidenceGallery items={data.photos || []} onOpen={actions?.onOpenEvidence} onAdd={actions?.onAddEvidence} /></View>

      <View style={{ marginTop: 24 }}><SectionHeader eyebrow="FINDINGS" title={`${findings.length} observations`} subtitle="Review, edit, then confirm before they affect your report." />{findings.map((finding) => <AIInsightCard key={finding.id} finding={finding} expanded={expanded === finding.id} onToggle={() => setExpanded((current) => current === finding.id ? null : finding.id)} onConfirm={actions?.onConfirmFinding} onEdit={actions?.onEditFinding} />)}</View>

      <View style={{ marginTop: 24 }}><SurfaceCard><View style={COMMON.rowBetween}><View><Text style={TYPOGRAPHY.eyebrow}>CONFIDENCE SNAPSHOT</Text><Text style={TYPOGRAPHY.h3}>{quality}% average confidence</Text></View><Badge tone={quality >= 80 ? 'mint' : quality >= 60 ? 'amber' : 'coral'} label={quality >= 80 ? 'STRONG' : 'REVIEW'} /></View><HorizontalBars rows={[{ label: 'Visual confidence', value: quality, display: `${quality}%`, color: COLORS.cyan }, { label: 'Evidence coverage', value: Math.min(100, (data.photos?.length || 0) * 18), display: `${data.photos?.length || 0} media`, color: COLORS.blue }, { label: 'Human review', value: findings.filter((item) => item.status === 'confirmed').length / Math.max(1, findings.length) * 100, display: `${findings.filter((item) => item.status === 'confirmed').length}/${findings.length}`, color: COLORS.mint }]} max={100} /></SurfaceCard></View>

      <View style={{ marginTop: 24 }}><CopilotSuggestion question="What should I look at next?" answer="Start with any major findings that have weak evidence. Add one close-up photo, then verify the issue manually before using it in the negotiation summary." evidence={['AI finding', 'photo coverage', 'inspection status']} onAsk={actions?.onOpenCopilot} /></View>
    </> : null}

    {!running ? <View style={{ marginTop: 24 }}><PrimaryButton label="Run AI analysis again" icon="refresh" onPress={run} /></View> : null}
  </Screen>;
}

function CountPill({ value, label, tone }) {
  return <View style={styles.countPill}><Text style={[styles.countValue, { color: toneColor(tone) }]}>{value}</Text><Text style={styles.countLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  scoreHero: { marginTop: 4 },
  scoreTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scoreBody: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 17, marginTop: 5, maxWidth: 205 },
  countRow: { flexDirection: 'row', gap: 7, marginTop: 14 },
  countPill: { flex: 1, borderRadius: 12, backgroundColor: COLORS.surfaceElevated, paddingVertical: 9, alignItems: 'center' },
  countValue: { fontSize: 17, fontWeight: '900' },
  countLabel: { color: COLORS.textTertiary, fontSize: 8, textTransform: 'uppercase', marginTop: 2, fontWeight: '800' },
  railWrap: { marginTop: 4 },
});
