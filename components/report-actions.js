import { View } from 'react-native';
import { getReportRetryLabel } from '../src/services/reportUtils';

function ReportActions({ ActionButton, busy, action, retry, retryKind, onRun, onClose }) {
  return <View>
    <ActionButton accessibilityLabel="Export PDF report" disabled={busy} label={action || 'Export PDF report'} onPress={() => onRun('Preparing PDF…', 'pdf')} />
    <ActionButton accessibilityLabel="Share text report" variant="secondary" disabled={busy} label={action || 'Share text report'} onPress={() => onRun('Preparing share…', 'text')} />
    {retry ? <ActionButton accessibilityLabel={getReportRetryLabel(retryKind)} variant="secondary" label={getReportRetryLabel(retryKind)} onPress={() => onRun('Retrying report…', retryKind)} /> : null}
    <ActionButton accessibilityLabel="Close report preview" variant="secondary" label="Done" onPress={onClose} />
  </View>;
}

export default ReportActions;
