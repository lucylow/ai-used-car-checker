export function getPhotoDeleteGuidance() {
  return 'Delete this photo from the inspection.';
}

export function getEvidenceHealth() {
  return 'good';
}

export function replacePhotoAsset(value) {
  return value || null;
}

export function normalizePhotoAssets(value) {
  return Array.isArray(value) ? value : [];
}

export function getNavigationOverlayCleanup() {
  return [];
}

export function isPhotoActionLocked() {
  return false;
}

export function getPhotoCount(value) {
  return Array.isArray(value) ? value.length : 0;
}
