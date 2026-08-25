import { normalizeMarketComparison } from './marketUtils.js';

const getIssueList = (item = {}) => Array.isArray(item?.issues) ? item.issues.filter((issue) => issue && typeof issue === 'object' && !Array.isArray(issue)) : [];

const safeCost = (value) => { const numeric = Number(value); return Number.isFinite(numeric) ? Math.max(0, numeric) : 0; };
const riskScore = (item = {}) => Math.min(100, getIssueList(item).reduce((sum, issue) => sum + ({ critical: 34, major: 20, minor: 8 }[issue.severity] || 0), 0));
const repairTotal = (item = {}) => getIssueList(item).reduce((sum, issue) => sum + safeCost(issue.cost), 0);
const isRecord = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const safeText = (value, maxLength) => typeof value === 'string' ? value.trim().slice(0, maxLength) : typeof value === 'number' && Number.isFinite(value) ? String(value).slice(0, maxLength) : '';
const normalizeSavedIdentity = (value, maxLength = 120) => safeText(value, maxLength);
const normalizeSavedAt = (value) => typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? value : new Date(0).toISOString();
const getSavedAtTime = (value) => typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? Date.parse(value) : 0;
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
    issues: Array.isArray(item.issues) ? item.issues.filter(isRecord).slice(0, 80) : [],
    checklist: isRecord(item.checklist) ? item.checklist : {},
    photos: Array.isArray(item.photos) ? item.photos.filter(isRecord).slice(0, 80) : [],
    marketComparison: normalizeMarketComparison(item.marketComparison),
    aiHistory: Array.isArray(item.aiHistory) ? item.aiHistory.filter(isRecord).slice(-6) : [],
    savedAt: normalizeSavedAt(item.savedAt),
  };
};

export const getInspectionRiskLabel = (item = {}) => { const score = riskScore(item); return score >= 60 ? 'HIGH RISK' : score >= 30 ? 'REVIEW' : 'LOWER RISK'; };
export const getInspectionCompletion = (item = {}) => `${countCompletedChecklistSections(item && typeof item === 'object' && !Array.isArray(item) ? item.checklist : {})}/5 sections`;
export const getInspectionRepairTotal = (item = {}) => repairTotal(item);
export const getSavedIssueDisplay = (issue = {}) => ({ name: typeof issue?.name === 'string' && issue.name.trim() ? issue.name.trim() : 'Unnamed finding', severity: typeof issue?.severity === 'string' && issue.severity.trim() ? issue.severity.trim().toUpperCase() : 'MINOR', cost: safeCost(issue?.cost) });
const checklistSectionAliases = [['exterior'], ['tires', 'tires & brakes'], ['engine', 'engine bay'], ['interior'], ['test', 'test drive']];
const countCompletedChecklistSections = (checklist = {}) => { const safeChecklist = isRecord(checklist) ? checklist : {}; return checklistSectionAliases.filter((aliases) => aliases.some((alias) => Object.keys(safeChecklist).some((key) => String(key).trim().toLowerCase() === alias && Boolean(safeChecklist[key])))).length; };
const hasPhotoEvidence = (photo) => isRecord(photo) && [photo.id, photo.uri, photo.fileName, photo.embeddedDataUri].some((value) => safeText(value, 2000));
export const getReportReadiness = (input = {}) => { const safeInput = input && typeof input === 'object' && !Array.isArray(input) ? input : {}; const { vehicle = {}, checklist = {}, photos = [] } = safeInput; const safeVehicle = isRecord(vehicle) ? vehicle : {}; const safePhotos = (Array.isArray(photos) ? photos : []).filter(hasPhotoEvidence); const missing = []; if (!/^\d{4}$/.test(safeText(safeVehicle.year, 4)) || !safeText(safeVehicle.make, 60) || !safeText(safeVehicle.model, 80)) missing.push('vehicle details'); if (countCompletedChecklistSections(checklist) < 5) missing.push('checklist'); if (!safePhotos.length) missing.push('photo evidence'); return { ready: missing.length === 0, missing }; };
export const getHistoryActionMessage = (action) => action === 'delete' ? 'Inspection deleted · Undo available' : 'Inspection duplicated · New copy added';
export const getInspectionComparison = (left = {}, right = {}) => {
  const first = normalizeSavedInspection(left);
  const second = normalizeSavedInspection(right);
  if (!first || !second) return null;
  const metric = (item) => { const rawConfidence = Number(item.aiHistory.at(-1)?.confidence); return { risk: riskScore(item), repairs: repairTotal(item), checklist: countCompletedChecklistSections(item.checklist), photos: item.photos.length, confidence: Number.isFinite(rawConfidence) ? Math.min(100, Math.max(0, rawConfidence)) : null }; };
  return { left: { id: first.id, label: `${first.vehicle.year} ${first.vehicle.make} ${first.vehicle.model}`, ...metric(first) }, right: { id: second.id, label: `${second.vehicle.year} ${second.vehicle.make} ${second.vehicle.model}`, ...metric(second) } };
};
const getSafeMetricRatio = (value, max) => { const numeric = Number(value); return Number.isFinite(numeric) ? Math.min(1, Math.max(0, numeric / max)) : 0; };

export const getComparisonMetricRows = (comparison) => {
  if (!comparison || !comparison.left || !comparison.right || typeof comparison.left !== 'object' || typeof comparison.right !== 'object') return [];
  const left = comparison.left;
  const right = comparison.right;
  const safeMetric = (value, max) => { if (value === null || value === undefined) return null; const numeric = Number(value); return Number.isFinite(numeric) ? Math.min(max, Math.max(0, numeric)) : 0; };
  const safeRiskLeft = safeMetric(left.risk, 100);
  const safeRiskRight = safeMetric(right.risk, 100);
  const safeRepairsLeft = safeMetric(left.repairs, 100000000);
  const safeRepairsRight = safeMetric(right.repairs, 100000000);
  const safeChecklistLeft = safeMetric(left.checklist, 5);
  const safeChecklistRight = safeMetric(right.checklist, 5);
  const safePhotosLeft = safeMetric(left.photos, 10000);
  const safePhotosRight = safeMetric(right.photos, 10000);
  const safeConfidenceLeft = safeMetric(left.confidence, 100);
  const safeConfidenceRight = safeMetric(right.confidence, 100);
  const rows = [
    { key: 'risk', label: 'Risk score', left: safeRiskLeft, right: safeRiskRight, max: 100, suffix: '/100' },
    { key: 'repairs', label: 'Estimated repairs', left: safeRepairsLeft, right: safeRepairsRight, max: Math.max(safeRepairsLeft || 0, safeRepairsRight || 0, 1), prefix: '$' },
    { key: 'checklist', label: 'Checklist complete', left: safeChecklistLeft, right: safeChecklistRight, max: 5, suffix: '/5' },
    { key: 'photos', label: 'Photo evidence', left: safePhotosLeft, right: safePhotosRight, max: Math.max(safePhotosLeft || 0, safePhotosRight || 0, 1) },
    { key: 'confidence', label: 'AI confidence', left: safeConfidenceLeft, right: safeConfidenceRight, max: 100, suffix: '%' },
  ];
  return rows.map((row) => ({ ...row, leftRatio: getSafeMetricRatio(row.left, row.max), rightRatio: getSafeMetricRatio(row.right, row.max) }));
};

export const shouldClearSavedSelection = (selectedId, deletedId) => { const selected = normalizeSavedIdentity(selectedId); const deleted = normalizeSavedIdentity(deletedId); return Boolean(selected && deleted && selected === deleted); };
export const pruneComparisonSelection = (selection = [], inspections = []) => {
  const ids = new Set((Array.isArray(inspections) ? inspections : []).map((item) => normalizeSavedIdentity(item?.id)).filter(Boolean));
  return (Array.isArray(selection) ? selection : []).filter((id) => { const normalized = normalizeSavedIdentity(id); return normalized && ids.has(normalized); }).slice(-2);
};
export const shouldReplaceSavedInspection = (existingVehicle = {}, nextVehicle = {}) => {
  const safeExisting = isRecord(existingVehicle) ? existingVehicle : {};
  const safeNext = isRecord(nextVehicle) ? nextVehicle : {};
  const nextVin = normalizeSavedIdentity(safeNext.vin, 30).replace(/\s/g, '').toUpperCase();
  const existingVin = normalizeSavedIdentity(safeExisting.vin, 30).replace(/\s/g, '').toUpperCase();
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
      return getSavedAtTime(b.savedAt) - getSavedAtTime(a.savedAt);
    });
};
