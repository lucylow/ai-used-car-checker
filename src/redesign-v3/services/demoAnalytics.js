const CREDIT_APR = {
  excellent: 5.9,
  good: 7.5,
  fair: 11.2,
  poor: 16.8,
};

const CATEGORY_FUEL_COST = {
  sedan: 1820,
  suv: 2240,
  truck: 3220,
  sports: 2680,
  coupe: 2460,
  hatchback: 1760,
  wagon: 2050,
  minivan: 2550,
  convertible: 2300,
  ev: 1060,
  hybrid: 980,
  luxury: 2740,
  economy: 1620,
  off_road: 2920,
  van: 3040,
  classic: 4100,
};

export const SEASONAL_PRICE_FACTORS = [0.97, 0.98, 1.01, 1.03, 1.04, 1.03, 1.02, 1, 0.99, 0.98, 0.96, 0.94];
export const REGIONAL_PRICE_ADJUSTMENTS = [
  { state: 'CA', metro: 'San Francisco Bay Area', adjustment: 1.08, demandIndex: 92 },
  { state: 'CA', metro: 'Los Angeles', adjustment: 1.05, demandIndex: 88 },
  { state: 'TX', metro: 'Dallas-Fort Worth', adjustment: 1.02, demandIndex: 85 },
  { state: 'WA', metro: 'Seattle', adjustment: 1.06, demandIndex: 86 },
  { state: 'CO', metro: 'Denver', adjustment: 1.04, demandIndex: 84 },
];

export function getHistoricalPriceSeries(basePrice, months = 18, trendPercent = 0) {
  return Array.from({ length: months }, (_, index) => ({
    month: index + 1,
    price: Math.round(basePrice * (1 + (trendPercent / 100) * (index / Math.max(1, months - 1)))),
    sampleSize: 30 + (index % 11),
  }));
}

export function compareDemoVehicles(vehicles) {
  if (!Array.isArray(vehicles) || vehicles.length < 2 || vehicles.length > 3) {
    throw new Error('Compare requires 2-3 vehicles');
  }

  const rows = [
    row('Asking price', vehicles, (vehicle) => vehicle.askingPrice || 0, 'currency', min),
    row('Mileage', vehicles, (vehicle) => vehicle.mileage || 0, 'number', min),
    row('Model year', vehicles, (vehicle) => vehicle.year || 0, 'number', max),
    row('Risk score', vehicles, (vehicle) => vehicle.inspectionSummary.riskScore, 'risk', min),
    row('Findings', vehicles, (vehicle) => vehicle.inspectionSummary.demoFindings.length, 'number', min),
    row('Repair estimate', vehicles, (vehicle) => vehicle.inspectionSummary.totalRepairHigh, 'currency', min),
    row('Market position', vehicles, (vehicle) => Math.round(((vehicle.askingPrice - vehicle.marketData.marketAverage) / vehicle.marketData.marketAverage) * 100), 'percent', min),
    row('Suggested offer', vehicles, (vehicle) => vehicle.inspectionSummary.suggestedOffer, 'currency', min),
  ];

  const scores = new Map();
  rows.forEach((item) => {
    const vehicleId = vehicles[item.bestIndex].id;
    scores.set(vehicleId, (scores.get(vehicleId) || 0) + 1);
  });
  const winner = [...scores.entries()].sort((a, b) => b[1] - a[1])[0];
  const winningVehicle = vehicles.find((vehicle) => vehicle.id === winner[0]);

  return {
    vehicles,
    rows,
    overallWinner: winner[0],
    summary: `${winningVehicle.year} ${winningVehicle.make} ${winningVehicle.model} leads ${winner[1]} of ${rows.length} categories.`,
  };
}

export function getFinancingEstimate(vehicle, creditTier = 'good', downPaymentRate = 0.1, termMonths = 60) {
  const price = vehicle.askingPrice || 0;
  const downPayment = Math.round(price * downPaymentRate);
  const loanAmount = Math.max(0, price - downPayment);
  const apr = CREDIT_APR[creditTier] || CREDIT_APR.good;
  const monthlyRate = apr / 100 / 12;
  const monthlyPayment = monthlyRate === 0
    ? loanAmount / termMonths
    : (loanAmount * monthlyRate * (1 + monthlyRate) ** termMonths) / ((1 + monthlyRate) ** termMonths - 1);
  const totalInterest = monthlyPayment * termMonths - loanAmount;

  return {
    price,
    creditTier,
    termMonths,
    downPayment,
    apr,
    monthlyPayment: Math.round(monthlyPayment),
    totalInterest: Math.round(totalInterest),
    totalCost: Math.round(price + totalInterest),
  };
}

export function getFuelProjection(vehicle, annualMiles = 12000) {
  const categoryAverage = CATEGORY_FUEL_COST[vehicle.category] || 2100;
  const fuelType = String(vehicle.fuelType || 'Gasoline').toLowerCase();
  const annualFuelCost = Math.round(categoryAverage * (annualMiles / 12000));
  return {
    fuelType,
    annualMiles,
    annualFuelCost,
    fiveYearCost: annualFuelCost * 5,
    comparedToSegmentAvg: annualFuelCost - categoryAverage,
  };
}

function row(label, vehicles, valueFor, format, choose) {
  const values = vehicles.map(valueFor);
  return { label, values, format, bestIndex: choose(values) };
}

function min(values) {
  return values.reduce((best, value, index) => value < values[best] ? index : best, 0);
}

function max(values) {
  return values.reduce((best, value, index) => value > values[best] ? index : best, 0);
}

export function getInsuranceEstimate(vehicle, coverage = 'standard', deductible = 500) {
  const base = vehicle.category === 'sports' || vehicle.category === 'luxury' ? 2450 : vehicle.category === 'truck' ? 1880 : 1450;
  const coverageFactor = coverage === 'liability' ? 0.55 : coverage === 'full' ? 1.45 : 1;
  const deductibleFactor = deductible >= 1000 ? 0.88 : deductible === 250 ? 1.15 : 1;
  const annualPremium = Math.round(base * coverageFactor * deductibleFactor);
  return { annualPremium, monthlyPremium: Math.round(annualPremium / 12), coverage, deductible, comparisonToSegment: Math.round(((annualPremium - base) / base) * 100) };
}

export function calculateDepreciation(vehicle) {
  const age = Math.max(0, new Date().getFullYear() - vehicle.year);
  const currentValue = vehicle.askingPrice || 0;
  const msrpNew = Math.round(currentValue / Math.max(0.35, 1 - Math.min(0.65, age * 0.12)));
  const points = Array.from({ length: Math.min(age + 6, 11) }, (_, year) => {
    const value = Math.round(msrpNew * Math.max(0.2, 1 - year * 0.12));
    return { year, value, percentOfMsrp: Math.round((value / msrpNew) * 100) };
  });
  return { vehicleId: vehicle.id, msrpNew, currentValue, ageYears: age, points, retentionAt5yr: points[5]?.percentOfMsrp || 0, retentionAt10yr: points[10]?.percentOfMsrp || 0 };
}