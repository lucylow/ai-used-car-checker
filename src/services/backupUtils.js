const BACKUP_VERSION = 1;

export const selectInspectionRestorePayload = (primaryPayload, pendingPayload) => pendingPayload || primaryPayload || null;
const isRecord = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value));

export const upsertToolNote = (toolNotes, type, note, savedAt = new Date().toISOString(), source = 'User-entered observation') => ({ ...(isRecord(toolNotes) ? toolNotes : {}), [type]: { note: String(note || '').trim().slice(0, 1000), savedAt, source } });
export const removeToolNote = (toolNotes, type) => { const next = { ...(isRecord(toolNotes) ? toolNotes : {}) }; delete next[type]; return next; };
export const getToolNoteTimeline = (toolNotes) => { const labels = { market: 'Market', history: 'History', test: 'Test drive' }; return Object.entries(labels).map(([key, label]) => { const entry = isRecord(toolNotes?.[key]) ? toolNotes[key] : { note: toolNotes?.[key] }; const note = typeof entry.note === 'string' ? entry.note.trim().slice(0, 1000) : ''; const savedAt = typeof entry.savedAt === 'string' && !Number.isNaN(Date.parse(entry.savedAt)) ? entry.savedAt : null; return note ? { key, label, note, source: typeof entry.source === 'string' && entry.source.trim() ? entry.source.trim().slice(0, 80) : 'User-entered observation', savedAt } : null; }).filter(Boolean).sort((a, b) => (b.savedAt ? Date.parse(b.savedAt) : 0) - (a.savedAt ? Date.parse(a.savedAt) : 0)); };

export const serializeInspectionBackup = ({ vehicle, issues, checklist, photos, toolNotes = {}, savedInspections, aiHistory = [] }) => JSON.stringify({
  app: 'carwise',
  version: BACKUP_VERSION,
  exportedAt: new Date().toISOString(),
  vehicle,
  issues,
  checklist,
  photos,
  toolNotes: toolNotes && typeof toolNotes === 'object' && !Array.isArray(toolNotes) ? Object.fromEntries(Object.entries(toolNotes).filter(([key, value]) => ['market', 'history', 'test'].includes(key) && (typeof value === 'string' || (value && typeof value === 'object'))).map(([key, value]) => { const note = typeof value === 'string' ? value : value.note; return [key, { note: typeof note === 'string' ? note.slice(0, 1000) : '', savedAt: typeof value === 'object' && typeof value.savedAt === 'string' ? value.savedAt : null, source: typeof value === 'object' && typeof value.source === 'string' ? value.source.slice(0, 80) : 'User-entered observation' }]; }).filter(([, value]) => value.note)) : {},
  savedInspections,
  aiHistory: Array.isArray(aiHistory) ? aiHistory.slice(-6) : [],
}, null, 2);

export const parseInspectionBackup = (raw) => {
  if (typeof raw !== 'string' || !raw.trim()) throw new Error('Carwise backup is empty.');
  let parsed;
  try { parsed = JSON.parse(raw); } catch (_) { throw new Error('Carwise backup is not valid JSON.'); }
  if (!parsed || parsed.app !== 'carwise' || parsed.version !== BACKUP_VERSION) throw new Error('Unsupported Carwise backup');
  return {
    vehicle: isRecord(parsed.vehicle) ? parsed.vehicle : null,
    issues: Array.isArray(parsed.issues) ? parsed.issues.filter(isRecord) : [],
    checklist: isRecord(parsed.checklist) ? parsed.checklist : {},
    photos: Array.isArray(parsed.photos) ? parsed.photos.filter(isRecord) : [],
    toolNotes: isRecord(parsed.toolNotes) ? Object.fromEntries(Object.entries(parsed.toolNotes).filter(([key, value]) => ['market', 'history', 'test'].includes(key) && (typeof value === 'string' || isRecord(value))).map(([key, value]) => { const note = typeof value === 'string' ? value : value.note; return [key, { note: typeof note === 'string' ? note.slice(0, 1000) : '', savedAt: isRecord(value) && typeof value.savedAt === 'string' ? value.savedAt : null, source: isRecord(value) && typeof value.source === 'string' ? value.source.slice(0, 80) : 'User-entered observation' }]; }).filter(([, value]) => value.note)) : {},
    savedInspections: Array.isArray(parsed.savedInspections) ? parsed.savedInspections.filter(isRecord) : [],
    aiHistory: Array.isArray(parsed.aiHistory) ? parsed.aiHistory.filter(isRecord).slice(-6) : [],
  };
};

export const getBackupMetadata = ({ backup = {}, serialized = '' } = {}) => {
  const bytes = new TextEncoder().encode(String(serialized)).length;
  const sizeLabel = bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return { bytes, sizeLabel, savedInspections: Array.isArray(backup.savedInspections) ? backup.savedInspections.length : 0, activePhotos: Array.isArray(backup.photos) ? backup.photos.length : 0, aiSnapshots: Array.isArray(backup.aiHistory) ? backup.aiHistory.length : 0, exportedAt: backup.exportedAt || null };
};

export const getBackupSummary = (backup = {}) => { const savedInspections = Array.isArray(backup.savedInspections) ? backup.savedInspections : []; const photos = Array.isArray(backup.photos) ? backup.photos : []; return `${savedInspections.length} saved inspection${savedInspections.length === 1 ? '' : 's'} · ${photos.length} active photo${photos.length === 1 ? '' : 's'}`; };
