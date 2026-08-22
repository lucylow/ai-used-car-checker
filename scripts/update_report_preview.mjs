import fs from 'node:fs';

const path = '/home/ubuntu/ai-used-car-checker/App.js';
let source = fs.readFileSync(path, 'utf8');

const oldExport = source.match(/  const exportReportPdf = async \(\) => \{[\s\S]*?\n  const Home =/);
if (!oldExport) throw new Error('exportReportPdf block not found');

const newExport = `  const readPhotoForPdf = async (photo) => {
    if (!photo?.uri || photo.uri.startsWith('data:') || Platform.OS === 'web') return photo;
    try {
      const base64 = await FileSystem.readAsStringAsync(photo.uri, { encoding: FileSystem.EncodingType.Base64 });
      const mimeType = photo.mimeType || 'image/jpeg';
      return { ...photo, embeddedDataUri: \`data:\${mimeType};base64,\${base64}\` };
    } catch (_) {
      return photo;
    }
  };
  const exportReportPdf = async () => {
    const generatedAt = new Date().toLocaleString();
    const report = \`${'${'}buildInspectionReport({ vehicle, issues, checklist, photos, fairPrice: 19400, riskScore })}\\nGenerated: \${generatedAt}\`;
    const issueRows = issues.map((issue) => \`<li><strong>\${issue.severity.toUpperCase()}</strong> · \${issue.name} · $\${issue.cost}</li>\`).join('');
    const reportPhotos = await Promise.all(photos.map(readPhotoForPdf));
    const photoRows = buildPhotoEvidenceHtml(reportPhotos);
    const html = \`<!DOCTYPE html><html><body style="font-family: -apple-system, sans-serif; padding: 28px; color: #111827"><div style="border-bottom: 6px solid #2F80ED; padding-bottom: 16px"><div style="font-size: 12px; letter-spacing: 3px; color: #2F80ED; font-weight: 800">CARWISE</div><div style="font-size: 11px; color: #667085">Generated \${generatedAt}</div><h1 style="margin-bottom: 4px">Inspection report</h1><div style="color: #667085">\${vehicle.year} \${vehicle.make} \${vehicle.model}</div></div><div style="margin-top: 20px; padding: 16px; background: #F2F4F7; border-radius: 12px"><strong>Risk score: \${riskScore}/100</strong><br/>Estimated repairs: $\${repairTotal}<br/>Photo evidence: \${photos.length} item(s)</div><h2>Detected issues</h2><ul>\${issueRows || '<li>No issues recorded</li>'}</ul><h2>Photo evidence</h2><div>\${photoRows || '<span style="color:#667085">No photo evidence attached</span>'}</div><h2>Report details</h2><pre style="white-space: pre-wrap; font-size: 14px; line-height: 1.5">\${report}</pre><footer style="margin-top:32px; padding-top:12px; border-top:1px solid #D0D5DD; color:#667085; font-size:11px">Carwise · Inspection guidance is informational and should be confirmed by a qualified mechanic.</footer></body></html>\`;
    try { const result = await Print.printToFileAsync({ html }); if (await Sharing.isAvailableAsync()) { await Sharing.shareAsync(result.uri, { mimeType: 'application/pdf', dialogTitle: 'Share Carwise report' }); setSaveStatus('PDF report ready'); } else { setSaveStatus('PDF created; sharing unavailable'); } } catch (_) { setSaveStatus('PDF export unavailable'); }
  };

  const Home =`;
source = source.replace(oldExport[0], newExport);
source = source.replace("import { Animated, Image, Modal as RNModal, PanResponder, SafeAreaView, ScrollView, Share, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';", "import { Animated, Easing, Image, Modal as RNModal, PanResponder, Platform, SafeAreaView, ScrollView, Share, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';");
source = source.replace("<RNModal visible={Boolean(reportPreview)} transparent animationType=\"slide\" onRequestClose={() => setReportPreview('')}><View style={styles.modalBackdrop}><View style={styles.modalCard}><Text style={styles.pageTitle}>Report preview</Text>", "<RNModal visible={Boolean(reportPreview)} transparent animationType=\"slide\" onRequestClose={() => setReportPreview('')}><View style={styles.modalBackdrop}><View style={styles.modalCard}><View style={styles.reportModalHeader}><Text style={styles.pageTitle}>Report preview</Text><TouchableOpacity accessibilityRole=\"button\" accessibilityLabel=\"Close report preview\" onPress={() => setReportPreview('')}><Text style={styles.reportClose}>Close</Text></TouchableOpacity></View><ScrollView style={styles.reportScroll} contentContainerStyle={styles.reportScrollContent} showsVerticalScrollIndicator={false}>");
source = source.replace("<TouchableOpacity style={styles.secondaryButton} onPress={() => setReportPreview('')}><Text style={styles.secondaryButtonText}>Close</Text></TouchableOpacity></View></View></RNModal>", "<TouchableOpacity style={styles.secondaryButton} onPress={() => setReportPreview('')}><Text style={styles.secondaryButtonText}>Done</Text></TouchableOpacity></ScrollView></View></View></RNModal>");
source = source.replace("modalBackdrop: { flex: 1, backgroundColor: 'rgba(3,8,18,0.78)', justifyContent: 'flex-end' },", "modalBackdrop: { flex: 1, backgroundColor: 'rgba(3,8,18,0.88)', justifyContent: 'center', padding: 14 },");
source = source.replace("modalCard: { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: COLORS.border, padding: 22, paddingBottom: 34 },", "modalCard: { flex: 1, maxHeight: '96%', backgroundColor: COLORS.surface, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border, padding: 20, paddingBottom: 24 }, reportModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, reportClose: { color: COLORS.blue, fontSize: 14, fontWeight: '800' }, reportScroll: { flex: 1, marginTop: 8 }, reportScrollContent: { paddingBottom: 12 },");
fs.writeFileSync(path, source);
