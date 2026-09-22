/**
 * CarWise AI Mock Data V5
 * Purpose: rich, deterministic fixtures for frontend visual development.
 * Replace these fixtures with production API/state selectors during integration.
 */

import { AI_FEATURE_UNIVERSE_V5 } from '../data/aiFeatureUniverseV5';

export const V5_SCENARIO_PRESETS = {
  perfectPhoto: { quality: 'excellent', confidence: 0.96, outcome: 'clear_visual_signal' },
  glareProblem: { quality: 'needs_retry', confidence: 0.54, outcome: 'request_better_angle' },
  mixedEvidence: { quality: 'good', confidence: 0.81, outcome: 'needs_human_confirmation' },
  offline: { quality: 'cached', confidence: null, outcome: 'queue_for_sync' },
  timeout: { quality: 'interrupted', confidence: null, outcome: 'retry_without_reupload' },
  rateLimited: { quality: 'deferred', confidence: null, outcome: 'retry_after_backoff' },
  noReliableSignal: { quality: 'insufficient', confidence: null, outcome: 'request_clearer_evidence' },
  documentReview: { quality: 'partial', confidence: 0.84, outcome: 'human_verify_fields' },
};

export function getV5MockBundle(seed = 3) {
  const pick = (list, offset) => list[(seed + offset) % list.length];
  const photo = pick(AI_FEATURE_UNIVERSE_V5.evidence.photo_sets, 0);
  const video = pick(AI_FEATURE_UNIVERSE_V5.evidence.video_clips, 1);
  const finding = pick(AI_FEATURE_UNIVERSE_V5.vision.exterior, 2);
  const market = pick(AI_FEATURE_UNIVERSE_V5.market.price_bands, 3);
  const repair = pick(AI_FEATURE_UNIVERSE_V5.repair.repair_items, 4);
  return {
    vehicle: photo.vehicle,
    hero: photo,
    evidence: [photo, video],
    finding,
    market,
    repair,
    trust: pick(AI_FEATURE_UNIVERSE_V5.trust.confidence, 5),
    copilot: pick(AI_FEATURE_UNIVERSE_V5.copilot.answers, 6),
    timeline: pick(AI_FEATURE_UNIVERSE_V5.evidence.timelines, 7),
    motion: pick(AI_FEATURE_UNIVERSE_V5.motion.analysis_sequences, 8),
  };
}

export function simulateAiRun(seed = 4) {
  const stages = [
    { key: 'ingest', label: 'Preparing evidence', progress: 0.16 },
    { key: 'vision', label: 'Reviewing vehicle imagery', progress: 0.34 },
    { key: 'crossModal', label: 'Cross-checking photo, voice, and document signals', progress: 0.56 },
    { key: 'market', label: 'Comparing market context', progress: 0.74 },
    { key: 'explain', label: 'Building explainable findings', progress: 0.9 },
    { key: 'complete', label: 'Analysis ready', progress: 1 },
  ];
  return stages.map((stage, index) => ({ ...stage, order: index + 1, seed }));
}
