import { isValidVin, normalizeVin } from './inspectionUtils.js';

const VPIC_BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended';
const vinCache = new Map();

export const clearVinCache = () => vinCache.clear();

export const applyDecodedVehicle = (currentVehicle = {}, decodedVehicle = {}, vin = '') => ({
  ...currentVehicle,
  year: String(decodedVehicle.year || currentVehicle.year || '').trim(),
  make: String(decodedVehicle.make || currentVehicle.make || '').trim(),
  model: String(decodedVehicle.model || currentVehicle.model || '').trim(),
  vin: normalizeVin(vin || currentVehicle.vin || ''),
});

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
      year: result.ModelYear || '',
      make: result.Make || '',
      model: result.Model || '',
      trim: result.Trim || '',
      bodyClass: result.BodyClass || '',
      engine: result.DisplacementL ? `${result.DisplacementL}L ${result.EngineCylinders || ''}-cylinder`.trim() : '',
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
