const BACKUP_VERSION = 1;

export const selectInspectionRestorePayload = (primaryPayload, pendingPayload) => pendingPayload || primaryPayload || null;
const isRecord = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value));

export const serializeInspectionBackup = ({ vehicle, issues, checklist, photos, savedInspections }) => JSON.stringify({
  app: 'carwise',
  version: BACKUP_VERSION,
  exportedAt: new Date().toISOString(),
  vehicle,
  issues,
  checklist,
  photos,
  savedInspections,
}, null, 2);

export const parseInspectionBackup = (raw) => {
  const parsed = JSON.parse(raw);
  if (!parsed || parsed.app !== 'carwise' || parsed.version !== BACKUP_VERSION) throw new Error('Unsupported Carwise backup');
  return {
    vehicle: isRecord(parsed.vehicle) ? parsed.vehicle : null,
    issues: Array.isArray(parsed.issues) ? parsed.issues.filter(isRecord) : [],
    checklist: isRecord(parsed.checklist) ? parsed.checklist : {},
    photos: Array.isArray(parsed.photos) ? parsed.photos.filter(isRecord) : [],
    savedInspections: Array.isArray(parsed.savedInspections) ? parsed.savedInspections.filter(isRecord) : [],
  };
};

export const getBackupSummary = (backup) => `${backup.savedInspections.length} saved inspection${backup.savedInspections.length === 1 ? '' : 's'} · ${backup.photos.length} active photo${backup.photos.length === 1 ? '' : 's'}`;
