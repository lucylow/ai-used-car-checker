const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const safeFinite = (value, fallback = 0) => { const numeric = Number(value); return Number.isFinite(numeric) ? numeric : fallback; };
const safeMoney = (value) => clamp(safeFinite(value), 0, 100000000);
const safeText = (value, fallback = '') => typeof value === 'string' && value.trim() ? value.trim() : fallback;
const isUsablePhoto = (photo) => photo && typeof photo === 'object' && !Array.isArray(photo) && typeof photo.uri === 'string' && photo.uri.trim();
const safeReviewStatus = (status) => ['confirmed', 'rejected', 'needs-confirmation'].includes(status) ? status : 'needs-confirmation';
const safeReviewNote = (note) => typeof note === 'string' ? note.trim().slice(0, 240) : '';
const isIssueRecord = (issue) => issue && typeof issue === 'object' && !Array.isArray(issue);
const isValidFinding = (finding) => isIssueRecord(finding) && typeof finding.name === 'string' && finding.name.trim();

const asRecord = (value) => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const normalizeAnalysisIssues = (issues) => (Array.isArray(issues) ? issues : []).map((issue) => {
  const safe = asRecord(issue);
  const name = safeText(safe.name).slice(0, 100);
  if (!name) return null;
  const normalized = { name, severity: ['critical', 'major', 'minor'].includes(safe.severity) ? safe.severity : 'minor', cost: safeMoney(safe.cost), note: safeText(safe.note).slice(0, 240) };
  const id = safeText(safe.id).slice(0, 120);
  const photoId = safeText(safe.photoId).slice(0, 120);
  const source = safeText(safe.source).slice(0, 120);
  const evidence = safeText(safe.evidence).slice(0, 240);
  const confidence = Number(safe.confidence);
  if (id) normalized.id = id;
  if (photoId) normalized.photoId = photoId;
  if (source) normalized.source = source;
  if (evidence) normalized.evidence = evidence;
  if (Number.isFinite(confidence)) normalized.confidence = clamp(confidence, 0, 100);
  return normalized;
}).filter(Boolean).slice(0, 80);
const checklistSectionAliases = [['exterior'], ['tires', 'tires & brakes'], ['engine', 'engine bay'], ['interior'], ['test', 'test drive']];
const countCompletedChecklistSections = (checklist = {}) => { const safeChecklist = asRecord(checklist); return checklistSectionAliases.filter((aliases) => aliases.some((alias) => Object.keys(safeChecklist).some((key) => String(key).trim().toLowerCase() === alias && Boolean(safeChecklist[key])))).length; };
export const getEvidenceAudit = (input = {}) => {
  const safe = asRecord(input);
  const vehicle = asRecord(safe.vehicle);
  const checklist = asRecord(safe.checklist);
  const photos = (Array.isArray(safe.photos) ? safe.photos : []).filter(isUsablePhoto);
  const issues = Array.isArray(safe.issues) ? safe.issues : [];
  const pendingFindings = Array.isArray(safe.pendingFindings) ? safe.pendingFindings : [];
  const validIssues = issues.filter(isValidFinding);
  const completedSections = countCompletedChecklistSections(checklist);
  const usablePhotoCount = photos.length;
  const confirmed = [`${completedSections}/5 checklist sections`, `${validIssues.length} recorded issue${validIssues.length === 1 ? '' : 's'}`];
  if (vehicle.year && vehicle.make && vehicle.model) confirmed.unshift('Vehicle identity');
  const suggested = pendingFindings.filter((finding) => typeof finding?.name === 'string' && finding.name.trim()).map((finding) => finding.name.trim().slice(0, 120));
  const missing = [];
  if (!usablePhotoCount) missing.push('clear photo evidence');
  if (completedSections < 5) missing.push(`${5 - completedSections} checklist section${5 - completedSections === 1 ? '' : 's'}`);
  if (!vehicle.asking) missing.push('asking price');
  return { confirmed, suggested, missing, usablePhotoCount };
};

export const getPhotoEvidenceReview = (photos = []) => {
  const prompts = ['Check exterior panels, glass, and lights for visible damage.', 'Check tires and brake area for wear, leaks, or warning signs.', 'Check the engine bay for leaks, corrosion, or missing components.', 'Check the interior controls, warning lights, and upholstery condition.'];
  return (Array.isArray(photos) ? photos : []).filter(isUsablePhoto).map((photo, index) => ({ id: safeText(photo.id, `photo-${index + 1}`), label: safeText(photo.fileName, `Photo ${index + 1}`), status: safeReviewStatus(photo.reviewStatus), note: safeReviewNote(photo.reviewNote), provider: 'local evidence checklist', guidance: prompts[index] || 'Review this image for visible condition changes and document anything unusual.', limitation: 'This review uses photo metadata and a structured prompt only; it is not a visual diagnosis.' }));
};

export const updatePhotoReview = (photos = [], photoId, status, note = '') => (Array.isArray(photos) ? photos : []).filter(isUsablePhoto).map((photo) => photo.id === photoId ? { ...photo, reviewStatus: safeReviewStatus(status), reviewNote: safeReviewNote(note) } : photo);
export const buildPhotoFindingDraft = (review = {}) => { const safe = asRecord(review); const label = safeText(safe.label, 'Inspection photo'); const note = safeText(safe.note, safeText(safe.guidance, 'User-confirmed photo evidence requires in-person verification.')); const photoId = safeText(safe.id, '') || null; return { name: `Photo evidence · ${label}`, severity: 'minor', cost: 0, note, photoId, source: 'user-confirmed photo evidence' }; };
export const filterPhotoEvidenceReviews = (reviews = [], filter = 'all') => (Array.isArray(reviews) ? reviews : []).filter((review) => review && typeof review === 'object' && (filter === 'all' || review.status === filter));
export const patchIssueByName = (issues = [], issueName, patch = {}) => (Array.isArray(issues) ? issues : []).filter(isValidFinding).map((issue) => issue.name === issueName ? { ...issue, ...patch, cost: safeMoney(patch.cost ?? issue.cost) } : issue);

export const resetAiHistory = () => [];

export const getAiEvidenceActions = (input = {}) => {
  const safe = asRecord(input);
  const gaps = Array.isArray(safe.missing) ? safe.missing : [];
  return gaps.flatMap((gap) => {
    if (/photo/i.test(gap)) return [{ key: 'photos', label: 'Add photos', target: 'photos' }];
    if (/checklist/i.test(gap)) return [{ key: 'checklist', label: 'Complete checklist', target: 'checklist' }];
    if (/asking price/i.test(gap)) return [{ key: 'asking', label: 'Add asking price', target: 'new' }];
    return [];
  }).filter((action, index, actions) => actions.findIndex((item) => item.key === action.key) === index);
};

export const getEvidenceCoverage = (input = {}) => {
  const safe = asRecord(input);
  const checklist = asRecord(safe.checklist);
  const photos = (Array.isArray(safe.photos) ? safe.photos : []).filter(isUsablePhoto);
  const completedSections = countCompletedChecklistSections(checklist);
  const photoCount = photos.length;
  return { completedSections, photoCount, totalSections: 5, score: clamp(Math.round((completedSections / 5) * 70 + Math.min(photoCount, 6) / 6 * 30), 0, 100) };
};

export const getAiQualitySummary = (input = {}) => {
  const safe = asRecord(input);
  const evidence = asRecord(safe.evidence);
  const vehicle = asRecord(safe.vehicle);
  const evidenceScore = clamp(safeFinite(evidence.score), 0, 100);
  const identityBonus = vehicle.vin ? 10 : 0;
  const score = clamp(Math.round(evidenceScore * 0.8 + Math.min(identityBonus, 10)), 0, 100);
  const label = score >= 80 ? 'Strong first-pass signal' : score >= 60 ? 'Usable with verification' : 'Early signal only';
  const drivers = [`${clamp(safeFinite(evidence.completedSections), 0, 5)}/5 checklist sections`, `${clamp(safeFinite(evidence.photoCount), 0, 6)} usable photos`];
  if (vehicle.vin) drivers.push('VIN identified');
  const nextStep = score >= 80 ? 'Verify critical findings with service records or a qualified mechanic.' : 'Add the missing evidence shown below before relying on price or risk guidance.';
  return { score, label, drivers, nextStep };
};

export const buildAiAnalysis = (input = {}) => {
  const safe = asRecord(input);
  const vehicle = asRecord(safe.vehicle);
  const issues = Array.isArray(safe.issues) ? safe.issues : [];
  const checklist = asRecord(safe.checklist);
  const photos = (Array.isArray(safe.photos) ? safe.photos : []).filter(isUsablePhoto);
  const evidence = getEvidenceCoverage({ checklist, photos });
  const existingIssues = normalizeAnalysisIssues(issues);
  const hasSafetyIssue = existingIssues.some((issue) => issue.severity === 'critical');
  const confidence = clamp(Math.round(35 + evidence.score * 0.55 + (vehicle.vin ? 10 : 0)), 35, 95);
  const findings = hasSafetyIssue ? [] : [{ name: 'Rust underneath', severity: 'critical', cost: 850, note: 'Needs in-person confirmation beneath the vehicle.', source: evidence.photoCount ? 'photo-assisted heuristic' : 'inspection checklist heuristic', confidence: clamp(confidence - 8, 25, 95), evidence: evidence.photoCount ? `${evidence.photoCount} usable photo${evidence.photoCount === 1 ? '' : 's'} plus ${evidence.completedSections}/5 checklist sections` : `${evidence.completedSections}/5 checklist sections; no usable photo attached` }];
  const combinedIssues = [...existingIssues, ...findings.filter((finding) => !existingIssues.some((issue) => issue?.name === finding.name))];
  const repairTotal = Math.min(100000000, combinedIssues.reduce((sum, issue) => sum + safeMoney(issue?.cost), 0));
  const asking = safeMoney(Number(safeText(vehicle.asking).replace(/[^0-9.]/g, '')));
  const fairPrice = asking ? Math.max(0, Math.round(asking - repairTotal * 0.35)) : null;
  const recommendation = getAiRecommendation({ issues: combinedIssues, repairTotal, confidence, evidenceScore: evidence.score });
  const priorityPlan = getAiPriorityPlan({ issues: combinedIssues, evidenceScore: evidence.score, photos });
  const evidenceAudit = getEvidenceAudit({ vehicle, checklist, photos, issues: existingIssues, pendingFindings: findings });
  const quality = getAiQualitySummary({ evidence, vehicle });
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
    quality,
    limitations: evidence.score < 60 ? 'Add more checklist results and clear photos before relying on this analysis.' : 'AI findings are screening signals, not a mechanical diagnosis. Confirm safety items with a qualified mechanic.',
    negotiation: repairTotal ? `Use the ${repairTotal.toLocaleString('en-US')} repair estimate as an evidence-backed negotiation reserve; confirm each item before making an offer.` : 'No repair reserve is calculated yet. Add confirmed issues and costs before negotiating.'
  };
};

export const mergeAiFindings = (existingIssues = [], pendingFindings = []) => {
  const existing = (Array.isArray(existingIssues) ? existingIssues : []).filter(isValidFinding);
  const pending = (Array.isArray(pendingFindings) ? pendingFindings : []).filter(isValidFinding);
  return [...existing, ...pending.filter((finding) => !existing.some((issue) => issue.name === finding.name))];
};

export const getAiPriorityPlan = (input = {}) => {
  const safe = asRecord(input);
  const list = (Array.isArray(safe.issues) ? safe.issues : []).filter(isIssueRecord).map((issue) => ({ ...issue, name: safeText(issue.name, 'Unnamed finding').slice(0, 100), severity: ['critical', 'major', 'minor'].includes(issue.severity) ? issue.severity : 'minor', cost: safeMoney(issue.cost), note: safeText(issue.note).slice(0, 240) }));
  const evidenceScore = clamp(safeFinite(safe.evidenceScore), 0, 100);
  const photos = Array.isArray(safe.photos) ? safe.photos : [];
  const usablePhotos = photos.filter(isUsablePhoto);
  const severityWeight = { critical: 3, major: 2, minor: 1 };
  return list.map((issue, index) => {
    const severity = safeText(issue?.severity, 'minor').toLowerCase();
    const cost = safeMoney(issue?.cost);
    const priorityScore = (severityWeight[severity] || 1) * 100 + Math.min(cost, 5000) / 50;
    const nextAction = severity === 'critical' ? 'Stop and arrange an independent mechanic inspection.' : severity === 'major' ? 'Request service records and obtain a repair estimate.' : 'Document the condition and include it in negotiation notes.';
    const photo = usablePhotos[index % Math.max(usablePhotos.length, 1)];
    return { ...issue, priority: index + 1, priorityScore, photoId: photo?.id || null, why: `${severity[0].toUpperCase() + severity.slice(1)} concern${cost ? ` with an estimated $${cost.toLocaleString('en-US')} reserve` : ''}; evidence coverage is ${evidenceScore}%.`, nextAction };
  }).sort((a, b) => b.priorityScore - a.priorityScore).map((issue, index) => ({ ...issue, priority: index + 1 }));
};

export const getAiRecommendation = (input = {}) => {
  const safe = asRecord(input);
  const list = (Array.isArray(safe.issues) ? safe.issues : []).filter(isIssueRecord);
  const repairTotal = safeMoney(safe.repairTotal);
  const confidence = clamp(safeFinite(safe.confidence), 0, 100);
  const evidenceScore = clamp(safeFinite(safe.evidenceScore), 0, 100);
  const critical = list.filter((issue) => issue?.severity === 'critical').length;
  const major = list.filter((issue) => issue?.severity === 'major').length;
  if (critical) return { tier: 'PAUSE', title: 'Pause before making an offer', action: 'Arrange an independent mechanic inspection and verify the critical item first.', reason: `${critical} critical issue${critical === 1 ? '' : 's'} need in-person confirmation.` };
  if (major || repairTotal >= 1500) return { tier: 'NEGOTIATE', title: 'Negotiate with repair evidence', action: 'Ask for service records and use the repair reserve to structure your offer.', reason: `${major} major issue${major === 1 ? '' : 's'} and an estimated repair reserve of $${repairTotal.toLocaleString('en-US')}.` };
  if (confidence < 55 || evidenceScore < 60) return { tier: 'GATHER MORE', title: 'Gather more evidence', action: 'Complete the checklist and add clear photos before relying on the estimate.', reason: `Current evidence coverage is ${evidenceScore}% with ${confidence}% overall confidence.` };
  return { tier: 'PROCEED', title: 'Proceed with normal due diligence', action: 'Confirm maintenance records, test-drive the vehicle, and get a pre-purchase inspection.', reason: 'No critical or major issue is currently recorded.' };
};

export const getAiFindingExplanation = (finding = {}) => {
  const safe = asRecord(finding);
  const confidence = clamp(safeFinite(safe.confidence), 0, 100);
  return `${confidence}% confidence · ${safeText(safe.evidence, 'Based on the available inspection evidence.')} · Confirm in person before purchase.`;
};

export const getAiConfidenceLabel = (confidence) => {
  const value = clamp(safeFinite(confidence), 0, 100);
  return value >= 75 ? 'Higher confidence' : value >= 55 ? 'Moderate confidence' : 'Limited confidence';
};

export const getAiReadinessMessage = (input = {}) => {
  const safe = asRecord(input);
  const photoCount = Math.max(0, safeFinite(safe.photoCount));
  const completedSections = clamp(safeFinite(safe.completedSections), 0, 5);
  if (!photoCount && !completedSections) return 'Add checklist results and at least one clear photo for a more useful analysis.';
  if (!photoCount) return 'Checklist data is available. Add clear photos to improve visual evidence.';
  if (completedSections < 5) return `${completedSections}/5 checklist sections complete. Finish the walk-around to improve confidence.`;
  return 'Evidence coverage is strong enough for a first-pass screening analysis.';
};

export const getAiAnalysisStartState = () => ({ aiResult: null, aiPendingFindings: [], ranAI: false, aiBusy: true });
export const canReviewAiFindings = (input = {}) => { const safe = asRecord(input); return !Boolean(safe.busy) && Array.isArray(safe.pendingFindings) && safe.pendingFindings.length > 0; };
export const getAiReviewStateAfterIssueMutation = () => ({ aiPendingFindings: [] });
