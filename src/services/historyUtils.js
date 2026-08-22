const riskScore = (item = {}) => (item.issues || []).reduce((sum, issue) => sum + ({ critical: 34, major: 20, minor: 8 }[issue.severity] || 0), 0);
const repairTotal = (item = {}) => (item.issues || []).reduce((sum, issue) => sum + (Number(issue.cost) || 0), 0);

export const getInspectionRiskLabel = (item = {}) => { const score = riskScore(item); return score >= 60 ? 'HIGH RISK' : score >= 30 ? 'REVIEW' : 'LOWER RISK'; };
export const getInspectionCompletion = (item = {}) => { const complete = Object.values(item.checklist || {}).filter(Boolean).length; return `${complete}/5 sections`; };
export const getInspectionRepairTotal = (item = {}) => repairTotal(item);
export const getReportReadiness = ({ vehicle = {}, checklist = {}, photos = [] } = {}) => { const missing = []; if (!vehicle.year || !vehicle.make || !vehicle.model) missing.push('vehicle details'); if (Object.values(checklist).filter(Boolean).length < 5) missing.push('checklist'); if (!photos.length) missing.push('photo evidence'); return { ready: missing.length === 0, missing }; };

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
