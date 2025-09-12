export type InsuranceType = 'car' | 'van' | 'motorbike' | 'house';

export interface Document {
  id: string;
  uri: string;        // local file:// or remote https://
  name: string;
  category: 'policy' | 'receipt' | 'id' | 'other';
  createdAt: string;  // ISO
  size?: number;
  mime?: string;
}

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
}
