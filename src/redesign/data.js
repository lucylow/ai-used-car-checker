export const DEMO_VEHICLE = {
  id: 'demo-honda-accord',
  year: '2020',
  make: 'Honda',
  model: 'Accord Sport',
  mileage: '42,180',
  asking: '21900',
  vin: '1HGCV1F35LA000000',
  location: 'Toronto, ON',
  heroImage: null,
};

export const DEMO_PHOTOS = [
  { id: 'demo-front', label: 'Front 3/4', zone: 'Front bumper', type: 'photo', uri: null, issueCount: 1 },
  { id: 'demo-side', label: 'Driver side', zone: 'Driver side', type: 'photo', uri: null, issueCount: 0 },
  { id: 'demo-rear', label: 'Rear 3/4', zone: 'Rear bumper', type: 'photo', uri: null, issueCount: 1 },
  { id: 'demo-interior', label: 'Interior', zone: 'Dashboard', type: 'photo', uri: null, issueCount: 0 },
];

export const DEMO_ISSUES = [
  { id: 'issue-1', name: 'Front bumper scratch', severity: 'major', cost: 650, confidence: 0.92, zone: 'Front bumper', evidenceIds: ['demo-front'] },
  { id: 'issue-2', name: 'Rear bumper scuff', severity: 'minor', cost: 280, confidence: 0.88, zone: 'Rear bumper', evidenceIds: ['demo-rear'] },
  { id: 'issue-3', name: 'Front tire wear', severity: 'minor', cost: 420, confidence: 0.81, zone: 'Front left tire', evidenceIds: [] },
];

export const DEMO_CHECKLIST = {
  exterior_bumpers: 'watch',
  exterior_lights: 'pass',
  exterior_glass: 'pass',
  exterior_body: 'watch',
  interior_seats: 'pass',
  interior_dash: 'pass',
  engine_leaks: 'watch',
  engine_noise: 'pass',
  tires_tread: 'watch',
  brakes_response: 'pass',
  electrical_controls: 'pass',
  test_drive_steering: 'pass',
  test_drive_noise: 'watch',
  test_drive_braking: 'pass',
};

export const DEMO_MARKET = {
  current: 21900,
  fair: 21100,
  low: 19800,
  high: 23900,
  trend: 2.4,
  confidence: 0.92,
  comparables: [
    { id: 'comp-1', title: '2020 Honda Accord Sport', price: 21500, mileage: 46100, city: 'Toronto', distance: '5 km', image: null },
    { id: 'comp-2', title: '2020 Honda Accord Sport', price: 20900, mileage: 49300, city: 'Mississauga', distance: '28 km', image: null },
    { id: 'comp-3', title: '2019 Honda Accord Sport', price: 20400, mileage: 53100, city: 'Brampton', distance: '34 km', image: null },
  ],
};

export const DEMO_FINDINGS = [
  {
    id: 'finding-1',
    title: 'Front bumper scratch',
    severity: 'major',
    confidence: 0.92,
    costLow: 400,
    costHigh: 750,
    zone: 'Front bumper',
    description: 'Visible paint damage is present on the lower-right bumper area. Confirm depth before treating as a repair requirement.',
    evidenceIds: ['demo-front'],
    status: 'needs-review',
  },
  {
    id: 'finding-2',
    title: 'Rear bumper scuff',
    severity: 'minor',
    confidence: 0.88,
    costLow: 150,
    costHigh: 350,
    zone: 'Rear bumper',
    description: 'Surface scuff visible in the uploaded rear-quarter evidence.',
    evidenceIds: ['demo-rear'],
    status: 'confirmed',
  },
  {
    id: 'finding-3',
    title: 'Front tire wear',
    severity: 'minor',
    confidence: 0.81,
    costLow: 320,
    costHigh: 520,
    zone: 'Front left tire',
    description: 'Visible wear appears greater than the rear reference. Check tread depth and age before purchase.',
    evidenceIds: [],
    status: 'needs-review',
  },
];

export const DEMO_HISTORY = [
  { id: 'hist-1', vehicle: { year: '2020', make: 'Honda', model: 'Accord Sport' }, risk: 32, fairPrice: 21100, repairs: 1350, progress: 100, date: 'Sep 20, 2026', image: null },
  { id: 'hist-2', vehicle: { year: '2021', make: 'Toyota', model: 'RAV4 XLE' }, risk: 18, fairPrice: 28400, repairs: 420, progress: 100, date: 'Sep 14, 2026', image: null },
  { id: 'hist-3', vehicle: { year: '2019', make: 'BMW', model: '330i' }, risk: 61, fairPrice: 24900, repairs: 3200, progress: 94, date: 'Sep 07, 2026', image: null },
];

export const CHECKLIST_GROUPS = [
  { id: 'exterior', title: 'Exterior', items: [
    ['bumpers', 'Bumpers'], ['lights', 'Lights & indicators'], ['glass', 'Glass & mirrors'], ['body', 'Panels & paint'], ['doors', 'Doors & seals'],
  ] },
  { id: 'interior', title: 'Interior', items: [
    ['seats', 'Seats & upholstery'], ['dash', 'Dashboard'], ['infotainment', 'Infotainment'], ['climate', 'Climate controls'], ['controls', 'Controls & switches'],
  ] },
  { id: 'mechanical', title: 'Mechanical', items: [
    ['engine', 'Engine bay'], ['leaks', 'Leaks'], ['fluids', 'Fluids'], ['battery', 'Battery'], ['belts', 'Belts & hoses'],
  ] },
  { id: 'runninggear', title: 'Running Gear', items: [
    ['tires', 'Tires'], ['brakes', 'Brakes'], ['suspension', 'Suspension'], ['steering', 'Steering'],
  ] },
  { id: 'test-drive', title: 'Test Drive', items: [
    ['acceleration', 'Acceleration'], ['transmission', 'Transmission'], ['noise', 'Noise & vibration'], ['braking', 'Braking response'], ['comfort', 'Ride & comfort'],
  ] },
];

export function sumRepairCosts(issues = []) {
  return issues.reduce((total, issue) => total + Math.max(0, Number(issue?.cost) || 0), 0);
}

export function riskFromIssues(issues = []) {
  return Math.min(100, issues.reduce((score, issue) => score + ({ critical: 34, major: 20, minor: 8 }[issue?.severity] || 0), 0));
}

export function countChecklist(checklist = {}) {
  return Object.values(checklist || {}).filter(Boolean).length;
}

export function flattenChecklistCount(groups = CHECKLIST_GROUPS) {
  return groups.reduce((count, group) => count + group.items.length, 0);
}

export function formatMoney(value, currency = 'CAD') {
  const amount = Number(value) || 0;
  try {
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  } catch (_) {
    return `$${Math.round(amount).toLocaleString()}`;
  }
}

export function riskTone(score) {
  if (score >= 55) return 'coral';
  if (score >= 30) return 'amber';
  return 'mint';
}

export function riskLabel(score) {
  if (score >= 55) return 'High risk';
  if (score >= 30) return 'Moderate risk';
  return 'Low risk';
}
