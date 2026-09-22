import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, COMMON, TYPOGRAPHY, alpha } from '../theme';
import { Badge, SecondaryButton } from '../components/Primitives';
import { EvidenceComposer } from '../components/Media';

const DEFAULT_SUGGESTIONS = [
  'What should I inspect next?',
  'Why is the risk score elevated?',
  'What evidence supports this finding?',
  'What should I ask the seller?',
  'How could repairs change my offer?',
];

export default function AssistantSheet({ visible, onClose, data, actions }) {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const context = useMemo(() => ({ vehicle: `${data?.vehicle?.year || '2020'} ${data?.vehicle?.make || 'Honda'} ${data?.vehicle?.model || 'Accord Sport'}`, risk: data?.riskScore || 32, evidence: data?.photos?.length || 0, findings: data?.findings?.length || data?.issues?.length || 0, repairs: data?.repairTotal || 0, fair: data?.market?.fair || 21100 }), [data]);

  const send = (prompt = text) => {
    const value = String(prompt || '').trim();
    if (!value) return;
    const answer = answerFor(value.toLowerCase(), context);
    setMessages((current) => [...current, { id: `${Date.now()}-u`, role: 'user', text: value }, { id: `${Date.now()}-a`, role: 'assistant', text: answer }]);
    setText('');
  };

  return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <KeyboardAvoidingView style={styles.backdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.header}><View><Text style={TYPOGRAPHY.eyebrow}>CARWISE COPILOT</Text><Text style={TYPOGRAPHY.h2}>Ask about this car</Text></View><Pressable onPress={onClose} style={styles.close}><Ionicons name="close" size={20} color={COLORS.text} /></Pressable></View>
        <View style={styles.contextStrip}><View style={styles.contextIcon}><Ionicons name="car-outline" size={17} color={COLORS.cyan} /></View><View style={COMMON.fill}><Text style={styles.contextTitle}>{context.vehicle}</Text><Text style={styles.contextMeta}>Risk {context.risk}/100 · {context.evidence} media · {context.findings} findings</Text></View><Badge tone="cyan" label="CONTEXT" /></View>
        <View style={styles.messageList}>{messages.length ? messages.map((message) => <View key={message.id} style={[styles.message, message.role === 'user' ? styles.userMessage : styles.aiMessage]}><Text style={message.role === 'user' ? styles.userMessageText : styles.aiMessageText}>{message.text}</Text>{message.role === 'assistant' ? <View style={styles.aiEvidence}><Text style={styles.aiEvidenceText}>Based on current inspection context</Text></View> : null}</View>) : <View style={styles.empty}><View style={styles.emptyIcon}><Ionicons name="sparkles" size={23} color={COLORS.white} /></View><Text style={styles.emptyTitle}>Evidence-first answers</Text><Text style={styles.emptyBody}>CarWise should answer from the current vehicle, evidence, inspection state, and estimates—not from invented facts.</Text></View>}</View>
        <View style={styles.suggestions}>{DEFAULT_SUGGESTIONS.map((suggestion) => <Pressable key={suggestion} onPress={() => send(suggestion)} style={styles.suggestion}><Text style={styles.suggestionText}>{suggestion}</Text></Pressable>)}</View>
        <EvidenceComposer onPhoto={() => actions?.onCapturePhoto?.()} onVideo={() => actions?.onCaptureVideo?.()} onVoice={() => actions?.onCaptureVoice?.()} onDocument={() => actions?.onPickDocument?.()} onText={() => actions?.onAddNote?.()} />
        <View style={styles.composer}><TextInput value={text} onChangeText={setText} onSubmitEditing={() => send()} returnKeyType="send" placeholder="Ask CarWise anything about this inspection…" placeholderTextColor={COLORS.textTertiary} style={styles.input} multiline /><Pressable disabled={!text.trim()} onPress={() => send()} style={[styles.send, !text.trim() && { opacity: 0.38 }]}><Ionicons name="arrow-up" size={19} color={COLORS.white} /></Pressable></View>
        <SecondaryButton label="Keep human review in the loop" icon="shield-checkmark-outline" onPress={actions?.onOpenAI} />
      </View>
    </KeyboardAvoidingView>
  </Modal>;
}

function answerFor(prompt, context) {
  if (prompt.includes('next')) return `You have ${context.evidence} evidence items and ${context.findings} findings. The highest-value next step is to strengthen any major finding with a clear close-up photo or manual confirmation before using it in negotiation.`;
  if (prompt.includes('risk')) return `The current risk score is ${context.risk}/100. CarWise derives it from the recorded issue mix; it should be treated as a screening signal rather than a mechanical diagnosis.`;
  if (prompt.includes('evidence')) return `The current inspection contains ${context.evidence} media item${context.evidence === 1 ? '' : 's'}. Open each finding to see which evidence IDs are linked, what the model confidence is, and whether the finding has been confirmed.`;
  if (prompt.includes('seller')) return 'Ask the seller to explain the most significant visible findings, request supporting service records, and agree on a professional inspection where the evidence is uncertain.';
  if (prompt.includes('repair') || prompt.includes('offer')) return `The current repair estimate is about $${Math.round(context.repairs).toLocaleString()}, while the market estimate is $${Math.round(context.fair).toLocaleString()}. Keep those two signals separate and verify repair pricing before setting an offer.`;
  return `For ${context.vehicle}, I can help organize the current evidence and estimates. Ask about a specific finding, market comparison, repair item, inspection category, or seller conversation.`;
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.62)' },
  sheet: { maxHeight: '92%', backgroundColor: COLORS.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, borderTopWidth: 1, borderColor: COLORS.border, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 18 },
  handle: { width: 46, height: 5, borderRadius: 3, alignSelf: 'center', backgroundColor: COLORS.borderStrong, marginBottom: 11 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  close: { width: 39, height: 39, borderRadius: 20, backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  contextStrip: { flexDirection: 'row', alignItems: 'center', gap: 9, minHeight: 60, borderRadius: 16, backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.border, padding: 10, marginTop: 13 },
  contextIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: alpha(COLORS.cyan, 0.08), alignItems: 'center', justifyContent: 'center' },
  contextTitle: { color: COLORS.text, fontSize: 12, fontWeight: '850' },
  contextMeta: { color: COLORS.textTertiary, fontSize: 9, marginTop: 3 },
  messageList: { minHeight: 130, maxHeight: 290, marginTop: 11 },
  message: { maxWidth: '88%', borderRadius: 15, padding: 11, marginBottom: 7 },
  userMessage: { alignSelf: 'flex-end', backgroundColor: COLORS.blue },
  aiMessage: { alignSelf: 'flex-start', backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.border },
  userMessageText: { color: COLORS.white, fontSize: 12, lineHeight: 18 },
  aiMessageText: { color: COLORS.text, fontSize: 12, lineHeight: 18 },
  aiEvidence: { marginTop: 7, paddingTop: 6, borderTopWidth: 1, borderTopColor: COLORS.border },
  aiEvidenceText: { color: COLORS.textTertiary, fontSize: 8 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 19 },
  emptyIcon: { width: 46, height: 46, borderRadius: 16, backgroundColor: COLORS.blue, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: COLORS.text, fontSize: 13, fontWeight: '850', marginTop: 8 },
  emptyBody: { color: COLORS.textTertiary, fontSize: 10, lineHeight: 15, textAlign: 'center', maxWidth: 290, marginTop: 4 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, maxHeight: 82, overflow: 'hidden', marginTop: 5 },
  suggestion: { minHeight: 30, borderRadius: 15, backgroundColor: alpha(COLORS.cyan, 0.06), borderWidth: 1, borderColor: alpha(COLORS.cyan, 0.15), paddingHorizontal: 9, justifyContent: 'center' },
  suggestionText: { color: COLORS.textSecondary, fontSize: 9, fontWeight: '700' },
  composer: { minHeight: 54, borderRadius: 17, borderWidth: 1, borderColor: COLORS.borderStrong, backgroundColor: COLORS.surfaceElevated, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 12, paddingRight: 6, marginTop: 11, marginBottom: 9 },
  input: { flex: 1, color: COLORS.text, fontSize: 13, maxHeight: 85, paddingVertical: 12 },
  send: { width: 43, height: 43, borderRadius: 15, backgroundColor: COLORS.blue, alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
});
