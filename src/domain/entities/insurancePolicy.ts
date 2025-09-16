export type InsuranceType = 'car' | 'van' | 'motorbike' | 'house';

export interface Reminder {
  id: string;
  type: 'renewal' | 'payment' | 'custom';
  title: string;
  dueAt: string;      // ISO
  scheduledNotificationId?: string; // expo-notifications identifier
}

export interface InsurancePolicy {
  id: string;
  type: InsuranceType;
  provider: string;
  policyNumber: string;
  startDate: string;
  endDate: string;
  premium: number;
  coverage: Record<string, unknown>;
  documents: string[]; // Document IDs (normalized)
  reminders: string[]; // Reminder IDs (normalized)
  lastModified?: number; // timestamp
}

// Helper to set/update lastModified whenever policy changes
export function withTimestamp(policy: Omit<InsurancePolicy, "lastModified">): InsurancePolicy {
  return { ...policy, lastModified: Date.now() };
}
