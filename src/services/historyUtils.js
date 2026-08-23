const getIssueList = (item = {}) => Array.isArray(item?.issues) ? item.issues.filter((issue) => issue && typeof issue === 'object' && !Array.isArray(issue)) : [];
const riskScore = (item = {}) => getIssueList(item).reduce((sum, issue) => sum + ({ critical: 34, major: 20, minor: 8 }[issue.severity] || 0), 0);
const repairTotal = (item = {}) => getIssueList(item).reduce((sum, issue) => sum + Math.max(0, Number(issue.cost) || 0), 0);
const isRecord = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const safeText = (value, maxLength) => (typeof value === 'string' || typeof value === 'number') ? String(value).trim().slice(0, maxLength) : '';
const normalizeSavedVehicle = (vehicle = {}) => ({
  year: safeText(vehicle.year, 4),
  make: safeText(vehicle.make, 60),
  model: safeText(vehicle.model, 80),
  mileage: safeText(vehicle.mileage, 20),
  vin: safeText(vehicle.vin, 30).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 17),
  asking: safeText(vehicle.asking, 30),
});

export const normalizeSavedInspection = (item = {}) => {
  if (!isRecord(item) || !isRecord(item.vehicle)) return null;
  return {
    ...item,
    vehicle: normalizeSavedVehicle(item.vehicle),
    issues: Array.isArray(item.issues) ? item.issues.filter(isRecord) : [],
    checklist: isRecord(item.checklist) ? item.checklist : {},
    photos: Array.isArray(item.photos) ? item.photos.filter(isRecord) : [],
    aiHistory: Array.isArray(item.aiHistory) ? item.aiHistory.filter(isRecord).slice(-6) : [],
    savedAt: item.savedAt || new Date(0).toISOString(),
  };
};

export const getInspectionRiskLabel = (item = {}) => { const score = riskScore(item); return score >= 60 ? 'HIGH RISK' : score >= 30 ? 'REVIEW' : 'LOWER RISK'; };
export const getInspectionCompletion = (item = {}) => { const complete = Object.values(item.checklist || {}).filter(Boolean).length; return `${complete}/5 sections`; };
export const getInspectionRepairTotal = (item = {}) => repairTotal(item);
export const getSavedIssueDisplay = (issue = {}) => ({ name: typeof issue?.name === 'string' && issue.name.trim() ? issue.name.trim() : 'Unnamed finding', severity: typeof issue?.severity === 'string' && issue.severity.trim() ? issue.severity.trim().toUpperCase() : 'MINOR', cost: Math.max(0, Number(issue?.cost) || 0) });
export const getReportReadiness = ({ vehicle = {}, checklist = {}, photos = [] } = {}) => { const safeVehicle = isRecord(vehicle) ? vehicle : {}; const safeChecklist = isRecord(checklist) ? checklist : {}; const safePhotos = Array.isArray(photos) ? photos : []; const missing = []; if (!/^\d{4}$/.test(String(safeVehicle.year || '').trim()) || !String(safeVehicle.make || '').trim() || !String(safeVehicle.model || '').trim()) missing.push('vehicle details'); if (Object.values(safeChecklist).filter(Boolean).length < 5) missing.push('checklist'); if (!safePhotos.length) missing.push('photo evidence'); return { ready: missing.length === 0, missing }; };
export const getHistoryActionMessage = (action) => action === 'delete' ? 'Inspection deleted · Undo available' : 'Inspection duplicated · New copy added';
export const getInspectionComparison = (left = {}, right = {}) => {
  const first = normalizeSavedInspection(left);
  const second = normalizeSavedInspection(right);
  if (!first || !second) return null;
  const metric = (item) => ({ risk: riskScore(item), repairs: repairTotal(item), checklist: Object.values(item.checklist).filter(Boolean).length, photos: item.photos.length, confidence: item.aiHistory.at(-1)?.confidence || null });
  return { left: { id: first.id, label: `${first.vehicle.year} ${first.vehicle.make} ${first.vehicle.model}`, ...metric(first) }, right: { id: second.id, label: `${second.vehicle.year} ${second.vehicle.make} ${second.vehicle.model}`, ...metric(second) } };
};
export const getComparisonMetricRows = (comparison) => {
  if (!comparison) return [];
  const rows = [
    { key: 'risk', label: 'Risk score', left: comparison.left.risk, right: comparison.right.risk, max: 100, suffix: '/100' },
    { key: 'repairs', label: 'Estimated repairs', left: comparison.left.repairs, right: comparison.right.repairs, max: Math.max(comparison.left.repairs, comparison.right.repairs, 1), prefix: '$' },
    { key: 'checklist', label: 'Checklist complete', left: comparison.left.checklist, right: comparison.right.checklist, max: 5, suffix: '/5' },
    { key: 'photos', label: 'Photo evidence', left: comparison.left.photos, right: comparison.right.photos, max: Math.max(comparison.left.photos, comparison.right.photos, 1) },
    { key: 'confidence', label: 'AI confidence', left: comparison.left.confidence, right: comparison.right.confidence, max: 100, suffix: '%' },
  ];
  return rows.map((row) => ({ ...row, leftRatio: row.left === null ? 0 : Math.min(1, row.left / row.max), rightRatio: row.right === null ? 0 : Math.min(1, row.right / row.max) }));
};

export const shouldClearSavedSelection = (selectedId, deletedId) => Boolean(selectedId && deletedId && String(selectedId) === String(deletedId));
export const pruneComparisonSelection = (selection = [], inspections = []) => {
  const ids = new Set((Array.isArray(inspections) ? inspections : []).map((item) => String(item?.id)).filter(Boolean));
  return (Array.isArray(selection) ? selection : []).filter((id) => ids.has(String(id))).slice(-2);
};
export const shouldReplaceSavedInspection = (existingVehicle = {}, nextVehicle = {}) => {
  const nextVin = String(nextVehicle.vin || '').replace(/\s/g, '').toUpperCase();
  const existingVin = String(existingVehicle.vin || '').replace(/\s/g, '').toUpperCase();
  return Boolean(nextVin && existingVin && nextVin === existingVin);
};

export const filterAndSortInspections = (inspections = [], query = '', sort = 'newest') => {
  const normalizedQuery = typeof query === 'string' ? query.trim().toLowerCase() : '';
  const safeInspections = Array.isArray(inspections) ? inspections.filter(isRecord) : [];
  return [...safeInspections]
    .filter((item) => !normalizedQuery || `${item.vehicle?.year || ''} ${item.vehicle?.make || ''} ${item.vehicle?.model || ''}`.toLowerCase().includes(normalizedQuery))
    .sort((a, b) => {
      if (sort === 'repairs') return repairTotal(b) - repairTotal(a);
      if (sort === 'risk') return riskScore(b) - riskScore(a);
      return new Date(b.savedAt || 0).getTime() - new Date(a.savedAt || 0).getTime();
    });
};
