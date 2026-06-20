import { Cleanroom, Batch, AuditEvent, CleanroomParameter, SafeTimeCountdown } from '@/types/envyris';

const createParameter = (
  id: string,
  name: string,
  type: CleanroomParameter['type'],
  sensorValue: number,
  dduValue: number,
  manualValue: number,
  min: number,
  max: number,
  unit: string
): CleanroomParameter => {
  const values = [sensorValue, dduValue, manualValue];
  const avg = values.reduce((a, b) => a + b, 0) / 3;
  const maxDiff = Math.max(...values.map(v => Math.abs(v - avg)));
  const alignmentScore = Math.max(0, 100 - (maxDiff / avg) * 500);
  
  const inRange = sensorValue >= min && sensorValue <= max;
  
  return {
    id,
    name,
    type,
    tripleSource: {
      sensor: { value: sensorValue, unit, timestamp: new Date(), source: 'sensor', isValid: true },
      ddu: { value: dduValue, unit, timestamp: new Date(), source: 'ddu', isValid: true },
      manual: { value: manualValue, unit, timestamp: new Date(Date.now() - 1800000), source: 'manual', isValid: true },
    alignmentScore,
      lastVerified: new Date(),
    },
    limits: { min, max, unit },
    status: alignmentScore < 70 ? 'warning' : inRange ? 'normal' : 'critical',
  };
};

const createSafeTime = (minutes: number, confidence: number, risk: string[]): SafeTimeCountdown => ({
  remainingMinutes: minutes,
  totalMinutes: 480,
  confidenceLevel: confidence,
  riskFactors: risk,
  recommendation: minutes > 120 ? 'continue' : minutes > 30 ? 'restrict' : 'stop',
});

export const mockCleanrooms: Cleanroom[] = [
  {
    id: 'CR-A01',
    name: 'Filling Suite A',
    grade: 'A',
    status: 'normal',
    confidenceScore: 94,
    parameters: [
      createParameter('temp-a01', 'Temperature', 'temperature', 20.2, 20.3, 20.1, 18, 22, '°C'),
      createParameter('rh-a01', 'Humidity', 'humidity', 45.5, 45.8, 45.2, 40, 60, '%RH'),
      createParameter('dp-a01', 'Differential Pressure', 'pressure', 15.2, 15.0, 15.1, 10, 20, 'Pa'),
      createParameter('pc-a01', 'Particles ≥0.5µm', 'particles', 2800, 2750, 2900, 0, 3520, '/m³'),
    ],
    safeTime: createSafeTime(342, 92, ['Slight humidity fluctuation detected']),
    activeBatches: ['BTH-2024-001', 'BTH-2024-002'],
    lastAuditHash: '0x8f4d...3a2b',
  },
  {
    id: 'CR-A02',
    name: 'Filling Suite B',
    grade: 'A',
    status: 'warning',
    confidenceScore: 78,
    parameters: [
      createParameter('temp-a02', 'Temperature', 'temperature', 21.8, 22.1, 21.5, 18, 22, '°C'),
      createParameter('rh-a02', 'Humidity', 'humidity', 52.1, 54.3, 51.8, 40, 60, '%RH'),
      createParameter('dp-a02', 'Differential Pressure', 'pressure', 14.8, 13.9, 14.5, 10, 20, 'Pa'),
      createParameter('pc-a02', 'Particles ≥0.5µm', 'particles', 3100, 3250, 3050, 0, 3520, '/m³'),
    ],
    safeTime: createSafeTime(156, 71, ['Temperature trending high', 'DDU/Sensor mismatch on RH']),
    activeBatches: ['BTH-2024-003'],
    lastAuditHash: '0x2c9e...8f1d',
  },
  {
    id: 'CR-B01',
    name: 'Prep Room North',
    grade: 'B',
    status: 'normal',
    confidenceScore: 97,
    parameters: [
      createParameter('temp-b01', 'Temperature', 'temperature', 20.5, 20.6, 20.4, 18, 25, '°C'),
      createParameter('rh-b01', 'Humidity', 'humidity', 48.2, 48.0, 48.5, 35, 65, '%RH'),
      createParameter('dp-b01', 'Differential Pressure', 'pressure', 12.5, 12.4, 12.6, 5, 15, 'Pa'),
      createParameter('pc-b01', 'Particles ≥0.5µm', 'particles', 285000, 282000, 290000, 0, 352000, '/m³'),
    ],
    safeTime: createSafeTime(420, 96, []),
    activeBatches: [],
    lastAuditHash: '0x5a1b...7c4e',
  },
  {
    id: 'CR-B02',
    name: 'Prep Room South',
    grade: 'B',
    status: 'critical',
    confidenceScore: 45,
    parameters: [
      createParameter('temp-b02', 'Temperature', 'temperature', 23.5, 21.2, 22.8, 18, 25, '°C'),
      createParameter('rh-b02', 'Humidity', 'humidity', 58.9, 52.1, 55.5, 35, 65, '%RH'),
      createParameter('dp-b02', 'Differential Pressure', 'pressure', 8.2, 11.5, 9.8, 5, 15, 'Pa'),
      createParameter('pc-b02', 'Particles ≥0.5µm', 'particles', 380000, 345000, 362000, 0, 352000, '/m³'),
    ],
    safeTime: createSafeTime(28, 38, ['Particle count exceedance', 'Significant source disagreement', 'Pressure cascade compromised']),
    activeBatches: ['BTH-2024-004'],
    lastAuditHash: '0x9d3f...1a8c',
  },
  {
    id: 'CR-C01',
    name: 'Material Airlock',
    grade: 'C',
    status: 'normal',
    confidenceScore: 89,
    parameters: [
      createParameter('temp-c01', 'Temperature', 'temperature', 21.0, 21.2, 20.8, 15, 28, '°C'),
      createParameter('rh-c01', 'Humidity', 'humidity', 50.5, 50.8, 50.2, 30, 70, '%RH'),
      createParameter('dp-c01', 'Differential Pressure', 'pressure', 8.5, 8.3, 8.6, 5, 15, 'Pa'),
    ],
    safeTime: createSafeTime(480, 89, []),
    activeBatches: [],
    lastAuditHash: '0x1e7a...4b9d',
  },
  {
    id: 'CR-D01',
    name: 'Component Storage',
    grade: 'D',
    status: 'normal',
    confidenceScore: 91,
    parameters: [
      createParameter('temp-d01', 'Temperature', 'temperature', 22.5, 22.3, 22.7, 15, 30, '°C'),
      createParameter('rh-d01', 'Humidity', 'humidity', 42.0, 42.5, 41.8, 25, 75, '%RH'),
    ],
    safeTime: createSafeTime(480, 91, []),
    activeBatches: [],
    lastAuditHash: '0x4c2d...6f3a',
  },
];

export const mockBatches: Batch[] = [
  {
    id: 'BTH-2024-001',
    productName: 'Sterile Injectable Solution',
    lotNumber: 'LOT-SI-2024-001',
    status: 'in-progress',
    cleanroomId: 'CR-A01',
    exposureMinutes: 145,
    riskLevel: 'low',
    gmpCompliant: true,
  },
  {
    id: 'BTH-2024-002',
    productName: 'Lyophilized Powder',
    lotNumber: 'LOT-LP-2024-002',
    status: 'in-progress',
    cleanroomId: 'CR-A01',
    exposureMinutes: 89,
    riskLevel: 'low',
    gmpCompliant: true,
  },
  {
    id: 'BTH-2024-003',
    productName: 'Ophthalmic Solution',
    lotNumber: 'LOT-OS-2024-003',
    status: 'hold',
    cleanroomId: 'CR-A02',
    exposureMinutes: 210,
    riskLevel: 'medium',
    gmpCompliant: false,
  },
  {
    id: 'BTH-2024-004',
    productName: 'Parenteral Nutrition',
    lotNumber: 'LOT-PN-2024-004',
    status: 'quarantine',
    cleanroomId: 'CR-B02',
    exposureMinutes: 315,
    riskLevel: 'high',
    gmpCompliant: false,
  },
];

export const mockAuditEvents: AuditEvent[] = [
  {
    id: 'AE-001',
    timestamp: new Date(Date.now() - 60000),
    type: 'reading',
    actor: 'SENSOR-A01-TEMP',
    action: 'Environmental reading recorded',
    details: { parameter: 'Temperature', value: 20.2, unit: '°C', room: 'CR-A01' },
    blockchainHash: '0x8f4d7e2a1b3c5d6f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
    previousHash: '0x7e3c6b1a0d9f8e7c6b5a4d3c2b1a0f9e8d7c6b5a4d3c2b1a0f9e8d7c6b5a4d3c2b1a',
  },
  {
    id: 'AE-002',
    timestamp: new Date(Date.now() - 120000),
    type: 'verification',
    actor: 'QA-TECH-Johnson',
    action: 'Triple-source verification completed',
    details: { room: 'CR-A01', alignmentScore: 94, verificationMethod: 'Manual crosscheck' },
    blockchainHash: '0x2c9e5f8a1b4d7e0c3f6a9b2d5e8c1f4a7b0d3e6c9f2a5b8d1e4c7f0a3b6d9e2c5f8a',
    previousHash: '0x8f4d7e2a1b3c5d6f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
  },
  {
    id: 'AE-003',
    timestamp: new Date(Date.now() - 300000),
    type: 'alert',
    actor: 'SYSTEM',
    action: 'Safe-time warning triggered',
    details: { room: 'CR-A02', remainingMinutes: 156, threshold: 180, severity: 'warning' },
    blockchainHash: '0x5a1b8c2d9e0f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d',
    previousHash: '0x2c9e5f8a1b4d7e0c3f6a9b2d5e8c1f4a7b0d3e6c9f2a5b8d1e4c7f0a3b6d9e2c5f8a',
  },
  {
    id: 'AE-004',
    timestamp: new Date(Date.now() - 600000),
    type: 'decision',
    actor: 'QA-MGR-Williams',
    action: 'Batch placed on hold',
    details: { batchId: 'BTH-2024-003', reason: 'Environmental uncertainty', review: 'Pending investigation' },
    blockchainHash: '0x9d3f1a8c2b4e5f6d7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    previousHash: '0x5a1b8c2d9e0f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d',
  },
  {
    id: 'AE-005',
    timestamp: new Date(Date.now() - 900000),
    type: 'crisis-mode',
    actor: 'SYSTEM',
    action: 'EMS anomaly detected',
    details: { affectedSystems: ['SCADA-Main', 'Historian'], severity: 'critical', autoResponse: 'Backup mode initiated' },
    blockchainHash: '0x1e7a4b9d2c5f8a0b3d6e9f1c4a7b0d3e6c9f2a5b8d1e4c7f0a3b6d9e2c5f8a1b4d7e',
    previousHash: '0x9d3f1a8c2b4e5f6d7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
  },
];
