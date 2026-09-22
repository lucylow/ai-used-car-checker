import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha, toneColor } from '../theme';
import { Badge, ChipRow, ProgressBar, Screen, ScreenHeader, SecondaryButton, SurfaceCard } from '../components/Primitives';
import { StickyActionBar, StepRail } from '../components/Navigation';
import { EvidenceComposer } from '../components/Media';
import { CHECKLIST_GROUPS } from '../data';

const STATUS_META = {
  pass: { label: 'PASS', tone: 'mint', icon: 'checkmark' },
  watch: { label: 'WATCH', tone: 'amber', icon: 'alert' },
  issue: { label: 'ISSUE', tone: 'coral', icon: 'close' },
};

export default function InspectionScreen({ data, actions }) {
  const [groupId, setGroupId] = useState('exterior');
  const [filter, setFilter] = useState('all');
  const group = CHECKLIST_GROUPS.find((item) => item.id === groupId) || CHECKLIST_GROUPS[0];
  const total = CHECKLIST_GROUPS.reduce((sum, item) => sum + item.items.length, 0);
  const checked = Object.values(data.checklist || {}).filter(Boolean).length;
  const progress = Math.round((checked / Math.max(total, 1)) * 100);
  const visibleItems = useMemo(() => group.items.filter(([id]) => {
    if (filter === 'all') return true;
    const status = getStatus(data.checklist?.[id]);
    return status === filter;
  }), [group, filter, data.checklist]);

  return <View style={COMMON.screen}>
    <Screen contentStyle={styles.content}>
      <ScreenHeader title="Inspection" subtitle="Capture observations and evidence as you move around the car." onBack={actions?.onBack} right={<Badge tone="cyan" label={`${checked}/${total}`} />} />
      <StepRail steps={[{ id: 'identify', label: 'Vehicle' }, { id: 'market', label: 'Market' }, { id: 'inspect', label: 'Inspect' }, { id: 'report', label: 'Report' }]} activeIndex={2} onSelect={(index) => index === 1 ? actions?.onOpenMarket() : index === 3 ? actions?.onOpenSummary() : null} />
      <SurfaceCard tone="blue" style={{ marginTop: 15 }}><ProgressBar progress={progress} label="Inspection progress" tone="cyan" /><Text style={styles.progressHint}>{progress < 100 ? `${Math.max(0, total - checked)} checks remain. Capture photos on anything you mark WATCH or ISSUE.` : 'Inspection checklist complete. Review evidence before generating the report.'}</Text></SurfaceCard>

      <View style={{ marginTop: 20 }}><ChipRow items={CHECKLIST_GROUPS.map((item) => ({ value: item.id, label: item.title }))} selected={groupId} onSelect={setGroupId} /></View>
      <View style={{ marginTop: 11 }}><ChipRow items={[{ value: 'all', label: 'All' }, { value: 'pass', label: 'Pass' }, { value: 'watch', label: 'Watch' }, { value: 'issue', label: 'Issue' }]} selected={filter} onSelect={setFilter} /></View>

      <View style={{ marginTop: 19 }}>
        {visibleItems.map(([id, label]) => <ChecklistRow key={id} id={id} label={label} status={data.checklist?.[id]} onStatus={(value) => actions?.onChecklistChange(id, value)} onAddEvidence={() => actions?.onAddEvidence(id)} />)}
        {!visibleItems.length ? <SurfaceCard style={styles.emptyFilter}><Ionicons name="filter-outline" size={24} color={COLORS.textTertiary} /><Text style={styles.emptyTitle}>Nothing in this filter</Text><Text style={styles.emptyText}>Try All or capture another observation in this category.</Text></SurfaceCard> : null}
      </View>

      <SurfaceCard style={styles.evidenceCard} tone="cyan"><View style={COMMON.rowBetween}><View><Text style={TYPOGRAPHY.eyebrow}>MULTIMODAL EVIDENCE</Text><Text style={TYPOGRAPHY.h3}>Support every important finding</Text></View><Badge tone="cyan" label={`${data.photos?.length || 0} MEDIA`} /></View><Text style={styles.evidenceText}>Photo, video, voice note, document, and text observations can travel with the same inspection item.</Text><EvidenceComposer onPhoto={() => actions?.onCapturePhoto()} onVideo={() => actions?.onCaptureVideo()} onVoice={() => actions?.onCaptureVoice()} onDocument={() => actions?.onPickDocument()} onText={() => actions?.onAddNote()} /></SurfaceCard>
    </Screen>
    <StickyActionBar primaryLabel={progress >= 100 ? 'Review report' : 'Review summary'} onPrimary={actions?.onOpenSummary} secondaryLabel="AI analysis" onSecondary={actions?.onOpenAI} />
  </View>;
}

function ChecklistRow({ id, label, status, onStatus, onAddEvidence }) {
  const selected = getStatus(status);
  return <SurfaceCard style={styles.rowCard}>
    <View style={styles.rowTop}><View style={[styles.checkCircle, selected && { backgroundColor: alpha(toneColor(STATUS_META[selected].tone), 0.14), borderColor: alpha(toneColor(STATUS_META[selected].tone), 0.3) }]}>{selected ? <Ionicons name={STATUS_META[selected].icon} size={15} color={toneColor(STATUS_META[selected].tone)} /> : <View style={styles.unchecked} />}</View><View style={COMMON.fill}><Text style={styles.itemTitle}>{label}</Text><Text style={styles.itemMeta}>{selected ? `${STATUS_META[selected].label} · tap to change` : 'Not checked yet'}</Text></View><Ionicons name="ellipsis-horizontal" size={18} color={COLORS.textTertiary} /></View>
    <View style={styles.statusRow}>{Object.entries(STATUS_META).map(([value, meta]) => <Pressable key={value} accessibilityRole="radio" accessibilityState={{ selected: selected === value }} onPress={() => onStatus?.(selected === value ? null : value)} style={[styles.statusButton, selected === value && { backgroundColor: alpha(toneColor(meta.tone), 0.11), borderColor: alpha(toneColor(meta.tone), 0.35) }]}><Ionicons name={meta.icon} size={13} color={selected === value ? toneColor(meta.tone) : COLORS.textTertiary} /><Text style={[styles.statusText, selected === value && { color: toneColor(meta.tone) }]}>{meta.label}</Text></Pressable>)}</View>
    <Pressable onPress={onAddEvidence} style={styles.addEvidence}><Ionicons name="camera-outline" size={15} color={COLORS.cyan} /><Text style={styles.addEvidenceText}>Add evidence to this check</Text><Ionicons name="chevron-forward" size={14} color={COLORS.textTertiary} /></Pressable>
  </SurfaceCard>;
}

function getStatus(value) {
  return ['pass', 'watch', 'issue'].includes(value) ? value : null;
}

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  progressHint: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 16, marginTop: 8 },
  rowCard: { marginTop: 9, padding: 14 },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  checkCircle: { width: 39, height: 39, borderRadius: 14, borderWidth: 1, backgroundColor: COLORS.surfaceElevated, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  unchecked: { width: 13, height: 13, borderRadius: 7, borderWidth: 1, borderColor: COLORS.textTertiary },
  itemTitle: { color: COLORS.text, fontSize: 13, fontWeight: '850' },
  itemMeta: { color: COLORS.textTertiary, fontSize: 9, marginTop: 3 },
  statusRow: { flexDirection: 'row', gap: 6, marginTop: 12 },
  statusButton: { flex: 1, minHeight: 37, borderRadius: 11, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surfaceElevated, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 },
  statusText: { color: COLORS.textTertiary, fontSize: 9, fontWeight: '850', letterSpacing: 0.5 },
  addEvidence: { minHeight: 39, borderRadius: 11, marginTop: 9, backgroundColor: alpha(COLORS.cyan, 0.06), borderWidth: 1, borderColor: alpha(COLORS.cyan, 0.13), flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 6 },
  addEvidenceText: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '700', flex: 1 },
  emptyFilter: { alignItems: 'center', paddingVertical: 30 },
  emptyTitle: { color: COLORS.text, fontSize: 14, fontWeight: '800', marginTop: 8 },
  emptyText: { color: COLORS.textTertiary, fontSize: 11, marginTop: 4, textAlign: 'center' },
  evidenceCard: { marginTop: 22 },
  evidenceText: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 17, marginTop: 7 },
});
