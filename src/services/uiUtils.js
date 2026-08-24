const isRecord = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const safeText = (value, maxLength, fallback = '') => typeof value === 'string' && value.trim() ? value.trim().slice(0, maxLength) : fallback;
const safeDimension = (value) => { const numeric = Number(value); return Number.isFinite(numeric) ? Math.min(10000, Math.max(0, Math.round(numeric))) : null; };
const safePhotoId = (value, fallback) => safeText(value, 120, fallback);

export const formatComparisonMetricValue = (row, value) => {
  if (value === null || value === undefined) return '—';
  const formatted = row.key === 'repairs' ? Number(value).toLocaleString() : value;
  return `${row.prefix || ''}${formatted}${row.suffix || ''}`;
};

export const normalizePhotoAsset = (photo = {}, index = 0) => {
  if (!isRecord(photo)) return null;
  const uri = safeText(photo.uri, 2000);
  if (!uri) return null;
  return {
    id: safePhotoId(photo.id, `restored-photo-${index + 1}`),
    uri,
    width: safeDimension(photo.width),
    height: safeDimension(photo.height),
    mimeType: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic'].includes(photo.mimeType) ? photo.mimeType : 'image/jpeg',
    fileName: safeText(photo.fileName, 160, `inspection-${index + 1}.jpg`),
    reviewStatus: ['needs-review', 'reviewed', 'confirmed'].includes(photo.reviewStatus) ? photo.reviewStatus : 'needs-review',
    note: safeText(photo.note, 240),
  };
};
export const normalizePhotoAssets = (photos = []) => (Array.isArray(photos) ? photos : []).map(normalizePhotoAsset).filter(Boolean).slice(-12);

export const replacePhotoAsset = (photos = [], photoId, replacement = {}) => {
  const list = normalizePhotoAssets(photos);
  const found = list.some((photo) => photo.id === photoId);
  const safeReplacement = isRecord(replacement) ? replacement : {};
  if (found) {
    return list.map((photo, index) => {
      if (photo.id !== photoId) return photo;
      return normalizePhotoAsset({ ...photo, ...safeReplacement, id: photo.id }, index) || photo;
    });
  }
  return [...list, normalizePhotoAsset({ ...safeReplacement, id: photoId, reviewStatus: 'confirmed' })].filter(Boolean).slice(-12);
};

export const getEvidenceHealth = (issues = [], photos = []) => {
  const linked = (Array.isArray(issues) ? issues : []).filter((issue) => isRecord(issue) && safeText(issue.photoId, 120));
  const resolvable = linked.filter((issue) => getIssueEvidencePhoto(issue, photos));
  return { linkedCount: linked.length, resolvableCount: resolvable.length, missingCount: Math.max(0, linked.length - resolvable.length), label: linked.length ? `${resolvable.length}/${linked.length} linked finding${linked.length === 1 ? '' : 's'} have a resolvable photo` : 'No findings are linked to photo evidence' };
};

export const getPhotoDeleteGuidance = (photoId, issues = []) => {
  const normalizedPhotoId = safeText(photoId, 120);
  const linkedCount = (Array.isArray(issues) ? issues : []).filter((issue) => isRecord(issue) && safeText(issue.photoId, 120) === normalizedPhotoId).length;
  return linkedCount ? { linkedCount, title: 'Photo has linked findings', message: `${linkedCount} finding${linkedCount === 1 ? '' : 's'} will keep its evidence reference as metadata only if this photo is removed.` } : { linkedCount: 0, title: 'Remove photo?', message: 'This photo is not linked to a finding.' };
};

export const getIssueEvidencePhoto = (issue = {}, photos = []) => {
  const photoId = safeText(issue?.photoId, 120);
  if (!photoId || !Array.isArray(photos)) return null;
  return photos.find((photo) => isRecord(photo) && safeText(photo.id, 120) === photoId && safeText(photo.uri, 2000)) || null;
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
export const getPhotoCount = (photos = []) => normalizePhotoAssets(photos).length;
export const getStablePhotoKey = (photo = {}, index = 0) => {
  const id = typeof photo?.id === 'string' ? photo.id.trim() : '';
  const uri = typeof photo?.uri === 'string' ? photo.uri.trim() : '';
  return id || uri || `photo-${index + 1}`;
};
export const normalizeReportPreviewCollections = (input = {}) => { const safe = input && typeof input === 'object' && !Array.isArray(input) ? input : {}; const { photos = [], issues = [] } = safe; return {
  photos: Array.isArray(photos) ? photos.filter(isRecord).slice(0, 80) : [],
  issues: Array.isArray(issues) ? issues.filter(isRecord).slice(0, 80) : [],
}; };
