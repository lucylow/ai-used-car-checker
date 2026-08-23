import { Alert, Text, TouchableOpacity, View } from 'react-native';

function AiFindingsList({ issues, onEdit, onRemove, onAdd, AlertComponent = Alert, Card, Pill, styles, colors }) {
  return <>
    <View style={styles.rowBetween}><Text style={styles.sectionTitle}>Detected issues</Text><TouchableOpacity accessibilityRole="button" accessibilityLabel="Add custom finding" accessibilityHint="Opens a form to add a finding the AI may have missed" style={styles.inlineAction} onPress={onAdd}><Text style={styles.link}>+ Add finding</Text></TouchableOpacity></View>
    {issues.map((issue, index) => <Card key={`${issue.name}-${index}`}><View style={styles.rowBetween}><View style={{ flex: 1 }}><TouchableOpacity accessibilityRole="button" accessibilityLabel={`Edit ${issue.name} finding`} onPress={() => onEdit(issue)}><Text style={styles.cardTitle}>{issue.name}</Text><Text style={styles.muted}>Estimated repair · ${issue.cost}{issue.note ? ` · ${issue.note}` : ''}</Text></TouchableOpacity></View><View style={{ alignItems: 'flex-end', gap: 8 }}><Pill tone={issue.severity === 'critical' ? 'coral' : issue.severity === 'major' ? 'amber' : 'mint'}>{issue.severity.toUpperCase()}</Pill><TouchableOpacity accessibilityRole="button" accessibilityLabel={`Remove ${issue.name} finding`} onPress={() => AlertComponent.alert('Remove finding?', `Remove ${issue.name} from this inspection?`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Remove', style: 'destructive', onPress: () => onRemove(issue) }])}><Text style={{ color: colors.coral, fontSize: 12, fontWeight: '800' }}>Remove</Text></TouchableOpacity></View></View></Card>)}
  </>;
}

export default AiFindingsList;
