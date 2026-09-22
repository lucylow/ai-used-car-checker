import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { Badge, Divider, PrimaryButton, Screen, ScreenHeader, SecondaryButton, SurfaceCard } from '../components/Primitives';
import { useReducedMotion } from '../motion';

export default function CertificateScreen({ data, actions }) {
  const reduced = useReducedMotion();
  const scale = useRef(new Animated.Value(reduced ? 1 : 0.92)).current;
  const opacity = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { if (reduced) { setRevealed(true); return; } Animated.parallel([Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 15, bounciness: 5 }), Animated.timing(opacity, { toValue: 1, duration: 420, useNativeDriver: true })]).start(() => setRevealed(true)); }, [reduced, scale, opacity]);
  return <Screen contentStyle={styles.content}>
    <ScreenHeader title="Verified Certificate" subtitle="A visual record of the inspection and its review state." onBack={actions?.onBack} right={<Badge tone="mint" label="VERIFIED" icon="shield-checkmark" />} />
    <Animated.View style={{ opacity, transform: [{ scale }] }}><View style={styles.certificateCard}><View style={styles.certificateGlow} /><View style={styles.shield}><Ionicons name="shield-checkmark" size={47} color={COLORS.mint} /></View><Text style={styles.verified}>INSPECTION VERIFIED</Text><Text style={styles.certificateTitle}>{data.vehicle?.year || '2020'} {data.vehicle?.make || 'Honda'} {data.vehicle?.model || 'Accord Sport'}</Text><Text style={styles.certificateSub}>Inspection record · human-reviewable evidence</Text><Divider spacing={18} /><CertificateRow label="Inspection ID" value={data.inspectionId || 'CW-2026-0922-01'} mono /><CertificateRow label="Evidence" value={`${data.photos?.length || 0} media items`} /><CertificateRow label="Findings" value={`${data.issues?.length || 0} recorded`} /><CertificateRow label="Human review" value="Required before final authorization" /><CertificateRow label="Issued" value={new Date().toLocaleDateString('en-CA')} /><CertificateRow label="Hash" value={data.certificateHash || '9B4C…A13F'} mono /></View></Animated.View>
    {revealed ? <View style={styles.auditCard}><View style={COMMON.rowBetween}><View><Text style={TYPOGRAPHY.eyebrow}>AUDIT TRAIL</Text><Text style={TYPOGRAPHY.h3}>What the certificate proves</Text></View><Ionicons name="finger-print-outline" size={21} color={COLORS.cyan} /></View>{['Inspection data packaged', 'Evidence linked', 'AI findings recorded as estimates', 'Human review state preserved', 'Certificate generated'].map((item, index) => <View key={item} style={styles.auditRow}><View style={styles.auditDot}>{index < 4 ? <Ionicons name="checkmark" size={11} color={COLORS.bg} /> : <View style={styles.auditDotInner} />}</View><Text style={styles.auditText}>{item}</Text></View>)}</View> : null}
    <View style={styles.actionStack}><PrimaryButton label="Share certificate" icon="share-outline" onPress={actions?.onShareCertificate} /><SecondaryButton label="Generate contract" icon="document-text-outline" onPress={actions?.onGenerateContract} /><SecondaryButton label="View report" icon="document-attach-outline" onPress={actions?.onOpenReport} /></View>
  </Screen>;
}

function CertificateRow({ label, value, mono }) { return <View style={styles.certRow}><Text style={styles.certLabel}>{label}</Text><Text style={[styles.certValue, mono && TYPOGRAPHY.mono]} numberOfLines={2}>{value}</Text></View>; }

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  certificateCard: { minHeight: 505, borderRadius: 28, backgroundColor: '#0E1A2D', borderWidth: 1, borderColor: alpha(COLORS.mint, 0.25), padding: 23, alignItems: 'center', position: 'relative', overflow: 'hidden' },
  certificateGlow: { position: 'absolute', width: 280, height: 280, borderRadius: 140, top: -105, backgroundColor: alpha(COLORS.mint, 0.06) },
  shield: { width: 104, height: 104, borderRadius: 36, backgroundColor: alpha(COLORS.mint, 0.08), borderWidth: 1, borderColor: alpha(COLORS.mint, 0.25), alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  verified: { color: COLORS.mint, fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginTop: 18 },
  certificateTitle: { color: COLORS.text, fontSize: 20, fontWeight: '900', textAlign: 'center', marginTop: 8 },
  certificateSub: { color: COLORS.textTertiary, fontSize: 10, textAlign: 'center', marginTop: 4 },
  certRow: { width: '100%', minHeight: 40, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingVertical: 9 },
  certLabel: { color: COLORS.textTertiary, fontSize: 9, fontWeight: '750' },
  certValue: { color: COLORS.text, fontSize: 11, fontWeight: '800', marginTop: 2 },
  auditCard: { marginTop: 16, borderRadius: 19, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, padding: 16 },
  auditRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 11 },
  auditDot: { width: 23, height: 23, borderRadius: 12, backgroundColor: COLORS.mint, alignItems: 'center', justifyContent: 'center' },
  auditDotInner: { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.bg },
  auditText: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '650' },
  actionStack: { gap: 8, marginTop: 20 },
});
