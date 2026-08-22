import { Text, View } from 'react-native';
import { formatComparisonMetricValue } from '../src/services/uiUtils';

const COLORS = { text: '#F6F8FC', muted: '#92A1B8', blue: '#2F80ED', mint: '#35D0BA', surface2: '#1C2940' };

export function ComparisonBars({ comparison, rows }) {
  if (!comparison || !rows?.length) return null;
  return <View accessible accessibilityLabel="Inspection comparison metrics" style={{ marginTop: 16, gap: 12 }}>
    {rows.map((row) => <View key={row.key} style={{ gap: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
        <Text style={{ color: COLORS.muted, fontSize: 13 }}>{row.label}</Text>
        <Text style={{ color: COLORS.text, fontSize: 11, fontWeight: '800' }}>{formatComparisonMetricValue(row, row.left)} · {formatComparisonMetricValue(row, row.right)}</Text>
      </View>
      <View accessibilityLabel={`${row.label}: ${formatComparisonMetricValue(row, row.left)} versus ${formatComparisonMetricValue(row, row.right)}`} style={{ height: 8, borderRadius: 8, backgroundColor: COLORS.surface2, overflow: 'hidden', gap: 2 }}>
        <View style={{ height: 3, borderRadius: 4, backgroundColor: COLORS.blue, width: `${Math.max(row.leftRatio * 100, row.left === null ? 0 : 3)}%` }} />
        <View style={{ height: 3, borderRadius: 4, backgroundColor: COLORS.mint, alignSelf: 'flex-end', width: `${Math.max(row.rightRatio * 100, row.right === null ? 0 : 3)}%` }} />
      </View>
    </View>)}
  </View>;
}
