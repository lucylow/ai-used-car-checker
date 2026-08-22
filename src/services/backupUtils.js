const BACKUP_VERSION = 1;

export const selectInspectionRestorePayload = (primaryPayload, pendingPayload) => pendingPayload || primaryPayload || null;
const isRecord = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value));

export const serializeInspectionBackup = ({ vehicle, issues, checklist, photos, savedInspections, aiHistory = [] }) => JSON.stringify({
  app: 'carwise',
  version: BACKUP_VERSION,
  exportedAt: new Date().toISOString(),
  vehicle,
  issues,
  checklist,
  photos,
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
