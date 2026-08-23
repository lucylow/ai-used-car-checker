import { isValidVin, normalizeVin } from './inspectionUtils.js';

const VPIC_BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended';
const vinCache = new Map();

export const clearVinCache = () => vinCache.clear();

const safeText = (value, fallback = '') => typeof value === 'string' || typeof value === 'number' ? String(value).trim() : fallback;

export const applyDecodedVehicle = (currentVehicle = {}, decodedVehicle = {}, vin = '') => ({
  ...currentVehicle,
  year: safeText(decodedVehicle.year, safeText(currentVehicle.year)),
  make: safeText(decodedVehicle.make, safeText(currentVehicle.make)),
  model: safeText(decodedVehicle.model, safeText(currentVehicle.model)),
  vin: normalizeVin(vin || currentVehicle.vin || ''),
});

export const getVinResultCompleteness = (vehicle = {}) => {
  const fields = ['year', 'make', 'model'];
  const present = fields.filter((field) => safeText(vehicle?.[field])).length;
  return { present, total: fields.length, complete: present === fields.length };
};

export const getVinFallback = (vin, message = 'Live VIN lookup unavailable. Review the VIN manually or try again when connected.') => ({
  vin: normalizeVin(vin),
  status: 'fallback',
  message,
  vehicle: null,
});

export const decodeVin = async (vin, { fetchImpl = fetch, timeoutMs = 8000 } = {}) => {
  const normalizedVin = normalizeVin(vin);
  if (!isValidVin(normalizedVin)) throw new Error('Enter a valid 17-character VIN before decoding.');
  if (vinCache.has(normalizedVin)) return vinCache.get(normalizedVin);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(`${VPIC_BASE_URL}/${encodeURIComponent(normalizedVin)}?format=json`, { signal: controller.signal });
    if (!response.ok) throw new Error(`VIN service returned ${response.status}`);
    const payload = await response.json();
    const result = payload?.Results?.[0] || {};
      const vehicle = {
        year: safeText(result.ModelYear),
        make: safeText(result.Make),
        model: safeText(result.Model),
        trim: safeText(result.Trim),
        bodyClass: safeText(result.BodyClass),
        engine: safeText(result.DisplacementL) ? `${safeText(result.DisplacementL)}L ${safeText(result.EngineCylinders)}-cylinder`.trim() : '',
      };
    if (!vehicle.year && !vehicle.make && !vehicle.model) throw new Error('VIN service returned no vehicle identity.');
    const decoded = { vin: normalizedVin, status: 'decoded', message: 'VIN decoded with NHTSA vPIC.', vehicle };
    vinCache.set(normalizedVin, decoded);
    return decoded;
  } catch (error) {
    if (error?.message === 'Enter a valid 17-character VIN before decoding.') throw error;
    return getVinFallback(normalizedVin, error?.name === 'AbortError' ? 'VIN lookup timed out. Check your connection and try again.' : undefined);
  } finally {
    clearTimeout(timer);
  }
};
