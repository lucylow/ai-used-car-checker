import { View } from 'react-native';
import { getReportActionState } from '../src/services/reportUtils';

function ReportActions({ ActionButton, busy, action, retry, retryKind, onRun, onClose }) {
  const state = getReportActionState({ busy, action, retry, retryKind });
  return <View>
    <ActionButton accessibilityLabel="Export PDF report" disabled={state.busy} label={state.primaryLabel} onPress={() => onRun('Preparing PDF…', 'pdf')} />
    <ActionButton accessibilityLabel="Share text report" variant="secondary" disabled={state.busy} label={state.primaryLabel} onPress={() => onRun('Preparing share…', 'text')} />
    {state.retryVisible ? <ActionButton accessibilityLabel={state.retryLabel} variant="secondary" label={state.retryLabel} onPress={() => onRun('Retrying report…', state.retryKind)} /> : null}
    <ActionButton accessibilityLabel="Close report preview" variant="secondary" label={state.closeLabel} onPress={onClose} />
  </View>;
}

export default ReportActions;
