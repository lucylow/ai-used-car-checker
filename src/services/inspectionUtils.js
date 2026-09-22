export function createNewInspectionState() {
  return {
    vehicle: {
      vin: '',
      year: '',
      make: '',
      model: '',
      trim: '',
      mileage: 0,
      askingPrice: 0,
      marketValue: 0,
    },
    issues: [],
    checklist: {},
    photos: [],
    notes: [],
  };
}

export function getDerivedInspectionResetState() {
  return createNewInspectionState();
}

export function getNewInspectionTransientResetState() {
  return {
    editingIssue: null,
    formError: '',
    customFindingDraft: null,
    issueDraft: null,
  };
}

export function isSameIssue(a, b) {
  if (!a || !b) return false;
  return String(a.id ?? a.name ?? '') === String(b.id ?? b.name ?? '');
}

export function normalizeActiveInspection(value) {
  if (!value || typeof value !== 'object') return createNewInspectionState();
  return {
    ...createNewInspectionState(),
    ...value,
    vehicle: { ...createNewInspectionState().vehicle, ...(value.vehicle || {}) },
    issues: Array.isArray(value.issues) ? value.issues : [],
    checklist: value.checklist || {},
    photos: Array.isArray(value.photos) ? value.photos : [],
  };
}
