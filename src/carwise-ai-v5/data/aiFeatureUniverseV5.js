/**
 * CarWise AI Mock Data V5
 * Purpose: rich, deterministic fixtures for frontend visual development.
 * Replace these fixtures with production API/state selectors during integration.
 */
import { exteriorFixtures } from '../vision/exteriorFixtures';
import { interiorFixtures } from '../vision/interiorFixtures';
import { engineFixtures } from '../vision/engineFixtures';
import { wheelsFixtures } from '../vision/wheelsFixtures';
import { paintFixtures } from '../vision/paintFixtures';
import { glassFixtures } from '../vision/glassFixtures';
import { lightsFixtures } from '../vision/lightsFixtures';
import { undercarriageFixtures } from '../vision/undercarriageFixtures';
import { questionsFixtures } from '../copilot/questionsFixtures';
import { answersFixtures } from '../copilot/answersFixtures';
import { followupsFixtures } from '../copilot/followupsFixtures';
import { seller_promptsFixtures } from '../copilot/seller_promptsFixtures';
import { inspection_promptsFixtures } from '../copilot/inspection_promptsFixtures';
import { price_promptsFixtures } from '../copilot/price_promptsFixtures';
import { safety_promptsFixtures } from '../copilot/safety_promptsFixtures';
import { summariesFixtures } from '../copilot/summariesFixtures';
import { photo_setsFixtures } from '../evidence/photo_setsFixtures';
import { video_clipsFixtures } from '../evidence/video_clipsFixtures';
import { voice_notesFixtures } from '../evidence/voice_notesFixtures';
import { documentsFixtures } from '../evidence/documentsFixtures';
import { timelinesFixtures } from '../evidence/timelinesFixtures';
import { annotationsFixtures } from '../evidence/annotationsFixtures';
import { quality_statesFixtures } from '../evidence/quality_statesFixtures';
import { capture_guidesFixtures } from '../evidence/capture_guidesFixtures';
import { price_bandsFixtures } from '../market/price_bandsFixtures';
import { comparablesFixtures } from '../market/comparablesFixtures';
import { trendsFixtures } from '../market/trendsFixtures';
import { geo_marketsFixtures } from '../market/geo_marketsFixtures';
import { mileage_curvesFixtures } from '../market/mileage_curvesFixtures';
import { deal_signalsFixtures } from '../market/deal_signalsFixtures';
import { valuation_explanationsFixtures } from '../market/valuation_explanationsFixtures';
import { listing_cardsFixtures } from '../market/listing_cardsFixtures';
import { repair_itemsFixtures } from '../repair/repair_itemsFixtures';
import { labor_rangesFixtures } from '../repair/labor_rangesFixtures';
import { parts_rangesFixtures } from '../repair/parts_rangesFixtures';
import { severity_impactsFixtures } from '../repair/severity_impactsFixtures';
import { maintenance_forecastsFixtures } from '../repair/maintenance_forecastsFixtures';
import { repair_scenariosFixtures } from '../repair/repair_scenariosFixtures';
import { cost_waterfallsFixtures } from '../repair/cost_waterfallsFixtures';
import { repair_explanationsFixtures } from '../repair/repair_explanationsFixtures';
import { checklist_statesFixtures } from '../inspection/checklist_statesFixtures';
import { test_driveFixtures } from '../inspection/test_driveFixtures';
import { fluidsFixtures } from '../inspection/fluidsFixtures';
import { tiresFixtures } from '../inspection/tiresFixtures';
import { brakesFixtures } from '../inspection/brakesFixtures';
import { electricalFixtures } from '../inspection/electricalFixtures';
import { safetyFixtures } from '../inspection/safetyFixtures';
import { service_historyFixtures } from '../inspection/service_historyFixtures';
import { confidenceFixtures } from '../trust/confidenceFixtures';
import { uncertaintyFixtures } from '../trust/uncertaintyFixtures';
import { human_reviewFixtures } from '../trust/human_reviewFixtures';
import { audit_eventsFixtures } from '../trust/audit_eventsFixtures';
import { verificationFixtures } from '../trust/verificationFixtures';
import { provenanceFixtures } from '../trust/provenanceFixtures';
import { ai_labelsFixtures } from '../trust/ai_labelsFixtures';
import { disclaimersFixtures } from '../trust/disclaimersFixtures';
import { scan_sequencesFixtures } from '../motion/scan_sequencesFixtures';
import { analysis_sequencesFixtures } from '../motion/analysis_sequencesFixtures';
import { score_animationsFixtures } from '../motion/score_animationsFixtures';
import { chart_animationsFixtures } from '../motion/chart_animationsFixtures';
import { sheet_animationsFixtures } from '../motion/sheet_animationsFixtures';
import { capture_motionFixtures } from '../motion/capture_motionFixtures';
import { success_motionFixtures } from '../motion/success_motionFixtures';
import { error_motionFixtures } from '../motion/error_motionFixtures';
import { journeysFixtures } from '../demo/journeysFixtures';
import { vehiclesFixtures } from '../demo/vehiclesFixtures';
import { personasFixtures } from '../demo/personasFixtures';
import { edge_casesFixtures } from '../demo/edge_casesFixtures';
import { offline_modesFixtures } from '../demo/offline_modesFixtures';
import { permissionsFixtures } from '../demo/permissionsFixtures';
import { subscriptionsFixtures } from '../demo/subscriptionsFixtures';
import { showcase_cardsFixtures } from '../demo/showcase_cardsFixtures';

export const AI_FEATURE_UNIVERSE_V5 = {
  vision: {
    exterior: exteriorFixtures,
    interior: interiorFixtures,
    engine: engineFixtures,
    wheels: wheelsFixtures,
    paint: paintFixtures,
    glass: glassFixtures,
    lights: lightsFixtures,
    undercarriage: undercarriageFixtures,
  },
  copilot: {
    questions: questionsFixtures,
    answers: answersFixtures,
    followups: followupsFixtures,
    seller_prompts: seller_promptsFixtures,
    inspection_prompts: inspection_promptsFixtures,
    price_prompts: price_promptsFixtures,
    safety_prompts: safety_promptsFixtures,
    summaries: summariesFixtures,
  },
  evidence: {
    photo_sets: photo_setsFixtures,
    video_clips: video_clipsFixtures,
    voice_notes: voice_notesFixtures,
    documents: documentsFixtures,
    timelines: timelinesFixtures,
    annotations: annotationsFixtures,
    quality_states: quality_statesFixtures,
    capture_guides: capture_guidesFixtures,
  },
  market: {
    price_bands: price_bandsFixtures,
    comparables: comparablesFixtures,
    trends: trendsFixtures,
    geo_markets: geo_marketsFixtures,
    mileage_curves: mileage_curvesFixtures,
    deal_signals: deal_signalsFixtures,
    valuation_explanations: valuation_explanationsFixtures,
    listing_cards: listing_cardsFixtures,
  },
  repair: {
    repair_items: repair_itemsFixtures,
    labor_ranges: labor_rangesFixtures,
    parts_ranges: parts_rangesFixtures,
    severity_impacts: severity_impactsFixtures,
    maintenance_forecasts: maintenance_forecastsFixtures,
    repair_scenarios: repair_scenariosFixtures,
    cost_waterfalls: cost_waterfallsFixtures,
    repair_explanations: repair_explanationsFixtures,
  },
  inspection: {
    checklist_states: checklist_statesFixtures,
    test_drive: test_driveFixtures,
    fluids: fluidsFixtures,
    tires: tiresFixtures,
    brakes: brakesFixtures,
    electrical: electricalFixtures,
    safety: safetyFixtures,
    service_history: service_historyFixtures,
  },
  trust: {
    confidence: confidenceFixtures,
    uncertainty: uncertaintyFixtures,
    human_review: human_reviewFixtures,
    audit_events: audit_eventsFixtures,
    verification: verificationFixtures,
    provenance: provenanceFixtures,
    ai_labels: ai_labelsFixtures,
    disclaimers: disclaimersFixtures,
  },
  motion: {
    scan_sequences: scan_sequencesFixtures,
    analysis_sequences: analysis_sequencesFixtures,
    score_animations: score_animationsFixtures,
    chart_animations: chart_animationsFixtures,
    sheet_animations: sheet_animationsFixtures,
    capture_motion: capture_motionFixtures,
    success_motion: success_motionFixtures,
    error_motion: error_motionFixtures,
  },
  demo: {
    journeys: journeysFixtures,
    vehicles: vehiclesFixtures,
    personas: personasFixtures,
    edge_cases: edge_casesFixtures,
    offline_modes: offline_modesFixtures,
    permissions: permissionsFixtures,
    subscriptions: subscriptionsFixtures,
    showcase_cards: showcase_cardsFixtures,
  },
};

export const AI_FEATURE_COUNTS_V5 = Object.fromEntries(Object.entries(AI_FEATURE_UNIVERSE_V5).map(([group, values]) => [group, Object.values(values).reduce((sum, list) => sum + list.length, 0)]));
