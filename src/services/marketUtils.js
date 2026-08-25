const MAX_PRICE = 1_000_000;
const MAX_MILEAGE = 1_000_000;
const CONDITIONS = ['poor', 'fair', 'good', 'excellent'];

const isRecord = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const toMoney = (value) => { const number = Number(String(value ?? '').replace(/[^0-9.]/g, '')); return Number.isFinite(number) ? Math.min(MAX_PRICE, Math.max(0, Math.round(number))) : 0; };
const toMileage = (value) => { const number = Number(String(value ?? '').replace(/[^0-9]/g, '')); return Number.isFinite(number) ? Math.min(MAX_MILEAGE, Math.max(0, Math.round(number))) : 0; };
const text = (value, max = 120) => typeof value === 'string' ? value.trim().slice(0, max) : '';

export const normalizeMarketComparison = (input = {}) => {
  const safe = isRecord(input) ? input : {};
  const askingPrice = toMoney(safe.askingPrice);
  const comparableLow = toMoney(safe.comparableLow);
  const comparableHigh = toMoney(safe.comparableHigh);
  return {
    askingPrice,
    comparableLow,
    comparableHigh,
    mileage: toMileage(safe.mileage),
    condition: CONDITIONS.includes(safe.condition) ? safe.condition : 'fair',
    source: text(safe.source, 120),
    updatedAt: typeof safe.updatedAt === 'string' && !Number.isNaN(Date.parse(safe.updatedAt)) ? safe.updatedAt : null,
  };
};

export const validateMarketComparison = (input = {}) => {
  const value = normalizeMarketComparison(input);
  const errors = [];
  if (!value.askingPrice) errors.push('Enter the asking price.');
  if (value.comparableLow && value.comparableHigh && value.comparableLow > value.comparableHigh) errors.push('Comparable low must be less than or equal to comparable high.');
  if (value.comparableLow && value.askingPrice < value.comparableLow * 0.25) errors.push('Asking price is unusually low; verify the amount.');
  if (value.comparableHigh && value.askingPrice > value.comparableHigh * 4) errors.push('Asking price is unusually high; verify the amount.');
  return { valid: errors.length === 0, errors, value };
};

export const getMarketComparisonDisplay = (input = {}) => { const value = normalizeMarketComparison(input); return { asking: value.askingPrice ? `$${value.askingPrice.toLocaleString()}` : 'Not provided', comparable: value.comparableLow || value.comparableHigh ? `${value.comparableLow ? `$${value.comparableLow.toLocaleString()}` : 'Not provided'}–${value.comparableHigh ? `$${value.comparableHigh.toLocaleString()}` : 'Not provided'}` : 'Not provided', mileage: value.mileage ? value.mileage.toLocaleString() : 'Not provided', condition: value.condition }; };

export const getMarketComparisonSummary = (input = {}) => {
  const { value } = validateMarketComparison(input);
  if (!value.askingPrice) return 'Add an asking price to compare this vehicle.';
  if (value.comparableLow && value.comparableHigh && value.comparableLow > value.comparableHigh) return 'Fix the comparable range before using negotiation guidance.';
  if (value.comparableLow && value.askingPrice < value.comparableLow) return 'Below the comparable range; verify condition and history before negotiating.';
  if (value.comparableHigh && value.askingPrice > value.comparableHigh) return 'Above the comparable range; use verified issues as negotiation evidence.';
  return 'Within the entered comparable range; weigh condition, mileage, and history together.';
};
