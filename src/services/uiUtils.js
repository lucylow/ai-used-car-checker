export const formatComparisonMetricValue = (row, value) => {
  if (value === null || value === undefined) return '—';
  const formatted = row.key === 'repairs' ? Number(value).toLocaleString() : value;
  return `${row.prefix || ''}${formatted}${row.suffix || ''}`;
};

export const getPhotoDeleteGuidance = (photoId, issues = []) => {
  const linkedCount = (Array.isArray(issues) ? issues : []).filter((issue) => issue?.photoId === photoId).length;
  return linkedCount ? { linkedCount, title: 'Photo has linked findings', message: `${linkedCount} finding${linkedCount === 1 ? '' : 's'} will keep its evidence reference as metadata only if this photo is removed.` } : { linkedCount: 0, title: 'Remove photo?', message: 'This photo is not linked to a finding.' };
};

export const getIssueEvidencePhoto = (issue = {}, photos = []) => {
  if (!issue?.photoId || !Array.isArray(photos)) return null;
  return photos.find((photo) => photo?.id === issue.photoId && photo?.uri) || null;
};

export const getBackupPreviewRows = (metadata = {}) => [
  ['File size', metadata.sizeLabel || '0 B'],
  ['Saved inspections', metadata.savedInspections || 0],
  ['Active photos', metadata.activePhotos || 0],
  ['AI snapshots', metadata.aiSnapshots || 0],
];
