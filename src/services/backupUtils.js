import { normalizeMarketComparison } from './marketUtils.js';

const BACKUP_VERSION = 1;
const NOTE_TYPES = ['market', 'history', 'test'];
const MAX_COLLECTION_ITEMS = 80;

const isUsableBackupPayload = (raw) => { if (typeof raw !== 'string' || !raw.trim()) return false; try { const parsed = JSON.parse(raw); return parsed?.app === 'carwise' && parsed?.version === BACKUP_VERSION; } catch (_) { return false; } };
export const selectInspectionRestorePayload = (primaryPayload, pendingPayload) => [pendingPayload, primaryPayload].find(isUsableBackupPayload) || [pendingPayload, primaryPayload].find((payload) => typeof payload === 'string' && payload.trim()) || null;
const isRecord = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const normalizeNoteType = (type) => NOTE_TYPES.includes(type) ? type : null;
const normalizeNote = (value) => typeof value === 'string' ? value.trim().slice(0, 1000) : '';
const normalizeSource = (value) => typeof value === 'string' && value.trim() ? value.trim().slice(0, 80) : 'User-entered observation';
const normalizeTimestamp = (value) => typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? value : null;
const filterRecords = (value, limit = MAX_COLLECTION_ITEMS) => Array.isArray(value) ? value.filter(isRecord).slice(0, limit) : [];
const filterRecentRecords = (value, limit = 6) => Array.isArray(value) ? value.filter(isRecord).slice(-limit) : [];
const normalizeToolNotes = (toolNotes) => {
  if (!isRecord(toolNotes)) return {};
  return Object.fromEntries(Object.entries(toolNotes)
    .filter(([key, value]) => NOTE_TYPES.includes(key) && (typeof value === 'string' || isRecord(value)))
    .map(([key, value]) => {
      const note = normalizeNote(typeof value === 'string' ? value : value.note);
      return [key, { note, savedAt: typeof value === 'string' ? null : normalizeTimestamp(value.savedAt), source: typeof value === 'string' ? 'User-entered observation' : normalizeSource(value.source) }];
    })
    .filter(([, value]) => value.note));
};

export const upsertToolNote = (toolNotes, type, note, savedAt = new Date().toISOString(), source = 'User-entered observation') => {
  const normalizedType = normalizeNoteType(type);
  const next = { ...(isRecord(toolNotes) ? toolNotes : {}) };
  if (!normalizedType) return next;
  next[normalizedType] = { note: normalizeNote(note), savedAt: normalizeTimestamp(savedAt), source: normalizeSource(source) };
  return next;
};
export const removeToolNote = (toolNotes, type) => { const next = { ...(isRecord(toolNotes) ? toolNotes : {}) }; const normalizedType = normalizeNoteType(type); if (normalizedType) delete next[normalizedType]; return next; };
export const getToolNoteEditorState = (toolNotes, type) => { const entry = isRecord(toolNotes) && isRecord(toolNotes[type]) ? toolNotes[type] : null; const note = normalizeNote(entry?.note); const source = normalizeSource(entry?.source); return { note, source, editing: Boolean(note) }; };
export const filterToolNoteTimeline = (timeline, filter = 'all') => Array.isArray(timeline) ? timeline.filter((entry) => isRecord(entry) && (filter === 'all' || entry.key === filter)) : [];
export const filterToolNoteTimelineBySource = (timeline, source = 'all') => Array.isArray(timeline) ? timeline.filter((entry) => isRecord(entry) && (source === 'all' || entry.source === source)) : [];
export const getToolNoteTimeline = (toolNotes) => { const labels = { market: 'Market', history: 'History', test: 'Test drive' }; return Object.entries(normalizeToolNotes(toolNotes)).map(([key, entry]) => ({ key, label: labels[key], note: entry.note, source: entry.source, savedAt: entry.savedAt })).filter((entry) => entry.label).sort((a, b) => (b.savedAt ? Date.parse(b.savedAt) : 0) - (a.savedAt ? Date.parse(a.savedAt) : 0)); };

export const serializeInspectionBackup = (input = {}) => { const safe = isRecord(input) ? input : {}; const { vehicle, issues, checklist, photos, toolNotes = {}, marketComparison = {}, savedInspections, aiHistory = [] } = safe; return JSON.stringify({
  app: 'carwise',
  version: BACKUP_VERSION,
  exportedAt: new Date().toISOString(),
  vehicle: isRecord(vehicle) ? vehicle : null,
  issues: filterRecords(issues),
  checklist: isRecord(checklist) ? checklist : {},
  photos: filterRecords(photos),
  toolNotes: normalizeToolNotes(toolNotes),
  marketComparison: normalizeMarketComparison(marketComparison),
  savedInspections: filterRecords(savedInspections),
  aiHistory: filterRecentRecords(aiHistory),
}, null, 2); };

export const parseInspectionBackup = (raw) => {
  if (typeof raw !== 'string' || !raw.trim()) throw new Error('Carwise backup is empty.');
  let parsed;
  try { parsed = JSON.parse(raw); } catch (_) { throw new Error('Carwise backup is not valid JSON.'); }
  if (!parsed || parsed.app !== 'carwise' || parsed.version !== BACKUP_VERSION) throw new Error('Unsupported Carwise backup');
  return {
    vehicle: isRecord(parsed.vehicle) ? parsed.vehicle : null,
    issues: filterRecords(parsed.issues),
    checklist: isRecord(parsed.checklist) ? parsed.checklist : {},
    photos: filterRecords(parsed.photos),
    toolNotes: normalizeToolNotes(parsed.toolNotes),
    marketComparison: normalizeMarketComparison(parsed.marketComparison),
    savedInspections: filterRecords(parsed.savedInspections),
    aiHistory: filterRecentRecords(parsed.aiHistory),
  };
};

export const getBackupMetadata = (input = {}) => {
  const safe = isRecord(input) ? input : {};
  const backup = isRecord(safe.backup) ? safe.backup : {};
  const bytes = new TextEncoder().encode(typeof safe.serialized === 'string' ? safe.serialized : '').length;
  const sizeLabel = bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  const savedInspections = filterRecords(backup.savedInspections);
  const photos = filterRecords(backup.photos);
  const aiHistory = filterRecentRecords(backup.aiHistory);
  return { bytes, sizeLabel, savedInspections: savedInspections.length, activePhotos: photos.length, aiSnapshots: aiHistory.length, exportedAt: normalizeTimestamp(backup.exportedAt) };
};

export const getBackupSummary = (backup = {}) => { const safe = isRecord(backup) ? backup : {}; const savedInspections = filterRecords(safe.savedInspections); const photos = filterRecords(safe.photos); return `${savedInspections.length} saved inspection${savedInspections.length === 1 ? '' : 's'} · ${photos.length} active photo${photos.length === 1 ? '' : 's'}`; };
