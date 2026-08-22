import { useMemo, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { filterRecoveryLogEntries, getRecoveryLogPresentation, getRecoveryLogTimeLabel } from '../src/services/reportUtils';

const COLORS = { bg: '#0B1220', surface: '#151F32', surface2: '#1C2940', text: '#F6F8FC', muted: '#92A1B8', blue: '#2F80ED', mint: '#35D0BA', amber: '#F4B740', border: '#263651' };

export function RecoveryLogModal({ visible, entries = [], queuedCount = 0, onClose, onRetry, onExportDiagnostics }) {
  const [operationFilter, setOperationFilter] = useState('all');
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const normalizedEntries = useMemo(() => filterRecoveryLogEntries(entries), [entries]);
  const operations = useMemo(() => ['all', ...Array.from(new Set(normalizedEntries.map((entry) => entry.operation)))], [normalizedEntries]);
  const filteredEntries = useMemo(() => filterRecoveryLogEntries(entries, { operation: operationFilter, outcome: outcomeFilter }), [entries, operationFilter, outcomeFilter]);
  const clearFilters = () => { setOperationFilter('all'); setOutcomeFilter('all'); };
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <View style={{ flex: 1, backgroundColor: 'rgba(3,8,18,0.82)', justifyContent: 'flex-end' }}>
      <View style={{ maxHeight: '86%', backgroundColor: COLORS.surface, borderTopLeftRadius: 22, borderTopRightRadius: 22, borderWidth: 1, borderColor: COLORS.border, padding: 22 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View><Text style={{ color: COLORS.text, fontSize: 26, fontWeight: '800' }}>Recovery log</Text><Text style={{ color: COLORS.muted, fontSize: 13, lineHeight: 19, marginTop: 4 }}>{queuedCount ? `${queuedCount} operation${queuedCount === 1 ? '' : 's'} queued for retry` : 'Recent local operation history'}</Text></View>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Close recovery log" onPress={onClose}><Text style={{ color: COLORS.blue, fontWeight: '800' }}>Close</Text></TouchableOpacity>
        </View>
        <View style={{ marginTop: 14, gap: 8 }}>
          <Text style={{ color: COLORS.muted, fontSize: 12, fontWeight: '800' }}>Filter events</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {operations.map((operation) => <TouchableOpacity key={operation} accessibilityRole="button" accessibilityLabel={`Filter recovery log by ${operation === 'all' ? 'all operations' : operation}`} accessibilityState={{ selected: operationFilter === operation }} onPress={() => setOperationFilter(operation)} style={{ backgroundColor: operationFilter === operation ? COLORS.blue : COLORS.surface2, borderColor: operationFilter === operation ? COLORS.blue : COLORS.border, borderWidth: 1, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 }}><Text style={{ color: COLORS.text, fontSize: 12, fontWeight: '800' }}>{operation === 'all' ? 'All operations' : operation}</Text></TouchableOpacity>)}
          </ScrollView>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['all', 'error', 'success'].map((outcome) => <TouchableOpacity key={outcome} accessibilityRole="button" accessibilityLabel={`Filter recovery log by ${outcome === 'all' ? 'all severities' : outcome === 'error' ? 'needs attention' : 'completed'}`} accessibilityState={{ selected: outcomeFilter === outcome }} onPress={() => setOutcomeFilter(outcome)} style={{ backgroundColor: outcomeFilter === outcome ? COLORS.blue : COLORS.surface2, borderColor: outcomeFilter === outcome ? COLORS.blue : COLORS.border, borderWidth: 1, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 }}><Text style={{ color: COLORS.text, fontSize: 12, fontWeight: '800' }}>{outcome === 'all' ? 'All severities' : outcome === 'error' ? 'Needs attention' : 'Completed'}</Text></TouchableOpacity>)}
            {(operationFilter !== 'all' || outcomeFilter !== 'all') ? <TouchableOpacity accessibilityRole="button" accessibilityLabel="Clear recovery log filters" onPress={clearFilters} style={{ paddingHorizontal: 8, paddingVertical: 8, justifyContent: 'center' }}><Text style={{ color: COLORS.blue, fontSize: 12, fontWeight: '800' }}>Clear</Text></TouchableOpacity> : null}
          </View>
          <Text style={{ color: COLORS.muted, fontSize: 12 }}>{filteredEntries.length} matching event{filteredEntries.length === 1 ? '' : 's'}</Text>
        </View>
        <ScrollView style={{ marginTop: 10 }} contentContainerStyle={{ paddingBottom: 8 }}>
          {filteredEntries.length ? filteredEntries.slice().reverse().map((entry, index) => { const item = getRecoveryLogPresentation(entry); return <View key={`${entry.at || 'event'}-${index}`} style={{ borderTopWidth: 1, borderTopColor: COLORS.border, paddingVertical: 14 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}><Text style={{ color: item.tone === 'success' ? COLORS.mint : COLORS.amber, fontSize: 14, fontWeight: '800', flex: 1 }}>{item.title}</Text><Text style={{ color: COLORS.muted, fontSize: 11 }}>{getRecoveryLogTimeLabel(item.at)}</Text></View><Text style={{ color: COLORS.text, fontSize: 13, lineHeight: 19, marginTop: 6 }}>{item.detail}</Text></View>;           }) : <View style={{ backgroundColor: COLORS.surface2, borderRadius: 12, padding: 14 }}><Text style={{ color: COLORS.text, fontSize: 15, fontWeight: '800' }}>{normalizedEntries.length ? 'No matching recovery events' : 'No recovery events yet'}</Text><Text style={{ color: COLORS.muted, fontSize: 13, lineHeight: 19, marginTop: 5 }}>{normalizedEntries.length ? 'Try another operation or severity filter.' : 'Successful saves and failures will appear here with their operation details.'}</Text>{normalizedEntries.length && (operationFilter !== 'all' || outcomeFilter !== 'all') ? <TouchableOpacity accessibilityRole="button" accessibilityLabel="Clear recovery log filters" onPress={clearFilters} style={{ marginTop: 10 }}><Text style={{ color: COLORS.blue, fontSize: 13, fontWeight: '800' }}>Clear filters</Text></TouchableOpacity> : null}</View>}
        </ScrollView>
        {queuedCount ? <TouchableOpacity accessibilityRole="button" accessibilityLabel="Retry queued local operations" style={{ backgroundColor: COLORS.blue, borderRadius: 14, minHeight: 54, marginTop: 12, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={onRetry}><Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>Retry queued operations</Text><Text style={{ color: '#fff', fontSize: 23 }}>→</Text></TouchableOpacity> : null}
        {onExportDiagnostics ? <TouchableOpacity accessibilityRole="button" accessibilityLabel="Export privacy-safe diagnostic report" style={{ borderColor: COLORS.border, borderWidth: 1, borderRadius: 14, minHeight: 48, marginTop: 10, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' }} onPress={onExportDiagnostics}><Text style={{ color: COLORS.blue, fontSize: 14, fontWeight: '800' }}>Export privacy-safe diagnostics</Text></TouchableOpacity> : null}
      </View>
    </View>
  </Modal>;
}
