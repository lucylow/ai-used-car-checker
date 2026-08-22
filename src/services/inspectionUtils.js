export function createNewInspectionState() {
  return {
    vehicle: { year: '', make: '', model: '', mileage: '', vin: '', asking: '' },
    issues: [],
    checklist: {},
    photos: [],
  };
}

export function getDerivedInspectionResetState() {
  return { ranAI: false, reportPreview: '' };
}

export function isSameIssue(issue = {}, target = {}) {
  if (issue === target) return true;
  return Boolean(issue.id && target.id && issue.id === target.id);
}

export function normalizeVin(value = '') {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 17);
}

export function isValidVin(value = '') {
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(normalizeVin(value));
}

export function getRepairTotal(issues = []) {
  return issues.reduce((total, issue) => total + Math.max(0, Number(issue.cost) || 0), 0);
}

export function getRiskScore(issues = []) {
  const weights = { critical: 34, major: 20, minor: 8 };
  return Math.min(100, issues.reduce((score, issue) => score + (weights[issue.severity] || 0), 0));
}
