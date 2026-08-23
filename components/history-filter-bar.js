import { Text, TextInput, TouchableOpacity, View } from 'react-native';

function HistoryFilterBar({ query, sort, onQueryChange, onSortChange, onReset, resultCount, totalCount, styles, colors }) {
  return <>
    <TextInput accessibilityLabel="Search saved inspections" style={styles.inputFull} value={query} onChangeText={onQueryChange} placeholder="Search make, model, or year" placeholderTextColor={colors.muted} autoCapitalize="words" />
    <View style={[styles.segmentRow, { marginTop: 12 }]}>{[['newest', 'Newest'], ['risk', 'Highest risk'], ['repairs', 'Most repairs']].map(([value, label]) => <TouchableOpacity key={value} accessibilityRole="button" accessibilityLabel={`Sort inspections by ${label.toLowerCase()}`} accessibilityState={{ selected: sort === value }} style={[styles.segment, sort === value && styles.segmentActive]} onPress={() => onSortChange(value)}><Text style={{ color: sort === value ? '#fff' : colors.muted, fontWeight: '800', fontSize: 11 }}>{label}</Text></TouchableOpacity>)}</View>
    <View style={styles.historyToolbar}><Text style={styles.historyCount}>{resultCount} of {totalCount} saved inspections</Text>{query || sort !== 'newest' ? <TouchableOpacity accessibilityRole="button" accessibilityLabel="Reset history filters" onPress={onReset}><Text style={styles.historyReset}>Reset</Text></TouchableOpacity> : null}</View>
  </>;
}

export default HistoryFilterBar;
