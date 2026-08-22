import { Text, TouchableOpacity, View } from 'react-native';

const statusLabel = (status) => ({ confirmed: 'CONFIRMED', reviewed: 'REVIEWED', 'needs-confirmation': 'NEEDS REVIEW' }[status] || 'NEEDS REVIEW');
const statusColor = (status) => ({ confirmed: '#35D0BA', reviewed: '#2F80ED', 'needs-confirmation': '#F4B740' }[status] || '#F4B740');

export function PhotoEvidenceReview({ reviews, filter, onFilterChange, onMarkReviewed, onAddFinding, styles, colors }) {
  const visible = reviews.filter((review) => filter === 'all' || review.status === filter);
  const filters = [['all', 'All'], ['needs-confirmation', 'Needs review'], ['reviewed', 'Reviewed'], ['confirmed', 'Confirmed']];
  return <View style={styles.resultCard}>
    <Text style={styles.cardEyebrow}>PHOTO-BY-PHOTO REVIEW</Text>
    <Text style={styles.muted}>Each usable photo gets a focused inspection prompt. Confirm findings yourself before adding an issue.</Text>
    <View style={styles.segmentRow}>{filters.map(([key, label]) => <TouchableOpacity key={key} accessibilityRole="button" accessibilityState={{ selected: filter === key }} style={[styles.segment, filter === key && styles.segmentActive]} onPress={() => onFilterChange(key)}><Text style={{ color: filter === key ? '#fff' : colors.muted, fontWeight: '800', fontSize: 11 }}>{label}</Text></TouchableOpacity>)}</View>
    {visible.length ? visible.map((review) => <View key={review.id} style={styles.detailLine}><View style={styles.rowBetween}><Text style={styles.cardTitle}>{review.label}</Text><Text style={{ color: statusColor(review.status), fontSize: 11, fontWeight: '900' }}>{statusLabel(review.status)}</Text></View><Text style={styles.muted}>{review.guidance}</Text>{review.note ? <Text style={styles.muted}>Note: {review.note}</Text> : null}<Text style={styles.muted}>{review.provider} · {review.limitation}</Text>{review.status === 'needs-confirmation' ? <View style={styles.rowBetween}><TouchableOpacity accessibilityRole="button" style={[styles.secondaryButton, { flex: 1, marginRight: 6 }]} onPress={() => onMarkReviewed(review)}><Text style={styles.secondaryButtonText}>Reviewed</Text></TouchableOpacity><TouchableOpacity accessibilityRole="button" style={[styles.secondaryButton, { flex: 1, marginLeft: 6 }]} onPress={() => onAddFinding(review)}><Text style={styles.secondaryButtonText}>Add issue</Text></TouchableOpacity></View> : null}</View>) : <Text style={styles.muted}>No photos match this filter.</Text>}
  </View>;
}
