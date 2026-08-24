export function createNewInspectionState() {
  return {
    vehicle: { year: '', make: '', model: '', mileage: '', vin: '', asking: '' },
    issues: [],
    checklist: {},
    photos: [],
  };
}

const isRecord = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const safeText = (value, maxLength = 240) => typeof value === 'string' ? value.trim().slice(0, maxLength) : typeof value === 'number' && Number.isFinite(value) ? String(value).slice(0, maxLength) : '';
const safePhotoDimension = (value) => { const numeric = Number(value); return Number.isFinite(numeric) ? Math.min(10000, Math.max(0, Math.round(numeric))) : null; };
const safeEmbeddedDataUri = (value) => typeof value === 'string' && /^data:image\/(?:jpeg|jpg|png|webp|gif|heic);base64,[a-z0-9+/=]+$/i.test(value) ? value.slice(0, 200000) : '';
const normalizeActivePhoto = (photo) => {
  if (!isRecord(photo)) return null;
  const normalized = {};
  const id = safeText(photo.id, 80);
  const uri = safeText(photo.uri, 2000);
  const fileName = safeText(photo.fileName, 120);
  const mimeType = safeText(photo.mimeType, 80);
  const note = safeText(photo.note, 240);
  const reviewNote = safeText(photo.reviewNote, 240);
  const embeddedDataUri = safeEmbeddedDataUri(photo.embeddedDataUri);
  const width = safePhotoDimension(photo.width);
  const height = safePhotoDimension(photo.height);
  if (id) normalized.id = id;
  if (uri) normalized.uri = uri;
  if (fileName) normalized.fileName = fileName;
  if (mimeType) normalized.mimeType = mimeType;
  if (note) normalized.note = note;
  if (reviewNote) normalized.reviewNote = reviewNote;
  if (embeddedDataUri) normalized.embeddedDataUri = embeddedDataUri;
  if (width !== null) normalized.width = width;
  if (height !== null) normalized.height = height;
  if (['needs-review', 'reviewed', 'confirmed'].includes(photo.reviewStatus)) normalized.reviewStatus = photo.reviewStatus;
  return Object.keys(normalized).length ? normalized : null;
};

export function normalizeActiveInspection(input = {}) {
  const source = isRecord(input) ? input : {};
  const { vehicle = {}, issues = [], checklist = {}, photos = [] } = source;
  const safeVehicle = isRecord(vehicle) ? {
    year: safeText(vehicle.year, 4),
    make: safeText(vehicle.make, 60),
    model: safeText(vehicle.model, 80),
    mileage: safeText(vehicle.mileage, 20),
    vin: normalizeVin(safeText(vehicle.vin, 30)),
    asking: safeText(vehicle.asking, 30),
  } : createNewInspectionState().vehicle;
  const safeIssues = (Array.isArray(issues) ? issues : [])
    .filter(isRecord)
    .map((issue, index) => {
      const id = safeText(issue.id, 80) || `restored-issue-${index + 1}`;
      const name = safeText(issue.name, 100) || 'Unnamed finding';
      const severityValue = safeText(issue.severity, 20).toLowerCase();
      const numericCost = Number(issue.cost);
      const photoId = safeText(issue.photoId, 80);
      return { id, name, severity: ['critical', 'major', 'minor'].includes(severityValue) ? severityValue : 'minor', cost: Number.isFinite(numericCost) ? Math.max(0, numericCost) : 0, note: safeText(issue.note, 240), ...(photoId ? { photoId } : {}) };
    })
    .filter((issue) => issue.name)
    .slice(0, 80);
  const safeChecklist = isRecord(checklist) ? Object.fromEntries(Object.entries(checklist).filter(([key, value]) => typeof key === 'string' && typeof value === 'boolean').slice(0, 20)) : {};
  const safePhotos = (Array.isArray(photos) ? photos : []).map(normalizeActivePhoto).filter(Boolean).slice(0, 80);
  return { vehicle: safeVehicle, issues: safeIssues, checklist: safeChecklist, photos: safePhotos };
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
