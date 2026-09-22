import { countChecklist, DEMO_FINDINGS, DEMO_MARKET, riskFromIssues, riskLabel, sumRepairCosts } from './data';

export function buildRedesignData({ vehicle, issues = [], checklist = {}, photos = [], aiResult, aiPendingFindings = [], aiBusy = false, savedInspections = [], marketComparison, settings = {}, toolNotes = {}, reportReadiness, retryQueueCount = 0, recoveryLog = [], userName, userEmail, plan } = {}) {
  const fallbackVehicle = vehicle?.year || vehicle?.make || vehicle?.model ? {
    ...vehicle,
    name: vehicle.name || [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') || 'Vehicle',
  } : null;
  const normalizedIssues = Array.isArray(issues) ? issues : [];
  const rawFindings = aiResult?.findings?.length ? aiResult.findings : (aiPendingFindings?.length ? aiPendingFindings : DEMO_FINDINGS);
  const findings = rawFindings.map((finding) => ({
    ...finding,
    confidence: Number(finding.confidence) > 1 ? Number(finding.confidence) / 100 : Number(finding.confidence || 0),
    confidencePct: Math.round((Number(finding.confidence) > 1 ? Number(finding.confidence) / 100 : Number(finding.confidence || 0)) * 100),
    tone: finding.tone || (finding.severity === 'critical' || finding.severity === 'major' ? 'coral' : 'amber'),
  }));
  const repairTotal = sumRepairCosts(normalizedIssues.length ? normalizedIssues : findings.map((item) => ({ cost: ((item.costLow || 0) + (item.costHigh || 0)) / 2 })));
  const riskScore = normalizedIssues.length ? riskFromIssues(normalizedIssues) : Number(aiResult?.riskScore ?? 32);
  const progress = Math.min(100, Math.round((countChecklist(checklist) / 25) * 100));
  return {
    vehicle: fallbackVehicle,
    heroImage: photos?.find((item) => item?.uri)?.uri || vehicle?.heroImage || null,
    photos,
    issues: normalizedIssues,
    findings,
    checklist,
    progress,
    riskScore,
    risk: { score: riskScore, label: riskLabel(riskScore), tone: riskScore >= 55 ? 'coral' : riskScore >= 30 ? 'amber' : 'mint' },
    riskLabel: riskLabel(riskScore),
    repairTotal,
    aiResult,
    aiConfidence: Number(aiResult?.confidence ?? findings[0]?.confidence ?? 0.86) > 1 ? Number(aiResult?.confidence ?? findings[0]?.confidence ?? 0.86) / 100 : Number(aiResult?.confidence ?? findings[0]?.confidence ?? 0.86),
    aiBusy,
    aiStage: aiBusy ? 2 : 4,
    savedInspections,
    history: (Array.isArray(savedInspections) ? savedInspections : []).map((item, index) => {
      const savedVehicle = item?.vehicle || {};
      const savedIssues = Array.isArray(item?.issues) ? item.issues : [];
      return {
        ...item,
        id: item?.id || `history-${index}`,
        name: savedVehicle.name || [savedVehicle.year, savedVehicle.make, savedVehicle.model].filter(Boolean).join(' ') || 'Saved vehicle',
        year: savedVehicle.year || '',
        mileage: savedVehicle.mileage || '',
        asking: savedVehicle.asking || '',
        risk: riskFromIssues(savedIssues),
      };
    }),
    market: normalizeMarket(marketComparison),
    settings,
    toolNotes,
    reportReadiness,
    retryQueueCount,
    recoveryLog,
    userName,
    userEmail,
    plan,
    hasRecoveryNotice: Boolean(recoveryLog?.length),
    recoveryNotice: recoveryLog?.length ? recoveryLog[recoveryLog.length - 1]?.detail : '',
    inspectionId: 'CW-2026-0922-01',
    certificateHash: '9B4C…A13F',
  };
}

function normalizeMarket(value) {
  return {
    ...DEMO_MARKET,
    ...(value || {}),
    comparables: value?.comparables?.length ? value.comparables : DEMO_MARKET.comparables,
  };
}

export const ROUTE_ALIASES = {
  home: 'home',
  new: 'new',
  checklist: 'inspection',
  photos: 'media',
  'photo-evidence': 'media',
  ai: 'ai',
  summary: 'summary',
  market: 'market',
  vin: 'vin',
  history: 'history',
  'saved-detail': 'report',
  report: 'report',
  negotiation: 'negotiation',
  cost: 'cost',
  test: 'test',
  maintenance: 'maintenance',
  'history-tool': 'vehicle-history',
  compare: 'compare',
  settings: 'settings',
  certificate: 'certificate',
  onboarding: 'onboarding',
  paywall: 'paywall',
  notifications: 'notifications',
  contract: 'contract',
  garage: 'garage',
  'inspection-detail': 'inspection-detail',
  'evidence-review': 'evidence-review',
  'market-explorer': 'market-explorer',
  profile: 'profile',
  share: 'share',
  demo: 'demo',
  'design-system': 'design-system',
  'visual-states': 'visual-states',
  showcase: 'showcase',
  'camera-studio': 'camera-studio',
  'report-composer': 'report-composer',
};

export function resolveRedesignRoute(screen) {
  return ROUTE_ALIASES[screen] || 'home';
}
