import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { getSafeDateLabel } from '../src/services/reportUtils';
import { getToolNoteTimeline } from '../src/services/backupUtils';

function SavedInspectionDetail({ item, onBack, onSelectPhoto, onOpenEditableReport, Card, Pill, styles }) {
  if (!item) return <ScrollView contentContainerStyle={styles.content}><Text style={styles.pageTitle}>Saved inspection</Text><Text style={styles.muted}>Choose a saved inspection from History.</Text></ScrollView>;
  const itemRepairTotal = item.issues.reduce((sum, issue) => sum + (Number(issue.cost) || 0), 0);
  const critical = item.issues.filter((issue) => issue.severity === 'critical').length;
  const savedNoteTimeline = getToolNoteTimeline(item.toolNotes);
  return <ScrollView contentContainerStyle={styles.content}>
    <Text accessibilityRole="button" accessibilityLabel="Back to saved inspections" style={styles.back} onPress={onBack}>‹ Saved inspections</Text>
    <Text style={styles.pageTitle}>{item.vehicle.year} {item.vehicle.make} {item.vehicle.model}</Text>
    <Text style={styles.pageBody}>Saved {getSafeDateLabel(item.savedAt)} · {item.vehicle.mileage || 'Mileage not provided'}</Text>
    <Card style={styles.scoreCard}><Text style={styles.cardEyebrow}>SAVED REPORT</Text><Text style={styles.score}>{critical ? 'HIGH' : item.issues.length ? 'REVIEW' : 'LOW'}</Text><Pill tone={critical ? 'coral' : item.issues.length ? 'amber' : 'mint'}>{item.issues.length} ISSUE(S)</Pill></Card>
    <Card><Text style={styles.cardEyebrow}>AI ANALYSIS HISTORY</Text>{item.aiHistory.length ? item.aiHistory.slice().reverse().map((snapshot) => <View key={snapshot.id || snapshot.at || `${snapshot.confidence}-${snapshot.evidence}`} style={styles.detailLine}><Text style={styles.cardTitle}>{snapshot.confidence || 0}% confidence · {snapshot.tier || 'ANALYSIS'}</Text><Text style={styles.muted}>{snapshot.reason || 'Evidence snapshot recorded'}{snapshot.evidence !== undefined ? ` · Evidence ${snapshot.evidence}%` : ''}</Text></View>) : <Text style={styles.muted}>No AI timeline was saved with this inspection.</Text>}</Card>
    {savedNoteTimeline.length ? <Card><Text style={styles.cardEyebrow}>FIELD NOTE TIMELINE</Text><Text style={styles.muted}>Saved observations with provenance and capture time.</Text>{savedNoteTimeline.map((entry) => <View key={entry.key} style={styles.detailLine}><View style={styles.rowBetween}><Text style={styles.cardTitle}>{entry.label}</Text><Pill tone={entry.source === 'Mechanic' ? 'mint' : entry.source === 'Seller' ? 'amber' : 'blue'}>{entry.source.toUpperCase()}</Pill></View><Text style={styles.muted}>{entry.note}</Text><Text style={styles.muted}>{entry.savedAt ? getSafeDateLabel(entry.savedAt, 'Time unavailable') : 'Saved time unavailable'}</Text></View>)}</Card> : null}
    <Card><Text style={styles.cardEyebrow}>ISSUE BREAKDOWN</Text>{item.issues.length ? item.issues.map((issue, index) => <View key={`${issue.name}-${index}`} style={styles.detailLine}><Text style={styles.cardTitle}>{issue.name}</Text><Text style={styles.muted}>{issue.severity.toUpperCase()} · ${issue.cost}</Text></View>) : <Text style={styles.muted}>No issues recorded.</Text>}<Text style={styles.detailRow}>Estimated repairs: ${itemRepairTotal}</Text></Card>
    <Card><Text style={styles.cardEyebrow}>PHOTO EVIDENCE</Text>{item.photos?.length ? <View style={styles.savedPhotoRow}>{item.photos.map((photo) => photo.uri ? <TouchableOpacity key={photo.id} accessibilityRole="button" accessibilityLabel={`Open saved photo ${photo.fileName || photo.id}`} onPress={() => onSelectPhoto(photo)}><Image source={{ uri: photo.uri }} style={styles.savedPhoto} accessibilityLabel={`Saved inspection photo ${photo.fileName || photo.id}`} /></TouchableOpacity> : <View key={photo.id} style={styles.savedPhotoPlaceholder}><Text style={styles.muted}>No preview</Text></View>)}</View> : <Text style={styles.muted}>No photos attached.</Text>}</Card>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open editable report" style={styles.primaryButton} onPress={() => onOpenEditableReport(item)}><Text style={styles.primaryButtonText}>Open editable report</Text><Text style={styles.buttonArrow}>→</Text></TouchableOpacity>
  </ScrollView>;
}

export default SavedInspectionDetail;
