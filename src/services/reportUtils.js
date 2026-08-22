const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

export const formatPhotoEvidenceLabel = (photo = {}, index = 0) => {
  const name = photo.fileName ? ` · ${photo.fileName}` : '';
  const dimensions = photo.width && photo.height ? ` · ${photo.width}×${photo.height}` : '';
  const source = photo.embeddedDataUri ? ' · embedded image' : photo.uri ? ' · local asset unavailable for embed' : ' · metadata only';
  return `Photo ${index + 1}${name}${dimensions}${source}`;
};

export const buildPhotoEvidenceHtml = (photos = []) => photos.map((photo, index) => {
  const label = escapeHtml(formatPhotoEvidenceLabel(photo, index));
  if (photo.embeddedDataUri) {
    return `<figure style="display:inline-block; vertical-align:top; width:31%; margin:0 1% 14px 0; padding:8px; border:1px solid #D0D5DD; border-radius:10px; box-sizing:border-box"><img src="${photo.embeddedDataUri}" alt="${label}" style="display:block; width:100%; height:120px; object-fit:cover; border-radius:7px"/><figcaption style="margin-top:7px; color:#475467; font-size:10px; line-height:1.35">${label}</figcaption></figure>`;
  }
  return `<span style="display:inline-block; padding:8px 10px; margin:3px; border:1px solid #D0D5DD; border-radius:8px; color:#475467; font-size:11px">${label}</span>`;
}).join('');

export function buildInspectionReport({ vehicle, issues, checklist, photos, fairPrice, riskScore }) {
  const repairTotal = issues.reduce((sum, issue) => sum + (Number(issue.cost) || 0), 0);
  const completedSections = Object.values(checklist).filter(Boolean).length;
  const criticalCount = issues.filter((issue) => issue.severity === 'critical').length;
  return [
    'CARWISE INSPECTION REPORT',
    `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    `Mileage: ${vehicle.mileage || 'Not provided'}`,
    `Risk score: ${riskScore}/100`,
    `Issues found: ${issues.length} (${criticalCount} critical)`,
    `Estimated repairs: $${repairTotal}`,
    `AI fair price: $${fairPrice.toLocaleString()}`,
    `Checklist: ${completedSections}/5 sections complete`,
    `Photo evidence: ${photos.length} item(s)`,
    '',
    'This report is informational and should be confirmed by a qualified mechanic.'
  ].join('\n');
}
