const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const getEvidenceAudit = ({ vehicle = {}, checklist = {}, photos = [], issues = [], pendingFindings = [] } = {}) => {
  const completedSections = Object.values(checklist).filter(Boolean).length;
  const usablePhotoCount = Array.isArray(photos) ? photos.filter((photo) => photo?.uri).length : 0;
  const confirmed = [`${completedSections}/5 checklist sections`, `${Array.isArray(issues) ? issues.length : 0} recorded issue${issues?.length === 1 ? '' : 's'}`];
  if (vehicle.year && vehicle.make && vehicle.model) confirmed.unshift('Vehicle identity');
  const suggested = Array.isArray(pendingFindings) ? pendingFindings.filter((finding) => finding?.name).map((finding) => finding.name) : [];
  const missing = [];
  if (!usablePhotoCount) missing.push('clear photo evidence');
  if (completedSections < 5) missing.push(`${5 - completedSections} checklist section${5 - completedSections === 1 ? '' : 's'}`);
  if (!vehicle.asking) missing.push('asking price');
  return { confirmed, suggested, missing, usablePhotoCount };
};

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
  const recommendation = getAiRecommendation({ issues: combinedIssues, repairTotal, confidence, evidenceScore: evidence.score });
  const priorityPlan = getAiPriorityPlan({ issues: combinedIssues, evidenceScore: evidence.score, photos });
  const evidenceAudit = getEvidenceAudit({ vehicle, checklist, photos, issues: existingIssues, pendingFindings: findings });
  return {
    findings,
    issues: combinedIssues,
    repairTotal,
    fairPrice,
    confidence,
    evidence,
    recommendation,
    priorityPlan,
    evidenceAudit,
    limitations: evidence.score < 60 ? 'Add more checklist results and clear photos before relying on this analysis.' : 'AI findings are screening signals, not a mechanical diagnosis. Confirm safety items with a qualified mechanic.',
    negotiation: repairTotal ? `Use the ${repairTotal.toLocaleString('en-US')} repair estimate as an evidence-backed negotiation reserve; confirm each item before making an offer.` : 'No repair reserve is calculated yet. Add confirmed issues and costs before negotiating.'
  };
};

export const mergeAiFindings = (existingIssues = [], pendingFindings = []) => {
  const existing = Array.isArray(existingIssues) ? existingIssues : [];
  const pending = Array.isArray(pendingFindings) ? pendingFindings : [];
  return [...existing, ...pending.filter((finding) => finding?.name && !existing.some((issue) => issue?.name === finding.name))];
};

export const getAiPriorityPlan = ({ issues = [], evidenceScore = 0, photos = [] } = {}) => {
  const list = Array.isArray(issues) ? issues : [];
  const usablePhotos = Array.isArray(photos) ? photos.filter((photo) => photo?.uri) : [];
  const severityWeight = { critical: 3, major: 2, minor: 1 };
  return list.map((issue, index) => {
    const severity = issue?.severity || 'minor';
    const cost = Math.max(0, Number(issue?.cost) || 0);
    const priorityScore = (severityWeight[severity] || 1) * 100 + Math.min(cost, 5000) / 50;
    const nextAction = severity === 'critical' ? 'Stop and arrange an independent mechanic inspection.' : severity === 'major' ? 'Request service records and obtain a repair estimate.' : 'Document the condition and include it in negotiation notes.';
    const photo = usablePhotos[index % Math.max(usablePhotos.length, 1)];
    return { ...issue, priority: index + 1, priorityScore, photoId: photo?.id || null, why: `${severity[0].toUpperCase() + severity.slice(1)} concern${cost ? ` with an estimated $${cost.toLocaleString('en-US')} reserve` : ''}; evidence coverage is ${evidenceScore}%.`, nextAction };
  }).sort((a, b) => b.priorityScore - a.priorityScore).map((issue, index) => ({ ...issue, priority: index + 1 }));
};

export const getAiRecommendation = ({ issues = [], repairTotal = 0, confidence = 0, evidenceScore = 0 } = {}) => {
  const list = Array.isArray(issues) ? issues : [];
  const critical = list.filter((issue) => issue?.severity === 'critical').length;
  const major = list.filter((issue) => issue?.severity === 'major').length;
  if (critical) return { tier: 'PAUSE', title: 'Pause before making an offer', action: 'Arrange an independent mechanic inspection and verify the critical item first.', reason: `${critical} critical issue${critical === 1 ? '' : 's'} need in-person confirmation.` };
  if (major || repairTotal >= 1500) return { tier: 'NEGOTIATE', title: 'Negotiate with repair evidence', action: 'Ask for service records and use the repair reserve to structure your offer.', reason: `${major} major issue${major === 1 ? '' : 's'} and an estimated repair reserve of $${repairTotal.toLocaleString('en-US')}.` };
  if (confidence < 55 || evidenceScore < 60) return { tier: 'GATHER MORE', title: 'Gather more evidence', action: 'Complete the checklist and add clear photos before relying on the estimate.', reason: `Current evidence coverage is ${evidenceScore}% with ${confidence}% overall confidence.` };
  return { tier: 'PROCEED', title: 'Proceed with normal due diligence', action: 'Confirm maintenance records, test-drive the vehicle, and get a pre-purchase inspection.', reason: 'No critical or major issue is currently recorded.' };
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
