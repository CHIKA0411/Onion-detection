export interface Language {
  id: string;
  name: string;
  nativeName: string;
  script: string;
  isConstitutional: boolean;
  sampleGreeting: string;
}

export interface InspectorProfile {
  inspectorId: string;
  name: string;
  designation: string;
  centerId: string;
  centerName: string;
  district: string;
  state: string;
  mobile: string;
  isKycVerified: boolean;
  modelLoaded: string;
}

export type OnionCondition = 'grade_a' | 'damaged' | 'rotten' | 'sprouted' | 'undersized';

export interface DetectedOnion {
  id: string;
  onionIndex: number;
  condition: OnionCondition;
  confidence: number; // 0-100%
  diameterMm: number;
  weightGrams?: number;
  bbox: { x: number; y: number; width: number; height: number }; // Percentage coords
  cropImageUrl?: string; // Base64 data URL of the cropped individual onion
  maskColor: string;
  isOverridden?: boolean;
  originalCondition?: OnionCondition;
  overrideReason?: string;
  overrideTimestamp?: string;
  overrideInspectorId?: string;
  defectDetails?: string;
}

export interface LotScan {
  id: string;
  lotNumber: string;
  procurementCenter: string;
  centerId: string;
  inspectorId: string;
  inspectorName: string;
  timestamp: string;
  scanMode: 'single' | 'batch_tray' | 'full_crate' | 'auto';
  totalOnions: number;
  gradeACount: number;
  gradeAPercentage: number;
  ursCount: number; // Undersized + Rotten + Sprouted
  ursPercentage: number;
  defectBreakdown: {
    gradeA: number;
    damaged: number;
    rotten: number;
    sprouted: number;
    undersized: number;
  };
  items: DetectedOnion[];
  overallGrade: 'GRADE A ACCEPTED' | 'REJECTED - HIGH DEFECT' | 'REQUIRES MANUAL REVIEW';
  syncStatus: 'synced' | 'pending_sync' | 'sync_failed';
  isFinalized: boolean;
  hasOverrides: boolean;
  comments?: string;
  imageUrl: string;
  annotatedImageUrl?: string;
}

export interface GradingRules {
  ruleVersion: string;
  centerId: string;
  centerName: string;
  gradeAMinPercentage: number; // e.g. 75%
  ursMaxPercentage: number; // e.g. 15%
  undersizedMaxDiameterMm: number; // e.g. 35mm
  rotMaxThresholdPercentage: number; // e.g. 5%
  sproutMaxThresholdPercentage: number; // e.g. 8%
  lastUpdated: string;
  updatedBy: string;
}

export interface AuditLogEntry {
  id: string;
  lotId: string;
  lotNumber: string;
  timestamp: string;
  inspectorId: string;
  inspectorName: string;
  actionType: 'LOT_SCANNED' | 'CLASSIFICATION_OVERRIDDEN' | 'RULES_UPDATED' | 'LOT_FINALIZED' | 'LOT_SYNCED';
  details: string;
  previousValue?: string;
  newValue?: string;
  onionId?: string;
}

export interface SyncQueueItem {
  id: string;
  lotId: string;
  lotNumber: string;
  timestamp: string;
  totalOnions: number;
  gradeAPercentage: number;
  syncStatus: 'queued' | 'syncing' | 'failed' | 'synced';
  retryCount: number;
  fileSizeBytes: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'review_pending' | 'sync_alert' | 'policy_update';
  read: boolean;
  lotId?: string;
}
