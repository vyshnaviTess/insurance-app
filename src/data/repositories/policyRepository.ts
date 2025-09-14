import { ApiClient } from '../api/client';
import type { InsurancePolicy } from '../../domain/entities/insurancePolicy';
import { PolicyDTO, fromDTO, toDTO } from '../mappers/policyMapper';


export interface PolicyRepository {
  list(): Promise<InsurancePolicy[]>;
  create(p: InsurancePolicy): Promise<InsurancePolicy>;
  update(p: InsurancePolicy): Promise<InsurancePolicy>;
  remove(id: string): Promise<void>;
}

export class RemotePolicyRepository implements PolicyRepository {
  constructor(private api: ApiClient) {}
  async list() {
    const dtos = await this.api.get<PolicyDTO[]>('/policies');
    return dtos.map(fromDTO);
  }
  async create(p: InsurancePolicy) {
    const dto = await this.api.post<PolicyDTO>('/policies', toDTO(p));
    return fromDTO(dto);
  }
  async update(p: InsurancePolicy) {
    const dto = await this.api.put<PolicyDTO>(`/policies/${p.id}`, toDTO(p));
    return fromDTO(dto);
  }
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
