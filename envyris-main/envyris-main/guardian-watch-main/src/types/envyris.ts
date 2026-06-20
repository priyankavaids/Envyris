export type SystemStatus = 'normal' | 'warning' | 'critical' | 'crisis';
export type CleanroomGrade = 'A' | 'B' | 'C' | 'D';

export interface EnvironmentalReading {
  value: number;
  unit: string;
  timestamp: Date;
  source: 'sensor' | 'ddu' | 'manual';
  isValid: boolean;
}

export interface TripleSourceData {
  sensor: EnvironmentalReading | null;
  ddu: EnvironmentalReading | null;
  manual: EnvironmentalReading | null;
  alignmentScore: number; // 0-100
  lastVerified: Date;
}

export interface CleanroomParameter {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'pressure' | 'particles' | 'microbiology';
  tripleSource: TripleSourceData;
  limits: {
    min: number;
    max: number;
    unit: string;
  };
  status: SystemStatus;
}

export interface SafeTimeCountdown {
  remainingMinutes: number;
  totalMinutes: number;
  confidenceLevel: number; // 0-100
  riskFactors: string[];
  recommendation: 'continue' | 'restrict' | 'stop';
}

export interface Cleanroom {
  id: string;
  name: string;
  grade: CleanroomGrade;
  status: SystemStatus;
  confidenceScore: number; // 0-100
  parameters: CleanroomParameter[];
  safeTime: SafeTimeCountdown;
  activeBatches: string[];
  lastAuditHash: string;
}

export interface Batch {
  id: string;
  productName: string;
  lotNumber: string;
  status: 'in-progress' | 'hold' | 'released' | 'quarantine';
  cleanroomId: string;
  exposureMinutes: number;
  riskLevel: 'low' | 'medium' | 'high';
  gmpCompliant: boolean;
}

export interface AuditEvent {
  id: string;
  timestamp: Date;
  type: 'reading' | 'decision' | 'verification' | 'alert' | 'crisis-mode';
  actor: string;
  action: string;
  details: Record<string, unknown>;
  blockchainHash: string;
  previousHash: string;
}

export interface CrisisState {
  isActive: boolean;
  activatedAt: Date | null;
  activatedBy: string | null;
  reason: string | null;
  affectedRooms: string[];
  batchesOnHold: string[];
}
