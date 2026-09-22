import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { Accordion, EvidenceTimeline, MetricPill, TagCloud } from '../components/Advanced';
import { Badge, ChipRow, PrimaryButton, Screen, ScreenHeader, SectionHeader, SecondaryButton, SurfaceCard, WarningBanner } from '../components/Primitives';
import { AIQualityCard, AIInsightCard } from '../components/AI';
import { EvidenceGallery } from '../components/Media';
import { FullscreenEvidenceViewer } from '../components/VehiclePhotoViewer';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'flagged', label: 'Flagged' },
  { value: 'clear', label: 'Clear' },
];

export default function EvidenceReviewScreen({ data, actions }) {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [viewer, setViewer] = useState(false);
  const photos = useMemo(() => {
    const source = (data.photos || []).map((photo, index) => ({ ...photo, findings: photo.findings || (index === 0 ? [{ id: 'f1', label: 'Bumper scratch', confidence: 92, x: 61, y: 56 }] : []) }));
    if (filter === 'flagged') return source.filter((photo) => photo.findings.length);
    if (filter === 'clear') return source.filter((photo) => !photo.findings.length);
    return source;
  }, [data.photos, filter]);
  const active = selected || photos[0];
  const evidenceCount = photos.reduce((sum, photo) => sum + 1 + (photo.findings?.length || 0), 0);
  return <Screen scroll contentStyle={styles.content}>
    <ScreenHeader title="Evidence Review" subtitle="Confirm what the AI sees before it enters the report." onBack={actions?.onBack} right={<Badge tone="cyan" label={`${evidenceCount} SIGNALS`} />} />
    <SurfaceCard tone="cyan"><View style={COMMON.row}><View style={styles.signalIcon}><Ionicons name="eye-outline" size={23} color={COLORS.cyan} /></View><View style={COMMON.fill}><Text style={TYPOGRAPHY.eyebrow}>HUMAN CHECKPOINT</Text><Text style={styles.heroTitle}>See the evidence, then confirm the finding.</Text><Text style={styles.heroBody}>Keep AI suggestions editable and traceable. A user should be able to reject, change, or add context before a finding becomes part of the report.</Text></View></View></SurfaceCard>

    <SectionHeader title="Evidence gallery" subtitle={`${photos.length} media items`} style={{ marginTop: 19 }} />
    <ChipRow items={FILTERS} selected={filter} onSelect={setFilter} />
    <EvidenceGallery items={photos} onOpen={(photo) => { setSelected(photo); setViewer(true); }} />

    {active ? <><SectionHeader title="Selected evidence" subtitle={active.label || 'Photo'} style={{ marginTop: 19 }} /><SurfaceCard tone={active.findings?.length ? 'amber' : 'mint'}><View style={COMMON.row}><View style={styles.preview}><Ionicons name="image-outline" size={25} color={COLORS.textSecondary} /></View><View style={COMMON.fill}><Text style={styles.activeTitle}>{active.label || 'Evidence image'}</Text><Text style={styles.activeBody}>{active.findings?.length ? `${active.findings.length} AI annotation${active.findings.length > 1 ? 's' : ''} linked.` : 'No visible finding annotations on this image.'}</Text></View><MetricPill label="QUALITY" value="GOOD" tone="mint" /></View><View style={styles.activeActions}><SecondaryButton label="Open full screen" icon="expand-outline" onPress={() => setViewer(true)} /><SecondaryButton label="Add note" icon="create-outline" onPress={() => actions?.onAddNote?.(active)} /></View></SurfaceCard></> : null}

    <SectionHeader title="AI quality checks" subtitle="Before confirming" style={{ marginTop: 19 }} />
    <AIQualityCard score={91} />

    <SectionHeader title="Linked findings" subtitle="Evidence-backed" style={{ marginTop: 19 }} />
    {data.findings.map((finding) => <AIInsightCard key={finding.id} finding={finding} onViewEvidence={() => actions?.onOpenFinding?.(finding)} />)}

    <WarningBanner title="Confirmation matters" body="AI annotations are estimates. Keep user confirmation and supporting evidence visible wherever a finding influences pricing or negotiation." tone="amber" style={{ marginTop: 12 }} />

    <SectionHeader title="Inspection timeline" subtitle="What changed" style={{ marginTop: 19 }} />
    <SurfaceCard><EvidenceTimeline events={[
      { id: 'r1', time: '10:47', type: 'PHOTO', title: 'Front bumper captured', description: 'Image quality passed capture checks.', color: COLORS.cyan },
      { id: 'r2', time: '10:48', type: 'AI', title: 'Scratch annotation created', description: '92% confidence; awaiting confirmation.', color: COLORS.amber },
      { id: 'r3', time: '10:52', type: 'USER', title: 'Finding confirmed', description: 'Evidence linked to inspection report.', color: COLORS.mint },
    ]} /></SurfaceCard>

    <Accordion title="What happens after confirmation?" icon="arrow-forward-circle-outline" defaultOpen><Text style={styles.body}>Confirmed findings can feed the report, repair-cost view, fair-price calculation, and negotiation talking points. Keep the evidence link visible on each destination screen.</Text><View style={styles.flowLine}><MetricPill label="EVIDENCE" value="PHOTO" tone="cyan" /><Ionicons name="arrow-forward" size={13} color={COLORS.textTertiary} /><MetricPill label="FINDING" value="ISSUE" tone="amber" /><Ionicons name="arrow-forward" size={13} color={COLORS.textTertiary} /><MetricPill label="REPORT" value="LINKED" tone="mint" /></View></Accordion>

    <View style={styles.actions}><PrimaryButton label="Confirm selected evidence" icon="checkmark-done" onPress={() => Alert.alert('Demo', 'Wire this to the repository finding-confirmation action.')} /><SecondaryButton label="Open AI analysis" icon="sparkles-outline" onPress={() => actions?.onNavigate?.('ai')} style={{ marginTop: 8, marginBottom: 30 }} /></View>
    <FullscreenEvidenceViewer visible={viewer} photos={photos} initialIndex={Math.max(0, photos.findIndex((item) => item.id === active?.id))} onClose={() => setViewer(false)} onSelectFinding={(item) => actions?.onOpenFinding?.(item)} />
  </Screen>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  signalIcon: { width: 50, height: 50, borderRadius: 17, backgroundColor: alpha(COLORS.cyan, 0.09), borderWidth: 1, borderColor: alpha(COLORS.cyan, 0.18), alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  heroTitle: { color: COLORS.text, fontSize: 17, lineHeight: 22, fontWeight: '900', marginTop: 4 },
  heroBody: { color: COLORS.textSecondary, fontSize: 9, lineHeight: 14, marginTop: 4 },
  preview: { width: 62, height: 62, borderRadius: 16, backgroundColor: COLORS.surfaceSoft, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  activeTitle: { color: COLORS.text, fontSize: 12, fontWeight: '850' },
  activeBody: { color: COLORS.textSecondary, fontSize: 9, lineHeight: 13, marginTop: 2, maxWidth: 190 },
  activeActions: { flexDirection: 'row', gap: 8, marginTop: 13 },
  body: { color: COLORS.textSecondary, fontSize: 10, lineHeight: 15 },
  flowLine: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  actions: { marginTop: 14 },
});
