export const formatComparisonMetricValue = (row, value) => {
  if (value === null || value === undefined) return '—';
  const formatted = row.key === 'repairs' ? Number(value).toLocaleString() : value;
  return `${row.prefix || ''}${formatted}${row.suffix || ''}`;
};

export const getBackupPreviewRows = (metadata = {}) => [
  ['File size', metadata.sizeLabel || '0 B'],
  ['Saved inspections', metadata.savedInspections || 0],
  ['Active photos', metadata.activePhotos || 0],
  ['AI snapshots', metadata.aiSnapshots || 0],
];
