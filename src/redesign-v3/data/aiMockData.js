import { ALL_DEMO_VEHICLES } from './demoCatalog.js';

const severityRank = { cosmetic: 1, minor: 2, moderate: 3, major: 4, critical: 5 };
const gradeFor = (score) => score < 30 ? 'A' : score < 55 ? 'B' : score < 75 ? 'C' : score < 90 ? 'D' : 'F';
const recommendationFor = (score) => score < 35 ? 'strong_buy' : score < 55 ? 'buy' : score < 75 ? 'consider' : score < 90 ? 'caution' : 'avoid';
const riskLevelFor = (score) => score < 40 ? 'low' : score < 65 ? 'moderate' : score < 80 ? 'elevated' : 'high';

function detectionFromFinding(finding, index) {
  const severity = finding.severity || 'minor';
  const severityOffset = (severityRank[severity] || 2) * 0.04;
  return {
    id: `det-${index + 1}-${finding.subcategory || 'finding'}`,
    class: finding.subcategory || finding.category || 'condition_signal',
    severity,
    confidence: Math.max(0.7, Math.min(0.99, Number(finding.confidence || 0.84))),
    boundingBox: { x: Number((0.12 + index * 0.17).toFixed(2)), y: Number((0.18 + severityOffset).toFixed(2)), width: 0.12, height: 0.08 },
    location: finding.location || 'Vehicle exterior',
    description: finding.description,
    repairEstimateLow: finding.estimatedCostLow || 0,
    repairEstimateHigh: finding.estimatedCostHigh || 0,
    evidenceImageIndex: finding.evidenceCount ? index : -1,
    modelNotes: `${severity === 'critical' || severity === 'major' ? 'Prioritize professional verification. ' : ''}AI estimate only; confirm in person before purchase.`,
  };
}

function createPhotoDetection(vehicle) {
  const findings = vehicle.inspectionSummary.demoFindings || [];
  const score = vehicle.inspectionSummary.riskScore;
  return {
    vehicleId: vehicle.id,
    analyzedAt: vehicle.updatedAt,
    modelVersion: 'carwise-vision-2.3.1-mock',
    processingTimeMs: 3200 + findings.length * 420,
    imageCount: Math.max(6, findings.length * 3),
    detections: findings.map(detectionFromFinding),
    overallAssessment: {
      conditionGrade: gradeFor(score),
      summary: `${vehicle.year} ${vehicle.make} ${vehicle.model} presents as ${score < 55 ? 'above average' : score < 75 ? 'typical for its age and mileage' : 'below average'} based on the available evidence.`,
      comparedToSegment: score < 45 ? 'above_average' : score < 70 ? 'average' : 'below_average',
      confidence: 0.82,
    },
    imageQualityNotes: ['Mock analysis generated offline', 'Findings require human confirmation', 'Coverage reflects the available demo evidence'],
  };
}

function createNarrative(vehicle) {
  const summary = vehicle.inspectionSummary.inspectorNotes;
  const score = vehicle.inspectionSummary.riskScore;
  return {
    vehicleId: vehicle.id,
    generatedAt: vehicle.updatedAt,
    headline: `${vehicle.year} ${vehicle.make} ${vehicle.model}: ${score < 55 ? 'a promising candidate with manageable items' : 'review the repair budget before committing'}`,
    paragraphs: [
      { heading: 'Overall impression', body: `${vehicle.year} ${vehicle.make} ${vehicle.model} is listed at $${vehicle.askingPrice.toLocaleString()} with ${vehicle.mileage.toLocaleString()} miles. ${summary}` },
      { heading: 'Evidence review', body: `The inspection contains ${vehicle.inspectionSummary.demoFindings.length} documented finding${vehicle.inspectionSummary.demoFindings.length === 1 ? '' : 's'}, with an estimated repair range of $${vehicle.inspectionSummary.totalRepairLow.toLocaleString()}-$${vehicle.inspectionSummary.totalRepairHigh.toLocaleString()}.` },
      { heading: 'Value assessment', body: `The asking price is ${vehicle.askingPrice <= vehicle.marketData.marketAverage ? 'at or below' : 'above'} the local market average of $${vehicle.marketData.marketAverage.toLocaleString()}. Use the findings as evidence, not as a substitute for an independent inspection.` },
      { heading: 'Recommendation', body: score < 55 ? 'Proceed with normal due diligence and confirm the remaining service records.' : 'Request an independent mechanical inspection and price the unresolved items before making an offer.' },
    ],
    overallRating: Math.max(0, 100 - score),
    recommendation: recommendationFor(score),
  };
}

function createNegotiation(vehicle) {
  const target = vehicle.inspectionSummary.suggestedOffer;
  const opening = Math.max(0, target - Math.round(vehicle.inspectionSummary.totalRepairHigh * 0.35));
  return {
    vehicleId: vehicle.id,
    askingPrice: vehicle.askingPrice,
    targetPrice: target,
    openingOffer: opening,
    maxPrice: Math.min(vehicle.askingPrice, target + Math.round(vehicle.inspectionSummary.totalRepairLow * 0.25)),
    strategy: `Lead with the documented ${vehicle.inspectionSummary.demoFindings.length} finding${vehicle.inspectionSummary.demoFindings.length === 1 ? '' : 's'} and the local market average. Keep the tone factual and leave room to walk away.`,
    opening: `I like the ${vehicle.year} ${vehicle.make} ${vehicle.model}. Based on the inspection findings and comparable prices, I can offer $${opening.toLocaleString()} and close promptly if the paperwork checks out.`,
    talkingPoints: vehicle.inspectionSummary.demoFindings.map((item) => ({ title: item.title, script: `${item.title} is documented at ${item.location || 'the vehicle'}. I need to account for the estimated $${item.estimatedCostLow.toLocaleString()}-$${item.estimatedCostHigh.toLocaleString()} repair range.`, evidence: `${item.evidenceCount || 0} supporting evidence items; confidence ${Math.round((item.confidence || 0) * 100)}%`, leverage: severityRank[item.severity] >= 4 ? 'high' : severityRank[item.severity] >= 3 ? 'medium' : 'low' })),
    objectionHandling: [{ objection: 'The price already reflects the condition.', response: `I understand. I am using the documented repair range of $${vehicle.inspectionSummary.totalRepairLow.toLocaleString()}-$${vehicle.inspectionSummary.totalRepairHigh.toLocaleString()} and the local market average to make a specific, fair offer.` }],
    closingLines: [`If we agree at $${target.toLocaleString()}, I am ready to complete the next step today.`],
    walkAwayThreshold: vehicle.inspectionSummary.suggestedOffer + Math.round(vehicle.inspectionSummary.totalRepairLow * 0.25),
    warningSignsToWatch: ['Seller refuses an independent inspection', 'Title or odometer records do not match', 'Seller pressures an immediate decision'],
  };
}

function createMaintenance(vehicle) {
  const dueInMiles = Math.max(0, 60000 - vehicle.mileage);
  const repair = vehicle.inspectionSummary.totalRepairHigh;
  return {
    vehicleId: vehicle.id,
    generatedAt: vehicle.updatedAt,
    nextServiceDue: { service: 'Inspection findings and routine service review', dueAtMiles: vehicle.mileage + dueInMiles, dueInMiles, estimatedCost: Math.round(repair / 2), priority: repair > 2500 ? 'urgent' : repair > 800 ? 'soon' : 'routine' },
    upcoming: vehicle.inspectionSummary.demoFindings.map((item) => ({ service: item.title, dueAtMiles: vehicle.mileage, dueInMiles: 0, estimatedCostLow: item.estimatedCostLow, estimatedCostHigh: item.estimatedCostHigh, priority: severityRank[item.severity] >= 4 ? 'urgent' : severityRank[item.severity] >= 3 ? 'soon' : 'routine', notes: item.recommendedAction })),
    fiveYearProjection: { totalCost: repair * 2, breakdown: [1, 2, 3, 4, 5].map((year) => ({ year, cost: Math.round(repair * (year === 1 ? 0.8 : 0.3)), majorItems: year === 1 ? vehicle.inspectionSummary.demoFindings.map((item) => item.title).slice(0, 3) : ['Routine service', 'Wear-item review'] })) },
    reliabilityRating: Math.max(20, 100 - vehicle.inspectionSummary.riskScore),
    knownIssues: vehicle.inspectionSummary.demoFindings.map((item) => item.title),
    aiNotes: 'This is an offline projection based on the demo inspection. Confirm service intervals in the manufacturer schedule.',
  };
}

function createRiskExplanation(vehicle) {
  const score = vehicle.inspectionSummary.riskScore;
  return {
    vehicleId: vehicle.id,
    riskScore: score,
    riskLevel: riskLevelFor(score),
    primaryConcerns: vehicle.inspectionSummary.demoFindings.map((item) => ({ title: item.title, impact: Math.round(score / Math.max(1, vehicle.inspectionSummary.demoFindings.length)), description: item.description, mitigation: item.recommendedAction })),
    positives: [{ title: 'Market evidence available', impact: -5, description: `${vehicle.marketData.sampleSize} comparable listings inform the estimate.` }, { title: 'Inspection record captured', impact: -5, description: 'The demo includes documented findings and repair ranges.' }],
    comparisonToSegment: { betterThan: Math.max(0, 100 - score), sameAs: Math.min(60, score), worseThan: Math.max(0, score - 35), notes: 'Percentages are illustrative demo context, not a certified market statistic.' },
    buyerProfileRecommendation: { bestFit: score < 55 ? 'Buyer seeking a documented vehicle with manageable follow-up.' : 'Experienced buyer with room for repairs and an independent inspection budget.', avoid: score >= 80 ? 'Buyers who need predictable ownership costs immediately.' : 'Buyers unwilling to verify condition independently.' },
  };
}

function createChatScenarios(vehicle) {
  const target = vehicle.inspectionSummary.suggestedOffer;
  return [{ trigger: 'Is this car worth buying?', keywords: ['worth', 'buy', 'recommend'], response: `${vehicle.make} ${vehicle.model} is worth considering at the right price. The suggested offer is $${target.toLocaleString()}, subject to an independent inspection.`, evidence: [`Risk score: ${vehicle.inspectionSummary.riskScore}/100`, `Repair estimate: $${vehicle.inspectionSummary.totalRepairLow.toLocaleString()}-$${vehicle.inspectionSummary.totalRepairHigh.toLocaleString()}`], followUps: ['What should I offer?', 'What should I ask the seller?'] }, { trigger: 'What should I offer?', keywords: ['offer', 'price', 'negotiate'], response: `Open near $${Math.max(0, target - 1000).toLocaleString()} and keep $${target.toLocaleString()} as the evidence-backed target.`, evidence: ['Negotiation script ready', `Market average: $${vehicle.marketData.marketAverage.toLocaleString()}`], followUps: ['Show me the negotiation script', 'What is my walk-away price?'] }];
}

const byVehicle = (factory) => Object.fromEntries(ALL_DEMO_VEHICLES.map((vehicle) => [vehicle.id, factory(vehicle)]));

export const AI_PHOTO_DETECTIONS = byVehicle(createPhotoDetection);
export const AI_CONDITION_NARRATIVES = byVehicle(createNarrative);
export const AI_NEGOTIATION_SCRIPTS = byVehicle(createNegotiation);
export const AI_MAINTENANCE_PREDICTIONS = byVehicle(createMaintenance);
export const AI_RISK_EXPLANATIONS = byVehicle(createRiskExplanation);
export const AI_CHAT_SCENARIOS = byVehicle(createChatScenarios);
export const AI_MARKET_INSIGHTS = byVehicle((vehicle) => ({ vehicleId: vehicle.id, generatedAt: vehicle.updatedAt, headline: `${vehicle.make} ${vehicle.model} market position`, insight: `This listing is ${vehicle.askingPrice <= vehicle.marketData.marketAverage ? 'at or below' : 'above'} the local market average based on ${vehicle.marketData.sampleSize} comparables.`, supportingData: [{ label: 'Market average', value: `$${vehicle.marketData.marketAverage.toLocaleString()}`, trend: vehicle.marketData.trend30Day > 0 ? 'up' : 'down' }, { label: 'Days on market', value: `${vehicle.marketData.daysOnMarket} days`, trend: 'flat' }], buyerAdvice: 'Use the inspection evidence and comparable listings together when negotiating.', bestTimeToBuy: vehicle.marketData.daysOnMarket > 30 ? 'Now, while the listing has aged.' : 'After the listing passes its local average days on market.', negotiationWindow: vehicle.marketData.trend30Day < 0 ? 'strong' : vehicle.marketData.trend30Day > 2 ? 'weak' : 'neutral' }));

export const AI_BUYER_GUIDES = [
  { id: 'guide-negotiation-basics', title: 'Negotiating Your First Used Car Purchase', category: 'negotiation', readTimeMinutes: 8, content: [{ heading: 'Know the market', body: 'Use comparable listings and days on market before making an offer.', tips: ['Set a walk-away price', 'Use documented repair estimates', 'Offer a quick, clean close'] }, { heading: 'Verify the evidence', body: 'AI estimates are conversation starters. Confirm safety and mechanical findings independently.', tips: ['Ask for service records', 'Request a cold start', 'Use an independent inspection'] }] },
  { id: 'guide-inspection-checklist', title: 'The Used Car Inspection Checklist', category: 'inspection', readTimeMinutes: 12, content: [{ heading: 'Exterior', body: 'Check paint mismatch, panel gaps, tires, lights, glass, wheels, and leaks.', tips: ['Inspect in daylight', 'Photograph every concern', 'Measure tire tread'] }, { heading: 'Test drive', body: 'Drive long enough to test braking, steering, shifting, HVAC, and warning lights.', tips: ['Start cold', 'Include highway speed', 'Check for leaks after parking'] }] },
];

export function getAiMockBundle(vehicleId) {
  const bundle = { photoDetection: AI_PHOTO_DETECTIONS[vehicleId], narrative: AI_CONDITION_NARRATIVES[vehicleId], negotiation: AI_NEGOTIATION_SCRIPTS[vehicleId], maintenance: AI_MAINTENANCE_PREDICTIONS[vehicleId], risk: AI_RISK_EXPLANATIONS[vehicleId], chat: AI_CHAT_SCENARIOS[vehicleId], market: AI_MARKET_INSIGHTS[vehicleId], buyerGuides: AI_BUYER_GUIDES };
  return bundle.photoDetection ? bundle : null;
}