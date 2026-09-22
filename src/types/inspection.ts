export interface Inspection {
  id: string;
  vehicleId: string;
  userId: string;
  status: InspectionStatus;
  riskScore?: number;
  riskLevel?: RiskLevel;
  findings: Finding[];
  totalRepairLow?: number;
  totalRepairHigh?: number;
  suggestedPrice?: number;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  synced: boolean;
}

export type InspectionStatus =
  | 'draft'
  | 'in_progress'
  | 'ai_processing'
  | 'reviewing'
  | 'complete';

export type RiskLevel = 'low' | 'moderate' | 'elevated' | 'high';

export type Severity = 'cosmetic' | 'minor' | 'moderate' | 'major' | 'critical';

export interface Finding {
  id: string;
  inspectionId: string;
  category: FindingCategory;
  subcategory?: string;
  title: string;
  description?: string;
  severity: Severity;
  confidence: number;
  source: 'manual' | 'ai_photo' | 'ai_video' | 'ai_voice' | 'document';
  location?: string;
  estimatedCostLow?: number;
  estimatedCostHigh?: number;
  evidenceIds: string[];
  status: 'open' | 'confirmed' | 'dismissed' | 'resolved';
  reviewedByUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export type FindingCategory =
  | 'exterior'
  | 'interior'
  | 'engine'
  | 'transmission'
  | 'tires'
  | 'brakes'
  | 'electrical'
  | 'suspension'
  | 'test_drive'
  | 'documentation';

export interface Evidence {
  id: string;
  inspectionId: string;
  findingId?: string;
  type: EvidenceType;
  uri: string;
  thumbnailUri?: string;
  remoteUrl?: string;
  caption?: string;
  transcript?: string;
  metadata?: EvidenceMetadata;
  createdAt: string;
  uploadedAt?: string;
  synced: boolean;
}

export type EvidenceType = 'photo' | 'video' | 'voice' | 'document' | 'note';

export interface EvidenceMetadata {
  width?: number;
  height?: number;
  duration?: number;
  fileSize?: number;
  mimeType?: string;
  capturedAt?: string;
  exif?: Record<string, unknown>;
  annotations?: Annotation[];
}

export interface Annotation {
  id: string;
  label: string;
  severity: Severity;
  confidence: number;
  boundingBox: BoundingBox;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
