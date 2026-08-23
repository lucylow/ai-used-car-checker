import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { getChecklistGuidance, getInspectionActionGuidance, getInspectionNavigationLabel } from '../src/services/reportUtils';

function InspectionChecklist({ checklist, checklistComplete, photos, onToggleSection, onBack, onPhotos, onSave, MotionButton, styles, colors }) {
  const rows = [['Exterior', 'Paint, glass, lights'], ['Tires & brakes', 'Wear, pressure, stopping'], ['Engine bay', 'Leaks, fluids, belts'], ['Interior', 'Controls, odor, electronics'], ['Test drive', 'Steering, handling, noise']];
  return <ScrollView contentContainerStyle={styles.content}>
    <Text accessibilityRole="button" accessibilityLabel={getInspectionNavigationLabel('new')} style={styles.back} onPress={onBack}>‹ Vehicle details</Text>
    <Text style={styles.pageTitle}>Inspection checklist</Text>
    <Text style={styles.pageBody}>Mark anything that feels different, worn, or unsafe.</Text>
    <Text accessibilityLiveRegion="polite" style={styles.completionHint}>{getChecklistGuidance(checklistComplete, 5)}</Text>
    {rows.map(([title, subtitle], index) => { const done = Boolean(checklist[title]); return <TouchableOpacity key={title} accessibilityRole="checkbox" accessibilityLabel={`${title} checklist section`} accessibilityHint={index === 4 ? 'Opens test-drive notes and toggles completion' : 'Toggles section completion'} accessibilityState={{ checked: done }} style={styles.checkRow} onPress={() => onToggleSection(title, index, done)}><View style={[styles.checkIcon, { backgroundColor: done ? `${colors.mint}20` : `${colors.blue}20` }]}><Text style={{ color: done ? colors.mint : colors.blue, fontWeight: '800' }}>{done ? '✓' : '•'}</Text></View><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.muted}>{done ? 'Marked complete' : subtitle}</Text></View><Text style={styles.chevron}>›</Text></TouchableOpacity>; })}
    <Text style={styles.muted}>{getInspectionActionGuidance({ photoCount: photos.length, reportReady: checklistComplete === 5 })}</Text>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Manage inspection photos" style={styles.secondaryButton} onPress={onPhotos}><Text style={styles.secondaryButtonText}>{photos.length ? `Review ${photos.length} photo${photos.length === 1 ? '' : 's'}` : 'Add photo evidence'}</Text></TouchableOpacity>
    <MotionButton accessibilityLabel={checklistComplete === 5 ? 'Save completed inspection' : 'Save inspection and finish later'} style={styles.primaryButton} onPress={onSave}><Text style={styles.primaryButtonText}>{checklistComplete === 5 ? 'Save completed inspection' : 'Save and finish later'}</Text><Text style={styles.buttonArrow}>→</Text></MotionButton>
  </ScrollView>;
}

export default InspectionChecklist;
