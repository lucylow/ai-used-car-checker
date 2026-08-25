import { isValidVin, normalizeVin } from './inspectionUtils.js';

const VPIC_BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended';
const vinCache = new Map();
const MAX_FIELD_LENGTH = 120;
const MAX_TIMEOUT_MS = 30000;

export const clearVinCache = () => vinCache.clear();

const isRecord = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const safeText = (value, fallback = '', maxLength = MAX_FIELD_LENGTH) => (typeof value === 'string' || typeof value === 'number') ? String(value).trim().slice(0, maxLength) : fallback;
const normalizeYear = (value) => /^\d{4}$/.test(safeText(value, '', 4)) ? safeText(value, '', 4) : '';
const normalizePositiveNumber = (value, maxLength = 8) => { const text = safeText(value, '', maxLength); const numeric = Number(text); return Number.isFinite(numeric) && numeric > 0 ? text : ''; };
const normalizePositiveInteger = (value) => { const numeric = Number(safeText(value, '', 4)); return Number.isInteger(numeric) && numeric > 0 && numeric <= 32 ? String(numeric) : ''; };
const normalizeEngine = (displacement, cylinders) => { const displacementText = normalizePositiveNumber(displacement); const cylindersText = normalizePositiveInteger(cylinders); return [displacementText ? `${displacementText}L` : '', cylindersText ? `${cylindersText}-cylinder` : ''].filter(Boolean).join(' '); };
const normalizeTimeout = (value) => { const numeric = Number(value); return Number.isFinite(numeric) ? Math.min(MAX_TIMEOUT_MS, Math.max(0, numeric)) : 8000; };
const cloneDecoded = (decoded) => ({ ...decoded, vehicle: isRecord(decoded?.vehicle) ? { ...decoded.vehicle } : null });

export const applyDecodedVehicle = (currentVehicle = {}, decodedVehicle = {}, vin = '') => {
  const current = isRecord(currentVehicle) ? currentVehicle : {};
  const decoded = isRecord(decodedVehicle) ? decodedVehicle : {};
  return {
    year: normalizeYear(decoded.year) || normalizeYear(current.year),
    make: safeText(decoded.make) || safeText(current.make),
    model: safeText(decoded.model) || safeText(current.model),
    vin: normalizeVin(vin || current.vin || ''),
    ...(Object.prototype.hasOwnProperty.call(current, 'mileage') ? { mileage: safeText(current.mileage, '', 20) } : {}),
    ...(Object.prototype.hasOwnProperty.call(current, 'asking') ? { asking: safeText(current.asking, '', 30) } : {}),
  };
};

export const getSafeDecodedVehicle = (vehicle) => isRecord(vehicle) ? { ...vehicle } : null;

export const getVinResultCompleteness = (vehicle = {}) => {
  const fields = ['year', 'make', 'model'];
  const labels = { year: 'Year', make: 'Make', model: 'Model' };
  const missing = fields.filter((field) => !safeText(vehicle?.[field]));
  return { present: fields.length - missing.length, total: fields.length, complete: missing.length === 0, missing, missingLabels: missing.map((field) => labels[field]) };
};
export const canApplyDecodedVehicle = (vehicle = {}) => getVinResultCompleteness(vehicle).complete;
export const normalizeVinCandidate = (value) => normalizeVin(value);
export const getVinCaptureConfidence = (value) => { const normalized = normalizeVinCandidate(value); if (isValidVin(normalized)) return 0.96; if (normalized.length >= 14) return 0.62; if (normalized.length >= 10) return 0.38; return 0; };
export const getVinConfidenceDisclosure = (confidence) => Number(confidence) >= 0.8 ? 'Format-based confidence only; verify every character against the captured image.' : 'Format check is incomplete; verify every character against the captured image.';
export const canConfirmVinCapture = ({ candidate = '', confidence = 0 } = {}) => isValidVin(normalizeVinCandidate(candidate)) && Number.isFinite(Number(confidence)) && Number(confidence) >= 0.8;

export const getVinFallback = (vin, message = 'Live VIN lookup unavailable. Review the VIN manually or try again when connected.') => ({
  vin: normalizeVin(vin),
  status: 'fallback',
  message: safeText(message, 'Live VIN lookup unavailable. Review the VIN manually or try again when connected.', 180),
  vehicle: null,
});

export const decodeVin = async (vin, { fetchImpl = fetch, timeoutMs = 8000 } = {}) => {
  const normalizedVin = normalizeVin(vin);
  if (!isValidVin(normalizedVin)) throw new Error('Enter a valid 17-character VIN before decoding.');
  if (vinCache.has(normalizedVin)) return cloneDecoded(vinCache.get(normalizedVin));
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), normalizeTimeout(timeoutMs));
  try {
    const response = await fetchImpl(`${VPIC_BASE_URL}/${encodeURIComponent(normalizedVin)}?format=json`, { signal: controller.signal });
    if (response?.ok !== true) throw new Error(`VIN service returned ${safeText(response?.status, 'an unknown status', 12)}`);
    const payload = await response.json();
    const result = isRecord(payload?.Results?.[0]) ? payload.Results[0] : {};
    const vehicle = {
      year: normalizeYear(result.ModelYear),
      make: safeText(result.Make),
      model: safeText(result.Model),
      trim: safeText(result.Trim),
      bodyClass: safeText(result.BodyClass),
      engine: normalizeEngine(result.DisplacementL, result.EngineCylinders),
    };
    if (!vehicle.year && !vehicle.make && !vehicle.model) throw new Error('VIN service returned no vehicle identity.');
    const decoded = { vin: normalizedVin, status: 'decoded', message: 'VIN decoded with NHTSA vPIC.', vehicle };
    vinCache.set(normalizedVin, decoded);
    return cloneDecoded(decoded);
  } catch (error) {
    if (error?.message === 'Enter a valid 17-character VIN before decoding.') throw error;
    return getVinFallback(normalizedVin, error?.name === 'AbortError' ? 'VIN lookup timed out. Check your connection and try again.' : undefined);
  } finally {
    clearTimeout(timer);
  }
};
