export function filterAndSortInspections(value) {
  return Array.isArray(value) ? value : [];
}

export function getHistoryActionMessage() {
  return 'View inspection history';
}

export function getInspectionCompletion() {
  return 0;
}

export function getInspectionRepairTotal() {
  return 0;
}

export function getInspectionRiskLabel() {
  return 'No risk data';
}

export function getInspectionComparison() {
  return [];
}

export function getComparisonMetricRows() {
  return [];
}

export function getReportReadiness() {
  return { ready: false, missing: [] };
}

export function normalizeSavedInspection(value) {
  return value || {};
}

export function shouldClearSavedSelection() {
  return false;
}

export function shouldReplaceSavedInspection() {
  return false;
}

export function pruneComparisonSelection() {
  return [];
}
