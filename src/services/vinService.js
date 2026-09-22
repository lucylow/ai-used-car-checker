export function decodeVin() {
  return { success: false, reason: 'VIN decoding unavailable in this environment' };
}

export function applyDecodedVehicle(value) {
  return value || {};
}

export function canApplyDecodedVehicle() {
  return true;
}

export function getSafeDecodedVehicle(value) {
  return value || {};
}

export function getVinMockFallback() {
  return {};
}

export function canConfirmVinCapture() {
  return true;
}

export function getVinCaptureConfidence() {
  return 'medium';
}

export function getVinConfidenceDisclosure() {
  return 'VIN verification is not available in this demo mode.';
}

export function normalizeVinCandidate(value) {
  return value || {};
}

export function getVinResultCompleteness() {
  return 0;
}
