import { api } from './client';
import { MarketData } from '../types/vehicle';

/**
 * Market data is proxied through our Supabase Edge Function,
 * which aggregates listings from multiple sources.
 */
export async function getMarketData(params: {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  postalCode?: string;
}): Promise<MarketData> {
  const body = await api.post<{ data: MarketData }>('/market-data', params);
  return body.data;
}

export async function getPriceHistory(
  vin: string,
  days = 90
): Promise<{ date: string; price: number }[]> {
  const body = await api.get<{ data: { date: string; price: number }[] }>(
    `/market-data/${vin}/history`,
    { days }
  );
  return body.data;
}
