export function buildInspectionReport({ vehicle, issues = [], checklist = {}, photos = [], fairPrice = 19400, riskScore = 0 }) {
  const repairTotal = issues.reduce((sum, issue) => sum + (Number(issue.cost) || 0), 0);
  const completedSections = Object.values(checklist).filter(Boolean).length;
  const criticalCount = issues.filter((issue) => issue.severity === 'critical').length;
  return [
    'CARWISE INSPECTION REPORT',
    `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    `Mileage: ${vehicle.mileage || 'Not provided'}`,
    `Risk score: ${riskScore}/100`,
    `Issues found: ${issues.length} (${criticalCount} critical)`,
    `Estimated repairs: $${repairTotal}`,
    `AI fair price: $${fairPrice.toLocaleString()}`,
    `Checklist: ${completedSections}/5 sections complete`,
    `Photo evidence: ${photos.length} item(s)`,
    '',
    'This report is informational and should be confirmed by a qualified mechanic.'
  ].join('\\n');
}
