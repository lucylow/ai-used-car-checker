import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { getRestoreSourceLabel, getSafeDateLabel, getSavedInspectionDisplayName } from '../src/services/reportUtils';
import { getSavedIssueDisplay } from '../src/services/historyUtils';
import { getStablePhotoKey } from '../src/services/uiUtils';
import { getToolNoteTimeline } from '../src/services/backupUtils';
import { getMarketComparisonDisplay, getMarketComparisonSummary } from '../src/services/marketUtils';

function SavedInspectionDetail({ item, restoreSource = '', onBack, onSelectPhoto, onOpenEditableReport, Card, Pill, styles }) {
  if (!item) return <ScrollView contentContainerStyle={styles.content}><Text style={styles.pageTitle}>Saved inspection</Text><Text style={styles.muted}>Choose a saved inspection from History.</Text></ScrollView>;
  const issues = Array.isArray(item.issues) ? item.issues.filter((issue) => issue && typeof issue === 'object') : [];
  const photos = Array.isArray(item.photos) ? item.photos.filter((photo) => photo && typeof photo === 'object') : [];
  const aiHistory = Array.isArray(item.aiHistory) ? item.aiHistory.filter((snapshot) => snapshot && typeof snapshot === 'object') : [];
  const vehicle = item.vehicle && typeof item.vehicle === 'object' ? item.vehicle : {};
  const itemRepairTotal = issues.reduce((sum, issue) => sum + Math.max(0, Number(issue.cost) || 0), 0);
  const critical = issues.filter((issue) => issue.severity === 'critical').length;
  const savedNoteTimeline = getToolNoteTimeline(item.toolNotes);
  const market = getMarketComparisonDisplay(item.marketComparison);
  return <ScrollView contentContainerStyle={styles.content}>
    <Text accessibilityRole="button" accessibilityLabel="Back to saved inspections" style={styles.back} onPress={onBack}>‹ Saved inspections</Text>
    <Text style={styles.pageTitle}>{getSavedInspectionDisplayName(vehicle)}</Text>
    <Text style={styles.pageBody}>Saved {getSafeDateLabel(item.savedAt)} · {vehicle.mileage || 'Mileage not provided'}</Text>
    {restoreSource ? <Text accessibilityLabel={`Restore source: ${getRestoreSourceLabel(restoreSource)}`} style={styles.muted}>Restore source: {getRestoreSourceLabel(restoreSource)}</Text> : null}
    <Card style={styles.scoreCard}><Text style={styles.cardEyebrow}>SAVED REPORT</Text><Text style={styles.score}>{critical ? 'HIGH' : issues.length ? 'REVIEW' : 'LOW'}</Text><Pill tone={critical ? 'coral' : issues.length ? 'amber' : 'mint'}>{issues.length} ISSUE(S)</Pill></Card>
    <Card><Text style={styles.cardEyebrow}>AI ANALYSIS HISTORY</Text>{aiHistory.length ? aiHistory.slice().reverse().map((snapshot) => <View key={snapshot.id || snapshot.at || `${snapshot.confidence}-${snapshot.evidence}`} style={styles.detailLine}><Text style={styles.cardTitle}>{snapshot.confidence || 0}% confidence · {snapshot.tier || 'ANALYSIS'}</Text><Text style={styles.muted}>{snapshot.reason || 'Evidence snapshot recorded'}{snapshot.evidence !== undefined ? ` · Evidence ${snapshot.evidence}%` : ''}</Text></View>) : <Text style={styles.muted}>No AI timeline was saved with this inspection.</Text>}</Card>
    <Card><Text style={styles.cardEyebrow}>MARKET COMPARISON</Text><Text style={styles.muted}>Asking {market.asking} · Comparable {market.comparable}</Text><Text style={styles.muted}>Condition: {market.condition} · Mileage: {market.mileage}</Text><Text style={styles.muted}>{getMarketComparisonSummary(item.marketComparison)}</Text></Card>
    {savedNoteTimeline.length ? <Card><Text style={styles.cardEyebrow}>FIELD NOTE TIMELINE</Text><Text style={styles.muted}>Saved observations with provenance and capture time.</Text>{savedNoteTimeline.map((entry) => <View key={entry.key} style={styles.detailLine}><View style={styles.rowBetween}><Text style={styles.cardTitle}>{entry.label}</Text><Pill tone={entry.source === 'Mechanic' ? 'mint' : entry.source === 'Seller' ? 'amber' : 'blue'}>{entry.source.toUpperCase()}</Pill></View><Text style={styles.muted}>{entry.note}</Text><Text style={styles.muted}>{entry.savedAt ? getSafeDateLabel(entry.savedAt, 'Time unavailable') : 'Saved time unavailable'}</Text></View>)}</Card> : null}
    <Card><Text style={styles.cardEyebrow}>ISSUE BREAKDOWN</Text>{issues.length ? issues.map((issue, index) => { const display = getSavedIssueDisplay(issue); return <View key={`${display.name}-${index}`} style={styles.detailLine}><Text style={styles.cardTitle}>{display.name}</Text><Text style={styles.muted}>{display.severity} · ${display.cost}</Text></View>; }) : <Text style={styles.muted}>No issues recorded.</Text>}<Text style={styles.detailRow}>Estimated repairs: ${itemRepairTotal}</Text></Card>
    <Card><Text style={styles.cardEyebrow}>PHOTO EVIDENCE</Text>{photos.length ? <View style={styles.savedPhotoRow}>{photos.map((photo, index) => photo.uri ? <TouchableOpacity key={getStablePhotoKey(photo, index)} accessibilityRole="button" accessibilityLabel={`Open saved photo ${photo.fileName || photo.id}`} onPress={() => onSelectPhoto(photo)}><Image source={{ uri: photo.uri }} style={styles.savedPhoto} accessibilityLabel={`Saved inspection photo ${photo.fileName || photo.id}`} /></TouchableOpacity> : <View key={getStablePhotoKey(photo, index)} style={styles.savedPhotoPlaceholder}><Text style={styles.muted}>No preview</Text></View>)}</View> : <Text style={styles.muted}>No photos attached.</Text>}</Card>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open editable report" style={styles.primaryButton} onPress={() => onOpenEditableReport(item)}><Text style={styles.primaryButtonText}>Open editable report</Text><Text style={styles.buttonArrow}>→</Text></TouchableOpacity>
  </ScrollView>;
}

export default SavedInspectionDetail;
