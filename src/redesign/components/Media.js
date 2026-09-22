import React, { useMemo, useState } from 'react';
import { Alert, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, RADIUS, SPACE, TYPOGRAPHY, alpha } from '../theme';
import { SegmentedControl, SurfaceCard, Badge, PrimaryButton, SecondaryButton, Divider } from './Primitives';
import { ConfidenceMeter } from './Charts';

export function EvidenceThumbnail({ item, size = 88, onPress, selected = false }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open ${item?.label || 'evidence'}`} onPress={onPress} style={[styles.thumb, { width: size, height: size }, selected && styles.thumbSelected]}>
    {item?.uri ? <Image source={{ uri: item.uri }} resizeMode="cover" style={StyleSheet.absoluteFillObject} /> : <View style={styles.thumbPlaceholder}><Ionicons name={item?.type === 'video' ? 'videocam' : item?.type === 'voice' ? 'mic' : 'car-sport'} size={20} color={item?.issueCount ? COLORS.amber : COLORS.textTertiary} /></View>}
    <View style={styles.thumbGradient} />
    <View style={styles.thumbBadge}><Text style={styles.thumbBadgeText}>{item?.type === 'video' ? 'VID' : item?.type === 'voice' ? 'VOI' : 'IMG'}</Text></View>
    {item?.issueCount ? <View style={styles.thumbIssue}><Text style={styles.thumbIssueText}>{item.issueCount}</Text></View> : null}
  </Pressable>;
}

export function EvidenceGallery({ items = [], onOpen, onAdd, limit = 8 }) {
  const visible = items.slice(0, limit);
  return <View style={styles.gallery}>
    {visible.map((item) => <EvidenceThumbnail key={item.id} item={item} onPress={() => onOpen?.(item)} />)}
    {items.length < limit && onAdd ? <Pressable accessibilityRole="button" onPress={onAdd} style={styles.addTile}><Ionicons name="add" size={28} color={COLORS.blue} /><Text style={styles.addTileText}>Add</Text></Pressable> : null}
  </View>;
}

export function EvidenceComposer({ onPhoto, onVideo, onVoice, onDocument, onText, disabled = false }) {
  const actions = [
    ['camera', 'Photo', onPhoto],
    ['videocam', 'Video', onVideo],
    ['mic', 'Voice', onVoice],
    ['document-text', 'Document', onDocument],
    ['create-outline', 'Note', onText],
  ];
  return <View style={styles.composer}>
    {actions.map(([icon, label, handler]) => <Pressable key={label} disabled={disabled} accessibilityRole="button" accessibilityLabel={`Add ${label}`} onPress={handler} style={[styles.composerButton, disabled && { opacity: 0.5 }]}>
      <View style={styles.composerIcon}><Ionicons name={icon} size={19} color={COLORS.cyan} /></View>
      <Text style={styles.composerLabel}>{label}</Text>
    </Pressable>)}
  </View>;
}

export function MediaReviewModal({ visible, item, onClose, onConfirm, onDelete }) {
  const [tab, setTab] = useState('evidence');
  if (!item) return null;
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.modalBackdrop}>
      <View style={styles.modalCard}>
        <View style={COMMON.rowBetween}>
          <View><Text style={TYPOGRAPHY.eyebrow}>EVIDENCE REVIEW</Text><Text style={TYPOGRAPHY.h2}>{item.label || 'Inspection evidence'}</Text></View>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close evidence review" style={styles.close}><Ionicons name="close" size={20} color={COLORS.text} /></Pressable>
        </View>
        <View style={styles.mediaFrame}>
          {item.uri ? <Image source={{ uri: item.uri }} resizeMode="contain" style={styles.mediaImage} /> : <View style={styles.mediaPlaceholder}><Ionicons name="image-outline" size={44} color={COLORS.textTertiary} /><Text style={styles.mediaPlaceholderText}>Sample evidence preview</Text></View>}
          <View style={styles.mediaOverlay}><Badge tone={item.issueCount ? 'amber' : 'mint'} label={item.issueCount ? `${item.issueCount} finding${item.issueCount === 1 ? '' : 's'}` : 'No findings'} /></View>
        </View>
        <SegmentedControl options={[{ value: 'evidence', label: 'Evidence' }, { value: 'ai', label: 'AI details', icon: 'sparkles' }]} value={tab} onChange={setTab} />
        {tab === 'evidence' ? <View style={styles.reviewBody}><Text style={styles.reviewTitle}>{item.zone || 'Inspection area'}</Text><Text style={styles.reviewText}>{item.note || 'Use this evidence to support an inspection observation. AI output should be reviewed before being added to the report.'}</Text></View> : <View style={styles.reviewBody}><Text style={styles.reviewTitle}>AI review</Text><ConfidenceMeter confidence={item.confidence ?? 0.86} label="Model confidence" tone="cyan" /><Text style={styles.reviewText}>Confidence is an AI estimate associated with this evidence. Confirm the finding before it becomes a verified inspection issue.</Text></View>}
        <Divider spacing={14} />
        <View style={{ gap: 10 }}>
          <PrimaryButton label="Use in inspection" onPress={onConfirm} />
          <SecondaryButton label="Delete evidence" onPress={() => Alert.alert('Delete evidence?', 'This removes the selected evidence item from the active inspection.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: onDelete }])} />
        </View>
      </View>
    </View>
  </Modal>;
}

export function AnnotationOverlay({ annotations = [], onSelect }) {
  return <View pointerEvents="box-none" style={StyleSheet.absoluteFillObject}>
    {annotations.map((annotation, index) => {
      const left = `${Math.max(3, Math.min(86, annotation.x ?? 20))}%`;
      const top = `${Math.max(3, Math.min(80, annotation.y ?? (18 + index * 18)))}%`;
      const color = annotation.tone === 'coral' ? COLORS.coral : annotation.tone === 'amber' ? COLORS.amber : COLORS.mint;
      return <Pressable key={annotation.id || index} onPress={() => onSelect?.(annotation)} style={[styles.annotation, { left, top, borderColor: color, shadowColor: color }]}><View style={[styles.annotationDot, { backgroundColor: color }]} /><View style={[styles.annotationLabel, { backgroundColor: alpha(color, 0.14), borderColor: alpha(color, 0.32) }]}><Text style={[styles.annotationText, { color }]}>{annotation.label}</Text></View></Pressable>;
    })}
  </View>;
}

export function VideoEvidenceCard({ title = 'Engine running', duration = '00:10', events = [], onPlay }) {
  return <SurfaceCard style={styles.videoCard}>
    <View style={styles.videoPreview}><View style={styles.videoGrid}><View style={styles.videoPlay}><Ionicons name="play" size={23} color={COLORS.white} /></View></View><View style={styles.videoTop}><Badge tone="blue" label="VIDEO" icon="videocam" /><Text style={styles.duration}>{duration}</Text></View></View>
    <Text style={styles.videoTitle}>{title}</Text>
    <View style={styles.videoTimeline}>{Array.from({ length: 20 }).map((_, i) => <View key={i} style={[styles.wave, { height: 5 + ((i * 13) % 19) * 1.2, backgroundColor: events.some((event) => Math.abs(event.second - i * 0.5) < 0.25) ? COLORS.amber : COLORS.borderStrong }]} />)}</View>
    {events.length ? <View style={styles.videoEvents}>{events.slice(0, 3).map((event) => <View key={`${event.second}-${event.label}`} style={styles.eventRow}><Text style={styles.eventTime}>{formatTime(event.second)}</Text><View style={COMMON.fill}><Text style={styles.eventLabel}>{event.label}</Text></View><Badge tone={event.tone || 'amber'} label="Review" /></View>)}</View> : <Text style={styles.reviewText}>No notable events marked yet.</Text>}
    <SecondaryButton label="Review video" icon="play" onPress={onPlay} />
  </SurfaceCard>;
}

function formatTime(seconds = 0) {
  const total = Math.max(0, Math.floor(seconds));
  return `00:${String(total).padStart(2, '0')}`;
}

export function DocumentEvidenceCard({ title, type = 'Service record', confidence = 0.94, verified = false, onOpen }) {
  return <SurfaceCard onPress={onOpen} style={styles.documentCard}>
    <View style={styles.documentIcon}><Ionicons name="document-text" size={25} color={COLORS.cyan} /></View>
    <View style={COMMON.fill}><View style={COMMON.rowBetween}><Text style={styles.documentTitle}>{title}</Text><Badge tone={verified ? 'mint' : 'amber'} label={verified ? 'VERIFIED' : 'REVIEW'} /></View><Text style={styles.documentType}>{type}</Text><ConfidenceMeter confidence={confidence} label="Extraction confidence" tone={verified ? 'mint' : 'amber'} /></View>
    <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
  </SurfaceCard>;
}

export function GalleryLightbox({ visible, items, index = 0, onClose, onChange }) {
  const safeItems = Array.isArray(items) ? items : [];
  const safeIndex = Math.max(0, Math.min(safeItems.length - 1, index));
  const current = safeItems[safeIndex];
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.lightboxBackdrop}>
      <View style={styles.lightboxHeader}><Text style={styles.lightboxCount}>{safeItems.length ? `${safeIndex + 1} / ${safeItems.length}` : '0 / 0'}</Text><Pressable onPress={onClose} accessibilityRole="button" style={styles.close}><Ionicons name="close" size={22} color={COLORS.white} /></Pressable></View>
      <View style={styles.lightboxMedia}>{current?.uri ? <Image source={{ uri: current.uri }} resizeMode="contain" style={styles.lightboxImage} /> : <View style={styles.lightboxPlaceholder}><Ionicons name="image-outline" size={62} color={COLORS.textTertiary} /><Text style={styles.lightboxPlaceholderText}>{current?.label || 'No image available'}</Text></View>}</View>
      <View style={styles.lightboxFooter}><Pressable disabled={safeIndex === 0} onPress={() => onChange?.(safeIndex - 1)} style={[styles.lightboxNav, safeIndex === 0 && { opacity: 0.4 }]}><Ionicons name="chevron-back" size={22} color={COLORS.white} /></Pressable><View style={COMMON.fill}><Text style={styles.lightboxTitle}>{current?.label || 'Evidence'}</Text><Text style={styles.lightboxMeta}>{current?.zone || 'Vehicle inspection evidence'}</Text></View><Pressable disabled={safeIndex >= safeItems.length - 1} onPress={() => onChange?.(safeIndex + 1)} style={[styles.lightboxNav, safeIndex >= safeItems.length - 1 && { opacity: 0.4 }]}><Ionicons name="chevron-forward" size={22} color={COLORS.white} /></Pressable></View>
    </View>
  </Modal>;
}

const styles = StyleSheet.create({
  gallery: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 12 },
  thumb: { borderRadius: 15, overflow: 'hidden', backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.border, position: 'relative' },
  thumbSelected: { borderColor: COLORS.cyan, borderWidth: 2 },
  thumbPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  thumbGradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 34, backgroundColor: 'rgba(5,15,26,0.62)' },
  thumbBadge: { position: 'absolute', left: 6, top: 6, borderRadius: 6, paddingHorizontal: 5, paddingVertical: 3, backgroundColor: 'rgba(4,11,20,0.75)' },
  thumbBadgeText: { color: COLORS.white, fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
  thumbIssue: { position: 'absolute', right: 6, bottom: 6, width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.amber, alignItems: 'center', justifyContent: 'center' },
  thumbIssueText: { color: COLORS.bg, fontSize: 10, fontWeight: '900' },
  addTile: { width: 88, height: 88, borderRadius: 15, borderWidth: 1, borderStyle: 'dashed', borderColor: alpha(COLORS.blue, 0.55), backgroundColor: alpha(COLORS.blue, 0.08), justifyContent: 'center', alignItems: 'center' },
  addTileText: { color: COLORS.blue, fontSize: 10, fontWeight: '850', marginTop: 2 },
  composer: { flexDirection: 'row', gap: 7, marginTop: 14 },
  composerButton: { flex: 1, minWidth: 54, alignItems: 'center' },
  composerIcon: { width: 44, height: 44, borderRadius: 15, borderWidth: 1, borderColor: alpha(COLORS.cyan, 0.26), backgroundColor: alpha(COLORS.cyan, 0.08), alignItems: 'center', justifyContent: 'center' },
  composerLabel: { color: COLORS.textSecondary, fontSize: 9, fontWeight: '750', marginTop: 5 },
  modalBackdrop: { flex: 1, padding: 16, backgroundColor: 'rgba(1,7,15,0.9)', justifyContent: 'center' },
  modalCard: { backgroundColor: COLORS.surface, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border, padding: 17, maxHeight: '94%' },
  close: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.border },
  mediaFrame: { height: 270, borderRadius: 18, backgroundColor: '#07111F', borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginTop: 14 },
  mediaImage: { width: '100%', height: '100%' },
  mediaPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mediaPlaceholderText: { color: COLORS.textTertiary, fontSize: 12, marginTop: 8 },
  mediaOverlay: { position: 'absolute', left: 10, top: 10 },
  reviewBody: { paddingTop: 13 },
  reviewTitle: { color: COLORS.text, fontSize: 15, fontWeight: '800' },
  reviewText: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 7 },
  annotation: { position: 'absolute', minWidth: 18, minHeight: 18, borderWidth: 2, borderRadius: 6, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.5, shadowRadius: 9, shadowOffset: { width: 0, height: 0 } },
  annotationDot: { width: 7, height: 7, borderRadius: 4 },
  annotationLabel: { position: 'absolute', top: 22, left: 0, borderWidth: 1, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 4, minWidth: 72 },
  annotationText: { fontSize: 9, fontWeight: '850' },
  videoCard: { padding: 0, overflow: 'hidden' },
  videoPreview: { height: 160, backgroundColor: '#07111F', position: 'relative' },
  videoGrid: { flex: 1, justifyContent: 'center', alignItems: 'center', opacity: 0.9 },
  videoPlay: { width: 58, height: 58, borderRadius: 29, backgroundColor: alpha(COLORS.blue, 0.85), justifyContent: 'center', alignItems: 'center', paddingLeft: 3 },
  videoTop: { position: 'absolute', left: 12, right: 12, top: 11, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  duration: { color: COLORS.white, fontSize: 11, fontWeight: '800', backgroundColor: 'rgba(0,0,0,0.42)', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 9 },
  videoTitle: { color: COLORS.text, fontSize: 15, fontWeight: '800', paddingHorizontal: 16, paddingTop: 14 },
  videoTimeline: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', height: 54, gap: 3 },
  wave: { flex: 1, minWidth: 3, borderRadius: 3 },
  videoEvents: { paddingHorizontal: 16 },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  eventTime: { color: COLORS.textTertiary, fontFamily: TYPOGRAPHY.mono.fontFamily, fontSize: 10, width: 42 },
  eventLabel: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '650' },
  documentCard: { padding: 13, flexDirection: 'row', alignItems: 'center', gap: 11 },
  documentIcon: { width: 45, height: 50, borderRadius: 13, backgroundColor: alpha(COLORS.cyan, 0.1), borderWidth: 1, borderColor: alpha(COLORS.cyan, 0.25), justifyContent: 'center', alignItems: 'center' },
  documentTitle: { color: COLORS.text, fontSize: 13, fontWeight: '800', flexShrink: 1 },
  documentType: { color: COLORS.textTertiary, fontSize: 10, marginTop: 3 },
  lightboxBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.96)', paddingHorizontal: 14, paddingTop: 56, paddingBottom: 28 },
  lightboxHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lightboxCount: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '750' },
  lightboxMedia: { flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  lightboxImage: { width: '100%', height: '100%' },
  lightboxPlaceholder: { alignItems: 'center' },
  lightboxPlaceholderText: { color: COLORS.textTertiary, fontSize: 13, marginTop: 10 },
  lightboxFooter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  lightboxNav: { width: 45, height: 45, borderRadius: 23, borderWidth: 1, borderColor: COLORS.borderStrong, backgroundColor: COLORS.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  lightboxTitle: { color: COLORS.white, fontSize: 14, fontWeight: '800' },
  lightboxMeta: { color: COLORS.textSecondary, fontSize: 11, marginTop: 3 },
});
