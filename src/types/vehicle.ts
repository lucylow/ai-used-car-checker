export interface Vehicle {
  id: string;
  userId: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  bodyStyle?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  fuelType?: string;
  exteriorColor?: string;
  interiorColor?: string;
  mileage: number;
  askingPrice?: number;
  sellerType?: SellerType;
  sellerName?: string;
  sellerPhone?: string;
  sellerEmail?: string;
  location?: VehicleLocation;
  listingUrl?: string;
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export type SellerType = 'dealer' | 'private' | 'certified';
export type VehicleStatus = 'draft' | 'inspecting' | 'complete' | 'archived';

export interface VehicleLocation {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  postalCode?: string;
}

export interface VehicleSpecs {
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  bodyClass?: string;
  engineCylinders?: number;
  engineDisplacement?: number;
  engineHp?: number;
  fuelType?: string;
  transmissionStyle?: string;
  driveType?: string;
  doors?: number;
  seats?: number;
  manufacturer?: string;
  plantCountry?: string;
  series?: string;
  gvwr?: string;
  abs?: boolean;
  airbags?: string[];
  safetyFeatures?: string[];
}

export interface MarketData {
  vehicleId: string;
  vin: string;
  averagePrice: number;
  medianPrice: number;
  lowestPrice: number;
  highestPrice: number;
  sampleSize: number;
  priceByMileage: PricePoint[];
  comparableListings: ComparableListing[];
  trend: MarketTrend;
  lastUpdated: string;
  source: string;
  confidence: number;
}

export interface PricePoint {
  mileage: number;
  price: number;
}

export interface ComparableListing {
  id: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage: number;
  price: number;
  location: string;
  sellerType: SellerType;
  daysListed: number;
  url?: string;
}

export interface MarketTrend {
  direction: 'up' | 'down' | 'stable';
  percentChange: number;
  periodDays: number;
}
