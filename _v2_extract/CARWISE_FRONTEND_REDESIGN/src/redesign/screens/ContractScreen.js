import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { Accordion, EvidenceTimeline, FloatingActionDock, MetricPill } from '../components/Advanced';
import { Badge, Divider, PrimaryButton, Screen, ScreenHeader, SecondaryButton, SurfaceCard } from '../components/Primitives';

const TERMS = [
  { title: 'Purchase price', value: '$19,400', icon: 'cash-outline', tone: 'mint', detail: 'Suggested target based on the current market context and documented repair impact.' },
  { title: 'Deposit', value: '$1,000', icon: 'wallet-outline', tone: 'blue', detail: 'Editable buyer-entered deposit amount.' },
  { title: 'Validity', value: '72 hours', icon: 'time-outline', tone: 'amber', detail: 'Suggested validity period; final contract rules should come from your document template.' },
  { title: 'Disclosed findings', value: '7', icon: 'warning-outline', tone: 'coral', detail: 'Visible findings included in the inspection summary attached to the agreement.' },
];
const CLAUSES = [
  ['01', 'Vehicle identification', 'The agreement references the VIN, make, model, model year, and mileage captured in the inspection.'],
  ['02', 'Purchase terms', 'The buyer and seller confirm the negotiated purchase price, deposit, and effective date.'],
  ['03', 'Known condition', 'The documented findings and evidence are included as disclosures for review by both parties.'],
  ['04', 'Inspection acknowledgement', 'The inspection is informational and does not replace a professional mechanical inspection.'],
  ['05', 'Human authorization', 'The agreement is not considered authorized until the human signer reviews and signs it.'],
];

export default function ContractScreen({ data, actions }) {
  const [reviewed, setReviewed] = useState(false);
  const [signState, setSignState] = useState('ready');
  const vehicle = data.vehicle;
  const event = useMemo(() => [
    { id: 'contract-1', time: '11:02', type: 'GENERATED', title: 'Contract draft created', description: 'Inspection data mapped into the purchase template.', color: COLORS.cyan },
    { id: 'contract-2', time: '11:03', type: 'REVIEW', title: 'Human review required', description: 'Review all terms and disclosures before authorization.', color: COLORS.amber },
  ], []);
  const onSign = () => { setSignState('sent'); actions?.onSignNow?.() || Alert.alert('Human signature', 'Connect this action to your production e-sign workflow.'); };
  return <Screen scroll contentStyle={styles.content}>
    <ScreenHeader title="Purchase Contract" subtitle="Review the agreement generated from your inspection." onBack={actions?.onBack} right={<Badge tone={reviewed ? 'mint' : 'amber'} label={reviewed ? 'REVIEWED' : 'REVIEW'} />} />
    <SurfaceCard tone="blue" style={styles.hero}>
      <View style={COMMON.row}><View style={styles.docIcon}><Ionicons name="document-text" size={25} color={COLORS.cyan} /></View><View style={COMMON.fill}><Text style={TYPOGRAPHY.eyebrow}>DRAFT AGREEMENT</Text><Text style={styles.heroTitle}>{vehicle.name}</Text><Text style={styles.heroSub}>{vehicle.vin} · {vehicle.mileage} mi</Text></View><Badge tone="cyan" label="SMART" /></View>
      <View style={styles.heroMetrics}><MetricPill label="PRICE" value="$19,400" tone="mint" /><MetricPill label="FINDINGS" value="7" tone="coral" /><MetricPill label="VALID" value="72H" tone="amber" /></View>
    </SurfaceCard>

    <View style={styles.section}><Text style={TYPOGRAPHY.h3}>Key terms</Text><Text style={TYPOGRAPHY.meta}>EDITABLE</Text></View>
    <View style={styles.terms}>{TERMS.map((term) => <SurfaceCard key={term.title} style={styles.termCard}><View style={COMMON.row}><View style={[styles.termIcon, { backgroundColor: alpha(toneColor(term.tone), 0.1) }]}><Ionicons name={term.icon} size={18} color={toneColor(term.tone)} /></View><View style={COMMON.fill}><Text style={styles.termTitle}>{term.title}</Text><Text style={styles.termDetail}>{term.detail}</Text></View><Text style={[styles.termValue, { color: toneColor(term.tone) }]}>{term.value}</Text></View></SurfaceCard>)}</View>

    <View style={styles.section}><Text style={TYPOGRAPHY.h3}>Document preview</Text><Text style={TYPOGRAPHY.meta}>5 SECTIONS</Text></View>
    <SurfaceCard style={styles.paper}>
      <Text style={styles.paperKicker}>CARWISE PURCHASE AGREEMENT</Text>
      <Text style={styles.paperTitle}>Vehicle Purchase Agreement</Text>
      <Text style={styles.paperMeta}>{vehicle.name} · {new Date().toLocaleDateString()}</Text>
      <Divider style={{ marginVertical: 14 }} />
      {CLAUSES.map(([number, title, text]) => <Accordion key={number} title={`${number} · ${title}`} icon="chevron-forward" defaultOpen={number === '01'}><Text style={styles.clause}>{text}</Text><View style={styles.clauseFooter}><Badge tone="cyan" label="INSPECTION LINKED" /><Text style={styles.clauseRef}>Evidence attached</Text></View></Accordion>)}
      <View style={styles.reviewCallout}><Ionicons name="person-circle-outline" size={20} color={COLORS.amber} /><View style={COMMON.fill}><Text style={styles.reviewTitle}>Human review required</Text><Text style={styles.reviewBody}>CarWise can prepare the agreement, but the user must review and explicitly authorize the final signature.</Text></View></View>
    </SurfaceCard>

    <View style={styles.section}><Text style={TYPOGRAPHY.h3}>Contract activity</Text></View>
    <SurfaceCard><EvidenceTimeline events={event} /></SurfaceCard>

    <SurfaceCard tone="cyan" style={{ marginTop: 12 }}>
      <Pressable onPress={() => setReviewed((value) => !value)} style={styles.reviewRow} accessibilityRole="checkbox" accessibilityState={{ checked: reviewed }}><View style={[styles.checkbox, reviewed && { backgroundColor: COLORS.mint, borderColor: COLORS.mint }]}>{reviewed ? <Ionicons name="checkmark" size={15} color={COLORS.bg} /> : null}</View><View style={COMMON.fill}><Text style={styles.reviewCheckTitle}>I reviewed the contract</Text><Text style={styles.reviewCheckBody}>Confirm that the terms, disclosures, and vehicle identity are ready for human authorization.</Text></View></Pressable>
    </SurfaceCard>

    {signState === 'sent' ? <SurfaceCard tone="mint" style={{ marginTop: 12 }}><View style={COMMON.row}><Ionicons name="checkmark-circle" size={22} color={COLORS.mint} /><View style={COMMON.fill}><Text style={styles.sentTitle}>Signature workflow started</Text><Text style={styles.sentBody}>Connect this state to your e-sign provider and webhook completion flow.</Text></View></View></SurfaceCard> : null}

    <View style={styles.actions}><PrimaryButton disabled={!reviewed} label={signState === 'sent' ? 'Awaiting signature' : 'Send for human signature'} icon="create-outline" onPress={onSign} /><SecondaryButton label="Edit terms" icon="create" onPress={() => actions?.onEditTerms?.() || Alert.alert('Edit terms', 'Open your editable contract form here.')} style={{ marginTop: 8 }} /></View>
    <FloatingActionDock actions={[{ id: 'share', label: 'Share', icon: 'share-outline', onPress: actions?.onShareContract, color: COLORS.cyan }, { id: 'pdf', label: 'PDF', icon: 'download-outline', onPress: actions?.onExportContract, color: COLORS.mint }, { id: 'report', label: 'Report', icon: 'document-text-outline', onPress: actions?.onReport }]} />
  </Screen>;
}

function toneColor(tone) { return tone === 'mint' ? COLORS.mint : tone === 'amber' ? COLORS.amber : tone === 'coral' ? COLORS.coral : COLORS.cyan; }

const styles = StyleSheet.create({
  content: { paddingTop: 12 },
  hero: { marginTop: 3 },
  docIcon: { width: 50, height: 50, borderRadius: 16, backgroundColor: alpha(COLORS.cyan, 0.1), alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  heroTitle: { color: COLORS.text, fontSize: 16, fontWeight: '900', marginTop: 2 },
  heroSub: { color: COLORS.textSecondary, fontSize: 9, marginTop: 4 },
  heroMetrics: { flexDirection: 'row', marginTop: 15 },
  section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 20, marginBottom: 10 },
  terms: { gap: 9 },
  termCard: { padding: 13 },
  termIcon: { width: 37, height: 37, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  termTitle: { color: COLORS.text, fontSize: 11, fontWeight: '850' },
  termDetail: { color: COLORS.textSecondary, fontSize: 9, lineHeight: 13, marginTop: 2, maxWidth: 190 },
  termValue: { fontSize: 14, fontWeight: '900', marginLeft: 7 },
  paper: { backgroundColor: '#F6F8FB', borderColor: '#DCE4EC' },
  paperKicker: { color: '#627180', fontSize: 8, fontWeight: '850', letterSpacing: 1.1 },
  paperTitle: { color: '#142132', fontSize: 22, fontWeight: '900', marginTop: 7 },
  paperMeta: { color: '#708093', fontSize: 9, marginTop: 3 },
  clause: { color: '#344256', fontSize: 10, lineHeight: 16 },
  clauseFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  clauseRef: { color: '#8090A1', fontSize: 8, marginLeft: 7 },
  reviewCallout: { flexDirection: 'row', gap: 9, backgroundColor: '#FFF8E6', borderWidth: 1, borderColor: '#F1D484', borderRadius: 15, padding: 12, marginTop: 13 },
  reviewTitle: { color: '#513C12', fontSize: 11, fontWeight: '850' },
  reviewBody: { color: '#735B2B', fontSize: 9, lineHeight: 14, marginTop: 2 },
  reviewRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: { width: 27, height: 27, borderRadius: 9, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surfaceSoft, alignItems: 'center', justifyContent: 'center' },
  reviewCheckTitle: { color: COLORS.text, fontSize: 11, fontWeight: '850' },
  reviewCheckBody: { color: COLORS.textSecondary, fontSize: 9, lineHeight: 13, marginTop: 2 },
  sentTitle: { color: COLORS.text, fontSize: 11, fontWeight: '850' },
  sentBody: { color: COLORS.textSecondary, fontSize: 9, lineHeight: 13, marginTop: 2 },
  actions: { marginTop: 14 },
});
