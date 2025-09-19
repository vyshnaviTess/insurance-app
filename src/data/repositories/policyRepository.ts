// src/data/repositories/policyRepository.ts
import { ApiClient } from "../api/client";
import { RemoteRepository } from "./remoteRepository";
import { InsurancePolicy } from "../../domain/entities/insurancePolicy";
import { PolicyDTO, policyMapper } from "../mappers/policyMapper";

export interface PolicyRepository {
  list(): Promise<InsurancePolicy[]>;
  create(p: InsurancePolicy): Promise<InsurancePolicy>;
  update(p: InsurancePolicy): Promise<InsurancePolicy>;
  remove(id: string): Promise<void>;
}
export class RemotePolicyRepository extends RemoteRepository<InsurancePolicy, PolicyDTO> {
  constructor(client: ApiClient) {
    super(client, "/policies", policyMapper);
  }
  async updateDocumentRef(policyId: string, documentId: string): Promise<InsurancePolicy> {
    // fetch existing policy
    const policy = await this.get(policyId);
    const updated = { ...policy, documents: [...policy.documents, documentId] };
    return this.update(updated);
  }
}