import { ApiClient } from '../api/client';
import type { InsurancePolicy } from '../../domain/entities/insurancePolicy';

export interface PolicyRepository {
  list(): Promise<InsurancePolicy[]>;
  create(p: InsurancePolicy): Promise<InsurancePolicy>;
  update(p: InsurancePolicy): Promise<InsurancePolicy>;
  remove(id: string): Promise<void>;
}

export class RemotePolicyRepository implements PolicyRepository {
  constructor(private api: ApiClient) {}
  list() { return this.api.get<InsurancePolicy[]>('/policies'); }
  create(p: InsurancePolicy) { return this.api.post<InsurancePolicy>('/policies', p); }
  update(p: InsurancePolicy) { return this.api.put<InsurancePolicy>(`/policies/${p.id}`, p); }
  remove(id: string) { return this.api.delete<void>(`/policies/${id}`); }
}

//TODO
/** Simple local mirror (could be replaced with SQLite for a real app) "not used so far" */ 
export class LocalPolicyRepository implements PolicyRepository {
  private store = new Map<string, InsurancePolicy>();
  async list() { return Array.from(this.store.values()); }
  async create(p: InsurancePolicy) { this.store.set(p.id, p); return p; }
  async update(p: InsurancePolicy) { this.store.set(p.id, p); return p; }
  async remove(id: string) { this.store.delete(id); }
}
