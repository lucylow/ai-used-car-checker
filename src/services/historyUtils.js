const riskScore = (item = {}) => (item.issues || []).reduce((sum, issue) => sum + ({ critical: 34, major: 20, minor: 8 }[issue.severity] || 0), 0);
const repairTotal = (item = {}) => (item.issues || []).reduce((sum, issue) => sum + (Number(issue.cost) || 0), 0);

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
