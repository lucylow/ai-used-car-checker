import axios from 'axios';
import { VehicleSpecs } from '../types/vehicle';

const NHTSA_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles';

interface NHTSAResponse {
  Count: number;
  Message: string;
  Results: Array<Record<string, string | null>>;
}

/**
 * NHTSA VIN decoder — completely free, no API key required.
 * Rate limit: reasonable use only.
 */
export async function decodeVin(vin: string): Promise<VehicleSpecs | null> {
  if (!isValidVin(vin)) return null;

  try {
    const { data } = await axios.get<NHTSAResponse>(
      `${NHTSA_BASE}/DecodeVinValues/${vin}?format=json`,
      { timeout: 10000 }
    );

    if (!data.Results?.length) return null;
    const r = data.Results[0];

    return {
      vin: vin.toUpperCase(),
      make: r.Make ?? '',
      model: r.Model ?? '',
      year: parseInt(r.ModelYear ?? '0', 10),
      trim: r.Trim ?? undefined,
      bodyClass: r.BodyClass ?? undefined,
      engineCylinders: numOrUndefined(r.EngineCylinders),
      engineDisplacement: numOrUndefined(r.DisplacementL),
      engineHp: numOrUndefined(r.EngineHP),
      fuelType: r.FuelTypePrimary ?? undefined,
      transmissionStyle: r.TransmissionStyle ?? undefined,
      driveType: r.DriveType ?? undefined,
      doors: numOrUndefined(r.Doors),
      seats: numOrUndefined(r.Seats),
      manufacturer: r.Manufacturer ?? undefined,
      plantCountry: r.PlantCountry ?? undefined,
      series: r.Series ?? undefined,
      gvwr: r.GVWR ?? undefined,
      abs: r.ABS === 'Standard',
      airbags: extractAirbags(r),
      safetyFeatures: extractSafety(r),
    };
  } catch (error) {
    console.error('[NHTSA] Decode failed:', error);
    return null;
  }
}

export function isValidVin(vin: string): boolean {
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin.toUpperCase());
}

function numOrUndefined(v: string | null | undefined): number | undefined {
  if (!v) return undefined;
  const n = parseFloat(v);
  return isNaN(n) ? undefined : n;
}

function extractAirbags(r: Record<string, string | null>): string[] {
  const out: string[] = [];
  const keys: Array<[string, string]> = [
    ['FrontAirBagLocation', 'Front Airbag'],
    ['SideAirBagLocation', 'Side Airbag'],
    ['CurtainAirBagLocation', 'Curtain Airbag'],
    ['KneeAirBagLocation', 'Knee Airbag'],
  ];
  for (const [k, label] of keys) {
    if (r[k] && r[k] !== 'Not Applicable') out.push(label);
  }
  return out;
}

function extractSafety(r: Record<string, string | null>): string[] {
  const out: string[] = [];
  if (r.ABS === 'Standard') out.push('ABS');
  if (r.ElectronicStabilityControl === 'Standard') out.push('ESC');
  if (r.TractionControl === 'Standard') out.push('Traction Control');
  if (r.ForwardCollisionWarning === 'Standard') out.push('Forward Collision Warning');
  if (r.LaneDepartureWarning === 'Standard') out.push('Lane Departure Warning');
  if (r.BlindSpotMon === 'Standard') out.push('Blind Spot Monitor');
  return out;
}
