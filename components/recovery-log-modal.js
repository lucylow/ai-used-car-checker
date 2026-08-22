import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { getRecoveryLogPresentation, getRecoveryLogTimeLabel } from '../src/services/reportUtils';

const COLORS = { bg: '#0B1220', surface: '#151F32', surface2: '#1C2940', text: '#F6F8FC', muted: '#92A1B8', blue: '#2F80ED', mint: '#35D0BA', amber: '#F4B740', border: '#263651' };

export function RecoveryLogModal({ visible, entries = [], queuedCount = 0, onClose, onRetry }) {
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <View style={{ flex: 1, backgroundColor: 'rgba(3,8,18,0.82)', justifyContent: 'flex-end' }}>
      <View style={{ maxHeight: '86%', backgroundColor: COLORS.surface, borderTopLeftRadius: 22, borderTopRightRadius: 22, borderWidth: 1, borderColor: COLORS.border, padding: 22 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View><Text style={{ color: COLORS.text, fontSize: 26, fontWeight: '800' }}>Recovery log</Text><Text style={{ color: COLORS.muted, fontSize: 13, lineHeight: 19, marginTop: 4 }}>{queuedCount ? `${queuedCount} operation${queuedCount === 1 ? '' : 's'} queued for retry` : 'Recent local operation history'}</Text></View>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Close recovery log" onPress={onClose}><Text style={{ color: COLORS.blue, fontWeight: '800' }}>Close</Text></TouchableOpacity>
        </View>
        <ScrollView style={{ marginTop: 14 }} contentContainerStyle={{ paddingBottom: 8 }}>
          {entries.length ? entries.slice().reverse().map((entry, index) => { const item = getRecoveryLogPresentation(entry); return <View key={`${entry.at || 'event'}-${index}`} style={{ borderTopWidth: 1, borderTopColor: COLORS.border, paddingVertical: 14 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}><Text style={{ color: item.tone === 'success' ? COLORS.mint : COLORS.amber, fontSize: 14, fontWeight: '800', flex: 1 }}>{item.title}</Text><Text style={{ color: COLORS.muted, fontSize: 11 }}>{getRecoveryLogTimeLabel(item.at)}</Text></View><Text style={{ color: COLORS.text, fontSize: 13, lineHeight: 19, marginTop: 6 }}>{item.detail}</Text></View>; }) : <View style={{ backgroundColor: COLORS.surface2, borderRadius: 12, padding: 14 }}><Text style={{ color: COLORS.text, fontSize: 15, fontWeight: '800' }}>No recovery events yet</Text><Text style={{ color: COLORS.muted, fontSize: 13, lineHeight: 19, marginTop: 5 }}>Successful saves and failures will appear here with their operation details.</Text></View>}
        </ScrollView>
        {queuedCount ? <TouchableOpacity accessibilityRole="button" accessibilityLabel="Retry queued local operations" style={{ backgroundColor: COLORS.blue, borderRadius: 14, minHeight: 54, marginTop: 12, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={onRetry}><Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>Retry queued operations</Text><Text style={{ color: '#fff', fontSize: 23 }}>→</Text></TouchableOpacity> : null}
      </View>
    </View>
  </Modal>;
}
