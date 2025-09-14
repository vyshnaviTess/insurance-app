export interface Document {
  id: string;
  uri: string; // file:// or https://
  name: string;
  category: "policy" | "receipt" | "id" | "other";
  createdAt: string; // ISO
  size?: number;
  mime?: string;
}