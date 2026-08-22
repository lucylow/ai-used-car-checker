import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { getBackupPreviewRows } from '../src/services/uiUtils';

const COLORS = { text: '#F6F8FC', muted: '#92A1B8', blue: '#2F80ED', border: '#263651', surface2: '#1C2940' };

export function BackupPreviewModal({ preview, onClose, onConfirm }) {
  return <Modal visible={Boolean(preview)} transparent animationType="slide" onRequestClose={onClose}>
    <View style={{ flex: 1, backgroundColor: 'rgba(3,8,18,0.78)', justifyContent: 'flex-end' }}>
      <View style={{ backgroundColor: '#151F32', borderTopLeftRadius: 22, borderTopRightRadius: 22, borderWidth: 1, borderColor: COLORS.border, padding: 22 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: COLORS.text, fontSize: 26, fontWeight: '800' }}>Backup preview</Text>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Close backup preview" onPress={onClose}><Text style={{ color: COLORS.blue, fontWeight: '800' }}>Close</Text></TouchableOpacity>
        </View>
        <Text style={{ color: COLORS.muted, fontSize: 15, lineHeight: 22, marginTop: 8 }}>Review what will be exported before sharing this local JSON backup.</Text>
        {preview ? <><View style={{ borderRadius: 12, padding: 14, marginTop: 14, backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border }}>{getBackupPreviewRows(preview.metadata).map(([label, value]) => <Text key={label} style={{ color: COLORS.text, fontSize: 14, paddingTop: 7 }}>{label}: {value}</Text>)}</View><Text style={{ color: COLORS.muted, fontSize: 13, lineHeight: 19, marginTop: 12 }}>The backup contains your current inspection, local history, photo metadata, and bounded AI timeline. No cloud upload occurs until you choose a sharing destination.</Text><TouchableOpacity accessibilityRole="button" style={{ backgroundColor: COLORS.blue, borderRadius: 14, minHeight: 54, marginTop: 18, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={onConfirm}><Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>Export {preview.metadata.sizeLabel}</Text><Text style={{ color: '#fff', fontSize: 23 }}>→</Text></TouchableOpacity><TouchableOpacity accessibilityRole="button" style={{ borderColor: COLORS.border, borderWidth: 1, borderRadius: 14, minHeight: 52, alignItems: 'center', justifyContent: 'center', marginTop: 14 }} onPress={onClose}><Text style={{ color: COLORS.text, fontSize: 15, fontWeight: '700' }}>Cancel</Text></TouchableOpacity></> : null}
      </View>
    </View>
  </Modal>;
}
