export function buildAiAnalysis() {
  return { summary: 'AI analysis unavailable', findings: [] };
}

export function buildOfflineFallbackAnalysis() {
  return { summary: 'Offline fallback analysis', findings: [] };
}

export function getAiConfidenceLabel() {
  return 'Low confidence';
}

export function getAiFindingExplanation() {
  return 'AI finding explanation unavailable';
}

export function getAiReadinessMessage() {
  return 'AI analysis not available';
}

export function getAiEvidenceActions() {
  return [];
}

export function getPhotoEvidenceReview() {
  return { findings: [] };
}

export function buildPhotoFindingDraft() {
  return { name: '', severity: 'minor', cost: 0, note: '' };
}

export function updatePhotoReview() {
  return { findings: [] };
}

export function mergeAiFindings() {
  return [];
}

export function resetAiHistory() {
  return [];
}

export function getAiAnalysisStartState() {
  return { busy: false, findings: [] };
}

export function canReviewAiFindings() {
  return false;
}

export function getAiReviewStateAfterIssueMutation() {
  return { findings: [] };
}
