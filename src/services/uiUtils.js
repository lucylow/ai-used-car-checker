export const formatComparisonMetricValue = (row, value) => {
  if (value === null || value === undefined) return '—';
  const formatted = row.key === 'repairs' ? Number(value).toLocaleString() : value;
  return `${row.prefix || ''}${formatted}${row.suffix || ''}`;
};

export const normalizePhotoAsset = (photo = {}, index = 0) => { if (!photo || typeof photo !== 'object') return null; const uri = typeof photo.uri === 'string' ? photo.uri.trim() : ''; if (!uri) return null; return { id: typeof photo.id === 'string' && photo.id ? photo.id : `restored-photo-${index + 1}`, uri, width: Number.isFinite(Number(photo.width)) ? Number(photo.width) : null, height: Number.isFinite(Number(photo.height)) ? Number(photo.height) : null, mimeType: typeof photo.mimeType === 'string' ? photo.mimeType : 'image/jpeg', fileName: typeof photo.fileName === 'string' && photo.fileName ? photo.fileName : `inspection-${index + 1}.jpg`, reviewStatus: ['needs-review', 'reviewed', 'confirmed'].includes(photo.reviewStatus) ? photo.reviewStatus : 'needs-review', note: typeof photo.note === 'string' ? photo.note.slice(0, 240) : '' }; };
export const normalizePhotoAssets = (photos = []) => (Array.isArray(photos) ? photos : []).map(normalizePhotoAsset).filter(Boolean).slice(-12);

export const replacePhotoAsset = (photos = [], photoId, replacement = {}) => { const list = normalizePhotoAssets(photos); const found = list.some((photo) => photo?.id === photoId); return found ? list.map((photo) => photo?.id === photoId ? { ...photo, ...replacement, id: photo.id, reviewStatus: photo.reviewStatus || 'confirmed' } : photo) : [...list, normalizePhotoAsset({ ...replacement, id: photoId, reviewStatus: 'confirmed' })].filter(Boolean).slice(-12); };

export const getEvidenceHealth = (issues = [], photos = []) => {
  const linked = (Array.isArray(issues) ? issues : []).filter((issue) => issue?.photoId);
  const resolvable = linked.filter((issue) => getIssueEvidencePhoto(issue, photos));
  return { linkedCount: linked.length, resolvableCount: resolvable.length, missingCount: Math.max(0, linked.length - resolvable.length), label: linked.length ? `${resolvable.length}/${linked.length} linked finding${linked.length === 1 ? '' : 's'} have a resolvable photo` : 'No findings are linked to photo evidence' };
};

export const getPhotoDeleteGuidance = (photoId, issues = []) => {
  const linkedCount = (Array.isArray(issues) ? issues : []).filter((issue) => issue?.photoId === photoId).length;
  return linkedCount ? { linkedCount, title: 'Photo has linked findings', message: `${linkedCount} finding${linkedCount === 1 ? '' : 's'} will keep its evidence reference as metadata only if this photo is removed.` } : { linkedCount: 0, title: 'Remove photo?', message: 'This photo is not linked to a finding.' };
};

export const getIssueEvidencePhoto = (issue = {}, photos = []) => {
  if (!issue?.photoId || !Array.isArray(photos)) return null;
  return photos.find((photo) => photo?.id === issue.photoId && photo?.uri) || null;
};

const getSafeCount = (value) => { const numeric = Number(value); return Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : 0; };
export const getBackupPreviewRows = (metadata = {}) => { const safe = metadata && typeof metadata === 'object' && !Array.isArray(metadata) ? metadata : {}; return [
  ['File size', typeof safe.sizeLabel === 'string' && safe.sizeLabel.trim() ? safe.sizeLabel.trim() : '0 B'],
  ['Saved inspections', getSafeCount(safe.savedInspections)],
  ['Active photos', getSafeCount(safe.activePhotos)],
  ['AI snapshots', getSafeCount(safe.aiSnapshots)],
]; };

export const getNavigationOverlayCleanup = () => ({ selectedPhoto: null, selectedSavedInspection: null, historyConfirm: null });
export const isPhotoActionLocked = (busy = false) => Boolean(busy);
export const getPhotoCount = (photos = []) => Array.isArray(photos) ? photos.length : 0;
export const getStablePhotoKey = (photo = {}, index = 0) => {
  const id = typeof photo?.id === 'string' ? photo.id.trim() : '';
  const uri = typeof photo?.uri === 'string' ? photo.uri.trim() : '';
  return id || uri || `photo-${index + 1}`;
};
export const normalizeReportPreviewCollections = (input = {}) => { const safe = input && typeof input === 'object' && !Array.isArray(input) ? input : {}; const { photos = [], issues = [] } = safe; return {
  photos: Array.isArray(photos) ? photos.filter((photo) => photo && typeof photo === 'object' && !Array.isArray(photo)).slice(0, 80) : [],
  issues: Array.isArray(issues) ? issues.filter((issue) => issue && typeof issue === 'object' && !Array.isArray(issue)).slice(0, 80) : [],
}; };
