export function createNewInspectionState() {
  return {
    vehicle: { year: '', make: '', model: '', mileage: '', vin: '', asking: '' },
    issues: [],
    checklist: {},
    photos: [],
  };
}

export function normalizeActiveInspection({ vehicle = {}, issues = [], checklist = {}, photos = [] } = {}) {
  const safeVehicle = vehicle && typeof vehicle === 'object' && !Array.isArray(vehicle) ? {
    year: String(vehicle.year || '').slice(0, 4), make: String(vehicle.make || '').trim().slice(0, 60), model: String(vehicle.model || '').trim().slice(0, 80), mileage: String(vehicle.mileage || '').slice(0, 20), vin: normalizeVin(vehicle.vin || ''), asking: String(vehicle.asking || '').slice(0, 30),
  } : createNewInspectionState().vehicle;
  const safeIssues = (Array.isArray(issues) ? issues : []).filter((issue) => issue && typeof issue === 'object').map((issue, index) => ({ id: typeof issue.id === 'string' ? issue.id : `restored-issue-${index + 1}`, name: String(issue.name || 'Unnamed finding').trim().slice(0, 100), severity: ['critical', 'major', 'minor'].includes(issue.severity) ? issue.severity : 'minor', cost: Math.max(0, Number(issue.cost) || 0), note: typeof issue.note === 'string' ? issue.note.slice(0, 240) : '', photoId: typeof issue.photoId === 'string' ? issue.photoId : undefined })).filter((issue) => issue.name);
  const safeChecklist = checklist && typeof checklist === 'object' && !Array.isArray(checklist) ? Object.fromEntries(Object.entries(checklist).filter(([key, value]) => typeof key === 'string' && typeof value === 'boolean').slice(0, 20)) : {};
  return { vehicle: safeVehicle, issues: safeIssues.slice(0, 80), checklist: safeChecklist, photos: Array.isArray(photos) ? photos : [] };
}

export function getDerivedInspectionResetState() {
  return { ranAI: false, reportPreview: '' };
}

export function getNewInspectionTransientResetState() {
  return {
    ranAI: false,
    aiResult: null,
    aiPendingFindings: [],
    aiHistory: [],
    toolNotes: {},
    customFindingVisible: false,
    customFindingError: '',
    editingIssue: null,
    historyConfirm: null,
    undoItem: null,
    findingUndoItem: null,
    noteUndoItem: null,
    selectedSavedInspection: null,
    selectedPhoto: null,
    reportPreview: '',
    reportSections: { summary: true, evidence: false },
    reportAction: '',
    reportBusy: false,
    reportRetry: false,
    reportRetryKind: '',
    saveRetry: false,
  };
}

export function isSameIssue(issue = {}, target = {}) {
  if (issue === target) return true;
  return Boolean(issue.id && target.id && issue.id === target.id);
}

export function normalizeVin(value = '') {
  return String(value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 17);
}

export function isValidVin(value = '') {
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(normalizeVin(value));
}

export function getRepairTotal(issues = []) {
  const list = Array.isArray(issues) ? issues : [];
  return list.reduce((total, issue) => total + Math.max(0, Number(issue?.cost) || 0), 0);
}

export function getRiskScore(issues = []) {
  const weights = { critical: 34, major: 20, minor: 8 };
  const list = Array.isArray(issues) ? issues : [];
  return Math.min(100, list.reduce((score, issue) => score + (weights[issue?.severity] || 0), 0));
}
