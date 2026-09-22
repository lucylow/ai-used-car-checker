export function normalizeMarketComparison(value) {
  const safe = value || {};
  return {
    averagePrice: Number(safe.averagePrice || safe.marketAverage || 0),
    lowPrice: Number(safe.lowPrice || 0),
    highPrice: Number(safe.highPrice || 0),
    sampleSize: Number(safe.sampleSize || 0),
    trend: Number(safe.trend || 0),
  };
}
