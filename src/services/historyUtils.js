const riskScore = (item = {}) => (item.issues || []).reduce((sum, issue) => sum + ({ critical: 34, major: 20, minor: 8 }[issue.severity] || 0), 0);
const repairTotal = (item = {}) => (item.issues || []).reduce((sum, issue) => sum + (Number(issue.cost) || 0), 0);
const isRecord = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value));

export const normalizeSavedInspection = (item = {}) => {
  if (!isRecord(item) || !isRecord(item.vehicle)) return null;
  return {
    ...item,
    vehicle: item.vehicle,
    issues: Array.isArray(item.issues) ? item.issues.filter(isRecord) : [],
    checklist: isRecord(item.checklist) ? item.checklist : {},
    photos: Array.isArray(item.photos) ? item.photos.filter(isRecord) : [],
    savedAt: item.savedAt || new Date(0).toISOString(),
  };
};

export const getInspectionRiskLabel = (item = {}) => { const score = riskScore(item); return score >= 60 ? 'HIGH RISK' : score >= 30 ? 'REVIEW' : 'LOWER RISK'; };
export const getInspectionCompletion = (item = {}) => { const complete = Object.values(item.checklist || {}).filter(Boolean).length; return `${complete}/5 sections`; };
export const getInspectionRepairTotal = (item = {}) => repairTotal(item);
export const getReportReadiness = ({ vehicle = {}, checklist = {}, photos = [] } = {}) => { const missing = []; if (!/^\d{4}$/.test(String(vehicle.year || '').trim()) || !vehicle.make?.trim() || !vehicle.model?.trim()) missing.push('vehicle details'); if (Object.values(checklist).filter(Boolean).length < 5) missing.push('checklist'); if (!photos.length) missing.push('photo evidence'); return { ready: missing.length === 0, missing }; };
export const getHistoryActionMessage = (action) => action === 'delete' ? 'Inspection deleted · Undo available' : 'Inspection duplicated · New copy added';
export const shouldClearSavedSelection = (selectedId, deletedId) => Boolean(selectedId && deletedId && String(selectedId) === String(deletedId));
export const shouldReplaceSavedInspection = (existingVehicle = {}, nextVehicle = {}) => {
  const nextVin = String(nextVehicle.vin || '').replace(/\s/g, '').toUpperCase();
  const existingVin = String(existingVehicle.vin || '').replace(/\s/g, '').toUpperCase();
  return Boolean(nextVin && existingVin && nextVin === existingVin);
};

export const filterAndSortInspections = (inspections = [], query = '', sort = 'newest') => {
  const normalizedQuery = query.trim().toLowerCase();
  return [...inspections]
    .filter((item) => !normalizedQuery || `${item.vehicle?.year || ''} ${item.vehicle?.make || ''} ${item.vehicle?.model || ''}`.toLowerCase().includes(normalizedQuery))
    .sort((a, b) => {
      if (sort === 'repairs') return repairTotal(b) - repairTotal(a);
      if (sort === 'risk') return riskScore(b) - riskScore(a);
      return new Date(b.savedAt || 0).getTime() - new Date(a.savedAt || 0).getTime();
    });
};
