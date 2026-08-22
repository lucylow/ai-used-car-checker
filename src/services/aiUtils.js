const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const getEvidenceCoverage = ({ checklist = {}, photos = [] } = {}) => {
  const completedSections = Object.values(checklist).filter(Boolean).length;
  const photoCount = Array.isArray(photos) ? photos.filter((photo) => photo?.uri).length : 0;
  return { completedSections, photoCount, totalSections: 5, score: clamp(Math.round((completedSections / 5) * 70 + Math.min(photoCount, 6) / 6 * 30), 0, 100) };
};

export const buildAiAnalysis = ({ vehicle = {}, issues = [], checklist = {}, photos = [] } = {}) => {
  const evidence = getEvidenceCoverage({ checklist, photos });
  const existingIssues = Array.isArray(issues) ? issues : [];
  const hasSafetyIssue = existingIssues.some((issue) => issue?.severity === 'critical');
  const confidence = clamp(Math.round(35 + evidence.score * 0.55 + (vehicle.vin ? 10 : 0)), 35, 95);
  const findings = hasSafetyIssue ? [] : [{ name: 'Rust underneath', severity: 'critical', cost: 850, note: 'Needs in-person confirmation beneath the vehicle.', source: evidence.photoCount ? 'photo-assisted heuristic' : 'inspection checklist heuristic', confidence: clamp(confidence - 8, 25, 95), evidence: evidence.photoCount ? `${evidence.photoCount} usable photo${evidence.photoCount === 1 ? '' : 's'} plus ${evidence.completedSections}/5 checklist sections` : `${evidence.completedSections}/5 checklist sections; no usable photo attached` }];
  const combinedIssues = [...existingIssues, ...findings.filter((finding) => !existingIssues.some((issue) => issue?.name === finding.name))];
  const repairTotal = combinedIssues.reduce((sum, issue) => sum + Math.max(0, Number(issue?.cost) || 0), 0);
  const asking = Number(String(vehicle.asking || '').replace(/[^0-9.]/g, '')) || 0;
  const fairPrice = asking ? Math.max(0, Math.round(asking - repairTotal * 0.35)) : null;
  return {
    findings,
    issues: combinedIssues,
    repairTotal,
    fairPrice,
    confidence,
    evidence,
    limitations: evidence.score < 60 ? 'Add more checklist results and clear photos before relying on this analysis.' : 'AI findings are screening signals, not a mechanical diagnosis. Confirm safety items with a qualified mechanic.',
    negotiation: repairTotal ? `Use the ${repairTotal.toLocaleString('en-US')} repair estimate as an evidence-backed negotiation reserve; confirm each item before making an offer.` : 'No repair reserve is calculated yet. Add confirmed issues and costs before negotiating.'
  };
};

export const mergeAiFindings = (existingIssues = [], pendingFindings = []) => {
  const existing = Array.isArray(existingIssues) ? existingIssues : [];
  const pending = Array.isArray(pendingFindings) ? pendingFindings : [];
  return [...existing, ...pending.filter((finding) => finding?.name && !existing.some((issue) => issue?.name === finding.name))];
};

export const getAiFindingExplanation = (finding = {}) => {
  const confidence = clamp(Number(finding.confidence) || 0, 0, 100);
  return `${confidence}% confidence · ${finding.evidence || 'Based on the available inspection evidence.'} · Confirm in person before purchase.`;
};

export const getAiConfidenceLabel = (confidence) => {
  const value = clamp(Number(confidence) || 0, 0, 100);
  return value >= 75 ? 'Higher confidence' : value >= 55 ? 'Moderate confidence' : 'Limited confidence';
};

export const getAiReadinessMessage = ({ photoCount = 0, completedSections = 0 } = {}) => {
  if (!photoCount && !completedSections) return 'Add checklist results and at least one clear photo for a more useful analysis.';
  if (!photoCount) return 'Checklist data is available. Add clear photos to improve visual evidence.';
  if (completedSections < 5) return `${completedSections}/5 checklist sections complete. Finish the walk-around to improve confidence.`;
  return 'Evidence coverage is strong enough for a first-pass screening analysis.';
};
